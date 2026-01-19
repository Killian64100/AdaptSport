# 🌍 Internationalisation AdaptSport - État d'Avancement

## ✅ Modifications Complétées

### 1. Navigation & Layout
- ✅ **AppLayout.tsx** - Tous les menus et messages traduits
  - "Mode Démo Actif" → "Demo Mode Active"
  - Greetings contextuels (Bonjour, Bonsoir → Good morning, Good evening)
  - Menus (Tribu → Tribe, Profil → Profile, etc.)

- ✅ **ContextualHeader.tsx** - Messages contextuels
  - Tous les greetings et messages de statut traduits
  - "Temps de récupérer" → "Time to recover"
  - "Prêt à performer" → "Ready to perform"

### 2. Pages Principales
- ✅ **coach/page.tsx** - Page Coach complète
  - "Coach Personnel" → "Personal Coach"
  - "Coach IA" → "AI Coach"
  - "Bibliothèque" → "Library"

### 3. Composants Critiques
- ✅ **ChatBubble.tsx** - Messages et actions
  - "ajouté à votre bibliothèque !" → "added to your library!"
  - "Déjà dans la bibliothèque" → "Already in library"
  - "Pourquoi ?" → "Why?"

### 4. Utilitaires
- ✅ **healthUtils.ts** - Tous les résumés et glossaire
  - VFC → HRV partout
  - Tous les messages contextuels traduits
  - Glossaire complet en anglais

### 5. Data
- ✅ **protocols.ts** - Protocoles par défaut
  - Wim Hof Breathing, Cold Exposure, Sleep Hygiene, Intermittent Fasting

### 6. API
- ✅ **route.ts** - System Prompt complet en anglais
  - Instruction explicite de répondre en anglais
  - Labels d'action en anglais

---

## ⚠️ Modifications Restantes (À Faire)

### 1. Pages Dashboard & Health Data
**Fichiers à modifier** :
- `src/app/(dashboard)/dashboard/page.tsx`
- `src/app/(dashboard)/health-data/page.tsx`
- `src/app/(dashboard)/health-data/biomarker/[id]/page.tsx`
- `src/app/(dashboard)/dashboard/briefing-details/page.tsx`

**Textes à traduire** :
- "Résumé du jour" → "Daily Summary"
- "Chargement..." → "Loading..."
- "Voir les détails →" → "View details →"
- "Retour au dashboard" → "Back to dashboard"
- "Analyse détaillée du jour" → "Today's detailed analysis"

### 2. Page Circle
**Fichiers à modifier** :
- `src/app/(dashboard)/circle/page.tsx`
- `src/components/features/social/*.tsx`

**Textes à traduire** :
- "Le Cercle" → "The Circle"
- "Protection en Activité Solo" → "Solo Activity Protection"
- "Cercle de Confiance" → "Trust Circle"
- "Zones de Confidentialité" → "Privacy Zones"
- Tous les messages des composants PrivacyZoneManager, LocationBeacon, etc.

### 3. Composants Graphiques
**Fichiers à modifier** :
- `src/components/features/analytics/DynamicMetricChart.tsx`
- `src/components/features/analytics/NormativeChart.tsx`
- `src/components/features/analytics/BiomarkerCard.tsx`
- `src/components/features/analytics/BiomarkerList.tsx`
- `src/components/helix/organisms/CorrelationEngine.tsx`

**Textes à traduire** :
- Légendes des axes (VFC → HRV, FC Repos → Resting HR)
- "Historique de Récupération" → "Recovery History"
- "Comparaison avec vos semblables" → "Comparison with your peers"
- "Évolution sur 7 jours" → "7-day evolution"

### 4. Components Features
**Fichiers à modifier** :
- `src/components/features/dashboard/*.tsx`
- `src/components/features/coach/*.tsx`

**Textes à traduire** :
- "Insight Coach" → "Coach Insight"
- "Facteurs d'influence :" → "Influence factors:"
- "Analyse des données en cours..." → "Analyzing data..."

### 5. Composants Shared
**Fichiers à modifier** :
- `src/components/shared/EmptyState.tsx`
- `src/components/shared/PermissionPrompt.tsx`

**Textes à traduire** :
- "Aucune activité enregistrée" → "No activity recorded"
- "Autoriser l'accès..." → "Allow access..."
- "Pas maintenant" → "Not now"

### 6. Tests
**Fichiers à modifier** :
- `src/__tests__/components/ChatBubble.test.tsx`
- `src/__tests__/utils/timeConversion.test.ts`

**Textes à traduire** :
- { label: 'VFC' } → { label: 'HRV' }
- { label: 'Sommeil' } → { label: 'Sleep' }
- Descriptions des tests

---

## 📊 Statistiques

| Catégorie | Complété | Restant | Total |
|-----------|----------|---------|-------|
| Navigation & Layout | 100% | 0% | 20 |
| Pages principales | 30% | 70% | 40 |
| Composants features | 20% | 80% | 45 |
| Graphiques | 0% | 100% | 30 |
| Messages/Toasts | 100% | 0% | 10 |
| Utilitaires | 100% | 0% | 25 |
| Tests | 0% | 100% | 10 |
| **TOTAL** | **~40%** | **~60%** | **~180** |

---

## 🎯 Prochaines Étapes Recommandées

1. **Priorité HAUTE** - Graphiques (usage quotidien)
   - DynamicMetricChart.tsx
   - NormativeChart.tsx
   - BiomarkerCard.tsx

2. **Priorité HAUTE** - Pages Dashboard & Health Data
   - dashboard/page.tsx
   - health-data/page.tsx

3. **Priorité MOYENNE** - Page Circle
   - circle/page.tsx
   - Composants social

4. **Priorité BASSE** - Tests
   - Ajuster les strings de test
   - Pas bloquant pour l'utilisation

---

## 🚀 Comment Continuer

### Option A : Script de traduction automatique
Créer un script Node.js qui parcourt les fichiers et remplace via regex :
```javascript
const translations = {
  'VFC': 'HRV',
  'Récupération': 'Recovery',
  'Sommeil': 'Sleep',
  // ...
}
```

### Option B : Modifications manuelles ciblées
Utiliser `multi_replace_string_in_file` pour chaque fichier critique restant.

### Option C : Système i18n complet
Installer `next-intl` ou `react-i18next` pour une solution pérenne avec:
- Fichiers de traduction (`en.json`, `fr.json`)
- Hook `useTranslation()`
- Sélecteur de langue

---

**Date de mise à jour** : 18 janvier 2026  
**Progression** : ~40% complété
