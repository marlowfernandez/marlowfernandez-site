import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BulletSlider } from './BulletSlider';

/**
 * jsdom has no layout engine, so this file deliberately does NOT test paging
 * arithmetic — `clientWidth` is always 0 here and `Element.scrollTo` is
 * unimplemented. That maths lives in `slider-paging.ts` and is tested there
 * with plain numbers.
 *
 * What jsdom *is* good for is markup, roles, and names, which is what this
 * file asserts. The most important assertion is the focusable-content one:
 * the component's find-in-page guarantee depends entirely on slides holding
 * nothing tabbable, and that is a property of the markup.
 */

const BULLETS = Array.from(
  { length: 15 },
  (_, i) => `Achievement number ${i}.`,
);

/**
 * Simulated layout.
 *
 * jsdom computes none, so every element reports `clientWidth: 0` — which the
 * component correctly reads as "one page, no controls". That is a real state
 * (it is what a short employer like Syzygy renders, and what any browser shows
 * for one frame before first layout), so it is worth testing directly. But the
 * paginated state needs dimensions to exist at all, hence these stubs.
 *
 * They are installed per-file rather than in `vitest.setup.ts`: a shared stub
 * would silently give every other test a fake layout too.
 */
/**
 * Simulated column width, in the same spirit as a real layout: columns sit an
 * arbitrary distance apart, NOT an exact multiple of the track width. The
 * component must read that distance rather than assume it — a bug that shipped
 * once, where columns were 48px further apart than `page * clientWidth`
 * predicted and page four landed 144px off.
 */
const COLUMN_PITCH = 616;
/** Rows per column, matching the component's own constant. */
const ROWS = 4;

let paginate = false;

beforeEach(() => {
  paginate = false;

  // `offsetLeft` is what the component measures. jsdom computes no layout and
  // reports 0 for everything, which correctly reads as "one column"; the
  // paginated case has to be simulated.
  Object.defineProperty(HTMLElement.prototype, 'offsetLeft', {
    configurable: true,
    get(this: HTMLElement) {
      if (!paginate || !this.classList.contains('slider-bullet')) return 0;
      const siblings = [...(this.parentElement?.children ?? [])];
      return Math.floor(siblings.indexOf(this) / ROWS) * COLUMN_PITCH;
    },
  });

  // Fires its callback on observe(), exactly as the real one does — which is
  // what the component relies on for its initial measurement instead of
  // calling setState in an effect body.
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(private readonly callback: () => void) {}
      observe() {
        this.callback();
      }
      unobserve() {}
      disconnect() {}
    },
  );

  // jsdom throws "not implemented" on scrollTo.
  Element.prototype.scrollTo = vi.fn() as unknown as Element['scrollTo'];
});

function renderSlider(bullets: string[] = BULLETS) {
  return render(
    <BulletSlider bullets={bullets} employer="Point & Pay" index={0} />,
  );
}

/** Renders with simulated column positions, so the track paginates. */
function renderPaginated(bullets: string[] = BULLETS) {
  paginate = true;
  return render(
    <BulletSlider bullets={bullets} employer="Point & Pay" index={0} />,
  );
}

describe('content preservation', () => {
  it('mounts every bullet, not just the visible page', () => {
    renderSlider();
    expect(screen.getAllByRole('listitem')).toHaveLength(BULLETS.length);
  });

  it('renders every bullet as findable text', () => {
    // The property Ctrl+F depends on. If a future change paginates by
    // unmounting, this fails — and so do the eleven content assertions in
    // ExperienceSection.test.tsx.
    const { container } = renderSlider();
    for (const bullet of BULLETS) {
      expect(container).toHaveTextContent(bullet);
    }
  });

  it('hides no bullet from assistive technology', () => {
    renderSlider();
    const list = screen.getByTestId('role-bullets');
    expect(list.querySelectorAll('[aria-hidden="true"]')).toHaveLength(0);
    expect(list.querySelectorAll('[hidden]')).toHaveLength(0);
    expect(list.querySelectorAll('[inert]')).toHaveLength(0);
  });

  it('puts nothing focusable inside the slide track', () => {
    // LOAD-BEARING. Off-screen pages stay out of the tab order only because a
    // slide contains nothing tabbable — that is what lets the component skip
    // `inert`, which would otherwise be required and would break find-in-page.
    // A single link added to a bullet silently reverses that trade, so this is
    // a test rather than a comment.
    renderSlider();
    const list = screen.getByTestId('role-bullets');
    expect(
      list.querySelectorAll('a, button, input, select, textarea, [tabindex]'),
    ).toHaveLength(0);
  });
});

