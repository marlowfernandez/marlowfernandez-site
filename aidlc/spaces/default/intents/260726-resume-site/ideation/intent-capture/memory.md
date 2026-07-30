<!-- INVARIANT: examples are single-line HTML comments so a fresh template parses to total=0 (MEMORY_EMPTY). Do NOT un-comment or split across lines. t100 guards this. -->
> This file is maintained by the orchestrator during stage execution. Add observations at the gate ritual, not by editing here directly.

## Interpretations
<!-- example: 2026-05-29T10:14:32Z — chose REST over GraphQL; the consuming team only needs CRUD, revisit if subscriptions land -->
- 2026-07-26T16:22:20Z — registered only `[desc]` and `[scope]` in the source register, no `[memory:M<n>]` entries; `team.md` and `project.md` contain no visible entries (every line is an HTML comment) and `org.md`'s rules are wrapped multi-line prose rather than single-line entries the claim-sources sensor can match exactly
- 2026-07-26T16:22:20Z — treated the user as both sole stakeholder and sole decision-maker pending Q5/Q6 answers; a personal site has no organisational stakeholder structure, so those questions lead with "None"/"Not applicable" options per the stage's narrow-intent rule

## Deviations
<!-- example: 2026-05-29T10:14:32Z — skipped the optional caching layer the stage prose suggested; the dataset is small enough that it adds risk -->
- 2026-07-26T16:22:20Z — authored each question with four substantive options (A-D) plus `X. Other` instead of the stage prose's A-E; this harness renders at most 4 options and auto-appends an Other escape, so A-E would have forced the §3 option-splitting path across all 8 questions. Collapsing to A-D keeps the file and the rendered prompt 1:1 with no option hidden from the user, which is what the split rule exists to protect
- 2026-07-26T16:22:20Z — made Q1, Q3, and Q5 multi-select rather than forcing a single choice; the "several of the above" option they would otherwise need is better expressed by the harness's native multi-select than by a synthetic fifth option

## Tradeoffs
<!-- example: 2026-05-29T10:14:32Z — picked TDD over BDD this run; the team is unit-first and the domain is well-understood -->

## Tradeoffs
<!-- example: 2026-05-29T10:14:32Z — picked TDD over BDD this run; the team is unit-first and the domain is well-understood -->
- 2026-07-26T19:35:00Z — reviewer (aidlc-product-lead-agent, iteration 1) returned NOT-READY on first draft of intent-statement.md and stakeholder-map.md: family members' names had been fabricated into stakeholder-map.md under a `[Q5]` tag whose actual confirmed answer was "None"; Initiative Trigger cited `[Q7]` for a shipping-speed claim `[Q7]` never made; Q8's unselected wider-scope option had been rewritten into an exclusion list with an unsourced "CMS" item added; two Problem Statement clauses were tagged `[Q1]` for content that actually came from `[Q3]`/`[desc]`; a scope bullet attached stage-count/depth/domain detail to the `[scope]` tag, which only proves the workflow-selected scope name. All five fixed by rewriting both artifacts to state only what the cited tag actually supports; the family-names row was removed rather than genericized, since Q5's answer was "None" — the fact that the category was considered and ruled out is preserved, but no unconfirmed names are

- 2026-07-26T19:50:00Z — reviewer iteration 2 confirmed all 5 iteration-1 findings resolved but surfaced one new MEDIUM finding (stakeholder-map.md's Marlow Fernandez row cited [Q5],[Q6] for a "professional home" phrase that traces to [Q1]). `reviewer_max_iterations: 2` was now exhausted, so per stage-protocol §12a ("If READY or iterations exhausted: proceed") this was fixed directly (added `[Q1]` to the row's Source column) rather than dispatching a third review round — a single-tag addition, not new content requiring adversarial re-check

- 2026-07-26T20:05:00Z — §13 learnings ritual: surfaced 6 candidates (c1-c6) but the 4-option-per-question harness cap meant batch 1 could only offer 3 individual candidates + a discard-all option, so c2 ("treated user as sole stakeholder/decision-maker pending Q5/Q6") was dropped from the question entirely rather than shown and declined — judged low-risk since c2 describes a single-run assumption, not a durable practice candidate, but it did not get the verbatim per-candidate rendering the ritual calls for. Also merged c5+c6 into one synthesized "verify semantic entailment" option rather than quoting either verbatim (their full text is paragraph-length, not option-label-sized), and did not separately offer the "promote to team.md" affordance the ritual describes — defaulted all three kept learnings to project scope, matching each candidate's own `default_scope`

## Open questions
<!-- example: 2026-05-29T10:14:32Z — confirm the retention window with compliance before the next stage hardens the schema -->
- 2026-07-26T16:22:20Z — the resume PDF `Marlow_Fernandez_Resume.pdf` sits uncommitted in the root of an already-public GitHub repo; the composer routed the "what contact detail is public" decision to requirements-analysis (2.3), but the file is exposed to any `git add -A` before then
- 2026-07-26T16:22:20Z — `AWS_AIDLC_DEFAULT_SCOPE` is `mvp` while this intent runs `personal-static-site` (keywords: []); a bare `/aidlc` resolves `mvp`, so resuming this intent needs the intent cursor rather than scope inference
