**Collaborator:** aidlc-devsecops-agent

## Contribution

Scope of this review per the stage brief: lint/format rules, SAST/DAST, secret and
dependency scanning, and supply-chain controls. I read `team-practices.md`,
`discovered-rules.md`, `evidence.md`, `feasibility-assessment.md`, and
`raid-log.md`, and confirmed the repo currently has no `package.json`, no
`.github/workflows/`, and no linter config — this is a from-scratch decision at
`ci-pipeline`/`code-generation`, not a re-affirmation of anything already running.

One fact changes the risk calculus more than anything else in the draft: RAID
R3 records that **this repository is public by design**. That is not a neutral
detail for a security review — it means (a) any secret ever pushed, even for a
single commit later force-removed, is exposed the instant it hits GitHub's
servers (forks, caches, and GitHub's own history retention make "delete and
force-push" an incomplete remedy, not a real one), and (b) there is no second
human reviewer who might catch a leaked credential in a PR diff before merge —
the solo-builder framing the lead already applies to Way of Working applies
here too, but cuts the other way: automation must substitute for the second
pair of eyes that a team would normally rely on for this specific class of
mistake.

**Lint/Format.** No objection to the lead's Code Style section — "defer to
project linter config, Prettier + ESLint" transfers cleanly regardless of team
size, and this is a security-adjacent-but-not-security-critical area for a
static site. One gap worth flagging for the interview: org.md's Code Style
section says lint failure "blocks the PR" — if the Way of Working interview
answer comes back as direct-to-`main` (the lead's draft explicitly raises this
as open), there is no PR to block. Direct-to-trunk needs either a pre-commit
hook or a push-triggered CI check understood as advisory-after-the-fact, not a
gate — the practice statement should say which, not silently inherit
PR-gate language that may not apply.

**SAST.** CodeGuru Security / SonarQube (my default toolset per persona) are
sized for a services codebase with business logic and are a poor fit here —
`application-design`'s own note (cited in the lead's draft) confirms
`functional-design` is skipped because there's no business logic to model.
Traditional SAST would mostly scan React/Next.js boilerplate and generate
noise. I recommend against standing up a dedicated SAST tool for v1. The
residual client-side risk that actually exists — XSS via any unescaped
resume-content rendering, e.g. if content is later sourced from a CMS/API
field and rendered with `dangerouslySetInnerHTML` — is better caught by
ESLint's `eslint-plugin-react`/`jsx-a11y` security-relevant rules (cheap,
already in the Code Style default) than by a separate SAST pipeline. This is a
scale-appropriate call, not a corner cut: worth stating explicitly in
`team-practices.md` so it reads as a decision rather than an omission.

**DAST.** Not applicable in the traditional sense — there is no server request
handling to fuzz (confirmed: zero server-side surface, `feasibility-assessment.md`
"Server-Side Surface"). What *is* worth doing, and is free: an external
HTTP-security-header scan (Mozilla Observatory or securityheaders.com) once the
site is live, and honest acknowledgment of a real platform limitation —
GitHub Pages does not allow custom response headers, so CSP/HSTS/
X-Frame-Options can only be partially approximated via `<meta>` tags (CSP only;
HSTS and X-Frame-Options cannot be set via meta at all). This should be
recorded as a known, accepted platform constraint at `deployment-pipeline`
(4.1), not silently discovered later.

**Secret scanning.** This is the highest-priority item in my review, directly
because of RAID R3. GitHub's secret scanning is on by default for public
repos, but push protection (which blocks the push *before* exposure, rather
than alerting after) should be explicitly confirmed enabled, not assumed. Given
assume-breach and defense-in-depth, I recommend a local pre-commit hook
(gitleaks or an equivalent) as a second, independent layer — free, zero
infrastructure, and it catches the mistake before the push that GitHub's own
scanning only catches after. This is a real gap in the lead's draft: nothing in
`team-practices.md` or `discovered-rules.md` currently proposes a mechanism,
only a Forbidden statement (addressed below).

**Dependency / supply-chain scanning.** Amazon Inspector and Snyk (my other
default tools) don't fit here either — there is no AWS account in this
project at all (confirmed: GitHub Pages + Hostinger, no cloud infra), and Snyk
would add an external-account dependency to a project whose entire premise is
$0 and minimal moving parts. The right-sized, zero-cost equivalent already
built into the hosting platform this project already uses is **GitHub
Dependabot** — alerts plus automated security-update PRs, native, free for
public repos, no new account. I recommend this as the Mandated dependency
control rather than either of my persona's cloud-flavored defaults. Supply-chain
hardening for the build pipeline itself: pin third-party GitHub Actions to a
commit SHA (not a mutable tag), scope workflow permissions to the minimum
needed (`contents: read`, `pages: write`, `id-token: write` for the deploy job
only), and commit a lockfile with `npm ci` (not `npm install`) in CI so builds
are reproducible and not silently re-resolved.

