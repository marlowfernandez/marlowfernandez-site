import { BulletSlider } from '@/components/BulletSlider';
import { resolveAccent, type ExperienceEntry } from '@/content/schema';

/**
 * The Experience section: every employer block, at full detail.
 *
 * Server component itself, but it now renders `BulletSlider`, which is a
 * client component. `ThemeToggle` is therefore no longer the only one on the
 * page — an invariant several doc comments used to assert, corrected where it
 * appeared. The bundle cost is one small component and is measured against the
 * Performance budget rather than assumed.
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
        className="text-label font-extrabold text-text-tertiary uppercase"
      >
        {heading}
      </h2>

      {/* Ordered: the list is reverse-chronological, so sequence carries meaning. */}
      {/*
        No vertical rhythm between roles: each one is its own viewport-height
        snap target where snapping is active, and adding margin between them
        would put dead space at every snap boundary.
      */}
      <ol className="mt-lg">
        {roles.map((role, index) => (
          <li
            key={`${role.employer}|${role.startDate}`}
            data-testid="role"
            data-accent={resolveAccent(role, index)}
            /*
             * Revealed per scene rather than per section, so employers arrive
             * one at a time as the reader scrolls through the history. The
             * attribute is inert without JavaScript — see `RevealController`.
             */
            data-reveal=""
            /*
             * Each employer is its own snap target, which is the whole point:
             * one gesture moves to the next company rather than three or four.
             */
            data-snap=""
            className="scene relative"
          >
            {/* Decorative: the accent wash behind this employer's scene. */}
            <span aria-hidden="true" className="scene-glow" />

            <div className="grid gap-lg desktop:grid-cols-[0.85fr_1.15fr] desktop:items-start">
              {/*
                Column one — who and when.

                Sticky from `desktop:` up, so the employer stays pinned while
                its achievements scroll past. This is the whole of the
                "cinematic" feel on a normally-scrolling page: the reader keeps
                their place in the history instead of losing the company name
                the moment they start reading the detail.

                Offset clears the sticky header. Not applied below `desktop:` —
                on a narrow screen the two columns stack, and a sticky element
                in a stacked layout just eats the viewport.
              */}
              <div className="desktop:sticky desktop:top-2xl">
                {/*
                  Eyebrow: ordinal, a fixed label, then the tenure. The ordinal
                  and label are decorative scene furniture — hidden from
                  assistive technology, which gets the employer and dates from
                  the heading and the tenure below.
                */}
                <p className="flex flex-wrap items-center gap-xs text-label font-extrabold uppercase">
                  <span aria-hidden="true" className="text-accent-section">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span aria-hidden="true" className="text-text-tertiary">
                    Experience node
                  </span>
                  <span aria-hidden="true" className="h-px w-lg bg-hairline" />
                  <span
                    data-testid="role-tenure"
                    className="text-accent-section"
                  >
                    {formatTenure(role.startDate, role.endDate)}
                  </span>
                </p>

                {/*
                  h3, not h2. The reference design makes each company a
                  section-level heading, but the page outline is
                  h1 > h2 (section) > h3 (employer) and `page.test.tsx` asserts
                  exactly four h2s. Visual weight comes from the type token.
                */}
                <h3
                  className="mt-xs text-scene font-extrabold text-text-primary"
                  data-testid="role-employer"
                >
                  {role.employer}
                </h3>

                <p
                  className="mt-xs text-body text-text-secondary"
                  data-testid="role-title"
                >
                  {role.title}
                </p>

                {role.skills === undefined ? null : (
                  <p
                    className="mt-sm flex flex-wrap gap-2xs"
                    data-testid="role-skills"
                  >
                    {role.skills.map((skill) => (
                      <span
                        key={skill}
                        className="lift px-xs py-2xs text-label font-bold text-text-tertiary uppercase"
                      >
                        {skill}
                      </span>
                    ))}
                  </p>
                )}

                {/*
                  Outside the bullet list on purpose — see the component doc
                  comment. A reviewer folding this into the list would silently
                  violate `requirements.md`; the test guards it.
                */}
                {role.subLine === undefined ? null : (
                  <p
                    data-testid="role-sub-line"
                    className="mt-sm text-meta text-text-secondary"
                  >
                    {role.subLine}
                  </p>
                )}
              </div>

              {/* Column two — what was achieved. */}
              <div className="panel panel-lit p-sm">
                {/*
                  Card topline. Decorative furniture from the reference: it
                  labels the card's purpose and stamps it with the scene
                  ordinal. Hidden from assistive technology — a screen reader
                  already has the employer heading and the bullet list, and
                  "MF / 01" would be noise.
                */}
                <p
                  aria-hidden="true"
                  className="mb-sm flex items-center justify-between text-label font-extrabold text-text-tertiary uppercase"
                >
                  <span>Selected impact</span>
                  <span>MF / {String(index + 1).padStart(2, '0')}</span>
                </p>

                {role.metric === undefined ||
                role.metricLabel === undefined ? null : (
                  <p
                    className="mb-sm flex items-end gap-xs border-b border-hairline pb-sm"
                    data-testid="role-metric"
                  >
                    <strong className="text-scene font-extrabold text-accent-section">
                      {role.metric}
                    </strong>
                    <span className="text-label font-bold text-text-tertiary uppercase">
                      {role.metricLabel}
                    </span>
                  </p>
                )}

                <BulletSlider
                  bullets={role.bullets}
                  employer={role.employer}
                  index={index}
                />
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
