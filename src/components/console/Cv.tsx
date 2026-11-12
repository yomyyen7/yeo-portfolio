"use client";

import Link from "next/link";
import { profile } from "@/lib/data";
import { I18nProvider, useI18n } from "@/lib/i18n";
import LangToggle from "./CvLangToggle";

function CvSheet() {
  const { c, tr } = useI18n();
  return (
    <>
      <div className="cv-bar wrap">
        <Link href="/" className="text-link">
          ← {tr("Retour au portfolio", "Back to portfolio")}
        </Link>
        <div className="cv-bar-actions">
          <LangToggle />
          <button type="button" className="button primary" onClick={() => window.print()}>
            {tr("Enregistrer en PDF", "Save as PDF")}
          </button>
        </div>
      </div>

      <main className="cv">
        <header className="cv-head">
          <div>
            <h1>{profile.name}</h1>
            <p className="cv-role">
              {c.role} · {tr("Cybersécurité et IA", "Cybersecurity and AI")}
            </p>
          </div>
          <ul className="cv-contact">
            <li>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </li>
            <li>
              <a href={profile.linkedin}>linkedin.com/in/yomoyaha-yeo</a>
            </li>
            <li>
              <a href={profile.github}>github.com/{profile.githubUser}</a>
            </li>
            <li>{c.location}</li>
          </ul>
        </header>

        <section className="cv-section">
          <h2>{tr("Profil", "Profile")}</h2>
          <p>
            {c.bio[0]} {c.bio[2]}
          </p>
        </section>

        <section className="cv-section">
          <h2>{tr("Formation", "Education")}</h2>
          {c.events
            .filter((e) => e.kind === "education" || e.kind === "milestone")
            .map((e) => (
              <div key={e.title} className="cv-item">
                <span className="cv-when">{e.date}</span>
                <div>
                  <b>{e.title}</b>
                  <span>{e.detail}</span>
                </div>
              </div>
            ))}
        </section>

        <section className="cv-section">
          <h2>{tr("Projets", "Projects")}</h2>
          {c.projects.map((p) => (
            <div key={p.id} className="cv-item">
              <span className="cv-when">{p.year}</span>
              <div>
                <b>
                  {p.name} <span className="cv-muted">— {p.role}</span>
                </b>
                <span>
                  {p.summary} {p.context}.
                </span>
                <span className="cv-muted">{p.stack.join(", ")}</span>
              </div>
            </div>
          ))}
        </section>

        <section className="cv-section cv-two">
          <div>
            <h2>{tr("Compétences", "Skills")}</h2>
            <dl className="cv-skills">
              {c.skills.map((g) => (
                <div key={g.group}>
                  <dt>{g.group}</dt>
                  <dd>{g.items.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h2>{tr("Langues", "Languages")}</h2>
            <dl className="cv-skills">
              {c.languages.map((l) => (
                <div key={l.name}>
                  <dt>{l.name}</dt>
                  <dd>{l.level}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <footer className="cv-foot">{profile.site.replace("https://", "")}</footer>
      </main>
    </>
  );
}

export default function Cv() {
  return (
    <I18nProvider>
      <CvSheet />
    </I18nProvider>
  );
}

