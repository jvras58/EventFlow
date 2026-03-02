import * as React from "react"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ValidacaoAlertProps {
  errors: string[]
}

export function ValidacaoAlert({ errors }: ValidacaoAlertProps) {
  if (!errors || errors.length === 0) return null

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Problema nas Regras</AlertTitle>
      <AlertDescription>
        <ul className="list-disc ml-4 mt-2">
          {errors.map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  )
}
