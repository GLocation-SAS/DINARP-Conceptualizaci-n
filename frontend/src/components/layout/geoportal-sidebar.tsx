"use client";

/**
 * @component GeoportalSidebar
 * @description Menú de navegación lateral (Sidebar) del Design System DINARP.
 * 
 * Variantes y Comportamiento:
 * - **Desktop Expanded**: Muestra íconos y textos. Las subsecciones (ej. Trámites, Recursos) mantienen jerarquía y se separan con un Divider al finalizar el grupo.
 * - **Desktop Collapsed**: Muestra únicamente íconos. Se apoya en el componente Tooltip oficial del UI Kit para mostrar el nombre de la opción (incluyendo menú flotante para subsecciones).
 * - **Mobile (Drawer)**: Se transforma en un panel lateral (Sheet) superpuesto (overlay). Su cabecera replica la barra institucional (azul) y la barra blanca del Header, con botón de cierre (X).
 */

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { applyTheme, getStoredTheme, type Theme } from "@/lib/theme";
import { getAssetPath } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  Sun,
  Moon,
  Globe2,
  Home,
  FileText,
  Building2,
  FolderOpen,
  LogIn,
  Shield,
  BarChart3,
  Layers,
  Users,
  ChevronRight,
  X,
  Bell
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, Link } from "@/routing";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

// ── Nav item definition ────────────────────────────────────────────────────
interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    label: "Inicio",
    href: "/",
    icon: Home,
  },
  {
    label: "Trámites",
    href: "/tramites",
    icon: FileText,
    children: [
      {
        label: "Concesiones Mineras",
        href: "/tramites/concesiones",
        icon: Shield,
      },
      {
        label: "Permisos Ambientales",
        href: "/tramites/permisos",
        icon: FileText,
      },
      {
        label: "Consulta de Estado",
        href: "/tramites/consulta",
        icon: BarChart3,
      },
    ],
  },
  {
    label: "Instituciones",
    href: "/instituciones",
    icon: Building2,
  },
  {
    label: "Geoportal",
    href: "/geoportal",
    icon: Globe2,
  },
  {
    label: "Recursos",
    href: "/recursos",
    icon: FolderOpen,
    children: [
      {
        label: "Capas Geográficas",
        href: "/recursos/capas",
        icon: Layers,
      },
      {
        label: "Datos Abiertos",
        href: "/recursos/datos",
        icon: BarChart3,
      },
      {
        label: "Directorio",
        href: "/recursos/directorio",
        icon: Users,
      },
    ],
  },
  {
    label: "Notificaciones",
    href: "/notificaciones",
    icon: Bell,
  },
  {
    label: "Acceso",
    href: "/acceso",
    icon: LogIn,
  },
];


