# Image de fond de carte pour l'onglet "Le Cercle"

## Fichier requis

Pour afficher une carte réaliste en Dark Mode dans l'onglet "Le Cercle", vous devez placer une image de fond de carte à cet emplacement :

```
/public/map-dark-bg.png
```

## Spécifications recommandées

- **Format** : JPG ou PNG
- **Style** : Carte en mode sombre (Dark Mode)
- **Couleurs** : Tons gris foncé, bleu nuit (#1a1a2e)
- **Contenu** : Rues, parcs, cours d'eau en nuances de gris/bleu
- **Dimensions** : Minimum 1920x1080px (pour une bonne qualité sur tous les écrans)

## Sources suggérées

1. **MapBox Static API** (Dark Mode) : https://docs.mapbox.com/api/maps/static-images/
   - Style : `dark-v11` 
   - Exemple d'URL : `https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/2.3572,48.8434,15,0/800x600?access_token=YOUR_TOKEN`

2. **Google Maps Static API** (Silver/Night style)
   - Style : Night mode avec paramètres de style personnalisés

3. **Placeholder alternatif** : Si vous n'avez pas d'image, le composant utilisera automatiquement un fond uni #1a1a2e avec un overlay subtil.

## Installation rapide

1. Téléchargez une image de carte en mode sombre
2. Renommez-la en `map-dark-bg.png`
3. Placez-la dans le dossier `/public` à la racine du projet
4. Relancez l'application si nécessaire

Le composant `InteractiveMap.tsx` chargera automatiquement cette image comme fond de carte.

## Fallback

Si l'image n'existe pas, la carte affichera :
- Un fond uni #1a1a2e (bleu nuit très sombre)
- Un overlay gradient pour l'effet Helix
- Une grille subtile pour simuler des rues

Cela garantit que l'application fonctionne même sans l'image, tout en conservant un style cohérent.
