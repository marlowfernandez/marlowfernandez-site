import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { Footer } from './Footer';
import { Header } from './Header';
import { Hero } from './Hero';
import type { ContactInfo } from '@/content/schema';

/**
 * Smoke renders for the shell components, plus the structural assertions the
 * accessibility checklist depends on (single h1, landmarks, real accessible
 * names on the header's glyph items).
 */

const contactInfo: ContactInfo = {
  email: 'someone@example.invalid',
  phone: '000-000-0000',
  linkedInUrl: 'https://example.invalid/in/someone',
};

beforeEach(() => {
  // Header composes ThemeToggle, which reads both of these on mount.
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

describe('Header', () => {
  it('renders inside a banner landmark', () => {
    render(<Header name="A Name" contactInfo={contactInfo} />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('shows a monogram, not the full name, and never a link', () => {
    render(<Header name="A Name" contactInfo={contactInfo} />);

    // The header used to repeat the full name directly above the hero's h1 —
    // the same words twice within one viewport.
    const monogram = screen.getByTestId('header-name');
    expect(monogram).toHaveTextContent('AN');
    expect(monogram.textContent).not.toContain('A Name');

    // Nothing is lost to assistive technology: the expansion stays available
    // through the abbreviation's title.
    expect(monogram).toHaveAttribute('title', 'A Name');

    // Direction C has no navigation, so a self-link would be a dead control.
    expect(screen.queryByRole('link', { name: /A Name|AN/ })).toBeNull();
  });

  it('links email through mailto', () => {
    render(<Header name="A Name" contactInfo={contactInfo} />);

    expect(screen.getByTestId('header-email')).toHaveAttribute(
      'href',
      'mailto:someone@example.invalid',
    );
  });

  it('renders no phone number anywhere', () => {
    // requirements-analysis Q1 had confirmed publishing the number as plain
    // text; that decision was reversed at the redesign. The field is optional
    // in the schema and unset in `contact.mdx`, so this asserts the header
    // does not resurrect it from a fixture that still carries one.
    render(
      <Header
        name="A Name"
        contactInfo={{ ...contactInfo, phone: '000-000-0000' }}
      />,
    );

    expect(screen.queryByTestId('header-phone')).toBeNull();
    expect(screen.getByTestId('site-header')).not.toHaveTextContent(
      '000-000-0000',
    );
  });

  it('gives every glyph item a real accessible name', () => {
    render(<Header name="A Name" contactInfo={contactInfo} />);

    // The value text is `sr-only` below the tablet breakpoint, so it must be
    // present in the DOM rather than replaced by the icon.
    expect(
      screen.getByRole('link', { name: /someone@example\.invalid/ }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /LinkedIn/ })).toBeInTheDocument();
  });

  it('composes the theme toggle', () => {
    render(<Header name="A Name" contactInfo={contactInfo} />);
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
  });
});

describe('Hero', () => {
  it('renders the name as the only h1', () => {
    render(<Hero name="A Name" tagline="A tagline" />);

    const headings = screen.getAllByRole('heading', { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent('A Name');
  });

  it('renders the tagline', () => {
    render(<Hero name="A Name" tagline="A tagline" />);
    expect(screen.getByTestId('hero-tagline')).toHaveTextContent('A tagline');
  });
});

describe('Footer', () => {
  it('renders inside a contentinfo landmark with a copyright line', () => {
    render(<Footer />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveTextContent('Marlow Fernandez');
    expect(footer).toHaveTextContent(String(new Date().getFullYear()));
  });
});

/*
 * `PlaceholderSection` and its tests were deleted in Unit 2, as
 * `unit-of-work.md` planned. The four real section components replaced it and
 * carry their own colocated tests.
 */
