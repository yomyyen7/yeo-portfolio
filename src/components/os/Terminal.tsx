"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { os, profile } from "@/lib/data";
import { APPS, appTitle, type AppId } from "./icons";
import { useI18n } from "./i18n";
import type { WallpaperId } from "../three/Wallpaper";

type Line = { id: number; node: ReactNode };

const COMMANDS = [
  "aide", "help", "whoami", "neofetch", "apropos", "about", "competences", "skills", "projets", "projects",
  "parcours", "journey", "contact", "ouvrir", "open", "ls", "cat", "pwd", "date", "echo", "github", "linkedin",
  "clear", "historique", "history", "sudo", "exit", "scan", "matrix", "fond", "wallpaper", "ia", "ai", "lang",
];

const APP_ALIASES: Record<string, AppId> = {
  apropos: "about", about: "about", projets: "projects", projects: "projects", terminal: "terminal",
  competences: "skills", skills: "skills", parcours: "journey", journey: "journey", "3d": "lab", atelier: "lab",
  lab: "lab", github: "github", contact: "contact", ia: "assistant", ai: "assistant", assistant: "assistant",
};

const WALLPAPERS: Record<string, WallpaperId> = {
  noyau: "core", core: "core", reseau: "net", network: "net", bouclier: "shield", shield: "shield",
};

