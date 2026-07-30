# Interaction Specification — marlowfernandez.com

**Intent:** `260726-resume-site` · **Stage:** refined-mockups
**Format:** per `.claude/knowledge/aidlc-design-agent/component-spec-template.md`

Only two components on this site have real interaction behavior — everything else is static content. Both are specified below.

---

## Theme Toggle

| Field | Value |
|---|---|
| Component | ThemeToggle |
| Description | Switches the site between light and dark color schemes |
| Category | input |

### States

| State | Description | Trigger |
|---|---|---|
| default (light) | Light theme active | initial render, OS preference is light, or no stored override |
| default (dark) | Dark theme active | initial render, OS preference is dark, or stored override is dark |
| hover | Cursor over toggle | mouseover |
| focus | Keyboard focus | Tab key |
| pressed | Toggle activated | click or Enter/Space while focused |

### Props / Inputs

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| initialTheme | "light" \| "dark" | no | resolved from `prefers-color-scheme` | Theme on first render before any stored override is read |
| onToggle | function | yes | — | Called on activation; flips the active theme and writes the override to localStorage |

### Responsive Behaviour

| Breakpoint | Behaviour |
|---|---|
| mobile (<768px) | Icon-only, positioned in the header alongside contact icons |
| tablet (768–1023px) | Same as mobile |
| desktop (≥1024px) | Same icon, right-aligned in the header |

### Accessibility

| Requirement | Implementation |
|---|---|
| ARIA role | `button` with `aria-pressed` reflecting current state |
| Keyboard interaction | Tab to focus, Enter or Space to activate |
| Label / aria-label | `aria-label="Switch to dark theme"` / `"Switch to light theme"`, updated per current state |
| Contrast ratio | WCAG AA — icon and its focus ring must hold 3:1 against both theme backgrounds |
| Screen reader | Announces the label change on activation ("Switch to light theme" after switching to dark, and vice versa) |
| Focus management | Focus remains on the toggle after activation — no focus is stolen or moved |

### Persistence Logic (confirmed at this stage's Q2)

1. On first visit: resolve theme from `prefers-color-scheme` media query. No stored override exists yet.
2. On toggle activation: flip the active theme, write the explicit choice to `localStorage`.
3. On return visit: if a stored override exists, use it regardless of current OS preference. If no override exists, resolve from `prefers-color-scheme` again (so a visitor who never toggled always tracks their OS setting).

### Usage Example

```
<ThemeToggle
  initialTheme={resolveInitialTheme()}
  onToggle={(theme) => persistThemeOverride(theme)}
/>
```

---

## External Link (LinkedIn)

| Field | Value |
|---|---|
| Component | ExternalLink |
| Description | Any link leaving the site — currently only the LinkedIn profile link. The AI Engineering section originally anticipated project/repo links here too, but Application Design's Q1/Q6 (`inception/application-design/application-design-questions.md`) removed all links from that section, including a considered-and-declined link to this project's own GitHub repo — noted here so this spec doesn't read as contradicting that later decision. |
| Category | navigation |

### States

| State | Description | Trigger |
|---|---|---|
| default | Standard link appearance | page load |
| hover | Cursor over link | mouseover |
| focus | Keyboard focus | Tab key |
| visited | Link previously followed | browser history match |

### Props / Inputs

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| href | string | yes | — | Destination URL |
| label | string | yes | — | Visible link text |

### Responsive Behaviour

| Breakpoint | Behaviour |
|---|---|
| mobile (<768px) | No change — link behavior is not breakpoint-dependent |
| tablet (768–1023px) | No change |
| desktop (≥1024px) | No change |

### Accessibility

| Requirement | Implementation |
|---|---|
| ARIA role | Native `<a>` element, no ARIA override needed |
| Keyboard interaction | Tab to focus, Enter to activate |
| Label / aria-label | Visible text must indicate the link leaves the site (e.g., "LinkedIn (opens in new tab)" as a visually-hidden suffix or an icon with an accessible name), since it opens in a new tab per this stage's Q4 |
| Contrast ratio | WCAG AA — link text and its underline/indicator must hold 4.5:1 |
| Screen reader | Announces the "opens in new tab" indication before activation, not just after |
| Focus management | New tab receives focus per browser default; the origin tab's focus stays on the link (`rel="noopener noreferrer"` also required for security, independent of accessibility) |

### Usage Example

```
<ExternalLink
  href="https://linkedin.com/in/marlowf"
  label="LinkedIn"
/>
```

## Assumptions & Open Questions

None. Both components' behavior traces to this stage's confirmed Q2 and Q4 answers.
