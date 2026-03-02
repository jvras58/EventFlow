"use client"
import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { dashboardApi, DashboardSummary } from "../services/dashboard-api"
import { useAuth } from "@/providers/auth-provider"
import { CalendarIcon, UsersIcon } from "lucide-react"

export function DashboardCards() {
  const { token } = useAuth()
  const [summary, setSummary] = React.useState<DashboardSummary | null>(null)
  const [error, setError] = React.useState("")

  React.useEffect(() => {
    if (!token) return

    dashboardApi.getSummary(token)
      .then(setSummary)
      .catch(err => setError(err.message))
  }, [token])

  if (error) {
    return <div className="text-destructive">{error}</div>
  }

  if (!summary) {
    return <div>Carregando dashboard...</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalEventos}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Participantes</CardTitle>
          <UsersIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalParticipantes}</div>
        </CardContent>
      </Card>
    </div>
  )
}
