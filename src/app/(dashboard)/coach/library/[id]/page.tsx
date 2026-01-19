'use client'

import { useState, use } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'
import ProtocolTimer from '@/components/features/coach/ProtocolTimer'
import { getProtocolById } from '@/data/protocols'

interface ProtocolDetailPageProps {
  params: Promise<{ id: string }>
}

export default function ProtocolDetailPage({ params }: ProtocolDetailPageProps) {
  const router = useRouter()
  const { id } = use(params)
  const [isActive, setIsActive] = useState(false)

  // Récupérer les données du protocole depuis le fichier centralisé
  const protocolData = getProtocolById(id)
  
  // Rediriger si protocole non trouvé
  if (!protocolData) {
    router.push('/coach')
    return null
  }

  const protocol = {
    name: protocolData.name,
    description: protocolData.description,
    duration: protocolData.durationSeconds,
    category: protocolData.category,
    steps: protocolData.steps,
    benefits: protocolData.benefits,
    references: protocolData.references,
  }

  return (
    <div className="min-h-screen bg-surface-void pb-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 pb-6 pt-12"
        style={{ paddingTop: 'max(3rem, env(safe-area-inset-top))' }}
      >
        <button
          onClick={() => router.push('/coach?tab=library')}
          className="mb-4 flex items-center gap-2 text-body-m text-brand-electric"
        >
          <ArrowLeft size={20} weight="bold" />
          Library
        </button>

        <h1 className="font-display text-display-s text-text-highest">
          {protocol.name}
        </h1>
        <p className="mt-2 text-body-m text-text-medium">
          {protocol.description}
        </p>
      </motion.header>

      <div className="space-y-6 px-4">
        {/* Timer or Static Icon */}
        {protocol.duration > 0 ? (
          <ProtocolTimer
            duration={protocol.duration}
            isActive={isActive}
            onToggle={() => setIsActive(!isActive)}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center rounded-xl bg-surface-card py-12"
          >
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-surface-elevated">
              {protocol.category === 'sleep' && (
                <span className="text-5xl">🌙</span>
              )}
              {protocol.category === 'nutrition' && (
                <span className="text-5xl">🍽️</span>
              )}
              {protocol.category === 'cold' && (
                <span className="text-5xl">❄️</span>
              )}
              {protocol.category === 'breathing' && (
                <span className="text-5xl">🌬️</span>
              )}
            </div>
            <p className="text-body-m text-text-medium">Protocole sans durée fixe</p>
          </motion.div>
        )}

        {/* Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl bg-surface-card p-6"
        >
          <h3 className="mb-4 font-display text-body-l font-semibold text-text-highest">
            Steps
          </h3>
          <ol className="space-y-3">
            {protocol.steps.map((step, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-electric text-caption font-bold text-surface-void">
                  {index + 1}
                </span>
                <span className="text-body-m text-text-high">{step}</span>
              </li>
            ))}
          </ol>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl bg-surface-card p-6"
        >
          <h3 className="mb-4 font-display text-body-l font-semibold text-text-highest">
            Benefits
          </h3>
          <ul className="space-y-2">
            {protocol.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-signal-success" />
                <span className="text-body-m text-text-high">{benefit}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* References */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl bg-surface-card p-6"
        >
          <h3 className="mb-4 font-display text-body-l font-semibold text-text-highest">
            Scientific References
          </h3>
          <ul className="space-y-2">
            {protocol.references.map((ref, index) => (
              <li key={index} className="text-body-s text-text-medium">
                {ref}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  )
}
