export type Lang = "fr" | "en";

/** Informations indépendantes de la langue. */
export const profile = {
  name: "Yomoyaha Yeo",
  firstName: "Yomoyaha",
  initials: "YY",
  handle: "yeo",
  photo: "/yeo.webp",
  email: "yomoyahayeo@gmail.com",
  github: "https://github.com/yomyyen7",
  githubUser: "yomyyen7",
  linkedin: "https://www.linkedin.com/in/yomoyaha-yeo-352626307/",
  linkedinLabel: "linkedin.com/in/yomoyaha-yeo",
};

export const os = { name: "YeoOS", version: "26.11", codename: "Abidjan" };

export type Project = {
  id: string;
  name: string;
  file: string;
  kind: "Mobile" | "Web";
  tags: string[];
  date: string;
  context: string;
  role: string;
  summary: string;
  details: string[];
  stack: string[];
  repo?: string;
  hue: number;
};

export type Content = {
  title: string;
  tagline: string;
  location: string;
  bio: string[];
  projects: Project[];
  skills: { group: string; unit: string; items: string[] }[];
  languages: { name: string; level: string; value: number }[];
  education: { period: string; title: string; place: string; current: boolean }[];
  experiences: { period: string; title: string; place: string; role: string }[];
};

function build(lang: Lang): Content {
  const L = (fr: string, en: string) => (lang === "fr" ? fr : en);
  return {
    title: "Software Developer",
    tagline: L("Étudiant en Master 1 Cybersécurité & IA", "Master's student in Cybersecurity & AI"),
    location: L("Abidjan, Côte d'Ivoire", "Abidjan, Côte d'Ivoire"),
    bio: [
      L(
        "Titulaire d'une Licence en Systèmes Informatiques et Génie Logiciel (SIGL) obtenue à l'ESATIC, je poursuis aujourd'hui un Master 1 en Cybersécurité et Intelligence Artificielle (CSIA).",
        "I hold a Bachelor's degree in Computer Systems and Software Engineering (SIGL) from ESATIC, and I am now in the first year of a Master's in Cybersecurity and Artificial Intelligence (CSIA)."
      ),
      L(
        "Je conçois des applications web et mobiles de bout en bout — modèle de données, back-end, interface — et j'oriente mon travail vers la sécurité des systèmes et l'IA appliquée.",
        "I build web and mobile applications end to end — data model, back end, interface — and I am steering my work toward system security and applied AI."
      ),
      L(
        "Curieux, motivé et sérieux, je cherche à rejoindre une équipe où mettre ces compétences en pratique et continuer à apprendre.",
        "Curious, motivated and reliable, I am looking to join a team where I can put these skills to work and keep learning."
      ),
    ],
    projects: [
      {
        id: "oxynova",
        name: "OxyNova Mobile",
        file: "oxynova-mobile",
        kind: "Mobile",
        tags: ["Mobile", "IA"],
        date: "2026",
        context: L("Projet santé connectée", "Connected-health project"),
        role: L("Développeur mobile", "Mobile developer"),
        summary: L(
          "Application mobile de prévention de la pneumonie avec IoT et IA.",
          "Mobile app for pneumonia prevention using IoT and AI."
        ),
        details: [
          L(
            "Application Flutter qui s'appuie sur des capteurs connectés (IoT) pour suivre des indicateurs de santé.",
            "A Flutter app that relies on connected sensors (IoT) to track health indicators."
          ),
          L(
            "Un serveur Python héberge le modèle d'IA qui analyse les mesures et aide à la prévention.",
            "A Python server hosts the AI model that analyses the readings and supports prevention."
          ),
        ],
        stack: ["Flutter", "Dart", "Python", "IoT", L("IA", "AI")],
        repo: "https://github.com/yomyyen7/oxynova-mobile",
        hue: 158,
      },
      {
        id: "smartwatt",
        name: L("SmartWatt — énergie intelligente", "SmartWatt — smart energy"),
        file: "smartwatt-cie",
        kind: "Mobile",
        tags: ["Mobile", "Hackathon", "IA"],
        date: L("Juin 2025", "June 2025"),
        context: "Hackathon SMARTWATT IUA 2025 · Abidjan (Cocody)",
        role: L("Développeur front-end", "Front-end developer"),
        summary: L(
          "Gestion intelligente et prédictive de la consommation électrique, connectée aux compteurs intelligents de la CIE.",
          "Smart, predictive management of electricity consumption, connected to CIE smart meters."
        ),
        details: [
          L(
            "Conception en équipe, en quatre jours, d'une application mobile permettant de contrôler et d'anticiper ses besoins en énergie.",
            "Designed as a team, in four days, a mobile app that lets users monitor and anticipate their energy needs."
          ),
          L(
            "Réalisation des écrans et de l'expérience utilisateur côté front-end.",
            "Built the screens and the user experience on the front end."
          ),
        ],
        stack: ["Mobile", "Front-end", L("Prédiction", "Prediction"), L("Travail d'équipe", "Teamwork")],
        hue: 28,
      },
      {
        id: "supermarche",
        name: L("Gestion de supermarché", "Supermarket management"),
        file: "gestion-supermarche",
        kind: "Web",
        tags: ["Web"],
        date: L("Oct. 2025", "Oct 2025"),
        context: L("Atelier Génie Logiciel · ESATIC", "Software Engineering Workshop · ESATIC"),
        role: L("Chef de groupe · Développeur web", "Team lead · Web developer"),
        summary: L(
          "Application web de gestion pour supermarché, menée en tant que chef de groupe.",
          "Web management application for a supermarket, delivered as team lead."
        ),
        details: [
          L("Coordination de l'équipe et répartition du travail.", "Coordinated the team and split the work."),
          L(
            "Participation au front-end (HTML/CSS), au back-end (Django) et au modèle de base de données (SQLite).",
            "Contributed to the front end (HTML/CSS), the back end (Django) and the database model (SQLite)."
          ),
        ],
        stack: ["Django", "Python", "HTML", "CSS", "SQLite"],
        hue: 265,
      },
      {
        id: "seances",
        name: L("Registre des séances (hors ligne)", "Session register (offline)"),
        file: "registre-seances",
        kind: "Mobile",
        tags: ["Mobile"],
        date: L("Nov. 2025", "Nov 2025"),
        context: L("Module Développement Mobile · ESATIC", "Mobile Development course · ESATIC"),
        role: L("Développeur mobile", "Mobile developer"),
        summary: L(
          "Application Android qui remplace le registre papier des séances pédagogiques, 100 % hors ligne.",
          "Android app that replaces the paper register of teaching sessions, fully offline."
        ),
        details: [
          L(
            "Enregistrement, consultation et conservation sécurisée des séances sans connexion.",
            "Records, displays and securely stores sessions with no connection."
          ),
          L(
            "Front-end et back-end en Kotlin et Java, stockage local avec SQLite.",
            "Front end and back end in Kotlin and Java, local storage with SQLite."
          ),
        ],
        stack: ["Kotlin", "Java", "Android", "SQLite"],
        hue: 205,
      },
      {
        id: "concours",
        name: "ESATIC Concours",
        file: "esatic_concours",
        kind: "Web",
        tags: ["Web"],
        date: "2025",
        context: L("Projet web · ESATIC", "Web project · ESATIC"),
        role: L("Développeur web", "Web developer"),
        summary: L(
          "Plateforme web d'inscription à un concours, développée avec Django.",
          "Web platform for registering to an entrance exam, built with Django."
        ),
        details: [
          L(
            "Module d'inscription, gestion des fichiers déposés et gabarits HTML.",
            "Registration module, uploaded-file handling and HTML templates."
          ),
          L("Interface stylée avec Tailwind CSS intégré à Django.", "Interface styled with Tailwind CSS integrated into Django."),
        ],
        stack: ["Django", "Python", "Tailwind CSS", "JavaScript", "SQLite"],
        repo: "https://github.com/yomyyen7/esatic_concours",
        hue: 340,
      },
    ],
    skills: [
      { group: L("Langages", "Languages"), unit: "lang", items: ["Python", "JavaScript", "Java", "Kotlin", "Dart", "HTML", "CSS"] },
      { group: L("Frameworks & bibliothèques", "Frameworks & libraries"), unit: "fw", items: ["Next.js", "NestJS", "React", "Django", "Flutter"] },
      { group: L("Bases de données", "Databases"), unit: "db", items: ["MySQL", "SQLite", "Firebase"] },
      { group: L("Conception", "Design & modelling"), unit: "uml", items: ["UML", "MERISE"] },
      { group: L("Outils & versioning", "Tools & versioning"), unit: "tools", items: ["Git", "GitHub", "Visual Studio Code", "IntelliJ IDEA", "Android Studio"] },
      {
        group: L("Spécialisation (Master)", "Specialisation (Master's)"),
        unit: "sec",
        items: [L("Cybersécurité", "Cybersecurity"), L("Intelligence artificielle", "Artificial intelligence")],
      },
    ],
    languages: [
      { name: L("Français", "French"), level: L("C1 · Courant", "C1 · Fluent"), value: 5 },
      { name: L("Anglais", "English"), level: L("A2 · Débutant supérieur", "A2 · Upper beginner"), value: 2 },
    ],
    education: [
      {
        period: L("En cours", "In progress"),
        title: L(
          "Master 1 CSIA — Cybersécurité et Intelligence Artificielle",
          "Master's, year 1 (CSIA) — Cybersecurity and Artificial Intelligence"
        ),
        place: L("École Supérieure Africaine des TIC (ESATIC) · Abidjan", "ESATIC — African Higher School of ICT · Abidjan"),
        current: true,
      },
      {
        period: "2023 — 2026",
        title: L(
          "Licence SIGL — Systèmes Informatiques et Génie Logiciel",
          "Bachelor's (SIGL) — Computer Systems and Software Engineering"
        ),
        place: L("École Supérieure Africaine des TIC (ESATIC) · Abidjan", "ESATIC — African Higher School of ICT · Abidjan"),
        current: false,
      },
      {
        period: L("Juil. 2023", "July 2023"),
        title: L("Baccalauréat série D", "Baccalauréat, series D (science)"),
        place: "Collège le Petit Champion d'Abobo · Abobo",
        current: false,
      },
    ],
    experiences: [
      {
        period: L("Nov. 2025", "Nov 2025"),
        title: L("Application mobile de gestion des séances (hors ligne)", "Offline mobile app for managing teaching sessions"),
        place: L("Projet scolaire · Développement Mobile · ESATIC", "School project · Mobile Development · ESATIC"),
        role: L("Développeur mobile", "Mobile developer"),
      },
      {
        period: L("Oct. 2025", "Oct 2025"),
        title: L("Application de gestion pour supermarché", "Supermarket management application"),
        place: L("Projet scolaire · Atelier Génie Logiciel · ESATIC", "School project · Software Engineering Workshop · ESATIC"),
        role: L("Chef de groupe, développeur web", "Team lead, web developer"),
      },
      {
        period: L("Juin 2025", "June 2025"),
        title: L("Gestion intelligente de la consommation énergétique", "Smart management of energy consumption"),
        place: "Hackathon SMARTWATT IUA 2025 · Abidjan (Cocody)",
        role: L("Développeur front-end", "Front-end developer"),
      },
    ],
  };
}

const cache: Record<Lang, Content> = { fr: build("fr"), en: build("en") };
export const getContent = (lang: Lang): Content => cache[lang];
