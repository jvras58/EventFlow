import prisma from "@/lib/prisma"

export const dashboardRepo = {
    getSummary: async () => {
        const [totalEventos, totalParticipantes, eventosAtivos, checkinsRealizados, proximosEventos, checkinsRecentes] = await Promise.all([
            prisma.evento.count(),
            prisma.participante.count(),
            prisma.evento.count({
                where: { status: 'ATIVO' }
            }),
            prisma.participante.count({
                where: { checkIn: true }
            }),
            prisma.evento.findMany({
                where: {
                    data: {
                        gte: new Date()
                    }
                },
                orderBy: {
                    data: 'asc'
                },
                take: 5,
                select: {
                    id: true,
                    nome: true,
                    data: true,
                    local: true,
                    status: true
                }
            }),
            prisma.participante.findMany({
                where: {
                    checkIn: true
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: 5,
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    checkIn: true,
                    createdAt: true,
                    evento: {
                        select: {
                            nome: true
                        }
                    }
                }
            })
        ])

        return {
            totalEventos,
            totalParticipantes,
            eventosAtivos,
            checkinsRealizados,
            proximosEventos,
            checkinsRecentes
        }
    }
}
