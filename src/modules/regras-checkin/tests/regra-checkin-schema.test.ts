import { validateRegras, RegraCheckinInput } from "@/modules/regras-checkin/schemas/regra-checkin-schema"
import { generateMockRule } from '@/tests/fixtures/regras-api-fixture'

describe('validateRegras Business Logic Tests', () => {
    it('should invalidate when there are no rules', () => {
        const result = validateRegras([])
        expect(result.valid).toBe(false)
        expect(result.errors).toContain('O evento deve ter pelo menos 1 regra.')
    })

    it('should invalidate when all rules are inactive', () => {
        const regras: RegraCheckinInput[] = [
            generateMockRule({ nomeRegra: 'DOCUMENTO', ativo: false }),
            generateMockRule({ nomeRegra: 'PRESENCA', ativo: false })
        ]
        const result = validateRegras(regras)

        expect(result.valid).toBe(false)
        expect(result.errors).toContain('O evento deve ter pelo menos 1 regra ativa.')
    })

    it('should validate correctly for a single valid rule', () => {
        const regras: RegraCheckinInput[] = [generateMockRule()]
        const result = validateRegras(regras)

        expect(result.valid).toBe(true)
        expect(result.errors).toHaveLength(0)
    })

    it('should invalidate mandatory rules with non-overlapping time windows (Structural Conflict)', () => {
        const rule1 = generateMockRule({
            nomeRegra: 'DOCUMENTO',
            liberarMinAntes: 120,
            encerrarMinDepois: -60
        })

        const rule2 = generateMockRule({
            nomeRegra: 'PRESENCA',
            liberarMinAntes: 30,
            encerrarMinDepois: 60
        })

        const result = validateRegras([rule1, rule2])

        expect(result.valid).toBe(false)
        expect(result.errors[0]).toContain('Conflito estrutural')
        expect(result.errors[0]).toContain('possuem janelas de tempo incompatíveis')
    })

    it('should validate mandatory rules with overlapping time windows', () => {
        const rule1 = generateMockRule({
            nomeRegra: 'DOCUMENTO',
            liberarMinAntes: 120,
            encerrarMinDepois: 0
        })

        const rule2 = generateMockRule({
            nomeRegra: 'PRESENCA',
            liberarMinAntes: 30,
            encerrarMinDepois: 60
        })

        const result = validateRegras([rule1, rule2])

        expect(result.valid).toBe(true)
        expect(result.errors).toHaveLength(0)
    })

    it('should ignore structural conflicts for non-mandatory rules', () => {
        const rule1 = generateMockRule({
            nomeRegra: 'DOCUMENTO',
            liberarMinAntes: 120,
            encerrarMinDepois: -60
        })

        const rule2 = generateMockRule({
            nomeRegra: 'OUTROS',
            obrigatorio: false,
            liberarMinAntes: 30,
            encerrarMinDepois: 60
        })

        const result = validateRegras([rule1, rule2])

        expect(result.valid).toBe(true)
        expect(result.errors).toHaveLength(0)
    })
})
