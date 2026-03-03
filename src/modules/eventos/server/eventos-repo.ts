import prisma from "@/lib/prisma"
import { EventoInput, EventoUpdateInput } from "../schemas/evento-schema"

export const eventosRepo = {
    listEventos: async () => {
        return prisma.evento.findMany({ orderBy: { data: 'asc' } })
    },
    getEventoById: async (id: string) => {
        return prisma.evento.findUnique({ where: { id } })
    },
    createEvento: async (data: EventoInput) => {
        return prisma.evento.create({ data: { ...data, data: new Date(data.data) } })
    },
    updateEvento: async (id: string, data: EventoUpdateInput) => {
        return prisma.evento.update({
            where: { id },
            data: { ...data, data: data.data ? new Date(data.data) : undefined }
        })
    },
    deleteEvento: async (id: string) => {
        return prisma.evento.delete({ where: { id } })
    }
}
