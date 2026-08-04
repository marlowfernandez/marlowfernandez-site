/**
 * A link that leaves the site.
 *
 * Server component — it has no client-side state; the "opens in new tab"
 * announcement is static markup, not behaviour.
 *
 * Three things it guarantees, per `interaction-spec.md`:
 *   - `target="_blank"`, confirmed at `refined-mockups` Q4.
 *   - `rel="noopener noreferrer"`. `noopener` prevents the opened page from
 *     reaching back through `window.opener`; `noreferrer` also suppresses the
 *     `Referer` header. Required independently of accessibility.
 *   - The new-tab behaviour is announced *before* activation, not discovered
 *     after it, via visually-hidden text inside the link's accessible name.
 */
export interface ExternalLinkProps {
  href: string;
  label: string;
  /**
   * Decorative label rendered above `label`. Excluded from the accessible name
   * via `aria-hidden`, so adding one cannot change what a screen reader
   * announces.
   */
  eyebrow?: string;
  /**
   * Decorative glyph rendered before the label. Presentational only — the
   * icon components already carry `aria-hidden`, so it adds nothing to the
   * accessible name.
   */
  icon?: React.ReactNode;
  className?: string;
}

/** Kept as a named export so tests assert the announcement, not a copy of it. */
export const NEW_TAB_ANNOUNCEMENT = '(opens in new tab)';

export function ExternalLink({
  href,
  label,
  eyebrow,
  icon,
  className,
}: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="external-link"
      {...(className === undefined ? {} : { className })}
    >
      {/*
        Optional eyebrow, e.g. "LinkedIn" above the handle on a contact tile.
        Deliberately NOT `aria-hidden`: it names the destination, so hiding it
        would leave a screen reader announcing "/in/marlowf, opens in new tab"
        — the visual treatment would be carrying meaning that assistive
        technology never receives. It joins the accessible name instead,
        giving "LinkedIn /in/marlowf (opens in new tab)".
      */}
      {icon}
      {eyebrow === undefined ? null : (
        <>
          <span className="contact-tile-label">{eyebrow}</span>{' '}
        </>
      )}
      <span
        className={eyebrow === undefined ? undefined : 'contact-tile-value'}
      >
        {label}
      </span>{' '}
      {/*
        Inside the anchor so it becomes part of the computed accessible name —
        a screen reader reads "LinkedIn, opens in new tab" when the link takes
        focus. A sibling element outside the anchor, or a `title`, would only
        be reachable after activation.

        The separating space is a text node of the anchor rather than the first
        character of the span: accessible-name computation trims each node's
        own text, so a leading space inside the span is discarded and the two
        parts run together.
      */}
      <span className="sr-only">{NEW_TAB_ANNOUNCEMENT}</span>
    </a>
  );
}
