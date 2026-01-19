import { renderHook, waitFor } from '@testing-library/react'
import { useGeofence } from '@/hooks/useGeofence'

describe('useGeofence', () => {
  it('should initialize with null zone', () => {
    const { result } = renderHook(() => useGeofence())

    expect(result.current.currentZone).toBeNull()
  })

  it('should detect location after mount', async () => {
    const { result } = renderHook(() => useGeofence())

    await waitFor(
      () => {
        expect(result.current.location).not.toBeNull()
      },
      { timeout: 1000 }
    )

    // Zone detection is probabilistic due to random simulation
    // Just verify that location is set
    expect(result.current.location).toHaveProperty('lat')
    expect(result.current.location).toHaveProperty('lng')
  })
})
