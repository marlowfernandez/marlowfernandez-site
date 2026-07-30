# Application Design — Questions

**Stage:** application-design · **Phase:** Inception
**Record:** `aidlc/spaces/default/intents/260726-resume-site/`
**Consumes:** [requirements.md](../requirements-analysis/requirements.md), [team-practices.md](../practices-discovery/team-practices.md)

## Context

Two decisions have been explicitly deferred to this stage across three prior stages: the AI Engineering section's presentation format (Feasibility Q2, Rough Mockups Q4) and the CSS/styling implementation mechanism (`design-system-mapping.md`, which set design tokens but not how they're implemented). Both are decided here. This project has no AWS component anywhere, so `aidlc-aws-platform-agent`'s standard cloud-service-mapping role does not apply — confirmed rather than forced.

---

## Q1. AI Engineering section: final presentation format?

- A. Tagged grid, kgromero.com-style — each of openclaw/LLMs/unsloth/model setups/AI-DLC as a short tagged card linking out (where a link exists)
- B. Prose case studies — problem/approach/outcome narrative for each, no card grid
- C. Hybrid — a tagged grid for quick scanning, each tag expanding to a short case-study paragraph
- X. Other (please specify)

[Answer]: X. Other — plain text, comma-separated (not a card grid, not a narrative case-study format). No external links available yet for most items; the one exception is this project's own GitHub repo (marlowfernandez-site), which could link since it's public and directly demonstrates AI-DLC use *(2026-07-28T13:36:52Z)* — **see Q6 follow-up below: this creates a tension with requirements.md's Q8, which confirmed no cross-reference to this site's own build process**

---

## Q2. Content data source: how is the site's content actually authored and stored?

- A. Structured data files (JSON or YAML) that components read at build time — content and presentation cleanly separated
- B. MDX — content authored as Markdown with embedded components
- C. Hardcoded directly in the React components — simplest for a site this size, no separate data layer
- X. Other (please specify)

[Answer]: B. MDX — content authored as Markdown with embedded components *(2026-07-28T13:36:52Z)*

---

## Q3. Styling implementation: how do `design-system-mapping.md`'s tokens actually get implemented?

- A. Tailwind CSS — utility classes, tokens as a Tailwind theme config
- B. CSS Modules — scoped per-component CSS files, tokens as CSS custom properties
- C. Plain global CSS with custom properties — no build-time CSS tooling beyond what Next.js already provides
- X. Other (please specify)

[Answer]: A. Tailwind CSS — utility classes, tokens as a Tailwind theme config *(2026-07-28T13:36:52Z)*

---

## Q4. Component granularity: one large page component, or many small section components?

- A. Many small components — Header, ThemeToggle, ExperienceSection, AIEngineeringSection, EducationSection, ContactSection, Footer, each independently testable
- B. Fewer, larger components — grouped by visual region rather than by content section
- C. Not sure — recommend one
- X. Other (please specify)

[Answer]: A. Many small components — Header, ThemeToggle, ExperienceSection, AIEngineeringSection, EducationSection, ContactSection, Footer, each independently testable *(2026-07-28T13:36:52Z)*

---

## Q5. Repository structure: standard Next.js App Router conventions, or a preference?

- A. Standard Next.js App Router structure (`app/`, `components/`, `content/` or `data/`)
- B. You have a specific structure preference (describe it)
- C. Not sure — recommend the standard
- X. Other (please specify)

[Answer]: A. Standard Next.js App Router structure (app/, components/, content/ or data/) *(2026-07-28T13:37:58Z)*

---

## Q6. (Follow-up, real tension — flagging before deciding, not after) Your Q1 answer says the AI-DLC entry could link to this project's own GitHub repo, since that's the only link available. But `requirements.md` Q8 explicitly confirmed the AI-DLC mention stays "same weight" as other bullets, with **no cross-reference to this site's own build process**. Does linking the AI-DLC tag to this repo count as that cross-reference, or is it different?

- A. It's fine — a plain GitHub link is just a link, not a "look what I built" callout; Q8 was about tone/emphasis in the writing, not about whether a URL exists
- B. It does cross the line Q8 drew — don't link AI-DLC to this repo; leave it unlinked like the other no-link items
- C. Link it, but reconsider Q8 too — actually, a brief self-reference is fine here
- X. Other (please specify)

[Answer]: B. It does cross the line Q8 drew — don't link AI-DLC to this repo; leave it unlinked like the other no-link items. Requirements Analysis's Q8 decision (no cross-reference to this site's own build process) stands unchanged *(2026-07-28T13:44:01Z)*

---

## Assumptions & Open Questions

None yet — this file collects answers before any assumption is recorded.
