# marlowfernandez.com

Personal site and living resume for Marlow Fernandez — Team Lead / Software Engineer, and founder of Vynkor.

## Domains

| Domain                 | Role                                              |
|------------------------|---------------------------------------------------|
| `marlowfernandez.com`  | **Canonical.** Serves the site.                   |
| `marlow.software`      | 301 redirect → `marlowfernandez.com`              |

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
- Node.js (for whatever site toolchain the CONSTRUCTION phase settles on)
