'use client';

import { useEffect } from 'react';

import { REVEAL_READY_FLAG } from '@/lib/theme-script';

/**
 * Reveals `[data-reveal]` elements as they enter the viewport.
 *
 * ## One controller, not one island per element
 *
 * Mounted once and renders `null`. Every other component stays a server
 * component and opts in by adding a `data-reveal` attribute — no per-element
 * `'use client'`, no wrapper component, no props threading. The whole cost of
 * the effect is this file plus one observer.
 *
 * ## Why IntersectionObserver and not `animation-timeline: view()`
 *
 * Scroll-driven CSS animations would need no JavaScript at all, but they are
 * Chromium-only: no Safari, no Firefox. Adopting them would mean shipping the
 * observer anyway as a fallback, so it would be two mechanisms for one effect.
 * If support broadens, the upgrade path is an `@supports` block with this as
 * the base — not a replacement.
 *
 * ## No React state
 *
 * The callback mutates `classList` directly. State here would re-render the
 * whole page on every scroll, and `react-hooks/set-state-in-effect` is an
 * error in this config besides.
 *
 * Elements are unobserved on first reveal: the animation plays once, so
 * continuing to watch them is wasted work on every subsequent scroll.
 */
export function RevealController() {
  useEffect(() => {
    // Cancel the pre-paint failsafe first, before any early return below. The
    // inline script un-hides everything if this flag is missing after two
    // seconds; reaching this line at all means reveals are being handled.
    (window as unknown as Record<string, boolean>)[REVEAL_READY_FLAG] = true;

    const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
    if (targets.length === 0) return;

    // Honour the OS setting here as well as in CSS. The stylesheet already
    // neutralises the transition, but skipping the observer entirely means no
    // scroll-time work at all for a visitor who asked for less motion.
    const reduceMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || typeof IntersectionObserver !== 'function') {
      // Reveal everything immediately rather than leaving it hidden. The CSS
      // is gated on `data-js`, so an element that never gets `is-revealed`
      // would otherwise stay at opacity 0 for the rest of the session.
      for (const target of targets) target.classList.add('is-revealed');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      },
      {
        // A little before the element reaches the viewport edge, so the
        // transition is already underway by the time it is properly in view.
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.05,
      },
    );

    for (const target of targets) observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
