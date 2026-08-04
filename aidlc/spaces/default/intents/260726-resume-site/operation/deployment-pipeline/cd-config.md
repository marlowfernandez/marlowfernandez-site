# CD Configuration — marlowfernandez.com

**Intent:** `260726-resume-site` · **Stage:** deployment-pipeline (4.1)
**Consumes:** [ci-config.md](../../construction/ci-pipeline/ci-config.md), [quality-gates.md](../../construction/ci-pipeline/quality-gates.md)
**Produces:** `public/CNAME`; DNS record set and Pages configuration below

## Two Consumed Artifacts Do Not Exist

This stage's frontmatter declares `deployment-architecture` and `cicd-pipeline` as **required** inputs. Neither exists: both are outputs of `infrastructure-design` (3.4), which is **SKIP** for the `personal-static-site` scope — there is no infrastructure to design when the host is a CDN serving static files and `ADR-6 "No Runtime Services"` forecloses everything else.

The stage file anticipates exactly this and instructs designing "the CD path against what is actually deployed — never invent the content of a missing artifact." That is what follows. The absence is recorded rather than papered over, because a future reader finding two required inputs unreferenced should be able to tell the difference between a skipped stage and an oversight.

The CD path therefore derives from `ci-config.md` (which already contains the deploy job) and `quality-gates.md` (which defines what must pass before it runs).

## There Is No Separate CD Pipeline

The deploy job already exists, committed at ci-pipeline in `.github/workflows/ci.yml`:

```
push to main → verify → [needs: verify] → deploy → github-pages
```

This stage adds **no second workflow**. Splitting CI and CD into separate workflows would require either a `workflow_run` trigger or a repository dispatch, both of which introduce a gap between "checks passed" and "artifact deployed" during which the two can drift apart. `needs: verify` inside one workflow makes the dependency structural: the same run that verified the artifact is the run that publishes it.

What this stage adds is everything **outside** the workflow file — the domain, the DNS, and the recovery procedure.

## Domain Configuration

**Canonical host: the apex, `marlowfernandez.com`** (Q1). This matches the `metadataBase` already emitted into every page's canonical and Open Graph tags, so no code change was required.

### `public/CNAME` — created by this stage

GitHub Pages identifies the custom domain from a `CNAME` file **in the published artifact**. Because deployment goes through `actions/deploy-pages` rather than a branch, the file must be emitted by the build rather than committed to a publishing branch.

`public/CNAME` contains one line:

```
marlowfernandez.com
```

Next.js copies `public/` verbatim into `out/` during export. **Verified, not assumed:** after `npm run build`, `out/CNAME` exists and contains `marlowfernandez.com`.

> If this file is ever lost, GitHub Pages silently reverts the site to `marlowfernandez.github.io` and the custom domain stops resolving. It is one line, and it is load-bearing.

### DNS records at Hostinger

Q2 established the panel offers **A, AAAA, CNAME, TXT, MX — and no ALIAS or ANAME.** With the apex as canonical, `A` records are the only available mechanism: DNS forbids a `CNAME` at a zone apex, where the mandatory SOA and NS records live.

**IPv4 — four `A` records on `@` (apex):**

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**IPv6 — four `AAAA` records on `@` (apex):**

```
2606:50c0:8000::153
2606:50c0:8001::153
2606:50c0:8002::153
2606:50c0:8003::153
```

Both sets are used together, not as alternatives. GitHub's guidance is explicit that `A` records should be kept alongside `AAAA` "due to slow adoption of IPv6 globally."

**`www` subdomain — one `CNAME`:**

```
www  →  marlowfernandez.github.io
```

A `CNAME` is legal here because `www` is not the apex. GitHub Pages then redirects `www` to the apex automatically once the apex is set as the custom domain.

All record values were verified against GitHub's current published documentation at authoring time rather than written from memory.

> **Remove Hostinger's default apex record first.** Registrars commonly pre-populate an `A` record on `@` pointing at a parking page. Left in place, the apex round-robins between GitHub Pages and the parking page, producing an intermittent wrong site that looks like a caching problem and is not.

### `marlow.software` — untouched by any of the above

Confirmed at Feasibility Q7 and unchanged: a **registrar-level 301 forward** configured in Hostinger's control panel, pointing at `marlowfernandez.com`. It never enters this repository's DNS, never gets a `CNAME` file, and never touches GitHub Pages — which has no mechanism to redirect a domain it does not serve.

## Enabling GitHub Pages — a hard prerequisite, not yet done

Verified against the GitHub API rather than assumed: `has_pages: false`, and `GET /repos/marlowfernandez/marlowfernandez-site/pages` returns 404.

**`actions/deploy-pages@v5` fails when Pages is not enabled.** The workflow cannot succeed until this is set. Per Q4 the repository owner performs it in the UI:

1. Repository → **Settings** → **Pages**
2. **Source: GitHub Actions** — *not* "Deploy from a branch"
3. Custom domain: `marlowfernandez.com` (can also be set after the first successful deploy, since `CNAME` is in the artifact)
4. **Enforce HTTPS** — leave unchecked for now; see ordering below

Source selection is the step most easily got wrong. "Deploy from a branch" looks reasonable and is wrong here: the workflow publishes an uploaded artifact, and no branch ever contains the built site.

## Ordering — DNS Before HTTPS

`raid-log.md` D1 records the constraint: GitHub Pages provisions its Let's Encrypt certificate only after the domain resolves to it. Enabling **Enforce HTTPS** too early fails provisioning, and recovering means removing and re-adding the custom domain.

The safe order:

1. Enable Pages (Source: GitHub Actions)
2. Push `main` → `verify` runs → `deploy` publishes
3. Add the A/AAAA/CNAME records at Hostinger; remove any default apex record
4. **Wait for propagation** — verify with `dig marlowfernandez.com +noall +answer -t A`
5. Only once that returns the four GitHub IPs, enable **Enforce HTTPS**
6. Configure the `marlow.software` 301 forward

Steps 2 and 3 are order-independent of each other; step 5 depends on both. `deployment-execution` (4.3) owns walking this sequence and verifying the result live.

## What CD Does Not Include

- **No staging environment.** Single production environment per `team.md`; `environment-provisioning` (4.2) is SKIP.
- **No smoke test after deploy.** `org.md` requires production deployments to have a health check, and this pipeline has none — the honest statement is that `quality-gates.md`'s checks all run *pre*-deploy against the same artifact that gets published. Post-deploy verification happens once, manually, at `deployment-execution` (4.3), not on every deploy. For a static artifact that was already built and audited in the same run, the marginal value of a per-deploy smoke test is low; it is still a real gap against the guardrail and is named as one rather than argued away.
- **No feature flags, no traffic shifting, no canary.** All require a runtime.

## Assumptions & Open Questions

- **Pages is not yet enabled.** Nothing deploys until it is.
- **Neither the workflow nor the CNAME has ever executed against GitHub's infrastructure.** Both are verified locally only.
- **Hostinger's exact panel labels are unverified.** Record *types* are confirmed from the answer; the specific navigation path is not, and no screenshot was consulted.
- **Certificate provisioning time is not guaranteed.** Typically minutes after DNS resolves, occasionally up to 24 hours. Not a failure until it has been well past that.
