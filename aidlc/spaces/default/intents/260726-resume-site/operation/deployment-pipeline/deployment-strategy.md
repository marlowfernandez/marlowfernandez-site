# Deployment Strategy — marlowfernandez.com

**Intent:** `260726-resume-site` · **Stage:** deployment-pipeline (4.1)
**Consumes:** [ci-config.md](../../construction/ci-pipeline/ci-config.md), [quality-gates.md](../../construction/ci-pipeline/quality-gates.md). `deployment-architecture.md` and `cicd-pipeline.md` are declared required inputs but do not exist — `infrastructure-design` (3.4) is SKIP for this scope; see [cd-config.md](cd-config.md) for why, and what was used instead.

## The Strategy Is Atomic Artifact Replacement

Not chosen from a menu — it is the only strategy this stack permits.

Blue/green, canary, and rolling deployment all require **two versions running simultaneously** and a traffic-splitting layer to shift load between them. This site has no runtime, no load balancer, no instances, and no traffic to shift. `ADR-6 "No Runtime Services"` and `output: 'export'` in `next.config.mjs` make that structural rather than a current limitation.

What actually happens on deploy: `actions/deploy-pages` hands a tarball to GitHub's CDN, which begins serving the new files. There is no intermediate state where half the site is old and half is new for a given request.

| Property | Reality |
|---|---|
| Deployment unit | One static artifact (`out/`), roughly 3 HTML pages plus assets |
| Cutover | CDN-level; effectively instant |
| Downtime | None — the previous artifact serves until the new one is live |
| Partial-failure state | None per request; CDN edge propagation may briefly serve old content at some edges |
| Traffic shifting | Not available, not applicable |

The one honest caveat: **CDN propagation is not globally instantaneous.** For a few seconds to a couple of minutes, different edges may serve different versions. For a resume site this is invisible. It is worth knowing before anyone concludes a deploy "didn't work" thirty seconds in.

## Trigger and Gate

From `ci-config.md`, unchanged by this stage:

```
push to main → verify → [needs: verify] → deploy
```

`quality-gates.md` defines what `verify` must pass: format, lint, typecheck, 110 tests, build, link resolution, and the four Lighthouse budgets (measured at 100 / 100 / 96 / 100).

**A failing check does not stop the commit — it stops the deploy.** With direct commits to `main` and no branch protection, nothing can prevent a commit from landing. The live site is what CI actually protects. This was decided at ci-pipeline Q1 and the mandate in `project.md` was amended at Q1a to say so plainly.

There is no manual approval step before production. `org.md` suggests production deploys gate on tech-lead plus product-owner sign-off; this project has one person in both roles and no second reviewer, so a self-approval step would be pure ceremony. `team.md` records deploy-on-merge as the affirmed practice.

## Environments

One. `marlowfernandez.com`, production.

`environment-provisioning` (4.2) is SKIP with the rationale "one production environment; previews are host-provided." There is no dev or staging tier to promote through, so there is no promotion matrix — the local dev server (`npm run dev`) and a local `npx serve out` against the real export are the pre-production surfaces, and neither is a deployed environment.

`marlow.software` is not a second environment. It is a registrar-level 301 to the canonical host and serves no content of its own.

## Failure Modes and Their Blast Radius

| Failure | Effect on the live site |
|---|---|
| Any `verify` gate fails | **None.** Deploy never starts; previous artifact keeps serving |
| `deploy` job fails | **None.** Previous artifact keeps serving |
| Bad content passes all gates and deploys | Live. Requires rollback — see [rollback-runbook.md](rollback-runbook.md) |
| `public/CNAME` lost from the build | Custom domain stops resolving; site reverts to `marlowfernandez.github.io` |
| Hostinger DNS record removed or changed | Domain stops resolving to GitHub; no deploy can fix it |
| GitHub Pages outage | Site down; nothing in this repository can mitigate it |

The last two are worth stating together: **two of the six failure modes are not fixable from this repository at all.** DNS lives at Hostinger and the CDN belongs to GitHub. This is the accepted cost of a free static host, recorded as risk R2 in `raid-log.md`, and the reason the rollback runbook opens by asking whether the problem is even deployment-shaped.

## Why No Post-Deploy Smoke Test

`org.md` (Operation guardrails) requires production deployments to have a defined smoke test or health check. **This pipeline has none, and that is a real gap against the guardrail rather than an exemption.**

The mitigating facts, stated so the tradeoff is visible rather than assumed away: every gate in `quality-gates.md` runs against the *same artifact* that gets published, in the *same workflow run*, minutes earlier. A static tarball does not develop new defects between being audited and being copied to a CDN. The realistic post-deploy failure is a DNS or certificate problem — which a smoke test hitting the origin would not catch, and which `deployment-execution` (4.3) verifies directly with `curl` against both live domains.

Adding a per-deploy smoke test would be straightforward (a `curl` step after `deploy-pages`, asserting HTTP 200 and a known string). It is not included because the failure it would catch is not one this architecture produces. If the site ever gains a runtime dependency, this reasoning expires.

## Assumptions & Open Questions

- **Nothing here has run against GitHub's infrastructure.** The entire strategy is verified locally.
- **Pages must be enabled before any of this is real** — `has_pages: false` at authoring time.
- **CDN propagation timing is not contractually specified** by GitHub for the free tier.
- **The favicon task running concurrently** changes the artifact's contents but not the deployment path or any decision here.
