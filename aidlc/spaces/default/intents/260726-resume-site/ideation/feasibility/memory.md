<!-- INVARIANT: examples are single-line HTML comments so a fresh template parses to total=0 (MEMORY_EMPTY). Do NOT un-comment or split across lines. t100 guards this. -->
> This file is maintained by the orchestrator during stage execution. Add observations at the gate ritual, not by editing here directly.

## Interpretations
<!-- example: 2026-05-29T10:14:32Z — chose REST over GraphQL; the consuming team only needs CRUD, revisit if subscriptions land -->
- 2026-07-26T21:00:00Z — retargeted this stage's topic list from the stage prose's generic corporate-feasibility framing (integration constraints, PCI/HIPAA/SOC2, team tech stack, AWS accounts) to what actually applies to a static personal site with one stakeholder: stack choice, hosting/DNS for two domains, budget ceiling, and whether any server-side element is needed at all. This is the depth-aware / project-context judgment the stage protocol §3 explicitly authorizes ("stage files list topic areas and example questions — they are guidance, not a script")
- 2026-07-26T21:00:00Z — this is the stage the composer specifically un-skipped because the user asked for stack options before committing to one; treated the stack-choice question as the central artifact of this stage rather than a footnote, with a real tradeoff matrix rather than an abstract question

## Deviations
<!-- example: 2026-05-29T10:14:32Z — skipped the optional caching layer the stage prose suggested; the dataset is small enough that it adds risk -->
- 2026-07-26T21:00:00Z — did not re-ask what content is public / resume-detail privacy; intent-capture's stakeholder-map and the composer's own routing already assign that decision to requirements-analysis (2.3), so re-asking here would be duplicate questioning across stages

## Tradeoffs
<!-- example: 2026-05-29T10:14:32Z — picked TDD over BDD this run; the team is unit-first and the domain is well-understood -->
- 2026-07-26T22:00:00Z — user picked Next.js (static export) over Astro/Eleventy/hand-rolled for the React-ecosystem skill-signal to recruiters, accepting a heavier default bundle than Astro would give; recorded the tradeoff explicitly in feasibility-assessment.md rather than silently treating it as the "obviously correct" choice, since Astro was genuinely the stronger pick on pure performance/simplicity grounds
- 2026-07-26T22:00:00Z — GitHub Pages + Hostinger-forwarding was confirmed over a DNS-both-domains-plus-client-redirect approach; the registrar-forwarding path is simpler and has no code-level failure mode, so this wasn't a close call once surfaced as a follow-up question (Q7)

## Open questions
<!-- example: 2026-05-29T10:14:32Z — confirm the retention window with compliance before the next stage hardens the schema -->
