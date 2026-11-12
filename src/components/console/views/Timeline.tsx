"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { PageHead, Tag } from "../ui";

const KIND_TONE = { education: "info", project: "neutral", hackathon: "info", milestone: "ok" } as const;

export default function Timeline() {
  const { c, tr } = useI18n();
  const kindLabel = {
    education: tr("Formation", "Education"),
    project: tr("Projet", "Project"),
    hackathon: "Hackathon",
    milestone: tr("Diplôme", "Milestone"),
  };
  const years = [...new Set(c.events.map((e) => e.sort.slice(0, 4)))];

  return (
    <>
      <PageHead
        title={tr("Chronologie", "Timeline")}
        lead={tr("Formation, projets et diplômes, du plus récent au plus ancien.", "Education, projects and milestones, most recent first.")}
      />
      {years.map((y) => (
        <section key={y} className="panel">
          <header className="panel-head">
            <h2 className="mono">{y}</h2>
          </header>
          <ol className="timeline">
            {c.events
              .filter((e) => e.sort.startsWith(y))
              .map((e) => (
                <li key={e.title}>
                  <span className="mono dim">{e.date}</span>
                  <div>
                    <div className="tl-title">
                      <b>{e.projectId ? <Link href={`/dossiers/${e.projectId}`}>{e.title}</Link> : e.title}</b>
                      <Tag tone={KIND_TONE[e.kind]}>{kindLabel[e.kind]}</Tag>
                      {e.current && <Tag tone="warn">{tr("en cours", "current")}</Tag>}
                    </div>
                    <span className="sub">{e.detail}</span>
                  </div>
                </li>
              ))}
          </ol>
        </section>
      ))}
    </>
  );
}

