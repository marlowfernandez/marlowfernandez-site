import { LinkedInIcon, MailIcon } from '@/components/ContactIcons';
import { ExternalLink } from '@/components/ExternalLink';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { ContactInfo } from '@/content/schema';

/**
 * Top bar: monogram, contact glyphs, theme toggle.
 *
 * Server component. It composes `ThemeToggle` but owns none of its state
 * (`components.md`, Component Boundaries) — it only provides layout.
 *
 * ## Monogram, not the full name
 *
 * The header used to repeat "Marlow Fernandez" directly above the hero's `h1`,
 * which said the same thing twice within a single viewport. It now shows the
 * initials.
 *
 * The full name stays available to assistive technology through the `title`
 * on the abbreviation, so nothing is lost to a screen reader — the change is
 * visual density, not information.
 *
 * The monogram is deliberately not a link: this is a single page with no
 * navigation, so a self-link would be a control that does nothing
 * (`mockups.md`, Header).
 *
 * ## No phone number
 *
 * Removed at the redesign, along with its entry in `contact.mdx`. See the note
 * on `ContactInfo.phone` — and note that removing it from `HEAD` does not
 * remove it from the public repository's history.
 *
 * The `banner` landmark comes from `<header>` being a direct child of `<body>`
 * in `layout.tsx`; no explicit `role` is needed and adding one would be
 * redundant markup.
 */
export interface HeaderProps {
  name: string;
  contactInfo: ContactInfo;
}

/**
 * Header contact items.
 *
 * Bordered micro-caps chips rather than default-styled links, matching the
 * eyebrow register the rest of the page uses. The global `a` rule sets the
 * accent colour and an underline, which read as body-copy links dropped into
 * a chrome bar; `no-underline` and an explicit colour opt out.
 *
 * `min-h-9` keeps the bar compact while `Header`'s own `min-h-11` targets are
 * preserved on the toggle, which is the item most likely to be tapped.
 */
const GLYPH_CLASS =
  'lift inline-flex min-h-9 items-center gap-xs px-xs text-label font-bold tracking-[0.12em] text-text-secondary uppercase no-underline transition-colors hover:border-accent-section hover:text-text-primary';

/** "Marlow Fernandez" -> "MF". Falls back to whatever initials exist. */
function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter((part) => part.length > 0)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function Header({ name, contactInfo }: HeaderProps) {
  return (
    <header
      data-testid="site-header"
      /*
       * Sticky and glass. `z-50` keeps it above the scene glows, which sit at
       * negative z-index inside their own stacking contexts but would still
       * paint over a static header once a scene scrolls past.
       */
      className="glass sticky top-0 z-50 border-b border-hairline"
    >
      <div className="mx-auto flex w-full max-w-[1800px] flex-wrap items-center justify-between gap-x-sm gap-y-xs px-gutter py-xs">
        <span className="flex items-baseline gap-xs">
          <abbr
            className="text-body font-extrabold tracking-tight text-text-primary no-underline"
            data-testid="header-name"
            title={name}
          >
            {initialsOf(name)}
            {/* Decorative full stop in the accent, per the reference's monogram. */}
            <span aria-hidden="true" className="text-accent-section">
              .
            </span>
          </abbr>

          {/*
            The frozen row: a condensed copy of the hero's name, revealed only
            once the hero has scrolled away. On the first scene it would simply
            repeat the 109px heading a few hundred pixels below it.

            `aria-hidden` because it is exactly that — a repeat. The name is
            already the page's `h1` and is already on the abbreviation beside
            it; announcing it a third time on every scroll would be noise.

            Hidden by default and revealed by the attribute, so with JavaScript
            unavailable it simply never appears rather than being stuck on.
          */}
          <span
            aria-hidden="true"
            data-testid="header-name-full"
            className="header-name-full text-meta text-text-secondary"
          >
            {name}
          </span>
        </span>

        <div className="flex flex-wrap items-center gap-x-sm gap-y-xs">
          <ContactItem
            icon={<MailIcon />}
            href={`mailto:${contactInfo.email}`}
            value={contactInfo.email}
            testId="header-email"
          />

          <ExternalLink
            href={contactInfo.linkedInUrl}
            label="LinkedIn"
            icon={<LinkedInIcon />}
            className={GLYPH_CLASS}
          />

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
      <span data-testid={testId} className={`${GLYPH_CLASS} cursor-default`}>
        {body}
      </span>
    );
  }

  return (
    <a href={href} data-testid={testId} className={GLYPH_CLASS}>
      {body}
    </a>
  );
}
