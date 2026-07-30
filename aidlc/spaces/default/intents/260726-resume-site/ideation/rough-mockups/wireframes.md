# Rough Wireframes — marlowfernandez.com

**Intent:** `260726-resume-site` · **Stage:** rough-mockups · **Phase:** Ideation
**Consumes:** [intent-statement.md](../intent-capture/intent-statement.md), [scope-document.md](../scope-definition/scope-document.md), [intent-backlog.md](../scope-definition/intent-backlog.md)

## Reference Analysis — kgromero.com

Browsed directly (not inferred from the name) to ground this comparison in what's actually there, per the initial description's naming of it as a design inspiration. Observed structure:

- Top nav: logo, resume/documents dropdowns, an "Open resume terminal" interactive gimmick, a theme (dark/light) toggle, mobile menu
- Hero: eyebrow label, name as H1, one-line tagline, a 3-item meta strip (Currently / Based in / Specialty), a contact icon row (phone/email/LinkedIn/GitHub/Linktree) plus a QR code
- About: single paragraph
- Experience: reverse-chronological list, 12 entries back to undergrad
- Skills: grouped **per employer**, each block linking out to that employer's site
- Recent Projects: a grid of personal side projects, each tagged by language/framework (C++, Go, Rust, Next.js, etc.) and linking to its GitHub repo
- Interests, Favorite Tech Resources
- Footer: credits the site's own stack (SvelteKit) and links live PageSpeed Insights results

**What transfers cleanly to this site:** the Recent-Projects-tagged-by-tool pattern maps almost exactly onto the confirmed AI-engineering-work section (openclaw / LLMs / unsloth / model setups / AI-DLC as tagged entries). The footer stack-credit + live performance link is a low-cost credibility touch worth considering given this site's own audience is recruiters screening technical fit.

**What does NOT transfer, and why:** the per-employer skills block links out to and showcases each employer, including the current one — that pattern is incompatible with `scope-document.md`'s Vynkor constraint (very brief, vague, no details, explicitly to avoid the impression of competing with full-time work). None of the three directions below propose a Vynkor-linked block; Vynkor stays folded into prose within the experience section only.

---

## Direction A — Reference-Parallel

Closely mirrors kgromero.com's proven information architecture, reskinned to this site's confirmed scope (4 must-have sections only, per `scope-document.md`).

```
┌─────────────────────────────────────────────┐
│ [Marlow Fernandez]      [Résumé ▾] [Theme]   │  <- h1 landmark: banner/nav
├─────────────────────────────────────────────┤
│  SOFTWARE ENGINEER · TEAM LEAD                │  <- h1: name
│  Marlow Fernandez.                            │
│  Building and leading teams that ship AI-     │
│  driven software.                             │
│  Currently: Team Lead, [employer]             │
│  Based in: [location]                         │
│  [phone] [email] [LinkedIn] [GitHub]          │  <- landmark: main > header
├─────────────────────────────────────────────┤
│  EXPERIENCE                                   │  <- h2
│  20XX–Now   Team Lead, Software Engineer      │
│  20XX–20XX  [prior roles + Vynkor, folded     │
│              in briefly, no dedicated block]  │
├─────────────────────────────────────────────┤
│  AI ENGINEERING WORK                          │  <- h2
│  [openclaw] [unsloth] [model setups] [AI-DLC] │  <- tagged cards, kgromero-
│  each: short write-up + link                  │     style Recent-Projects grid
├─────────────────────────────────────────────┤
│  CONTACT                                      │  <- h2
│  mailto: / LinkedIn — no form                 │
├─────────────────────────────────────────────┤
│  © Marlow Fernandez · Built with Next.js      │  <- landmark: contentinfo
└─────────────────────────────────────────────┘
```

Accessibility: `h1` = name in hero; `h2` per section; landmarks banner/main/contentinfo present; keyboard entry point = skip-to-main link before nav, matching the reference's own pattern.

## Direction B — AI-Engineering-Forward

Leads with the newer AI engineering positioning rather than a generic experience-first layout — more editorial, case-study feel. Experience is demoted below the AI work.

```
┌─────────────────────────────────────────────┐
│ [Marlow Fernandez]                 [Theme]    │
├─────────────────────────────────────────────┤
│  Marlow Fernandez.                            │  <- h1
│  Software Engineer exploring what AI-         │
│  assisted engineering makes possible.         │
│  [phone] [email] [LinkedIn] [GitHub]          │
├─────────────────────────────────────────────┤
│  AI ENGINEERING                               │  <- h2, leads
│  Case studies: openclaw · LLMs · unsloth ·    │
│  model setups · AI-DLC                        │
│  (each: problem, approach, outcome)           │
├─────────────────────────────────────────────┤
│  EXPERIENCE                                   │  <- h2
│  Team Lead / Software Engineer timeline       │
│  (Vynkor folded in briefly, per constraint)   │
├─────────────────────────────────────────────┤
│  CONTACT                                      │  <- h2
│  mailto: / LinkedIn                           │
├─────────────────────────────────────────────┤
│  © Marlow Fernandez                           │
└─────────────────────────────────────────────┘
```

