# Team Practices — marlowfernandez.com (AFFIRMED)

**Intent:** `260726-resume-site` · **Stage:** practices-discovery · **Phase:** Inception
**Status: FINAL — affirmed by the human at the practices-discovery interview**
(`practices-discovery-questions.md`, Q1–Q11). These five sections are written
into `aidlc/spaces/default/memory/team.md` as this project's team-level
practice, strict-additive over `org.md`. This is a **solo-builder** project
(one stakeholder, sole author, $0 budget); where `org.md`'s multi-person
framing did not fit, the human resolved it directly rather than by default
inheritance.

## Way of Working

Direct commits to `main` — no feature branches, no PRs. This departs from
`org.md`'s trunk-based-with-short-lived-branches default: with a single
builder and no second reviewer, branches would exist only to serve PR
ceremony no one is there to perform (Q1).

Because there is no PR to gate, quality enforcement moves to the commit
boundary itself rather than a merge boundary: a local pre-commit hook (lint,
format, secret scan) runs before every commit, with CI as a backstop after
push (Q7). "Lint blocks the PR" language from `org.md` does not apply here —
there is no PR — so this project's actual gate is pre-commit-hook-plus-CI,
stated explicitly rather than left to be inferred from a PR-gate assumption
that doesn't hold.

## Walking Skeleton

The active scope declares `skeleton: on`; Bolt 1 (bare-bones live on both
domains, real navigation, placeholder-quality content) runs solo and gated,
per the confirmed Build Sequencing answer in `scope-document.md`.

After Bolt 1 ships and its gate is approved, remaining Bolts run
**autonomously** — no per-Bolt gate; only a failure halts and asks (Q2).
This is this project's affirmed **Construction Autonomy Mode**.

## Testing Posture

No numeric line-coverage floor applies. `org.md`'s 80%-coverage default
assumes meaningful branching business logic to cover; this is a static
content export (Next.js static export, GitHub Pages, zero server-side
surface) with no data layer and no API contract. Instead, the CI gate
requires: **build succeeds, links resolve, and accessibility/performance
budgets pass** (Q3). The numeric budget thresholds themselves are set later
at `nfr-requirements` (3.2) — this is a placeholder category pending those
thresholds, not a permanently vague target.

Two checks are added explicitly, both confirmed at the interview:

- **Theme toggle behavior check.** The dark/light theme toggle (confirmed
  in-scope at Rough Mockups) is real client-side interactive logic, not
  "no business logic to model" — it has a specific, testable check: toggle
  state changes the render, the preference persists across reload, and
  focus visibility plus contrast hold in both themes (Q4).
- **Build-time content-schema validation.** Whatever shape the resume
  content takes (TS interfaces, JSON, MDX front-matter), a CI check
  validates that shape at build time, catching a malformed content edit
  before it ships — distinct from and additional to the coverage-floor
  question (Q5).

**This is this project's only automated performance/accessibility
enforcement point.** The composed scope marks `performance-validation`
(Operation phase) as SKIP, with its closure path reassigned to
`nfr-requirements` (sets the budget) → `ci-pipeline`/`build-and-test`
(enforces it per build) → `deployment-execution` (verifies it on the live
domain). There is no separate performance-validation stage standing behind
this — the CI quality gate described above is the whole of it, not a subset
of a larger enforcement chain. This is stated explicitly so a future re-run,
or a different agent reading `team.md` cold, does not mistake "no dedicated
performance-validation stage" for "performance isn't gated automatically
anywhere."

## Deployment

Single production environment, no staging tier — `feasibility-assessment.md`
names one GitHub Pages target per domain, and the composed scope's own
EXECUTE/SKIP rationale confirms `environment-provisioning` is SKIP ("one
production environment; previews are host-provided") and
`observability-setup`/`incident-response` are SKIP ("static files on a CDN
have no runtime to observe"). Deploy happens on merge to `main`.

**The CI quality gate (Testing Posture, above) is the only thing standing
between a broken build and a live production deploy — stated explicitly,
not left implicit.** There is no second human reviewer on this project. The
ordering is: pre-commit hook and CI checks pass → commit lands on `main` →
deploy-on-merge fires. Walking-skeleton Bolt 1 additionally carries its own
human approval gate before remaining Bolts proceed (see Walking Skeleton,
above), but that is a one-time Bolt-sequencing gate, not a substitute for the
CI gate that applies to every commit thereafter.

`deployment-pipeline` (4.1) owns the apex/www canonical domain, TLS for both
domains, and the 301 redirect — this is load-bearing since `infrastructure-
design` is SKIP for this scope and no infra-design artifact exists to fall
back on.

## Code Style

**Language: TypeScript** (Q8). The recruiter/hiring-manager-facing audience
(`feasibility-assessment.md` Stack Decision) makes a public TypeScript
codebase a mild, deliberate skill signal, not a neutral default — this
overrides the earlier open question of TS-vs-JS.

Formatter and linter defer to project-level configuration (Prettier, ESLint
run in CI) once established at `application-design`/`code-generation`; no
project-wide naming-convention override beyond language-idiomatic
(camelCase for TS). An agent's style suggestion only fires if the linter
doesn't already cover the point.

File/folder organization and the resume content's data shape (TS interfaces,
JSON, or MDX front-matter, and where it lives relative to routes and
components) are **not** decided in this stage. Because `functional-design`
is SKIP for this scope ("a content site has no business logic to model"),
there is no other stage that would otherwise pin this down —
**`application-design` (2.6) is the explicit, named owner** of file
organization and content-model conventions for this project. This is
recorded here so it is not assumed to have been covered when it structurally
was not.
