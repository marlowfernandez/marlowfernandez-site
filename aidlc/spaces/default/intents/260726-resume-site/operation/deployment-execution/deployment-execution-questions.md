# Deployment Execution — Questions

**Stage:** deployment-execution (4.3) · **Phase:** Operation · **Final stage** (`next_stage: null`)
**Record:** `aidlc/spaces/default/intents/260726-resume-site/`
**Consumes:** [cd-config.md](../deployment-pipeline/cd-config.md), [deployment-strategy.md](../deployment-pipeline/deployment-strategy.md), [build-test-results.md](../../construction/build-and-test/build-test-results.md)
**Declared-absent input:** `environment-inventory.md` — `environment-provisioning` (4.2) is SKIP for this scope ("one production environment; previews are host-provided"), so the engine reports it absent by design rather than missing.

## Verified state at stage start

Facts established by direct query, not assumption:

| Check | Result |
|---|---|
| GitHub Pages enabled | ✅ `build_type: workflow`, `cname: marlowfernandez.com`, `protected_domain_state: verified` |
| Pages build status | `null` — nothing has ever deployed |
| `https_enforced` | `false` — correct at this point (RAID D1 ordering) |
| `marlowfernandez.com` resolves to | **`2.57.91.91`** — a Hostinger parking IP, **not** GitHub Pages |
| `marlow.software` resolves to | **`2.57.91.91`** — same parking IP; no 301 configured yet |
| Local gate set | All green: format, lint, typecheck, 110/110 tests, build |
| `package-lock.json` vs `package.json` | In sync — `npm ci --dry-run` exits 0, so CI's install will not fail |
| Commits ahead of `origin/main` | 0 — everything for CI Pipeline and Deployment Pipeline is still uncommitted |

The DNS rows confirm the exact condition [cd-config.md](../deployment-pipeline/cd-config.md) warned about: Hostinger's default apex record is live and pointing at a parking page. It must be removed, not merely supplemented — leaving it alongside the GitHub records makes the apex round-robin between the real site and a parking page.

---

## Q1. The pre-commit hook will block this commit — `gitleaks` is still not installed.

`project.md` mandates the local scan with **ALWAYS**, and the hook fails closed by design (ci-pipeline Q1/Q1a). Nothing can be committed until this is resolved one way or the other.

- A. **Install `gitleaks` first** (`winget install gitleaks`), then commit normally with the full gate running
- B. **`git commit --no-verify` this once**, install afterwards — accepts one unscanned commit, relying on GitHub push protection as the only layer for it
- X. Other (please specify)

[Answer]:

---

## Q2. A concurrent session added `src/app/icon.svg`. Include it in this commit?

The favicon task is running independently and has already written `src/app/icon.svg` (a 64×64 rounded-square "MF" monogram). It is untracked and its session may still be working on it.

Committing another session's in-flight work risks capturing a half-finished state; excluding it means the first live deploy still logs the `/favicon.ico` 404 that holds Best Practices at 96.

- A. **Exclude it** — commit only this workflow's files; let the favicon session commit its own work when it finishes
- B. **Include it** — treat it as done and let the first deploy carry the favicon
- X. Other (please specify)

[Answer]:

---

## Q3. DNS at Hostinger — before or after the first successful workflow run?

The records are ready ([cd-config.md](../deployment-pipeline/cd-config.md) has all eight IPs). Only the repository owner can change them; there is no API access to the registrar from here.

Order matters only in that **Enforce HTTPS must come last**. The DNS change and the first deploy are independent of each other.

- A. **Deploy first, then DNS** — confirm the workflow is green on GitHub's runners before touching a live domain. Failure is isolated to CI and the parking page keeps serving
- B. **Both now, in parallel** — DNS propagation takes time anyway, so starting it early shortens total wall-clock to a working site
- X. Other (please specify)

[Answer]:

---

## Assumptions & Open Questions

- **The workflow has never run on GitHub's infrastructure.** Ubuntu-vs-Windows differences, the `github-pages` environment, and the lychee and Lighthouse actions are all first-contact on this push.
- **Token scope risk, still unconfirmed.** The `gh` token lacks `workflow` scope; Git Credential Manager is the actual push credential and normally carries it. If the push is rejected with "refusing to allow an OAuth App to create or update workflow", that is this, and it is fixable by re-authorizing the credential.
- **Certificate provisioning is not instant** — typically minutes after DNS resolves, documented as up to 24 hours.
