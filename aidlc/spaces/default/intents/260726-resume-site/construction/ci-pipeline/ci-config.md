# CI Configuration — marlowfernandez.com

**Intent:** `260726-resume-site` · **Stage:** ci-pipeline (3.7, final Construction stage)
**Consumes:** [build-and-test-summary.md](../build-and-test/build-and-test-summary.md), [build-test-results.md](../build-and-test/build-test-results.md), both units' code-summary.md ([Unit 1](../site-shell-walking-skeleton/code-generation/code-summary.md), [Unit 2](../content-sections/code-generation/code-summary.md))
**Produces:** `.github/workflows/ci.yml`, `.githooks/pre-commit`, `lighthouserc.json`, `.lycheeignore`

## The Shape of the Gate, and Why It Is Not What `team.md` Assumed

`team.md` states that CI is the gate before deploy. Implementing it exposed that the written rule described a boundary this project does not have, which ci-pipeline Q1 resolved and Q1a recorded as an amendment to `project.md`.

The chain is: Way of Working (Practices Discovery Q1) resolved to **direct commits on `main`** — no branches, no pull requests. So by the time any workflow runs, **the commit already exists on `main`**. There is nothing left to block. Branch protection was offered at Q1 as the way to restore a blocking gate and was **rejected**, because requiring checks to pass before `main` accepts a push reintroduces exactly the PR-shaped ceremony the direct-commit practice was chosen to avoid.

What CI can enforce is **what the public sees**. `deploy` declares `needs: verify`; a single failing check means the deploy job never starts and the previously deployed site stays live.

> A broken build lands in history. It does not land on the domain.

That is the honest description of this pipeline's power, and it is narrower than "CI is the gate before merge" implied.

## Two Layers, Not One

The `build-test-results.md` inventory was produced by running the four checks locally — they were never CI-only. The pipeline formalises a second execution of the same set:

| | `.githooks/pre-commit` (local) | `.github/workflows/ci.yml` (remote) |
|---|---|---|
| **When** | Before a commit object exists | After push, before deploy |
| **Blocks** | The commit itself | The deploy job only |
| **Secret scan** | ✅ `gitleaks protect --staged` | GitHub push protection (server-side) |
| **format / lint / typecheck / test** | ✅ | ✅ |
| **build / links / budgets** | ✗ (too slow for every commit) | ✅ |
| **Bypassable** | `git commit --no-verify` | No |

The local layer is the one that actually prevents bad history, because it runs before the commit exists. The remote layer is the one that cannot be bypassed. Neither is redundant.

### Hook activation is a real failure mode

Git does not copy hooks on clone, and `core.hooksPath` is repository-local config, not a tracked file. A fresh clone therefore has **no local gate at all** until someone runs:

```bash
git config core.hooksPath .githooks
```

This is recorded in `project.md` under the pre-commit mandate rather than left to discovery. On a single-maintainer project the practical risk is one forgotten step on one machine — but the failure is silent, which is what makes it worth naming.

### The hook fails closed on a missing scanner

Because `project.md` mandates the scan with **ALWAYS**, and because this repository is public by design, the hook exits non-zero rather than skipping the check when it cannot find a scanner. A secret scanner that silently no-ops when missing offers the appearance of protection and none of the substance.

> **Correction (2026-08-04, deployment-execution).** This section originally stated that `gitleaks` was *not installed* on the development machine. **That was wrong.** gitleaks **8.30.1 was already installed** via winget; what the check actually established was that it was not on the shell's `PATH`, because winget had not created its `Links` shim directory. "Not on PATH" and "not installed" are different conditions that look identical to `command -v`, and reporting the second from evidence for the first sent the user to reinstall software they already had.
>
> Two concrete fixes followed, both in `.githooks/pre-commit`:
>
> 1. **Resolution now falls back** past `PATH` to a `$GITLEAKS` override and known winget/scoop/go install locations, so an installed-but-unshimmed binary is found instead of being declared absent.
> 2. **The subcommand was wrong.** The hook called `gitleaks protect --staged`; `protect` **does not exist** in 8.30.1, whose commands are `git`, `dir`, and `stdin`. The correct pre-commit form is `gitleaks git --staged`, which the tool's own help documents as "scan staged commits (good for pre-commit)". As written, the hook would have failed on its first real invocation — the scanner would have appeared broken rather than protective.

## Workflow Structure

```
push to main
  │
  ├─ verify ─────────────────────────────────────────────
  │    npm ci
  │    format:check → lint → typecheck → test → build     (cheapest first)
  │    npm audit                                           (advisory)
  │    link check (lychee, out/**/*.html)
  │    Lighthouse budgets
  │    upload build artifact + Pages artifact
  │
  └─ deploy ──────────── needs: verify ──────────────────
       actions/deploy-pages@v5 → github-pages environment
```

Steps run cheapest-first so an obvious failure reports in seconds rather than after a full build and three Lighthouse runs.

### Action versions were verified, not recalled

Every pinned version was resolved against the GitHub releases API at authoring time rather than written from memory:

| Action | Pinned |
|---|---|
| `actions/checkout` | `v7` |
| `actions/setup-node` | `v7` |
| `actions/upload-artifact` | `v7` |
| `actions/upload-pages-artifact` | `v5` |
| `actions/deploy-pages` | `v5` |
| `lycheeverse/lychee-action` | `v2.9.0` |
| `treosh/lighthouse-ci-action` | `12.6.2` |

