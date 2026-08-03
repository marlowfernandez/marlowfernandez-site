# Code Generation Plan — site-shell-walking-skeleton

**Intent:** `260726-resume-site` · **Stage:** code-generation · **Unit:** `site-shell-walking-skeleton`
**Consumes:** [unit-of-work.md](../../../inception/units-generation/unit-of-work.md), [requirements.md](../../../inception/requirements-analysis/requirements.md), [components.md](../../../inception/application-design/components.md), [decisions.md](../../../inception/application-design/decisions.md), [design-system-mapping.md](../../../inception/refined-mockups/design-system-mapping.md), [interaction-spec.md](../../../inception/refined-mockups/interaction-spec.md), [performance-requirements.md](../nfr-requirements/performance-requirements.md)

All application code goes to the **workspace root**, never under the record dir.

## What This Unit Ships

Per `unit-of-work.md`: the deployable foundation — App Router scaffold, layout, `Header`/`Footer`/`ThemeToggle`/`ExternalLink`/`Hero`, Tailwind config from the design tokens, the MDX pipeline, and the MDX frontmatter schema that is Unit 2's integration contract. Content is **placeholder quality on purpose** — deliberately recognizable as placeholder so a live-but-incomplete deploy isn't mistaken for finished content.

---

## Steps

### Step 1: Project scaffold and configuration
- [x] `package.json` — Next.js, React, TypeScript, Tailwind, MDX, testing deps
- [x] `tsconfig.json` — strict TypeScript
- [x] `next.config.mjs` — **`output: 'export'`** (static export, per ADR/Feasibility), MDX plugin wiring
- [x] `tailwind.config.ts` — theme extension built from `design-system-mapping.md`'s tokens (colors light/dark, type scale, spacing, the 3 breakpoints: mobile <768, tablet 768–1023, desktop ≥1024)
- [x] `postcss.config.mjs`
- [x] `.eslintrc` / `eslint.config.mjs` — lint config (pre-commit + CI, per `team-practices.md`)
- [x] `.prettierrc`
- [x] `.gitignore` additions for Next.js (`.next/`, `out/`, `node_modules/`)

### Step 2: MDX content schema (the Unit 2 integration contract)
- [x] `src/content/schema.ts` — TypeScript types + a runtime validator for MDX frontmatter: `ExperienceEntry`, `EducationEntry`, `AIEngineeringItem`, `ContactInfo`
- [x] This is the **formal contract** confirmed at `units-generation` Q4 — Unit 2 conforms to it, and the content-schema-validation CI check validates against it

### Step 3: Design tokens as CSS custom properties
- [x] `src/app/globals.css` — token custom properties for both themes, `@media (prefers-color-scheme)` default, plus a `[data-theme]` override hook the toggle sets
- [x] System-font stack (per `design-system-mapping.md` — no webfont, avoids the loading flash and render-blocking request)

### Step 4: Root layout and page shell
- [x] `src/app/layout.tsx` — `<html>`, landmarks (`banner`/`main`/`contentinfo`), skip-to-main link, **meta-tag CSP** (per `security-requirements.md`), SEO/OpenGraph metadata
- [x] `src/app/page.tsx` — composes sections in the confirmed order; **desktop:** Experience left / AI Engineering right; **mobile:** AI Engineering first (locked at Rough Mockups, re-confirmed at Refined Mockups)

### Step 5: ThemeToggle (the only client component)
- [x] `src/components/ThemeToggle.tsx` — `'use client'`
- [x] `src/lib/theme.ts` — `resolveInitialTheme()` / `persistThemeOverride()` with the **documented failure handling**: `localStorage` unavailable → silent fallback to OS preference, no throw; write failure → silent no-op, toggle still works for the page view
- [x] Inline pre-hydration script to set the theme before first paint (prevents a flash of the wrong theme)
- [x] `aria-pressed`, dynamic `aria-label`, visible focus ring at 3:1, `data-testid`

### Step 6: Remaining shell components
- [x] `src/components/Header.tsx` — name, contact icons, composes `ThemeToggle` + `ExternalLink`
- [x] `src/components/ExternalLink.tsx` — `target="_blank"`, `rel="noopener noreferrer"`, visually-hidden "(opens in new tab)" for screen readers
- [x] `src/components/Hero.tsx` — `h1` (name) + role tagline
- [x] `src/components/Footer.tsx`
- [x] All server components except `ThemeToggle`

### Step 7: Placeholder content files
- [x] `src/content/*.mdx` — one per section, conforming to Step 2's schema, with **obviously placeholder** copy (e.g. "PLACEHOLDER — real content lands in Unit 2")
- [x] Section components render from these so the shell is genuinely deployable end-to-end

### Step 8: Tests
> **Volume note — please read, this is the one judgment call I'd like confirmed.** The stage's generic guidance for `Test Strategy: Standard` is "5–8 unit tests per component." But `team.md`'s Testing Posture (your affirmed Practices Discovery Q3 answer) explicitly **dropped numeric volume targets** for this project as a poor fit for a content site, replacing them with a named check set. I've planned to the named checks, not the quota. Say so at the gate if you'd rather have the higher volume.

- [x] `vitest.config.ts` + jsdom setup
- [x] `src/lib/theme.test.ts` — the **theme-toggle behavior check** confirmed at Practices Discovery Q4: state changes the render, preference persists across reload, `localStorage`-unavailable fallback doesn't throw
- [x] `src/components/ThemeToggle.test.tsx` — toggles, `aria-pressed` flips, `aria-label` updates, keyboard (Enter/Space) activation
- [x] `src/content/schema.test.ts` — the **content-schema validation** confirmed at Q5: valid frontmatter passes, malformed frontmatter fails
- [x] `src/components/ExternalLink.test.tsx` — `rel`/`target` correct, new-tab announcement present
- [x] Smoke render tests for `Header`, `Hero`, `Footer`

### Step 9: Documentation
- [x] Update root `README.md` — how to run, build, test; note that content is placeholder pending Unit 2

---

## Deliberately NOT in This Unit

- Real resume content, and the four content-section components — **Unit 2** owns those
- GitHub Actions CI workflow — **`ci-pipeline` (3.7)** owns it; this unit only must not block it
- DNS, CNAME, Hostinger forwarding — **`deployment-pipeline` (4.1)** owns those
- Any image optimization — no images are in the confirmed content model

## Story-to-Step Traceability

`user-stories` is SKIP for this scope; per `unit-of-work-story-map.md`, `requirements.md` carries the acceptance criteria in its place.

| Requirement | Step |
|---|---|
| Theme toggle (Rough Mockups Q3; NFR theme-toggle check) | 5, 8 |
| WCAG 2.1 AA structure — landmarks, skip link, focus | 4, 5, 6 |
| TypeScript (Practices Discovery Q8) | 1, all |
| Tailwind from confirmed tokens (ADR-3) | 1, 3 |
| MDX content pipeline + schema contract (ADR-2, units-generation Q4) | 2, 7 |
| Static export to GitHub Pages (Feasibility) | 1 |
| Meta-tag CSP (NFR Q3) | 4 |
| Lighthouse budget ≥90/95/90/90 (NFR Q1) | 3, 4, 5 (system fonts, minimal JS, static export) |
