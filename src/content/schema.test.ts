import { describe, expect, it } from 'vitest';

import {
  ContentSchemaError,
  assertValid,
  validateAIEngineeringFrontmatter,
  validateContactFrontmatter,
  validateEducationFrontmatter,
  validateExperienceFrontmatter,
  validateHeroFrontmatter,
} from './schema';

/**
 * The content-schema validation check confirmed at Practices Discovery Q5.
 *
 * These validators are the Unit 1 / Unit 2 integration contract, so the tests
 * are written from both sides: a conforming payload must pass, and each
 * realistic authoring mistake must fail with a path that says where.
 */

const validHero = {
  section: 'hero',
  name: 'A Name',
  tagline: 'A tagline',
};

const validExperience = {
  section: 'experience',
  heading: 'Experience',
  roles: [
    {
      employer: 'An Employer',
      title: 'A Title',
      startDate: '2022-04',
      endDate: null,
      bullets: ['Did a thing.'],
      subLine: 'A sub-line.',
    },
  ],
};

const validAIEngineering = {
  section: 'ai-engineering',
  heading: 'AI Engineering',
  items: ['one', 'two'],
};

const validEducation = {
  section: 'education',
  heading: 'Education & Certification',
  education: [{ institution: 'A School', credential: 'A Degree', year: 2017 }],
};

const validContact = {
  section: 'contact',
  heading: 'Say hello',
  contact: {
    email: 'someone@example.invalid',
    phone: '000-000-0000',
    linkedInUrl: 'https://example.invalid/in/someone',
  },
};

/** Deep-clones a fixture so a mutation in one test cannot leak into another. */
function clone<T>(value: T): T {
  return structuredClone(value);
}

function issuePaths(result: ReturnType<typeof validateHeroFrontmatter>) {
  return result.ok ? [] : result.issues.map((issue) => issue.path);
}

describe('valid frontmatter passes', () => {
  it('accepts every section shape', () => {
    expect(validateHeroFrontmatter(validHero).ok).toBe(true);
    expect(validateExperienceFrontmatter(validExperience).ok).toBe(true);
    expect(validateAIEngineeringFrontmatter(validAIEngineering).ok).toBe(true);
    expect(validateEducationFrontmatter(validEducation).ok).toBe(true);
    expect(validateContactFrontmatter(validContact).ok).toBe(true);
  });

  it('returns the parsed value, not just a boolean', () => {
    const result = validateContactFrontmatter(validContact);
    expect(result.ok && result.value.contact.email).toBe(
      'someone@example.invalid',
    );
  });

  it('treats subLine and endDate as genuinely optional', () => {
    const role = clone(validExperience);
    const first = role.roles[0]!;
    delete (first as Record<string, unknown>)['subLine'];
    delete (first as Record<string, unknown>)['endDate'];

    const result = validateExperienceFrontmatter(role);
    expect(result.ok).toBe(true);
    expect(result.ok && result.value.roles[0]?.endDate).toBeNull();
    expect(result.ok && result.value.roles[0]?.subLine).toBeUndefined();
  });

  it('treats an education detail as optional', () => {
    const payload = clone(validEducation);
    delete (payload.education[0] as Record<string, unknown>)['detail'];
    expect(validateEducationFrontmatter(payload).ok).toBe(true);
  });
});

