/**
 * HealthKit Data Types & Transformers
 * Comprehensive type system for Apple Health data integration
 */

// ===== WORKOUT DATA =====
export type WorkoutType =
  | 'running'
  | 'cycling'
  | 'swimming'
  | 'walking'
  | 'strength_training'
  | 'yoga'
  | 'pilates'
  | 'hiit'
  | 'sports'
  | 'recovery';

export type IntensityLevel = 'light' | 'moderate' | 'vigorous' | 'max';

export interface WorkoutSession {
  id: string;
  type: WorkoutType;
  startDate: Date;
  endDate: Date;
  duration: number; // seconds
  distance?: number; // meters
  calories: number;
  intensity: IntensityLevel;
  heartRateData: HeartRatePoint[];
  averageHeartRate: number;
  maxHeartRate: number;
  notes?: string;
  source: 'apple_health' | 'garmin' | 'oura' | 'whoop' | 'manual';
}

export interface HeartRatePoint {
  timestamp: Date;
  bpm: number;
  confidence?: number; // 0-1
}

// ===== VITAL SIGNS & MEASUREMENTS =====
export interface VitalSigns {
  timestamp: Date;
  heartRate?: number; // bpm
  respiratoryRate?: number; // breaths/min
  bloodPressure?: {
    systolic: number; // mmHg
    diastolic: number; // mmHg
  };
  bodyTemperature?: number; // Celsius
  oxygenSaturation?: number; // 0-100%
  bloodGlucose?: number; // mg/dL
}

export interface BiometricMeasurement {
  timestamp: Date;
  weight?: number; // kg
  height?: number; // cm
  bmi?: number;
  bodyFatPercentage?: number;
  muscleMass?: number; // kg
  boneMass?: number; // kg
  waterPercentage?: number;
}

// ===== SLEEP DATA (EXTENDED) =====
export interface SleepCycle {
  type: 'light' | 'deep' | 'rem' | 'awake';
  startDate: Date;
  endDate: Date;
  duration: number; // seconds
}

export interface DetailedSleepData {
  id: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  totalDuration: number; // minutes
  inBedDuration: number; // minutes
  asleepDuration: number; // minutes
  sleepCycles: SleepCycle[];
  deepSleepDuration: number; // minutes
  remDuration: number; // minutes
  lightSleepDuration: number; // minutes
  awakeDuration: number; // minutes
  sleepEfficiency: number; // 0-100%
  sleepLatency: number; // minutes to fall asleep
  timeAwakeAfterOnset: number; // minutes
  sleepStage: 'light' | 'deep' | 'rem' | 'awake';
  heartRateData?: HeartRatePoint[];
  averageHeartRate?: number;
  respiratoryRate?: number;
  skinTemperature?: number;
  sleepScore?: number; // 0-100
  notes?: string;
  source: 'apple_health' | 'oura' | 'whoop' | 'garmin' | 'fitbit' | 'manual';
}

// ===== ACTIVITY RINGS / MOVEMENT =====
export interface DailyActivity {
  date: Date;
  activeEnergyBurned: number; // calories
  standHours: number;
  exerciseMinutes: number;
  rings: {
    move: number; // 0-100%
    exercise: number; // 0-100%
    stand: number; // 0-100%
  };
  stepCount: number;
  flightsClimbed: number;
  pushCount?: number;
  exerciseTime: number; // minutes
}

// ===== NUTRITION DATA =====
export interface NutritionEntry {
  timestamp: Date;
  mealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  macronutrients: {
    protein: number; // grams
    carbohydrates: number; // grams
    fat: number; // grams
    fiber: number; // grams
  };
  micronutrients?: {
    vitamin_d?: number; // IU
    magnesium?: number; // mg
    iron?: number; // mg
    zinc?: number; // mg
    b12?: number; // mcg
    calcium?: number; // mg
  };
  notes?: string;
}

