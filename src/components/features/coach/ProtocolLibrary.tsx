'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Wind, Snowflake, Moon, ForkKnife, Trash } from '@phosphor-icons/react'
import { protocolsData } from '@/data/protocols'
import { useProtocolStore } from '@/store/useProtocolStore'

interface ProtocolDisplay {
  id: string
  name: string
  category: 'breathing' | 'cold' | 'sleep' | 'nutrition'
  duration: string
  icon: React.ElementType
  description: string
  completed: number
  total: number
}

// Mapper les icônes aux catégories (avec support de 'activity' pour mobilité/étirement)
const iconMap: Record<string, React.ElementType> = {
  breathing: Wind,
  cold: Snowflake,
  sleep: Moon,
  nutrition: ForkKnife,
  activity: Wind, // Par défaut, on utilise Wind pour activité
}

// 5 catégories fixes maximum
const categories = [
  { id: 'all', label: 'All' },
  { id: 'breathing', label: 'Breathing' },
  { id: 'cold', label: 'Cold' },
  { id: 'sleep', label: 'Sleep' },
  { id: 'nutrition', label: 'Nutrition' },
]

export default function ProtocolLibrary() {
  const router = useRouter()
  const { userProtocols, removeProtocol } = useProtocolStore()
  const [activeCategory, setActiveCategory] = useState('all')

  // Si l'utilisateur n'a pas encore de protocoles, utiliser les protocoles par défaut
  const protocols: ProtocolDisplay[] = (userProtocols.length > 0 ? userProtocols : protocolsData).map(p => ({
    id: p.id,
    name: p.name,
    category: p.category as 'breathing' | 'cold' | 'sleep' | 'nutrition',
    duration: p.duration,
    icon: iconMap[p.category] || Wind, // Fallback vers Wind si catégorie inconnue
    description: p.description,
    completed: p.completed,
    total: p.total,
  }))

  const filteredProtocols =
    activeCategory === 'all'
      ? protocols
      : protocols.filter(p => p.category === activeCategory)

  const handleDelete = (e: React.MouseEvent, protocolId: string) => {
    e.stopPropagation() // Prevent navigation when clicking delete
    if (confirm('Are you sure you want to delete this protocol?')) {
      removeProtocol(protocolId)
    }
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex-shrink-0 rounded-full px-4 py-2 text-body-s font-medium transition-colors ${
              activeCategory === category.id
                ? 'bg-brand-electric text-surface-void'
                : 'bg-surface-card text-text-medium hover:bg-surface-elevated hover:text-text-high'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Protocol Cards */}
      <div className="grid gap-4">
        {filteredProtocols.map((protocol, index) => {
          const Icon = protocol.icon
          const progress = (protocol.completed / protocol.total) * 100

          return (
            <motion.button
              key={protocol.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(`/coach/library/${protocol.id}`)}
              className="relative rounded-xl bg-surface-card p-6 text-left transition-colors hover:bg-surface-elevated"
            >
              {/* Delete Button */}
              {userProtocols.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => handleDelete(e, protocol.id)}
                  className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-surface-elevated text-signal-critical transition-colors hover:bg-signal-critical hover:text-surface-void"
                  title="Delete protocol"
                >
                  <Trash size={16} weight="bold" />
                </motion.button>
              )}

              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-surface-elevated">
                  <Icon size={24} weight="bold" className="text-brand-electric" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h3 className="font-display text-body-l font-semibold text-text-highest">
                        {protocol.name}
                      </h3>
                      <p className="mt-1 text-body-s text-text-medium">
                        {protocol.description}
                      </p>
                    </div>
                    <span className="ml-4 flex-shrink-0 text-caption text-text-low">
                      {protocol.duration}
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-caption">
                      <span className="text-text-medium">Progress</span>
                      <span className="font-mono text-text-high">
                        {protocol.completed}/{protocol.total}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-surface-elevated">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                        className="h-full bg-brand-electric"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
