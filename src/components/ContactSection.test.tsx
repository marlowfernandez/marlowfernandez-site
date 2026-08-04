import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { ContactSection } from './ContactSection';
import { Header } from './Header';
import { contact } from '@/content';
import type { ContactInfo } from '@/content/schema';

const fixture: ContactInfo = {
  email: 'someone@example.invalid',
  phone: '000-000-0000',
  linkedInUrl: 'https://example.invalid/in/someone',
};

describe('ContactSection — rendering', () => {
  it('exposes the section as a region labelled by its h2', () => {
    render(<ContactSection heading="Say hello" contactInfo={fixture} />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Say hello' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('region', { name: 'Say hello' }),
    ).toBeInTheDocument();
  });

  it('links email through mailto', () => {
    render(<ContactSection heading="Say hello" contactInfo={fixture} />);

    const email = screen.getByTestId('contact-email');
    expect(email).toHaveAttribute('href', 'mailto:someone@example.invalid');
    expect(email).toHaveTextContent('someone@example.invalid');
  });

  it('omits the phone entirely when the content carries none', () => {
    // The shipped state: `contact.mdx` no longer sets a phone number, and the
    // schema makes it optional. Nothing should render, and nothing should
    // render an empty tile in its place.
    const { phone: _omitted, ...withoutPhone } = fixture;
    render(<ContactSection heading="Say hello" contactInfo={withoutPhone} />);

    expect(screen.queryByTestId('contact-phone')).toBeNull();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('still renders a phone as plain text if one is ever restored', () => {
    // The reversal is reversible. requirements-analysis Q1's original
    // constraint — plain text, never a `tel:` link — still applies to the
    // rendering path, so it stays asserted rather than deleted with the data.
    render(<ContactSection heading="Say hello" contactInfo={fixture} />);

    const phone = screen.getByTestId('contact-phone');
    expect(phone.tagName).toBe('SPAN');
    expect(phone).toHaveTextContent('000-000-0000');
    expect(
      screen.getByTestId('section-contact').querySelector('a[href^="tel:"]'),
    ).toBeNull();
  });

  it('routes LinkedIn through ExternalLink, with its safety attributes', () => {
    render(<ContactSection heading="Say hello" contactInfo={fixture} />);

    const linkedIn = screen.getByRole('link', { name: /LinkedIn/ });
    expect(linkedIn).toHaveAttribute(
      'href',
      'https://example.invalid/in/someone',
    );
    expect(linkedIn).toHaveAttribute('target', '_blank');
    expect(linkedIn).toHaveAttribute('rel', 'noopener noreferrer');
    expect(linkedIn).toHaveTextContent('opens in new tab');
  });

  it('gives each interactive item a 44px minimum tappable height', () => {
    render(<ContactSection heading="Say hello" contactInfo={fixture} />);

    // `accessibility-checklist.md`, Responsive & Zoom.
    expect(screen.getByTestId('contact-email')).toHaveClass('min-h-11');
    expect(screen.getByRole('link', { name: /LinkedIn/ })).toHaveClass(
      'min-h-11',
    );
  });
});

describe('ContactSection and Header cannot drift', () => {
  beforeEach(() => {
    // Header composes ThemeToggle, which reads matchMedia on mount.
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

  it('renders identical values from one shared contact object', () => {
    // The real object `page.tsx` passes to both components.
    const shared = contact.contact;

    const header = render(
      <Header name="Marlow Fernandez" contactInfo={shared} />,
    );
    const headerEmail = screen.getByTestId('header-email').getAttribute('href');
    const headerLinkedIn = screen
      .getByRole('link', { name: /LinkedIn/ })
      .getAttribute('href');
    header.unmount();

    render(<ContactSection heading={contact.heading} contactInfo={shared} />);

    expect(screen.getByTestId('contact-email').getAttribute('href')).toBe(
      headerEmail,
    );
    expect(
      screen.getByRole('link', { name: /LinkedIn/ }).getAttribute('href'),
    ).toBe(headerLinkedIn);
  });

  it('renders the real contact details, not the Unit 1 .invalid placeholders', () => {
    render(
      <ContactSection
        heading={contact.heading}
        contactInfo={contact.contact}
      />,
    );

    const section = screen.getByTestId('section-contact');
    expect(section.textContent).not.toContain('.invalid');
    expect(section.textContent).not.toContain('PLACEHOLDER');

    expect(screen.getByTestId('contact-email')).toHaveAttribute(
      'href',
      `mailto:${contact.contact.email}`,
    );
    expect(screen.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute(
      'href',
      contact.contact.linkedInUrl,
    );
  });
});