// ── Component ──────────────────────────────────────────────────────────────
export function GeoportalSidebar({
  variant = "full",
}: {
  variant?: "full" | "navigation";
}) {
  const { setOpenMobile, isMobile } = useSidebar();
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const showNav = true; // Always true for both full and navigation
  const showUser = variant === "full";
  const showBranding = variant === "full";

  // Derived user display values
  const displayName = user?.displayName || user?.email?.split("@")[0] || "Usuario";
  const displayEmail = user?.email || "";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    await logout();
    const isWireframe = typeof window !== "undefined" && window.location.pathname.startsWith("/wireframes");
    router.push(isWireframe ? "/wireframes/login" : "/login");
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // Local theme state (same pattern as intranet-sidebar)
  const [theme, setTheme] = React.useState<Theme>("light");
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
    const stored = getStoredTheme();
    const isDark =
      document.documentElement.classList.contains("dark") ||
      document.documentElement.getAttribute("data-theme") === "dark";
    const initialTheme: Theme = stored ?? (isDark ? "dark" : "light");
    setTheme(initialTheme);

    const observer = new MutationObserver(() => {
      const isNowDark =
        document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark";
      setTheme(isNowDark ? "dark" : "light");
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const handleTheme = (next: Theme) => {
    setTheme(next);
    applyTheme(next);
  };

  const handleClick = () => {
    setOpenMobile(false);
  };

  return (
    <Sidebar variant="floating" collapsible="icon">
      {/* ── Header: Branding ── */}
      <SidebarHeader className="p-0">
        {showBranding ? (
          <>
            {/* Top bar azul (institucional) */}
            <div className="bg-primary w-full px-3 py-2 flex items-center justify-end min-h-10 lg:min-h-12 overflow-hidden">
              <SidebarTrigger className="hidden lg:flex text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" />
            </div>

            {/* Logo del GEOportal */}
            <div className="flex items-center justify-between px-4 py-3 lg:px-4 lg:py-4 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-4 border-b-2 border-primary-300 lg:border-b-0 lg:border-none">
              <Link href="/" className="flex items-center gap-3 shrink-0 group focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none rounded-md overflow-hidden w-full justify-start">
                {/* Expanded logo */}
                <>
<img
                  src={getAssetPath("/logo-horizontal.svg")}
                  alt="Logo DINARP GEOportal"
                  className="dark:hidden h-9 lg:h-10 w-auto object-contain transition-transform group-hover:scale-105 group-data-[collapsible=icon]:hidden"
                />
<img
                  src={getAssetPath("/logo-horizontal-blanco.svg")}
                  alt="Logo DINARP GEOportal"
                  className="hidden dark:block h-9 lg:h-10 w-auto object-contain transition-transform group-hover:scale-105 group-data-[collapsible=icon]:hidden"
                />
</>
                {/* Collapsed logo */}
                <>
<img
                  src={getAssetPath("/logo-horizontal.svg")}
                  alt="Logo DINARP Símbolo"
                  className="dark:hidden h-8 w-auto object-contain transition-transform group-hover:scale-105 hidden group-data-[collapsible=icon]:block mx-auto"
                />
<img
                  src={getAssetPath("/logo-horizontal-blanco.svg")}
                  alt="Logo DINARP Símbolo"
                  className="hidden dark:block h-8 w-auto object-contain transition-transform group-hover:scale-105 hidden group-data-[collapsible=icon]:block mx-auto"
                />
</>
              </Link>
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpenMobile(false)}
                  aria-label="Cerrar menú"
                >
                  <X className="size-6" strokeWidth={1.75} />
                </Button>
              )}
            </div>
            <SidebarSeparator className="hidden lg:block" />
          </>
        ) : (
          <div className="flex items-center justify-between p-3 border-b border-border min-h-12">
            <span className="text-body-sm font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden ml-1">
              Menú de navegación
            </span>
            <SidebarTrigger className="hidden lg:flex shrink-0" />
          </div>
        )}
      </SidebarHeader>

      {/* ── Navigation ── */}
      <SidebarContent className="px-2">
        {showNav && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-caption uppercase tracking-widest font-bold text-sidebar-foreground/90">
              Navegación
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  if (item.children) {
                    return (
                      <React.Fragment key={item.label}>
                        <NavCollapsible item={item} isActive={active} onClick={handleClick} />
                        {index < navItems.length - 1 && (
                          <SidebarSeparator className="my-1 border-border/50 w-auto mx-2" />
                        )}
                      </React.Fragment>
                    );
                  }

                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton asChild isActive={active} tooltip={item.label} onClick={handleClick}>
                        <Link href={item.href} className="flex items-center gap-2.5 w-full">
                          <Icon className="shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* ── Footer: Theme toggle + User info ── */}
      <SidebarFooter className="px-3 py-3">
        <SidebarSeparator className="mb-3" />

        {/* Theme toggle */}
        <div className="flex flex-col gap-1 px-1 mb-3">
          {mounted && (
            <>
              {/* Expanded */}
              <div className="group-data-[collapsible=icon]:hidden px-3 py-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => handleTheme(theme === "dark" ? "light" : "dark")}
                  className={cn(
                    "relative flex w-full h-auto items-center p-1 rounded-full border border-sidebar-border/50",
                    "bg-sidebar-accent/50 hover:bg-sidebar-accent transition-colors duration-300"
                  )}
                  aria-label="Alternar tema"
                >
                  <div
                    className={cn(
                      "absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                      theme === "dark" ? "bg-sidebar translate-x-full" : "bg-sidebar translate-x-0"
                    )}
                  />
                  <div
                    className={cn(
                      "relative z-10 flex flex-1 items-center justify-center gap-2 py-1.5 text-xs font-bold transition-colors duration-300",
                      theme !== "dark" ? "text-sidebar-foreground" : "text-sidebar-foreground/50 hover:text-sidebar-foreground/80"
                    )}
                  >
                    <Sun className="size-4" />
                    Claro
                  </div>
                  <div
                    className={cn(
                      "relative z-10 flex flex-1 items-center justify-center gap-2 py-1.5 text-xs font-bold transition-colors duration-300",
                      theme === "dark" ? "text-sidebar-foreground" : "text-sidebar-foreground/50 hover:text-sidebar-foreground/80"
                    )}
                  >
                    <Moon className="size-4" />
                    Oscuro
                  </div>
                </Button>
              </div>

              {/* Collapsed */}
              <div className="hidden group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center">
                <ThemeToggle />
              </div>
            </>
          )}
        </div>

        {/* User section */}
        {showUser && (
          user ? (
            <div className="flex items-center gap-3 px-1 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
              {/* Avatar */}
              <div className="relative shrink-0 group-data-[collapsible=icon]:mx-auto">
                <div className="size-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-heading font-bold text-caption group-data-[collapsible=icon]:size-8 transition-all duration-200">
                  {initials}
                </div>
                <div className="absolute bottom-0 right-0 size-2.5 rounded-full bg-success border-2 border-background group-data-[collapsible=icon]:size-2" />
              </div>

              <div className="flex flex-1 items-center justify-between gap-2 min-w-0 group-data-[collapsible=icon]:hidden animate-in fade-in slide-in-from-bottom-1 duration-300">
                <div className="flex flex-col min-w-0">
                  <span className="text-body-sm font-heading font-semibold text-sidebar-foreground truncate">
                    {displayName}
                  </span>
                  <span className="text-caption text-sidebar-foreground/60 truncate">
                    {displayEmail}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Cerrar sesión"
                  onClick={handleLogout}
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:text-danger hover:bg-danger/10 transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 px-1 group-data-[collapsible=icon]:hidden">
              <Button asChild className="w-full text-caption h-8">
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
            </div>
          )
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

function NavCollapsible({ item, isActive, onClick }: { item: NavItem, isActive: boolean, onClick: () => void }) {
  const [open, setOpen] = React.useState(isActive);
  const { state } = useSidebar();
  const Icon = item.icon;
  const pathname = usePathname();

  const isChildActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  if (state === "collapsed") {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={isActive}
          onClick={() => setOpen(!open)}
          tooltip={{
            children: (
              <div className="flex flex-col gap-0.5 max-w-[200px]">
                <span className="font-semibold">{item.label}</span>
                {item.children && (
                  <span className="text-[10px] text-muted-foreground leading-tight">
                    {item.children.map(sub => sub.label).join(" - ")}
                  </span>
                )}
              </div>
            )
          }}
        >
          <Icon className="shrink-0" />
          <span className="flex-1 truncate">{item.label}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton tooltip={item.label} isActive={isActive && !open} onClick={() => setOpen(!open)}>
        <Icon className="shrink-0" />
        <span className="flex-1 truncate">{item.label}</span>
        <ChevronRight className={cn("ml-auto transition-transform duration-200 size-4 shrink-0", open && "rotate-90")} />
      </SidebarMenuButton>
      {open && (
        <div className="overflow-hidden">
          <SidebarMenuSub>
            {item.children?.map((child) => {
              const childActive = isChildActive(child.href);
              const ChildIcon = child.icon;
              return (
                <SidebarMenuSubItem key={child.label}>
                  <SidebarMenuSubButton asChild isActive={childActive} onClick={onClick}>
                    <Link href={child.href} className="flex items-center gap-2">
                      <ChildIcon className="size-3.5 shrink-0" />
                      <span className="truncate">{child.label}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </div>
      )}
    </SidebarMenuItem>
  );
}
