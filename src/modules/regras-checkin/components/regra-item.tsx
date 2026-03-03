import * as React from "react"
import { RegraCheckinInput, TIPOS_DE_REGRA } from "../schemas/regra-checkin-schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RegraItemProps {
  regra: RegraCheckinInput
  index: number
  onChange: (index: number, regra: RegraCheckinInput) => void
  onRemove: (index: number) => void
}

export function RegraItem({ regra, index, onChange, onRemove }: RegraItemProps) {
  return (
    <Card className={`border ${regra.ativo ? 'border-primary/50' : 'border-muted'} transition-colors`}>
      <CardContent className="p-4 flex gap-4 items-start">
        <div className="flex flex-col items-center gap-2">
          <Label className="text-[10px] text-muted-foreground uppercase">Ativa</Label>
          <Switch 
            checked={regra.ativo} 
            onCheckedChange={val => onChange(index, { ...regra, ativo: val })}
          />
        </div>
        
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs">Tipo de Regra</Label>
              <Select
                value={TIPOS_DE_REGRA.includes(regra.nomeRegra as any) ? regra.nomeRegra : ""}
                onValueChange={(val) => onChange(index, { ...regra, nomeRegra: val as any })}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Selecione o tipo..." />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_DE_REGRA.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1 flex flex-col justify-end">
              <div className="flex items-center gap-2 h-10 border rounded-md px-3 bg-secondary/50">
                <Switch 
                  id={`obrig-${index}`}
                  checked={regra.obrigatorio} 
                  onCheckedChange={val => onChange(index, { ...regra, obrigatorio: val })}
                />
                <Label htmlFor={`obrig-${index}`} className="text-xs cursor-pointer">Regra Obrigatória?</Label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs">Liberar (minutos antes)</Label>
              <Input 
                type="number"
                min="0"
                value={regra.liberarMinAntes} 
                onChange={e => onChange(index, { ...regra, liberarMinAntes: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Encerrar (minutos depois)</Label>
              <Input 
                type="number"
                min="0"
                value={regra.encerrarMinDepois} 
                onChange={e => onChange(index, { ...regra, encerrarMinDepois: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
        </div>

        <Button variant="ghost" size="icon" onClick={() => onRemove(index)} className="text-muted-foreground hover:text-destructive shrink-0">
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
