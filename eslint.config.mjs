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
    // Vendored design reference, not owned by this project. Temporary — it is
    // deleted once the redesign lands, along with this entry. Without it,
    // `react-hooks/set-state-in-effect` fails the whole lint run on code we
    // are only reading. ESLint 9 flat config does not honour .gitignore, so
    // ignoring it there is not enough.
    'marlow-fernandez-portfolio-source/**',
  ]),
]);

export default eslintConfig;