export default function Terminal({
  openApp,
  closeSelf,
  onMatrix,
  setWallpaper,
}: {
  openApp: (id: AppId) => void;
  closeSelf: () => void;
  onMatrix: () => void;
  setWallpaper: (id: WallpaperId) => void;
}) {
  const { c, tr, lang, setLang, locale } = useI18n();
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const files: Record<string, string[]> = {
    [tr("a-propos.txt", "about.txt")]: c.bio,
    "contact.txt": [
      `Email    : ${profile.email}`,
      `LinkedIn : ${profile.linkedin}`,
      `GitHub   : ${profile.github}`,
      `${tr("Ville", "City")}    : ${c.location}`,
    ],
    [tr("competences.txt", "skills.txt")]: c.skills.map((g) => `${g.group.padEnd(28)} ${g.items.join(", ")}`),
  };

  const scan: [string, string, string][] = [
    ["22/tcp", tr("ouvert", "open"), tr("motivation · curiosité", "motivation · curiosity")],
    ["80/tcp", tr("ouvert", "open"), "next.js · react"],
    ["443/tcp", tr("ouvert", "open"), "django · python"],
    ["3000/tcp", tr("ouvert", "open"), "nestjs"],
    ["3306/tcp", tr("ouvert", "open"), "mysql · sqlite · firebase"],
    ["8080/tcp", tr("ouvert", "open"), "flutter · kotlin · java"],
    ["1337/tcp", tr("en cours", "learning"), tr("cybersécurité & IA (Master 1)", "cybersecurity & AI (Master's)")],
  ];

  const neofetch = () => {
    const rows: [string, string][] = [
      ["OS", `${os.name} ${os.version} « ${os.codename} »`],
      [tr("Hôte", "Host"), profile.name],
      [tr("Rôle", "Role"), c.title],
      [tr("Formation", "Education"), tr("Master 1 CSIA · Licence SIGL (ESATIC)", "Master's CSIA · Bachelor's SIGL (ESATIC)")],
      ["Shell", "yeosh 1.0"],
      ["Stack", "Next.js · NestJS · React · Django · Flutter"],
      ["Focus", tr("Cybersécurité & Intelligence artificielle", "Cybersecurity & Artificial intelligence")],
      [tr("Lieu", "Location"), c.location],
    ];
    return (
      <div className="neofetch">
        <pre aria-hidden="true">{`   ╲╲      ╱╱
    ╲╲    ╱╱
     ╲╲  ╱╱
      ╲╲╱╱
       ██
       ██
       ██
       ▀▀`}</pre>
        <div>
          <div>
            <b className="t-orange">{profile.handle}</b>@<b className="t-green">yeoos</b>
          </div>
          <div className="t-dim">──────────────</div>
          {rows.map(([k, v]) => (
            <div key={k}>
              <span className="t-orange">{k}</span> : {v}
            </div>
          ))}
          <div className="swatches" aria-hidden="true">
            {["#ff8a2a", "#ffffff", "#22c98a", "#5aa2ff", "#b68cff", "#ff6f91"].map((col) => (
              <i key={col} style={{ background: col }} />
            ))}
          </div>
        </div>
      </div>
    );
  };

  const nextId = useRef(1);
  const mk = (node: ReactNode): Line => ({ id: nextId.current++, node });
  const [lines, setLines] = useState<Line[]>(() => [
    mk(neofetch()),
    mk(
      <span className="t-dim">
        {tr("Tapez", "Type")} <b className="t-green">{tr("aide", "help")}</b>{" "}
        {tr(
          "pour la liste des commandes. Tab complète, ↑ ↓ parcourent l'historique.",
          "for the list of commands. Tab completes, ↑ ↓ browse history."
        )}
      </span>
    ),
  ]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIndex, setHIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [lines]);

  const prompt = (
    <span className="prompt">
      <span className="t-green">{profile.handle}@yeoos</span>:<span className="t-blue">~</span>$
    </span>
  );

  function run(raw: string): ReactNode | "clear" | null {
    const [cmd, ...rest] = raw.trim().split(/\s+/);
    const arg = rest.join(" ");
    switch (cmd.toLowerCase()) {
      case "":
        return null;
      case "aide":
      case "help":
        return (
          <div className="t-grid">
            {[
              ["whoami", tr("qui suis-je, en une ligne", "who I am, in one line")],
              ["neofetch", tr("fiche système du profil", "system card of the profile")],
              [tr("apropos", "about"), tr("ma présentation", "my introduction")],
              [tr("competences", "skills"), tr("langages, frameworks, outils", "languages, frameworks, tools")],
              [tr("projets", "projects"), tr("liste des projets", "list of projects")],
              [tr("parcours", "journey"), tr("formation et expériences", "education and experience")],
              ["contact", tr("comment me joindre", "how to reach me")],
              [tr("ia", "ai"), tr("ouvre l'assistant IA (texte et voix)", "opens the AI assistant (text and voice)")],
              [
                tr("ouvrir <app>", "open <app>"),
                tr("ouvre une fenêtre : ", "opens a window: ") +
                  (lang === "fr"
                    ? "apropos, projets, competences, parcours, atelier, github, contact, ia"
                    : "about, projects, skills, journey, lab, github, contact, ai"),
              ],
              [tr("ls / cat <fichier>", "ls / cat <file>"), tr("explorer les fichiers du dossier personnel", "browse the files in the home folder")],
              ["github / linkedin", tr("mes profils", "my profiles")],
              ["scan", tr("analyse de ports… de mes compétences", "a port scan… of my skills")],
              [tr("fond <nom>", "wallpaper <name>"), tr("fond 3D : noyau, reseau, bouclier", "3D wallpaper: core, network, shield")],
              ["lang fr|en", tr("change la langue", "switches language")],
              ["matrix", tr("à essayer", "try it")],
              ["clear", tr("efface l'écran", "clears the screen")],
            ].map(([name, desc]) => (
              <div key={name}>
                <span className="t-green">{name}</span>
                <span className="t-dim">{desc}</span>
              </div>
            ))}
          </div>
        );
      case "whoami":
        return `${profile.name} — ${c.title}, ${c.tagline.toLowerCase()}.`;
      case "neofetch":
        return neofetch();
      case "apropos":
      case "about":
        return c.bio.map((p, i) => <p key={i}>{p}</p>);
      case "competences":
      case "skills":
        return c.skills.map((g) => (
          <div key={g.unit}>
            <span className="t-orange">{g.group.padEnd(28, " ")}</span> {g.items.join(" · ")}
          </div>
        ));
      case "projets":
      case "projects":
        return (
          <>
            {c.projects.map((p) => (
              <div key={p.id}>
                <span className="t-blue">{p.file.padEnd(22, " ")}</span>
                <span className="t-dim">{p.date.padEnd(11, " ")}</span>
                {p.summary}
              </div>
            ))}
            <div className="t-dim">→ « {tr("ouvrir projets", "open projects")} » {tr("pour les détails.", "for details.")}</div>
          </>
        );
      case "parcours":
      case "journey":
        return (
          <>
            <div className="t-orange">{tr("Formation", "Education")}</div>
            {c.education.map((e) => (
              <div key={e.title}>
                <span className="t-dim">{e.period.padEnd(13, " ")}</span>
                {e.title}
              </div>
            ))}
            <div className="t-orange">{tr("Expériences", "Experience")}</div>
            {c.experiences.map((e) => (
              <div key={e.title}>
                <span className="t-dim">{e.period.padEnd(13, " ")}</span>
                {e.title} — {e.role}
              </div>
            ))}
            <div className="t-orange">{tr("Langues", "Languages")}</div>
            <div>{c.languages.map((l) => `${l.name} (${l.level})`).join(" · ")}</div>
          </>
        );
      case "contact":
        return files["contact.txt"].map((l) => <div key={l}>{l}</div>);
      case "ia":
      case "ai":
        openApp("assistant");
        return <span className="t-dim">{tr("Ouverture de l'assistant IA…", "Opening the AI assistant…")}</span>;
      case "ouvrir":
      case "open": {
        const id = APP_ALIASES[arg.toLowerCase()];
        if (!id)
          return (
            <span className="t-red">
              {tr("Application inconnue. Essayez : ", "Unknown application. Try: ")}
              {APPS.map((a) => a[lang].toLowerCase()).join(", ")}
            </span>
          );
        openApp(id);
        return (
          <span className="t-dim">
            {tr("Ouverture de", "Opening")} {appTitle(id, lang)}…
          </span>
        );
      }
      case "ls":
        return (
          <div className="t-ls">
            <span className="t-blue">{tr("projets", "projects")}/</span>
            {Object.keys(files).map((f) => (
              <span key={f}>{f}</span>
            ))}
          </div>
        );
      case "cat": {
        if (!arg) return <span className="t-red">{tr("cat : indiquez un fichier (voir « ls »).", "cat: give a file name (see “ls”).")}</span>;
        if (/^(projets|projects)\/?$/.test(arg))
          return <span className="t-red">{tr("cat : c'est un dossier. Essayez « projets ».", "cat: that is a directory. Try “projects”.")}</span>;
        const f = files[arg];
        if (!f)
          return (
            <span className="t-red">
              cat : {arg} : {tr("fichier introuvable.", "no such file.")}
            </span>
          );
        return f.map((l, i) => <div key={i}>{l}</div>);
      }
      case "pwd":
        return `/home/${profile.handle}`;
      case "date":
        return new Date().toLocaleString(locale, { dateStyle: "full", timeStyle: "medium" });
      case "echo":
        return arg;
      case "github":
        openApp("github");
        return <span className="t-dim">GitHub : {profile.github}</span>;
      case "linkedin":
        window.open(profile.linkedin, "_blank", "noopener");
        return <span className="t-dim">LinkedIn : {profile.linkedin}</span>;
      case "lang": {
        const next = arg.toLowerCase();
        if (next !== "fr" && next !== "en") return <span className="t-red">lang : fr | en</span>;
        setLang(next);
        return <span className="t-dim">{next === "fr" ? "Langue : français." : "Language: English."}</span>;
      }
      case "scan": {
        scan.forEach(([port, state, service], i) => {
          timers.current.push(
            setTimeout(() => {
              setLines((ls) => [
                ...ls,
                mk(
                  <span>
                    {port.padEnd(10, " ")}
                    <span className={i < scan.length - 1 ? "t-green" : "t-orange"}>{state.padEnd(10, " ")}</span>
                    {service}
                  </span>
                ),
              ]);
            }, 260 * (i + 1))
          );
        });
        timers.current.push(
          setTimeout(() => {
            setLines((ls) => [
              ...ls,
              mk(
                <span className="t-dim">
                  {tr(
                    "Scan terminé : 0 vulnérabilité détectée, 1 profil à recruter.",
                    "Scan complete: 0 vulnerabilities found, 1 profile worth hiring."
                  )}
                </span>
              ),
            ]);
          }, 260 * (scan.length + 1.5))
        );
        return (
          <>
            <div className="t-dim">
              {tr("Démarrage du scan de", "Starting scan of")} {profile.handle}.local…
            </div>
            <div className="t-orange">{"PORT".padEnd(10, " ") + tr("ÉTAT", "STATE").padEnd(10, " ") + "SERVICE"}</div>
          </>
        );
      }
      case "matrix":
        onMatrix();
        return (
          <span className="t-dim">
            {tr(
              `Réveille-toi, ${profile.handle}… (cliquez ou appuyez sur une touche pour sortir)`,
              `Wake up, ${profile.handle}… (click or press any key to exit)`
            )}
          </span>
        );
      case "fond":
      case "wallpaper": {
        const id = WALLPAPERS[arg.toLowerCase()];
        if (!id)
          return (
            <span className="t-red">
              {tr("fond : choisissez parmi noyau, reseau, bouclier.", "wallpaper: choose core, network or shield.")}
            </span>
          );
        setWallpaper(id);
        return <span className="t-dim">{tr("Fond d'écran changé.", "Wallpaper changed.")}</span>;
      }
      case "historique":
      case "history":
        return history.map((h, i) => (
          <div key={i}>
            <span className="t-dim">{String(i + 1).padStart(3, " ")}</span> {h}
          </div>
        ));
      case "sudo":
        return (
          <span className="t-red">
            {tr(
              `${profile.handle} n'est pas dans le fichier sudoers. Cet incident sera signalé. 🛡️`,
              `${profile.handle} is not in the sudoers file. This incident will be reported. 🛡️`
            )}
          </span>
        );
      case "exit":
        closeSelf();
        return null;
      case "clear":
        return "clear";
      default:
        return (
          <span className="t-red">
            {cmd} : {tr("commande introuvable. Tapez", "command not found. Type")} <b>{tr("aide", "help")}</b>.
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
          {prompt} {raw}
        </span>
      ),
      ...(out ? [mk(out)] : []),
    ]);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const i = hIndex < 0 ? history.length - 1 : Math.max(0, hIndex - 1);
      setHIndex(i);
      setValue(history[i]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (hIndex < 0) return;
      const i = hIndex + 1;
      if (i >= history.length) {
        setHIndex(-1);
        setValue("");
      } else {
        setHIndex(i);
        setValue(history[i]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const parts = value.split(/\s+/);
      if (parts.length === 1) {
        const m = COMMANDS.filter((name) => name.startsWith(parts[0].toLowerCase()));
        if (m.length === 1) setValue(m[0] + " ");
      } else {
        const pool =
          parts[0] === "cat"
            ? Object.keys(files)
            : parts[0] === "fond" || parts[0] === "wallpaper"
              ? Object.keys(WALLPAPERS)
              : Object.keys(APP_ALIASES);
        const m = pool.filter((name) => name.startsWith(parts[1].toLowerCase()));
        if (m.length === 1) setValue(`${parts[0]} ${m[0]}`);
      }
    } else if (e.key.toLowerCase() === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  }

  return (
    <div className="terminal" onClick={() => !window.getSelection()?.toString() && inputRef.current?.focus()}>
      {lines.map((l) => (
        <div key={l.id} className="t-line">
          {l.node}
        </div>
      ))}
      <label className="t-input">
        {prompt}
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          aria-label={tr("Ligne de commande", "Command line")}
        />
      </label>
      <div ref={endRef} />
    </div>
  );
}
