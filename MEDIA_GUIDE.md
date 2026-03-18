# Guide d'ajout de contenu média

## 📋 Structure des données

Les contenus média sont centralisés dans une balise `<script type="application/json">` dans la section vidéos (ligne ~10950 dans `index.html`).

### Format d'un élément média

```json
{
  "id": 1,
  "type": "video",
  "title": "Titre du contenu",
  "description": "Description courte (une ou deux phrases)",
  "youtubeId": "KBSxtAphpEA",
  "category": "Fondamentaux",
  "order": 1,
  "date": "2026-03-15"
}
```

### Champs disponibles

| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `id` | number | ✅ | ID unique du contenu |
| `type` | string | ✅ | Type: `video`, `podcast`, ou `editorial` |
| `title` | string | ✅ | Titre du contenu |
| `description` | string | ✅ | Description courte (max 150 caractères recommandé) |
| `youtubeId` | string | ❌ | ID YouTube (requis si type = video) |
| `podcastUrl` | string | ❌ | URL d'embed podcast (requis si type = podcast) |
| `category` | string | ✅ | Catégorie: Fondamentaux, Tips, Témoignages, etc. |
| `order` | number | ✅ | Ordre d'affichage (1, 2, 3...) |
| `date` | string | ✅ | Date de publication (format YYYY-MM-DD) |

---

## 🎬 Ajouter une vidéo YouTube

### Étape 1: Récupérer l'ID YouTube

Pour une URL: `https://youtu.be/KBSxtAphpEA`
L'ID YouTube est: `KBSxtAphpEA`

### Étape 2: Ajouter l'objet dans le JSON

Dans `index.html`, à la ligne ~10950, trouvez la balise `<script type="application/json" id="mediaContentData">`.

Ajoutez un nouvel objet au tableau `"content"`:

```json
{
  "id": 2,
  "type": "video",
  "title": "Comment financer votre projet de santé",
  "description": "Les meilleures sources de financement pour les projets de santé et comment les approcher.",
  "youtubeId": "NOUVEAUID123",
  "category": "Financement",
  "order": 2,
  "date": "2026-03-20"
}
```

**N'oubliez pas la virgule** après chaque objet (sauf le dernier).

---

## 🎙️ Ajouter un podcast

### Format pour un podcast

```json
{
  "id": 3,
  "type": "podcast",
  "title": "Titre du podcast",
  "description": "Courte description du podcast",
  "podcastUrl": "https://open.spotify.com/embed/episode/...",
  "category": "Témoignages",
  "order": 3,
  "date": "2026-03-20"
}
```

**Note**: L'URL d'embed dépend de la plateforme (Spotify, Apple Podcasts, Anchor, etc.). Consultez la documentation de la plateforme pour obtenir l'URL d'embed correcte.

---

## 📄 Ajouter un contenu éditorial / bonus

```json
{
  "id": 4,
  "type": "editorial",
  "title": "Guide: Choisir la bonne structure juridique",
  "description": "Checklist complète pour sélectionner votre statut juridique.",
  "category": "Guides",
  "order": 4,
  "date": "2026-03-20"
}
```

---

## 🎨 Catégories recommandées

- **Fondamentaux** - Concepts clés de l'entrepreneuriat santé
- **Tips** - Conseils et astuces pratiques
- **Financement** - Levée de fonds et financement
- **Juridique** - Structuration juridique et conformité
- **Marketing** - Stratégie commerciale et communication
- **Témoignages** - Retours d'expérience d'entrepreneurs
- **Guides** - Ressources détaillées et checklists

---

## 🔄 Comment l'ordre d'affichage fonctionne

- Les contenus sont affichés par **ordre croissant** du champ `order`
- Les contenus avec le même `order` gardent l'ordre d'apparition dans le JSON
- Recommandation: numérotez par 10 (10, 20, 30...) pour laisser de la place pour des insertions futures

---

## ✅ Checklist avant de publier

- [ ] Tous les champs requis sont remplis
- [ ] L'ID YouTube est correct (testé dans la barre d'adresse)
- [ ] La description est claire et concise
- [ ] Le JSON est valide (pas d'erreur de syntaxe)
- [ ] Une virgule sépare chaque objet (sauf le dernier)
- [ ] L'ordre d'affichage est correct
- [ ] La date est au format YYYY-MM-DD

---

## 📝 Exemple de JSON complet

```json
{
  "content": [
    {
      "id": 1,
      "type": "video",
      "title": "Entrepreneuriat en santé : les défis incontournables",
      "description": "Découvrez les 3 pilliers fondamentaux de l'entrepreneuriat en santé et comment les maîtriser.",
      "youtubeId": "KBSxtAphpEA",
      "category": "Fondamentaux",
      "order": 1,
      "date": "2026-03-15"
    },
    {
      "id": 2,
      "type": "video",
      "title": "Financer votre projet: sources et stratégie",
      "description": "Les meilleures sources de financement et comment les approcher efficacement.",
      "youtubeId": "abc123def456",
      "category": "Financement",
      "order": 2,
      "date": "2026-03-20"
    },
    {
      "id": 3,
      "type": "podcast",
      "title": "Podcast: Témoignage d'une fondatrice de startup santé",
      "description": "Interview avec une entrepreneur qui a lancé une startup med-tech.",
      "podcastUrl": "https://open.spotify.com/embed/episode/...",
      "category": "Témoignages",
      "order": 3,
      "date": "2026-03-22"
    }
  ]
}
```

---

## 🐛 Dépannage

### Les contenus n'apparaissent pas?
1. Vérifiez que le JSON est valide (utilisez jsonlint.com)
2. Vérifiez que l'ID YouTube est correct
3. Vérifiez que tous les champs requis sont remplis
4. Vérifiez les virgules entre les objets

### La vidéo ne s'affiche pas dans le modal?
1. L'ID YouTube peut être incorrect
2. La vidéo peut être privée ou supprimée
3. Testez l'URL directement: `https://youtu.be/[ID]`

---

## 📞 Besoin d'aide?

Pour ajouter d'autres types de contenu (vidéos Vimeo, soundcloud, etc.), consultez le code JavaScript dans `js/app.js` fonction `openMediaModal()`.
