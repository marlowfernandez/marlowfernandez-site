# Refined Mockups — marlowfernandez.com

**Intent:** `260726-resume-site` · **Stage:** refined-mockups · **Phase:** Inception
**Consumes:** [wireframes.md](../../ideation/rough-mockups/wireframes.md), [user-flow.md](../../ideation/rough-mockups/user-flow.md), [requirements.md](../requirements-analysis/requirements.md)

## Base Layout — Direction C, Refined

Building directly on `wireframes.md`'s selected Direction C (Minimal Single-Page), now with the actual content sections from `requirements.md` and the confirmed 3-breakpoint responsive behavior (Q3).

### Desktop (≥1024px)

```
┌──────────────────────────────────────────────────────────┐
│ Marlow Fernandez         [email] [phone] [LinkedIn] [◐]   │ <- header, theme toggle far right
├──────────────────────────────────────────────────────────┤
│  Marlow Fernandez                                          │ <- h1
│  Software Engineering Leader                                │
├──────────────────────────────────────────────────────────┤
│  EXPERIENCE                    │  AI ENGINEERING            │ <- two-column, h2 + h2
│  Point & Pay (2024–Present;    │  (format deferred to        │
│  prev. Sr SWE Apr'22–24)       │   Application Design;        │
│    [full bullets, incl.        │   draws on resume's AI &     │
│     Vynkor one-liner]          │   Automation list + Vynkor-  │
│  HII Technical Solutions       │   adjacent openclaw/unsloth/  │
│  Syzygy Integration (DHS)      │   model-setup content)       │
│  Palm Coast Data               │                              │
├──────────────────────────────────────────────────────────┤
│  EDUCATION & CERTIFICATION                                  │ <- h2
│  Full Sail University BS, Mobile Dev, 2017 (GPA 3.4,         │
│  Salutatorian) · CompTIA Security+ (verification code)       │
├──────────────────────────────────────────────────────────┤
│  Say hello: [email] · [phone] · [LinkedIn]                   │ <- h2, contact
├──────────────────────────────────────────────────────────┤
│  © Marlow Fernandez                                          │
└──────────────────────────────────────────────────────────┘
```

### Tablet (768–1023px)

Experience/AI Engineering columns narrow but stay side-by-side; header wraps contact icons below the name if needed.

### Mobile (<768px)

All sections stack single-column, top to bottom: header (name + toggle, contact icons wrap below) → **AI Engineering → Experience** → Education → Contact → footer. This order is locked by `wireframes.md`'s Device / Form Factor section ("Direction C... stacks its two-column Experience/AI-work pair vertically on mobile, AI Engineering first") and `user-flow.md`'s Key Decision Point (the AI Engineering section "must be reachable without requiring the visitor to first read the full Experience history") — both required upstream inputs to this stage. Desktop's side-by-side column order (Experience left, AI Engineering right) is unaffected, since simultaneous visibility has no "which comes first" concern the way a stacked mobile layout does.

## Section-by-Section Detail

### Header
- Name (not a link — this is the identity anchor, not a home-page nav item, since there's no multi-page nav per Direction C)
- Contact icons: email (mailto:), phone (plain text per Q1 of requirements-analysis, not necessarily a `tel:` link — kept as text per that confirmed answer), LinkedIn (opens in new tab, per this stage's Q4)
- Theme toggle: sun/moon icon, defaults to OS preference, persists a manual override via localStorage (this stage's Q2)

### Experience
- Point & Pay entry includes the Vynkor one-liner exactly as specified in `requirements.md`'s Experience Section — visually a smaller/lighter sub-line under Point & Pay's own bullets, not a bolded or highlighted callout, consistent with `scope-document.md`'s actual wording: "very brief and small, without details, as vague as possible"
- All 4 employer blocks at full detail, no condensing (per requirements.md)

### AI Engineering
- Placeholder section — exact content format (tagged grid vs. case studies) explicitly deferred to Application Design (2.6); this mockup only reserves the layout slot and confirms its position (second column, equal visual weight to Experience)

### Education & Certification
- Full detail per requirements.md — degree, school, year, GPA, honors, cert with verification code

### Contact
- Repeats email/phone/LinkedIn from the header, in a clearer call-to-action position at the page's end (a visitor who scrolled the whole page shouldn't have to scroll back up to find contact info)

### Error State
- No custom 404 page — a broken/mistyped URL shows GitHub Pages' default 404, per this stage's Q1

## Assumptions & Open Questions

None. Every section traces to `requirements.md`'s confirmed content model or this stage's own confirmed answers.

## Review

**Reviewer:** aidlc-product-lead-agent
**Verdict:** READY (iteration 3 — narrow confirmation pass)

**Scope of this pass:** per the iteration-3 instruction, this pass re-verifies only the two findings carried from iteration 2, checked directly against `design-system-mapping.md`, `mockups.md`, `wireframes.md`, and `feasibility-questions.md`. It does not re-run the full adversarial pass — iterations 1 and 2 already covered everything else in this stage and found it resolved.

### Finding 1 (was HIGH) — `design-system-mapping.md`'s header/body citation contradiction — RESOLVED

Iteration 2 found the header (line 4) still citing "Rough Mockups Q5" while the body (line 6) and closing Assumptions (line 56) had already been corrected to "Feasibility Q5" — a self-contradiction within the same document.

Checked directly against the current file: line 4 now reads *"greenfield/no-existing-assets fact confirmed at [Feasibility Q5](../../ideation/feasibility/feasibility-questions.md)"*; line 6 reads *"confirmed at **Feasibility Q5** ('Nothing — fully greenfield, no existing brand assets')"*; line 56 reads *"per Feasibility Q5's confirmed 'fully greenfield, no existing brand assets.'"* All three now cite the same source and the quoted content matches `feasibility-questions.md` Q5's actual answer verbatim: *"A. Nothing — fully greenfield, no existing brand assets."* No remaining contradiction, and the citation is correct — this fact was confirmed at Feasibility Q5, not at any Rough Mockups question.

### Finding 2 (was MEDIUM) — `mockups.md` misattributed its `wireframes.md` quote to the wrong section — RESOLVED

Iteration 2 found line 44 attributing the mobile-stacking-order quote to `wireframes.md`'s "Decision Record" section, when the quote actually lives in "Device / Form Factor."

Checked directly against the current file: line 44 now reads *"This order is locked by `wireframes.md`'s Device / Form Factor section ('Direction C... stacks its two-column Experience/AI-work pair vertically on mobile, AI Engineering first')"*. Checked against `wireframes.md`'s Device / Form Factor section (line 122): *"Direction C — the selected direction — stacks its two-column Experience/AI-work pair vertically on mobile, AI Engineering first."* — verbatim match, correctly attributed to the section that actually contains it. The adjacent `user-flow.md` Key Decision Point citation in the same sentence remains unaffected and was already verified accurate in iteration 2.

### What's solid (carried forward, still true)

- Finding 3 from iteration 2 (Vynkor quote matching `scope-document.md` verbatim) remains resolved and unaffected by this round.
- This stage's own Q1–Q5 citations, `interaction-spec.md`'s template compliance, `accessibility-checklist.md` agreement, and the system-font-stack rationale in `design-system-mapping.md` were all verified clean in earlier iterations and are unaffected by this round's edits.

**Outcome:** Both outstanding findings from iteration 2 are resolved, with no new issues surfaced while re-checking them. The refined-mockups stage has no outstanding findings.

This stage is READY to proceed.
