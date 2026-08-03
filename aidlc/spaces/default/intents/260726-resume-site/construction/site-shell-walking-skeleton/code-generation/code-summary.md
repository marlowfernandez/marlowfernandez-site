# Code Summary — site-shell-walking-skeleton

**Intent:** `260726-resume-site` · **Stage:** code-generation · **Unit:** `site-shell-walking-skeleton`
**Consumes:** [unit-of-work.md](../../../inception/units-generation/unit-of-work.md), [requirements.md](../../../inception/requirements-analysis/requirements.md)

## Verification (independently re-run by the orchestrator, not taken on report)

| Check | Result |
|---|---|
| `npm run build` | **PASS** — Next.js 16.2.12, compiled in 2.2s, TypeScript clean, 3 static pages generated, static export to `out/` |
| `npm test` | **PASS** — 66 tests across 6 files (Vitest 4.1.10), after the iteration-1 fix added `theme-variant.test.ts` |
| `npm run lint` | **PASS** — ESLint, no output (clean) |
| `npm run typecheck` | PASS (reported; `tsc` also runs inside `build`, which passed) |
| Browser verification of the real export | Reported by the developer agent: theme resolution/persistence, focus ring, skip link, landmarks, `rel="noopener noreferrer"`, and both section orderings (mobile AI-first, tablet+ two-column) |

## Files Created

**Config:** `package.json`, `package-lock.json`, `tsconfig.json`, `next.config.mjs`, `postcss.config.mjs`, `eslint.config.mjs`, `.prettierrc`, `.prettierignore`, `vitest.config.mts`, `vitest.setup.ts`. `.gitignore` appended (AI-DLC section untouched); `README.md` extended with a "The site" section.

**Source** (`src/`): `app/{layout,page}.tsx`, `app/globals.css`, `mdx-components.tsx`, `components/{Header,Hero,Footer,ThemeToggle,ExternalLink,ContactIcons,PlaceholderSection}.tsx`, `lib/{theme,theme-store,theme-script,csp}.ts`, `content/{schema,index}.ts` + 5 `.mdx` files, `types/mdx.d.ts`.

