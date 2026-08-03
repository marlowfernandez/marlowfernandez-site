/**
 * Ambient augmentation for MDX imports.
 *
 * `@types/mdx` types the default export (the compiled component) but cannot
 * know about exports that remark plugins inject. `remark-mdx-frontmatter`
 * (wired in `next.config.mjs`) adds a `frontmatter` export to every MDX module,
 * so it is declared here. Ambient module declarations merge, so this adds to
 * `@types/mdx`'s declaration rather than replacing it.
 *
 * `unknown` is deliberate. The compiler cannot verify YAML that is parsed at
 * build time, and typing it as the target interface would be a lie the
 * validator exists to catch. Declaring it `unknown` forces every consumer
 * through `src/content/schema.ts` — the type system routing content into the
 * runtime check instead of pretending to have already done it.
 *
 * This file must stay a script (no top-level `import`/`export`), or the
 * `declare module` block becomes a local augmentation and stops applying
 * globally.
 */
declare module '*.mdx' {
  export const frontmatter: unknown;
}
