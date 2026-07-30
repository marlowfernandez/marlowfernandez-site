# Component Dependency — marlowfernandez.com

**Intent:** `260726-resume-site` · **Stage:** application-design
**Consumes:** [components.md](components.md)

## Dependency Matrix

| Component | Depends on | Data source |
|---|---|---|
| `Page` (root, `app/page.tsx`) | `Header`, `Hero`, `ExperienceSection`, `AIEngineeringSection`, `EducationSection`, `ContactSection`, `Footer` | Composes all sections in the confirmed order (desktop: Experience left / AI Engineering right; mobile: AI Engineering first, per `mockups.md`) |
| `Header` | `ThemeToggle`, `ExternalLink` | `contactInfo` passed down from `Page` |
| `ThemeToggle` | `resolveInitialTheme`, `persistThemeOverride` (from `component-methods.md`) | Browser `prefers-color-scheme` media query, `localStorage` |
| `Hero` | none | `name`, `tagline` passed down from `Page` |
| `ExperienceSection` | none | MDX content file (experience data) |
| `AIEngineeringSection` | none | MDX content file (AI engineering list) |
| `EducationSection` | none | MDX content file (education data) |
| `ContactSection` | `ExternalLink` | `contactInfo`, same shape as `Header`'s |
| `Footer` | none | none |
| `ExternalLink` | none | `href`, `label` passed down from whichever component renders it (`Header`, `ContactSection`) |

## Communication Pattern

All data flow is **one-directional and build-time**: MDX content → parsed props → component render. There is no client-server communication, no event bus, and no shared mutable state between components — the only client-side state anywhere in this application is `ThemeToggle`'s own theme value, which is local to that component and does not flow to or from any sibling.

## Shared Resources

- **`contactInfo`**: the only data shape shared between two components (`Header` and `ContactSection`). Both read the same source value; neither writes it. No synchronization concern exists because it's static, build-time data.
- **Design tokens** (`design-system-mapping.md`): shared via the Tailwind theme config (per this stage's confirmed Q3), not passed as props — every component reads the same compiled CSS, not a shared JavaScript object.

## No Circular Dependencies

The dependency graph is a strict tree: `Page` → section components → (optionally) utility functions. No component depends on a sibling, and no cycle exists.

## Assumptions & Open Questions

None. This graph follows directly from `components.md`'s boundaries and `mockups.md`'s confirmed section order.
