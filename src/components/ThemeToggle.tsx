'use client';

import { useSyncExternalStore } from 'react';

import { oppositeTheme } from '@/lib/theme';
import {
  getServerThemeSnapshot,
  getThemeSnapshot,
  setTheme,
  subscribeToTheme,
} from '@/lib/theme-store';

/**
 * Light/dark switch — the only client component on this site.
 *
 * Every other component is a pure server component (`components.md`), which is
 * what keeps the client bundle small enough for the Performance >=90 budget.
 *
 * ## Why the theme is read from a store, and why it can be `null`
 *
 * The pre-hydration script in `layout.tsx` has already set `data-theme` on
 * `<html>` before React runs, so the correct colours are painted immediately.
 * But the server-rendered HTML cannot know which theme that was — the markup
 * is built once at build time and served to everyone.
 *
 * Rendering a guessed `aria-pressed` / `aria-label` into that HTML would
 * produce a hydration mismatch on every visitor whose theme differs from the
 * guess. So the server snapshot is `null` ("not yet known"), which renders a
 * generic label, and the client snapshot — the real theme — takes over
 * immediately after hydration. See `@/lib/theme-store`.
 *
 * The button is fully operable in that window; only its label is generic. The
 * icons are not state-driven at all: both are in the DOM and CSS shows one, so
 * the visible glyph is correct from first paint regardless of hydration.
 */
export function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  const known = theme !== null;
  const current = theme ?? 'light';

  function handleToggle() {
    setTheme(oppositeTheme(getThemeSnapshot() ?? current));
  }

  const label = known
    ? `Switch to ${oppositeTheme(current)} theme`
    : 'Switch colour theme';

  return (
    <button
      type="button"
      onClick={handleToggle}
      // `aria-pressed` describes the dark-theme state: pressed means dark is on.
      aria-pressed={known ? current === 'dark' : false}
      aria-label={label}
      title={label}
      data-testid="theme-toggle"
      data-theme-state={known ? current : 'unknown'}
      // min-h/min-w keep the tappable area at 44x44 on mobile, per
      // `accessibility-checklist.md`'s touch-target item.
      className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-md border border-border text-text-primary transition-none hover:bg-surface"
    >
      <SunIcon />
      <MoonIcon />
    </button>
  );
}

/*
 * Icon visibility is CSS-driven off the `dark:` variant, which resolves from
 * the same two inputs as the colour tokens — the `data-theme` attribute first,
 * the OS `prefers-color-scheme` second (see the variant definition in
 * `globals.css`). That is what keeps the glyph correct before hydration *and*
 * with JavaScript disabled entirely: in the no-JS case no attribute is ever
 * set, the tokens paint from the media query, and the icon follows the same
 * media query rather than desyncing to the light glyph over a dark page.
 *
 * `aria-hidden` on both: the button's `aria-label` already carries the
 * accessible name, and announcing "sun" adds nothing.
 *
 * `currentColor` inherits the button's text colour, which is a themed token —
 * that is what holds the 3:1 contrast requirement in both themes.
 */

const ICON_BASE = 'size-5';
// Shown when dark is active (the button will switch you back to light).
const SHOW_IN_DARK = `${ICON_BASE} hidden dark:block`;
// Shown otherwise.
const SHOW_IN_LIGHT = `${ICON_BASE} block dark:hidden`;

function SunIcon() {
  return (
    <svg
      className={SHOW_IN_LIGHT}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
      data-testid="theme-toggle-icon-sun"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      className={SHOW_IN_DARK}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      data-testid="theme-toggle-icon-moon"
    >
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
    </svg>
  );
}
