# CI Pipeline — Questions

**Stage:** ci-pipeline · **Phase:** Construction (final stage)
**Record:** `aidlc/spaces/default/intents/260726-resume-site/`
**Consumes:** [build-and-test-summary.md](../build-and-test/build-and-test-summary.md), [build-test-results.md](../build-and-test/build-test-results.md), both units' [code-summary.md](../site-shell-walking-skeleton/code-generation/code-summary.md)

## Context — most of this stage's default questions are already answered

The stage's generic question set asks which CI tool, what branch strategy, what quality gates, and what artifact repositories. Three of those four are already settled by confirmed decisions and are **not re-asked**:

- **CI tool:** GitHub Actions — the repo is on GitHub and hosting is GitHub Pages (Feasibility Q3).
- **Branch strategy:** direct commits to `main`, no branches, no PRs (Practices Discovery Q1).
- **Artifact repository:** none — the build output deploys straight to GitHub Pages; there is no registry or artifact store.
- **Quality gates:** the *composition* is confirmed (`team.md`) — build succeeds, links resolve, a11y/perf budgets pass, theme-toggle check, content-schema validation — and the *thresholds* are confirmed (NFR Q1). What is genuinely open is below.

What remains open is narrow and real: whether the gaps `build-and-test` identified as having **no downstream owner** get owners here, and how the gate behaves given there is no PR to block.

---

## Q1. `team.md` says CI is the sole gate before deploy — but with direct-to-`main` there is no PR to block. What should CI actually do on a failing check?

- A. Fail the workflow and **skip the deploy step** — the commit lands on `main` (nothing can stop that without branch protection), but a broken build never reaches the live site
- B. Fail the workflow only — deploy runs regardless, and you fix forward
- C. Add GitHub branch protection requiring checks to pass, which effectively reintroduces a PR-shaped gate
- X. Other (please specify)

[Answer]: **A — fail the workflow and skip the deploy step.**

Reached via a two-step exchange rather than directly, and the path matters. The first answer was *"avoid CI, if we need to. We are mainly building a site and deploying to github pages. We just need our own gate locally."* That was surfaced as conflicting with a **Mandated** rule in `project.md` ("treat CI passing … as the only gate before merge to `main`"), and as having a mechanical consequence: GitHub Pages cannot build a Next.js static export by itself, so with no Actions workflow the built `out/` directory would have to be committed to the repository — `.gitignore` currently excludes it.

Presented with that, the answer was **"Keep full CI after all"** — Actions runs build, tests, lint, typecheck, and the budgets, and gates the deploy. Combined with a companion answer to amend the practice record (see Q1a), the resulting posture is **two layers**, not one: the local pre-commit hook catches problems before they land on `main`; CI is the backstop and the deploy gate. Since nothing can prevent a commit from landing on `main` without branch protection — which was rejected as reintroducing a PR-shaped gate against the affirmed direct-to-`main` practice — CI's enforceable power is over the deploy step, and that is where it is applied.

---

## Q1a. `project.md` MANDATES "CI passing is the only gate before merge to `main` and the deploy that follows it." Amend it?

- A. Amend it — record the local pre-commit hook as the gate, with CI as backstop and deploy gate
- B. Leave the rule as written and record the deviation separately
- X. Other (please specify)

[Answer]: **A — amend it.**

The amendment corrects a contradiction that was already present in `project.md` rather than introducing a new departure. One Mandated bullet says CI is *the only gate*; a separate Mandated bullet in the same section says *"**ALWAYS** run a local pre-commit hook (lint/format) before every commit, with CI as a backstop after push,"* and a third mandates a local `gitleaks` hook. Three mandated gates cannot coexist with one of them being described as the only one. The word **"only"** is what is wrong, and striking it is the whole of the amendment — no gate is being removed, and CI is not being weakened.

---

## Q2. Manual WCAG items currently have **no owner anywhere in this workflow**. Should CI take them on?

Tab-order reachability, screen-reader announcements, landmark structure, 200%-zoom usability, touch-target sizing. `performance-validation` (4.6) is SKIP for this scope, so nothing later picks these up. Lighthouse covers only a subset and is not AA conformance.

- A. Add `axe-core` accessibility scanning to CI — catches materially more than Lighthouse alone (landmark structure, ARIA correctness, contrast), though tab order and screen-reader *experience* still need a human
- B. Accept the gap — Lighthouse A11y ≥95 is enough for this site, and the remaining items get a one-time manual pass before launch
- C. Accept the gap with no manual pass — it's a personal site, not a regulated product
- X. Other (please specify)

[Answer]: **C — accept the gap entirely.**

Explicitly chosen over both the automated option (A, add `axe-core`) and the softer manual-pass option (B). This is a deliberate, informed acceptance, not an oversight, and it should be read as **closing** the open item rather than deferring it: `build-and-test-summary.md` item 2 and `build-test-results.md`'s "Unowned" row are hereby answered — the answer is that no one will own them, by choice.

