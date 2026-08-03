import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vitest/config';
import { parse as parseYaml } from 'yaml';

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---/;

/**
 * Makes `.mdx` imports resolvable under Vitest.
 *
 * The build compiles MDX through `@next/mdx` (see `next.config.mjs`), which
 * Vitest does not run. Without this, any test that imports `@/content` — the
 * barrel that validates the real content files — fails to resolve, and every
 * content assertion would have to be written against a fixture instead. A
 * fixture cannot catch a deleted employer block or an expanded Vynkor line,
 * which are exactly the regressions this unit's tests exist to catch.
 *
 * It emits only the `frontmatter` export, deliberately, and stubs the default
 * component. That is not a shortcut around compiling MDX properly: since Unit 2
 * removed the body exports from `src/content/index.ts`, nothing renders an MDX
 * body any more. Every content file's body is an authoring note. Compiling it
 * would add a JSX-runtime coupling for output no test can observe.
 *
 * The one thing this MUST stay faithful to is the frontmatter itself: the same
 * YAML block, parsed the same way `remark-mdx-frontmatter` parses it, so a test
 * sees exactly what the build sees.
 */
function mdxFrontmatter(): Plugin {
  return {
    name: 'mdx-frontmatter-for-tests',
    enforce: 'pre',
    transform(code: string, id: string) {
      if (!id.endsWith('.mdx')) return null;

      const match = FRONTMATTER.exec(code);
      if (match === null) {
        // Loud, not silent: every content file in this project is required to
        // carry frontmatter, and a missing block would otherwise surface as a
        // confusing validation failure far from its cause.
        throw new Error(`No YAML frontmatter found in ${id}`);
      }

      const frontmatter: unknown = parseYaml(match[1] as string);
      return {
        code: [
          `export const frontmatter = ${JSON.stringify(frontmatter)};`,
          'export default function MDXContent() { return null; }',
        ].join('\n'),
        map: null,
      };
    },
  };
}

export default defineConfig({
  plugins: [mdxFrontmatter(), react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    // Only colocated source tests. `.claude/` and `aidlc/` are workflow files,
    // never test targets.
    include: ['src/**/*.test.{ts,tsx}'],
    restoreMocks: true,
  },
});
