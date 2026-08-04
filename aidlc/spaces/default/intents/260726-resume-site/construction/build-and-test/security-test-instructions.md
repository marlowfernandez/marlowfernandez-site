# Security Test Instructions — marlowfernandez.com

**Intent:** `260726-resume-site` · **Stage:** build-and-test
**Consumes:** both units' [code-summary.md](../site-shell-walking-skeleton/code-generation/code-summary.md), and [security-requirements.md](../site-shell-walking-skeleton/nfr-requirements/security-requirements.md)

Authored with `aidlc-devsecops-agent`'s perspective as the stage's declared support role.

## The Attack Surface Is Deliberately Almost Nothing

| Surface | Present? |
|---|---|
| Authentication / authorization | No — no accounts |
| User input / forms | No — contact is a `mailto:` link |
| Database / data store | No — content resolves at build time |
| Server-side execution | No — static export, no runtime |
| Third-party client scripts | No — no analytics, no embeds |

What remains: the served static files, the two domains' DNS/TLS, and the repository's own supply chain. Test effort belongs there, not on injection or authz suites that have no target.

## 1. Secret Scanning — Two Independent Layers (Mandated)

`project.md` mandates both, and the repository is public by design:

```bash
gitleaks detect --source . --verbose   # local pre-commit
```

Plus GitHub push protection server-side. Two layers because there is no second reviewer to catch a leaked credential before exposure.

**Verify the resume PDF stays out of the repo:**

```bash
git check-ignore -v Marlow_Fernandez_Resume.pdf   # must print the .gitignore rule
```

The site's *content* is confirmed public; the raw PDF was a separate decision and is deliberately gitignored.

## 2. Dependency Scanning

```bash
npm audit
```

**Current state: 3 high severity, none fixable** — postcss and sharp, both inside `next@16.2.12`'s own tree. `npm audit fix --force` proposes downgrading Next to 9.3.3. ESLint 10 would clear a fourth chain but breaks `eslint-config-next@16.2.12` (verified).

Per `project.md`: **every dependency update is manually reviewed before merge — no auto-merge at any tier, patch included.** So `npm audit` in CI should report, not auto-remediate.

## 3. CSP Verification

The policy is delivered by `<meta http-equiv>` from `src/lib/csp.ts`. Verify it survives into the export:

```bash
grep -o 'Content-Security-Policy[^>]*' out/index.html
```

**Known weaknesses — verify these are still accurately documented rather than treating them as bugs to fix:**

| Gap | Why it cannot be closed on this stack |
|---|---|
| `script-src` needs `'unsafe-inline'` | 12 inline `__next_f.push` scripts in the export. A nonce needs a server; CSP3 makes browsers ignore `'unsafe-inline'` once any hash is present, so a partial hash list breaks the page rather than degrading |
| `style-src` needs `'unsafe-inline'` | Next emits inline `style=` attributes; `out/404.html` also carries an injected `<style>` block |
| Meta tag is not first in `<head>` | Next hoists its stylesheet and five `<script src>` tags above it. They are same-origin and `'self'` would permit them, so nothing breaks — but "declare CSP first" is unachievable here |
| No `frame-ancestors`, no HSTS | Meta-delivered CSP ignores `frame-ancestors` per spec; GitHub Pages permits no custom response headers at all |

All four are hosting-platform limits, not implementation gaps. The residual risk is bounded by the same fact throughout: **no user input, no forms, no third-party content — no path exists for an attacker-controlled string to reach the document.**

## 4. Transport

After deployment (`deployment-execution`, 4.3):

```bash
curl -sI https://marlowfernandez.com | head -20
curl -sI https://marlow.software | head -20   # expect 301 -> canonical
```

Sequencing constraint from `raid-log.md` D1: DNS must resolve to GitHub Pages **before** "Enforce HTTPS" is enabled, or certificate provisioning fails.

## 5. SAST / DAST — Deliberately Not Adopted

No CodeQL/SonarQube/Snyk. The devsecops spoke's assessment at Practices Discovery: wrong scale for a static content site with no business logic. ESLint's security-relevant rules (React XSS patterns, `jsx-a11y`) are the right-sized substitute. **DAST is not applicable at all** — there is no running server to probe.

## Assumptions & Open Questions

The CSP weaknesses above are documented in `src/lib/csp.ts` and both units' `code-summary.md`, but `security-requirements.md` still records only the `frame-ancestors` and HSTS limits — the `script-src`/`style-src`/head-order gaps are not yet reflected there. That is a live documentation gap carried from Code Generation.
