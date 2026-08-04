# Quality Gates — marlowfernandez.com

**Intent:** `260726-resume-site` · **Stage:** ci-pipeline (3.7)
**Consumes:** [build-and-test-summary.md](../build-and-test/build-and-test-summary.md), [build-test-results.md](../build-and-test/build-test-results.md), both units' code-summary.md ([Unit 1](../site-shell-walking-skeleton/code-generation/code-summary.md), [Unit 2](../content-sections/code-generation/code-summary.md))
**Companion:** [ci-config.md](ci-config.md) — pipeline structure and rationale

## The Gate Set

Composition confirmed in `team.md` (Testing Posture); thresholds confirmed at NFR Requirements Q1.

| # | Gate | Blocking? | Where |
|---|---|---|---|
| 1 | Secret scan (`gitleaks`) | ✅ blocks commit | pre-commit |
| 2 | Format (`prettier --check`) | ✅ blocks commit + deploy | both |
| 3 | Lint (`eslint`) | ✅ blocks commit + deploy | both |
| 4 | Typecheck (`tsc --noEmit`) | ✅ blocks commit + deploy | both |
| 5 | Tests (`vitest run`) — incl. theme-toggle + content-schema | ✅ blocks commit + deploy | both |
| 6 | Build (static export) | ✅ blocks deploy | CI |
| 7 | Links resolve | ✅ blocks deploy | CI |
| 8 | Lighthouse budgets | ✅ blocks deploy | CI |
| 9 | Dependency audit | ⚠️ advisory | CI |

Gates 2–5 run in **both** layers deliberately. The local run is fast enough to be worth it (~3s for the suite) and prevents bad history; the CI run cannot be bypassed with `--no-verify`.

`team.md` names two checks explicitly, and both are gate 5 rather than separate steps:

- **Theme toggle behavior** — `ThemeToggle.test.tsx` (toggle, `aria-pressed`, dynamic `aria-label`, keyboard), `theme.test.ts` (resolution, persistence, `localStorage`-unavailable fallback), and `theme-variant.test.ts` (the no-JS cascade guard).
- **Build-time content-schema validation** — `schema.test.ts`, valid and malformed cases. Per `build-and-test-summary.md`, this is the one real integration boundary in the system: the MDX frontmatter contract between Unit 1's schema and Unit 2's content.

## Lighthouse Budgets — Now Measured

Both consumed artifacts flagged this as unverified. `build-and-test-summary.md` listed it as Known Limitation 1 ("thresholds are confirmed; no Lighthouse run has happened"), and `build-test-results.md` recorded it under "Not Executed Here" pending this stage.

**Executed 2026-08-03** against the built export served over HTTP, on Lighthouse's **default mobile profile** (simulated slow 4G + CPU throttling — the stricter profile, not desktop):

| Category | Threshold | **Measured** | Margin |
|---|---|---|---|
| Performance | ≥ 90 | **100** | +10 |
| Accessibility | ≥ 95 | **100** | +5 |
| Best Practices | ≥ 90 | **96** | +6 |
| SEO | ≥ 90 | **100** | +10 |

All four pass. Largest Contentful Paint measured 1,520 ms with a category score of 1.0.

Margins are comfortable, which is the expected outcome and the intended one: `performance-requirements.md` is explicit that the budget's job is **regression detection** — catching the day an unoptimised image or heavy embed lands — not policing a text-only static page that should trivially clear it.

### The one deduction is a real defect

Best Practices loses 4 points to a single failing audit, `errors-in-console`:

```
Failed to load resource: 404 (Not Found)  —  /favicon.ico
```

**The site has no favicon.** Every page load logs a 404 and browsers show a generic tab icon. A grep for "favicon" across `src/` and the entire intent record returns **nothing** — no stage from Rough Mockups through Code Generation ever decided one. This is a genuine gap that slipped every design stage, not a deliberate omission.

It is left unfixed here on purpose: choosing an icon is a visual identity decision, not CI-pipeline work. Raised at this stage's gate and filed as a follow-up. Fixing it should take Best Practices to 100.

### Assertion scope: the root page only

LHCI's `staticDistDir` mode audits **every** HTML file it discovers. The export emits four:

```
out/index.html            ← the actual site
out/404.html              ← kept per Q4
out/404/index.html        ← trailingSlash variant
out/_not-found/index.html ← Next's internal route
```

Only the first should gate a deploy. Error pages legitimately score poorly on SEO — they are not meant to be indexed — so asserting against them would redden the gate for correct behaviour.

