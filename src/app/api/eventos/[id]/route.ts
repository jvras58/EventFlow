import { NextResponse } from "next/server"
import { eventosUsecases } from "@/modules/eventos/server/eventos-usecases"
import { EventoUpdateSchema } from "@/modules/eventos/schemas/evento-schema"
import { getBearerToken, verifyJwt } from "@/lib/auth"

async function requireAuth(req: Request) {
    const token = getBearerToken(req.headers.get("Authorization"))
    if (!token) return false
    const payload = await verifyJwt(token)
    return !!payload
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!await requireAuth(req)) return NextResponse.json({ error: { message: "Não autorizado" } }, { status: 401 })
    try {
        const { id } = await params;
        const body = await req.json()
        const parsed = EventoUpdateSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ error: { message: "Dados inválidos", details: parsed.error.issues } }, { status: 400 })
        }
        const data = await eventosUsecases.updateEvento(id, parsed.data)
        return NextResponse.json({ data })
    } catch (error: any) {
        return NextResponse.json({ error: { message: error.message } }, { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!await requireAuth(req)) return NextResponse.json({ error: { message: "Não autorizado" } }, { status: 401 })
    try {
        const { id } = await params;
        await eventosUsecases.deleteEvento(id)
        return NextResponse.json({ data: { success: true } })
    } catch (error: any) {
        return NextResponse.json({ error: { message: error.message } }, { status: 500 })
    }
}
