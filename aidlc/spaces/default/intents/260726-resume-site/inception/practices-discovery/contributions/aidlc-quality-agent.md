**Collaborator:** aidlc-quality-agent

## Contribution

Reviewed `team-practices.md`, `discovered-rules.md`, and `evidence.md` against
`scope-document.md`, `feasibility-assessment.md`, the composed scope file
(`.claude/scopes/aidlc-personal-static-site.md`), and — because the lead's
evidence trail did not cite them for the Testing Posture section —
`rough-mockups/wireframes.md` and `rough-mockups/user-flow.md`.

**On rejecting the blanket 80% coverage floor: correct call, for the right
reason.** A static export with no data layer and no API surface has no
meaningful branching logic to drive a line-coverage percentage — a coverage
number computed mostly over JSX markup would be theater, not signal. Endorsing
this departure from org.md's `mvp`-shaped default.

**Gap: the "no business logic to model" framing has one confirmed exception
the draft's evidence trail missed.** `wireframes.md`'s Direction C (SELECTED)
confirms a **theme toggle** (dark/light) as an in-scope v1 feature (Q3), with
an explicit accessibility requirement — accessible name, visible focus state,
contrast holding in both themes. That is client-side interactive state
(toggle + persistence across reload is the standard pattern for this feature)
with genuine testable behavior: does the toggle change the render state, does
the preference persist, does focus/contrast hold. `evidence.md` cites only
`feasibility-assessment.md`'s "no server-side surface" for the Testing Posture
adaptation and never cites `wireframes.md` — the reasoning is sound for the
site's content/markup, but overstated as written ("no business logic to
model") because it silently generalizes from "no backend" to "no logic
anywhere," and the one confirmed piece of client-side logic in this project
falls through that gap uncited.

**On the proposed replacement checks (build succeeds / links resolve /
a11y + perf budgets in CI): directionally right, category-complete enough,
but two categories are underspecified for a stage whose output becomes my own
`build-and-test` marching orders in Construction:**

1. Missing an explicit **HTML/markup validity** check (e.g., static HTML
   validation) — cheap, catches static-export-specific breakage (broken
   `<head>` metadata, malformed OpenGraph tags feeding the deferred
   AI-Engineering-section/social-metadata work in `nfr-requirements`), and is
   a natural sibling of "links resolve."
2. The draft correctly defers numeric thresholds to `nfr-requirements`
   ("to be set at nfr-requirements") — but Inception phase guardrails require
   every requirement to carry a clear pass/fail criterion, and "accessibility
   and performance budgets pass" has no criterion yet, only a promise of one
   later. That deferral is acceptable *only if* `team-practices.md` states
   explicitly that these are placeholder categories pending numeric
   thresholds at `nfr-requirements`, not a permanently vague target. As
   drafted the parenthetical does this correctly — flagging so it survives
   lead integration rather than getting trimmed for brevity.

**On the scope file's own quality-gate substitution — this needs to be named
in `team-practices.md`, not left implicit.** The composed scope marks
`performance-validation` (my lead stage in Operation) as SKIP, with an
explicit substituted closure path: `nfr-requirements` sets the budget,
`ci-pipeline` enforces it per build, `deployment-execution` verifies it on the
live domain. That means, for this project, the CI quality gate in
`build-and-test`/`ci-pipeline` is not merely "tests run in CI" (org.md's
generic phrasing) — it is the *only* automated performance/accessibility
gate this project will ever have, standing in for a stage that normally exists
separately. `team-practices.md`'s Testing Posture section should say this
plainly so a future re-run (or a different agent reading `team.md` cold)
doesn't mistake "no dedicated performance-validation stage" for "performance
isn't gated automatically anywhere."

**On Deployment: one ordering gap.** The Deployment section describes the
Bolt-level human approval gate replacing the environment-protection gate, but
never states that the CI quality gate (whatever gets affirmed under Testing
Posture) blocks the merge to `main` that triggers deploy-on-merge. With no
second human reviewer on this project, the CI gate is the only automated
check standing between a broken build and a live production deploy — this
should be an explicit, stated ordering (build-and-test gate passes -> merge
to main -> deploy), not left to be inferred.

## Positions

- AGREE: rejecting org.md's blanket 80% line-coverage default for this
  project — a content-only static export has no branching business logic to
  make that number meaningful.
- AGREE: substituting a static-site-appropriate check set (build succeeds,
  links resolve, a11y/perf budgets) for a numeric coverage floor.
- OBJECT: `team-practices.md`'s Testing Posture section overgeneralizes "no
  business logic to model" — `wireframes.md`'s confirmed theme toggle (Q3,
  Direction C) is a piece of client-side interactive behavior with real,
  testable logic (state toggle, persistence, focus/contrast in both themes)
  that the draft's evidence trail never cited. The interview should ask
  explicitly whether the theme toggle (and any other confirmed interactive
  element) warrants component-level tests, rather than folding it silently
  into "no logic to test."
- OBJECT: the replacement check list omits HTML/markup validity as a
  category alongside "links resolve" — same cost profile, same failure mode
  (static-export breakage), should be named now so it isn't lost at
  `nfr-requirements`/`code-generation`.
- OBJECT: `team-practices.md` should state explicitly that, because
  `performance-validation` is SKIP for this scope with its closure path
  reassigned to `nfr-requirements` + `ci-pipeline` + `deployment-execution`,
  the CI quality gate is this project's *only* automated
  performance/accessibility enforcement point — not left as something a
  reader has to reconstruct from the scope file's own EXECUTE/SKIP rationale.
- OBJECT: the Deployment section should state explicitly that the CI quality
  gate blocks merge-to-`main` (and therefore blocks deploy-on-merge), since
  there is no second human reviewer to catch a regression the gate misses.
- Interview question to add (mine, not yet in `discovered-rules.md`'s "what
  the interview should establish" list): does the human want any
  component-level unit tests at all for the theme toggle, or is manual
  smoke-check across both themes sufficient given the $0/solo-builder
  framing? Either answer is legitimate — this is a judgment call, not a
  quality-gate mandate.
