# Code Generation — Questions

**Stage:** code-generation · **Phase:** Construction · **Unit:** `content-sections`
**Record:** `aidlc/spaces/default/intents/260726-resume-site/`

---

## Plan Approval

The plan is at [code-generation-plan.md](code-generation-plan.md) — 5 steps: real content files, the four section components, page wiring plus placeholder removal, tests, and README update.

This is the unit that publishes the real, confirmed-public content: employer name, the $50M figure, Navy/DHS clients, Secret Clearance, and phone number — all decided at Requirements Analysis and knowingly reconfirmed at its Q9.

Two constraints are enforced by careful authoring rather than any automated check, and are called out in the plan: the Vynkor line staying very brief and vague, and no content beyond what `requirements.md` confirms.

- Approve Plan — proceed to code generation
- Request Changes — revise the plan

[Answer]: Approve Plan *(2026-08-02)*

---

---

## Q1. (Follow-up, reviewer-triggered) Defense-detail granularity

The shipped HII block publishes materially more specific detail than the granularity `requirements.md` Q4/Q5 actually asked about. Those questions confirmed *"Navy/DHS clients + Secret Clearance, published as-is"* and *"full detail for all roles."* The rendered bullets additionally name:

- **SCTTR** and **TTGP** — specific naval training facilities where on-site operator training was run
- Spring Security ACL **"protecting classified entities"** in a classified environment
- **Trust-CA certificate infrastructure** for a classified Postgres deployment
- Cisco VoIP integration **"enabling secure communications for naval operations"**

This detail is on the circulated resume, but the site is permanently public and indexed — the same distinction raised at `requirements.md` Q9, now applying one level deeper than that question covered.

- A. Publish as-is — comfortable at this granularity too
- B. Drop the facility names (SCTTR/TTGP) only
- C. Generalize the classified-environment specifics as well
- X. Other (please specify)

[Answer]: A. Publish as-is — confirmed knowingly at this specific granularity, after the permanent-indexed-public distinction was restated *(2026-08-02)*

---

## Assumptions & Open Questions

None. Q1 above closes the one substantive question this stage escalated.
