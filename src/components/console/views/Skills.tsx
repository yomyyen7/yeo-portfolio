"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { PageHead, Panel, Tag } from "../ui";

export default function Skills() {
  const { c, tr } = useI18n();
  // Projets dans lesquels chaque technologie a été utilisée : la preuve plutôt que l'auto-évaluation.
  const usage = (item: string) => c.projects.filter((p) => p.stack.some((s) => s.toLowerCase() === item.toLowerCase()));

  return (
    <>
      <PageHead
        title={tr("Compétences", "Skills")}
        lead={tr(
          "Pas de barres de niveau : pour chaque technologie, les dossiers où elle a servi.",
          "No skill bars: for each technology, the case files where it was used."
        )}
      />
      <div className="grid">
        <Panel title={tr("Technologies", "Technologies")} className="span-2">
          <table className="table">
            <thead>
              <tr>
                <th>{tr("Domaine", "Area")}</th>
                <th>{tr("Technologies", "Technologies")}</th>
              </tr>
            </thead>
            <tbody>
              {c.skills.map((g) => (
                <tr key={g.group}>
                  <td className="dim">{g.group}</td>
                  <td className="tags">
                    {g.items.map((item) => {
                      const used = usage(item);
                      return used.length ? (
                        <Link key={item} href={`/dossiers/${used[0].id}`} className="tag tag-used" title={used.map((p) => p.name).join(", ")}>
                          {item} <span className="mono">{used.length}</span>
                        </Link>
                      ) : (
                        <Tag key={item}>{item}</Tag>
                      );
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="note">{tr("Le chiffre indique le nombre de dossiers où la technologie est utilisée.", "The number is how many case files use the technology.")}</p>
        </Panel>

        <Panel title={tr("Langues", "Languages")}>
          <dl className="facts">
            {c.languages.map((l) => (
              <div key={l.name}>
                <dt>{l.name}</dt>
                <dd>{l.level}</dd>
              </div>
            ))}
          </dl>
        </Panel>

        <Panel title={tr("Formation", "Education")}>
          <dl className="facts">
            {c.events
              .filter((e) => e.kind === "education" || e.kind === "milestone")
              .map((e) => (
                <div key={e.title}>
                  <dt className="mono">{e.date}</dt>
                  <dd>
                    {e.title}
                    <span className="sub">{e.detail}</span>
                  </dd>
                </div>
              ))}
          </dl>
        </Panel>
      </div>
    </>
  );
}

