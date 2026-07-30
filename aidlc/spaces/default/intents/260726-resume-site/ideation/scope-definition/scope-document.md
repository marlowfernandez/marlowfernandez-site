# Scope Document — marlowfernandez.com

**Intent:** `260726-resume-site` · **Stage:** scope-definition · **Phase:** Ideation
**Consumes:** [intent-statement.md](../intent-capture/intent-statement.md), [feasibility-assessment.md](../feasibility/feasibility-assessment.md), [constraint-register.md](../feasibility/constraint-register.md)

## Product Boundary (carried from Intent Capture)

`intent-statement.md`'s Initial Scope Signal already confirmed the outer boundary: a static resume site built through to live deployment on both domains (`marlowfernandez.com` canonical, `marlow.software` redirecting), nothing wider. This document narrows that boundary to what ships in v1.

## In Scope for v1 (Must-Have)

Confirmed at Q1 — all four selected:

1. **Hero/intro + current role summary**
2. **Experience timeline** — Team Lead / Software Engineer roles, including Vynkor per the treatment below
3. **AI engineering work** — openclaw, LLMs, unsloth, model setups, AI-DLC — as case studies or a project list (final format deferred to Application Design per `feasibility-assessment.md`'s Q2 carry-forward)
4. **Contact** — `mailto:`/LinkedIn link only, no form, per `feasibility-assessment.md`'s confirmed fully-static decision

## Vynkor Treatment — Explicit Constraint

Confirmed at Q2, and important enough to state precisely rather than paraphrase loosely: Vynkor is a side project, not full-time work. The mention on the site must be **very brief and small, without details, as vague as possible** — the explicit reason given is to avoid employers reading it as competing with a 40-hour work week commitment. The site should frame Vynkor within AI engineering, not present it as a business in its own right. This is a content constraint, not a scope-boundary one — Vynkor is folded into the experience timeline (In Scope item 2), not a dedicated section.

**This constraint must be carried forward verbatim to Requirements Analysis (2.3) and Application Design (2.6)** — it is easy for a well-meaning content pass to accidentally expand a "Vynkor" line item into more visibility than intended.

## Explicitly Out of Scope for v1

Confirmed at Q5:

- **Blog or writing archive** — already declined as a wider product boundary in Intent Capture; confirmed again here as out of v1 specifically.
- **Custom animations or motion design** beyond whatever the chosen framework/component approach provides by default.

**Not pre-decided either way** (left to build-time default, not excluded): a dark/light theme toggle. Q5 did not select this as an exclusion, so it is not forbidden — just not committed to.

## AI Positioning — No Scope Impact

Confirmed at Q3: whether "AI Engineer" appears in the site's title/positioning is a wording decision, not a scope decision. It does not force any section above from optional to must-have — all four sections were already must-have independent of this question.

## Timeline

Confirmed at Q4: urgent, ASAP, no fixed calendar date named. This is a real constraint on how the workflow should run — favor a working, deployed v1 over an extended polish cycle — but it is not a hard external deadline (e.g., no specific interview date recorded).

## Build Sequencing

Confirmed at Q6: bare-bones live first, then layer real content. This matches the walking-skeleton default already set on this workflow's composed scope (`skeleton: on` in `aidlc-personal-static-site.md`). Construction's first Bolt should be a deliberately thin, genuinely deployable slice — live on both domains, real navigation, placeholder-quality content — that gets its own approval gate before the remaining content is built out.

## Assumptions & Open Questions

None. Every decision above traces to a confirmed `[Q<n>]` answer in `scope-definition-questions.md`, or to an already-confirmed decision in an upstream artifact.
