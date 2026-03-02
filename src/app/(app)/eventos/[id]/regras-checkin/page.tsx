import { ContentLayout } from "@/components/content-layout"
import { RegrasEditor } from "@/modules/regras-checkin/components/regras-editor"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function RegrasCheckinPage({ params }: { params: { id: string } }) {
  const { id } = await params
  
  return (
    <ContentLayout 
      title="Regras de Check-in"
      actions={
        <Button variant="outline" asChild>
          <Link href="/eventos">Voltar para Eventos</Link>
        </Button>
      }
    >
      <div className="max-w-3xl">
        <RegrasEditor eventoId={id} />
      </div>
    </ContentLayout>
  )
}
