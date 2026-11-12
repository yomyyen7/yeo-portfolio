"use client";

import { useEffect, useState } from "react";
import { profile } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

type Repo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  fork: boolean;
  pushed_at: string;
};

/** Dépôts publics, chargés en direct depuis l'API GitHub. */
export default function Repos() {
  const { tr, locale } = useI18n();
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const key = "repos-v2";
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
        // Les dépôts personnels d'abord, les copies (forks) ensuite.
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
    <section className="section wrap" id="code">
      <div className="section-head">
        <h2 className="section-title">{tr("Code ouvert", "Open source")}</h2>
        <a className="text-link" href={profile.github} target="_blank" rel="noopener noreferrer">
          github.com/{profile.githubUser} ↗
        </a>
      </div>
      <p className="muted section-note">{tr("Dépôts publics, mis à jour automatiquement depuis GitHub.", "Public repositories, updated automatically from GitHub.")}</p>

      {failed && <p className="muted">{tr("GitHub ne répond pas pour le moment.", "GitHub is not responding right now.")}</p>}
      {!failed && !repos && (
        <ul className="rows" aria-busy="true">
          {[0, 1, 2].map((i) => (
            <li key={i} className="row skeleton" />
          ))}
        </ul>
      )}
      {repos && (
        <ul className="rows">
          {repos.map((r) => (
            <li key={r.id} className="row">
              <span className="row-year">{new Date(r.pushed_at).toLocaleDateString(locale, { month: "short", year: "numeric" })}</span>
              <div className="row-main">
                <a href={r.html_url} target="_blank" rel="noopener noreferrer">
                  <b>{r.name}</b>
                </a>
                <span>{r.description ?? (r.fork ? tr("Copie d'un dépôt existant.", "Fork of an existing repository.") : tr("Pas de description.", "No description."))}</span>
              </div>
              <span className="row-meta">{[r.language, r.fork ? "fork" : null].filter(Boolean).join(" · ")}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
