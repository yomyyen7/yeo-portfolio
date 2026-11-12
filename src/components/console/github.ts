"use client";

import { useEffect, useState } from "react";
import { profile } from "@/lib/data";

export type Repo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  fork: boolean;
  pushed_at: string;
  stargazers_count: number;
};

export type GhEvent = {
  id: string;
  type: string;
  created_at: string;
  repo: { name: string };
  payload: { commits?: { message: string }[]; ref_type?: string; action?: string; ref?: string | null };
};

type State<T> = { data: T | null; failed: boolean };

/** Lecture de l'API publique GitHub, avec cache de session pour ménager le quota. */
function useGitHub<T>(path: string, key: string, transform: (raw: T) => T = (x) => x): State<T> {
  const [state, setState] = useState<State<T>>({ data: null, failed: false });
  useEffect(() => {
    try {
      const cached = sessionStorage.getItem(key);
      if (cached) {
        setState({ data: JSON.parse(cached), failed: false });
        return;
      }
    } catch {
      /* stockage indisponible : on interroge simplement l'API */
    }
    const ctl = new AbortController();
    fetch(`https://api.github.com/users/${profile.githubUser}${path}`, { signal: ctl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((raw: T) => {
        const data = transform(raw);
        setState({ data, failed: false });
        try {
          sessionStorage.setItem(key, JSON.stringify(data));
        } catch {
          /* sans cache, rien de grave */
        }
      })
      .catch((e) => e.name !== "AbortError" && setState({ data: null, failed: true }));
    return () => ctl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, key]);
  return state;
}

export const useRepos = () =>
  useGitHub<Repo[]>("/repos?sort=pushed&per_page=30", "gh-repos-v3", (list) => [...list].sort((a, b) => Number(a.fork) - Number(b.fork)));

export const useEvents = () => useGitHub<GhEvent[]>("/events/public?per_page=30", "gh-events-v3");

export const LANG_COLORS: Record<string, string> = {
  Dart: "#00b4ab",
  Python: "#3572a5",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Java: "#b07219",
  Kotlin: "#a97bff",
  HTML: "#e34c26",
  CSS: "#663399",
};

export type FeedItem = { id: string; date: string; text: string };

/**
 * Flux d'activité : événements publics et derniers pushs des dépôts, fusionnés par date.
 * L'API des événements ne garde que peu d'entrées ; les dépôts comblent les trous.
 */
export function buildFeed(events: GhEvent[] | null, repos: Repo[] | null, lang: "fr" | "en", limit: number): FeedItem[] {
  const fromEvents = (events ?? [])
    .map((e) => ({ id: e.id, date: e.created_at, text: describeEvent(e, lang) }))
    .filter((x): x is FeedItem => Boolean(x.text));
  const fromRepos = (repos ?? [])
    .filter((r) => !r.fork)
    .map((r) => ({
      id: `repo-${r.id}`,
      date: r.pushed_at,
      text: lang === "fr" ? `Mise à jour de ${r.name}` : `Updated ${r.name}`,
    }));
  // Un push déjà décrit par un événement n'est pas répété le même jour.
  const days = new Set(fromEvents.map((x) => x.date.slice(0, 10) + x.text));
  const merged = [...fromEvents, ...fromRepos.filter((x) => !days.has(x.date.slice(0, 10) + x.text))];
  return merged.sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
}

/** Résume un événement GitHub en une phrase lisible. */
export function describeEvent(e: GhEvent, lang: "fr" | "en"): string | null {
  const repo = e.repo.name.split("/")[1] ?? e.repo.name;
  const fr = lang === "fr";
  switch (e.type) {
    case "PushEvent": {
      const n = e.payload.commits?.length ?? 0;
      const first = e.payload.commits?.[0]?.message.split("\n")[0];
      return fr ? `${n} commit${n > 1 ? "s" : ""} sur ${repo}${first ? ` — ${first}` : ""}` : `${n} commit${n > 1 ? "s" : ""} to ${repo}${first ? ` — ${first}` : ""}`;
    }
    case "CreateEvent":
      return e.payload.ref_type === "repository"
        ? fr ? `Dépôt créé : ${repo}` : `Repository created: ${repo}`
        : fr ? `Branche ${e.payload.ref ?? ""} créée sur ${repo}` : `Branch ${e.payload.ref ?? ""} created on ${repo}`;
    case "ForkEvent":
      return fr ? `Fork de ${repo}` : `Forked ${repo}`;
    case "WatchEvent":
      return fr ? `Étoile sur ${repo}` : `Starred ${repo}`;
    case "PullRequestEvent":
      return fr ? `Pull request ${e.payload.action ?? ""} sur ${repo}` : `Pull request ${e.payload.action ?? ""} on ${repo}`;
    case "IssuesEvent":
      return fr ? `Issue ${e.payload.action ?? ""} sur ${repo}` : `Issue ${e.payload.action ?? ""} on ${repo}`;
    case "MemberEvent":
      return fr ? `Ajouté comme collaborateur sur ${e.repo.name}` : `Added as a collaborator on ${e.repo.name}`;
    default:
      return null;
  }
}
