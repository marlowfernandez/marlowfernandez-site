/**
 * The page's primary heading: name plus role tagline.
 *
 * Server component. This `h1` is the page's only one
 * (`accessibility-checklist.md`, Structure) — the header's name is a plain
 * `span`, and every section below uses `h2`.
 */
export interface HeroProps {
  name: string;
  tagline: string;
}

export function Hero({ name, tagline }: HeroProps) {
  return (
    <section
      data-testid="hero"
      className="border-b border-border px-sm py-md"
      aria-labelledby="hero-name"
    >
      <div className="mx-auto w-full max-w-5xl">
        <h1
          id="hero-name"
          data-testid="hero-name"
          className="text-h1 font-semibold tracking-tight text-text-primary"
        >
          {name}
        </h1>
        <p
          data-testid="hero-tagline"
          className="mt-xs text-body text-text-secondary"
        >
          {tagline}
        </p>
      </div>
    </section>
  );
}
