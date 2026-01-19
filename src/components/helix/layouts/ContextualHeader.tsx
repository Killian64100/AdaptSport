'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CloudSun,
  Moon,
  CloudRain,
  Sun,
  Wind,
} from '@phosphor-icons/react'
import { useContextMode } from '@/hooks/useContextMode'

interface ContextualHeaderProps {
  userName: string
  readinessScore: number
  status: 'optimal' | 'attention' | 'critical'
}

interface WeatherData {
  temp: number
  condition: 'sunny' | 'cloudy' | 'rainy' | 'windy'
  icon: React.ElementType
}

// Simulation API météo
const fetchWeatherData = async (): Promise<WeatherData> => {
  // Simule un délai réseau
  await new Promise(resolve => setTimeout(resolve, 800))

  const conditions: WeatherData['condition'][] = ['sunny', 'cloudy', 'rainy', 'windy']
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)]

  const iconMap = {
    sunny: Sun,
    cloudy: CloudSun,
    rainy: CloudRain,
    windy: Wind,
  }

  return {
    temp: Math.floor(Math.random() * 15) + 10, // 10-25°C
    condition: randomCondition,
    icon: iconMap[randomCondition],
  }
}

export default function ContextualHeader({
  userName,
  readinessScore,
  status,
}: ContextualHeaderProps) {
  const { mode } = useContextMode()
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [isLoadingWeather, setIsLoadingWeather] = useState(true)

  useEffect(() => {
    // Fetch weather seulement en mode morning
    if (mode === 'morning') {
      setIsLoadingWeather(true)
      fetchWeatherData().then(data => {
        setWeather(data)
        setIsLoadingWeather(false)
      })
    }
  }, [mode])

  // Greeting based on contextual mode
  const getGreeting = () => {
    const hour = new Date().getHours()

    if (mode === 'morning' || (hour >= 5 && hour < 12)) {
      return 'Good morning'
    } else if (mode === 'evening' || hour >= 20 || hour < 5) {
      return 'Good evening'
    }
    return 'Hello'
  }

  // Contextual message based on score and mode
  const getMessage = () => {
    if (mode === 'evening') {
      return 'Time to recover'
    }

    if (status === 'optimal') return 'Ready to perform'
    if (status === 'attention') return 'Listen to your body today'
    return 'Recovery recommended'
  }

  // Couleur du texte selon mode
  const getTextColor = () => {
    if (mode === 'evening') return 'text-signal-caution' // Tons chauds
    return 'text-text-highest'
  }

  const WeatherIcon = weather?.icon || CloudSun

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="px-4 pb-6 pt-12"
      style={{ paddingTop: 'max(3rem, env(safe-area-inset-top))' }}
    >
      <div className="flex items-start justify-between">
        {/* Greeting & Status */}
        <div className="flex-1">
          <motion.h1
            key={mode} // Re-animate on mode change
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`mb-1 font-display text-display-s ${getTextColor()}`}
          >
            {getGreeting()}, {userName}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-body-m text-text-medium"
          >
            {getMessage()}
          </motion.p>
        </div>

        {/* Weather Widget (Morning mode only) */}
        <AnimatePresence mode="wait">
          {mode === 'morning' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 20 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2 rounded-lg bg-surface-card px-3 py-2"
            >
              {isLoadingWeather ? (
                // Skeleton loading
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 animate-pulse rounded-full bg-surface-elevated" />
                  <div className="h-4 w-10 animate-pulse rounded bg-surface-elevated" />
                </div>
              ) : (
                <>
                  <WeatherIcon
                    size={20}
                    weight="fill"
                    className="text-signal-caution"
                  />
                  <span className="text-body-s font-medium text-text-high">
                    {weather?.temp}°C
                  </span>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Moon Icon (Evening mode) */}
        <AnimatePresence mode="wait">
          {mode === 'evening' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -30 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: -30 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2 rounded-lg bg-surface-card px-3 py-2"
            >
              <Moon size={20} weight="fill" className="text-data-deep" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
