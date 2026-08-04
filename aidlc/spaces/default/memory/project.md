# Project-Level Rules

> Project-specific specialisation and corrections. Loaded after `org.md` and
> `team.md` as strict-additive guidance; contradictions with broader policy
> are rejected. Populated by practices-discovery and the self-learning loop.
>
> Use sparingly: most teams don't need a project layer. Reach for it
> only when this specific project needs stable, durable guidance beyond the
> team practice (for example, package-specific release checks or an additional
> regression suite for a legacy component).

## Way of Working

<!-- Project-specific specialisation. Example: -->
<!-- This monorepo requires package-scoped branch names and a package owner -->
<!-- review in addition to the team's normal merge policy. -->

## Walking Skeleton

<!-- Project-specific specialisation. Example: -->
<!-- The walking skeleton must exercise the legacy service adapter as well -->
<!-- as the new service boundary. -->

## Testing Posture

<!-- Project-specific specialisation. -->

## Deployment

<!-- Project-specific specialisation. -->

## Code Style

<!-- Project-specific specialisation. -->

## Tech Stack

<!-- Technology choices locked for this project. -->

## Decided

<!-- Decisions made in earlier stages that should not be re-asked. -->
<!-- Format: DECIDED: [decision] (Stage [slug], [date]) -->

## Scope Overrides

<!-- Custom scope rules for this project. -->

## Forbidden

<!-- Populated by practices-discovery affirmation gate. -->
<!-- Format: NEVER [behavior] (affirmed [date]) -->
<!-- Example: NEVER throw exceptions across service layer boundaries (affirmed 2026-05-17) -->

- **NEVER** commit, paste, or log any credential, API key, token, or secret — (affirmed 2026-07-27)
including but not limited to Hostinger DNS/registrar login credentials — in (affirmed 2026-07-27)
this public repository's code, commit messages, issues, pull requests, or (affirmed 2026-07-27)
CI logs. Hostinger is one illustrative example, not the rule's full scope; (affirmed 2026-07-27)
the same prohibition covers GitHub personal access tokens/deploy keys, any (affirmed 2026-07-27)
API key added later, and any future analytics/CI service credential (Q9). (affirmed 2026-07-27)
- **NEVER** auto-merge a dependency update of any kind — every dependency PR (affirmed 2026-07-27)
gets manual human review before merge, with no exception carved out for (affirmed 2026-07-27)
patch-level updates (Q11). This is the more conservative of the two options (affirmed 2026-07-27)
presented at the interview and was chosen explicitly, overriding the (affirmed 2026-07-27)
devsecops peer review's auto-merge-patches recommendation (see (affirmed 2026-07-27)
`evidence.md`). (affirmed 2026-07-27)
## Mandated

<!-- Populated by practices-discovery affirmation gate. -->
<!-- Format: ALWAYS [behavior] (affirmed [date]) -->
<!-- Example: ALWAYS use Result<T,E> for fallible operations in service layer (affirmed 2026-05-17) -->

- **ALWAYS** treat CI passing (build succeeds, links resolve, (affirmed 2026-07-27)
accessibility/performance budgets pass, theme-toggle check, content-schema (affirmed 2026-07-27)
validation) as the gate on the **deploy** to the live domain. There is no (amended 2026-08-03)
second human reviewer on this project. CI is the last automated check (amended 2026-08-03)
standing between a broken build and a live production deploy (Q6). (affirmed 2026-07-27)
  - **Amended 2026-08-03 (ci-pipeline Q1a):** this rule previously read (amended 2026-08-03)
  "as the **only** gate before merge to `main` and the deploy that follows (amended 2026-08-03)
  it." Two corrections, neither of which weakens CI. (amended 2026-08-03)
  - *"only"* contradicted the two Mandated bullets immediately below, (amended 2026-08-03)
  which require a local pre-commit hook and a local `gitleaks` scan. (amended 2026-08-03)
  Three mandated gates cannot coexist with one of them being the only (amended 2026-08-03)
  one. The real posture is two layers: the pre-commit hook catches (amended 2026-08-03)
  problems **before** a commit exists; CI is the backstop **after** push (amended 2026-08-03)
  and the gate on deploy. (amended 2026-08-03)
  - *"before merge to `main`"* described a boundary this project does (amended 2026-08-03)
  not have. Way of Working (Q1) resolved to direct commits with no PR, (amended 2026-08-03)
  and branch protection was considered and rejected at ci-pipeline Q1 as (amended 2026-08-03)
  reintroducing a PR-shaped gate. By the time CI runs, the commit is (amended 2026-08-03)
  already on `main` — nothing can gate that. What CI can and does gate (amended 2026-08-03)
  is the deploy job, via `needs: verify` in `.github/workflows/ci.yml`. (amended 2026-08-03)
  A broken build lands in history; it does not reach the domain. (amended 2026-08-03)
