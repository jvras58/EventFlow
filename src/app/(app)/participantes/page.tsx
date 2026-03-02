"use client"
import * as React from "react"
import { ContentLayout } from "@/components/content-layout"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
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
  const queryClient = useQueryClient()
  
  // Modals
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [editingPart, setEditingPart] = React.useState<Participante | null>(null)
  
  const [isTransferOpen, setIsTransferOpen] = React.useState(false)
  const [transferringPart, setTransferringPart] = React.useState<Participante | null>(null)

  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  const { data: participantes = [], isLoading: isLoadingParts } = useQuery({
    queryKey: ['participantes'],
    queryFn: () => participantesApi.listParticipantes(token!),
    enabled: !!token,
  })

  const { data: eventos = [], isLoading: isLoadingEvs } = useQuery({
    queryKey: ['eventos'],
    queryFn: () => eventosApi.listEventos(token!),
    enabled: !!token,
  })

  const isLoading = isLoadingParts || isLoadingEvs

  const saveMutation = useMutation({
    mutationFn: (param: { data: ParticipanteInput, id?: string }) => {
      if (param.id) return participantesApi.updateParticipante(param.id, param.data, token!)
      return participantesApi.createParticipante(param.data, token!)
    },
    onSuccess: (data, variables) => {
      toast.success(variables.id ? "Participante atualizado!" : "Participante cadastrado!")
      setIsFormOpen(false)
      queryClient.invalidateQueries({ queryKey: ['participantes'] })
    },
    onError: (error: Error) => toast.error(error.message)
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => participantesApi.deleteParticipante(id, token!),
    onSuccess: () => {
      toast.success("Participante excluído!")
      queryClient.invalidateQueries({ queryKey: ['participantes'] })
    },
    onError: (error: Error) => toast.error(error.message)
  })

  const transferMutation = useMutation({
    mutationFn: (param: { id: string, novoEventoId: string }) => 
      participantesApi.updateParticipante(param.id, { eventoId: param.novoEventoId }, token!),
    onSuccess: () => {
      toast.success("Participante transferido com sucesso!")
      setIsTransferOpen(false)
      queryClient.invalidateQueries({ queryKey: ['participantes'] })
    },
    onError: (error: Error) => toast.error(error.message)
  })

  const handleSave = async (data: ParticipanteInput, id?: string) => {
    saveMutation.mutate({ data, id })
  }

  const handleDelete = () => {
    if (deletingId) {
      deleteMutation.mutate(deletingId)
      setIsConfirmOpen(false)
    }
  }

  const handleTransfer = async (participanteId: string, novoEventoId: string) => {
    transferMutation.mutate({ id: participanteId, novoEventoId })
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
