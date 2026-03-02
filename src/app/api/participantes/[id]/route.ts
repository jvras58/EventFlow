import { NextResponse } from "next/server"
import { participantesUsecases } from "@/modules/participantes/server/participantes-usecases"
import { ParticipanteUpdateSchema } from "@/modules/participantes/schemas/participante-schema"
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
        const parsed = ParticipanteUpdateSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ error: { message: "Dados inválidos", details: parsed.error.issues } }, { status: 400 })
        }
        const data = await participantesUsecases.updateParticipante(id, parsed.data)
        return NextResponse.json({ data })
    } catch (error: any) {
        return NextResponse.json({ error: { message: error.message } }, { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!await requireAuth(req)) return NextResponse.json({ error: { message: "Não autorizado" } }, { status: 401 })
    try {
        const { id } = await params;
        await participantesUsecases.deleteParticipante(id)
        return NextResponse.json({ data: { success: true } })
    } catch (error: any) {
        return NextResponse.json({ error: { message: error.message } }, { status: 500 })
    }
}
