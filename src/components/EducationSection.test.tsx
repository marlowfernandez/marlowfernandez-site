import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { EducationSection } from './EducationSection';
import { education } from '@/content';
import type { EducationEntry } from '@/content/schema';

function renderReal() {
  return render(
    <EducationSection
      heading={education.heading}
      education={education.education}
    />,
  );
}

describe('EducationSection — the confirmed content', () => {
  it('renders the degree at the detail requirements.md confirms', () => {
    renderReal();
    const section = screen.getByTestId('section-education');

    expect(section).toHaveTextContent(
      'Bachelor of Science, Mobile Development',
    );
    expect(section).toHaveTextContent('Full Sail University');
    expect(section).toHaveTextContent('2017');
    expect(section).toHaveTextContent('GPA 3.4');
    expect(section).toHaveTextContent('Salutatorian Honors');
  });

  it('renders the certification including its verification code', () => {
    renderReal();
    const section = screen.getByTestId('section-education');

    expect(section).toHaveTextContent('CompTIA');
    expect(section).toHaveTextContent('Security+');
    expect(section).toHaveTextContent('July 2021');
    // requirements.md Q7 confirmed publishing the code itself.
    expect(section).toHaveTextContent('Verification: GET0SGFF7HRQQPWC');
  });

  it('publishes the code as text, not as a verification link', () => {
    renderReal();

    // requirements.md confirms "the verification code", not a link to
    // verify.comptia.org. This unit adds nothing the requirements do not name.
    expect(
      screen.getByTestId('section-education').querySelectorAll('a'),
    ).toHaveLength(0);
  });

  it('carries exactly the two confirmed credentials', () => {
    renderReal();
    expect(screen.getAllByTestId('education-entry')).toHaveLength(2);
  });
});

describe('EducationSection — rendering from arbitrary frontmatter', () => {
  const entry = (over: Partial<EducationEntry> = {}): EducationEntry => ({
    institution: 'A School',
    credential: 'A Degree',
    year: 2017,
    ...over,
  });

  it('exposes the section as a region labelled by its h2', () => {
    render(<EducationSection heading="Education" education={[entry()]} />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Education' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('region', { name: 'Education' }),
    ).toBeInTheDocument();
  });

  it('renders institution and year alongside the credential', () => {
    render(<EducationSection heading="Education" education={[entry()]} />);

    const item = screen.getByTestId('education-entry');
    expect(within(item).getByTestId('education-credential')).toHaveTextContent(
      'A Degree',
    );
    expect(within(item).getByTestId('education-institution')).toHaveTextContent(
      'A School',
    );
    expect(within(item).getByTestId('education-year')).toHaveTextContent(
      '2017',
    );
  });

  it('omits the detail line entirely when an entry has none', () => {
    render(<EducationSection heading="Education" education={[entry()]} />);
    expect(screen.queryByTestId('education-detail')).toBeNull();
  });

  it('renders the detail line when present', () => {
    render(
      <EducationSection
        heading="Education"
        education={[entry({ detail: 'GPA 4.0' })]}
      />,
    );
    expect(screen.getByTestId('education-detail')).toHaveTextContent('GPA 4.0');
  });

  it('renders one list item per credential', () => {
    render(
      <EducationSection
        heading="Education"
        education={[entry(), entry({ credential: 'Another Degree' })]}
      />,
    );
    expect(screen.getAllByTestId('education-entry')).toHaveLength(2);
  });
});
