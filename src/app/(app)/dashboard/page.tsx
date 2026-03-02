import { ContentLayout } from "@/components/content-layout"
import { DashboardCards } from "@/modules/dashboard/components/dashboard-cards"
import { DashboardTables } from "@/modules/dashboard/components/dashboard-tables"

export default function DashboardPage() {
  return (
    <ContentLayout title="Dashboard">
      <DashboardCards />
      <DashboardTables />
    </ContentLayout>
  )
}
