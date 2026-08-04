# Stage Memory — deployment-pipeline

Observation diary for the deployment-pipeline stage. Maintained by the
orchestrator per the stage file's **Learn** section.

## Interpretations

- 2026-08-04T00:30:00Z — Treated four of the stage's five default questions (blue/green vs. canary vs. rolling, dev→staging→prod promotion, production approval workflow, feature flags) as structurally inapplicable rather than merely already-answered. They presuppose a runtime, simultaneous versions, and traffic shifting; `ADR-6` and `output: 'export'` foreclose all three. Asked four genuinely open questions instead.
- 2026-08-04T00:35:00Z — Read the two missing required inputs (`deployment-architecture`, `cicd-pipeline`) as a consequence of `infrastructure-design` being SKIP, not as an error. Named both explicitly in all three artifacts so a future reader can distinguish a skipped stage from an oversight.

## Deviations

- 2026-08-04T01:10:00Z — Produced no second workflow file. The stage nominally creates "CD pipeline configuration", but the deploy job already exists inside `ci.yml` behind `needs: verify`. Splitting it out would require `workflow_run` or repository dispatch and open a window in which verification and publication can drift apart. This stage's real output is everything outside the workflow: domain, DNS, recovery.
- 2026-08-04T01:15:00Z — Recorded the absent post-deploy smoke test as a live gap against `org.md`'s health-check guardrail rather than arguing it into compliance. The mitigating reasoning is genuine (same artifact, same run, minutes earlier) but does not satisfy the words of the rule.

## Tradeoffs

- 2026-08-04T00:55:00Z — Apex vs. `www` as canonical. Apex chosen: `metadataBase` already emits it into every canonical and OG tag, so `www` would have required a code change for no user-visible gain. Cost: the apex cannot use a plain `CNAME`, making the record type dependent on what the registrar offers — which is why Q2 was load-bearing rather than cosmetic.
- 2026-08-04T01:00:00Z — A records vs. ALIAS/ANAME. Not a free choice: the reported Hostinger panel offers A, AAAA, CNAME, TXT, MX and no ALIAS/ANAME, so option B was unavailable rather than unchosen. Added AAAA alongside A per GitHub's explicit guidance to keep both.
- 2026-08-04T01:20:00Z — Rollback: one mechanism vs. two. Chose both with a decision tree. Re-running the last green deployment recovers in ~1 minute but leaves `main` describing a state the site is not in; `git revert` keeps history honest at the cost of a full CI cycle. Picking one universally would mean accepting either slow outage recovery or a standing lie in the repository.
- 2026-08-04T01:25:00Z — Opened the runbook with a triage step rather than a rollback command. Two of six failure modes (DNS, platform outage) cannot be fixed by any rollback, and reverting code in response to a DNS failure wastes time and adds a pointless commit.

## Open questions

- 2026-08-04T00:40:00Z — `has_pages: false`, verified against the API. Nothing deploys until Pages is enabled with Source: GitHub Actions. Owner is doing it in the UI (Q4); unverified at stage close.
- 2026-08-04T00:45:00Z — The `gh` token carries `gist, read:org, repo` but not `workflow`. Git here uses Git Credential Manager rather than the `gh` token, and GCM's grant normally includes `workflow`, so this is a risk to watch on the first push of `ci.yml` rather than a confirmed blocker. Flagged because the rejection message is obscure if it appears unannounced.
- 2026-08-04T01:30:00Z — Nothing in this stage has executed against real infrastructure: no deploy, no DNS change, no certificate. Every path is written from documented behaviour. `deployment-execution` (4.3) is the first contact with reality.
- 2026-08-04T01:32:00Z — Hostinger's exact panel labels and navigation are unverified; only the available record *types* are confirmed, from the user's own description.
