# Core User Flow — marlowfernandez.com

**Intent:** `260726-resume-site` · **Stage:** rough-mockups
**Consumes:** [intent-statement.md](../intent-capture/intent-statement.md), [scope-document.md](../scope-definition/scope-document.md)

## Happy Path

The primary visitor is a recruiter or hiring manager screening for role fit (`intent-statement.md`'s Target Customer), and success is the site replacing the PDF/LinkedIn URL as the thing that gets sent (`intent-statement.md`'s Success Metrics). The flow is intentionally short — a single-page site with no navigation depth to get lost in.

```
┌──────────────┐     ┌───────────────┐     ┌────────────────┐     ┌──────────────┐
│ Arrives via   │ ──▶ │ Scans hero:    │ ──▶ │ Scans Experience│ ──▶ │ Scans AI      │
│ link sent by  │     │ name, current  │     │ + role fit       │     │ Engineering   │
│ Marlow, or a  │     │ role, contact  │     │ (screening       │     │ section       │
│ search result │     │ visible above  │     │ signal)          │     │ (differentiator│
│               │     │ the fold       │     │                  │     │  vs. a plain   │
│               │     │                │     │                  │     │  resume)       │
└──────────────┘     └───────────────┘     └────────────────┘     └──────┬───────┘
                                                                          │
                                                                          ▼
                                                                  ┌────────────────┐
                                                                  │ Decides to      │
                                                                  │ reach out via   │
                                                                  │ mailto/LinkedIn │
                                                                  └────────────────┘
```

## Entry Points

1. **Direct link** — Marlow sends `marlowfernandez.com` in place of a PDF/LinkedIn URL, per the confirmed Success Metric. This is the dominant expected entry point.
2. **`marlow.software`** — redirects immediately to the canonical domain at the registrar level (`feasibility-assessment.md`'s confirmed DNS approach); the visitor never sees a second site, only a brief redirect.
3. **Search** — someone searching "Marlow Fernandez" finds the site directly; secondary per `intent-statement.md`, not optimized against a specific metric this stage.

## Key Decision Point

The AI Engineering section is the flow's differentiator, not an afterthought — it separates the site from a plain resume upload. The durability/ownership framing ("outlives any single employer or platform") comes from `intent-statement.md`'s **Problem Statement** section, not its Success Metrics section — the Success Metrics section instead defines success narrowly as the site replacing the PDF/LinkedIn URL as the thing sent. Neither section makes an AI-work-differentiation claim; the AI section's prominence in this flow is this stage's own design judgment, not something either upstream section itself asserts. Whichever wireframe direction is chosen, this section must be reachable without requiring the visitor to first read the full Experience history.

## No Dead Ends

Every section terminates at the same two actions: read more, or contact. There is no multi-step form, no login, no page-to-page navigation to get lost in — consistent with the fully-static, no-server decision in `feasibility-assessment.md`.

## Assumptions & Open Questions

None. This flow traces directly to the confirmed Target Customer and Success Metrics in `intent-statement.md`.
