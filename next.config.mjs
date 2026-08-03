import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import createMDX from '@next/mdx';

const projectRoot = dirname(fileURLToPath(import.meta.url));

/**
 * Next.js configuration.
 *
 * `output: 'export'` is load-bearing, not a preference: the site is hosted on
 * GitHub Pages, which serves static files only and has no server runtime
 * (Feasibility Q3, ADR-6 "No Runtime Services"). Every page is pre-rendered to
 * HTML at build time into `out/`. Any feature that needs a request-time server
 * (Route Handlers, middleware, ISR, `next/image` optimisation) is unavailable
 * here by design.
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'export',

  // GitHub Pages serves `/about` as `/about/index.html`; trailing slashes keep
  // relative asset URLs resolving the same way locally and on the host.
  trailingSlash: true,

  // `next/image`'s default loader needs a server. Static export requires the
  // optimiser to be off. (No images are in the confirmed content model today,
  // but leaving this unset would fail the build the moment one is added.)
  images: { unoptimized: true },

  // MDX files participate in the module graph alongside TS/TSX.
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],

  // Pinned explicitly: Turbopack infers the workspace root from the nearest
  // lockfile, and an unrelated lockfile in a parent directory (e.g. the user's
  // home) would otherwise be picked and change how modules resolve.
  turbopack: { root: projectRoot },

  // Fail the production build on type errors rather than shipping them. CI is
  // the sole merge gate on this project (project.md, Mandated), so the build
  // must not be permissive.
  //
  // Lint is NOT configured here: Next 16 removed the `eslint` build option.
  // `npm run lint` is a separate step, run by the pre-commit hook and by CI —
  // which is where `team.md` puts it anyway.
  typescript: { ignoreBuildErrors: false },
};

const withMDX = createMDX({
  options: {
    // Turbopack cannot receive JavaScript functions (they do not cross the
    // JS/Rust boundary), so remark plugins are named as strings with
    // serialisable options only. See the Next.js MDX guide, "Using Plugins
    // with Turbopack".
    remarkPlugins: [
      'remark-frontmatter',
      ['remark-mdx-frontmatter', { name: 'frontmatter' }],
    ],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
