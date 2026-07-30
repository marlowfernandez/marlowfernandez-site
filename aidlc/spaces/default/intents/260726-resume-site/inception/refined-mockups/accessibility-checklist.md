# Accessibility Checklist — marlowfernandez.com

**Intent:** `260726-resume-site` · **Stage:** refined-mockups
**Target:** WCAG 2.1 AA, confirmed at Rough Mockups (Q5 of that stage)

## Structure

- [ ] Single `h1` per page (the name, in the header)
- [ ] `h2` for each major section: Experience, AI Engineering, Education & Certification, Contact
- [ ] Landmark regions present: `banner` (header), `main`, `contentinfo` (footer) — no `nav` landmark needed since Direction C has no navigation menu (per `wireframes.md`)
- [ ] Skip-to-main-content link before the header, for keyboard users

## Color & Contrast

- [ ] All text/background pairs in `design-system-mapping.md` hold 4.5:1 in both light and dark themes
- [ ] Theme toggle icon and focus ring hold 3:1 against both theme backgrounds
- [ ] No information conveyed by color alone (e.g., visited-vs-unvisited external links must not rely only on a color change)

## Keyboard Navigation

- [ ] Every interactive element (theme toggle, all links) reachable via Tab, in a logical order matching visual layout
- [ ] Visible focus indicator on every focusable element, holding the 3:1 contrast requirement above
- [ ] Theme toggle activatable via Enter and Space
- [ ] No keyboard trap anywhere on the page

## Screen Reader Support

- [ ] Theme toggle has an `aria-label` that updates to reflect the action it will perform next ("Switch to dark theme" / "Switch to light theme")
- [ ] External links (LinkedIn, AI Engineering project links) announce that they open in a new tab, before activation
- [ ] Contact information (email, phone) is readable as plain text, not embedded in an image

## Responsive & Zoom

- [ ] Layout remains usable at 200% browser zoom
- [ ] No horizontal scrolling introduced at any of the three confirmed breakpoints (mobile/tablet/desktop)
- [ ] Touch targets (theme toggle, links) meet a minimum 44×44px tappable area on mobile

## Motion

- [ ] No animation beyond what the underlying framework provides by default (`scope-document.md`'s confirmed exclusion) — this also means no motion-sickness/vestibular-disorder concern to check, since there is deliberately none to design

## Content

- [ ] No content relies on hover-only interaction (all information accessible via keyboard/touch)
- [ ] Vynkor sub-line under Point & Pay remains readable as plain text at the confirmed lighter visual weight, not hidden via `display: none` or low-enough contrast to fail the AA ratio above — "brief and vague" (a content decision) must not be implemented as "inaccessible" (an accessibility failure)

## Assumptions & Open Questions

None. This checklist operationalizes the WCAG 2.1 AA target confirmed at Rough Mockups into concrete, verifiable items; each item traces to either that confirmed target or a specific decision made earlier in this stage.
