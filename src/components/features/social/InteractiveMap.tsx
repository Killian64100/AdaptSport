'use client'

import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import './leaflet-custom.css'

interface MapMarker {
  position: { lat: number; lng: number }
  label: string
  type: 'user' | 'contact'
  avatar?: string
}

interface InteractiveMapProps {
  center?: { lat: number; lng: number }
  markers?: MapMarker[]
  selectedContact?: { name: string; avatar: string; position: { lat: number; lng: number } } | null
  onMapReady?: () => void
}

// Coordonnées GPS réelles
const DEFAULT_CENTER: [number, number] = [47.4784, -0.5632] // Angers, France

// Coordonnées permanentes des contacts
const CONTACT_POSITIONS: { [key: string]: [number, number] } = {
  'Alice M.': [47.4790, -0.5620], // ~500m au nord-est
  'David K.': [47.4770, -0.5650], // ~500m au sud-ouest
}

// Custom marker icon - Simple label
const createCustomIcon = (label: string, type: 'user' | 'contact', isSelected: boolean = false) => {
  const className = type === 'user' 
    ? 'custom-marker-label' 
    : isSelected 
      ? 'custom-marker-label contact selected' 
      : 'custom-marker-label contact'
  
  return L.divIcon({
    html: `<div class="${className}">${label}</div>`,
    className: 'custom-marker',
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  })
}

// Component to handle map centering with animation
function MapController({ selectedContact }: { selectedContact: InteractiveMapProps['selectedContact'] }) {
  const map = useMap()

  useEffect(() => {
    if (selectedContact?.name && CONTACT_POSITIONS[selectedContact.name]) {
      const position = CONTACT_POSITIONS[selectedContact.name]
      // flyTo pour animation fluide
      map.flyTo(position, 16, {
        duration: 1.2,
        easeLinearity: 0.25,
      })
    }
  }, [selectedContact, map])

  return null
}

export default function InteractiveMap({
  center,
  markers = [],
  selectedContact = null,
  onMapReady,
}: InteractiveMapProps) {
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (mapRef.current) {
      onMapReady?.()
    }
  }, [onMapReady])

  const mapCenter = center 
    ? [center.lat, center.lng] as [number, number]
    : DEFAULT_CENTER

  return (
    <div className="relative overflow-hidden rounded-xl" style={{ height: '400px' }}>
      <MapContainer
        center={mapCenter}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        ref={mapRef}
      >
        {/* TileLayer - CartoDB Voyager pour voir l'eau en bleu et les parcs en vert */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* MapController for animated centering */}
        <MapController selectedContact={selectedContact} />

        {/* Marker "You" - Fixed position at Angers */}
        <Marker
          position={DEFAULT_CENTER}
          icon={createCustomIcon('You', 'user')}
        />

        {/* Contact markers - Positions fixes sur la carte */}
        {markers.filter(m => m.type === 'contact').map((marker, index) => {
          const position = CONTACT_POSITIONS[marker.label] || DEFAULT_CENTER
          const isSelected = selectedContact?.name === marker.label
          const firstName = marker.label.split(' ')[0]

          return (
            <Marker
              key={`${marker.label}-${index}`}
              position={position}
              icon={createCustomIcon(firstName, 'contact', isSelected)}
            />
          )
        })}
      </MapContainer>
    </div>
  )
}
