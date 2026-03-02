"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
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
import { LoginSchema, LoginInput } from "../schemas/auth-schema"
import { authApi } from "../services/auth-api"
import { useAuth } from "@/providers/auth-provider"

export function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
  })

  async function onSubmit(data: LoginInput) {
    try {
      setIsLoading(true)
      const res = await authApi.login(data)
      login(res.token)
      toast.success("Login realizado com sucesso!")
      router.push("/dashboard")
    } catch (error: any) {
      toast.error(error.message || "Erro ao realizar login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Insira seu e-mail e senha para acessar (use admin@vlab.com / 123).
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@vlab.com"
              {...register("email")}
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
              placeholder="Sua senha"
              {...register("senha")}
            />
            {errors.senha && (
              <p className="text-sm text-destructive">{errors.senha.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
