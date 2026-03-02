import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "event-flow-secret-key-123"
)

export function getBearerToken(authHeader: string | null): string | null {
    if (!authHeader?.startsWith("Bearer ")) {
        return null
    }
    return authHeader.substring(7)
}

export async function verifyJwt(token: string) {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET)
        return payload
    } catch (err) {
        return null
    }
}
