import type { Metadata } from "next";
import { ContentLayout } from "@/components/content-layout"
import { DashboardCards } from "@/modules/dashboard/components/dashboard-cards"
import { DashboardTables } from "@/modules/dashboard/components/dashboard-tables"

export const metadata: Metadata = {
  title: "Dashboard - EventFlow",
  description: "Dashboard de eventos",
};

export default function DashboardPage() {
  return (
    <ContentLayout title="Dashboard">
      <DashboardCards />
      <DashboardTables />
    </ContentLayout>
  )
}
