# Stage Memory — ci-pipeline

Observation diary for the ci-pipeline stage. Maintained by the orchestrator per
the stage file's **Learn** section.

## Interpretations

- 2026-08-03T02:51:50Z — Stage file's Step 3 lists four default questions (CI tool, branch strategy, quality gates, artifact repositories); three were already settled by confirmed upstream decisions (GitHub Actions per Feasibility Q3, direct-to-`main` per Practices Discovery Q1, no artifact registry since Pages serves the export directly). Asked only what was genuinely open, per the `approval-handoff:c1` correction that a stage's depth target is a ceiling to justify against, not a floor to fill.
- 2026-08-03T03:40:00Z — Read `team.md`'s "CI is the sole gate before deploy" as describing intent rather than a literal merge gate, because the direct-commit practice leaves no merge to gate. Resolved at Q1 rather than silently implementing either reading.
- 2026-08-04T00:10:00Z — Wrote the Lighthouse assertion pattern `.*/index\.html$` from the expected shape of the output rather than its actual contents. Enumerating the real export showed four HTML files, three named `index.html`, so the pattern gated exactly the error pages it was written to exclude. Caught only by listing the built files and testing the regex against the real URL set; it would otherwise have surfaced as a confusing CI failure on a correct build.

## Deviations

- 2026-08-03T03:05:00Z — Logged only Q1 to the audit trail. `aidlc-log.ts answer` enforces one answer event per human turn, and five answers were collected in one exchange. The durable record is `ci-pipeline-questions.md`; the correct move was one comprehensive `--details` payload covering all five, not five calls.
- 2026-08-03T23:30:00Z — Pre-commit hook runs typecheck and the full test suite, exceeding the "lint/format" minimum `project.md` mandates. Deliberate: the suite runs in ~3s, and Q1's stated intent was a real local gate rather than a ceremonial one.
- 2026-08-03T23:45:00Z — Lighthouse runs as a pinned GitHub Action rather than the `@lhci/cli` devDependency `performance-test-instructions.md` specified. That document owns the numbers; the delivery mechanism changed because the devDependency measurably harmed a security signal (see Tradeoffs).

## Tradeoffs

- 2026-08-03T23:40:00Z — `@lhci/cli` as devDependency vs. pinned action. Installing it took `npm audit` from 3 advisories to 8, adding five findings inside a tool that only ever runs in CI. Chose the action: `npm run lhci` still reproduces the identical budget locally via pinned npx, and the audit signal stays readable. A permanently noisy audit is one nobody reads, which costs more the day a real advisory appears.
- 2026-08-03T23:20:00Z — Pre-commit hook fails closed vs. warns-and-continues when `gitleaks` is absent. Chose fail-closed: `project.md` says ALWAYS, the repo is public, and a scanner that silently no-ops when uninstalled provides the appearance of protection without the substance. Cost: blocks the next commit until installed. `git commit --no-verify` remains git's own escape; no custom `SKIP=1` was added, because a documented bypass on a mandated control is equivalent to not mandating it.
- 2026-08-03T23:15:00Z — Hook delivery via `core.hooksPath` + committed `.githooks/` rather than husky. Zero new dependencies (relevant under a no-auto-merge dependency policy) and version-controlled. Cost: requires one manual `git config` per clone, and a fresh clone silently has no local gate until then — recorded in `project.md` rather than left to discovery.
- 2026-08-03T23:55:00Z — Lighthouse mobile vs. desktop profile. Started with `preset: desktop`, switched to LHCI's default mobile: stricter, more standard, and the site clears it at 100/100/96/100 anyway. Choosing the easier profile to protect a margin would have made the budget less meaningful.

## Open questions

- 2026-08-03T23:50:00Z — Q3 and Q4 were answered "Not sure — recommend one." Recommendations were given and not countermanded, but silence is weaker than selection. Both carried to the gate for explicit confirmation; both cheap to reverse.
- 2026-08-04T00:05:00Z — The workflow has never executed on GitHub's runners. Every step is verified locally, but Ubuntu-vs-Windows differences and the `github-pages` environment are exercised for the first time on first push. The link-check step in particular could not be run locally at all (lychee is an uninstalled Rust binary); its underlying property was verified with an equivalent script instead — 9 internal links resolve, 0 broken, and the only 2 external URLs are exactly the ones `.lycheeignore` covers.
- 2026-08-04T00:00:00Z — Missing favicon found while measuring budgets. Never decided by any stage across the whole record. Left unfixed as a visual identity decision; raised at the gate.
