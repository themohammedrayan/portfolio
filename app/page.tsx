import Link from "next/link";
import {
  CV_PATH,
  GITHUB,
  SITE_URL,
  TIMELINE_BULLETS,
  caseStudies,
  heroStats,
  howIWork,
  proofStrip,
} from "@/content/site";
import { bullet, formatMonth, loadProfile } from "@/lib/profile";
import s from "./home.module.css";

export default function Home() {
  const p = loadProfile();
  const c = p.contact;
  const work = caseStudies();
  const edu = p.education[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: c.name,
    jobTitle: c.headline_default,
    worksFor: { "@type": "Organization", name: p.experience[0].company },
    alumniOf: edu.institution,
    email: `mailto:${c.email}`,
    url: SITE_URL,
    sameAs: [`https://${c.linkedin}`, `https://${GITHUB}`],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <header className={`wrap ${s.hero}`}>
        <div>
          <p className={s.eyebrow} data-reveal>
            <span className={s.dot} aria-hidden="true" />
            Open to product roles in Bangalore<span className={s.hideSm}>&nbsp;· {c.availability}</span>
          </p>
          <h1 className={s.title} data-reveal>
            I find the problem in the data, write the spec, <em>build it</em>,
            and launch it.
          </h1>
          <p className={s.lede} data-reveal>
            I&rsquo;m {c.name.replace(/ A$/, "")}, a product analyst and team
            lead at {p.experience[0].company}. For the last two years I&rsquo;ve
            worked on the admissions and payments platform behind its Kerala
            centres, and today I own it: from the first SQL query to the
            training session on launch day.
          </p>
          <div className={s.ctas} data-reveal>
            <a className={s.primary} href={CV_PATH} download>
              Download CV
            </a>
            <a className={s.secondary} href={`mailto:${c.email}`}>
              {c.email}
            </a>
            <a
              className={s.ghost}
              href={`https://${c.linkedin}`}
              target="_blank"
              rel="noopener"
            >
              LinkedIn ↗
            </a>
          </div>
        </div>

        <dl className={s.stats}>
          {heroStats().map((st) => (
            <div key={st.label} className={s.stat} data-reveal>
              <dt className={`${s.statValue} num`}>{st.value}</dt>
              <dd className={s.statLabel}>{st.label}</dd>
            </div>
          ))}
        </dl>
      </header>

      {/* Proof strip */}
      <section className={s.strip} aria-label="At a glance">
        <div className={`wrap ${s.stripInner}`}>
          {proofStrip().map((st) => (
            <div key={st.label} className={s.stripItem}>
              <span className="num">{st.value}</span> {st.label}
            </div>
          ))}
        </div>
      </section>

      {/* Work */}
      <section id="work" className={`wrap ${s.section}`}>
        <div className={s.head} data-reveal>
          <p className={s.label}>Selected work</p>
          <h2 className={s.h2}>
            Things I&rsquo;ve shipped, and what they changed.
          </h2>
        </div>
        <div className={s.grid}>
          {work.map((w, i) => (
            <Link
              key={w.slug}
              href={`/work/${w.slug}/`}
              className={`${s.card} ${i < 2 ? s.cardWide : ""}`}
              data-reveal
            >
              <p className={s.kicker}>{w.kicker}</p>
              <h3 className={s.cardTitle}>{w.title}</h3>
              <p className={s.cardText}>{w.summary}</p>
              <div className={s.cardStats}>
                {w.stats.slice(0, 2).map((st) => (
                  <span key={st.label}>
                    <b className="num">{st.value}</b> {st.label}
                  </span>
                ))}
              </div>
              <span className={s.more}>Read the case study →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* How I work */}
      <section className={s.how}>
        <div className={`wrap ${s.section}`}>
          <div className={s.head} data-reveal>
            <p className={s.label}>How I work</p>
            <h2 className={s.h2}>
              An analyst who doesn&rsquo;t stop at the dashboard.
            </h2>
          </div>
          <ol className={s.steps}>
            {howIWork().map((h, i) => (
              <li key={h.step} data-reveal>
                <span className={`${s.stepNum} num`}>0{i + 1}</span>
                <h3>{h.step}</h3>
                <p>{h.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className={`wrap ${s.section}`}>
        <div className={s.head} data-reveal>
          <p className={s.label}>Experience</p>
          <h2 className={s.h2}>Where I&rsquo;ve done it.</h2>
        </div>
        <ol className={s.timeline}>
          {p.experience.map((e) => (
            <li key={e.id} className={s.role} data-reveal>
              <div className={s.when}>
                <span className="num">
                  {formatMonth(e.start)} – {formatMonth(e.end)}
                </span>
                <span>{e.location}</span>
              </div>
              <div>
                <h3 className={s.roleTitle}>{e.title}</h3>
                <p className={s.company}>{e.company}</p>
                <ul className={s.bullets}>
                  {(TIMELINE_BULLETS[e.id] ?? []).map((id) => (
                    <li key={id}>{bullet(id)}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Toolkit */}
      <section className={s.how}>
        <div className={`wrap ${s.section}`}>
          <div className={s.head} data-reveal>
            <p className={s.label}>Toolkit</p>
            <h2 className={s.h2}>What I reach for.</h2>
          </div>
          <div className={s.tools}>
            <div data-reveal>
              <h3>Product</h3>
              <ul className={s.chips}>
                {p.skills.product.map((k) => (
                  <li key={k}>{k}</li>
                ))}
              </ul>
            </div>
            <div data-reveal>
              <h3>Technical</h3>
              <ul className={s.chips}>
                {p.skills.technical.map((k) => (
                  <li key={k}>{k}</li>
                ))}
              </ul>
            </div>
            <div data-reveal>
              <h3>Certificates</h3>
              <ul className={s.certs}>
                {p.certificates.map((k) => (
                  <li key={k.id}>
                    {k.name}
                    {k.issuer ? <span> · {k.issuer}</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className={`wrap ${s.section} ${s.about}`}>
        <div className={s.head} data-reveal>
          <p className={s.label}>About</p>
          <h2 className={s.h2}>
            Engineer by training, product person by habit.
          </h2>
        </div>
        <div className={s.aboutBody} data-reveal>
          <p>
            I studied Mechanical Engineering at NIT Calicut, spent my final year
            writing and evaluating code to train large language models at
            Outlier, and joined Xylem Learning as an analyst. The job quickly
            became less about reporting what happened and more about fixing why:
            first by writing specs for a vendor, then by building the fixes
            myself.
          </p>
          <p>
            Today I lead a team of 5, own the platform end to end, and still
            build side products: a ranked exam-prep app, a WhatsApp bot for a
            local e-Centre, and the tool that tailors my CV.
          </p>
          <div className={s.edu}>
            <p className={s.eduDeg}>{edu.degree}</p>
            <p>
              {edu.institution} ·{" "}
              <span className="num">
                {formatMonth(edu.start)} – {formatMonth(edu.end)}
              </span>
            </p>
            {edu.extra ? <p className={s.eduExtra}>{edu.extra}</p> : null}
          </div>
        </div>
      </section>

      {/* Contact */}
      <footer id="contact" className={s.contact}>
        <div className={`wrap ${s.section}`}>
          <p className={s.label}>Contact</p>
          <h2 className={s.contactTitle} data-reveal>
            Hiring for product, analytics or ops? <br />
            <a href={`mailto:${c.email}`}>Let&rsquo;s talk.</a>
          </h2>
          <ul className={s.contactList}>
            <li>
              <span>Email</span>
              <a href={`mailto:${c.email}`}>{c.email}</a>
            </li>
            <li>
              <span>Phone</span>
              <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="num">
                {c.phone}
              </a>
            </li>
            <li>
              <span>LinkedIn</span>
              <a href={`https://${c.linkedin}`} target="_blank" rel="noopener">
                {c.linkedin}
              </a>
            </li>
            <li>
              <span>GitHub</span>
              <a href={`https://${GITHUB}`} target="_blank" rel="noopener">
                {GITHUB}
              </a>
            </li>
            <li>
              <span>Location</span>
              {c.location} · {c.availability}
            </li>
          </ul>
          <p className={s.fine}>
            Every number on this site comes from the same hand-verified fact
            bank as my CV, and a test fails the build if one doesn&rsquo;t.
          </p>
        </div>
      </footer>
    </>
  );
}
