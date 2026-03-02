"use client"
import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { ParticipanteSchema, ParticipanteInput } from "../schemas/participante-schema"
import { Participante } from "../types/participante"
import { participantesApi } from "../services/participantes-api"
import { eventosApi } from "@/modules/eventos/services/eventos-api"
import { useAuth } from "@/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"

interface ParticipanteFormDialogProps {
  children: React.ReactNode
  initialData?: Participante | null
}

export function ParticipanteFormDialog({ children, initialData }: ParticipanteFormDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const { token } = useAuth()
  const queryClient = useQueryClient()

  const { data: eventos = [] } = useQuery({
    queryKey: ['eventos'],
    queryFn: () => eventosApi.listEventos(token!),
    enabled: !!token && isOpen,
  })

  const defaultFormValues: ParticipanteInput = initialData ? {
    nome: initialData.nome,
    email: initialData.email,
    eventoId: initialData.eventoId,
    checkIn: initialData.checkIn ?? false
  } : { nome: "", email: "", eventoId: "", checkIn: false }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ParticipanteInput>({
    resolver: zodResolver(ParticipanteSchema),
    values: defaultFormValues
  })

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      reset(defaultFormValues)
    }
  }

  const eventoIdValue = watch("eventoId")

  const saveMutation = useMutation({
    mutationFn: (data: ParticipanteInput) => {
      if (initialData) return participantesApi.updateParticipante(initialData.id, data, token!)
      return participantesApi.createParticipante(data, token!)
    },
    onSuccess: () => {
      toast.success(initialData ? "Participante atualizado!" : "Participante cadastrado!")
      setIsOpen(false)
      queryClient.invalidateQueries({ queryKey: ['participantes'] })
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] })
    },
    onError: (error: Error) => toast.error(error.message)
  })

  const onSubmit = async (data: ParticipanteInput) => {
    saveMutation.mutate(data)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
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
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
