import * as React from "react"
import Link from "next/link"
import { Calendar, Home, Users } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavUser } from "@/components/nav-user"

const navigationData = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Eventos",
    url: "/eventos",
    icon: Calendar,
  },
  {
    title: "Participantes",
    url: "/participantes",
    icon: Users,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationData.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
