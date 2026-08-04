import { ExternalLink } from '@/components/ExternalLink';
import type { ContactInfo } from '@/content/schema';

/**
 * The end-of-page contact call-to-action.
 *
 * Server component — no `'use client'`.
 *
 * This repeats the header's contact details on purpose: `mockups.md` notes that
 * "a visitor who scrolled the whole page shouldn't have to scroll back up to
 * find contact info."
 *
 * **The two copies read one object.** `ContactSection` takes the same
 * `ContactInfo` prop shape as `Header` (`components.md`, Public Interfaces),
 * and `page.tsx` passes both the single `contact.contact` value parsed from
 * `src/content/contact.mdx`. There is no second place to edit and therefore no
 * way for the header and the footer call-to-action to disagree.
 *
 * Treatment matches the header's, for the same confirmed reasons:
 *   - email as a `mailto:` link (`feasibility-assessment.md`'s no-form decision)
 *   - phone as plain text, not `tel:` (requirements-analysis Q1)
 *   - LinkedIn through `ExternalLink`, which owns `rel="noopener noreferrer"`
 *     and the "opens in new tab" announcement
 *
 * The `min-h-11` on each interactive item is the 44x44px minimum tappable area
 * from `accessibility-checklist.md`; this section's links sit in a wrapping row
 * where line-height alone would leave them short of it.
 */
export interface ContactSectionProps {
  heading: string;
  contactInfo: ContactInfo;
  className?: string;
}

const ITEM_CLASS = 'inline-flex min-h-11 items-center';

export function ContactSection({
  heading,
  contactInfo,
  className,
}: ContactSectionProps) {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      data-testid="section-contact"
      data-reveal=""
      {...(className === undefined ? {} : { className })}
    >
      <h2
        id="contact-heading"
        className="text-h2 font-semibold text-text-primary"
      >
        {heading}
      </h2>

      <ul className="mt-xs flex flex-wrap items-center gap-x-sm text-body">
        <li>
          <a
            href={`mailto:${contactInfo.email}`}
            data-testid="contact-email"
            className={ITEM_CLASS}
          >
            {contactInfo.email}
          </a>
        </li>

        <li>
          <span
            data-testid="contact-phone"
            className={`${ITEM_CLASS} text-text-primary`}
          >
            {contactInfo.phone}
          </span>
        </li>

        <li>
          <ExternalLink
            href={contactInfo.linkedInUrl}
            label="LinkedIn"
            className={ITEM_CLASS}
          />
        </li>
      </ul>
    </section>
  );
}
