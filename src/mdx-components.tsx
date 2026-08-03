import type { MDXComponents } from 'mdx/types';

/**
 * Global MDX component mapping.
 *
 * `@next/mdx` requires this file to exist at the project root (or under `src/`)
 * for the App Router — without it the compiled MDX resolves its provider to
 * `@mdx-js/react`, whose React context is not available in a server component,
 * and the build fails while collecting page data.
 *
 * The mapping is also where MDX body prose gets its typography. Tailwind's
 * preflight strips default element styling, so markdown-authored paragraphs and
 * lists would otherwise render unstyled. Styling them here keeps the MDX files
 * free of presentation classes, which is what makes them content that Unit 2
 * can edit without touching code.
 */
const components: MDXComponents = {
  p: (props) => <p className="text-body text-text-primary" {...props} />,
  ul: (props) => (
    <ul
      className="list-disc space-y-xs pl-sm text-body text-text-primary"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="list-decimal space-y-xs pl-sm text-body text-text-primary"
      {...props}
    />
  ),
  li: (props) => <li className="text-body" {...props} />,
  strong: (props) => <strong className="font-semibold" {...props} />,
  code: (props) => (
    <code
      className="rounded-sm bg-surface px-1 font-mono text-meta text-text-secondary"
      {...props}
    />
  ),
  /*
   * `h1` is remapped to `h2`, not styled as one. `accessibility-checklist.md`
   * allows exactly one `h1` per page and `Hero` owns it; a stray `#` in a
   * content file must not be able to introduce a second.
   */
  h1: (props) => (
    <h2 className="text-h2 font-semibold text-text-primary" {...props} />
  ),
  h2: (props) => (
    <h3 className="text-body font-semibold text-text-primary" {...props} />
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
