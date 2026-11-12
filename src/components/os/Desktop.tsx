"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { os, profile } from "@/lib/data";
import { APPS, AppIcon, Avatar, Logo, appTitle, type AppId } from "./icons";
import { About, Contact, GitHub, Journey, Lab, Projects, Skills } from "./Apps";
import Assistant from "./Assistant";
import Terminal from "./Terminal";
import { ContextMenu, MatrixRain, Palette, type Command, type MenuItem } from "./Extras";
import { I18nProvider, useI18n } from "./i18n";
import type { WallpaperId } from "../three/Wallpaper";

const Wallpaper = dynamic(() => import("../three/Wallpaper"), { ssr: false });

type Phase = "boot" | "lock" | "desktop";
type Snap = "left" | "right" | "max" | null;
type Win = { id: AppId; x: number; y: number; w: number; h: number; z: number; min: boolean; max: boolean };

const WALLPAPERS: { id: WallpaperId; fr: string; en: string }[] = [
  { id: "core", fr: "Noyau", en: "Core" },
  { id: "net", fr: "Réseau de neurones", en: "Neural network" },
  { id: "shield", fr: "Bouclier", en: "Shield" },
];

const TOP = 36;
const SIZES: Record<AppId, [number, number]> = {
  about: [620, 600],
  projects: [880, 590],
  assistant: [460, 600],
  terminal: [720, 450],
  skills: [640, 600],
  journey: [620, 580],
  lab: [840, 590],
  github: [620, 580],
  contact: [540, 640],
};

const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), Math.max(a, b));

function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)");
    const on = () => setMobile(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return mobile;
}

