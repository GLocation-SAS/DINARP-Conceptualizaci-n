"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Database,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Pencil,
  Send,
  MessageSquare,
  ShieldCheck,
  Check,
  Info,
  Calendar,
  User,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
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
  saveStoredProject,
  type ProyectoInteroperabilidad,
} from "../proyectos-store";

function DetalleProyectoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("id");
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<"resumen" | "fuentes" | "observaciones" | "seguimiento">(
    tabParam === "seguimiento" ? "seguimiento" : "resumen"
  );

  const [project, setProject] = useState<ProyectoInteroperabilidad | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const all = getStoredProjects();
    if (projectId) {
      const found = getProjectById(projectId);
      if (found) {
        setProject(found);
      } else if (all.length > 0) {
        setProject(all[0]);
      }
    } else if (all.length > 0) {
      setProject(all[0]);
    }
    if (tabParam && ["resumen", "fuentes", "observaciones", "seguimiento"].includes(tabParam)) {
      setActiveTab(tabParam as "resumen" | "fuentes" | "observaciones" | "seguimiento");
    }
    setIsLoaded(true);
  }, [projectId, tabParam]);

  if (!isLoaded) {
    return (
      <WireframeDashboardLayout activeMenu="solicitudes">
        <div className="py-20 text-center text-sm text-muted-foreground">
          Cargando detalle del proyecto...
        </div>
      </WireframeDashboardLayout>
    );
  }

  // Fallback si no hay ningún proyecto creado en la demo
  if (!project) {
    return (
      <WireframeDashboardLayout activeMenu="solicitudes">
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[60vh]">
          <Database className="size-12 text-muted-foreground mb-3" />
          <h2 className="text-xl font-bold">No se encontró ningún proyecto registrado</h2>
          <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-md">
            Crea primero un proyecto de interoperabilidad para ver su detalle estructurado y seguimiento.
          </p>
          <Button asChild>
            <Link href="/wireframes/solicitudes/nueva">Crear proyecto</Link>
          </Button>
        </div>
      </WireframeDashboardLayout>
    );
  }

  // Simulación de responder observación
  const handleResponderObservacion = () => {
    toast.info("Modal de subsanación de observaciones para el taller DINARP");
  };

  return (
    <WireframeDashboardLayout activeMenu="solicitudes">
      <div className="flex-1 flex flex-col min-w-0 bg-background text-foreground pb-12">
        {/* ── Breadcrumb & Encabezado del Detalle ── */}
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
              <BreadcrumbPage>{project.codigo}</BreadcrumbPage>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 w-full">
            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-lg bg-muted border border-border text-foreground">
                  {project.codigo}
                </span>

                {/* Badge de Estado */}
                {project.estado === "Borrador" && (
                  <Badge appearance="outline" tone="neutral" className="border-border bg-muted/50 text-muted-foreground font-medium text-xs">
                    Borrador
                  </Badge>
                )}
                {project.estado === "En revisión" && (
                  <Badge appearance="outline" tone="neutral" className="border-foreground/30 bg-muted/80 text-foreground font-semibold text-xs">
                    En revisión (Propuesta)
                  </Badge>
                )}
                {project.estado === "Observada" && (
                  <Badge appearance="outline" tone="neutral" className="border-border bg-muted/30 text-foreground font-medium text-xs">
                    Observada
                  </Badge>
                )}
                {project.estado === "Autorizada" && (
                  <Badge appearance="outline" tone="neutral" className="border-foreground/40 bg-foreground/10 text-foreground font-bold text-xs">
                    Autorizada (Administrativo)
                  </Badge>
                )}
                {project.estado === "Servicio habilitado" && (
                  <Badge appearance="solid" tone="neutral" className="font-bold text-xs bg-foreground text-background">
                    Servicio habilitado (Técnico)
                  </Badge>
                )}

                <span className="text-xs text-muted-foreground">
                  Actualizado: {project.ultimaActualizacion}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                {project.nombre}
              </h1>

              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-3xl">
                {project.entidadSolicitante}
              </p>
            </div>

            {/* Acciones Principales Contextuales */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="gap-2 border-border"
              >
                <Link href="/wireframes/solicitudes">
                  <ArrowLeft className="size-4" />
                  Volver al listado
                </Link>
              </Button>

              {project.estado === "Borrador" && (
                <Button size="sm" asChild className="gap-2 font-semibold">
                  <Link href={`/wireframes/solicitudes/nueva?id=${project.id}`}>
                    <Pencil className="size-4" />
                    Continuar edición
                  </Link>
                </Button>
              )}

              {project.estado === "Observada" && (
                <Button
                  size="sm"
                  onClick={handleResponderObservacion}
                  className="gap-2 font-semibold"
                >
                  <MessageSquare className="size-4" />
                  Responder observación
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* ── Barra de Navegación por Secciones ── */}
        <div className="border-b border-border bg-background px-6 sm:px-8 w-full">
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-2">
            <Button
              variant={activeTab === "resumen" ? "neutral" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("resumen")}
              className="text-xs font-semibold rounded-xl h-8"
            >
              1. Resumen general
            </Button>
            <Button
              variant={activeTab === "fuentes" ? "neutral" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("fuentes")}
              className="text-xs font-semibold rounded-xl h-8 gap-1.5"
            >
              2. Fuentes y datos
              <Badge appearance="outline" tone="neutral" className="text-[10px] py-0 px-1.5 h-4 border-border">
                {project.fuentes?.length || 0}
              </Badge>
            </Button>
            <Button
              variant={activeTab === "observaciones" ? "neutral" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("observaciones")}
              className="text-xs font-semibold rounded-xl h-8"
            >
              3. Observaciones
            </Button>
            <Button
              variant={activeTab === "seguimiento" ? "neutral" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("seguimiento")}
              className="text-xs font-semibold rounded-xl h-8 gap-1.5"
            >
              4. Seguimiento
              <Clock className="size-3" />
            </Button>
          </div>
        </div>

        {/* ── Contenido de las Secciones ── */}
        <div className="px-6 sm:px-8 py-6 w-full space-y-6">

          {/* ══════════════════════════════════════════════════════════
              SECCIÓN 1: RESUMEN
             ══════════════════════════════════════════════════════════ */}
          {activeTab === "resumen" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Columna Principal: Objetivo y Justificación */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-border bg-card shadow-xs">
                  <CardHeader className="pb-3 border-b border-border/60">
                    <CardTitle className="text-base font-bold">Objetivo del proyecto</CardTitle>
                  </CardHeader>
                  <CardContent className="p-5">
                    <p className="text-sm text-foreground leading-relaxed">
                      {project.objetivo || "Sin descripción de objetivo registrada."}
                    </p>
                  </CardContent>
                </Card>

                {project.justificacion && (
                  <Card className="border-border bg-card shadow-xs">
                    <CardHeader className="pb-3 border-b border-border/60">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-bold">Justificación de uso declarada</CardTitle>
                        <Badge appearance="outline" tone="neutral" className="text-[11px] font-normal border-border">
                          Opcional en prototipo
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-5">
                      <p className="text-sm text-foreground leading-relaxed">
                        {project.justificacion}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Nota de distinción conceptual de estados */}
                <div className="p-4 rounded-2xl bg-muted/30 border border-border flex items-start gap-3 text-xs text-muted-foreground">
                  <Info className="size-4 shrink-0 mt-0.5 text-foreground" />
                  <div>
                    <p className="font-bold text-foreground">Distinción de estados para el taller DINARP:</p>
                    <p className="mt-1 leading-relaxed">
                      Se propone diferenciar el estado <strong>“Autorizado”</strong> (acuerdo y viabilidad administrativa) del estado <strong>“Servicio habilitado”</strong> (conexión técnica y credenciales operativas listas). Estos términos se validarán formalmente durante la sesión.
                    </p>
                  </div>
                </div>
              </div>

              {/* Columna Lateral: Ficha Técnica */}
              <div className="space-y-6">
                <Card className="border-border bg-card shadow-xs">
                  <CardHeader className="pb-3 border-b border-border/60">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                      Ficha del proyecto
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 space-y-4 text-xs">
                    <div>
                      <p className="text-muted-foreground font-medium">Entidad solicitante:</p>
                      <p className="text-foreground font-semibold text-sm mt-0.5">{project.entidadSolicitante}</p>
                    </div>

                    <div className="pt-2 border-t border-border/40">
                      <p className="text-muted-foreground font-medium">Responsable / Contacto:</p>
                      <p className="text-foreground font-medium mt-0.5">{project.responsable || "No especificado"}</p>
                    </div>

                    <div className="pt-2 border-t border-border/40">
                      <p className="text-muted-foreground font-medium">Fuentes involucradas:</p>
                      <p className="text-foreground font-bold mt-0.5">{project.fuentes?.length || 0} instituciones fuente</p>
                    </div>

                    <div className="pt-2 border-t border-border/40">
                      <p className="text-muted-foreground font-medium">Fecha de creación:</p>
                      <p className="text-foreground mt-0.5">{project.fechaCreacion}</p>
                    </div>

                    <div className="pt-2 border-t border-border/40">
                      <p className="text-muted-foreground font-medium">Estado actual:</p>
                      <div className="mt-1">{project.estado}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              SECCIÓN 2: FUENTES Y DATOS SOLICITADOS
             ══════════════════════════════════════════════════════════ */}
          {activeTab === "fuentes" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-bold">Instituciones fuentes y campos requeridos</h2>
                  <p className="text-xs text-muted-foreground">
                    Detalle de los servicios y atributos de datos solicitados para este proyecto.
                  </p>
                </div>
                <Badge appearance="outline" tone="neutral" className="self-start sm:self-auto text-xs border-border">
                  {project.fuentes?.length || 0} fuentes configuradas
                </Badge>
              </div>

              {(!project.fuentes || project.fuentes.length === 0) ? (
                <div className="p-12 text-center border border-dashed border-border rounded-2xl bg-muted/20">
                  <Database className="size-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-semibold">No se han registrado fuentes en este proyecto</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5">
                  {project.fuentes.map((fuente, idx) => (
                    <Card key={fuente.id || idx} className="border-border bg-card shadow-xs overflow-hidden">
                      <CardHeader className="bg-muted/30 pb-4 border-b border-border/60">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-xl bg-muted border border-border flex items-center justify-center font-bold text-xs">
                              {idx + 1}
                            </div>
                            <div>
                              <h3 className="font-bold text-sm text-foreground">{fuente.institucionNombre}</h3>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Servicio solicitado: <strong className="text-foreground">{fuente.servicioNombre}</strong>
                              </p>
                            </div>
                          </div>

                          <Badge appearance="outline" tone="neutral" className="text-[11px] font-normal border-border bg-background">
                            {fuente.campos.length} campos
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="p-5 space-y-3">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Campos solicitados por la entidad:
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                          {fuente.campos.map((campo, cIdx) => (
                            <div
                              key={cIdx}
                              className="flex items-center gap-2 p-2.5 rounded-xl border border-border bg-muted/20 text-xs font-medium text-foreground"
                            >
                              <div className="size-1.5 rounded-full bg-foreground shrink-0" />
                              <span className="truncate">{campo}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              SECCIÓN 3: OBSERVACIONES
             ══════════════════════════════════════════════════════════ */}
          {activeTab === "observaciones" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold">Observaciones y acuerdos de revisión</h2>
                <p className="text-xs text-muted-foreground">
                  Comentarios registrados durante el análisis técnico o administrativo del proyecto.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-muted/30 border border-border text-xs text-muted-foreground">
                <p className="font-medium text-foreground">Nota de validación para el taller:</p>
                <p className="mt-0.5">
                  Las reglas para emitir observaciones, tiempos máximos de respuesta y perfiles facultados para observar se definirán con el equipo de DINARP.
                </p>
              </div>

              {project.estado === "Borrador" ? (
                <div className="p-8 text-center border border-dashed border-border rounded-2xl bg-muted/10 text-xs text-muted-foreground">
                  Este proyecto se encuentra en estado borrador. Las observaciones se generan una vez enviado a revisión.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl border border-border bg-card shadow-xs space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="size-6 rounded-full bg-muted border border-border flex items-center justify-center font-bold text-[10px]">
                          D
                        </div>
                        <span className="font-bold text-foreground">Equipo de Interoperabilidad DINARP</span>
                      </div>
                      <span className="text-muted-foreground">{project.ultimaActualizacion}</span>
                    </div>
                    <p className="text-xs text-foreground bg-muted/20 p-3 rounded-xl border border-border/40">
                      Proyecto recibido en bandeja de interoperabilidad. Se verifica la solicitud con las instituciones fuentes correspondientes.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              SECCIÓN 4: SEGUIMIENTO
             ══════════════════════════════════════════════════════════ */}
          {activeTab === "seguimiento" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold">Historial de movimientos y seguimiento</h2>
                <p className="text-xs text-muted-foreground">
                  Línea de tiempo de los hitos registrados en la gestión del proyecto.
                </p>
              </div>

              <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2 sm:before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-border">
                {/* Hito 1: Creación */}
                <div className="relative">
                  <div className="absolute -left-6 sm:-left-8 top-0.5 size-4 sm:size-6 rounded-full bg-foreground text-background flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </div>
                  <div className="p-4 rounded-2xl border border-border bg-card shadow-xs space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                      <span className="font-bold text-sm text-foreground">
                        {project.estado === "Borrador" ? "Borrador inicial registrado" : "Proyecto enviado para revisión"}
                      </span>
                      <span className="text-muted-foreground font-mono">{project.fechaCreacion}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Responsable: <strong className="text-foreground">{project.responsable}</strong> ({project.entidadSolicitante})
                    </p>
                    <p className="text-xs text-foreground bg-muted/20 p-2.5 rounded-xl border border-border/40">
                      {project.estado === "Borrador"
                        ? "Se creó el borrador con la especificación de fuentes y campos requeridos."
                        : "Se remitió formalmente la solicitud de interoperabilidad a DINARP para validación interinstitucional."}
                    </p>
                  </div>
                </div>

                {/* Hito 2: Si está en revisión */}
                {project.estado !== "Borrador" && (
                  <div className="relative">
                    <div className="absolute -left-6 sm:-left-8 top-0.5 size-4 sm:size-6 rounded-full bg-muted border-2 border-foreground flex items-center justify-center" />
                    <div className="p-4 rounded-2xl border border-border bg-muted/20 shadow-xs space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                        <span className="font-bold text-sm text-foreground">En evaluación por DINARP y Fuentes</span>
                        <span className="text-muted-foreground italic">En curso</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Coordinación técnica con: {project.fuentes?.map((f) => f.institucionNombre.split("(")[0].trim()).join(", ")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </WireframeDashboardLayout>
  );
}

export default function WireframeSolicitudDetallePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm">Cargando proyecto...</div>}>
      <DetalleProyectoContent />
    </Suspense>
  );
}
