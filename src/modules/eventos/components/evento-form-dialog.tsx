"use client"
import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { EventoSchema, EventoInput } from "../schemas/evento-schema"
import { Evento } from "../types/evento"
import { eventosApi } from "../services/eventos-api"
import { useAuth } from "@/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EventoFormDialogProps {
  children: React.ReactNode
  initialData?: Evento | null
}

export function EventoFormDialog({ children, initialData }: EventoFormDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const { token } = useAuth()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventoInput>({
    resolver: zodResolver(EventoSchema),
    defaultValues: { status: "ATIVO" }
  })

  const statusValue = watch("status")

  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          nome: initialData.nome,
          local: initialData.local,
          data: new Date(initialData.data).toISOString().substring(0, 16) as any,
          status: initialData.status
        })
      } else {
        reset({ nome: "", local: "", data: new Date() as any, status: "ATIVO" })
      }
    }
  }, [isOpen, initialData, reset])

  const saveMutation = useMutation({
    mutationFn: (data: EventoInput) => {
      if (initialData) return eventosApi.updateEvento(initialData.id, data, token!)
      return eventosApi.createEvento(data, token!)
    },
    onSuccess: () => {
      toast.success(initialData ? "Evento atualizado!" : "Evento criado!")
      setIsOpen(false)
      queryClient.invalidateQueries({ queryKey: ['eventos'] })
    },
    onError: (error: Error) => toast.error(error.message)
  })

  const onSubmit = async (data: EventoInput) => {
    saveMutation.mutate(data)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
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
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={statusValue} onValueChange={(val: "ATIVO" | "ENCERRADO") => setValue("status", val, { shouldValidate: true })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ATIVO">Ativo</SelectItem>
                <SelectItem value="ENCERRADO">Encerrado</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && <p className="text-sm text-destructive">{errors.status.message}</p>}
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
