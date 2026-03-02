import { NextResponse } from "next/server"
import { eventosUsecases } from "@/modules/eventos/server/eventos-usecases"
import { EventoSchema } from "@/modules/eventos/schemas/evento-schema"
import { getBearerToken, verifyJwt } from "@/lib/auth"

async function requireAuth(req: Request) {
    const token = getBearerToken(req.headers.get("Authorization"))
    if (!token) return false
    const payload = await verifyJwt(token)
    return !!payload
}

export async function GET(req: Request) {
    if (!await requireAuth(req)) {
        return NextResponse.json({ error: { message: "Não autorizado" } }, { status: 401 })
    }
    try {
        const data = await eventosUsecases.listEventos()
        return NextResponse.json({ data })
    } catch (error: any) {
        return NextResponse.json({ error: { message: error.message } }, { status: 500 })
    }
}

export async function POST(req: Request) {
    if (!await requireAuth(req)) {
        return NextResponse.json({ error: { message: "Não autorizado" } }, { status: 401 })
    }
    try {
        const body = await req.json()
        const parsed = EventoSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ error: { message: "Dados inválidos", details: parsed.error.issues } }, { status: 400 })
        }
        const data = await eventosUsecases.createEvento(parsed.data)
        return NextResponse.json({ data })
    } catch (error: any) {
        return NextResponse.json({ error: { message: error.message } }, { status: 500 })
    }
}
