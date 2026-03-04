"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { RegisterSchema, RegisterInput } from "@/modules/auth/schemas/auth-schema"
import { authApi } from "@/modules/auth/services/auth-api"
import { useAuth } from "@/providers/auth-provider"

export function RegisterForm() {
  const router = useRouter()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
  })

  async function onSubmit(data: RegisterInput) {
    try {
      setIsLoading(true)
      const res = await authApi.register(data)
      login(res.data.token)
      toast.success("Conta criada com sucesso!")
      router.push("/dashboard")
      router.refresh() // FIX: Gambiarra para forçar o login redirecionar automaticamente
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar conta")
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Criar Conta</CardTitle>
        <CardDescription>
          Preencha os dados abaixo para se registrar na plataforma.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              {...register("email")}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="senha">Senha</Label>
            <Input
              id="senha"
              type="password"
              placeholder="Criar senha"
              {...register("senha")}
              disabled={isLoading}
            />
            {errors.senha && (
              <p className="text-sm text-destructive">{errors.senha.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmSenha">Confirmar Senha</Label>
            <Input
              id="confirmSenha"
              type="password"
              placeholder="Confirmar senha"
              {...register("confirmSenha")}
              disabled={isLoading}
            />
            {errors.confirmSenha && (
              <p className="text-sm text-destructive">{errors.confirmSenha.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-4">
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Criando..." : "Criar conta"}
          </Button>
          <div className="text-sm text-center text-muted-foreground w-full">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Faça login
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
