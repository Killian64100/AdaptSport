import { render, screen, fireEvent } from '@testing-library/react'
import ChatBubble from '@/components/helix/molecules/ChatBubble'

const mockMessage = {
  id: '1',
  role: 'assistant' as const,
  content: 'Test message',
  confidence: 85,
  attribution: {
    factors: [
      { label: 'VFC', impact: -15, direction: 'negative' as const },
      { label: 'Sommeil', impact: -20, direction: 'negative' as const },
    ],
  },
  timestamp: new Date(),
}

describe('ChatBubble', () => {
  it('renders message content', () => {
    render(<ChatBubble message={mockMessage} isLast={true} />)
    expect(screen.getByText('Test message')).toBeInTheDocument()
  })

  it('shows confidence pill for AI messages', () => {
    render(<ChatBubble message={mockMessage} isLast={true} />)
    expect(screen.getByText('85%')).toBeInTheDocument()
  })

  it('shows "Pourquoi ?" button when attribution exists', () => {
    render(<ChatBubble message={mockMessage} isLast={true} />)
    expect(screen.getByText('Pourquoi ?')).toBeInTheDocument()
  })

  it('does not show confidence for user messages', () => {
    const userMessage = { ...mockMessage, role: 'user' as const, confidence: undefined }
    render(<ChatBubble message={userMessage} isLast={true} />)
    
    // User messages should not show percentage
    const percentElements = screen.queryAllByText(/%/)
    expect(percentElements.length).toBe(0)
  })

  it('displays timestamp in correct format', () => {
    const message = {
      ...mockMessage,
      timestamp: new Date('2024-01-15T14:30:00'),
    }
    render(<ChatBubble message={message} isLast={true} />)
    // Timestamp should be displayed (exact format depends on locale)
    const timeElement = screen.getByText(/\d{2}:\d{2}/)
    expect(timeElement).toBeInTheDocument()
  })

  it('renders user message with different styling', () => {
    const userMessage = { ...mockMessage, role: 'user' as const }
    const { container } = render(<ChatBubble message={userMessage} isLast={true} />)
    
    // User message bubble should have electric background
    const bubble = container.querySelector('.bg-brand-electric')
    expect(bubble).toBeInTheDocument()
  })

  it('renders assistant message with card styling', () => {
    const { container } = render(<ChatBubble message={mockMessage} isLast={true} />)
    
    // Assistant message bubble should have card background
    const bubble = container.querySelector('.bg-surface-card')
    expect(bubble).toBeInTheDocument()
  })
})
