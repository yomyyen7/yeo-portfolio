import type { ReactNode } from "react";
import type { ProjectKind, ProjectStatus } from "@/lib/data";

/** Primitives visuelles partagées par toutes les vues. */

export function Panel({
  title,
  aside,
  children,
  className = "",
}: {
  title?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`panel ${className}`}>
      {(title || aside) && (
        <header className="panel-head">
          <h2>{title}</h2>
          {aside && <div className="panel-aside">{aside}</div>}
        </header>
      )}
      <div className="panel-body">{children}</div>
    </section>
  );
}

export function Stat({ value, label, hint }: { value: ReactNode; label: string; hint?: string }) {
  return (
    <div className="stat">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
      {hint && <span className="stat-hint">{hint}</span>}
    </div>
  );
}

export function Tag({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "ok" | "warn" | "info" }) {
  return <span className={`tag tag-${tone}`}>{children}</span>;
}

export function Code({ children }: { children: ReactNode }) {
  return <code className="mono">{children}</code>;
}

export const kindLabel = (k: ProjectKind) => (k === "mobile" ? "Mobile" : "Web");

export const statusMeta = (s: ProjectStatus, lang: "fr" | "en") =>
  ({
    delivered: { label: lang === "fr" ? "Livré" : "Delivered", tone: "ok" as const },
    hackathon: { label: "Hackathon", tone: "info" as const },
    active: { label: lang === "fr" ? "En cours" : "Active", tone: "warn" as const },
  })[s];

export function PageHead({ title, lead, aside }: { title: string; lead?: string; aside?: ReactNode }) {
  return (
    <div className="page-head">
      <div>
        <h1>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
      </div>
      {aside && <div className="page-aside">{aside}</div>}
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="empty">{children}</p>;
}

