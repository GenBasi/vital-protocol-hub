import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, BookOpen, Plus, FlaskConical, Package, QrCode, ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, end: true },
  { title: "Libreria procedure", url: "/procedures", icon: BookOpen, end: false },
  { title: "Scorte reattivi", url: "/reagents", icon: Package, end: false },
];

const qrSubItems = [
  { title: "Genera QR Code", url: "/qrcode/genera" },
  { title: "Scannerizza QR Code", url: "/qrcode/scannerizza" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const [qrOpen, setQrOpen] = useState(false);

  const isActive = (url: string, end: boolean) =>
    end ? location.pathname === url : location.pathname.startsWith(url);

  const qrIsActive = location.pathname.startsWith("/qrcode");

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="px-4 py-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <FlaskConical className="h-4 w-4" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-sidebar-foreground">LabFlow</span>
              <span className="text-[11px] text-sidebar-foreground/60">Lab procedures</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigazione</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => {
                const active = isActive(item.url, item.end);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <RouterNavLink
                        to={item.url}
                        end={item.end}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-2 py-2 text-sm",
                          active
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                        )}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </RouterNavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Azioni rapide</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Nuova procedura */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Nuova procedura">
                  <RouterNavLink
                    to="/procedures/new"
                    className={cn(
                      "flex items-center gap-2 rounded-md px-2 py-2 text-sm",
                      location.pathname === "/procedures/new"
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <Plus className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>Nuova procedura</span>}
                  </RouterNavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* QR Code con sottomenu */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="QR Code"
                  onClick={() => setQrOpen(!qrOpen)}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-2 text-sm cursor-pointer w-full",
                    qrIsActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                  )}
                >
                  <QrCode className="h-4 w-4 shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1">QR Code</span>
                      <ChevronDown className={cn("h-3 w-3 transition-transform", qrOpen && "rotate-180")} />
                    </>
                  )}
                </SidebarMenuButton>

                {/* Sottovoci */}
                {!collapsed && qrOpen && (
                  <div className="ml-6 mt-1 flex flex-col gap-1">
                    {qrSubItems.map((sub) => (
                      <RouterNavLink
                        key={sub.url}
                        to={sub.url}
                        className={cn(
                          "rounded-md px-2 py-1.5 text-sm",
                          location.pathname === sub.url
                            ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                        )}
                      >
                        {sub.title}
                      </RouterNavLink>
                    ))}
                  </div>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}