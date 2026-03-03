import { RegraCheckinInput } from '@/modules/regras-checkin/schemas/regra-checkin-schema'

export const mockRegrasApi = {
    getRegras: jest.fn(),
    updateRegras: jest.fn(),
}

export const createMockRegrasApi = () => {
    return mockRegrasApi
}

let mockIdCounter = 1;

export function generateMockRule(overrides?: Partial<RegraCheckinInput>): RegraCheckinInput {
    mockIdCounter += 1;
    return {
        id: `mock-id-${mockIdCounter}`,
        eventoId: 'mock-evento-1',
        nomeRegra: "DOCUMENTO",
        ativo: true,
        obrigatorio: true,
        liberarMinAntes: 30,
        encerrarMinDepois: 10,
        ...overrides
    }
}
