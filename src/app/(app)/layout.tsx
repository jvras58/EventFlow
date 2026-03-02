"use client"
import * as React from "react"
import { useAuth } from "@/providers/auth-provider"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { AppSidebar } from "@/components/app-sidebar"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isInitializing } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (mounted && !isInitializing && !isAuthenticated) {
      router.push("/login")
    }
  }, [mounted, isInitializing, isAuthenticated, router])

  if (!mounted || isInitializing || !isAuthenticated) {
    return <div className="flex bg-background min-h-screen items-center justify-center">Carregando...</div>
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
