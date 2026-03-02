import { RegraCheckinInput } from "../schemas/regra-checkin-schema"
import { apiFetch } from "@/lib/http"

export const regrasCheckinApi = {
    getRegras: async (eventoId: string, token: string): Promise<RegraCheckinInput[]> => {
        const res = await apiFetch(`/api/eventos/${eventoId}/regras-checkin`, {}, token)
        if (!res.ok) throw new Error("Erro ao buscar regras")
        const { data } = await res.json()
        return data
    },
    updateRegras: async (eventoId: string, regras: RegraCheckinInput[], token: string): Promise<RegraCheckinInput[]> => {
        const res = await apiFetch(`/api/eventos/${eventoId}/regras-checkin`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(regras)
        }, token)

        if (!res.ok) {
            const errorData = await res.json()
            throw new Error(errorData.error?.message || "Erro ao salvar regras")
        }
        const { data } = await res.json()
        return data
    }
}
