# Code Summary — content-sections

**Intent:** `260726-resume-site` · **Stage:** code-generation · **Unit:** `content-sections`
**Consumes:** [unit-of-work.md](../../../inception/units-generation/unit-of-work.md), [requirements.md](../../../inception/requirements-analysis/requirements.md)

## Verification (independently re-run by the orchestrator, not taken on report)

| Check | Result |
|---|---|
| `npm run build` | **PASS** — static export, 3/3 pages |
| `npm test` | **PASS** — 110 tests across 11 files |
| `npm run lint` | **PASS** — clean |
| `npm run typecheck` | **PASS** — after the fix below; was failing before |
| Regression guard falsification | **Verified by the orchestrator**: reverting `globals.css` to Unit 1's buggy one-liner fails exactly 2 tests, including `shows the moon when the OS prefers dark`; restore returns the file byte-identical |

## Files

**Created (9):** `ExperienceSection.tsx`, `AIEngineeringSection.tsx`, `EducationSection.tsx`, `ContactSection.tsx`, their four `.test.tsx` files, and `src/app/page.test.tsx` (section-order guard).

**Modified (10):** `experience.mdx`, `education.mdx`, `ai-engineering.mdx`, `contact.mdx`, `hero.mdx`, `content/index.ts`, `app/page.tsx`, `app/layout.tsx`, `shell.test.tsx`, plus `README.md` / `package.json` / `vitest.config.mts`.

**Deleted (1):** `PlaceholderSection.tsx` — Unit 1 marked it delete-in-Unit-2.

## Verified in the Built Export

- **Section order holds.** DOM order `ai-engineering, experience, education, contact`. Measured live: at 375px all four stack with AI Engineering above Experience; at 768px and 1280px they share a row with Experience left. This order was silently inverted once at Refined Mockups — now guarded by `page.test.tsx`, not just checked by hand.
- **Zero anchors** in AI Engineering, Experience and Education. Contact has exactly 2 (mailto + LinkedIn), as intended.
- **Vynkor line** renders as its own `<p data-testid="role-sub-line">` *after* Point & Pay's `</ul>`, inside that role's `<li>` — separate, not merged. Measured contrast **6.39:1 light / 7.20:1 dark** at 14px vs the bullets' 16px: visually lighter, comfortably past AA. This is exactly the failure mode `accessibility-checklist.md` warned about ("brief and vague" implemented as "inaccessible") — it did not happen.
- **Contact cannot drift** — `Header` and `ContactSection` render byte-identical `href`s from one object.
- **Zero `PLACEHOLDER` or `.invalid` strings** remain anywhere in the export.

## Fix Applied During This Unit

**`npm run typecheck` was red and `npm run build` was green** — they disagreed. `src/app/theme-variant.test.ts` (a Unit 1 file) had `TS2322`: postcss's `.parent` widens to include `Document_` as it climbs, which is not assignable to `Container`.

Fixed rather than deferred, because `team.md` makes CI the **sole gate** before a production deploy — shipping a repo where `typecheck` and `build` disagree hands `ci-pipeline` (3.7) a broken gate to wire up. The first attempt widened the cursor type and merely moved the error (the `.type === 'atrule'` string check stopped narrowing across the union); the working fix uses `instanceof postcss.AtRule`, which narrows to the one node type that actually carries `name`/`params`.

## Deviations From the Plan

| # | Deviation | Why |
|---|---|---|
| 1 | `hero.mdx` + `layout.tsx` metadata updated (not in Step 1) | Both still said `PLACEHOLDER — real content lands in Unit 2`. Leaving them would have made the Step 5 README edit a lie. Hero is now "Marlow Fernandez" / "Software Engineering Leader" (the resume subtitle, matching `mockups.md`). **City/state deliberately kept out of the meta description** — `requirements.md`'s Contact Section confirms email, LinkedIn and phone, and says nothing about location |
| 2 | Added `heading: string` prop to all four components | Every section's frontmatter carries `heading` and each section needs an `h2`. Schema conformance, not a new decision — though `components.md`'s interface table omits it, same gap class as Unit 1's Deviation #8 |
| 3 | Added `src/app/page.test.tsx` (unplanned) | The plan said to verify section order in the built output. A test that fails on re-inversion is better than a one-time manual check, given it was inverted once already |
| 4 | Added `yaml` devDependency + an MDX-frontmatter transform to `vitest.config.mts` | The real judgment call. Vitest doesn't run `@next/mdx`, so `import { experience } from '@/content'` didn't resolve — every content assertion would have run against a fixture, which cannot catch a deleted employer block or an expanded Vynkor line. `yaml@2.9.0` was already in the tree transitively; making it explicit downloaded nothing |

