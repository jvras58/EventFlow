import { SignJWT } from "jose"
import prisma from "@/lib/prisma"
import { UserUpdateInput } from "../schemas/user-schema"

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "vlab-desafio-secret-key-123"
)

export const userUsecases = {
    updateProfile: async (userId: string, input: UserUpdateInput) => {
        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (!user) throw new Error("Usuário não encontrado")
        if (user.senha !== input.senhaAtual) throw new Error("Senha atual incorreta")

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                email: input.email || user.email,
                senha: input.novaSenha || user.senha
            }
        })

        const token = await new SignJWT({ userId: updatedUser.id, email: updatedUser.email })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("24h")
            .sign(JWT_SECRET)

        return { token }
    }
}
