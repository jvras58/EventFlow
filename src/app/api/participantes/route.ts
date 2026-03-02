import { NextResponse } from "next/server"
import { participantesUsecases } from "@/modules/participantes/server/participantes-usecases"
import { ParticipanteSchema } from "@/modules/participantes/schemas/participante-schema"
import { getBearerToken, verifyJwt } from "@/lib/auth"

async function requireAuth(req: Request) {
    const token = getBearerToken(req.headers.get("Authorization"))
    if (!token) return false
    const payload = await verifyJwt(token)
    return !!payload
}

export async function GET(req: Request) {
    if (!await requireAuth(req)) return NextResponse.json({ error: { message: "Não autorizado" } }, { status: 401 })
    try {
        const data = await participantesUsecases.listParticipantes()
        return NextResponse.json({ data })
    } catch (error: any) {
        return NextResponse.json({ error: { message: error.message } }, { status: 500 })
    }
}

export async function POST(req: Request) {
    if (!await requireAuth(req)) return NextResponse.json({ error: { message: "Não autorizado" } }, { status: 401 })
    try {
        const body = await req.json()
        const parsed = ParticipanteSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json({ error: { message: "Dados inválidos", details: parsed.error.issues } }, { status: 400 })
        }
        const data = await participantesUsecases.createParticipante(parsed.data)
        return NextResponse.json({ data })
    } catch (error: any) {
        // Handling unique constraint fail for email in a real app
        return NextResponse.json({ error: { message: error.message } }, { status: 500 })
    }
}
