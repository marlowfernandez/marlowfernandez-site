# Evidence — Practices Discovery Final (marlowfernandez.com)

**Intent:** `260726-resume-site` · **Stage:** practices-discovery · **Phase:** Inception
**Status: FINAL.** Records what each participant inspected and found, what
the human interview resolved, and any remaining uncertainty, so
`team-practices.md` and `discovered-rules.md` trace back to their sources.

## Participants and what each inspected

**Lead (this agent).** Read `org.md`'s five suggested-default sections in
full, `team.md`/`project.md` (both empty shells at draft time),
`aidlc-personal-static-site.md` (composed scope, EXECUTE/SKIP rationale),
`scope-document.md` (solo-stakeholder framing, Vynkor content constraint,
confirmed Build Sequencing and Timeline answers), and
`feasibility-assessment.md` (Next.js static export, GitHub Pages, Hostinger
DNS, $0 budget, zero server-side surface). Drafted five adapted-for-solo-build
practice sections plus a deliberately near-empty Mandated/Forbidden pair,
each adaptation flagged as an inference open to challenge rather than a
settled fact — see the four flagged inferences below, all confirmed still
accurate after integration.

**Quality agent.** Reviewed the three draft files against
`scope-document.md`, `feasibility-assessment.md`, the composed scope file,
and — because the lead's evidence trail hadn't cited them —
`rough-mockups/wireframes.md` and `rough-mockups/user-flow.md`. Found: (1)
the draft's "no business logic to model" framing overgeneralized past the
theme toggle, a confirmed piece of client-side interactive behavior with
real testable state; (2) the replacement check list should name HTML/markup
validity alongside "links resolve"; (3) the "budgets pass in CI" phrasing
needed to state explicitly that numeric thresholds are still pending at
`nfr-requirements`, not permanently vague; (4) `team-practices.md` should
name the CI gate as this project's *only* automated performance/
accessibility enforcement point, since `performance-validation` is SKIP with
its closure reassigned elsewhere; (5) the Deployment section should state
explicitly that the CI gate blocks merge-to-`main`.

**Developer agent.** Reviewed against naming, layer boundaries, error
handling, file organization, and code-style conventions, cross-checked
against `feasibility-assessment.md` and a repo scan confirming true
greenfield (no `app/`, `src/`, `package.json`, or lint config exists). Found:
(1) TypeScript vs. JavaScript was an open, unaddressed language decision with
a recruiter-audience signal argument for TypeScript; (2) no draft named an
owner for file/folder organization and content-model shape, a real gap given
`functional-design` is SKIP; (3) build-time content-schema validation was a
concrete, cheap testing-posture addition distinct from a coverage floor; (4)
GitHub Pages' `trailingSlash`/custom-404 static-export routing needs should
be flagged as `deployment-pipeline`'s responsibility, not assumed covered by
"no server-side surface."

**Devsecops agent.** Reviewed lint/format, SAST/DAST, secret scanning,
dependency/supply-chain scanning, and IaC scanning against
`feasibility-assessment.md` and `raid-log.md`, confirming no `package.json`,
no `.github/workflows/`, no linter config exists yet. Central finding: RAID
R3 records this repository is **public by design**, which changes the risk
calculus — any secret pushed is effectively permanently exposed, and there is
no second reviewer to catch it pre-merge. Findings: (1) no SAST/DAST tooling
warranted at this scale (ESLint's `jsx-a11y`/react security rules are the
right-sized substitute); (2) the draft's narrow Hostinger-only Forbidden
candidate should be broadened to all credentials/secrets and all
public-exposure paths (commits, commit messages, issues, PRs, CI logs); (3)
GitHub push protection plus a local `gitleaks` pre-commit hook should both
apply, as independent layers; (4) GitHub Dependabot (native, free, no AWS
account needed) is the right-sized dependency control, with the choice of
auto-merge-for-patches vs. manual-review-of-everything left open as an
interview question; (5) if Way of Working resolves to direct-to-`main`, the
inherited "lint blocks the PR" language has no PR to attach to and needs
restating.

## What the human interview resolved

All eleven questions in `practices-discovery-questions.md` were answered and
are integrated into `team-practices.md`/`discovered-rules.md` as follows:

