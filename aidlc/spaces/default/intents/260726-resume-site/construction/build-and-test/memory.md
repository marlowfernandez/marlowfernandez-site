<!-- INVARIANT: examples are single-line HTML comments so a fresh template parses to total=0 (MEMORY_EMPTY). Do NOT un-comment or split across lines. t100 guards this. -->
> This file is maintained by the orchestrator during stage execution. Add observations at the gate ritual, not by editing here directly.

## Interpretations
<!-- example: 2026-05-29T10:14:32Z — chose REST over GraphQL; the consuming team only needs CRUD, revisit if subscriptions land -->
- 2026-08-02T22:30:00Z — `Test Strategy: Standard` maps in the stage file to unit + integration instructions only, but the engine's `produces` list also names performance and security test instructions. Generated all of them, because the stage's own escape hatch applies squarely here ("the LLM can generate additional test types at any strategy level if context demands it") and this project genuinely has NFR performance requirements (Lighthouse budgets) and NFR security requirements (meta-tag CSP with documented platform limits). Honored the engine-resolved produces list over the stage prose's strategy table
- 2026-08-02T22:30:00Z — wrote the test instructions against `team.md`'s named check set (build succeeds, links resolve, a11y/perf budgets pass, theme-toggle behavior, content-schema validation) rather than the stage prose's "5-8 tests per component" volume target. Same reasoning confirmed at code-generation's plan gate: `team.md` is the human-affirmed narrower layer and it deliberately replaced volume targets for this content site

## Deviations
<!-- example: 2026-05-29T10:14:32Z — skipped the optional caching layer the stage prose suggested; the dataset is small enough that it adds risk -->

## Tradeoffs
<!-- example: 2026-05-29T10:14:32Z — picked TDD over BDD this run; the team is unit-first and the domain is well-understood -->

## Open questions
<!-- example: 2026-05-29T10:14:32Z — confirm the retention window with compliance before the next stage hardens the schema -->
