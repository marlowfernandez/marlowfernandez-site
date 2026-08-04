/**
 * The page's primary heading: name plus role tagline.
 *
 * Server component. This `h1` is the page's only one
 * (`accessibility-checklist.md`, Structure) — the header's name is a plain
 * `span`, and every section below uses `h2`.
 *
 * ## The two-tone name
 *
 * The given name renders in a muted colour and the surname at full contrast,
 * which is what gives the display type its depth. The reference achieves this
 * with `-webkit-text-stroke` over `color: transparent`, and that is
 * deliberately not copied: a transparent foreground makes contrast
 * unverifiable — axe reads `rgba(0,0,0,0)` and reports "incomplete" rather
 * than passing or failing — so real content would be shipped with nothing
 * having checked it. A solid `--token-display-ghost` gives the same effect at
 * a measured 3.2:1, clear of the 3:1 large-text threshold.
 *
 * The two words stay inside one `h1` with a real space between them, so the
 * accessible name is still "Marlow Fernandez" rather than "MarlowFernandez" —
 * `shell.test.tsx` asserts the full name via normalised text content.
 *
 * ## No reveal
 *
 * This section is deliberately excluded from the scroll-reveal treatment: it
 * is the LCP element, and starting it at `opacity: 0` would both delay that
 * measurement and risk an empty first screen.
 */
export interface HeroProps {
  name: string;
  tagline: string;
}

/** Splits on the first space only, so multi-word surnames stay together. */
function splitName(name: string): { first: string; rest: string } {
  const index = name.indexOf(' ');
  if (index === -1) return { first: name, rest: '' };
  return { first: name.slice(0, index), rest: name.slice(index + 1) };
}

export function Hero({ name, tagline }: HeroProps) {
  const { first, rest } = splitName(name);

  return (
    <section
      data-testid="hero"
      data-snap=""
      className="scene relative pt-2xl pb-xl"
      aria-labelledby="hero-name"
    >
      {/* Decorative: two drifting light sources behind the name. */}
      <span
        aria-hidden="true"
        className="orb orb-drift right-[-8vw] top-[6vh] w-[min(57vw,760px)]"
      />
      <span
        aria-hidden="true"
        className="orb bottom-[-14vw] right-[18vw] w-[33vw] opacity-70"
        style={{ ['--accent' as string]: 'var(--token-accent-violet)' }}
      />

      <div className="shell">
        <p className="flex items-center gap-xs text-label font-extrabold text-text-tertiary uppercase">
          <span aria-hidden="true" className="availability-dot" />
          Software Engineering Leader
        </p>

        <h1
          id="hero-name"
          data-testid="hero-name"
          className="mt-sm text-display font-extrabold text-text-primary"
        >
          {rest === '' ? (
            name
          ) : (
            <>
              {/*
                The space between the two spans is a real text node of the h1,
                not inside either span — accessible-name computation trims
                per-node text, so nesting it would produce "MarlowFernandez".
              */}
              <span className="text-display-ghost">{first}</span>{' '}
              <span className="block">{rest}</span>
            </>
          )}
        </h1>

        <p
          data-testid="hero-tagline"
          className="mt-md max-w-[46ch] text-lede text-text-secondary"
        >
          {tagline}
        </p>
      </div>
    </section>
  );
}
