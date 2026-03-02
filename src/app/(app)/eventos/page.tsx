"use client"
import * as React from "react"
import { useRouter } from "next/navigation"
import { ContentLayout } from "@/components/content-layout"
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
  
  const [eventos, setEventos] = React.useState<Evento[]>([])
  const [busca, setBusca] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(true)

  // Dialog states
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [editingEvento, setEditingEvento] = React.useState<Evento | null>(null)
  
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  const loadEventos = React.useCallback(async () => {
    if (!token) return
    try {
      setIsLoading(true)
      const data = await eventosApi.listEventos(token)
      setEventos(data)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }, [token])

  React.useEffect(() => {
    loadEventos()
  }, [loadEventos])

  const handleSave = async (data: EventoInput, id?: string) => {
    if (!token) return
    try {
      if (id) {
        await eventosApi.updateEvento(id, data, token)
        toast.success("Evento atualizado!")
      } else {
        await eventosApi.createEvento(data, token)
        toast.success("Evento criado!")
      }
      setIsFormOpen(false)
      loadEventos()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleDelete = async () => {
    if (!token || !deletingId) return
    try {
      await eventosApi.deleteEvento(deletingId, token)
      toast.success("Evento excluído!")
      loadEventos()
    } catch (error: any) {
      toast.error(error.message)
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
