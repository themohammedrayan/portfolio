// Site narrative. Facts and figures are pulled from the master profile by bullet id
// (bullet(), metric()); the prose around them adds framing only, never new numbers.
// tests/fact-check.test.ts fails the build if a number on any page is not in the YAML.
import { bullet, loadProfile, metric, rupees } from "@/lib/profile";

// Vercel sets VERCEL_PROJECT_PRODUCTION_URL at build time to the project's production domain.
export const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "https://portfolio-lime-three-nn4etos41v.vercel.app";
export const GITHUB = "github.com/themohammedrayan";
export const CV_PATH = "/Mohammed-Rayan-CV.pdf";

export type Stat = { value: string; label: string };

export type CaseStudy = {
  slug: string;
  /** Short name for chips and tooltips. */
  short: string;
  kicker: string;
  title: string;
  summary: string;
  period: string;
  role: string;
  stack: string[];
  link?: { href: string; label: string };
  stats: Stat[];
  problem: string[];
  did: string[];
  outcome: string[];
};

/** Roles for the hero ticker: the default headline, then each angle's headline from the profile. */
export function roles(): string[] {
  const c = loadProfile().contact;
  return [c.headline_default, ...Object.values(c.headlines)];
}

/** Case studies whose stack uses a skill (matched on the skill's name before any brackets). */
export function usedIn(skill: string): string[] {
  const key = skill.split(" (")[0].toLowerCase();
  return caseStudies()
    .filter((c) => c.stack.some((x) => x.toLowerCase().split(" (")[0] === key))
    .map((c) => c.short);
}

export function heroStats(): Stat[] {
  return [
    {
      value: rupees(metric("xl_payments", "portal_collected")),
      label: `in fees recorded across ${metric("xl_payments", "portal_payments")} payments on the platform I own`,
    },
    {
      value: rupees(metric("xl_payments", "collected_online")),
      label: "collected online in the first two months of the payment apps I built",
    },
    {
      value: metric("xl_portal", "staff"),
      label: "staff across admissions, accounts and hostels work in the portal I launched",
    },
  ];
}

export function proofStrip(): Stat[] {
  return [
    { value: metric("xl_platform_scale", "platform_enrollments"), label: "enrollment records on the platform" },
    { value: metric("xa_brds_vendor", "brds"), label: "requirement documents written" },
    { value: metric("xl_reports", "reports"), label: "SQL reports and data pulls" },
    { value: metric("xl_request_volume", "threads"), label: "stakeholder request threads resolved" },
  ];
}

export function howIWork() {
  return [
    {
      step: "Find it in the data",
      text: `${metric("xl_reports", "reports")} SQL reports, payment reconciliation across app, CRM and ERP, and root-cause analyses that turn a complaint into a fixable cause.`,
    },
    {
      step: "Spec it",
      text: `${metric("xa_brds_vendor", "brds")} BRDs, a costed task list for the external vendor, and rules signed off with finance before anything is built.`,
    },
    {
      step: "Build it",
      text: `Not a hand-off: I took over the codebase directly. The Admission Portal now exposes ${metric("xl_portal", "api_endpoints")} API endpoints.`,
    },
    {
      step: "Launch and land it",
      text: `Go-live plans, training sessions, launch notes and a support-ticket queue, so the thing actually gets used, then the data to show it worked.`,
    },
  ];
}

