# Refined Mockups & UX Design — Questions

**Stage:** refined-mockups · **Phase:** Inception
**Record:** `aidlc/spaces/default/intents/260726-resume-site/`
**Consumes:** [wireframes.md](../../ideation/rough-mockups/wireframes.md), [user-flow.md](../../ideation/rough-mockups/user-flow.md), [requirements.md](../requirements-analysis/requirements.md), [team-practices.md](../practices-discovery/team-practices.md)

## Context

`user-stories` was skipped by this workflow's scope (optional input here) — this stage designs directly from Direction C's wireframe and the confirmed content model in `requirements.md`. IA, content, and section order are already locked; this interview covers what's genuinely still open: interaction detail, states, breakpoints, and error handling.

---

## Q1. What states does this near-static site actually need to design for?

Most content is fixed at build time, so classic loading/empty/error states barely apply — but a few genuinely do.

- A. Just the essentials: a 404 page for broken/mistyped URLs, and a no-JS fallback so the theme toggle degrades gracefully (site still readable, just no toggle) if JavaScript fails to load
- B. Essentials plus a brief loading skeleton for web fonts (avoid a flash of unstyled text)
- C. No special states needed — a broken URL can just 404 with the host's default page
- X. Other (please specify)

[Answer]: C. No special states needed — a broken URL can just 404 with the host's default page *(2026-07-27T23:38:52Z)*

---

## Q2. Theme toggle specifics: default theme and persistence?

- A. Default to the visitor's OS/browser preference (`prefers-color-scheme`); remember their manual override across visits (localStorage)
- B. Default to light regardless of OS preference; remember manual override
- C. Default to OS preference, but don't persist an override — resets each visit
- X. Other (please specify)

[Answer]: A. Default to the visitor's OS/browser preference (prefers-color-scheme); remember their manual override across visits (localStorage) *(2026-07-27T23:38:52Z)*

---

## Q3. Responsive breakpoints: how many, and where?

- A. Two — mobile (below ~768px) and desktop (768px and up), matching Direction C's two-column-to-single-column collapse
- B. Three — mobile, tablet, desktop with a distinct tablet layout
- C. Not sure — recommend one
- X. Other (please specify)

[Answer]: B. Three — mobile, tablet, desktop with a distinct tablet layout *(2026-07-27T23:38:52Z)*

---

## Q4. External links (LinkedIn, GitHub/project links in the AI Engineering section): open in a new tab, or the same tab?

- A. New tab — visitor doesn't lose their place on your site
- B. Same tab — simpler, standard browser back-button behavior
- C. Not sure — recommend one
- X. Other (please specify)

[Answer]: A. New tab — visitor doesn't lose their place on your site *(2026-07-27T23:38:52Z)*

---

## Q5. Visual direction: any specific typography/color preference, or delegate to design judgment informed by the kgromero.com reference and a professional/recruiter-facing tone?

- A. Delegate fully — clean, professional, accessible; your judgment call within WCAG 2.1 AA contrast requirements
- B. You have specific preferences (name them: fonts, colors, mood)
- C. Match kgromero.com's visual tone closely, not just its structure
- X. Other (please specify)

[Answer]: A. Delegate fully — clean, professional, accessible; your judgment call within WCAG 2.1 AA contrast requirements *(2026-07-27T23:38:52Z)*

---

## Assumptions & Open Questions

None yet — this file collects answers before any assumption is recorded.
