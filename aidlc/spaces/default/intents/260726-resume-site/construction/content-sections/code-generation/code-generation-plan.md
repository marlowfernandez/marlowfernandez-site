# Code Generation Plan — content-sections

**Intent:** `260726-resume-site` · **Stage:** code-generation · **Unit:** `content-sections`
**Consumes:** [unit-of-work.md](../../../inception/units-generation/unit-of-work.md), [requirements.md](../../../inception/requirements-analysis/requirements.md), [components.md](../../../inception/application-design/components.md), [decisions.md](../../../inception/application-design/decisions.md), [mockups.md](../../../inception/refined-mockups/mockups.md)

All application code goes to the **workspace root**, never under the record dir.

## What This Unit Ships

Per `unit-of-work.md`: the four real content-section components and the actual resume content. This unit **consumes** Unit 1's MDX frontmatter schema as its integration contract — it conforms to that schema rather than changing it. Unit 1's `PlaceholderSection` is deleted once all four real components exist.

**`requirements.md` is the authoritative content source.** Content is not re-derived or paraphrased from the resume PDF — the disclosure decisions were made per-item at Requirements Analysis, and re-deriving risks reintroducing something deliberately shaped.

---

## Steps

### Step 1: Replace placeholder content with real content
- [x] `src/content/experience.mdx` — 4 employer blocks at full detail per `requirements.md`: Point & Pay (Team Lead II, 2024–Present; prev. Senior SWE Apr 2022–2024), HII Technical Solutions (Nov 2019–Apr 2022), Syzygy Integration (Jan–Apr 2019), Palm Coast Data (Jul 2016–Jan 2019)
- [x] Include the confirmed-public specifics: the $50M/yr ACH+card figure, NACHA file generation, PCI DSS audit certification, EPX incident resolution, fraud-detection protocols, the BigDecimal/Money precision migration, CI/CD transformation, AWS infrastructure scope, Secret Clearance, Navy/DoD and DHS client names
- [x] **The Vynkor line** — one short, clearly-separate line within the Point & Pay period, visually a lighter sub-line, NOT blended into Point & Pay's own bullets. Wording stays within `scope-document.md`'s constraint: "very brief and small, without details, as vague as possible"
- [x] `src/content/education.mdx` — Full Sail BS Mobile Development 2017, GPA 3.4, Salutatorian; CompTIA Security+ July 2021 with verification code
- [x] `src/content/ai-engineering.mdx` — plain-text, comma-separated list (openclaw, LLMs, unsloth, model setups, AI-DLC). **No links on any item**, including no link to this repo (Application Design Q6)
- [x] `src/content/contact.mdx` — real email, LinkedIn, and phone as plain text (all confirmed public at `requirements.md` Q1/Q9)

### Step 2: The four real section components
- [x] `src/components/ExperienceSection.tsx` — renders the roles frontmatter; Vynkor sub-line styled lighter/smaller but **must stay readable and pass AA contrast** (`accessibility-checklist.md` explicitly warns "brief and vague" must not be implemented as "inaccessible")
- [x] `src/components/AIEngineeringSection.tsx` — comma-separated plain text, no card grid, no links
- [x] `src/components/EducationSection.tsx`
- [x] `src/components/ContactSection.tsx` — reads the same contact object as `Header`, so the two copies cannot drift
- [x] All four are **server components** — no `'use client'`. `ThemeToggle` remains the only client component

### Step 3: Wire into the page and remove the placeholder
- [x] `src/app/page.tsx` — swap `PlaceholderSection` for the four real components
- [x] **Preserve the locked section order**: desktop two-column (Experience left, AI Engineering right); mobile stacked with **AI Engineering first**. This order was silently inverted once at an earlier stage — verify it in the built output, not just the source
- [x] Delete `src/components/PlaceholderSection.tsx` (Unit 1 marked it delete-in-Unit-2)

### Step 4: Tests
- [x] `src/components/ExperienceSection.test.tsx` — renders all 4 employers; **the Vynkor line renders as its own element, not merged into an employer bullet**
- [x] `src/components/AIEngineeringSection.test.tsx` — renders as plain comma-separated text and contains **no anchor elements** (guards ADR-1's no-links decision against future drift)
- [x] `src/components/{Education,Contact}Section.test.tsx` — render correctly from frontmatter
- [x] Content-schema validation still passes against the real content files

### Step 5: Documentation
- [x] Update `README.md` — remove the "content is placeholder" banner, since it will no longer be true

---

## Deliberately NOT in This Unit

- Any change to Unit 1's MDX schema — this unit **conforms** to that contract (`units-generation` Q4)
- Any change to the shell, layout, theme toggle, or design tokens
- CI workflow (`ci-pipeline`, 3.7), DNS/deployment (`deployment-pipeline`, 4.1)
- Resolving Unit 1's open items (`out/404.html`, `aria-pressed` no-JS, CSP doc gaps) — those belong to their own gate

## Content Constraints — Enforced by Authoring, Not by Any Check

Two constraints no automated check can catch, both flagged in this unit's `security-requirements.md`:

1. **The Vynkor line** must stay very brief and vague. The reason is reputational, not technical: avoiding the impression a side project competes with full-time employment. Content-schema validation checks frontmatter *shape*, not prose — an expanded Vynkor line passes CI cleanly.
2. **No content beyond what `requirements.md` confirms.** No paraphrasing, no embellishment, no re-deriving from the PDF.

## Requirement-to-Step Traceability

| Requirement (`requirements.md`) | Step |
|---|---|
| Contact section (email, LinkedIn, phone as text) | 1, 2 |
| Experience — 4 employers, full detail | 1, 2, 4 |
| Vynkor one-liner, brief and separate | 1, 2, 4 |
| Education & certification, full detail | 1, 2 |
| AI Engineering — plain text, no links | 1, 2, 4 |
| Locked section order (mobile AI-first) | 3 |
| WCAG 2.1 AA incl. Vynkor sub-line readability | 2 |
