"use client"
import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { participantesApi } from "@/modules/participantes/services/participantes-api"
import { eventosApi } from "@/modules/eventos/services/eventos-api"
import { ParticipantesTable } from "@/modules/participantes/components/participantes-table"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { useAuth } from "@/providers/auth-provider"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function ParticipantesList() {
  const { token } = useAuth()
  const queryClient = useQueryClient()
  
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")

  const { data: participantes = [], isLoading: isLoadingParts } = useQuery({
    queryKey: ['participantes'],
    queryFn: () => participantesApi.listParticipantes(token!),
    enabled: !!token,
  })

  const filteredParticipantes = participantes.filter(p => {
    if (!searchQuery) return true
    const lowerQuery = searchQuery.toLowerCase()
    return p.nome.toLowerCase().includes(lowerQuery) || 
           (p.evento?.nome && p.evento.nome.toLowerCase().includes(lowerQuery))
  })
  
  const deleteMutation = useMutation({
    mutationFn: (id: string) => participantesApi.deleteParticipante(id, token!),
    onSuccess: () => {
      toast.success("Participante excluído!")
      queryClient.invalidateQueries({ queryKey: ['participantes'] })
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] })
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
      <div className="w-full md:w-1/3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Pesquisar por nome ou evento..." 
            className="pl-8" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoadingParts ? (
        <div>Carregando...</div>
      ) : (
        <ParticipantesTable 
          participantes={filteredParticipantes}
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