export function caseStudies(): CaseStudy[] {
  return [
    {
      slug: "admission-portal",
      short: "Admission Portal",
      kicker: "Product ownership · Xylem Learning",
      title: "One portal for admissions, payments, approvals and hostels",
      summary: bullet("xl_portal", 2),
      period: `Launched ${metric("xl_portal", "launch")}`,
      role: "Product owner and builder: requirements, specs, build, launch, training",
      stack: ["Frappe/ERPNext", "Python", "JavaScript", "SQL (MariaDB)", "Role-based access"],
      stats: [
        { value: metric("xl_portal", "staff"), label: "staff using it" },
        { value: metric("xl_portal", "api_endpoints"), label: "API endpoints" },
        { value: metric("xl_portal", "launch"), label: "go-live" },
      ],
      problem: [
        "Admissions, payment collection, approvals and hostel management lived in separate places. Every enrollment meant hopping between modules, and every exception meant an email to someone in accounts.",
        "Staff across admissions, accounts and hostels needed one place to do their job, with the right people seeing the right records.",
      ],
      did: [
        bullet("xl_portal", 1),
        bullet("xl_portal", 0),
        bullet("xl_modules", 0),
        bullet("xl_academics_analytics", 0),
        bullet("xl_self_serve", 0),
        bullet("xl_meal_tracker", 0),
      ],
      outcome: [bullet("xl_portal_feedback", 0), bullet("xl_portal", 2)],
    },
    {
      slug: "payments",
      short: "Payments",
      kicker: "Payments · Xylem Learning",
      title: "Building the fee-collection pillars: a parent app and SMS payment links",
      summary: bullet("xl_payments", 0),
      period: `Live since ${metric("xl_parent_app", "launch")}`,
      role: "Built and launched end to end",
      stack: ["Razorpay", "Webhooks", "Frappe/ERPNext", "JavaScript", "Python"],
      stats: [
        { value: rupees(metric("xl_payments", "collected_online")), label: "collected online, first two months" },
        { value: metric("xl_payments", "online_payments"), label: "online payments in that window" },
        { value: rupees(metric("xl_payments", "portal_collected")), label: `recorded across ${metric("xl_payments", "portal_payments")} payments since` },
      ],
      problem: [
        "Parents had no self-serve way to see what was due for each child and pay it, and every payment that didn't post itself against the right fee head became a matching task for accounts.",
      ],
      did: [bullet("xl_parent_app", 0), bullet("xl_parent_app", 1), bullet("xl_collections_reporting", 0), bullet("xl_money_movement", 1)],
      outcome: [bullet("xl_payments", 0), bullet("xl_payments", 1)],
    },
    {
      slug: "refunds-approvals",
      short: "Refunds",
      kicker: "Workflows · Xylem Learning",
      title: "Refunds and approvals that follow policy, not inbox threads",
      summary: bullet("xl_refunds", 2),
      period: `Refunds in-app since ${metric("xl_refund_app", "live")}`,
      role: "Designed the policy logic, specified and built the workflow",
      stack: ["Workflow design", "Frappe/ERPNext", "Python", "UAT"],
      stats: [
        { value: metric("xl_refunds", "approval_levels"), label: "approval levels" },
        { value: metric("xl_hostel_billing", "test_scenarios"), label: "scenario test pack signed off with accounts" },
        { value: metric("xl_refund_app", "live"), label: "refunds live in the app" },
      ],
      problem: [
        "Discounts, drops, fee transfers and refunds each needed sign-off from different people, and the refund amount depended on a policy someone had to apply by hand. Nothing in the flow asked whether the student could be kept.",
      ],
      did: [
        bullet("xl_refunds", 0),
        bullet("xa_retention_proposal", 0),
        bullet("xl_refund_app", 0),
        bullet("xl_money_movement", 0),
        bullet("xl_hostel_billing", 0),
        bullet("xl_process_design", 0),
      ],
      outcome: [bullet("xl_refunds", 1)],
    },
    {
      slug: "data-trust",
      short: "Data trust",
      kicker: "Data quality & security · Xylem Learning",
      title: "Making the numbers finance relies on actually add up",
      summary: bullet("xa_reconciliation", 1),
      period: "2024 – present",
      role: "Analyst, then owner of the data layer",
      stack: ["SQL", "Metabase", "Power BI", "LeadSquared CRM", "Python (pandas)"],
      stats: [
        { value: metric("xl_reports", "reports"), label: "SQL reports and data pulls" },
        { value: metric("xl_trust_data", "doctypes"), label: "record types locked down" },
        { value: metric("xl_scale", "imports"), label: "bulk data imports run" },
      ],
      problem: [
        "Payments travel from the app to the CRM to the ERP, and some went missing on the way. Finance reports are only as good as the weakest hand-off, and student records needed tighter control over who could export them.",
      ],
      did: [
        bullet("xa_reconciliation", 0),
        bullet("xa_data_quality", 1),
        bullet("xa_rcas", 0),
        bullet("xl_fee_sanity", 0),
        bullet("xl_trust_data", 2),
        bullet("xl_data_flow_mapping", 0),
        bullet("xl_reports", 0),
        bullet("xl_dashboards", 0),
      ],
      outcome: [bullet("xl_fee_sanity", 1), bullet("xl_trust_data", 0)],
    },
    {
      slug: "rivlo",
      short: "Rivlo",
      kicker: "Zero to one · Side project",
      title: "Rivlo: a ranked 1v1 exam-prep battle app, built solo",
      summary: bullet("rv_build", 0),
      period: "Beta",
      role: "Solo builder and product owner",
      stack: ["React Native", "FastAPI", "Supabase"],
      link: { href: "https://rivlo.live", label: "rivlo.live" },
      stats: [
        { value: metric("rv_build", "endpoints"), label: "FastAPI endpoints" },
        { value: metric("rv_question_quality", "questions"), label: "question bank" },
        { value: "JEE · NEET · CAT", label: "exams covered" },
      ],
      problem: [
        "Exam prep is lonely and repetitive. Students grind question banks with no sense of where they stand, and practice apps don't adapt to what a student actually knows.",
      ],
      did: [
        bullet("rv_build", 2),
        bullet("rv_engine", 0),
        bullet("rv_engine", 1),
        bullet("rv_bots", 0),
        bullet("rv_readiness", 0),
        bullet("rv_question_quality", 0),
      ],
      outcome: [bullet("rv_build", 1)],
    },
    {
      slug: "side-builds",
      short: "Side builds",
      kicker: "Shipping for real users · Side projects",
      title: "A live WhatsApp bot, and the tool that tailored my CV",
      summary:
        "Two small products built end to end: a Malayalam WhatsApp enquiry bot in production for an Akshaya e-Centre, and a CV generator that won't let an LLM invent a single fact.",
      period: "2026",
      role: "Solo builder",
      stack: ["Next.js", "TypeScript", "Supabase", "WhatsApp Cloud API", "OpenAI API", "Playwright"],
      link: { href: "https://github.com/themohammedrayan/job-portal", label: "Job Portal on GitHub" },
      stats: [
        { value: "Live", label: "WhatsApp bot in production" },
        { value: "Fact-checked", label: "every CV number validated in code" },
        { value: "Malayalam", label: "bot conversations" },
      ],
      problem: [
        "A local e-Centre answered the same questions all day on WhatsApp: which documents, what fee, how long. Separately, every job application needs a tailored CV, and LLMs happily make up numbers.",
      ],
      did: [
        bullet("wa_bot", 0),
        bullet("wa_followups", 0),
        bullet("wa_webhook", 0),
        bullet("wa_webhook", 1),
        bullet("jp_tailor", 0),
        bullet("jp_guardrails", 0),
        bullet("jp_fit", 0),
        bullet("jp_tracker", 0),
      ],
      outcome: [
        "The bot is live and logging real enquiries. The CV you can download from this site was rendered by the job-portal pipeline, from the same fact bank that powers every number on this page.",
      ],
    },
  ];
}

/** Which bullets the experience timeline shows per role, in order (first variant each). */
export const TIMELINE_BULLETS: Record<string, string[]> = {
  xylem_lead: ["xl_portal", "xl_payments", "xl_refunds", "xl_trust_data", "xl_team"],
  xylem_analyst: ["xa_brds_vendor", "xa_reconciliation", "xa_plan_flow", "xa_builds"],
  outlier: ["ol_training"],
};
