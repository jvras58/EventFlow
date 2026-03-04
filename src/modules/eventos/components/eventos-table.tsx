"use client"

import { Evento } from "@/modules/eventos/types/evento"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { EventoFormDialog } from "@/modules/eventos/components/evento-form-dialog"

interface EventosTableProps {
  eventos: Evento[]
  onDelete: (id: string) => void
  onViewRegras: (id: string) => void
}

export function EventosTable({ eventos, onDelete, onViewRegras }: EventosTableProps) {
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
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {eventos.map((ev) => (
            <TableRow key={ev.id}>
              <TableCell className="font-medium">{ev.nome}</TableCell>
              <TableCell>{new Date(ev.data).toLocaleDateString()}</TableCell>
              <TableCell>{ev.local}</TableCell>
              <TableCell>
                <Badge variant={ev.status === "ATIVO" ? "default" : "secondary"}>
                  {ev.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="sm" onClick={() => onViewRegras(ev.id)}>Regras</Button>
                <EventoFormDialog initialData={ev}>
                  <Button variant="secondary" size="sm">Editar</Button>
                </EventoFormDialog>
                <Button variant="destructive" size="sm" onClick={() => onDelete(ev.id)}>Excluir</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
