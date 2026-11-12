"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { profile, type Project } from "@/lib/data";
import { I18nProvider, useI18n } from "@/lib/i18n";
import LangToggle from "./LangToggle";
import Repos from "./Repos";

const Globe = dynamic(() => import("./Globe"), { ssr: false });

const FEATURED = 3;

function Header() {
  const { tr } = useI18n();
  return (
    <header className="header">
      <div className="wrap header-row">
        <a href="#top" className="brand">
          {profile.name}
        </a>
        <nav className="nav" aria-label={tr("Navigation principale", "Main navigation")}>
          <a href="#projets" className="nav-section">{tr("Projets", "Work")}</a>
          <a href="#parcours" className="nav-section">{tr("Parcours", "Background")}</a>
          <a href="#contact" className="nav-section">Contact</a>
          <Link href="/cv" className="nav-cv">
            CV
          </Link>
          <LangToggle />
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  const { c, tr } = useI18n();
  return (
    <section className="hero wrap" id="top">
      <div className="hero-text">
        <p className="status">
          <span className="status-dot" aria-hidden="true" />
          {c.availability}
        </p>
        <h1>{c.headline}</h1>
        <div className="identity">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={profile.photo} alt={profile.name} width={56} height={56} />
          <div>
            <b>{profile.name}</b>
            <span>
              {c.status} · {c.location}
            </span>
          </div>
        </div>
        <div className="actions">
          <Link href="/cv" className="button primary">
            {tr("Voir le CV", "View CV")}
          </Link>
          <a href={`mailto:${profile.email}`} className="button">
            {tr("Me contacter", "Get in touch")}
          </a>
        </div>
      </div>
      <div className="hero-visual" aria-hidden="true">
        <Globe />
      </div>
    </section>
  );
}

function CaseStudy({ p, index }: { p: Project; index: number }) {
  const { tr } = useI18n();
  return (
    <article className="case">
      <div className="case-index">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <span>{p.year}</span>
      </div>
      <div className="case-body">
        <h3>{p.name}</h3>
        <p className="case-summary">{p.summary}</p>
        {p.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="case-image" src={p.image} alt={tr(`Capture d'écran de ${p.name}`, `Screenshot of ${p.name}`)} />
        )}
        <dl className="case-facts">
          <div>
            <dt>{tr("Contexte", "Context")}</dt>
            <dd>{p.context}</dd>
          </div>
          <div>
            <dt>{tr("Rôle", "Role")}</dt>
            <dd>{p.role}</dd>
          </div>
          <div>
            <dt>{tr("Besoin", "Need")}</dt>
            <dd>{p.problem}</dd>
          </div>
          <div>
            <dt>{tr("Réalisation", "What I did")}</dt>
            <dd>
              <ul>
                {p.work.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </dd>
          </div>
          <div>
            <dt>{tr("Technologies", "Stack")}</dt>
            <dd className="stack">{p.stack.join(" · ")}</dd>
          </div>
        </dl>
        {p.repo && (
          <a className="text-link" href={p.repo} target="_blank" rel="noopener noreferrer">
            {tr("Code source sur GitHub", "Source code on GitHub")} ↗
          </a>
        )}
      </div>
    </article>
  );
}

function Work() {
  const { c, tr } = useI18n();
  const featured = c.projects.slice(0, FEATURED);
  const others = c.projects.slice(FEATURED);
  return (
    <section className="section wrap" id="projets">
      <h2 className="section-title">{tr("Projets sélectionnés", "Selected work")}</h2>
      <div className="cases">
        {featured.map((p, i) => (
          <CaseStudy key={p.id} p={p} index={i} />
        ))}
      </div>

      <h3 className="sub-title">{tr("Autres projets", "Other projects")}</h3>
      <ul className="rows">
        {others.map((p) => (
          <li key={p.id} className="row">
            <span className="row-year">{p.year}</span>
            <div className="row-main">
              <b>{p.name}</b>
              <span>{p.summary}</span>
            </div>
            <span className="row-meta">
              {p.repo ? (
                <a className="text-link" href={p.repo} target="_blank" rel="noopener noreferrer">
                  GitHub ↗
                </a>
              ) : (
                p.stack.slice(0, 2).join(" · ")
              )}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function About() {
  const { c, tr } = useI18n();
  return (
    <section className="section wrap split" id="a-propos">
      <h2 className="section-title">{tr("À propos", "About")}</h2>
      <div className="prose">
        {c.bio.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <p className="muted">
          {tr("Langues", "Languages")} : {c.languages.map((l) => `${l.name}, ${l.level}`).join(" · ")}.
        </p>
      </div>
    </section>
  );
}

function Background() {
  const { c, tr } = useI18n();
  return (
    <section className="section wrap" id="parcours">
      <h2 className="section-title">{tr("Parcours", "Background")}</h2>
      <div className="columns">
        <div>
          <h3 className="sub-title first">{tr("Formation", "Education")}</h3>
          <ol className="timeline">
            {c.education.map((e) => (
              <li key={e.title}>
                <span className="when">
                  {e.period}
                  {e.current && <em>{tr("en cours", "current")}</em>}
                </span>
                <b>{e.title}</b>
                <span className="muted">{e.place}</span>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h3 className="sub-title first">{tr("Expériences", "Experience")}</h3>
          <ol className="timeline">
            {c.experiences.map((e) => (
              <li key={e.title}>
                <span className="when">{e.period}</span>
                <b>{e.title}</b>
                <span className="muted">
                  {e.role}, {e.place}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  const { c, tr } = useI18n();
  return (
    <section className="section wrap split" id="competences">
      <h2 className="section-title">{tr("Compétences", "Skills")}</h2>
      <dl className="skills">
        {c.skills.map((g) => (
          <div key={g.group}>
            <dt>{g.group}</dt>
            <dd>{g.items.join(", ")}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Contact() {
  const { c, tr } = useI18n();
  return (
    <section className="section wrap contact" id="contact">
      <h2 className="section-title">Contact</h2>
      <p className="contact-lead">
        {tr(
          "Pour un stage, un projet ou une question, le plus simple est de m'écrire.",
          "For an internship, a project or a question, the easiest way is to email me."
        )}
      </p>
      <a className="contact-mail" href={`mailto:${profile.email}`}>
        {profile.email}
      </a>
      <ul className="contact-links">
        <li>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn ↗
          </a>
        </li>
        <li>
          <a href={profile.github} target="_blank" rel="noopener noreferrer">
            GitHub ↗
          </a>
        </li>
        <li>
          <Link href="/cv">CV</Link>
        </li>
        <li className="muted">{c.location}</li>
      </ul>
    </section>
  );
}

function Page() {
  const { tr } = useI18n();
  return (
    <>
      <a href="#projets" className="skip">
        {tr("Aller aux projets", "Skip to work")}
      </a>
      <Header />
      <main>
        <Hero />
        <Work />
        <About />
        <Background />
        <Skills />
        <Repos />
        <Contact />
      </main>
      <footer className="footer wrap">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <a href="https://github.com/yomyyen7/yeo-portfolio" target="_blank" rel="noopener noreferrer">
          {tr("Code de ce site", "Source of this site")} ↗
        </a>
      </footer>
    </>
  );
}

export default function Site() {
  return (
    <I18nProvider>
      <Page />
    </I18nProvider>
  );
}
