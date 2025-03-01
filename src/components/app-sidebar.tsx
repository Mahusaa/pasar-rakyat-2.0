"use client"
import * as React from "react"
import { Calendar, Home, Inbox, Search, Settings, Utensils } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar"
import { NavUser } from "./nav-user"
import { useUser } from "~/server/auth"


const data = {
  user:
  {
    name: "kevin diks",
    email: "kevin@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  }
}


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
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },

]

export function AppSidebar() {
  const { userPromise } = useUser()
  const user = React.use(userPromise)
  return (
    <Sidebar className="bg-background">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
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
        <NavUser user={user!} />
      </SidebarFooter>
    </Sidebar>
  )
}

