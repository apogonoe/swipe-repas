# MarmiteMatch

Trouve quoi manger ce soir **par swipe** — selon ton budget, ton temps, et ce
que tu as déjà dans le placard. PWA autonome : 87 925 recettes, moteur de
similarité composite, estimation de prix, garde-manger. Aucune donnée ne quitte
le téléphone.

Même architecture que MovieMatch (`swipe-reco`) : tout est statique, tout est
mis en cache au premier chargement, puis l'app fonctionne hors-ligne.

## Dire ce dont on a envie

Le panneau **Réglages** règle la soirée, pas des préférences permanentes :

| Réglage | Effet |
|---|---|
| **J'ai envie de…** | nomme un ingrédient ; les recettes qui l'utilisent passent devant. Ce n'est **pas** un filtre : une envie non satisfaite ne fait pas disparaître la recette, elle la fait reculer. |
| **Type de cuisine** | 16 cuisines. Déduites des tags Food.com quand ils existent, sinon du titre et des ingrédients — le corpus n'a aucun tag « Italian », les recettes italiennes étaient noyées dans « European ». |
| **Niveau** | facile / moyen / technique, **calculé** à partir du nombre d'ingrédients, du nombre d'étapes et du temps. Le tag « Easy » ne couvre que 54 % du corpus ; le calcul, lui, qualifie tout. |
| **Temps, budget, manque max** | filtres durs. |

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
| `recipes.json` | ~33 Mo | catalogue : titre, temps, parts, coût, ingrédients, cuisine, niveau |
| `steps.json` | ~53 Mo | instructions, chargées en arrière-plan (sinon un seul fichier dépasserait la limite de 100 Mo de GitHub) |
| `ingredients.json` | 0,4 Mo | ontologie : nom, catégorie, prix/kg, conservation, allergènes |
| `graph.bin` | ~20 Mo | 24 plus proches voisins + score par composante (uint8) |
| `graph_meta.json` | — | en-tête : K, N, composantes, pondération par défaut |

Régénérés par la pipeline `MARMITE`. Après remplacement, **incrémenter
`DATA_CACHE`** (`mm-data-v1` → `v2`) dans `index.html` pour invalider le cache
des clients, et `V` dans `sw.js` pour la coquille.

## Limites connues

- **92,9 % des recettes ont leurs instructions.** Le corpus principal a un champ
  `steps` corrompu ; les étapes sont reconstituées depuis RecipeNLG et
  KingName1 par appariement de titre. Les ingrédients et quantités, eux, sont
  complets partout.
- **47 % des recettes ont une cuisine identifiée.** Les autres sont surtout des
  desserts et des plats sans marqueur culturel. Une cuisine cochée ne les
  montrera pas.
- **Les ingrédients sont en français** (2 897 sur 2 897) : recherche, placard,
  liste de courses et détail des prix. **Les titres de recettes restent en
  anglais** — testés, `opus-mt-en-fr` et NLLB-600M donnent des contresens
  (« Blueberry Scones » → « Écossais de bleuets »), et mieux vaut l'anglais
  qu'un contresens. Voir le README de `MARMITE`.
- **Les prix sont des ordres de grandeur** pour un supermarché belge, pas des
  relevés. Corrigeables dans Réglages ; tes corrections sont gardées en local.
- Les photos viennent du CDN de Food.com et demandent donc le réseau. Un pack
  d'images hors-ligne, comme le `posters.pack` de MovieMatch, reste à faire.
