import { AIEngineeringSection } from '@/components/AIEngineeringSection';
import { ContactSection } from '@/components/ContactSection';
import { EducationSection } from '@/components/EducationSection';
import { ExperienceSection } from '@/components/ExperienceSection';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { aiEngineering, contact, education, experience, hero } from '@/content';

/**
 * The single page. Direction C — minimal, no navigation.
 *
 * Every component below is a server component; the only client-side JavaScript
 * on the page comes from `ThemeToggle` inside `Header`.
 *
 * ## Section order — the one layout rule that is not a preference
 *
 * `mockups.md` locks two different orderings:
 *   - mobile (<768px):  AI Engineering **before** Experience, single column.
 *   - tablet/desktop:   two columns, Experience **left**, AI Engineering right.
 *
 * The mobile order is the load-bearing one — it traces to `user-flow.md`'s Key
 * Decision Point, that AI Engineering "must be reachable without requiring the
 * visitor to first read the full Experience history."
 *
 * So AI Engineering comes first in the DOM, which makes the mobile layout pure
 * document order with no CSS reordering at the most constrained viewport. From
 * `tablet:` up, explicit grid placement puts Experience back in column one.
 *
 * That does leave DOM order and visual order disagreeing on wide screens.
 * Deliberate, and safe here specifically because neither section contains a
 * focusable element — ADR-1 removed every link from AI Engineering, and
 * Experience is prose — so WCAG 2.4.3 (focus order) has nothing to trip over.
 * Unit 2 kept both sections link-free, so this still holds; introducing a link
 * into either one would break it and requires revisiting this layout.
 *
 * `page.test.tsx` asserts the DOM order and the grid-placement classes, since
 * this ordering was silently inverted once at an earlier stage.
 */
export default function HomePage() {
  return (
    <>
      <Header name={hero.name} contactInfo={contact.contact} />

      <main id="main-content" data-testid="main" className="flex-1">
        <Hero name={hero.name} tagline={hero.tagline} />

        <div className="mx-auto w-full max-w-5xl px-sm py-md">
          <div className="grid grid-cols-1 gap-lg tablet:grid-cols-2">
            <AIEngineeringSection
              heading={aiEngineering.heading}
              items={aiEngineering.items}
              className="tablet:col-start-2 tablet:row-start-1"
            />

            <ExperienceSection
              heading={experience.heading}
              roles={experience.roles}
              className="tablet:col-start-1 tablet:row-start-1"
            />
          </div>

          <EducationSection
            heading={education.heading}
            education={education.education}
            className="mt-lg"
          />

          {/*
            Same `contact.contact` object the Header above received — one
            source, two render sites, so the two copies cannot drift.
          */}
          <ContactSection
            heading={contact.heading}
            contactInfo={contact.contact}
            className="mt-lg"
          />
        </div>
      </main>

      <Footer />
    </>
  );
}
