"use client"
import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/providers/auth-provider"
import { regrasCheckinApi } from "@/modules/regras-checkin/services/regras-checkin-api"
import { RegraCheckinInput } from "@/modules/regras-checkin/schemas/regra-checkin-schema"
import { RegrasEditor } from "@/modules/regras-checkin/components/regras-editor"
import { ContentLayout } from "@/components/content-layout"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export default function RegrasCheckinPage() {
  const router = useRouter()
  const params = useParams()
  const eventoId = params.id as string
  const { token } = useAuth()
  const queryClient = useQueryClient()
  
  const { data: regras = [], isLoading } = useQuery({
    queryKey: ['regras', eventoId],
    queryFn: () => regrasCheckinApi.getRegras(eventoId, token!),
    enabled: !!token && !!eventoId,
  })

  const saveMutation = useMutation({
    mutationFn: (novasRegras: RegraCheckinInput[]) => regrasCheckinApi.updateRegras(eventoId, novasRegras, token!),
    onSuccess: () => {
      toast.success("Regras salvas com sucesso!")
      queryClient.invalidateQueries({ queryKey: ['regras', eventoId] })
    },
    onError: (error: Error) => toast.error(error.message)
  })

  const handleSave = async (novasRegras: RegraCheckinInput[]) => {
    saveMutation.mutate(novasRegras)
  }

  return (
    <ContentLayout 
      title="Regras de Check-in"
      actions={
        <Button variant="outline" onClick={() => router.push("/eventos")}>
          Voltar para Eventos
        </Button>
      }
    >
      <div className="max-w-3xl">
        {isLoading ? (
          <div>Carregando regras...</div>
        ) : (
          <RegrasEditor 
            initialRegras={regras} 
            onSave={handleSave} 
            isSaving={saveMutation.isPending} 
          />
        )}
      </div>
    </ContentLayout>
  )
}
