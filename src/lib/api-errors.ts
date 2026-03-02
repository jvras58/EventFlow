// Helper classes padronizadas para respostas de erro
export class ApiError extends Error {
    public code: string
    public status: number
    public details?: any

    constructor(message: string, status: number = 500, code: string = "INTERNAL_ERROR", details?: any) {
        super(message)
        this.name = "ApiError"
        this.status = status
        this.code = code
        this.details = details
    }
}

export class BadRequestError extends ApiError {
    constructor(message: string = "Requisição inválida", details?: any) {
        super(message, 400, "BAD_REQUEST", details)
    }
}

export class UnauthorizedError extends ApiError {
    constructor(message: string = "Não autorizado") {
        super(message, 401, "UNAUTHORIZED")
    }
}

export class NotFoundError extends ApiError {
    constructor(message: string = "Recurso não encontrado") {
        super(message, 404, "NOT_FOUND")
    }
}

export function formatErrorResponse(error: any) {
    if (error instanceof ApiError) {
        return {
            error: {
                message: error.message,
                code: error.code,
                details: error.details
            }
        }
    }

    // Fallback para erros desconhecidos
    return {
        error: {
            message: error.message || "Erro interno no servidor",
            code: "INTERNAL_ERROR"
        }
    }
}
