# Deployment Pipeline — Questions

**Stage:** deployment-pipeline (4.1) · **Phase:** Operation
**Record:** `aidlc/spaces/default/intents/260726-resume-site/`
**Consumes:** [ci-config.md](../../construction/ci-pipeline/ci-config.md), [quality-gates.md](../../construction/ci-pipeline/quality-gates.md); `deployment-architecture.md` and `cicd-pipeline.md` are declared required but **do not exist** — `infrastructure-design` (3.4) is SKIP for this composed scope. Per the stage's own instruction, the CD path is designed against what is actually deployed rather than inventing the content of a missing artifact.

## Context — most of this stage's default questions do not apply

The stage's generic question set asks about blue/green vs. canary vs. rolling deployment, dev→staging→prod promotion gates, production approval workflows, and feature-flag strategy (CloudWatch Evidently, AppConfig). Four of those five are **structurally inapplicable** here and are not asked:

- **Deployment strategy** — GitHub Pages replaces a static artifact wholesale. Blue/green, canary, and rolling all require simultaneously-running versions and traffic-shifting. There is no runtime, no load balancer, and no traffic to shift. The only available strategy is atomic artifact replacement.
- **Environment promotion** — `team.md` (Deployment) confirms a single production environment with no staging tier; `environment-provisioning` (4.2) is SKIP with the rationale "one production environment; previews are host-provided."
- **Production approval workflow** — settled at ci-pipeline Q1 and `project.md`: CI passes, then deploy fires. No second reviewer exists on this project.
- **Feature flags** — no runtime to evaluate a flag. `ADR-6 "No Runtime Services"` forecloses this entirely.

Already settled upstream and **not** re-asked:

- **`marlow.software` redirect** — Hostinger registrar-level 301 forwarding, confirmed at Feasibility Q7. Never touches this repo or GitHub Pages.
- **Host** — GitHub Pages, free tier, public repository (Feasibility Q3).

What genuinely remains is below.

---

## Q1. Canonical host: apex or `www`?

`team.md` assigns "the apex/www canonical domain" to this stage by name, and it was never decided. `feasibility-assessment.md` assumes the apex but flags the record type as unconfirmed.

The site's `metadataBase` already emits `https://marlowfernandez.com` into every page's canonical tag and Open Graph metadata, so the apex is the current de-facto answer — changing it means a code change too.

- A. **Apex** (`marlowfernandez.com`) — matches what the code already emits; shorter; `www` redirects to it
- B. **`www`** (`www.marlowfernandez.com`) — DNS-technically safer (a plain CNAME is possible; the apex needs A records or a provider-specific ALIAS/ANAME), but requires changing `metadataBase` and every emitted canonical URL
- X. Other (please specify)

[Answer]: **A — apex (`marlowfernandez.com`).**

Confirms what the code already emits, so no change to `metadataBase` or any canonical URL is needed. `public/CNAME` now contains `marlowfernandez.com` and is verified to reach `out/CNAME` in the build.

Consequence carried into Q2: an apex cannot use a plain `CNAME` record — DNS forbids CNAME at a zone apex alongside the SOA/NS records that must exist there. This is what makes Q2's answer load-bearing rather than cosmetic.

---

## Q2. What DNS record type does Hostinger offer for the apex?

Deferred here explicitly by `feasibility-assessment.md` ("the specific record type available depends on Hostinger's DNS panel — confirmed at deployment-pipeline, 4.1") and logged as assumption A2 in `raid-log.md`.

This one needs a look at the Hostinger control panel; it is not answerable from the repository.

- A. **A records** — point the apex at GitHub's four documented anycast IPs. Universally supported; the fallback that always works
- B. **ALIAS / ANAME / CNAME-flattening** — if Hostinger's panel offers one, it survives GitHub changing its IPs
- C. **Not sure** — default to A records and note the tradeoff
- X. Other (please specify)

[Answer]: **A — A records** (with AAAA added), determined from the answer rather than assumed.

Reported panel contents: *"I have a drop down for A, AAAA, CNAME, TXT, MX etc. Whatever we need."*

**No ALIAS or ANAME appears in that list**, which resolves option B as unavailable rather than merely unchosen. Combined with Q1's apex choice and the DNS rule that a `CNAME` cannot coexist with the apex's mandatory SOA/NS records, `A` records are the only mechanism this panel offers for pointing the apex at GitHub Pages.

