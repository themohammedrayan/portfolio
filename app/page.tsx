import Link from "next/link";
import CopyEmail from "@/components/CopyEmail";
import RoleTicker from "@/components/RoleTicker";
import { GitHubIcon, LinkedInIcon } from "@/components/Icons";
import {
  CV_PATH,
  GITHUB,
  SITE_URL,
  TIMELINE_BULLETS,
  caseStudies,
  heroStats,
  howIWork,
  proofStrip,
  roles,
  usedIn,
} from "@/content/site";
import { bullet, formatMonth, loadProfile } from "@/lib/profile";
import s from "./home.module.css";

const HEADLINE = ["I", "find", "the", "problem", "in", "the", "data,", "write", "the", "spec,"];

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export default function Home() {
  const p = loadProfile();
  const c = p.contact;
  const work = caseStudies();
  const edu = p.education[0];
  const strip = proofStrip();

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <header className={s.heroShell} data-spotlight>
        <div className={s.bg} aria-hidden="true">
          <div className={s.dots} />
          <div className={`${s.blob} ${s.blobA}`} />
          <div className={`${s.blob} ${s.blobB}`} />
          <div className={`${s.blob} ${s.blobC}`} />
          <div className={s.spot} />
        </div>

        <div className={`wrap ${s.hero}`}>
          <div>
            <p className={s.eyebrow} data-reveal>
              <span className={s.dot} aria-hidden="true" />
              Open to product roles in Bangalore<span className={s.hideSm}>&nbsp;· {c.availability}</span>
            </p>
            <p className={s.whoami} data-reveal style={delay(80)}>
              {c.name} <span className={s.slash}>/</span> <RoleTicker roles={roles()} />
            </p>
            <h1 className={s.title}>
              {HEADLINE.map((w, i) => (
                <span key={i} className={s.word} style={{ "--i": i } as React.CSSProperties}>
                  {w}{" "}
                </span>
              ))}
              <span className={s.word} style={{ "--i": 10 } as React.CSSProperties}>
                <span className={s.hl}>
                  <em>build&nbsp;it</em>
                  <svg className={s.scribble} viewBox="0 0 220 24" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M3 16 C 50 6, 110 4, 217 12 M 20 21 C 80 14, 140 13, 200 18" />
                  </svg>
                </span>
                ,{" "}
              </span>
              <span className={s.word} style={{ "--i": 11 } as React.CSSProperties}>
                and{" "}
              </span>
              <span className={s.word} style={{ "--i": 12 } as React.CSSProperties}>
                launch{" "}
              </span>
              <span className={s.word} style={{ "--i": 13 } as React.CSSProperties}>
                it.
              </span>
            </h1>
            <p className={s.lede} data-reveal style={delay(700)}>
              I&rsquo;m a product analyst and team lead at {p.experience[0].company}. For the last two years I&rsquo;ve
              worked on the admissions and payments platform behind its Kerala centres, and today I own it: from the
              first SQL query to the training session on launch day.
            </p>
            <div className={s.ctas} data-reveal style={delay(850)}>
              <a className={s.primary} href={CV_PATH} download data-magnetic>
                <span>Download CV</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 4v12m0 0-5-5m5 5 5-5M5 20h14"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>
              </a>
              <CopyEmail email={c.email} className={s.secondary} />
              <a
                className={s.iconBtn}
                href={`https://${c.linkedin}`}
                target="_blank"
                rel="noopener"
                aria-label="LinkedIn (shortcut L)"
                data-tip="LinkedIn · L"
                data-magnetic
              >
                <LinkedInIcon />
              </a>
              <a
                className={s.iconBtn}
                href={`https://${GITHUB}`}
                target="_blank"
                rel="noopener"
                aria-label="GitHub (shortcut G)"
                data-tip="GitHub · G"
                data-magnetic
              >
                <GitHubIcon />
              </a>
            </div>
          </div>

          <dl className={s.stats}>
            {heroStats().map((st, i) => (
              <div key={st.label} className={s.stat} data-reveal style={delay(900 + i * 140)}>
                <dt className={`${s.statValue} num`} data-count>
                  {st.value}
                </dt>
                <dd className={s.statLabel}>{st.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <a href="#work" className={s.scrollCue} aria-label="Scroll to work">
          <span />
        </a>
      </header>

      {/* Marquee */}
      <section className={s.marquee} aria-label="At a glance">
        {[0, 1].map((copy) => (
          <div key={copy} className={s.track} aria-hidden={copy === 1 ? "true" : undefined}>
            {strip.map((st) => (
              <span key={st.label} className={s.mItem}>
                <b className="num">{st.value}</b> {st.label}
                <i aria-hidden="true">✦</i>
              </span>
            ))}
            {p.default_skills.technical.map((t) => (
              <span key={t} className={`${s.mItem} ${s.mTool}`}>
                {t.split(" (")[0]}
                <i aria-hidden="true">✦</i>
              </span>
            ))}
          </div>
        ))}
      </section>

      {/* Work */}
      <section id="work" className={`wrap ${s.section}`}>
        <div className={s.head} data-reveal>
          <p className={s.label}>Selected work</p>
          <h2 className={s.h2}>Things I&rsquo;ve shipped, and what they changed.</h2>
          <p className={s.headNote}>
            Each card opens a case study. Press <kbd>⌘K</kbd> to jump anywhere.
          </p>
        </div>
        <div className={s.workGrid}>
          {work.map((w, i) => (
            <Link
              key={w.slug}
              href={`/work/${w.slug}/`}
              className={`${s.card} ${i < 2 ? s.cardWide : ""}`}
              data-reveal
              data-tilt
              style={delay((i % 2) * 120)}
            >
              <span className={s.cardGlow} aria-hidden="true" />
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
              <span className={s.more}>
                Read the case study <span className={s.arrow}>→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* How I work: scroll-driven pipeline */}
      <section id="process" className={s.band}>
        <div className={`wrap ${s.section}`}>
          <div className={s.head} data-reveal>
            <p className={s.label}>How I work</p>
            <h2 className={s.h2}>An analyst who doesn&rsquo;t stop at the dashboard.</h2>
          </div>
          <div className={s.pipeline} data-progress data-steps="4">
            <div className={s.rail} aria-hidden="true">
              <div className={s.railFill} />
            </div>
            <ol className={s.steps}>
              {howIWork().map((h, i) => (
                <li key={h.step} className={s.step}>
                  <span className={s.stepDot} aria-hidden="true" />
                  <span className={`${s.stepNum} num`}>0{i + 1}</span>
                  <h3>{h.step}</h3>
                  <p>{h.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className={`wrap ${s.section}`}>
        <div className={s.head} data-reveal>
          <p className={s.label}>Experience</p>
          <h2 className={s.h2}>Where I&rsquo;ve done it.</h2>
        </div>
        <ol className={s.timeline} data-progress>
          {p.experience.map((e) => (
            <li key={e.id} className={s.role} data-reveal>
              <span className={s.node} aria-hidden="true" />
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
      <section id="toolkit" className={s.band}>
        <div className={`wrap ${s.section}`}>
          <div className={s.head} data-reveal>
            <p className={s.label}>Toolkit</p>
            <h2 className={s.h2}>What I reach for.</h2>
            <p className={s.headNote}>Hover or tap a highlighted tool to see where I used it.</p>
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
            <div data-reveal style={delay(120)}>
              <h3>Technical</h3>
              <ul className={s.chips}>
                {p.skills.technical.map((k) => {
                  const used = usedIn(k);
                  return used.length ? (
                    <li key={k} className={s.usedChip} tabIndex={0} data-used={`Used in: ${used.join(", ")}`}>
                      {k}
                    </li>
                  ) : (
                    <li key={k}>{k}</li>
                  );
                })}
              </ul>
            </div>
            <div data-reveal style={delay(240)}>
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
          <h2 className={s.h2}>Engineer by training, product person by habit.</h2>
        </div>
        <div className={s.aboutBody} data-reveal>
          <p>
            I studied Mechanical Engineering at NIT Calicut, spent my final year writing and evaluating code to train
            large language models at Outlier, and joined Xylem Learning as an analyst. The job quickly became less
            about reporting what happened and more about fixing why: first by writing specs for a vendor, then by
            building the fixes myself.
          </p>
          <p>
            Today I lead a team of 5, own the platform end to end, and still build side products: a ranked exam-prep
            app, a WhatsApp bot for a local e-Centre, and the tool that tailors my CV.
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
      <footer id="contact" className={s.contact} data-spotlight>
        <div className={s.contactSpot} aria-hidden="true" />
        <div className={`wrap ${s.section}`}>
          <p className={s.label}>Contact</p>
          <h2 className={s.contactTitle} data-reveal>
            Hiring for product, analytics or ops? <br />
            <a href={`mailto:${c.email}`} className={s.sweep}>
              Let&rsquo;s talk.
            </a>
          </h2>
          <ul className={s.contactList}>
            <li data-reveal>
              <span>Email</span>
              <CopyEmail email={c.email} className={s.contactLink} />
            </li>
            <li data-reveal style={delay(80)}>
              <span>Phone</span>
              <a href={`tel:${c.phone.replace(/\s/g, "")}`} className={`${s.contactLink} num`}>
                {c.phone}
              </a>
            </li>
            <li data-reveal style={delay(160)}>
              <span>LinkedIn</span>
              <a href={`https://${c.linkedin}`} target="_blank" rel="noopener" className={s.contactLink}>
                {c.linkedin}
              </a>
            </li>
            <li data-reveal style={delay(240)}>
              <span>GitHub</span>
              <a href={`https://${GITHUB}`} target="_blank" rel="noopener" className={s.contactLink}>
                {GITHUB}
              </a>
            </li>
            <li data-reveal style={delay(320)}>
              <span>Location</span>
              {c.location} · {c.availability}
            </li>
          </ul>
          <p className={s.fine}>
            Every number on this site comes from the same hand-verified fact bank as my CV, and a test fails the build if
            one doesn&rsquo;t.
          </p>
          <p className={`${s.fine} ${s.keys}`}>
            Shortcuts: <kbd>L</kbd> LinkedIn · <kbd>G</kbd> GitHub · <kbd>E</kbd> copy email · <kbd>C</kbd> CV ·{" "}
            <kbd>T</kbd> theme · <kbd>⌘K</kbd> everything
          </p>
        </div>
      </footer>
    </>
  );
}
