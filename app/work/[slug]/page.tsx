import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CV_PATH, caseStudies } from "@/content/site";
import { countable, loadProfile } from "@/lib/profile";
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
      <header className={`wrap ${s.header}`} data-spotlight>
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
          {c.stats.map((st, n) => (
            <div key={st.label} data-reveal style={{ "--d": `${n * 120}ms` } as React.CSSProperties}>
              <p className={`${s.statValue} num`} {...(countable(st.value) ? { "data-count": "" } : {})}>
                {st.value}
              </p>
              <p className={s.statLabel}>{st.label}</p>
            </div>
          ))}
        </div>
      </section>

      <div className={`wrap ${s.body}`}>
        <aside className={s.toc} aria-label="On this page">
          <a href="#problem" data-spy="problem">
            The problem
          </a>
          <a href="#did" data-spy="did">
            What I did
          </a>
          <a href="#outcome" data-spy="outcome">
            Outcome
          </a>
        </aside>
        <div>
          <section id="problem" className={s.block} data-reveal>
            <h2>The problem</h2>
            <div>
              {c.problem.map((t) => (
                <p key={t}>{t}</p>
              ))}
            </div>
          </section>
          <section id="did" className={s.block}>
            <h2 data-reveal>What I did</h2>
            <ul>
              {c.did.map((t, n) => (
                <li key={t} data-reveal style={{ "--d": `${(n % 3) * 80}ms` } as React.CSSProperties}>
                  {t}
                </li>
              ))}
            </ul>
          </section>
          <section id="outcome" className={s.block} data-reveal>
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
      </div>

      <nav className={`wrap ${s.foot} no-print`} aria-label="Case study navigation">
        <Link href={`/work/${next.slug}/`} className={s.next} data-tilt>
          <span>Next case study</span>
          <strong>{next.title}</strong>
          <em>{next.summary}</em>
          <b aria-hidden="true">→</b>
        </Link>
        <div className={s.footCta}>
          <a href={`mailto:${contact.email}`} data-magnetic>
            Email me
          </a>
          <a href={CV_PATH} download data-magnetic>
            Download CV
          </a>
        </div>
      </nav>
    </article>
  );
}
