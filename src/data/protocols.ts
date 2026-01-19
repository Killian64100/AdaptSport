// Centralized data for all library protocols

export interface Protocol {
  id: string
  name: string
  category: 'breathing' | 'cold' | 'sleep' | 'nutrition' | 'activity' | 'mobility' | 'stretching'
  duration: string
  durationSeconds: number
  description: string
  completed: number
  total: number
  steps: string[]
  benefits: string[]
  references: string[]
}

export const protocolsData: Protocol[] = [
  {
    id: 'wim-hof',
    name: 'Wim Hof Breathing',
    category: 'breathing',
    duration: '10 min',
    durationSeconds: 600,
    description: 'Breathing technique to increase oxygenation and reduce stress',
    completed: 3,
    total: 10,
    steps: [
      '30 deep and rapid breaths',
      'Breath retention with empty lungs (1-2 min)',
      'Deep inhalation + 15-second retention',
      'Repeat for 3-4 cycles',
    ],
    benefits: [
      'Increased energy levels',
      'Stress reduction',
      'Enhanced concentration',
      'Immune system strengthening',
    ],
    references: [
      'Kox M. et al. (2014) - PNAS',
      'Buijze GA. et al. (2016) - PLoS One',
    ],
  },
  {
    id: 'cold-exposure',
    name: 'Cold Exposure',
    category: 'cold',
    duration: '5 min',
    durationSeconds: 300,
    description: 'Progressive cold shower protocol for immune boost and recovery',
    completed: 7,
    total: 10,
    steps: [
      'Start with a warm shower (2 min)',
      'Gradually transition to cold water',
      'Maintain cold water exposure (15-30 sec to begin)',
      'Breathe calmly and steadily',
      'Progressively increase duration daily',
    ],
    benefits: [
      'Immune system boost',
      'Enhanced muscle recovery',
      'Increased alertness',
      'Reduced inflammation',
      'Improved blood circulation',
    ],
    references: [
      'Buijze GA. et al. (2016) - PLoS One',
      'Shevchuk NA. (2008) - Medical Hypotheses',
      'Bleakley C. et al. (2012) - Cochrane Database',
    ],
  },
  {
    id: 'sleep-hygiene',
    name: 'Sleep Hygiene Routine',
    category: 'sleep',
    duration: '30 min',
    durationSeconds: 1800,
    description: 'Preparation protocol for deep and restorative sleep',
    completed: 5,
    total: 10,
    steps: [
      'Stop screen exposure 1 hour before bedtime',
      'Lower bedroom temperature (64-66°F / 18-19°C)',
      'Take a warm shower',
      'Practice 10 minutes of meditation or reading',
      'Use a sleep mask if necessary',
      'Maintain consistent bedtime schedule',
    ],
    benefits: [
      'Improved sleep quality',
      'Faster sleep onset',
      'Increased deep sleep',
      'Enhanced physical recovery',
      'Reduced stress and anxiety',
    ],
    references: [
      'Walker M. (2017) - Why We Sleep',
      'Irish LA. et al. (2015) - Sleep Medicine Reviews',
      'Shechter A. et al. (2018) - Proceedings of the National Academy of Sciences',
    ],
  },
  {
    id: 'fasting',
    name: 'Intermittent Fasting 16:8',
    category: 'nutrition',
    duration: '16h',
    durationSeconds: 57600,
    description: 'Optimized eating window for autophagy and metabolic health',
    completed: 2,
    total: 10,
    steps: [
      'Last meal before 8:00 PM',
      'Fast from 8:00 PM to 12:00 PM next day (16h)',
      'Abundant hydration (water, tea, black coffee)',
      'First meal at 12:00 PM (8-hour window)',
      'Two balanced meals between 12:00 PM and 8:00 PM',
      'Listen to your hunger and adjust as needed',
    ],
    benefits: [
      'Cellular autophagy activation',
      'Improved insulin sensitivity',
      'Body fat loss',
      'Enhanced mental clarity',
      'Reduced inflammation',
      'Optimized athletic performance',
    ],
    references: [
      'Mattson MP. et al. (2017) - Ageing Research Reviews',
      'Anton SD. et al. (2018) - Obesity',
      'Patterson RE. et al. (2015) - Annual Review of Nutrition',
    ],
  },
]

// Fonction utilitaire pour récupérer un protocole par ID
export function getProtocolById(id: string): Protocol | undefined {
  return protocolsData.find(p => p.id === id)
}

// Fonction pour ajouter un nouveau protocole dynamiquement
export function addProtocol(protocol: Protocol): Protocol[] {
  // Cette fonction serait utilisée avec un store Zustand ou Context
  return [...protocolsData, protocol]
}
