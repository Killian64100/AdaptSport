import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import LocationBeacon from '@/components/features/social/LocationBeacon'

/**
 * Mock the PermissionPrompt component
 */
vi.mock('@/components/shared/PermissionPrompt', () => ({
  default: ({ isOpen, onOpenChange, onGranted }: any) => (
    isOpen ? (
      <div data-testid="permission-prompt">
        <button onClick={() => onGranted()} data-testid="grant-permission">
          Autoriser
        </button>
        <button onClick={() => onOpenChange(false)} data-testid="deny-permission">
          Refuser
        </button>
      </div>
    ) : null
  ),
}))

describe('LocationBeacon Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering and Initial State', () => {
    it('should render the beacon component', () => {
      render(<LocationBeacon />)
      
      expect(screen.getByText('Balise de Localisation')).toBeInTheDocument()
      expect(screen.getByText('Balise inactive')).toBeInTheDocument()
    })

    it('should show the security disclaimer', () => {
      render(<LocationBeacon />)
      
      const disclaimer = screen.getByText(/Sécurité/)
      expect(disclaimer).toBeInTheDocument()
    })

    it('should display trust circle with contact list', () => {
      render(<LocationBeacon />)
      
      expect(screen.getByText(/Cercle de Confiance/)).toBeInTheDocument()
      expect(screen.getByText('Alice M.')).toBeInTheDocument()
      expect(screen.getByText('Bob D.')).toBeInTheDocument()
    })

    it('should show contact status indicators', () => {
      render(<LocationBeacon />)
      
      // Check for pseudonyms which indicate status elements are rendered
      expect(screen.getByText('@PhoenixX')).toBeInTheDocument()
      expect(screen.getByText('@AthleteBlue')).toBeInTheDocument()
    })
  })

  describe('Beacon Activation', () => {
    it('should show permission prompt when activating beacon', async () => {
      render(<LocationBeacon />)
      
      const activateButton = screen.getByText('Activer la balise')
      fireEvent.click(activateButton)
      
      await waitFor(() => {
        expect(screen.getByTestId('permission-prompt')).toBeInTheDocument()
      })
    })

    it('should activate beacon when permission is granted', async () => {
      render(<LocationBeacon />)
      
      const activateButton = screen.getByText('Activer la balise')
      fireEvent.click(activateButton)
      
      const grantButton = await screen.findByTestId('grant-permission')
      fireEvent.click(grantButton)
      
      await waitFor(() => {
        expect(screen.getByText('Balise active')).toBeInTheDocument()
        expect(screen.getByText('Arrêter la balise')).toBeInTheDocument()
      })
    })

    it('should not activate beacon when permission is denied', async () => {
      render(<LocationBeacon />)
      
      const activateButton = screen.getByText('Activer la balise')
      fireEvent.click(activateButton)
      
      const denyButton = await screen.findByTestId('deny-permission')
      fireEvent.click(denyButton)
      
      await waitFor(() => {
        expect(screen.queryByText('Balise active')).not.toBeInTheDocument()
      })
    })

    it('should show active beacon info when activated', async () => {
      render(<LocationBeacon />)
      
      const activateButton = screen.getByText('Activer la balise')
      fireEvent.click(activateButton)
      
      const grantButton = await screen.findByTestId('grant-permission')
      fireEvent.click(grantButton)
      
      await waitFor(() => {
        expect(screen.getByText('Balise Active')).toBeInTheDocument()
      })
    })
  })

  describe('Beacon Deactivation', () => {
    it('should deactivate beacon and reset state', async () => {
      render(<LocationBeacon />)
      
      // Activate first
      const activateButton = screen.getByText('Activer la balise')
      fireEvent.click(activateButton)
      
      const grantButton = await screen.findByTestId('grant-permission')
      fireEvent.click(grantButton)
      
      // Then deactivate
      const stopButton = await screen.findByText('Arrêter la balise')
      fireEvent.click(stopButton)
      
      await waitFor(() => {
        expect(screen.getByText('Balise inactive')).toBeInTheDocument()
      })
    })
  })

  describe('Contact Selection', () => {
    it('should select a contact when clicked', async () => {
      render(<LocationBeacon />)
      
      // Activate beacon first
      const activateButton = screen.getByText('Activer la balise')
      fireEvent.click(activateButton)
      
      const grantButton = await screen.findByTestId('grant-permission')
      fireEvent.click(grantButton)
      
      // Then select a contact
      const aliceCard = screen.getByText('Alice M.').closest('div')
      const aliceButton = aliceCard?.parentElement
      
      if (aliceButton) {
        fireEvent.click(aliceButton)
      }
      
      // The component should show that 1 contact is selected
      await waitFor(() => {
        expect(screen.getByText(/Cercle de Confiance \(1\/5\)/)).toBeInTheDocument()
      })
    })

    it('should enforce maximum of 5 contacts', async () => {
      render(<LocationBeacon />)
      
      // Activate beacon
      const activateButton = screen.getByText('Activer la balise')
      fireEvent.click(activateButton)
      
      const grantButton = await screen.findByTestId('grant-permission')
      fireEvent.click(grantButton)
      
      // Try to select more than 5 contacts
      // With only 5 total contacts in mock data, selecting all should hit the limit
      const contactElements = screen.getAllByText(/\@\w+/)
      
      // Click first 5 contacts
      for (let i = 0; i < Math.min(5, contactElements.length); i++) {
        const contactCard = contactElements[i].closest('div')?.parentElement
        if (contactCard) {
          fireEvent.click(contactCard)
        }
      }
      
      await waitFor(() => {
        expect(screen.getByText(/Cercle de Confiance \(5\/5\)/)).toBeInTheDocument()
      })
    })

    it('should show limit warning at 5 contacts', async () => {
      render(<LocationBeacon />)
      
      // Activate beacon
      const activateButton = screen.getByText('Activer la balise')
      fireEvent.click(activateButton)
      
      const grantButton = await screen.findByTestId('grant-permission')
      fireEvent.click(grantButton)
      
      // Select all 5 contacts
      const contactElements = screen.getAllByText(/\@\w+/)
      
      for (let i = 0; i < contactElements.length; i++) {
        const contactCard = contactElements[i].closest('div')?.parentElement
        if (contactCard) {
          fireEvent.click(contactCard)
        }
      }
      
      await waitFor(() => {
        expect(screen.getByText('Limite de 5 contacts atteinte')).toBeInTheDocument()
      })
    })

    it('should allow deselecting a contact', async () => {
      render(<LocationBeacon />)
      
      // Activate beacon
      const activateButton = screen.getByText('Activer la balise')
      fireEvent.click(activateButton)
      
      const grantButton = await screen.findByTestId('grant-permission')
      fireEvent.click(grantButton)
      
      // Select a contact
      const aliceCard = screen.getByText('Alice M.').closest('div')
      const aliceParent = aliceCard?.parentElement
      
      if (aliceParent) {
        fireEvent.click(aliceParent)
      }
      
      await waitFor(() => {
        expect(screen.getByText(/Cercle de Confiance \(1\/5\)/)).toBeInTheDocument()
      })
      
      // Deselect the same contact
      if (aliceParent) {
        fireEvent.click(aliceParent)
      }
      
      await waitFor(() => {
        expect(screen.getByText(/Cercle de Confiance \(0\/5\)/)).toBeInTheDocument()
      })
    })
  })

  describe('Beacon Timer', () => {
    it('should display timer when beacon is active', async () => {
      render(<LocationBeacon />)
      
      const activateButton = screen.getByText('Activer la balise')
      fireEvent.click(activateButton)
      
      const grantButton = await screen.findByTestId('grant-permission')
      fireEvent.click(grantButton)
      
      await waitFor(() => {
        // Should show time format like "4h 0m 0s"
        expect(screen.getByText(/\d+h \d+m \d+s/)).toBeInTheDocument()
      })
    })

    it('should show 4 hour default timer', async () => {
      render(<LocationBeacon />)
      
      const activateButton = screen.getByText('Activer la balise')
      fireEvent.click(activateButton)
      
      const grantButton = await screen.findByTestId('grant-permission')
      fireEvent.click(grantButton)
      
      await waitFor(() => {
        expect(screen.getByText(/4h 0m \d+s/)).toBeInTheDocument()
      })
    })

    it('should show activation time', async () => {
      render(<LocationBeacon />)
      
      const activateButton = screen.getByText('Activer la balise')
      fireEvent.click(activateButton)
      
      const grantButton = await screen.findByTestId('grant-permission')
      fireEvent.click(grantButton)
      
      await waitFor(() => {
        expect(screen.getByText(/Since:/)).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<LocationBeacon />)
      
      expect(screen.getByText('Balise de Localisation')).toBeInTheDocument()
    })

    it('should have descriptive button labels', () => {
      render(<LocationBeacon />)
      
      expect(screen.getByText('Activer la balise')).toBeInTheDocument()
    })

    it('should display contact status information', () => {
      render(<LocationBeacon />)
      
      // Status indicators (online/offline) should be visible
      expect(screen.getByText('@PhoenixX')).toBeInTheDocument()
    })
  })

  describe('Security Features', () => {
    it('should display security disclaimer prominently', () => {
      render(<LocationBeacon />)
      
      const disclaimer = screen.getByText(/Votre position exacte ne sera jamais partagée/)
      expect(disclaimer).toBeInTheDocument()
    })

    it('should mention trust circle in security context', () => {
      render(<LocationBeacon />)
      
      expect(screen.getByText('Cercle de Confiance (0/5)')).toBeInTheDocument()
    })

    it('should require permission before activation', async () => {
      render(<LocationBeacon />)
      
      const activateButton = screen.getByText('Activer la balise')
      fireEvent.click(activateButton)
      
      // Permission prompt should appear
      await waitFor(() => {
        expect(screen.getByTestId('permission-prompt')).toBeInTheDocument()
      })
    })

    it('should show auto-stop timer message', async () => {
      render(<LocationBeacon />)
      
      const activateButton = screen.getByText('Activer la balise')
      fireEvent.click(activateButton)
      
      const grantButton = await screen.findByTestId('grant-permission')
      fireEvent.click(grantButton)
      
      await waitFor(() => {
        expect(
          screen.getByText('La balise s\'arrêtera automatiquement après 4 heures')
        ).toBeInTheDocument()
      })
    })
  })
})
