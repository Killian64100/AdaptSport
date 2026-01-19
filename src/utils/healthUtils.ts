/**
 * Génération de résumés statiques basés sur les données de santé
 * Utilisé comme fallback quand l'API AI est indisponible
 */

/**
 * Convertit un format "7h30" en nombre décimal (7.5)
 */
export function parseSleepTime(timeStr: string | number): number {
  if (typeof timeStr === 'number') return timeStr
  
  const match = timeStr.match(/^(\d+)h(\d+)?$/)
  if (!match) return 7.5 // Default fallback
  
  const hours = parseInt(match[1], 10)
  const minutes = match[2] ? parseInt(match[2], 10) : 0
  
  return hours + minutes / 60
}

/**
 * Convertit un nombre décimal en format "7h30"
 */
export function formatSleepTime(hours: number): string {
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  return m === 0 ? `${h}h00` : `${h}h${m.toString().padStart(2, '0')}`
}

interface HealthData {
  recovery: number
  strain: number
  hrv: number
  rhr: number
  sleep: number | string
  spo2: number
  calories: number
}

/**
 * Generates a smart static summary based on health metrics
 * @param data - Current health data
 * @returns Simple and accessible text summary
 */
export function getStaticSummary(data: HealthData): string {
  const { recovery, strain, hrv, rhr } = data
  
  // Parse sleep if it's in string format
  const sleep = parseSleepTime(data.sleep)
  const sleepDisplay = typeof data.sleep === 'string' ? data.sleep : formatSleepTime(data.sleep)

  // Determine general state based on recovery
  let generalState = ''
  let recommendation = ''

  if (recovery >= 75) {
    generalState = `Your body recovered well (${recovery}%), you're ready for an intense session today`
    recommendation = `Go for cardio or weights! Your HRV is good (${hrv}ms) and your heart is at rest (${rhr} bpm).`
  } else if (recovery >= 50) {
    generalState = `You're in decent shape (${recovery}%), but your body needs moderation`
    recommendation = `Favor light to moderate training. Your HRV of ${hrv}ms indicates you're still recovering.`
  } else {
    generalState = `You're a bit tired today (${recovery}%), take it easy`
    recommendation = `Favor walking or yoga rather than intense effort. Your body needs rest.`
  }

  // Analyze yesterday's strain
  let strainComment = ''
  if (strain > 15) {
    strainComment = ` Yesterday's effort was intense (Strain ${strain}).`
  } else if (strain > 10) {
    strainComment = ` You moved well yesterday (Strain ${strain}).`
  }

  // Analyze sleep
  let sleepComment = ''
  if (sleep < 6.5) {
    sleepComment = ` Warning, you didn't sleep enough (${sleepDisplay}). Try to go to bed earlier tonight.`
  } else if (sleep >= 7.5) {
    sleepComment = ` Good sleep last night (${sleepDisplay})!`
    sleepComment = ` Good sleep last night (${sleep}h)!`
  }

  return `${generalState}. ${recommendation}${strainComment}${sleepComment}`
}

/**
 * Generates a detailed static summary for the details page
 * @param data - Current health data
 * @returns Object with analysis and glossary
 */
export function getStaticDetailedSummary(data: HealthData): {
  analysis: string
  glossary: { term: string; definition: string }[]
} {
  const { recovery, strain, hrv, rhr, sleep, spo2, calories } = data

  const analysis = `**Overall state:** Your recovery score of **${recovery}%** combines your HRV (${hrv}ms), resting heart rate (${rhr} bpm), sleep (${sleep}h), and oxygenation (${spo2}%). This score indicates that ${
    recovery >= 75
      ? 'your body is well-rested and ready for significant effort'
      : recovery >= 50
      ? 'your body is in moderate condition, favor light training'
      : 'your body needs rest, limit intense efforts'
  }.

**Weekly trend:** Your current Strain is **${strain}**, indicating ${
    strain > 15
      ? 'high load on your cardiovascular system'
      : strain > 10
      ? 'moderate to intense activity'
      : 'light activity'
  }. Your energy expenditure is **${calories} kcal** today.`

  const glossary = [
    {
      term: 'How is Recovery calculated?',
      definition:
        "Your recovery score combines multiple data points: your HRV (variation between heartbeats), resting heart rate, sleep quality, and oxygenation level (SpO2). The algorithm compares all this to your usual values and recent training load.",
    },
    {
      term: 'What is HRV used for daily?',
      definition:
        "Your HRV tells you if your body is ready for effort or needs rest. High HRV = balanced nervous system = you can train hard. Low HRV = your body is stressed or tired = go easy.",
    },
    {
      term: 'Why monitor Strain?',
      definition:
        "Strain measures how much you stress your heart during the day. It's like an effort counter that increases as you do activities. If your Strain is high for several days in a row while your recovery is low, it's a signal to ease off.",
    },
    {
      term: 'How to interpret my Sleep?',
      definition:
        'The sensor analyzes your total sleep duration, but also its quality (deep phases, movement). Good sleep (7h30+) increases your recovery. Short sleep (<6h) drops it, even if you feel fine.',
    },
  ]

  return { analysis, glossary }
}
