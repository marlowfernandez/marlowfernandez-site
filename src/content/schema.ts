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

/**
 * Accent colours available to an Experience scene.
 *
 * Editorial rather than derived: Point & Pay is lime because lime is the
 * design's primary accent, not because it happens to be first. Each name maps
 * to a `--token-accent-*` pair in `globals.css` with separate light and dark
 * values, so the choice survives a theme switch.
 */
export const ACCENT_NAMES = ['lime', 'violet', 'cyan', 'orange'] as const;

export type AccentName = (typeof ACCENT_NAMES)[number];

/** Upper bound on `skills`, so the chip row cannot wrap unboundedly. */
export const MAX_SKILLS = 6;

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

  // -------------------------------------------------------------------------
  // Presentation fields, added for the cinematic redesign
  // -------------------------------------------------------------------------
  //
  // All optional, deliberately. A required field would force every content
  // entry to be edited before the components could land, and the redesign is
  // sequenced so the site stays green at every step.
  //
  // Content-governance note, which matters more than the types: `metric` and
  // `skills` must RE-PRESENT claims already approved at requirements-analysis,
  // never introduce new ones. Invented resume copy passes every check in this
  // file and every test in the suite — the schema cannot catch it, so the rule
  // is written here where an author will read it.

  /** Scene accent. Falls back to a stable per-index rotation when absent. */
  accent?: AccentName;
  /**
   * The large figure in the impact card, e.g. `"$50M+"`. A display string, not
   * a number — several plausible values are not numeric at all.
   *
   * Must be paired with `metricLabel`: an unlabelled large number is an
   * accessibility problem, so the pairing is enforced below rather than left
   * to review.
   */
  metric?: string;
  /** The small caption naming what `metric` counts. Required when `metric` is set. */
  metricLabel?: string;
  /** Short uppercase chips. Index terms drawn from the bullets, not new claims. */
  skills?: string[];
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
   * Optional as of the redesign, and currently unset.
   *
   * requirements-analysis Q1 decided the phone number would be published as
   * plain text rather than a `tel:` link. That decision was reversed: it is no
   * longer rendered anywhere, and the value has been removed from
   * `contact.mdx` rather than left in the file unused.
   *
   * Kept in the schema as optional rather than deleted outright, so the
   * decision is reversible without a schema migration — and so this note has
   * somewhere to live.
   */
  phone?: string;
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

  /**
   * An optional array whose every element is a non-empty string.
   *
   * An empty array fails rather than yielding `undefined`: `skills: []` is an
   * authoring mistake, not a way of expressing "none". Omit the key instead.
   */
  optionalStringArray(
    source: Record<string, unknown>,
    key: string,
    path: string,
    maxLength?: number,
  ): string[] | undefined {
    const value = source[key];
    if (value === undefined || value === null) return undefined;
    if (!Array.isArray(value)) {
      this.fail(
        path,
        `expected an array when present, received ${describe(value)}`,
      );
      return undefined;
    }
    if (value.length === 0) {
      this.fail(path, 'expected at least one entry when present');
      return undefined;
    }
    if (maxLength !== undefined && value.length > maxLength) {
      this.fail(
        path,
        `expected at most ${maxLength} entries, received ${value.length}`,
      );
      return undefined;
    }
    const out: string[] = [];
    value.forEach((entry, index) => {
      if (typeof entry !== 'string' || entry.trim() === '') {
        this.fail(`${path}[${index}]`, 'expected a non-empty string');
        return;
      }
      out.push(entry);
    });
    return out;
  }

  /**
   * An optional string constrained to a fixed set.
   *
   * The failure message names the whole allowed set, matching the habit of the
   * validators above: an author who mistyped a value should not have to open
   * this file to learn what the alternatives were.
   */
  oneOf<L extends string>(
    source: Record<string, unknown>,
    key: string,
    path: string,
    allowed: readonly L[],
  ): L | undefined {
    const value = source[key];
    if (value === undefined || value === null) return undefined;
    if (typeof value !== 'string') {
      this.fail(
        path,
        `expected a string when present, received ${describe(value)}`,
      );
      return undefined;
    }
    if (!(allowed as readonly string[]).includes(value)) {
      const list = allowed.map((entry) => `"${entry}"`).join(', ');
      this.fail(path, `expected one of ${list}, received "${value}"`);
      return undefined;
    }
    return value as L;
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

  const metric = checker.optionalString(entry, 'metric', `${path}.metric`);
  const metricLabel = checker.optionalString(
    entry,
    'metricLabel',
    `${path}.metricLabel`,
  );

  // Cross-field rule. A large figure with no caption is meaningless to a
  // screen reader and ambiguous to everyone else, and a caption with nothing
  // to caption is dead markup. Enforced here so it cannot ship, rather than
  // left to review — the pair is easy to half-edit.
  //
  // Keyed on raw PRESENCE, not on the validated results. `optionalString`
  // returns `undefined` both when a key is absent and when it was present but
  // malformed, so testing the results would report a spurious "metricLabel is
  // required" alongside the real "metric must be a string" — two issues at one
  // mistake, the second of them wrong.
  const hasMetric = present(entry, 'metric');
  const hasMetricLabel = present(entry, 'metricLabel');

  if (hasMetric && !hasMetricLabel) {
    checker.fail(
      `${path}.metricLabel`,
      'required when "metric" is set — an unlabelled figure has no accessible meaning',
    );
  }
  if (hasMetricLabel && !hasMetric) {
    checker.fail(
      `${path}.metric`,
      'required when "metricLabel" is set — the label has nothing to describe',
    );
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
    ...maybe(
      'accent',
      checker.oneOf(entry, 'accent', `${path}.accent`, ACCENT_NAMES),
    ),
    ...maybe('metric', metric),
    ...maybe('metricLabel', metricLabel),
    ...maybe(
      'skills',
      checker.optionalStringArray(
        entry,
        'skills',
        `${path}.skills`,
        MAX_SKILLS,
      ),
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
    linkedInUrl,
    ...maybe('phone', checker.optionalString(entry, 'phone', `${path}.phone`)),
  };
}

/**
 * Whether a key was authored at all, as distinct from whether it validated.
 *
 * `null` counts as absent, matching how `optionalString` and `endDate` already
 * treat it — YAML writes an explicitly-blank key as `null`, and an author who
 * writes `metric:` with no value means "no metric".
 */
function present(source: Record<string, unknown>, key: string): boolean {
  const value = source[key];
  return value !== undefined && value !== null;
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
// Presentation helpers
// ---------------------------------------------------------------------------

/**
 * The accent a scene should use: the authored choice when there is one, else a
 * stable rotation by position.
 *
 * The fallback exists so `accent` can stay optional — a role added without one
 * still gets a colour, and it is deterministic rather than arbitrary, so the
 * same content always renders the same way.
 */
export function resolveAccent(
  entry: Pick<ExperienceEntry, 'accent'>,
  index: number,
): AccentName {
  if (entry.accent !== undefined) return entry.accent;
  // `index` is a array position, so it is always a non-negative integer; the
  // modulo cannot land out of range.
  return ACCENT_NAMES[index % ACCENT_NAMES.length] as AccentName;
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
