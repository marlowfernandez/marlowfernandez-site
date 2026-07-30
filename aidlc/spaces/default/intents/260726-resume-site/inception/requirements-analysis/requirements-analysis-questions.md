# Requirements Analysis — Questions

**Stage:** requirements-analysis · **Phase:** Inception
**Record:** `aidlc/spaces/default/intents/260726-resume-site/`
**Consumes:** [intent-statement.md](../../ideation/intent-capture/intent-statement.md), [scope-document.md](../../ideation/scope-definition/scope-document.md), [team-practices.md](../practices-discovery/team-practices.md)

## Context — why these questions, specifically

`Marlow_Fernandez_Resume.pdf` was read directly for this stage. It contains more than a name/role skeleton: a real current employer (Point & Pay), a specific $50M/year transaction-volume figure, a DoD Secret Clearance, named government clients (US Navy, Department of Homeland Security), a personal phone number and email, and internal-system technical detail. **None of this has been decided as public or private by any prior stage** — this is the stage that owns that decision, not a formality. Questions below are about disclosure level, not about restating what the resume already says.

---

## Q1. Contact information: the resume lists a phone number and personal email. `scope-document.md` already confirmed Contact = mailto/LinkedIn link, no form — does that mean the phone number is excluded from the site entirely?

- A. Yes — phone number excluded; only email (as a mailto: link) and LinkedIn appear
- B. Include the phone number too, displayed as text (not necessarily a tel: link)
- C. Include a different/dedicated contact email instead of the personal `marlowf@icloud.com` shown on the resume
- X. Other (please specify)

[Answer]: B. Include the phone number too, displayed as text (not necessarily a tel: link). This adds to, not contradicts, `scope-document.md`'s Contact section — that section named mailto/LinkedIn as the contact *mechanism* (no form) but never explicitly excluded a phone number *(2026-07-27T23:06:09Z, batch 1)*

---

## Q2. Current employer: the resume names "Point & Pay" directly. Publish the name, or generalize it?

- A. Publish the name as-is — it's already public on your resume/LinkedIn
- B. Generalize — "a payment processing company" or similar, no name
- C. Name it, but only for the current role; generalize past employers
- X. Other (please specify)

[Answer]: A. Publish the name as-is — it's already public on your resume/LinkedIn *(2026-07-27T23:06:09Z, batch 1)*

---

## Q3. The resume includes a specific figure ("$50 million in annual ACH and card transactions") and detailed internal-system descriptions (NACHA file generation architecture, fraud detection protocols, a floating-point-to-BigDecimal financial-precision migration). Publish these as written, or adjust the specificity?

- A. Publish as written — these are achievements, not confidential internals, and already appear on a resume you've shared
- B. Keep the achievements but drop the specific dollar figure
- C. Generalize the technical descriptions (e.g., "led a payment-precision migration" without naming BigDecimal/Money-object specifics)
- X. Other (please specify)

[Answer]: A. Publish as written — these are achievements, not confidential internals, and already appear on a resume you've shared *(2026-07-27T23:06:09Z, batch 1)*

---

## Q4. Government/defense clients: HII Technical Solutions names Navy/DoD work and a Secret Clearance; Syzygy names a DHS contract. Publish these as-is, or generalize?

- A. Publish as-is — clearance level and client branch are standard, expected resume content in this field
- B. Generalize — "a government/defense-sector client" without naming the branch or clearance level
- C. Keep the clearance mention but generalize the specific agency/branch names
- X. Other (please specify)

[Answer]: A. Publish as-is — clearance level and client branch are standard, expected resume content in this field *(2026-07-27T23:07:49Z, batch 2)*

---

## Q5. Does every one of the 5 roles get full bullet-point treatment on the site, or should older/less-relevant roles get a condensed one-liner?

The confirmed audience is recruiters/hiring managers (`intent-statement.md`) and the confirmed timeline is urgent (`scope-document.md`) — a shorter, denser page may serve that audience better than reproducing the full resume.

- A. Full detail for all 5 roles, same depth as the resume
- B. Full detail for the 2 most recent roles (Point & Pay, HII); condensed one-liners for the older 3
- C. Full detail for Point & Pay only (current role); condensed for everything else
- X. Other (please specify)

