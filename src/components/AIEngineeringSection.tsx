import type { AIEngineeringItem } from '@/content/schema';

/**
 * The AI Engineering section.
 *
 * Server component — no `'use client'`.
 *
 * ADR-1 (`decisions.md`) settled the format after it had been deferred across
 * three stages: **plain text, comma-separated, and no links on any item** —
 * including no link to this project's own GitHub repository, which was
 * considered and explicitly declined at Application Design Q6 because it would
 * cross the line `requirements.md` Q8 drew (no cross-reference to this site's
 * own build process).
 *
 * Two consequences for anyone editing this file:
 *
 *   - The tagged-grid presentation was Option A in ADR-1 and was rejected. It
 *     implies each item has a linkable destination, which is not true yet.
 *   - Adding an anchor here is not a small styling change. It reverses a
 *     confirmed decision and also invalidates the DOM-order note in
 *     `page.tsx`, which relies on this section containing no focusable element
 *     for WCAG 2.4.3 to have nothing to trip over on wide screens.
 *
 * `AIEngineeringSection.test.tsx` asserts zero anchors render, so the decision
 * fails a test rather than drifting quietly.
 */
export interface AIEngineeringSectionProps {
  heading: string;
  items: AIEngineeringItem[];
  className?: string;
}

/** Exported so the test asserts the real separator rather than a copy of it. */
export const ITEM_SEPARATOR = ', ';

export function AIEngineeringSection({
  heading,
  items,
  className,
}: AIEngineeringSectionProps) {
  return (
    <section
      id="ai-engineering"
      aria-labelledby="ai-engineering-heading"
      data-testid="section-ai-engineering"
      data-reveal=""
      {...(className === undefined ? {} : { className })}
    >
      <h2
        id="ai-engineering-heading"
        className="text-label font-extrabold text-text-tertiary uppercase"
      >
        {heading}
      </h2>

      {/*
        One text node, not a list and not a grid. `items.join` rather than a
        mapped fragment per item keeps it literally plain text — there is no
        per-item element for a future edit to hang a link or a chip on.

        This is ADR-1, and it constrains the redesign rather than the other way
        round: the reference's chip grid was the rejected option. Scale it up
        with type, never by wrapping items in elements — `ai-engineering-items`
        is asserted to have zero element children.
      */}
      <p
        data-testid="ai-engineering-items"
        className="mt-sm text-lede text-text-primary"
      >
        {items.join(ITEM_SEPARATOR)}
      </p>
    </section>
  );
}