- **ALWAYS** run a local pre-commit hook (lint/format) before every commit, (affirmed 2026-07-27)
with CI as a backstop after push — since Way of Working (Q1) resolved to (affirmed 2026-07-27)
direct commits to `main` with no PR to gate (Q7). (affirmed 2026-07-27)
  - **Implemented 2026-08-03 (ci-pipeline):** `.githooks/pre-commit`. (amended 2026-08-03)
  Activate per clone with `git config core.hooksPath .githooks` — git (amended 2026-08-03)
  does not copy hooks on clone, so an unactivated clone silently has no (amended 2026-08-03)
  local gate. (amended 2026-08-03)
  - The hook runs gitleaks, `format:check`, `lint`, `typecheck`, and the (amended 2026-08-03)
  full test suite. Typecheck and tests exceed the "lint/format" minimum (amended 2026-08-03)
  this bullet requires; they are included deliberately because the suite (amended 2026-08-03)
  runs in about three seconds and Q1a's whole point was that the local (amended 2026-08-03)
  layer should be real rather than ceremonial. (amended 2026-08-03)
  - It **fails closed** when `gitleaks` is not installed rather than (amended 2026-08-03)
  skipping the scan. `git commit --no-verify` is the only bypass; the (amended 2026-08-03)
  hook deliberately provides no `SKIP=1` variable, because a documented (amended 2026-08-03)
  bypass on a mandated security control is equivalent to not mandating (amended 2026-08-03)
  it. (amended 2026-08-03)
- **ALWAYS** run a local pre-commit `gitleaks` hook before every commit, in (affirmed 2026-07-27)
addition to GitHub's built-in push protection — two independent layers, (affirmed 2026-07-27)
since this repository is public by design and there is no second reviewer (affirmed 2026-07-27)
to catch a leaked credential before it is exposed (Q10). (affirmed 2026-07-27)
- **ALWAYS** manually review every dependency update PR (Dependabot or (affirmed 2026-07-27)
otherwise) before merging it — no auto-merge, for any update tier (affirmed 2026-07-27)
(patch, minor, or major) (Q11). (affirmed 2026-07-27)
## Corrections

