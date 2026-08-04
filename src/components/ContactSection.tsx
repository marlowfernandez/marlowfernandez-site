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

/**
 * Shared by all three contact items.
 *
 * `min-h-11` is the 44px touch target and is asserted — keep it. The rest is
 * the redesign's tile treatment; adding to this string is safe, removing
 * `min-h-11` is not.
 */
const ITEM_CLASS = 'contact-tile lift flex min-h-11 flex-col justify-center';

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
      data-snap=""
      /*
       * `scene` is load-bearing here, not decoration: it carries
       * `overflow-x: clip`, and the orb below is deliberately positioned past
       * the right edge. Without it the orb widens the document and the page
       * gains a horizontal scrollbar — a WCAG 1.4.10 reflow failure.
       */
      className={
        className === undefined
          ? 'scene relative py-xl'
          : `scene relative py-xl ${className}`
      }
    >
      {/* Decorative: the closing scene gets its own light source. */}
      <span
        aria-hidden="true"
        className="orb orb-drift right-[-10vw] top-[-6vw] w-[min(48vw,620px)]"
      />

      <div className="shell">
        <h2
          id="contact-heading"
          className="text-label font-extrabold text-text-tertiary uppercase"
        >
          {heading}
        </h2>

        {/*
          The closing statement, at display scale. This scene is the last thing
          a reader sees and gets a full viewport like every other; previously
          it held one small line of links and read as a footer that had wandered
          up the page.

          `aria-hidden` on the decorative half: it is presentation, and the
          section already has its accessible name from the h2 above.
        */}
        <p
          aria-hidden="true"
          className="mt-md max-w-[18ch] text-display font-extrabold text-text-primary"
        >
          Let&apos;s <span className="text-display-ghost">talk.</span>
        </p>

        <ul className="mt-xl grid gap-sm tablet:grid-cols-2 desktop:max-w-[62ch]">
          <li>
            <a
              href={`mailto:${contactInfo.email}`}
              data-testid="contact-email"
              className={ITEM_CLASS}
            >
              <span className="contact-tile-label">Email</span>
              <span className="contact-tile-value">{contactInfo.email}</span>
            </a>
          </li>

          {contactInfo.phone === undefined ? null : (
            <li>
              <span
                data-testid="contact-phone"
                className={`${ITEM_CLASS} text-text-primary`}
              >
                <span className="contact-tile-label">Phone</span>
                <span className="contact-tile-value">{contactInfo.phone}</span>
              </span>
            </li>
          )}

          <li>
            <ExternalLink
              href={contactInfo.linkedInUrl}
              label="/in/marlowf"
              eyebrow="LinkedIn"
              className={ITEM_CLASS}
            />
          </li>
        </ul>
      </div>
    </section>
  );
}
