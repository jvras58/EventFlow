"use client"
import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { EventoSchema, EventoInput } from "../schemas/evento-schema"
import { Evento } from "../types/evento"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface EventoFormDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: EventoInput, id?: string) => Promise<void>
  initialData?: Evento | null
}

export function EventoFormDialog({ isOpen, onClose, onSave, initialData }: EventoFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventoInput>({
    resolver: zodResolver(EventoSchema),
  })

  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          nome: initialData.nome,
          local: initialData.local,
          data: new Date(initialData.data).toISOString().substring(0, 16) as any,
        })
      } else {
        reset({ nome: "", local: "", data: new Date() as any })
      }
    }
  }, [isOpen, initialData, reset])

  const onSubmit = async (data: EventoInput) => {
    await onSave(data, initialData?.id)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Evento" : "Novo Evento"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" {...register("nome")} />
            {errors.nome && <p className="text-sm text-destructive">{errors.nome.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="data">Data e Hora</Label>
            <Input id="data" type="datetime-local" {...register("data")} />
            {errors.data && <p className="text-sm text-destructive">{errors.data.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="local">Local</Label>
            <Input id="local" {...register("local")} />
            {errors.local && <p className="text-sm text-destructive">{errors.local.message}</p>}
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
