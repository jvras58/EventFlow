import { dashboardRepo } from "./dashboard-repo"

export const dashboardUsecases = {
    getDashboardSummary: async () => {
        return dashboardRepo.getSummary()
    }
}
