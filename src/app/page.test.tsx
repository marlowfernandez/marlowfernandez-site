import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { experience } from '@/content';

import HomePage from './page';

/**
 * The locked section order.
 *
 * Not a styling preference. AI Engineering must precede the Experience history
 * — `user-flow.md`'s Key Decision Point, that it be "reachable without
 * requiring the visitor to first read the full Experience history." The order
 * was silently inverted once at an earlier stage, which is why it is asserted
 * here rather than left to review.
 *
 * The redesign made this simpler to guarantee. The layout used to satisfy the
 * requirement with a deliberate DOM-order/visual-order mismatch (AI first in
 * the DOM, `tablet:col-start-*` swapping them visually), which held only while
 * neither section contained a focusable element. `BulletSlider`'s paging
 * controls ended that, so the mismatch was removed: DOM order is now visual
 * order at every width, and the test below asserts no reordering class comes
 * back.
 *
 * jsdom applies no CSS, so a media-query test remains impossible; the rendered
 * `out/index.html` is checked separately at both widths.
 */

beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  });
});

const SECTION_IDS = [
  'section-ai-engineering',
  'section-experience',
  'section-education',
  'section-contact',
] as const;

describe('HomePage — section order', () => {
  it('puts AI Engineering before Experience in the DOM (the mobile order)', () => {
    render(<HomePage />);

    const ai = screen.getByTestId('section-ai-engineering');
    const experience = screen.getByTestId('section-experience');

    // Node.DOCUMENT_POSITION_FOLLOWING === 4
    expect(ai.compareDocumentPosition(experience) & 4).toBeTruthy();
  });

  it('renders all four sections, top to bottom, in the locked order', () => {
    const { container } = render(<HomePage />);

    const rendered = Array.from(
      container.querySelectorAll('[data-testid^="section-"]'),
    ).map((node) => node.getAttribute('data-testid'));

    expect(rendered).toEqual([...SECTION_IDS]);
  });

  it('renders visual order identical to DOM order, at every width', () => {
    render(<HomePage />);

    // Replaces the old `tablet:col-start-*` assertion, and carries the same
    // contract from the other side.
    //
    // The previous layout deliberately disagreed with DOM order on wide
    // screens, which was safe only while neither section held anything
    // focusable. `BulletSlider`'s paging controls ended that, so the mismatch
    // was removed rather than re-argued — and this asserts it stays removed.
    // Any reordering utility here would silently reintroduce a WCAG 2.4.3
    // focus-order problem that no other test would catch.
    const reordering = /\b(tablet:|desktop:)?(col-start-|row-start-|order-)/;

    for (const id of SECTION_IDS) {
      expect(screen.getByTestId(id).className).not.toMatch(reordering);
    }
  });
});

describe('HomePage — content and structure', () => {
  it('renders real content, with no placeholder left anywhere', () => {
    const { container } = render(<HomePage />);

    expect(container.textContent).not.toContain('PLACEHOLDER');
    expect(container.textContent).not.toContain('.invalid');
    expect(screen.queryByTestId('section-experience-banner')).toBeNull();
  });

  it('keeps exactly one h1 and an h2 per section', () => {
    render(<HomePage />);

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(
      SECTION_IDS.length,
    );
  });

  it('renders banner, main and contentinfo landmarks', () => {
    render(<HomePage />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('adds no focusable element to AI Engineering', () => {
    render(<HomePage />);

    // Independent of layout: ADR-1 settled this section as plain
    // comma-separated text with no links, so there is nothing here to focus
    // regardless of how the page is arranged.
    const focusable = 'a, button, input, select, textarea, [tabindex]';
    expect(
      screen.getByTestId('section-ai-engineering').querySelectorAll(focusable),
    ).toHaveLength(0);
  });

  it('confines every focusable element in Experience to a slider control', () => {
    render(<HomePage />);

    // Replaces the old blanket ban, which the slider necessarily violates.
    // The blanket version protected two different things at once: the
    // reordering trick (now gone), and the guarantee that off-screen bullets
    // stay out of the tab order. Only the second still applies, so this asserts
    // exactly that — everything focusable is either a paging control or the
    // scroll track itself, and nothing tabbable lives among the bullets.
    const section = screen.getByTestId('section-experience');
    const focusable = section.querySelectorAll(
      'a, button, input, select, textarea, [tabindex]',
    );

    expect(focusable.length).toBeGreaterThan(0);
    for (const node of focusable) {
      const inControls =
        node.closest('[data-testid="bullet-slider-controls"]') !== null;
      const isTrack = node.getAttribute('role') === 'group';
      expect(
        inControls || isTrack,
        `unexpected focusable element in Experience: ${node.outerHTML.slice(0, 80)}`,
      ).toBe(true);
    }
  });

  it('keeps every bullet mounted and findable', () => {
    render(<HomePage />);

    // The find-in-page contract, asserted at page level as well as in
    // `BulletSlider.test.tsx`: pagination must never unmount content. This is
    // what makes Ctrl+F work for a bullet on a page the reader has not
    // scrolled to yet.
    const lists = screen.getAllByTestId('role-bullets');
    const rendered = lists.reduce(
      (total, list) => total + list.querySelectorAll('li').length,
      0,
    );
    const authored = experience.roles.reduce(
      (total, role) => total + role.bullets.length,
      0,
    );

    expect(rendered).toBe(authored);
  });
});
