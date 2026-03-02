import * as React from "react"
import { RegraCheckinInput, validateRegras } from "../schemas/regra-checkin-schema"
import { RegraItem } from "./regra-item"
import { ValidacaoAlert } from "./validacao-alert"
import { Button } from "@/components/ui/button"

interface RegrasEditorProps {
  initialRegras: RegraCheckinInput[]
  onSave: (regras: RegraCheckinInput[]) => Promise<void>
  isSaving: boolean
}

export function RegrasEditor({ initialRegras, onSave, isSaving }: RegrasEditorProps) {
  const [regras, setRegras] = React.useState<RegraCheckinInput[]>([])

  React.useEffect(() => {
    setRegras(initialRegras)
  }, [initialRegras])

  const validation = React.useMemo(() => validateRegras(regras), [regras])

  const handleAdd = () => {
    setRegras([...regras, { nome: "Nova Regra", tipo: "HORARIO", ativa: true }])
  }

  const handleRemove = (index: number) => {
    setRegras(regras.filter((_, i) => i !== index))
  }

  const handleChange = (index: number, novaRegra: RegraCheckinInput) => {
    const novas = [...regras]
    novas[index] = novaRegra
    setRegras(novas)
  }

  return (
    <div className="space-y-6">
      <ValidacaoAlert errors={validation.errors} />

      <div className="space-y-4">
        {regras.map((regra, index) => (
          <RegraItem 
            key={index}
            index={index}
            regra={regra}
            onChange={handleChange}
            onRemove={handleRemove}
          />
        ))}

        {regras.length === 0 && (
          <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
            O evento não possui nenhuma regra configurada.
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handleAdd}>+ Adicionar Regra</Button>
        <Button 
          onClick={() => onSave(regras)} 
          disabled={!validation.valid || isSaving || regras.length === 0}
        >
          {isSaving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </div>
  )
}
