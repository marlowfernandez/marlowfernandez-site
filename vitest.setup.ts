import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
  cleanup();
  // The theme attribute lives on <html>, which React Testing Library's cleanup
  // does not touch. Leaving it set would let one test's theme leak into the
  // next one's initial state.
  document.documentElement.removeAttribute('data-theme');
});
