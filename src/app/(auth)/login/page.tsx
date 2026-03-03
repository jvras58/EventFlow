import type { Metadata } from "next";
import Link from "next/link"
import { CalendarCheck, ArrowLeft } from "lucide-react"
import { LoginForm } from "@/modules/auth/components/login-form"

export const metadata: Metadata = {
  title: "Login - EventFlow",
  description: "Login",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4 sm:p-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl opacity-50 pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-72 h-72 bg-primary/30 rounded-full blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-violet-500/20 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="w-full max-w-md z-10 space-y-8">
        <div className="flex flex-col items-center">
          
          <div className="flex flex-col items-center gap-4 mt-8 sm:mt-0">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <CalendarCheck className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent">
              EventFlow
            </span>
          </div>
        </div>

        <div className="bg-background/60 backdrop-blur-sm rounded-xl">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
