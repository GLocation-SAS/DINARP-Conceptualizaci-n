"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FileText,
  CheckSquare,
  Folder,
  ArrowLeftRight,
  Server,
  Database,
  Network,
  Receipt,
  CreditCard,
  BarChart2,
  Users,
  ShieldCheck,
  Clock,
  Settings,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Layers,
  Search,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { cn, getAssetPath } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { WireframeUserMenu } from "./wireframe-user-menu";
import { NotificationsMenu } from "@/components/shared/notifications-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { applyTheme, getStoredTheme, type Theme } from "@/lib/theme";
import { MOCK_USERS_BY_ROLE, type MockUser, type UserRole } from "../catalogo-interoperabilidad/data/catalogo-data";
import { WireframeBreadcrumbs, type BreadcrumbSegment } from "./wireframe-breadcrumbs";
import { useAuthStore } from "../acceso-seguridad/data/auth-store";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface WireframeDashboardLayoutProps {
  activeMenu?: string;
  currentUser?: MockUser;
  currentRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
  breadcrumbs?: BreadcrumbSegment[];
  headerSlot?: React.ReactNode;
  children: React.ReactNode;
}

interface NavSubItem {
  id: string;
  label: string;
  href: string;
  exact?: boolean;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href?: string;
  children?: NavSubItem[];
  pathPrefix?: string;
  allowedRoles?: UserRole[];
}

import { Bell, FolderCheck, FileSignature } from "lucide-react";

const navItems: NavItem[] = [
  {
    id: "inicio",
    label: "Inicio",
    icon: Home,
    href: "#",
    allowedRoles: ["DIR_GESTION", "EQ_GESTION", "DIR_NORMATIVA", "EQ_NORMATIVA"]
  },
  {
    id: "catalogo-interoperabilidad-group",
    label: "Catálogo de Interoperabilidad",
    icon: Database,
    pathPrefix: "/wireframes2/catalogo-interoperabilidad",
    children: [
      {
        id: "catalogo-interoperabilidad",
        label: "Consulta",
        href: "/wireframes2/catalogo-interoperabilidad",
        exact: true
      }
    ],
    allowedRoles: ["COORDINADOR_SINARP", "APROBADOR"]
  },
  {
    id: "acceso-interoperabilidad-group",
    label: "Acceso a Interoperabilidad",
    icon: Network,
    pathPrefix: "/wireframes2/acceso-interoperabilidad",
    children: [
      {
        id: "acceso-interoperabilidad",
        label: "Gestión de solicitudes",
        href: "/wireframes2/acceso-interoperabilidad/solicitudes",
        exact: false
      }
    ],
    allowedRoles: ["COORDINADOR_SINARP", "APROBADOR"]
  },
  {
    id: "acceso-seguridad-group",
    label: "Acceso y seguridad",
    icon: ShieldCheck,
    pathPrefix: "/wireframes2/acceso-seguridad",
    children: [
      {
        id: "gestion-ingresos",
        label: "Gestión de ingresos",
        href: "/wireframes2/asignacion-solicitudes",
        exact: false
      }
    ],
    allowedRoles: ["COORDINADOR_SINARP", "APROBADOR", "DGR"]
  },
  {
    id: "asignacion-solicitudes",
    label: "Asignación de solicitudes",
    icon: FolderCheck,
    href: "/wireframes2/asignacion-solicitudes",
    allowedRoles: ["DIR_GESTION"]
  },
  {
    id: "solicitudes-asignadas-gestion",
    label: "Solicitudes pendientes",
    icon: FileSignature,
    href: "/wireframes2/solicitudes-pendientes",
    allowedRoles: ["EQ_GESTION"]
  },
  {
    id: "asignacion-normativa",
    label: "Asignación normativa",
    icon: FolderCheck,
    href: "/wireframes2/asignacion-solicitudes",
    allowedRoles: ["DIR_NORMATIVA"]
  },
  {
    id: "solicitudes-asignadas-normativa",
    label: "Solicitudes asignadas",
    icon: FileSignature,
    href: "/wireframes2/asignacion-solicitudes",
    allowedRoles: ["EQ_NORMATIVA"]
  },
  {
    id: "resoluciones",
    label: "Resoluciones",
    icon: FileText,
    href: "#",
    allowedRoles: ["EQ_NORMATIVA"]
  },
  {
    id: "notificaciones",
    label: "Notificaciones",
    icon: Bell,
    href: "#",
    allowedRoles: ["DIR_GESTION", "EQ_GESTION", "DIR_NORMATIVA", "EQ_NORMATIVA"]
  },
];

