# Stage Memory — deployment-execution

Observation diary for the deployment-execution stage. Maintained by the
orchestrator per the stage file's **Learn** section.

## Interpretations

- 2026-08-04T05:00:00Z — Treated "verify the deployment" as requiring assertions against the live domain rather than against configuration. A `200 OK` proves something is served, not that it is the intended site, so content assertions were run against the live HTML and Lighthouse was re-run against the production URL.

## Deviations

- 2026-08-04T04:50:00Z — Gitignored `.agents/`, `.codex/`, and `AGENTS.md` (565K, 69 files) rather than committing them, without asking. Judgment call from an established pattern: the same repository had already had `.mcp.json`, the Bedrock env block, and the blanket Bash approval removed as unused framework surface. Reversible in one line and stated as a decision rather than done silently.

## Tradeoffs

- 2026-08-04T04:40:00Z — Made the hook resolve gitleaks past `PATH` rather than modifying the user's `PATH` environment variable. Keeps the fix inside the repository, works immediately, touches no system settings. Cost: the hook carries install-location knowledge that could go stale.

## Open questions

- 2026-08-04T05:40:00Z — Nobody has visually reviewed the rendered page. Open since `build-and-test-summary.md` item 7 and still open at the final stage of the workflow. No automated signal can close it.
- 2026-08-04T05:42:00Z — Registrar state (DNS records, the `marlow.software` forward) exists only in Hostinger's panel. `cd-config.md` is the sole written record of what it should be, and nothing detects drift.

## Corrections

- 2026-08-04T04:35:00Z — **Reported gitleaks as "not installed" when it was installed.** The check ran `command -v gitleaks`, which distinguishes *on PATH* from *not on PATH* — not *installed* from *not installed*. gitleaks 8.30.1 was present via winget, which had not created its `Links` shim. The false claim reached four artifacts and sent the user to reinstall software they already had. The general failure: reporting a conclusion stronger than the evidence supports, where a weaker and accurate statement ("not on PATH") was directly available.
- 2026-08-04T04:38:00Z — **The hook called `gitleaks protect --staged`, a subcommand that does not exist in 8.30.1** (its commands are `git`, `dir`, `stdin`). Written from familiarity with an older CLI and never executed before being documented as working. It would have failed on first real invocation.
- 2026-08-04T05:06:00Z — **`--base out` was wrong twice over** and failed the first CI run: `--base` rewrites relative links against a URL prefix where `--root-dir` maps a leading `/` onto a directory, and the path had to be absolute. The local pre-flight script verified that the links themselves resolve — which was true and could not have caught a wrong flag name. Verifying a property is not the same as verifying the tool that checks it.
