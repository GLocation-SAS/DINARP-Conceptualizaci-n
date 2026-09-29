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
} from "lucide-react";

import { cn, getAssetPath } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/shared/user-menu";
import { NotificationsMenu } from "@/components/shared/notifications-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { applyTheme, getStoredTheme, type Theme } from "@/lib/theme";

interface WireframeDashboardLayoutProps {
  activeMenu?: string;
  children: React.ReactNode;
}

const navItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    href: "/wireframes/dashboard",
    aliases: ["inicio", "dashboard"],
    pathPrefix: "/wireframes/dashboard",
  },
  {
    id: "solicitudes",
    label: "Proyectos",
    icon: FileText,
    href: "/wireframes/solicitudes",
    aliases: ["solicitudes", "proyectos"],
    pathPrefix: "/wireframes/solicitudes",
  },
  {
    id: "aprobaciones",
    label: "Aprobaciones y permisos",
    icon: CheckSquare,
    href: "/wireframes/aprobaciones",
    aliases: ["aprobaciones"],
    pathPrefix: "/wireframes/aprobaciones",
  },
  {
    id: "catalogo-fuentes",
    label: "Catálogo de Fuentes",
    icon: Database,
    href: "/wireframes/catalogo-fuentes",
    aliases: ["catalogo-fuentes", "catalogo", "fuentes"],
    pathPrefix: "/wireframes/catalogo-fuentes",
  },
  {
    id: "interoperabilidad",
    label: "Interoperabilidad / Servicios",
    icon: ArrowLeftRight,
    href: "/wireframes/interoperabilidad/servicios",
    aliases: ["interoperabilidad", "servicios"],
    pathPrefix: "/wireframes/interoperabilidad",
  },
  {
    id: "intercambios-masivos",
    label: "Intercambios Masivos / Batch",
    icon: Server,
    href: "/wireframes/intercambios-masivos",
    aliases: ["intercambios-masivos", "batch"],
    pathPrefix: "/wireframes/intercambios-masivos",
  },
  {
    id: "seguimiento",
    label: "Seguimiento y Trazabilidad",
    icon: Clock,
    href: "/wireframes/seguimiento",
    aliases: ["seguimiento"],
    pathPrefix: "/wireframes/seguimiento",
  },
  {
    id: "tarifario",
    label: "Tarifario y Cotización",
    icon: Receipt,
    href: "/wireframes/tarifario",
    aliases: ["tarifario", "cotizacion"],
    pathPrefix: "/wireframes/tarifario",
  },
  {
    id: "facturacion",
    label: "Facturación",
    icon: CreditCard,
    href: "/wireframes/facturacion",
    aliases: ["facturacion"],
    pathPrefix: "/wireframes/facturacion",
  },
  {
    id: "usuarios",
    label: "Usuarios",
    icon: Users,
    href: "/wireframes/usuarios",
    aliases: ["usuarios"],
    pathPrefix: "/wireframes/usuarios",
  },
  {
    id: "roles",
    label: "Roles y Permisos",
    icon: ShieldCheck,
    href: "/wireframes/roles",
    aliases: ["roles"],
    pathPrefix: "/wireframes/roles",
  },
  {
    id: "reportes",
    label: "Reportes",
    icon: BarChart2,
    href: "/wireframes/reportes",
    aliases: ["reportes"],
    pathPrefix: "/wireframes/reportes",
  },
];

export function WireframeDashboardLayout({
  activeMenu = "inicio",
  children,
}: WireframeDashboardLayoutProps) {
  const pathname = usePathname();
  const [themeMode, setThemeMode] = useState<"claro" | "oscuro">("claro");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const isItemActive = (item: (typeof navItems)[number]) => {
    if (activeMenu) {
      if (activeMenu === item.id) return true;
      if (item.aliases?.includes(activeMenu)) return true;
    }
    if (pathname) {
      if (item.href === "/wireframes/dashboard") {
        return pathname === "/wireframes/dashboard" || pathname === "/wireframes";
      }
      if (item.pathPrefix && pathname.startsWith(item.pathPrefix)) {
        return true;
      }
      if (pathname.startsWith(item.href)) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-background text-foreground font-sans antialiased">
      {/* ══════════════════════════════════════════════════
          SIDEBAR IZQUIERDO (Desktop & Mobile Drawer)
         ══════════════════════════════════════════════════ */}
      {/* Overlay Mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col w-64 h-full bg-surface border-r border-border transition-transform duration-300 lg:static lg:translate-x-0 shrink-0",
          mobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-border/40 shrink-0">
          <Link href="/wireframes/dashboard" className="flex items-center">
            <>
<img
              src={getAssetPath("/logo-horizontal.svg")}
              alt="Logo DINARP - Gobierno del Ecuador"
              className="dark:hidden h-9 w-auto max-w-[170px] object-contain"
            />
<img
              src={getAssetPath("/logo-horizontal-blanco.svg")}
              alt="Logo DINARP - Gobierno del Ecuador"
              className="hidden dark:block h-9 w-auto max-w-[170px] object-contain"
            />
</>
          </Link>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="lg:hidden text-muted-foreground hover:bg-muted/50"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Cerrar menú"
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* Sidebar Navigation (Scrollable list if long) */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(item);
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left",
                  isActive
                    ? "bg-muted/80 text-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                )}
              >
                <Icon className={cn("size-4 shrink-0", isActive ? "text-foreground" : "text-muted-foreground")} />
                <span className="leading-snug break-words">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Theme Toggle Footer */}
        <div className="p-4 border-t border-border/40 shrink-0">
          <div className="flex items-center bg-muted/40 p-1 rounded-2xl border border-border/60">
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
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════
          CONTENIDO PRINCIPAL & HEADER SUPERIOR
         ══════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-16 px-4 sm:px-8 flex items-center justify-between border-b border-border/40 bg-surface/80 backdrop-blur-md shrink-0 z-10">
          {/* Mobile Burger & Mobile Logo */}
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="lg:hidden text-muted-foreground hover:bg-muted/50"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu className="size-5" />
            </Button>
            <Link href="/wireframes/dashboard" className="lg:hidden flex items-center">
              <>
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
</>
            </Link>
          </div>

          <div className="hidden lg:block" />

          {/* User Profile, Notifications & Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            <ThemeToggle />
            <NotificationsMenu />
            <UserMenu />
          </div>
        </header>

        {/* Dynamic Page Content Slot (Independent scroll) */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
