import prisma from "@/lib/prisma"

export const dashboardRepo = {
    getSummary: async () => {
        const [totalEventos, totalParticipantes] = await Promise.all([
            prisma.evento.count(),
            prisma.participante.count(),
        ])

        return {
            totalEventos,
            totalParticipantes
        }
    }
}
