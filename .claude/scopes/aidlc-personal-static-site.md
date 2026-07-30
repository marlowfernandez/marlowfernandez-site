---
name: personal-static-site
depth: Standard
keywords: []
description: Static personal site, stack chosen at a gate, two-domain launch
skeleton: on
---

# personal-static-site scope

Standard depth for a greenfield static personal/marketing site that ships to a
canonical domain with a second domain redirecting to it. Composed for
marlowfernandez.com at ARS 43 (IAE 0.50, CSU 0.20, VE 0.60, R 0.30, UA 0.70,
method `fallback`) — a decision-entropy project, not a coupling project. The
shape follows from that: keep the stages that resolve open *decisions* and the
stages that actually ship, drop the stages that exist to tame structural
complexity a static site does not have.

## Why these stages, why skip those

CSU is LOW (greenfield, one static artifact, no services, no data layer), so
`reverse-engineering` is SKIP — there is no code to map — and `functional-design`
is SKIP, because a content site has no business logic to model. UA is HIGH, so
the front of the workflow stays deliberately intact: `intent-capture`,
`feasibility`, `scope-definition`, and `approval-handoff` all EXECUTE.
`feasibility` is the load-bearing one — it owns the stack x host x DNS options
matrix and presents it at a gate rather than resolving it silently, which is the
whole reason this scope is not `mvp`.

Design is treated as a deliverable, not decoration: both `rough-mockups`
(greenfield UI — compare directions against a reference site) and
`refined-mockups` (turn the chosen direction into an implementable spec) EXECUTE.
`user-stories` is SKIP: the personas are known and non-conflicting — every
visitor lands, scans, downloads, and contacts — so `requirements-analysis`
carries the acceptance criteria and `refined-mockups` carries the UX narrative.
`application-design` EXECUTEs to record the content model, route structure,
asset pipeline, and stack decision, and to feed `units-generation`, whose
`unit-of-work` is a hard input to `code-generation`. `delivery-planning` is SKIP
(<=3 units, one dependency chain, single builder — `units-generation` sequences
inline).

For a content-only site the NFRs *are* the acceptance criteria, so
`nfr-requirements` EXECUTEs (performance budget, accessibility target,
social/OpenGraph metadata, device matrix) while `nfr-design` is SKIP — the
implementations are stack-provided and standard. `infrastructure-design` is SKIP
by measurement, not assumption: including it was validated and *worsened* the
grid, because the stage expects a services architecture upstream. Its residual
work is reassigned — `feasibility` selects host and DNS mechanism,
`application-design` records deploy topology, and `deployment-pipeline` owns the
apex/www canonical, TLS for both domains, and the 301 redirect.

The operation phase runs only where the project actually needs it.
`deployment-pipeline` and `deployment-execution` EXECUTE — without the latter the
workflow would end with a pipeline but no live site, which fails the point of the
scope. `environment-provisioning` is SKIP (one production environment; previews
are host-provided). `observability-setup` and `incident-response` are SKIP —
static files on a CDN have no runtime to observe and no incident surface.
`performance-validation` is SKIP with a substituted closure path:
`nfr-requirements` sets the budget, `ci-pipeline` enforces it per build, and
`deployment-execution` verifies it on the live domain.

## Known advisories

Five starved-input advisories are accepted by design and were disclosed at the
composition gate: `nfr-requirements` <- `functional-design` (benign — the input is
empty because the domain has no business logic); `deployment-pipeline` <-
`infrastructure-design` x2 (mitigated as described above — this pipeline stage
must own the DNS/TLS/redirect config explicitly, since no infra-design artifact
will exist); and `deployment-execution` <- `environment-provisioning` (the host
project is named by `application-design` and `deployment-pipeline`).

## Membership

No keyword triggers — this scope ships `keywords: []` and does not participate in
inference. It resolves only via an explicit `/aidlc --scope personal-static-site`.
19 stages EXECUTE, 13 SKIP, 16 gates.
