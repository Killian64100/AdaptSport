/**
 * Adaptive Coach Intelligence System
 * VFC (Variabilité de la Fréquence Cardiaque / Heart Rate Variability) based protocol selection
 * and personalized recommendations
 */

// ===== VFC ASSESSMENT THRESHOLDS =====
export const VFC_THRESHOLDS = {
  ELITE: 100,           // > 100ms - Elite recovery
  GOOD: 70,             // 70-100ms - Good recovery
  ADEQUATE: 50,         // 50-70ms - Adequate recovery
  COMPROMISED: 30,      // 30-50ms - Compromised recovery
  CRITICAL: 0,          // < 30ms - Critical, need rest
} as const;

export type VFCLevel = 'elite' | 'good' | 'adequate' | 'compromised' | 'critical';

export interface VFCAssessment {
  timestamp: Date;
  vfcValue: number;
  level: VFCLevel;
  trend: 'improving' | 'stable' | 'declining';
  recoveryPercentage: number; // 0-100
  recommendations: string[];
}

// ===== PROTOCOL ADAPTIVITY =====
export type ProtocolCategory = 'activation' | 'endurance' | 'strength' | 'recovery' | 'sleep' | 'stress_management';

export interface AdaptiveProtocol {
  id: string;
  name: string;
  category: ProtocolCategory;
  duration: number; // minutes
  intensity: 'low' | 'moderate' | 'high';
  vfcMinimum: number; // Minimum VFC required to safely perform
  targetOutcome: string;
  estimatedRecoveryTime: number; // hours
  warningMessage?: string; // Show if VFC < threshold
  // Adaptivity scores: 0-100
  adaptivity: {
    lowVFC: number;        // How well suits low VFC states
    mediumVFC: number;     // How well suits medium VFC
    highVFC: number;       // How well suits high VFC
    afterTraining: number; // How good for post-training
    beforeSleep: number;   // How good before sleep
    stressManagement: number; // Effectiveness for stress
  };
}

// ===== RECOVERY STATE =====
export interface RecoveryState {
  vfc: VFCAssessment;
  rhr: number; // Resting Heart Rate
  bodyTemperature: number;
  sleepQuality: number; // 0-100 from previous night
  stressLevel: number; // 0-100
  fatigueLevel: number; // 0-100
  recoveryPercentage: number; // 0-100 overall
  lastWorkoutHoursAgo: number;
  readinessScore: number; // 0-100 for training readiness
}

// ===== ADAPTIVE RECOMMENDATION =====
export interface AdaptiveRecommendation {
  protocol: AdaptiveProtocol;
  confidence: number; // 0-100
  reasoning: string;
  riskFactors: string[];
  expectedBenefits: string[];
  doNotRecommendReason?: string;
  alternativeProtocols: AdaptiveProtocol[];
}

// ===== ASSESSMENT FUNCTIONS =====

/**
 * Assess VFC level based on absolute value
 */
export function assessVFCLevel(vfcValue: number): VFCLevel {
  if (vfcValue > VFC_THRESHOLDS.ELITE) return 'elite';
  if (vfcValue >= VFC_THRESHOLDS.GOOD) return 'good';
  if (vfcValue >= VFC_THRESHOLDS.ADEQUATE) return 'adequate';
  if (vfcValue >= VFC_THRESHOLDS.COMPROMISED) return 'compromised';
  return 'critical';
}

/**
 * Calculate recovery percentage (0-100) based on VFC
 */
export function calculateRecoveryPercentage(vfcValue: number, baseline: number): number {
  const percentage = (vfcValue / baseline) * 100;
  return Math.min(100, Math.max(0, percentage));
}

/**
 * Assess VFC trend from historical data
 */
export function assessVFCTrend(
  currentVFC: number,
  previousVFC: number,
  twoSessionsAgoVFC: number
): 'improving' | 'stable' | 'declining' {
  const change1 = currentVFC - previousVFC;
  const change2 = previousVFC - twoSessionsAgoVFC;

  if (change1 > 5 && change2 > 2) return 'improving';
  if (change1 < -5 && change2 < -2) return 'declining';
  return 'stable';
}

/**
 * Get recommendations based on VFC level
 */
export function getVFCRecommendations(level: VFCLevel): string[] {
  const recommendations: Record<VFCLevel, string[]> = {
    elite: [
      'Excellent recovery - suitable for high intensity training',
      'Consider challenging workouts or speed sessions',
      'Good window for competitions',
    ],
    good: [
      'Good recovery - can handle moderate to high intensity',
      'Mix of hard work and recovery activities',
      'Optimal for structured training',
    ],
    adequate: [
      'Moderate recovery - focus on quality over quantity',
      'Suitable for moderate intensity training',
      'Include recovery protocols between sessions',
    ],
    compromised: [
      'Limited recovery - avoid high intensity work',
      'Focus on active recovery and mobility',
      'Prioritize sleep and stress management',
      'Consider lighter training protocols',
    ],
    critical: [
      '⚠️ Very low recovery - REST RECOMMENDED',
      'Avoid training - focus on complete recovery',
      'Implement sleep, nutrition, and stress management',
      'Only gentle mobility or breathing work',
    ],
  };

  return recommendations[level];
}

