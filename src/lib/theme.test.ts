import { afterEach, describe, expect, it, vi } from 'vitest';

import { THEME_INIT_SCRIPT } from './theme-script';
import {
  THEME_ATTRIBUTE,
  THEME_STORAGE_KEY,
  applyTheme,
  isTheme,
  oppositeTheme,
  persistThemeOverride,
  readAppliedTheme,
  readStoredTheme,
  resolveInitialTheme,
  resolveSystemTheme,
} from './theme';

/**
 * The theme-toggle behaviour check confirmed at Practices Discovery Q4.
 *
 * `team.md` dropped the numeric coverage floor for this project, so these tests
 * are scoped to the named checks rather than a per-function quota: state
 * changes the render, the preference survives a reload, and the
 * localStorage-unavailable path does not throw.
 */

// --- test doubles -----------------------------------------------------------

/** An in-memory localStorage that behaves normally. */
function installWorkingStorage(seed: Record<string, string> = {}) {
  const data = new Map(Object.entries(seed));
  const storage = {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
    clear: () => data.clear(),
    key: (index: number) => [...data.keys()][index] ?? null,
    get length() {
      return data.size;
    },
  };
  Object.defineProperty(window, 'localStorage', {
    value: storage,
    configurable: true,
    writable: true,
  });
  return data;
}

/**
 * A localStorage that throws on every access — what browsers actually do in
 * some private-browsing and blocked-storage configurations.
 */
function installThrowingStorage() {
  const boom = () => {
    throw new DOMException('storage is not available', 'SecurityError');
  };
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: boom,
      setItem: boom,
      removeItem: boom,
      clear: boom,
      key: boom,
      length: 0,
    },
    configurable: true,
    writable: true,
  });
}

/** jsdom ships no matchMedia, so the OS preference has to be simulated. */
function installMatchMedia(prefersDark: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    value: (query: string) => ({
      matches: query.includes('dark') && prefersDark,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
    configurable: true,
    writable: true,
  });
}

function removeMatchMedia() {
  Reflect.deleteProperty(window, 'matchMedia');
}

afterEach(() => {
  Reflect.deleteProperty(window, 'localStorage');
  removeMatchMedia();
  vi.restoreAllMocks();
});

// --- tests ------------------------------------------------------------------

describe('isTheme / oppositeTheme', () => {
  it('accepts only the two theme literals', () => {
    expect(isTheme('light')).toBe(true);
    expect(isTheme('dark')).toBe(true);
    expect(isTheme('DARK')).toBe(false);
    expect(isTheme(null)).toBe(false);
    expect(isTheme(undefined)).toBe(false);
  });

  it('flips a theme', () => {
    expect(oppositeTheme('light')).toBe('dark');
    expect(oppositeTheme('dark')).toBe('light');
  });
});

describe('readStoredTheme', () => {
  it('returns the stored override', () => {
    installWorkingStorage({ [THEME_STORAGE_KEY]: 'dark' });
    expect(readStoredTheme()).toBe('dark');
  });

  it('returns null when nothing is stored', () => {
    installWorkingStorage();
    expect(readStoredTheme()).toBeNull();
  });

  it('returns null for a stored value that is not a theme', () => {
    installWorkingStorage({ [THEME_STORAGE_KEY]: 'chartreuse' });
    expect(readStoredTheme()).toBeNull();
  });

  it('does not throw when localStorage is unavailable', () => {
    installThrowingStorage();
    expect(() => readStoredTheme()).not.toThrow();
    expect(readStoredTheme()).toBeNull();
  });
});

describe('resolveSystemTheme', () => {
  it('reads the OS dark preference', () => {
    installMatchMedia(true);
    expect(resolveSystemTheme()).toBe('dark');
  });

  it('reads the OS light preference', () => {
    installMatchMedia(false);
    expect(resolveSystemTheme()).toBe('light');
  });

  it('falls back to light when matchMedia is unavailable', () => {
    removeMatchMedia();
    expect(resolveSystemTheme()).toBe('light');
  });
});

describe('resolveInitialTheme', () => {
  it('prefers a stored override over the OS preference', () => {
    installWorkingStorage({ [THEME_STORAGE_KEY]: 'light' });
    installMatchMedia(true);
    expect(resolveInitialTheme()).toBe('light');
  });

  it('tracks the OS preference when no override exists', () => {
    installWorkingStorage();
    installMatchMedia(true);
    expect(resolveInitialTheme()).toBe('dark');
  });

  it('falls back to the OS preference when localStorage throws', () => {
    installThrowingStorage();
    installMatchMedia(true);
    expect(resolveInitialTheme()).toBe('dark');
  });
});

describe('persistThemeOverride', () => {
  it('writes the explicit choice', () => {
    const data = installWorkingStorage();
    persistThemeOverride('dark');
    expect(data.get(THEME_STORAGE_KEY)).toBe('dark');
  });

  it('no-ops silently when the write is rejected', () => {
    installThrowingStorage();
    expect(() => persistThemeOverride('dark')).not.toThrow();
  });

  it('preference survives a reload', () => {
    // "Reload" is simulated by persisting, then resolving from scratch against
    // the same storage while the OS preference says the opposite.
    const data = installWorkingStorage();
    installMatchMedia(true);

    persistThemeOverride('light');

    expect(data.get(THEME_STORAGE_KEY)).toBe('light');
    expect(resolveInitialTheme()).toBe('light');
  });
});

describe('applyTheme / readAppliedTheme', () => {
  it('round-trips through the document attribute', () => {
    applyTheme('dark');
    expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe('dark');
    expect(readAppliedTheme()).toBe('dark');
  });

  it('returns null when the attribute was never set', () => {
    document.documentElement.removeAttribute(THEME_ATTRIBUTE);
    expect(readAppliedTheme()).toBeNull();
  });
});

describe('THEME_INIT_SCRIPT (pre-hydration)', () => {
  /**
   * Executes the shipped script string itself, not a re-implementation of it.
   * `theme-script.ts` duplicates `theme.ts`'s logic out of necessity (it must
   * run before any module system exists), so this is the check that keeps the
   * two from drifting.
   */
  function runInitScript() {
    document.documentElement.removeAttribute(THEME_ATTRIBUTE);
    new Function(THEME_INIT_SCRIPT)();
  }

  it('applies a stored override', () => {
    installWorkingStorage({ [THEME_STORAGE_KEY]: 'dark' });
    installMatchMedia(false);
    runInitScript();
    expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe('dark');
  });

  it('falls back to the OS preference when no override exists', () => {
    installWorkingStorage();
    installMatchMedia(true);
    runInitScript();
    expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe('dark');
  });

  it('ignores a stored value that is not a theme', () => {
    installWorkingStorage({ [THEME_STORAGE_KEY]: 'chartreuse' });
    installMatchMedia(false);
    runInitScript();
    expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe(
      'light',
    );
  });

  it('still resolves a theme when localStorage is unavailable', () => {
    installThrowingStorage();
    installMatchMedia(true);
    expect(() => runInitScript()).not.toThrow();
    expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe('dark');
  });

  it('references the same storage key and attribute as the module', () => {
    expect(THEME_INIT_SCRIPT).toContain(JSON.stringify(THEME_STORAGE_KEY));
    expect(THEME_INIT_SCRIPT).toContain(JSON.stringify(THEME_ATTRIBUTE));
  });
});
