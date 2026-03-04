import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserUpdateInput, UserUpdateSchema } from "@/modules/user/schemas/user-schema"
import { useAuth } from "@/providers/auth-provider"
import { userApi } from "@/modules/user/services/user-api"

interface ProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const { user, token, login } = useAuth()
  
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<UserUpdateInput>({
    resolver: zodResolver(UserUpdateSchema),
    defaultValues: {
      email: user?.email || "",
      senhaAtual: "",
      novaSenha: ""
    }
  })

  React.useEffect(() => {
    if (open && user) {
      reset({ email: user.email, senhaAtual: "", novaSenha: "" })
    }
  }, [open, user, reset])

  const onSubmit = async (data: UserUpdateInput) => {
    if (!token) return
    try {
      const result = await userApi.updateProfile(data, token)
      login(result.token)
      toast.success("Perfil atualizado com sucesso!")
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogDescription>
            Faça mudanças no seu e-mail de acesso ou altere sua senha.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input {...register("email")} />
            {errors.email && <span className="text-xs text-destructive">{errors.email.message}</span>}
          </div>

          <div className="space-y-2">
            <Label>Senha Atual <span className="text-destructive">*</span></Label>
            <Input type="password" {...register("senhaAtual")} placeholder="Obrigatório para confirmar" />
            {errors.senhaAtual && <span className="text-xs text-destructive">{errors.senhaAtual.message}</span>}
          </div>

          <div className="space-y-2">
            <Label>Nova Senha</Label>
            <Input type="password" {...register("novaSenha")} placeholder="Preencha apenas se quiser trocar" />
            {errors.novaSenha && <span className="text-xs text-destructive">{errors.novaSenha.message}</span>}
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar mudanças"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