Accessibility: same landmark/heading shape as Direction A; only section order changes.

## Direction C — Minimal Single-Page — SELECTED

Leaner than the reference on purpose — no terminal gimmick, no QR code, no business-card download, no per-employer skill blocks. Matches the confirmed must-have-only v1 scope with nothing extra, plus a theme toggle confirmed at this stage's Q3.

```
┌─────────────────────────────────────────────┐
│ Marlow Fernandez     [mailto] [in] [Theme]   │  <- single-row header, no nav menu
├─────────────────────────────────────────────┤
│  Marlow Fernandez                             │  <- h1
│  Team Lead · Software Engineer · AI work      │
├─────────────────────────────────────────────┤
│  EXPERIENCE          │  AI ENGINEERING        │  <- h2 + h2, two-column
│  (timeline, brief)   │  (tagged short entries)│     on desktop, stacked on mobile
├─────────────────────────────────────────────┤
│  Say hello: [email] / [LinkedIn]              │  <- h2, contact
├─────────────────────────────────────────────┤
│  © Marlow Fernandez                           │
└─────────────────────────────────────────────┘
```

Accessibility: single `h1`, two `h2` siblings in a two-column region (`role="region"` pair), one `h2` for contact; no nav landmark needed since there's no menu — reduces the accessibility surface to verify, which is a deliberate simplicity tradeoff. Baseline target: **WCAG 2.1 AA** (confirmed Q5) — the theme toggle button needs an accessible name and visible focus state; contrast must hold in both themes.

## Decision Record

- **Direction:** C, Minimal Single-Page (Q1) — chosen over A (too close a mirror of the reference's density) and B (editorial reorder considered but not preferred).
- **Resume-terminal-style gimmick:** explicitly declined (Q2) — not carried into any later stage.
- **Theme toggle:** confirmed **in scope** (Q3) — this **finalizes** `intent-backlog.md`'s "Could Have / undecided" status into a committed v1 feature. Nothing was previously decided either way, so this is a first resolution, not a reversal. Requirements Analysis and Application Design should treat it as confirmed, not optional.
- **AI Engineering section presentation** (tagged grid vs. prose case studies): still open (Q4), explicitly deferred to Application Design (2.6), consistent with `feasibility-assessment.md`'s existing deferral of the live-demo-vs-write-up question to the same stage. Both questions land at the same later gate.
- **Accessibility baseline:** WCAG 2.1 AA (Q5) — carries forward as a concrete, testable target for NFR Requirements (3.2).

## Device / Form Factor

All three directions are designed mobile-first and single-column below ~768px; Direction A and B keep their section order on mobile. Direction C — the selected direction — stacks its two-column Experience/AI-work pair vertically on mobile, AI Engineering first.

## Assumptions & Open Questions

None. Every structural claim above traces to either the reference-site observation (recorded in this stage's diary) or a confirmed decision in `scope-document.md`/`intent-backlog.md`.

## Review

**Reviewer:** aidlc-product-lead-agent
**Verdict:** READY (iteration 3 — narrow confirmation pass)

**Scope of this pass:** per the iteration-3 instruction, this pass re-checks only the single outstanding finding carried from iteration 2 — the mis-citation in `user-flow.md`'s Key Decision Point. It does not re-run the full adversarial pass; iterations 1 and 2 already covered everything else in this stage and found it resolved.

**Finding re-checked — RESOLVED.** `user-flow.md`'s Key Decision Point now reads: *"The durability/ownership framing ('outlives any single employer or platform') comes from `intent-statement.md`'s **Problem Statement** section, not its Success Metrics section — the Success Metrics section instead defines success narrowly as the site replacing the PDF/LinkedIn URL as the thing sent."* Verified directly against `intent-statement.md`:

- The quote *"outlives any single employer or platform"* appears only in the **Problem Statement** section (line 8): *"...one link that replaces the PDF and the LinkedIn URL as the thing he actually sends [Q3], that outlives any single employer or platform [Q1]."* It does not appear anywhere in the Success Metrics section.
- The Success Metrics section (line 16) reads: *"Success is defined narrowly and concretely: the site replaces the PDF and the LinkedIn URL as the thing Marlow actually sends [Q3]. This is a behavioural test, not an instrumented metric — no analytics target or inbound-volume goal was set at this stage."* This matches the fix's paraphrase — "defines success narrowly as the site replacing the PDF/LinkedIn URL as the thing sent" — in both content and framing (narrow, behavioural, no durability/ownership language).

Both halves of the corrected sentence hold: the attribution (Problem Statement, not Success Metrics) is accurate, and the restated content of Success Metrics is accurate. No new citation error introduced by this fix.

**Outcome:** the single outstanding finding from iteration 2 is resolved. Combined with the earlier fix (theme-toggle wording) and the non-blocking cleanup, both already confirmed resolved in iteration 2, the rough-mockups stage has no outstanding findings.

This stage is READY to proceed.
