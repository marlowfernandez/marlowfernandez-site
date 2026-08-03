import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import { CONTENT_SECURITY_POLICY } from '@/lib/csp';
import { THEME_INIT_SCRIPT } from '@/lib/theme-script';

import './globals.css';

const SITE_URL = 'https://marlowfernandez.com';

/*
 * Real copy, replacing Unit 1's placeholder as that unit planned; the structure
 * (canonical URL, OpenGraph, robots) is Unit 1's and is unchanged.
 *
 * Both strings reuse content already on the page — the name and the tagline —
 * rather than newly-authored marketing copy, which no stage has approved. Note
 * in particular that the resume's city/state line is NOT repeated here:
 * `requirements.md`'s Contact Section confirms email, LinkedIn and phone, and
 * says nothing about location, so publishing it would be content this unit
 * invented.
 */
const TITLE = 'Marlow Fernandez — Software Engineering Leader';
const DESCRIPTION =
  'Personal site and living resume for Marlow Fernandez, Software Engineering Leader.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  // marlow.software 301-redirects to this origin at the registrar
  // (`tech-stack-decisions.md`), so there is exactly one canonical URL.
  alternates: { canonical: '/' },
  openGraph: {
    type: 'profile',
    url: SITE_URL,
    title: TITLE,
    description: DESCRIPTION,
    siteName: 'marlowfernandez.com',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // No maximum-scale / user-scalable lock: capping zoom would break the
  // "usable at 200% zoom" item in `accessibility-checklist.md`.
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    /*
     * `suppressHydrationWarning` is scoped to <html> alone. The pre-hydration
     * script sets `data-theme` here before React runs, so the server markup and
     * the live DOM legitimately differ on this one element. Putting it any
     * lower — or on <body> — would start hiding real mismatches.
     */
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          CSP is written as an explicit <head> child rather than through the
          Metadata API, because `metadata.other` cannot emit `http-equiv` and
          because a CSP meta tag only governs what comes after it. Declaring it
          first is the whole point.

          Its documented limits (no `frame-ancestors`, no HSTS, `'unsafe-inline'`
          for scripts) are explained in `src/lib/csp.ts`.
        */}
        <meta
          httpEquiv="Content-Security-Policy"
          content={CONTENT_SECURITY_POLICY}
        />

        {/*
          Theme applied before first paint. Must stay synchronous and inline —
          see `src/lib/theme-script.ts` for why it cannot be a module.
          The content is a build-time constant from this repository, never
          user-derived, so there is no injection surface behind
          `dangerouslySetInnerHTML`.
        */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-screen flex-col">
        {/*
          Skip link: first focusable element on the page, visually hidden until
          it takes focus (`accessibility-checklist.md`, Structure). It targets
          the <main> that `page.tsx` renders.
        */}
        <a
          href="#main-content"
          data-testid="skip-link"
          className="sr-only focus:not-sr-only focus:absolute focus:top-xs focus:left-xs focus:z-50 focus:rounded-md focus:border focus:border-border focus:bg-background focus:px-sm focus:py-xs focus:text-body focus:no-underline"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
