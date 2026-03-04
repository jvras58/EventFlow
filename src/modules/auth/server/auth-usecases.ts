import { authRepo } from "./auth-repo"
import { LoginInput, RegisterInput } from "@/modules/auth/schemas/auth-schema"
import bcrypt from "bcryptjs"
import { signJwt } from "@/lib/auth"

export const authUsecases = {
    login: async (input: LoginInput) => {
        const user = await authRepo.findUserByEmail(input.email)

        if (!user) {
            throw new Error("Credenciais inválidas")
        }

        const passwordMatch = await bcrypt.compare(input.senha, user.passwordHash);

        if (!passwordMatch) {
            throw new Error("Credenciais inválidas")
        }

        const token = await signJwt({ userId: user.id, email: user.email, nome: user.nome })

        return { token }
    },
    register: async (input: RegisterInput) => {
        const existingUser = await authRepo.findUserByEmail(input.email)

        if (existingUser) {
            throw new Error("E-mail já cadastrado")
        }

        const hashedPassword = await bcrypt.hash(input.senha, 10);

        const user = await authRepo.createUser({
            email: input.email,
            passwordHash: hashedPassword,
            nome: input.nome
        })

        const token = await signJwt({ userId: user.id, email: user.email, nome: user.nome })

        return { token }
    }
}
