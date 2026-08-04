import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  ExperienceSection,
  formatMonth,
  formatTenure,
  PRESENT_LABEL,
} from './ExperienceSection';
import { experience } from '@/content';
import type { ExperienceEntry } from '@/content/schema';

/**
 * These tests render the *real* content, not a fixture, wherever the assertion
 * is about a confirmed requirement. `requirements.md` names four specific
 * employers and one specific placement for the Vynkor line; a fixture would let
 * the content drift out from under a green suite.
 */

const VYNKOR_SUB_LINE =
  'Also builds AI-engineering side projects under Vynkor.';

function renderReal() {
  return render(
    <ExperienceSection heading={experience.heading} roles={experience.roles} />,
  );
}

describe('ExperienceSection — structure', () => {
  it('exposes the section as a region labelled by its h2', () => {
    renderReal();
    expect(
      screen.getByRole('heading', { level: 2, name: experience.heading }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('region', { name: experience.heading }),
    ).toBeInTheDocument();
  });

  it('introduces no h1 — Hero owns the page’s only one', () => {
    renderReal();
    expect(screen.queryAllByRole('heading', { level: 1 })).toHaveLength(0);
  });
});

describe('ExperienceSection — the four confirmed employers', () => {
  it('renders exactly the four employer blocks requirements.md names', () => {
    renderReal();

    const employers = screen
      .getAllByTestId('role-employer')
      .map((node) => node.textContent);

    expect(employers).toEqual([
      'Point & Pay',
      // Names the contracting client, matching how Syzygy already does. Both
      // are already disclosed in their own bullets ("Department of Defense
      // (Navy) clients"), so this surfaces an approved fact rather than adding
      // one.
      'HII Technical Solutions (Department of Defense - DoD)',
      'Syzygy Integration (Department of Homeland Security Contract)',
      'Palm Coast Data',
    ]);
  });

  it('keeps Point & Pay as one entry carrying the title progression', () => {
    renderReal();

    // requirements.md reconciles the Q5 miscount explicitly: the Senior SWE ->
    // Team Lead II change is a progression inside one continuous employer
    // entry, not two separate blocks.
    const pointAndPay = screen
      .getAllByTestId('role-employer')
      .filter((node) => node.textContent === 'Point & Pay');
    expect(pointAndPay).toHaveLength(1);

    const title = screen.getAllByTestId('role-title')[0];
    expect(title).toHaveTextContent('Team Lead II, Software Engineer');
    expect(title).toHaveTextContent('previously Senior Software Engineer');
  });

  it('publishes the disclosure decisions requirements.md confirmed', () => {
    renderReal();
    const section = screen.getByTestId('section-experience');

    // Each of these was decided per-item and re-confirmed at Q9 after the
    // permanent-public-indexing risk was raised. A silent drop is a regression.
    expect(section).toHaveTextContent('$50 million in annual ACH');
    expect(section).toHaveTextContent('NACHA-compliant file generation');
    expect(section).toHaveTextContent('PCI DSS compliance');
    expect(section).toHaveTextContent('EPX payment provider');
    expect(section).toHaveTextContent('fraud detection protocols');
    expect(section).toHaveTextContent('BigDecimal and Money objects');
    expect(section).toHaveTextContent('Bamboo to Jenkins');
    expect(section).toHaveTextContent('Managed AWS infrastructure');
    expect(section).toHaveTextContent('Secret Clearance');
    expect(section).toHaveTextContent('Department of Defense (Navy)');
    expect(section).toHaveTextContent('Department of Homeland Security');
  });
});

describe('ExperienceSection — the Vynkor line', () => {
  it('renders it as its own element, not merged into an employer bullet', () => {
    renderReal();

    const subLine = screen.getByTestId('role-sub-line');
    expect(subLine).toHaveTextContent(VYNKOR_SUB_LINE);

    // The requirement is placement, not just presence: "one short, clearly-
    // separate line... not folded into or blended with Point & Pay's own
    // achievement bullets" (`requirements.md`).
    expect(subLine.tagName).toBe('P');
    expect(subLine.closest('ul')).toBeNull();
    expect(subLine.closest('li[data-testid="role"]')).not.toBeNull();
  });

  it('keeps the text out of every bullet list on the page', () => {
    renderReal();

    for (const list of screen.getAllByTestId('role-bullets')) {
      expect(list.textContent).not.toContain('Vynkor');
    }
  });

  it('appears exactly once, under Point & Pay only', () => {
    renderReal();

    expect(screen.getAllByTestId('role-sub-line')).toHaveLength(1);

    const owner = screen
      .getByTestId('role-sub-line')
      .closest('li[data-testid="role"]') as HTMLElement;
    expect(within(owner).getByTestId('role-employer')).toHaveTextContent(
      'Point & Pay',
    );
  });

  it('stays readable — real text, no hiding, no ad-hoc dimming', () => {
    renderReal();
    const subLine = screen.getByTestId('role-sub-line');

    // `accessibility-checklist.md`: "'brief and vague' (a content decision)
    // must not be implemented as 'inaccessible' (an accessibility failure)."
    expect(subLine).toBeVisible();
    expect(subLine.className).not.toMatch(/\bhidden\b|\bsr-only\b|\bopacity-/);

    // Smaller and lighter, but through the same AA-verified secondary token the
    // rest of the page uses — not a bespoke grey.
    expect(subLine).toHaveClass('text-meta', 'text-text-secondary');
  });

  it('stays brief — a guard against a well-meaning expansion', () => {
    // No automated check can judge vagueness, but length is a cheap proxy for
    // the constraint most likely to be broken by accident.
    expect(VYNKOR_SUB_LINE.length).toBeLessThanOrEqual(80);
    expect(experience.roles[0]?.subLine).toBe(VYNKOR_SUB_LINE);
  });
});

describe('ExperienceSection — rendering from arbitrary frontmatter', () => {
  const role = (over: Partial<ExperienceEntry> = {}): ExperienceEntry => ({
    employer: 'An Employer',
    title: 'A Title',
    startDate: '2020-03',
    endDate: '2021-11',
    bullets: ['Did a thing.', 'Did another thing.'],
    ...over,
  });

  it('renders every bullet as a list item', () => {
    render(<ExperienceSection heading="Experience" roles={[role()]} />);

    const bullets = within(screen.getByTestId('role-bullets')).getAllByRole(
      'listitem',
    );
    expect(bullets.map((node) => node.textContent)).toEqual([
      'Did a thing.',
      'Did another thing.',
    ]);
  });

  it('omits the sub-line entirely when the role has none', () => {
    render(<ExperienceSection heading="Experience" roles={[role()]} />);
    expect(screen.queryByTestId('role-sub-line')).toBeNull();
  });

  it('renders a closed tenure and a current one differently', () => {
    render(
      <ExperienceSection
        heading="Experience"
        roles={[role({ endDate: null }), role({ employer: 'Older' })]}
      />,
    );

    const tenures = screen
      .getAllByTestId('role-tenure')
      .map((node) => node.textContent);
    expect(tenures).toEqual(['Mar 2020 – Present', 'Mar 2020 – Nov 2021']);
  });
});

describe('date formatting', () => {
  it('formats YYYY-MM without going through Date', () => {
    expect(formatMonth('2022-04')).toBe('Apr 2022');
    expect(formatMonth('2016-07')).toBe('Jul 2016');
    expect(formatMonth('2019-12')).toBe('Dec 2019');
  });

  it('renders a null end date as Present', () => {
    expect(formatTenure('2022-04', null)).toBe(`Apr 2022 – ${PRESENT_LABEL}`);
  });

  it('throws loudly on input the schema should already have rejected', () => {
    // Fail fast rather than degrade to a blank or the raw string: reaching
    // here means the renderer and `schema.ts` have drifted apart.
    expect(() => formatMonth('April 2022')).toThrow(RangeError);
    expect(() => formatMonth('2022-13')).toThrow(RangeError);
    expect(() => formatMonth('2022-00')).toThrow(RangeError);
    expect(() => formatMonth('')).toThrow(RangeError);
  });
});
