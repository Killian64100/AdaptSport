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

// Bibliothèque vide par défaut - les protocoles sont ajoutés dynamiquement via l'IA
export const protocolsData: Protocol[] = []

// Fonction utilitaire pour récupérer un protocole par ID
export function getProtocolById(id: string): Protocol | undefined {
  return protocolsData.find(p => p.id === id)
}

// Fonction pour ajouter un nouveau protocole dynamiquement
export function addProtocol(protocol: Protocol): Protocol[] {
  // Cette fonction serait utilisée avec un store Zustand ou Context
  return [...protocolsData, protocol]
}
