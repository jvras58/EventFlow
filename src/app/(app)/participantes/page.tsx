"use client"
import * as React from "react"
import { ContentLayout } from "@/components/content-layout"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/providers/auth-provider"
import { toast } from "sonner"
import { participantesApi } from "@/modules/participantes/services/participantes-api"
import { eventosApi } from "@/modules/eventos/services/eventos-api"
import { Participante } from "@/modules/participantes/types/participante"
import { Evento } from "@/modules/eventos/types/evento"
import { ParticipanteInput } from "@/modules/participantes/schemas/participante-schema"
import { ParticipantesTable } from "@/modules/participantes/components/participantes-table"
import { ParticipanteFormDialog } from "@/modules/participantes/components/participante-form-dialog"
import { TransferirParticipanteDialog } from "@/modules/participantes/components/transferir-participante-dialog"

export default function ParticipantesPage() {
  const { token } = useAuth()
  
  const [participantes, setParticipantes] = React.useState<Participante[]>([])
  const [eventos, setEventos] = React.useState<Evento[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  // Modals
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [editingPart, setEditingPart] = React.useState<Participante | null>(null)
  
  const [isTransferOpen, setIsTransferOpen] = React.useState(false)
  const [transferringPart, setTransferringPart] = React.useState<Participante | null>(null)

  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  const loadData = React.useCallback(async () => {
    if (!token) return
    try {
      setIsLoading(true)
      const [partsData, evsData] = await Promise.all([
        participantesApi.listParticipantes(token),
        eventosApi.listEventos(token)
      ])
      setParticipantes(partsData)
      setEventos(evsData)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }, [token])

  React.useEffect(() => {
    loadData()
  }, [loadData])

  const handleSave = async (data: ParticipanteInput, id?: string) => {
    if (!token) return
    try {
      if (id) {
        await participantesApi.updateParticipante(id, data, token)
        toast.success("Participante atualizado!")
      } else {
        await participantesApi.createParticipante(data, token)
        toast.success("Participante cadastrado!")
      }
      setIsFormOpen(false)
      loadData()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleDelete = async () => {
    if (!token || !deletingId) return
    try {
      await participantesApi.deleteParticipante(deletingId, token)
      toast.success("Participante excluído!")
      loadData()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleTransfer = async (participanteId: string, novoEventoId: string) => {
    if (!token) return
    try {
      await participantesApi.updateParticipante(participanteId, { eventoId: novoEventoId }, token)
      toast.success("Participante transferido com sucesso!")
      setIsTransferOpen(false)
      loadData()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <ContentLayout 
      title="Participantes"
      actions={
        <Button onClick={() => { setEditingPart(null); setIsFormOpen(true); }}>
          Novo Participante
        </Button>
      }
    >
      <div className="space-y-4">
        {isLoading ? (
          <div>Carregando...</div>
        ) : (
          <ParticipantesTable 
            participantes={participantes}
            onEdit={part => { setEditingPart(part); setIsFormOpen(true); }}
            onDelete={id => { setDeletingId(id); setIsConfirmOpen(true); }}
            onTransfer={part => { setTransferringPart(part); setIsTransferOpen(true); }}
          />
        )}
      </div>

      <ParticipanteFormDialog 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
        initialData={editingPart}
        eventos={eventos}
      />

      <TransferirParticipanteDialog
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        onTransfer={handleTransfer}
        participante={transferringPart}
        eventos={eventos}
      />

      <ConfirmDialog 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Excluir Participante"
        description="Tem certeza? Esta ação removerá o participante do evento."
        destructive
      />
    </ContentLayout>
  )
}
