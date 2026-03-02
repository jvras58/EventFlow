import { participantesRepo } from "./participantes-repo"
import { ParticipanteInput, ParticipanteUpdateInput } from "../schemas/participante-schema"

export const participantesUsecases = {
    listParticipantes: () => participantesRepo.listParticipantes(),
    createParticipante: async (data: ParticipanteInput) => {
        // Validar se evento existe poderia ser feito aqui consultando o banco
        return participantesRepo.createParticipante(data)
    },
    updateParticipante: (id: string, data: ParticipanteUpdateInput) => {
        return participantesRepo.updateParticipante(id, data)
    },
    deleteParticipante: (id: string) => participantesRepo.deleteParticipante(id)
}
