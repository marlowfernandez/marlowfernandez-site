# Tech Stack Decisions — site-shell-walking-skeleton

**Intent:** `260726-resume-site` · **Stage:** nfr-requirements · **Unit:** `site-shell-walking-skeleton`
**Consumes:** [requirements.md](../../../inception/requirements-analysis/requirements.md)

`business-logic-model.md` and `business-rules.md` are absent by design (`functional-design` is SKIP for this composed scope). Per this stage's Step 2 fallback, stack rationale derives from `requirements.md` and the gated Inception decisions rather than inventing the missing artifacts' content — the same handling applied in this stage's two sibling artifacts.

Every stack choice below was decided and gated at an earlier stage. This artifact **records** them with their NFR rationale for the Construction phase to build against — it does not re-open them. Re-deciding a gated choice here would be scope drift, not diligence.

## Confirmed Stack

| Layer | Choice | Decided at | NFR rationale |
|---|---|---|---|
| Framework | Next.js, static export (`output: 'export'`) | Feasibility Q1 | Pre-renders every page at build time — no server round-trip, which is what makes the Performance ≥90 budget straightforward |
| Language | TypeScript | Practices Discovery Q8 | Compile-time type checking; also a deliberate skill signal on a public recruiter-facing repo |
| Styling | Tailwind CSS | Application Design Q3 (ADR-3) | Utility classes compile to a minimal CSS bundle; tokens come from `design-system-mapping.md`, not re-derived |
| Content | MDX | Application Design Q2 (ADR-2) | Build-time resolution — no runtime content fetching, no client-side parsing cost |
| Hosting | GitHub Pages | Feasibility Q3 | $0, free for public repos; the constraint behind the security-header limits recorded in `security-requirements.md` |
| Canonical DNS | Hostinger → GitHub Pages | Feasibility Q3 | — |
| Redirect | `marlow.software` → Hostinger registrar 301 | Feasibility Q7 | Handled entirely outside this codebase; no application-level redirect logic to build or maintain |
| Fonts | System-font stack | Refined Mockups (`design-system-mapping.md`) | No webfont request, no loading flash — directly supports the Performance budget and the Q1 "no special states" decision |

## Build & Quality Tooling

| Tool | Purpose | Source |
|---|---|---|
| ESLint | Lint; runs pre-commit and in CI | `team-practices.md` (Practices Discovery Q7 — both layers) |
| Prettier | Format; runs pre-commit | `team-practices.md` Code Style |
| gitleaks | Secret scan, pre-commit | `discovered-rules.md` Mandated (Q10) |
| GitHub push protection | Secret scan, server-side second layer | `discovered-rules.md` Mandated (Q10) |
| Lighthouse CI | Enforces the thresholds in `performance-requirements.md` | This stage, Q1 |
| Link checker | Verifies links resolve | `team-practices.md` Testing Posture |
| Content-schema validation | Validates MDX frontmatter shape | `team-practices.md` (Practices Discovery Q5) |
| Theme-toggle check | State persists, focus visible, contrast holds in both themes | `team-practices.md` (Practices Discovery Q4) |

## Explicitly Not Used

Recorded so a later stage doesn't reintroduce them by assumption:

- **No AWS**, no cloud platform services — this project has no cloud component (`services.md`, ADR-6).
- **No test-coverage percentage floor** — `org.md`'s 80% default was explicitly dropped as a poor fit for a content site with near-zero business logic (Practices Discovery Q3); the CI gate composition replaces it.
- **No bundle-size budget** (this stage, Q4).
- **No separate Core Web Vitals thresholds** (this stage, Q2).
- **No analytics, no form handler, no backend** (Feasibility Q6).

## Assumptions & Open Questions

None. Every row cites the stage that decided it.
