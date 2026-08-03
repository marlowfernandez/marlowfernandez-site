import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ExternalLink, NEW_TAB_ANNOUNCEMENT } from './ExternalLink';

describe('ExternalLink', () => {
  it('opens in a new tab with the required rel tokens', () => {
    render(<ExternalLink href="https://example.invalid/x" label="LinkedIn" />);

    const link = screen.getByTestId('external-link');
    expect(link).toHaveAttribute('href', 'https://example.invalid/x');
    expect(link).toHaveAttribute('target', '_blank');

    // Both tokens matter and are asserted separately: `noopener` closes the
    // `window.opener` path, `noreferrer` suppresses the Referer header.
    const rel = link.getAttribute('rel')?.split(/\s+/) ?? [];
    expect(rel).toContain('noopener');
    expect(rel).toContain('noreferrer');
  });

  it('announces the new tab as part of the accessible name', () => {
    render(<ExternalLink href="https://example.invalid/x" label="LinkedIn" />);

    // A screen reader reads the accessible name when the link takes focus —
    // i.e. before activation, which is what `interaction-spec.md` requires.
    expect(screen.getByTestId('external-link')).toHaveAccessibleName(
      `LinkedIn ${NEW_TAB_ANNOUNCEMENT}`,
    );
  });

  it('keeps the announcement out of the visible label', () => {
    render(<ExternalLink href="https://example.invalid/x" label="LinkedIn" />);

    const announcement = screen.getByText(NEW_TAB_ANNOUNCEMENT);
    expect(announcement).toHaveClass('sr-only');
    // Nested inside the anchor, not a sibling — otherwise it would not be part
    // of the computed accessible name.
    expect(screen.getByTestId('external-link')).toContainElement(announcement);
  });

  it('is reachable by keyboard', () => {
    render(<ExternalLink href="https://example.invalid/x" label="LinkedIn" />);

    const link = screen.getByTestId('external-link');
    link.focus();
    expect(link).toHaveFocus();
    // A native anchor with href is in the tab order without a tabindex; an
    // explicit positive tabindex would break document order.
    expect(link).not.toHaveAttribute('tabindex');
  });
});
