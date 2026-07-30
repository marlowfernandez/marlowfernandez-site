# Decision Log — Ideation Phase — marlowfernandez.com

**Intent:** `260726-resume-site` · Compiled at approval-handoff, the final IDEATION stage.

Every decision below is confirmed in an approved upstream artifact; this log exists so Inception doesn't have to re-derive them by reading five separate stage folders.

## Intent Capture (1.1)

| Decision | Detail |
|---|---|
| Primary job of the site | Durable professional home, reduces LinkedIn reliance |
| Primary audience | Recruiters and hiring managers |
| Success metric | Becomes the link sent, replacing PDF/LinkedIn URL |
| Trigger | Active job search |
| Stakeholders | Sole: Marlow Fernandez |
| Product boundary | Static resume site through live deployment on both domains, nothing wider |

## Feasibility (1.3)

| Decision | Detail |
|---|---|
| Stack | Next.js, static export |
| Host | GitHub Pages (free, public repo) |
| Canonical domain DNS | Hostinger → GitHub Pages, custom domain via CNAME |
| Redirect domain | `marlow.software` → Hostinger registrar-level 301 forwarding, not through the app |
| Budget | $0 |
| Server-side | None — mailto/LinkedIn only |
| AI-showcase format | Deferred to Application Design (2.6) |

## Scope Definition (1.4)

| Decision | Detail |
|---|---|
| Must-have v1 sections | Hero/intro, experience timeline, AI engineering work, contact |
| Vynkor treatment | Very brief, vague, no details — folded into experience, not a dedicated section. Explicit reason: avoid appearing to compete with full-time employment |
| AI positioning | Wording-only decision, no scope impact |
| Timeline | Urgent, ASAP, no fixed date |
| Explicitly out of v1 | Blog/writing archive, custom animations |
| Left open | Dark/light theme toggle (later finalized in at Rough Mockups) |
| Build sequencing | Bare-bones live first (walking skeleton) |

## Rough Mockups (1.6)

| Decision | Detail |
|---|---|
| Reference analysis | kgromero.com actually browsed; structure recorded in `wireframes.md` |
| Direction selected | C — Minimal Single-Page |
| Resume-terminal gimmick | Declined |
| Theme toggle | **Finalized in** — reverses/resolves Scope Definition's undecided status |
| AI section presentation | Still open, deferred to Application Design (2.6) |
| Accessibility baseline | WCAG 2.1 AA |

## Approval & Handoff (1.7 — this stage)

| Decision | Detail |
|---|---|
| Go/no-go | Go |
| RAID risks | All 3 reviewed (not rubber-stamped) and accepted: R1 (AI-showcase hosting constraint) — current leaning toward no live demo needed now, door stays open, decision stays at Application Design; R2 (DNS cutover) — user confident and ready to execute personally; R3 (public repo) — confirmed intentional |
| Final revisit | Nothing — all prior decisions stand |

## Carried-Forward Open Items (not yet decided, explicitly deferred)

1. **AI-showcase format** (write-ups vs. live demo vs. tagged-grid presentation) — Application Design (2.6). Current leaning per this stage's risk walkthrough: no live demo needed right now, but the door is intentionally not closed.
2. **Theme toggle CSS/implementation specifics** — Application Design (2.6) or Code Generation (3.5), scope already committed.

## Vynkor Constraint — Repeated Here Deliberately

Because this is easy to lose across stage boundaries: **Vynkor must be mentioned very briefly and vaguely, without details**, specifically to avoid the impression of competing with a 40-hour full-time work commitment. Requirements Analysis (2.3) and Application Design (2.6) should treat this as a hard content constraint, not a style preference.

## Assumptions & Open Questions

None. Every row traces to a specific confirmed answer in its named source stage.
