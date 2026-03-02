import { ContentLayout } from "@/components/content-layout"
import { Button } from "@/components/ui/button"
import { ParticipantesList } from "@/modules/participantes/components/participantes-list"
import { ParticipanteFormDialog } from "@/modules/participantes/components/participante-form-dialog"

export default function ParticipantesPage() {
  return (
    <ContentLayout 
      title="Participantes"
      actions={
        <ParticipanteFormDialog>
          <Button>Novo Participante</Button>
        </ParticipanteFormDialog>
      }
    >
      <ParticipantesList />
    </ContentLayout>
  )
}
