# YeoOS — portfolio de Yomoyaha Yeo

Un portfolio en forme de système d'exploitation : écran de démarrage, bureau, fenêtres, terminal, scènes 3D et assistant IA vocal.

**En ligne :** https://yeo-portfolio-theta.vercel.app

## Ce qu'on y trouve

- **Bureau complet** : fenêtres déplaçables, redimensionnables et aimantées aux bords, dock, menu contextuel, recherche universelle (`Ctrl + K`).
- **Terminal** : `aide`, `neofetch`, `projets`, `scan`, `matrix`, `fond bouclier`, `lang en`…
- **3D** : trois scènes générées en code (noyau, réseau de neurones, bouclier), utilisées en fond d'écran et dans l'Atelier 3D.
- **Assistant IA** : répond aux questions sur le profil, par écrit ou à la voix, et ouvre les fenêtres utiles.
- **GitHub en direct** : les dépôts publics sont chargés depuis l'API GitHub.
- **Français / anglais** : tout le contenu est bilingue.

## Technologies

Next.js 15 · React 19 · TypeScript · Three.js (`@react-three/fiber`, `drei`, `postprocessing`) · SDK Anthropic · Vercel

## Lancer le projet

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:3000.

## Déploiement

Le dépôt est relié à Vercel : chaque `git push` sur la branche `main` met le site en ligne automatiquement.

## Modifier le contenu

Tout le contenu (présentation, projets, compétences, parcours) se trouve dans un seul fichier bilingue : `src/lib/data.ts`.

## Assistant IA

Sans configuration, l'assistant fonctionne en « mode démo » avec des réponses préparées (`src/lib/assistant.ts`). Pour utiliser un vrai modèle, définir ces variables d'environnement :

| Variable | Rôle |
| --- | --- |
| `ANTHROPIC_API_KEY` | Clé d'API Anthropic (obligatoire pour activer l'IA) |
| `CHAT_MODEL` | Modèle utilisé, par exemple `claude-haiku-5-5` (facultatif) |

Ne jamais placer la clé dans le code : les fichiers `.env*` sont ignorés par git.
