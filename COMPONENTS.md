# 📊 AdaptSport - Components Inventory

## Status Legend
- ✅ Complété et fonctionnel
- 🚧 En cours
- 📋 À faire

---

## UI Components (Atomiques)

| Composant | Status | Fichier | Description |
|-----------|--------|---------|-------------|
| BioGauge | ✅ | `components/ui/BioGauge.tsx` | Jauge circulaire Stress/Recovery héroïque |
| SmartCard | ✅ | `components/ui/SmartCard.tsx` | Carte insight IA expandable avec "Pourquoi?" |
| MetricChip | ✅ | `components/ui/MetricChip.tsx` | Chip pour afficher une métrique bio |
| ConfidencePill | ✅ | `components/ui/ConfidencePill.tsx` | Capsule indicateur confiance IA |
| Button | 📋 | `components/ui/Button.tsx` | Bouton réutilisable |
| Input | 📋 | `components/ui/Input.tsx` | Champ saisie |
| Dialog | 📋 | `components/ui/Dialog.tsx` | Modal/dialog |
| Slider | 📋 | `components/ui/Slider.tsx` | Slider pour data scrubbing |
| Tabs | 📋 | `components/ui/Tabs.tsx` | Navigation onglets |
| Select | 📋 | `components/ui/Select.tsx` | Dropdown |

---

## Layout Components

| Composant | Status | Fichier | Description |
|-----------|--------|---------|-------------|
| AppLayout | ✅ | `components/layout/AppLayout.tsx` | Layout principal adaptatif |
| Header | 🚧 | `components/layout/Header.tsx` | Header avec greeting IA (intégré dans AppLayout) |
| Footer | 🚧 | `components/layout/Footer.tsx` | Footer avec nav (intégré dans AppLayout) |
| Sidebar | 📋 | `components/layout/Sidebar.tsx` | Navigation latérale (mobile-friendly) |
| BottomNav | 📋 | `components/layout/BottomNav.tsx` | Navigation bottom (mobile) |

---

## Feature Components (Dashboard)

| Composant | Status | Fichier | Description |
|-----------|--------|---------|-------------|
| DashboardHero | 📋 | `components/dashboard/DashboardHero.tsx` | Section héro avec BioGauge |
| InsightsSection | 📋 | `components/dashboard/InsightsSection.tsx` | Cartes insights IA |
| QuickActions | 📋 | `components/dashboard/QuickActions.tsx` | Boutons d'actions rapides |
| DailyBriefing | 📋 | `components/dashboard/DailyBriefing.tsx` | Résumé texte généré LLM |
| StatsCard | 📋 | `components/dashboard/StatsCard.tsx` | Petits stats (sleep, HR, etc) |

---

## Biomarkers Components

| Composant | Status | Fichier | Description |
|-----------|--------|---------|-------------|
| BiomarkerExplorer | 📋 | `components/biomarkers/BiomarkerExplorer.tsx` | Liste biomarqueurs avec détails |
| BiomarkerChart | 📋 | `components/biomarkers/BiomarkerChart.tsx` | Graphique Recharts pour métrique |
| CorrelationEngine | 📋 | `components/biomarkers/CorrelationEngine.tsx` | Superposer 2 courbes |
| HRVBaseline | 📋 | `components/biomarkers/HRVBaseline.tsx` | Visualiser VFC vs baseline |
| NormativeBenchmark | 📋 | `components/biomarkers/NormativeBenchmark.tsx` | Courbe de distribution cohorte |

---

## AI Components

| Composant | Status | Fichier | Description |
|-----------|--------|---------|-------------|
| AIThinkingState | 📋 | `components/ai/AIThinkingState.tsx` | Animation "réflexion" IA |
| InsightAttributor | 📋 | `components/ai/InsightAttributor.tsx` | Breakdown facteurs & impact |
| CoachChat | 📋 | `components/ai/CoachChat.tsx` | Interface chat conversationnel |
| ProtocolLibrary | 📋 | `components/ai/ProtocolLibrary.tsx` | Bibliotèque protocoles guidés |
| ContextualRecommendations | 📋 | `components/ai/ContextualRecommendations.tsx` | Recommandations basées contexte |

---

## Pages/Écrans

| Page | Status | Chemin | Description |
|------|--------|--------|-------------|
| Home | ✅ | `app/page.tsx` | Page d'accueil avec showcase |
| Le Pouls (Dashboard) | 📋 | `app/(main)/pulse/page.tsx` | Dashboard principal |
| Intelligence (Analytics) | 📋 | `app/(main)/intelligence/page.tsx` | Analytique biomarqueurs |
| Protocole (Coaching) | 📋 | `app/(main)/protocol/page.tsx` | Coach IA & recommandations |
| Tribu (Social) | 📋 | `app/(main)/tribe/page.tsx` | Communauté & challenges |
| Profil & Système | 📋 | `app/(main)/system/page.tsx` | Settings & intégrations |

---

## Custom Hooks

| Hook | Status | Fichier | Description |
|------|--------|---------|-------------|
| useTimeContext | ✅ | `lib/hooks/index.ts` | Déterminer contexte temporel (morning/active/evening) |
| useMovementDetection | ✅ | `lib/hooks/index.ts` | Détecter si utilisateur en mouvement |
| useUIContext | ✅ | `lib/hooks/index.ts` | Combiner tous les contextes UI |
| usePermissionRequest | ✅ | `lib/hooks/index.ts` | JIT permission manager |
| useContextualColors | ✅ | `lib/hooks/index.ts` | Couleurs adaptées au contexte |
| useBiomarkers | 📋 | `lib/hooks/useBiomarkers.ts` | Fetch & cache biomarqueurs |
| useAIInsights | 📋 | `lib/hooks/useAIInsights.ts` | Fetch insights générés IA |
| useUserProfile | 📋 | `lib/hooks/useUserProfile.ts` | Profil utilisateur & prefs |
| useHRVBaseline | 📋 | `lib/hooks/useHRVBaseline.ts` | Calculer baseline HRV personnel |

