export type Lang = "fr" | "en";

/** Informations indépendantes de la langue. */
export const profile = {
  name: "Yomoyaha Yeo",
  firstName: "Yomoyaha",
  photo: "/yeo.webp",
  email: "yomoyahayeo@gmail.com",
  github: "https://github.com/yomyyen7",
  githubUser: "yomyyen7",
  linkedin: "https://www.linkedin.com/in/yomoyaha-yeo-352626307/",
  site: "https://yeo-portfolio-theta.vercel.app",
};

export type Project = {
  id: string;
  name: string;
  year: string;
  context: string;
  role: string;
  /** Une phrase : ce que fait le projet. */
  summary: string;
  /** Le besoin auquel le projet répond. */
  problem: string;
  /** Ce que Yomoyaha a fait concrètement. */
  work: string[];
  stack: string[];
  repo?: string;
  /** Capture d'écran facultative, à placer dans /public/projects. */
  image?: string;
};

export type Content = {
  role: string;
  headline: string;
  status: string;
  location: string;
  availability: string;
  bio: string[];
  projects: Project[];
  skills: { group: string; items: string[] }[];
  languages: { name: string; level: string }[];
  education: { period: string; title: string; place: string; current: boolean }[];
  experiences: { period: string; title: string; place: string; role: string }[];
};

