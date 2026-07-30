# Architecture Decision Records — marlowfernandez.com

**Intent:** `260726-resume-site` · **Stage:** application-design

---

## ADR-1: AI Engineering Section Format

**Context:** The AI Engineering section's presentation format was explicitly deferred across three stages (Feasibility Q2, Rough Mockups Q4, and this stage's own Q1/Q6), pending a decision on whether it should be a tagged-grid, prose case studies, or something else.

**Decision:** Plain text, comma-separated list (openclaw, LLMs, unsloth, model setups, AI-DLC). No links for any item — including no link to this project's own GitHub repository, per this stage's Q6 follow-up, which confirmed that linking would cross the line `requirements.md`'s Q8 drew (no cross-reference to this site's own build process).

**Alternatives Considered:**
- **Option A — Tagged grid (kgromero.com-style):** Pros: visually scannable, precedent from the named reference site. Cons: implies each item has a linkable destination, which isn't true yet for most items. Reversibility: easy — this is a presentation-layer choice, not a content-model one.
- **Option B — Prose case studies:** Pros: allows depth and narrative. Cons: requires substantially more first-person content authoring than currently exists; over-invests in a section whose exact content is still being developed. Reversibility: easy.
- **Chosen: plain comma-separated text.** Simplest to author now, fully honest about the current state (a list of active interests/tools, not a portfolio of linkable finished projects), and defers the richer presentation to a future revision once there's actual linkable content behind each item.

**Alternatives Rejected:** Option A (tagged grid) and Option B (prose case studies), both for the reasons stated above.

**Consequences:** The AI Engineering section will read as lighter-weight than the Experience section initially. This is an accepted tradeoff, not an oversight — richer treatment can be added later without restructuring anything else, since `AIEngineeringSection`'s prop shape (`items: string[]`) doesn't preclude a future richer type.

---

## ADR-2: Content Data Source — MDX

**Context:** Content needed a storage/authoring mechanism distinct from hardcoding it into components, per this stage's Q2.

**Decision:** MDX — content authored as Markdown with embedded components where needed.