---

## State Management (Zustand Stores - TODO)

| Store | Status | Fichier | Description |
|-------|--------|---------|-------------|
| biomarkersStore | 📋 | `lib/store/biomarks.ts` | État biomarqueurs |
| aiInsightsStore | 📋 | `lib/store/insights.ts` | État insights IA |
| userProfileStore | 📋 | `lib/store/profile.ts` | Profil & préférences user |
| activitiesStore | 📋 | `lib/store/activities.ts` | Activités & entraînements |
| uiStateStore | 📋 | `lib/store/uiState.ts` | État UI global |

---

## API Routes (Serverless - TODO)

| Route | Status | Fichier | Description |
|-------|--------|---------|-------------|
| POST /api/ai/insights | 📋 | `app/api/ai/insights/route.ts` | Générer insights LLM |
| POST /api/ai/recommendations | 📋 | `app/api/ai/recommendations/route.ts` | Recommandations contextualisées |
| GET /api/biomarkers | 📋 | `app/api/biomarkers/route.ts` | Fetch biomarqueurs |
| POST /api/biomarkers/log | 📋 | `app/api/biomarkers/log/route.ts` | Logger métrique manuelle |
| GET /api/integrations/oura/sync | 📋 | `app/api/integrations/oura/sync/route.ts` | Sync Oura Ring |
| GET /api/integrations/garmin/sync | 📋 | `app/api/integrations/garmin/sync/route.ts` | Sync Garmin |
| GET /api/health/baseline | 📋 | `app/api/health/baseline/route.ts` | Calculer baselines perso |

---

## Utilities & Helpers

| Utilitaire | Status | Fichier | Description |
|-----------|--------|---------|-------------|
| cn() | ✅ | `lib/utils.ts` | Merge Tailwind classes |
| formatPercentage() | ✅ | `lib/utils.ts` | Format % avec précision |
| formatDuration() | ✅ | `lib/utils.ts` | Convertir min → "2h 30m" |
| interpretHRV() | ✅ | `lib/utils.ts` | Interpréter VFC vs baseline |
| calculateReadiness() | ✅ | `lib/utils.ts` | Calculer score readiness |
| calculateStrain() | ✅ | `lib/utils.ts` | Calculer strain entraînement |
| getStatusColor() | ✅ | `lib/utils.ts` | Couleur selon métrique |
| debounce() | ✅ | `lib/utils.ts` | Debounce functions |
| formatDate() | ✅ | `lib/utils.ts` | Format date i18n |
| maskCoordinates() | ✅ | `lib/utils.ts` | Privacy: masquer géoloc |

---

## Type Definitions

| Type | Status | Fichier | Description |
|------|--------|---------|-------------|
| BiomarkerValue | ✅ | `lib/types/index.ts` | Données biomarqueur + timestamp |
| HRVData | ✅ | `lib/types/index.ts` | VFC spécifique |
| SleepData | ✅ | `lib/types/index.ts` | Données sommeil |
| AIInsight | ✅ | `lib/types/index.ts` | Insight avec factors & confiance |
| Recommendation | ✅ | `lib/types/index.ts` | Recommandation IA |
| UserProfile | ✅ | `lib/types/index.ts` | Profil utilisateur complet |
| Activity | ✅ | `lib/types/index.ts` | Entraînement / activité |
| PrivacySettings | ✅ | `lib/types/index.ts` | Zones confidentialité & perms |
| TimeContext | ✅ | `lib/types/index.ts` | morning \| active \| evening |

---

## CSS & Design System

| Fichier | Status | Description |
|---------|--------|-------------|
| `tailwind.config.ts` | ✅ | Palette Bioluminescence complète + typography + animations |
| `globals.css` | ✅ | Animations custom, scrollbar, base styles |
| Design System "Helix" | ✅ | 8 surfaces, 10+ colors, 3 typos, 10+ animations |

---

## Documentation

| Doc | Status | Fichier | Description |
|-----|--------|---------|-------------|
| Architecture | ✅ | `ARCHITECTURE.md` | Vision & roadmap complet |
| Quick Start | ✅ | `QUICK_START.md` | Guide mise en route |
| Components Inventory | ✅ | `COMPONENTS.md` | Ce fichier |
| API Documentation | 📋 | `docs/API.md` | Documentation endpoints |
| Design Guide | 📋 | `docs/DESIGN.md` | Guide couleurs & composants |
| Contributing | 📋 | `CONTRIBUTING.md` | Conventions & workflow |

---

## Summary Stats

```
✅ Complété:        27 items
🚧 En cours:        4 items  
📋 À faire:         63 items
─────────────────────────────
Total:              94 items

Progress: 27% ✓
```

---

## Quick Reference: What to Build Next

### Urgent (Foundation)
1. Zustand stores pour state management
2. Pages principales (Pulse, Intelligence, Protocole, Tribu)
3. Composants dashboard (DashboardHero, InsightsSection)

### High Priority  
4. Intégrations LLM (Claude Sonnet / Gemini)
5. API routes pour biomarqueurs
6. Charts Recharts pour biomarqueurs

### Medium Priority
7. Intégrations tierces (Oura, Garmin, Apple Health)
8. Features social & privacy zones
9. Coach IA conversationnel

### Nice to Have
10. Voice commands
11. Wearable notifications
12. Analytics dashboard admin

---

**Last updated:** January 16, 2026
**Next review:** After Phase 2 completion
