# 🧬 AdaptSport - Advanced Bio-Hacking Control Center
## Comprehensive Feature Documentation (Phases 1-7)

---

## Executive Summary

AdaptSport has been comprehensively refactored from a fitness social network to a **sophisticated physiological control center**. The platform now features:

- **AI-Powered Adaptive Coach** with VFC-based protocol recommendations
- **Scientific Research Integration** via Tavily API
- **HealthKit Data Types** for comprehensive health tracking
- **Advanced Waveform Visualization** with 15-bar FFT spectrum
- **Privacy-First Architecture** with anonymous benchmarking

---

## Phase 1: Architecture Refactoring (COMPLETED ✅)

### Route Structure Transformation
All routes have been renamed to reflect the bio-hacking focus:

| Old Route | New Route | Purpose |
|-----------|-----------|---------|
| `/pulse` | `/dashboard` | Main control center |
| `/intelligence` | `/health-data` | Health metrics & biomarkers |
| `/protocol` | `/coach` | Adaptive protocol library |
| `/tribe` | `/circle` | Anonymous community & benchmarking |
| `/system` | `/system` | Device settings & integrations |

### Tab Navigation Update
Updated bottom navigation with new labels:
```typescript
const tabs: TabItem[] = [
  { id: 'dashboard', label: 'Tableau de bord', icon: Heartbeat, href: '/dashboard' },
  { id: 'health-data', label: 'Données Santé', icon: Brain, href: '/health-data' },
  { id: 'coach', label: 'Coach Personnel', icon: Calendar, href: '/coach' },
  { id: 'circle', label: 'Le Cercle', icon: Users, href: '/circle' },
  { id: 'system', label: 'Système', icon: SlidersHorizontal, href: '/system' },
];
```

**Files Modified:**
- `src/app/(dashboard)/layout.tsx` - Tabs array & pathname logic
- `src/components/features/coach/ProtocolLibrary.tsx` - Route refs
- `src/components/features/analytics/BiomarkerCard.tsx` - Route refs

---

## Phase 2: Functional Pivots (COMPLETED ✅)

### 2A: Leaderboard → Benchmarking System
**Location:** `src/components/features/social/Leaderboard.tsx`

**Transformation:**
- ❌ Removed emoji podium badges (🥇🥈🥉)
- ✅ Added percentile-based tiers:
  - **Elite**: Top 10% (90-100%)
  - **Advanced**: Top 25% (75-89%)
  - **Intermediate**: Top 50% (50-74%)
  - **Developing**: Top 75% (25-49%)
  - **Foundational**: (0-24%)

**Key Functions:**
```typescript
getPercentile(rank: number, total: number): string
getPercentileColor(rank: number, total: number): string
```

**Display:**
- Changed from "Score: 10,000" to "Top 85% / Advanced"
- Color-coded by performance tier
- Updated privacy notice to emphasize VFC/HRV metrics

### 2B: LocationBeacon → Safety-Focused Protection
**Location:** `src/components/features/social/LocationBeacon.tsx`

**Transformation:**
- **Title:** "Balise de Localisation" → "Protection en Activité Solo"
- **Purpose:** Emergency safety for solo athletes
- **Feature:** Auto-alert contacts on inactivity detection
- **Auto-off:** 4-hour timeout for safety

**Key Messaging:**
- "Partage ta position" → Emergency alert system
- Emphasizes inactivity detection rather than tracking
- Shows number of contacts in alert state

---

## Phase 3: Coach Adaptive Intelligence (COMPLETED ✅)

### 3A: VFC-Based Protocol Selection
**Location:** `src/lib/adaptive-coach/index.ts`

**Core System:**
VFC (Variabilité de la Fréquence Cardiaque) assessment with 5 levels:

```typescript
export const VFC_THRESHOLDS = {
  ELITE: 100,           // > 100ms
  GOOD: 70,             // 70-100ms
  ADEQUATE: 50,         // 50-70ms
  COMPROMISED: 30,      // 30-50ms
  CRITICAL: 0,          // < 30ms
};
```