describe('malformed frontmatter fails', () => {
  it('rejects a non-object', () => {
    expect(validateHeroFrontmatter(undefined).ok).toBe(false);
    expect(validateHeroFrontmatter('not frontmatter').ok).toBe(false);
    expect(validateHeroFrontmatter([]).ok).toBe(false);
  });

  it('rejects a missing required field and names it', () => {
    const payload = clone(validHero);
    delete (payload as Record<string, unknown>)['tagline'];

    const result = validateHeroFrontmatter(payload);
    expect(result.ok).toBe(false);
    expect(issuePaths(result)).toContain('frontmatter.tagline');
  });

  it('rejects an empty string where content is required', () => {
    const result = validateHeroFrontmatter({ ...validHero, name: '   ' });
    expect(result.ok).toBe(false);
    expect(issuePaths(result)).toContain('frontmatter.name');
  });

  it('rejects a wrong section discriminator', () => {
    const result = validateHeroFrontmatter({
      ...validHero,
      section: 'contact',
    });
    expect(result.ok).toBe(false);
    expect(issuePaths(result)).toContain('frontmatter.section');
  });

  it('rejects a malformed date and points at the entry', () => {
    const payload = clone(validExperience);
    payload.roles[0]!.startDate = 'April 2022';

    const result = validateExperienceFrontmatter(payload);
    expect(result.ok).toBe(false);
    expect(result.ok ? [] : result.issues.map((i) => i.path)).toContain(
      'frontmatter.roles[0].startDate',
    );
  });

  it('rejects an empty bullet list', () => {
    const payload = clone(validExperience);
    payload.roles[0]!.bullets = [];

    const result = validateExperienceFrontmatter(payload);
    expect(result.ok).toBe(false);
    expect(result.ok ? [] : result.issues.map((i) => i.path)).toContain(
      'frontmatter.roles[0].bullets',
    );
  });

  it('rejects a non-string entry inside a string array', () => {
    const result = validateAIEngineeringFrontmatter({
      ...validAIEngineering,
      items: ['one', 42],
    });
    expect(result.ok).toBe(false);
    expect(result.ok ? [] : result.issues.map((i) => i.path)).toContain(
      'frontmatter.items[1]',
    );
  });

  it('rejects a year that is not a four-digit number', () => {
    const payload = clone(validEducation);
    (payload.education[0] as Record<string, unknown>)['year'] = '2017';

    const result = validateEducationFrontmatter(payload);
    expect(result.ok).toBe(false);
    expect(result.ok ? [] : result.issues.map((i) => i.path)).toContain(
      'frontmatter.education[0].year',
    );
  });

  it('rejects an unparseable email address', () => {
    const payload = clone(validContact);
    payload.contact.email = 'someone-at-example';

    const result = validateContactFrontmatter(payload);
    expect(result.ok).toBe(false);
    expect(result.ok ? [] : result.issues.map((i) => i.path)).toContain(
      'frontmatter.contact.email',
    );
  });

  it('rejects a LinkedIn URL that is not absolute https', () => {
    const payload = clone(validContact);
    payload.contact.linkedInUrl = 'http://example.invalid/in/someone';

    const result = validateContactFrontmatter(payload);
    expect(result.ok).toBe(false);
    expect(result.ok ? [] : result.issues.map((i) => i.path)).toContain(
      'frontmatter.contact.linkedInUrl',
    );
  });

  it('collects every issue rather than stopping at the first', () => {
    const result = validateContactFrontmatter({
      section: 'contact',
      heading: '',
      contact: { email: 'nope', phone: '', linkedInUrl: 'ftp://x' },
    });
    expect(result.ok).toBe(false);
    expect(result.ok ? 0 : result.issues.length).toBeGreaterThan(2);
  });
});

describe('assertValid', () => {
  it('returns the value when validation passed', () => {
    expect(
      assertValid(validateHeroFrontmatter(validHero), 'fixture').name,
    ).toBe('A Name');
  });

  it('throws ContentSchemaError naming the source file and the field', () => {
    const payload = clone(validHero);
    delete (payload as Record<string, unknown>)['name'];

    expect(() =>
      assertValid(validateHeroFrontmatter(payload), 'src/content/hero.mdx'),
    ).toThrow(ContentSchemaError);

    try {
      assertValid(validateHeroFrontmatter(payload), 'src/content/hero.mdx');
      expect.unreachable('assertValid should have thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(ContentSchemaError);
      expect((error as ContentSchemaError).message).toContain(
        'src/content/hero.mdx',
      );
      expect((error as ContentSchemaError).message).toContain(
        'frontmatter.name',
      );
      expect((error as ContentSchemaError).issues).toHaveLength(1);
    }
  });
});
