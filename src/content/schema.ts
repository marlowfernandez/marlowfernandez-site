/**
 * MDX frontmatter schema — the formal integration contract between Unit 1
 * (this shell) and Unit 2 (real content).
 *
 * Confirmed at `units-generation` Q4. Two consumers depend on it:
 *
 *  1. The build. `src/content/index.ts` runs `assert*` over every content
 *     file's frontmatter at build time. A malformed edit fails
 *     `npm run build` instead of reaching production as a broken page.
 *  2. CI's content-schema-validation check (`team.md`, Practices Discovery
 *     Q5), which is satisfied by that same build-time assertion plus
 *     `schema.test.ts`.
 *
 * Scope note, carried from ADR-2: this validates frontmatter *shape*, not
 * prose correctness. A typo in a bullet is not a structural error and will
 * not be caught here.
 *
 * The validators are hand-written rather than delegated to a schema library.
 * That is deliberate: `project.md` forbids dependency auto-merge at every
 * tier, so every dependency added here becomes recurring manual review work.
 * The validation surface is small enough not to justify that cost.
 */

// ---------------------------------------------------------------------------
// Content entry types
// ---------------------------------------------------------------------------

/** One employer block in the Experience section. */
export interface ExperienceEntry {
  /** Employer name, e.g. "Point & Pay". */
  employer: string;
  /** Role title held at that employer. */
  title: string;
  /** Start of tenure, `YYYY-MM`. */
  startDate: string;
  /** End of tenure, `YYYY-MM`; `null` means the role is current. */
  endDate: string | null;
  /** Achievement/responsibility bullets. At least one is required. */
  bullets: string[];
  /**
   * Optional secondary line rendered smaller and lighter beneath the bullets.
   * Unit 2 uses this for the Vynkor sub-line under Point & Pay.
   */
  subLine?: string;
}

/** One credential in the Education & Certification section. */
export interface EducationEntry {
  /** Awarding institution or certifying body. */
  institution: string;
  /** Degree or certification name. */
  credential: string;
  /** Four-digit year the credential was awarded. */
  year: number;
  /** Optional extra detail (GPA, honours, verification code). */
  detail?: string;
}

/**
 * One entry in the AI Engineering list.
 *
 * A plain string by design: ADR-1 settled this section as a comma-separated
 * plain-text list with no links, so there is nothing else to carry. The alias
 * exists so a future richer shape can be introduced in one place.
 */
export type AIEngineeringItem = string;

/** Contact details, shared by `Header` and `ContactSection`. */
export interface ContactInfo {
  email: string;
  /**
   * Rendered as plain text, not a `tel:` link — confirmed at
   * requirements-analysis Q1.
   */
  phone: string;
  /** Absolute `https://` URL to the LinkedIn profile. */
  linkedInUrl: string;
}

// ---------------------------------------------------------------------------
// Frontmatter shapes, one per content file
// ---------------------------------------------------------------------------

export interface HeroFrontmatter {
  section: 'hero';
  /** Rendered as the page's single `h1`. */
  name: string;
  tagline: string;
}

export interface ExperienceFrontmatter {
  section: 'experience';
  /** Section `h2` text. */
  heading: string;
  roles: ExperienceEntry[];
}

export interface AIEngineeringFrontmatter {
  section: 'ai-engineering';
  heading: string;
  items: AIEngineeringItem[];
}

export interface EducationFrontmatter {
  section: 'education';
  heading: string;
  education: EducationEntry[];
}

export interface ContactFrontmatter {
  section: 'contact';
  heading: string;
  contact: ContactInfo;
}

export type SectionFrontmatter =
  | HeroFrontmatter
  | ExperienceFrontmatter
  | AIEngineeringFrontmatter
  | EducationFrontmatter
  | ContactFrontmatter;

// ---------------------------------------------------------------------------
// Validation primitives
// ---------------------------------------------------------------------------

export interface ValidationIssue {
  /** Dotted path to the offending field, e.g. `roles[0].bullets`. */
  path: string;
  message: string;
}

export type ValidationResult<T> =
  { ok: true; value: T } | { ok: false; issues: ValidationIssue[] };

/** Thrown by the `assert*` helpers when frontmatter fails validation. */
export class ContentSchemaError extends Error {
  readonly issues: readonly ValidationIssue[];

  constructor(source: string, issues: readonly ValidationIssue[]) {
    const detail = issues
      .map((issue) => `  - ${issue.path}: ${issue.message}`)
      .join('\n');
    super(`Invalid frontmatter in ${source}:\n${detail}`);
    this.name = 'ContentSchemaError';
    this.issues = issues;
  }
}

const YEAR_MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Collects issues as it walks a value; never throws. */
class Checker {
  readonly issues: ValidationIssue[] = [];

  fail(path: string, message: string): void {
    this.issues.push({ path, message });
  }

