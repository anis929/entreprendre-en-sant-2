# Entreprendre en Santé

Le média et le parcours d'accompagnement des professionnels de santé qui veulent
entreprendre : un parcours en 8 étapes, des agents IA spécialisés et un
accompagnement humain.

Site en production : [hackyourcare-media.com](https://hackyourcare-media.com)

## Stack

Site statique, sans build ni dépendance runtime.

| Couche | Technologie |
|---|---|
| Structure | HTML5 — application mono-page, navigation côté client |
| Styles | CSS3 natif (variables CSS, grid, flexbox) — aucun framework |
| Comportement | JavaScript ES5+ vanilla, encapsulé dans une IIFE |
| Persistance | `localStorage` (notes, marque-pages, progression, dernière page vue) |
| Hébergement | Vercel (déploiement statique) |

Aucun bundler, aucun `node_modules`, aucune étape de compilation : les fichiers
servis sont les fichiers versionnés.

## Structure du projet

```
.
├── index.html        Application principale : toutes les pages du site
├── calculators.html  Calculateurs autonomes (burn rate, cap table, valorisation)
├── css/
│   └── styles.css    Feuille de styles unique
├── js/
│   └── app.js        Navigation, recherche, notes, marque-pages, calculateurs
└── MEDIA_GUIDE.md    Procédure d'ajout de contenu média (vidéos, podcasts)
```

### Pages

Toutes les pages vivent dans `index.html` sous forme de `<div class="page">` et
sont affichées une à la fois par `showPage()`.

| Clé de navigation | Conteneur | Contenu |
|---|---|---|
| `home` | `#homePage` | Page d'accueil — piliers, parcours, offres |
| `how` | `#howPage` | Comment ça marche |
| `pricing` | `#pricingPage` | Grille tarifaire |
| `aiAgents` | `#aiAgents` | Les 7 agents IA spécialisés |
| `aiComparison` | `#aiComparison` | Comparatif des outils d'IA du marché |
| `videos` | `#videos` | Vidéos bonus et contenus média |
| `part1` … `part8` | `#part1Page` … `#part8Page` | Les 8 étapes du parcours |
| `ideaFinder`, `marketStudy`, `competitionAnalysis`, `valueProposition` | `#…Page` | Outils de la partie 1 |

La table de correspondance fait autorité : `PAGE_MAP` dans `js/app.js`.

## Installation locale

Le site n'ayant pas de build, il suffit de servir le dossier sur un serveur HTTP
statique (l'ouvrir en `file://` casse le chargement des ressources).

```bash
git clone git@github.com:anis929/entreprendre-en-sant-2.git
cd entreprendre-en-sant-2

# Python
python3 -m http.server 8000

# ou Node
npx serve .
```

Puis ouvrir <http://localhost:8000>.

Pour reproduire l'environnement Vercel en local :

```bash
npx vercel dev
```

## Déploiement

Le déploiement est piloté par Vercel, branché sur le dépôt GitHub :

- un push sur `main` déclenche un déploiement en production ;
- toute autre branche ou pull request produit une *preview deployment* avec sa
  propre URL.

Vercel sert la racine du dépôt telle quelle : aucune commande de build ni
répertoire de sortie à configurer.

Les variables d'environnement (le cas échéant) se déclarent dans
Vercel → Settings → Environment Variables. Elles ne doivent jamais être
committées : `.env` et `.env.local` sont ignorés par Git.

## Conventions

- **Charte graphique** — vert `#00E7A0`, bleu marine `#0D2549`, turquoise
  `#3CE2C4`, fond noir. Les couleurs s'utilisent via les variables CSS
  déclarées dans le `:root` de `css/styles.css`, jamais en dur.
- **Styles** — pas de style inline pour du nouveau code : ajouter une classe
  dans `css/styles.css`.
- **JavaScript** — pas de `onclick` en HTML. Les interactions passent par les
  attributs `data-action` / `data-page`, câblés par délégation d'événements
  dans `js/app.js`.
- **Contenu média** — ne pas éditer le HTML de la grille vidéos à la main :
  suivre `MEDIA_GUIDE.md`, qui décrit le registre JSON centralisé.

## Contribuer

1. Créer une branche depuis `main`.
2. Vérifier le rendu en local (desktop et mobile) avant d'ouvrir la PR.
3. Contrôler la preview Vercel générée automatiquement sur la PR.
4. Merger dans `main` une fois la preview validée.