Worth stating because several are well beyond the versions in common circulation (`checkout@v4`, `deploy-pages@v4`), and a stale pin here would have been invisible until the workflow ran.

`actions/configure-pages` is deliberately **absent**. Its only output is a base path for subpath-hosted sites; this site is served from a domain apex, so the step would do nothing.

## Permissions

`permissions: contents: read` at the workflow level, widened only inside `deploy`:

- `pages: write` — publish to the Pages site
- `id-token: write` — the OIDC token `deploy-pages` exchanges to prove build provenance

`verify` never receives write scope of any kind. This matters more than usual on a public repository, where workflow files are readable by anyone.

`concurrency: group: pages` with `cancel-in-progress: false` — queued deploys wait rather than interrupt, because cancelling a partially-applied Pages deployment can leave the site inconsistent.

## Dependency Audit Is Advisory, and Must Stay That Way

`npm audit --audit-level=high` runs with `continue-on-error: true`. This is a deliberate design constraint, not laxity:

- `security-test-instructions.md` records **3 high-severity advisories with no fix at any version**, inside `next@16.2.12`'s own dependency graph (postcss, sharp). `npm audit fix --force` proposes downgrading Next to 9.3.3.
- A blocking audit step would therefore fail **every run**, permanently, for a condition nobody can act on. A gate that is always red is a gate nobody reads — and the cost is paid the day a *real*, actionable advisory appears and is lost in the noise.
- `project.md` (Forbidden) prohibits auto-merging any dependency update at any tier, patch included. A step that could alter dependencies unattended is out of the question regardless.

### This constraint changed a tooling decision mid-stage

`@lhci/cli` was first added as a pinned devDependency. Installing it took the tree from **3 advisories to 8** (adding inquirer, tmp, uuid, external-editor) — five new findings, all inside a tool that only ever executes in CI.

It was removed and replaced with the pinned `treosh/lighthouse-ci-action`. `npm run lhci` still reproduces the identical budget locally through pinned `npx` without touching the lockfile. Verified after removal: back to exactly **3 high**, matching what `security-test-instructions.md` documents.

The reasoning generalises: a dev-only tool that never ships is still a permanent tax on the readability of the one security signal this project actually watches.

## Link Checking and Its Two Deliberate Exclusions

`team.md` names "links resolve" as a required gate. It runs against `out/**/*.html` — the built export, which is what actually ships — with exclusions in `.lycheeignore`, each carrying its reason.

**`linkedin.com`** returns HTTP 999 to any non-browser client. That is bot detection, not a broken link. Left in, it would fail every run. *Residual risk, stated rather than hidden: a typo in the LinkedIn URL would not be caught by CI.* It is the site's only external destination and is hand-verified.

> **Corrected on first CI run (2026-08-04).** The step originally passed `--base out`. lychee rejected it in 171ms with exit 2, without checking a single link: *"Base must either be a full URL (with scheme) or an absolute local path… If you want to resolve root-relative links in local files, also see `--root-dir`."* Two things were wrong — `--base` rewrites relative links against a URL prefix, whereas `--root-dir` is what maps a leading `/` onto a directory; and the path must be absolute. Now `--root-dir ${{ github.workspace }}/out`. This was found only by running it: the equivalent-property script used locally verified that the links resolve, which was true, but could not have caught a wrong flag name.

**`marlowfernandez.com` / `marlow.software`** — the site's own canonical and redirect domains, emitted into every page by `metadataBase`. Excluding these breaks a genuine **deadlock**, not an inconvenience: the check runs in `verify`, `deploy` runs only after `verify` passes, and the domain does not resolve until a deploy has succeeded. Checked, the first run would fail on a URL that cannot exist yet — and would keep failing forever, because the deploy that would make it resolve is gated behind the check itself.

Liveness of the deployed domains belongs to `deployment-execution` (4.3), which verifies both with `curl` including the 301 from the redirect domain.

## Budgets — Measured, Not Assumed

Both `build-and-test-summary.md` (Known Limitations item 1) and `build-test-results.md` flagged that Lighthouse thresholds were *confirmed but never measured*. **That gap is now closed.** Full scores and analysis are in [quality-gates.md](quality-gates.md); in short, all four budgets pass with margin on Lighthouse's default mobile profile.

## Assumptions & Open Questions

- **`gitleaks` 8.30.1 is installed and resolvable** by the hook's fallback path (corrected 2026-08-04 — the original claim that it was missing was an artifact of testing `PATH` rather than installation).
- **`core.hooksPath` must be set once per clone.** Untracked by design; a fresh clone has no local gate until it is set.
- **The workflow has never executed.** Every step is verified locally (see [quality-gates.md](quality-gates.md)), but no run has occurred on GitHub's runners — Ubuntu vs. Windows, and the `github-pages` environment, are exercised for the first time on first push. GitHub Pages must also be set to **Source: GitHub Actions** in repository settings, which `deployment-pipeline` (4.1) owns.
- **A missing favicon was found while measuring.** `/favicon.ico` 404s on every page load; it is the sole failing Best Practices audit. No design stage ever decided a favicon — a grep across `src/` and the entire record returns nothing. Out of scope here (it is a visual identity decision), raised for the gate.