  record(value: unknown, path: string): Record<string, unknown> | null {
    if (!isRecord(value)) {
      this.fail(path, 'expected an object');
      return null;
    }
    return value;
  }

  /** A required non-empty string. */
  string(source: Record<string, unknown>, key: string, path: string): string {
    const value = source[key];
    if (typeof value !== 'string') {
      this.fail(path, `expected a string, received ${describe(value)}`);
      return '';
    }
    if (value.trim() === '') {
      this.fail(path, 'expected a non-empty string');
      return '';
    }
    return value;
  }

  /** An optional non-empty string. Absent and `null` are both fine. */
  optionalString(
    source: Record<string, unknown>,
    key: string,
    path: string,
  ): string | undefined {
    const value = source[key];
    if (value === undefined || value === null) return undefined;
    if (typeof value !== 'string') {
      this.fail(
        path,
        `expected a string when present, received ${describe(value)}`,
      );
      return undefined;
    }
    if (value.trim() === '') {
      this.fail(path, 'expected a non-empty string when present');
      return undefined;
    }
    return value;
  }

  /** A required non-empty array. */
  array(source: Record<string, unknown>, key: string, path: string): unknown[] {
    const value = source[key];
    if (!Array.isArray(value)) {
      this.fail(path, `expected an array, received ${describe(value)}`);
      return [];
    }
    if (value.length === 0) {
      this.fail(path, 'expected at least one entry');
      return [];
    }
    return value;
  }

  /** Every element of an array must be a non-empty string. */
  stringArray(
    source: Record<string, unknown>,
    key: string,
    path: string,
  ): string[] {
    const raw = this.array(source, key, path);
    const out: string[] = [];
    raw.forEach((entry, index) => {
      if (typeof entry !== 'string' || entry.trim() === '') {
        this.fail(`${path}[${index}]`, 'expected a non-empty string');
        return;
      }
      out.push(entry);
    });
    return out;
  }

  literal<L extends string>(
    source: Record<string, unknown>,
    key: string,
    path: string,
    expected: L,
  ): L {
    const value = source[key];
    if (value !== expected) {
      this.fail(path, `expected the literal "${expected}"`);
    }
    return expected;
  }

  yearMonth(
    source: Record<string, unknown>,
    key: string,
    path: string,
  ): string {
    const value = this.string(source, key, path);
    if (value !== '' && !YEAR_MONTH.test(value)) {
      this.fail(path, `expected a YYYY-MM date, received "${value}"`);
    }
    return value;
  }
}

function describe(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'an array';
  return `${typeof value}`;
}

function finish<T>(checker: Checker, value: T): ValidationResult<T> {
  return checker.issues.length > 0
    ? { ok: false, issues: checker.issues }
    : { ok: true, value };
}

// ---------------------------------------------------------------------------
// Entry validators
// ---------------------------------------------------------------------------

function checkExperienceEntry(
  checker: Checker,
  raw: unknown,
  path: string,
): ExperienceEntry {
  const entry = checker.record(raw, path);
  if (entry === null) {
    return {
      employer: '',
      title: '',
      startDate: '',
      endDate: null,
      bullets: [],
    };
  }

  // `endDate` is genuinely nullable: null means "present", which is different
  // from an authoring mistake. Absent is treated as null.
  let endDate: string | null = null;
  const rawEnd = entry['endDate'];
  if (rawEnd !== undefined && rawEnd !== null) {
    endDate = checker.yearMonth(entry, 'endDate', `${path}.endDate`);
  }

  return {
    employer: checker.string(entry, 'employer', `${path}.employer`),
    title: checker.string(entry, 'title', `${path}.title`),
    startDate: checker.yearMonth(entry, 'startDate', `${path}.startDate`),
    endDate,
    bullets: checker.stringArray(entry, 'bullets', `${path}.bullets`),
    ...maybe(
      'subLine',
      checker.optionalString(entry, 'subLine', `${path}.subLine`),
    ),
  };
}

function checkEducationEntry(
  checker: Checker,
  raw: unknown,
  path: string,
): EducationEntry {
  const entry = checker.record(raw, path);
  if (entry === null) {
    return { institution: '', credential: '', year: 0 };
  }

  const year = entry['year'];
  if (
    typeof year !== 'number' ||
    !Number.isInteger(year) ||
    year < 1900 ||
    year > 2200
  ) {
    checker.fail(
      `${path}.year`,
      `expected a four-digit year, received ${describe(year)}`,
    );
  }

  return {
    institution: checker.string(entry, 'institution', `${path}.institution`),
    credential: checker.string(entry, 'credential', `${path}.credential`),
    year: typeof year === 'number' ? year : 0,
    ...maybe(
      'detail',
      checker.optionalString(entry, 'detail', `${path}.detail`),
    ),
  };
}

