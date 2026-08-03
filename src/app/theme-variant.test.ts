import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { cleanup, render, screen } from '@testing-library/react';
import postcss from 'postcss';
import React from 'react';
import { compile } from 'tailwindcss';
import { beforeAll, describe, expect, it } from 'vitest';

import { ThemeToggle } from '@/components/ThemeToggle';
import { THEME_ATTRIBUTE } from '@/lib/theme';

/**
 * The no-JavaScript half of the theme check.
 *
 * `ThemeToggle.test.tsx` covers everything that happens once the component's
 * JavaScript runs. It structurally cannot cover the case this file exists for:
 * JavaScript disabled, OS preference dark, `data-theme` therefore never set.
 * In that state the colour tokens go dark from the media query in
 * `globals.css`, and the toggle's icon has to follow them. It previously did
 * not, because the `dark:` variant keyed on the attribute alone — so the sun
 * showed over a dark page.
 *
 * jsdom cannot answer this on its own: it applies no Tailwind stylesheet and
 * evaluates no media query, so `getComputedStyle` on a rendered `<svg>` returns
 * the same thing in every scenario. A test written that way would pass whether
 * or not the bug is present. Asserting on the CSS text ("the output contains
 * `prefers-color-scheme`") is the same trap one level up — it passes on a media
 * block that resolves the wrong way.
 *
 * So this file resolves the cascade itself:
 *
 *   1. Compile the real `globals.css` with the real Tailwind compiler, using
 *      the class strings taken off the really-rendered component.
 *   2. Read every `display` declaration out of the compiled CSS, in order,
 *      recording whether it sits inside `@media (prefers-color-scheme: dark)`.
 *   3. For each of the four (attribute x OS preference) states, keep the rules
 *      whose media condition holds and whose selector matches the icon element
 *      — matched by jsdom against a real `<html>`-rooted tree, not by string
 *      comparison — and take the last one. Last-wins is the correct rule here
 *      because every selector involved is a single class plus `:where()`, which
 *      contributes no specificity, and all of them land in `@layer utilities`.
 */

const HERE = path.dirname(fileURLToPath(import.meta.url));
const GLOBALS_CSS = path.join(HERE, 'globals.css');
const NODE_MODULES = path.join(HERE, '..', '..', 'node_modules');

interface DisplayRule {
  selectors: string[];
  /** True when the rule only applies under an OS dark preference. */
  prefersDark: boolean;
  value: string;
}

/**
 * Resolve `@import` the way the build does: bare specifiers from
 * `node_modules`, relative ones against the importing file.
 */
async function loadStylesheet(id: string, base: string) {
  const resolved = id.startsWith('.')
    ? path.resolve(base, id)
    : path.join(NODE_MODULES, id, 'index.css');

  return {
    path: resolved,
    base: path.dirname(resolved),
    content: await readFile(resolved, 'utf8'),
  };
}

async function compileGlobals(candidates: string[]): Promise<string> {
  const compiler = await compile(await readFile(GLOBALS_CSS, 'utf8'), {
    base: HERE,
    loadStylesheet,
  });
  return compiler.build(candidates);
}

/** Every `display` declaration in the sheet, in source order. */
function collectDisplayRules(css: string): DisplayRule[] {
  const rules: DisplayRule[] = [];

  postcss.parse(css).walkDecls('display', (decl) => {
    const rule = decl.parent;
    if (rule?.type !== 'rule') return;

    let prefersDark = false;
    // Walk every ancestor looking for a `prefers-color-scheme: dark` media
    // wrapper. `.parent` widens as it climbs — postcss's Document sits above
    // Root and holds Roots rather than ChildNodes, so it is not assignable to
    // Container. `instanceof AtRule` narrows to the one node type that actually
    // has `name`/`params`, which a `.type === 'atrule'` string check cannot do
    // across that widened union.
    let node: postcss.Node | undefined = rule.parent;
    for (; node; node = node.parent) {
      if (
        node instanceof postcss.AtRule &&
        node.name === 'media' &&
        node.params.includes('prefers-color-scheme: dark')
      ) {
        prefersDark = true;
      }
    }

    rules.push({ selectors: rule.selectors, prefersDark, value: decl.value });
  });

  return rules;
}

