import { RegraCheckinInput } from '@/modules/regras-checkin/schemas/regra-checkin-schema'

export const mockRegrasApi = {
    getRegras: jest.fn(),
    updateRegras: jest.fn()
}

export const setupRegrasApiMock = () => {
    jest.mock('@/modules/regras-checkin/services/regras-checkin-api', () => ({
        regrasCheckinApi: mockRegrasApi
    }))
    return mockRegrasApi
}

export const generateMockRule = (overrides?: Partial<RegraCheckinInput>): RegraCheckinInput => ({
    nomeRegra: 'Regra Teste Default',
    ativo: true,
    obrigatorio: true,
    liberarMinAntes: 30,
    encerrarMinDepois: 10,
    ...overrides
})
