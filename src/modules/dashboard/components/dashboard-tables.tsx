"use client"
import * as React from "react"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/providers/auth-provider"
import { dashboardApi } from "../services/dashboard-api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"

export function DashboardTables() {
    const { token } = useAuth()

    const { data: summary, isLoading, error } = useQuery({
        queryKey: ['dashboardSummary'],
        queryFn: () => dashboardApi.getSummary(token!),
        enabled: !!token,
    })

    if (error) {
        return <div className="text-destructive">{(error as Error).message}</div>
    }

    if (isLoading || !summary) {
        return null
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 mt-4">
            <Card>
                <CardHeader>
                    <CardTitle>Próximos Eventos</CardTitle>
                    <CardDescription>Eventos programados para os próximos dias.</CardDescription>
                </CardHeader>
                <CardContent>
                    {summary.proximosEventos.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">Nenhum evento próximo.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Data</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {summary.proximosEventos.map((evento) => (
                                    <TableRow key={evento.id}>
                                        <TableCell className="font-medium">{evento.nome}</TableCell>
                                        <TableCell>{format(new Date(evento.data), "dd/MM/yyyy HH:mm", { locale: ptBR })}</TableCell>
                                        <TableCell>
                                            <Badge variant={evento.status === "ATIVO" ? "default" : "secondary"}>
                                                {evento.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Check-ins Recentes</CardTitle>
                    <CardDescription>Últimos check-ins realizados nos eventos.</CardDescription>
                </CardHeader>
                <CardContent>
                    {summary.checkinsRecentes.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">Nenhum check-in recente.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Participante</TableHead>
                                    <TableHead>Evento</TableHead>
                                    <TableHead className="text-right">Horário</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {summary.checkinsRecentes.map((checkin) => (
                                    <TableRow key={checkin.id}>
                                        <TableCell>
                                            <div className="font-medium">{checkin.nome}</div>
                                            <div className="text-xs text-muted-foreground">{checkin.email}</div>
                                        </TableCell>
                                        <TableCell>{checkin.evento.nome}</TableCell>
                                        <TableCell className="text-right">
                                            {format(new Date(checkin.createdAt), "dd/MM HH:mm", { locale: ptBR })}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