What that concretely leaves unverified, restated so the acceptance is specific rather than blanket: tab-order reachability, screen-reader announcements, landmark structure, 200%-zoom usability, touch-target sizing, and the page-wide half of the focus-visibility requirement (Lighthouse checks the theme toggle's own focus ring via the theme-toggle check, not every link). The Lighthouse Accessibility ≥95 budget still runs in CI and still catches a real subset — contrast, alt text, form labelling, document structure basics — but **it is a regression guard, not WCAG 2.1 AA conformance**, and this project now makes no conformance claim. `accessibility-checklist.md`'s manual items remain documented and unverified.

Proportionality is the stated rationale: a personal resume site, not a regulated product.

---

## Q3. The no-JS theme behavior was verified by hand across a 6-state matrix and is **not reproducible in CI**. Worth automating?

`src/app/theme-variant.test.ts` covers the CSS cascade logic in Node, which is what caught the original bug — but nothing exercises a real browser with JavaScript actually disabled.

- A. Accept as-is — the Node-level cascade test is the meaningful guard, and a real-browser no-JS check needs Playwright, which is heavy for one assertion on a static site
- B. Add Playwright for this one check plus a couple of other smoke assertions
- C. Not sure — recommend one
- X. Other (please specify)

[Answer]: **C → A.** Answered "Not sure — recommend one"; the recommendation given was **A, accept as-is**, and it was not countermanded. See "Recommendation Status" below — this is a recommendation adopted by default, and it is re-surfaced at the approval gate for explicit confirmation.

Rationale as given: `theme-variant.test.ts` compiles the real stylesheet with the real Tailwind compiler and resolves the cascade through postcss and jsdom without executing component JavaScript. It reaches the `JS disabled + OS prefers dark` path precisely because it never runs the component's JS — which is exactly why the eleven other test files missed the original bug. It was falsification-verified twice during this workflow: reverting `globals.css` to the pre-fix one-liner produces exactly 2 failures including `shows the moon when the OS prefers dark`, the precise reported symptom.

Adding Playwright would buy a genuinely different signal — real browser, real `<noscript>` behavior — at the cost of a browser download in CI, a second test runner, and its own maintenance surface, for one assertion on a text-only static page. The residual risk is narrow and named: a defect that manifests only through real-browser CSS behavior the postcss cascade model doesn't reproduce would go uncaught.

---

## Q4. `out/404.html` contradicts Refined Mockups Q1 ("no custom 404 — GitHub Pages' default"). Next always emits it. Resolve it how?

- A. Delete `out/404.html` as a CI build step — honors the original decision literally
- B. Amend the decision and keep Next's 404 — it is arguably better than GitHub's generic one, and deleting a file the framework generates is a small ongoing friction
- C. Not sure — recommend one
- X. Other (please specify)

[Answer]: **C → B.** Answered "Not sure — recommend one"; the recommendation given was **B, amend the decision and keep Next's 404**, and it was not countermanded. See "Recommendation Status" below.

Rationale as given: Refined Mockups Q1 was decided before anyone knew the static export unconditionally emits `404.html`, so the decision was made without the fact that now governs it. Deleting a framework-generated file on every build is permanent friction against the toolchain for no user-visible gain, and Next's 404 renders inside this site's own shell and theme rather than showing GitHub's unstyled generic page.

**This amends a locked upstream decision.** Recorded as an amendment rather than applied silently — `project.md`'s learned correction from `refined-mockups:c3` exists because a locked upstream decision was previously inverted without being surfaced.

One consequence carries forward to `deployment-pipeline` (4.1): `security-test-instructions.md` notes `out/404.html` carries an injected `<style>` block, which is part of why `style-src` needs `'unsafe-inline'`. Keeping the file keeps that CSP constraint — it was already unavoidable for other reasons (Next emits inline `style=` attributes throughout), so this changes nothing materially, but it should not be described later as a constraint that could have been removed by deleting the 404.

---

## Recommendation Status — read before treating Q3/Q4 as settled

Q1, Q1a, and Q2 were answered **explicitly**, by selecting a named option.

Q3 and Q4 were answered **"Not sure — recommend one."** Recommendations were then given in the same message that posed the Q1 follow-up, and the reply to that message addressed the follow-up without objecting to either recommendation. Silence following a recommendation is weaker evidence than a selection, and is recorded here as such rather than being written up as a confirmed decision. Both are **carried to the approval gate for explicit confirmation**, and both are cheap to reverse: Q3 means adding Playwright later, Q4 means adding a one-line delete step to the workflow.

## Assumptions & Open Questions

- **Q3 and Q4 rest on un-countermanded recommendations, not affirmative selections** — see above. Confirmed or corrected at this stage's approval gate.
- **Q2 closes a previously open item rather than deferring it.** `build-and-test`'s "no downstream owner" flag for manual WCAG items is resolved by a decision that there will be no owner. Any later document must describe the site as meeting a Lighthouse budget, never as WCAG 2.1 AA conformant.
- **Q1a requires an edit to `project.md`'s Mandated section** — striking "only" from the CI-gate bullet. That edit is part of this stage's work, not a follow-up.
