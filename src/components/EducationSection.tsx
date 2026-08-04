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
          Unordered: degree and certification are two independent credentials,
          not a sequence — unlike Experience, where order carries meaning.

          Each credential is a panel rather than a run of text. The section was
          previously a few lines of small type inside a viewport-tall scene,
          which read as an afterthought; giving each entry its own surface lets
          it hold the space the scene allocates it.
        */}
        <ul className="mt-lg grid gap-md desktop:grid-cols-2">
          {education.map((entry, index) => (
            <li
              key={`${entry.institution}|${entry.credential}`}
              data-testid="education-entry"
              data-accent={index % 2 === 0 ? 'cyan' : 'violet'}
              className="panel panel-lit p-md"
            >
              <p className="text-label font-extrabold text-accent-section uppercase">
                <span aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>{' '}
                <span data-testid="education-year">{entry.year}</span>
              </p>

              <h3
                className="mt-sm text-scene font-extrabold text-text-primary"
                data-testid="education-credential"
              >
                {entry.credential}
              </h3>

              <p className="mt-xs text-body text-text-secondary">
                <span data-testid="education-institution">
                  {entry.institution}
                </span>
              </p>

              {entry.detail === undefined ? null : (
                <p
                  data-testid="education-detail"
                  className="lift mt-md inline-block px-sm py-xs text-meta text-text-tertiary"
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
