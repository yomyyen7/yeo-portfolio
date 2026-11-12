"use client";

import Link from "next/link";
import { useState } from "react";
import type { ProjectKind } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { PageHead, Tag, kindLabel, statusMeta } from "../ui";

type Filter = "all" | ProjectKind;

export default function Cases() {
  const { c, lang, tr } = useI18n();
  const [filter, setFilter] = useState<Filter>("all");
  const list = c.projects.filter((p) => filter === "all" || p.kind === filter);
  const count = (f: Filter) => (f === "all" ? c.projects.length : c.projects.filter((p) => p.kind === f).length);

  return (
    <>
      <PageHead
        title={tr("Dossiers", "Case files")}
        lead={tr(
          "Chaque dossier décrit un projet : le besoin, ce que j'ai réalisé, les technologies et le code quand il est public.",
          "Each case file describes a project: the need, what I built, the technologies and the code when it is public."
        )}
        aside={
          <div className="seg" role="tablist">
            {(["all", "mobile", "web"] as Filter[]).map((f) => (
              <button key={f} role="tab" aria-selected={filter === f} className={filter === f ? "on" : ""} onClick={() => setFilter(f)}>
                {f === "all" ? tr("Tous", "All") : kindLabel(f)} <span className="dim">{count(f)}</span>
              </button>
            ))}
          </div>
        }
      />

      <section className="panel">
        <table className="table">
          <thead>
            <tr>
              <th>Réf.</th>
              <th>{tr("Projet", "Project")}</th>
              <th className="hide-sm">{tr("Rôle", "Role")}</th>
              <th className="hide-sm">{tr("Année", "Year")}</th>
              <th>{tr("Statut", "Status")}</th>
              <th className="hide-sm">{tr("Technologies", "Stack")}</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => {
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
                  <td className="hide-sm">{p.role}</td>
                  <td className="mono hide-sm">{p.year}</td>
                  <td>
                    <Tag tone={s.tone}>{s.label}</Tag>
                  </td>
                  <td className="mono dim hide-sm">{p.stack.slice(0, 3).join(" · ")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </>
  );
}