describe('the scroll track', () => {
  it('is keyboard reachable and named', () => {
    // A scrollable region with no keyboard access is an axe violation
    // (`scrollable-region-focusable`) and would cost the a11y budget that
    // gates deploys.
    renderSlider();
    const track = screen.getByRole('group', {
      name: /Point & Pay achievements/,
    });
    expect(track).toHaveAttribute('tabindex', '0');
  });

  it('is the target of every control', () => {
    // axe's `aria-valid-attr-value` requires aria-controls to resolve.
    renderPaginated();
    const track = screen.getByRole('group', { name: /achievements/ });
    const controls = screen.getByTestId('bullet-slider-controls');
    const buttons = within(controls).getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
    for (const button of buttons) {
      expect(button.getAttribute('aria-controls')).toBe(track.id);
    }
  });

  it('uses an index-derived id rather than a slug of the employer name', () => {
    // Two of the four real employer names carry punctuation and parentheses
    // that make fragile, collision-prone ids.
    renderSlider();
    expect(screen.getByRole('group', { name: /achievements/ }).id).toBe(
      'bullets-0',
    );
  });
});

describe('controls', () => {
  it('marks the ends with aria-disabled, never the disabled attribute', () => {
    // A `disabled` button loses focus the instant it disables, stranding a
    // reader who was clicking through to the last page.
    renderPaginated();
    const previous = screen.getByRole('button', { name: /Previous/ });
    expect(previous).toHaveAttribute('aria-disabled', 'true');
    expect(previous).not.toBeDisabled();
  });

  it('keeps focus on the pressed control', async () => {
    // Moving focus into the newly-visible page is the classic carousel
    // mistake: it steals focus from the button about to be pressed again.
    const user = userEvent.setup();
    renderPaginated();
    const next = screen.getByRole('button', { name: /Next/ });
    await user.click(next);
    expect(next).toHaveFocus();
  });

  it('announces politely and invisibly', () => {
    renderPaginated();
    const status = screen.getByTestId('bullet-status');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status.className).toContain('sr-only');
  });

  it('renders one dot per page, and marks the current one', () => {
    // 1200 / 300 = 4 pages. Also proves the simulated layout reaches the
    // component at all, so the paginated tests above are not vacuous.
    renderPaginated();
    const dots = screen
      .getAllByRole('button')
      .filter((button) => button.getAttribute('aria-label')?.includes('page'));
    expect(dots).toHaveLength(4);
    expect(dots[0]).toHaveAttribute('aria-current', 'true');
    expect(dots[1]).toHaveAttribute('aria-current', 'false');
  });

  it('announces only after a deliberate control press', async () => {
    // Silent on load; a swipe never announces either (the scroll handler
    // clears the flag), or a single drag would emit a burst of updates.
    const user = userEvent.setup();
    renderPaginated();
    expect(screen.getByTestId('bullet-status')).toHaveTextContent('');

    await user.click(screen.getByRole('button', { name: /Next/ }));
    expect(screen.getByTestId('bullet-status')).toHaveTextContent(
      'Page 2 of 4',
    );
  });

  it('renders no controls for a single page of bullets', () => {
    // jsdom reports clientWidth 0, so pageCount is 1 — the same state a real
    // browser reaches for a short employer like Syzygy. A dead dot there would
    // be worse than no control at all.
    renderSlider(['Only one thing.']);
    const controls = screen.getByTestId('bullet-slider-controls');
    expect(within(controls).queryAllByRole('button')).toHaveLength(0);
    expect(controls).toHaveAttribute('aria-hidden', 'true');
    // The status node stays mounted but empty, so the live region is not
    // created and destroyed as pages change.
    expect(screen.getByTestId('bullet-status')).toHaveTextContent('');
  });
});
