"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { profile } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { NAV, navLabel } from "./nav";

type Command = { id: string; label: string; hint: string; run: () => void };

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

/** Recherche globale (Ctrl + K) : vues, dossiers, actions. */
export default function Palette({ onClose }: { onClose: () => void }) {
  const { c, lang, tr, setLang } = useI18n();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [index, setIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const go = (href: string) => () => router.push(href);
  const commands: Command[] = [
    ...NAV.map((n) => ({ id: `nav-${n.key}`, label: navLabel(n, lang), hint: tr("Vue", "View"), run: go(n.href) })),
    ...c.projects.map((p) => ({
      id: `case-${p.id}`,
      label: `${p.code} · ${p.name}`,
      hint: tr("Dossier", "Case file"),
      run: go(`/dossiers/${p.id}`),
    })),
    { id: "mail", label: tr("Écrire un e-mail", "Send an email"), hint: "Action", run: () => (window.location.href = `mailto:${profile.email}`) },
    { id: "linkedin", label: "LinkedIn", hint: tr("Lien externe", "External link"), run: () => window.open(profile.linkedin, "_blank", "noopener") },
    { id: "github", label: "GitHub", hint: tr("Lien externe", "External link"), run: () => window.open(profile.github, "_blank", "noopener") },
    { id: "lang", label: lang === "fr" ? "Switch to English" : "Passer en français", hint: tr("Langue", "Language"), run: () => setLang(lang === "fr" ? "en" : "fr") },
  ];

  const list = commands.filter((cmd) => norm(`${cmd.label} ${cmd.hint}`).includes(norm(q)));
  const active = Math.min(index, Math.max(0, list.length - 1));

  useEffect(() => {
    listRef.current?.querySelector(".on")?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((active + 1) % Math.max(1, list.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((active - 1 + list.length) % Math.max(1, list.length));
    } else if (e.key === "Enter" && list[active]) {
      e.preventDefault();
      list[active].run();
      onClose();
    }
  }

  return (
    <div className="veil" onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="palette" role="dialog" aria-label={tr("Recherche", "Search")} onKeyDown={onKeyDown}>
        <div className="palette-input">
          <input
            autoFocus
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setIndex(0);
            }}
            placeholder={tr("Rechercher une vue, un dossier, une action…", "Search a view, a case file, an action…")}
            aria-label={tr("Rechercher", "Search")}
            spellCheck={false}
          />
          <kbd>esc</kbd>
        </div>
        <div className="palette-list" ref={listRef}>
          {list.length === 0 && <p className="empty">{tr("Aucun résultat.", "No results.")}</p>}
          {list.map((cmd, i) => (
            <button
              key={cmd.id}
              className={i === active ? "on" : ""}
              onPointerMove={() => setIndex(i)}
              onClick={() => {
                cmd.run();
                onClose();
              }}
            >
              <span>{cmd.label}</span>
              <span className="palette-hint">{cmd.hint}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
