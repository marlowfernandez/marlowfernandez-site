# Rollback Runbook — marlowfernandez.com

**Intent:** `260726-resume-site` · **Stage:** deployment-pipeline (4.1)
**Consumes:** [ci-config.md](../../construction/ci-pipeline/ci-config.md), [quality-gates.md](../../construction/ci-pipeline/quality-gates.md); `deployment-architecture.md` and `cicd-pipeline.md` do not exist (`infrastructure-design` is SKIP — see [cd-config.md](cd-config.md))
**Companion:** [deployment-strategy.md](deployment-strategy.md)

Written to be usable by one person, alone, possibly at an inconvenient hour, without re-reading the rest of the record.

## Step 0 — Is this actually a deployment problem?

**Do not skip this.** Two of the six failure modes in `deployment-strategy.md` cannot be fixed by any rollback, and reverting code in response to them wastes time and adds a pointless commit.

```bash
curl -sI https://marlowfernandez.com | head -5
```

| What you see | What it means | Go to |
|---|---|---|
| HTTP 200, wrong or broken content | A bad artifact deployed | **Path A or B below** |
| HTTP 200, but it's `marlowfernandez.github.io` content or a 404 page | `CNAME` lost from the build | **Path C** |
| Cannot resolve host / NXDOMAIN | DNS problem at Hostinger | **Path D** — no rollback will help |
| Certificate error | TLS provisioning, not deployment | **Path D** |
| HTTP 5xx from GitHub | Platform outage | Nothing to do; check githubstatus.com |

## Path A — Re-run the last green deployment

**Use when:** the site is broken or embarrassing *right now* and speed matters more than tidiness. Outage-shaped problems.

**Recovery time:** about one minute (no rebuild — it republishes a stored artifact).

```bash
gh run list --workflow=ci.yml --branch=main --status=success --limit 5
```

Pick the last run that produced a good site, then:

```bash
gh run rerun <RUN_ID> --job deploy
```

Or in the UI: **Actions** → the run → **Re-run jobs** → *Re-run failed jobs* is wrong here; use **Re-run all jobs** on the last good run.

> **The cost, stated plainly:** `main` now describes a site that is not what is deployed. The repository is lying about production until you follow up with Path B. Set a reminder. A quiet mismatch between `main` and the live site is exactly the condition that makes the *next* incident confusing.

**Artifact retention:** `ci.yml` sets `retention-days: 7` on the build artifact. Beyond seven days there is nothing to re-run and Path A is unavailable — Path B is the only option.

## Path B — Revert the commit

**Use when:** the problem is a correctness or content bug, and consistency matters more than the extra few minutes. This is the default for anything not actively on fire.

**Recovery time:** a full CI cycle — a few minutes.

```bash
git log --oneline -10
```

```bash
git revert <BAD_SHA>
```

```bash
git push origin main
```

`verify` re-runs against the reverted tree; `deploy` republishes on success. History and deployed state stay consistent, and the revert commit records what happened and why.

**If the pre-commit hook blocks the revert**, that is the hook doing its job — the reverted tree still has to pass lint, format, typecheck, and tests. Fix what it reports. Use `git commit --no-verify` only as a deliberate, understood exception.

**If `verify` fails on the reverted tree**, the revert was incomplete — likely a partial revert of a multi-commit change. Check for follow-up commits that depend on the one you reverted.

## Path C — `CNAME` lost from the build

**Symptom:** the custom domain stops serving the site; GitHub Pages falls back to `marlowfernandez.github.io`.

**Cause:** `public/CNAME` was deleted, emptied, or stopped being copied into `out/`.

```bash
cat public/CNAME          # expect: marlowfernandez.com
npm run build
cat out/CNAME             # must match
```

If `public/CNAME` is missing, recreate it with exactly one line — `marlowfernandez.com` — commit, and push. If it exists but does not reach `out/`, the `public/` copy step broke; check `next.config.mjs` for changes.

Re-setting the custom domain in **Settings → Pages** also works, but the file is the durable fix: the settings value gets overwritten by the next deploy's artifact.

## Path D — DNS or TLS

**Nothing in this repository can fix these.** No rollback, no revert, no re-run.

**DNS not resolving** — check Hostinger:

```bash
dig marlowfernandez.com +noall +answer -t A
```

Expect the four GitHub IPs (`185.199.108.153`, `.109.153`, `.110.153`, `.111.153`). If you see something else — particularly a single unfamiliar address — a default parking-page record has likely been reintroduced. Remove it. Full record set in [cd-config.md](cd-config.md).

**Certificate error** — usually means **Enforce HTTPS** was enabled before DNS resolved to GitHub, which fails Let's Encrypt provisioning (`raid-log.md` D1). Recovery: **Settings → Pages** → remove the custom domain → confirm DNS resolves correctly → re-add the domain → wait for the certificate → only then re-enable Enforce HTTPS.

Provisioning normally takes minutes but is documented as up to 24 hours. Do not start dismantling a working configuration at the twenty-minute mark.

## What Rollback Cannot Undo

- **A leaked credential.** Reverting the commit removes it from `HEAD`, not from history, not from GitHub's servers, and not from anyone who cloned or scraped the public repository. **Rotate the credential immediately** — that is the only real remediation. `project.md` mandates two independent secret-scanning layers precisely so this path is never reached.
- **Published content someone already read.** The site is public and may be crawled or archived.
- **A GitHub Pages platform outage.**

## Post-Incident

`org.md` requires a post-incident review for P1/P2 incidents. On a single-maintainer personal site, formal severity classification is overhead — but the reflex worth keeping is: **if a gate should have caught it and didn't, that gap belongs in `project.md` as a correction, or in `quality-gates.md` as a new check.** A rollback that produces no change to the gates is an incident that will recur.

## Assumptions & Open Questions

- **This runbook has never been exercised.** No deployment has occurred; every path is written from the mechanisms' documented behaviour, not from having run them.
- **Path A depends on 7-day artifact retention** — set in `ci.yml` and easy to forget when it matters.
- **`gh` CLI is assumed available and authenticated.** It is on this machine; the UI equivalents are given for each step in case it is not.
