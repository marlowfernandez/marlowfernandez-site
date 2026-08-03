/**
 * Content Security Policy, delivered as a `<meta http-equiv>` tag.
 *
 * `security-requirements.md` Q3 confirms the meta-tag mechanism, and already
 * records the two controls this host cannot provide. Those are restated here
 * next to the code so nobody "fixes" the gaps by adding directives that are
 * silently ignored:
 *
 *   - `frame-ancestors` is ignored in a meta tag by specification (it requires
 *     a real response header). GitHub Pages cannot set response headers, so
 *     clickjacking protection is not achievable on this host. It is omitted
 *     rather than included-and-inert, so nobody reads it and believes it works.
 *   - HSTS is not a CSP directive at all and is likewise unsettable.
 *     "Enforce HTTPS" in the repository settings is the whole of the transport
 *     control available here.
 *
 * ## `'unsafe-inline'` in `script-src` AND `style-src` — real weakenings,
 * ## stated plainly
 *
 * Both directives below carry `'unsafe-inline'`. Two separate allowances, one
 * shared reason, so they are stated together rather than one being treated as
 * the interesting case and the other as a footnote.
 *
 * `script-src`: the App Router streams its React Server Component payload to
 * the client as inline `<script>self.__next_f.push(...)</script>` tags in the
 * exported HTML. Those tags are generated per build by the framework.
 *
 * `style-src`: Next emits inline `style="..."` attributes for its own layout
 * primitives, and the `404.html` that static export always produces carries a
 * `<style>` block injected via `dangerouslySetInnerHTML`. Under a strict
 * `style-src 'self'` those are dropped and the affected markup renders
 * unstyled. Tailwind's own output is a real stylesheet file and needs none of
 * this — the allowance exists purely for framework-generated inline style.
 *
 * The two ways to allow inline content without `'unsafe-inline'` are
 * unavailable here, identically for both directives:
 *   - A nonce must be minted per response, which needs a server. There is
 *     none (`output: 'export'`, ADR-6).
 *   - Hashes would have to cover every framework-generated inline script and
 *     style block, and be recomputed on every build. Worse, CSP Level 3 makes
 *     a browser IGNORE `'unsafe-inline'` whenever a hash or nonce is present,
 *     so a partial hash list does not degrade gracefully — it breaks the page.
 *
 * So `'unsafe-inline'` stays on both, and the residual risk is stated rather
 * than papered over. What limits that risk on this specific site: no user
 * input, no forms, no query-string handling, no third-party scripts, and no
 * runtime data source (`security-requirements.md`, "Threat Surface"). There is
 * no injection path for an attacker-controlled string to reach the document.
 * Both directives are doing real work against *external* script and stylesheet
 * loading, which `'self'` still restricts; it is only the inline channel that
 * stays open.
 *
 * If this ever changes — an analytics snippet, an embed, anything rendering
 * untrusted content — the host must move somewhere that can set headers.
 */
const DIRECTIVES: Record<string, string> = {
  'default-src': "'self'",
  // See the module note. `'self'` still blocks external script origins.
  'script-src': "'self' 'unsafe-inline'",
  // See the module note. Not incidental: Next's inline `style="..."` and the
  // `<style>` block in the generated `404.html` both depend on this.
  'style-src': "'self' 'unsafe-inline'",
  'img-src': "'self' data:",
  'font-src': "'self'",
  // No runtime data source of any kind: the site is fully pre-rendered.
  'connect-src': "'self'",
  // No forms exist. Contact is a `mailto:` link (Feasibility Q6).
  'form-action': "'none'",
  'frame-src': "'none'",
  'object-src': "'none'",
  'base-uri': "'self'",
  'upgrade-insecure-requests': '',
};

export const CONTENT_SECURITY_POLICY = Object.entries(DIRECTIVES)
  .map(([directive, value]) =>
    value === '' ? directive : `${directive} ${value}`,
  )
  .join('; ');
