# 🚀 AdaptSport - Quick Start & Next Steps

## ✅ Ce qui a été fait (Session actuelle)

### 1. **Design System Helix** 
- ✅ `tailwind.config.ts` - Palette Bioluminescence complète
- ✅ `globals.css` - Animations, scrollbar, variab CSS
- ✅ Tous les tokens: surfaces, signaux, data colors, typographie

### 2. **Composants Atomiques UI**
- ✅ `BioGauge.tsx` - Visualisation circulaire Stress/Recovery
- ✅ `SmartCard.tsx` - Insights IA avec expansion progressive
- ✅ `MetricChip.tsx` - Chips pour biomarqueurs
- ✅ `ConfidencePill.tsx` - Indicateurs confiance IA

### 3. **Layout & Navigation**
- ✅ `AppLayout.tsx` - Layout adaptatif contextualisé (Morning/Active/Evening)
- ✅ Header avec greeting IA
- ✅ Footer avec nav sections
- ✅ Transitions fluides basées sur l'heure du jour

### 4. **Types & Hooks**
- ✅ `types/index.ts` - Types TypeScript complets
  - BiomarkerData, AIInsight, Recommendation, UserProfile, Activity, PrivacySettings
- ✅ `hooks/index.ts` - Custom hooks:
  - `useTimeContext()` - Contexte temporel automatique
  - `useMovementDetection()` - Détection mouvement
  - `useUIContext()` - Contexte UI global
  - `usePermissionRequest()` - Gestion JIT permissions

### 5. **Utilitaires**
- ✅ `utils.ts` - 15+ fonctions helper
  - Formatage (pourcentage, durée, date)
  - Calculs bio (readiness, strain, HRV interpretation)
  - Privacy (masque coordonnées)
  - Debounce, color status

### 6. **Documentation**
- ✅ `ARCHITECTURE.md` - Rapport complet du projet
- ✅ `QUICK_START.md` - Ce fichier

### 7. **Demo Home Page**
- ✅ `page.tsx` - Page d'accueil avec tous les composants
  - BioGauge hero
  - Insights IA mock
  - Biomarqueurs
  - Color palette showcase

---

## 🎯 Prochaines Étapes (Priorité)

### Phase 2: State Management & Data (1-2 jours)
```
[ ] Installer Zustand pour state global
[ ] Créer store/biomarkersStore.ts
[ ] Créer store/aiInsightsStore.ts
[ ] Créer store/userProfileStore.ts
[ ] Mock data pour testing
```

### Phase 3: Écran "Le Pouls" - Dashboard Principal (2-3 jours)
```
[ ] pages/dashboard/page.tsx
[ ] Intégrer BioGauge avec données dynamiques
[ ] Afficher insights IA generés
[ ] Quick actions contextués
[ ] Responsivité mobile
```

### Phase 4: Écran "Intelligence" - Analytics (2-3 jours)
```
[ ] pages/analytics/page.tsx
[ ] Explorateur biomarqueurs
[ ] Graphiques Recharts (VFC, Sleep, Glucose)
[ ] Data scrubbing (drag sur courbes)
[ ] Tendances vs cohorte
```

### Phase 5: IA Générative & LLM (2-3 jours)
```
[ ] API routes pour LLM (Claude Sonnet / Gemini)
[ ] Génération "Daily Briefing" texte
[ ] Attribution facteurs automatique
[ ] Recommendations contextualisées
[ ] Streaming responses
```

### Phase 6: Intégrations API (3-5 jours)
```
[ ] Oura Ring API
[ ] Garmin Connect API
[ ] Apple HealthKit (iOS)
[ ] Authentification OAuth2
[ ] Sync scheduling
```

### Phase 7: Features Social & Sécurité (2-3 jours)
```
[ ] Écran "Tribu"
[ ] Cercles de confiance
[ ] Privacy zones UI interactive
[ ] Challenges anonymes
[ ] Partage sécurisé
```

---

## 🧪 Comment Tester

### Lancer le serveur dev
```bash
npm run dev
```
Accéder à: `http://localhost:3000`

### Voir les changements en temps réel
Le serveur Next.js en dev mode hot-reload automatiquement.

