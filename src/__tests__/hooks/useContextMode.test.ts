import { renderHook, act } from '@testing-library/react'
import { useContextMode } from '@/hooks/useContextMode'

describe('useContextMode', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should return morning mode between 5h-10h', () => {
    // Mock time to 8:00 AM
    jest.setSystemTime(new Date('2024-01-15T08:00:00'))

    const { result } = renderHook(() => useContextMode())

    expect(result.current.mode).toBe('morning')
  })

  it('should return evening mode after 20h', () => {
    // Mock time to 21:00 PM
    jest.setSystemTime(new Date('2024-01-15T21:00:00'))

    const { result } = renderHook(() => useContextMode())

    expect(result.current.mode).toBe('evening')
  })

  it('should update mode when time changes', () => {
    jest.setSystemTime(new Date('2024-01-15T08:00:00'))

    const { result, rerender } = renderHook(() => useContextMode())
    expect(result.current.mode).toBe('morning')

    // Fast forward time to 21:00
    act(() => {
      jest.setSystemTime(new Date('2024-01-15T21:00:00'))
      jest.advanceTimersByTime(60000) // Trigger interval
    })

    rerender()
    expect(result.current.mode).toBe('evening')
  })
})
