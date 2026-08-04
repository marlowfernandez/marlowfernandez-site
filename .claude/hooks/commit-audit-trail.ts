#!/usr/bin/env bun
/**
 * Commits the AI-DLC audit trail at the end of each assistant turn.
 *
 * ## Why this exists
 *
 * The audit shard is appended on every human turn and tool call, so the
 * working tree is dirty essentially always — and committing it is itself a
 * turn, which appends more. There is no sequence of actions that ends clean.
 * It is a journal, not a build artifact, so it wants a journal's workflow.
 *
 * Project-local, deliberately NOT prefixed `aidlc-`: everything with that
 * prefix in this directory is upstream framework code that a re-sync may
 * overwrite. This is ours.
 *
 * ## What it will and will not touch
 *
 * It commits `aidlc/` and nothing else, ever. Source, config, and content are
 * never staged by this hook — auto-committing code that a human has not
 * reviewed is a different and much worse idea than auto-committing a log.
 *
 * The commit is made with an explicit pathspec (`git commit -- aidlc`), which
 * commits those paths' working-tree state and leaves the rest of the index
 * alone. A partially staged source change in progress is therefore untouched,
 * rather than being swept into a commit labelled "audit trail".
 *
 * **It never pushes.** Publishing is an outward-facing act and stays a human
 * decision; this only keeps the local tree tidy.
 *
 * ## Secret scanning is still enforced
 *
 * `project.md` mandates a gitleaks scan before every commit, and the audit
 * trail records tool invocations — precisely the kind of content that could
 * capture a credential. So this runs gitleaks itself on the staged content and
 * refuses to commit if it finds anything.
 *
 * It then commits with `--no-verify`, which skips the rest of the pre-commit
 * hook: lint, format, typecheck, and the full test suite. Those check code
 * quality and have nothing to say about a log file, and running them on every
 * turn would add seconds to each one. The mandated control is kept; the
 * irrelevant ones are not.
 *
 * ## Failure posture
 *
 * Any unexpected condition exits 0 silently. A tidiness hook must never block
 * a session or fail a turn — the worst acceptable outcome is that the file
 * stays uncommitted, which is exactly where it was before this existed.
 */

import { spawnSync } from 'node:child_process';

const PROJECT_DIR = process.env['CLAUDE_PROJECT_DIR'] ?? process.cwd();
/** The only path this hook is ever allowed to stage. */
const PATHSPEC = 'aidlc';

function git(...args: string[]) {
  return spawnSync('git', args, {
    cwd: PROJECT_DIR,
    encoding: 'utf8',
  });
}

/**
 * gitleaks, resolved past `PATH`.
 *
 * Mirrors `.githooks/pre-commit`, and for the reason recorded there: winget
 * installs the binary without creating a PATH shim, so `command -v` reports a
 * working scanner as absent.
 */
function resolveGitleaks(): string | null {
  const onPath = spawnSync('gitleaks', ['version'], { encoding: 'utf8' });
  if (onPath.status === 0) return 'gitleaks';

  const local = process.env['LOCALAPPDATA'] ?? '';
  const home = process.env['USERPROFILE'] ?? process.env['HOME'] ?? '';
  const candidates = [
    process.env['GITLEAKS'] ?? '',
    `${local}/Microsoft/WinGet/Links/gitleaks.exe`,
    `${local}/Microsoft/WinGet/Packages/Gitleaks.Gitleaks_Microsoft.Winget.Source_8wekyb3d8bbwe/gitleaks.exe`,
    `${home}/scoop/shims/gitleaks.exe`,
    `${home}/go/bin/gitleaks`,
    '/usr/local/bin/gitleaks',
  ].filter((candidate) => candidate.length > 0);

  for (const candidate of candidates) {
    const probe = spawnSync(candidate, ['version'], { encoding: 'utf8' });
    if (probe.status === 0) return candidate;
  }
  return null;
}

function main(): void {
  // Never act mid-merge or mid-rebase: committing a subset of paths into a
  // conflicted state would make a confusing mess of someone else's operation.
  for (const marker of ['MERGE_HEAD', 'REBASE_HEAD', 'CHERRY_PICK_HEAD']) {
    if (git('rev-parse', '--verify', '--quiet', marker).status === 0) return;
  }

  // Anything to do? Only ever asks about the one pathspec.
  const changed = git('status', '--porcelain', '--', PATHSPEC).stdout ?? '';
  if (changed.trim().length === 0) return;

  const gitleaks = resolveGitleaks();
  if (gitleaks === null) {
    // Fail closed on the mandated control, but quietly — a missing scanner
    // leaves the file uncommitted rather than committing it unscanned.
    process.stderr.write(
      'commit-audit-trail: gitleaks not found; leaving the audit trail uncommitted.\n',
    );
    return;
  }

  // Stage only the pathspec, scan the staged content, then unstage if the scan
  // finds anything. `git --staged` is the 8.x form; `protect` no longer exists.
  git('add', '--', PATHSPEC);
  const scan = spawnSync(gitleaks, ['git', '--staged', '--redact', '--no-banner'], {
    cwd: PROJECT_DIR,
    encoding: 'utf8',
  });

  if (scan.status !== 0) {
    git('reset', '--', PATHSPEC);
    process.stderr.write(
      'commit-audit-trail: gitleaks flagged the audit trail; NOT committing. Inspect it before pushing.\n',
    );
    return;
  }

  const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
  git(
    'commit',
    '--no-verify',
    '-m',
    `Record AI-DLC audit trail (${stamp}Z)`,
    '--',
    PATHSPEC,
  );
}

try {
  main();
} catch {
  // Tidiness must never break a turn.
}
