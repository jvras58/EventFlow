import { z } from "zod"

export const RegraCheckinSchema = z.object({
    id: z.string().optional(),
    nome: z.string().min(1, "O nome é obrigatório"),
    tipo: z.enum(["HORARIO", "DOCUMENTO", "PAGAMENTO"]),
    ativa: z.boolean().default(true),
    eventoId: z.string().optional() // Optional when updating the array for an event
})

export const RegrasCheckinUpdateSchema = z.array(RegraCheckinSchema)

export type RegraCheckinInput = z.infer<typeof RegraCheckinSchema>

export function validateRegras(regras: RegraCheckinInput[]): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (regras.length === 0) {
        errors.push("O evento deve ter pelo menos 1 regra.")
    }

    const regrasAtivas = regras.filter(r => r.ativa)

    if (regrasAtivas.length === 0 && regras.length > 0) {
        errors.push("O evento deve ter pelo menos 1 regra ativa.")
    }

    // Regra de conflito: Não pode ter DOCUMENTO e PAGAMENTO ativas ao mesmo tempo (simulação de conflito)
    const temDocumento = regrasAtivas.some(r => r.tipo === "DOCUMENTO")
    const temPagamento = regrasAtivas.some(r => r.tipo === "PAGAMENTO")

    if (temDocumento && temPagamento) {
        errors.push("Conflito: Não é permitido exigir DOCUMENTO e PAGAMENTO simultaneamente (regras ativas).")
    }

    return {
        valid: errors.length === 0,
        errors
    }
}
