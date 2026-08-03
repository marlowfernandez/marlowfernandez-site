# Tech Stack Decisions — content-sections

**Intent:** `260726-resume-site` · **Stage:** nfr-requirements · **Unit:** `content-sections`
**Consumes:** [requirements.md](../../../inception/requirements-analysis/requirements.md)

`business-logic-model.md` and `business-rules.md` are absent by design (`functional-design` is SKIP for this composed scope). Per this stage's Step 2 fallback, stack rationale derives from `requirements.md` and the gated Inception decisions rather than inventing the missing artifacts' content — the same handling applied in this unit's two sibling artifacts and in the shell unit's pass.

## No Independent Stack Choices

This unit introduces **no technology decisions of its own.** Every choice — Next.js static export, TypeScript, Tailwind, MDX, GitHub Pages, Hostinger DNS, system fonts — was decided and gated upstream and is recorded in full in [the shell unit's tech-stack-decisions.md](../../site-shell-walking-skeleton/nfr-requirements/tech-stack-decisions.md). Restating the table here would create a second copy free to drift from the first; this file deliberately points at the one source instead.

## What This Unit Consumes From the Shell

Per `unit-of-work.md`'s confirmed dependency (`content-sections` depends on `site-shell-walking-skeleton`), this unit is a **consumer** of the shell's technology decisions, specifically:

| Shell provides | This unit consumes it by |
|---|---|
| MDX parsing/loading pipeline | Authoring content as MDX files the pipeline reads at build time |
| MDX frontmatter schema | Conforming every content file to it — the formal integration contract confirmed at `units-generation` Q4 |
| Tailwind theme config (from `design-system-mapping.md` tokens) | Styling the four section components with those tokens, not ad-hoc values |
| App Router structure (`app/`, `components/`, `content/`) | Placing components in `components/` and content in `content/` per ADR-5 |

## The One Tooling Item That Targets This Unit

**Content-schema validation** (`team-practices.md`, Practices Discovery Q5) exists specifically to protect this unit: it validates MDX frontmatter shape at build time so a malformed content edit fails CI rather than shipping. Per `decisions.md` ADR-2, its scope is frontmatter structure — **not** prose correctness. A typo in an employment date or a subtly expanded Vynkor line passes this check cleanly. That limit is stated plainly here because this unit's most consequential risks (see `security-requirements.md`) are exactly the kind this check cannot catch.

## Assumptions & Open Questions

None. Every row cites the artifact or stage that decided it.
