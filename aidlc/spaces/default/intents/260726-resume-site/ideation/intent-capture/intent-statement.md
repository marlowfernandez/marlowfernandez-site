# Intent Statement — marlowfernandez.com

**Intent:** `260726-resume-site` · **Scope:** `personal-static-site` (workflow-selected) [scope]
**Stage:** intent-capture · **Phase:** Ideation

## Problem Statement

Marlow Fernandez currently has no durable, owned professional presence — the site should reduce reliance on LinkedIn as his professional home [Q1]. He is actively job searching or about to be [Q4], and recent AI engineering work — exploring openclaw, LLMs, unsloth, model setups, and AI-DLC — has grown beyond what a single job title communicates [desc]. The gap is a professional home he owns outright: one link that replaces the PDF and the LinkedIn URL as the thing he actually sends [Q3], that outlives any single employer or platform [Q1].

## Target Customer

The primary visitor is a recruiter or hiring manager screening for role fit ahead of an interview [Q2]. The site's structure and content should be built for that reader first; nothing in this record confirms a second audience with equal weight, so treat other readers (e.g. prospective clients, AI/LLM peers) as secondary until a later stage says otherwise.

## Success Metrics

Success is defined narrowly and concretely: the site replaces the PDF and the LinkedIn URL as the thing Marlow actually sends [Q3]. This is a behavioural test, not an instrumented metric — no analytics target or inbound-volume goal was set at this stage. If a later stage (e.g. NFR Requirements) wants a measurable analytics or conversion target, that is new scope, not implied here.

## Initiative Trigger

Marlow is actively job searching, or about to be [Q4]. No stage in this record asked about a shipping-speed-versus-polish tradeoff, so none is asserted here; that is a delivery-planning concern, not an ideation one.

## Initial Scope Signal

- **Workflow-selected scope:** `personal-static-site` [scope].
- **User-confirmed product boundary:** Confirmed as exactly matching the workflow scope — a static resume site built through to live deployment on both domains named in the initial description, `marlowfernandez.com` (canonical) and `marlow.software` (redirecting) [desc], and nothing wider [Q8]. Q8's wider-boundary option (a blog, portfolio, writing archive, or a separate Vynkor presence) was presented and not selected; per this stage's grounding contract an unselected option is not converted into an exclusion, so it is recorded here only as declined, not as a forbidden list.

## Positioning Note (carried from the initial description, not yet a decision)

The initial description proposes including "AI Engineer" in the site's title/positioning [desc]. This is a content and title decision, not a scope decision — it belongs to Requirements Analysis (2.3) or Application Design (2.6), not to this stage. Recorded here only so it is not lost.

## Assumptions & Open Questions

None. Every claim above traces to `[desc]`, `[scope]`, or a confirmed `[Q<n>]` answer; nothing required an inference this stage couldn't ground.

## Review

**Reviewer:** aidlc-product-lead-agent
**Verdict:** READY (iteration 3 — narrow confirmation pass)

**Scope of this pass:** per the iteration-3 instruction, this pass re-checks only the single outstanding MEDIUM finding from iteration 2; it does not re-run the full adversarial review. Iterations 1 and 2 already covered all other content and found it resolved.

**Finding re-checked:**

- `stakeholder-map.md`, Stakeholders table, Interest column, row "Marlow Fernandez" previously cited only `[Q5], [Q6]` for a cell that includes the "professional home" phrase, which actually traces to Q1. The Source column now reads `[Q1], [Q5], [Q6]`.
- Verified against `intent-capture-questions.md`: Q1's confirmed answer is "D. Be a durable professional home that outlives any single job or platform — reducing reliance on LinkedIn." This is the exact source for the "professional home" phrase in the cell.
- With `[Q1]` added, every clause in the row is now traceable: "professional home" → Q1, "sole party with a stake in outcome or content" → Q5 (confirmed A, "None" — no other stakeholder), decision-authority column → Q6 (confirmed A, "You decide alone, no external influence").
- Citation is now accurate. Finding CONFIRMED RESOLVED.

**Outcome:** the single outstanding finding from iteration 2 is resolved with no new issues introduced by the fix. Combined with the 5 findings already verified resolved in iteration 2 (family-member naming, shipping-speed assertion, Q8 exclusion-list conversion, Q1/Q3 mistagging, scope-tag detail bleed — all still holding, unaffected by this change), the intent-capture stage has no outstanding findings.

This stage is READY to proceed.
