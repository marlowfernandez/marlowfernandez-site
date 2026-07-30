# Discovered Rules — marlowfernandez.com (FINAL)

**Intent:** `260726-resume-site` · **Stage:** practices-discovery · **Phase:** Inception
**Status: FINAL.** Populated only from what the human actually affirmed at
the practices-discovery interview (`practices-discovery-questions.md`,
Q6, Q7, Q9, Q10, Q11) — nothing here was invented beyond a confirmed answer.

## Mandated

- **ALWAYS** treat CI passing (build succeeds, links resolve,
  accessibility/performance budgets pass, theme-toggle check, content-schema
  validation) as the only gate before merge to `main` and the deploy that
  follows it. There is no second human reviewer on this project; CI is
  explicitly the sole automated check standing between a broken build and a
  live production deploy (Q6).
- **ALWAYS** run a local pre-commit hook (lint/format) before every commit,
  with CI as a backstop after push — since Way of Working (Q1) resolved to
  direct commits to `main` with no PR to gate (Q7).
- **ALWAYS** run a local pre-commit `gitleaks` hook before every commit, in
  addition to GitHub's built-in push protection — two independent layers,
  since this repository is public by design and there is no second reviewer
  to catch a leaked credential before it is exposed (Q10).
- **ALWAYS** manually review every dependency update PR (Dependabot or
  otherwise) before merging it — no auto-merge, for any update tier
  (patch, minor, or major) (Q11).

## Forbidden

- **NEVER** commit, paste, or log any credential, API key, token, or secret —
  including but not limited to Hostinger DNS/registrar login credentials — in
  this public repository's code, commit messages, issues, pull requests, or
  CI logs. Hostinger is one illustrative example, not the rule's full scope;
  the same prohibition covers GitHub personal access tokens/deploy keys, any
  API key added later, and any future analytics/CI service credential (Q9).
- **NEVER** auto-merge a dependency update of any kind — every dependency PR
  gets manual human review before merge, with no exception carved out for
  patch-level updates (Q11). This is the more conservative of the two options
  presented at the interview and was chosen explicitly, overriding the
  devsecops peer review's auto-merge-patches recommendation (see
  `evidence.md`).

## Note: one existing hard constraint, tracked elsewhere, not duplicated here

`scope-document.md`'s "Vynkor Treatment — Explicit Constraint" section
already records a human-confirmed hard constraint from Q2 at
scope-definition: Vynkor must be mentioned only "very brief and small,
without details, as vague as possible," carried forward verbatim to
Requirements Analysis (2.3) and Application Design (2.6). That is a
**content** constraint on the site's copy, not a **process/practices**
constraint on how the team builds software — it is referenced here only so
this stage's downstream readers don't mistake its absence from Mandated/
Forbidden above for an oversight.