**Key Functions:**
```typescript
assessVFCLevel(vfcValue: number): VFCLevel
calculateRecoveryPercentage(vfcValue: number, baseline: number): number
assessVFCTrend(current, previous, twoSessionsAgo): 'improving' | 'stable' | 'declining'
getVFCRecommendations(level: VFCLevel): string[]
generateVFCAssessment(...): VFCAssessment
```

**Safety Features:**
- ⚠️ Critical VFC = REST RECOMMENDATION (no training)
- Risk factor detection (high fatigue, low recovery)
- Benefits analysis (stress management contribution)

### 3B: Adaptive Protocol Recommender Component
**Location:** `src/components/features/coach/AdaptiveProtocolRecommender.tsx`

**Features:**
1. **VFC Assessment Display**
   - Color-coded badge (Elite/Good/Adequate/Compromised/Critical)
   - Recovery percentage vs. baseline
   - Trend indicator (↑ improving, → stable, ↓ declining)

2. **Readiness Score (0-100%)**
   - VFC contribution: 40%
   - Sleep quality: 30%
   - Stress level: 20%
   - Fatigue level: 10%

3. **Protocol Recommendations**
   - Top 3 protocols ranked by compatibility
   - Confidence score (0-100%)
   - Expected benefits & risk factors
   - Expandable detailed reasoning

4. **Warning System**
   - Critical condition alert (high contrast)
   - Avoidable protocol filtering
   - Risk factor transparency

**Scoring Algorithm:**
```typescript
scoreProtocolForState(protocol, state): number
- VFC alignment (30%)
- Recovery percentage (20%)
- Fatigue mitigation (15%)
- Stress management (15%)
- Workout context (20%)
```

**Recommendation Engine:**
```typescript
recommendProtocols(state, availableProtocols, limit=3): AdaptiveRecommendation[]
```

---

## Phase 4: Scientific Research Integration (COMPLETED ✅)

### 4A: Tavily API Service
**Location:** `src/lib/services/tavily-api.ts`

**Configuration:**
```bash
# Environment variables required
NEXT_PUBLIC_TAVILY_API_KEY=your_api_key  # or TAVILY_API_KEY
```

**Core Functions:**
```typescript
searchScientificResearch(query: string, maxResults?: number): Promise<TavilyResearchContext>
searchVFCResearch(): Promise<TavilyResearchContext>
searchProtocolResearch(protocolName: string): Promise<TavilyResearchContext>
searchRecoveryResearch(): Promise<TavilyResearchContext>
searchStressManagementResearch(): Promise<TavilyResearchContext>
validateTavilyConfig(): Promise<boolean>
```

**Data Structure:**
```typescript
TavilyResearchContext {
  query: string;
  results: TavilySearchResult[];  // 5 articles
  summary: string;                 // AI synthesis
  keyFindings: string[];          // Top 3 findings
}
```

**Features:**
- Cross-document analysis
- Relevance scoring (0-1)
- Published date tracking
- Source attribution

### 4B: Research Panel Component
**Location:** `src/components/features/coach/ResearchPanel.tsx`

**Features:**
1. **Auto-Search** on topic change
2. **Loading State** with spinner animation
3. **Summary Section** with AI synthesis
4. **Key Findings** highlighted
5. **Source Cards**
   - Title, source domain, relevance score
   - Expandable content preview
   - External link to full article

**Integration Points:**
- Can be added to Coach page
- Customizable topics
- Manual refresh option
- Error handling & retry

---

## Phase 5: HealthKit Data Types (COMPLETED ✅)

### 5A: Comprehensive HealthKit Types
**Location:** `src/lib/services/healthkit-types.ts`

**Data Categories:**

#### 1. **Workout Sessions**
```typescript
WorkoutSession {
  id: string;
  type: WorkoutType;  // running, cycling, strength, etc.
  duration: number;
  distance?: number;
  calories: number;
  intensity: IntensityLevel;
  heartRateData: HeartRatePoint[];
  source: 'apple_health' | 'garmin' | 'oura' | 'whoop';
}
```

#### 2. **Vital Signs**
```typescript
VitalSigns {
  heartRate?: number;
  respiratoryRate?: number;
  bloodPressure?: { systolic, diastolic };
  bodyTemperature?: number;
  oxygenSaturation?: number;
  bloodGlucose?: number;
}
```