function checkContactInfo(
  checker: Checker,
  raw: unknown,
  path: string,
): ContactInfo {
  const entry = checker.record(raw, path);
  if (entry === null) {
    return { email: '', phone: '', linkedInUrl: '' };
  }

  const email = checker.string(entry, 'email', `${path}.email`);
  if (email !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    checker.fail(`${path}.email`, `not a valid email address: "${email}"`);
  }

  const linkedInUrl = checker.string(
    entry,
    'linkedInUrl',
    `${path}.linkedInUrl`,
  );
  if (linkedInUrl !== '' && !linkedInUrl.startsWith('https://')) {
    checker.fail(
      `${path}.linkedInUrl`,
      'expected an absolute https:// URL — external links must not downgrade transport',
    );
  }

  return {
    email,
    phone: checker.string(entry, 'phone', `${path}.phone`),
    linkedInUrl,
  };
}

/** Spreads an optional property only when it has a value (exactOptionalProperty-safe). */
function maybe<K extends string, V>(
  key: K,
  value: V | undefined,
): Record<K, V> | Record<string, never> {
  return value === undefined ? {} : ({ [key]: value } as Record<K, V>);
}

// ---------------------------------------------------------------------------
// Frontmatter validators
// ---------------------------------------------------------------------------

export function validateHeroFrontmatter(
  raw: unknown,
): ValidationResult<HeroFrontmatter> {
  const checker = new Checker();
  const fm = checker.record(raw, 'frontmatter');
  if (fm === null) {
    return { ok: false, issues: checker.issues };
  }
  return finish(checker, {
    section: checker.literal(fm, 'section', 'frontmatter.section', 'hero'),
    name: checker.string(fm, 'name', 'frontmatter.name'),
    tagline: checker.string(fm, 'tagline', 'frontmatter.tagline'),
  });
}

export function validateExperienceFrontmatter(
  raw: unknown,
): ValidationResult<ExperienceFrontmatter> {
  const checker = new Checker();
  const fm = checker.record(raw, 'frontmatter');
  if (fm === null) {
    return { ok: false, issues: checker.issues };
  }
  const rawRoles = checker.array(fm, 'roles', 'frontmatter.roles');
  return finish(checker, {
    section: checker.literal(
      fm,
      'section',
      'frontmatter.section',
      'experience',
    ),
    heading: checker.string(fm, 'heading', 'frontmatter.heading'),
    roles: rawRoles.map((role, index) =>
      checkExperienceEntry(checker, role, `frontmatter.roles[${index}]`),
    ),
  });
}

export function validateAIEngineeringFrontmatter(
  raw: unknown,
): ValidationResult<AIEngineeringFrontmatter> {
  const checker = new Checker();
  const fm = checker.record(raw, 'frontmatter');
  if (fm === null) {
    return { ok: false, issues: checker.issues };
  }
  return finish(checker, {
    section: checker.literal(
      fm,
      'section',
      'frontmatter.section',
      'ai-engineering',
    ),
    heading: checker.string(fm, 'heading', 'frontmatter.heading'),
    items: checker.stringArray(fm, 'items', 'frontmatter.items'),
  });
}

export function validateEducationFrontmatter(
  raw: unknown,
): ValidationResult<EducationFrontmatter> {
  const checker = new Checker();
  const fm = checker.record(raw, 'frontmatter');
  if (fm === null) {
    return { ok: false, issues: checker.issues };
  }
  const rawEducation = checker.array(fm, 'education', 'frontmatter.education');
  return finish(checker, {
    section: checker.literal(fm, 'section', 'frontmatter.section', 'education'),
    heading: checker.string(fm, 'heading', 'frontmatter.heading'),
    education: rawEducation.map((entry, index) =>
      checkEducationEntry(checker, entry, `frontmatter.education[${index}]`),
    ),
  });
}

export function validateContactFrontmatter(
  raw: unknown,
): ValidationResult<ContactFrontmatter> {
  const checker = new Checker();
  const fm = checker.record(raw, 'frontmatter');
  if (fm === null) {
    return { ok: false, issues: checker.issues };
  }
  return finish(checker, {
    section: checker.literal(fm, 'section', 'frontmatter.section', 'contact'),
    heading: checker.string(fm, 'heading', 'frontmatter.heading'),
    contact: checkContactInfo(checker, fm['contact'], 'frontmatter.contact'),
  });
}

// ---------------------------------------------------------------------------
// Build-time assertions
// ---------------------------------------------------------------------------

/**
 * Unwraps a `ValidationResult`, throwing `ContentSchemaError` on failure.
 *
 * Called from `src/content/index.ts`, which runs during `next build`. A schema
 * violation therefore fails the build loudly rather than degrading silently —
 * the fail-fast half of the error-handling posture. (`ThemeToggle`'s storage
 * fallbacks are the one deliberate exception, and are documented as such in
 * `src/lib/theme.ts`.)
 */
export function assertValid<T>(result: ValidationResult<T>, source: string): T {
  if (!result.ok) {
    throw new ContentSchemaError(source, result.issues);
  }
  return result.value;
}
