import { Separator } from "~/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar"
import { AppSidebar } from "~/components/app-sidebar"


export default function MenuLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        Pasar Rakyat 2.0
      </header>
      {children}
    </SidebarInset>
  </SidebarProvider>

}
