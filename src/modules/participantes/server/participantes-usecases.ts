import { participantesRepo } from "@/modules/participantes/server/participantes-repo"
import { ParticipanteInput, ParticipanteUpdateInput } from "@/modules/participantes/schemas/participante-schema"
import { eventosUsecases } from "@/modules/eventos/server/eventos-usecases"

export const participantesUsecases = {
    listParticipantes: () => participantesRepo.listParticipantes(),
    createParticipante: async (data: ParticipanteInput) => {
        const evento = await eventosUsecases.getEventoById(data.eventoId)
        if (!evento) {
            throw new Error("Evento não encontrado.")
        }
        return participantesRepo.createParticipante(data)
    },
    updateParticipante: (id: string, data: ParticipanteUpdateInput) => {
        return participantesRepo.updateParticipante(id, data)
    },
    deleteParticipante: (id: string) => participantesRepo.deleteParticipante(id)
}