**IaC scanning.** cfn-lint/cfn-nag/Checkov are correctly N/A — there is no
CloudFormation/Terraform/IaC anywhere in this project's confirmed stack; DNS
and hosting config live in provider control panels (Hostinger, GitHub repo
settings), not in versioned infrastructure code. Agree with the lead's implicit
treatment (via `infrastructure-design` SKIP) that this control category simply
doesn't apply — no objection, just confirming the gap is real and not an
oversight.

## Assessment of the Hostinger DNS/registrar credentials Forbidden candidate

`discovered-rules.md` proposes, as a candidate for the interview: a NEVER
around committing the Hostinger DNS/registrar credentials. This is correctly
identified as a real gap, but as scoped it is **too narrow in two directions**
and should be broadened before being put to the human as a candidate:

1. **Too narrow in what it names.** "Hostinger DNS/registrar credentials"
   names one specific provider and one specific credential type. The same
   rule must equally cover: GitHub personal access tokens / deploy keys, any
   API key added later if the AI-showcase feature (RAID R1/D4, still open at
   Application Design) integrates a keyless-but-still-token-gated public API,
   and any future analytics/CI service credential. A rule scoped to one named
   vendor invites a false sense of coverage the moment a second credential
   type enters the project — which, per R1, is a live possibility, not a
   hypothetical.
2. **Too narrow in what "committing" covers.** "Never commit to the repo"
   misses the equally real exposure paths for a *public* repo: pasting a
   credential into a commit message, an issue, a PR description, or a GitHub
   Actions workflow log (all of which are also public and also permanent).
   The rule should say "commit, paste into an issue/PR/commit message, or log
   in CI output" — not just "commit."

I recommend the interview candidate be rephrased broader, roughly: "NEVER
commit, paste, or log any credential, API key, token, or secret — including
but not limited to Hostinger DNS/registrar login credentials — anywhere in
this public repository (code, commit messages, issues, PRs, or CI logs)," with
a companion Mandated rule: "ALWAYS use GitHub Actions encrypted secrets for
any credential CI/CD requires; ALWAYS treat any exposed secret as compromised
and rotate it immediately, since exposure in this public repository is
effectively irreversible." The narrower, vendor-named version currently
drafted is a fine example clause but should not be the rule's full scope.

## Positions

- AGREE: Code Style section (defer to project linter/formatter config) —
  transfers cleanly to solo build with no security-relevant gap, no change
  needed.
- AGREE: dropping a numeric test-coverage floor for a near-zero-business-logic
  static site — but see OBJECT below: this should not be read as license to
  also drop the free, zero-effort security checks (dependency + secret
  scanning), which are unrelated to the coverage-floor debate and should be
  non-negotiable regardless of how that question resolves.
- AGREE: `infrastructure-design`/IaC-scanning is correctly out of scope — no
  IaC exists or is planned in this project's confirmed stack.
- OBJECT: the Hostinger-DNS-credentials Forbidden candidate in
  `discovered-rules.md` is too narrowly scoped (see assessment above) — it
  should generalize to all credentials/secrets and all public-exposure paths
  (commits, issues, PRs, CI logs), not just "commit" and not just Hostinger,
  before being presented to the human as an interview candidate.
- OBJECT: neither `team-practices.md` nor `discovered-rules.md` currently
  names a concrete secret-scanning or dependency-scanning mechanism (only the
  Forbidden statement, which describes the "never" but not the "how it's
  caught"). Recommend adding, as Mandated candidates for the interview: GitHub
  push protection + Dependabot alerts (both free, native, zero new
  infrastructure) — sized correctly for a $0 solo project, unlike my
  persona's cloud-oriented defaults (Amazon Inspector, Snyk), which don't fit
  a project with no AWS account.
- OBJECT (minor, scoped to the open interview question): if the Way of
  Working interview resolves toward direct-to-`main` (no branches), the
  Code Style section's inherited "lint blocks the PR" language has no PR to
  attach to — the practice statement should specify a pre-commit hook or a
  push-triggered CI check instead of silently carrying forward a PR-gate
  assumption that may not hold.
- None beyond the above — no objection to the Deployment section's
  single-environment framing or the Walking Skeleton section as drafted.
