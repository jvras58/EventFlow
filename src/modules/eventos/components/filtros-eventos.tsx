"use client"
import * as React from "react"
import { Input } from "@/components/ui/input"

interface FiltrosEventosProps {
  onSearch: (busca: string) => void
}

export function FiltrosEventos({ onSearch }: FiltrosEventosProps) {
  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input
        type="search"
        placeholder="Buscar eventos..."
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  )
}