export interface DailyNutrition {
  date: Date;
  entries: NutritionEntry[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  waterIntake?: number; // liters
}

// ===== STRESS & RECOVERY =====
export interface StressData {
  timestamp: Date;
  stressLevel: number; // 0-100
  source: 'hrv' | 'cortisol' | 'self_report';
  context?: 'work' | 'exercise' | 'recovery' | 'unknown';
}

export interface RecoveryMetrics {
  timestamp: Date;
  recoveryScore: number; // 0-100
  status: 'recovered' | 'needs_rest' | 'critical';
  factors: {
    vfc?: number; // ms
    rhr?: number; // bpm
    sleepQuality?: number; // 0-100
    trainingStrain?: number; // 0-100
    stressLevel?: number; // 0-100
  };
}

// ===== MENSTRUAL CYCLE (Optional) =====
export type MenstrualPhase = 'menstruation' | 'follicular' | 'ovulation' | 'luteal';

export interface MenstrualCycleData {
  date: Date;
  phase: MenstrualPhase;
  dayOfCycle: number;
  flowIntensity?: 'light' | 'moderate' | 'heavy';
  symptoms?: string[];
  fertility?: 'low' | 'medium' | 'high';
}

// ===== MEDICAL DATA (FOR FUTURE) =====
export interface MedicalHistory {
  conditions: string[];
  medications: string[];
  allergies: string[];
  surgeries: Array<{
    date: Date;
    procedure: string;
  }>;
  familyHistory: string[];
}

// ===== INTEGRATED HEALTH SNAPSHOT =====
export interface DailyHealthSnapshot {
  date: Date;
  sleep?: DetailedSleepData;
  activity?: DailyActivity;
  workouts?: WorkoutSession[];
  nutrition?: DailyNutrition;
  vitalSigns?: VitalSigns[];
  biometrics?: BiometricMeasurement;
  recovery?: RecoveryMetrics;
  stress?: StressData[];
  menstrual?: MenstrualCycleData;
}

// ===== HEALTH SYNC CONFIGURATION =====
export interface HealthKitSyncConfig {
  enabled: boolean;
  source: 'apple_health' | 'garmin' | 'oura' | 'whoop' | 'fitbit' | 'multiple';
  dataTypes: {
    workouts: boolean;
    sleep: boolean;
    activity: boolean;
    nutrition: boolean;
    vitalSigns: boolean;
    steps: boolean;
  };
  syncFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
  lastSync?: Date;
  autoSync: boolean;
  permission: 'read' | 'read_write';
}

// ===== TRANSFORMERS =====

/**
 * Transform raw Apple HealthKit data to our format
 */
export function transformAppleHealthWorkout(rawData: any): WorkoutSession {
  return {
    id: rawData.UUID || crypto.randomUUID(),
    type: rawData.workoutActivityType || 'running',
    startDate: new Date(rawData.startDate),
    endDate: new Date(rawData.endDate),
    duration: (new Date(rawData.endDate).getTime() - new Date(rawData.startDate).getTime()) / 1000,
    distance: rawData.totalDistance?.doubleValue,
    calories: rawData.totalEnergyBurned?.doubleValue || 0,
    intensity: determineIntensity(rawData.totalEnergyBurned?.doubleValue, rawData.duration),
    heartRateData: [],
    averageHeartRate: 0,
    maxHeartRate: 0,
    source: 'apple_health',
  };
}

/**
 * Transform raw Apple HealthKit sleep data
 */
export function transformAppleHealthSleep(rawData: any): DetailedSleepData {
  const startTime = new Date(rawData.startDate);
  const endTime = new Date(rawData.endDate);
  const inBedDuration = (endTime.getTime() - startTime.getTime()) / 60000; // minutes

  return {
    id: rawData.UUID || crypto.randomUUID(),
    date: startTime,
    startTime,
    endTime,
    totalDuration: inBedDuration,
    inBedDuration,
    asleepDuration: inBedDuration * 0.9, // estimate
    sleepCycles: [],
    deepSleepDuration: inBedDuration * 0.15,
    remDuration: inBedDuration * 0.20,
    lightSleepDuration: inBedDuration * 0.55,
    awakeDuration: inBedDuration * 0.10,
    sleepEfficiency: 90,
    sleepLatency: 15,
    timeAwakeAfterOnset: 10,
    sleepStage: 'deep',
    sleepScore: 85,
    source: 'apple_health',
  };
}

/**
 * Determine workout intensity from calorie burn and duration
 */
function determineIntensity(calories?: number, duration?: number): IntensityLevel {
  if (!calories || !duration) return 'moderate';

  const caloriesPerMinute = calories / (duration / 60);

  if (caloriesPerMinute > 15) return 'vigorous';
  if (caloriesPerMinute > 10) return 'moderate';
  if (caloriesPerMinute > 5) return 'light';
  return 'light';
}

/**
 * Create daily health snapshot from components
 */
export function createHealthSnapshot(
  date: Date,
  sleep?: DetailedSleepData,
  activity?: DailyActivity,
  workouts?: WorkoutSession[],
  nutrition?: DailyNutrition,
  recovery?: RecoveryMetrics
): DailyHealthSnapshot {
  return {
    date,
    sleep,
    activity,
    workouts,
    nutrition,
    recovery,
  };
}

/**
 * Calculate overall health score (0-100)
 */
export function calculateHealthScore(snapshot: DailyHealthSnapshot): number {
  let score = 50;

  // Sleep contribution (30%)
  if (snapshot.sleep) {
    score += (snapshot.sleep.sleepScore || 70) * 0.3;
  }

  // Activity contribution (25%)
  if (snapshot.activity) {
    const activityRings = (snapshot.activity.rings.move + snapshot.activity.rings.exercise + snapshot.activity.rings.stand) / 3;
    score += (activityRings / 100) * 25;
  }

  // Workout contribution (20%)
  if (snapshot.workouts && snapshot.workouts.length > 0) {
    score += 20;
  }

  // Recovery contribution (15%)
  if (snapshot.recovery) {
    score += (snapshot.recovery.recoveryScore / 100) * 15;
  }

  // Nutrition contribution (10%)
  if (snapshot.nutrition) {
    const nutritionBalance = Math.min(100, (snapshot.nutrition.totalCalories / 2500) * 100);
    score += (nutritionBalance / 100) * 10;
  }

  return Math.min(100, Math.round(score));
}
