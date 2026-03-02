import { z } from "zod"

export const UserUpdateSchema = z.object({
    email: z.string().email("E-mail inválido").optional(),
    senhaAtual: z.string().min(1, "A senha atual é obrigatória"),
    novaSenha: z.string().min(3, "A nova senha deve ter no mínimo 3 caracteres").optional()
})

export type UserUpdateInput = z.infer<typeof UserUpdateSchema>
