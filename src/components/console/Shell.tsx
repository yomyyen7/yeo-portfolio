"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { profile } from "@/lib/data";
import { I18nProvider, useI18n } from "@/lib/i18n";
import Console from "./Console";
import Palette from "./Palette";
import { NAV, isActive, navLabel } from "./nav";

function LangToggle() {
  const { lang, setLang } = useI18n();
  return (
    <div className="lang" role="group" aria-label="Langue / Language">
      {(["fr", "en"] as const).map((l) => (
        <button key={l} type="button" aria-pressed={l === lang} onClick={() => setLang(l)}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function Mark() {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" className="mark">
      <rect x="1" y="1" width="18" height="18" rx="4" />
      <path d="M6 6l4 5 4-5M10 11v4" />
    </svg>
  );
}

function Frame({ children }: { children: ReactNode }) {
  const { c, lang, tr } = useI18n();
  const pathname = usePathname();
  const [palette, setPalette] = useState(false);
  const [consoleOpen, setConsoleOpen] = useState(false);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((v) => !v);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "j") {
        e.preventDefault();
        setConsoleOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);

  const closePalette = useCallback(() => setPalette(false), []);
  const closeConsole = useCallback(() => setConsoleOpen(false), []);

  const current = NAV.find((n) => isActive(pathname, n.href));
  const crumb = pathname.startsWith("/dossiers/") ? [navLabel(NAV[1], lang), pathname.split("/")[2]] : current ? [navLabel(current, lang)] : [];

  return (
    <div className={`app${consoleOpen ? " with-console" : ""}`}>
      <a href="#main" className="skip">
        {tr("Aller au contenu", "Skip to content")}
      </a>

      <aside className="sidebar">
        <Link href="/" className="brand">
          <Mark />
          <span>
            {profile.handle} <em>/ console</em>
          </span>
        </Link>
        <nav aria-label={tr("Navigation", "Navigation")}>
          {NAV.map((n, i) => (
            <Link key={n.key} href={n.href} className={isActive(pathname, n.href) ? "on" : ""} aria-current={isActive(pathname, n.href) ? "page" : undefined}>
              <span className="mono idx">{String(i + 1).padStart(2, "0")}</span>
              {navLabel(n, lang)}
            </Link>
          ))}
        </nav>
        <div className="sidebar-foot">
          <div className="who">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={profile.photo} alt="" width={32} height={32} />
            <div>
              <b>{profile.name}</b>
              <span>
                <i className="dot ok" /> {c.availability}
              </span>
            </div>
          </div>
          <button type="button" className="ghost" onClick={() => setConsoleOpen((v) => !v)} aria-pressed={consoleOpen}>
            <span className="mono">&gt;_</span> Console <kbd>Ctrl J</kbd>
          </button>
          <LangToggle />
        </div>
      </aside>

      <div className="frame">
        <header className="topbar">
          <div className="crumbs mono">
            <Link href="/">console</Link>
            {crumb.map((x) => (
              <span key={x}>
                <i>/</i> {x}
              </span>
            ))}
          </div>
          <div className="topbar-right">
            <button type="button" className="search" onClick={() => setPalette(true)} aria-label={tr("Rechercher (Ctrl + K)", "Search (Ctrl + K)")}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="6.5" />
                <path d="M16 16l4.5 4.5" />
              </svg>
              <span>{tr("Rechercher", "Search")}</span>
              <kbd>Ctrl K</kbd>
            </button>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="ext">
              GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="ext">
              LinkedIn
            </a>
            <span className="only-mobile">
              <LangToggle />
            </span>
          </div>
        </header>

        <main id="main" className="main">
          {children}
        </main>

        {consoleOpen && <Console onClose={closeConsole} />}
      </div>

      <nav className="tabbar" aria-label={tr("Navigation", "Navigation")}>
        {NAV.map((n) => (
          <Link key={n.key} href={n.href} className={isActive(pathname, n.href) ? "on" : ""}>
            {navLabel(n, lang)}
          </Link>
        ))}
      </nav>

      {palette && <Palette onClose={closePalette} />}
    </div>
  );
}

export default function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // La page CV est une feuille imprimable : elle se passe de la coque de l'application.
  if (pathname === "/cv") return <>{children}</>;
  return (
    <I18nProvider>
      <Frame>{children}</Frame>
    </I18nProvider>
  );
}
