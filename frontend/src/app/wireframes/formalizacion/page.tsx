"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  FileText,
  Building,
  Calendar,
  CreditCard,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { OnboardingGuide } from "@/components/ui/onboarding-guide";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { WireframeDashboardLayout } from "../components/wireframe-dashboard-layout";

export default function WireframeFormalizacionPage() {
  const router = useRouter();
  const [estadoConvenio, setEstadoConvenio] = useState<"Generado" | "Firmado y Cargado" | "En revisión">("Generado");
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setEstadoConvenio("En revisión");
    }, 800);
  };

  const onboardingSteps = [
    { targetId: "documento-generado", title: "Documento generado", content: "Este es el convenio o contrato generado automáticamente con los datos de tu solicitud." },
    { targetId: "acciones-firma", title: "Acciones de firma", content: "Debes descargar, firmar y volver a cargar el documento para continuar el proceso." },
    { targetId: "estado-documento", title: "Estado del documento", content: "Una vez cargado, podrás dar seguimiento a su estado de revisión desde aquí." }
  ];

  return (
    <WireframeDashboardLayout activeMenu="aprobaciones">
      <OnboardingGuide steps={onboardingSteps} guideKey={`onboarding-formalizacion-${estadoConvenio}`} />
      <main className="relative p-4 sm:p-6 lg:p-8 w-full space-y-6 sm:space-y-8">
        {/* Background subtle effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-muted/20 to-transparent pointer-events-none -z-10 blur-3xl opacity-60" />

        {/* ── 1. Acción Volver ── */}
        <div>
          <Link
            href="/wireframes/aprobaciones"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline group"
          >
            <ArrowLeft className="size-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Volver a solicitudes</span>
          </Link>
        </div>

        {/* ── 2. Header Title & Action ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-foreground tracking-tight">
              Formalización de Convenio
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Gestiona el convenio o contrato de interoperabilidad.
            </p>
          </div>

          <div id="acciones-firma" className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 lg:pt-0">
            <Button
              type="button"
              variant="outline"
              disabled={estadoConvenio !== "Generado"}
              className="h-10 px-4 text-xs font-semibold gap-2 border-border/80 bg-surface shrink-0"
            >
              <Download className="size-3.5" />
              <span>Descargar para firma</span>
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleUpload}
              disabled={isUploading || estadoConvenio !== "Generado"}
              className="h-10 px-4 text-xs font-semibold gap-2 shrink-0 shadow-xs"
            >
              <span>{isUploading ? "Cargando..." : "Subir documento firmado"}</span>
            </Button>
          </div>
        </div>

        {/* ── 3. Sección: Documento Generado ── */}
        <Card id="documento-generado" className="rounded-2xl border-border bg-surface p-6 sm:p-8 space-y-6 shadow-xs">
          <h2 className="text-sm font-bold text-foreground">
            Documento Principal
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 text-xs">
            {/* Columna Izquierda */}
            <div className="space-y-4">
              {/* N° de Convenio */}
              <div>
                <span className="text-muted-foreground block text-[11px] mb-0.5">N° de Documento</span>
                <span className="font-mono font-bold text-foreground text-sm">CONV-2026-0099</span>
              </div>

              {/* Fecha de emisión */}
              <div>
                <span className="text-muted-foreground block text-[11px] mb-0.5">Fecha de generación</span>
                <span className="text-foreground font-mono">16/09/2026</span>
              </div>

              {/* Estado */}
              <div>
                <span className="text-muted-foreground block text-[11px] mb-0.5">Estado actual</span>
                <Badge id="estado-documento" tone={estadoConvenio === "Generado" ? "warning" : "success"} appearance="soft" size="sm" className="font-semibold text-xs">
                  {estadoConvenio}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </WireframeDashboardLayout>
  );
}

