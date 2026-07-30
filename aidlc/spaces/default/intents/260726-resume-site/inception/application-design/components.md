# Components — marlowfernandez.com

**Intent:** `260726-resume-site` · **Stage:** application-design
**Consumes:** [requirements.md](../requirements-analysis/requirements.md), [team-practices.md](../practices-discovery/team-practices.md)

Per this stage's confirmed Q4: many small, independently-focused components rather than fewer large ones. None of them fetch data client-side — content is resolved at build time from MDX, per Q2. `ThemeToggle` is the one exception to "no client-side behavior at all": it owns real client-side state (the active theme) and reads/writes `localStorage`, as detailed in its own row below and in `interaction-spec.md`. Every other component, including `ExternalLink`, is a pure server component with no client-side state.

## Component List

| Component | Purpose | Owns |
|---|---|---|
| `Header` | Top bar: name, contact icons, theme toggle | Layout of the identity/contact row |
| `ThemeToggle` | Light/dark switch | Theme state read/write, OS-preference resolution, localStorage persistence (per `interaction-spec.md`) |
| `ExternalLink` | Any link leaving the site — currently only LinkedIn, since this stage's Q1/Q6 removed all AI Engineering section links | `rel="noopener noreferrer"`, new-tab behavior, and the "opens in new tab" accessible announcement, per `interaction-spec.md` |
| `Hero` | Name (h1) + role tagline | The page's primary heading |
| `ExperienceSection` | All 4 employer blocks, full detail, including the Vynkor sub-line | Rendering the experience content model from `requirements.md` |
| `AIEngineeringSection` | Plain-text, comma-separated list of AI engineering work (openclaw, LLMs, unsloth, model setups, AI-DLC) | Rendering the confirmed no-links, no-card-grid format (Q1/Q6) |
| `EducationSection` | Full education/certification detail | Rendering `requirements.md`'s Education & Certification content |
| `ContactSection` | Repeated contact info at page end | The end-of-page call-to-action |
| `Footer` | Copyright line | Page footer |

## Component Boundaries

- **Content components** (`ExperienceSection`, `AIEngineeringSection`, `EducationSection`) own rendering only — they receive parsed MDX content as props and never fetch or parse content themselves. Parsing is a build-time concern (Next.js's MDX pipeline), not a component responsibility.
- **`ThemeToggle`** is the only component with client-side interactive state. Every other component is a pure server component (Next.js App Router default) — no client-side JavaScript needed for them.
- **`Header`** composes `ThemeToggle` but does not own its state; it only provides layout.

## Public Interfaces

| Component | Props |
|---|---|
| `Header` | `contactInfo: { email, phone, linkedInUrl }` |
| `ThemeToggle` | none (self-contained; reads/writes its own persisted state per `interaction-spec.md`) |
| `ExternalLink` | `href: string`, `label: string` (per `interaction-spec.md`) |
| `Hero` | `name: string`, `tagline: string` |
| `ExperienceSection` | `roles: ExperienceEntry[]` (parsed from MDX) |
| `AIEngineeringSection` | `items: string[]` (parsed from MDX; rendered as a comma-separated plain-text list, no card/grid markup) |
| `EducationSection` | `education: EducationEntry[]` (parsed from MDX) |
| `ContactSection` | `contactInfo: { email, phone, linkedInUrl }` (same shape as `Header`'s prop) |
| `Footer` | none |

## Assumptions & Open Questions

None. Every component and boundary traces to a confirmed answer in this stage's questions file or to `mockups.md`'s section layout.
