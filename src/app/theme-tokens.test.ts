import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import postcss from 'postcss';
import { beforeAll, describe, expect, it } from 'vitest';

import { THEME_ATTRIBUTE } from '@/lib/theme';

/**
 * The token-parity guard.
 *
 * `globals.css` declares every themed value three times: once in `:root` for
 * light, once inside `@media (prefers-color-scheme: dark)` for the OS
 * preference, and once under `[data-theme='dark']` for the explicit override.
 *
 * The duplication is deliberate — collapsing the two dark blocks needs
 * `light-dark()`, which is Baseline mid-2024, and an older engine would leave
 * the token unset and render the page with no colours at all. But duplication
 * invites drift, and drift here is close to invisible: adding a token to
 * `:root` and forgetting one dark block produces text that disappears only in
 * that one theme path, which nothing else in the suite exercises.
 *
 * `theme-variant.test.ts` resolves the `dark:` *variant*. This file covers the
 * *token* layer underneath it, which that test never reads.
 *
 * Three properties, none of which any other test asserts:
 *
 *   1. the two dark blocks declare an identical set of properties, with
 *      identical values;
 *   2. every `--token-*` in `:root` has a counterpart in both dark blocks;
 *   3. the explicit-override block appears after the media block in source
 *      order — the file calls this load-bearing, and until now nothing checked
 *      it. Equal specificity means source order alone decides whether an
 *      explicit override beats the OS preference.
 */

const HERE = path.dirname(fileURLToPath(import.meta.url));
const GLOBALS_CSS = path.join(HERE, 'globals.css');

const DARK_MEDIA = 'prefers-color-scheme: dark';
const OVERRIDE_SELECTOR = `:root[${THEME_ATTRIBUTE}='dark']`;

type Tokens = Map<string, string>;

interface Block {
  tokens: Tokens;
  /** Index of the rule in a depth-first walk, for source-order assertions. */
  order: number;
}

/** Every `--token-*` custom property declared directly on a rule. */
function tokensOf(rule: postcss.Rule): Tokens {
  const tokens: Tokens = new Map();
  rule.each((node) => {
    if (node.type === 'decl' && node.prop.startsWith('--token-')) {
      tokens.set(node.prop, node.value.trim());
    }
  });
  return tokens;
}

let light: Block | undefined;
let mediaDark: Block | undefined;
let overrideDark: Block | undefined;

beforeAll(async () => {
  const css = await readFile(GLOBALS_CSS, 'utf8');
  const root = postcss.parse(css, { from: GLOBALS_CSS });

  let order = 0;

  root.walkRules((rule) => {
    const index = order++;
    const tokens = tokensOf(rule);
    if (tokens.size === 0) return;

    // Ancestors decide which layer this rule belongs to.
    let insideDarkMedia = false;
    for (
      let node: postcss.Container | postcss.Document | undefined = rule.parent;
      node;
      node = node.parent
    ) {
      if (node instanceof postcss.AtRule && node.name === 'media') {
        if (node.params.includes(DARK_MEDIA)) insideDarkMedia = true;
      }
    }

    const selector = rule.selector.replace(/\s+/g, '');

    if (insideDarkMedia) {
      mediaDark = { tokens, order: index };
      return;
    }
    if (selector.includes(`[${THEME_ATTRIBUTE}='dark']`)) {
      overrideDark = { tokens, order: index };
      return;
    }
    if (selector === ':root') {
      // Merge, because `:root` is declared more than once in the file.
      light = {
        tokens: new Map([...(light?.tokens ?? []), ...tokens]),
        order: light?.order ?? index,
      };
    }
  });
});

describe('theme token parity', () => {
  it('finds all three token layers', () => {
    // Vacuity guard. Every assertion below is trivially true against an empty
    // map, so a rename that stopped the walk from matching would silently turn
    // this whole file green.
    expect(light?.tokens.size ?? 0).toBeGreaterThan(6);
    expect(mediaDark?.tokens.size ?? 0).toBeGreaterThan(6);
    expect(overrideDark?.tokens.size ?? 0).toBeGreaterThan(6);
  });

  it('declares identical properties and values in both dark blocks', () => {
    const media = mediaDark as Block;
    const override = overrideDark as Block;

    // Sorted entries, so the diff on failure names the offending property
    // rather than reporting "objects differ".
    const entries = (block: Block): [string, string][] =>
      [...block.tokens.entries()].sort(([a], [b]) => a.localeCompare(b));

    expect(entries(override)).toEqual(entries(media));
  });

  it('gives every light token a value in both dark blocks', () => {
    const lightKeys = [...(light as Block).tokens.keys()].sort();
    const missingFromMedia = lightKeys.filter(
      (key) => !(mediaDark as Block).tokens.has(key),
    );
    const missingFromOverride = lightKeys.filter(
      (key) => !(overrideDark as Block).tokens.has(key),
    );

    expect(missingFromMedia).toEqual([]);
    expect(missingFromOverride).toEqual([]);
  });

  it('introduces no dark-only token', () => {
    // The mirror of the previous test. A token defined only in the dark blocks
    // is unset in light, which resolves to an empty value rather than falling
    // back to anything sensible.
    const lightTokens = (light as Block).tokens;
    const darkOnly = [...(mediaDark as Block).tokens.keys()]
      .filter((key) => !lightTokens.has(key))
      .sort();

    expect(darkOnly).toEqual([]);
  });

  it('keeps the explicit override after the media block in source order', () => {
    // Both selectors carry specificity (0,2,0). Source order is the only thing
    // making `data-theme='dark'` beat a light OS preference, and vice versa.
    expect((overrideDark as Block).order).toBeGreaterThan(
      (mediaDark as Block).order,
    );
  });

  it('names the override block exactly as the theme attribute constant does', () => {
    // Guards against `theme.ts` and the stylesheet drifting apart — the
    // attribute name lives in TypeScript and is written by hand in CSS.
    expect(OVERRIDE_SELECTOR).toBe(":root[data-theme='dark']");
  });
});
