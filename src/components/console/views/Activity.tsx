"use client";

import { profile } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { LANG_COLORS, buildFeed, useEvents, useRepos } from "../github";
import { PageHead, Panel, Tag } from "../ui";

export default function Activity() {
  const { lang, tr, locale } = useI18n();
  const repos = useRepos();
  const events = useEvents();
  const loaded = Boolean(events.data || events.failed) && Boolean(repos.data || repos.failed);
  const feed = buildFeed(events.data, repos.data, lang, 15);

  return (
    <>
      <PageHead
        title={tr("Activité", "Activity")}
        lead={tr("Dépôts et événements publics, lus en direct depuis l'API GitHub.", "Public repositories and events, read live from the GitHub API.")}
        aside={
          <a className="btn" href={profile.github} target="_blank" rel="noopener noreferrer">
            github.com/{profile.githubUser} ↗
          </a>
        }
      />
      <div className="grid">
        <Panel title={tr("Dépôts publics", "Public repositories")} className="span-2">
          {repos.failed && <p className="empty">{tr("GitHub ne répond pas pour le moment.", "GitHub is not responding right now.")}</p>}
          {!repos.failed && !repos.data && <p className="empty">{tr("Chargement…", "Loading…")}</p>}
          {repos.data && (
            <table className="table">
              <thead>
                <tr>
                  <th>{tr("Dépôt", "Repository")}</th>
                  <th className="hide-sm">{tr("Langage", "Language")}</th>
                  <th>{tr("Dernier push", "Last push")}</th>
                </tr>
              </thead>
              <tbody>
                {repos.data.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <a href={r.html_url} target="_blank" rel="noopener noreferrer" className="strong mono">
                        {r.name}
                      </a>
                      {r.fork && <Tag>fork</Tag>}
                      <span className="sub">{r.description ?? tr("Pas de description.", "No description.")}</span>
                    </td>
                    <td className="hide-sm">
                      {r.language && (
                        <span className="langdot">
                          <i style={{ background: LANG_COLORS[r.language] ?? "#8d93a5" }} /> {r.language}
                        </span>
                      )}
                    </td>
                    <td className="mono dim">{new Date(r.pushed_at).toLocaleDateString(locale, { day: "2-digit", month: "short", year: "numeric" })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Panel>

        <Panel title={tr("Événements récents", "Recent events")}>
          {!loaded && <p className="empty">{tr("Chargement…", "Loading…")}</p>}
          {loaded && feed.length === 0 && <p className="empty">{tr("Aucune activité publique récente.", "No recent public activity.")}</p>}
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
    </>
  );
}

