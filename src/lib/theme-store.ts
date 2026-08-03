import {
  applyTheme,
  persistThemeOverride,
  readAppliedTheme,
  resolveInitialTheme,
  type Theme,
} from './theme';

/**
 * A `useSyncExternalStore`-shaped view over the theme.
 *
 * ## Why a store rather than component state
 *
 * The active theme genuinely lives outside React: the pre-hydration script in
 * `layout.tsx` sets `data-theme` on `<html>` before React exists, and
 * `localStorage` holds the override across visits. React is a reader of that
 * state, not its owner.
 *
 * Modelling it as `useState` + `useEffect` would mean writing state from an
 * effect on every mount — a cascading render that React's own lint rule
 * (`react-hooks/set-state-in-effect`) flags, and which the React Compiler in
 * Next 16 has to work around. `useSyncExternalStore` is the sanctioned shape
 * for exactly this: an external source of truth, a server snapshot for the
 * hydration pass, and a subscription for changes.
 *
 * ## Why notification is synchronous
 *
 * Listeners are called directly from `setTheme` rather than through a
 * `MutationObserver` on the attribute. An observer would also work, but its
 * callbacks land in a microtask, so a click and the resulting re-render would
 * be separated by a tick — extra sequencing for no benefit, since this module
 * is the only writer.
 */

const listeners = new Set<() => void>();

export function subscribeToTheme(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

/**
 * The live theme.
 *
 * Prefers what the document is already showing, so React agrees with whatever
 * the pre-hydration script painted. Falls back to resolving from scratch, which
 * only happens if that script did not run.
 */
export function getThemeSnapshot(): Theme | null {
  return readAppliedTheme() ?? resolveInitialTheme();
}

/**
 * The snapshot React uses while rendering on the server and during hydration.
 *
 * `null` means "not yet known", and it is the honest answer: the HTML is built
 * once at build time and served to every visitor, so the server cannot know
 * which theme any particular browser will resolve. Returning a guess here
 * would produce a hydration mismatch on half of all page loads.
 */
export function getServerThemeSnapshot(): Theme | null {
  return null;
}

/**
 * Applies a theme and notifies subscribers.
 *
 * Order matters: the document is updated first, then persistence is attempted.
 * If the write fails the visitor still gets the switch they asked for — the
 * documented failure behaviour from `component-methods.md`.
 */
export function setTheme(theme: Theme): void {
  applyTheme(theme);
  persistThemeOverride(theme);
  for (const listener of [...listeners]) {
    listener();
  }
}
