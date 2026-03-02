"use client"
import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { participantesApi } from "@/modules/participantes/services/participantes-api"
import { eventosApi } from "@/modules/eventos/services/eventos-api"
import { ParticipantesTable } from "@/modules/participantes/components/participantes-table"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { useAuth } from "@/providers/auth-provider"

export function ParticipantesList() {
  const { token } = useAuth()
  const queryClient = useQueryClient()
  
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  const { data: participantes = [], isLoading: isLoadingParts } = useQuery({
    queryKey: ['participantes'],
    queryFn: () => participantesApi.listParticipantes(token!),
    enabled: !!token,
  })
  
  const deleteMutation = useMutation({
    mutationFn: (id: string) => participantesApi.deleteParticipante(id, token!),
    onSuccess: () => {
      toast.success("Participante excluído!")
      queryClient.invalidateQueries({ queryKey: ['participantes'] })
    },
    onError: (error: Error) => toast.error(error.message)
  })

  const handleDelete = () => {
    if (deletingId) {
      deleteMutation.mutate(deletingId)
      setIsConfirmOpen(false)
    }
  }

  return (
    <div className="space-y-4">
      {isLoadingParts ? (
        <div>Carregando...</div>
      ) : (
        <ParticipantesTable 
          participantes={participantes}
          onDelete={id => { setDeletingId(id); setIsConfirmOpen(true); }}
        />
      )}

      <ConfirmDialog 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Excluir Participante"
        description="Tem certeza? Esta ação removerá o participante do evento."
        destructive
      />
    </div>
  )
}
