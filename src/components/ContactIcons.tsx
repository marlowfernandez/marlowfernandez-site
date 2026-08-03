/**
 * The three contact glyphs used in the header.
 *
 * Inline SVG rather than an icon package: it costs no dependency (which
 * `project.md`'s no-auto-merge rule makes a recurring review cost), no network
 * request, and no render-blocking font. Each is `aria-hidden` — the
 * surrounding element always carries real text, so the glyph is decoration.
 */

const ICON_CLASS = 'size-4 shrink-0';

const SHARED = {
  className: ICON_CLASS,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '1.8',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: 'false',
} as const;

export function MailIcon() {
  return (
    <svg {...SHARED}>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <path d="m3 6 9 6 9-6" />
    </svg>
  );
}

export function PhoneIcon() {
  return (
    <svg {...SHARED}>
      <path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.2 2 2 0 0 1 6.5 3Z" />
    </svg>
  );
}

export function LinkedInIcon() {
  return (
    <svg {...SHARED}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M7.5 10.5v6M7.5 7.5v.01M11.5 16.5v-6M11.5 13a2.5 2.5 0 0 1 5 0v3.5" />
    </svg>
  );
}
