"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  User,
  Calendar,
  Send,
  ShieldCheck,
  Check,
  Info,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { WireframeDashboardLayout } from "../../components/wireframe-dashboard-layout";
import {
  getStoredProjects,
  getProjectById,
  type ProyectoInteroperabilidad,
} from "../proyectos-store";

function SeguimientoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("id");

  const [project, setProject] = useState<ProyectoInteroperabilidad | null>(null);

  useEffect(() => {
    const all = getStoredProjects();
    if (projectId) {
      const found = getProjectById(projectId);
      if (found) setProject(found);
      else if (all.length > 0) setProject(all[0]);
    } else if (all.length > 0) {
      setProject(all[0]);
    }
  }, [projectId]);

  const p = project || {
    id: "PRJ-2026-001",
    codigo: "PRJ-2026-001",
    nombre: "Proyecto de interoperabilidad",
    entidadSolicitante: "Ministerio de Telecomunicaciones y Sociedad de la Información (MINTEL)",
    estado: "En revisión" as const,
    responsable: "Ing. Carlos Mendoza",
    ultimaActualizacion: "Hoy",
    fuentes: [],
  };

  return (
    <WireframeDashboardLayout activeMenu="solicitudes">
      <div className="flex-1 flex flex-col min-w-0 bg-background text-foreground pb-12">
        {/* Breadcrumb & Encabezado */}
        <div className="border-b border-border bg-surface/50 px-6 sm:px-8 py-5">
          <Breadcrumb className="mb-3">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/wireframes/dashboard">Inicio</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/wireframes/solicitudes">Proyectos de interoperabilidad</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbPage>Seguimiento de trámite</BreadcrumbPage>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-muted border border-border">
                  {p.codigo}
                </span>
                <Badge appearance="outline" tone="neutral" className="border-foreground/30 bg-muted/80 text-foreground font-semibold text-xs">
                  {p.estado}
                </Badge>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Seguimiento del proyecto
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {p.nombre} — {p.entidadSolicitante}
              </p>
            </div>

            <Button variant="outline" size="sm" asChild className="gap-2 border-border">
              <Link href={`/wireframes/solicitudes/detalle?id=${p.id}`}>
                <ArrowLeft className="size-4" />
                Ver detalle completo
              </Link>
            </Button>
          </div>
        </div>

        {/* Timeline */}
        <div className="px-6 sm:px-8 py-8 w-full space-y-6">
          <div className="p-4 rounded-xl bg-muted/30 border border-border flex items-start gap-3 text-xs text-muted-foreground">
            <Info className="size-4 shrink-0 mt-0.5 text-foreground" />
            <div>
              <p className="font-bold text-foreground">Hitos de seguimiento propuestos:</p>
              <p className="mt-0.5">
                Las etapas del flujo de aprobación, responsables en DINARP y en instituciones fuentes serán validadas durante el taller.
              </p>
            </div>
          </div>

          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2 sm:before:left-3 before:top-3 before:bottom-3 before:w-[2px] before:bg-border">
            {/* Hito 1 */}
            <div className="relative">
              <div className="absolute -left-6 sm:-left-8 top-1 size-5 sm:size-6 rounded-full bg-foreground text-background flex items-center justify-center text-[10px] font-bold">
                ✓
              </div>
              <div className="p-4 rounded-2xl border border-border bg-card shadow-xs space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                  <span className="font-bold text-sm text-foreground">
                    {p.estado === "Borrador" ? "Borrador creado" : "Proyecto enviado a DINARP"}
                  </span>
                  <span className="text-muted-foreground">{p.ultimaActualizacion}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Responsable: <strong className="text-foreground">{p.responsable}</strong>
                </p>
                <p className="text-xs text-foreground bg-muted/20 p-2.5 rounded-xl border border-border/40">
                  Especificación de fuentes, servicios y campos completada en el formulario del módulo.
                </p>
              </div>
            </div>

            {/* Hito 2 */}
            {p.estado !== "Borrador" && (
              <div className="relative">
                <div className="absolute -left-6 sm:-left-8 top-1 size-5 sm:size-6 rounded-full bg-muted border-2 border-foreground flex items-center justify-center" />
                <div className="p-4 rounded-2xl border border-border bg-muted/20 shadow-xs space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                    <span className="font-bold text-sm text-foreground">Evaluación y consultas interinstitucionales</span>
                    <span className="text-muted-foreground italic font-medium">En revisión activa</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    DINARP coordina la viabilidad técnica y normativa con las instituciones fuentes.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </WireframeDashboardLayout>
  );
}

export default function WireframeSolicitudSeguimientoPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm">Cargando seguimiento...</div>}>
      <SeguimientoContent />
    </Suspense>
  );
}
