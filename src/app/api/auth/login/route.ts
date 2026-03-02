import { NextResponse } from "next/server"
import { LoginSchema } from "@/modules/auth/schemas/auth-schema"
import { authUsecases } from "@/modules/auth/server/auth-usecases"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const result = LoginSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json({ error: { message: "Dados inválidos", details: result.error.issues } }, { status: 400 })
        }

        const { token } = await authUsecases.login(result.data)

        return NextResponse.json({ data: { token } })
    } catch (error: any) {
        return NextResponse.json({ error: { message: error.message || "Erro no login" } }, { status: 401 })
    }
}
