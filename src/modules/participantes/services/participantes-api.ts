import { ParticipanteInput, ParticipanteUpdateInput } from "@/modules/participantes/schemas/participante-schema"
import { Participante } from "@/modules/participantes/types/participante"
import { apiFetch } from "@/lib/http"

export const participantesApi = {
    listParticipantes: async (token: string): Promise<Participante[]> => {
        const res = await apiFetch("/api/participantes", {}, token)
        if (!res.ok) throw new Error("Erro ao buscar participantes")
        const { data } = await res.json()
        return data
    },
    createParticipante: async (data: ParticipanteInput, token: string): Promise<Participante> => {
        const res = await apiFetch("/api/participantes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }, token)
        if (!res.ok) {
            const errorData = await res.json()
            throw new Error(errorData.error?.message || "Erro ao criar participante")
        }
        const { data: result } = await res.json()
        return result
    },
    updateParticipante: async (id: string, data: ParticipanteUpdateInput, token: string): Promise<Participante> => {
        const res = await apiFetch(`/api/participantes/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }, token)
        if (!res.ok) {
            const errorData = await res.json()
            throw new Error(errorData.error?.message || "Erro ao atualizar participante")
        }
        const { data: result } = await res.json()
        return result
    },
    deleteParticipante: async (id: string, token: string): Promise<void> => {
        const res = await apiFetch(`/api/participantes/${id}`, { method: "DELETE" }, token)
        if (!res.ok) throw new Error("Erro ao excluir participante")
    }
}
