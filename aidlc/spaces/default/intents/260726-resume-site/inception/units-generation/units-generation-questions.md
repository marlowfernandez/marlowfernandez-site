# Units Generation — Questions

**Stage:** units-generation · **Phase:** Inception (last stage)
**Record:** `aidlc/spaces/default/intents/260726-resume-site/`
**Consumes:** [components.md](../application-design/components.md), [component-methods.md](../application-design/component-methods.md), [services.md](../application-design/services.md), [component-dependency.md](../application-design/component-dependency.md), [decisions.md](../application-design/decisions.md), [requirements.md](../requirements-analysis/requirements.md)

## Context

This project's composed scope explicitly skips Delivery Planning (2.8) and folds its sequencing job into this stage ("units-generation sequences inline," per `.claude/scopes/aidlc-personal-static-site.md`). So unlike the stage's generic instructions, this stage's `unit-of-work.md` will include a recommended build order — `unit-of-work-dependency.md` stays pure topology as the stage file requires.

---

## Q1. Unit boundary strategy: does this split make sense?

Proposed: **2 units** — (1) Site Shell & Walking Skeleton (Header, Footer, ThemeToggle, ExternalLink, Hero, the App Router/Tailwind scaffold, MDX pipeline wiring — deployed live on both domains with placeholder content) and (2) Content Sections (ExperienceSection, AIEngineeringSection, EducationSection, ContactSection, plus the real authored content).

- A. Yes — this split matches the confirmed walking-skeleton-first sequencing from Scope Definition
- B. No — split differently (describe how)
- C. Not sure — recommend one
- X. Other (please specify)

[Answer]: A. Yes — this split matches the confirmed walking-skeleton-first sequencing from Scope Definition *(2026-07-29T21:55:49Z, batch 1)*

---

## Q2. Granularity: is 2 units the right size, or should it be finer/coarser?

- A. 2 units is right — matches `application-design`'s 9 components collapsing into "layout scaffold" vs "content," and the scope file's own "<=3 units" expectation
- B. Finer — closer to one unit per component or small component group
- C. Coarser — a single unit covering the whole site
- X. Other (please specify)

[Answer]: A. 2 units is right *(2026-07-29T21:55:49Z, batch 1)*

---

## Q3. Since this stage absorbs Delivery Planning's sequencing role, does walking-skeleton-first order apply here too — Unit 1 (shell) before Unit 2 (content)?

This mirrors Scope Definition's already-confirmed answer (bare-bones live first, then layer content) but confirms it applies at the unit level specifically.

- A. Yes — Unit 1 first, live and deployed before Unit 2's real content lands
- B. No — build both in parallel / order doesn't matter here
- C. Not sure — recommend one
- X. Other (please specify)

[Answer]: C. Not sure — recommend one. Recommendation given and accepted: A, Unit 1 first, consistent with Scope Definition's confirmed walking-skeleton answer *(2026-07-29T21:55:49Z, batch 1)*

---

## Q4. Integration contract between the two units: does Unit 2 need a formal content-shape contract from Unit 1, or is it informal?

- A. Formal — Unit 1 defines the MDX frontmatter schema each content type must follow; Unit 2's components consume it as a contract, checked by the content-schema-validation CI check already mandated in `team-practices.md`
- B. Informal — no schema needed, Unit 2 just writes components that match whatever content shape emerges
- C. Not sure — recommend one
- X. Other (please specify)

[Answer]: C. Not sure — recommend one. Recommendation given and accepted: A, formal schema — content-schema-validation is already a mandated CI check in team-practices.md and needs a concrete schema to validate against *(2026-07-29T21:55:49Z, batch 1)*

---

## Q5. Deployment model: do the two units ship independently, or only together as one release?

- A. Together only — there's one live site, not two independently deployable pieces; Unit 2 simply replaces Unit 1's placeholder content in the same deployed artifact
- B. Independent — Unit 2 could deploy separately from Unit 1
- X. Other (please specify)

[Answer]: A. Together only — there's one live site, not two independently deployable pieces; Unit 2 simply replaces Unit 1's placeholder content in the same deployed artifact *(2026-07-29T21:57:08Z)*

---

## Assumptions & Open Questions

None yet — this file collects answers before any assumption is recorded.
