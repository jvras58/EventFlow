import type { Metadata } from "next";
import { ContentLayout } from "@/components/content-layout"
import { Button } from "@/components/ui/button"
import { EventosList } from "@/modules/eventos/components/eventos-list"
import { EventoFormDialog } from "@/modules/eventos/components/evento-form-dialog"

export const metadata: Metadata = {
  title: "Eventos - EventFlow",
  description: "Lista de eventos",
};

export default function EventosPage() {
  return (
    <ContentLayout 
      title="Eventos"
      actions={
        <EventoFormDialog>
          <Button>Novo Evento</Button>
        </EventoFormDialog>
      }
    >
      <EventosList />
    </ContentLayout>
  )
}
