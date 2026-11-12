import type { Lang } from "@/lib/data";

export type NavItem = { href: string; fr: string; en: string; key: string };

/** Vues de la console, dans l'ordre de la barre latérale. */
export const NAV: NavItem[] = [
  { href: "/", fr: "Vue d'ensemble", en: "Overview", key: "overview" },
  { href: "/dossiers", fr: "Dossiers", en: "Case files", key: "cases" },
  { href: "/chronologie", fr: "Chronologie", en: "Timeline", key: "timeline" },
  { href: "/competences", fr: "Compétences", en: "Skills", key: "skills" },
  { href: "/activite", fr: "Activité", en: "Activity", key: "activity" },
  { href: "/contact", fr: "Contact", en: "Contact", key: "contact" },
];

export const navLabel = (item: NavItem, lang: Lang) => item[lang];

export const isActive = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
