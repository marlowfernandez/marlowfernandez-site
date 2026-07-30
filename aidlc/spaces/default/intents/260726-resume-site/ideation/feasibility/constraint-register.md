# Constraint Register — marlowfernandez.com

**Intent:** `260726-resume-site` · **Stage:** feasibility

## Technical Constraints

| Constraint | Detail | Source |
|---|---|---|
| No server runtime at deploy time | GitHub Pages serves static files only; no server-side code, no secret environment variables at runtime | Q1, Q3 |
| Next.js must run in static-export mode | `output: 'export'`; any Next.js feature requiring a server (API routes, ISR, middleware) is unavailable unless hosting changes later | Q1 |
| One custom domain per host | GitHub Pages serves exactly one custom domain (`marlowfernandez.com`) via a `CNAME` file; it cannot also serve or redirect `marlow.software` | Q3, Q7 |
| Second domain's redirect lives outside the app | `marlow.software → marlowfernandez.com` is Hostinger registrar-level forwarding, entirely outside this repo's code and outside GitHub Pages | Q7 |
| Free tier only | No paid hosting add-ons, no paid API tiers assumed for v1 | Q4 |
| No existing brand assets | Visual design starts from zero, informed only by the `kgromero.com` reference named in the initial description | Q5 |
| Fully static v1 | No contact form, no analytics backend, no dynamic server feature — a `mailto:`/LinkedIn link is the only contact mechanism | Q6 |

## Organizational Constraints

| Constraint | Detail | Source |
|---|---|---|
| Sole stakeholder | No external reviewer or sign-off body — decisions do not require a second party's approval | intent-capture, [Q5], [Q6] |
| Solo builder | No team coordination overhead; this is why `team-formation` and `delivery-planning` are skipped in this workflow's scope | intent-capture stakeholder-map |
| $0 budget ceiling | No recurring cost beyond the two domains already registered at Hostinger | Q4 |

## Regulatory Constraints

| Constraint | Detail | Source |
|---|---|---|
| No payment processing | PCI DSS is not applicable | Architect assessment; no payment feature in scope |
| No health data | HIPAA is not applicable | Architect assessment; no health-related content in scope |
| No confirmed data collection | No contact form or analytics is confirmed for v1 (Q6), so no GDPR/CCPA-triggering visitor data collection exists yet | Q6 |
| Resume content is voluntary self-disclosure | The site's core content is Marlow's own professional information, voluntarily published by its subject — not third-party PII | Architect assessment |
| Revisit if scope grows | If Requirements Analysis (2.3) later adds a contact form or analytics, this register should be revisited for the data it would then collect | Forward note |

## Assumptions & Open Questions

None. Every constraint above traces to a confirmed `[Q<n>]` answer or a stated architectural fact (GitHub Pages' one-custom-domain limit, Next.js static-export capabilities) rather than an inference.
