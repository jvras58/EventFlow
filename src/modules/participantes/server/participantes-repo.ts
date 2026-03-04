import prisma from "@/lib/prisma"
import { ParticipanteInput, ParticipanteUpdateInput } from "@/modules/participantes/schemas/participante-schema"

export const participantesRepo = {
    listParticipantes: async () => {
        return prisma.participante.findMany({
            include: { evento: true },
            orderBy: { createdAt: 'desc' }
        })
    },
    createParticipante: async (data: ParticipanteInput) => {
        return prisma.participante.create({ data })
    },
    updateParticipante: async (id: string, data: ParticipanteUpdateInput) => {
        return prisma.participante.update({ where: { id }, data })
    },
    deleteParticipante: async (id: string) => {
        return prisma.participante.delete({ where: { id } })
    }
}
