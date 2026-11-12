# Portfolio de Yomoyaha Yeo

Portfolio de Yomoyaha Yeo, développeur logiciel en Master 1 Cybersécurité et Intelligence Artificielle à l'ESATIC (Abidjan).

**En ligne :** https://yeo-portfolio-theta.vercel.app

## Contenu

- Projets présentés en études de cas : contexte, rôle, besoin, réalisation, technologies.
- Parcours, compétences et contact.
- Dépôts GitHub publics, chargés en direct depuis l'API GitHub.
- Page CV (`/cv`), enregistrable en PDF depuis le navigateur.
- Version française et anglaise.

## Technologies

Next.js 15 · React 19 · TypeScript · Three.js (`@react-three/fiber`) · Vercel

## Lancer le projet

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:3000.

## Modifier le contenu

Tout le contenu (présentation, projets, compétences, parcours) se trouve dans un seul fichier bilingue : `src/lib/data.ts`.

Pour ajouter une capture d'écran à un projet, placer l'image dans `public/projects/` et renseigner le champ `image` du projet (par exemple `image: "/projects/oxynova.png"`).

## Déploiement

Le dépôt est relié à Vercel : chaque `git push` sur la branche `main` met le site en ligne automatiquement.

## Ancienne version

La première version, en forme de système d'exploitation, est conservée dans la branche `yeoos-v1`.
