# Performance Requirements — content-sections

**Intent:** `260726-resume-site` · **Stage:** nfr-requirements · **Unit:** `content-sections`
**Consumes:** [requirements.md](../../../inception/requirements-analysis/requirements.md)

`business-logic-model.md` and `business-rules.md` are absent by design (`functional-design` is SKIP for this composed scope). Per this stage's Step 2 fallback, performance context derives from `requirements.md` and the Inception design artifacts rather than being invented.

## Inherited Site-Wide Budget

The Lighthouse thresholds are site-wide facts, not per-unit ones — a Lighthouse run scores the deployed page, not a component group. They were confirmed once during this stage's `site-shell-walking-skeleton` pass and apply unchanged here:

| Category | Minimum score |
|---|---|
| Performance | 90 |
| Accessibility | 95 |
| Best Practices | 90 |
| SEO | 90 |

The same holds for the Core Web Vitals decision (no separate metric budgets) and the bundle-size decision (no budget). See [the shell unit's performance-requirements.md](../../site-shell-walking-skeleton/nfr-requirements/performance-requirements.md) for the full rationale, the WCAG-vs-Lighthouse distinction, and the precise split of which accessibility items do and do not have automated coverage — none of that is restated here, to avoid two copies drifting apart.

## What This Unit Actually Controls

The shell unit owns the levers that set the performance profile (client JS, fonts, static export). This unit owns **content volume**, which is a different and narrower lever:

- **Text weight.** `requirements.md` confirms full-detail bullets for all 4 employer blocks plus full education/certification detail. This is the largest single contributor to page weight in a site with no images and no client-side data fetching. It is text, so it gzips extremely well — but it is not free, and it is the one thing this unit can regress.
- **No images confirmed for v1.** No logo, no headshot, no screenshots are in `requirements.md`'s content model. If any image is added later, it becomes the dominant performance factor on this page and directly pressures the Performance ≥90 threshold — image optimization would need designing at that point, and it isn't designed now because there are no images to optimize.
- **No per-section lazy loading.** Every section renders in the initial HTML. This is correct for a single-page resume whose whole value is being scannable in one pass, and it means there is no deferred-loading complexity to tune.

## Realistic Assessment

A text-only, image-free, single-page static export with one small client-side component should clear Performance ≥90 comfortably — the budget is not expected to be tight for this unit's content. The threshold's real job here is regression detection: catching the day someone adds an unoptimized image or a heavy embed, not policing ordinary prose.

## Assumptions & Open Questions

None. The inherited budgets trace to the **`site-shell-walking-skeleton` unit's** confirmed Q1/Q2/Q4 — this unit has no questions file of its own, because the budgets are site-wide and were answered once during that unit's pass. The content-volume analysis traces to `requirements.md`'s confirmed content model.

## Review

**Reviewer:** aidlc-architecture-reviewer-agent
**Verdict:** READY

**Why this pass exists:** freshness re-verification, not a re-review from scratch. This unit's three `nfr-requirements` artifacts have not changed since the iteration-2 READY recorded above (now superseded by this section). A failed approval attempt caused the engine's revision backstop to backfill a `GATE_REJECTED` audit row, and the completion guard only honors review receipts recorded after any later `GATE_REJECTED` — so a fresh receipt is required over the same, unchanged content.

### Check 1 — closing citation still correct and internally consistent

Line 10: "confirmed once during this stage's `site-shell-walking-skeleton` pass." Line 35 (closing): "the inherited budgets trace to the **`site-shell-walking-skeleton` unit's** confirmed Q1/Q2/Q4." Cross-checked directly against the shell unit's `performance-requirements.md`: Lighthouse Budget "Confirmed at this stage's Q1," Core Web Vitals "Confirmed at Q2," Bundle Size "Confirmed at Q4" — exact match. The two attributions in this file agree with each other and with the shell source. `construction/content-sections/nfr-requirements/` still has no questions file of its own, so the sentence remains sound only because it attributes the Qs to the shell unit, which it correctly does. No regression.

### Check 2 — cross-referenced shell artifacts re-verified after the shell unit's Review/Closure rewrite

The shell unit's `performance-requirements.md` (exempt path) has had its Review section and Closure note rewritten since the iteration-2 pass above — now walking through a self-corrected iteration-count analysis and re-confirming the accessibility-coverage-split fix landed. Its substantive body is unchanged: Lighthouse Budget table (90/95/90/90), the WCAG-vs-Lighthouse distinction, the two-bullet automated-coverage split (theme-toggle-only coverage vs. the uncovered page-wide focus/tab-order/screen-reader/zoom/touch-target items), Core Web Vitals (no separate budget), and Bundle Size (no budget) — all read identically to what this file's line 19 describes ("the full rationale, the WCAG-vs-Lighthouse distinction, and the precise split of which accessibility items do and do not have automated coverage"). The shell file's own newest Review section independently confirms this via its Check 3 ("unchanged... no misquote, no regression"). Line 19's description remains accurate.

Also re-checked the other two shell cross-references this unit depends on:
- `security-requirements.md` line 10 → shell's `security-requirements.md`: transport security, CSP-by-meta-tag partiality (no `frame-ancestors`, no HSTS), and the supply-chain/secrets rules are unchanged and match exactly.
- `tech-stack-decisions.md` line 10 → shell's `tech-stack-decisions.md`: the Confirmed Stack table (Next.js, TypeScript, Tailwind, MDX, GitHub Pages, Hostinger DNS, system fonts) is unchanged and matches exactly.

### Check 3 — regression scan across all three of this unit's artifacts

Read `performance-requirements.md`, `security-requirements.md`, and `tech-stack-decisions.md` in full. Content-volume analysis, the disclosure list and Q9/Q9-C framing, the Vynkor-line constraint, the consumer table (MDX pipeline, frontmatter schema, Tailwind tokens, App Router structure), and the content-schema-validation scope note are all unchanged from the iteration-2 pass and remain internally consistent and correctly cited. No regression found.

**Outcome:** Content is unchanged and still sound. This is a fresh receipt over the same verified state — not a new finding. READY.
