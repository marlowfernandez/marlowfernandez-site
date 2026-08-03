# Security Requirements — site-shell-walking-skeleton

**Intent:** `260726-resume-site` · **Stage:** nfr-requirements · **Unit:** `site-shell-walking-skeleton`
**Consumes:** [requirements.md](../../../inception/requirements-analysis/requirements.md)

`business-logic-model.md` and `business-rules.md` are absent by design (`functional-design` is SKIP). Security context derives from `requirements.md`, `constraint-register.md`, and `discovered-rules.md` per this stage's Step 2 fallback.

## Threat Surface — Deliberately Minimal

| Attack surface | Present? | Why |
|---|---|---|
| Authentication / authorization | No | No accounts, no login — nothing to authenticate |
| User input / form handling | No | Contact is a `mailto:` link, not a form (`requirements.md`, confirmed at Feasibility Q6) |
| Database / data store | No | Content resolved at build time from MDX (`decisions.md` ADR-2) |
| Server-side execution | No | Static export to GitHub Pages; no runtime services (`services.md`) |
| Third-party client scripts | No | No analytics, no embeds confirmed for v1 |

The residual surface is: the served static files themselves, the two domains' DNS/TLS configuration, and the repository's own supply chain.

## Content Security Policy

Confirmed at Q3: a **`<meta http-equiv="Content-Security-Policy">` tag** in the document head.

**Explicitly partial, stated plainly rather than overclaimed:** GitHub Pages serves static files and does not permit custom response headers. This means:
- CSP delivered by meta tag **works** for directives like `default-src`, `script-src`, `style-src`, `img-src`.
- `frame-ancestors` **does not work** via meta tag (spec requires a real header) — so clickjacking protection is not achievable on this host.
- **HSTS is not settable** at all. GitHub Pages does enforce HTTPS when "Enforce HTTPS" is enabled, but without an HSTS header there is no browser-side strict-transport pinning.

This is a hosting-platform limitation, not an implementation gap. If these controls ever become required, the host must change — that is the honest tradeoff of the $0/GitHub Pages decision confirmed at Feasibility.

## Transport Security

- HTTPS enforced on `marlowfernandez.com` via GitHub Pages' automatic Let's Encrypt certificate (per `feasibility-assessment.md`).
- `marlow.software` redirects at the Hostinger registrar level; its TLS is Hostinger's responsibility, not this repository's.
- Sequencing constraint carried from `raid-log.md` (D1): DNS must resolve correctly to GitHub Pages *before* "Enforce HTTPS" is enabled, or certificate provisioning fails.

## Supply Chain & Secrets

Both are already Mandated/Forbidden rules promoted into `project.md` at Practices Discovery — restated here as the security requirements they are, not re-decided:

- **No secrets of any kind** in code, commit messages, issues, PRs, or CI logs. Enforced by two independent layers: GitHub push protection plus a local `gitleaks` pre-commit hook.
- **No dependency auto-merge** — every update reviewed manually before merge, at every tier.
- Third-party GitHub Actions should be pinned to a commit SHA rather than a mutable tag (devsecops spoke recommendation, `contributions/aidlc-devsecops-agent.md`).

## Public-Disclosure Posture (not a vulnerability — a confirmed decision)

`requirements.md` confirms the site publishes a real employer name, a specific transaction-volume figure, named government/defense clients, a security clearance, and a personal phone number — all knowingly reconfirmed at that stage's Q9 after the permanent/indexed distinction was made explicit. This is recorded here so a future security review reads it as a **deliberate, informed disclosure decision** rather than an accidental data exposure to be "fixed."

## Assumptions & Open Questions

- Point & Pay's own policy on employee public disclosure of the figures/system details remains unverified — surfaced and knowingly declined at `requirements.md` Q9-C. Carried forward, not resolved.
