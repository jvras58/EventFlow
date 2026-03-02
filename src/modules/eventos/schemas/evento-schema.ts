import { z } from "zod"

export const EventoSchema = z.object({
    nome: z.string().min(1, "O nome é obrigatório"),
    data: z.string().min(1, "A data é obrigatória"),
    local: z.string().min(1, "O local é obrigatório"),
    status: z.enum(["ATIVO", "ENCERRADO", "PENDENTE"])
})

export type EventoInput = z.infer<typeof EventoSchema>

export const EventoUpdateSchema = EventoSchema.partial()
export type EventoUpdateInput = z.infer<typeof EventoUpdateSchema>
