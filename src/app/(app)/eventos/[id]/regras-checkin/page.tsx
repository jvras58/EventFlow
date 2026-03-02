"use client"
import * as React from "react"
import { useParams, useRouter } from "next/navigation"
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
  
  const [regras, setRegras] = React.useState<RegraCheckinInput[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSaving, setIsSaving] = React.useState(false)

  React.useEffect(() => {
    if (!token || !eventoId) return
    
    regrasCheckinApi.getRegras(eventoId, token)
      .then(setRegras)
      .catch(err => toast.error(err.message))
      .finally(() => setIsLoading(false))
  }, [token, eventoId])

  const handleSave = async (novasRegras: RegraCheckinInput[]) => {
    if (!token) return
    setIsSaving(true)
    try {
      const data = await regrasCheckinApi.updateRegras(eventoId, novasRegras, token)
      setRegras(data)
      toast.success("Regras salvas com sucesso!")
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setIsSaving(false)
    }
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
            isSaving={isSaving} 
          />
        )}
      </div>
    </ContentLayout>
  )
}
