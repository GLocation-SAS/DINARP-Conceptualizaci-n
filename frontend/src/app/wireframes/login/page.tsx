"use client";

import React from "react";
import { getAssetPath } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { WireframeAuthLayout } from "../components/wireframe-auth-layout";
import { DinarpAccessFlow } from "../components/dinarp-access-flow";

export default function WireframeLoginPage() {
  return (
    <WireframeAuthLayout>
      {/* ── Cabecera Superior del Formulario: Logo DINARP + Modo Claro/Oscuro ── */}
      <div className="flex items-center justify-between pb-5 mb-6 border-b border-border/60">
        <div className="flex items-center gap-3">
          <>
<img
            src={getAssetPath("/logo-horizontal.svg")}
            alt="Logo DINARP"
            className="dark:hidden h-8 w-auto max-w-[150px] object-contain dark:brightness-0 dark:invert"
          />
<img
            src={getAssetPath("/logo-horizontal-blanco.svg")}
            alt="Logo DINARP"
            className="hidden dark:block h-8 w-auto max-w-[150px] object-contain dark:brightness-0 dark:invert"
          />
</>
          <div className="h-4 w-px bg-border" />
          <span className="text-xs font-semibold text-muted-foreground/90 leading-tight">
            Portal de Interoperabilidad
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
        </div>
      </div>

      {/* ── Flujo Integral de Acceso y Seguridad DINARP ── */}
      <DinarpAccessFlow dashboardRoute="/wireframes/dashboard" />
    </WireframeAuthLayout>
  );
}