export function WireframeDashboardLayout({
  activeMenu,
  currentUser,
  currentRole,
  onRoleChange,
  breadcrumbs,
  headerSlot,
  children
}: WireframeDashboardLayoutProps) {
  const pathname = usePathname();
  const [themeMode, setThemeMode] = useState<"claro" | "oscuro">("claro");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "catalogo-interoperabilidad-group": true,
    "acceso-interoperabilidad-group": true,
    "acceso-seguridad-group": true,
  });

  const { activeUser } = useAuthStore();
  const resolvedUser: MockUser = currentUser || activeUser || MOCK_USERS_BY_ROLE.COORDINADOR_SINARP;

  const isAprobador = (currentRole || resolvedUser?.role) === "APROBADOR";

  useEffect(() => {
    const stored = getStoredTheme();
    if (stored) {
      setThemeMode(stored === "dark" ? "oscuro" : "claro");
      applyTheme(stored);
    } else {
      const isDark =
        document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark";
      setThemeMode(isDark ? "oscuro" : "claro");
    }

    const observer = new MutationObserver(() => {
      const isDark =
        document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark";
      setThemeMode(isDark ? "oscuro" : "claro");
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const handleThemeChange = (mode: "claro" | "oscuro") => {
    setThemeMode(mode);
    applyTheme(mode === "oscuro" ? "dark" : "light");
  };

  const isSubItemActive = (subItem: NavSubItem) => {
    if (activeMenu && activeMenu === subItem.id) return true;
    if (pathname) {
      if (subItem.exact) {
        return pathname === subItem.href;
      }
      return pathname.startsWith(subItem.href);
    }
    return false;
  };

  const isGroupActive = (item: NavItem) => {
    if (item.children) {
      return item.children.some(child => isSubItemActive(child));
    }
    if (item.href && pathname) {
      return pathname.startsWith(item.href);
    }
    return false;
  };

  return (
    <TooltipProvider delayDuration={0}>
      <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon" className="border-r border-border bg-surface">
        {/* Brand Header */}
        <SidebarHeader className="h-16 px-4 flex items-center justify-center border-b border-border/40 shrink-0">
          <Link href="/wireframes2" className="flex items-center justify-center min-w-0 w-full">
            {/* Expanded Full Logo */}
            <img
              src={getAssetPath("/logo-horizontal.svg")}
              alt="Logo DINARP - Gobierno del Ecuador"
              className="dark:hidden h-10 w-auto max-w-[180px] object-contain group-data-[collapsible=icon]:hidden"
            />
            <img
              src={getAssetPath("/logo-horizontal-blanco.svg")}
              alt="Logo DINARP - Gobierno del Ecuador"
              className="hidden dark:block h-10 w-auto max-w-[180px] object-contain group-data-[collapsible=icon]:hidden"
            />
            {/* Collapsed Compact Logo */}
            <img
              src={getAssetPath("/logo-horizontal.svg")}
              alt="Logo DINARP"
              className="dark:hidden h-7 w-auto object-contain hidden group-data-[collapsible=icon]:block mx-auto"
            />
            <img
              src={getAssetPath("/logo-horizontal-blanco.svg")}
              alt="Logo DINARP"
              className="hidden dark:block h-7 w-auto object-contain hidden group-data-[collapsible=icon]:block mx-auto"
            />
          </Link>
        </SidebarHeader>

        {/* Sidebar Content */}
        <SidebarContent className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          <SidebarMenu>
            {(() => {
              const activeUserRole = currentRole || resolvedUser?.role;
              const visibleNavItems = navItems.filter((item) => {
                if (!item.allowedRoles) return true;
                return activeUserRole ? item.allowedRoles.includes(activeUserRole) : false;
              });

              return visibleNavItems.map((item) => {
                const Icon = item.icon;
                const hasChildren = item.children && item.children.length > 0;
                const groupActive = isGroupActive(item);

                if (hasChildren) {
                  const isGroupOpen = openGroups[item.id] !== false;
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => setOpenGroups((prev) => ({ ...prev, [item.id]: !isGroupOpen }))}
                        isActive={groupActive}
                        tooltip={item.label}
                      >
                        <Icon className="size-4.5 shrink-0" />
                        <span className="flex-1 text-left font-medium leading-snug">{item.label}</span>
                        {isGroupOpen ? (
                          <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
                        ) : (
                          <ChevronRight className="size-3.5 text-muted-foreground shrink-0" />
                        )}
                      </SidebarMenuButton>

                      {isGroupOpen && (
                        <SidebarMenuSub>
                          {item.children?.map((sub) => {
                            const isSubActive = isSubItemActive(sub);
                            const subLabel = (sub.id === "acceso-interoperabilidad" && isAprobador)
                              ? "Gestión de solicitudes pendientes"
                              : sub.label;

                            return (
                              <SidebarMenuSubItem key={sub.id}>
                                <SidebarMenuSubButton asChild isActive={isSubActive}>
                                  <Link href={sub.href}>
                                    <span className="truncate">{subLabel}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      )}
                    </SidebarMenuItem>
                  );
                }

                const isDirectActive = item.href && pathname ? pathname.startsWith(item.href) : false;

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild isActive={isDirectActive} tooltip={item.label}>
                      <Link href={item.href || "#"}>
                        <Icon className="size-4.5 shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              });
            })()}
          </SidebarMenu>
        </SidebarContent>

        {/* Theme Toggle Footer */}
        <SidebarFooter className="p-3 border-t border-border/40 shrink-0">
          <div className="flex items-center bg-muted/40 p-1 rounded-2xl border border-border/60 group-data-[collapsible=icon]:hidden">
            <Button
              type="button"
              variant={themeMode === "claro" ? "neutral" : "ghost"}
              size="sm"
              onClick={() => handleThemeChange("claro")}
              className={cn(
                "flex-1 h-8 rounded-xl text-xs font-medium gap-1.5",
                themeMode === "claro" && "bg-surface shadow-xs text-foreground font-semibold"
              )}
            >
              <Sun className="size-3.5" />
              <span>Claro</span>
            </Button>
            <div className="h-4 w-px bg-border/60 mx-1" />
            <Button
              type="button"
              variant={themeMode === "oscuro" ? "neutral" : "ghost"}
              size="sm"
              onClick={() => handleThemeChange("oscuro")}
              className={cn(
                "flex-1 h-8 rounded-xl text-xs font-medium gap-1.5",
                themeMode === "oscuro" && "bg-surface shadow-xs text-foreground font-semibold"
              )}
            >
              <Moon className="size-3.5" />
              <span>Oscuro</span>
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-16 px-4 sm:px-8 flex items-center justify-between border-b border-border/40 bg-surface/80 backdrop-blur-md shrink-0 z-10 gap-4">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <SidebarTrigger className="flex shrink-0 text-muted-foreground hover:text-foreground hover:bg-muted" />

            {(breadcrumbs && breadcrumbs.length > 0) || headerSlot ? (
              <div className="flex items-center flex-wrap gap-2 sm:gap-4 min-w-0 flex-1 pl-1">
                {breadcrumbs && breadcrumbs.length > 0 && (
                  <div className="hidden sm:block truncate">
                    <WireframeBreadcrumbs segments={breadcrumbs} className="text-xs" />
                  </div>
                )}
                {headerSlot && (
                  <div className="flex shrink-0">
                    {headerSlot}
                  </div>
                )}
              </div>
            ) : null}

            <Link href="/wireframes2" className="lg:hidden flex items-center shrink-0">
              <img
                src={getAssetPath("/logo-horizontal.svg")}
                alt="Logo DINARP"
                className="dark:hidden h-8 w-auto max-w-[130px] object-contain"
              />
              <img
                src={getAssetPath("/logo-horizontal-blanco.svg")}
                alt="Logo DINARP"
                className="hidden dark:block h-8 w-auto max-w-[130px] object-contain"
              />
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3.5 ml-auto shrink-0">
            <NotificationsMenu />
            <div className="h-4 w-px bg-border/60 mx-0.5 hidden sm:block" />
            <WireframeUserMenu user={resolvedUser} onRoleChange={onRoleChange} />
          </div>
        </header>

        {/* Dynamic Page Content Slot */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
    </TooltipProvider>
  );
}