<!-- Project-specific corrections from human feedback. -->
<!-- Format: NEVER/ALWAYS [behavior] (learned [date]) -->
- Author structured questions with options A-D (not A-E) plus X. Other — this harness renders at most 4 options and auto-appends an Other escape, so a 5th option forces unnecessary splitting across prompts. (learned 2026-07-26) <!-- cid:intent-capture:c3 -->
- When a question's options aren't mutually exclusive ("several apply"), use native multi-select instead of adding a synthetic "several of the above" option. (learned 2026-07-26) <!-- cid:intent-capture:c4 -->
- Before finalizing a grounded ideation/inception artifact, verify each cited source tag's answer actually supports the specific claim content, not just that the tag is present and resolvable — the automated claim-sources sensor checks only presence and resolution, not semantic entailment. (learned 2026-07-26) <!-- cid:intent-capture:c5 -->
- When a later stage already owns a decision (e.g. requirements-analysis owns what resume content is public), don't re-ask it in an earlier stage just because it's topically adjacent — check the composed plan's stage rationale before adding a question. (learned 2026-07-26) <!-- cid:feasibility:c3 -->
- When fixing a reviewer finding about a mis-cited source, re-verify which section/heading the quoted text actually lives under, not just that the text exists somewhere in the document — a fix that corrects the claim but mis-attributes the section is still a fresh grounding defect. (learned 2026-07-27) <!-- cid:rough-mockups:c6 -->
- When a user names a reference or inspiration site, actually visit it with the Browser tool rather than working from the domain name or a general impression — concrete structural detail from the real page is far more useful than inference. (learned 2026-07-27) <!-- cid:rough-mockups:c1 -->
- When most prior stages have already settled the decisions a stage's default question set would cover, shrink the question count below the scope's target depth rather than padding to hit a range — a stage's depth target is a ceiling to justify against, not a floor to fill. (learned 2026-07-27) <!-- cid:approval-handoff:c1 -->
- When a real ambiguity or risk distinction is recognized while drafting an artifact, ask it as an actual follow-up question BEFORE the human's consolidated-summary sign-off — never record it only in the generated artifact's Assumptions/Open Questions section after the fact. Recognizing a risk and journaling it is not the same as resolving it with the human. (learned 2026-07-27) <!-- cid:requirements-analysis:c2 -->
- When a stage consumes a source document (e.g. a resume PDF) that turns out to contain undecided disclosure-sensitive content, treat that stage as the actual decision point for what becomes public — read the source directly and ask real questions about disclosure level, rather than defaulting to verbatim extraction. (learned 2026-07-27) <!-- cid:requirements-analysis:c1 -->
- When a document restates the same wrong fact or citation more than once, grep for every occurrence before claiming a fix is complete — fixing only the instance you remember editing leaves the document self-contradicting the corrected line. (learned 2026-07-28) <!-- cid:refined-mockups:c4 -->
- When a stage frontmatter lists an artifact as a required consumed input, its actual content must be checked against and honored in the produced artifacts — not merely listed under a 'Consumes' line as a formality. A locked upstream decision can otherwise get silently inverted. (learned 2026-07-28) <!-- cid:refined-mockups:c3 -->
- When implementing a written practice reveals that the practice describes a boundary this project does not have, amend the practice — never build something that satisfies its words while missing its intent. `team.md` said CI gates the merge; direct commits to `main` mean there is no merge to gate, so the rule was amended to gate the deploy instead of inventing a merge boundary to satisfy it. (learned 2026-08-04) <!-- cid:ci-pipeline:c2 -->
- When a glob or regex selects files, test it against the actual enumerated build output rather than the expected shape of that output. The Lighthouse assertion pattern `.*/index\.html$` was written for one page and matched three, gating exactly the error pages it was meant to exclude — visible only after listing the real export. (learned 2026-08-04) <!-- cid:ci-pipeline:c3 -->
- Weigh a new devDependency against the audit signal, not just against bundle size — a dev-only tool that never ships still taxes the one security signal this project watches. `@lhci/cli` took `npm audit` from 3 findings to 8; running it as a pinned GitHub Action instead kept local reproducibility and left the signal readable. (learned 2026-08-04) <!-- cid:ci-pipeline:c7 -->
- Never report a conclusion stronger than the evidence supports when the weaker accurate statement is available. `command -v gitleaks` failing proves "not on PATH", not "not installed" — reporting the latter sent the user to reinstall software they already had (gitleaks 8.30.1, installed via winget without a PATH shim). State what was actually observed. (learned 2026-08-04) <!-- cid:deployment-execution:c4 -->
- Verifying a property is not the same as verifying the tool that checks it. A local script confirmed every link in the export resolves — true, and useless against a wrong lychee flag name (`--base out`, which is neither the right flag nor an absolute path). When a CI step cannot be run locally, say the step is unverified rather than treating a hand-rolled equivalent as coverage. (learned 2026-08-04) <!-- cid:deployment-execution:c5 -->
- Never document a command as working before executing it once. The pre-commit hook called `gitleaks protect --staged`, a subcommand that does not exist in 8.30.1 (its commands are `git`, `dir`, `stdin`), written from familiarity with an older CLI. Run the command, then write down what it did. (learned 2026-08-04) <!-- cid:deployment-execution:c6 -->
