import { authRepo } from "./auth-repo"
import { LoginInput } from "../schemas/auth-schema"
import { SignJWT } from "jose"

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "event-flow-secret-key-123"
)

export const authUsecases = {
    login: async (input: LoginInput) => {
        const user = await authRepo.findUserByEmail(input.email)

        if (!user) {
            throw new Error("Credenciais inválidas")
        }

        if (user.senha !== input.senha) {
            // Em produção, usar bcrypt ou argon2
            throw new Error("Credenciais inválidas")
        }

        const token = await new SignJWT({ userId: user.id, email: user.email })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("24h")
            .sign(JWT_SECRET)

        return { token }
    }
}
