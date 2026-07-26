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

The upstream `dist/claude/` distribution was copied in as-is, with three
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

3. **`.claude/CLAUDE.md`** prerequisites section updated to match the above.

### Known sharp edges

- **`.claude/settings.json` pre-approves a bare `Bash`**, which auto-approves
  arbitrary shell commands in this project without a prompt. This is upstream's
  design — it's what lets the 32-stage workflow run unattended. Narrow the
  `permissions.allow` list if you want per-call review back.
- **`.mcp.json` declares five MCP servers**: `context7` (needs `CONTEXT7_API_KEY`
  in the environment) and four AWS servers launched via `uvx` that authenticate
  off the standard AWS credential chain. Servers you have no credentials for are
  simply unavailable and never block a workflow.
- **`aidlc/` artifacts are committed and this repo is public.** The audit trail,
  state files, and every stage artifact are version-controlled by design. Keep
  anything sensitive out of intent descriptions.

## Prerequisites

- [bun](https://bun.sh) — runs all 25 AI-DLC tools and 13 hooks
  (`npm install -g --allow-scripts=bun bun` on Windows)
- Claude Code
- Node.js (for whatever site toolchain the CONSTRUCTION phase settles on)
