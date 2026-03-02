import { LoginInput } from "../schemas/auth-schema"
import { LoginResponse } from "../types/auth"

export const authApi = {
    login: async (input: LoginInput): Promise<LoginResponse> => {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input)
        })

        const data = await res.json()

        if (!res.ok) {
            throw new Error(data.error?.message || "Erro ao fazer login")
        }

        return data.data
    }
}