/**
 * Generate VFC assessment from raw data
 */
export function generateVFCAssessment(
  vfcValue: number,
  baseline: number,
  previousVFC: number,
  twoSessionsAgoVFC: number
): VFCAssessment {
  const level = assessVFCLevel(vfcValue);
  const trend = assessVFCTrend(vfcValue, previousVFC, twoSessionsAgoVFC);
  const recoveryPercentage = calculateRecoveryPercentage(vfcValue, baseline);

  return {
    timestamp: new Date(),
    vfcValue,
    level,
    trend,
    recoveryPercentage,
    recommendations: getVFCRecommendations(level),
  };
}

// ===== PROTOCOL RECOMMENDATION ENGINE =====

/**
 * Score protocol compatibility with current recovery state
 */
export function scoreProtocolForState(
  protocol: AdaptiveProtocol,
  state: RecoveryState
): number {
  let score = 50; // Start at neutral

  // VFC alignment
  const vfcMatch = state.vfc.level;
  if (vfcMatch === 'elite') score += protocol.adaptivity.highVFC * 0.3;
  else if (vfcMatch === 'good') score += protocol.adaptivity.highVFC * 0.25;
  else if (vfcMatch === 'adequate') score += protocol.adaptivity.mediumVFC * 0.25;
  else if (vfcMatch === 'compromised') score += protocol.adaptivity.lowVFC * 0.3;
  else score -= 40; // Critical VFC - avoid training

  // Recovery percentage alignment
  if (state.recoveryPercentage < 50 && state.vfc.level !== 'critical') {
    score += protocol.adaptivity.lowVFC * 0.2;
  }

  // Fatigue consideration
  if (state.fatigueLevel > 70) {
    score -= 20;
  }

  // Stress management contribution
  if (state.stressLevel > 60) {
    score += protocol.adaptivity.stressManagement * 0.15;
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Recommend adaptive protocols based on recovery state
 */
export function recommendProtocols(
  state: RecoveryState,
  availableProtocols: AdaptiveProtocol[],
  limit: number = 3
): AdaptiveRecommendation[] {
  // Filter out dangerous recommendations
  const safeProtocols = availableProtocols.filter(
    (p) => state.vfc.vfcValue >= p.vfcMinimum || state.vfc.level !== 'critical'
  );

  // Score and rank
  const scored = safeProtocols.map((protocol) => ({
    protocol,
    score: scoreProtocolForState(protocol, state),
  }));

  scored.sort((a, b) => b.score - a.score);

  // Generate recommendations
  const recommendations: AdaptiveRecommendation[] = scored.slice(0, limit).map(({ protocol, score }) => {
    const riskFactors: string[] = [];
    const benefits: string[] = [];

    if (state.vfc.vfcValue < protocol.vfcMinimum) {
      riskFactors.push('VFC below recommended minimum - proceed with caution');
    }

    if (state.fatigueLevel > 70) {
      riskFactors.push('High fatigue detected - consider lighter option');
    }

    if (state.stressLevel > 70) {
      benefits.push('Good for stress management');
    }

    if (state.recoveryPercentage < 50) {
      riskFactors.push('Limited recovery - avoid high intensity');
    } else if (state.recoveryPercentage > 80) {
      benefits.push('Excellent recovery window');
    }

    return {
      protocol,
      confidence: score,
      reasoning: `Compatibility score: ${Math.round(score)}% based on VFC level (${state.vfc.level}), recovery state (${state.recoveryPercentage}%), and fatigue (${state.fatigueLevel}%)`,
      riskFactors,
      expectedBenefits: benefits,
      alternativeProtocols: scored
        .filter((s) => s.protocol.id !== protocol.id)
        .slice(0, 2)
        .map((s) => s.protocol),
    };
  });

  return recommendations;
}

/**
 * Calculate readiness score (0-100) for training
 */
export function calculateReadinessScore(state: RecoveryState): number {
  let score = 50;

  // VFC contribution (40%)
  if (state.vfc.level === 'elite') score += 40;
  else if (state.vfc.level === 'good') score += 30;
  else if (state.vfc.level === 'adequate') score += 15;
  else if (state.vfc.level === 'compromised') score -= 15;
  else score -= 40;

  // Sleep quality contribution (30%)
  score += (state.sleepQuality / 100) * 30;

  // Stress level contribution (20%)
  if (state.stressLevel > 70) score -= 15;
  else if (state.stressLevel > 50) score -= 5;

  // Fatigue contribution (10%)
  if (state.fatigueLevel > 70) score -= 10;

  return Math.max(0, Math.min(100, Math.round(score)));
}
