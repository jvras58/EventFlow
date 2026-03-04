import { UserUpdateInput } from "@/modules/user/schemas/user-schema"
import { apiFetch } from "@/lib/http"

export const userApi = {
    updateProfile: async (data: UserUpdateInput, token: string): Promise<{ token: string }> => {
        const response = await apiFetch("/api/user/me", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }, token)

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error?.message || "Falha ao atualizar perfil")
        }

        const json = await response.json()
        return json.data
    }
}
