# Feasibility & Constraint Analysis — Questions

**Stage:** feasibility · **Phase:** Ideation · **Depth:** Standard
**Record:** `aidlc/spaces/default/intents/260726-resume-site/`
**Consumes:** `aidlc/spaces/default/intents/260726-resume-site/ideation/intent-capture/intent-statement.md`

## Context

The stage file's default topic list (system integrations, PCI/HIPAA/SOC2, team tech stack, AWS account inventory) targets an organizational feature build. This is a static personal site with one stakeholder and no backend of record, so the questions below are retargeted to what's actually undecided: **stack, hosting/DNS for two domains, budget, and whether any server-side element is needed at all** — the un-skip trigger the workflow composer recorded for this stage was explicitly "you asked for stack options before committing to one."

Not re-asked here: what resume content is public (already routed to Requirements Analysis, 2.3, per the composer's plan and the intent-capture stakeholder map).

---

## Q1. Which build approach fits best? (the options-first question)

Four real candidates, each with genuine tradeoffs for a public, recruiter-facing, professionally-built site:

- **A. Astro** — static-site generator, content in Markdown/MDX (git-versioned, no CMS lock-in), ships close to zero JavaScript by default, consistently the fastest Lighthouse scores of the four. Supports "islands" — small interactive React/Vue/Svelte components — if you later want an embedded AI demo without adopting a full app framework. Deploys free on Cloudflare Pages, Netlify, Vercel, or GitHub Pages.
- **B. Next.js (static export)** — React framework. Familiar to any hiring manager screening for React/Next skills specifically, which doubles as a soft skill signal. Heavier default bundle than Astro for a mostly-static page. Static export drops server routes — if you want a live interactive AI feature later (not just a write-up), you'd need to add a real host with server functions (e.g. Vercel) rather than pure static hosting.
- **C. Eleventy (11ty)** — template-based (Nunjucks/Liquid), ships zero client JavaScript by default, the leanest and simplest of the four. Strong "engineering restraint" signal. Least native support for a future embedded interactive demo — you'd bolt on tooling rather than use a built-in island model.
- **D. Hand-rolled HTML/CSS + minimal vanilla JS, no framework or build step** — maximal control, zero dependency risk, fastest possible cold load. Slower to maintain as content grows (no templating means editing raw HTML for every change), and doesn't demonstrate framework fluency to a technical reviewer who inspects the public repo.

- X. Other (please specify)

[Answer]: B. Next.js (static export) *(2026-07-26T21:35:00Z, batch 1)*

---

## Q2. Should the AI engineering work (openclaw, LLMs, unsloth, model setups, AI-DLC) show up as a live interactive feature, or as written case studies?

This materially affects the stack choice above — a live demo needs a server function or an external API call from the client; a case study needs only prose and code snippets.

- A. Written case studies only — prose, screenshots, code snippets. No server-side component needed.
- B. A live interactive demo (e.g. a small chat widget or model-output showcase) — commits to a host with server/edge functions, not pure static hosting.
- C. Not sure yet — decide this after seeing the site structure in Application Design (2.6).
- X. Other (please specify)

[Answer]: C. Not sure yet — decide after seeing the site structure in Application Design (2.6) *(2026-07-26T21:35:00Z, batch 1)*

---

## Q3. What's the hosting and DNS situation for the two domains today?

This is the fiddliest item in the whole build per the workflow's own plan — `infrastructure-design` was deliberately skipped, so whatever is decided here is the only design record for it.

- A. Both domains are already with a registrar (name it) with no hosting set up yet — greenfield choice on host and DNS.
- B. One or both domains already point somewhere (an existing host, parked page, or redirect) that needs to be replaced.
- C. No strong preference — recommend a host and I'll follow it.
- X. Other (please specify)

[Answer]: X. Other — GitHub Pages for hosting (free for public repositories); both domains are registered at Hostinger *(2026-07-26T21:35:00Z, batch 1)*

---

## Q4. What's the budget ceiling for ongoing hosting and tooling costs?

- A. $0 — free-tier only (Cloudflare Pages / Netlify / Vercel / GitHub Pages all have workable free tiers for this use case).
- B. A few dollars a month is fine if it buys meaningfully better DX or a custom feature.
- C. Cost is not a constraint — optimize for the best result.
- X. Other (please specify)

[Answer]: A. $0 — free-tier only *(2026-07-26T21:52:47Z, batch 2)*

---

## Q5. Any existing assets to reuse — logo, color palette, brand marks, an existing repo?

The project root currently contains only the AI-DLC scaffolding, the README, and the resume PDF — confirming there's nothing else before treating this as fully greenfield.

- A. Nothing — fully greenfield, no existing brand assets.
- B. Some assets exist outside this repo (specify what and where).
- C. Not sure — happy to develop a look from scratch informed by the kgromero.com reference.
- X. Other (please specify)

[Answer]: A. Nothing — fully greenfield, no existing brand assets *(2026-07-26T21:52:47Z, batch 2)*

---

## Q6. Beyond the AI showcase question above (Q2), is any other server-side element wanted — a contact form, newsletter signup, analytics backend?

- A. None — a mailto: link or a link to LinkedIn/email is sufficient for contact.
- B. A contact form is wanted, which needs at minimum a serverless form-handler (e.g. Formspree, a static host's built-in form handling, or a small function) even on an otherwise fully static site.
- C. Not sure yet — decide during Requirements Analysis (2.3).
- X. Other (please specify)

[Answer]: A. None — a mailto: link or a link to LinkedIn/email is sufficient for contact *(2026-07-26T21:52:47Z, batch 2)*

---

## Q7. (Follow-up to Q3) GitHub Pages serves exactly one custom domain per repo, configured via a `CNAME` file — it has no built-in way to redirect a second domain. So `marlow.software → marlowfernandez.com` has to be done entirely at Hostinger, not through GitHub Pages. How should that redirect be implemented?

- A. Hostinger's registrar-level domain forwarding (301) — point `marlow.software` at `marlowfernandez.com` directly in Hostinger's control panel. No code, no separate hosting for the second domain.
- B. Point both domains' DNS at GitHub Pages and let the site's own code detect the hostname and issue a client-side redirect. More moving parts, no real benefit over option A for this use case.
- C. Not sure — recommend the standard approach.
- X. Other (please specify)

[Answer]: A. Hostinger's registrar-level domain forwarding (301) *(2026-07-26T21:52:47Z, batch 2)*

---

## Assumptions & Open Questions

None yet — this file collects answers before any assumption is recorded.
