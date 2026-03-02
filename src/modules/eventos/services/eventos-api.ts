import { EventoInput, EventoUpdateInput } from "../schemas/evento-schema"
import { Evento } from "../types/evento"
import { apiFetch } from "@/lib/http"

export const eventosApi = {
    listEventos: async (token: string): Promise<Evento[]> => {
        const res = await apiFetch("/api/eventos", {}, token)
        if (!res.ok) throw new Error("Erro ao buscar eventos")
        const { data } = await res.json()
        return data
    },
    createEvento: async (data: EventoInput, token: string): Promise<Evento> => {
        const res = await apiFetch("/api/eventos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }, token)
        if (!res.ok) throw new Error("Erro ao criar evento")
        const { data: result } = await res.json()
        return result
    },
    updateEvento: async (id: string, data: EventoUpdateInput, token: string): Promise<Evento> => {
        const res = await apiFetch(`/api/eventos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }, token)
        if (!res.ok) throw new Error("Erro ao atualizar evento")
        const { data: result } = await res.json()
        return result
    },
    deleteEvento: async (id: string, token: string): Promise<void> => {
        const res = await apiFetch(`/api/eventos/${id}`, { method: "DELETE" }, token)
        if (!res.ok) throw new Error("Erro ao excluir evento")
    }
}
