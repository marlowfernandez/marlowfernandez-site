# Unit Test Instructions — marlowfernandez.com

**Intent:** `260726-resume-site` · **Stage:** build-and-test
**Consumes:** both units' [code-generation-plan.md](../site-shell-walking-skeleton/code-generation/code-generation-plan.md) and [code-summary.md](../content-sections/code-generation/code-summary.md)

## Framework

Vitest 4 + Testing Library, jsdom environment. Config: `vitest.config.mts`, setup: `vitest.setup.ts`.

## Running

```bash
npm test            # single run
npm run test:watch  # watch mode
```

## Coverage Target — Named Checks, Not a Volume Quota

`team.md`'s Testing Posture (affirmed at Practices Discovery Q3) **deliberately dropped numeric coverage and per-component volume targets** for this project — a content site with near-zero business logic — and replaced them with a named check set. This stage's generic "5–8 tests per component" guidance does not apply here, and that substitution was confirmed by the human at Code Generation's plan gate.

The checks that must exist and pass:

| Check | Where | Why it exists |
|---|---|---|
| **Theme toggle behavior** | `src/lib/theme.test.ts`, `src/components/ThemeToggle.test.tsx` | Practices Discovery Q4 named it explicitly: state changes the render, preference persists across reload, focus visible, contrast holds in both themes |
| **No-JS theme correctness** | `src/app/theme-variant.test.ts` | Compiles the real `globals.css` with the real Tailwind compiler and resolves the cascade per (attribute × OS-preference) state. **Deliberately does not execute component JS** — that is the whole point; every other test does, which is exactly why none of them caught the original bug |
| **Content-schema validation** | `src/content/schema.test.ts` | Practices Discovery Q5: valid frontmatter passes, malformed frontmatter fails |
| **ExternalLink contract** | `src/components/ExternalLink.test.tsx` | `rel="noopener noreferrer"`, `target="_blank"`, and the "opens in new tab" announcement |
| **Section content fidelity** | `src/components/{Experience,AIEngineering,Education,Contact}Section.test.tsx` | Asserts against the **real** content files, not fixtures — so a deleted employer block or an expanded Vynkor line fails the suite |
| **Section order** | `src/app/page.test.tsx` | Guards mobile AI-Engineering-first / desktop Experience-left. This order was silently inverted once at Refined Mockups; the test exists so it cannot happen unnoticed again |
| **Shell smoke renders** | `src/components/shell.test.tsx` | Header, Hero, Footer render without throwing |

## Two Tests Worth Understanding Before Changing Them

**`theme-variant.test.ts` is falsification-verified.** Reverting `globals.css` to the pre-fix one-liner makes exactly 2 tests fail, including `shows the moon when the OS prefers dark` — the precise reported symptom. That was checked by hand during Code Generation and again at this stage. If you change the theme CSS and this test still passes, be suspicious: confirm it can still fail.

**The content tests assert against real MDX.** `vitest.config.mts` carries a frontmatter transform so `import { experience } from '@/content'` resolves under Vitest (which does not run `@next/mdx`). Without it, every content assertion would run against a fixture and could not catch real content regressions. The transform and the real build both parse with the same installed `yaml@2.9.0`; the residual risk is the extraction boundary (regex vs. `remark-frontmatter` delimiter detection), which would surface as a build failure rather than a silent pass — documented in Unit 2's `code-summary.md`.

## Assumptions & Open Questions

None. Current result: **110 tests across 11 files, all passing** — see [build-test-results.md](build-test-results.md).
