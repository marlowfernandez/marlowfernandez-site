# Unit of Work Dependency — marlowfernandez.com

**Intent:** `260726-resume-site` · **Stage:** units-generation
**Consumes:** [unit-of-work.md](unit-of-work.md), [component-dependency.md](../application-design/component-dependency.md)

This artifact is topology only — it names what depends on what, not build order or a critical path. (The recommended sequencing, authorized for this stage per the scope file's explicit fold of Delivery Planning's role, lives in `unit-of-work.md` instead.)

## Dependency DAG (prose)

**Content Sections** depends on **Site Shell & Walking Skeleton** — Content Sections' components render into the layout Unit 1 provides, and its MDX content must conform to the frontmatter schema Unit 1 defines. **Site Shell & Walking Skeleton** has no dependencies — it is buildable and deployable on its own, with placeholder content.

This is a single, linear dependency chain: exactly one edge, two nodes. There is no parallel-development opportunity between these two units, since Unit 2 structurally requires Unit 1's schema to exist first — consistent with this stage's confirmed Q1/Q2 (2-unit split, one dependency chain).

## Integration Points

- **MDX frontmatter schema** (confirmed formal, this stage's Q4): the sole integration contract between the two units. Unit 1 defines it; Unit 2's content and components must conform to it. Enforced by the content-schema-validation CI check already mandated in `team-practices.md`.
- No API, no shared runtime state, no event contract — consistent with `services.md`'s confirmed "no runtime services" architecture.

## Parallel Development Opportunities

None. This is a strict two-node chain (Unit 2 depends on Unit 1) — every valid topological ordering places Unit 1 first.

## Machine-Readable Edge Block

```yaml
units:
  - name: site-shell-walking-skeleton
    kind: ui
    depends_on: []
  - name: content-sections
    kind: ui
    depends_on: [site-shell-walking-skeleton]
```

## Assumptions & Open Questions

None. This DAG has exactly the two units confirmed in `unit-of-work.md`, one edge, and no cycle.
