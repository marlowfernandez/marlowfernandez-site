import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Prettier owns formatting; turn off every stylistic rule that would fight it.
  prettier,
  globalIgnores([
    // eslint-config-next's own defaults, restated because listing any
    // globalIgnores replaces them.
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Not application code: the AI-DLC workspace shell and its records.
    '.claude/**',
    'aidlc/**',
    // The same framework's ports for other agent runtimes. Gitignored and
    // already excluded from Prettier; linting upstream code this project does
    // not own only produces warnings nobody here can action.
    '.agents/**',
    '.codex/**',
    'AGENTS.md',
  ]),
]);

export default eslintConfig;