function LangToggle() {
  const { lang, setLang } = useI18n();
  return (
    <div className="lang-toggle" role="group" aria-label="Langue / Language">
      {(["fr", "en"] as const).map((l) => (
        <button key={l} className={l === lang ? "on" : ""} aria-pressed={l === lang} onClick={() => setLang(l)}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

/* ───────────── Démarrage ───────────── */
function Boot({ onDone }: { onDone: () => void }) {
  const { tr } = useI18n();
  const lines = [
    tr("Chargement du noyau yeo-kernel 6.11…", "Loading kernel yeo-kernel 6.11…"),
    tr("Détection du matériel : imagination ×8 cœurs, café 16 Go", "Detecting hardware: imagination ×8 cores, coffee 16 GB"),
    tr("Montage de /home/yeo", "Mounting /home/yeo"),
    tr("Démarrage du service réseau", "Starting network service"),
    tr("Démarrage du pare-feu — module cybersécurité", "Starting firewall — cybersecurity module"),
    tr("Chargement des modèles — module intelligence artificielle", "Loading models — artificial intelligence module"),
    tr("Initialisation du moteur 3D (WebGL)", "Initialising 3D engine (WebGL)"),
    tr("Lancement du gestionnaire de fenêtres", "Launching window manager"),
    tr(`Bienvenue dans ${os.name} ${os.version} « ${os.codename} »`, `Welcome to ${os.name} ${os.version} “${os.codename}”`),
  ];
  const total = lines.length;
  const [n, setN] = useState(0);

  useEffect(() => {
    if (n >= total) {
      const t = setTimeout(onDone, 650);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setN((v) => v + 1), n === 0 ? 350 : 170 + (n % 3) * 70);
    return () => clearTimeout(t);
  }, [n, total, onDone]);

  useEffect(() => {
    const skip = () => onDone();
    window.addEventListener("keydown", skip);
    return () => window.removeEventListener("keydown", skip);
  }, [onDone]);

  return (
    <div className="boot" onClick={onDone} role="status" aria-label={tr("Démarrage du système", "System starting")}>
      <div className="boot-log">
        {lines.slice(0, n).map((l, i) => (
          <div key={i}>
            <span className="ok">[ OK ]</span> {l}
          </div>
        ))}
        <span className="caret" />
      </div>
      <div className="boot-foot">
        <Logo size={28} />
        <div className="bar">
          <i style={{ width: `${(n / total) * 100}%` }} />
        </div>
        <span>{tr("Cliquez ou appuyez sur une touche pour passer", "Click or press any key to skip")}</span>
      </div>
    </div>
  );
}

/* ───────────── Écran de verrouillage ───────────── */
function Lock({ onUnlock, now }: { onUnlock: () => void; now: Date | null }) {
  const { c, tr, locale } = useI18n();
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Enter" && onUnlock();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onUnlock]);

  return (
    <div className="lock">
      <div className="lock-lang">
        <LangToggle />
      </div>
      <div className="lock-clock">
        <div className="time">{now ? now.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" }) : "--:--"}</div>
        <div className="date">
          {now ? now.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" }) : " "}
        </div>
      </div>
      <div className="lock-user">
        <Avatar src={profile.photo} size="xl" />
        <h1>{profile.name}</h1>
        <p>
          {c.title} · {c.tagline}
        </p>
        <button className="btn primary lg" onClick={onUnlock} autoFocus>
          {tr("Ouvrir la session", "Sign in")} →
        </button>
        <small>{tr("ou appuyez sur Entrée", "or press Enter")}</small>
      </div>
    </div>
  );
}

/* ───────────── Fenêtre ───────────── */
function WindowFrame({
  win,
  active,
  mobile,
  children,
  onFocus,
  onClose,
  onMin,
  onMax,
  onChange,
  onSnapHint,
  onSnap,
}: {
  win: Win;
  active: boolean;
  mobile: boolean;
  children: React.ReactNode;
  onFocus: () => void;
  onClose: () => void;
  onMin: () => void;
  onMax: () => void;
  onChange: (patch: Partial<Win>) => void;
  onSnapHint: (hint: Snap) => void;
  onSnap: (hint: Snap) => void;
}) {
  const { lang, tr } = useI18n();
  const title = appTitle(win.id, lang);

  function track(
    e: React.PointerEvent,
    handler: (dx: number, dy: number, ev: PointerEvent) => void,
    onEnd?: () => void
  ) {
    const sx = e.clientX;
    const sy = e.clientY;
    document.body.classList.add("dragging");
    const move = (ev: PointerEvent) => handler(ev.clientX - sx, ev.clientY - sy, ev);
    const up = () => {
      document.body.classList.remove("dragging");
      onEnd?.();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  }

  function startDrag(e: React.PointerEvent) {
    if ((e.target as HTMLElement).closest("button") || win.max || mobile) return;
    const { x, y, w } = win;
    let hint: Snap = null;
    track(
      e,
      (dx, dy, ev) => {
        onChange({
          x: clamp(x + dx, 140 - w, window.innerWidth - 140),
          y: clamp(y + dy, TOP, window.innerHeight - 90),
        });
        // Aimantation : bord gauche, bord droit, ou haut de l'écran pour agrandir.
        const next: Snap =
          ev.clientX <= 8 ? "left" : ev.clientX >= window.innerWidth - 8 ? "right" : ev.clientY <= TOP + 2 ? "max" : null;
        if (next !== hint) {
          hint = next;
          onSnapHint(next);
        }
      },
      () => {
        if (hint) onSnap(hint);
        onSnapHint(null);
      }
    );
  }

  function startResize(e: React.PointerEvent) {
    e.stopPropagation();
    const { w, h } = win;
    track(e, (dx, dy) => onChange({ w: Math.max(360, w + dx), h: Math.max(260, h + dy) }));
  }

  const full = win.max || mobile;
  return (
    <section
      className={`win${active ? " active" : ""}${full ? " max" : ""}${win.min ? " min" : ""}`}
      style={full ? { zIndex: win.z } : { left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z }}
      onPointerDown={onFocus}
      role="dialog"
      aria-label={title}
      aria-hidden={win.min}
    >
      <header className="win-bar" onPointerDown={startDrag} onDoubleClick={() => !mobile && onMax()}>
        <div className="win-title">
          <AppIcon id={win.id} size={18} />
          <span>{title}</span>
        </div>
        <div className="win-ctl">
          <button onClick={onMin} aria-label={tr("Réduire", "Minimise")}>
            <svg viewBox="0 0 12 12"><path d="M2.5 8.5h7" /></svg>
          </button>
          {!mobile && (
            <button onClick={onMax} aria-label={win.max ? tr("Restaurer", "Restore") : tr("Agrandir", "Maximise")}>
              <svg viewBox="0 0 12 12"><rect x="2.5" y="2.5" width="7" height="7" rx="1.2" /></svg>
            </button>
          )}
          <button className="close" onClick={onClose} aria-label={tr("Fermer", "Close")}>
            <svg viewBox="0 0 12 12"><path d="M3 3l6 6M9 3l-6 6" /></svg>
          </button>
        </div>
      </header>
      <div className="win-body">{children}</div>
      {!full && <div className="win-resize" onPointerDown={startResize} aria-hidden="true" />}
    </section>
  );
}

/* ───────────── Bureau ───────────── */
function DesktopInner() {
  const { c, tr, lang, locale } = useI18n();
  const [phase, setPhase] = useState<Phase>("boot");
  const [wins, setWins] = useState<Win[]>([]);
  const zTop = useRef(10);
  const greeted = useRef(false);
  const now = useNow();
  const mobile = useIsMobile();
  const [wallpaper, setWallpaperState] = useState<WallpaperId>("core");
  const [palette, setPalette] = useState(false);
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const [matrix, setMatrix] = useState(false);
  const [toast, setToast] = useState(false);
  const [snapHint, setSnapHint] = useState<Snap>(null);
  const [projectSel, setProjectSel] = useState<{ id: string | null; n: number }>({ id: null, n: 0 });

  useEffect(() => {
    try {
      const saved = localStorage.getItem("yeoos-wallpaper") as WallpaperId | null;
      if (saved && WALLPAPERS.some((w) => w.id === saved)) setWallpaperState(saved);
    } catch {
      /* stockage indisponible : fond par défaut */
    }
  }, []);

  const setWallpaper = useCallback((id: WallpaperId) => {
    setWallpaperState(id);
    try {
      localStorage.setItem("yeoos-wallpaper", id);
    } catch {
      /* le choix ne sera simplement pas mémorisé */
    }
  }, []);

  const nextWallpaper = useCallback(() => {
    const i = WALLPAPERS.findIndex((w) => w.id === wallpaper);
    setWallpaper(WALLPAPERS[(i + 1) % WALLPAPERS.length].id);
  }, [wallpaper, setWallpaper]);

  useEffect(() => {
    if (phase !== "desktop") return;
    const key = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((v) => !v);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [phase]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(false), 10000);
    return () => clearTimeout(t);
  }, [toast]);

  const open = useCallback((id: AppId, at?: { x: number; y: number }) => {
    setWins((ws) => {
      const z = ++zTop.current;
      if (ws.some((w) => w.id === id)) return ws.map((w) => (w.id === id ? { ...w, min: false, z } : w));
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const w = Math.min(SIZES[id][0], vw - 24);
      const h = Math.min(SIZES[id][1], vh - TOP - 100);
      const n = ws.length;
      const x = at?.x ?? clamp((vw - w) / 2 + ((n % 5) - 2) * 34, 12, vw - w - 12);
      const y = at?.y ?? clamp(TOP + 26 + (n % 5) * 30, TOP + 8, vh - h - 92);
      return [...ws, { id, x, y, w, h, z, min: false, max: false }];
    });
  }, []);

  const patch = useCallback((id: AppId, p: Partial<Win>) => {
    setWins((ws) => ws.map((w) => (w.id === id ? { ...w, ...p } : w)));
  }, []);
  const focus = useCallback((id: AppId) => patch(id, { z: ++zTop.current }), [patch]);
  const close = useCallback((id: AppId) => setWins((ws) => ws.filter((w) => w.id !== id)), []);

  const visible = wins.filter((w) => !w.min);
  const activeId = visible.length ? visible.reduce((a, b) => (a.z > b.z ? a : b)).id : null;

  const unlock = useCallback(() => {
    setPhase("desktop");
    if (greeted.current) return;
    greeted.current = true;
    setTimeout(() => setToast(true), 1400);
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (vw >= 1180 && vh >= 780) {
      open("terminal", { x: vw - SIZES.terminal[0] - 36, y: vh - SIZES.terminal[1] - 120 });
      open("about", { x: vh >= 960 ? 128 : 222, y: TOP + 28 });
    } else if (vw >= 1000) {
      // Écran peu haut : une seule fenêtre, à droite des deux colonnes d'icônes.
      open("about", { x: 222, y: TOP + 20 });
    } else {
      open("about");
    }
  }, [open]);

  function dockClick(id: AppId) {
    const w = wins.find((x) => x.id === id);
    if (w && !w.min && activeId === id) patch(id, { min: true });
    else open(id);
  }

  function snap(id: AppId, hint: Snap) {
    const vw = window.innerWidth;
    const h = window.innerHeight - TOP - 92;
    if (hint === "max") patch(id, { max: true });
    else if (hint === "left") patch(id, { x: 0, y: TOP, w: vw / 2, h, max: false });
    else if (hint === "right") patch(id, { x: vw / 2, y: TOP, w: vw / 2, h, max: false });
  }

  function openProject(id: string) {
    setProjectSel((p) => ({ id, n: p.n + 1 }));
    open("projects");
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.().catch(() => {});
  }

  const stopMatrix = useCallback(() => setMatrix(false), []);
  const closeMenu = useCallback(() => setMenu(null), []);

  const commands: Command[] = [
    ...APPS.map((a) => ({ id: `app-${a.id}`, label: a[lang], hint: "Application", icon: a.id, run: () => open(a.id) })),
    ...c.projects.map((p) => ({
      id: `proj-${p.id}`,
      label: p.name,
      hint: `${tr("Projet", "Project")} · ${p.stack.slice(0, 3).join(", ")}`,
      icon: "projects" as AppId,
      run: () => openProject(p.id),
    })),
    ...WALLPAPERS.map((w) => ({
      id: `wp-${w.id}`,
      label: `${tr("Fond d'écran", "Wallpaper")} : ${w[lang]}`,
      hint: tr("Apparence", "Appearance"),
      run: () => setWallpaper(w.id),
    })),
    { id: "act-linkedin", label: "LinkedIn", hint: tr("Lien", "Link"), run: () => window.open(profile.linkedin, "_blank", "noopener") },
    { id: "act-fs", label: tr("Plein écran", "Full screen"), hint: "Action", run: toggleFullscreen },
    { id: "act-matrix", label: "Matrix", hint: tr("Surprise", "Surprise"), run: () => setMatrix(true) },
    { id: "act-lock", label: tr("Verrouiller la session", "Lock the session"), hint: tr("Système", "System"), run: () => setPhase("lock") },
  ];

  const menuItems: MenuItem[] = [
    { label: tr("Rechercher…", "Search…"), hint: "Ctrl K", run: () => setPalette(true) },
    { label: tr("Demander à l'assistant IA", "Ask the AI assistant"), run: () => open("assistant") },
    { label: tr("Ouvrir le Terminal", "Open Terminal"), run: () => open("terminal") },
    { label: tr("Ouvrir l'Atelier 3D", "Open 3D Lab"), run: () => open("lab") },
    "sep",
    { label: tr("Changer le fond d'écran", "Change wallpaper"), run: nextWallpaper },
    { label: tr("Plein écran", "Full screen"), run: toggleFullscreen },
    "sep",
    { label: tr(`À propos de ${profile.firstName}`, `About ${profile.firstName}`), run: () => open("about") },
    { label: tr("Verrouiller la session", "Lock the session"), run: () => setPhase("lock") },
  ];

  function onContextMenu(e: React.MouseEvent) {
    if (phase !== "desktop") return;
    const t = e.target as HTMLElement;
    if (t.closest(".win, .dock, .topbar, .palette, input, textarea")) return;
    e.preventDefault();
    setMenu({ x: e.clientX, y: e.clientY });
  }

  function render(id: AppId) {
    switch (id) {
      case "about":
        return <About openApp={open} />;
      case "projects":
        return <Projects key={projectSel.n} initial={projectSel.id} />;
      case "assistant":
        return <Assistant openApp={open} />;
      case "terminal":
        return (
          <Terminal
            key={lang}
            openApp={open}
            closeSelf={() => close("terminal")}
            onMatrix={() => setMatrix(true)}
            setWallpaper={setWallpaper}
          />
        );
      case "skills":
        return <Skills />;
      case "journey":
        return <Journey />;
      case "lab":
        return <Lab />;
      case "github":
        return <GitHub />;
      case "contact":
        return <Contact />;
    }
  }

  return (
    <main className={`os phase-${phase}`} onContextMenu={onContextMenu}>
      <div className="wallpaper" aria-hidden="true">
        <Wallpaper variant={wallpaper} />
      </div>

      {phase === "boot" && <Boot onDone={() => setPhase("lock")} />}
      {phase === "lock" && <Lock onUnlock={unlock} now={now} />}

      {phase === "desktop" && (
        <>
          <header className="topbar">
            <div className="tb-left">
              <Logo />
              <b>{os.name}</b>
              <span className="tb-app">{activeId ? appTitle(activeId, lang) : tr("Bureau", "Desktop")}</span>
            </div>
            <div className="tb-center">
              {now && (
                <>
                  <span className="tb-date">
                    {now.toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" })}
                  </span>
                  <span>{now.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}</span>
                </>
              )}
            </div>
            <div className="tb-right">
              <button
                className="tb-search"
                onClick={() => setPalette(true)}
                aria-label={tr("Rechercher (Ctrl + K)", "Search (Ctrl + K)")}
                title={tr("Rechercher", "Search")}
              >
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="6.5" />
                  <path d="M16 16l4.5 4.5" />
                </svg>
                <span>{tr("Rechercher", "Search")}</span>
                <kbd>Ctrl K</kbd>
              </button>
              <LangToggle />
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn">
                <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                  <path d="M4.98 3.5a2.500 2.500 0 1 1 0 5 2.500 2.500 0 0 1 0-5zM3 9.750h4V21H3zM9.500 9.750h3.800v1.540h.05c.53-1 1.830-1.840 3.650-1.840 3.900 0 4.500 2.500 4.500 5.800V21h-4v-5.100c0-1.300-.03-2.900-1.800-2.900s-2.100 1.380-2.100 2.800V21h-4z" />
                </svg>
              </a>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M12 2a10 10 0 0 0-3.160 19.490c.5.090.680-.220.680-.480v-1.700c-2.780.6-3.370-1.340-3.370-1.340-.460-1.160-1.110-1.470-1.110-1.470-.910-.620.070-.6.070-.6 1 .070 1.530 1.030 1.530 1.030.9 1.520 2.340 1.080 2.910.830.090-.650.350-1.090.630-1.340-2.220-.250-4.550-1.110-4.550-4.940 0-1.090.390-1.980 1.030-2.680-.1-.250-.450-1.270.1-2.640 0 0 .840-.270 2.750 1.020a9.560 9.560 0 0 1 5 0c1.910-1.290 2.750-1.020 2.750-1.020.550 1.370.2 2.390.1 2.640.640.7 1.030 1.590 1.030 2.680 0 3.840-2.340 4.680-4.570 4.930.360.310.680.920.680 1.850v2.740c0 .270.180.580.690.480A10 10 0 0 0 12 2z" />
                </svg>
              </a>
              <button className="tb-fs" onClick={toggleFullscreen} aria-label={tr("Plein écran", "Full screen")} title={tr("Plein écran", "Full screen")}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
                </svg>
              </button>
              <button onClick={() => setPhase("lock")} aria-label={tr("Verrouiller la session", "Lock the session")} title={tr("Verrouiller", "Lock")}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 3v8M6.3 6.8a8 8 0 1 0 11.4 0" />
                </svg>
              </button>
            </div>
          </header>

          <div className="desk-icons">
            {APPS.map((a) => (
              <button
                key={a.id}
                className="desk-icon"
                onDoubleClick={() => open(a.id)}
                onClick={() => window.matchMedia("(hover: none)").matches && open(a.id)}
                onKeyDown={(e) => e.key === "Enter" && open(a.id)}
                title={`${a[lang]} — ${tr("double-clic pour ouvrir", "double-click to open")}`}
              >
                <AppIcon id={a.id} size={52} />
                <span>{a[lang]}</span>
              </button>
            ))}
          </div>

          <div className="signature" aria-hidden="true">
            <b>{profile.name}</b>
            <span>
              {c.title} · {tr("Cybersécurité & IA", "Cybersecurity & AI")}
            </span>
          </div>

          {wins.map((w) => (
            <WindowFrame
              key={w.id}
              win={w}
              mobile={mobile}
              active={w.id === activeId}
              onFocus={() => w.id !== activeId && focus(w.id)}
              onClose={() => close(w.id)}
              onMin={() => patch(w.id, { min: true })}
              onMax={() => patch(w.id, { max: !w.max, z: ++zTop.current })}
              onChange={(p) => patch(w.id, p)}
              onSnapHint={setSnapHint}
              onSnap={(hint) => snap(w.id, hint)}
            >
              {render(w.id)}
            </WindowFrame>
          ))}

          {snapHint && <div className={`snap-preview ${snapHint}`} aria-hidden="true" />}

          {toast && (
            <div className="toast" role="status">
              <div>
                <b>
                  {tr("Bienvenue sur", "Welcome to")} {os.name} 👋
                </b>
                <p>
                  <kbd>Ctrl</kbd> + <kbd>K</kbd>{" "}
                  {tr(
                    "pour tout rechercher · clic droit sur le bureau pour changer le fond · l'assistant IA répond à vos questions, même à la voix.",
                    "to search everything · right-click the desktop to change the wallpaper · the AI assistant answers your questions, even by voice."
                  )}
                </p>
                <button
                  className="btn sm"
                  onClick={() => {
                    setToast(false);
                    open("assistant");
                  }}
                >
                  {tr("Essayer l'assistant", "Try the assistant")}
                </button>
              </div>
              <button className="x" onClick={() => setToast(false)} aria-label={tr("Fermer la notification", "Dismiss notification")}>
                ✕
              </button>
            </div>
          )}

          {menu && <ContextMenu x={menu.x} y={menu.y} items={menuItems} onClose={closeMenu} />}
          {palette && <Palette commands={commands} onClose={() => setPalette(false)} />}
          {matrix && <MatrixRain onDone={stopMatrix} />}

          <nav className="dock" aria-label="Applications">
            {APPS.map((a) => {
              const w = wins.find((x) => x.id === a.id);
              return (
                <button key={a.id} className={w ? "running" : ""} onClick={() => dockClick(a.id)} aria-label={a[lang]}>
                  <AppIcon id={a.id} size={46} />
                  <span className="tip">{a[lang]}</span>
                </button>
              );
            })}
          </nav>
        </>
      )}
    </main>
  );
}

export default function Desktop() {
  return (
    <I18nProvider>
      <DesktopInner />
    </I18nProvider>
  );
}