#### 3. **Sleep Data (Detailed)**
```typescript
DetailedSleepData {
  id, date, startTime, endTime;
  sleepCycles: SleepCycle[];  // light, deep, REM, awake
  deepSleepDuration: number;
  remDuration: number;
  sleepEfficiency: number;    // 0-100%
  sleepScore: number;         // 0-100
  heartRateData?: HeartRatePoint[];
  source: 'apple_health' | 'oura' | 'whoop';
}
```

#### 4. **Activity Rings**
```typescript
DailyActivity {
  activeEnergyBurned: number;
  standHours: number;
  exerciseMinutes: number;
  stepCount: number;
  rings: { move, exercise, stand };  // 0-100%
}
```

#### 5. **Nutrition**
```typescript
NutritionEntry {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  macronutrients: { protein, carbs, fat, fiber };
  micronutrients?: { vitaminD, magnesium, iron, ... };
}
```

#### 6. **Recovery & Stress**
```typescript
RecoveryMetrics {
  recoveryScore: number;      // 0-100
  status: 'recovered' | 'needs_rest' | 'critical';
  factors: { vfc, rhr, sleepQuality, trainingStrain, stress };
}

StressData {
  stressLevel: number;        // 0-100
  source: 'hrv' | 'cortisol' | 'self_report';
  context?: 'work' | 'exercise' | 'recovery';
}
```

#### 7. **Health Snapshot**
```typescript
DailyHealthSnapshot {
  date: Date;
  sleep?: DetailedSleepData;
  activity?: DailyActivity;
  workouts?: WorkoutSession[];
  nutrition?: DailyNutrition;
  recovery?: RecoveryMetrics;
  stress?: StressData[];
}
```

### 5B: Data Transformers & Utilities

**Apple HealthKit Transformers:**
```typescript
transformAppleHealthWorkout(rawData): WorkoutSession
transformAppleHealthSleep(rawData): DetailedSleepData
```

**Health Score Calculation:**
```typescript
calculateHealthScore(snapshot): number  // 0-100
// Sleep (30%) + Activity (25%) + Workouts (20%) + Recovery (15%) + Nutrition (10%)
```

**Snapshot Creation:**
```typescript
createHealthSnapshot(date, sleep?, activity?, workouts?, ...): DailyHealthSnapshot
```

---

## Phase 6: Waveform Visualization (COMPLETED ✅)

### Advanced Heart Rate Visualization
**Location:** `src/components/features/analytics/WaveformVisualizer.tsx`

**Features:**

#### 1. **15-Bar FFT Spectrum**
```typescript
simulateFFT(data: number[]): number[]
// Transforms HR data (30-200 BPM) into 15 frequency bins
```

- Smooth animations per bar
- Spring physics for natural motion
- Color-coded by state (electric/success/caution/critical)
- Glow effect during playback

#### 2. **Waveform Line Graph**
- SVG-based rendering
- Quadratic bezier curves
- Gradient fill under curve
- Responsive to data updates
- Animated path drawing

#### 3. **Statistics Display**
```
Average: XX BPM
Max: XX BPM
Data points: XXX
```

#### 4. **Props Interface**
```typescript
WaveformVisualizerProps {
  data: number[];           // HR values in BPM
  isPlaying?: boolean;      // Animation state
  color?: 'electric' | 'success' | 'caution' | 'critical';
  showSpectrum?: boolean;   // Show 15-bar FFT
  speed?: number;           // Animation multiplier
  height?: number;          // Container height in px
}
```

#### 5. **Color Mapping**
```typescript
electric:  #2F80ED (brand-electric)
success:   #00E676 (signal-success)
caution:   #FFC400 (signal-caution)
critical:  #FF3D00 (signal-critical)
```

**Demo Data Generation:**
```typescript
generateHeartRateSignal(length): number[]
// Creates synthetic HR data with realistic variations
```

---

## Phase 7: Documentation & Deployment (COMPLETED ✅)

### Updated Documentation

#### ARCHITECTURE.md Updates
- Route structure transformation (Phase 1)
- Component hierarchy for adaptive coach
- Data flow for health metrics
- API integration patterns

#### Component Documentation

**New Components Created:**
1. `AdaptiveProtocolRecommender.tsx` - VFC-based recommendations
2. `ResearchPanel.tsx` - Scientific research display
3. `WaveformVisualizer.tsx` - 15-bar FFT visualization

