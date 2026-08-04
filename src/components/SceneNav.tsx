'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * The persistent scene chrome: a dot rail, a position counter, and a progress
 * bar.
 *
 * This is what makes a long page read as a deliberate sequence rather than an
 * unbounded scroll — you can see how many scenes exist, which one you are on,
 * and how far through you are, without having scrolled to the end to find out.
 *
 * ## It is an enhancement, never the only way through
 *
 * Every target is reachable by ordinary scrolling with this component absent,
 * disabled, or still loading. It renders nothing at all until it has found the
 * scenes, so a JavaScript failure costs the rail and nothing else.
 *
 * ## Why it reads the DOM instead of taking a list of scenes
 *
 * The scenes are authored across four different components and the content
 * files. Passing a manifest down would create a second source of truth that
 * silently desynchronises the moment an employer is added — the rail would
 * show five dots for six jobs. Querying `[data-snap]` means the rail is
 * derived from the page rather than asserted about it.
 *
 * ## Accessibility
 *
 * A real `<nav>` with real buttons: reachable by keyboard, each with an
 * accessible name naming its destination. The counter and progress bar are
 * `aria-hidden` — they visualise scroll position, which a screen-reader user
 * already tracks through focus and reading order, and announcing "scene 3 of
 * 8" on every scroll would be noise.
 */

interface Scene {
  /** The element to scroll to. */
  element: HTMLElement;
  /** Human-readable destination, used for the accessible name and tooltip. */
  label: string;
}

/** Best available name for a scene, in descending order of specificity. */
function labelFor(element: HTMLElement, index: number): string {
  const employer = element.querySelector('[data-testid="role-employer"]');
  if (employer?.textContent) return employer.textContent;

  const heading = element.querySelector('h1, h2');
  if (heading?.textContent) return heading.textContent;

  return `Section ${index + 1}`;
}

export function SceneNav() {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let observer: IntersectionObserver | undefined;

    /*
     * The DOM read and the resulting setState run inside a frame callback
     * rather than in the effect body. Two reasons, and the second is the real
     * one:
     *
     *  - `react-hooks/set-state-in-effect` is an error in this config, and a
     *    synchronous setState here would be a second render pass on mount.
     *  - the scenes are sized by CSS that has not necessarily been applied
     *    when the effect runs, so reading them a frame later is also simply
     *    more correct.
     */
    const frame = requestAnimationFrame(() => {
      const elements = [
        ...document.querySelectorAll<HTMLElement>('[data-snap]'),
      ];
      if (elements.length < 2) return;

      setScenes(
        elements.map((element, index) => ({
          element,
          label: labelFor(element, index),
        })),
      );

      if (typeof IntersectionObserver !== 'function') return;

      // The most-visible scene wins, rather than the first to intersect. With
      // viewport-tall scenes two are briefly visible mid-scroll, and taking
      // the first would flicker the active dot backwards.
      observer = new IntersectionObserver(
        (entries) => {
          let best = -1;
          let bestRatio = 0;
          for (const entry of entries) {
            if (entry.intersectionRatio <= bestRatio) continue;
            const index = elements.indexOf(entry.target as HTMLElement);
            if (index === -1) continue;
            best = index;
            bestRatio = entry.intersectionRatio;
          }
          if (best !== -1) setActive(best);
        },
        { threshold: [0.25, 0.5, 0.75] },
      );

      for (const element of elements) observer.observe(element);
    });

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const scene = scenes[index];
      if (scene === undefined) return;
      const reduceMotion =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      scene.element.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    },
    [scenes],
  );

  // Nothing to navigate: render nothing rather than an empty rail.
  if (scenes.length < 2) return null;

  const progress = ((active + 1) / scenes.length) * 100;

  return (
    <>
      <nav
        aria-label="Sections"
        data-testid="scene-nav"
        className="fixed top-1/2 right-xs z-40 hidden -translate-y-1/2 desktop:block"
      >
        <ul className="flex flex-col items-end gap-2xs">
          {scenes.map((scene, index) => (
            <li key={scene.label}>
              <button
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Go to ${scene.label}`}
                aria-current={index === active}
                data-active={index === active}
                className="scene-nav-button"
              >
                <span aria-hidden="true" className="scene-nav-label">
                  {scene.label}
                </span>
                <span aria-hidden="true" className="scene-nav-dot" />
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <p
        aria-hidden="true"
        data-testid="scene-counter"
        className="fixed bottom-sm left-gutter z-40 hidden text-label font-extrabold text-text-tertiary desktop:block"
      >
        <span className="text-text-primary">
          {String(active + 1).padStart(2, '0')}
        </span>
        {' / '}
        {String(scenes.length).padStart(2, '0')}
      </p>

      <div
        aria-hidden="true"
        data-testid="scene-progress"
        className="fixed inset-x-0 bottom-0 z-40 h-0.5 bg-hairline"
      >
        <span
          className="block h-full bg-accent-section transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </>
  );
}