/** The winning `display` for `element` in a given state. */
function resolveDisplay(
  rules: DisplayRule[],
  element: Element,
  osPrefersDark: boolean,
): string | undefined {
  let winner: string | undefined;

  for (const rule of rules) {
    if (rule.prefersDark && !osPrefersDark) continue;
    if (rule.selectors.some((selector) => element.matches(selector))) {
      winner = rule.value;
    }
  }

  return winner;
}

let rules: DisplayRule[];
let sunClass: string;
let moonClass: string;

beforeAll(async () => {
  // `matchMedia` is consulted only for the button's accessible name; the icons
  // are pure CSS. Stubbed because jsdom's own implementation is a stub.
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  });

  // Render the real component rather than restating its markup, so the classes
  // under test cannot drift from the ones that ship.
  render(React.createElement(ThemeToggle));
  sunClass = screen.getByTestId('theme-toggle-icon-sun').getAttribute('class')!;
  moonClass = screen
    .getByTestId('theme-toggle-icon-moon')
    .getAttribute('class')!;
  cleanup();

  rules = collectDisplayRules(
    await compileGlobals(
      [...sunClass.split(/\s+/), ...moonClass.split(/\s+/)].filter(Boolean),
    ),
  );
});

/**
 * A fresh `<html>`-rooted tree in the requested theme state.
 *
 * Built per scenario rather than reused, because the variant selectors are
 * descendant selectors rooted at `<html>` — an element that has been detached
 * (which is what Testing Library's cleanup does to a rendered tree) silently
 * matches none of them, which would quietly turn every assertion here into a
 * check of the wrong thing.
 */
function mountIcons(attribute: 'dark' | 'light' | null) {
  if (attribute === null) {
    document.documentElement.removeAttribute(THEME_ATTRIBUTE);
  } else {
    document.documentElement.setAttribute(THEME_ATTRIBUTE, attribute);
  }

  document.body.innerHTML = `
    <button type="button">
      <svg class="${sunClass}" data-icon="sun"></svg>
      <svg class="${moonClass}" data-icon="moon"></svg>
    </button>
  `;

  const sun = document.querySelector('[data-icon="sun"]')!;
  const moon = document.querySelector('[data-icon="moon"]')!;

  // Guards against the detached-tree failure mode described above.
  expect(document.documentElement.contains(sun)).toBe(true);

  return { sun, moon };
}

/** Which glyph a visitor actually sees. */
function visibleIcon(
  attribute: 'dark' | 'light' | null,
  osPrefersDark: boolean,
): 'sun' | 'moon' | 'both' | 'neither' {
  const { sun, moon } = mountIcons(attribute);

  const sunShown = resolveDisplay(rules, sun, osPrefersDark) !== 'none';
  const moonShown = resolveDisplay(rules, moon, osPrefersDark) !== 'none';

  if (sunShown && moonShown) return 'both';
  if (sunShown) return 'sun';
  if (moonShown) return 'moon';
  return 'neither';
}

describe('the `dark:` variant, resolved from compiled CSS', () => {
  it('compiles rules for these classes in both branches', () => {
    // Guards the whole file against passing vacuously — if the compile step
    // produced nothing for these candidates, every scenario below would agree
    // on "sun" and the suite would look green.
    expect(sunClass).toContain('dark:hidden');
    expect(moonClass).toContain('dark:block');
    expect(
      rules.filter((rule) => rule.selectors.join().includes('dark\\:')),
    ).toHaveLength(4);
    expect(rules.some((rule) => rule.prefersDark)).toBe(true);
  });

  describe('with JavaScript disabled — no `data-theme` is ever set', () => {
    // The regression this file exists for. An attribute-only `dark:` variant
    // leaves the sun showing over a page the tokens have already painted dark.
    it('shows the moon when the OS prefers dark', () => {
      expect(visibleIcon(null, true)).toBe('moon');
    });

    it('shows the sun when the OS prefers light', () => {
      expect(visibleIcon(null, false)).toBe('sun');
    });
  });

  describe('an explicit override beats the OS preference in both directions', () => {
    it('shows the sun for `data-theme="light"` under an OS dark preference', () => {
      expect(visibleIcon('light', true)).toBe('sun');
    });

    it('shows the moon for `data-theme="dark"` under an OS light preference', () => {
      expect(visibleIcon('dark', false)).toBe('moon');
    });

    it('agrees with the OS preference when the two already match', () => {
      expect(visibleIcon('dark', true)).toBe('moon');
      expect(visibleIcon('light', false)).toBe('sun');
    });
  });
});
