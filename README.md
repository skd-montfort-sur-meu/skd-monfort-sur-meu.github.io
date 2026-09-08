# Shotokan Karate-do Montfort-sur-Meu

Site internet du club de karaté Shotokan Karate-do Montfort-sur-Meu.

🔗 [Site en ligne](https://skd-montfort-sur-meu.github.io)

## Stack technique

| Technologie | Usage |
|---|---|
| [Astro](https://astro.build) | Framework statique |
| [Tailwind CSS v4](https://tailwindcss.com) | Styling via Vite plugin |
| [astro-icon](https://www.astroicon.dev) | Icônes (Lucide) |
| [marked](https://marked.js.org) | Rendu markdown au build |
| [Decap CMS](https://decapcms.org) | Gestion de contenu |

## Lancement local

```sh
# Installer les dépendances
npm install

# Lancer le serveur de dev
npm run dev
```

Le site est disponible sur `http://localhost:4321`.

### CMS local

Decap CMS tourne en local via un serveur dédié :

```sh
npm run cms
```

Puis accéder au panneau d'administration sur `/admin`.

## Structure du projet

```text
/
├── public/
│   ├── admin/                    # Panneau Decap CMS
│   └── images/                   # Images statiques (hero, galerie)
├── src/
│   ├── components/               # Composants Astro (12 fichiers)
│   ├── content/config/           # Données JSON éditées par le CMS
│   ├── layouts/
│   │   └── Base.astro            # Layout unique (shell HTML + Header + Footer)
│   ├── lib/
│   │   └── markdown.ts           # Helper de rendu markdown
│   ├── pages/
│   │   ├── index.astro           # Page d'accueil
│   │   ├── karate.astro          # Page karaté (histoire, katas, vocabulaire)
│   │   ├── competitions.astro    # Page compétitions
│   │   └── photos.astro          # Galerie photos
│   └── styles/
│       └── global.css            # Import Tailwind CSS
├── astro.config.mjs
└── package.json
```

## Architecture

- **Composants `.astro` purs** — Pas de framework côté client (React, Vue, Svelte). Le JS côté navigateur se limite à du vanilla JS (menu mobile, lightbox galerie).
- **Contenu JSON** — Les données du site (infos club, compétitions, karaté) vivent dans `src/content/config/*.json` et sont importées directement par les composants au build.
- **Decap CMS** — Permet d'éditer les fichiers JSON via une interface web. Configuré pour un backend GitHub (`public/admin/config.yml`).
- **Rendu markdown** — Le contenu markdown stocké dans les JSON est converti en HTML au build via `marked` + `set:html`.
- **BASE_URL** — Les liens internes utilisent `import.meta.env.BASE_URL` pour la compatibilité avec le déploiement sous GitHub Pages.

## Commandes

| Commande | Action |
|---|---|
| `npm install` | Installer les dépendances |
| `npm run dev` | Serveur de dev sur `localhost:4321` |
| `npm run build` | Build de production dans `./dist/` |
| `npm run preview` | Prévisualiser le build locally |
| `npm run cms` | Lancer Decap CMS en local |
| `npm run astro ...` | CLI Astro (`astro add`, `astro check`, etc.) |

## Déploiement

- **GitHub Pages** — Déploiement automatique via GitHub Actions (`.github/workflows/deploy.yml`)
- **Netlify** — Alternative possible via `netlify.toml`

## Prérequis

- Node.js >= 22.12.0
