# Performance Test Instructions — marlowfernandez.com

**Intent:** `260726-resume-site` · **Stage:** build-and-test
**Consumes:** both units' [code-summary.md](../site-shell-walking-skeleton/code-generation/code-summary.md), and the NFR budgets in [performance-requirements.md](../site-shell-walking-skeleton/nfr-requirements/performance-requirements.md)

## The Budget CI Must Enforce

Confirmed at NFR Requirements Q1 ("Solid"). These are hard failures, not warnings:

| Lighthouse category | Minimum |
|---|---|
| Performance | 90 |
| Accessibility | 95 |
| Best Practices | 90 |
| SEO | 90 |

**No Core Web Vitals thresholds** (NFR Q2) and **no bundle-size budget** (NFR Q4). Both were deliberate: for a static export shipping almost no client JS, separate LCP/CLS/INP thresholds add CI config to maintain without catching much the aggregate score would miss.

## How to Run

Against the **built export**, never the dev server — the two differ, and GitHub Pages only ever serves `out/`:

```bash
npm run build
npx serve out          # or: npm start
npx lighthouse http://localhost:3000 --view
```

For CI, `ci-pipeline` (3.7) should wire `@lhci/cli` with an assertion config carrying the four thresholds above. That stage owns the wiring; this document owns the numbers.

## The Accessibility Threshold Is Not the Accessibility Target

Worth stating precisely, because conflating these would be easy and wrong: **a Lighthouse Accessibility score of ≥95 is not WCAG 2.1 AA conformance.** Lighthouse automates only a subset of AA criteria. The ≥95 score is a CI regression guard; the real target is verified against [accessibility-checklist.md](../../inception/refined-mockups/accessibility-checklist.md)'s manual items.

Automated coverage of those manual items is **partial**:

- **Covered** — the theme toggle's own focus ring and contrast, via the theme-toggle check.
- **Not covered** — the page-wide half of the focus requirement (every link, not just the toggle), tab-order reachability, screen-reader announcements, landmark structure, 200%-zoom usability, and touch-target sizing. `performance-validation` (4.6) is SKIP for this scope, so **no stage owns closing that gap**. Whoever builds and reviews the site is the only check.

## What Actually Drives the Score

From `performance-requirements.md`, the levers that exist in this codebase:

- **Client JS is one component.** Only `ThemeToggle` ships client-side JavaScript. This is the single largest lever and it is deliberately minimal — adding `'use client'` anywhere else is a real performance decision.
- **System-font stack, no webfont.** No render-blocking font request and no loading flash.
- **Static export.** Every page pre-rendered at build time; no server round-trip, no client-side fetching.
- **No images.** None are in the confirmed content model. If one is added later it becomes the dominant factor and directly pressures the Performance ≥90 budget — image optimization would need designing at that point.

Realistically the budget should not be tight for a text-only static page. Its job here is regression detection — catching the day an unoptimized image or heavy embed lands, not policing prose.

## Assumptions & Open Questions

Lighthouse has not been run against this build yet — `ci-pipeline` (3.7) wires it and `deployment-execution` (4.3) verifies on the live domain. The thresholds above are confirmed; the scores are not yet measured.
