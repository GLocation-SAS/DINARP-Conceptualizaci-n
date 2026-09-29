"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User,
  ShieldCheck,
  Building2,
  CheckCircle2,
  ChevronDown,
  Info,
  LogOut,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type MockUser, type UserRole, ROLES_CONFIG } from "../catalogo-interoperabilidad/data/catalogo-data";

interface WireframeUserMenuProps {
  user: MockUser;
  onRoleChange?: (role: UserRole) => void;
}

export function WireframeUserMenu({ user, onRoleChange }: WireframeUserMenuProps) {
  const [open, setOpen] = useState(false);

  const getEmail = (name: string, inst: string) => {
    const slug = name.toLowerCase().replace(/á/g, "a").replace(/é/g, "e").replace(/í/g, "i").replace(/ó/g, "o").replace(/ú/g, "u").replace(/\s+/g, ".");
    const domain = inst.toLowerCase().includes("registro") ? "registrocivil.gob.ec" : "dinarp.gob.ec";
    return `${slug}@${domain}`;
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="group flex items-center gap-2.5 rounded-full outline-none pr-3 pl-1.5 py-1 hover:bg-muted/50 data-[state=open]:bg-muted/50 transition-all cursor-pointer border border-transparent hover:border-border/60"
          aria-label="Perfil de usuario"
        >
          <Avatar className="size-8 cursor-pointer transition-all duration-200 border border-border group-hover:border-primary/30 group-hover:ring-2 group-hover:ring-primary/10">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold font-heading">
              {user.initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:flex items-center gap-1.5 transition-colors">
            <div className="flex flex-col items-start leading-tight">
              <span className="text-[13px] font-bold text-foreground">
                {(user.roleTitle || user.name).split("(")[0].trim()}
              </span>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1 -mt-0.5">
                <span className="size-1.5 rounded-full bg-primary shrink-0" />
              </span>
            </div>
            <ChevronDown
              className={cn(
                "size-3.5 text-muted-foreground transition-transform duration-200 group-hover:text-foreground",
                open && "rotate-180"
              )}
              strokeWidth={2}
            />
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-72 p-2 border-border bg-popover text-popover-foreground shadow-lg rounded-xl"
      >
        {/* Encabezado del Perfil */}
        <div className="p-4 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-xl flex flex-col gap-3 relative overflow-hidden mb-1">
          {/* Decorative blur */}
          <div className="absolute -right-8 -top-8 size-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-3 relative z-10">
            <Avatar className="size-12 border-2 border-background shadow-sm ring-1 ring-primary/20">
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary-600 text-primary-foreground text-base font-bold font-heading">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold font-heading text-foreground truncate">{user.name}</span>
              <span className="text-xs text-foreground/70 truncate">{user.email || getEmail(user.name, user.institution)}</span>
            </div>
          </div>

          <div className="pt-1.5 border-t border-border/60 flex flex-col gap-1 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-foreground/70 font-medium">Rol / Cargo:</span>
              <Badge tone="primary" appearance="soft" size="sm" className="font-bold border-primary/20">
                {ROLES_CONFIG[user.role]?.shortName || user.roleTitle}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground/70 font-medium">Institución:</span>
              <span className="font-bold text-foreground truncate max-w-[150px] text-right">
                {user.institution}
              </span>
            </div>
          </div>
        </div>

        {/* Nota de Demostración Wireframe */}
        <div className="p-2.5 my-1 bg-surface border border-border rounded-md text-[10px] text-muted-foreground leading-relaxed flex items-start gap-2">
          <Info className="size-3.5 text-muted-foreground mt-0.5 shrink-0" />
          <div>
            <strong className="text-foreground font-semibold">Modo prototipo · Vista por rol:</strong> En producción el rol será asignado al usuario autenticado.
          </div>
        </div>

        {/* Conmutador de Roles en Prototipo */}
        <div className="p-2 space-y-1.5 border-t border-border/60">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-1 block">
            Simular Rol en Wireframe:
          </span>
          <div className="flex flex-col gap-0.5">
            {(["DIR_GESTION", "EQ_GESTION", "DIR_NORMATIVA", "EQ_NORMATIVA", "DGR", "COORDINADOR_SINARP", "APROBADOR"] as UserRole[]).map((r) => {
              const isCurrent = user.role === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    try {
                      sessionStorage.setItem("dinarp_simulated_role", r);
                    } catch { }
                    window.dispatchEvent(
                      new CustomEvent("simulatedRoleChanged", { detail: { role: r } })
                    );
                    if (onRoleChange) onRoleChange(r);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left",
                    isCurrent
                      ? "bg-foreground text-background font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  )}
                >
                  <span className="truncate pr-2">{ROLES_CONFIG[r]?.name || r}</span>
                  {isCurrent && <CheckCircle2 className="size-3.5 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        <DropdownMenuSeparator className="bg-border/60" />

        <DropdownMenuItem asChild className="text-xs cursor-pointer">
          <Link href="/wireframes2" className="flex items-center gap-2">
            <Building2 className="size-3.5 text-muted-foreground" />
            <span>Hub Principal de Módulos</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
