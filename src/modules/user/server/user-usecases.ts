import { SignJWT } from "jose"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"
import { UserUpdateInput } from "../schemas/user-schema"
import { JWT_SECRET } from "@/lib/auth"


export const userUsecases = {
    updateProfile: async (userId: string, input: UserUpdateInput) => {
        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (!user) throw new Error("Usuário não encontrado")

        if (input.senhaAtual && input.novaSenha) {
            const match = await bcrypt.compare(input.senhaAtual, user.passwordHash)
            if (!match) throw new Error("Senha atual incorreta")
        }

        const dataToUpdate: any = {
            email: input.email || user.email
        }

        if (input.novaSenha) {
            dataToUpdate.passwordHash = await bcrypt.hash(input.novaSenha, 10)
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: dataToUpdate
        })

        const token = await new SignJWT({ userId: updatedUser.id, email: updatedUser.email })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("24h")
            .sign(JWT_SECRET)

        return { token }
    }
}
