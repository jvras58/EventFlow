"use client"
import * as React from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { eventosApi } from "@/modules/eventos/services/eventos-api"
import { EventosTable } from "@/modules/eventos/components/eventos-table"
import { FiltrosEventos } from "@/modules/eventos/components/filtros-eventos"
import { useAuth } from "@/providers/auth-provider"
import { ConfirmDialog } from "@/components/confirm-dialog"

export function EventosList() {
  const router = useRouter()
  const { token } = useAuth()
  const queryClient = useQueryClient()
  
  const [busca, setBusca] = React.useState("")
  
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  const { data: eventos = [], isLoading } = useQuery({
    queryKey: ['eventos'],
    queryFn: () => eventosApi.listEventos(token!),
    enabled: !!token,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => eventosApi.deleteEvento(id, token!),
    onSuccess: () => {
      toast.success("Evento excluído!")
      queryClient.invalidateQueries({ queryKey: ['eventos'] })
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

  const eventosFiltrados = eventos.filter(ev => 
    ev.nome.toLowerCase().includes(busca.toLowerCase()) || 
    ev.local.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <FiltrosEventos onSearch={setBusca} />
      
      {isLoading ? (
        <div>Carregando...</div>
      ) : (
        <EventosTable 
          eventos={eventosFiltrados}
          onDelete={id => { setDeletingId(id); setIsConfirmOpen(true); }}
          onViewRegras={id => router.push(`/eventos/${id}/regras-checkin`)}
        />
      )}

      <ConfirmDialog 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Excluir Evento"
        description="Tem certeza? Isso apagará o evento e possivelmente os participantes/regras vinculados a ele."
        destructive
      />
    </div>
  )
}
