# Phase Boundary Verification — Construction → Operation

**Intent:** `260726-resume-site` · Run at `ci-pipeline`, the last executing CONSTRUCTION stage for this composed scope (`next_stage` is `deployment-pipeline` (4.1), in OPERATION).

The standard Construction→Operation check is: **architecture → code → tests alignment, all code traces to design, test coverage against acceptance criteria.**

## Architecture → Code Traceability

Every component in `components.md` exists in the codebase, and every source file traces back to a named component:

| Component (Application Design) | Implementation | Unit |
|---|---|---|
| `ThemeToggle` | `src/components/ThemeToggle.tsx` | 1 |
| `ExternalLink` | `src/components/ExternalLink.tsx` | 1 |
| `Header` / `Hero` / `Footer` (shell) | `src/components/` shell modules | 1 |
| `ExperienceSection` | `src/components/ExperienceSection.tsx` | 2 |
| `AIEngineeringSection` | `src/components/AIEngineeringSection.tsx` | 2 |
| `EducationSection` | `src/components/EducationSection.tsx` | 2 |
| `ContactSection` | `src/components/ContactSection.tsx` | 2 |
| Content model | `src/content/schema.ts` + five `.mdx` files | 1 (schema), 2 (content) |

**Consistent.** No orphaned source file, no undelivered component.

`ExternalLink` deserves a note: it was **omitted from all five application-design artifacts** during that stage and added only after a reviewer pass caught it. It is present in code, in the design artifacts, and under test. Recorded here because the phase check is the last place a gap of that shape could still be caught.

## ADR Conformance

The six ADRs in `decisions.md` are honoured by the built system, and two are load-bearing on this stage's own work:

- **ADR-6 "No Runtime Services"** — `output: 'export'` in `next.config.mjs`; the build emits static HTML only, and the pipeline deploys files rather than starting a process. `verify` has no service dependencies and no environment variables.
- **The static-export constraint propagates into CI's own limits**, which is why `security-test-instructions.md`'s CSP weaknesses (`script-src`/`style-src` needing `'unsafe-inline'`, no `frame-ancestors`, no HSTS) are hosting-platform facts rather than defects the pipeline could gate away. No CI check can close them; none pretends to.

## Tests → Acceptance Criteria

`team.md` deliberately sets **no numeric coverage floor** — the posture is a named check set, since a static content export has no branching business logic to cover. Each named check has a corresponding test, and all pass:

| `team.md` requirement | Test | Status |
|---|---|---|
| Build succeeds | `npm run build` | ✅ 3/3 pages |
| Links resolve | lychee in `verify` | ✅ wired |
| Accessibility/performance budgets | Lighthouse in `verify` | ✅ wired **and measured** |
| Theme toggle behavior | `ThemeToggle.test.tsx`, `theme.test.ts`, `theme-variant.test.ts` | ✅ |
| Content-schema validation | `schema.test.ts` | ✅ |

**110/110 tests pass.** The pipeline runs this same set in both layers.

## Gaps Closed at This Boundary

Two items the previous stage flagged as open are resolved:

1. **Lighthouse budgets were confirmed but never measured** (`build-and-test-summary.md` item 1; `build-test-results.md` "Not Executed Here"). **Now measured:** Performance 100, Accessibility 100, Best Practices 96, SEO 100 — all four above threshold on the stricter mobile profile.
2. **Manual WCAG items had no downstream owner** (item 2). **Now decided rather than deferred:** ci-pipeline Q2 accepted the gap explicitly. The consequence is binding and recorded in `quality-gates.md` — this project makes **no WCAG 2.1 AA conformance claim**, only a Lighthouse budget claim.

## Contradictions Found and Resolved

The phase check is where inherited contradictions must surface rather than pass through:

- **`out/404.html` vs. Refined Mockups Q1.** The locked decision said "no custom 404"; the static export emits one unconditionally. Resolved at Q4 by **amending the decision** to keep Next's 404, recorded as an amendment rather than applied silently. No longer contradictory.
- **`project.md` self-contradiction on gating.** One Mandated bullet called CI "the only gate" while two others mandated local pre-commit hooks. Resolved at Q1a by striking "only" and recording the two-layer reality. No longer contradictory.
- **"CI gates the merge" described a boundary that does not exist.** Direct commits to `main` mean no merge to gate. Corrected to what CI actually gates: the deploy.

## Known Open Items Crossing Into Operation

Carried forward deliberately, not silently:

| Item | Owner |
|---|---|
| ~~`gitleaks` not installed~~ — **corrected 2026-08-04**: 8.30.1 was already installed; the check tested `PATH`, not installation. Gate 1 is operative | Closed |
| `core.hooksPath` must be set per clone | Same |
| Workflow has never executed on GitHub runners | First push |
| GitHub Pages must be set to **Source: GitHub Actions** | `deployment-pipeline` (4.1) |
| Apex/www canonical, TLS on both domains, `marlow.software` 301 | `deployment-pipeline` (4.1) |
| Live-domain verification incl. redirect | `deployment-execution` (4.3) |
| **Missing favicon** — 404 on every load, sole Best Practices deduction | Unowned; raised at gate |
| Nobody has visually reviewed the rendered page | Unowned; no automated gate can close it |
| `aria-pressed` inaccurate without JS | Accepted at Unit 1's gate |
| 3 high-severity advisories, unfixable inside `next@16.2.12` | Advisory; re-check when Next releases |

## Result

**PASS.** All code traces to design, all design elements are implemented and tested, every `team.md`-named check has a passing test, and the budgets that were previously unmeasured are now measured and met. The three inherited contradictions are resolved rather than carried.

The open items above are genuinely open — but each has either a named owner in OPERATION or an explicit, recorded decision that no one will own it. None is an undiscovered gap.

CONSTRUCTION phase closes; OPERATION begins at `deployment-pipeline` (4.1).

## Human Approval

Confirmed via this stage's own approval gate (Approve / Request Changes).
