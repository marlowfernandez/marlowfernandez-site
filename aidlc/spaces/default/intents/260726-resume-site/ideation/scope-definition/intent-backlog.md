# Intent Backlog — marlowfernandez.com

**Intent:** `260726-resume-site` · **Stage:** scope-definition
**Consumes:** [intent-statement.md](../intent-capture/intent-statement.md), [feasibility-assessment.md](../feasibility/feasibility-assessment.md)

Proto-Units prioritized MoSCoW-style, per `scope-document.md`'s confirmed in/out boundary. Final unit decomposition happens at Units Generation (2.7); this backlog is the input to that stage, not a substitute for it.

## Must Have (v1)

| # | Item | Notes |
|---|---|---|
| 1 | **Walking-skeleton deploy** | A thin, genuinely live slice on both domains — Next.js static export scaffold, GitHub Pages hosting wired, Hostinger DNS pointed at it, `marlow.software` forwarding configured, placeholder-quality content in every section below. Confirmed sequenced first at Q6. This is the first Construction Bolt's gate per this workflow's walking-skeleton setting. |
| 2 | Hero/intro + current role summary | Q1 |
| 3 | Experience timeline (Team Lead / Software Engineer roles, incl. Vynkor per the brief/vague treatment in `scope-document.md`) | Q1, Q2 |
| 4 | AI engineering work (openclaw, LLMs, unsloth, model setups, AI-DLC) — format (case study vs. list vs. live demo) resolved at Application Design | Q1; format carried forward from `feasibility-assessment.md`'s Q2 |
| 5 | Contact (`mailto:`/LinkedIn link, no form) | Q1; confirmed fully-static in `feasibility-assessment.md` |

## Should Have

None identified — every confirmed must-have was unconditional, and nothing was proposed as a should-have during this stage.

## Could Have

| # | Item | Notes |
|---|---|---|
| 1 | Dark/light theme toggle | Not excluded (Q5 did not select it), not committed to either — a build-time judgment call, not a v1 commitment |

## Won't Have (v1) — explicitly excluded

| # | Item | Notes |
|---|---|---|
| 1 | Blog or writing archive | Confirmed out at Q5; already declined as a wider product boundary at Intent Capture |
| 2 | Custom animations/motion beyond framework defaults | Confirmed out at Q5 |

## Sequencing

1. **Walking-skeleton deploy** ships first and gets its own approval gate (per this workflow's `skeleton: on` setting) before any further content work.
2. Items 2–5 (Must Have) are then layered onto the live skeleton in any order — none has a hard dependency on another; all are independent content sections on the same site shell.
3. No hard external deadline is recorded (Q4: urgent/ASAP but no fixed date), so sequencing optimizes for "working and live" over "complete before launch," consistent with the walking-skeleton choice.

## Assumptions & Open Questions

None. Every row traces to a confirmed `[Q<n>]` answer in `scope-definition-questions.md`.
