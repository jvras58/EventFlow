"use client"
import * as React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { RegraCheckinInput, validateRegras } from "../schemas/regra-checkin-schema"
import { regrasCheckinApi } from "../services/regras-checkin-api"
import { useAuth } from "@/providers/auth-provider"
import { RegraItem } from "./regra-item"
import { ValidacaoAlert } from "./validacao-alert"
import { Button } from "@/components/ui/button"

interface RegrasEditorProps {
  eventoId: string
}

export function RegrasEditor({ eventoId }: RegrasEditorProps) {
  const { token } = useAuth()

  const { data: regras, isLoading } = useQuery({
    queryKey: ['regras', eventoId],
    queryFn: () => regrasCheckinApi.getRegras(eventoId, token!),
    enabled: !!token && !!eventoId,
  })

  if (isLoading || !regras) {
    return <div>Carregando regras...</div>
  }

  return <RegrasForm eventoId={eventoId} initialRegras={regras} />
}

function RegrasForm({ eventoId, initialRegras }: { eventoId: string, initialRegras: RegraCheckinInput[] }) {
  const { token } = useAuth()
  const queryClient = useQueryClient()
  const [regrasLocais, setRegrasLocais] = React.useState<RegraCheckinInput[]>(initialRegras)

  const saveMutation = useMutation({
    mutationFn: (novasRegras: RegraCheckinInput[]) => regrasCheckinApi.updateRegras(eventoId, novasRegras, token!),
    onSuccess: () => {
      toast.success("Regras salvas com sucesso!")
      queryClient.invalidateQueries({ queryKey: ['regras', eventoId] })
    },
    onError: (error: Error) => toast.error(error.message)
  })

  const validation = React.useMemo(() => validateRegras(regrasLocais), [regrasLocais])

  const handleAdd = () => {
    setRegrasLocais([...regrasLocais, { 
      nomeRegra: "Nova Regra", 
      ativo: true, 
      obrigatorio: true,
      liberarMinAntes: 60,
      encerrarMinDepois: 0
    }])
  }

  const handleRemove = (index: number) => {
    setRegrasLocais(regrasLocais.filter((_, i) => i !== index))
  }

  const handleChange = (index: number, novaRegra: RegraCheckinInput) => {
    const novas = [...regrasLocais]
    novas[index] = novaRegra
    setRegrasLocais(novas)
  }

  return (
    <div className="space-y-6">
      <ValidacaoAlert errors={validation.errors} />

      <div className="space-y-4">
        {regrasLocais.map((regra, index) => (
          <RegraItem 
            key={index}
            index={index}
            regra={regra}
            onChange={handleChange}
            onRemove={handleRemove}
          />
        ))}

        {regrasLocais.length === 0 && (
          <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
            O evento não possui nenhuma regra configurada.
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handleAdd}>+ Adicionar Regra</Button>
        <Button 
          onClick={() => saveMutation.mutate(regrasLocais)} 
          disabled={!validation.valid || saveMutation.isPending || regrasLocais.length === 0}
        >
          {saveMutation.isPending ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </div>
  )
}
