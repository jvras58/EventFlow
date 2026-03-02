import { apiFetch } from "@/lib/http"

export interface DashboardSummary {
    totalEventos: number
    totalParticipantes: number
}

export const dashboardApi = {
    getSummary: async (token: string): Promise<DashboardSummary> => {
        const res = await apiFetch("/api/dashboard", {}, token)
        const data = await res.json()

        if (!res.ok) {
            throw new Error(data.error?.message || "Erro fetching dashboard")
        }

        return data.data as DashboardSummary
    }
}
