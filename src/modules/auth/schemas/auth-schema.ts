import { z } from "zod"

export const LoginSchema = z.object({
    email: z.string().email("E-mail inválido"),
    senha: z.string().min(1, "A senha é obrigatória")
})

export type LoginInput = z.infer<typeof LoginSchema>
