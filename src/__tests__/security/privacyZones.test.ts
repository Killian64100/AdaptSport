import { describe, it, expect } from 'vitest'

/**
 * Haversine formula to calculate distance between two GPS coordinates
 * Returns distance in meters
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000 // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lng2 - lng1) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) *
      Math.cos(φ2) *
      Math.sin(Δλ / 2) *
      Math.sin(Δλ / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Check if a point is within a privacy zone
 */
export function isPointInZone(
  pointLat: number,
  pointLng: number,
  zoneLat: number,
  zoneLng: number,
  radiusMeters: number
): boolean {
  const distance = haversineDistance(pointLat, pointLng, zoneLat, zoneLng)
  return distance <= radiusMeters
}

/**
 * Mask a coordinate point with a random offset
 * Offset is ±20% of the zone radius
 */
export function maskCoordinate(
  lat: number,
  lng: number,
  radiusMeters: number
): { lat: number; lng: number } {
  const offsetPercent = 0.2 // ±20%
  const maxOffsetMeters = radiusMeters * offsetPercent

  // Random offset in meters
  const offsetMeters = (Math.random() - 0.5) * 2 * maxOffsetMeters
  const angleRad = Math.random() * 2 * Math.PI

  // Convert meter offset to degrees (rough approximation)
  const metersPerDegreeLat = 111000 // ~111km per degree latitude
  const metersPerDegreeLng =
    111000 * Math.cos((lat * Math.PI) / 180) // Varies by latitude

  const latOffset = (offsetMeters / metersPerDegreeLat) * Math.cos(angleRad)
  const lngOffset = (offsetMeters / metersPerDegreeLng) * Math.sin(angleRad)

  return {
    lat: lat + latOffset,
    lng: lng + lngOffset,
  }
}

/**
 * Check if a route passes through a privacy zone
 */
export function routeMaskingRequired(
  routePoints: Array<{ lat: number; lng: number }>,
  privacyZones: Array<{
    lat: number
    lng: number
    radiusMeters: number
  }>
): boolean {
  return routePoints.some((point) =>
    privacyZones.some(
      (zone) =>
        isPointInZone(point.lat, point.lng, zone.lat, zone.lng, zone.radiusMeters)
    )
  )
}

// ============================================================================
// TEST SUITE
// ============================================================================

