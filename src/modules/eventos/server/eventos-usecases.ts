import { eventosRepo } from "./eventos-repo"
import { EventoInput, EventoUpdateInput } from "../schemas/evento-schema"

export const eventosUsecases = {
    listEventos: () => eventosRepo.listEventos(),
    getEventoById: (id: string) => eventosRepo.getEventoById(id),
    createEvento: (data: EventoInput) => eventosRepo.createEvento(data),
    updateEvento: (id: string, data: EventoUpdateInput) => eventosRepo.updateEvento(id, data),
    deleteEvento: (id: string) => eventosRepo.deleteEvento(id)
}
