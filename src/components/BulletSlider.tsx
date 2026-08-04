'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  clampPage,
  pageCount as computePageCount,
  pageIndex as computePageIndex,
  pageOffset,
} from './slider-paging';

/**
 * Horizontal pagination for one employer's achievement bullets.
 *
 * ## Why this exists
 *
 * Point & Pay carries 15 bullets, most of them two to four sentences. Rendered
 * as one vertical list in the redesigned layout, that single employer runs
 * longer than the rest of the page combined. Paginating gives the section a
 * fixed visual footprint without dropping a word — the confirmed requirement
 * was "show everything", not "show the best three".
 *
 * ## Manual advance, never a timer
 *
 * An auto-advancing carousel was considered and rejected. Fifteen items at
 * three seconds each is forty-five seconds of forced waiting, during which a
 * reader who wants to finish one bullet has to fight the component. WCAG 2.2.2
 * would also require a pause control, so the "simpler" auto version is in fact
 * the one with more moving parts.
 *
 * ## Find-in-page: the constraint that shapes everything
 *
 * Every bullet stays mounted, visible, and un-hidden at all times. Off-screen
 * pages are clipped by a real scroll container, nothing more.
 *
 * This rules out the three usual carousel techniques on purpose:
 *
 *   - conditional rendering and `display: none` both remove the text from
 *     Ctrl+F, and from `ExperienceSection.test.tsx`'s content assertions;
 *   - `inert` looks like the right tool and is not — the HTML spec excludes
 *     inert subtrees from find-in-page, so it trades the exact property this
 *     component exists to preserve.
 *
 * That leaves the question `inert` normally answers: how do off-screen pages
 * stay out of the tab order? They do so **because a slide contains nothing
 * focusable**. Bullets are plain prose; the only controls live outside the
 * track. Screen-reader users get all fifteen read linearly, which for a resume
 * is better than the sighted pagination, not worse.
 *
 * **This is load-bearing.** Put a link inside a bullet and the contract breaks
 * — off-screen anchors become tab-reachable, and the fix would be `inert`, at
 * the cost of find-in-page. `BulletSlider.test.tsx` asserts it rather than
 * trusting this comment.
 *
 * ## Progressive enhancement
 *
 * The track is a native scroll container, so with JavaScript disabled it is
 * still a usable, swipeable, keyboard-scrollable list. JS adds the buttons and
 * the page counter and nothing else — matching how the theme system already
 * treats no-JS as a supported state rather than a degraded one.
 */

export interface BulletSliderProps {
  /** Every bullet for this employer. All of them render; none are dropped. */
  bullets: string[];
  /** Employer name, used to disambiguate the controls for screen readers. */
  employer: string;
  /** Stable index, used for element ids. */
  index: number;
  className?: string;
}

/**
 * Rows per page. Four keeps Point & Pay at four pages and every other employer
 * at one or two, so no scene turns into a slideshow.
 */
const ROWS_PER_PAGE = 4;