**Alternatives Considered:**
- **Option A — Structured JSON/YAML:** Pros: strict separation of content and presentation, easy to validate against a schema (ties into `team-practices.md`'s confirmed content-schema-validation CI check). Cons: prose-heavy content (the Experience bullets) is awkward to author as JSON string fields.
- **Option B — Hardcoded in components:** Pros: simplest possible setup. Cons: mixes content and code, makes future content edits require touching component files directly.
- **Chosen: MDX.** Balances readability for prose-heavy content (natural in Markdown) with the ability to embed the small number of components needed (e.g., a styled skill tag). Content-schema validation (already a confirmed CI requirement) applies to MDX frontmatter fields, not full JSON schema validation of the body — this is a lighter validation surface than Option A, and that tradeoff is accepted given the content is authored by one person, not machine-generated.

**Alternatives Rejected:** Option A (structured JSON/YAML) and Option B (hardcoded in components), both for the reasons stated above.

**Consequences:** Content-schema validation (per `team-practices.md`) validates MDX frontmatter shape, not full content correctness — a typo in prose won't be caught by CI, only structural errors (missing required frontmatter fields) will be.

---

## ADR-3: Styling — Tailwind CSS

**Context:** `design-system-mapping.md` established design tokens (color, type, spacing, breakpoints) but not an implementation mechanism, per this stage's Q3.

**Decision:** Tailwind CSS, with `design-system-mapping.md`'s tokens expressed as a Tailwind theme configuration.

**Alternatives Considered:**
- **Option A — CSS Modules:** Pros: no utility-class learning curve, tokens as plain CSS custom properties. Cons: more boilerplate per component (a `.module.css` file per component).
- **Option B — Plain global CSS:** Pros: zero build tooling beyond what Next.js ships. Cons: no scoping — a single global stylesheet risks specificity conflicts as the component count grows.
- **Chosen: Tailwind CSS.** Confirmed directly by the human; also the most common choice for the confirmed component-per-section structure (ADR-4), since utility classes avoid the CSS Modules boilerplate-per-component cost at this project's actual scale (9 components, including `ExternalLink`).

**Alternatives Rejected:** Option A (CSS Modules) and Option B (plain global CSS), both for the reasons stated above.

**Consequences:** `design-system-mapping.md`'s color/type/spacing tables map directly into `tailwind.config`'s theme extension — Code Generation (3.5) should treat that file as the source values for the config, not re-derive them.

---

## ADR-4: Component Granularity — Many Small Components

**Context:** Whether to build one large page component or several small, focused ones, per this stage's Q4.

**Decision:** Many small components — `Header`, `ThemeToggle`, `ExternalLink`, `Hero`, `ExperienceSection`, `AIEngineeringSection`, `EducationSection`, `ContactSection`, `Footer` (per `components.md`).

**Alternatives Considered:**
- **Option A — Fewer, larger components grouped by visual region:** Pros: less file-navigation overhead for a site this small. Cons: harder to reason about each content section independently; conflates layout concerns with content concerns.
- **Chosen: many small components.** Confirmed directly by the human. Each component maps 1:1 to a content section already defined in `requirements.md` and `mockups.md`, making the mapping from design artifact to code file direct and easy to verify at Code Generation.

**Alternatives Rejected:** Option A, for the reason stated above.

**Consequences:** More files than a monolithic-page approach, but each is independently reviewable and matches this project's confirmed direct-to-`main` workflow (`team-practices.md`) — a small, self-contained component is a naturally small, reviewable commit.

---

## ADR-5: Repository Structure — Standard Next.js App Router

**Context:** File/folder organization had no owner until this stage's Q5 — `team-practices.md` (Practices Discovery) explicitly names `application-design` as the owner of this decision, since `functional-design` is skipped for this scope and no other stage would otherwise pin it down.

**Decision:** Standard Next.js App Router conventions: `app/` (routes), `components/` (the 9 components above, including `ExternalLink`), `content/` (MDX files).

**Alternatives Considered:**
- No real alternative was presented — a custom structure was offered as an option at Q5 but not chosen, and the standard convention is the only well-supported path for App Router without inventing a bespoke layout with no tooling benefit.

**Consequences:** Code Generation (3.5) should scaffold exactly this structure; any deviation should be treated as a fresh decision, not an implicit drift.

---

## ADR-6: No Runtime Services

**Context:** `application-design`'s default frontmatter assumes service-layer design work; this project has none.

**Decision:** No runtime services exist or are designed — confirmed in `services.md`, unchanged from Feasibility's fully-static architecture.

**Alternatives Considered:** None — this isn't a choice between options, it's a confirmation that the question doesn't apply, consistent with this project's established pattern of retargeting generic stage defaults rather than forcing inapplicable content.

**Consequences:** None beyond what's already recorded in `feasibility-assessment.md` and `constraint-register.md`.

## Assumptions & Open Questions

None. Every ADR traces to a confirmed answer in this stage's questions file or to an unchanged upstream decision.

## Review

**Reviewer:** aidlc-architecture-reviewer-agent
**Verdict:** READY

**Scope of this pass:** iteration 3, narrow confirmation. Re-verified the single remaining iteration-2 finding (Finding 7: ADR-5's stale "8 components above") directly against the current text of `decisions.md`, rather than taking the stated fix on faith. Per the charge, did not re-run the full adversarial pass — iterations 1 and 2 already covered everything else (the six iteration-1 findings, the `interaction-spec.md` edit's proportionality, desktop/mobile section order, ADR-2's MDX-frontmatter scope, the acyclic dependency graph, and the required-sections sensor).

**Re-verification of Finding 7:**

`decisions.md` line 78 now reads: "Standard Next.js App Router conventions: `app/` (routes), `components/` (**the 9 components above, including `ExternalLink`**), `content/` (MDX files)." This matches ADR-4 (line 62), which lists 9 components — `Header`, `ThemeToggle`, `ExternalLink`, `Hero`, `ExperienceSection`, `AIEngineeringSection`, `EducationSection`, `ContactSection`, `Footer` — and matches ADR-3 (line 50), which independently states "9 components, including `ExternalLink`." All three now agree, and `components.md`'s own inventory (9 rows, confirmed in iteration 1) backs the count. A grep of the file for `8 components` and `components above` turns up exactly the two live cross-references (ADR-3 line 50, ADR-5 line 78, both correct) plus the now-superseded iteration-2 Review text quoting the old "8 components above" as a historical record of what was wrong — not a live claim. No other stale instance remains.

**Outcome:** The last open finding from iteration 2 is confirmed fixed and no new discrepancy was introduced by the edit. Combined with the six iteration-1 findings and the `interaction-spec.md` edit already confirmed resolved/proportionate in iteration 2, `decisions.md` (and the application-design artifact set as a whole, per the prior iterations' scope) is internally consistent: ADR-3, ADR-4, and ADR-5 all agree on 9 components including `ExternalLink`, with no remaining numeric or cross-reference contradiction a developer would need to stop and ask about. This stage is READY.
