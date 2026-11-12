# Portfolio de Yomoyaha Yeo

Portfolio de Yomoyaha Yeo, développeur logiciel en Master 1 Cybersécurité et Intelligence Artificielle à l'ESATIC (Abidjan), présenté comme la console d'un analyste : barre latérale, vues, dossiers de projets, chronologie et flux d'activité.

**En ligne :** https://yeo-portfolio-theta.vercel.app

## Vues

| Vue | Contenu |
| --- | --- |
| Vue d'ensemble | Identité, indicateurs, dossiers récents, chronologie et activité GitHub |
| Dossiers | Un dossier par projet : besoin, réalisation, technologies, code source |
| Chronologie | Formation, projets et diplômes par année |
| Compétences | Technologies reliées aux dossiers où elles ont servi |
| Activité | Dépôts et événements publics, lus en direct depuis l'API GitHub |
| Contact | Coordonnées et formulaire (ouvre la messagerie du visiteur) |
| CV (`/cv`) | Feuille imprimable, enregistrable en PDF |

Raccourcis : `Ctrl K` ouvre la recherche (vues, dossiers, actions), `Ctrl J` ouvre la console (`help`, `ls`, `cases`, `open <dossier>`, `lang fr|en`). Le site est en français et en anglais.

## Technologies

Next.js 15 · React 19 · TypeScript · Three.js (`@react-three/fiber`, pour le globe de la vue d'ensemble) · Vercel

## Lancer le projet

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:3000.

## Modifier le contenu

Tout le contenu (présentation, dossiers, compétences, chronologie) se trouve dans un seul fichier bilingue : `src/lib/data.ts`.

Pour ajouter des captures d'écran à un dossier, placer les images dans `public/projects/` et renseigner le champ `images` du projet, par exemple `images: ["/projects/oxynova-1.png"]`.

## Déploiement

Le dépôt est relié à Vercel : chaque `git push` sur la branche `main` met le site en ligne ; les autres branches produisent une prévisualisation.

## Versions précédentes

- `yeoos-v1` : première version, en forme de système d'exploitation.
- Commit `8c5c4db` : version éditoriale sur fond clair.
