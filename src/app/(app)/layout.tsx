"use client"
import * as React from "react"
import { useAuth } from "@/providers/auth-provider"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { AppSidebar } from "@/components/app-sidebar"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/login")
    }
  }, [mounted, isAuthenticated, router])

  if (!mounted || !isAuthenticated) {
    return <div className="flex bg-background min-h-screen items-center justify-center">Carregando...</div>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <AppSidebar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
