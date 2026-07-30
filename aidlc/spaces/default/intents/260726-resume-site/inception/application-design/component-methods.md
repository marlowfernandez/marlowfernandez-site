# Component Methods — marlowfernandez.com

**Intent:** `260726-resume-site` · **Stage:** application-design
**Consumes:** [components.md](components.md), [requirements.md](../requirements-analysis/requirements.md)

## Interpretation Note

This stage's default "component-methods" framing assumes class-style public methods. This site's components are React functional components with no internal methods beyond the props interface already recorded in `components.md` — so "methods" here means the small set of exported utility functions that support the one stateful component (`ThemeToggle`), plus each component's render contract (inputs in, markup out, no side effects for every component except `ThemeToggle`).

## `ThemeToggle` Utility Functions

| Function | Signature | Purpose | Error Handling |
|---|---|---|---|
| `resolveInitialTheme` | `(): "light" \| "dark"` | Reads `prefers-color-scheme`; falls back to a stored override in `localStorage` if one exists (per `interaction-spec.md`'s persistence logic) | If `localStorage` is unavailable (e.g., private browsing restrictions), falls back to the OS-preference result with no thrown error — a missing override is not an error condition |
| `persistThemeOverride` | `(theme: "light" \| "dark"): void` | Writes the visitor's explicit toggle choice to `localStorage` | Silently no-ops if `localStorage.setItem` throws (e.g., storage quota or private-mode restrictions) — the toggle still works for the current page view, it just won't persist across visits |

## Render Contracts (all other components)

| Component | Input → Output | Error Handling |
|---|---|---|
| `Header` | `contactInfo` → header markup | None needed — content is build-time-confirmed data, not user input; a missing field would be a build-time content error, not a runtime one |
| `Hero` | `name`, `tagline` → heading markup | Same as above |
| `ExperienceSection` | `roles[]` → list markup | Same as above |
| `AIEngineeringSection` | `items[]` → comma-separated plain-text markup (per this stage's confirmed Q1/Q6 — no links, no card grid) | Same as above |
| `EducationSection` | `education[]` → list markup | Same as above |
| `ContactSection` | `contactInfo` → contact markup | Same as above |
| `Footer` | none → copyright markup | None |
| `ExternalLink` | `href`, `label` → an `<a>` with `rel="noopener noreferrer"`, `target="_blank"`, and an accessible "opens in new tab" announcement (per `interaction-spec.md`) | None needed — `href`/`label` are build-time-confirmed data (LinkedIn only, since this stage's Q1/Q6 removed all AI Engineering section links) |

Because content is authored in MDX and resolved entirely at build time (`Q2`), there is no runtime error surface for missing or malformed content — a build-time MDX parse error fails the CI build (per `team-practices.md`'s CI-is-the-gate practice), rather than reaching production as a runtime crash.

## Assumptions & Open Questions

None. Every function/contract traces to `interaction-spec.md` or a confirmed answer in this stage's questions file.
