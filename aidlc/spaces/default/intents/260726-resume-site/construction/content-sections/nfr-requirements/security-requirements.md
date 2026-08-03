# Security Requirements — content-sections

**Intent:** `260726-resume-site` · **Stage:** nfr-requirements · **Unit:** `content-sections`
**Consumes:** [requirements.md](../../../inception/requirements-analysis/requirements.md)

`business-logic-model.md` and `business-rules.md` are absent by design (`functional-design` is SKIP). Security context derives from `requirements.md` and `discovered-rules.md` per this stage's Step 2 fallback.

## Inherited Platform Posture

Transport security, CSP delivery, and the supply-chain/secrets rules are site-wide and were established during this stage's `site-shell-walking-skeleton` pass — including the honest statement of what GitHub Pages *cannot* do (no `frame-ancestors` via meta CSP, no HSTS). See [the shell unit's security-requirements.md](../../site-shell-walking-skeleton/nfr-requirements/security-requirements.md); not restated here.

## This Unit's Actual Security Concern Is Disclosure, Not Vulnerability

This unit has no code-level attack surface — it renders build-time text with no input handling, no auth, no data store. Its security-relevant responsibility is entirely about **what the content says**, and that is a genuinely consequential responsibility for this particular site:

`requirements.md` confirms this unit publishes:
- A named current employer (Point & Pay)
- A specific figure — $50M/year in ACH and card transactions
- Named government/defense clients (US Navy via HII, DHS via Syzygy)
- A DoD Secret Clearance
- A personal phone number, as plain text
- Internal-system detail: NACHA file generation, fraud-detection protocols, a floating-point-to-BigDecimal financial-precision migration, PCI DSS audit specifics

**This is a confirmed, knowingly-made decision, not an exposure to remediate.** It was reconfirmed at `requirements.md` Q9 *after* the distinction was explicitly raised between a resume circulated privately during hiring and permanently indexed public web content visible to Point & Pay and competitors. Recorded here so a future security review reads it correctly rather than filing it as a leak.

## Content Constraints This Unit Must Honor

Two constraints on this unit's content are enforced by careful authoring, not by any automated check — no CI rule can catch a violation of either:

1. **The Vynkor line** must stay "very brief and small, without details, as vague as possible" (`scope-document.md`, carried verbatim through `requirements.md`). The reason is reputational, not technical: avoiding the impression that a side project competes with full-time employment. A well-meaning content edit that expands it would violate a real constraint invisibly.
2. **No content beyond what `requirements.md` confirms.** Code Generation must treat `requirements.md` as the authoritative content source and not paraphrase, embellish, or re-derive from the resume PDF — the disclosure decisions were made per-item, and re-deriving risks reintroducing something that was deliberately shaped.

## Residual, Carried Forward

Point & Pay's own policy on employee public disclosure of these figures and system details remains unverified — surfaced at `requirements.md` Q9-C as a live option and knowingly declined. Restated here because this is the unit that actually publishes that content.

## Assumptions & Open Questions

None beyond the carried-forward residual above.
