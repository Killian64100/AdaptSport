# 🌌 AdaptSport - AI-Powered Bio-Hacking Platform

## Vision Stratégique

**AdaptSport** est une plateforme de nouvelle génération conçue pour les **bio-hackers** - des utilisateurs qui cherchent à optimiser leur biologie humaine par la science et les données.

### Identité Design: "Bioluminescence"
- **Dark Mode obligatoire** (#0A0A0A) - Respect des rythmes circadiens
- **Hiérarchie par luminance** - Profondeur sans ombres
- **Néons pastels désaturés** - Couleurs qui guident sans agresser
- **IA-First Design** - L'interface anticipe et adapte

---

## 📁 Architecture du Projet

```
src/
├── app/
│   ├── api/               # API routes (health data, AI endpoints)
│   ├── globals.css        # Design System Helix CSS
│   ├── layout.tsx         # Root layout avec fonts
│   └── page.tsx           # Homepage avec showcase
│
├── components/
│   ├── ui/                # Composants atomiques
│   │   ├── BioGauge.tsx      # Hero circulaire (Stress/Recovery)
│   │   ├── SmartCard.tsx     # Cartes expandables (insights IA)
│   │   ├── MetricChip.tsx    # Chips pour biomarqueurs
│   │   └── ConfidencePill.tsx # Indicateurs confiance IA
│   │
│   ├── layout/            # Composants layout
│   │   └── AppLayout.tsx     # Layout adaptatif contextu
│   │
│   ├── dashboard/         # Écrans dashboard
│   ├── biomarkers/        # Composants biomarqueurs
│   └── ai/                # Composants IA & insights
│
├── lib/
│   ├── types/index.ts     # Types TypeScript complets
│   ├── hooks/index.ts     # Custom hooks (contexte, permissions)
│   ├── store/             # État global (future: Zustand/Redux)
│   ├── utils.ts           # Utilitaires & formateurs
│   └── utils.ts           # Helpers bio-hacking
```

---

## 🎨 Design System "Helix"

### Palette Bioluminescence
| Token | Hex | Utilisation |
|-------|-----|-------------|
| `surface-void` | #050505 | Fond global (profondeur infinie) |
| `surface-card` | #161616 | Conteneurs, cartes (Élévation 1) |
| `surface-elevated` | #242424 | Modales, éléments flottants (Élévation 2) |
| `brand-electric` | #2F80ED | Actions primaires, liens |
| `signal-success` | #00E676 | Récupération, objectif atteint |
| `signal-caution` | #FFC400 | Attention, strain élevé |
| `signal-critical` | #FF3D00 | Arrêt immédiat, surtraînement |
| `data-deep` | #D500F9 | Sommeil profond |
| `data-hrv` | #00E5FF | Variabilité fréquence cardiaque |

### Typographie
- **Display**: Space Grotesk (titres, grands chiffres) - technicité médicale
- **Body**: Inter (texte principal) - lisibilité
- **Mono**: JetBrains Mono (données tabulaires) - alignement chiffres

### Composants Atomiques
- `BioGauge` - Visualisation circulaire Stress/Recovery
- `SmartCard` - Insights IA avec expansion progressive
- `MetricChip` - Metrics individuels
- `ConfidencePill` - Indicateur confiance IA

---

## 🧠 Principes AI-First

### 1. Glanceability (5 secondes)
L'utilisateur comprend son état en 5 secondes sans effort cognitif:
- Bio-Gauge central (score global)
- Statuts colorés (Vert/Ambre/Rouge)
- Pas de tableaux complexes

### 2. Progressive Disclosure
Satisfaction novice ET expert:
```
Score Global (85)
├─ Contributeurs
│  ├─ Sommeil (6h42)
│  ├─ VFC (52ms)
│  └─ HR (58bpm)
└─ Données Brutes
   └─ Hypnogramme détaillé
```

### 3. IA Explicable (XAI)
Chaque recommandation IA doit expliquer son "Pourquoi":
- Confidence Score visible (94%)
- Facteurs d'attribution:
  - "Sommeil < 6h (-20%)"
  - "VFC en baisse (-15%)"
  - "Charge entraînement hier (+10%)"

### 4. Interface Adaptative Contextuelle
L'UI morphe selon le contexte:
- **Mode Matin** (5h-12h): Récupération, Readiness, Météo
- **Mode Actif** (12h-18h): Contraste max, polices larges, "glanceability"
- **Mode Soir** (18h-23h): Tons chauds, lumière bleue réduite, sommeil

---

## 🔐 Sécurité & Confidentialité

### Hard Stop UI
Actions critiques requièrent double geste (swipe + tap):
```tsx
<HardStopButton
  action="Arrêter activité"
  requiresConfirm
  gestureType="swipe-and-tap"
/>
```

### Privacy Zones
Masquer automatiquement domicile/points sensibles:
```tsx
interface PrivacyZone {
  lat, lng, radius
  type: 'home' | 'work' | 'custom'
}
```

### Just-in-Time Permissions
Ne demander les permissions que contextuellement:
- Micro → tapé "Commande vocale"
- Localisation → détecté entraînement en cours
- Santé → premier sync wearable

### Benchmarking Anonyme
Comparaison sans révéler identité:
- Courbe de distribution (bell curve)
- "Vous êtes top 10% pour récupération"
- Groupes démographiques (age, niveau)

---

## 🚀 Roadmap d'Implémentation

### Phase 1: Fondation UI ✅
- [x] Design System Helix en Tailwind
- [x] Composants atomiques (BioGauge, SmartCard, MetricChip)
- [x] Layout adaptatif avec contexte temporel
- [x] Types TypeScript complets
- [x] Hooks personnalisés (timeContext, permissions)

### Phase 2: Dashboard Principal
- [ ] Écran "Le Pouls" (dashboard principal)
- [ ] BioGauge interactif avec données réelles
- [ ] Smart Cards avec insights IA générés
- [ ] Slider pour explorer historique (Data Scrubbing)

### Phase 3: Biomarqueurs & Analytics
- [ ] Écran "Intelligence" (analytique profonde)
- [ ] Explorateur biomarqueurs (VFC, Glucose, SpO2)
- [ ] Moteur de corrélation (alcool vs VFC, etc)
- [ ] Tendances normatives vs cohorte

### Phase 4: AI & Coaching
- [ ] Écran "Protocole" (recommendations)
- [ ] Coach IA conversationnel
- [ ] Générations d'insights par LLM
- [ ] Adaptation par reinforcement learning

### Phase 5: Social Sécurisé
- [ ] Écran "Tribu" (social)
- [ ] Cercles de confiance
- [ ] Challenges anonymes
- [ ] Privacy zones UI

### Phase 6: Intégrations
- [ ] Oura Ring API
- [ ] Garmin Connect
- [ ] Apple HealthKit
- [ ] Whoop Band

---

## 🛠 Stack Technologique

### Frontend
- **Next.js 16** - React 19, App Router
- **Tailwind CSS 4** - Design System Helix
- **Framer Motion** - Animations micro-interactions
- **Recharts** - Graphiques biomarqueurs
- **Phosphor Icons** - Iconographie Bio

### Futur Backend
- **Node.js / Python** - API health data
- **LLM Integration** - Claude Sonnet / Gemini Pro
- **PostgreSQL** - Time-series biomarqueurs
- **Redis** - Cache, real-time metrics

---

## 📚 Ressources Design

### Inspirations
- **Oura**: Progressive disclosure, readiness scoring
- **Whoop**: Strain scoring, VFC baseline
- **Strava**: Social, privacy zones
- **Garmin**: Hard stop UI, contexte actif

### Standards
- WCAG AA (contraste Bioluminescence)
- iOS 18 guidelines (permissions, haptics)
- HealthKit API standards
- GDPR (privacy zones, data retention)

---

## 💡 Notes pour Développeurs

### Conventions
- Composants client-side: `'use client'`
- Types dans `src/lib/types/index.ts`
- Hooks dans `src/lib/hooks/index.ts`
- Utilitaires dans `src/lib/utils.ts`
- Design tokens en Tailwind config

### Testing Bioluminescence
```bash
# Vérifier contraste WCAG AA
# Installer Stark plugin Figma

# Tester dark mode
# Safari: Preferences > Developer > Appearance
# Chrome DevTools: Rendering tab > Forced color scheme
```

### Prochaines Étapes
1. Intégrer Zustand pour state management
2. Créer API routes pour données biomarqueurs
3. Implémenter context adaptatif complet
4. Générer insights IA via LLM
5. Connecter APIs tierces (Oura, Garmin)

---

**Built with precision bio-hacking in mind. 🌌✨**
