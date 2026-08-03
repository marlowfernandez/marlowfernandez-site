/**
 * Theme resolution and persistence.
 *
 * Implements the persistence logic confirmed at `refined-mockups` Q2:
 *
 *   1. First visit  -> resolve from `prefers-color-scheme`; no override exists.
 *   2. On toggle    -> flip the theme and write the explicit choice.
 *   3. Return visit -> a stored override wins over the OS preference; with no
 *                      override, track the OS preference again.
 *
 * ## On the silent catches below
 *
 * `construction.md` requires that errors be surfaced or logged rather than
 * swallowed. These two functions are a deliberate, specified exception, not an
 * oversight: `unit-of-work.md` and `component-methods.md` both state the
 * required behaviour explicitly — a read failure falls back to the OS
 * preference with no thrown error, and a write failure no-ops while leaving the
 * toggle working for the current page view.
 *
 * The rationale is that neither case is an error condition from the visitor's
 * point of view. `localStorage` throws in private-browsing modes and under
 * third-party-storage restrictions; a colour preference failing to persist is
 * not worth a console error on an otherwise healthy page, and there is no
 * runtime to report it to (static export, no telemetry — Feasibility Q6).
 * Every catch here is annotated with the condition it absorbs so this stays a
 * documented decision rather than a swallowed bug.
 */

export type Theme = 'light' | 'dark';

/** `localStorage` key holding the visitor's explicit override, if any. */
export const THEME_STORAGE_KEY = 'marlowfernandez-theme';

/** Attribute on `<html>` that `globals.css` keys its override rules off. */
export const THEME_ATTRIBUTE = 'data-theme';

const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)';

export function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark';
}

/** The opposite theme — what the toggle will switch to next. */
export function oppositeTheme(theme: Theme): Theme {
  return theme === 'dark' ? 'light' : 'dark';
}

/**
 * Reads the stored override.
 *
 * Returns `null` for "no override", which covers three distinct situations
 * that the caller has no reason to tell apart: nothing stored, a stored value
 * that is not a valid theme, and `localStorage` being unavailable or throwing.
 */
export function readStoredTheme(): Theme | null {
  try {
    const stored = globalThis.localStorage?.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : null;
  } catch {
    // localStorage access threw — private browsing, storage partitioning, or a
    // blocked-cookies setting. A missing override is not an error condition.
    return null;
  }
}

/**
 * Resolves the OS-level colour preference.
 *
 * Falls back to `'light'` when `matchMedia` is unavailable (older engines,
 * some test environments) — the same default `:root` carries in `globals.css`.
 */
export function resolveSystemTheme(): Theme {
  try {
    return globalThis.matchMedia?.(DARK_MEDIA_QUERY).matches ? 'dark' : 'light';
  } catch {
    // matchMedia threw or is absent. Light is the documented default.
    return 'light';
  }
}

/**
 * The theme to render on first paint: a stored override if one exists,
 * otherwise the OS preference.
 */
export function resolveInitialTheme(): Theme {
  return readStoredTheme() ?? resolveSystemTheme();
}

/**
 * Persists the visitor's explicit choice.
 *
 * Silently no-ops if the write fails (quota, private mode, blocked storage).
 * The caller has already applied the theme to the document by this point, so
 * the toggle keeps working for the current page view; only persistence across
 * visits is lost.
 */
export function persistThemeOverride(theme: Theme): void {
  try {
    globalThis.localStorage?.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Write rejected. Deliberate no-op — see the module note above.
  }
}

/** Applies a theme to the document by setting the override attribute. */
export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
}

/**
 * Reads the theme currently applied to the document.
 *
 * `ThemeToggle` uses this after mount rather than recomputing, so the React
 * state agrees with whatever the pre-hydration script already painted.
 * Returns `null` if the attribute is missing or malformed — which happens only
 * when the inline script did not run (JavaScript disabled at first paint).
 */
export function readAppliedTheme(): Theme | null {
  const applied = document.documentElement.getAttribute(THEME_ATTRIBUTE);
  return isTheme(applied) ? applied : null;
}
