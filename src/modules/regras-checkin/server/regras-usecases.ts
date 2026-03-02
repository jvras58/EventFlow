import { regrasRepo } from "./regras-repo"
import { RegraCheckinInput, validateRegras } from "../schemas/regra-checkin-schema"
import prisma from "@/lib/prisma"

export const regrasUsecases = {
    getRegras: async (eventoId: string) => {
        return regrasRepo.getRegrasByEventoId(eventoId)
    },
    updateRegras: async (eventoId: string, regras: RegraCheckinInput[]) => {
        // Valida se o evento existe
        const evento = await prisma.evento.findUnique({ where: { id: eventoId } })
        if (!evento) throw new Error("Evento não encontrado")

        // Validação de negócio no servidor (bloqueia o request memo se o client burlar)
        const validation = validateRegras(regras)
        if (!validation.valid) {
            throw new Error(`Validação falhou: ${validation.errors.join(", ")}`)
        }
        const result = await regrasRepo.replaceRegras(eventoId, regras)

        if (regras.length > 0 && evento.status === "PENDENTE") {
            await prisma.evento.update({
                where: { id: eventoId },
                data: { status: "ATIVO" }
            })
        } else if (regras.length === 0 && (evento.status === "ATIVO" || evento.status === "PENDENTE")) {
            await prisma.evento.update({
                where: { id: eventoId },
                data: { status: "PENDENTE" }
            })
        }

        return result
    }
}
