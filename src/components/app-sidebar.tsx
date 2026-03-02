import * as React from "react"
import Link from "next/link"

export function AppSidebar() {
  return (
    <div className="w-64 flex-col hidden md:flex border-r min-h-screen bg-muted/40 p-4 gap-4">
      <div className="flex h-12 items-center px-2">
        <h2 className="text-lg font-semibold">Menu</h2>
      </div>
      <nav className="flex flex-col gap-2">
        <Link href="/dashboard" className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium rounded-md hover:bg-muted hover:text-foreground">Dashboard</Link>
        <Link href="/eventos" className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium rounded-md hover:bg-muted hover:text-foreground">Eventos</Link>
        <Link href="/participantes" className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium rounded-md hover:bg-muted hover:text-foreground">Participantes</Link>
      </nav>
    </div>
  )
}