[Answer]: A. Full detail for all 5 roles, same depth as the resume *(2026-07-27T23:07:49Z, batch 2)*

---

## Q6. Vynkor does not appear anywhere in the resume PDF — there is no existing line to trim down. Given `scope-document.md`'s constraint (very brief, vague, no details, avoid appearing to compete with full-time work), where should it actually be inserted?

- A. One short added line within the current-role (Point & Pay) period, clearly separate from the employer's own bullets — e.g. "Also builds AI-engineering side projects under Vynkor"
- B. A single sentence in a general bio/about area, not tied to the employment timeline at all
- C. Not sure — recommend the placement
- X. Other (please specify)

[Answer]: A. One short added line within the current-role (Point & Pay) period, clearly separate from the employer's own bullets — e.g. "Also builds AI-engineering side projects under Vynkor" *(2026-07-27T23:07:49Z, batch 2)*

---

## Q7. Education and certification: full detail (GPA 3.4, Salutatorian, CompTIA verification code) or condensed?

- A. Full detail, as the resume shows it
- B. Condensed — degree, school, year only; drop GPA/honors/verification code
- C. Drop education/certification from the site entirely — it's on the resume/LinkedIn if someone wants it
- X. Other (please specify)

[Answer]: A. Full detail, as the resume shows it *(2026-07-27T23:09:01Z, batch 3)*

---

## Q8. The resume's single AI-DLC/AI-governance bullet ("Established an AI governance framework... implemented and demonstrated the benefits of the AI-DLC methodology") is the strongest direct evidence for the "AI Engineer" positioning named in the initial project description — and this very site is being built with AI-DLC right now. Give it more prominence than its one resume bullet, or keep it at the same weight as the rest of the Point & Pay bullets?

- A. More prominence — pull it into the AI Engineering section as a real case study, potentially naming that this site itself was built with AI-DLC
- B. Same weight — leave it as one bullet among the Point & Pay achievements, don't cross-reference the site's own build process
- C. Not sure — decide the exact framing at Application Design (2.6)
- X. Other (please specify)

[Answer]: B. Same weight — leave it as one bullet among the Point & Pay achievements, don't cross-reference the site's own build process *(2026-07-27T23:09:01Z, batch 3)*

---

## Consolidated Summary Confirmation

| # | Question | Answer |
|---|----------|--------|
| Q1 | Phone number | Include as plain text |
| Q2 | Employer name | Publish "Point & Pay" as-is |
| Q3 | Technical/financial specificity | Publish as written, including $50M figure |
| Q4 | Gov/defense clients | Publish as-is (Navy, DHS, Secret Clearance) |
| Q5 | Role depth | Full detail for all 5 roles |
| Q6 | Vynkor placement | One line within the Point & Pay period, clearly separate from employer bullets |
| Q7 | Education/certification | Full detail (GPA, Salutatorian, CompTIA verification code) |
| Q8 | AI-DLC prominence | Same weight as other bullets — no self-reference to this site's own build process |

`Does this all look correct before I generate the requirements artifact?`

- Looks correct
- Request changes

[Answer]: Looks correct

## Q9. (Follow-up, raised by reviewer iteration 1 — should have been asked before the Step 10 sign-off, not after) Your resume is currently shared privately, one recipient at a time, during a hiring process. Once published on marlowfernandez.com, the same content (Point & Pay's name, the $50M figure, internal system detail, DoD/DHS client work, Secret Clearance) becomes permanent, indexed, and visible to anyone indefinitely, including Point & Pay itself and competitors. Does that change Q2/Q3/Q4?

- A. No change — publish as already decided in Q2/Q3/Q4
- B. Reduce some of it — specify what
- C. Check Point & Pay's policy first, before finalizing
- X. Other (please specify)

[Answer]: A. No change — publish as already decided. Confirmed knowingly after the permanent/public/indexed distinction was explicitly raised *(2026-07-27T23:15:57Z)*

## Assumptions & Open Questions

None yet — this file collects answers before any assumption is recorded.
