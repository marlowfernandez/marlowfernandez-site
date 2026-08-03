import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ThemeToggle } from './ThemeToggle';
import { THEME_ATTRIBUTE, THEME_STORAGE_KEY } from '@/lib/theme';

/**
 * The rendered half of the theme-toggle check (Practices Discovery Q4):
 * activation changes what is rendered, the accessible state and name follow,
 * and the storage-unavailable path degrades instead of breaking.
 */

let storage: Map<string, string>;

function installStorage(seed: Record<string, string> = {}) {
  storage = new Map(Object.entries(seed));
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    writable: true,
    value: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => void storage.set(key, value),
      removeItem: (key: string) => void storage.delete(key),
      clear: () => storage.clear(),
      key: () => null,
      length: 0,
    },
  });
}

function installThrowingStorage() {
  const boom = () => {
    throw new DOMException('storage is not available', 'SecurityError');
  };
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    writable: true,
    value: {
      getItem: boom,
      setItem: boom,
      removeItem: boom,
      clear: boom,
      key: boom,
      length: 0,
    },
  });
}

function installMatchMedia(prefersDark: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches: query.includes('dark') && prefersDark,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  });
}

beforeEach(() => {
  installStorage();
  installMatchMedia(false);
});

afterEach(() => {
  Reflect.deleteProperty(window, 'localStorage');
  Reflect.deleteProperty(window, 'matchMedia');
});

describe('ThemeToggle', () => {
  it('adopts the theme already applied to the document', async () => {
    document.documentElement.setAttribute(THEME_ATTRIBUTE, 'dark');
    render(<ThemeToggle />);

    const button = await screen.findByTestId('theme-toggle');
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAccessibleName('Switch to light theme');
  });

  it('resolves from the OS preference when nothing was pre-applied', async () => {
    installMatchMedia(true);
    render(<ThemeToggle />);

    const button = await screen.findByTestId('theme-toggle');
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('flips aria-pressed, the label, and the document theme on click', async () => {
    const user = userEvent.setup();
    document.documentElement.setAttribute(THEME_ATTRIBUTE, 'light');
    render(<ThemeToggle />);

    const button = await screen.findByTestId('theme-toggle');
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveAccessibleName('Switch to dark theme');

    await user.click(button);

    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAccessibleName('Switch to light theme');
    expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe('dark');
  });

  it('persists the explicit choice', async () => {
    const user = userEvent.setup();
    document.documentElement.setAttribute(THEME_ATTRIBUTE, 'light');
    render(<ThemeToggle />);

    await user.click(await screen.findByTestId('theme-toggle'));

    expect(storage.get(THEME_STORAGE_KEY)).toBe('dark');
  });

  it('activates with Enter and with Space, and keeps focus', async () => {
    const user = userEvent.setup();
    document.documentElement.setAttribute(THEME_ATTRIBUTE, 'light');
    render(<ThemeToggle />);

    const button = await screen.findByTestId('theme-toggle');
    await user.tab();
    expect(button).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe('dark');

    await user.keyboard(' ');
    expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe(
      'light',
    );

    // Focus management: activation must not move focus off the toggle
    // (`interaction-spec.md`, Accessibility).
    expect(button).toHaveFocus();
  });

  it('keeps working for the page view when persistence is unavailable', async () => {
    const user = userEvent.setup();
    installThrowingStorage();
    document.documentElement.setAttribute(THEME_ATTRIBUTE, 'light');
    render(<ThemeToggle />);

    const button = await screen.findByTestId('theme-toggle');
    await user.click(button);

    // No throw, and the switch still took effect.
    expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe('dark');
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('renders both icons so the glyph is correct before hydration', () => {
    render(<ThemeToggle />);
    expect(screen.getByTestId('theme-toggle-icon-sun')).toBeInTheDocument();
    expect(screen.getByTestId('theme-toggle-icon-moon')).toBeInTheDocument();
  });
});