`lighthouserc.json` therefore uses an `assertMatrix` keyed to `^https?://[^/]+/index\.html$`, anchored at the host root.

**The obvious pattern is wrong here, which is worth recording.** The first attempt used `.*/index\.html$` — which matches *three* of those four files, gating precisely the pages it was written to exclude. The bug was invisible until the built output was enumerated and the pattern tested against the real URL set; it would otherwise have surfaced as a mystifying CI failure on a correct build. All four files are still collected and reported; three are simply not gated.

`numberOfRuns: 3` — LHCI asserts against the median, which absorbs the run-to-run variance that would otherwise cause intermittent failures near a threshold.

## What These Gates Do Not Cover

Stated plainly, because `team.md` makes CI the last automated check before the public sees the site and an overstated gate is worse than a narrow one.

### Accepted with no owner — decided, not deferred (Q2)

`build-and-test-summary.md` item 2 and `build-test-results.md`'s "Unowned" row flagged manual WCAG items as having no downstream owner, since `performance-validation` (4.6) is SKIP for this scope. **Q2 answered that gap: no one will own it, by choice.**

Unverified and staying that way: tab-order reachability, screen-reader announcements, landmark structure, 200%-zoom usability, touch-target sizing, and the page-wide half of the focus-visibility requirement (the toggle's own focus ring is covered; every link is not).

Two consequences follow, and both are binding:

1. **Lighthouse Accessibility 100 is not WCAG 2.1 AA conformance.** Lighthouse automates a subset of AA criteria. The perfect score means every automated check passed — 40 further accessibility audits were reported "not applicable" to this page, and the manual criteria were never machine-evaluated at all.
2. **No document may describe this site as WCAG 2.1 AA conformant.** The defensible claim is "meets a Lighthouse Accessibility budget of ≥95, measured at 100." `accessibility-checklist.md`'s manual items remain documented and unverified.

### No real-browser no-JS check (Q3)

The 6-state matrix that proved the theme fix was run by hand and is not reproducible in CI. `theme-variant.test.ts` compiles the real stylesheet with the real Tailwind compiler and resolves the cascade through postcss and jsdom **without executing component JavaScript** — which is precisely why it reaches the `JS disabled + OS prefers dark` path that all eleven other test files miss.

It was falsification-verified twice: reverting `globals.css` to the pre-fix one-liner produces exactly 2 failures including `shows the moon when the OS prefers dark`, the precise reported symptom.

Q3 accepted this as sufficient rather than adding Playwright. **Residual risk:** a defect that manifests only through real-browser CSS behaviour the postcss cascade model does not reproduce would go uncaught.

### Nobody has visually looked at the page

Carried unchanged from `build-and-test-summary.md` item 7. Verification to date is measured geometry, computed contrast, and now Lighthouse — stronger than a screenshot for ordering and contrast, but typography rhythm and whether Point & Pay's 15-bullet block visually overwhelms the one-line AI Engineering column remain unjudged. No automated gate can answer this.

### `aria-pressed` without JavaScript

Carried from Unit 1's gate: the toggle announces itself unpressed and does nothing when JS is unavailable. Known, accepted, unfixed.

## Failure Behaviour

| Failure | Consequence |
|---|---|
| Any pre-commit gate | Commit is refused. Nothing enters history. |
| Any `verify` gate | Workflow red; `deploy` never starts; **live site unchanged**. |
| `npm audit` finding | Logged, run continues. Never blocks, never auto-remediates. |
| Deploy step itself | Site unchanged; previous deployment stays live. |

There is no automatic rollback because none is needed: a failed deploy is a no-op against a static host, and the previously published artifact remains served.

## Assumptions & Open Questions

- **Measured on one machine, one run set.** Scores came from a local Chrome on Windows; CI runs on Ubuntu runners, where absolute numbers will differ slightly. Margins of +5 to +10 should absorb that, but the first CI run is the real confirmation.
- **Gate 1 is operative.** *Corrected 2026-08-04:* this previously read "gate 1 is currently inoperative — gitleaks is not installed." gitleaks **8.30.1 was already installed**; the original check tested `PATH` availability and reported the result as absence. The hook now resolves the binary past `PATH` and uses the correct `gitleaks git --staged` subcommand (`protect` does not exist in this version). Both mandated secret-scanning layers are in place.
- **The favicon 404 is unresolved** and is the only thing between Best Practices 96 and 100.
