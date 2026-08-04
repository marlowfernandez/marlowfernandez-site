import type { EducationEntry } from '@/content/schema';

/**
 * The Education & Certification section.
 *
 * Server component — no `'use client'`.
 *
 * Renders `requirements.md`'s confirmed content: degree, school, year, GPA and
 * honours for the degree; the certification with its verification code. The
 * verification code is plain text, not a link to `verify.comptia.org` — the
 * requirements confirm the code, not a link, and this unit adds nothing they
 * do not name.
 */
export interface EducationSectionProps {
  heading: string;
  education: EducationEntry[];
  className?: string;
}

export function EducationSection({
  heading,
  education,
  className,
}: EducationSectionProps) {
  return (
    <section
      id="education"
      aria-labelledby="education-heading"
      data-testid="section-education"
      data-reveal=""
      data-snap=""
      className={className === undefined ? 'py-xl' : `py-xl ${className}`}
    >
      <div className="shell">
        <h2
          id="education-heading"
          className="text-label font-extrabold text-text-tertiary uppercase"
        >
          {heading}
        </h2>

        {/*
        Unordered: degree and certification are two independent credentials, not
        a sequence — unlike Experience, where order carries meaning.
      */}
        <ul className="mt-sm space-y-sm">
          {education.map((entry) => (
            <li
              key={`${entry.institution}|${entry.credential}`}
              data-testid="education-entry"
            >
              <h3
                className="text-body font-semibold text-text-primary"
                data-testid="education-credential"
              >
                {entry.credential}
              </h3>

              <p className="text-meta text-text-secondary">
                <span data-testid="education-institution">
                  {entry.institution}
                </span>
                {' · '}
                <span data-testid="education-year">{entry.year}</span>
              </p>

              {entry.detail === undefined ? null : (
                <p
                  data-testid="education-detail"
                  className="mt-xs text-meta text-text-secondary"
                >
                  {entry.detail}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
