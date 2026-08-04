# Integration Test Instructions — marlowfernandez.com

**Intent:** `260726-resume-site` · **Stage:** build-and-test
**Consumes:** both units' [code-generation-plan.md](../content-sections/code-generation/code-generation-plan.md) and [code-summary.md](../content-sections/code-generation/code-summary.md)

## What "Integration" Means Here

This project has **no runtime services, no API, no database, and no cross-service calls** (`services.md`, ADR-6). The conventional integration surface — service boundaries, external dependencies, network contracts — does not exist. Saying so plainly is more useful than inventing tests for a boundary that isn't there.

There is exactly one real integration boundary, and it is a **build-time** one: the MDX frontmatter schema contract between the two units.

## The One Real Boundary: Unit 1's Schema ⇄ Unit 2's Content

Confirmed as a formal contract at `units-generation` Q4. Unit 1 defines the schema; Unit 2's content must conform.

| Test | Command | What it proves |
|---|---|---|
| Schema accepts valid content | `npm test -- schema` | Every real content file satisfies `src/content/schema.ts` |
| Schema rejects malformed content | `npm test -- schema` | A missing or wrong-typed required field actually fails, rather than passing silently |
| **The build itself** | `npm run build` | `src/content/index.ts` asserts every content file against the schema while pre-rendering. This is the load-bearing integration check — it runs through the real `@next/mdx` pipeline, not Vitest's transform |

The build is the authoritative version of this check. The Vitest tests are the fast feedback loop; `npm run build` is what actually proves the contract holds through the real pipeline.

## Composition Integration (Component Level)

| Test | Where | What it proves |
|---|---|---|
| Section order across breakpoints | `src/app/page.test.tsx` | `page.tsx` composes sections in the locked order — mobile AI-first, desktop Experience-left |
| Header ⇄ ContactSection consistency | `src/components/{shell,ContactSection}.test.tsx` | Both read the same contact object, so the two rendered copies cannot drift apart |

## Not Covered — and Owned Elsewhere

| Gap | Owner |
|---|---|
| Link resolution (do links actually resolve?) | `ci-pipeline` (3.7) — `team.md` names it in the CI gate |
| Real-browser behavior with JavaScript disabled | **Unowned.** Verified by hand during Code Generation across a 6-state matrix; not reproducible in CI. Flagged in Unit 1's `code-summary.md` as input for `ci-pipeline` |
| Deployed-site verification on both domains | `deployment-execution` (4.3) |

## Assumptions & Open Questions

None. The absence of a service-integration surface is a confirmed architectural fact from Feasibility, not an assumption made here.
