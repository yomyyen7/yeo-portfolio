"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { Panel, Tag, kindLabel, statusMeta } from "../ui";

export default function Case({ id }: { id: string }) {
  const { c, lang, tr } = useI18n();
  const index = c.projects.findIndex((p) => p.id === id);
  const p = c.projects[index];
  if (!p) return <p className="empty">{tr("Dossier introuvable.", "Case file not found.")}</p>;
  const prev = c.projects[index - 1];
  const next = c.projects[index + 1];
  const s = statusMeta(p.status, lang);

  return (
    <>
      <div className="page-head case-head">
        <div>
          <p className="eyebrow mono">
            {p.code} · {p.year} · {kindLabel(p.kind)}
          </p>
          <h1>{p.name}</h1>
          <p className="lead">{p.summary}</p>
          <div className="tags">
            <Tag tone={s.tone}>{s.label}</Tag>
            {p.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </div>
        {p.repo && (
          <div className="page-aside">
            <a className="btn primary" href={p.repo} target="_blank" rel="noopener noreferrer">
              {tr("Code source", "Source code")} ↗
            </a>
          </div>
        )}
      </div>

      <div className="grid case-grid">
        <div className="case-main">
          <Panel title={tr("Besoin", "Need")}>
            <p className="prose">{p.problem}</p>
          </Panel>
          <Panel title={tr("Réalisation", "What I did")}>
            <ul className="bullets">
              {p.work.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </Panel>
          <Panel title={tr("Captures d'écran", "Screenshots")}>
            {p.images?.length ? (
              <div className="shots">
                {p.images.map((src) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={src} src={src} alt={`${p.name} — ${tr("capture d'écran", "screenshot")}`} />
                ))}
              </div>
            ) : (
              <p className="empty">{tr("Captures à venir.", "Screenshots coming soon.")}</p>
            )}
          </Panel>
        </div>

        <aside className="case-side">
          <Panel title={tr("Fiche", "Details")}>
            <dl className="facts">
              <div>
                <dt>{tr("Contexte", "Context")}</dt>
                <dd>{p.context}</dd>
              </div>
              <div>
                <dt>{tr("Rôle", "Role")}</dt>
                <dd>{p.role}</dd>
              </div>
              <div>
                <dt>{tr("Année", "Year")}</dt>
                <dd className="mono">{p.year}</dd>
              </div>
              <div>
                <dt>{tr("Technologies", "Stack")}</dt>
                <dd className="tags">
                  {p.stack.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </dd>
              </div>
              <div>
                <dt>{tr("Dépôt", "Repository")}</dt>
                <dd>
                  {p.repo ? (
                    <a href={p.repo} target="_blank" rel="noopener noreferrer" className="link mono">
                      {p.repo.replace("https://github.com/", "")}
                    </a>
                  ) : (
                    <span className="dim">{tr("Non publié", "Not published")}</span>
                  )}
                </dd>
              </div>
            </dl>
          </Panel>
        </aside>
      </div>

      <nav className="pager" aria-label={tr("Dossiers voisins", "Neighbouring case files")}>
        {prev ? (
          <Link href={`/dossiers/${prev.id}`}>
            ← <span className="mono">{prev.code}</span> {prev.name}
          </Link>
        ) : (
          <span />
        )}
        <Link href="/dossiers" className="dim">
          {tr("Tous les dossiers", "All case files")}
        </Link>
        {next ? (
          <Link href={`/dossiers/${next.id}`}>
            <span className="mono">{next.code}</span> {next.name} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </>
  );
}

