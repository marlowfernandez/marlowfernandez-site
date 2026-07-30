# Feasibility Assessment — marlowfernandez.com

**Intent:** `260726-resume-site` · **Stage:** feasibility · **Phase:** Ideation
**Consumes:** [intent-statement.md](../intent-capture/intent-statement.md)

## Summary

This assessment evaluates the stack, hosting, and DNS approach against the intent recorded in `intent-statement.md`: a static resume site, sole stakeholder, $0 budget, confirmed product boundary through live deployment on two domains. Technical viability is **high** — every choice below is a mature, widely-used, free-tier-compatible combination with no unresolved blocker. The one real constraint worth carrying forward (not a blocker) is that the chosen host has no server runtime, which bounds what a later AI-showcase feature can do without a re-architecture.

## Stack Decision

**Next.js, static export** (`output: 'export'`) — confirmed answer to Q1. This was chosen over Astro, Eleventy, and a hand-rolled build for the React-ecosystem skill signal to recruiters and hiring managers screening for it, per the site's confirmed primary audience in `intent-statement.md`'s Target Customer section.

**Technical viability:** Next.js's static export mode produces a directory of plain HTML/CSS/JS with no server dependency, which is exactly what a static host requires. This is a mature, first-class Next.js deployment target, not an edge case.

## Hosting & DNS

**Host:** GitHub Pages, confirmed at Q3 — free for public repositories, which this repository already is. GitHub Pages serves static files from a repo (via a build workflow or a committed output directory) and supports one custom domain per repo, configured with a `CNAME` file plus DNS records at the registrar.

**Canonical domain (`marlowfernandez.com`):** DNS at Hostinger points the apex domain at GitHub Pages (either GitHub's four documented anycast IPs via A records, or an ALIAS/ANAME record if Hostinger's plan supports one — confirmed at deployment-pipeline, 4.1, since the specific record type available depends on Hostinger's DNS panel). GitHub Pages issues automatic free HTTPS via Let's Encrypt once DNS resolves correctly to it.

**Redirecting domain (`marlow.software`):** Confirmed at Q7 — handled entirely at Hostinger via registrar-level domain forwarding (a 301 redirect configured in Hostinger's control panel), **not** through GitHub Pages or through any code in this repository. GitHub Pages has no mechanism to redirect a domain it doesn't serve, so this domain never touches the site's DNS or hosting configuration at all.

**Why this matters given the workflow's own shape:** `infrastructure-design` (3.4) was deliberately skipped by this workflow's composed scope — the workflow's own record notes deployment-pipeline (4.1) and deployment-execution (4.3) must own DNS/TLS/redirect configuration explicitly because no dedicated infra-design artifact exists. This section **is** that record for the hosting and DNS shape; 4.1 should execute against it rather than re-deriving it.

## Budget

$0 — confirmed at Q4. GitHub Pages (hosting), GitHub Actions (build, generous free minutes for public repos), and the two already-registered Hostinger domains cover the full stack with no new recurring cost.

## Assets

Fully greenfield — confirmed at Q5. No existing logo, palette, or brand marks. Visual direction is deferred to Rough Mockups (1.6), informed by the `kgromero.com` reference named in the initial project description.

## Server-Side Surface

None required for v1 — confirmed at Q6. A `mailto:` link or a link to LinkedIn/email is sufficient for contact. This keeps the site **fully static** with zero backend, zero form-handler dependency, and zero attack surface beyond what GitHub Pages itself serves.

## Open Item Carried Forward: AI Showcase Format

Q2 was answered "Not sure yet" — whether the AI engineering work (openclaw, LLMs, unsloth, model setups, AI-DLC) appears as written case studies or a live interactive demo is deferred to Application Design (2.6). This is recorded as a constraint, not a blocker, in the constraint register: a live demo requiring a real server-authenticated backend is **not compatible** with the current $0/GitHub-Pages/fully-static combination without either (a) a purely client-side call to a third-party API that doesn't require a secret key, or (b) adding a server-capable host later. Written case studies are compatible with every decision on this page as-is.

## Assumptions & Open Questions

None. Every decision above traces to a confirmed `[Q<n>]` answer in `feasibility-questions.md`, or directly to `intent-statement.md`'s confirmed scope boundary.
