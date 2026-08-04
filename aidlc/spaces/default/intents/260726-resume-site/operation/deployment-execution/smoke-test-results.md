# Smoke Test Results — marlowfernandez.com

**Intent:** `260726-resume-site` · **Stage:** deployment-execution (4.3)
**Consumes:** [cd-config.md](../deployment-pipeline/cd-config.md), [deployment-strategy.md](../deployment-pipeline/deployment-strategy.md), [build-test-results.md](../../construction/build-and-test/build-test-results.md)
**Executed:** 2026-08-04, against the live production domains after the DNS cutover
**Deployed commit:** `5f59551`

Every row below is an executed command with an observed result. Nothing here is inferred from configuration.

## DNS Resolution

| Check | Expected | Observed | |
|---|---|---|---|
| `marlowfernandez.com` A | GitHub Pages anycast | `185.199.110.153` | ✅ |
| `marlowfernandez.com` AAAA | GitHub Pages IPv6 | `2606:50c0:8002::153` | ✅ |
| `www.marlowfernandez.com` | CNAME to Pages default | `marlowfernandez.github.io` | ✅ |

Queried against `8.8.8.8` rather than the local resolver, so the result reflects public DNS and not a cached local answer. The resolver returned one address from each rotation set, which is normal anycast behaviour.

**The parking-page record is gone.** Both domains previously resolved to `2.57.91.91`; the Hostinger default apex record was removed rather than merely supplemented, which was the specific failure mode [cd-config.md](../deployment-pipeline/cd-config.md) warned would cause the apex to round-robin between the real site and a parking page.

## HTTP and Redirect Behaviour

| Request | Expected | Observed | |
|---|---|---|---|
| `https://marlowfernandez.com/` | 200, served by GitHub | `200 OK`, `Server: GitHub.com`, 48,246 bytes | ✅ |
| `http://marlowfernandez.com/` | 301 to HTTPS | `301` → `https://marlowfernandez.com/` | ✅ |
| `https://www.marlowfernandez.com/` | 301 to apex | `301` → `https://marlowfernandez.com/` | ✅ |
| `https://marlow.software/` | 301 to canonical | `301` → `https://marlowfernandez.com` → `200` | ✅ |
| `https://marlowfernandez.com/no-such-page/` | 404 | `404 Not Found` | ✅ |

**The canonical topology holds from every entry point.** Four distinct approaches — apex over HTTP, apex over HTTPS, `www`, and the second domain — all terminate at `https://marlowfernandez.com/`. This closes the requirement carried since Intent Capture that `marlow.software` redirect to the canonical domain, and confirms Feasibility Q7's registrar-level 301 approach worked as designed.

The HTTP→HTTPS 301 also confirms **Enforce HTTPS is enabled**, sequenced correctly after DNS resolved (RAID D1).

## TLS

```
issuer  = C=US, O=Let's Encrypt, CN=YR1
subject = CN=marlowfernandez.com
notBefore = Aug  4 04:18:41 2026 GMT
notAfter  = Nov  2 04:18:40 2026 GMT
```

Automatic Let's Encrypt provisioning succeeded — the outcome RAID D1 existed to protect. Certificate renewal is GitHub's responsibility and requires no action here.

## Content — It Is the Right Site

A `200 OK` proves something is served, not that it is the intended site. Asserted against the live HTML:

| Expected content | Present |
|---|---|
| `Marlow Fernandez` | ✅ |
| `AI Engineer` | ✅ |
| `Experience` | ✅ |
| `Education` | ✅ |
| `Vynkor` | ✅ |
| `Point & Pay` | ✅ |

`Vynkor` appearing exactly once is consistent with the deliberately minimal treatment confirmed at Requirements Analysis — one brief line, no detail.

**`/CNAME` returns `marlowfernandez.com`**, confirming the file survived the build into the published artifact. If it is ever lost, the custom domain stops resolving and the site reverts to `marlowfernandez.github.io`.

## Favicon — the ci-pipeline finding, closed

`https://marlowfernandez.com/icon.svg` → `200 OK`, and the page emits:

```html
<link rel="icon" href="/icon.svg?icon.06769-ejcnd1i.svg" sizes="any" type="image/svg+xml"/>
```

The `/favicon.ico` 404 found while measuring budgets at ci-pipeline is resolved. Its effect on the score is confirmed below.

## CSP

The `<meta http-equiv="Content-Security-Policy">` tag survived into the live document, beginning `default-src 'self'; script-src 'self' 'unsafe-inline'…`, matching what `security-test-instructions.md` documents. The `'unsafe-inline'` requirements remain hosting-platform limits rather than defects — GitHub Pages permits no custom response headers, so `frame-ancestors` and HSTS stay unavailable.

## Assumptions & Open Questions

- **Checked from one network location.** DNS propagation is global and eventual; these results reflect one vantage point at one time.
- **The 404 page was verified to return status 404**, not visually reviewed.
- **No browser has rendered this page for a human.** All verification is programmatic — see [health-check-report.md](health-check-report.md).
