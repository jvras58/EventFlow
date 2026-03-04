"use client"
import * as React from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Participante } from "@/modules/participantes/types/participante"
import { participantesApi } from "@/modules/participantes/services/participantes-api"
import { eventosApi } from "@/modules/eventos/services/eventos-api"
import { useAuth } from "@/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger } from "@/components/ui/dialog"

interface TransferirParticipanteDialogProps {
  children: React.ReactNode
  participante: Participante
}

export function TransferirParticipanteDialog({ children, participante }: TransferirParticipanteDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [novoEventoId, setNovoEventoId] = React.useState("")
  const { token } = useAuth()
  const queryClient = useQueryClient()

  const { data: eventos = [] } = useQuery({
    queryKey: ['eventos'],
    queryFn: () => eventosApi.listEventos(token!),
    enabled: !!token && isOpen,
  })

  React.useEffect(() => {
    if (isOpen) setNovoEventoId("")
  }, [isOpen])

  const transferMutation = useMutation({
    mutationFn: (param: { id: string, novoEventoId: string }) => 
      participantesApi.updateParticipante(param.id, { eventoId: param.novoEventoId }, token!),
    onSuccess: () => {
      toast.success("Participante transferido com sucesso!")
      setIsOpen(false)
      queryClient.invalidateQueries({ queryKey: ['participantes'] })
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] })
    },
    onError: (error: Error) => toast.error(error.message)
  })

  const handleTransfer = async () => {
    if (!novoEventoId || novoEventoId === participante.eventoId) return
    transferMutation.mutate({ id: participante.id, novoEventoId })
  }

  const eventosDisponiveis = eventos.filter(ev => ev.id !== participante.eventoId)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transferir Participante</DialogTitle>
          <DialogDescription>
            Trocando o evento de {participante.nome}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Evento Atual</Label>
            <div className="p-2 bg-muted rounded-md text-sm">{participante.evento?.nome || "-"}</div>
          </div>
          <div className="space-y-2">
            <Label>Novo Evento</Label>
            <Select value={novoEventoId} onValueChange={setNovoEventoId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o novo evento" />
              </SelectTrigger>
              <SelectContent>
                {eventosDisponiveis.map(ev => (
                  <SelectItem key={ev.id} value={ev.id}>{ev.nome}</SelectItem>
                ))}
                {eventosDisponiveis.length === 0 && (
                  <div className="p-2 text-sm text-muted-foreground text-center">Nenhum outro evento.</div>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
          <Button 
            onClick={handleTransfer} 
            disabled={transferMutation.isPending || !novoEventoId || novoEventoId === participante.eventoId}
          >
            {transferMutation.isPending ? "Transferindo..." : "Transferir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
