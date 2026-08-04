import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AIEngineeringSection, ITEM_SEPARATOR } from './AIEngineeringSection';
import { aiEngineering } from '@/content';

/**
 * ADR-1's format decision, guarded rather than merely documented.
 *
 * The "no links" half is the one most likely to be undone by a well-meaning
 * later edit — adding an anchor looks like an improvement — so it gets the
 * strongest assertions here.
 */

function renderReal() {
  return render(
    <AIEngineeringSection
      heading={aiEngineering.heading}
      items={aiEngineering.items}
    />,
  );
}

describe('AIEngineeringSection — ADR-1 format', () => {
  it('renders the items as one comma-separated plain-text run', () => {
    renderReal();

    expect(screen.getByTestId('ai-engineering-items')).toHaveTextContent(
      aiEngineering.items.join(ITEM_SEPARATOR),
    );
  });

  it('renders the confirmed items, in order, as one joined line', () => {
    renderReal();

    // The list was expanded by the site's owner at the redesign; ADR-1's
    // original five became eight. What ADR-1 actually constrains is the
    // *shape* — plain text, no links, no chip grid — and that is asserted
    // below and unchanged. The list itself is content, and content is theirs.
    expect(aiEngineering.items).toEqual([
      'AI governance for payments',
      'openclaw',
      'LiteLLM',
      'frontier model APIs',
      'agent recognition of environment differences via Terraform',
      'local inference with Ollama and llama.cpp',
      'self-hosted Qwen3.6',
      'AI-DLC',
    ]);
    expect(screen.getByTestId('ai-engineering-items')).toHaveTextContent(
      aiEngineering.items.join(', '),
    );
  });

  it('contains no anchor elements at all', () => {
    renderReal();
    const section = screen.getByTestId('section-ai-engineering');

    // Application Design Q6 declined even a link to this project's own GitHub
    // repository, because it would cross the line `requirements.md` Q8 drew.
    expect(section.querySelectorAll('a')).toHaveLength(0);
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });

  it('is not a card grid — no per-item element to hang a link on', () => {
    renderReal();
    const section = screen.getByTestId('section-ai-engineering');

    expect(section.querySelectorAll('ul, ol, li')).toHaveLength(0);
    // One text run, not five nodes.
    expect(screen.getByTestId('ai-engineering-items').children).toHaveLength(0);
  });

  it('keeps the section free of focusable elements', () => {
    renderReal();
    const section = screen.getByTestId('section-ai-engineering');

    // `page.tsx` reorders this section visually on wide screens and relies on
    // it holding nothing focusable for WCAG 2.4.3 to have nothing to trip over.
    expect(
      section.querySelectorAll(
        'a, button, input, select, textarea, [tabindex]',
      ),
    ).toHaveLength(0);
  });
});

describe('AIEngineeringSection — structure', () => {
  it('exposes the section as a region labelled by its h2', () => {
    renderReal();

    expect(
      screen.getByRole('heading', { level: 2, name: aiEngineering.heading }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('region', { name: aiEngineering.heading }),
    ).toBeInTheDocument();
  });

  it('renders a single item without a trailing separator', () => {
    render(<AIEngineeringSection heading="AI Engineering" items={['only']} />);
    expect(screen.getByTestId('ai-engineering-items')).toHaveTextContent(
      /^only$/,
    );
  });
});
