# Requirements — marlowfernandez.com

**Intent:** `260726-resume-site` · **Stage:** requirements-analysis · **Phase:** Inception
**Consumes:** [intent-statement.md](../../ideation/intent-capture/intent-statement.md), [scope-document.md](../../ideation/scope-definition/scope-document.md), [team-practices.md](../practices-discovery/team-practices.md)

## Intent Analysis

Per `intent-statement.md`: Marlow needs a durable, owned professional home that replaces the resume PDF and LinkedIn URL as the thing he actually sends, for an audience of recruiters and hiring managers, during an active job search. This stage translates that intent into a concrete content model, since `Marlow_Fernandez_Resume.pdf` — read directly for this stage — turned out to contain real disclosure decisions (employer name, a specific revenue figure, government/defense client names, a security clearance, personal contact details) that no prior stage had resolved.

## Functional Requirements

### Contact Section
- Email, displayed as a `mailto:` link (per `feasibility-assessment.md`'s confirmed no-form decision)
- LinkedIn profile link
- Phone number, displayed as plain text (interview Q1 — this extends, not contradicts, `scope-document.md`'s Contact section, which named the mechanism but never explicitly excluded a phone number)

### Experience Section — Full Detail, No Condensing (interview Q5)
The resume has 4 employer blocks; Q5's own phrasing ("5 roles," "2 most recent + 3 older") miscounted this — the Point & Pay block contains a title progression (Senior Software Engineer → Team Lead II) within one continuous employer entry, not two separate resume entries. Every employer block gets full bullet-point detail, not condensed, per the confirmed answer's intent (no condensing applied anywhere):

1. **Team Lead II, Software Engineer — Point & Pay** (2024–Present; previously Senior Software Engineer, April 2022–2024). Employer name published as-is (Q2). Full achievement detail published as written, including the $50M/year ACH-and-card transaction-volume figure and specific internal-system descriptions — NACHA-compliant file generation, PCI DSS audit certification, EPX payment-provider incident resolution, fraud-detection protocols, the floating-point-to-BigDecimal/Money-object financial-precision migration, CI/CD transformation (Bamboo → Jenkins → GitLab), and the AWS infrastructure management scope (Q3). The AI-governance-framework/AI-DLC-methodology achievement is included at the **same weight** as the other bullets in this role — no cross-reference to this site's own build process (Q8).
   - **Vynkor mention:** one short, clearly-separate line within this role's period — e.g. "Also builds AI-engineering side projects under Vynkor" — not folded into or blended with Point & Pay's own achievement bullets (Q6). This is the concrete placement decision for the constraint `scope-document.md` already established: very brief, vague, no details, explicitly to avoid the impression of competing with full-time work.
2. **Software Design Engineer (Secret Clearance) — HII Technical Solutions** (Nov 2019–April 2022). Published as-is, including the Secret Clearance mention and the Department of Defense/Navy client identification (Q4).
3. **Associate Software Engineer — Syzygy Integration (Department of Homeland Security Contract)** (Jan 2019–April 2019). Published as-is, including the DHS client identification (Q4).
4. **Internet Programmer & Programmer/Data Analyst — Palm Coast Data** (Jul 2016–Jan 2019). Full detail, same depth as the resume.

### Education & Certification Section
Full detail as the resume shows it: Bachelor of Science, Mobile Development, Full Sail University, 2017, GPA 3.4, Salutatorian Honors; CompTIA Security+ (July 2021) including the verification code (Q7).

### AI Engineering Section
Content and exact presentation format (tagged grid vs. prose case studies) still deferred to Application Design (2.6), per `wireframes.md`'s Q4 and `feasibility-assessment.md`'s Q2. This section draws on the resume's Technical Expertise "AI & Automation" list (prompt engineering, MCP servers, Gemini/Claude/ChatGPT/Perplexity, AI tool evaluation, AI-DLC) plus the openclaw/unsloth/model-setups content named directly in the initial project description — the latter has no resume source and will need first-person content authored outside this PDF-extraction pass.

## Non-Functional Requirements

- **Accessibility:** WCAG 2.1 AA, per `wireframes.md`'s Q5 (Rough Mockups).
- **Performance:** Specific budgets deferred to NFR Requirements (3.2); this stage only confirms that CI is the sole enforcement gate for them (`team-practices.md`, promoted from Practices Discovery interview Q6).
- **Theme toggle:** Confirmed in scope (Rough Mockups Q3); requires its own explicit check per the Practices Discovery interview Q4 (state persists, focus visible, contrast holds in both themes).
- **Language:** TypeScript, per the Practices Discovery interview Q8.

## Constraints

- No server-side surface (`feasibility-assessment.md`) — the content model above must render entirely at build time.
- $0 budget, GitHub Pages hosting, Next.js static export (`feasibility-assessment.md`).
- Direct-to-`main` workflow with a pre-commit hook plus CI backstop (`team-practices.md`, Practices Discovery Q1/Q7).
- No dependency auto-merge; manual review of every update (`discovered-rules.md`).
- No secrets of any kind (DNS, GitHub tokens, future API keys) in commits, commit messages, issues, PRs, or CI logs (`discovered-rules.md`'s broadened Forbidden rule).

## Assumptions

- The phone number, once published as plain text, is understood by Marlow to be publicly visible on a public GitHub-hosted static site — this was an explicit, informed choice (Q1), not an oversight.
- **Q2/Q3/Q4 were explicitly re-confirmed knowing the distribution difference, not merely inferred from "already shared elsewhere."** A follow-up question (Q9) directly named the distinction between a resume shared privately, one recipient at a time, during hiring, versus the same content permanently indexed and publicly visible on marlowfernandez.com — including to Point & Pay itself and to competitors. Marlow's answer to Q9 was "No change — publish as already decided," given with that distinction stated plainly, not assumed away.
- The Secret Clearance and government-client mentions (Q4) are treated as standard, expected content for this professional field, consistent with common practice for cleared personnel listing clearance status on public resumes.
- **Not independently verified, and knowingly left unverified (Q9-C declined):** whether Point & Pay has an internal policy constraining employee public disclosure of the specific transaction-volume figure and internal-system detail in this requirements set. Marlow was offered the option to check first and chose to proceed without checking.

## Out of Scope

- Blog or writing archive (`scope-document.md`, reconfirmed).
- Custom animations beyond framework defaults (`scope-document.md`, reconfirmed).
- A dedicated Vynkor section or page — Vynkor is a single line within Experience, not a section (Q6, `scope-document.md`).
- Exact AI Engineering section format and copy — deferred to Application Design (2.6).
- NFR-specific performance/accessibility budget numbers — deferred to NFR Requirements (3.2).

## Open Questions

- The openclaw/unsloth/model-setups AI engineering content named in the initial project description has no resume source and will need to be authored fresh — not extracted from `Marlow_Fernandez_Resume.pdf`. This is a content-authoring task for Application Design (2.6) or Code Generation (3.5), not a requirements gap.
- Point & Pay's own policy on employee public disclosure of the transaction-volume figure and internal-system detail remains unverified. This was explicitly surfaced to Marlow as a live option (Q9-C: "check first") rather than silently assumed, and he chose to proceed without checking. Recorded here so a later stage or a future revisit has the full picture, not as an unresolved gap in this stage's own process.

## Review

**Reviewer:** aidlc-product-lead-agent
**Verdict:** READY

**Scope of this pass:** iteration 2 — targeted re-verification of the two iteration-1 blocking findings against the source files (`requirements-analysis-questions.md`, `requirements.md`). Per the review brief, the rest of the document was not re-adversarialed; iteration 1 already covered it and found it resolved.

### Finding 1 (iteration 1, HIGH) — Experience Section claimed 5 roles, listed 4 — RESOLVED

The Functional Requirements heading no longer claims a role count that contradicts the list: it now reads "Experience Section — Full Detail, No Condensing (interview Q5)" (`requirements.md` line 17). The intro text explicitly reconciles the discrepancy rather than hiding it: "The resume has 4 employer blocks; Q5's own phrasing ('5 roles,' '2 most recent + 3 older') miscounted this — the Point & Pay block contains a title progression (Senior Software Engineer → Team Lead II) within one continuous employer entry, not two separate resume entries" (line 18). The numbered list beneath it has exactly 4 entries, matching the stated count — no more arithmetic mismatch a developer would trip over. The historical Q5 question/answer text in `requirements-analysis-questions.md` was correctly left untouched (it's an append-only record of what was actually asked and answered); the reconciliation belongs in the deliverable, not in a rewrite of history, and that's where it landed. Grepped the current document for residual "5 roles" language outside this Review section — none found.

### Finding 2 (iteration 1, HIGH) — disclosure-risk distinction surfaced only after sign-off, never asked — RESOLVED

`requirements-analysis-questions.md` now contains a real Q9 (lines 123–130), explicitly labeled "(Follow-up, raised by reviewer iteration 1 — should have been asked before the Step 10 sign-off, not after)." It states the private-resume-vs-permanent-indexed-public-site distinction plainly, naming Point & Pay itself and competitors as potential viewers, and asks directly: "Does that change Q2/Q3/Q4?" Options are A (no change), B (reduce, specify), C (check Point & Pay's policy first), X (other) — 3 lettered options plus X, compliant with the project's options-format rule. The answer is captured with its own timestamp (`2026-07-27T23:15:57Z`), distinct from and later than the original batch-3 timestamp (`23:09:01Z`) — consistent with this being a genuine follow-up interaction rather than a silently backdated fabrication: "No change — publish as already decided. Confirmed knowingly after the permanent/public/indexed distinction was explicitly raised."

`requirements.md`'s Assumptions (line 50) and Open Questions (line 65) now accurately reflect that this was actually asked and knowingly reconfirmed, not assumed: "Q2/Q3/Q4 were explicitly re-confirmed knowing the distribution difference, not merely inferred from 'already shared elsewhere.'" The Point & Pay policy-verification option (Q9-C) is correctly framed as offered-and-declined, not as an ownerless dangling task — which also directly answers iteration 1's complaint that this item "names no owner, no resolution stage, no next action": there is no next action because Marlow explicitly chose not to verify, and that choice (not an open task) is what's recorded.

This same fix incidentally addresses iteration 1's non-blocking Finding 3 (Assumptions overstating "already shared" as equivalent to "already public") — the flatter equivalence claim is no longer present in the Assumptions section.

### What's solid (carried forward from iteration 1, not re-litigated)

- Q1, Q2, Q4, Q6, Q7, Q8 citations, Vynkor constraint fidelity, team-practices/discovered-rules consistency, and required-section completeness were all found sound in iteration 1 and are unaffected by this round's edits.

**Outcome:** Both blocking findings are verified fixed against the source files, not merely asserted fixed. No new inconsistency was introduced by the edits. This stage is READY to proceed to Application Design.
