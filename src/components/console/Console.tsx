"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { profile } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { NAV, navLabel } from "./nav";

type Line = { id: number; node: ReactNode };

/**
 * Console en bas d'écran : quelques commandes utiles pour naviguer au clavier.
 * Volontairement sobre : pas de faux système, pas de blagues.
 */
export default function Console({ onClose }: { onClose: () => void }) {
  const { c, lang, tr, setLang } = useI18n();
  const router = useRouter();
  const nextId = useRef(1);
  const mk = (node: ReactNode): Line => ({ id: nextId.current++, node });
  const [lines, setLines] = useState<Line[]>(() => [
    mk(
      <span className="dim">
        {tr("Console. Tapez", "Console. Type")} <b>help</b> {tr("pour les commandes.", "for the commands.")}
      </span>
    ),
  ]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIndex, setHIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [lines]);

  const views = Object.fromEntries(NAV.map((n) => [n.key, n.href]));

  function run(raw: string): ReactNode | "clear" | null {
    const [cmd, ...rest] = raw.trim().split(/\s+/);
    const arg = rest.join(" ").toLowerCase();
    switch (cmd.toLowerCase()) {
      case "":
        return null;
      case "help":
        return (
          <div className="con-help">
            {[
              ["help", tr("cette aide", "this help")],
              ["ls", tr("liste des vues", "list views")],
              ["cases", tr("liste des dossiers", "list case files")],
              ["open <vue|dossier>", tr("ouvre une vue ou un dossier (ex. open oxynova)", "open a view or a case file (e.g. open oxynova)")],
              ["whoami", tr("résumé du profil", "profile summary")],
              ["contact", tr("coordonnées", "contact details")],
              ["lang fr|en", tr("langue de l'interface", "interface language")],
              ["clear", tr("efface la console", "clear the console")],
              ["exit", tr("ferme la console", "close the console")],
            ].map(([k, v]) => (
              <div key={k}>
                <code>{k}</code>
                <span className="dim">{v}</span>
              </div>
            ))}
          </div>
        );
      case "ls":
        return NAV.map((n) => (
          <div key={n.key}>
            <code>{n.key.padEnd(10, " ")}</code> {navLabel(n, lang)}
          </div>
        ));
      case "cases":
        return c.projects.map((p) => (
          <div key={p.id}>
            <code>{p.code}</code> {p.name} <span className="dim">· {p.year} · open {p.id}</span>
          </div>
        ));
      case "open": {
        if (views[arg]) {
          router.push(views[arg]);
          return <span className="dim">→ {views[arg]}</span>;
        }
        const p = c.projects.find((x) => x.id === arg || x.code.toLowerCase() === arg);
        if (p) {
          router.push(`/dossiers/${p.id}`);
          return <span className="dim">→ /dossiers/{p.id}</span>;
        }
        return <span className="err">{tr("Cible inconnue. Essayez « ls » ou « cases ».", "Unknown target. Try “ls” or “cases”.")}</span>;
      }
      case "whoami":
        return `${profile.name} — ${c.role}. ${c.status}, ${c.location}. ${c.availability}.`;
      case "contact":
        return [profile.email, profile.linkedin, profile.github].map((l) => <div key={l}>{l}</div>);
      case "lang":
        if (arg !== "fr" && arg !== "en") return <span className="err">lang fr | en</span>;
        setLang(arg);
        return <span className="dim">{arg === "fr" ? "Interface en français." : "Interface in English."}</span>;
      case "clear":
        return "clear";
      case "exit":
        onClose();
        return null;
      default:
        return (
          <span className="err">
            {cmd}: {tr("commande inconnue. Tapez help.", "unknown command. Type help.")}
          </span>
        );
    }
  }

  function submit() {
    const raw = value;
    const out = run(raw);
    setValue("");
    setHIndex(-1);
    if (raw.trim()) setHistory((h) => [...h, raw.trim()]);
    if (out === "clear") return setLines([]);
    setLines((ls) => [
      ...ls,
      mk(
        <span>
          <span className="prompt">{profile.handle}&gt;</span> {raw}
        </span>
      ),
      ...(out ? [mk(out)] : []),
    ]);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "ArrowUp" && history.length) {
      e.preventDefault();
      const i = hIndex < 0 ? history.length - 1 : Math.max(0, hIndex - 1);
      setHIndex(i);
      setValue(history[i]);
    } else if (e.key === "ArrowDown" && hIndex >= 0) {
      e.preventDefault();
      const i = hIndex + 1;
      if (i >= history.length) {
        setHIndex(-1);
        setValue("");
      } else {
        setHIndex(i);
        setValue(history[i]);
      }
    } else if (e.key === "Escape") onClose();
  }

  return (
    <div className="console" role="region" aria-label="Console" onClick={() => !window.getSelection()?.toString() && inputRef.current?.focus()}>
      <div className="console-bar">
        <span>console</span>
        <button type="button" onClick={onClose} aria-label={tr("Fermer la console", "Close the console")}>
          ✕
        </button>
      </div>
      <div className="console-log">
        {lines.map((l) => (
          <div key={l.id} className="con-line">
            {l.node}
          </div>
        ))}
        <label className="con-input">
          <span className="prompt">{profile.handle}&gt;</span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            aria-label={tr("Ligne de commande", "Command line")}
          />
        </label>
        <div ref={endRef} />
      </div>
    </div>
  );
}
