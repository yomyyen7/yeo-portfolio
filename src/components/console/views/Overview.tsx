"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { profile } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { buildFeed, useEvents, useRepos } from "../github";
import { Panel, Stat, Tag, kindLabel, statusMeta } from "../ui";

const Globe = dynamic(() => import("../Globe"), { ssr: false });

export default function Overview() {
  const { c, lang, tr, locale } = useI18n();
  const repos = useRepos();
  const events = useEvents();
  const ownRepos = repos.data?.filter((r) => !r.fork) ?? null;
  const years = new Date().getFullYear() - profile.since;
  const loaded = Boolean(events.data || events.failed) && Boolean(repos.data || repos.failed);
  const feed = buildFeed(events.data, repos.data, lang, 5);

  return (
    <div className="grid">
      <section className="panel hero">
        <div className="hero-text">
          <p className="eyebrow mono">
            {c.status} · {c.location}
          </p>
          <h1>{profile.name}</h1>
          <p className="lead">{c.headline}</p>
          <div className="actions">
            <Link href="/dossiers" className="btn primary">
              {tr("Voir les dossiers", "View case files")}
            </Link>
            <Link href="/contact" className="btn">
              {tr("Me contacter", "Get in touch")}
            </Link>
            <Link href="/cv" className="btn">
              CV
            </Link>
          </div>
        </div>
        <div className="hero-globe" aria-hidden="true">
          <Globe />
        </div>
      </section>

      <div className="stats">
        <Stat value={c.projects.length} label={tr("dossiers", "case files")} hint={tr("web, mobile, IA", "web, mobile, AI")} />
        <Stat value={ownRepos ? ownRepos.length : "–"} label={tr("dépôts publics", "public repos")} hint="GitHub" />
        <Stat value={years} label={tr("années d'études", "years of study")} hint={tr("depuis 2023", "since 2023")} />
        <Stat value={c.languages.length} label={tr("langues", "languages")} hint={c.languages.map((l) => l.name).join(" · ")} />
      </div>

      <Panel
        title={tr("Dossiers récents", "Recent case files")}
        aside={
          <Link href="/dossiers" className="link">
            {tr("Tous les dossiers", "All case files")} →
          </Link>
        }
        className="span-2"
      >
        <table className="table">
          <thead>
            <tr>
              <th>Réf.</th>
              <th>{tr("Projet", "Project")}</th>
              <th className="hide-sm">{tr("Type", "Type")}</th>
              <th>{tr("Statut", "Status")}</th>
              <th className="hide-sm">{tr("Technologies", "Stack")}</th>
            </tr>
          </thead>
          <tbody>
            {c.projects.slice(0, 3).map((p) => {
              const s = statusMeta(p.status, lang);
              return (
                <tr key={p.id}>
                  <td className="mono">
                    <Link href={`/dossiers/${p.id}`}>{p.code}</Link>
                  </td>
                  <td>
                    <Link href={`/dossiers/${p.id}`} className="strong">
                      {p.name}
                    </Link>
                    <span className="sub">{p.summary}</span>
                  </td>
                  <td className="hide-sm">{kindLabel(p.kind)}</td>
                  <td>
                    <Tag tone={s.tone}>{s.label}</Tag>
                  </td>
                  <td className="mono dim hide-sm">{p.stack.slice(0, 3).join(" · ")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Panel>

      <Panel title={tr("À propos", "About")}>
        <div className="prose">
          {c.bio.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </Panel>

      <Panel
        title={tr("Chronologie", "Timeline")}
        aside={
          <Link href="/chronologie" className="link">
            {tr("Tout voir", "See all")} →
          </Link>
        }
      >
        <ol className="feed">
          {c.events.slice(0, 4).map((e) => (
            <li key={e.title}>
              <span className="mono dim">{e.date}</span>
              <span>
                <b>{e.title}</b>
                {e.current && <Tag tone="warn">{tr("en cours", "current")}</Tag>}
                <span className="sub">{e.detail}</span>
              </span>
            </li>
          ))}
        </ol>
      </Panel>

      <Panel
        title={tr("Activité GitHub", "GitHub activity")}
        aside={
          <Link href="/activite" className="link">
            {tr("Détails", "Details")} →
          </Link>
        }
        className="span-2"
      >
        {!loaded && <p className="empty">{tr("Chargement…", "Loading…")}</p>}
        {loaded && feed.length === 0 && (
          <p className="empty">
            {events.failed && repos.failed
              ? tr("GitHub ne répond pas pour le moment.", "GitHub is not responding right now.")
              : tr("Aucune activité publique récente.", "No recent public activity.")}
          </p>
        )}
        {feed.length > 0 && (
          <ol className="feed">
            {feed.map((item) => (
              <li key={item.id}>
                <span className="mono dim">{new Date(item.date).toLocaleDateString(locale, { day: "2-digit", month: "short" })}</span>
                <span>{item.text}</span>
              </li>
            ))}
          </ol>
        )}
      </Panel>
    </div>
  );
}

