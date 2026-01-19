# Spécifications & Exigences - AdaptSport

## Vue d'ensemble
Application de bio-hacking et optimisation de performance basée sur des données biométriques en temps réel.

---

## 1. Exigences Fonctionnelles

### 1.1 Gestion des Données Biométriques
**US-001**: En tant qu'utilisateur, je veux visualiser mes métriques de santé actuelles pour comprendre mon état physiologique.

**Critères d'acceptation**:
- ✅ Affichage de la récupération (%) avec indicateur visuel
- ✅ Affichage de la VFC (ms) avec tendance
- ✅ Affichage du sommeil au format horaire (ex: 7h30)
- ✅ Affichage de la FC au repos (bpm)
- ✅ Affichage du SpO2 (%)
- ✅ Données chargées depuis le store Zustand

**US-002**: En tant qu'utilisateur, je veux voir l'historique de mes métriques sur 7 jours pour identifier les tendances.

**Critères d'acceptation**:
- ✅ Graphiques de tendance avec Recharts (LineChart, AreaChart)
- ✅ Conversion automatique du sommeil (string "7h30" → decimal 7.5 pour calculs)
- ✅ Affichage des valeurs en format lisible (7.5 → "7h30" pour sommeil)
- ✅ Comparaison avec cohorte démographique (âge, sexe, niveau d'activité)

### 1.2 Coach IA Conversationnel
**US-003**: En tant qu'utilisateur, je veux discuter avec un coach IA pour obtenir des conseils personnalisés.

**Critères d'acceptation**:
- ✅ Intégration OpenRouter API (modèle Llama 3.3 70B Instruct)
- ✅ System prompt avec analyse de tendance historique
- ✅ Fallback local en cas d'erreur API
- ✅ Formatage des messages avec mise en forme (gras, puces)
- ✅ Génération de résumé simplifié pour utilisateurs non-techniques

**US-004**: En tant qu'utilisateur, je veux ajouter des protocoles depuis le chat pour construire ma bibliothèque.

**Critères d'acceptation**:
- ✅ Boutons d'action dans les messages du coach
- ✅ Support des protocolId (protocoles existants) ET protocolData (protocoles custom)
- ✅ Toast de confirmation après ajout
- ✅ Persistance dans localStorage via Zustand

### 1.3 Bibliothèque de Protocoles
**US-005**: En tant qu'utilisateur, je veux parcourir et filtrer ma bibliothèque de protocoles.

**Critères d'acceptation**:
- ✅ Navigation via onglets (Chat / Bibliothèque)
- ✅ Filtres par catégorie (max 5: Respiration, Froid, Sommeil, Nutrition, Autre)
- ✅ Cartes de protocoles avec nom, catégorie, bénéfices
- ✅ Vue détaillée avec étapes et timer (si durationSeconds > 0)

**US-006**: En tant qu'utilisateur, je veux exécuter un protocole avec un timer intégré.

**Critères d'acceptation**:
- ✅ Timer circulaire avec compte à rebours
- ✅ Boutons Play/Pause/Reset
- ✅ Affichage conditionnel (icône si pas de durée)
- ✅ Retour à la bibliothèque après exécution

---

## 2. Exigences Non-Fonctionnelles

### 2.1 Performance
- **PERF-001**: Temps de chargement initial < 3s (Next.js Turbopack ✅)
- **PERF-002**: Réponse API chat < 2s (avec fallback si > 5s)
- **PERF-003**: Animations fluides à 60 FPS (Framer Motion ✅)

### 2.2 Compatibilité
- **COMP-001**: Support navigateurs modernes (Chrome, Firefox, Safari, Edge)
- **COMP-002**: Responsive design (mobile, tablette, desktop)
- **COMP-003**: TypeScript strict mode pour type safety

### 2.3 Sécurité
- **SEC-001**: Clés API stockées dans .env.local (jamais commités)
- **SEC-002**: Validation des données utilisateur côté serveur
- **SEC-003**: Sanitization des inputs pour éviter XSS

### 2.4 Accessibilité
- **A11Y-001**: Contraste texte/fond conforme WCAG AA
- **A11Y-002**: Navigation clavier complète
- **A11Y-003**: Labels ARIA sur composants interactifs

### 2.5 Maintenabilité
- **MAIN-001**: Architecture Helix (atoms, molecules, organisms)
- **MAIN-002**: Composants réutilisables avec interfaces TypeScript
- **MAIN-003**: Séparation logique (hooks, utils, store, components)
- **MAIN-004**: Documentation inline pour fonctions complexes

---

## 3. Règles Métier

### 3.1 Format des Données
- **BUS-001**: Sommeil stocké en format horaire ("7h30") dans mock data
- **BUS-002**: Conversion automatique sommeil → decimal pour calculs mathématiques
- **BUS-003**: Reconversion decimal → horaire pour affichage utilisateur
- **BUS-004**: Récupération exprimée en % (0-100)
- **BUS-005**: VFC exprimée en ms (millisecondes)

### 3.2 Logique de Comparaison
- **BUS-006**: Percentile calculé via fonction CDF (Cumulative Distribution Function)
- **BUS-007**: VFC, Sommeil, Récupération: valeur haute = meilleur percentile
- **BUS-008**: FC Repos: valeur basse = meilleur percentile (inversé)

### 3.3 Catégorisation Protocoles
- **BUS-009**: 7 catégories: breathing, cold, sleep, nutrition, activity, mobility, stretching
- **BUS-010**: Filtrage visuel limité à 5 catégories max pour UX
- **BUS-011**: Protocoles custom générés avec ID unique (timestamp)

---

## 4. Modèle de Données

### 4.1 Biomarker
```typescript
interface Biomarker {
  id: string
  name: string
  value: number // decimal pour calculs
  unit: string
  trend: 'up' | 'down' | 'stable'
  change: number
  history: number[]
}
```

### 4.2 Protocol
```typescript
interface Protocol {
  id: string
  name: string
  category: 'breathing' | 'cold' | 'sleep' | 'nutrition' | 'activity' | 'mobility' | 'stretching'
  description: string
  benefits: string[]
  steps: string[]
  durationSeconds?: number
  difficulty?: 'easy' | 'medium' | 'hard'
}
```

### 4.3 HealthData (Mock)
```typescript
interface HealthData {
  profile: {
    name: string
    age: number
    sport: string
    gender: 'male' | 'female'
    activity_level: 'sedentary' | 'moderate' | 'active'
  }
  today: {
    recovery: number
    strain: number
    hrv: number
    rhr: number
    sleep: string // "7h30"
    spo2: number
    calories: number
  }
  history: Array<{
    date: string
    recovery: number
    hrv: number
    sleep: string
    // ...
  }>
}
```

---

## 5. Critères de Qualité

### 5.1 Tests
- **TEST-001**: Couverture code > 70% pour composants critiques
- **TEST-002**: Tests unitaires pour hooks (useContextMode, useGeofence)
- **TEST-003**: Tests composants pour BiomarkerCard, ChatBubble, ProtocolTimer
- **TEST-004**: Tests sécurité pour privacyZones

### 5.2 Code Quality
- **QUAL-001**: ESLint sans erreurs (Next.js config strict)
- **QUAL-002**: TypeScript sans any (sauf exceptions documentées)
- **QUAL-003**: Prettier pour formatage uniforme
- **QUAL-004**: Commits conventionnels (feat:, fix:, docs:)

### 5.3 Documentation
- **DOC-001**: README avec guide de démarrage
- **DOC-002**: ARCHITECTURE.md décrivant structure projet
- **DOC-003**: Commentaires pour logique complexe (ex: conversion temps)
- **DOC-004**: CHANGELOG pour suivi des versions

---

## 6. Contraintes Techniques

### 6.1 Stack Obligatoire
- Next.js 16.1.2 (App Router)
- React 19.2.3
- TypeScript 5
- Zustand 5 (state management)
- Recharts 3 (visualisation)
- Framer Motion 12 (animations)
- Tailwind CSS 3.4 (styling)

### 6.2 API Externes
- OpenRouter (modèles LLM)
- Tavily (recherche scientifique)

### 6.3 Limitations Connues
- Rate limit OpenRouter free tier: 50 requêtes/jour
- Fallback local si API indisponible
- Mock data pour démo (pas de backend réel actuellement)

---

## 7. Roadmap & Évolutions Futures

### Phase 1 (Actuel) ✅
- Dashboard biométrique
- Coach conversationnel
- Bibliothèque protocoles
- Graphiques comparatifs

### Phase 2 (À venir)
- Authentification utilisateurs
- Backend API persistant
- Intégration wearables (Whoop, Oura, Apple Watch)
- Notifications push

### Phase 3 (Long terme)
- Social features (Circle)
- Challenges communautaires
- Marketplace protocoles
- Export PDF rapports santé

---

**Date de dernière mise à jour**: 18 janvier 2026  
**Version**: 1.0.0  
**Auteurs**: Équipe AdaptSport
