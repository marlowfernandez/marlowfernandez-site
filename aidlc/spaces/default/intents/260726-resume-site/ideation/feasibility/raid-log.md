# RAID Log — marlowfernandez.com

**Intent:** `260726-resume-site` · **Stage:** feasibility

## Risks

| # | Risk | Impact | Likelihood | Notes |
|---|---|---|---|---|
| R1 | If Application Design (2.6) later resolves the AI-showcase question (Q2, currently "not sure yet") toward a live interactive demo requiring a secret-authenticated API, the current $0/GitHub-Pages/fully-static stack cannot support it without either a re-architecture or a purely client-side call to a keyless/public API | Medium | Medium (genuinely undecided) | Recorded in `feasibility-assessment.md` "Open Item Carried Forward"; not a blocker today |
| R2 | The two-domain DNS/redirect cutover (Hostinger DNS → GitHub Pages, plus Hostinger forwarding for the second domain) is the one item this workflow's own composed scope flagged as lacking a dedicated infra-design artifact | Medium | Low, if `deployment-pipeline` (4.1) and `deployment-execution` (4.3) execute against this record precisely | `infrastructure-design` (3.4) is skipped by design in scope `personal-static-site`; this stage's Hosting & DNS section is the only design record for it |
| R3 | This repository is public, and the AI-DLC workflow commits its full audit trail, decisions, and artifacts by design | Low | Certain (by design, not accidental) | Already known and accepted — the repo was created public intentionally; flagged again here only as a standing fact, not a new concern |

## Assumptions

| # | Assumption | Confirmed by |
|---|---|---|
| A1 | GitHub Pages remains free and available for this repository as long as it stays public | Standard GitHub Pages terms for public repos, all account tiers |
| A2 | Hostinger's control panel supports both DNS record editing for `marlowfernandez.com` (A/ALIAS/ANAME to GitHub Pages) and simple registrar-level domain forwarding for `marlow.software` | Q3, Q7 — standard registrar features; the exact record type available should be confirmed against Hostinger's specific panel at deployment-pipeline (4.1) |
| A3 | No contact form, analytics, or dynamic backend is needed for v1 | Q6 |
| A4 | No existing brand assets need to be reused or matched | Q5 |

## Issues

None currently open. Nothing has blocked progress at this stage.

## Dependencies

| # | Dependency | Depends on | Notes |
|---|---|---|---|
| D1 | GitHub Pages' automatic HTTPS provisioning | Correct DNS records existing at Hostinger before "Enforce HTTPS" is enabled | Sequencing note for deployment-execution (4.3) |
| D2 | Site content | Requirements Analysis (2.3) extracting a structured content model from `Marlow_Fernandez_Resume.pdf` | Named explicitly since this stage does not touch content, only stack/hosting |
| D3 | Visual direction | Rough Mockups (1.6), informed by the `kgromero.com` reference from the initial project description | This stage's Q5 confirmed no existing assets exist independent of that reference |
| D4 | Final AI-showcase format (Q2) | Application Design (2.6) | Directly gates whether R1 above ever materializes |

## Assumptions & Open Questions (stage grounding contract)

None beyond what's captured in the Assumptions section above — every row in this log traces to a confirmed answer, a named upstream stage, or a stated architectural fact.
