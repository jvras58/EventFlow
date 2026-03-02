"use client"
import * as React from "react"
import { useRouter } from "next/navigation"
import { ContentLayout } from "@/components/content-layout"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/providers/auth-provider"
import { toast } from "sonner"
import { eventosApi } from "@/modules/eventos/services/eventos-api"
import { Evento } from "@/modules/eventos/types/evento"
import { EventoInput } from "@/modules/eventos/schemas/evento-schema"
import { EventosTable } from "@/modules/eventos/components/eventos-table"
import { FiltrosEventos } from "@/modules/eventos/components/filtros-eventos"
import { EventoFormDialog } from "@/modules/eventos/components/evento-form-dialog"

export default function EventosPage() {
  const router = useRouter()
  const { token } = useAuth()
  const queryClient = useQueryClient()
  
  const [busca, setBusca] = React.useState("")

  // Dialog states
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [editingEvento, setEditingEvento] = React.useState<Evento | null>(null)
  
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  const { data: eventos = [], isLoading } = useQuery({
    queryKey: ['eventos'],
    queryFn: () => eventosApi.listEventos(token!),
    enabled: !!token,
  })

  const saveMutation = useMutation({
    mutationFn: (param: { data: EventoInput, id?: string }) => {
      if (param.id) return eventosApi.updateEvento(param.id, param.data, token!)
      return eventosApi.createEvento(param.data, token!)
    },
    onSuccess: (data, variables) => {
      toast.success(variables.id ? "Evento atualizado!" : "Evento criado!")
      setIsFormOpen(false)
      queryClient.invalidateQueries({ queryKey: ['eventos'] })
    },
    onError: (error: Error) => toast.error(error.message)
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => eventosApi.deleteEvento(id, token!),
    onSuccess: () => {
      toast.success("Evento excluído!")
      queryClient.invalidateQueries({ queryKey: ['eventos'] })
    },
    onError: (error: Error) => toast.error(error.message)
  })

  const handleSave = async (data: EventoInput, id?: string) => {
    saveMutation.mutate({ data, id })
  }

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
    <ContentLayout 
      title="Eventos"
      actions={
        <Button onClick={() => { setEditingEvento(null); setIsFormOpen(true); }}>
          Novo Evento
        </Button>
      }
    >
      <div className="space-y-4">
        <FiltrosEventos onSearch={setBusca} />
        
        {isLoading ? (
          <div>Carregando...</div>
        ) : (
          <EventosTable 
            eventos={eventosFiltrados}
            onEdit={ev => { setEditingEvento(ev); setIsFormOpen(true); }}
            onDelete={id => { setDeletingId(id); setIsConfirmOpen(true); }}
            onViewRegras={id => router.push(`/eventos/${id}/regras-checkin`)}
          />
        )}
      </div>

      <EventoFormDialog 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
        initialData={editingEvento}
      />

      <ConfirmDialog 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Excluir Evento"
        description="Tem certeza? Isso apagará o evento e possivelmente os participantes/regras vinculados a ele."
        destructive
      />
    </ContentLayout>
  )
}