export function BulletSlider({
  bullets,
  employer,
  index,
  className,
}: BulletSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(0);
  /**
   * Whether the current page change should be announced.
   *
   * Set by a control press, cleared by scrolling. A single swipe crosses
   * several intermediate positions, and announcing each one would flood a
   * screen reader with "page 2 of 4, page 3 of 4, page 4 of 4" — so only
   * deliberate activation speaks.
   */
  const [announce, setAnnounce] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (track === null) return;

    // Measurement runs in observer callbacks, never in this effect body.
    // `react-hooks/set-state-in-effect` is an error in this project's ESLint
    // config, and it is right to be: a synchronous setState here would be a
    // second render pass on every mount. ResizeObserver fires once on
    // `observe()`, which covers the initial measurement for free.
    const resize = new ResizeObserver(() => {
      setPages(computePageCount(track.scrollWidth, track.clientWidth));
      setPage(computePageIndex(track.scrollLeft, track.clientWidth));
    });
    resize.observe(track);

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setAnnounce(false);
        setPage(computePageIndex(track.scrollLeft, track.clientWidth));
      });
    };
    track.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      resize.disconnect();
      track.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const goTo = useCallback(
    (target: number) => {
      const track = trackRef.current;
      if (track === null) return;

      const next = clampPage(target, pages);
      // Already at the end: do nothing rather than disabling the button. A
      // `disabled` button loses focus the moment it disables, which strands a
      // reader who was clicking through to the last page.
      if (next === page) return;
      setAnnounce(true);

      const reduceMotion =
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Absolute target, never scrollBy — Safari's snap implementation lands
      // relative scrolls unpredictably.
      track.scrollTo({
        left: pageOffset(next, track.clientWidth),
        behavior: reduceMotion ? 'auto' : 'smooth',
      });
      setPage(next);
    },
    [page, pages],
  );

  const trackId = `bullets-${index}`;
  // Ids are keyed on the index, not a slug of the employer: two of the four
  // names contain punctuation and parentheses that make for fragile ids.

  const atStart = page <= 0;
  const atEnd = page >= pages - 1;
  const paginated = pages > 1;

  return (
    <div
      data-testid="bullet-slider"
      {...(className === undefined ? {} : { className })}
    >
      <div
        ref={trackRef}
        id={trackId}
        role="group"
        aria-label={`${employer} achievements`}
        /*
         * Focusable because it scrolls. A scrollable region with no keyboard
         * access is an axe violation (`scrollable-region-focusable`) and would
         * cost the accessibility budget that gates deploys — but more to the
         * point, arrow-key scrolling is how a keyboard user reads a page they
         * cannot swipe.
         */
        tabIndex={0}
        className="slider-track"
      >
        <ol
          data-testid="role-bullets"
          className="slider-pages"
          style={{ '--slider-rows': ROWS_PER_PAGE } as React.CSSProperties}
        >
          {bullets.map((bullet) => (
            <li key={bullet} className="slider-bullet">
              {bullet}
            </li>
          ))}
        </ol>
      </div>

      {/*
        Controls render only when there is something to page through. Syzygy
        has four bullets and therefore one page; a dead dot there would be
        worse than no control at all.

        The wrapper reserves its height unconditionally so that the
        post-hydration appearance of the buttons cannot shift the layout — the
        one real CLS risk in this component.
      */}
      <div
        data-testid="bullet-slider-controls"
        className="slider-controls"
        aria-hidden={!paginated}
      >
        {paginated ? (
          <>
            <button
              type="button"
              onClick={() => goTo(page - 1)}
              aria-controls={trackId}
              aria-disabled={atStart}
              aria-label={`Previous achievements, ${employer}`}
              className="slider-button"
            >
              <ChevronIcon direction="left" />
            </button>

            <span className="slider-dots">
              {Array.from({ length: pages }, (_, dot) => (
                <button
                  key={dot}
                  type="button"
                  onClick={() => goTo(dot)}
                  aria-controls={trackId}
                  aria-current={dot === page}
                  aria-label={`Achievements page ${dot + 1} of ${pages}, ${employer}`}
                  className="slider-dot"
                  data-active={dot === page}
                />
              ))}
            </span>

            <button
              type="button"
              onClick={() => goTo(page + 1)}
              aria-controls={trackId}
              aria-disabled={atEnd}
              aria-label={`Next achievements, ${employer}`}
              className="slider-button"
            >
              <ChevronIcon direction="right" />
            </button>
          </>
        ) : null}
      </div>

      {/*
        Announced only for deliberate control activation, never for raw
        scrolling. Focus deliberately stays on the pressed control — moving it
        into the newly-visible page is the classic carousel mistake, stealing
        focus from the button the reader is about to press again.
      */}
      <p className="sr-only" aria-live="polite" data-testid="bullet-status">
        {paginated && announce ? `Page ${page + 1} of ${pages}` : ''}
      </p>
    </div>
  );
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d={direction === 'left' ? 'M15 6 L9 12 L15 18' : 'M9 6 L15 12 L9 18'}
      />
    </svg>
  );
}
