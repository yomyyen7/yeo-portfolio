import { getContent, profile, type Lang } from "./data";

/** Fenêtres que l'assistant peut ouvrir, via un marqueur `[[open:id]]` en fin de réponse. */
export const OPENABLE = ["about", "projects", "skills", "journey", "lab", "github", "contact", "terminal"] as const;
export type Openable = (typeof OPENABLE)[number];

export const MARKER = /\[\[open:([a-z]+)\]\]/g;

/** Sépare le texte affiché des fenêtres à ouvrir. Tolère un marqueur encore incomplet en fin de flux. */
export function splitMarkers(raw: string): { text: string; open: Openable[] } {
  const open: Openable[] = [];
  const text = raw
    .replace(MARKER, (_, id: string) => {
      if ((OPENABLE as readonly string[]).includes(id)) open.push(id as Openable);
      return "";
    })
    .replace(/\[\[?[a-z:]*$/, "")
    .trim();
  return { text, open };
}

export function buildSystemPrompt(): string {
  const c = getContent("fr");
  const facts = {
    nom: profile.name,
    titre: c.title,
    situation: c.tagline,
    localisation: c.location,
    presentation: c.bio,
    formation: c.education.map((e) => `${e.period} : ${e.title}${e.place ? ` (${e.place})` : ""}`),
    experiences: c.experiences.map((e) => `${e.period} : ${e.title} — ${e.role} (${e.place})`),
    projets: c.projects.map((p) => ({
      nom: p.name,
      date: p.date,
      contexte: p.context,
      role: p.role,
      resume: p.summary,
      details: p.details,
      technologies: p.stack,
      depot: p.repo ?? "non publié",
    })),
    competences: Object.fromEntries(c.skills.map((s) => [s.group, s.items])),
    langues: c.languages.map((l) => `${l.name} (${l.level})`),
    contact: { email: profile.email, github: profile.github, linkedin: profile.linkedin },
    recherche: "Ouvert aux opportunités de stage et aux projets, à Abidjan, sur site ou en hybride.",
  };

  return `Tu es l'assistant intégré au portfolio de ${profile.name}, un portfolio en forme de système d'exploitation appelé YeoOS. Les visiteurs sont surtout des recruteurs, des enseignants et d'autres développeurs qui veulent savoir rapidement qui est ${profile.firstName}, ce qu'il a réalisé et comment le contacter. Tu parles de lui à la troisième personne, avec chaleur et précision.

Tout ce que tu sais de lui tient dans la fiche ci-dessous. Elle est ta seule source : si une question porte sur un point qui n'y figure pas (salaire attendu, notes, vie privée, avis sur une entreprise…), dis simplement que tu n'as pas cette information et propose de lui écrire à ${profile.email}. Ne complète jamais avec des suppositions : un recruteur pourrait prendre une invention pour un fait.

Tes réponses sont affichées dans une petite fenêtre de discussion et peuvent être lues à voix haute. Écris donc en texte simple, sans Markdown, sans listes à puces ni titres, en deux à cinq phrases. Réponds dans la langue du visiteur (français ou anglais).

Tu es là pour parler de ${profile.firstName} et de son travail. Si on te demande autre chose (écrire du code, faire un devoir, discuter d'actualité), décline en une phrase aimable et ramène la conversation vers le portfolio.

Tu peux ouvrir une fenêtre du portfolio quand cela aide le visiteur : termine alors ta réponse par un marqueur sur sa propre ligne, par exemple [[open:projects]]. Fenêtres disponibles : about (présentation), projects (projets), skills (compétences), journey (formation et expériences), lab (atelier 3D), github (dépôts en direct), contact, terminal. Un seul marqueur par réponse, et seulement quand c'est pertinent.

Fiche de ${profile.name} :
${JSON.stringify(facts, null, 2)}`;
}

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

/**
 * Réponses sans modèle de langage : utilisées quand aucune clé d'API n'est configurée,
 * ou si l'appel au modèle échoue. Reconnaît les sujets par mots-clés.
 */
export function localAnswer(question: string, lang: Lang): string {
  const c = getContent(lang);
  const q = ` ${norm(question)} `;
  const L = (fr: string, en: string) => (lang === "fr" ? fr : en);
  const has = (re: RegExp) => re.test(q);
  const first = profile.firstName;

  const project = (id: string) => {
    const p = c.projects.find((x) => x.id === id)!;
    return `${p.name} (${p.date}) — ${p.summary} ${p.details.join(" ")} ${L("Rôle", "Role")} : ${p.role}. ${L(
      "Technologies",
      "Stack"
    )} : ${p.stack.join(", ")}.\n[[open:projects]]`;
  };

  if (has(/oxynova|pneumoni|sante|health/)) return project("oxynova");
  if (has(/smartwatt|hackathon|energie|energy|electri|\bcie\b/)) return project("smartwatt");
  if (has(/supermarch|supermarket/)) return project("supermarche");
  if (has(/seance|registre|register|session|android|kotlin/)) return project("seances");
  if (has(/concours|inscription|entrance exam/)) return project("concours");

  if (has(/projet|project|realis|built|build|portfolio|travaux|\bwork\b|app/)) {
    return `${L(`${first} a réalisé ${c.projects.length} projets`, `${first} has built ${c.projects.length} projects`)} : ${c.projects
      .map((p) => p.name)
      .join(", ")}. ${L(
      "Ils couvrent le web (Django), le mobile (Flutter, Kotlin) et l'IA. Je vous ouvre la fenêtre Projets.",
      "They span web (Django), mobile (Flutter, Kotlin) and AI. I am opening the Projects window for you."
    )}\n[[open:projects]]`;
  }

  if (has(/cyber|securit|security|\bia\b|\bai\b|intelligence|machine learning/)) {
    return L(
      `${first} se spécialise en cybersécurité et en intelligence artificielle : c'est le cœur de son Master 1 CSIA à l'ESATIC. Côté pratique, son projet OxyNova associe déjà une application mobile à un modèle d'IA.\n[[open:journey]]`,
      `${first} is specialising in cybersecurity and artificial intelligence: that is the focus of his Master's (CSIA) at ESATIC. On the practical side, his OxyNova project already pairs a mobile app with an AI model.\n[[open:journey]]`
    );
  }

  if (has(/competen|skill|stack|techno|langage|framework|outil|tool|next|nest|react|django|flutter|python|java|maitrise|know/)) {
    return `${L(`Les compétences de ${first}`, `${first}'s skills`)} — ${c.skills
      .map((s) => `${s.group} : ${s.items.join(", ")}`)
      .join(". ")}.\n[[open:skills]]`;
  }

  if (has(/formation|etude|educat|study|studies|master|licence|bachelor|diplom|degree|esatic|ecole|school|universit|parcours|background|experience/)) {
    return `${c.education.map((e) => `${e.period} : ${e.title}`).join(". ")}. ${L(
      "Il a aussi participé au hackathon SMARTWATT IUA 2025.",
      "He also took part in the SMARTWATT IUA 2025 hackathon."
    )}\n[[open:journey]]`;
  }

  if (has(/contact|email|e-mail|mail|joindre|reach|embauch|hire|recrut|stage|internship|disponib|availab|linkedin|telephone|phone|ecrire|write to/)) {
    return L(
      `${first} est ouvert aux opportunités de stage et aux projets. Le plus simple est de lui écrire à ${profile.email}, ou de passer par LinkedIn. Je vous ouvre la fenêtre Contact.\n[[open:contact]]`,
      `${first} is open to internship opportunities and projects. The easiest way is to email him at ${profile.email}, or reach out on LinkedIn. I am opening the Contact window for you.\n[[open:contact]]`
    );
  }

  if (has(/github|\bcode\b|repo|depot|source/)) {
    return L(
      `Son code est sur GitHub, sous le nom ${profile.githubUser}. La fenêtre GitHub affiche ses dépôts en direct.\n[[open:github]]`,
      `His code is on GitHub, under the name ${profile.githubUser}. The GitHub window shows his repositories live.\n[[open:github]]`
    );
  }

  if (has(/langue|language|anglais|english|francais|french|parle|speak/)) {
    return `${L(`${first} parle`, `${first} speaks`)} ${c.languages.map((l) => `${l.name} (${l.level})`).join(L(" et ", " and "))}.`;
  }

  if (has(/\bou\b|where|ville|city|abidjan|localis|based|habite|live|pays|country/)) {
    return L(`${first} est basé à ${c.location}.`, `${first} is based in ${c.location}.`);
  }

  if (has(/3d|blender|three|atelier|\blab\b/)) {
    return L(
      "Les scènes 3D du portfolio sont générées en code avec Three.js. L'Atelier 3D permet de les faire tourner à la souris.\n[[open:lab]]",
      "The 3D scenes in this portfolio are generated in code with Three.js. The 3D Lab lets you spin them with the mouse.\n[[open:lab]]"
    );
  }

  if (has(/\bqui\b|who|present|about|profil|yomoyaha|\byeo\b|tell me|parle-moi|parle moi|resume|summary/)) {
    return `${c.bio[0]} ${c.bio[1]}\n[[open:about]]`;
  }

  if (has(/bonjour|salut|bonsoir|hello|\bhi\b|\bhey\b|coucou/)) {
    return L(
      `Bonjour ! Je suis l'assistant du portfolio de ${first}. Demandez-moi ses projets, ses compétences, sa formation ou comment le contacter.`,
      `Hello! I am the assistant for ${first}'s portfolio. Ask me about his projects, his skills, his education or how to reach him.`
    );
  }

  return L(
    `Je peux vous parler des projets de ${first}, de ses compétences, de sa formation (Licence SIGL puis Master 1 Cybersécurité & IA à l'ESATIC) ou de la façon de le contacter. Que souhaitez-vous savoir ?`,
    `I can tell you about ${first}'s projects, his skills, his education (Bachelor's in software engineering, then a Master's in Cybersecurity & AI at ESATIC) or how to reach him. What would you like to know?`
  );
}