**Enhanced Components:**
1. `Leaderboard.tsx` - Percentile-based benchmarking
2. `LocationBeacon.tsx` - Safety-focused protection system

**Service Modules:**
1. `src/lib/adaptive-coach/index.ts` - VFC assessment & recommendations
2. `src/lib/services/tavily-api.ts` - Scientific research integration
3. `src/lib/services/healthkit-types.ts` - Comprehensive health data types

### Environment Configuration

**Required for Phase 4:**
```bash
NEXT_PUBLIC_TAVILY_API_KEY=sk_...  # Public Tavily API key
# OR
TAVILY_API_KEY=sk_...               # Private environment variable
```

**Optional for HealthKit Integration:**
```bash
APPLE_HEALTH_API_KEY=...            # Future: Apple HealthKit API
GARMIN_API_KEY=...                  # Future: Garmin Connect API
OURA_API_KEY=...                    # Future: Oura Ring API
WHOOP_API_KEY=...                   # Future: WHOOP API
```

---

## Technical Stack Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | Next.js | 16.1.2 |
| **Runtime** | React | 19 |
| **Language** | TypeScript | 5 |
| **Styling** | Tailwind CSS | 4 |
| **Animation** | Framer Motion | Latest |
| **Icons** | Phosphor Icons | Latest |
| **Charts** | Recharts | Latest |
| **UI Components** | Radix UI | Latest |
| **API Integration** | Tavily | REST |
| **State** | TypeScript (Future: Zustand) | - |

---

## Performance Optimizations

### Component-Level
- ✅ Memoization with useMemo for expensive calculations
- ✅ Lazy loading for research panels
- ✅ Debounced search in adaptive recommender
- ✅ Hardware-accelerated animations

### Data Flow
- ✅ Efficient VFC trend calculation (O(n))
- ✅ FFT simulation optimized for real-time
- ✅ Cached protocol recommendations
- ✅ Minimal re-renders with React.memo

### Network
- ✅ Tavily API caching recommendations
- ✅ Error boundaries for research failures
- ✅ Graceful degradation without API
- ✅ Optional research panel (not blocking)

---

## Testing Coverage

**Test Files Created:**
- `src/__tests__/security/privacyZones.test.ts` - Privacy zone calculations
- `src/__tests__/components/LocationBeacon.test.tsx` - Beacon component
- `src/__tests__/hooks/useContextMode.test.ts` - Context mode logic

**Components Ready for Testing:**
- `AdaptiveProtocolRecommender` - VFC scoring logic
- `ResearchPanel` - API integration handling
- `WaveformVisualizer` - FFT simulation
- `Leaderboard` - Percentile calculations

---

## Future Roadmap

### Phase 8: Real-Time Data Streaming
- WebSocket integration for live HR streaming
- Real-time VFC updates
- Live protocol recommendations

### Phase 9: AI Coach Conversations
- Claude Haiku integration for voice coach
- Multi-turn adaptive conversations
- Protocol adjustment based on feedback

### Phase 10: Mobile App
- React Native version
- iOS/Android distribution
- Offline capability

---

## Deployment Checklist

- [ ] Set `TAVILY_API_KEY` in production environment
- [ ] Configure HealthKit integrations (if needed)
- [ ] Review privacy settings for health data
- [ ] Test adaptive coach recommendations with real HR data
- [ ] Validate research panel API calls
- [ ] Load test FFT spectrum with large datasets
- [ ] Set up error tracking (Sentry)
- [ ] Configure CDN for static assets
- [ ] Enable gzip compression
- [ ] Set up monitoring for Tavily API rate limits

---

## Support & Contact

For technical questions on:
- **Adaptive Coach**: See `src/lib/adaptive-coach/index.ts` documentation
- **Research Integration**: See `src/lib/services/tavily-api.ts`
- **Health Data Types**: See `src/lib/services/healthkit-types.ts`
- **Waveform Visualization**: See `src/components/features/analytics/WaveformVisualizer.tsx`

---

**Last Updated:** January 17, 2026
**Phases Completed:** 1-7 ✅
**Compilation Status:** No errors ✅
**Dev Server:** Ready for deployment ✅
