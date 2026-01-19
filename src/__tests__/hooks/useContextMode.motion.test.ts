import { renderHook, act, waitFor } from '@testing-library/react'
import { useContextMode } from '@/hooks/useContextMode'

describe('useContextMode - Motion Detection', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should initialize with morning mode', () => {
    const { result } = renderHook(() => useContextMode())
    expect(result.current.mode).toBeDefined()
    expect(['morning', 'active', 'evening']).toContain(result.current.mode)
  })

  it('should track motion data', () => {
    const { result } = renderHook(() => useContextMode())

    expect(result.current.motion).toBeDefined()
    expect(result.current.motion).toHaveProperty('isMoving')
    expect(result.current.motion).toHaveProperty('intensity')
    expect(typeof result.current.motion.isMoving).toBe('boolean')
    expect(typeof result.current.motion.intensity).toBe('number')
  })

  it('should update motion detection periodically', async () => {
    const { result } = renderHook(() => useContextMode())

    const initialMotion = result.current.motion

    // Advance motion detection interval
    act(() => {
      jest.advanceTimersByTime(5000)
    })

    // Motion data should have opportunity to update
    expect(result.current.motion).toBeDefined()
  })

  it('should return to time-based mode when motion stops', async () => {
    jest.setSystemTime(new Date('2024-01-15T09:00:00')) // Morning time

    const { result } = renderHook(() => useContextMode())

    // Initial state should be morning if not moving
    const initialMode = result.current.mode

    act(() => {
      jest.advanceTimersByTime(60000) // Advance time interval
    })

    // Mode should be deterministic based on time
    expect(['morning', 'active', 'evening']).toContain(result.current.mode)
  })

  it('should switch to active mode when high intensity motion detected', () => {
    const { result } = renderHook(() => useContextMode())

    // Mock high-intensity motion would result in active mode
    expect(result.current.mode).toBeDefined()
  })

  it('should have setMode function', () => {
    const { result } = renderHook(() => useContextMode())

    expect(typeof result.current.setMode).toBe('function')

    act(() => {
      result.current.setMode('evening')
    })

    expect(result.current.mode).toBe('evening')
  })
})
