"use client"
import * as React from "react"
import { Participante } from "../types/participante"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ParticipantesTableProps {
  participantes: Participante[]
  onEdit: (part: Participante) => void
  onDelete: (id: string) => void
  onTransfer: (part: Participante) => void
}

export function ParticipantesTable({ participantes, onEdit, onDelete, onTransfer }: ParticipantesTableProps) {
  if (participantes.length === 0) {
    return <div className="p-4 text-center text-muted-foreground">Nenhum participante encontrado.</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Evento</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participantes.map((part) => (
            <TableRow key={part.id}>
              <TableCell className="font-medium">{part.nome}</TableCell>
              <TableCell>{part.email}</TableCell>
              <TableCell>{part.evento?.nome || "-"}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="sm" onClick={() => onTransfer(part)}>Transferir</Button>
                <Button variant="secondary" size="sm" onClick={() => onEdit(part)}>Editar</Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete(part.id)}>Excluir</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
