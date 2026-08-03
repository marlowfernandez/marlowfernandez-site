import { THEME_ATTRIBUTE, THEME_STORAGE_KEY } from './theme';

/**
 * The pre-hydration theme script, injected inline into `<head>`.
 *
 * ## Why this exists as a string of hand-written ES5
 *
 * It has to run *before the browser paints the first frame*. Anything that
 * arrives as a separate module — React, a `<script src>`, even a deferred
 * inline import — runs after first paint, which produces a visible flash of
 * the wrong theme on every load for a dark-mode visitor. Only a synchronous
 * inline script in `<head>` is early enough.
 *
 * That constraint is why the logic in `theme.ts` is duplicated here rather
 * than imported: at the point this runs there is no module system available.
 * The duplication is real and is asserted in `theme.test.ts`, which checks the
 * script text against the same constants and the same resolution order rather
 * than letting the two drift apart unnoticed.
 *
 * ## Failure behaviour
 *
 * Two nested `try` blocks, matching `theme.ts`:
 *   - inner: `localStorage` unavailable -> treated as "no override".
 *   - outer: anything else -> leave the attribute unset, so `globals.css`'s
 *     `@media (prefers-color-scheme)` rule governs. The page renders correctly
 *     either way; only the explicit override is lost.
 *
 * Minified by hand rather than by a build step, because it is injected as a
 * literal string and never passes through the bundler.
 */
export const THEME_INIT_SCRIPT = [
  '(function(){try{',
  `var s=null;try{s=window.localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})}catch(e){}`,
  's=(s==="light"||s==="dark")?s:',
  '(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");',
  `document.documentElement.setAttribute(${JSON.stringify(THEME_ATTRIBUTE)},s);`,
  '}catch(e){}})();',
].join('');
