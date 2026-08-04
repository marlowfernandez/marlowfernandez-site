import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

/**
 * jsdom implements no `ResizeObserver`. `BulletSlider` constructs one, so every
 * test that renders the Experience section or the page would throw without
 * this.
 *
 * Deliberately a no-op that never fires its callback: this stub exists to make
 * the API *present*, nothing more. Tests that need measurement to actually
 * happen — currently only `BulletSlider.test.tsx` — install their own version
 * that fires, alongside the `clientWidth`/`scrollWidth` stubs it needs to be
 * meaningful. Firing here instead would hand every other test a fake layout
 * they never asked for, and the component would report page counts derived
 * from jsdom's universal zeroes.
 */
if (!('ResizeObserver' in globalThis)) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}

/**
 * Same story for `IntersectionObserver`, which jsdom also lacks. `SceneNav`
 * and `RevealController` both construct one.
 *
 * Also inert. A firing stub would have to invent intersection ratios, and
 * every scroll-position assertion built on invented ratios would be a test of
 * the stub rather than of the component.
 */
if (!('IntersectionObserver' in globalThis)) {
  globalThis.IntersectionObserver = class {
    readonly root = null;
    readonly rootMargin = '';
    readonly thresholds: readonly number[] = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  } as unknown as typeof IntersectionObserver;
}

afterEach(() => {
  cleanup();
  // The theme attribute lives on <html>, which React Testing Library's cleanup
  // does not touch. Leaving it set would let one test's theme leak into the
  // next one's initial state.
  document.documentElement.removeAttribute('data-theme');
});