**AAAA records are added as well.** GitHub's own guidance is explicit that when implementing IPv6 support you should keep `A` records alongside `AAAA` "due to slow adoption of IPv6 globally" — so this is both-not-either. The panel supports AAAA, so there is no reason to leave IPv6 unserved.

Record values verified against GitHub's current published documentation at authoring time rather than recalled — see [cd-config.md](cd-config.md) for the full record set.

One panel-specific caution from the same GitHub documentation: *"If your DNS provider automatically sets a default record, remove it before continuing."* Hostinger typically pre-populates an apex `A` record pointing at its own parking page; leaving it in place means the apex round-robins between GitHub and a parking page.

---

## Q3. Rollback procedure — the one genuinely open item from the stage's default set

The stage requires a rollback runbook. Nothing upstream decided how rollback works, and `org.md` (Operation phase guardrails) requires every deployment procedure to document reversal steps.

Three mechanisms are actually available on this stack:

- A. **Re-run the last green deployment** from the Actions run history — fastest path back to a known-good artifact; leaves the bad commit in history to be fixed forward
- B. **`git revert` + push** — the offending commit is reverted, CI re-runs, and the site rebuilds from corrected source. Slower (a full CI cycle), but history and deployed state stay consistent
- C. **Both, with A for outages and B for correctness bugs** — documented as a decision tree in the runbook
- X. Other (please specify)

[Answer]: **C — both, as a decision tree.**

The two mechanisms fail differently, which is why carrying both is worth the extra runbook page: re-running the last green deployment restores service in roughly a minute but leaves `main` describing a state the site is not in, while `git revert` keeps history and deployed state consistent at the cost of a full CI cycle. Choosing one universally would mean accepting either a slow outage recovery or a permanent lie in the repository. See [rollback-runbook.md](rollback-runbook.md).

---

## Q4. GitHub Pages is not enabled on the repository. Who turns it on?

Verified against the GitHub API rather than assumed: `has_pages: false`, and `GET /repos/.../pages` returns 404. The repository is public, so the free Pages tier is available.

**This is a hard prerequisite.** `actions/deploy-pages@v5` fails if Pages is not enabled with **Source: GitHub Actions**. The workflow committed at ci-pipeline cannot succeed until this is set.

Enabling it is a repository settings change, so it needs explicit permission rather than being done silently.

- A. **I enable it via the API** — `gh api -X POST .../pages` with `build_type: workflow`. One command, no UI navigation
- B. **You do it in the UI** — Settings → Pages → Source: GitHub Actions
- X. Other (please specify)

[Answer]: **B — done in the UI by the repository owner.**

No API call is made by this stage. Repository settings stay under direct human control, which is the more conservative reading and consistent with this project's posture elsewhere (no auto-merge of dependency updates, no bypass escape on the secret-scanning hook).

Exact steps and the ordering constraint relative to DNS are in [cd-config.md](cd-config.md). The one detail that matters: **Source must be set to "GitHub Actions", not "Deploy from a branch"** — the committed workflow publishes an artifact via `actions/deploy-pages`, and the branch-based source would look for files that are never committed.

---

## Assumptions & Open Questions

- **Token scope risk, unconfirmed.** The `gh` CLI token carries `gist, read:org, repo` but **not `workflow`**. GitHub rejects pushes that create or modify `.github/workflows/` files when the credential lacks that scope. Git here uses Git Credential Manager rather than the `gh` token, and GCM's GitHub grant normally does include `workflow` — so this is a risk to watch on the first push of `ci.yml`, not a confirmed blocker. Stated because the failure message ("refusing to allow an OAuth App to create or update workflow") is obscure if it appears unannounced.
- **A CNAME file does not yet exist.** GitHub Pages requires one in the published artifact to serve a custom domain. Since deployment is via Actions rather than a branch, it must be emitted into `out/` by the build — this stage's work, contingent on Q1.
- **Sequencing constraint (`raid-log.md` D1).** DNS must resolve to GitHub Pages *before* "Enforce HTTPS" is enabled, or Let's Encrypt certificate provisioning fails. Applies at `deployment-execution` (4.3).
- **A favicon task is running concurrently** in a separate session and will modify `src/`. It changes the build output but not the deployment path; no conflict with this stage's artifacts is expected.