function build(lang: Lang): Content {
  const L = (fr: string, en: string) => (lang === "fr" ? fr : en);
  return {
    role: L("Développeur logiciel", "Software developer"),
    headline: L(
      "Développeur logiciel, je me spécialise en cybersécurité et en intelligence artificielle.",
      "Software developer specialising in cybersecurity and artificial intelligence."
    ),
    status: L("Master 1 CSIA à l'ESATIC", "Master's student (CSIA) at ESATIC"),
    location: "Abidjan, Côte d'Ivoire",
    availability: L("Disponible pour un stage", "Available for an internship"),
    bio: [
      L(
        "Diplômé d'une Licence en Systèmes Informatiques et Génie Logiciel (SIGL) à l'ESATIC, je suis aujourd'hui en Master 1 Cybersécurité et Intelligence Artificielle dans la même école.",
        "I hold a Bachelor's degree in Computer Systems and Software Engineering (SIGL) from ESATIC, where I am now in the first year of a Master's in Cybersecurity and Artificial Intelligence."
      ),
      L(
        "Je construis des applications web et mobiles de bout en bout, du modèle de données à l'interface, avec Django, Next.js, NestJS, Flutter et Kotlin. Mon Master oriente maintenant ce travail vers la sécurité des systèmes et l'IA appliquée.",
        "I build web and mobile applications end to end, from the data model to the interface, with Django, Next.js, NestJS, Flutter and Kotlin. My Master's now steers that work toward system security and applied AI."
      ),
      L(
        "Je cherche un stage pour contribuer à des projets concrets dans ces domaines, à Abidjan, sur site ou en hybride.",
        "I am looking for an internship to contribute to real projects in these fields, in Abidjan, on site or hybrid."
      ),
    ],
    projects: [
      {
        id: "oxynova",
        name: "OxyNova",
        year: "2026",
        context: L("Santé connectée", "Connected health"),
        role: L("Développeur mobile", "Mobile developer"),
        summary: L(
          "Application mobile de prévention de la pneumonie, appuyée sur des capteurs connectés et un modèle d'IA.",
          "A mobile app for pneumonia prevention, built on connected sensors and an AI model."
        ),
        problem: L(
          "Suivre des indicateurs de santé en continu pour repérer plus tôt les situations à risque.",
          "Track health indicators continuously to spot risky situations earlier."
        ),
        work: [
          L(
            "Développement de l'application Flutter qui reçoit les mesures des capteurs (IoT).",
            "Built the Flutter app that receives readings from the sensors (IoT)."
          ),
          L(
            "Intégration d'un serveur Python qui héberge le modèle d'IA chargé d'analyser les mesures.",
            "Integrated a Python server hosting the AI model that analyses the readings."
          ),
        ],
        stack: ["Flutter", "Dart", "Python", "IoT", L("IA", "AI")],
        repo: "https://github.com/yomyyen7/oxynova-mobile",
      },
      {
        id: "smartwatt",
        name: "SmartWatt",
        year: "2025",
        context: "Hackathon SMARTWATT IUA",
        role: L("Développeur front-end", "Front-end developer"),
        summary: L(
          "Gestion intelligente et prédictive de la consommation électrique, connectée aux compteurs de la CIE.",
          "Smart, predictive management of electricity use, connected to CIE smart meters."
        ),
        problem: L(
          "Permettre aux abonnés de suivre et d'anticiper leur consommation d'électricité.",
          "Let customers follow and anticipate their electricity consumption."
        ),
        work: [
          L(
            "Conception en équipe d'une application mobile, en quatre jours de hackathon.",
            "Designed a mobile app as a team over a four-day hackathon."
          ),
          L(
            "Réalisation des écrans et de l'expérience utilisateur côté front-end.",
            "Built the screens and the user experience on the front end."
          ),
        ],
        stack: ["Mobile", "Front-end", L("Prédiction", "Forecasting")],
      },
      {
        id: "supermarche",
        name: L("Gestion de supermarché", "Supermarket management"),
        year: "2025",
        context: L("Atelier Génie Logiciel, ESATIC", "Software Engineering Workshop, ESATIC"),
        role: L("Chef de groupe et développeur web", "Team lead and web developer"),
        summary: L(
          "Application web de gestion pour un supermarché, menée en tant que chef de groupe.",
          "A web management application for a supermarket, delivered as team lead."
        ),
        problem: L(
          "Centraliser la gestion quotidienne d'un supermarché dans une seule application.",
          "Bring a supermarket's day-to-day management into a single application."
        ),
        work: [
          L("Coordination de l'équipe et répartition du travail.", "Coordinated the team and split the work."),
          L(
            "Développement du front-end (HTML, CSS), du back-end (Django) et du modèle de données (SQLite).",
            "Built the front end (HTML, CSS), the back end (Django) and the data model (SQLite)."
          ),
        ],
        stack: ["Django", "Python", "SQLite", "HTML", "CSS"],
      },
      {
        id: "seances",
        name: L("Registre des séances", "Session register"),
        year: "2025",
        context: L("Développement mobile, ESATIC", "Mobile development course, ESATIC"),
        role: L("Développeur mobile", "Mobile developer"),
        summary: L(
          "Application Android qui remplace le registre papier des séances de cours, entièrement hors ligne.",
          "An Android app that replaces the paper register of teaching sessions, fully offline."
        ),
        problem: L(
          "Remplacer un registre papier sans dépendre d'une connexion internet.",
          "Replace a paper register without relying on an internet connection."
        ),
        work: [
          L(
            "Enregistrement, consultation et conservation sécurisée des séances, sans connexion.",
            "Recording, browsing and secure storage of sessions, with no connection."
          ),
          L("Application écrite en Kotlin et Java, données stockées localement avec SQLite.", "Written in Kotlin and Java, with local storage in SQLite."),
        ],
        stack: ["Kotlin", "Java", "Android", "SQLite"],
      },
      {
        id: "concours",
        name: "ESATIC Concours",
        year: "2025",
        context: L("Projet web, ESATIC", "Web project, ESATIC"),
        role: L("Développeur web", "Web developer"),
        summary: L(
          "Plateforme web d'inscription à un concours d'entrée.",
          "A web platform for entrance-exam registration."
        ),
        problem: L("Gérer en ligne les inscriptions et les pièces des candidats.", "Handle candidates' registrations and documents online."),
        work: [
          L("Module d'inscription et gestion des fichiers déposés.", "Registration module and handling of uploaded files."),
          L("Interface réalisée avec Tailwind CSS intégré à Django.", "Interface built with Tailwind CSS inside Django."),
        ],
        stack: ["Django", "Python", "Tailwind CSS", "SQLite"],
        repo: "https://github.com/yomyyen7/esatic_concours",
      },
    ],
    skills: [
      { group: L("Langages", "Languages"), items: ["Python", "JavaScript", "Java", "Kotlin", "Dart", "HTML", "CSS"] },
      { group: "Frameworks", items: ["Next.js", "NestJS", "React", "Django", "Flutter"] },
      { group: L("Bases de données", "Databases"), items: ["MySQL", "SQLite", "Firebase"] },
      { group: L("Conception", "Design"), items: ["UML", "MERISE"] },
      { group: L("Outils", "Tools"), items: ["Git", "GitHub", "VS Code", "IntelliJ IDEA", "Android Studio"] },
      { group: L("Spécialisation", "Focus"), items: [L("Cybersécurité", "Cybersecurity"), L("Intelligence artificielle", "Artificial intelligence")] },
    ],
    languages: [
      { name: L("Français", "French"), level: L("courant (C1)", "fluent (C1)") },
      { name: L("Anglais", "English"), level: L("débutant supérieur (A2)", "elementary (A2)") },
    ],
    education: [
      {
        period: L("Depuis 2026", "Since 2026"),
        title: L("Master 1 CSIA, Cybersécurité et Intelligence Artificielle", "Master's year 1 (CSIA), Cybersecurity and Artificial Intelligence"),
        place: L("École Supérieure Africaine des TIC (ESATIC), Abidjan", "African Higher School of ICT (ESATIC), Abidjan"),
        current: true,
      },
      {
        period: "2023 – 2026",
        title: L("Licence SIGL, Systèmes Informatiques et Génie Logiciel", "Bachelor's (SIGL), Computer Systems and Software Engineering"),
        place: L("École Supérieure Africaine des TIC (ESATIC), Abidjan", "African Higher School of ICT (ESATIC), Abidjan"),
        current: false,
      },
      {
        period: "2023",
        title: L("Baccalauréat série D", "Baccalauréat, series D (science)"),
        place: "Collège le Petit Champion d'Abobo, Abidjan",
        current: false,
      },
    ],
    experiences: [
      {
        period: L("Nov. 2025", "Nov 2025"),
        title: L("Application mobile de gestion des séances", "Mobile app for managing teaching sessions"),
        place: L("Projet de cours, ESATIC", "Course project, ESATIC"),
        role: L("Développeur mobile", "Mobile developer"),
      },
      {
        period: L("Oct. 2025", "Oct 2025"),
        title: L("Application de gestion pour supermarché", "Supermarket management application"),
        place: L("Atelier Génie Logiciel, ESATIC", "Software Engineering Workshop, ESATIC"),
        role: L("Chef de groupe, développeur web", "Team lead, web developer"),
      },
      {
        period: L("Juin 2025", "June 2025"),
        title: L("Gestion intelligente de la consommation énergétique", "Smart energy consumption management"),
        place: L("Hackathon SMARTWATT, IUA, Abidjan", "SMARTWATT hackathon, IUA, Abidjan"),
        role: L("Développeur front-end", "Front-end developer"),
      },
    ],
  };
}

const cache: Record<Lang, Content> = { fr: build("fr"), en: build("en") };
export const getContent = (lang: Lang): Content => cache[lang];
