import { NextResponse } from "next/server"
import { userUsecases } from "@/modules/user/server/user-usecases"
import { UserUpdateSchema } from "@/modules/user/schemas/user-schema"
import { getBearerToken, verifyJwt } from "@/lib/auth"
import { ApiError, formatErrorResponse } from "@/lib/api-errors"

export async function PUT(req: Request) {
    try {
        const token = getBearerToken(req.headers.get("Authorization"))
        if (!token) throw new ApiError("Não autorizado", 401, "UNAUTHORIZED")

        const payload = await verifyJwt(token)
        if (!payload || !payload.userId) throw new ApiError("Token inválido", 401, "UNAUTHORIZED")

        const body = await req.json()
        const parsed = UserUpdateSchema.safeParse(body)

        if (!parsed.success) {
            throw new ApiError("Dados inválidos", 400, "BAD_REQUEST", parsed.error.issues)
        }

        const result = await userUsecases.updateProfile(payload.userId as string, parsed.data)

        return NextResponse.json({ data: result })
    } catch (error: any) {
        const formatted = formatErrorResponse(error)
        return NextResponse.json(formatted, { status: formatted.error.code === "UNAUTHORIZED" ? 401 : formatted.error.code === "BAD_REQUEST" ? 400 : 500 })
    }
}
