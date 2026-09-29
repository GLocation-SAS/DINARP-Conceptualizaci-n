"use client";

import React from "react";
import { getAssetPath } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { WireframeAuthLayout } from "../components/wireframe-auth-layout";
import { DinarpWireframe2LoginFlow } from "../components/dinarp-wireframe2-login-flow";

export default function Wireframe2LoginPage() {
  return (
    <WireframeAuthLayout imageSrc={getAssetPath("/fondo.png")} imageFit="contain">
      {/* ── Cabecera Superior del Formulario: Logo DINARP + Modo Claro/Oscuro ── */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-border/40">
        <div>
          <img
            src={getAssetPath("/logo-horizontal.svg")}
            alt="Logo DINARP"
            className="dark:hidden h-11 sm:h-12 w-auto max-w-[220px] sm:max-w-[240px] object-contain"
          />
          <img
            src={getAssetPath("/logo-horizontal-outline-blanco.svg")}
            alt="Logo DINARP"
            className="hidden dark:block h-11 sm:h-12 w-auto max-w-[220px] sm:max-w-[240px] object-contain opacity-90"
          />
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
