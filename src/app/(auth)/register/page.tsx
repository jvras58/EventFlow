import type { Metadata } from "next";
import { RegisterForm } from "@/modules/auth/components/register-form"

export const metadata: Metadata = {
  title: "Cadastro - EventFlow",
  description: "Cadastro de usuário",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  )
}
