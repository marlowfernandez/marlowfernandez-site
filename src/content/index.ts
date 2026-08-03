import { frontmatter as aiEngineeringFrontmatter } from './ai-engineering.mdx';
import { frontmatter as contactFrontmatter } from './contact.mdx';
import { frontmatter as educationFrontmatter } from './education.mdx';
import { frontmatter as experienceFrontmatter } from './experience.mdx';
import { frontmatter as heroFrontmatter } from './hero.mdx';

import {
  assertValid,
  validateAIEngineeringFrontmatter,
  validateContactFrontmatter,
  validateEducationFrontmatter,
  validateExperienceFrontmatter,
  validateHeroFrontmatter,
} from './schema';

/**
 * The single place content enters the application.
 *
 * Everything here runs during `next build`, never in the browser: the MDX
 * files are compiled into the module graph by `@next/mdx`, and the `assertValid`
 * calls below execute while the page is being pre-rendered. A frontmatter
 * violation therefore fails the build with a path-qualified message, which is
 * the content-schema-validation gate `team.md` requires (Practices Discovery
 * Q5) — no separate lint script needed, and no way to ship a malformed edit.
 *
 * Validation happens at module scope on purpose. Deferring it into the
 * components would push the failure to render time, where a static export has
 * fewer guarantees about which page pulls which content.
 */

export const hero = assertValid(
  validateHeroFrontmatter(heroFrontmatter),
  'src/content/hero.mdx',
);

export const experience = assertValid(
  validateExperienceFrontmatter(experienceFrontmatter),
  'src/content/experience.mdx',
);

export const aiEngineering = assertValid(
  validateAIEngineeringFrontmatter(aiEngineeringFrontmatter),
  'src/content/ai-engineering.mdx',
);

export const education = assertValid(
  validateEducationFrontmatter(educationFrontmatter),
  'src/content/education.mdx',
);

export const contact = assertValid(
  validateContactFrontmatter(contactFrontmatter),
  'src/content/contact.mdx',
);

/*
 * The compiled MDX bodies are deliberately not exported.
 *
 * Unit 1 rendered them inside `PlaceholderSection` to prove the pipeline
 * end-to-end. Unit 2's section components render the structured frontmatter
 * above instead, so those exports went away with the placeholder scaffold — as
 * `unit-of-work.md` planned. The prose still in each `.mdx` file is an
 * authoring note for whoever edits the content next; nothing renders it.
 */
