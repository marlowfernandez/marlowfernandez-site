# Deployment Log — marlowfernandez.com

**Intent:** `260726-resume-site` · **Stage:** deployment-execution (4.3, final stage)
**Consumes:** [cd-config.md](../deployment-pipeline/cd-config.md), [deployment-strategy.md](../deployment-pipeline/deployment-strategy.md), [build-test-results.md](../../construction/build-and-test/build-test-results.md)

Chronological record of the actual cutover. Every entry is an executed action with an observed result, not a plan.

## Timeline

### 1. Local gate activated — 2026-08-04

`git config core.hooksPath .githooks`. Git does not copy hooks on clone and `core.hooksPath` is untracked repository config, so this step is per-clone and easy to miss.

### 2. `gitleaks` — a correction, not an installation

Q1 was answered "install it first." The install turned out to be unnecessary: **gitleaks 8.30.1 was already present**, installed via winget, which had not created its `Links` shim directory. The earlier ci-pipeline finding of "not installed" was drawn from a `command -v` test, which distinguishes *on PATH* from *not on PATH* — not *installed* from *not installed*.

Two defects followed from that and were fixed in `.githooks/pre-commit`:

| Defect | Consequence had it shipped |
|---|---|
| Resolution tested `PATH` only | An installed scanner reported as absent; user sent to reinstall software they had |
| Called `gitleaks protect --staged` | **`protect` does not exist in 8.30.1** (commands are `git`, `dir`, `stdin`). The hook would have failed on first invocation |

Corrected to resolve past `PATH` (`$GITLEAKS`, then known winget/scoop/go locations) and to call `gitleaks git --staged`, which the tool's own help documents as "scan staged commits (good for pre-commit)".

### 3. First commit through the hook — `ac7dbcc`

All four checks executed and passed: gitleaks (staged), `format:check`, `lint`, `typecheck`, 110/110 tests. First real exercise of the local gate.

31 files. `.agents/`, `.codex/`, and `AGENTS.md` — 565K of AI-DLC ports for other agent runtimes — were gitignored rather than committed, consistent with the unused framework surface already removed from this project.

### 4. First push — token scope risk did not materialise

The `gh` token lacks `workflow` scope, which GitHub requires to create `.github/workflows/` files. Git here authenticates through Git Credential Manager, whose grant does carry it. Push accepted.

### 5. First CI run — **FAILED**, and the gate held

Run [30879544480](https://github.com/marlowfernandez/marlowfernandez-site/actions/runs/30879544480). Format, lint, typecheck, tests, build, and audit all passed. **Check links failed**, exit 2 in 171 ms:

```
error: invalid value 'out' for '--base <BASE>': Base must either be a full URL
(with scheme) or an absolute local path. If you want to resolve root-relative
links in local files, also see `--root-dir`.
```

Two errors in one flag: `--base` rewrites relative links against a URL prefix, while `--root-dir` maps a leading `/` onto a directory — and the path must be absolute rather than repo-relative.

**The gate behaved exactly as designed.** `deploy` declares `needs: verify`; it never started, and nothing reached the domain. This is the first evidence that the deploy gate works under real failure rather than in principle.

Worth recording precisely: the local pre-flight check written at ci-pipeline verified that all 9 internal links resolve and that the only 2 external URLs were covered by `.lycheeignore`. That was true, and it could not have caught this. **Verifying a property is not the same as verifying the tool that checks it.** Only running the real tool found a wrong flag name.

### 6. Fix and second run — **GREEN, deployed** — `5f59551`

Run [30879714924](https://github.com/marlowfernandez/marlowfernandez-site/actions/runs/30879714924).

| Step | Result |
|---|---|
| Format / Lint / Typecheck / Test | ✅ 110/110 |
| Build (static export) | ✅ |
| Dependency audit | ⚠️ exit 1, `continue-on-error` — the 3 unfixable advisories inside `next@16.2.12`, behaving as designed |
| Check links | ✅ |
| Lighthouse budgets | ✅ all four thresholds |
| Upload artifacts | ✅ |
| **Deploy to GitHub Pages** | ✅ 9s |

Deployment record confirmed: environment `github-pages`, sha `5f59551`.

**Lighthouse passed on GitHub's Ubuntu runners**, not only on the local Windows machine — closing the open question from `quality-gates.md` about whether the +5 to +10 margins would absorb the platform difference.

### 7. Serving state at time of writing

| Check | Result |
|---|---|
| `GET https://marlowfernandez.github.io/` | 404 — expected; with a custom domain configured, Pages serves only that domain |
| `GET http://marlowfernandez.com/` | 200, **but this is Hostinger's parking page** |
| `dig marlowfernandez.com` | `2.57.91.91` — Hostinger, not GitHub |
| `dig marlow.software` | `2.57.91.91` — same parking IP, no 301 |

**The artifact is published and unreachable.** Both domains still resolve to the registrar's parking page. This is the exact condition [cd-config.md](../deployment-pipeline/cd-config.md) predicted: Hostinger's default apex record is live and must be *removed*, not merely supplemented.

## Remaining — registrar actions only

Not blocked on anything in this repository. Records and ordering in [cd-config.md](../deployment-pipeline/cd-config.md); verification will be recorded in [smoke-test-results.md](smoke-test-results.md) and [health-check-report.md](health-check-report.md).

1. Delete Hostinger's default apex `A` record (`2.57.91.91`)
2. Add four `A` and four `AAAA` records on `@`
3. Add `CNAME` on `www` → `marlowfernandez.github.io`
4. Wait for propagation; confirm with `dig`
5. **Only then** enable Enforce HTTPS — RAID D1
6. Configure the `marlow.software` 301 forward

## Assumptions & Open Questions

- **The site has never been served to a browser.** Publication is confirmed by GitHub's deployment record; content has not been rendered from the live domain by anyone.
- **`https_enforced: false`** — correct at this point; enabling it before DNS resolves fails Let's Encrypt provisioning.
- **Nobody has visually reviewed the rendered page.** Carried unchanged from `build-and-test-summary.md` item 7 and still open at the final stage.
