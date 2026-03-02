"use client"
import * as React from "react"
import { Participante } from "../types/participante"
import { Evento } from "@/modules/eventos/types/evento"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"

interface TransferirParticipanteDialogProps {
  isOpen: boolean
  onClose: () => void
  onTransfer: (participanteId: string, novoEventoId: string) => Promise<void>
  participante: Participante | null
  eventos: Evento[]
}

export function TransferirParticipanteDialog({ isOpen, onClose, onTransfer, participante, eventos }: TransferirParticipanteDialogProps) {
  const [novoEventoId, setNovoEventoId] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (isOpen) setNovoEventoId("")
  }, [isOpen])

  if (!participante) return null

  const handleTransfer = async () => {
    if (!novoEventoId || novoEventoId === participante.eventoId) return
    setIsSubmitting(true)
    await onTransfer(participante.id, novoEventoId)
    setIsSubmitting(false)
  }

  const eventosDisponiveis = eventos.filter(ev => ev.id !== participante.eventoId)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button 
            onClick={handleTransfer} 
            disabled={isSubmitting || !novoEventoId || novoEventoId === participante.eventoId}
          >
            Transferir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
