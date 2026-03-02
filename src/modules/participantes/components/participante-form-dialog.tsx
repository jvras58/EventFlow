"use client"
import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ParticipanteSchema, ParticipanteInput } from "../schemas/participante-schema"
import { Participante } from "../types/participante"
import { Evento } from "@/modules/eventos/types/evento"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface ParticipanteFormDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: ParticipanteInput, id?: string) => Promise<void>
  initialData?: Participante | null
  eventos: Evento[]
}

export function ParticipanteFormDialog({ isOpen, onClose, onSave, initialData, eventos }: ParticipanteFormDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ParticipanteInput>({
    resolver: zodResolver(ParticipanteSchema),
  })

  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          nome: initialData.nome,
          email: initialData.email,
          eventoId: initialData.eventoId,
        })
      } else {
        reset({ nome: "", email: "", eventoId: "" })
      }
    }
  }, [isOpen, initialData, reset])

  const eventoIdValue = watch("eventoId")

  const onSubmit = async (data: ParticipanteInput) => {
    await onSave(data, initialData?.id)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Participante" : "Novo Participante"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" {...register("nome")} />
            {errors.nome && <p className="text-sm text-destructive">{errors.nome.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="eventoId">Evento</Label>
            <Select value={eventoIdValue} onValueChange={(val) => setValue("eventoId", val, { shouldValidate: true })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um evento" />
              </SelectTrigger>
              <SelectContent>
                {eventos.map(ev => (
                  <SelectItem key={ev.id} value={ev.id}>{ev.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.eventoId && <p className="text-sm text-destructive">{errors.eventoId.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
