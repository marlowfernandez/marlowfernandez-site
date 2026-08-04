import { THEME_ATTRIBUTE, THEME_STORAGE_KEY } from './theme';

/**
 * Attribute arming the scroll reveals, set on `<html>` before first paint.
 *
 * Reveals start their elements at `opacity: 0`, which is only safe while
 * something is guaranteed to reveal them. Two different failures would
 * otherwise leave the page permanently blank, and the flag covers both:
 *
 *  1. **JavaScript disabled.** The script never runs, the attribute is never
 *     set, and the hidden state never applies. The page renders finished.
 *  2. **JavaScript enabled but the bundle fails.** This one is subtler and is
 *     why `REVEAL_READY_FLAG` exists: the inline script always succeeds, so
 *     the attribute *would* be set while `RevealController` — which ships in
 *     the React bundle — never mounts. The failsafe below removes the
 *     attribute if the controller has not reported in, un-hiding everything.
 *
 * Case 2 is not hypothetical enough to ignore: a blank page would be strictly
 * worse than the flat layout this redesign replaced.
 */
export const JS_ATTRIBUTE = 'data-js';

/**
 * Window property `RevealController` sets to announce that it mounted.
 *
 * A property rather than an attribute so it cannot be confused with the
 * styling hooks, and so the failsafe below reads it without a DOM query.
 */
export const REVEAL_READY_FLAG = '__revealReady';

/**
 * How long the failsafe waits before assuming the reveal controller is not
 * coming. Long enough that a slow bundle on a poor connection still wins;
 * short enough that a genuine failure is not a visibly blank page.
 */
export const REVEAL_FAILSAFE_MS = 2000;

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
  // Set first, and outside the theme resolution, so a storage or matchMedia
  // failure below cannot leave the page permanently invisible. This is the one
  // ordering constraint in the script.
  `document.documentElement.setAttribute(${JSON.stringify(JS_ATTRIBUTE)},"on");`,
  `var s=null;try{s=window.localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})}catch(e){}`,
  's=(s==="light"||s==="dark")?s:',
  '(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");',
  `document.documentElement.setAttribute(${JSON.stringify(THEME_ATTRIBUTE)},s);`,
  // Failsafe: if the reveal controller has not reported in, disarm the hidden
  // state so the page cannot stay blank. Scheduled last so a theme failure
  // above cannot skip it.
  `window.setTimeout(function(){if(!window[${JSON.stringify(REVEAL_READY_FLAG)}]){`,
  `document.documentElement.removeAttribute(${JSON.stringify(JS_ATTRIBUTE)})}},`,
  `${REVEAL_FAILSAFE_MS});`,
  '}catch(e){}})();',
].join('');
