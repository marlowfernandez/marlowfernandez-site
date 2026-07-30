# Scope Definition & Prioritization — Questions

**Stage:** scope-definition · **Phase:** Ideation · **Depth:** Standard
**Record:** `aidlc/spaces/default/intents/260726-resume-site/`
**Consumes:** [intent-statement.md](../intent-capture/intent-statement.md), [feasibility-assessment.md](../feasibility/feasibility-assessment.md), [constraint-register.md](../feasibility/constraint-register.md)

## Context

The stage prose's default topics (capability sequencing, dependencies between capabilities, hard deadlines tied to specific capabilities) assume a multi-workstream build. This is a single-builder static site resolving to roughly 3 units of work (per this workflow's Units Generation stage, still ahead), so the questions below work at page/section level rather than capability-dependency level. The product boundary itself is already confirmed — `intent-statement.md`'s Initial Scope Signal: a static resume site through live deployment on both domains, nothing wider. What's still open is **which sections ship in v1 and which are explicitly deferred**.

---

## Q1. Which sections are must-have for v1? (select all that apply)

- A. Hero/intro + current role summary
- B. Experience timeline (Team Lead / Software Engineer roles, Vynkor)
- C. AI engineering work (openclaw, LLMs, unsloth, model setups, AI-DLC) — as case studies or a project list
- D. Contact (mailto/LinkedIn, per the feasibility decision — no form)
- X. Other (please specify)

[Answer]: A. Hero/intro + current role summary, B. Experience timeline, C. AI engineering work, D. Contact — all four are must-have for v1 *(2026-07-27T01:07:13Z, batch 1)*

---

## Q2. Does Vynkor get its own dedicated section, or a brief mention within your experience/bio?

Intent Capture confirmed the product boundary does *not* include a separate Vynkor site — this question is narrower: how much room does Vynkor get *within* this site.

- A. Dedicated section — Vynkor gets its own page or clearly separated block
- B. Brief mention only — folded into experience/bio, no dedicated section
- C. Not sure yet — decide during Requirements Analysis (2.3) content modeling
- X. Other (please specify)

[Answer]: X. Other — Vynkor is a side project, not full-time work; the mention must be very brief and small, without details, as vague as possible, so employers don't read it as competing with the 40-hour work week. The site should stick to AI engineering framing rather than presenting Vynkor as a business in its own right *(2026-07-27T01:07:13Z, batch 1)*

---

## Q3. Should "AI Engineer" positioning affect what ships in v1, or is that purely a later wording decision?

Intent Capture's Positioning Note flagged this as a content/title decision for a later stage, not a scope decision. This question checks only whether it changes what *sections exist*, not how they're worded.

- A. No scope impact — it's wording only, decide at Requirements Analysis/Application Design as already planned
- B. Yes — it means AI engineering case studies (Q1-C) must be must-have, not optional, for v1
- C. Not sure yet
- X. Other (please specify)

[Answer]: A. No scope impact — it's wording only, decide at Requirements Analysis/Application Design as already planned *(2026-07-27T01:07:13Z, batch 1)*

---

## Q4. Is there a target date for v1, given the active job search?

- A. Yes — a specific date or window (name it)
- B. No hard date, but "as soon as reasonably possible" is the intent
- C. No time pressure at all — quality over speed
- X. Other (please specify)

[Answer]: A/B blend — Yes, urgent: ASAP, no fixed calendar date named but ship as fast as reasonably possible given the active job search *(2026-07-27T01:13:11Z, batch 2)*

---

## Q5. What should be explicitly OUT of scope for v1 — decided now so it doesn't creep in later? (select all that apply)

- A. Blog or writing archive (already declined as a wider product boundary in Intent Capture — confirming it stays out of v1 specifically, not just out of the overall product)
- B. Dark/light theme toggle — ship one theme only for v1
- C. Animations/motion design beyond what a template provides by default
- D. None of these need explicit exclusion — default to whatever's simplest at build time
- X. Other (please specify)

[Answer]: A. Blog or writing archive, C. Animations/motion design beyond template defaults — both explicitly excluded from v1. (Theme toggle not selected as an exclusion — left to build-time default, not pre-decided either way.) *(2026-07-27T01:13:11Z, batch 2)*

---

## Q6. Build sequencing preference — ship a bare-bones live version first and layer content, or build the whole v1 before it goes live?

This maps to the workflow's walking-skeleton setting (`skeleton: on` for this composed scope) — Construction's first Bolt is a deliberately thin, deployable slice you approve before the rest builds.

- A. Bare-bones live first (a working deploy with placeholder-quality content on both domains), then layer real content — matches the walking-skeleton default already set for this workflow
- B. Build the complete v1 content before anything goes live
- C. No preference — follow whatever the workflow's default already is
- X. Other (please specify)

[Answer]: A. Bare-bones live first, then layer real content — matches the walking-skeleton default already set for this workflow *(2026-07-27T01:13:11Z, batch 2)*

---

## Assumptions & Open Questions

None yet — this file collects answers before any assumption is recorded.
