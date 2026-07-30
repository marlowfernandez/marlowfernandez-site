# Unit of Work Story Map — marlowfernandez.com

**Intent:** `260726-resume-site` · **Stage:** units-generation
**Consumes:** [unit-of-work.md](unit-of-work.md), [requirements.md](../requirements-analysis/requirements.md)

## Note on "Stories"

`user-stories` is SKIP for this project's composed scope — per `.claude/scopes/aidlc-personal-static-site.md`: *"the personas are known and non-conflicting... so `requirements-analysis` carries the acceptance criteria."* This map therefore maps `requirements.md`'s Functional Requirements (which serve the acceptance-criteria role stories would otherwise carry) to units, rather than inventing story artifacts that don't exist.

## Requirement → Unit Mapping

| Requirement (from `requirements.md`) | Unit | Notes |
|---|---|---|
| Contact Section (email, phone, LinkedIn) | Unit 2 — Content Sections | Rendered by `ContactSection`; the header's copy of the same info is Unit 1 (layout), populated with Unit 2's data |
| Experience Section — all 4 employer blocks, full detail, Vynkor one-liner | Unit 2 — Content Sections | The single largest content item; carries the disclosure decisions from Requirements Analysis directly |
| Education & Certification Section | Unit 2 — Content Sections | |
| AI Engineering Section (plain-text, comma-separated, no links) | Unit 2 — Content Sections | Format finalized at Application Design |
| Accessibility (WCAG 2.1 AA), theme toggle, TypeScript | Unit 1 — Site Shell & Walking Skeleton | Non-functional requirements realized in the shell, not per content section |
| Performance/CI-as-gate | Unit 1 — Site Shell & Walking Skeleton (initial wiring), `ci-pipeline` (3.7, full enforcement) | Split per `unit-of-work.md`'s note that full quality-gate wiring belongs to the CI Pipeline stage, not this unit |

## Requirement Implementation Order Within Each Unit

**Unit 1 (Site Shell & Walking Skeleton):** the NFR/mechanism requirements (theme toggle, accessibility baseline, TypeScript setup) must be built before the MDX frontmatter schema, since the schema's shape is informed by what the shell components actually need to render — building the schema first, in isolation, risks a schema that doesn't fit the real component props from `components.md`.

**Unit 2 (Content Sections):** Experience Section first (the largest, most disclosure-sensitive content, and the one most likely to surface a schema gap early), then Education & Certification and AI Engineering Section (both simpler, lower-risk), then Contact Section last (smallest, and it duplicates data the header already established in Unit 1). This order surfaces the highest-risk content requirement earliest, consistent with this project's confirmed preference for resolving the riskiest unknowns first (mirroring the same instinct behind building Unit 1 before Unit 2 at the unit level).

## Cross-Cutting Requirements

The **theme toggle** and **accessibility baseline** are the only requirements that span both units in practice — Unit 1 implements the mechanism, Unit 2's content must still satisfy the same accessibility bar (e.g., the Vynkor sub-line's contrast requirement from `accessibility-checklist.md`). This is noted rather than force-assigning a cross-cutting requirement to a single unit it doesn't fully belong to.

## Coverage Verification

- Every requirement in `requirements.md`'s Functional Requirements section is assigned to a unit above.
- Both units have at least one assigned requirement — no unit is empty of work.
- No requirement is assigned to a unit that doesn't own the relevant component per `components.md`.

## Assumptions & Open Questions

None. This map substitutes `requirements.md` for the skipped `stories.md` per the scope file's own documented rationale.
