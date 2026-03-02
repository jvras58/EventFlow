import { ContentLayout } from "@/components/content-layout"
import { DashboardCards } from "@/modules/dashboard/components/dashboard-cards"

export default function DashboardPage() {
  return (
    <ContentLayout title="Dashboard">
      <DashboardCards />
    </ContentLayout>
  )
}
