"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Layers } from "lucide-react";
import { WireframeDashboardLayout } from "../components/wireframe-dashboard-layout";

export default function WireframeConstruccionPage() {
  return (
    <WireframeDashboardLayout>
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 sm:p-12 text-center">
        <div className="max-w-lg w-full flex flex-col items-center">
          <div className="size-20 rounded-3xl bg-muted/50 border border-border flex items-center justify-center mb-6">
            <Layers className="size-10 text-foreground" strokeWidth={1.5} />
          </div>

          <Badge
            appearance="outline"
            tone="neutral"
            className="mb-3 border-border text-xs px-3 py-1 font-semibold"
          >
            Etapa de wireframes
          </Badge>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-2">
            Función no disponible
          </h1>

          <p className="text-sm font-semibold text-foreground/80 mb-2">
            Función en evaluación de diseño UX/UI
          </p>

          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
            Esta funcionalidad se encuentra en proceso de validación conceptual, técnica y normativa para la sesión de trabajo con DINARP e instituciones participantes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            <Button
              variant="primary"
              asChild
              rightIcon={<ArrowRight className="size-4" />}
            >
              <Link href="/wireframes/dashboard">
                Ir al Dashboard
              </Link>
            </Button>
            <Button
              variant="neutral"
              leftIcon={<ArrowLeft className="size-4" />}
              onClick={() => window.history.back()}
            >
              Regresar
            </Button>
          </div>
        </div>
      </div>
    </WireframeDashboardLayout>
  );
}