describe('Privacy Zones Security Tests', () => {
  describe('Haversine Distance Calculation', () => {
    it('should calculate correct distance between two coordinates', () => {
      // Paris to London ~340km
      const distance = haversineDistance(48.8566, 2.3522, 51.5074, -0.1278)
      expect(Math.abs(distance - 340000) / 340000).toBeLessThan(0.02) // 2% tolerance
    })

    it('should return 0 for same coordinates', () => {
      const distance = haversineDistance(48.8566, 2.3522, 48.8566, 2.3522)
      expect(distance).toBeLessThan(1) // Less than 1 meter
    })

    it('should handle antipodal points correctly', () => {
      // Half Earth circumference ~20000km
      const distance = haversineDistance(0, 0, 0, 180)
      expect(Math.abs(distance - 20037000) / 20037000).toBeLessThan(0.02)
    })

    it('should be symmetrical (distance A->B = distance B->A)', () => {
      const dist1 = haversineDistance(40.7128, -74.006, 34.0522, -118.2437)
      const dist2 = haversineDistance(34.0522, -118.2437, 40.7128, -74.006)
      expect(Math.abs(dist1 - dist2)).toBeLessThan(1) // Less than 1 meter difference
    })
  })

  describe('Point-in-Zone Detection', () => {
    const zoneCenter = { lat: 48.8566, lng: 2.3522 }

    it('should detect point inside zone', () => {
      const isInside = isPointInZone(
        48.8567, // ~111m north
        2.3522,
        zoneCenter.lat,
        zoneCenter.lng,
        500 // 500m radius
      )
      expect(isInside).toBe(true)
    })

    it('should reject point outside zone', () => {
      const isInside = isPointInZone(
        48.8566,
        2.3622, // ~~7km east
        zoneCenter.lat,
        zoneCenter.lng,
        500
      )
      expect(isInside).toBe(false)
    })

    it('should accept point on zone boundary', () => {
      // Point exactly 500m away
      const distance = 500
      const offsetLat = distance / 111000
      const pointLat = zoneCenter.lat + offsetLat

      const isInside = isPointInZone(
        pointLat,
        zoneCenter.lng,
        zoneCenter.lat,
        zoneCenter.lng,
        distance
      )
      expect(isInside).toBe(true)
    })

    it('should handle multiple zones independently', () => {
      const zones = [
        { lat: 48.8566, lng: 2.3522, radiusMeters: 200 }, // Zone 1
        { lat: 48.9, lng: 2.5, radiusMeters: 300 }, // Zone 2
      ]

      const testPoint = { lat: 48.8567, lng: 2.3522 }

      const inZone1 = isPointInZone(
        testPoint.lat,
        testPoint.lng,
        zones[0].lat,
        zones[0].lng,
        zones[0].radiusMeters
      )

      const inZone2 = isPointInZone(
        testPoint.lat,
        testPoint.lng,
        zones[1].lat,
        zones[1].lng,
        zones[1].radiusMeters
      )

      expect(inZone1).toBe(true)
      expect(inZone2).toBe(false)
    })
  })

  describe('Coordinate Masking', () => {
    it('should mask coordinate within expected range', () => {
      const originalLat = 48.8566
      const originalLng = 2.3522
      const radiusMeters = 500

      const masked = maskCoordinate(originalLat, originalLng, radiusMeters)

      // Distance should be less than radius
      const distance = haversineDistance(
        originalLat,
        originalLng,
        masked.lat,
        masked.lng
      )

      expect(distance).toBeLessThan(radiusMeters * 0.2 * 1.5) // Allow some tolerance
    })

    it('should produce deterministic masking within bounds', () => {
      // Multiple masks should all be within the zone
      const originalLat = 48.8566
      const originalLng = 2.3522
      const radiusMeters = 1000

      for (let i = 0; i < 10; i++) {
        const masked = maskCoordinate(originalLat, originalLng, radiusMeters)
        const distance = haversineDistance(
          originalLat,
          originalLng,
          masked.lat,
          masked.lng
        )
        expect(distance).toBeLessThan(radiusMeters * 0.2)
      }
    })

    it('should not mask to exact original location', () => {
      const originalLat = 48.8566
      const originalLng = 2.3522
      const radiusMeters = 500

      const masked = maskCoordinate(originalLat, originalLng, radiusMeters)

      // Should be slightly offset (not exactly same)
      expect(masked.lat).not.toEqual(originalLat)
      expect(masked.lng).not.toEqual(originalLng)
    })
  })

  describe('Route Masking Detection', () => {
    const privacyZone = {
      lat: 48.8566,
      lng: 2.3522,
      radiusMeters: 300,
    }

    it('should detect route passing through privacy zone', () => {
      const route = [
        { lat: 48.85, lng: 2.35 }, // Outside zone
        { lat: 48.8566, lng: 2.3522 }, // Inside zone (center)
        { lat: 48.86, lng: 2.35 }, // Outside zone
      ]

      const needsMasking = routeMaskingRequired(route, [privacyZone])
      expect(needsMasking).toBe(true)
    })

    it('should detect route completely outside privacy zone', () => {
      const route = [
        { lat: 50.0, lng: 2.0 }, // Paris to somewhere else
        { lat: 50.1, lng: 2.1 },
        { lat: 50.2, lng: 2.2 },
      ]

      const needsMasking = routeMaskingRequired(route, [privacyZone])
      expect(needsMasking).toBe(false)
    })

    it('should handle multiple privacy zones in one route', () => {
      const zones = [
        { lat: 48.8566, lng: 2.3522, radiusMeters: 300 }, // Home
        { lat: 48.87, lng: 2.35, radiusMeters: 200 }, // Work
      ]

      const route = [
        { lat: 48.8566, lng: 2.3522 }, // At home
        { lat: 48.87, lng: 2.35 }, // At work
      ]

      const needsMasking = routeMaskingRequired(route, zones)
      expect(needsMasking).toBe(true)
    })

    it('should handle empty route gracefully', () => {
      const route: Array<{ lat: number; lng: number }> = []
      const needsMasking = routeMaskingRequired(route, [privacyZone])
      expect(needsMasking).toBe(false)
    })
  })

  describe('Privacy Zone Boundary Cases', () => {
    it('should handle zones at different latitudes', () => {
      const equatorZone = { lat: 0, lng: 0, radiusMeters: 1000 }
      const polarZone = { lat: 80, lng: 0, radiusMeters: 1000 }

      // Both should calculate correctly despite longitude distortion
      const distEquator = haversineDistance(0, 0, 0.01, 0.01)
      const distPolar = haversineDistance(80, 0, 80.01, 0.01)

      expect(distEquator).toBeGreaterThan(0)
      expect(distPolar).toBeGreaterThan(0)
    })

    it('should handle extremely small radius zones', () => {
      const tinyZone = { lat: 48.8566, lng: 2.3522, radiusMeters: 10 }

      const inside = isPointInZone(
        48.8566,
        2.3522, // Center point
        tinyZone.lat,
        tinyZone.lng,
        tinyZone.radiusMeters
      )

      expect(inside).toBe(true)
    })

    it('should handle very large radius zones', () => {
      const hugeZone = { lat: 48.8566, lng: 2.3522, radiusMeters: 100000 } // 100km

      const inside = isPointInZone(
        48.8566,
        2.4, // ~11km east
        hugeZone.lat,
        hugeZone.lng,
        hugeZone.radiusMeters
      )

      expect(inside).toBe(true)
    })
  })

  describe('Anonymity Protection', () => {
    it('should not reveal exact coordinates in masked location', () => {
      const exactLat = 48.8566
      const exactLng = 2.3522
      const radiusMeters = 500

      const masked = maskCoordinate(exactLat, exactLng, radiusMeters)

      // Verify it's not the exact same
      expect(masked.lat).not.toBe(exactLat)
      expect(masked.lng).not.toBe(exactLng)

      // But should be very close (within zone)
      const distance = haversineDistance(exactLat, exactLng, masked.lat, masked.lng)
      expect(distance).toBeLessThan(radiusMeters * 0.25)
    })

    it('should provide consistent privacy across multiple routes', () => {
      const zones = [
        { lat: 48.8566, lng: 2.3522, radiusMeters: 300 },
        { lat: 48.87, lng: 2.35, radiusMeters: 200 },
      ]

      // Multiple route checks should work consistently
      for (let i = 0; i < 3; i++) {
        const route = [
          { lat: 48.8566, lng: 2.3522 },
          { lat: 48.87, lng: 2.35 },
        ]
        const needsMasking = routeMaskingRequired(route, zones)
        expect(needsMasking).toBe(true)
      }
    })
  })
})
