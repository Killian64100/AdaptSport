import { create } from 'zustand'
import healthData from '@/data/mock-health.json'
import { parseSleepTime, formatSleepTime } from '@/utils/healthUtils'

interface BiomarkerState {
  hrv: number
  rhr: number
  sleep: number
  spo2: number
  strain: number
  recovery: number
  calories: number
  isSimulating: boolean
  selectedMetricId: string // Métrique actuellement sélectionnée
  // Actions
  setBiomarkers: (data: any) => void
  setSelectedMetric: (id: string) => void
  startDemoMode: () => void
  stopDemoMode: () => void
}

export const useBiomarkerStore = create<BiomarkerState>((set, get) => ({
  hrv: healthData.today?.hrv ?? 58,
  rhr: healthData.today?.rhr ?? 52,
  sleep: parseSleepTime(healthData.today?.sleep as string) ?? 7.5,
  spo2: healthData.today?.spo2 ?? 97,
  strain: healthData.today?.strain ?? 10.2,
  recovery: healthData.today?.recovery ?? 72,
  calories: healthData.today?.calories ?? 2145,
  isSimulating: false,
  selectedMetricId: 'hrv', // VFC par défaut

  setBiomarkers: (data) => set({ ...data }),
  
  setSelectedMetric: (id: string) => set({ selectedMetricId: id }),

  startDemoMode: () => {
    if (get().isSimulating) return;
    set({ isSimulating: true });

    const interval = setInterval(() => {
      if (!get().isSimulating) {
        clearInterval(interval);
        return;
      }

      // Simulation de fluctuations MASSIVES et visibles
      set((state) => {
        // Récupération : +/- 8% (oscillation visible sur la jauge)
        const recoveryChange = (Math.random() - 0.5) * 16; // [-8, +8]
        const newRecovery = Math.max(30, Math.min(98, state.recovery + recoveryChange));

        // HRV (VFC) : +/- 5ms (fluctuation importante)
        const hrvChange = (Math.random() - 0.5) * 10; // [-5, +5]
        const newHrv = Math.max(35, Math.min(80, state.hrv + hrvChange));

        // Strain : +/- 1.0 (oscillation visible sur la barre)
        const strainChange = (Math.random() - 0.5) * 2; // [-1, +1]
        const newStrain = Math.max(3, Math.min(21, state.strain + strainChange));

        // Calories : +/- 50 kcal
        const caloriesChange = (Math.random() - 0.5) * 100; // [-50, +50]
        const newCalories = Math.max(1500, Math.min(3500, state.calories + caloriesChange));

        // FC Repos : fluctuation modérée
        const rhrChange = (Math.random() - 0.5) * 4; // [-2, +2]
        const newRhr = Math.max(45, Math.min(75, state.rhr + rhrChange));

        // Sommeil : fluctuation légère
        const sleepChange = (Math.random() - 0.5) * 0.4; // [-0.2, +0.2]
        const newSleep = Math.max(5, Math.min(9, state.sleep + sleepChange));

        // SpO2 : ne descend jamais sous 94%
        const spo2Change = (Math.random() - 0.5) * 2; // [-1, +1]
        const newSpo2 = Math.max(94, Math.min(100, state.spo2 + spo2Change));

        return {
          recovery: Math.round(newRecovery),
          hrv: Math.round(newHrv),
          strain: +newStrain.toFixed(1),
          calories: Math.round(newCalories),
          rhr: Math.round(newRhr),
          sleep: +newSleep.toFixed(1),
          spo2: Math.round(newSpo2),
        };
      });
    }, 2000); // Mise à jour toutes les 2 secondes
  },

  stopDemoMode: () => set({ isSimulating: false })
}))
