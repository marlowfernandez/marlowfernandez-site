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
 * Which page a scroll offset is showing, given the real column positions.
 *
 * ## Why this takes measured offsets instead of computing them
 *
 * The obvious model — `page * clientWidth` — is wrong, and was shipped wrong.
 * A column is not `clientWidth` apart from the next one: `column-gap` sits
 * between them, and grid resolves `grid-auto-columns: 100%` against the
 * container's content box, which sub-pixel rounding can shift again.
 *
 * Measured on the real layout, columns were **48px** further apart than the
 * formula assumed. That error compounds per page, so by page four the content
 * was displaced 144px and visibly pushed off to one side.
 *
 * Reading `offsetLeft` off the actual column starts cannot drift from the
 * layout, because it *is* the layout. This is the same lesson as the
 * Lighthouse glob and the employer type ramp: measure the real thing rather
 * than model it.
 */
export function nearestPage(offsets: number[], scrollLeft: number): number {
  if (offsets.length === 0) return 0;
  if (!Number.isFinite(scrollLeft)) return 0;

  let best = 0;
  let bestDistance = Number.POSITIVE_INFINITY;
  offsets.forEach((offset, index) => {
    const distance = Math.abs(offset - scrollLeft);
    // Strict `<` keeps the earlier column when a position is exactly between
    // two, which matches how `scroll-snap-align: start` resolves a tie.
    if (distance < bestDistance) {
      bestDistance = distance;
      best = index;
    }
  });
  return best;
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
 * Column start positions, taken from the first item in each column.
 *
 * With `grid-auto-flow: column` and N rows, items `0`, `N`, `2N`… are the
 * top-left cell of each column, so their `offsetLeft` is that column's scroll
 * position. Items are measured rather than counted, so a column that reflows
 * cannot desynchronise the paging.
 *
 * Duplicate offsets are collapsed: below the `tablet` breakpoint the grid is
 * disabled entirely and every item reports the same `offsetLeft`, which must
 * read as one page rather than four.
 */
export function columnOffsets(
  items: readonly { offsetLeft: number }[],
  rows: number,
): number[] {
  if (items.length === 0 || rows < 1) return [0];

  const offsets: number[] = [];
  for (let index = 0; index < items.length; index += rows) {
    const offset = items[index]?.offsetLeft ?? 0;
    if (offsets.length === 0 || offset > (offsets.at(-1) as number)) {
      offsets.push(offset);
    }
  }
  return offsets.length === 0 ? [0] : offsets;
}
