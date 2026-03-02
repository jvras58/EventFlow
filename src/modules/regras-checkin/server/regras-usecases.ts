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

        return regrasRepo.replaceRegras(eventoId, regras)
    }
}
