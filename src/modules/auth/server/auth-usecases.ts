import { authRepo } from "./auth-repo"
import { LoginInput, RegisterInput } from "../schemas/auth-schema"
import { SignJWT } from "jose"
import bcrypt from "bcryptjs"

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "event-flow-secret-key-123"
)

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

        const token = await new SignJWT({ userId: user.id, email: user.email, nome: user.nome })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("24h")
            .sign(JWT_SECRET)

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

        const token = await new SignJWT({ userId: user.id, email: user.email, nome: user.nome })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("24h")
            .sign(JWT_SECRET)

        return { token }
    }
}
