"use client";

import { useEffect, useRef, useState } from "react";
import { AppIcon, type AppId } from "./icons";
import { useI18n } from "./i18n";

/* ───────────── Recherche universelle (Ctrl + K) ───────────── */
export type Command = { id: string; label: string; hint: string; icon?: AppId; run: () => void };

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

export function Palette({ commands, onClose }: { commands: Command[]; onClose: () => void }) {
  const { tr } = useI18n();
  const [q, setQ] = useState("");
  const [index, setIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const list = commands.filter((c) => norm(`${c.label} ${c.hint}`).includes(norm(q)));
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
    <div className="palette-veil" onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="palette" role="dialog" aria-label={tr("Recherche", "Search")} onKeyDown={onKeyDown}>
        <div className="palette-input">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="6.5" />
            <path d="M16 16l4.5 4.5" />
          </svg>
          <input
            autoFocus
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setIndex(0);
            }}
            placeholder={tr("Rechercher une application, un projet, une action…", "Search for an app, a project, an action…")}
            aria-label={tr("Rechercher", "Search")}
            spellCheck={false}
          />
          <kbd>{tr("Échap", "Esc")}</kbd>
        </div>
        <div className="palette-list" ref={listRef}>
          {list.length === 0 && <p className="palette-empty">
              {tr("Aucun résultat pour", "No results for")} « {q} ».
            </p>}
          {list.map((c, i) => (
            <button
              key={c.id}
              className={i === active ? "on" : ""}
              onPointerMove={() => setIndex(i)}
              onClick={() => {
                c.run();
                onClose();
              }}
            >
              {c.icon ? <AppIcon id={c.icon} size={28} /> : <span className="palette-dot" />}
              <span className="palette-label">{c.label}</span>
              <span className="palette-hint">{c.hint}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────────── Menu contextuel du bureau ───────────── */
export type MenuItem = { label: string; hint?: string; run: () => void } | "sep";

export function ContextMenu({
  x,
  y,
  items,
  onClose,
}: {
  x: number;
  y: number;
  items: MenuItem[];
  onClose: () => void;
}) {
  useEffect(() => {
    const close = () => onClose();
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("pointerdown", close);
    window.addEventListener("keydown", key);
    window.addEventListener("blur", close);
    return () => {
      window.removeEventListener("pointerdown", close);
      window.removeEventListener("keydown", key);
      window.removeEventListener("blur", close);
    };
  }, [onClose]);

  const left = Math.min(x, window.innerWidth - 250);
  const top = Math.min(y, window.innerHeight - items.length * 34 - 110);

  return (
    <div className="ctx" style={{ left, top }} role="menu" onPointerDown={(e) => e.stopPropagation()}>
      {items.map((it, i) =>
        it === "sep" ? (
          <hr key={i} />
        ) : (
          <button
            key={it.label}
            role="menuitem"
            onClick={() => {
              it.run();
              onClose();
            }}
          >
            <span>{it.label}</span>
            {it.hint && <kbd>{it.hint}</kbd>}
          </button>
        )
      )}
    </div>
  );
}

/* ───────────── Pluie de caractères ───────────── */
export function MatrixRain({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const size = 16;
    let cols = 0;
    let drops: number[] = [];
    const fit = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.ceil(canvas.width / size);
      drops = Array.from({ length: cols }, () => Math.random() * -40);
    };
    fit();
    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノ01YEO<>/{}";
    const tick = setInterval(() => {
      ctx.fillStyle = "rgba(4, 6, 10, 0.14)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${size}px monospace`;
      for (let i = 0; i < cols; i++) {
        const y = drops[i] * size;
        ctx.fillStyle = Math.random() > 0.96 ? "#ffffff" : i % 9 === 0 ? "#ff8a2a" : "#22c98a";
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * size, y);
        drops[i] = y > canvas.height && Math.random() > 0.975 ? 0 : drops[i] + 1;
      }
    }, 45);

    const stop = () => onDone();
    const arm = setTimeout(() => {
      window.addEventListener("keydown", stop);
      window.addEventListener("pointerdown", stop);
    }, 400);
    const auto = setTimeout(stop, 12000);
    window.addEventListener("resize", fit);
    return () => {
      clearInterval(tick);
      clearTimeout(arm);
      clearTimeout(auto);
      window.removeEventListener("keydown", stop);
      window.removeEventListener("pointerdown", stop);
      window.removeEventListener("resize", fit);
    };
  }, [onDone]);

  return <canvas ref={ref} className="matrix" aria-hidden="true" />;
}
