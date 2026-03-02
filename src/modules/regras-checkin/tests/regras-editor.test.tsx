import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RegrasEditor } from '../components/regras-editor'
import { renderWithProviders } from '@/tests/fixtures/usequery-fixture'

import { useAuth } from '@/providers/auth-provider'
import { mockRegrasApi, generateMockRule } from '@/tests/fixtures/regras-api-fixture'

jest.mock('@/providers/auth-provider', () => ({
  useAuth: jest.fn()
}))

jest.mock('../services/regras-checkin-api', () => ({
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
    const mockRule = generateMockRule({ nomeRegra: 'Fixtured Rule 123' })
    mockRegrasApi.getRegras.mockResolvedValue([mockRule])
    renderWithProviders(<RegrasEditor eventoId={mockEventoId} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('Fixtured Rule 123')).toBeInTheDocument()
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
      expect(screen.getByDisplayValue('Nova Regra')).toBeInTheDocument()
    })
  })

  it('removes a rule through the UI interaction', async () => {
    const user = userEvent.setup()
    const mockRule = generateMockRule()
    mockRegrasApi.getRegras.mockResolvedValue([mockRule])
    
    renderWithProviders(<RegrasEditor eventoId={mockEventoId} />)

    await waitFor(() => {
      expect(screen.getByDisplayValue(mockRule.nomeRegra)).toBeInTheDocument()
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
})
