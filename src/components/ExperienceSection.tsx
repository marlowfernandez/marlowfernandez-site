import type { ExperienceEntry } from '@/content/schema';

/**
 * The Experience section: every employer block, at full detail.
 *
 * Server component — no `'use client'`. `ThemeToggle` remains the only client
 * component on the page (`components.md`, Component Boundaries).
 *
 * Content comes from `src/content/experience.mdx`, already validated against
 * `src/content/schema.ts` at build time. This component renders; it never
 * parses or fetches.
 *
 * ## The Vynkor sub-line
 *
 * `role.subLine` renders as its own `<p>`, a sibling of the bullet list rather
 * than an item inside it. That is a requirement, not a styling choice:
 * `requirements.md` specifies "one short, clearly-separate line within this
 * role's period... not folded into or blended with Point & Pay's own
 * achievement bullets."
 *
 * It is styled smaller and lighter (`text-meta text-text-secondary`) per
 * `mockups.md`, but deliberately using the same secondary-text token the rest
 * of the page uses rather than an ad-hoc opacity or grey. That token holds
 * 6.4:1 against the light background and 7.2:1 against the dark one — both
 * clear of WCAG AA's 4.5:1 — which is what `accessibility-checklist.md`
 * insists on: "'brief and vague' (a content decision) must not be implemented
 * as 'inaccessible' (an accessibility failure)."
 */
export interface ExperienceSectionProps {
  heading: string;
  roles: ExperienceEntry[];
  className?: string;
}

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

/** Text shown in place of an end date while a role is current. */
export const PRESENT_LABEL = 'Present';

/**
 * `YYYY-MM` -> `Mon YYYY`.
 *
 * Hand-rolled rather than `Intl.DateTimeFormat` or `new Date(...)`: parsing
 * `'2022-04'` as a Date makes the rendered month depend on the build machine's
 * timezone, which is exactly the kind of environment-dependent output a static
 * export should not have.
 *
 * Throws on malformed input rather than degrading to a blank or the raw
 * string. The schema validator already rejects anything but `YYYY-MM` at build
 * time, so reaching this throw means the two have drifted apart — a loud
 * failure is the only useful outcome.
 */
export function formatMonth(yearMonth: string): string {
  const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(yearMonth);
  if (match === null) {
    throw new RangeError(
      `Expected a YYYY-MM date, received "${yearMonth}". ` +
        'src/content/schema.ts should have rejected this before render.',
    );
  }

  // Both groups are non-optional in the pattern, so a match guarantees them;
  // the assertions only satisfy `noUncheckedIndexedAccess`.
  const year = match[1]!;
  const month = Number(match[2]!);
  // Safe by construction: the pattern admits 01-12 only.
  const name = MONTH_NAMES[month - 1]!;
  return `${name} ${year}`;
}

/** `Apr 2022 – Present`, or `Nov 2019 – Apr 2022` for a closed tenure. */
export function formatTenure(
  startDate: string,
  endDate: string | null,
): string {
  const end = endDate === null ? PRESENT_LABEL : formatMonth(endDate);
  return `${formatMonth(startDate)} – ${end}`;
}

export function ExperienceSection({
  heading,
  roles,
  className,
}: ExperienceSectionProps) {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      data-testid="section-experience"
      {...(className === undefined ? {} : { className })}
    >
      <h2
        id="experience-heading"
        className="text-h2 font-semibold text-text-primary"
      >
        {heading}
      </h2>

      {/* Ordered: the list is reverse-chronological, so sequence carries meaning. */}
      <ol className="mt-sm space-y-md">
        {roles.map((role) => (
          <li key={`${role.employer}|${role.startDate}`} data-testid="role">
            <h3
              className="text-body font-semibold text-text-primary"
              data-testid="role-title"
            >
              {role.title}
            </h3>

            <p className="text-meta text-text-secondary">
              <span data-testid="role-employer">{role.employer}</span>
              {' · '}
              <span data-testid="role-tenure">
                {formatTenure(role.startDate, role.endDate)}
              </span>
            </p>

            <ul
              data-testid="role-bullets"
              className="mt-xs list-disc space-y-xs pl-sm text-body text-text-primary"
            >
              {role.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>

            {/*
              Outside the <ul> on purpose — see the component doc comment. A
              reviewer changing this into an <li> would silently violate
              `requirements.md`; `ExperienceSection.test.tsx` guards it.
            */}
            {role.subLine === undefined ? null : (
              <p
                data-testid="role-sub-line"
                className="mt-xs text-meta text-text-secondary"
              >
                {role.subLine}
              </p>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
