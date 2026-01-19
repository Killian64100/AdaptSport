'use client'

import { useState, useEffect } from 'react'

export interface Location {
  lat: number
  lng: number
}

export interface GeofenceZone {
  name: string
  lat: number
  lng: number
  radius: number // meters
  action: string
}

// Zones prédéfinies (simulées)
const geofenceZones: GeofenceZone[] = [
  {
    name: 'Salle de Sport',
    lat: 48.8566,
    lng: 2.3522,
    radius: 100,
    action: 'gym',
  },
  {
    name: 'Domicile',
    lat: 48.8606,
    lng: 2.3376,
    radius: 50,
    action: 'home',
  },
]

// Calcul distance Haversine
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371e3 // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lng2 - lng1) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

export function useGeofence() {
  const [currentZone, setCurrentZone] = useState<string | null>(null)
  const [location, setLocation] = useState<Location | null>(null)

  useEffect(() => {
    // Simulation: Position aléatoire autour de Paris
    const simulateLocation = () => {
      const baseLat = 48.8566
      const baseLng = 2.3522
      const randomOffset = () => (Math.random() - 0.5) * 0.01

      const newLocation = {
        lat: baseLat + randomOffset(),
        lng: baseLng + randomOffset(),
      }

      setLocation(newLocation)

      // Vérifier si dans une zone
      const zone = geofenceZones.find(zone => {
        const distance = calculateDistance(
          newLocation.lat,
          newLocation.lng,
          zone.lat,
          zone.lng
        )
        return distance <= zone.radius
      })

      setCurrentZone(zone ? zone.action : null)
    }

    // Simulate initial position
    simulateLocation()

    // Update position every 10 seconds (simulate movement)
    const interval = setInterval(simulateLocation, 10000)

    return () => clearInterval(interval)
  }, [])

  return { currentZone, location }
}
