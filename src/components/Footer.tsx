/**
 * Copyright line.
 *
 * Server component, no props (`components.md`, Public Interfaces).
 *
 * The year is evaluated at build time, not in the browser. Under
 * `output: 'export'` this component renders once during `next build`, so the
 * year is fixed into the HTML at deploy time rather than tracking the
 * visitor's clock. That is intentional — it keeps the markup identical for
 * every visitor and avoids a hydration mismatch — but it does mean the footer
 * year only advances when the site is rebuilt.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      data-testid="site-footer"
      className="mt-lg border-t border-border bg-surface"
    >
      <div className="mx-auto w-full max-w-5xl px-sm py-sm text-meta text-text-secondary">
        <p>&copy; {year} Marlow Fernandez</p>
      </div>
    </footer>
  );
}
