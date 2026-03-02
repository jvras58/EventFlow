import { z } from "zod"

export const LoginSchema = z.object({
    email: z.string().email("E-mail inválido"),
    senha: z.string().min(1, "A senha é obrigatória")
})

export type LoginInput = z.infer<typeof LoginSchema>

export const RegisterSchema = z.object({
    nome: z.string().optional(),
    email: z.string().email("E-mail inválido"),
    senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmSenha: z.string().min(1, "A confirmação de senha é obrigatória")
}).refine((data) => data.senha === data.confirmSenha, {
    message: "As senhas não conferem",
    path: ["confirmSenha"]
})

export type RegisterInput = z.infer<typeof RegisterSchema>
