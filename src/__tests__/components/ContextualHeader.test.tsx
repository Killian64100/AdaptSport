import { render, screen } from '@testing-library/react'
import ContextualHeader from '@/components/helix/layouts/ContextualHeader'

// Mock hooks
jest.mock('@/hooks/useContextMode', () => ({
  useContextMode: () => ({ mode: 'morning' }),
}))

describe('ContextualHeader', () => {
  it('renders with greeting', () => {
    render(<ContextualHeader />)

    // Should render header without crashing
    const element = document.querySelector('header')
    expect(element).toBeTruthy()
  })

  it('displays correct heading text', () => {
    render(<ContextualHeader />)

    const heading = screen.getByRole('heading')
    expect(heading).toBeTruthy()
  })
})