### Tester le dark mode
Le projet est 100% dark mode par défaut. Pour tester les sélecteurs:
```bash
# Chrome DevTools: Rendering tab > Forced color scheme
# Safari: Preferences > Developer > Appearance
```

### Vérifier WCAG AA contrast
- Installer plugin Stark dans Figma
- Ou utiliser: https://webaim.org/resources/contrastchecker/

---

## 📦 Structure des Fichiers Importants

### À modifier pour ajouter features:
```
src/components/
├── dashboard/          # ← Écrans principales
├── biomarkers/         # ← Composants spécialisés
└── ai/                 # ← Composants IA

src/app/
├── api/                # ← API routes (LLM, health data)
└── (tabs)/             # ← Écrans principaux (modale structure)

src/lib/
├── store/              # ← Zustand stores (état global)
├── hooks/              # ← Custom hooks
└── types/              # ← Types TypeScript
```

### À ne pas modifier:
```
src/app/globals.css    # ← Design System CSS (maintenez!)
tailwind.config.ts     # ← Palette Bioluminescence (sacré!)
src/lib/utils.ts       # ← Utilitaires (réutilisez!)
```

---

## 🎨 Design Principles to Remember

### Glanceability (5 secondes)
Chaque écran doit être compris en 5 secondes sans effort:
- ✅ Titre clair
- ✅ Nombre/jauge principale
- ✅ Statut coloré (Vert/Ambre/Rouge)
- ❌ Pas de tableaux complexes
- ❌ Pas de texte small

### Progressive Disclosure
Si c'est complexe, faites-le expandable:
```tsx
<SmartCard 
  insight={insight}
  expanded={false}  {/* User expands for details */}
/>
```

### XAI (Explainable AI)
Chaque recommendation IA doit avoir:
- ✅ Confidence score visible
- ✅ Facteurs d'attribution (pourquoi?)
- ✅ Action claire (quoi faire?)
- ❌ Pas de "boîte noire"

### Contexte Adaptatif
L'interface change selon l'heure:
```typescript
timeContext: 'morning' | 'active' | 'evening'
// → Couleurs, tailles, priorités changent automatiquement
```

---

## 🔌 Intégrations API (TODO)

### Pour Claude Sonnet
```typescript
// À créer: src/app/api/ai/insights/route.ts
import Anthropic from '@anthropic-ai/sdk';

export async function POST(req: Request) {
  const { biomarkers, userHistory } = await req.json();
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });
  // Générer insights texte
}
```

### Pour Gemini Pro
```typescript
// À créer: src/app/api/ai/recommendations/route.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
```

### Pour Oura Ring
```typescript
// À créer: src/app/api/integrations/oura/route.ts
// Utiliser: https://cloud.ouraring.com/docs/
// Sync: VFC, sleep, readiness chaque nuit
```

---

## 📚 Commandes Utiles

```bash
# Dev server
npm run dev

# Build production
npm run build

# Linter
npm run lint

# TypeScript check
npx tsc --noEmit

# Format code (prettier)
npx prettier --write src/
```

---

## 🐛 Troubleshooting

### Erreur: "Unknown utility class"
→ Assurez-vous que le color token est défini dans `tailwind.config.ts`

### Composant ne s'affiche pas
→ Vérifiez que c'est un Client Component (`'use client'`)

### Hook ne fonctionne pas
→ Hooks doivent être utilisés dans des Client Components

### Styles ne se mettent pas à jour
→ Redémarrez le serveur dev (`Ctrl+C`, puis `npm run dev`)

---

## 🌟 Ressources Utiles

### Documentation
- [Next.js 16 Docs](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Recharts](https://recharts.org/)

### Bio-Hacking References
- Oura API: https://cloud.ouraring.com/docs/
- WHOOP API: https://developer.whoop.com/
- Apple HealthKit: https://developer.apple.com/healthkit/
- Garmin API: https://developer.garmin.com/

### Design Inspiration
- Material Design Dark Mode: https://material.io/design
- iOS Human Interface Guidelines: https://developer.apple.com/design/
- Figma Design System Best Practices

---

**Happy coding! 🚀🌌**