**Tests:** `lib/theme.test.ts`, `components/{ThemeToggle,ExternalLink,shell}.test.tsx`, `content/schema.test.ts`, `app/theme-variant.test.ts` (added at iteration 1's fix — compiles the real CSS and resolves the cascade without executing component JS).

## Key Implementation Decisions

- **`useSyncExternalStore` for theme state** rather than the plan's `useState` + `useEffect`. The planned shape triggers Next 16's `react-hooks/set-state-in-effect` lint error — a real error, not noise. The store form also puts theme genuinely outside React with a `null` server snapshot, which eliminates the hydration-mismatch bug class rather than suppressing it.
- **Pre-hydration inline script** sets the theme before first paint, so there is no flash of the wrong theme.
- **Contact placeholders use the reserved `.invalid` TLD**, so a premature deploy cannot route mail anywhere real.

## Deviations From the Plan

| # | Deviation | Why |
|---|---|---|
| 1 | No `tailwind.config.ts` | Tailwind 4 is CSS-first; tokens live in `globals.css` via `@theme`. Collapses plan Steps 1 and 3 into one file — token and consuming utility are now the same declaration |
| 2 | `src/mdx-components.tsx` added (unplanned) | `@next/mdx` requires it for App Router. Without it the build fails at page-data collection (`w.default.createContext is not a function` — compiled MDX falls back to `@mdx-js/react`'s provider, whose context doesn't exist in RSC). `@mdx-js/react` was dropped as a dependency |
| 3 | `src/lib/theme-store.ts` added | See `useSyncExternalStore` note above |
| 4 | `PlaceholderSection` — a 10th component not in `components.md` | Deliberate: stubbing Unit 2's four component *names* would make Unit 2 replace files rather than create them, and a half-built `ExperienceSection` reads as finished work. Marked delete-in-Unit-2 in its own docblock |
| 5 | `eslint` key removed from `next.config.mjs` | Next 16 dropped the build-time ESLint option. Lint is a standalone step, which is where `team-practices.md` puts it |
| 6 | Smoke tests share `shell.test.tsx` | One file rather than three near-identical ones |
| 7 | `src/` prefix vs ADR-5's `app/`, `components/`, `content/` | The plan specified `src/`; `src/` is a first-class Next convention. **But ADR-5 says deviations should be a fresh decision, not implicit drift** — flagged below rather than absorbed silently |
| 8 | `Header` takes `{ name, contactInfo }`; `components.md`'s Public Interfaces table and `component-methods.md`'s render contract both list `contactInfo` only | **A gap in the design artifacts, not an implementation error — and `components.md` contradicts itself on it.** That same file describes `Header` as *"Top bar: name, contact icons, theme toggle"*, and `mockups.md` § Section-by-Section Detail → Header opens with *"Name (not a link…)"*. So the name is required in the header by both documents' prose; only the interface table omits the input needed to render it. A `Header` built from `contactInfo` alone cannot satisfy the mockup, and the alternative — reaching into content from inside `Header` — would break the pure-presentational boundary `components.md` itself sets. Recorded here per ADR-5 rather than absorbed silently; `components.md` and `component-methods.md` should gain `name: string` when next revised |

## Findings Requiring a Decision — Not Worked Around

### 1. `out/404.html` contradicts a locked decision (verified present)

Refined Mockups Q1 confirmed *"no custom 404 page — a broken/mistyped URL shows GitHub Pages' default 404."* Next's static export **always** emits `404.html`, and GitHub Pages serves that in preference to its own. Verified: `out/404.html` exists, 11,910 bytes. Visitors get Next's minimal 404, not GitHub's.

Not silently accepted. Either the Refined Mockups decision is amended, or `deployment-pipeline` (4.1) deletes `out/404.html` as a build step. Left in place pending that call.

### 2. CSP is weaker than `security-requirements.md` currently documents

Three gaps **beyond** the already-recorded `frame-ancestors` and HSTS limits:

- **`script-src` requires `'unsafe-inline'`.** The export contains 12 `self.__next_f.push(...)` inline scripts. A nonce needs a server (there is none); hashes can't be partial, because CSP3 makes browsers ignore `'unsafe-inline'` once any hash is present — so a partial hash list breaks the page rather than degrading gracefully.
- **`style-src` also requires `'unsafe-inline'`** (`src/lib/csp.ts` line 49). Next emits inline `style="..."` attributes for its own layout primitives, and the auto-generated `out/404.html` additionally carries a `<style>` block injected via `dangerouslySetInnerHTML`. Under a strict `style-src 'self'` those are all dropped and the affected markup renders unstyled. The same two escape hatches are unavailable for the same reasons as above: a nonce needs a server, and a hash list would have to be recomputed per build and breaks the page the moment it is incomplete. Same shape of residual risk as the `script-src` gap and bounded by the same fact — no user input, no forms, no third-party content, so there is no path for an attacker-controlled string to reach the document.
- **The meta tag is not first in `<head>`.** Next hoists its stylesheet and five `<script src>` tags above it, placing them outside the policy. They are same-origin and `'self'` would have permitted them, so nothing is functionally broken — but "declare CSP first" is not achievable on this stack.

All three documented in `src/lib/csp.ts`. `security-requirements.md` should be updated to record them, or this stands as a known documentation gap.

### 2b. `aria-pressed` is still inaccurate with JavaScript disabled (new, surfaced while fixing the icon bug)

The reviewer's HIGH finding — the theme icon stuck on "sun" with JS disabled under an OS dark preference — is **fixed and verified**: `globals.css`'s `dark` variant is now a two-branch `@custom-variant` (explicit `[data-theme]` override, plus `@media (prefers-color-scheme: dark)` suppressed by an explicit `light` override). A regression test (`src/app/theme-variant.test.ts`) compiles the real CSS with the real Tailwind compiler and resolves the cascade per state, so it does not depend on the component's JS running. It was falsification-tested: reverting to the buggy one-liner makes it fail with `expected 'sun' to be 'moon'`.

**But the same class of bug remains one layer over.** The static export ships `aria-pressed="false"` and a fixed `aria-label="Switch colour theme"`. With JS disabled and an OS dark preference, the page is dark and the icon is now correctly a moon — yet the button still announces itself as unpressed, and clicking does nothing. The CSS fix corrects the *visual* desync only; the *accessibility state* in the no-JS case stays inaccurate, and no test covers it.

Not fixed here, because the honest options are both real decisions rather than a code tweak: either render the button only after hydration (removing a visible-but-dead control, at the cost of a layout shift), or accept that the toggle is a JS-only affordance and describe it as such. Carried to the gate.

### 2c. No browser-based no-JS check runs in CI

The regression test above resolves the cascade in Node; it does not run a browser. The six-state matrix (OS preference × `data-theme`) that actually proved the fix was run by hand this session and is **not reproducible in CI**. Given `team.md` names CI as the sole gate before a production deploy, that is a real gap in what the gate can catch — relevant input for `ci-pipeline` (3.7).

### 3. `npm audit`: 3 high severity, none fixable

postcss and sharp, both inside `next@16.2.12`'s own dependency tree. `npm audit fix --force` proposes downgrading Next to 9.3.3 — not viable. ESLint 10 would clear a fourth chain (brace-expansion → minimatch) but **breaks `eslint-config-next@16.2.12`** (verified: `react/display-name: contextOrFilename.getFilename is not a function`), so ESLint stays at 9.39.5. An `overrides` pin of brace-expansion was tried and reverted (broke minimatch 3). Nothing actionable at this layer; relevant to `project.md`'s manual-dependency-review rule.

### 4. Silent error handling vs. the Construction guardrail

`construction.md` states *"silent failures are not acceptable."* `theme.ts` deliberately swallows `localStorage` errors. But `unit-of-work.md` and `component-methods.md` both **specify exactly that behavior** (silent fallback on read, silent no-op on write). The narrower unit-level spec was followed, with every `catch` annotated with the condition it absorbs and why. Recorded here because it is a genuine tension between two governing documents, resolved in favor of the more specific one.

### 5. Accessibility items this unit did not close

200% zoom usability and measured contrast ratios remain unverified. `performance-requirements.md` already lists both as having no automated coverage — this unit did not change that.

## Assumptions & Open Questions

Findings 1, 2, and the Deviation-7 `src/` question are open decisions carried to the approval gate rather than resolved unilaterally.

## Review

**Reviewer:** aidlc-architecture-reviewer-agent
**Verdict:** READY

**Scope of this pass (iteration 2):** re-verification of the three iteration-1 findings against the current files, plus an accuracy check on the two newly self-reported items (2b, 2c). Per the dispatch brief, the rest of the iteration-1 adversarial pass (section order, landmarks, static-export integrity, placeholder content) was not re-run — it was already confirmed clean and nothing in this iteration's diff touches it. Verification performed independently rather than taken on report: read `globals.css`, `theme-variant.test.ts`, `ThemeToggle.tsx`, `csp.ts`, `Header.tsx`, `out/index.html`, and this document directly; ran `npm test -- --run` myself (66/66, 6 files); then **falsified** the fix by reverting `globals.css`'s `@custom-variant dark` block to the exact one-liner iteration 1 flagged, re-ran the suite, confirmed 2 failures (`compiles rules for these classes in both branches`, `shows the moon when the OS prefers dark` — `expected 'sun' to be 'moon'`), and restored the fix (66/66 green again, file confirmed identical to the reviewed version afterward).

### Finding 1 (HIGH, iteration 1) — FIXED, verified by falsification

`globals.css:49-59` now defines `@custom-variant dark` as two branches: an explicit `[data-theme='dark']` match, and a `@media (prefers-color-scheme: dark)` branch suppressed by an explicit `[data-theme='light']` override. Traced the cascade by hand for all four (attribute × OS-preference) states plus the two explicit-override states — the logic is sound: explicit override beats OS preference in both directions, OS preference governs when no override is set, matching the color-token layers immediately above it in the same file.

The regression test (`src/app/theme-variant.test.ts`) does not assert on jsdom's `getComputedStyle` (which would pass vacuously, as its own docblock correctly notes) — it compiles the real `globals.css` with the real Tailwind compiler and resolves cascade winners from the compiled rule list against a real `<html>`-rooted DOM tree. I reproduced the falsification myself rather than trusting the report: reverting to the one-liner reintroduces exactly the reported bug (sun shown over a dark page with no `data-theme` set), and the test catches it. This is genuine regression coverage, not decoration.

### Finding 2 (MEDIUM, iteration 1) — FIXED

"Findings Requiring a Decision" #2 above now enumerates three CSP gaps — `script-src 'unsafe-inline'`, `style-src 'unsafe-inline'`, and meta-tag placement — matching `src/lib/csp.ts`'s own module comment, which documents both `'unsafe-inline'` allowances together with one shared rationale. Cross-checked against the shipped `DIRECTIVES` object (`csp.ts:56-73`): `style-src` is indeed `"'self' 'unsafe-inline'"`, consistent with the claim.

### Finding 3 (confirmed accurate, iteration 1) — unchanged, still accurate

Re-confirmed present: `out/404.html` still exists and still ships Next's generic not-found boilerplate rather than GitHub Pages' default. No regression here; not part of this iteration's fix set.

### Finding 4 (LOW-MEDIUM, iteration 1) — FIXED

Deviation #8 above does the harder, more honest thing rather than the easy thing: it doesn't just note that `Header` takes an undocumented `name` prop, it identifies that `components.md` **contradicts itself** — the Public Interfaces table omits `name` while the same file's prose and `mockups.md`'s Header section both require the name to render there. That is a materially more useful record for whoever next revises `components.md` than a flat "prop mismatch" note would have been.

### New finding 2b (self-reported) — accurately characterized; a legitimate carried-forward decision, not a code defect to fix now

Verified directly against the built export: `out/index.html` ships `aria-pressed="false"`, `aria-label="Switch colour theme"`, `data-theme-state="unknown"`. With JS disabled and OS dark preference, the icon is now correctly a moon (Finding 1's fix) while the accessible state still describes an inert, unpressed control — exactly as 2b states.

I checked whether this is actually a free fix being deferred for no reason. It isn't: `interaction-spec.md`'s Persistence Logic and Accessibility tables, and `component-methods.md`, both specify `aria-pressed`/`aria-label` behavior under the assumption that `onToggle` (JS) runs — neither contemplates the no-JS case, and there is no static-build-time mechanism to know a given visitor's OS preference (`output: 'export'` serves identical HTML to everyone, per ADR-6, already cited elsewhere in this document). So the two options named in 2b (hydration-gated render vs. accept as a JS-only affordance with an honestly generic label) are the actual full set of choices, not a false dichotomy invented to avoid work. Given this project's own established pattern in this exact document — Findings 1 and 2 above were themselves carried to the gate as open decisions rather than resolved unilaterally — treating 2b the same way is consistent, not a new laxity introduced this iteration. Severity is bounded: it affects only screen-reader users with JavaScript fully disabled, a narrower population than Finding 1's (which affected every no-JS visitor, sighted or not), and WCAG 2.1 AA (the confirmed target, `accessibility-checklist.md` line 4) does not itself mandate no-JS operation.

**Not a blocker.** Legitimately deferred; carry to the gate as written.

### New finding 2c (self-reported) — accurate, appropriately forwarded

Confirmed no browser automation runs in this repo's test suite (`vitest.config.mts` + `vitest.setup.ts` are jsdom-only; no Playwright/Cypress config exists). The six-state matrix is real Node-level cascade resolution, not a browser check, so 2c's claim that CI cannot currently reproduce a true no-JS render is accurate. Correctly scoped as input to `ci-pipeline` (3.7) rather than something this stage should fix.

**Not a blocker.** Forward-looking documentation gap, not a shipped-code defect.

### New finding (mine) — LOW, doc staleness in this same document

Two small inaccuracies in this document, introduced by the iteration-2 fix and not caught before this pass:

- The Verification table above (line 11) still reads "60 tests across 5 files" — stale since iteration 1. Actual, independently reconfirmed: 66 tests across 6 files.
- The Files Created → Tests list above (line 22) does not mention `app/theme-variant.test.ts`.

Same category as the already-fixed Findings 2 and 4 (this document's own claims must match the shipped artifact), but trivial in consequence — no downstream stage makes a decision off the test count the way `security-requirements.md` will off the CSP gap count. **Not a blocker**; worth a one-line fix at or before the gate.

### Why READY

All three iteration-1 findings are fixed and independently reverified against the current files and a fresh test run, including a falsification test I ran myself on Finding 1 rather than trusting the report. The two newly self-reported items (2b, 2c) are accurate, honestly bounded in severity, and — critically — both name a genuine fork in product/architecture intent with no cost-free resolution available at this layer; deferring them to the gate matches this same document's own established practice for Findings 1 and 2, not a new pattern of avoidance. The one new item this pass found (stale test count/list) is a bookkeeping nit with no correctness impact. Nothing here requires guessing at intent to build from, and nothing blocks the build/test/lint gate, which remains green (verified: 66/66).
