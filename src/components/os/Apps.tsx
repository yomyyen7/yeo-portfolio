"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { profile } from "@/lib/data";
import { Avatar, type AppId } from "./icons";
import { useI18n } from "./i18n";
import type { ModelId } from "../three/LabCanvas";

function LabLoading() {
  const { tr } = useI18n();
  return <div className="lab-loading">{tr("Chargement de la scène…", "Loading the scene…")}</div>;
}

const LabCanvas = dynamic(() => import("../three/LabCanvas"), { ssr: false, loading: () => <LabLoading /> });

type Open = (id: AppId) => void;

/* ───────────── À propos ───────────── */
export function About({ openApp }: { openApp: Open }) {
  const { c, tr } = useI18n();
  return (
    <div className="app-pad about">
      <header className="about-head">
        <Avatar src={profile.photo} />
        <div>
          <h1>{profile.name}</h1>
          <p className="role">{c.title}</p>
          <p className="muted">
            {c.tagline} · {c.location}
          </p>
        </div>
      </header>

      <div className="about-bio">
        {c.bio.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="tiles">
        <div className="tile">
          <b>{tr("Master 1 CSIA", "Master's, year 1 (CSIA)")}</b>
          <span>{tr("Cybersécurité & IA · ESATIC · en cours", "Cybersecurity & AI · ESATIC · in progress")}</span>
        </div>
        <div className="tile">
          <b>{tr("Licence SIGL", "Bachelor's (SIGL)")}</b>
          <span>{tr("Génie logiciel · ESATIC · obtenue", "Software engineering · ESATIC · completed")}</span>
        </div>
        <div className="tile">
          <b>
            {c.projects.length} {tr("projets", "projects")}
          </b>
          <span>{tr("web, mobile, IA", "web, mobile, AI")}</span>
        </div>
        <div className="tile">
          <b>Hackathon</b>
          <span>SMARTWATT IUA 2025</span>
        </div>
      </div>

      <div className="row-actions">
        <button className="btn primary" onClick={() => openApp("projects")}>
          {tr("Voir mes projets", "View my projects")}
        </button>
        <button className="btn" onClick={() => openApp("assistant")}>
          {tr("Demander à l'assistant IA", "Ask the AI assistant")}
        </button>
        <button className="btn" onClick={() => openApp("contact")}>
          {tr("Me contacter", "Contact me")}
        </button>
        <a className="btn" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn ↗
        </a>
        <a className="btn" href={profile.github} target="_blank" rel="noopener noreferrer">
          GitHub ↗
        </a>
      </div>
    </div>
  );
}

/* ───────────── Projets (explorateur) ───────────── */
const FILTERS = ["Tous", "Web", "Mobile", "IA", "Hackathon"] as const;
const FILTER_EN: Record<(typeof FILTERS)[number], string> = { Tous: "All", Web: "Web", Mobile: "Mobile", IA: "AI", Hackathon: "Hackathon" };

export function Projects({ initial = null }: { initial?: string | null }) {
  const { c, tr, lang } = useI18n();
  const projects = c.projects;
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Tous");
  const [selected, setSelected] = useState<string | null>(initial);
  const list = projects.filter((p) => filter === "Tous" || p.tags.includes(filter));
  const current = projects.find((p) => p.id === selected);
  const label = (f: (typeof FILTERS)[number]) => (lang === "fr" ? f : FILTER_EN[f]);

  return (
    <div className="explorer">
      <nav className="explorer-side" aria-label={tr("Catégories", "Categories")}>
        <p className="side-title">{tr("Emplacements", "Locations")}</p>
        {FILTERS.map((f) => (
          <button
            key={f}
            className={f === filter ? "active" : ""}
            onClick={() => {
              setFilter(f);
              setSelected(null);
            }}
          >
            <span>{label(f)}</span>
            <i>{f === "Tous" ? projects.length : projects.filter((p) => p.tags.includes(f)).length}</i>
          </button>
        ))}
      </nav>

      <div className="explorer-main">
        <div className="path">
          <button onClick={() => setSelected(null)}>~/{tr("projets", "projects")}</button>
          {filter !== "Tous" && <span>/ {label(filter).toLowerCase()}</span>}
          {current && <span>/ {current.file}</span>}
        </div>

        {current ? (
          <article className="project-detail">
            <div className="cover big" style={{ ["--h" as string]: current.hue }}>
              <span>{current.kind}</span>
            </div>
            <h2>{current.name}</h2>
            <p className="muted">
              {current.context} · {current.date}
            </p>
            <p className="lead">{current.summary}</p>
            <ul>
              {current.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            <dl>
              <dt>{tr("Rôle", "Role")}</dt>
              <dd>{current.role}</dd>
              <dt>{tr("Technologies", "Stack")}</dt>
              <dd className="chips">
                {current.stack.map((s) => (
                  <span key={s} className="chip">
                    {s}
                  </span>
                ))}
              </dd>
            </dl>
            <div className="row-actions">
              <button className="btn" onClick={() => setSelected(null)}>
                ← {tr("Retour", "Back")}
              </button>
              {current.repo && (
                <a className="btn primary" href={current.repo} target="_blank" rel="noopener noreferrer">
                  {tr("Voir le code sur GitHub", "View the code on GitHub")} ↗
                </a>
              )}
            </div>
          </article>
        ) : (
          <div className="project-grid">
            {list.map((p) => (
              <button key={p.id} className="project-card" onClick={() => setSelected(p.id)}>
                <div className="cover" style={{ ["--h" as string]: p.hue }}>
                  <span>{p.kind}</span>
                </div>
                <h3>{p.name}</h3>
                <p>{p.summary}</p>
                <div className="chips">
                  {p.stack.slice(0, 3).map((s) => (
                    <span key={s} className="chip">
                      {s}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ───────────── Compétences (moniteur système) ───────────── */
export function Skills() {
  const { c, tr } = useI18n();
  const total = c.skills.reduce((n, g) => n + g.items.length, 0);
  return (
    <div className="app-pad monitor">
      <div className="monitor-head">
        <div>
          <b>{total}</b>
          <span>{tr("technologies", "technologies")}</span>
        </div>
        <div>
          <b>{c.skills.length}</b>
          <span>{tr("domaines", "areas")}</span>
        </div>
        <div>
          <b>{c.projects.length}</b>
          <span>{tr("projets réalisés", "projects built")}</span>
        </div>
      </div>
      {c.skills.map((g) => (
        <section key={g.unit} className="skill-group">
          <h3>
            <span className="unit">{g.unit}</span>
            {g.group}
            <i>{g.items.length}</i>
          </h3>
          <div className="chips">
            {g.items.map((s) => (
              <span key={s} className="chip lg">
                {s}
              </span>
            ))}
          </div>
        </section>
      ))}
      <section className="skill-group">
        <h3>
          <span className="unit">i18n</span>
          {tr("Langues", "Spoken languages")}
        </h3>
        {c.languages.map((l) => (
          <div key={l.name} className="lang">
            <span>{l.name}</span>
            <div className="meter" role="img" aria-label={l.level}>
              {Array.from({ length: 6 }, (_, i) => (
                <i key={i} className={i < l.value ? "on" : ""} />
              ))}
            </div>
            <span className="muted">{l.level}</span>
          </div>
        ))}
      </section>
    </div>
  );
}

/* ───────────── Parcours ───────────── */
export function Journey() {
  const { c, tr } = useI18n();
  return (
    <div className="app-pad journey">
      <h2>{tr("Formation", "Education")}</h2>
      <ol className="timeline">
        {c.education.map((e) => (
          <li key={e.title} className={e.current ? "current" : ""}>
            <span className="when">{e.period}</span>
            <b>{e.title}</b>
            {e.place && <span className="muted">{e.place}</span>}
          </li>
        ))}
      </ol>
      <h2>{tr("Expériences académiques", "Academic experience")}</h2>
      <ol className="timeline">
        {c.experiences.map((e) => (
          <li key={e.title}>
            <span className="when">{e.period}</span>
            <b>{e.title}</b>
            <span className="muted">{e.place}</span>
            <span className="role-line">{e.role}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ───────────── Atelier 3D ───────────── */
export function Lab() {
  const { tr } = useI18n();
  const [model, setModel] = useState<ModelId>("net");
  const [wire, setWire] = useState(false);
  const [spin, setSpin] = useState(true);
  const [glow, setGlow] = useState(true);

  const models: { id: ModelId; label: string; note: string }[] = [
    {
      id: "core",
      label: tr("Noyau", "Core"),
      note: tr(
        "Sphère organique déformée en temps réel, cage filaire et anneaux en orbite.",
        "An organic sphere distorted in real time, a wireframe cage and orbiting rings."
      ),
    },
    {
      id: "net",
      label: tr("Réseau de neurones", "Neural network"),
      note: tr(
        "Couches de neurones, connexions et impulsions qui circulent : l'IA en image.",
        "Layers of neurons, connections and travelling pulses: AI, pictured."
      ),
    },
    {
      id: "shield",
      label: tr("Bouclier", "Shield"),
      note: tr(
        "Forme extrudée et biseautée, comme dans un logiciel de modélisation : la cybersécurité.",
        "An extruded, bevelled shape, as in a modelling tool: cybersecurity."
      ),
    },
  ];
  const note = models.find((m) => m.id === model)!.note;

  return (
    <div className="lab">
      <div className="lab-stage">
        <LabCanvas model={model} wire={wire} spin={spin} glow={glow} />
        <p className="lab-hint">{tr("Glissez pour tourner · molette pour zoomer", "Drag to rotate · scroll to zoom")}</p>
      </div>
      <div className="lab-panel">
        <div className="seg" role="tablist" aria-label={tr("Modèle", "Model")}>
          {models.map((m) => (
            <button key={m.id} role="tab" aria-selected={m.id === model} className={m.id === model ? "active" : ""} onClick={() => setModel(m.id)}>
              {m.label}
            </button>
          ))}
        </div>
        <p className="muted lab-note">{note}</p>
        <div className="lab-toggles">
          <label className="switch">
            <input type="checkbox" checked={wire} onChange={(e) => setWire(e.target.checked)} />
            <span>{tr("Fil de fer", "Wireframe")}</span>
          </label>
          <label className="switch">
            <input type="checkbox" checked={spin} onChange={(e) => setSpin(e.target.checked)} />
            <span>{tr("Rotation auto", "Auto-rotate")}</span>
          </label>
          <label className="switch">
            <input type="checkbox" checked={glow} onChange={(e) => setGlow(e.target.checked)} />
            <span>{tr("Halo lumineux", "Glow")}</span>
          </label>
        </div>
      </div>
    </div>
  );
}

/* ───────────── GitHub (en direct) ───────────── */
type Repo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  fork: boolean;
  pushed_at: string;
};

const LANG_COLORS: Record<string, string> = {
  Dart: "#00b4ab",
  Python: "#3572a5",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Java: "#b07219",
  Kotlin: "#a97bff",
  HTML: "#e34c26",
  CSS: "#663399",
};

export function GitHub() {
  const { tr, locale } = useI18n();
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const key = "yeoos-repos";
    try {
      const cached = sessionStorage.getItem(key);
      if (cached) {
        setRepos(JSON.parse(cached));
        return;
      }
    } catch {
      /* stockage indisponible : on interroge simplement l'API */
    }
    const ctl = new AbortController();
    fetch(`https://api.github.com/users/${profile.githubUser}/repos?sort=pushed&per_page=30`, { signal: ctl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: Repo[]) => {
        const sorted = [...data].sort((a, b) => Number(a.fork) - Number(b.fork));
        setRepos(sorted);
        try {
          sessionStorage.setItem(key, JSON.stringify(sorted));
        } catch {
          /* sans cache, rien de grave */
        }
      })
      .catch((e) => e.name !== "AbortError" && setFailed(true));
    return () => ctl.abort();
  }, []);

  return (
    <div className="app-pad gh">
      <header className="gh-head">
        <div>
          <h2>@{profile.githubUser}</h2>
          <p className="muted">
            <span className="live" /> {tr("Dépôts chargés en direct depuis GitHub", "Repositories loaded live from GitHub")}
          </p>
        </div>
        <a className="btn primary" href={profile.github} target="_blank" rel="noopener noreferrer">
          {tr("Voir le profil", "View profile")} ↗
        </a>
      </header>

      {failed && (
        <p className="gh-state">
          {tr(
            "Impossible de joindre GitHub pour le moment. Le profil reste accessible avec le bouton ci-dessus.",
            "GitHub cannot be reached right now. The profile is still available from the button above."
          )}
        </p>
      )}
      {!failed && !repos && (
        <div className="gh-list" aria-busy="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="gh-repo skeleton" />
          ))}
        </div>
      )}
      {repos && repos.length === 0 && (
        <p className="gh-state">{tr("Aucun dépôt public pour l'instant.", "No public repositories yet.")}</p>
      )}
      {repos && repos.length > 0 && (
        <div className="gh-list">
          {repos.map((r) => (
            <a key={r.id} className="gh-repo" href={r.html_url} target="_blank" rel="noopener noreferrer">
              <div className="gh-name">
                <b>{r.name}</b>
                {r.fork && <span className="chip">fork</span>}
              </div>
              <p>{r.description ?? tr("Pas encore de description.", "No description yet.")}</p>
              <div className="gh-meta">
                {r.language && (
                  <span>
                    <i style={{ background: LANG_COLORS[r.language] ?? "#8d93a5" }} />
                    {r.language}
                  </span>
                )}
                <span>
                  {tr("Mis à jour le", "Updated on")}{" "}
                  {new Date(r.pushed_at).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/* ───────────── Contact ───────────── */
export function Contact() {
  const { c, tr } = useI18n();
  const [copied, setCopied] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* presse-papiers indisponible : le lien mailto reste utilisable */
    }
  }

  return (
    <div className="app-pad contact">
      <h2>{tr("Travaillons ensemble", "Let's work together")}</h2>
      <p className="muted">
        {tr(
          "Stage, projet ou simple question : écrivez-moi, je réponds volontiers.",
          "Internship, project or just a question: write to me, I am happy to reply."
        )}
      </p>

      <div className="contact-cards">
        <div className="contact-card">
          <span className="k">Email</span>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <button className="btn sm" onClick={copy}>
            {copied ? tr("Copié ✓", "Copied ✓") : tr("Copier", "Copy")}
          </button>
        </div>
        <div className="contact-card">
          <span className="k">LinkedIn</span>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            {profile.linkedinLabel}
          </a>
        </div>
        <div className="contact-card">
          <span className="k">GitHub</span>
          <a href={profile.github} target="_blank" rel="noopener noreferrer">
            github.com/{profile.githubUser}
          </a>
        </div>
        <div className="contact-card">
          <span className="k">{tr("Localisation", "Location")}</span>
          <span>{c.location}</span>
        </div>
      </div>

      <form
        className="composer"
        onSubmit={(e) => {
          e.preventDefault();
          window.location.href = mailto;
        }}
      >
        <label>
          <span>{tr("Objet", "Subject")}</span>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder={tr("Proposition de stage", "Internship offer")} />
        </label>
        <label>
          <span>Message</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder={tr(`Bonjour ${profile.firstName}…`, `Hello ${profile.firstName}…`)}
          />
        </label>
        <button className="btn primary" type="submit">
          {tr("Ouvrir dans ma messagerie", "Open in my mail app")}
        </button>
      </form>
    </div>
  );
}
