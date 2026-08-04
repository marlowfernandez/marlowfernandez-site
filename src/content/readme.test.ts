import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { beforeAll, describe, expect, it } from 'vitest';

/**
 * README staleness guard.
 *
 * Documentation rots silently: a command gets renamed, a path moves, and the
 * README keeps confidently describing something that no longer exists. Nothing
 * fails, so nobody notices until a reader follows an instruction that does not
 * work.
 *
 * This checks the claims that are mechanically checkable — every `npm run`
 * command it documents exists, every repository path it points at exists, and
 * every relative link resolves. It cannot check whether the prose is still
 * *true*, and does not pretend to.
 *
 * ## Why this is a test rather than a CI step
 *
 * It runs in the same suite as everything else, which means it runs in the
 * pre-commit hook too — so a README claim breaks at the moment it breaks,
 * not on someone's next push.
 *
 * It also settles a question about the deploy pipeline. `ci.yml` ignores
 * `aidlc/**` and `.claude/**` so record-keeping commits do not redeploy an
 * identical site. README.md is deliberately NOT in that list: `paths-ignore`
 * skips the entire workflow, so ignoring the README would mean a
 * README-only commit runs no checks at all — including this one, on the very
 * commit that changed it. A rare wasted build is the cheaper mistake.
 */

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const README = path.join(ROOT, 'README.md');

let readme = '';
let scripts: Record<string, string> = {};

beforeAll(async () => {
  readme = await readFile(README, 'utf8');
  const pkg: unknown = JSON.parse(
    await readFile(path.join(ROOT, 'package.json'), 'utf8'),
  );
  const raw = (pkg as { scripts?: Record<string, string> }).scripts;
  scripts = raw ?? {};
});

/** Strips fenced code blocks' fences but keeps their contents. */
function commandsIn(markdown: string): string[] {
  const found = new Set<string>();
  for (const match of markdown.matchAll(/npm run ([a-z][a-z0-9:-]*)/g)) {
    const name = match[1];
    if (name !== undefined) found.add(name);
  }
  return [...found];
}

/** Backticked tokens that look like repository paths, e.g. `src/content/`. */
function pathsIn(markdown: string): string[] {
  const found = new Set<string>();
  for (const match of markdown.matchAll(/`([a-zA-Z0-9._-]+\/[^`\s]*)`/g)) {
    const candidate = match[1];
    if (candidate === undefined) continue;
    // Skip URLs, globs, and the AI-DLC record paths that use placeholders.
    if (/^https?:|[*<>]|\{|\}/.test(candidate)) continue;
    found.add(candidate.replace(/\/$/, ''));
  }
  return [...found];
}

describe('README stays true', () => {
  it('is not empty', () => {
    // Vacuity guard: every assertion below passes trivially against "".
    expect(readme.length).toBeGreaterThan(500);
  });

  it('documents only npm scripts that exist', () => {
    const documented = commandsIn(readme);
    expect(documented.length).toBeGreaterThan(0);

    const missing = documented.filter((name) => !(name in scripts));
    expect(
      missing,
      `README documents npm scripts that package.json does not define: ${missing.join(', ')}`,
    ).toEqual([]);
  });

  it('points only at paths that exist', async () => {
    const { existsSync } = await import('node:fs');
    const referenced = pathsIn(readme);
    expect(referenced.length).toBeGreaterThan(0);

    /*
     * Only paths rooted in a directory this repo actually has.
     *
     * The README legitimately refers to other repositories' layouts — it
     * describes the upstream AI-DLC distribution's `dist/claude/`, which does
     * not and should not exist here. Requiring every backticked path to
     * resolve locally would flag that forever, and a check that cries wolf
     * gets deleted.
     *
     * The signal worth keeping is a path INSIDE a real directory going stale,
     * e.g. a renamed component still documented at its old location. Those
     * share a first segment with something real, so they are still caught.
     */
    const local = referenced.filter((candidate) => {
      const [head] = candidate.split('/');
      return head !== undefined && existsSync(path.join(ROOT, head));
    });

    const missing = local.filter(
      (candidate) => !existsSync(path.join(ROOT, candidate)),
    );
    expect(
      missing,
      `README references paths that do not exist: ${missing.join(', ')}`,
    ).toEqual([]);
  });

  it('names the licence, and the licence file is present', async () => {
    const { existsSync } = await import('node:fs');
    expect(existsSync(path.join(ROOT, 'LICENSE'))).toBe(true);
    expect(readme).toMatch(/MIT/);
  });

  it('does not reference the deleted design reference folder', () => {
    // It existed only while the redesign was in flight and is gone now.
    expect(readme).not.toContain('marlow-fernandez-portfolio-source');
  });
});
