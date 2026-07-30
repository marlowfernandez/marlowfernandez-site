# Units of Work — marlowfernandez.com

**Intent:** `260726-resume-site` · **Stage:** units-generation (last INCEPTION stage)
**Consumes:** [components.md](../application-design/components.md), [component-methods.md](../application-design/component-methods.md), [services.md](../application-design/services.md), [component-dependency.md](../application-design/component-dependency.md), [decisions.md](../application-design/decisions.md), [requirements.md](../requirements-analysis/requirements.md)

## Note on Sequencing (departure from generic stage prose)

This project's composed scope skips Delivery Planning (2.8) and explicitly folds its economic-sequencing role into this stage. Verbatim from `.claude/scopes/aidlc-personal-static-site.md` (lines 38–39): `` `delivery-planning` is SKIP (<=3 units, one dependency chain, single builder — `units-generation` sequences inline). `` So unlike this stage's generic instruction to never recommend a build order, the sequencing below is a deliberate, cited exception — `unit-of-work-dependency.md` still stays pure topology, per that artifact's own requirement.

---

## Unit 1: Site Shell & Walking Skeleton

**Description:** The deployable foundation — page scaffold, layout, navigation-free header/footer, theme toggle, and the MDX content pipeline wiring. This unit **is** the walking skeleton confirmed at Scope Definition (Q6): a genuinely live, deployed slice on both domains, with placeholder-quality content, before real content is layered in. Building this unit first — and specifically before Unit 2 — is this stage's own confirmed answer to Q3, not merely an inheritance from Scope Definition's general walking-skeleton stance; Q3 was asked precisely to settle the sequencing at the unit level, and the recommended answer (Unit 1 first) was accepted.

**Kind:** `ui`

