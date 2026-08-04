# Build Instructions — marlowfernandez.com

**Intent:** `260726-resume-site` · **Stage:** build-and-test
**Consumes:** the per-unit [code-generation-plan.md](../site-shell-walking-skeleton/code-generation/code-generation-plan.md) and [code-summary.md](../site-shell-walking-skeleton/code-generation/code-summary.md) for both units

## Prerequisites

| Requirement | Notes |
|---|---|
| Node.js 24+ | The toolchain baseline recorded in `README.md` |
| npm | The project's package manager — do not substitute yarn/pnpm; `package-lock.json` is the committed lockfile |

No environment variables, no `.env` file, no local services. This is a fully static build with no runtime data source (`services.md`, ADR-6). `.env*` is gitignored specifically so that stays true by accident as well as by design.

## Dependency Installation

```bash
npm install
```

Installs from `package-lock.json`. Per `project.md`'s Mandated rules, **every dependency update is reviewed manually — there is no auto-merge at any tier**, so this lockfile should only move when a human has looked at the diff.

## Build

```bash
npm run build
```

Runs `next build`, which:
1. Compiles with Turbopack
2. Runs TypeScript (`tsc`) as part of the build
3. Validates every MDX content file against `src/content/schema.ts` while pre-rendering — **a malformed frontmatter edit fails the build with the offending field path rather than shipping**
4. Emits the static export to `out/`

## Build Verification

The build is verified when all four of these pass:

```bash
npm run build      # static export to out/
npm test           # Vitest
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

`typecheck` is listed separately on purpose. It surfaced a real error during Code Generation that `next build` did not — the two disagreed until that was fixed. Running only the build would have hidden it.

To inspect what actually deploys:

```bash
npx serve out
```

Serve the **export**, not the dev server. They differ, and GitHub Pages only ever sees `out/`.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `w.default.createContext is not a function` at page-data collection | `@next/mdx` needs `src/mdx-components.tsx` for the App Router; without it the compiled MDX falls back to `@mdx-js/react`'s provider, whose React context doesn't exist in RSC | Ensure `src/mdx-components.tsx` exists. Do not reinstall `@mdx-js/react` — it was deliberately dropped |
| Build fails naming a content field path | MDX frontmatter violates `src/content/schema.ts` | Fix the frontmatter. This is the content-schema gate working as designed, not a build bug |
| `react-hooks/set-state-in-effect` lint error on theme code | Next 16 rejects the `useState` + `useEffect` theme pattern | The theme uses `useSyncExternalStore` (`src/lib/theme-store.ts`) precisely to avoid this. Don't revert it |
| `npm audit` reports 3 high severity | postcss and sharp, inside `next@16.2.12`'s own tree | Not fixable at this layer — `npm audit fix --force` proposes downgrading Next to 9.3.3. ESLint 10 would clear a fourth chain but breaks `eslint-config-next`. Documented in Unit 1's `code-summary.md` |

## Assumptions & Open Questions

None. Every command above was executed against this repository during this stage; results are in [build-test-results.md](build-test-results.md).
