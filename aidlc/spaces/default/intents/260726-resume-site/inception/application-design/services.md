# Services — marlowfernandez.com

**Intent:** `260726-resume-site` · **Stage:** application-design
**Consumes:** [feasibility-assessment.md](../../ideation/feasibility/feasibility-assessment.md), [team-practices.md](../practices-discovery/team-practices.md)

## No Runtime Services Exist

This project has no backend service layer, no AWS component, and no API of any kind — confirmed at Feasibility (`feasibility-assessment.md`: GitHub Pages, Next.js static export, fully static) and unchanged by every subsequent stage. `aidlc-aws-platform-agent`'s standard cloud-service-mapping contribution to this stage is therefore a confirmation of non-applicability, not a forced set of AWS services this project doesn't use.

## Build-Time "Service"

The only process that resembles a service in this architecture is the **build pipeline**, which is not a runtime service but a CI-time process:

| Stage | What runs | Owner |
|---|---|---|
| Content resolution | MDX files parsed into component props | Next.js build, at `next build` time |
| Styling | Tailwind CSS compiled from utility classes + theme config | Next.js build, at `next build` time |
| Quality gate | Lint, format, theme-toggle check, content-schema validation, accessibility/performance budgets | CI (GitHub Actions), per `team-practices.md`'s confirmed "CI is the sole gate" practice |
| Deployment | Static output published to GitHub Pages | CI (GitHub Actions), per `feasibility-assessment.md` |

None of these are orchestrated at runtime — there is no choreography/orchestration pattern to design, because there is no runtime inter-service communication. This section exists to state that plainly rather than leave it unaddressed.

## Assumptions & Open Questions

None. This project's lack of runtime services is a confirmed architectural fact from Feasibility, not an assumption made at this stage.
