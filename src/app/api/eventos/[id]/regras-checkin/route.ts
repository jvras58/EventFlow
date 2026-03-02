import { NextResponse } from "next/server"
import { regrasUsecases } from "@/modules/regras-checkin/server/regras-usecases"
import { RegrasCheckinUpdateSchema } from "@/modules/regras-checkin/schemas/regra-checkin-schema"
import { getBearerToken, verifyJwt } from "@/lib/auth"

async function requireAuth(req: Request) {
    const token = getBearerToken(req.headers.get("Authorization"))
    if (!token) return false
    const payload = await verifyJwt(token)
    return !!payload
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!await requireAuth(req)) return NextResponse.json({ error: { message: "Não autorizado" } }, { status: 401 })
    try {
        const { id } = await params;
        const data = await regrasUsecases.getRegras(id)
        return NextResponse.json({ data })
    } catch (error: any) {
        return NextResponse.json({ error: { message: error.message } }, { status: 500 })
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!await requireAuth(req)) return NextResponse.json({ error: { message: "Não autorizado" } }, { status: 401 })
    try {
        const { id } = await params;
        const body = await req.json()
        const parsed = RegrasCheckinUpdateSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json({ error: { message: "Dados inválidos", details: parsed.error.issues } }, { status: 400 })
        }

        const data = await regrasUsecases.updateRegras(id, parsed.data)
        return NextResponse.json({ data })
    } catch (error: any) {
        return NextResponse.json({ error: { message: error.message } }, { status: 400 })
    }
}