## Open Items for the Gate

### 1. Nobody has actually looked at the page

Browser screenshots did not composite, so verification used `getBoundingClientRect` and `getComputedStyle` — stronger evidence for *order* and *contrast* than a screenshot, but it means **no human or agent has visually judged this page**. Typography rhythm, spacing, and whether Point & Pay's 15-bullet block feels overwhelming beside the one-line AI Engineering column are unjudged. That column imbalance is real and was explicitly accepted at ADR-1 — but it is worth your eyes before this ships.

### 2. Point & Pay's title progression rides in one `title` field

The schema gives one `title` per entry and `requirements.md` is explicit that Point & Pay is *one* employer entry, not two. So `title` reads "Team Lead II, Software Engineer (previously Senior Software Engineer, April 2022 – 2024)" with `startDate: 2022-04`, `endDate: null` → renders "Apr 2022 – Present". Both dates are resume-stated; no month was invented for "2024". Making the tenure line read "2024 – Present" as `mockups.md` sketches would need either a fabricated month or a schema change — neither permitted in this unit.

### 3. Cosmetic: the certification shows 2021 twice

"CompTIA · 2021" then "July 2021 · Verification: GET0SGFF7HRQQPWC". `year` is a required numeric schema field and `requirements.md` confirms *July* 2021 — dropping either loses confirmed content. Clean fix requires a schema change, out of scope here.

### 4. The Vynkor line's vagueness is not machine-verifiable

`requirements.md`'s own example wording was used verbatim rather than composed fresh, plus a ≤80-char length guard as a cheap regression proxy. Whether the wording achieves the *reputational* intent is a human judgment — yours.

### 5. Content sourcing — a real process inconsistency, and its substantive resolution

**The process error was the orchestrator's.** `code-generation-plan.md`, `unit-of-work.md`, and `security-requirements.md` all state that `requirements.md` is the sole authoritative content source and that content must not be "re-derived from the resume PDF." The orchestrator's dispatch prompt to the developer agent then explicitly carved out an exception: *"If you need the actual resume text for a detail `requirements.md` summarizes rather than quotes, read `Marlow_Fernandez_Resume.pdf`."* The agent followed the dispatch instruction. The contradiction was the orchestrator's, not the agent's, and the reviewer was right to flag the output as violating the stated rule.

**Substantively, the content was authorized** — `requirements.md` Q4 confirmed government/defense clients "published as-is" and Q5 confirmed "full detail for all roles," which for HII means its resume bullets. But those confirmations were given at the granularity of *"Navy/DHS clients, Secret Clearance"*, while the shipped bullets go materially more specific: named naval training facilities (**SCTTR**, **TTGP**), Spring Security ACL "protecting classified entities" in a classified environment, Trust-CA certificate infrastructure for classified Postgres, and Cisco VoIP "enabling secure communications for naval operations."

**Explicitly re-confirmed with the human at this granularity** (2026-08-02), after the permanent-indexed-public distinction was restated: **publish as-is.** The facility names and classified-environment details stay. This is a knowing decision at the specific level of detail actually being published, not an inference from the broader Q4/Q5 answers.

## Assumptions & Open Questions

Items 1–5 above are carried to the approval gate rather than resolved unilaterally. Item 5's substantive question is now closed by explicit human confirmation; its process lesson (a dispatch prompt must not contradict its own plan's stated constraints) is recorded in this stage's diary. Unit 1's open items (`out/404.html`, no-JS `aria-pressed`, CSP documentation gaps) remain with Unit 1's gate and were deliberately not touched here.

## Review

**Reviewer:** aidlc-architecture-reviewer-agent
**Verdict:** READY

Scope of this pass: iteration 2 — targeted re-verification of the two iteration-1 findings against the current files. Per the review brief, items 2–6 of the original adversarial pass (Vynkor constraint, no-links, section order, placeholder removal, server components) were verified clean in iteration 1 and were not re-run.

### Finding 1 (iteration 1, HIGH) — content-sourcing violation — RESOLVED

Both halves of this finding check out against the current `code-summary.md` §5.

**Process attribution.** §5 states plainly: *"The process error was the orchestrator's."* I re-read the three source documents the finding turned on — `code-generation-plan.md`'s "Content Constraints — Enforced by Authoring, Not by Any Check," `security-requirements.md`'s "Content Constraints This Unit Must Honor," and `unit-of-work.md`'s repetition of the same rule — and confirmed independently that none of them authorize reading the resume PDF; the "not re-derive from the resume PDF" instruction is stated identically in all three. §5 does not soften or bury this: it names the specific dispatch-prompt sentence that contradicted the unit's own plan and attributes the resulting output to that contradiction, not to any judgment call the developer agent made. That is an honest account, not a minimized one.

