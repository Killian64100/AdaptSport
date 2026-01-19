# Système de Bibliothèque de Protocoles

## 📝 Vue d'ensemble

Ce système permet au Coach IA de recommander des exercices/protocoles qui peuvent être **ajoutés dynamiquement** à la bibliothèque de l'utilisateur via un bouton dans le chat.

## 🗂️ Architecture

### 1. **Données centralisées** (`src/data/protocols.ts`)

Tous les protocoles sont définis dans un seul fichier avec :
- ID unique
- Nom, description, catégorie
- Durée (format texte + secondes)
- **Étapes détaillées** (steps)
- **Bénéfices** (benefits)
- **Références scientifiques** (references)
- Progression (completed/total)

```typescript
export interface Protocol {
  id: string
  name: string
  category: 'breathing' | 'cold' | 'sleep' | 'nutrition'
  duration: string
  durationSeconds: number
  description: string
  completed: number
  total: number
  steps: string[]
  benefits: string[]
  references: string[]
}
```

### 2. **Store Zustand** (`src/store/useProtocolStore.ts`)

Gère la bibliothèque personnelle de l'utilisateur avec :
- `userProtocols`: Liste des protocoles ajoutés
- `addProtocol()`: Ajouter un protocole (commence à 0% progression)
- `removeProtocol()`: Retirer un protocole
- `updateProgress()`: Mettre à jour la progression
- `hasProtocol()`: Vérifier si déjà ajouté

**Persistance** : localStorage via `zustand/middleware/persist`

### 3. **Page de détails** (`src/app/(dashboard)/coach/library/[id]/page.tsx`)

Affiche les détails complets d'un protocole :
- ✅ **AVANT** : Données hardcodées Wim Hof pour tous les IDs
- ✅ **APRÈS** : Lookup dynamique avec `getProtocolById(id)`
- Affiche steps, benefits, references spécifiques à chaque exercice

### 4. **ChatBubble étendu** (`src/components/helix/molecules/ChatBubble.tsx`)

Interface Message étendue avec :
```typescript
interface Message {
  // ... propriétés existantes
  action?: {
    type: 'add-protocol'
    protocolId: string
    label: string
  }
}
```

Nouveau bouton d'action :
- Affiche "Ajouter à la bibliothèque" si pas encore ajouté
- Affiche "Déjà dans la bibliothèque" (désactivé) si déjà ajouté
- Utilise `useProtocolStore()` pour ajouter
- Utilise `useFeedback()` pour notification de succès

### 5. **ProtocolLibrary** (`src/components/features/coach/ProtocolLibrary.tsx`)

Liste des protocoles de l'utilisateur :
- ✅ **AVANT** : Données statiques hardcodées
- ✅ **APRÈS** : Lit depuis `useProtocolStore()`
- **Fallback** : Affiche tous les protocoles par défaut si bibliothèque vide
- Mapping des icônes : Wind, Snowflake, Moon, ForkKnife

## 🚀 Utilisation

### Comment le Coach peut proposer un exercice

Dans `AIChat.tsx`, créer un message avec action :

```typescript
const aiResponse: Message = {
  id: Date.now().toString(),
  role: 'assistant',
  content: "Votre VFC est basse. Je recommande la **respiration Wim Hof**.",
  confidence: 85,
  timestamp: new Date(),
  action: {
    type: 'add-protocol',
    protocolId: 'wim-hof', // ID du protocole dans protocols.ts
    label: 'Ajouter à la bibliothèque',
  },
}
```

### Suggestions prédéfinies

Dans `AIChat.tsx`, des suggestions sont disponibles :

```typescript
const protocolSuggestions = {
  lowRecovery: { protocolId: 'sleep-hygiene', ... },
  highStress: { protocolId: 'wim-hof', ... },
  recovery: { protocolId: 'cold-exposure', ... },
  metabolic: { protocolId: 'fasting', ... },
}
```

### Intégrer dans l'API route

Dans `src/app/api/chat/route.ts`, détecter les intentions et retourner un message avec action :

```typescript
// Exemple : détection d'intention "stress"
if (message.toLowerCase().includes('stress')) {
  return NextResponse.json({
    response: "Je détecte du stress. La respiration Wim Hof peut vous aider.",
    confidence: 90,
    action: {
      type: 'add-protocol',
      protocolId: 'wim-hof',
      label: 'Ajouter à la bibliothèque',
    },
  })
}
```

## 📊 Flux complet

1. **Utilisateur pose une question** → "Comment réduire mon stress ?"
2. **Coach analyse** → Détecte intention "stress"
3. **Coach répond avec action** → Message + bouton "Ajouter à la bibliothèque"
4. **Utilisateur clique** → Protocole ajouté au store Zustand
5. **Feedback** → Toast "Respiration Wim Hof ajouté à votre bibliothèque !"
6. **Protocole visible** → Apparaît dans onglet Bibliothèque
7. **Détails accessibles** → Clic sur carte → Affiche steps/benefits/references

## 🔧 Ajouter un nouveau protocole

1. Ajouter dans `src/data/protocols.ts` :
```typescript
{
  id: 'meditation',
  name: 'Méditation guidée',
  category: 'sleep',
  duration: '15 min',
  durationSeconds: 900,
  description: 'Méditation pour calmer le mental',
  completed: 0,
  total: 10,
  steps: ['Asseyez-vous confortablement', 'Fermez les yeux', ...],
  benefits: ['Réduction du stress', 'Meilleure concentration', ...],
  references: ['Tang YY. et al. (2015) - Nature Reviews', ...],
}
```

2. Le protocole sera automatiquement disponible pour :
   - Ajout via le chat (si le Coach le suggère)
   - Affichage dans la bibliothèque
   - Page de détails avec toutes les infos

## 🐛 Bugs résolus

### ✅ Bug 1 : Tous les exercices affichaient Wim Hof
**Cause** : `[id]/page.tsx` avait un objet protocol hardcodé qui ignorait le paramètre `id`
**Solution** : Utilisation de `getProtocolById(id)` pour lookup dynamique

### ✅ Bug 2 : Données dupliquées
**Cause** : Protocoles définis dans ProtocolLibrary.tsx ET page.tsx séparément
**Solution** : Source unique de vérité dans `src/data/protocols.ts`

## 📦 Dépendances

- `zustand` : State management avec persistance localStorage
- `framer-motion` : Animations du bouton d'action
- `@phosphor-icons/react` : Icône Plus pour le bouton

## 🔮 Évolutions possibles

1. **Progression automatique** : Tracker automatiquement les sessions terminées
2. **Rappels** : Notifications pour faire les exercices
3. **Statistiques** : Graphiques de progression par catégorie
4. **Partage** : Partager sa bibliothèque avec le cercle
5. **API externe** : Synchroniser avec Apple Health / Google Fit
6. **Personnalisation** : Créer ses propres protocoles custom
7. **IA avancée** : Coach suggère protocoles basé sur contexte temps réel

## 🎯 Mots-clés SEO

Protocol Library, Exercise Database, Dynamic Content, Zustand Store, Coach AI Integration, Health Protocols, Wim Hof, Cold Exposure, Sleep Hygiene, Intermittent Fasting, Action Buttons, Chat Actions, Progressive Enhancement, localStorage Persistence
