import { jwtVerify, SignJWT } from "jose"

export async function signJwt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("24h")
        .sign(JWT_SECRET)
}

export const JWT_SECRET = new TextEncoder().encode(
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
