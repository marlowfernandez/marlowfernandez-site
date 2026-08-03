import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import HomePage from './page';

/**
 * The locked section order.
 *
 * This is not a styling preference. `mockups.md` locks mobile to AI Engineering
 * **before** Experience (tracing to `user-flow.md`'s Key Decision Point) and
 * tablet/desktop to Experience **left**, AI Engineering right. The ordering was
 * silently inverted once at an earlier stage, which is why it is asserted here
 * rather than left to review.
 *
 * jsdom applies no CSS, so a media-query test is not possible. What is testable
 * — and what actually holds the contract — is (a) DOM order, which *is* the
 * mobile order, and (b) the explicit grid-placement classes that override it
 * from the `tablet:` breakpoint up. The rendered `out/index.html` is checked
 * separately at both widths.
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

  it('places Experience back in column one from the tablet breakpoint up', () => {
    render(<HomePage />);

    expect(screen.getByTestId('section-experience')).toHaveClass(
      'tablet:col-start-1',
      'tablet:row-start-1',
    );
    expect(screen.getByTestId('section-ai-engineering')).toHaveClass(
      'tablet:col-start-2',
      'tablet:row-start-1',
    );
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

  it('adds no focusable element to the two reordered sections', () => {
    render(<HomePage />);

    // The DOM-order/visual-order disagreement on wide screens is only safe
    // while these two sections hold nothing focusable — see `page.tsx`.
    const focusable = 'a, button, input, select, textarea, [tabindex]';
    expect(
      screen.getByTestId('section-ai-engineering').querySelectorAll(focusable),
    ).toHaveLength(0);
    expect(
      screen.getByTestId('section-experience').querySelectorAll(focusable),
    ).toHaveLength(0);
  });
});