- **Q1 (Way of Working):** Direct commits to `main`, no branches — resolves
  the lead's open question in favor of the simpler option.
- **Q2 (Walking Skeleton autonomy):** Continue autonomously after Bolt 1;
  only failures halt and ask.
- **Q3 (Testing Posture floor):** No coverage percentage — build succeeds +
  links resolve + accessibility/performance budgets pass in CI. The human
  asked for the lead's recommendation (option C) and accepted it as given,
  landing on option A's content.
- **Q4 (Quality's theme-toggle finding):** Confirmed — the toggle gets its
  own explicit check (state persists, focus visible, contrast holds in both
  themes). Quality's objection was upheld in full.
- **Q5 (Developer's content-schema-validation suggestion):** Confirmed as a
  CI check. Developer's additive suggestion was upheld in full.
- **Q6 (Quality's CI-gate-ordering finding):** Confirmed — CI passing is
  stated explicitly as the only gate before merge/deploy. Quality's
  objection was upheld in full.
- **Q7 (Devsecops' no-PR-to-block finding):** Both a local pre-commit hook
  and CI as a backstop. Devsecops' concern was resolved by adopting the
  more thorough of the two options offered, not the lighter one.
- **Q8 (Developer's TS-vs-JS flag):** TypeScript. Developer's flag was
  upheld and resolved in the direction developer recommended.
- **Q9 (Devsecops' broadening-the-Forbidden-rule finding):** Confirmed —
  broadened to a general secret-handling rule, Hostinger as one example,
  not the whole scope. Devsecops' objection was upheld in full.
- **Q10 (Devsecops' push-protection-plus-gitleaks recommendation):**
  Confirmed — both apply. Devsecops' recommendation was adopted as given.
- **Q11 (Devsecops' Dependabot-auto-merge recommendation):** **Not**
  adopted. The human chose manual review of every dependency update, no
  auto-merge — the more conservative of the two options, which explicitly
  overrides devsecops' auto-merge-for-patches recommendation. This is
  recorded accurately as heard-but-rejected, not silently dropped: devsecops'
  Dependabot-as-the-mechanism recommendation was adopted (see
  `discovered-rules.md` Mandated), but the auto-merge-for-patches half of
  that same recommendation was specifically declined in favor of the
  no-exceptions manual-review policy.

## Remaining uncertainty

- Numeric accessibility/performance budget thresholds are still unset —
  deferred to `nfr-requirements` (3.2) by design, not an oversight.
- File/folder organization and the resume content's data shape (developer's
  finding) are explicitly deferred to `application-design` (2.6), which is
  now the named owner per `team-practices.md`'s Code Style section — not yet
  decided at this stage.
- GitHub Pages' `trailingSlash`/custom-404 static-export routing behavior
  (developer's finding) is flagged as `deployment-pipeline`'s (4.1)
  responsibility but not yet resolved at this stage.
- The security-header platform limitation devsecops raised (GitHub Pages
  cannot set HSTS/X-Frame-Options via `<meta>`, only CSP) is a known,
  accepted constraint to be recorded at `deployment-pipeline` (4.1), not
  resolved here — it was not put to the human as an interview question
  because it is a platform fact, not a choice.
- SAST/DAST tooling and IaC scanning were assessed by devsecops as correctly
  out of scope for this project's stack; no interview question was raised on
  these because there was no genuine choice to present to the human.

## Inferences from the original draft, reconfirmed after integration

1. Rejecting the `mvp` row's 80%-coverage default as a poor match for this
   scope (rather than forcing the closest-sounding row) — reconfirmed by the
   human's Q3 answer.
2. Treating `org.md`'s staging/production Deployment split as inapplicable
   given the scope file's own SKIP rationale — not contradicted by any
   interview answer; single-environment framing stands.
3. Treating the Vynkor content constraint as out of frame for
   `discovered-rules.md` (a content constraint, not a process constraint) —
   not challenged by any peer or the interview; the separation is preserved
   in the final `discovered-rules.md`.
4. Declining to promote phase-guardrail language (e.g. Construction's "never
   hardcode credentials") into this stage's Forbidden section as if newly
   discovered here — preserved; the final Forbidden section is built only
   from Q9/Q10/Q11 answers, not from restating an already-imported layer.
