// ===== BIOMARKERS & HEALTH DATA =====
export type BiomarkerType = 'hrv' | 'sleep' | 'glucose' | 'spo2' | 'strain' | 'recovery' | 'rhr';

export interface BiomarkerValue {
  timestamp: Date;
  value: number;
  unit: string;
  normalMin?: number;
  normalMax?: number;
}

export interface HRVData extends BiomarkerValue {
  unit: 'ms';
  trend?: 'up' | 'down' | 'stable';
}

export interface SleepData {
  date: Date;
  totalMinutes: number;
  deepMinutes: number;
  remMinutes: number;
  lightMinutes: number;
  efficiency: number; // 0-100
  latency: number; // minutes to fall asleep
  score: number; // 0-100
}

// ===== AI INSIGHTS & RECOMMENDATIONS =====
export interface ConfidenceScore {
  level: 'high' | 'medium' | 'low';
  percentage: number; // 0-100
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  category: 'recovery' | 'training' | 'sleep' | 'stress' | 'nutrition';
  confidence: ConfidenceScore;
  factors: {
    name: string;
    impact: number; // -100 to 100
    explanation: string;
  }[];
  actionable: string;
  timestamp: Date;
}

export interface Recommendation {
  id: string;
  type: 'workout' | 'rest' | 'protocol' | 'adjustment';
  title: string;
  description: string;
  reason: string;
  confidence: ConfidenceScore;
  priority: 'high' | 'medium' | 'low';
  userFeedback?: 'helpful' | 'not_helpful' | null;
}

// ===== UI CONTEXT & STATE =====
export type TimeContext = 'morning' | 'active' | 'evening';
export type UserLevel = 'beginner' | 'intermediate' | 'expert';

export interface UIContext {
  timeContext: TimeContext;
  userLevel: UserLevel;
  isMoving: boolean;
  lastActivityDetection: Date;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  level: UserLevel;
  metrics: {
    hrvBaseline: number;
    sleepTarget: number;
    trainingZones: number[];
  };
  preferences: {
    language: 'fr' | 'en';
    units: 'metric' | 'imperial';
    privacyLevel: 'strict' | 'moderate' | 'open';
    useVoiceCommands: boolean;
  };
}

// ===== ACTIVITY & TRACKING =====
export interface Activity {
  id: string;
  type: 'training' | 'recovery' | 'sleep' | 'protocol';
  name: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // minutes
  intensity?: 'low' | 'moderate' | 'high';
  metrics?: Record<string, number>;
  notes?: string;
}

// ===== PRIVACY & SECURITY =====
export interface PrivacyZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number; // meters
  type: 'home' | 'work' | 'custom';
}

export interface PrivacySettings {
  zones: PrivacyZone[];
  maskLocationInShare: boolean;
  anonymousComparison: boolean;
  dataRetentionDays: number;
  apiConnections: {
    service: 'oura' | 'garmin' | 'apple_health' | 'whoop' | string;
    connected: boolean;
    lastSync?: Date;
    scopes: string[];
  }[];
}
