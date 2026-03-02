export async function apiFetch(path: string, options: RequestInit = {}, token?: string | null) {
    const headers = new Headers(options.headers || {})

    if (token) {
        headers.set("Authorization", `Bearer ${token}`)
    }

    const res = await fetch(path, {
        ...options,
        headers
    })

    return res
}
