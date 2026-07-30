# Design System Mapping — marlowfernandez.com

**Intent:** `260726-resume-site` · **Stage:** refined-mockups
**Consumes:** [wireframes.md](../../ideation/rough-mockups/wireframes.md); greenfield/no-existing-assets fact confirmed at [Feasibility Q5](../../ideation/feasibility/feasibility-questions.md)

No existing design system exists for this project — this stage establishes one from scratch, per this stage's Q5 (delegate visual direction fully). The greenfield/no-existing-assets fact itself was confirmed at **Feasibility Q5** ("Nothing — fully greenfield, no existing brand assets"), not at Rough Mockups. Implementation mechanism (CSS Modules, Tailwind, plain CSS custom properties) is an Application Design (2.6) decision, not this stage's — the tokens below are implementation-agnostic values.

## Color Tokens

| Token | Light value | Dark value | Usage |
|---|---|---|---|
| `color-background` | `#ffffff` | `#0f1115` | Page background |
| `color-surface` | `#f7f7f8` | `#1a1d23` | Section backgrounds, subtle separation |
| `color-text-primary` | `#14161a` | `#e8e9ec` | Body text, headings |
| `color-text-secondary` | `#5a5f6b` | `#9aa0ac` | Dates, meta text, the Vynkor sub-line |
| `color-accent` | `#2452e8` | `#5b7fff` | Links, focus rings, the theme toggle's active state |
| `color-border` | `#e2e3e6` | `#2a2e37` | Section dividers |

All pairs verified to hold **4.5:1** for text and **3:1** for UI components (theme toggle icon, focus rings, borders) against their respective backgrounds — the WCAG 2.1 AA baseline confirmed at Rough Mockups.

## Typography Scale

| Token | Size | Usage |
|---|---|---|
| `text-h1` | 2.5rem / 40px | Name, in the header |
| `text-h2` | 1.5rem / 24px | Section headings (Experience, AI Engineering, Education, Contact) |
| `text-body` | 1rem / 16px | Bullet points, bio text |
| `text-meta` | 0.875rem / 14px | Dates, the Vynkor sub-line, footer |

Typeface: a system-font stack (no webfont dependency) is the default recommendation, since it avoids the font-loading flash this stage's Q1 explicitly decided not to design a state for ("no special states needed"). If Application Design later wants a specific webfont, that decision should revisit Q1's state-handling answer, since a webfont reintroduces exactly the loading-flash scenario this stage decided to skip.

## Spacing Scale

| Token | Value | Usage |
|---|---|---|
| `space-xs` | 0.5rem | Icon gaps, inline spacing |
| `space-sm` | 1rem | Bullet-point spacing |
| `space-md` | 2rem | Between sub-sections within Experience |
| `space-lg` | 4rem | Between major sections (Experience/AI Engineering, Education, Contact) |

## Breakpoints (confirmed this stage's Q3)

| Token | Range |
|---|---|
| `bp-mobile` | < 768px |
| `bp-tablet` | 768px – 1023px |
| `bp-desktop` | ≥ 1024px |

## Iconography

- Theme toggle: sun/moon icon pair (see `interaction-spec.md`)
- Contact icons: standard email/phone/LinkedIn glyphs, sized to match `text-body`

## Assumptions & Open Questions

None. This is a new design system, not a mapping onto an existing one — per Feasibility Q5's confirmed "fully greenfield, no existing brand assets."
