# NFR Requirements — Questions

**Stage:** nfr-requirements · **Phase:** Construction · **Unit:** `site-shell-walking-skeleton`
**Record:** `aidlc/spaces/default/intents/260726-resume-site/`
**Consumes:** [requirements.md](../../../inception/requirements-analysis/requirements.md)

## Context

`functional-design` is SKIP for this scope, so its two artifacts are absent by design — NFR context is derived from `requirements.md` and the Inception design artifacts instead, per this stage's documented fallback.

These budgets are **site-wide**, not unit-specific (a Lighthouse score applies to the deployed site, not to one component group). Answers confirmed here apply to both units; the second unit's pass will not re-ask them.

Already fixed upstream, not re-asked here: WCAG 2.1 AA (Rough Mockups), TypeScript (Practices Discovery), Next.js/Tailwind/MDX/GitHub Pages (Feasibility + Application Design), and the CI gate composition (Practices Discovery Q3/Q6).

---

## Q1. Performance budget: what Lighthouse thresholds should CI enforce as a hard failure?

`team-practices.md` confirmed CI is the sole merge gate and that performance budgets must pass — this sets the actual numbers.

- A. Strict — Performance ≥95, Accessibility 100, Best Practices ≥95, SEO ≥95. Achievable for a static site this simple; leaves little slack.
- B. Solid — Performance ≥90, Accessibility ≥95, Best Practices ≥90, SEO ≥90. Comfortable margin, still strong.
- C. Lenient — all categories ≥80. Unlikely to ever block you, but weak as a real gate.
- X. Other (please specify)

[Answer]: B. Solid — Performance >=90, Accessibility >=95, Best Practices >=90, SEO >=90 *(2026-07-30T14:45:50Z)*

---

## Q2. Core Web Vitals: enforce specific field-metric budgets, or let the Lighthouse score cover it?

- A. Lighthouse score only — simpler, one number to watch, no separate metric thresholds
- B. Also enforce explicit budgets: LCP < 1.5s, CLS < 0.1, INP < 200ms — more precise, catches regressions the aggregate score can mask
- C. Not sure — recommend one
- X. Other (please specify)

[Answer]: C. Not sure — recommend one. Recommendation given and accepted: A, Lighthouse score only — for a static site shipping almost no JS, separate Web Vitals thresholds add CI config to maintain without catching much the aggregate score would miss *(2026-07-30T14:45:50Z)*

---

## Q3. Security headers: GitHub Pages can't set custom response headers (no CSP/HSTS via server config). How far should the site go within that limit?

The devsecops spoke flagged this constraint during Practices Discovery.

- A. Meta-tag CSP only — a `<meta http-equiv="Content-Security-Policy">` in the document head, the only mechanism GitHub Pages allows. Partial protection; can't set HSTS or frame-ancestors this way.
- B. Nothing — a fully static site with no forms, no auth, and no user input has minimal attack surface; skip the partial measure.
- C. Not sure — recommend one
- X. Other (please specify)

[Answer]: C. Not sure — recommend one. Recommendation given and accepted: A, meta-tag CSP — genuinely partial (no HSTS, no frame-ancestors possible on GitHub Pages), but costs one line and avoids an obviously absent CSP on a public site whose owner holds a security certification *(2026-07-30T14:45:50Z)*

---

## Q4. Bundle size: enforce a hard budget in CI, or just monitor it?

- A. Hard budget — CI fails if the JS bundle exceeds a set size (e.g. 100KB gzipped). Given the site ships almost no client JS (only the theme toggle), this should be trivially satisfiable and would catch accidental bloat.
- B. Monitor only — report the size, don't fail the build
- C. No bundle budget at all
- X. Other (please specify)

[Answer]: C. No bundle budget at all *(2026-07-30T14:45:50Z)*

---

## Assumptions & Open Questions

None yet — this file collects answers before any assumption is recorded.
