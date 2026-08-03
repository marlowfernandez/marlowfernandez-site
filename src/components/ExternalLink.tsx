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
  className?: string;
}

/** Kept as a named export so tests assert the announcement, not a copy of it. */
export const NEW_TAB_ANNOUNCEMENT = '(opens in new tab)';

export function ExternalLink({ href, label, className }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="external-link"
      {...(className === undefined ? {} : { className })}
    >
      {label}{' '}
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
