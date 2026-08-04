# marlowfernandez.com

Personal site and living resume for Marlow Fernandez — Team Lead / Software Engineer, and founder of Vynkor.

## Domains

| Domain                | Role                                 |
| --------------------- | ------------------------------------ |
| `marlowfernandez.com` | **Canonical.** Serves the site.      |
| `marlow.software`     | 301 redirect → `marlowfernandez.com` |

The full name is canonical because it matches what recruiters and hiring managers
actually search for, and it lines up with the LinkedIn profile. `marlow.software`
is kept as a short, memorable alias and permanently redirects.

## Build methodology — AI-DLC

This repo is being built with [AI-DLC](https://github.com/awslabs/aidlc-workflows)
(AWS Labs, `v2` branch) — a structured, stage-gated AI development lifecycle.

Start or resume the workflow from a Claude Code session in this directory:

```bash
/aidlc --doctor
```

```bash
/aidlc
```

Useful commands: `/aidlc --status` (progress), `/aidlc --stage <slug>` (jump),
`/aidlc-session-cost` (spend). Artifacts land under
`aidlc/spaces/default/intents/<record>/` and are committed by design.

### Local deviations from the shipped distribution

The upstream `dist/claude/` distribution was copied in as-is, with five
deliberate changes. Anyone re-syncing from upstream needs to reapply them:

1. **AWS Bedrock removed.** Upstream `.claude/settings.json` sets
   `CLAUDE_CODE_USE_BEDROCK=1`, `AWS_REGION=us-east-1`, and four pinned Bedrock
   model IDs. These were deleted so the project runs on first-party Claude Code
   auth instead of billing an AWS account. AI-DLC is harness-level — skills,
   agents, hooks, and bun tools all run locally — so nothing in the methodology
   depends on Bedrock. To restore it, put those keys in
   `.claude/settings.local.json` (gitignored), not in `settings.json`. Note the
   shipped pins were already stale (`claude-opus-4-8`, `claude-sonnet-4-6`).

2. **Default scope `workshop` → `mvp`.** `workshop` runs INCEPTION +
   CONSTRUCTION + OPERATION in full (~29 stages, including incident response and
   performance validation). `mvp` resolves to 22 stages and drops the OPERATION
   phase — the right shape for a static personal site.

3. **`.mcp.json` deleted.** Upstream declares five MCP servers — `context7` plus
   four AWS ones. This project prefers skills over MCP: documentation lookups
   come from the `find-docs` skill and the `ctx7` CLI, which authenticates from
   `~/.config/context7` and needs no `CONTEXT7_API_KEY` env var. The AWS servers
   are moot without AWS. Verified safe to remove: the distribution contains zero
   `mcp__*` tool references, and the composer's CodeKB path has a documented
   `method: "fallback"` for when CodeKB is absent — which it always was, since
   CodeKB is not declared in upstream's `.mcp.json` either.

4. **Bare `Bash` pre-approval removed.** Upstream's `permissions.allow` includes
   a bare `"Bash"`, auto-approving arbitrary shell commands with no prompt — it
   is what lets the 32-stage workflow run unattended. That entry is gone. Only
   AI-DLC's own tooling stays pre-approved, via two narrow patterns:
   `Bash(bun "$CLAUDE_PROJECT_DIR/.claude/tools/"*)` (upstream's absolute form)
   and `Bash(bun .claude/tools/*)` (added — the relative form the stage files
   and docs actually invoke, which the absolute pattern does not match).

5. **`.claude/CLAUDE.md`** prerequisites section updated to match the above.

### Known sharp edges

- **Build and test commands will prompt for approval** during CONSTRUCTION, now
  that blanket `Bash` is gone. That is the intended trade: per-call review in
  exchange for the workflow no longer running shell unattended.
- **`aidlc/` artifacts are committed and this repo is public.** The audit trail,
  state files, and every stage artifact are version-controlled by design. Keep
  anything sensitive out of intent descriptions.

## Prerequisites

- [bun](https://bun.sh) — runs all 25 AI-DLC tools and 13 hooks
  (`npm install -g --allow-scripts=bun bun` on Windows)
- Claude Code
- Node.js 24+ and npm — the site toolchain

---

## The site

Unit 1 built the walking skeleton — shell, theme toggle, MDX pipeline, and the
frontmatter schema — against deliberately loud placeholder content. Unit 2
replaced that content with the real thing: four employer blocks at full detail,
education and certification, the AI Engineering list, and real contact details.
The shell is unchanged; only `src/content/*.mdx` and the section components
moved.

### Stack

| Layer     | Choice                                             |
| --------- | -------------------------------------------------- |
| Framework | Next.js 16, App Router, **static export**          |
| Language  | TypeScript, `strict`                               |
| Styling   | Tailwind CSS 4, tokens as CSS custom properties    |
| Content   | MDX with YAML frontmatter, validated at build time |
| Tests     | Vitest + Testing Library (jsdom)                   |
| Hosting   | GitHub Pages                                       |

There is no server. `output: 'export'` pre-renders everything to `out/` at build
time — no route handlers, no middleware, no runtime data source. Anything that
needs a request-time server does not belong in this repository.

### Commands

```bash
npm install         # install the toolchain
npm run dev         # local dev server, http://localhost:3000
npm run build       # static export -> out/   (also runs `tsc`)
npm test            # Vitest, single run
npm run test:watch  # Vitest, watch mode
npm run lint        # ESLint
npm run format      # Prettier, write
npm run typecheck   # tsc --noEmit, without a full build
```

`npm run build` writes the deployable site to `out/`. Serve it locally with
`npx serve out` (`npm start`) to check the export rather than the dev server —
the two differ, and GitHub Pages only ever sees the export.

### Layout

```
src/
  app/          layout.tsx, page.tsx, globals.css (design tokens)
  components/   Header, Hero, Footer, ThemeToggle, ExternalLink,
                ExperienceSection, AIEngineeringSection, EducationSection,
                ContactSection
  content/      *.mdx content files + schema.ts (the frontmatter contract)
  lib/          theme resolution, theme store, pre-hydration script, CSP
  types/        ambient MDX module augmentation
  mdx-components.tsx   required by @next/mdx for the App Router
```

Content lives entirely in `src/content/*.mdx` frontmatter. The MDX bodies are
authoring notes — nothing renders them; the section components read the
structured frontmatter above each body.

### Three things worth knowing before you change anything

**`ThemeToggle` is the only client component.** Everything else is a server
component, which is what keeps the client bundle small enough for the
Lighthouse performance budget. Adding `'use client'` anywhere else is a
deliberate decision, not a convenience.

**Content is validated at build time.** `src/content/schema.ts` defines the MDX
frontmatter contract; `src/content/index.ts` asserts every content file against
it while the page is being pre-rendered. A malformed frontmatter edit fails
`npm run build` with the offending field path — it cannot reach production.

**Two content rules no validator can enforce.** Both are decisions from
`requirements.md`, and both look like harmless improvements from inside an
editor:

1. **The Vynkor sub-line under Point & Pay stays very brief and vague.** The
   reason is reputational — avoiding any impression that a side project competes
   with full-time employment. Schema validation checks frontmatter _shape_, not
   prose, so an expanded version passes CI cleanly.
2. **Nothing goes on the page that `requirements.md` does not confirm.** Every
   disclosure on this site — employer name, the transaction figure, government
   and defense clients, the clearance, the phone number — was decided per item
   and re-confirmed after the permanent-public-indexing risk was raised
   explicitly. Do not re-derive content from the resume PDF; go back to
   `requirements.md`.

The tests guard what they can: the Vynkor line must render as its own element
rather than an employer bullet, and the AI Engineering section must contain zero
anchors (a deliberate decision, not an oversight — even a link to this
repository was considered and declined).

## Using this as a template

Licensed **MIT** — see [LICENSE](LICENSE). Fork it, strip the content, make it
yours. That is what it is here for.

```bash
npm install
```

```bash
npm run dev
```

What to replace, in order:

1. **`src/content/*.mdx`** — all five files. This is one person's résumé:
   employment history, credentials, contact details. Copying it verbatim is not
   a licensing question but an honesty one.
2. **`public/CNAME`** — one line, your domain. GitHub Pages reads it from the
   published artifact; lose it and the custom domain stops resolving.
3. **`src/app/layout.tsx`** — `metadataBase`, title, and Open Graph fields.
4. **`src/app/icon.svg`** — the monogram favicon.
5. **`.lycheeignore`** — it excludes this site's own canonical URLs, which
   cannot resolve until a first deploy has succeeded. Swap in yours or the
   link check deadlocks against the deploy that would fix it.

Content shape is validated at build time by `src/content/schema.ts`, so a
malformed edit fails `npm run build` rather than shipping a broken page.

**The licence covers the template, not the identity.** Nothing in it grants any
right to use the name "Marlow Fernandez" or to present someone else's work
experience as your own.

## Documentation staleness

`src/content/readme.test.ts` checks the claims in this file that are
mechanically checkable: every `npm run` command documented here exists in
`package.json`, every repository path referenced here resolves, and the licence
named here has a matching file. It runs in the normal test suite, so it fires
in the pre-commit hook too — a README claim breaks at the moment it breaks,
rather than on someone's next push.

It cannot check whether the prose is still _true_. That still needs a reader.

Note that `README.md` is deliberately **not** in `ci.yml`'s `paths-ignore`.
That list exists so record-keeping commits (`aidlc/**`, `.claude/**`) do not
redeploy a byte-identical site — but `paths-ignore` skips the _entire_
workflow, so ignoring the README would mean a README-only commit runs no checks
at all, including this one, on the very commit that changed it. A rare wasted
build is the cheaper mistake.
