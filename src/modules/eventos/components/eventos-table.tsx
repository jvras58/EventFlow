"use client"
import * as React from "react"
import { Evento } from "../types/evento"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface EventosTableProps {
  eventos: Evento[]
  onEdit: (evento: Evento) => void
  onDelete: (id: string) => void
  onViewRegras: (id: string) => void
}

export function EventosTable({ eventos, onEdit, onDelete, onViewRegras }: EventosTableProps) {
  if (eventos.length === 0) {
    return <div className="p-4 text-center text-muted-foreground">Nenhum evento encontrado.</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Local</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {eventos.map((ev) => (
            <TableRow key={ev.id}>
              <TableCell className="font-medium">{ev.nome}</TableCell>
              <TableCell>{new Date(ev.data).toLocaleDateString()}</TableCell>
              <TableCell>{ev.local}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="sm" onClick={() => onViewRegras(ev.id)}>Regras</Button>
                <Button variant="secondary" size="sm" onClick={() => onEdit(ev)}>Editar</Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete(ev.id)}>Excluir</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
