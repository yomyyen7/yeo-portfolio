import type { ReactNode } from "react";
import type { Lang } from "@/lib/data";

export type AppId =
  | "about"
  | "projects"
  | "assistant"
  | "terminal"
  | "skills"
  | "journey"
  | "lab"
  | "github"
  | "contact";

type AppMeta = { id: AppId; fr: string; en: string; from: string; to: string; glyph: ReactNode };

const s = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const APPS: AppMeta[] = [
  {
    id: "about",
    fr: "À propos",
    en: "About",
    from: "#ff9a3d",
    to: "#e2531c",
    glyph: (
      <g {...s}>
        <circle cx="12" cy="8.5" r="3.5" />
        <path d="M5 20c.8-3.6 3.5-5.5 7-5.5s6.2 1.9 7 5.5" />
      </g>
    ),
  },
  {
    id: "projects",
    fr: "Projets",
    en: "Projects",
    from: "#5aa2ff",
    to: "#2b5fe0",
    glyph: (
      <g {...s}>
        <path d="M3.5 7.5a2 2 0 0 1 2-2h4l2 2.5h7a2 2 0 0 1 2 2v7.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z" />
      </g>
    ),
  },
  {
    id: "assistant",
    fr: "Assistant IA",
    en: "AI Assistant",
    from: "#22c98a",
    to: "#ff8a2a",
    glyph: (
      <g {...s}>
        <path d="M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.500l5.1-1.9z" />
        <path d="M18.5 15.5l.7 1.8 1.800.7-1.800.7-.7 1.8-.7-1.8-1.800-.7 1.800-.7z" />
      </g>
    ),
  },
  {
    id: "terminal",
    fr: "Terminal",
    en: "Terminal",
    from: "#3a4258",
    to: "#161a26",
    glyph: (
      <g {...s}>
        <path d="M6 8.5l4 3.5-4 3.5M12.5 16H18" />
      </g>
    ),
  },
  {
    id: "skills",
    fr: "Compétences",
    en: "Skills",
    from: "#2fd79a",
    to: "#0f8f68",
    glyph: (
      <g {...s}>
        <path d="M3.5 13h3.5l2.5-6 4 11 2.5-5h4.5" />
      </g>
    ),
  },
  {
    id: "journey",
    fr: "Parcours",
    en: "Journey",
    from: "#b68cff",
    to: "#6b3fd6",
    glyph: (
      <g {...s}>
        <path d="M12 5.5L3 10l9 4.5 9-4.5z" />
        <path d="M7 12.5v4c1.5 1.3 3.2 2 5 2s3.5-.7 5-2v-4" />
      </g>
    ),
  },
  {
    id: "lab",
    fr: "Atelier 3D",
    en: "3D Lab",
    from: "#ff6f91",
    to: "#c2255c",
    glyph: (
      <g {...s}>
        <path d="M12 3.5l7.5 4.2v8.6L12 20.5l-7.5-4.2V7.7z" />
        <path d="M4.5 7.7L12 12l7.5-4.3M12 12v8.5" />
      </g>
    ),
  },
  {
    id: "github",
    fr: "GitHub",
    en: "GitHub",
    from: "#4a5168",
    to: "#1d2130",
    glyph: (
      <path
        fill="currentColor"
        d="M12 3a9 9 0 0 0-2.85 17.54c.45.08.62-.2.62-.43v-1.53c-2.5.54-3.03-1.2-3.03-1.2-.41-1.05-1-1.33-1-1.33-.82-.56.06-.55.06-.55.9.07 1.38.93 1.38.93.8 1.37 2.1.98 2.62.75.08-.58.31-.98.57-1.2-2-.23-4.1-1-4.1-4.45 0-.98.35-1.78.93-2.41-.1-.23-.4-1.15.08-2.38 0 0 .76-.24 2.48.92a8.600 8.600 0 0 1 4.5 0c1.72-1.16 2.48-.92 2.48-.92.49 1.23.18 2.15.09 2.38.58.63.92 1.43.92 2.41 0 3.46-2.1 4.21-4.11 4.44.32.28.61.83.61 1.67v2.47c0 .24.16.52.62.43A9 9 0 0 0 12 3z"
      />
    ),
  },
  {
    id: "contact",
    fr: "Contact",
    en: "Contact",
    from: "#ffd166",
    to: "#e09112",
    glyph: (
      <g {...s}>
        <rect x="3.5" y="6" width="17" height="12.5" rx="2" />
        <path d="M4 7.5l8 6 8-6" />
      </g>
    ),
  },
];

export const appById = (id: AppId) => APPS.find((a) => a.id === id)!;
export const appTitle = (id: AppId, lang: Lang) => appById(id)[lang];

export function AppIcon({ id, size = 44 }: { id: AppId; size?: number }) {
  const a = appById(id);
  return (
    <span
      className="app-icon"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.27,
        background: `linear-gradient(145deg, ${a.from}, ${a.to})`,
      }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" width={size * 0.58} height={size * 0.58}>
        {a.glyph}
      </svg>
    </span>
  );
}

export function Avatar({ src, size = "md" }: { src: string; size?: "md" | "xl" | "sm" }) {
  return (
    <span className={`avatar ${size}`} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" width={200} height={200} />
    </span>
  );
}

export function Logo({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M12 2.5l8.2 4.75v9.5L12 21.5l-8.2-4.75v-9.5z" fill="none" stroke="#ff8a2a" strokeWidth="1.8" />
      <path d="M8 8l4 5 4-5M12 13v4" fill="none" stroke="#22c98a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
