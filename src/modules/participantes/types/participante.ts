import { Evento } from "@/modules/eventos/types/evento"

export interface Participante {
    id: string
    nome: string
    email: string
    eventoId: string
    evento?: Evento
    createdAt: string | Date
}
