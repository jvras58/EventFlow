import * as React from "react"
import { RegraCheckinInput } from "../schemas/regra-checkin-schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2 } from "lucide-react"

interface RegraItemProps {
  regra: RegraCheckinInput
  index: number
  onChange: (index: number, regra: RegraCheckinInput) => void
  onRemove: (index: number) => void
}

export function RegraItem({ regra, index, onChange, onRemove }: RegraItemProps) {
  return (
    <Card className={`border ${regra.ativa ? 'border-primary/50' : 'border-muted'} transition-colors`}>
      <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex items-center gap-2">
          <Switch 
            checked={regra.ativa} 
            onCheckedChange={val => onChange(index, { ...regra, ativa: val })}
          />
        </div>
        
        <div className="flex-1 w-full space-y-2 sm:space-y-0 sm:flex gap-4 items-center">
          <div className="flex-1 space-y-1">
            <Label className="text-xs">Nome da Regra</Label>
            <Input 
              value={regra.nome} 
              onChange={e => onChange(index, { ...regra, nome: e.target.value })}
              placeholder="Ex: Check-in Antecipado"
            />
          </div>
          
          <div className="w-full sm:w-48 space-y-1">
            <Label className="text-xs">Tipo</Label>
            <Select 
              value={regra.tipo} 
              onValueChange={val => onChange(index, { ...regra, tipo: val as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HORARIO">Horário</SelectItem>
                <SelectItem value="DOCUMENTO">Documento</SelectItem>
                <SelectItem value="PAGAMENTO">Pagamento</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button variant="ghost" size="icon" onClick={() => onRemove(index)} className="text-muted-foreground hover:text-destructive shrink-0">
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
