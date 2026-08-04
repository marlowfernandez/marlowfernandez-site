import { describe, expect, it } from 'vitest';

import { clampPage, pageCount, pageIndex, pageOffset } from './slider-paging';

/**
 * Pure arithmetic, so these run without a DOM and without React.
 *
 * The cases that matter are the degenerate ones. jsdom reports `clientWidth`
 * as `0` for every element, and a real browser reports `0` for one frame
 * between mount and first layout — so "zero width" is not a hypothetical
 * input here, it is the state the component starts in.
 */

describe('pageCount', () => {
  it('counts whole pages', () => {
    expect(pageCount(1200, 300)).toBe(4);
    expect(pageCount(300, 300)).toBe(1);
    expect(pageCount(900, 300)).toBe(3);
  });

  it('returns 1 rather than dividing by zero before first layout', () => {
    // The jsdom case, and the first-frame case in a real browser. A slider
    // reporting 0 pages would render a control row with no dots in it.
    expect(pageCount(0, 0)).toBe(1);
    expect(pageCount(1200, 0)).toBe(1);
    expect(pageCount(1200, -50)).toBe(1);
  });

  it('ignores sub-pixel rounding dust instead of inventing a page', () => {
    // Fractional layout routinely leaves scrollWidth a hair over an exact
    // multiple. `Math.ceil` would turn 1200.4 into a fifth, empty page.
    expect(pageCount(1200.4, 300)).toBe(4);
    expect(pageCount(1199.6, 300)).toBe(4);
  });

  it('survives non-finite input', () => {
    expect(pageCount(Number.NaN, 300)).toBe(1);
    expect(pageCount(Number.POSITIVE_INFINITY, 300)).toBe(1);
  });
});

describe('pageIndex', () => {
  it('maps an offset to its page', () => {
    expect(pageIndex(0, 300)).toBe(0);
    expect(pageIndex(300, 300)).toBe(1);
    expect(pageIndex(900, 300)).toBe(3);
  });

  it('rounds to the nearest page mid-drag', () => {
    // 610 is just past the midpoint between page 1 and page 2, so the reader
    // is looking mostly at page 2.
    expect(pageIndex(610, 300)).toBe(2);
    expect(pageIndex(440, 300)).toBe(1);
  });

  it('never returns a negative page from overscroll bounce', () => {
    expect(pageIndex(-40, 300)).toBe(0);
  });

  it('returns 0 with no measurable width', () => {
    expect(pageIndex(500, 0)).toBe(0);
    expect(pageIndex(Number.NaN, 300)).toBe(0);
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

describe('pageOffset', () => {
  it('gives an absolute scroll target', () => {
    expect(pageOffset(0, 300)).toBe(0);
    expect(pageOffset(2, 300)).toBe(600);
  });

  it('never targets a negative offset', () => {
    expect(pageOffset(-2, 300)).toBe(0);
    expect(pageOffset(2, -300)).toBe(0);
  });

  it('round-trips with pageIndex', () => {
    // The property that actually matters: scrolling to a page's offset and
    // then reading the position back must name the same page.
    for (const page of [0, 1, 2, 5]) {
      expect(pageIndex(pageOffset(page, 320), 320)).toBe(page);
    }
  });
});
