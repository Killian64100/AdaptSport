import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Protocol } from '@/data/protocols'

interface CustomProtocolData {
  name: string
  category?: 'breathing' | 'cold' | 'sleep' | 'nutrition' | 'activity' | 'mobility' | 'stretching'
  description?: string
  duration?: string
  durationSeconds?: number
  steps: string[]
  benefits: string[]
  references?: string[]
}

interface ProtocolStore {
  userProtocols: Protocol[]
  addProtocol: (protocol: Protocol) => void
  addCustomProtocol: (protocolData: CustomProtocolData) => Protocol
  removeProtocol: (id: string) => void
  updateProgress: (id: string, completed: number) => void
  hasProtocol: (id: string) => boolean
}

export const useProtocolStore = create<ProtocolStore>()(
  persist(
    (set, get) => ({
      userProtocols: [],
      
      addProtocol: (protocol) => {
        const { userProtocols } = get()
        // Ne pas ajouter si déjà présent
        if (userProtocols.find(p => p.id === protocol.id)) return
        
        set({ 
          userProtocols: [
            ...userProtocols, 
            { ...protocol, completed: 0 } // Commencer à 0% de progression
          ] 
        })
      },
      
      addCustomProtocol: (protocolData) => {
        const { userProtocols } = get()
        
        // Générer un ID unique basé sur le nom + timestamp
        const baseId = protocolData.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Retirer les accents
          .replace(/[^a-z0-9]+/g, '-') // Remplacer espaces et caractères spéciaux par -
          .replace(/^-+|-+$/g, '') // Retirer les tirets au début et fin
        
        const timestamp = Date.now()
        const uniqueId = `${baseId}-${timestamp}`
        
        // Créer le protocole complet avec valeurs par défaut
        const newProtocol: Protocol = {
          id: uniqueId,
          name: protocolData.name,
          category: protocolData.category || 'breathing',
          duration: protocolData.duration || '15 min',
          durationSeconds: protocolData.durationSeconds || 900,
          description: protocolData.description || protocolData.name,
          completed: 0,
          total: 10,
          steps: protocolData.steps,
          benefits: protocolData.benefits,
          references: protocolData.references || [],
        }
        
        // Vérifier si déjà présent (ne devrait pas arriver avec timestamp)
        if (userProtocols.find(p => p.id === uniqueId)) {
          console.warn('Protocol already exists:', uniqueId)
          return newProtocol
        }
        
        set({ 
          userProtocols: [...userProtocols, newProtocol] 
        })
        
        return newProtocol
      },
      
      removeProtocol: (id) => {
        set({ 
          userProtocols: get().userProtocols.filter(p => p.id !== id) 
        })
      },
      
      updateProgress: (id, completed) => {
        set({
          userProtocols: get().userProtocols.map(p =>
            p.id === id ? { ...p, completed } : p
          ),
        })
      },
      
      hasProtocol: (id) => {
        return get().userProtocols.some(p => p.id === id)
      },
    }),
    {
      name: 'protocol-library-storage',
    }
  )
)
