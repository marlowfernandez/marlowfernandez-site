import { describe, expect, it } from 'vitest';

import {
  ACCENT_NAMES,
  ContentSchemaError,
  MAX_SKILLS,
  assertValid,
  resolveAccent,
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

/**
 * Presentation fields added for the cinematic redesign.
 *
 * All optional, so every existing fixture above must keep passing untouched —
 * that is itself the first assertion here.
 */
describe('presentation fields', () => {
  /** Adds fields to the single role in the Experience fixture. */
  function withRole(extra: Record<string, unknown>) {
    const payload = clone(validExperience);
    Object.assign(payload.roles[0] as Record<string, unknown>, extra);
    return payload;
  }

  function experienceIssuePaths(payload: unknown) {
    const result = validateExperienceFrontmatter(payload);
    return result.ok ? [] : result.issues.map((issue) => issue.path);
  }

  it('leaves every presentation field undefined when absent', () => {
    // The base fixture sets none of them. Absent must mean `undefined`, not an
    // empty string or empty array, or `maybe()` would spread a falsy value
    // onto the entry and defeat `exactOptionalPropertyTypes`.
    const result = validateExperienceFrontmatter(clone(validExperience));
    expect(result.ok).toBe(true);
    const role = result.ok ? result.value.roles[0] : undefined;
    expect(role?.accent).toBeUndefined();
    expect(role?.metric).toBeUndefined();
    expect(role?.metricLabel).toBeUndefined();
    expect(role?.skills).toBeUndefined();
  });

  it('accepts every allowed accent name', () => {
    for (const accent of ACCENT_NAMES) {
      const result = validateExperienceFrontmatter(withRole({ accent }));
      expect(result.ok, `accent "${accent}" should be valid`).toBe(true);
      expect(result.ok && result.value.roles[0]?.accent).toBe(accent);
    }
  });

  it('rejects an unknown accent and names the whole allowed set', () => {
    const result = validateExperienceFrontmatter(withRole({ accent: 'red' }));
    expect(result.ok).toBe(false);
    const issue = result.ok ? undefined : result.issues[0];
    expect(issue?.path).toBe('frontmatter.roles[0].accent');
    // An author who mistyped should learn the alternatives from the message
    // rather than having to open schema.ts.
    for (const accent of ACCENT_NAMES) {
      expect(issue?.message).toContain(accent);
    }
  });

  it('requires metric and metricLabel to travel together', () => {
    expect(experienceIssuePaths(withRole({ metric: '$50M+' }))).toEqual([
      'frontmatter.roles[0].metricLabel',
    ]);
    expect(
      experienceIssuePaths(withRole({ metricLabel: 'a caption' })),
    ).toEqual(['frontmatter.roles[0].metric']);
    expect(
      validateExperienceFrontmatter(
        withRole({ metric: '$50M+', metricLabel: 'a caption' }),
      ).ok,
    ).toBe(true);
  });

  it('reports one issue, not two, for a malformed metric', () => {
    // A non-string `metric` fails its own check and yields undefined. The
    // pairing rule must not then also fire, or the author sees a spurious
    // "metricLabel is required" alongside the real error.
    const paths = experienceIssuePaths(
      withRole({ metric: 42, metricLabel: 'a caption' }),
    );
    expect(paths).toEqual(['frontmatter.roles[0].metric']);
  });

  it('validates skills as a bounded array of non-empty strings', () => {
    expect(
      validateExperienceFrontmatter(withRole({ skills: ['Payments', 'AWS'] }))
        .ok,
    ).toBe(true);

    expect(experienceIssuePaths(withRole({ skills: 'Payments' }))).toEqual([
      'frontmatter.roles[0].skills',
    ]);

    // An empty array is an authoring mistake, not a way to say "none".
    expect(experienceIssuePaths(withRole({ skills: [] }))).toEqual([
      'frontmatter.roles[0].skills',
    ]);

    expect(experienceIssuePaths(withRole({ skills: ['ok', ''] }))).toEqual([
      'frontmatter.roles[0].skills[1]',
    ]);

    const overCap = Array.from({ length: MAX_SKILLS + 1 }, (_, i) => `s${i}`);
    const capIssue = validateExperienceFrontmatter(
      withRole({ skills: overCap }),
    );
    expect(capIssue.ok).toBe(false);
    expect(capIssue.ok ? '' : capIssue.issues[0]?.message).toContain(
      String(MAX_SKILLS),
    );
  });
});

describe('resolveAccent', () => {
  it('prefers the authored accent', () => {
    expect(resolveAccent({ accent: 'cyan' }, 0)).toBe('cyan');
  });

  it('falls back to a stable rotation by position', () => {
    // Deterministic, so the same content always renders the same colours.
    const rotated = [0, 1, 2, 3, 4].map((i) => resolveAccent({}, i));
    expect(rotated).toEqual([...ACCENT_NAMES, ACCENT_NAMES[0]]);
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
