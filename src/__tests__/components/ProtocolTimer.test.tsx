import { render, screen, fireEvent, act } from '@testing-library/react'
import ProtocolTimer from '@/components/features/coach/ProtocolTimer'

describe('ProtocolTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('displays initial time correctly', () => {
    const mockToggle = jest.fn()
    render(<ProtocolTimer duration={600} isActive={false} onToggle={mockToggle} />)

    expect(screen.getByText('10:00')).toBeInTheDocument()
  })

  it('displays time in MM:SS format', () => {
    const mockToggle = jest.fn()
    render(<ProtocolTimer duration={125} isActive={false} onToggle={mockToggle} />)

    expect(screen.getByText('02:05')).toBeInTheDocument()
  })

  it('shows "En pause" when inactive', () => {
    const mockToggle = jest.fn()
    render(<ProtocolTimer duration={600} isActive={false} onToggle={mockToggle} />)

    expect(screen.getByText('En pause')).toBeInTheDocument()
  })

  it('shows "En cours" when active', () => {
    const mockToggle = jest.fn()
    render(<ProtocolTimer duration={600} isActive={true} onToggle={mockToggle} />)

    expect(screen.getByText('En cours')).toBeInTheDocument()
  })

  it('counts down when active', () => {
    const mockToggle = jest.fn()
    const { rerender } = render(
      <ProtocolTimer duration={600} isActive={true} onToggle={mockToggle} />
    )

    // Initial time
    expect(screen.getByText('10:00')).toBeInTheDocument()

    // Advance 5 seconds
    act(() => {
      jest.advanceTimersByTime(5000)
    })

    rerender(<ProtocolTimer duration={600} isActive={true} onToggle={mockToggle} />)

    // Time should have decreased (timer updates state internally)
    expect(screen.queryByText('10:00')).not.toBeInTheDocument()
  })

  it('has reset button that resets time', () => {
    const mockToggle = jest.fn()
    render(<ProtocolTimer duration={600} isActive={false} onToggle={mockToggle} />)

    const resetButton = screen.getAllByRole('button')[0] // First button is reset
    fireEvent.click(resetButton)

    expect(screen.getByText('10:00')).toBeInTheDocument()
  })

  it('has play/pause button', () => {
    const mockToggle = jest.fn()
    render(<ProtocolTimer duration={600} isActive={false} onToggle={mockToggle} />)

    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(2) // Reset + Play/Pause
  })

  it('calls onToggle when play/pause button clicked', () => {
    const mockToggle = jest.fn()
    render(<ProtocolTimer duration={600} isActive={false} onToggle={mockToggle} />)

    const playPauseButton = screen.getAllByRole('button')[1] // Second button is play/pause
    fireEvent.click(playPauseButton)

    expect(mockToggle).toHaveBeenCalled()
  })

  it('completes timer when duration reached', () => {
    const mockToggle = jest.fn()
    render(<ProtocolTimer duration={10} isActive={true} onToggle={mockToggle} />)

    act(() => {
      jest.advanceTimersByTime(10000) // Advance past duration
    })

    // Timer should call toggle when finished
    expect(mockToggle).toHaveBeenCalled()
  })
})
