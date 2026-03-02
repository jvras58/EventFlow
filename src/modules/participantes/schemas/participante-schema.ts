import { z } from "zod"

export const ParticipanteSchema = z.object({
    nome: z.string().min(1, "O nome é obrigatório"),
    email: z.string().email("E-mail inválido"),
    eventoId: z.string().min(1, "O evento é obrigatório"),
    checkIn: z.boolean()
})

export type ParticipanteInput = z.infer<typeof ParticipanteSchema>

export const ParticipanteUpdateSchema = ParticipanteSchema.partial()
export type ParticipanteUpdateInput = z.infer<typeof ParticipanteUpdateSchema>
