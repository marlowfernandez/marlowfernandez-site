/**
 * Paging arithmetic for `BulletSlider`, extracted as pure functions.
 *
 * Two reasons this is a separate module rather than logic inside the
 * component, following the precedent set by `formatMonth` in
 * `ExperienceSection.tsx`:
 *
 *  1. **jsdom has no layout.** `clientWidth` and `scrollWidth` are always `0`
 *     there and `Element.scrollTo` is unimplemented, so none of this could be
 *     exercised through the component. Pulled out, it is testable with plain
 *     numbers — and the component's own test is then free to assert only
 *     markup and ARIA, which is what jsdom is actually good at.
 *  2. Off-by-one errors in carousel maths are the classic source of a dead
 *     final page or a phantom extra dot. They deserve assertions, not a
 *     read-through.
 *
 * Every function is total: no throws, defined for zero and for nonsense
 * inputs, because the caller reads these values from a live DOM element that
 * legitimately reports `0` before first layout.
 */

/**
 * How many full-width pages the track holds.
 *
 * Returns at least `1` always. A slider with one page renders no controls at
 * all, so "no pages" and "one page" must collapse to the same answer — and the
 * `clientWidth === 0` guard is what keeps that true during the window between
 * mount and first measurement, where the honest answer would be a division by
 * zero.
 */
export function pageCount(scrollWidth: number, clientWidth: number): number {
  if (!Number.isFinite(scrollWidth) || !Number.isFinite(clientWidth)) return 1;
  if (clientWidth <= 0) return 1;
  // Round rather than ceil: sub-pixel layout routinely leaves scrollWidth a
  // fraction over an exact multiple, and `ceil` would turn that rounding dust
  // into a whole extra page containing nothing.
  return Math.max(1, Math.round(scrollWidth / clientWidth));
}

/**
 * Which page a given scroll offset is showing.
 *
 * Rounds to the nearest page, so a track left mid-drag between two snap points
 * reports the one it is closest to rather than always the one behind.
 */
export function pageIndex(scrollLeft: number, clientWidth: number): number {
  if (!Number.isFinite(scrollLeft) || !Number.isFinite(clientWidth)) return 0;
  if (clientWidth <= 0) return 0;
  return Math.max(0, Math.round(scrollLeft / clientWidth));
}

/**
 * Constrain a requested page to the range that exists.
 *
 * Clamps rather than wraps. Wrapping suits a decorative image carousel; for an
 * ordered list of achievements, jumping from the last item back to the first
 * loses the reader's place in a sequence that has a real beginning and end.
 */
export function clampPage(next: number, count: number): number {
  const total = Number.isFinite(count) ? Math.max(1, Math.trunc(count)) : 1;
  if (!Number.isFinite(next)) return 0;
  return Math.min(total - 1, Math.max(0, Math.trunc(next)));
}

/**
 * The scroll offset that puts `page` at the start of the track.
 *
 * Absolute, never relative. Safari's scroll-snap implementation interacts
 * unpredictably with `scrollBy`, landing a snap point short or overshooting;
 * an absolute `scrollTo` target is unambiguous.
 */
export function pageOffset(page: number, clientWidth: number): number {
  if (!Number.isFinite(page) || !Number.isFinite(clientWidth)) return 0;
  return Math.max(0, page) * Math.max(0, clientWidth);
}
