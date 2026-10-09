import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CV_PATH, caseStudies } from "@/content/site";
import { loadProfile } from "@/lib/profile";
import s from "./case.module.css";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return caseStudies().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const c = caseStudies().find((x) => x.slug === slug);
  if (!c) return {};
  return { title: c.title, description: c.summary, alternates: { canonical: `/work/${c.slug}/` } };
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const all = caseStudies();
  const i = all.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const c = all[i];
  const next = all[(i + 1) % all.length];
  const contact = loadProfile().contact;

  return (
    <article>
      <header className={`wrap ${s.header}`}>
        <Link href="/#work" className={s.back}>
          ← All work
        </Link>
        <p className={s.kicker} data-reveal>
          {c.kicker}
        </p>
        <h1 className={s.title} data-reveal>
          {c.title}
        </h1>
        <p className={s.summary} data-reveal>
          {c.summary}
        </p>
        <dl className={s.meta} data-reveal>
          <div>
            <dt>Role</dt>
            <dd>{c.role}</dd>
          </div>
          <div>
            <dt>When</dt>
            <dd>{c.period}</dd>
          </div>
          <div>
            <dt>Stack</dt>
            <dd>{c.stack.join(" · ")}</dd>
          </div>
          {c.link ? (
            <div>
              <dt>Link</dt>
              <dd>
                <a href={c.link.href} target="_blank" rel="noopener">
                  {c.link.label} ↗
                </a>
              </dd>
            </div>
          ) : null}
        </dl>
      </header>

      <section className={s.stats} aria-label="Key numbers">
        <div className={`wrap ${s.statsInner}`}>
          {c.stats.map((st) => (
            <div key={st.label} data-reveal>
              <p className={`${s.statValue} num`}>{st.value}</p>
              <p className={s.statLabel}>{st.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className={`wrap ${s.body}`}>
        <section className={s.block} data-reveal>
          <h2>The problem</h2>
          <div>
            {c.problem.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </div>
        </section>
        <section className={s.block} data-reveal>
          <h2>What I did</h2>
          <ul>
            {c.did.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>
        <section className={s.block} data-reveal>
          <h2>Outcome</h2>
          <div>
            {c.outcome.map((t) => (
              <p key={t} className={s.outcome}>
                {t}
              </p>
            ))}
          </div>
        </section>
      </div>

      <nav className={`wrap ${s.foot} no-print`} aria-label="Case study navigation">
        <Link href={`/work/${next.slug}/`} className={s.next}>
          <span>Next case study</span>
          {next.title} →
        </Link>
        <div className={s.footCta}>
          <a href={`mailto:${contact.email}`}>Email me</a>
          <a href={CV_PATH} download>
            Download CV
          </a>
        </div>
      </nav>
    </article>
  );
}
