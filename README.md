# MarmiteMatch

Trouve quoi manger ce soir **par swipe** — selon ton budget, ton temps, et ce
que tu as déjà dans le placard. PWA autonome : 87 925 recettes, moteur de
similarité composite, estimation de prix, garde-manger. Aucune donnée ne quitte
le téléphone.

Même architecture que MovieMatch (`swipe-reco`) : tout est statique, tout est
mis en cache au premier chargement, puis l'app fonctionne hors-ligne.

## Ce qui la distingue d'une app de recettes

- **Le prix par personne est sur la carte**, pas caché dans un sous-menu.
  Chaque ingrédient est résolu vers une ontologie canonique, converti en
  grammes, puis valorisé. Un `~` signale une estimation.
- **Le placard pilote les suggestions.** Une recette dont tu as déjà tous les
  ingrédients remonte. « J'ai cuisiné ça » décompte les quantités utilisées.
- **Ce qui va se perdre remonte aussi.** Renseigne une date de péremption et
  les recettes qui consomment cet ingrédient passent devant.
- **Les curseurs de pondération agissent en direct.** Le graphe stocke le score
  de chaque composante séparément, donc changer l'importance des ingrédients ou
  du budget ne demande aucun recalcul.

## Déployer sur GitHub Pages

1. Créer un repo GitHub public, par exemple `swipe-repas`.
2. Pousser ce dossier dessus.
3. **Settings → Pages → Source : Deploy from a branch → main / (root)**.
4. En ligne sur `https://<pseudo>.github.io/swipe-repas/` après ~1 min.

> ⚠️ Comme pour MovieMatch : **ne pas migrer les gros fichiers vers Git LFS**.
> GitHub Pages ne sert pas les objets LFS — il renverrait un fichier pointeur
> de 130 octets et l'app planterait au chargement. Sous 100 Mo par fichier,
> le push direct passe très bien.

## Installer sur un téléphone

Ouvrir l'URL dans Chrome, attendre la fin du chargement, puis
menu ⋮ → **Ajouter à l'écran d'accueil**.

## Commandes

| Geste | Effet |
|---|---|
| Glisser à droite / ♥ / → | ça me tente |
| Glisser à gauche / ✕ / ← | non merci |
| 🔎 / ↑ / espace | ouvrir la fiche |
| Échap | fermer la fiche |

## Fichiers de données

| Fichier | Taille | Contenu |
|---|---|---|
| `recipes.json` | ~43 Mo | catalogue : titre, temps, parts, coût, ingrédients, étapes |
| `ingredients.json` | 0,4 Mo | ontologie : nom, catégorie, prix/kg, conservation, allergènes |
| `graph.bin` | ~20 Mo | 24 plus proches voisins + score par composante (uint8) |
| `graph_meta.json` | — | en-tête : K, N, composantes, pondération par défaut |

Régénérés par la pipeline `MARMITE`. Après remplacement, **incrémenter
`DATA_CACHE`** (`mm-data-v1` → `v2`) dans `index.html` pour invalider le cache
des clients, et `V` dans `sw.js` pour la coquille.

## Limites connues

- **31,5 % des recettes ont leurs instructions.** Le corpus principal a un champ
  `steps` corrompu ; les étapes viennent d'un second jeu de données qui ne
  couvre qu'une partie du catalogue. Les ingrédients et quantités, eux, sont
  complets partout. Voir le README de `MARMITE` pour la marche à suivre.
- **Les recettes sont en anglais.** La traduction française est prévue mais
  n'est pas encore passée.
- **Les prix sont des ordres de grandeur** pour un supermarché belge, pas des
  relevés. Corrigeables dans Réglages ; tes corrections sont gardées en local.
- Les photos viennent du CDN de Food.com et demandent donc le réseau. Un pack
  d'images hors-ligne, comme le `posters.pack` de MovieMatch, reste à faire.
