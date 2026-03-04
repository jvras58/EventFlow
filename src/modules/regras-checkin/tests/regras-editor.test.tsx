import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RegrasEditor } from '@/modules/regras-checkin/components/regras-editor'
import { renderWithProviders } from '@/tests/fixtures/usequery-fixture'

import { useAuth } from '@/providers/auth-provider'
import { mockRegrasApi, generateMockRule } from '@/tests/fixtures/regras-api-fixture'

jest.mock('@/providers/auth-provider', () => ({
  useAuth: jest.fn()
}))

jest.mock('@/modules/regras-checkin/services/regras-checkin-api', () => ({
  regrasCheckinApi: require('@/tests/fixtures/regras-api-fixture').mockRegrasApi
}))

describe('RegrasEditor Integration Tests', () => {
  const mockEventoId = 'evento-123'

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useAuth as jest.Mock).mockReturnValue({ token: 'fake-token-123' })
  })

  it('renders loading state initially', () => {
    mockRegrasApi.getRegras.mockReturnValue(new Promise(() => {}))
    renderWithProviders(<RegrasEditor eventoId={mockEventoId} />)
    
    expect(screen.getByText('Carregando regras...')).toBeInTheDocument()
  })

  it('renders empty state when there are no rules', async () => {
    mockRegrasApi.getRegras.mockResolvedValue([])
    renderWithProviders(<RegrasEditor eventoId={mockEventoId} />)

    await waitFor(() => {
      expect(screen.getByText('O evento não possui nenhuma regra configurada.')).toBeInTheDocument()
    })
  })

  it('renders existing rules using fixtures', async () => {
    const mockRule = generateMockRule({ nomeRegra: 'DOCUMENTO' })
    mockRegrasApi.getRegras.mockResolvedValue([mockRule])
    renderWithProviders(<RegrasEditor eventoId={mockEventoId} />)

    await waitFor(() => {
      expect(screen.getByText('DOCUMENTO')).toBeInTheDocument()
      expect(screen.getByDisplayValue('30')).toBeInTheDocument()
    })
  })

  it('adds a new rule safely', async () => {
    const user = userEvent.setup()
    mockRegrasApi.getRegras.mockResolvedValue([])
    renderWithProviders(<RegrasEditor eventoId={mockEventoId} />)

    await waitFor(() => {
      expect(screen.getByText('+ Adicionar Regra')).toBeInTheDocument()
    })

    await user.click(screen.getByText('+ Adicionar Regra'))

    await waitFor(() => {
      expect(screen.getByText('DOCUMENTO')).toBeInTheDocument()
    })
  })

  it('removes a rule through the UI interaction', async () => {
    const user = userEvent.setup()
    const mockRule = generateMockRule({ nomeRegra: 'DOCUMENTO' })
    mockRegrasApi.getRegras.mockResolvedValue([mockRule])
    
    renderWithProviders(<RegrasEditor eventoId={mockEventoId} />)

    await waitFor(() => {
      expect(screen.getByText('DOCUMENTO')).toBeInTheDocument()
    })

    const buttons = screen.getAllByRole('button')
    const trashButton = buttons.find(b => b.className.includes('text-destructive') || b.className.includes('ghost'))
    
    if (trashButton) {
      await user.click(trashButton)
    }

    await waitFor(() => {
      expect(screen.getByText('O evento não possui nenhuma regra configurada.')).toBeInTheDocument()
    })
  })

  describe('Business Logic Validation in UI', () => {
    it('disables the save button and shows error when no rules are present', async () => {
      mockRegrasApi.getRegras.mockResolvedValue([])
      renderWithProviders(<RegrasEditor eventoId={mockEventoId} />)

      await waitFor(() => {
        expect(screen.getByText('O evento não possui nenhuma regra configurada.')).toBeInTheDocument()
      })

      const alertText = screen.getByText(/O evento deve ter pelo menos 1 regra/i)
      expect(alertText).toBeInTheDocument()

      const saveButton = screen.getByRole('button', { name: /Salvar Alterações/i })
      expect(saveButton).toBeDisabled()
    })

    it('shows structural conflict warning when rules overlap', async () => {
      const rule1 = generateMockRule({ nomeRegra: 'DOCUMENTO', liberarMinAntes: 120, encerrarMinDepois: -60 })
      const rule2 = generateMockRule({ nomeRegra: 'DOCUMENTO', liberarMinAntes: 30, encerrarMinDepois: 60 })
      
      mockRegrasApi.getRegras.mockResolvedValue([rule1, rule2])
      renderWithProviders(<RegrasEditor eventoId={mockEventoId} />)

      await waitFor(() => {
        const errorMsg = screen.getByText(/Conflito estrutural/i)
        expect(errorMsg).toBeInTheDocument()
      })

      const saveButton = screen.getByRole('button', { name: /Salvar Alterações/i })
      expect(saveButton).toBeDisabled()
    })

    it('shows conflict warning whenDOCUMENTO and PAGAMENTO are active', async () => {
      const rule1 = generateMockRule({ nomeRegra: 'DOCUMENTO', ativo: true })
      const rule2 = generateMockRule({ nomeRegra: 'PAGAMENTO', ativo: true })
      
      mockRegrasApi.getRegras.mockResolvedValue([rule1, rule2])
      renderWithProviders(<RegrasEditor eventoId={mockEventoId} />)

      await waitFor(() => {
        const errorMsg = screen.getByText(/Não é permitido ativar as regras DOCUMENTO e PAGAMENTO simultaneamente/i)
        expect(errorMsg).toBeInTheDocument()
      })

      const saveButton = screen.getByRole('button', { name: /Salvar Alterações/i })
      expect(saveButton).toBeDisabled()
    })
  })
})
