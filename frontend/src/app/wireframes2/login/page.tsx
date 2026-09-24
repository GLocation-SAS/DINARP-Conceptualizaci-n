"use client";

import React from "react";
import { getAssetPath } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { WireframeAuthLayout } from "../components/wireframe-auth-layout";
import { DinarpWireframe2LoginFlow } from "../components/dinarp-wireframe2-login-flow";

export default function Wireframe2LoginPage() {
  return (
    <WireframeAuthLayout>
      {/* ── Cabecera Superior del Formulario: Logo DINARP + Modo Claro/Oscuro ── */}
      <div className="flex items-center justify-between pb-5 mb-6 border-b border-border/60">
        <div className="flex items-center gap-3">
          <img
            src={getAssetPath("/logotipo.png")}
            alt="Logo DINARP"
            className="h-8 w-auto max-w-[150px] object-contain dark:brightness-0 dark:invert opacity-90"
          />
          <div className="h-4 w-px bg-border" />
          <span className="text-xs font-semibold text-muted-foreground/80 leading-tight">
            Portal de Interoperabilidad
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
        </div>
      </div>

      {/* ── Flujo Integral de Acceso y Enrolamiento BPM DINARP ── */}
      <DinarpWireframe2LoginFlow dashboardRoute="/wireframes2/catalogo-interoperabilidad" />
    </WireframeAuthLayout>
  );
}
