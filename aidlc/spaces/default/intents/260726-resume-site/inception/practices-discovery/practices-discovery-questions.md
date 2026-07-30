# Practices Discovery — Interview

**Stage:** practices-discovery · **Phase:** Inception
**Record:** `aidlc/spaces/default/intents/260726-resume-site/`

## Context

Greenfield path: all questions below use `org.md`'s five sections as suggested defaults (never established fact), per the lead's draft in `team-practices.md`. Several questions exist specifically because the three independent spoke reviews (quality, developer, devsecops — all in `contributions/`) surfaced real gaps in that draft, not because the stage prose demanded them generically.

---

## Way of Working

### Q1. Direct commits to `main`, or short-lived feature branches per Bolt?

The lead's draft notes `org.md`'s branch convention implicitly assumes a second reviewer, which doesn't exist here.

- A. Short-lived feature branches per Bolt, squash-merged — as org.md defaults to
- B. Direct commits to `main` — no branches, given solo build and urgent timeline
- C. Branches for Construction Bolts, direct commits for small fixes
- X. Other (please specify)

[Answer]: B. Direct commits to `main` — no branches, given solo build and urgent timeline *(2026-07-27T02:45:58Z, batch 1)*

---

## Walking Skeleton

### Q2. After Bolt 1 (the walking skeleton) ships and its gate is approved, how should remaining Bolts run?

This is the standing "ladder prompt" from `org.md`, already triggered by this project's confirmed `skeleton: on` setting.

- A. Continue autonomously — no gate per remaining Bolt, only failures halt and ask
- B. Gate every Bolt — approve each one individually
- C. Not sure — decide when Bolt 1 actually ships
- X. Other (please specify)

[Answer]: A. Continue autonomously — no gate per remaining Bolt, only failures halt and ask *(2026-07-27T02:45:58Z, batch 1)*

---

## Testing Posture

### Q3. What replaces org.md's numeric coverage floor for this content-only site?

The lead proposed dropping the 80%-coverage default as a poor fit for near-zero business logic.

- A. Build succeeds + links resolve + accessibility/performance budgets pass in CI — no coverage percentage at all
- B. Some numeric floor still applies (name it)
- C. Not sure — recommend one
- X. Other (please specify)

[Answer]: C. Not sure — recommend one. Recommendation given and accepted: A, no coverage percentage — build succeeds + links resolve + accessibility/performance budgets pass in CI *(2026-07-27T02:45:58Z, batch 1)*

---

### Q4. (Quality spoke's finding) The theme toggle (dark/light, confirmed at Rough Mockups) is real client-side logic — toggle state, persistence, focus/contrast — that the "no business logic" framing overlooked. Does it need its own explicit check?

- A. Yes — a specific check for toggle behavior (state persists, focus visible, contrast holds in both themes)
- B. No — the general accessibility/build checks in Q3 already cover it
- C. Not sure — decide at NFR Requirements (3.2) when the budget is set precisely
- X. Other (please specify)

[Answer]: A. Yes — a specific check for toggle behavior (state persists, focus visible, contrast holds in both themes) *(2026-07-27T02:48:02Z, batch 2)*

---

### Q5. (Developer spoke's suggestion) Should build-time content-schema validation be a CI check — catching a malformed content file before it ships, distinct from coverage percentage?

- A. Yes — add it as a CI check
- B. No — not worth the setup for a site this size
- C. Not sure — decide at CI Pipeline (3.7) when the actual content format is chosen
- X. Other (please specify)

[Answer]: A. Yes — add it as a CI check *(2026-07-27T02:48:02Z, batch 2)*

---

## Deployment

### Q6. (Quality spoke's finding) With no second human reviewer, should the CI quality gate explicitly be the thing that blocks merge-to-`main` (and thus deploy)?

- A. Yes — state this explicitly; CI passing is the only gate before merge/deploy
- B. No — some other check should also apply (name it)
- X. Other (please specify)

[Answer]: A. Yes — state this explicitly; CI passing is the only gate before merge/deploy *(2026-07-27T02:48:02Z, batch 2)*

---

### Q7. (Devsecops spoke's finding) If Q1 lands on direct-to-`main` (no branches), what replaces "lint blocks the PR" for a workflow with no PR?

- A. A pre-commit hook (lint/format run locally before every commit)
- B. Push-triggered CI only (lint runs after push, no local gate)
- C. Both — pre-commit hook locally, CI as a backstop
- X. Other (please specify)

[Answer]: C. Both — pre-commit hook locally, CI as a backstop *(2026-07-27T02:48:02Z, batch 2)*

---

## Code Style

### Q8. (Developer spoke's finding) TypeScript or plain JavaScript for the Next.js codebase?

Flagged as an undecided input given the recruiter-facing audience — a public repo in TypeScript is itself a mild skill signal.

- A. TypeScript
- B. Plain JavaScript
- C. Not sure — recommend one
- X. Other (please specify)

[Answer]: A. TypeScript *(2026-07-27T02:49:56Z, batch 3)*

---

## Security (feeds Mandated/Forbidden)

### Q9. (Devsecops spoke's finding) The draft's candidate Forbidden rule was "never commit Hostinger DNS/registrar credentials." Devsecops assessed this as too narrow — same risk applies to GitHub tokens, future API keys, and secrets pasted into commit messages/issues/PRs/CI logs, not just Hostinger specifically, especially since this repo is public by design (RAID R3). Broaden it?

- A. Yes — broaden to a general secret-handling rule, with Hostinger as one example, not the whole scope
- B. No — keep it narrow to DNS/registrar credentials specifically
- X. Other (please specify)

[Answer]: A. Yes — broaden to a general secret-handling rule, with Hostinger as one example, not the whole scope *(2026-07-27T02:49:56Z, batch 3)*

---

### Q10. (Devsecops spoke's recommendation) For secret-leak prevention on this public repo: GitHub's built-in push protection plus a local pre-commit hook (gitleaks), or something lighter/heavier?

- A. Both — GitHub push protection (free, native) plus a local gitleaks pre-commit hook
- B. GitHub push protection only — skip the local hook
- C. Neither — not worth the setup for this project
- X. Other (please specify)

[Answer]: A. Both — GitHub push protection (free, native) plus a local gitleaks pre-commit hook *(2026-07-27T02:49:56Z, batch 3)*

---

### Q11. (Devsecops spoke's recommendation) Dependency updates: Dependabot with auto-merge for patch-level updates, or manual review of every dependency PR?

- A. Dependabot with auto-merge for patch updates, manual review for minor/major
- B. Manual review of every dependency update, no auto-merge
- C. Not sure — recommend one
- X. Other (please specify)

[Answer]: B. Manual review of every dependency update, no auto-merge *(2026-07-27T02:49:56Z, batch 3)*

---

## Assumptions & Open Questions

None yet — this file collects answers before any assumption is recorded.
