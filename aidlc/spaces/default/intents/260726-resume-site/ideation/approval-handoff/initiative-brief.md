# Initiative Brief — marlowfernandez.com

**Intent:** `260726-resume-site` · **Stage:** approval-handoff (final IDEATION stage)
**Consumes:** [intent-statement.md](../intent-capture/intent-statement.md), [stakeholder-map.md](../intent-capture/stakeholder-map.md), [scope-document.md](../scope-definition/scope-document.md), [intent-backlog.md](../scope-definition/intent-backlog.md), [feasibility-assessment.md](../feasibility/feasibility-assessment.md), [constraint-register.md](../feasibility/constraint-register.md), [wireframes.md](../rough-mockups/wireframes.md)

## Intent and Problem Statement

Per `intent-statement.md`: Marlow Fernandez has no durable, owned professional presence and relies on LinkedIn and a resume PDF. Actively job searching. The site is meant to become the link he actually sends, replacing both, and to outlive any single employer or platform.

## Market Validation

Not applicable — `market-research` was skipped by this workflow's composed scope (`personal-static-site`). Audience is known directly: recruiters and hiring managers screening for role fit (`intent-statement.md`'s Target Customer), confirmed at Q2 of Intent Capture with no market analysis needed to establish it.

## Feasibility and Risk Highlights

Per `feasibility-assessment.md` and its companion `raid-log.md`:
- **Stack:** Next.js, static export.
- **Hosting:** GitHub Pages (free, public repo).
- **DNS:** `marlowfernandez.com` (canonical) via Hostinger DNS → GitHub Pages; `marlow.software` → registrar-level Hostinger forwarding.
- **Budget:** $0.
- **3 risks recorded**, all reviewed and accepted as-is at this stage's gate (see Decision Log): the AI-showcase hosting constraint (R1), DNS cutover complexity (R2), and public-repo visibility (R3, intentional by design).

## Scope Boundary

Per `scope-document.md`: 4 must-have v1 sections — hero/intro, experience timeline (Vynkor folded in, kept deliberately brief and vague), AI engineering work, contact (mailto/LinkedIn, no form). Blog/writing archive and custom animations explicitly excluded from v1. Theme toggle finalized in at Rough Mockups. Urgent timeline (ASAP, no fixed date). Walking-skeleton build sequencing confirmed.

## Concept Visuals

Per `wireframes.md`: **Direction C, Minimal Single-Page**, selected after comparing three directions against an actual review of kgromero.com. No nav menu, no interactive gimmicks, two-column Experience/AI-work layout on desktop stacking to single-column on mobile. WCAG 2.1 AA accessibility target.

## Team Plan

Not applicable — `team-formation` was skipped. Sole builder, sole stakeholder, sole decision-maker (`stakeholder-map.md`).

## Go/No-Go Recommendation

**Go.** Confirmed at this stage's Q1 with no dissent. Every open item carried forward (AI-showcase format, theme-toggle CSS specifics) is explicitly deferred to a named later stage (Application Design, 2.6) rather than left ambiguous, and all 3 recorded risks were reviewed and accepted rather than waved through unread.

## Assumptions & Open Questions

None. Every claim above traces to a specific upstream IDEATION artifact.
