import prisma from "@/lib/prisma"
import { RegraCheckinInput } from "@/modules/regras-checkin/schemas/regra-checkin-schema"

export const regrasRepo = {
    getRegrasByEventoId: async (eventoId: string) => {
        return prisma.regraCheckin.findMany({
            where: { eventoId }
        })
    },
    replaceRegras: async (eventoId: string, regras: RegraCheckinInput[]) => {
        return prisma.$transaction(async (tx) => {
            await tx.regraCheckin.deleteMany({
                where: { eventoId }
            })
            if (regras.length > 0) {
                await tx.regraCheckin.createMany({
                    data: regras.map(r => ({
                        nomeRegra: r.nomeRegra,
                        ativo: r.ativo,
                        obrigatorio: r.obrigatorio,
                        liberarMinAntes: r.liberarMinAntes,
                        encerrarMinDepois: r.encerrarMinDepois,
                        eventoId
                    }))
                })
            }

            return tx.regraCheckin.findMany({
                where: { eventoId }
            })
        })
    }
}
