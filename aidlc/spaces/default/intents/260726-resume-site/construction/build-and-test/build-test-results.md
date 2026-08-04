# Build & Test Results — marlowfernandez.com

**Intent:** `260726-resume-site` · **Stage:** build-and-test
**Executed:** 2026-08-02, against the committed tree at `ffb292d`
**Consumes:** both units' [code-generation-plan.md](../site-shell-walking-skeleton/code-generation/code-generation-plan.md) and [code-summary.md](../content-sections/code-generation/code-summary.md)

These are actually-executed results, not projections.

## Results

| Command | Exit | Result |
|---|---|---|
| `npm run build` | **0** | Compiled successfully; TypeScript clean; 3/3 static pages generated; export written to `out/` |
| `npm test` | **0** | **110 passed / 110 total**, 11 test files, 2.76s |
| `npm run lint` | **0** | ESLint clean, no output |
| `npm run typecheck` | **0** | `tsc --noEmit` clean |

**No failures. No fixes were required at this stage** — Step 10's diagnose-and-fix loop did not need to run.

## Routes Generated

```
Route (app)
┌ ○ /
└ ○ /_not-found

○  (Static)  prerendered as static content
```

Both routes static — consistent with `output: 'export'` and the no-runtime-services architecture.

## Test Inventory

| File | Covers |
|---|---|
| `src/lib/theme.test.ts` | Theme resolution, persistence, `localStorage`-unavailable fallback |
| `src/app/theme-variant.test.ts` | No-JS theme correctness (compiles real CSS, resolves cascade without running component JS) |
| `src/components/ThemeToggle.test.tsx` | Toggle behavior, `aria-pressed`, dynamic `aria-label`, keyboard activation |
| `src/components/ExternalLink.test.tsx` | `rel`/`target`, new-tab announcement |
| `src/components/shell.test.tsx` | Header / Hero / Footer smoke renders |
| `src/content/schema.test.ts` | Content-schema validation, valid and malformed |
| `src/components/ExperienceSection.test.tsx` | 4 employer blocks; Vynkor line as its own element |
| `src/components/AIEngineeringSection.test.tsx` | Plain comma-separated text; **zero anchor elements** |
| `src/components/EducationSection.test.tsx` | Renders from frontmatter |
| `src/components/ContactSection.test.tsx` | Renders from frontmatter |
| `src/app/page.test.tsx` | Section order — mobile AI-first, desktop Experience-left |

## Coverage Assessment

No numeric coverage figure is reported, and that is deliberate: `team.md`'s Testing Posture dropped coverage floors for this project in favor of a named check set. Every named check has a corresponding test above, and all pass.

## Regression Guard — Independently Falsification-Verified

The most important test here is `theme-variant.test.ts`, because it covers a path (`JavaScript disabled + OS dark preference`) that no other test can reach — every other test executes the component's JS, which is precisely why none of them caught the original bug.

It was verified by falsification during this workflow, twice: reverting `globals.css` to the pre-fix one-liner produces exactly **2 failures**, including `shows the moon when the OS prefers dark` — the precise reported symptom — and restoring returns the file byte-identical. The guard is real, not decorative.

## Not Executed Here — With Owners

| Check | Status | Owner |
|---|---|---|
| Lighthouse budgets (Perf ≥90 / A11y ≥95 / BP ≥90 / SEO ≥90) | Thresholds confirmed, **not yet measured** | `ci-pipeline` (3.7) wires; `deployment-execution` (4.3) verifies live |
| Link resolution | Not run | `ci-pipeline` (3.7) |
| `npm audit` in CI | Known: 3 high, none fixable | `ci-pipeline` (3.7) — report, never auto-remediate |
| Browser no-JS check | Verified by hand across a 6-state matrix; **not reproducible in CI** | Unowned — flagged for `ci-pipeline` |
| Manual WCAG items (tab order, screen reader, 200% zoom, touch targets) | Unverified | **Unowned** — `performance-validation` (4.6) is SKIP for this scope |
| Live-domain TLS and redirect | Not applicable yet | `deployment-execution` (4.3) |

## Assumptions & Open Questions

The two "Unowned" rows are genuine gaps, not oversights deferred to a stage that will catch them. Stated plainly so the deployment gate can weigh them.
