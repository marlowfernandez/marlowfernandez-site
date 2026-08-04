import { AIEngineeringSection } from '@/components/AIEngineeringSection';
import { ContactSection } from '@/components/ContactSection';
import { EducationSection } from '@/components/EducationSection';
import { ExperienceSection } from '@/components/ExperienceSection';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { RevealController } from '@/components/RevealController';
import { SceneNav } from '@/components/SceneNav';
import { aiEngineering, contact, education, experience, hero } from '@/content';

/**
 * The single page — full-width stacked scenes.
 *
 * Most components below are server components. `ThemeToggle` (in `Header`) and
 * `BulletSlider` (in `ExperienceSection`) are the two client islands.
 *
 * ## Section order, and why the old two-column trick is gone
 *
 * `user-flow.md`'s Key Decision Point requires that AI Engineering be
 * "reachable without requiring the visitor to first read the full Experience
 * history." The previous layout satisfied that with a deliberate mismatch: AI
 * Engineering first in the DOM, then `tablet:col-start-*` placing Experience
 * back in column one visually.
 *
 * That mismatch was safe only because neither section contained a focusable
 * element, and the old doc comment said so explicitly — "introducing a link
 * into either one would break it and requires revisiting this layout."
 * `BulletSlider`'s paging controls are exactly that, so the trick is removed
 * rather than patched around.
 *
 * Now **DOM order is visual order at every width**, and AI Engineering simply
 * comes second — right after the hero, before the Experience history. The
 * requirement is met by document order alone, which is a stronger guarantee
 * than the CSS swap it replaces, and WCAG 2.4.3 has nothing to trip over at
 * any breakpoint.
 *
 * `page.test.tsx` asserts both halves: the order, and the absence of any
 * reordering class that would reintroduce the mismatch.
 */
export default function HomePage() {
  return (
    <>
      <Header name={hero.name} contactInfo={contact.contact} />

      <main
        id="main-content"
        data-testid="main"
        // `canvas` supplies the layered background and the masked blueprint
        // grid; `flex-1` keeps the footer at the bottom on short pages.
        className="canvas flex-1"
      >
        {/*
          Hero carries no `data-reveal`: it is the LCP element, and starting it
          at opacity 0 would both delay that measurement and risk showing an
          empty first screen.
        */}
        <Hero name={hero.name} tagline={hero.tagline} />

        {/*
          No shared width container here, deliberately.

          Every section is full-bleed and owns a `.shell` wrapper for its own
          content. Wrapping them all in one narrow container instead put each
          scene's box at ~1265px, and since a scene clips its own decorative
          layers, the glow was cut off with a hard rectangular edge against the
          full-width background — visible as a box drawn around the content.

          Backgrounds must span the viewport; text must not. Those are two
          different widths, so they are two different elements.
        */}
        <AIEngineeringSection
          heading={aiEngineering.heading}
          items={aiEngineering.items}
          {...(aiEngineering.summary === undefined
            ? {}
            : { summary: aiEngineering.summary })}
        />

        <ExperienceSection
          heading={experience.heading}
          roles={experience.roles}
        />

        <EducationSection
          heading={education.heading}
          education={education.education}
        />

        {/*
          Same `contact.contact` object the Header above received — one
          source, two render sites, so the two copies cannot drift.
        */}
        <ContactSection
          heading={contact.heading}
          contactInfo={contact.contact}
        />
      </main>

      {/*
        One observer for every `[data-reveal]` on the page. Renders nothing;
        every other component stays a server component and opts in with the
        attribute alone.
      */}
      <RevealController />

      {/*
        Scene rail, counter, and progress bar. Derived from the `[data-snap]`
        elements rather than a manifest, so adding an employer cannot leave the
        rail showing one dot too few. Renders nothing until it finds them.
      */}
      <SceneNav />

      <Footer />
    </>
  );
}
