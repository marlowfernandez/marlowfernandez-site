# Health Check Report — marlowfernandez.com

**Intent:** `260726-resume-site` · **Stage:** deployment-execution (4.3, final stage)
**Consumes:** [cd-config.md](../deployment-pipeline/cd-config.md), [deployment-strategy.md](../deployment-pipeline/deployment-strategy.md), [build-test-results.md](../../construction/build-and-test/build-test-results.md)
**Assessed:** 2026-08-04 · **Live commit:** `5f59551`

## Verdict

**Healthy and live.** `https://marlowfernandez.com` serves the intended site over a valid certificate, every redirect path terminates at the canonical domain, and all four quality budgets pass **measured against the live production domain** rather than a local build.

## Budgets — Measured Live

This is the measurement `performance-requirements.md` deferred here and `build-and-test-summary.md` listed as its first Known Limitation. Lighthouse, default mobile profile (simulated slow 4G plus CPU throttling), against `https://marlowfernandez.com/`:

| Category | Threshold | Local (ci-pipeline) | **Live (here)** | |
|---|---|---|---|---|
| Performance | ≥ 90 | 100 | **99** | ✅ |
| Accessibility | ≥ 95 | 100 | **100** | ✅ |
| Best Practices | ≥ 90 | 96 | **100** | ✅ |
| SEO | ≥ 90 | 100 | **100** | ✅ |

**Zero failing Best Practices audits.** The score moved 96 → 100 because the favicon landed, confirming the diagnosis made at ci-pipeline that `/favicon.ico` was the sole deduction — a prediction now verified rather than assumed.

Performance 100 → 99 is real-network latency against a CDN instead of localhost. Ten points of margin remain.

## Requirements Traceability — End to End

| Requirement | Origin | Live status |
|---|---|---|
| Static resume site at `marlowfernandez.com` | Intent Capture | ✅ Serving |
| `marlow.software` redirects to canonical | Intent Capture | ✅ 301 verified |
| HTTPS on the canonical domain | Feasibility | ✅ Let's Encrypt, valid to Nov 2 |
| Free hosting, public repository | Feasibility Q3 | ✅ GitHub Pages, public |
| Experience / Education / AI Engineering / Contact | Requirements Analysis | ✅ All present |
| Vynkor mentioned minimally | Requirements Q2 | ✅ Exactly one line |
| Dark/light theme toggle | Rough Mockups | ✅ Shipped; 110 tests incl. no-JS cascade guard |
| Accessibility budget ≥95 | NFR Q1 | ✅ 100 live |
| Performance budget ≥90 | NFR Q1 | ✅ 99 live |
| TypeScript codebase | Practices Q8 | ✅ Strict, `tsc --noEmit` clean |

Every requirement traced from Ideation is satisfied on the live domain.

## Operational Posture

| Capability | State |
|---|---|
| Deploy trigger | Push to `main` → `verify` → `deploy` |
| Deploy gate | `needs: verify` — **proven under real failure**, not just in principle |
| Local gate | `.githooks/pre-commit` — gitleaks, format, lint, typecheck, 110 tests |
| Secret scanning | Two layers: local gitleaks 8.30.1 + GitHub push protection |
| Rollback | Dual-path decision tree — [rollback-runbook.md](../deployment-pipeline/rollback-runbook.md) |
| Certificate renewal | Automatic (GitHub/Let's Encrypt) |
| Monitoring | **None** — see below |

### The gate is proven, not assumed

The first CI run failed on the link check and `deploy` never started; the domain was untouched. `deployment-strategy.md` claimed a broken build would land in history without reaching the domain. That claim was then tested by an actual failure and held.

## Known Gaps — Carried Forward Deliberately

None of these block anything. All are decided rather than discovered.

| Gap | Status |
|---|---|
| **Manual WCAG items unverified** | Accepted by explicit decision (ci-pipeline Q2). Tab order, screen-reader announcements, landmark structure, 200% zoom, touch targets. **Lighthouse 100 is not WCAG 2.1 AA conformance** — no conformance claim is made anywhere |
| **No post-deploy smoke test in CI** | Real gap against `org.md`'s health-check guardrail. Verification happened once, here, manually. Named rather than argued away |
| **No uptime monitoring or alerting** | `observability-setup` (4.4) and `incident-response` (4.5) are SKIP — "static files on a CDN have no runtime to observe." An outage is discovered by someone visiting |
| **No real-browser no-JS check** | Accepted (ci-pipeline Q3). The Node-level cascade guard covers the bug class and is falsification-verified |
| **`aria-pressed` inaccurate without JS** | Accepted at Unit 1's gate |
| **3 high-severity advisories** | Unfixable inside `next@16.2.12`; audit reports, never auto-remediates |
| **Nobody has visually reviewed the page** | **Still open.** Carried from `build-and-test-summary.md` item 7 through every subsequent stage. Verification has been geometry, contrast, and Lighthouse — never a human looking at it |

That last row is the one worth acting on. Every automated signal is green, and no automated signal can tell you whether the typography reads well or whether Point & Pay's 15-bullet block visually overwhelms the one-line AI Engineering column. **The site is live; open it.**

## Assumptions & Open Questions

- **Measured once, from one network location.** No trend data exists and none is collected.
- **Certificate expires 2026-11-02**; renewal is automatic and unverified until it happens.
- **Registrar-level state is outside version control.** The DNS records and the `marlow.software` forward live only in Hostinger's panel — [cd-config.md](../deployment-pipeline/cd-config.md) is the only written record of what they should be.