**Substantive re-confirmation.** §5 states the HII/Syzygy technical specifics — the SCTTR/TTGP facility names, the Spring Security ACL description, the Trust-CA PKI detail, the naval-operations VoIP line — were put to Marlow explicitly, at the granularity actually shipped, with the permanent-indexed-public distinction restated, and that his answer was to publish as-is. I re-checked `requirements.md` and `security-requirements.md` directly: neither names any of that bullet-level detail — `requirements.md` line 22 gives HII exactly one sentence ("Published as-is, including the Secret Clearance mention and the Department of Defense/Navy client identification"), and `security-requirements.md`'s "confirmed publish" list is Point & Pay-specific, naming zero HII/Syzygy technical content. §5's description of the gap between what was previously confirmed and what is now published is accurate, not overstated — it does not claim Q4/Q5 already covered this granularity, which they did not.

One process-consistency observation, non-blocking: this project's own established pattern for a reviewer-triggered follow-up confirmation is to add a timestamped, lettered-option Q&A entry to the stage's questions file — that's exactly how `requirements-analysis-questions.md` recorded Q9 after iteration 1 of that stage's review. `code-generation-questions.md` (read in full for this pass) contains only the original Plan Approval entry; the HII/Syzygy re-confirmation described in §5 has no matching entry there, only the prose account in `code-summary.md`. Given this iteration's brief states the confirmation was obtained directly, I am not treating the absence of a mirrored questions-file entry as grounds for NOT-READY — but it is worth this stage's diary noting for consistency with how the project has handled the identical situation before.

### Finding 2 (iteration 1, MEDIUM) — Vitest MDX-frontmatter transform fidelity — verified low-risk, not blocking

I traced the actual parser chain rather than relying on iteration 1's assumption that the two paths use "a different underlying YAML parser." They do not:

- `vitest.config.mts`'s `mdxFrontmatter()` calls `parse` from the `yaml` package.
- The real build's `remark-mdx-frontmatter` (`node_modules/remark-mdx-frontmatter/dist/remark-mdx-frontmatter.js`) also imports `parse as parseYaml` from `yaml` and uses it as its default YAML parser.
- Only one `yaml` package is installed in the tree (`node_modules/yaml`, `2.9.0`, matching the `^2.9.0` pin in `package.json`) — there is no second hoisted copy that could diverge in version or behavior.

So the YAML-parsing step itself — the part iteration 1 flagged as unverified — is provably identical code, not merely asserted to be. The genuine residual difference is narrower than iteration 1's finding implied: it is the *frontmatter-block extraction* boundary (Vitest's hand-rolled regex `/^---\r?\n([\s\S]*?)\r?\n---/` vs. the real pipeline's `remark-frontmatter`/micromark delimiter detection), not the parser. That residual is a real but currently-dormant footgun — a future YAML block/literal scalar value containing a bare `---` line would truncate under the regex without affecting the real build — and it is exactly the class of divergence `npm run build`'s independent run through `src/content/index.ts`'s `assertValid` calls would not catch if the truncated value still happened to satisfy the schema's shape (a `string`-typed field truncated to a shorter string still type-checks). Today's four content files contain no such line, so this isn't live. Given the parser identity now confirmed, this is acceptable-with-disclosure rather than blocking — the code comment's claim ("the same YAML block, parsed the same way `remark-mdx-frontmatter` parses it") is true of the parser and only imprecise about the extraction step, which is a much smaller gap than iteration 1 identified.

### What holds up (unchanged from iteration 1, not re-litigated per the brief)

Vynkor line rendering and contrast, ADR-1 no-links, section order guarded by `page.test.tsx`, `PlaceholderSection` and placeholder-string removal, and the server-component boundary were all verified clean in iteration 1 and are unaffected by this round's changes to `code-summary.md` §5.

### Minor, non-blocking

- `components.md`'s Public Interfaces table still lists no `heading` prop for the four section components (carried from iteration 1, self-disclosed in deviation #2).
- No mirrored Q&A entry for the §5 re-confirmation in `code-generation-questions.md` (see Finding 1 above) — a documentation-trail consistency gap, not a substantive one.

**Outcome:** READY. Both iteration-1 findings are resolved on re-verification against the current files: the HIGH's process error is honestly attributed and its substantive question was put to and answered by Marlow at the actual granularity shipped, accurately described in §5; the MEDIUM's core assumption (divergent YAML parsers) does not hold — the parser is proven identical, and the narrower residual risk that remains is dormant and appropriately disclosed. Nothing found in this pass rises to a blocking level.