**Responsibilities (owns):**
- Next.js App Router scaffold (`app/`, `components/`, `content/` per `decisions.md` ADR-5)
- Components: `Header`, `Footer`, `ThemeToggle`, `ExternalLink`, `Hero` (per `components.md`)
- Tailwind CSS configuration from `design-system-mapping.md`'s tokens (per `decisions.md` ADR-3)
- The MDX parsing/loading pipeline itself (the mechanism, not the content)
- The formal MDX frontmatter schema each content type will need to follow (the integration contract for Unit 2, confirmed at this stage's Q4)
- Initial CI wiring sufficient to deploy (build succeeds, lint passes) — the fuller quality-gate checks (theme-toggle check, content-schema validation, a11y/perf budgets) are `ci-pipeline`'s (3.7) job, not this unit's, but this unit must not block that stage from wiring them in
- The internal dependency shape within this unit, per `component-dependency.md`: `Header` depends on both `ThemeToggle` and `ExternalLink`; `Hero` has no internal dependencies. This unit must build `ThemeToggle` and `ExternalLink` before `Header` can be considered complete, since `Header` composes them.

**Deployment model:** Standalone-deployable in principle, but per this stage's Q5, ships together with Unit 2 as a single release — this unit's placeholder content is simply replaced, not separately deployed.

**Complexity estimate:** M

**Implementation notes and constraints:**
- Must satisfy `discovered-rules.md`'s Mandated practices: CI as the sole merge gate, pre-commit hook + CI backstop for lint (since Way of Working is direct-to-`main`, no PR).
- `ThemeToggle`'s behavior must match `interaction-spec.md`'s full spec (OS-preference default, localStorage persistence), including its documented failure handling from `component-methods.md`: if `localStorage` is unavailable when reading, fall back silently to the OS-preference result with no thrown error; if writing an override fails, no-op silently rather than breaking the toggle for the current page view.
- Placeholder content in this unit should be recognizably placeholder (not confusingly close to final copy), so a live-but-incomplete deploy doesn't get mistaken for finished content if seen prematurely.

---

## Unit 2: Content Sections

**Description:** The real, confirmed content — all resume-derived data and the AI Engineering list — rendered through the four content-section components.

**Kind:** `ui`

**Responsibilities (owns):**
- Components: `ExperienceSection`, `AIEngineeringSection`, `EducationSection`, `ContactSection` (per `components.md`)
- The actual MDX content files: 4 employer blocks (full detail, per `requirements.md`), the Vynkor one-liner (exact placement and wording per `requirements.md`'s Experience Section), education/certification detail, and the AI Engineering plain-text comma-separated list (no links, per `decisions.md` ADR-1)
- Conformance to Unit 1's MDX frontmatter schema (the formal contract confirmed at this stage's Q4)

**Deployment model:** Ships together with Unit 1 as a single release (per this stage's Q5) — not independently deployable.

**Complexity estimate:** M

**Implementation notes and constraints:**
- Content correctness here directly carries the disclosure decisions confirmed at Requirements Analysis (employer name, transaction figure, government/defense clients, clearance — all published as-is; phone number as plain text) — Code Generation must treat `requirements.md` as the authoritative content source, not re-derive or paraphrase it.
- The Vynkor line must remain exactly as brief and vague as `scope-document.md` and `requirements.md` specify — this is a content constraint enforced by careful authoring, not by any automated check.
- Depends on Unit 1's frontmatter schema existing first; cannot be meaningfully built or validated in isolation.

## Assumptions & Open Questions

None. Both units trace directly to `components.md`'s inventory and this stage's confirmed answers.

## Review

**Reviewer:** aidlc-architecture-reviewer-agent
**Verdict:** READY

**Scope of this pass:** targeted re-verification of the four iteration-1 fixes, checked directly against current file contents (not the changelog describing them): `unit-of-work.md`, `unit-of-work-story-map.md`, `units-generation-questions.md`, `.claude/scopes/aidlc-personal-static-site.md` (lines 38–40), `component-methods.md`, `component-dependency.md`.

**Fix 1 — quote accuracy (was Finding 3):** `unit-of-work.md` line 8 now reads `` `delivery-planning` is SKIP (<=3 units, one dependency chain, single builder — `units-generation` sequences inline). `` — ASCII `<=` (not `≤`), backticks around both `delivery-planning` and `units-generation` restored, em-dash preserved. Matches the source (`.claude/scopes/aidlc-personal-static-site.md` lines 38–40, collapsed across its line-wrap) exactly. The second instance flagged in iteration 1 — `units-generation-questions.md` Q2 option A (line 28) — now reads `the scope file's own "<=3 units" expectation`, also ASCII. Both locations confirmed fixed; no third instance found.

**Fix 2 — Q3 citation (was Finding 2):** `unit-of-work.md` line 14 now states the Unit-1-before-Unit-2 order is "this stage's own confirmed answer to Q3, not merely an inheritance from Scope Definition's general walking-skeleton stance; Q3 was asked precisely to settle the sequencing at the unit level, and the recommended answer (Unit 1 first) was accepted." Checked against `units-generation-questions.md` Q3 (lines 37–46): recommended C→A, "Unit 1 first" — the citation's content accurately reflects the actual Q&A, not just a name-drop. Confirmed fixed.

**Fix 3 — required-input engagement (was Finding 4):** Both additions checked against their source files for accuracy, not just presence:
- Unit 1 responsibilities (line 25), attributed to `component-dependency.md`: "`Header` depends on both `ThemeToggle` and `ExternalLink`; `Hero` has no internal dependencies." Matches the Dependency Matrix exactly (`Header` → `ThemeToggle, ExternalLink`; `Hero` → `none`).
- Unit 1 implementation notes (line 33), attributed to `component-methods.md`: silent OS-preference fallback if `localStorage` is unavailable when reading, silent no-op if writing an override fails. Matches the `ThemeToggle` Utility Functions table's Error Handling column for `resolveInitialTheme` and `persistThemeOverride` word-for-word in substance.
Both previously-uncited `required: true` inputs are now engaged in body prose with content that is actually correct, not just present. Confirmed fixed.

**Fix 4 — missing story-map section (was Finding 1):** `unit-of-work-story-map.md` now has a `## Requirement Implementation Order Within Each Unit` section (lines 21–25) covering Unit 1 (NFR/mechanism work before the MDX schema, with stated rationale) and Unit 2 (Experience → Education/AI Engineering → Contact, with stated rationale). This satisfies the stage's Step 6 template's third required element, previously absent entirely. Confirmed fixed.

**Regression check:** none of the four edits disturbed the topology, component-coverage, or requirement-coverage findings iteration 1 already confirmed sound — cross-references, tables, and surrounding prose are otherwise unchanged.

**Outcome:** All four iteration-1 findings are fixed, and each fix was re-verified against its cited source rather than taken on faith. No new issues surfaced during this targeted pass. READY.
