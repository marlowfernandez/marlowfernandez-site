import { ExternalLink } from '@/components/ExternalLink';
import { LinkedInIcon, MailIcon, PhoneIcon } from '@/components/ContactIcons';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { ContactInfo } from '@/content/schema';

/**
 * Top bar: name, contact glyphs, theme toggle.
 *
 * Server component. It composes `ThemeToggle` but owns none of its state
 * (`components.md`, Component Boundaries) — it only provides layout.
 *
 * The name is deliberately not a link: Direction C is a single page with no
 * navigation, so a self-link would be a control that does nothing
 * (`mockups.md`, Header).
 *
 * The `banner` landmark comes from `<header>` being a direct child of `<body>`
 * in `layout.tsx`; no explicit `role` is needed and adding one would be
 * redundant markup.
 */
export interface HeaderProps {
  name: string;
  contactInfo: ContactInfo;
}

export function Header({ name, contactInfo }: HeaderProps) {
  return (
    <header
      data-testid="site-header"
      className="border-b border-border bg-surface"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-x-sm gap-y-xs px-sm py-sm">
        <span
          className="text-h2 font-semibold text-text-primary"
          data-testid="header-name"
        >
          {name}
        </span>

        <div className="flex flex-wrap items-center gap-x-sm gap-y-xs">
          <ContactItem
            icon={<MailIcon />}
            href={`mailto:${contactInfo.email}`}
            value={contactInfo.email}
            testId="header-email"
          />

          {/*
            Phone is plain text, not a `tel:` link — confirmed at
            requirements-analysis Q1. It is still a real text node in the DOM,
            which is what `accessibility-checklist.md` asks for ("readable as
            plain text, not embedded in an image").
          */}
          <ContactItem
            icon={<PhoneIcon />}
            value={contactInfo.phone}
            testId="header-phone"
          />

          <span className="inline-flex items-center gap-xs text-meta">
            <LinkedInIcon />
            <ExternalLink href={contactInfo.linkedInUrl} label="LinkedIn" />
          </span>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

/**
 * One glyph plus its value.
 *
 * The value is always present in the accessible name; below the tablet
 * breakpoint it is visually hidden so the row fits without truncation, which
 * is the "contact icons wrap below the name if needed" behaviour from
 * `mockups.md`. An icon with no accessible text would fail
 * `accessibility-checklist.md`, so `sr-only` is used rather than `hidden`.
 */
function ContactItem({
  icon,
  href,
  value,
  testId,
}: {
  icon: React.ReactNode;
  href?: string;
  value: string;
  testId: string;
}) {
  const body = (
    <>
      {icon}
      <span className="sr-only tablet:not-sr-only">{value}</span>
    </>
  );

  if (href === undefined) {
    return (
      <span
        data-testid={testId}
        className="inline-flex items-center gap-xs text-meta text-text-secondary"
      >
        {body}
      </span>
    );
  }

  return (
    <a
      href={href}
      data-testid={testId}
      className="inline-flex items-center gap-xs text-meta"
    >
      {body}
    </a>
  );
}
