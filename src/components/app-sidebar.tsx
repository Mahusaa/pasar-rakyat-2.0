"use client"
import * as React from "react"
import { Utensils, FileClock, ShoppingBag } from "lucide-react"
import { Suspense } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar"
import { NavUser } from "./nav-user"
import { useUser } from "~/server/auth"


// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Utensils,
  },
  {
    title: "Riwayat",
    url: "/logs",
    icon: FileClock,
  },

]

export function AppSidebar() {
  const { userPromise } = useUser()
  const user = React.use(userPromise)
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" >
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-3 rounded-xl shadow-lg shadow-orange-200/80  border border-orange-300/20">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="text-xl font-bold text-orange-950 tracking-tight">Pasar Rakyat</span>
                <span className="">v2.0.0</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {user && (
          <Suspense fallback={<div>Loading user...</div>}>
            <NavUser user={user} />
          </Suspense>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}

