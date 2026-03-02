import { NextResponse } from "next/server"
import { dashboardUsecases } from "@/modules/dashboard/server/dashboard-usecases"
import { getBearerToken, verifyJwt } from "@/lib/auth"

export async function GET(req: Request) {
    try {
        const token = getBearerToken(req.headers.get("Authorization"))
        if (!token || !(await verifyJwt(token))) {
            return NextResponse.json({ error: { message: "Não autorizado" } }, { status: 401 })
        }

        const summary = await dashboardUsecases.getDashboardSummary()
        return NextResponse.json({ data: summary })
    } catch (error: any) {
        return NextResponse.json({ error: { message: "Erro ao buscar dashboard" } }, { status: 500 })
    }
}
