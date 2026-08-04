# Build and Test Summary — marlowfernandez.com

**Intent:** `260726-resume-site` · **Stage:** build-and-test
**Consumes:** both units' [code-generation-plan.md](../site-shell-walking-skeleton/code-generation/code-generation-plan.md) and [code-summary.md](../content-sections/code-generation/code-summary.md)

## Build Status

**Green across all four checks**, executed against the committed tree — see [build-test-results.md](build-test-results.md) for raw output.

| Check | Exit |
|---|---|
| `npm run build` | 0 — static export, 3/3 pages |
| `npm test` | 0 — 110/110 passing |
| `npm run lint` | 0 |
| `npm run typecheck` | 0 |

Prerequisites are minimal: Node 24+, npm, `npm install`. No environment variables, no local services, no external dependencies at build time.

## Test Type Inventory

| Type | Generated | Notes |
|---|---|---|
| Unit | [unit-test-instructions.md](unit-test-instructions.md) | Named check set, not a volume quota — per `team.md` |
| Integration | [integration-test-instructions.md](integration-test-instructions.md) | One real boundary: the MDX schema contract between units. No service surface exists |
| Performance | [performance-test-instructions.md](performance-test-instructions.md) | Beyond Standard's baseline — generated because real NFR budgets exist |
| Security | [security-test-instructions.md](security-test-instructions.md) | Beyond Standard's baseline — generated because real NFR security requirements exist |

Standard strategy nominally calls for unit + integration only. Performance and security were added because this project has genuine NFR requirements in both areas and the engine's `produces` list named them — the stage's own escape hatch covers exactly this case.

## Coverage Expectations Per Unit

| Unit | Covered by |
|---|---|
| `site-shell-walking-skeleton` | Theme resolution/persistence/failure-handling, no-JS theme correctness, ThemeToggle ARIA + keyboard, ExternalLink contract, shell smoke renders, content-schema validation |
| `content-sections` | All four section components asserted against **real** content files, section order, Vynkor line as a separate element, zero anchors in AI Engineering |

No numeric coverage floor — deliberately, per `team.md`'s affirmed Testing Posture.

## Readiness Assessment

| Dimension | Status |
|---|---|
| **Build-ready** | ✅ Yes — clean build to `out/`, reproducible from a fresh `npm install` |
| **Test-ready** | ✅ Yes — 110 tests, every `team.md`-named check has a corresponding test, all passing |
| **Deployment-ready** | ⚠️ **Conditionally.** The artifact builds and is correct as far as anything has actually measured. But three things are genuinely unverified — see below. Nothing blocks proceeding to `ci-pipeline`; these should be weighed before the site goes live |

## Known Limitations and Outstanding Items

Stated plainly rather than deferred to a stage that may not catch them:

1. **Lighthouse budgets are set but never measured.** Perf ≥90 / A11y ≥95 / BP ≥90 / SEO ≥90 are confirmed thresholds; no Lighthouse run has happened. `ci-pipeline` (3.7) wires it, `deployment-execution` (4.3) verifies live.

2. **Manual WCAG items have no owner.** Tab-order reachability, screen-reader announcements, landmark structure, 200%-zoom usability, and touch-target sizing are all unverified. `performance-validation` (4.6) is SKIP for this scope, so **no stage is scheduled to close this**. The Lighthouse Accessibility score covers only a subset and is not AA conformance.

3. **No browser-based no-JS check in CI.** The 6-state matrix that proved the theme fix was run by hand and is not reproducible in CI, where `team.md` makes CI the sole gate before deploy.

4. **`out/404.html` contradicts a locked decision.** Refined Mockups Q1 confirmed no custom 404; Next's export always emits one and GitHub Pages prefers it. `deployment-pipeline` (4.1) must either delete it or the decision gets amended.

5. **`aria-pressed` is inaccurate without JavaScript.** The button announces itself unpressed and does nothing. Carried from Unit 1's gate.

6. **`npm audit`: 3 high, none fixable** inside `next@16.2.12`'s tree. Per `project.md`, CI reports and never auto-remediates.

7. **Nobody has visually looked at the page.** Verification used measured geometry and computed contrast — stronger than a screenshot for ordering and contrast, but typography rhythm and whether Point & Pay's 15-bullet block overwhelms the one-line AI Engineering column remain unjudged.

## Assumptions & Open Questions

Items 2, 3, and 7 are the ones with no downstream owner. The rest have a named stage that will address them.
