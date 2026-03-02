export interface Evento {
    id: string
    nome: string
    data: string | Date
    local: string
    status: "ATIVO" | "ENCERRADO" | "PENDENTE"
    createdAt: string | Date
}
