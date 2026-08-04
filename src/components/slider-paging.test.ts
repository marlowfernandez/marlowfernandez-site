import { describe, expect, it } from 'vitest';

import { clampPage, columnOffsets, nearestPage } from './slider-paging';

/**
 * Pure functions, so these run without a DOM and without React.
 *
 * These replaced an earlier trio built on `page * clientWidth`. That model was
 * shipped and was wrong: columns sit `column-gap` apart and grid rounds its own
 * track sizing, so on the real layout they were 48px further apart than the
 * formula assumed. The error compounded — page four landed 144px off and
 * visibly pushed the content sideways. The tests for that model all passed,
 * because they tested the arithmetic rather than the layout.
 *
 * Hence the shape here: `columnOffsets` takes measurements as input rather
 * than deriving them, so the component reads reality instead of predicting it.
 */

/** Minimal stand-in for the one property `columnOffsets` reads. */
const items = (...offsets: number[]) =>
  offsets.map((offsetLeft) => ({ offsetLeft }));

describe('columnOffsets', () => {
  it('takes the first item of each column', () => {
    // 8 bullets, 4 rows: two columns starting at 0 and 616.
    expect(columnOffsets(items(0, 0, 0, 0, 616, 616, 616, 616), 4)).toEqual([
      0, 616,
    ]);
  });

  it('does not assume columns are one client width apart', () => {
    // The regression this file exists for. Uneven spacing must survive
    // verbatim — no rounding to a multiple, no averaging.
    expect(columnOffsets(items(0, 0, 616, 616, 1240, 1240), 2)).toEqual([
      0, 616, 1240,
    ]);
  });

  it('collapses to one page when every item shares an offset', () => {
    // Below the tablet breakpoint the grid is disabled and the list is a plain
    // vertical stack, so every item reports offsetLeft 0. That is one page,
    // not four, and a slider with one page renders no controls at all.
    expect(columnOffsets(items(0, 0, 0, 0, 0, 0), 4)).toEqual([0]);
  });

  it('handles a partial final column', () => {
    // 6 bullets across 4 rows: the second column holds two.
    expect(columnOffsets(items(0, 0, 0, 0, 616, 616), 4)).toEqual([0, 616]);
  });

  it('is defined for degenerate input', () => {
    expect(columnOffsets([], 4)).toEqual([0]);
    expect(columnOffsets(items(0, 100), 0)).toEqual([0]);
  });
});

describe('nearestPage', () => {
  const offsets = [0, 616, 1240, 1856];

  it('maps an exact column start to its page', () => {
    expect(nearestPage(offsets, 0)).toBe(0);
    expect(nearestPage(offsets, 616)).toBe(1);
    expect(nearestPage(offsets, 1856)).toBe(3);
  });

  it('rounds to the closest column mid-drag', () => {
    expect(nearestPage(offsets, 600)).toBe(1);
    expect(nearestPage(offsets, 400)).toBe(1);
    expect(nearestPage(offsets, 260)).toBe(0);
  });

  it('keeps the earlier column on an exact tie', () => {
    // Matches how `scroll-snap-align: start` resolves a tie.
    expect(nearestPage(offsets, 308)).toBe(0);
  });

  it('clamps rather than extrapolating past either end', () => {
    // Overscroll bounce produces both of these.
    expect(nearestPage(offsets, -80)).toBe(0);
    expect(nearestPage(offsets, 99999)).toBe(3);
  });

  it('is defined for degenerate input', () => {
    expect(nearestPage([], 500)).toBe(0);
    expect(nearestPage(offsets, Number.NaN)).toBe(0);
  });

  it('round-trips with columnOffsets', () => {
    // The property that matters: scrolling to a measured column start and
    // reading the position back must name the same page.
    const measured = columnOffsets(
      items(0, 0, 616, 616, 1240, 1240, 1856, 1856),
      2,
    );
    measured.forEach((offset, page) => {
      expect(nearestPage(measured, offset)).toBe(page);
    });
  });
});

describe('clampPage', () => {
  it('keeps a page inside the range that exists', () => {
    expect(clampPage(2, 4)).toBe(2);
    expect(clampPage(-1, 4)).toBe(0);
    expect(clampPage(9, 4)).toBe(3);
  });

  it('clamps rather than wrapping', () => {
    // Deliberate: these are ordered achievements, not a decorative carousel.
    // Wrapping past the end would drop the reader back at the beginning.
    expect(clampPage(4, 4)).toBe(3);
    expect(clampPage(-1, 4)).not.toBe(3);
  });

  it('treats a single page as the only valid target', () => {
    expect(clampPage(0, 1)).toBe(0);
    expect(clampPage(3, 1)).toBe(0);
    expect(clampPage(0, 0)).toBe(0);
  });
});
