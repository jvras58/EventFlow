import { z } from "zod"

export const RegraCheckinSchema = z.object({
    id: z.string().optional(),
    eventoId: z.string().optional(),
    nomeRegra: z.string().min(1, "O nome é obrigatório"),
    ativo: z.boolean().default(true),
    obrigatorio: z.boolean().default(true),
    liberarMinAntes: z.coerce.number().min(0, "Apenas valores positivos"),
    encerrarMinDepois: z.coerce.number().min(0, "Apenas valores positivos")
})

export const RegrasCheckinUpdateSchema = z.array(RegraCheckinSchema)

export type RegraCheckinInput = z.infer<typeof RegraCheckinSchema>

export function validateRegras(regras: RegraCheckinInput[]): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (regras.length === 0) {
        errors.push("O evento deve ter pelo menos 1 regra.")
    }

    const regrasAtivas = regras.filter(r => r.ativo)

    if (regrasAtivas.length === 0 && regras.length > 0) {
        errors.push("O evento deve ter pelo menos 1 regra ativa.")
    }

    const regrasObrigatorias = regrasAtivas.filter(r => r.obrigatorio)

    for (let i = 0; i < regrasObrigatorias.length; i++) {
        for (let j = i + 1; j < regrasObrigatorias.length; j++) {
            const r1 = regrasObrigatorias[i];
            const r2 = regrasObrigatorias[j];

            const start1 = -r1.liberarMinAntes;
            const end1 = r1.encerrarMinDepois;
            const start2 = -r2.liberarMinAntes;
            const end2 = r2.encerrarMinDepois;

            const hasOverlap = Math.max(start1, start2) <= Math.min(end1, end2);

            if (!hasOverlap) {
                errors.push(`Conflito estrutural: As regras obrigatórias "${r1.nomeRegra}" e "${r2.nomeRegra}" possuem janelas de tempo incompatíveis.`);
            }
        }
    }

    return {
        valid: errors.length === 0,
        errors
    }
}
