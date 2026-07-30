**Collaborator:** aidlc-developer-agent

## Contribution

Reviewed `team-practices.md`, `discovered-rules.md`, and `evidence.md` against
my assigned lens — naming, layer boundaries, error handling, file
organization, and code-style conventions — cross-checked against
`feasibility-assessment.md` (confirmed: Next.js static export, GitHub Pages,
Hostinger DNS, zero server-side surface) and a repo scan confirming this is
truly greenfield: no `app/`, `src/`, `package.json`, or lint/format config
exists yet anywhere in the tree. Nothing below duplicates content-policy or
deployment-topology territory the lead already covered; it stays in the
code-conventions lane.

**Code Style section — agree with the "defer to linter" default, but the
draft understates how much is still undecided.** The draft is correct that
"defer to whatever the repo's linter config says" transfers cleanly regardless
of team size. But that default presupposes a linter config that doesn't exist
yet, and it also presupposes a language choice that hasn't been made:
`feasibility-assessment.md` confirms *Next.js static export* but is silent on
JavaScript vs. TypeScript. For a portfolio site whose confirmed primary
audience is recruiters/hiring managers screening for React-ecosystem signal
(`feasibility-assessment.md` Stack Decision), the language choice is itself a
code-style-adjacent decision worth surfacing now rather than letting it fall
through the cracks — TypeScript is the stronger signal for that audience and
should be an explicit recommendation carried to `application-design`/
`code-generation`, not silently assumed.

**File organization — a real gap, not just an "adaptation."** Neither
`team-practices.md` nor `discovered-rules.md` addresses file/folder
organization at all. That's a legitimate omission to leave to
`application-design` (which owns the content model and route structure per
the scope file), but the risk is specific to this scope: `functional-design`
is SKIP ("a content site has no business logic to model" per
`aidlc-personal-static-site.md`), and `functional-design` is normally where
data-shape conventions get pinned down. With that stage skipped, there is no
downstream stage explicitly named as the owner of "how is the resume content
modeled — TS interfaces, JSON, MDX — and where does it live relative to
routes and components." I'd want this named explicitly as
`application-design`'s responsibility in this stage's evidence trail, so it
isn't assumed to have been covered when it structurally wasn't.

**Layer boundaries — mostly moot here, correctly under-specified.** Agree
with the lead's Testing Posture framing that there's no backend/business
logic layer to bound. The one place a real "boundary" still exists in a
Next.js static-export app is presentation vs. content vs. build config
(e.g., `next.config.js`'s `output: 'export'`, `trailingSlash`, `basePath` if
one domain needs a subpath). None of the current drafts mention this, which
is fine to defer, but it should be an explicit carry-forward rather than
silently absent.

**Error handling — one concrete, easy-to-miss item for a static-export +
GitHub Pages combination.** The drafts frame "no backend, no server-side
surface" as meaning there's effectively no error-handling surface at all. For
build/deploy purposes that's true, but Next.js static export on GitHub Pages
has one well-known failure mode worth flagging now rather than discovering it
at `deployment-execution`: GitHub Pages serves a literal `404.html` for
unmatched paths, and Next's static export needs `trailingSlash: true` (or
equivalent routing config) to avoid broken deep-link/refresh behavior on
project-style static hosts. This isn't "error handling" in the traditional
try/catch sense the Construction phase guardrails describe, but it is the
site's actual failure boundary (a visitor hitting a stale or malformed URL),
and it costs nothing to name now so `application-design`/`deployment-pipeline`
don't have to rediscover it.

**Testing Posture — agree with the direction, want one concrete addition.**
Agree that a numeric line-coverage floor is the wrong fit for a
near-zero-business-logic static site, and agree `poc`/`workshop`-style
"existing checks stay green" is closer to right. One thing worth adding to
what the interview asks, in the developer lens specifically: if the resume
content ends up structured data (TS interfaces / JSON / MDX front-matter
per the file-organization point above), a lightweight schema/type check on
that content at build time is a cheap, meaningful check that has nothing to
do with a coverage percentage — it catches "someone edited the resume data
and broke the shape" before it ships. Recommend the interview ask whether
this belongs in the testing-posture answer or gets deferred to
`nfr-requirements`/`ci-pipeline`.

## Positions

- AGREE: Code Style default (defer to linter/formatter config, no
  project-size adaptation needed) — correct as far as it goes, but see the
  TypeScript-vs-JavaScript gap below; that's a decision the linter config
  can't make for itself.
- OBJECT: Code Style section reads as fully resolved ("no adaptation
  needed") when in fact the language choice (TS vs JS) is still open and
  materially affects naming/typing conventions — recommend flagging this as
  an explicit open item carried to `application-design`, not folding it
  silently into "whatever the linter says later."
- OBJECT: no draft names file/folder organization or content-model shape as
  an open item anywhere — given `functional-design` is SKIP for this scope,
  there's a real risk this falls through to `code-generation` with no
  upstream decision to implement against. Want `evidence.md` or
  `discovered-rules.md`'s "what the interview should establish" list to name
  `application-design` explicitly as the owner of file organization and
  content-model conventions.
- AGREE: Testing Posture adaptation away from a numeric coverage floor for a
  business-logic-free static site.
- OBJECT (minor, additive not blocking): Testing Posture section doesn't
  mention build-time content-schema validation as a candidate check — cheap,
  concrete, and distinct from a coverage floor. Recommend adding it as an
  interview option rather than leaving "build succeeds + links resolve + NFR
  budgets pass" as the only named checks.
- NOTE (not a dispute, a flag for the interview): recommend explicitly
  confirming GitHub Pages' static-export routing needs (`trailingSlash`,
  custom `404.html`) get named as `deployment-pipeline`'s responsibility so
  it isn't assumed covered by "no server-side surface = no failure modes."
