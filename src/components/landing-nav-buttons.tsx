"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/providers/auth-provider"
import { ThemeToggle } from "@/components/theme-toggle"

export function LandingNavButtons() {
  const { isAuthenticated, isInitializing } = useAuth()

  return (
    <div className="flex items-center gap-4">
      <ThemeToggle />
      {!isInitializing && (
        <>
          {!isAuthenticated && (
            <Link href="/login">
              <Button variant="ghost" className="hidden sm:flex">Entrar</Button>
            </Link>
          )}
          <Link href="/dashboard">
            <Button>{isAuthenticated ? "Ir para o Dashboard" : "Teste Agora"}</Button>
          </Link>
        </>
      )}
    </div>
  )
}
