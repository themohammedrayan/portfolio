// Loads the master profile (content/master-profile.yaml), the same hand-verified fact bank
// job-portal builds CVs from. Every figure on this site comes from that file; the schema here
// is the subset of job-portal's MasterProfileSchema the site reads.
import { readFileSync } from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import { z } from "zod";

export const PROFILE_PATH = path.join(process.cwd(), "content", "master-profile.yaml");

const YearMonth = z.string().regex(/^\d{4}-\d{2}$/);

const BulletSchema = z.object({
  id: z.string(),
  tags: z.array(z.string()).default([]),
  metrics: z.record(z.string()).default({}),
  rank: z.number(),
  default: z.boolean().default(false),
  variants: z.array(z.string()).min(1),
});

const SkillsSchema = z.object({ product: z.array(z.string()), technical: z.array(z.string()) });

const ProfileSchema = z.object({
  contact: z.object({
    name: z.string(),
    headline_default: z.string(),
    headlines: z.record(z.string()).default({}),
    email: z.string().email(),
    phone: z.string(),
    location: z.string(),
    availability: z.string().optional(),
    linkedin: z.string(),
    website: z.string().optional(),
  }),
  summaries: z.array(z.object({ id: z.string(), angle: z.string().optional(), text: z.string() })),
  experience: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      company: z.string(),
      start: YearMonth,
      end: z.union([YearMonth, z.literal("present")]),
      location: z.string(),
      bullets: z.array(BulletSchema),
    }),
  ),
  projects: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      tagline: z.string(),
      role: z.string(),
      stack: z.array(z.string()),
      url: z.string().optional(),
      bullets: z.array(BulletSchema),
    }),
  ),
  education: z.array(
    z.object({
      id: z.string(),
      degree: z.string(),
      institution: z.string(),
      start: YearMonth,
      end: YearMonth,
      extra: z.string().optional(),
    }),
  ),
  skills: SkillsSchema,
  default_skills: SkillsSchema,
  certificates: z.array(z.object({ id: z.string(), name: z.string(), issuer: z.string().optional() })),
  wording_rules: z.array(z.string()).default([]),
});

export type Profile = z.infer<typeof ProfileSchema>;
export type Bullet = z.infer<typeof BulletSchema>;

let cached: Profile | undefined;

export function readProfileText(file = PROFILE_PATH): string {
  return readFileSync(file, "utf8");
}

export function loadProfile(): Profile {
  cached ??= ProfileSchema.parse(parse(readProfileText()));
  return cached;
}

/** A bullet's text by id. `variant` picks one of its 1-3 wordings (default: the first). */
export function bullet(id: string, variant = 0): string {
  const p = loadProfile();
  for (const section of [...p.experience, ...p.projects]) {
    const b = section.bullets.find((x) => x.id === id);
    if (b) {
      const text = b.variants[variant];
      if (!text) throw new Error(`bullet ${id} has no variant ${variant}`);
      return rupees(text);
    }
  }
  throw new Error(`unknown bullet id: ${id}`);
}

/** A metric value by bullet id and key, e.g. metric("xl_payments", "collected_online") -> "Rs 4 Cr+". */
export function metric(id: string, key: string): string {
  const p = loadProfile();
  for (const section of [...p.experience, ...p.projects]) {
    const b = section.bullets.find((x) => x.id === id);
    if (b) {
      const v = b.metrics[key];
      if (!v) throw new Error(`bullet ${id} has no metric ${key}`);
      return v;
    }
  }
  throw new Error(`unknown bullet id: ${id}`);
}

/** "Rs 4 Cr+" -> "₹4 Cr+" for display. */
export function rupees(s: string): string {
  return s.replace(/\bRs\.?\s*/g, "₹");
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatMonth(ym: string): string {
  if (ym === "present") return "Present";
  const [y, m] = ym.split("-");
  return `${MONTHS[Number(m) - 1]} ${y}`;
}

/** Values the count-up animation can run on: one plain number with optional prefix/suffix
 * ("₹4 Cr+", "2,500+"), but not dates ("Apr 2026") or codes ("L1/L2/L3"). */
export function countable(v: string): boolean {
  return /^\D*\d[\d,]*\D*$/.test(v) && !/^[A-Z][a-z]{2} \d{4}$/.test(v);
}
