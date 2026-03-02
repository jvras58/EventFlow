import { LoginInput } from "../schemas/auth-schema"
import { LoginResponse } from "../types/auth"

export const authApi = {
    login: async (data: LoginInput): Promise<LoginResponse> => {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error?.message || "Falha no login")
        }

        return response.json()
    }
}
