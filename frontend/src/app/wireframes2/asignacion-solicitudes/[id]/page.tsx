"use client";

import React, { useState, use, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  User,
  FileText,
  ShieldCheck,
  History,
  CheckCircle2,
  XCircle,
  UserPlus,
  RotateCcw,
  FileSignature,
  Mail,
  Check,
  Clock,
  Download,
  Eye,
  X,
  FileSpreadsheet,
  AlertTriangle,
  Info,
  MapPin,
  CreditCard,
  Phone,
  Smartphone,
  Calendar,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Stepper } from "@/components/ui/stepper";
import { Card, CardTitle, CardDescription, CardBadge, CardDecorativeIcon } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Timeline, type TimelineItem } from "@/components/ui/timeline";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { WireframeDashboardLayout } from "../../components/wireframe-dashboard-layout";
import { MOCK_USERS_BY_ROLE } from "../../catalogo-interoperabilidad/data/catalogo-data";
import { useAuthStore } from "../../acceso-seguridad/data/auth-store";
import {
  useSolicitudesIngresoStore,
  getEstadoBadgeProps,
  puedeReasignarSolicitud,
  type SolicitudIngreso,
} from "../../acceso-seguridad/data/gestion-ingresos-store";
import { AprobarSolicitudDialog } from "../components/aprobar-solicitud-dialog";
import { RechazarSolicitudDialog } from "../components/rechazar-solicitud-dialog";
import { AsignarRevisorDialog, AsignarRevisorPanel } from "../components/asignar-revisor-dialog";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SolicitudDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { activeUser } = useAuthStore();
  const currentUser = activeUser || MOCK_USERS_BY_ROLE.DIR_GESTION;
  const isDirector = currentUser.role === "DIR_GESTION" || currentUser.role === "DIR_NORMATIVA";
  const isRevisor = currentUser.role === "EQ_GESTION" || currentUser.role === "EQ_NORMATIVA";

  const store = useSolicitudesIngresoStore();
  const { solicitudes, isLoaded, aprobarSolicitud, rechazarSolicitud } = store;

  const solicitud = useMemo(() => {
    return solicitudes.find((s) => s.id === id) || null;
  }, [solicitudes, id]);

  const [detailTab, setDetailTab] = useState<number>(0);

  // Línea de tiempo cronológica con TimelineItem para el UI Kit Timeline
  const timelineItems: TimelineItem[] = useMemo(() => {
    if (!solicitud) return [];

    const items: TimelineItem[] = [];

    // 1. Evento de ingreso digital inicial
    items.push({
      id: "ingreso-solicitud",
      title: "Solicitud registrada en Portal Web DINARP",
      description: `Ingreso digital del trámite ${solicitud.tituloTramite} (${solicitud.codigoDocumental}) enviado por ${solicitud.institucion}. Formulario y expediente habilitante ingresados en bandeja de entrada.`,
      date: solicitud.fechaSolicitud,
      status: "info",
      icon: <Building2 className="size-4" />,
      user: solicitud.nombreCompleto || solicitud.institucion,
    });

    // 2. Historial de eventos registrados en BPM
    if (solicitud.historial && solicitud.historial.length > 0) {
      solicitud.historial.forEach((h, idx) => {
        const accionLower = h.accion.toLowerCase();
        const isDanger =
          accionLower.includes("cancel") ||
          accionLower.includes("rechaz") ||
          accionLower.includes("observad") ||
          accionLower.includes("cierr") ||
          accionLower.includes("deneg");
        const isSuccess =
          accionLower.includes("aprob") ||
          accionLower.includes("resoluci") ||
          accionLower.includes("finaliz") ||
          accionLower.includes("activa");
        const isAssign =
          accionLower.includes("asignac") ||
          accionLower.includes("asignad") ||
          accionLower.includes("revisor");
        const isReview =
          accionLower.includes("revis");

        let status: TimelineItem["status"] = "info";
        let icon: React.ReactNode = <History className="size-4" />;

        if (isDanger) {
          status = "danger";
          icon = <XCircle className="size-4" />;
        } else if (isSuccess) {
          status = "success";
          icon = <CheckCircle2 className="size-4" />;
        } else if (isAssign) {
          status = "primary";
          icon = <UserPlus className="size-4" />;
        } else if (isReview) {
          status = "warning";
          icon = <Clock className="size-4" />;
        }

        items.push({
          id: `hist-${idx}`,
          title: h.accion,
          description: h.detalles || undefined,
          date: h.fechaHora || h.fecha || "",
          status,
          icon,
          user: h.realizadoPor || undefined,
        });
      });
    }

    // Si el trámite fue asignado a un revisor y aún está pendiente de análisis técnico
    const revisorActual = solicitud.revisorGestion || solicitud.revisorNormatividad || solicitud.revisor;
    if (
      revisorActual &&
      revisorActual !== "Por asignar" &&
      !solicitud.revisionIniciada &&
      !["Aprobada", "APROBADO_FINAL", "Rechazada", "Cancelada"].includes(solicitud.estado)
    ) {
      const yaExistePendiente = items.some((i) =>
        i.title.toLowerCase().includes("pendiente de revisión")
      );
      if (!yaExistePendiente) {
        items.push({
          id: "pendiente-revision-step",
          title: "Pendiente de revisión",
          description: `Trámite asignado al funcionario ${revisorActual}. En espera de verificación documental.`,
          date: solicitud.fechaAsignacionGestion || solicitud.fechaAsignacionNormatividad || "Reciente",
          status: "primary",
          icon: <Clock className="size-4" />,
          user: revisorActual,
        });
      }
    }

    return items;
  }, [solicitud]);

  // Dialog states
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);

  // Preview document modal
  const [previewDoc, setPreviewDoc] = useState<{
    titulo: string;
    archivo: string;
  } | null>(null);

  const activeSectionTitle = useMemo(() => {
    if (currentUser.role === "DIR_GESTION" || currentUser.role === "DIR_NORMATIVA") {
      return "Asignación de solicitudes de enrolamiento";
    }
    if (currentUser.role === "EQ_GESTION" || currentUser.role === "EQ_NORMATIVA") {
      return "Solicitudes asignadas";
    }
    return "Gestión de ingresos";
  }, [currentUser.role]);

  const handleConfirmAsignacion = (
    solicitudId: string,
    revisorNombre: string,
    asignadoPor: string = currentUser.name,
    observaciones?: string
  ) => {
    if (solicitud?.estado.includes("NORMATIVIDAD") || currentUser.role === "DIR_NORMATIVA") {
      store.asignarRevisorNormatividad(solicitudId, revisorNombre, asignadoPor, observaciones);
    } else {
      store.asignarRevisorGestion(solicitudId, revisorNombre, asignadoPor, observaciones);
    }
    toast.success("Revisor asignado exitosamente", {
      description: `El trámite ${solicitudId} fue asignado a ${revisorNombre}.`,
    });
  };

  const renderEstadoBadge = (estado: any) => {
    const { tone, label } = getEstadoBadgeProps(estado);
    return (
      <Badge
        tone={tone}
        appearance="soft"
        size="sm"
        dot
        className="font-semibold text-[11px] normal-case tracking-normal whitespace-nowrap px-2.5 py-0.5 inline-flex shrink-0 shadow-2xs"
      >
        {label}
      </Badge>
    );
  };

  if (isLoaded && !solicitud) {
    return (
      <WireframeDashboardLayout
        breadcrumbs={[
          { label: activeSectionTitle, onClick: () => router.push("/wireframes2/asignacion-solicitudes") },
          { label: "Trámite no encontrado" },
        ]}
      >
        <div className="bg-surface border border-border rounded-2xl p-8 text-center space-y-4 my-8">
          <div className="size-12 rounded-full bg-muted/50 text-muted-foreground flex items-center justify-center mx-auto">
            <XCircle className="size-6" />
          </div>
          <h2 className="text-xl font-bold font-heading text-foreground">Solicitud no encontrada</h2>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            No se encontró ninguna solicitud con el código <code className="font-mono bg-muted px-1.5 py-0.5 rounded">{id}</code>.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/wireframes2/asignacion-solicitudes")}
            className="h-10 px-4 text-xs font-semibold gap-1.5"
          >
            <ArrowLeft className="size-4" />
            <span>Volver a la bandeja</span>
          </Button>
        </div>
      </WireframeDashboardLayout>
    );
  }

  if (!solicitud) {
    return (
      <WireframeDashboardLayout breadcrumbs={[{ label: activeSectionTitle }]}>
        <div className="p-8 text-center text-xs text-muted-foreground">Cargando datos del trámite...</div>
      </WireframeDashboardLayout>
    );
  }

  return (
    <WireframeDashboardLayout
      breadcrumbs={[
        {
          label: activeSectionTitle,
          onClick: (e: React.MouseEvent) => {
            e.preventDefault();
            router.push("/wireframes2/asignacion-solicitudes");
          },
        },
        { label: `Trámite ${solicitud.id}` },
      ]}
    >
      <main className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* White outer container card holding all page information */}
        <div className="bg-surface border border-border rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-foreground">
                  Trámite {solicitud.id}
                </h1>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {solicitud.tituloTramite} · Registrado el {solicitud.fechaSolicitud} · {solicitud.institucion}
              </p>
            </div>

            {/* Botones de acción y badge de estado en la cabecera */}
            <div className="flex items-center gap-3 self-start sm:self-auto">
              {renderEstadoBadge(solicitud.estado)}

              {/* ROL REVISOR GESTIÓN (gestion.revisor@gmail.com / EQ_GESTION): Aprobar y Devolver/Observar */}
              {currentUser.role === "EQ_GESTION" && solicitud.estado === "EN_REVISION_GESTION" ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsRejectOpen(true)}
                    className="h-10 px-4 text-xs font-semibold gap-2 border-border text-foreground hover:bg-muted rounded-xl"
                  >
                    <XCircle className="size-4" />
                    <span>Observar / Devolver</span>
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => setIsApproveOpen(true)}
                    className="h-10 px-4 text-xs font-semibold gap-2 shadow-xs"
                  >
                    <CheckCircle2 className="size-4" />
                    <span>Aprobar revisión</span>
                  </Button>
                </>
              ) : currentUser.role === "EQ_NORMATIVA" && solicitud.estado === "EN_REVISION_NORMATIVIDAD" ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsRejectOpen(true)}
                    className="h-10 px-4 text-xs font-semibold gap-2 border-border text-foreground hover:bg-muted rounded-xl"
                  >
                    <XCircle className="size-4" />
                    <span>Observar / Rechazar</span>
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => {
                      store.aprobarNormatividad(solicitud.id, currentUser.name, "RES-DINARP-2026-001");
                      toast.success("Resolución generada. Trámite finalizado exitosamente.");
                    }}
                    className="h-10 px-4 text-xs font-semibold gap-2 shadow-xs"
                  >
                    <FileSignature className="size-4" />
                    <span>Generar resolución y finalizar</span>
                  </Button>
                </>
              ) : null}
            </div>
          </div>

          {/* Banners contextuales según estado */}
          {solicitud.estado === "Aprobada" && (
            <div className="p-4 rounded-2xl bg-muted/40 border border-border text-foreground">
              <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                <CheckCircle2 className="size-4 shrink-0 text-foreground" />
                <span>
                  {solicitud.tipoTramite === "PROCESO_A_REGISTRO_INSTITUCION" &&
                    "Institución aprobada: Coordinadores prerregistrados e invitados al Proceso B"}
                  {solicitud.tipoTramite === "PROCESO_B_ENROLAMIENTO_COORDINADOR" &&
                    "Acuerdo de Confidencialidad aprobado: Coordinador institucional ACTIVO"}
                  {solicitud.tipoTramite === "PROCESO_C_CAMBIO_COORDINADOR" &&
                    "Cambio aprobado: Nuevo coordinador prerregistrado e invitado al Proceso B"}
                </span>
              </div>
              <div className="pt-2 mt-2 border-t border-border/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-muted-foreground">Fecha de resolución: </span>
                  <strong className="text-foreground">{solicitud.fechaRevision || "Reciente"}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Revisado por: </span>
                  <strong className="text-foreground">{solicitud.revisor || "Dirección de Gestión y Registro"}</strong>
                </div>
              </div>
            </div>
          )}

          {solicitud.estado === "Rechazada" && (
            <div className="p-4 rounded-2xl bg-muted/40 border border-border text-foreground space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                <XCircle className="size-4 shrink-0 text-muted-foreground" />
                <span>Trámite Denegado / Observado</span>
              </div>
              <div className="p-3 bg-surface rounded-xl border border-border text-xs">
                <span className="font-semibold text-foreground block mb-1">Motivo registrado para notificación:</span>
                <p className="text-foreground leading-relaxed">{solicitud.motivoRechazo || "No se especificó motivo de rechazo."}</p>
              </div>
              <div className="pt-2 border-t border-border/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-muted-foreground">Fecha de resolución: </span>
                  <strong className="text-foreground">{solicitud.fechaRevision || "Reciente"}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Revisado por: </span>
                  <strong className="text-foreground">{solicitud.revisor || "Dirección de Gestión y Registro"}</strong>
                </div>
              </div>
            </div>
          )}

          {solicitud.estado === "Cancelada" && (
            <div className="p-5 rounded-2xl bg-danger/5 border border-danger/30 text-foreground space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm text-danger">
                <AlertTriangle className="size-5 shrink-0" />
                <span>Trámite Cerrado y Cancelado Definitivamente</span>
              </div>
              <div className="p-3.5 bg-surface rounded-xl border border-danger/20 text-xs">
                <span className="font-semibold text-danger block mb-1">
                  Dictamen técnico de revisión:
                </span>
                <p className="text-foreground leading-relaxed">
                  {solicitud.motivoRechazo ||
                    "Revisión técnica desfavorable por documentación caducada o inconsistencias insubsanables en la firma. El expediente ha sido cerrado."}
                </p>
              </div>
              <div className="p-3 bg-muted/40 rounded-xl border border-border text-xs flex items-start gap-2.5 text-muted-foreground">
                <Info className="size-4 shrink-0 text-foreground mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="text-foreground">Acción obligatoria para la institución:</strong> Al haberse cerrado y cancelado este trámite formalmente, no admite subsanación en esta instancia. La entidad requirente debe regularizar sus requisitos habilitantes y realizar un nuevo ingreso de solicitud desde cero en el portal.
                </p>
              </div>
              <div className="pt-2 border-t border-border/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-muted-foreground">Fecha de cancelación: </span>
                  <strong className="text-foreground">{solicitud.fechaRevision || "20/09/2026 16:45"}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Revisado por: </span>
                  <strong className="text-foreground">{solicitud.revisor || "Ana Torres (Área de Gestión)"}</strong>
                </div>
              </div>
            </div>
          )}

          {solicitud.estado === "APROBADO_FINAL" && (
            <div className="p-4 rounded-2xl bg-muted/40 border border-border text-foreground space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                <CheckCircle2 className="size-4 shrink-0 text-success" />
                <span>Trámite Aprobado con Resolución Oficial Emitida</span>
              </div>
              <div className="p-3 bg-surface rounded-xl border border-border text-xs">
                <span className="font-semibold text-foreground block mb-1">Resolución Final:</span>
                <p className="font-mono font-bold text-primary">{solicitud.resolucion || "RES-DINARP-2026-088"}</p>
              </div>
              <div className="pt-2 border-t border-border/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-muted-foreground">Fecha de resolución: </span>
                  <strong className="text-foreground">{solicitud.fechaRevision || "Reciente"}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground">Revisores intervinientes: </span>
                  <strong className="text-foreground">
                    {solicitud.revisorGestion ? `${solicitud.revisorGestion} (Gestión)` : "Gestión"} ·{" "}
                    {solicitud.revisorNormatividad ? `${solicitud.revisorNormatividad} (Normatividad)` : "Normatividad"}
                  </strong>
                </div>
              </div>
            </div>
          )}

          {/* DISTRIBUCIÓN EN 2 COLUMNAS: IZQUIERDA RESUMEN/TRAZABILIDAD, DERECHA PANEL DE ASIGNACIÓN */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* COLUMNA IZQUIERDA (7 cols en lg, 7 en xl): RESUMEN DE SOLICITUD Y TRAZABILIDAD */}
            <div className="lg:col-span-7 xl:col-span-7 space-y-6">
              <Tabs defaultValue="resumen" className="w-full space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-3">
                  <TabsList className="h-auto p-1.5 rounded-full bg-surface-subtle border border-border/40 inline-flex gap-1.5 w-full sm:w-auto justify-start">
                    <TabsTrigger
                      value="resumen"
                      className="px-5 py-2 text-xs font-bold gap-2"
                    >
                      <Building2 className="size-4 shrink-0" />
                      <span>Solicitud Registro Institución</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="trazabilidad"
                      className="px-5 py-2 text-xs font-bold gap-2"
                    >
                      <History className="size-4 shrink-0" />
                      <span>Trazabilidad</span>
                    </TabsTrigger>
                  </TabsList>

                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <span>Formulario oficial:</span>
                    <Badge tone="neutral" appearance="soft" size="sm" className="font-mono border border-border">
                      {solicitud.codigoDocumental}
                    </Badge>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex items-center justify-center size-5 rounded-full bg-muted/60 text-muted-foreground hover:text-foreground transition-colors cursor-help focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            aria-label="Información del Formulario Oficial"
                          >
                            <Info className="size-3.5" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" variant="primary" className="max-w-xs text-xs leading-relaxed">
                          Anexo A: Formulario diligenciado por la institución solicitante para iniciar su proceso de registro en el SINARP.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {/* TAB 1: RESUMEN DE SOLICITUD (FORMULARIO CON PESTAÑAS CÁPSULA SIN ESTADOS PENDIENTES) */}
                <TabsContent value="resumen" className="space-y-6 animate-in fade-in duration-200">
                  {/* Encabezado del Trámite en Card Featured estilo UI Kit con Badge Primary e Icono */}
                  <Card
                    variant="featured"
                    disableHover={true}
                    className="bg-primary-100/30 dark:bg-primary-900/20 border-0 shadow-none hover:shadow-none hover:translate-y-0 mb-4 relative overflow-hidden"
                  >
                    <div className="flex items-center gap-2">
                      <CardBadge className="bg-primary/20 text-primary text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 border-0">
                        FORMULARIO OFICIAL ARP-R01
                      </CardBadge>
                    </div>

                    <CardTitle className="text-lg sm:text-xl font-bold font-heading text-primary">
                      Anexo A — Solicitud de Acceso al Sistema Nacional de Registros Públicos
                    </CardTitle>

                    <CardDescription className="text-xs text-primary-800/80 dark:text-primary-200/80 font-medium">
                      Proceso A · Enrolamiento institucional al SINARP
                    </CardDescription>

                    <CardDecorativeIcon className="-bottom-10 -right-10 opacity-20 group-hover/card:scale-100">
                      <FileText className="size-32 text-primary" />
                    </CardDecorativeIcon>
                  </Card>

                  {/* Pestañas Cápsula UI Kit para navegar secciones (sin badges de estado) */}
                  <div className="overflow-x-auto py-1">
                    <Tabs
                      defaultValue="tab-0"
                      value={`tab-${detailTab}`}
                      onValueChange={(val) => setDetailTab(Number(val.replace("tab-", "")))}
                      className="w-full"
                    >
                      <TabsList className="h-auto p-1.5 rounded-full bg-primary-300/20 dark:bg-primary-900/20 border border-primary/10 inline-flex gap-1.5 flex-nowrap w-full sm:w-auto justify-start">
                        <TabsTrigger
                          value="tab-0"
                          className="px-4 py-2 text-xs font-bold gap-2"
                        >
                          <Building2 className="size-3.5 shrink-0" />
                          <span>1. Entidad y Autoridad</span>
                        </TabsTrigger>
                        <TabsTrigger
                          value="tab-1"
                          className="px-4 py-2 text-xs font-bold gap-2"
                        >
                          <User className="size-3.5 shrink-0" />
                          <span>2. Coordinadores</span>
                        </TabsTrigger>
                        <TabsTrigger
                          value="tab-2"
                          className="px-4 py-2 text-xs font-bold gap-2"
                        >
                          <FileText className="size-3.5 shrink-0" />
                          <span>3. Servicios y Procesos</span>
                        </TabsTrigger>
                        <TabsTrigger
                          value="tab-3"
                          className="px-4 py-2 text-xs font-bold gap-2"
                        >
                          <ShieldCheck className="size-3.5 shrink-0" />
                          <span>4. Declaraciones y firma</span>
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  {/* PASO 0: ENTIDAD Y AUTORIDAD */}
                  {detailTab === 0 && (
                    <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs animate-in fade-in duration-200">
                      <div className="bg-primary-100/20 border-b border-primary p-3.5 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-t-lg">
                        <div>
                          <h2 className="text-sm font-bold font-heading text-primary flex items-center gap-2">
                            <Building2 className="size-4 text-primary shrink-0" />
                            <span>Sección I — Cláusula Primera: 1.1 Del Solicitante</span>
                          </h2>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Información general de la entidad requirente y de su máxima autoridad o delegado.
                          </p>
                        </div>
                        <Badge tone="neutral" appearance="soft" size="sm" className="font-semibold border border-border shrink-0">
                          {solicitud.anexoA?.entidadTipo === "Publica" ? "ENTIDAD PÚBLICA" : "ENTIDAD PRIVADA"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2 space-y-1.5">
                          <Label className="text-xs font-semibold text-foreground block">Naturaleza de la Entidad</Label>
                          <div className="flex items-center gap-6 pt-1">
                            <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-not-allowed">
                              <input
                                type="radio"
                                name="entidadTipoDetail"
                                checked={solicitud.anexoA?.entidadTipo !== "Privada"}
                                disabled
                                className="size-4 text-primary accent-primary cursor-not-allowed"
                              />
                              <span>Entidad Pública</span>
                            </label>
                            <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-not-allowed">
                              <input
                                type="radio"
                                name="entidadTipoDetail"
                                checked={solicitud.anexoA?.entidadTipo === "Privada"}
                                disabled
                                className="size-4 text-primary accent-primary cursor-not-allowed"
                              />
                              <span>Entidad Privada</span>
                            </label>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-foreground">Nombre de la Entidad *</Label>
                          <InputGroup leftIcon={<Building2 className="size-4 text-muted-foreground" />}>
                            <InputGroupInput
                              value={solicitud.anexoA?.nombreEntidad || solicitud.institucion}
                              disabled
                              className="bg-muted/30 cursor-not-allowed font-bold text-xs text-foreground"
                            />
                          </InputGroup>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-foreground">RUC de la Entidad (13 dígitos) *</Label>
                          <InputGroup leftIcon={<FileText className="size-4 text-muted-foreground" />}>
                            <InputGroupInput
                              value={solicitud.anexoA?.rucEntidad || "1768000000001"}
                              disabled
                              className="bg-muted/30 cursor-not-allowed font-mono text-xs text-foreground"
                            />
                          </InputGroup>
                        </div>

                        <div className="sm:col-span-2 space-y-1.5">
                          <Label className="text-xs font-semibold text-foreground">Dirección de la Entidad *</Label>
                          <InputGroup leftIcon={<MapPin className="size-4 text-muted-foreground" />}>
                            <InputGroupInput
                              value={solicitud.anexoA?.direccionEntidad || "Av. 6 de Diciembre N25-75 y Av. Colón, Quito"}
                              disabled
                              className="bg-muted/30 cursor-not-allowed text-xs text-foreground"
                            />
                          </InputGroup>
                        </div>

                        <div className="sm:col-span-2 space-y-1.5">
                          <Label className="text-xs font-semibold text-foreground">Objeto Social y/o Actividad de la Entidad *</Label>
                          <Textarea
                            value={solicitud.anexoA?.objetoSocial || "Rectoría y formulación de políticas públicas de telecomunicaciones y gobierno digital."}
                            disabled
                            rows={2}
                            className="bg-muted/30 cursor-not-allowed text-xs leading-relaxed text-foreground rounded-2xl p-3 border-border/80"
                          />
                        </div>

                        <div className="sm:col-span-2 pt-3 pb-1 border-t border-border/60">
                          <h3 className="text-xs font-bold text-foreground font-heading">
                            Máxima autoridad / delegado / representante legal o apoderado
                          </h3>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-foreground">Nombre de la máxima autoridad o apoderado *</Label>
                          <InputGroup leftIcon={<User className="size-4 text-muted-foreground" />}>
                            <InputGroupInput
                              value={solicitud.anexoA?.representanteLegalNombre || solicitud.nombreCompleto}
                              disabled
                              className="bg-muted/30 cursor-not-allowed font-semibold text-xs text-foreground"
                            />
                          </InputGroup>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs font-semibold text-foreground">Denominación del Cargo *</Label>
                          <InputGroup leftIcon={<Building2 className="size-4 text-muted-foreground" />}>
                            <InputGroupInput
                              value={solicitud.anexoA?.representanteLegalCargo || "Ministro de Telecomunicaciones (Representante Legal)"}
                              disabled
                              className="bg-muted/30 cursor-not-allowed text-xs text-foreground"
                            />
                          </InputGroup>
                        </div>

                        <div className="sm:col-span-2 space-y-1.5">
                          <Label className="text-xs font-semibold text-foreground">Correo Electrónico de la Autoridad *</Label>
                          <InputGroup leftIcon={<Mail className="size-4 text-muted-foreground" />}>
                            <InputGroupInput
                              value={solicitud.anexoA?.representanteLegalEmail || solicitud.correo || "ministro@mintel.gob.ec"}
                              disabled
                              className="bg-muted/30 cursor-not-allowed text-xs text-foreground"
                            />
                          </InputGroup>
                        </div>

                        <div className="sm:col-span-2 p-4 rounded-xl border border-border bg-muted/20 flex items-center gap-3">
                          <Checkbox checked={solicitud.anexoA?.esDelegado || false} disabled />
                          <div>
                            <Label className="text-xs font-semibold text-foreground block">Firma en Calidad de Delegado Oficial</Label>
                            <span className="text-[11px] text-muted-foreground">
                              {solicitud.anexoA?.esDelegado
                                ? "Suscrito bajo Resolución de Delegación / Acción de Personal (Documento habilitante adjunto en Paso 4)."
                                : "Suscrito directamente por la Máxima Autoridad Institucional."}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border flex justify-end">
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          onClick={() => setDetailTab(1)}
                          className="text-xs font-semibold gap-1.5"
                        >
                          Siguiente: 2. Coordinadores →
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* PASO 1: COORDINADORES INSTITUCIONALES */}
                  {detailTab === 1 && (
                    <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs animate-in fade-in duration-200">
                      <div className="space-y-6">
                        {/* Coordinador Titular */}
                        <div className="space-y-4 border border-border/80 rounded-2xl p-5 bg-surface shadow-2xs">
                          <div className="bg-muted/50 p-3.5 rounded-xl flex items-center justify-between gap-3 border border-border/40">
                            <div>
                              <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                                <User className="size-4 text-muted-foreground shrink-0" />
                                <span>1.2 Coordinador Institucional Principal (Titular)</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Ingresa los datos del coordinador institucional titular designado por la entidad.
                              </p>
                            </div>
                            <Badge tone="neutral" appearance="soft" size="sm" className="font-bold uppercase tracking-wider px-2.5 py-0.5">
                              TITULAR
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <Label className="text-xs font-semibold text-foreground">Nombre Completo *</Label>
                              <InputGroup leftIcon={<User className="size-4 text-muted-foreground" />}>
                                <InputGroupInput value={solicitud.anexoA?.titularNombreCompleto || "Ing. Esteban Javier Morales Salazar"} disabled className="bg-muted/30 cursor-not-allowed font-semibold text-xs text-foreground" />
                              </InputGroup>
                            </div>

                            <div className="space-y-1">
                              <Label className="text-xs font-semibold text-foreground">Cédula de Ciudadanía *</Label>
                              <InputGroup leftIcon={<CreditCard className="size-4 text-muted-foreground" />}>
                                <InputGroupInput value={solicitud.anexoA?.titularCedula || "1718956234"} disabled className="bg-muted/30 cursor-not-allowed font-mono text-xs text-foreground" />
                              </InputGroup>
                            </div>

                            <div className="space-y-1">
                              <Label className="text-xs font-semibold text-foreground">Cargo / Rol en la Institución *</Label>
                              <InputGroup leftIcon={<Building2 className="size-4 text-muted-foreground" />}>
                                <InputGroupInput value={solicitud.anexoA?.titularCargo || "Director de Gobierno Digital"} disabled className="bg-muted/30 cursor-not-allowed text-xs text-foreground" />
                              </InputGroup>
                            </div>

                            <div className="space-y-1">
                              <Label className="text-xs font-semibold text-foreground">Área / Unidad a la que pertenece *</Label>
                              <InputGroup leftIcon={<Building2 className="size-4 text-muted-foreground" />}>
                                <InputGroupInput value={solicitud.anexoA?.titularAreaUnidad || "Viceministerio de Tecnologías de la Información"} disabled className="bg-muted/30 cursor-not-allowed text-xs text-foreground" />
                              </InputGroup>
                            </div>

                            <div className="space-y-1">
                              <Label className="text-xs font-semibold text-foreground">Correo Electrónico Institucional *</Label>
                              <InputGroup leftIcon={<Mail className="size-4 text-muted-foreground" />}>
                                <InputGroupInput value={solicitud.anexoA?.titularEmail || "esteban.morales@mintel.gob.ec"} disabled className="bg-muted/30 cursor-not-allowed text-xs text-foreground" />
                              </InputGroup>
                            </div>

                            <div className="space-y-1">
                              <Label className="text-xs font-semibold text-foreground">Teléfono Fijo Institucional *</Label>
                              <InputGroup leftIcon={<Phone className="size-4 text-muted-foreground" />}>
                                <InputGroupInput value={solicitud.anexoA?.titularTelefonoFijo || "022200200 ext 120"} disabled className="bg-muted/30 cursor-not-allowed text-xs text-foreground" />
                              </InputGroup>
                            </div>

                            <div className="space-y-1">
                              <Label className="text-xs font-semibold text-foreground">Móvil Institucional *</Label>
                              <InputGroup leftIcon={<Smartphone className="size-4 text-muted-foreground" />}>
                                <InputGroupInput value={solicitud.anexoA?.titularMovilInstitucional || "0995544332"} disabled className="bg-muted/30 cursor-not-allowed text-xs text-foreground" />
                              </InputGroup>
                            </div>

                            <div className="space-y-1">
                              <Label className="text-xs font-semibold text-foreground">Móvil Personal *</Label>
                              <InputGroup leftIcon={<Smartphone className="size-4 text-muted-foreground" />}>
                                <InputGroupInput value={solicitud.anexoA?.titularMovilPersonal || "0984433221"} disabled className="bg-muted/30 cursor-not-allowed text-xs text-foreground" />
                              </InputGroup>
                            </div>
                          </div>
                        </div>

                        {/* Coordinador Suplente */}
                        <div className="space-y-4 border border-border/80 rounded-2xl p-5 bg-surface shadow-2xs">
                          <div className="bg-muted/50 p-3.5 rounded-xl flex items-center justify-between gap-3 border border-border/40">
                            <div>
                              <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                                <User className="size-4 text-muted-foreground shrink-0" />
                                <span>1.3 Coordinador Institucional Suplente</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Ingresa los datos del coordinador institucional suplente designado por la entidad.
                              </p>
                            </div>
                            <Badge tone="neutral" appearance="soft" size="sm" className="font-bold uppercase tracking-wider px-2.5 py-0.5">
                              SUPLENTE
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <Label className="text-xs font-semibold text-foreground">Nombre Completo *</Label>
                              <InputGroup leftIcon={<User className="size-4 text-muted-foreground" />}>
                                <InputGroupInput value={solicitud.anexoA?.suplenteNombreCompleto || "Lic. Carmen Elena Vinueza Proaño"} disabled className="bg-muted/30 cursor-not-allowed font-semibold text-xs text-foreground" />
                              </InputGroup>
                            </div>

                            <div className="space-y-1">
                              <Label className="text-xs font-semibold text-foreground">Cédula de Ciudadanía *</Label>
                              <InputGroup leftIcon={<CreditCard className="size-4 text-muted-foreground" />}>
                                <InputGroupInput value={solicitud.anexoA?.suplenteCedula || "1714523698"} disabled className="bg-muted/30 cursor-not-allowed font-mono text-xs text-foreground" />
                              </InputGroup>
                            </div>

                            <div className="space-y-1">
                              <Label className="text-xs font-semibold text-foreground">Cargo / Rol en la Institución *</Label>
                              <InputGroup leftIcon={<Building2 className="size-4 text-muted-foreground" />}>
                                <InputGroupInput value={solicitud.anexoA?.suplenteCargo || "Especialista de Interoperabilidad Gubernamental"} disabled className="bg-muted/30 cursor-not-allowed text-xs text-foreground" />
                              </InputGroup>
                            </div>

                            <div className="space-y-1">
                              <Label className="text-xs font-semibold text-foreground">Área / Unidad a la que pertenece *</Label>
                              <InputGroup leftIcon={<Building2 className="size-4 text-muted-foreground" />}>
                                <InputGroupInput value={solicitud.anexoA?.suplenteAreaUnidad || "Dirección de Gobierno Digital"} disabled className="bg-muted/30 cursor-not-allowed text-xs text-foreground" />
                              </InputGroup>
                            </div>

                            <div className="space-y-1">
                              <Label className="text-xs font-semibold text-foreground">Correo Electrónico Institucional *</Label>
                              <InputGroup leftIcon={<Mail className="size-4 text-muted-foreground" />}>
                                <InputGroupInput value={solicitud.anexoA?.suplenteEmail || "carmen.vinueza@mintel.gob.ec"} disabled className="bg-muted/30 cursor-not-allowed text-xs text-foreground" />
                              </InputGroup>
                            </div>

                            <div className="space-y-1">
                              <Label className="text-xs font-semibold text-foreground">Teléfono Fijo Institucional *</Label>
                              <InputGroup leftIcon={<Phone className="size-4 text-muted-foreground" />}>
                                <InputGroupInput value={solicitud.anexoA?.suplenteTelefonoFijo || "022200200 ext 125"} disabled className="bg-muted/30 cursor-not-allowed text-xs text-foreground" />
                              </InputGroup>
                            </div>

                            <div className="space-y-1">
                              <Label className="text-xs font-semibold text-foreground">Móvil Institucional *</Label>
                              <InputGroup leftIcon={<Smartphone className="size-4 text-muted-foreground" />}>
                                <InputGroupInput value={solicitud.anexoA?.suplenteMovilInstitucional || "0991122334"} disabled className="bg-muted/30 cursor-not-allowed text-xs text-foreground" />
                              </InputGroup>
                            </div>

                            <div className="space-y-1">
                              <Label className="text-xs font-semibold text-foreground">Móvil Personal *</Label>
                              <InputGroup leftIcon={<Smartphone className="size-4 text-muted-foreground" />}>
                                <InputGroupInput value={solicitud.anexoA?.suplenteMovilPersonal || "0982233445"} disabled className="bg-muted/30 cursor-not-allowed text-xs text-foreground" />
                              </InputGroup>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border flex items-center justify-between gap-3">
                        <Button
                          type="button"
                          variant="neutral"
                          size="sm"
                          onClick={() => setDetailTab(0)}
                          className="text-xs font-semibold gap-1.5"
                        >
                          ← Volver a Entidad
                        </Button>
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          onClick={() => setDetailTab(2)}
                          className="text-xs font-semibold gap-1.5"
                        >
                          Siguiente: Servicios y Procesos →
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* PASO 2: SERVICIOS Y PROCESOS */}
                  {detailTab === 2 && (
                    <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs animate-in fade-in duration-200">
                      <div className="bg-primary-100/20 border-b border-primary p-3.5 mb-5 rounded-t-lg">
                        <h2 className="text-sm font-bold font-heading text-primary flex items-center gap-2">
                          <FileText className="size-4 text-primary shrink-0" />
                          <span>Sección II — Servicios y Herramientas Informáticas</span>
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Procesos y áreas en las que se van a utilizar los servicios y/o herramientas provistos por la DINARP.
                        </p>
                      </div>

                      <div className="space-y-6">
                        {/* 2.1 Servicios */}
                        <div className="space-y-3">
                          <div className="bg-muted/50 p-3 rounded-xl border border-border/40">
                            <div className="flex items-center gap-2 font-bold text-xs text-foreground">
                              <FileText className="size-4 text-muted-foreground shrink-0" />
                              <span>2.1 Servicios y/o herramientas requeridas *</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              Selecciona al menos uno de los servicios provistos por la DINARP.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="p-3.5 rounded-2xl border border-border bg-surface flex items-center gap-2.5 shadow-2xs">
                              <Checkbox checked disabled />
                              <span className="text-xs font-bold text-foreground">Interoperabilidad</span>
                            </div>
                            <div className="p-3.5 rounded-2xl border border-border bg-surface flex items-center gap-2.5 shadow-2xs">
                              <Checkbox checked disabled />
                              <span className="text-xs font-bold text-foreground">Infodigital</span>
                            </div>
                            <div className="p-3.5 rounded-2xl border border-border bg-surface flex items-center gap-2.5 shadow-2xs">
                              <Checkbox checked disabled />
                              <span className="text-xs font-bold text-foreground">Ficha de Registro Único del Ciudadano</span>
                            </div>
                          </div>
                        </div>

                        {/* 2.2 Áreas */}
                        <div className="space-y-3">
                          <div className="bg-muted/50 p-3 rounded-xl border border-border/40">
                            <div className="flex items-center gap-2 font-bold text-xs text-foreground">
                              <Building2 className="size-4 text-muted-foreground shrink-0" />
                              <span>2.2 Áreas de uso institucional *</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              Indica las áreas administrativas o técnicas de la institución que utilizarán el servicio.
                            </p>
                          </div>

                          <Textarea
                            value={solicitud.anexoA?.areasUso || "Dirección de Gobierno Electrónico y Dirección de Datos Públicos"}
                            disabled
                            rows={2}
                            className="bg-muted/30 cursor-not-allowed text-xs font-medium text-foreground rounded-2xl p-3.5 border-border/80"
                          />
                        </div>

                        {/* 2.3 Procesos */}
                        <div className="space-y-3">
                          <div className="bg-muted/50 p-3 rounded-xl border border-border/40">
                            <div className="flex items-center gap-2 font-bold text-xs text-foreground">
                              <FileText className="size-4 text-muted-foreground shrink-0" />
                              <span>2.3 Procesos para los cuales utilizará los servicios *</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              Describe los procesos internos, trámites o plataformas para los cuales se consumirán los datos.
                            </p>
                          </div>

                          <Textarea
                            value={solicitud.anexoA?.procesosUso || "Verificación de interoperabilidad nacional de trámites ciudadanos en línea del Portal Único gob.ec."}
                            disabled
                            rows={2}
                            className="bg-muted/30 cursor-not-allowed text-xs font-medium text-foreground rounded-2xl p-3.5 border-border/80"
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border flex items-center justify-between gap-3">
                        <Button
                          type="button"
                          variant="neutral"
                          size="sm"
                          onClick={() => setDetailTab(1)}
                          className="text-xs font-semibold gap-1.5"
                        >
                          ← Volver a Coordinadores
                        </Button>
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          onClick={() => setDetailTab(3)}
                          className="text-xs font-semibold gap-1.5"
                        >
                          Siguiente: Declaraciones y firma →
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* PASO 3: DOCUMENTACIÓN HABILITANTE */}
                  {detailTab === 3 && (
                    <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs animate-in fade-in duration-200">
                      <div className="bg-primary-100/20 border-b border-primary p-3.5 mb-5 rounded-t-lg">
                        <h2 className="text-sm font-bold font-heading text-primary flex items-center gap-2">
                          <ShieldCheck className="size-4 text-primary shrink-0" />
                          <span>Sección III — Cláusula Segunda y Tercera: Declaraciones y Firma</span>
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Suscripción digital oficial del instrumento ARP-R01 conforme a la Ley de Comercio Electrónico y Firmas Electrónicas.
                        </p>
                      </div>

                      <div className="space-y-5">
                        {/* 2.2 Cláusula Segunda */}
                        <div className="bg-muted/50 p-4 rounded-xl border border-border/40 space-y-3">
                          <h3 className="text-xs font-bold text-foreground">2.2 Cláusula Segunda: Declaraciones del Solicitante</h3>
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            La entidad solicitante declara conocer los servicios provistos por la DINARP, así como los arts. 66 numerales 11 y 19 de la Constitución, art. 6 de la Ley Orgánica del Sistema Nacional de Registros Públicos, Ley de Optimización de Trámites, Ley Orgánica de Protección de Datos Personales, y arts. 178, 180 y 229 del COIP. La institución queda obligada a dar a la información el uso exclusivo para el que le sea concedido y custodiarla con prudencia.
                          </p>

                          <div className="flex items-center gap-2.5 pt-1">
                            <Checkbox checked disabled />
                            <span className="text-xs font-bold text-foreground">
                              Acepto expresamente las declaraciones legales, términos y responsabilidades del Anexo A.
                            </span>
                          </div>
                        </div>

                        {/* Resumen de Firmante */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Card
                            variant="featured"
                            disableHover={true}
                            className="bg-secondary-100/30 dark:bg-secondary-900/20 border-0 shadow-none hover:shadow-none hover:translate-y-0 relative overflow-hidden"
                          >
                            <CardBadge className="bg-secondary/20 text-secondary text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 border-0 flex items-center gap-1.5 w-fit">
                              <User className="size-3.5 text-secondary" />
                              <span>Firmante Autorizado</span>
                            </CardBadge>

                            <div className="space-y-0.5 mt-2">
                              <CardTitle className="text-base font-bold font-heading text-secondary">
                                {solicitud.anexoA?.representanteLegalNombre || "Ing. César Antonio Martín Moreno"}
                              </CardTitle>

                              <CardDescription className="text-xs text-secondary-800/80 dark:text-secondary-200/80 font-medium">
                                {solicitud.anexoA?.representanteLegalCargo || "Ministro de Telecomunicaciones (Representante Legal)"}
                              </CardDescription>
                            </div>

                            <CardDecorativeIcon className="-bottom-6 -right-6 opacity-20 group-hover/card:scale-100">
                              <User className="size-28 text-secondary" />
                            </CardDecorativeIcon>
                          </Card>

                          <Card
                            variant="featured"
                            disableHover={true}
                            className="bg-secondary-100/30 dark:bg-secondary-900/20 border-0 shadow-none hover:shadow-none hover:translate-y-0 relative overflow-hidden"
                          >
                            <CardBadge className="bg-secondary/20 text-secondary text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 border-0 flex items-center gap-1.5 w-fit">
                              <MapPin className="size-3.5 text-secondary" />
                              <span>Lugar y Fecha</span>
                            </CardBadge>

                            <div className="space-y-0.5 mt-2">
                              <CardTitle className="text-base font-bold font-heading text-secondary">
                                {solicitud.anexoA?.ciudadFirma || "Quito D.M."}
                              </CardTitle>

                              <CardDescription className="text-xs text-secondary-800/80 dark:text-secondary-200/80 font-mono font-medium flex items-center gap-1.5 mt-0.5">
                                <Calendar className="size-3.5 text-secondary/80" />
                                <span>{solicitud.anexoA?.fechaFirma || solicitud.fechaSolicitud || "24/09/2026"}</span>
                              </CardDescription>
                            </div>

                            <CardDecorativeIcon className="-bottom-6 -right-6 opacity-20 group-hover/card:scale-100">
                              <Calendar className="size-28 text-secondary" />
                            </CardDecorativeIcon>
                          </Card>
                        </div>

                        {/* Certificación y Documento Firmado FirmaEC */}
                        <div className="p-5 rounded-2xl border border-success/30 bg-success/5 space-y-4 shadow-2xs">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex items-start gap-3.5 min-w-0">
                              <div className="p-2.5 rounded-xl bg-success/10 text-success shrink-0 mt-0.5">
                                <CheckCircle2 className="size-5" />
                              </div>

                              <div className="space-y-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h4 className="font-mono font-bold text-xs sm:text-sm text-foreground">
                                    ARP-R01_Solicitud_Acceso_SINARP_{(solicitud.anexoA?.entidadSiglas || "ENTIDAD").toUpperCase()}.pdf
                                  </h4>
                                  <Badge tone="success" appearance="soft" size="sm" className="font-bold text-[10px] uppercase px-2 py-0.5 shrink-0">
                                    SE FIRMÓ EN FIRMA EC
                                  </Badge>
                                </div>

                                <p className="text-xs text-muted-foreground leading-relaxed">
                                  Documento oficial del formulario suscrito digitalmente por el Representante Legal mediante <strong className="text-foreground">FirmaEC</strong> con estampado cronológico y validez jurídica acreditada.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border flex items-center justify-between gap-3">
                        <Button
                          type="button"
                          variant="neutral"
                          size="sm"
                          onClick={() => setDetailTab(2)}
                          className="text-xs font-semibold gap-1.5"
                        >
                          ← Volver a Servicios
                        </Button>

                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            alert(`Descargando documento firmado ARP-R01_Solicitud_Acceso_SINARP_${(solicitud.anexoA?.entidadSiglas || "ENTIDAD").toUpperCase()}.pdf con validación FirmaEC...`);
                          }}
                          className="h-9 px-4 text-xs font-semibold gap-2 shadow-xs"
                        >
                          <Download className="size-4" />
                          <span>Descargar Anexo A</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* TAB 2: TRAZABILIDAD (TIMELINE DEL UI KIT) */}
                <TabsContent value="trazabilidad" className="space-y-4 animate-in fade-in duration-200">
                  {/* Encabezado Trazabilidad en Card Featured variante Info (Arriba del contenedor) */}
                  <Card
                    variant="featured"
                    disableHover={true}
                    className="bg-info-100/30 dark:bg-info-900/20 border-0 shadow-none hover:shadow-none hover:translate-y-0 relative overflow-hidden"
                  >
                    <div className="flex items-center gap-2">
                      <CardBadge className="bg-info/20 text-info text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 border-0 flex items-center gap-1.5">
                        <History className="size-3.5 text-info" />
                        <span>{timelineItems.length} {timelineItems.length === 1 ? "EVENTO REGISTRADO" : "EVENTOS REGISTRADOS"}</span>
                      </CardBadge>
                    </div>

                    <CardTitle className="text-lg sm:text-xl font-bold font-heading text-info mt-1">
                      Trazabilidad y Línea de Tiempo del Trámite
                    </CardTitle>

                    <CardDescription className="text-xs text-info-800/80 dark:text-info-200/80 font-medium">
                      Historial cronológico completo de envíos, asignaciones, revisiones técnicas y resoluciones emitidas.
                    </CardDescription>

                    <CardDecorativeIcon className="-bottom-10 -right-10 opacity-20 group-hover/card:scale-100">
                      <History className="size-32 text-info" />
                    </CardDecorativeIcon>
                  </Card>

                  {/* Contenedor principal de la sección */}
                  <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
                    <div className="pt-2 max-w-4xl">
                      <Timeline items={timelineItems} />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* COLUMNA DERECHA (5 cols en lg, 5 en xl): PANEL SEGÚN ROL */}
            <div className="lg:col-span-5 xl:col-span-5 space-y-5 lg:sticky lg:top-6">
              {/* SI ES DIRECTOR (DIR_GESTION / DIR_NORMATIVA): Exclusivamente Asignación / Reasignación */}
              {isDirector && (
                <div className="bg-primary-200/20 dark:bg-primary-900/10 border border-primary/20 rounded-2xl p-5 shadow-xs">
                  <AsignarRevisorPanel
                    solicitud={solicitud}
                    tipoArea={
                      solicitud.estado.includes("NORMATIVIDAD") || currentUser.role === "DIR_NORMATIVA"
                        ? "NORMATIVIDAD"
                        : "GESTION"
                    }
                    directorNombre={currentUser.name}
                    allSolicitudes={solicitudes}
                    isCardMode={true}
                    onConfirmAsignacion={(solId, revisor, dirNombre, observaciones) => {
                      handleConfirmAsignacion(solId, revisor, dirNombre, observaciones);
                    }}
                  />
                </div>
              )}

              {/* SI ES REVISOR (gestion.revisor@gmail.com / EQ_GESTION o EQ_NORMATIVA): Panel de Revisión Técnica y Dictamen */}
              {isRevisor && (
                <div className="bg-surface border border-border rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-border/70">
                    <div className="flex items-center gap-2">
                      <UserCheck className="size-5 text-primary" />
                      <div>
                        <h3 className="font-heading font-bold text-sm text-foreground">
                          Revisión Técnica Asignada
                        </h3>
                        <p className="text-[11px] text-muted-foreground">
                          Responsable: <strong className="text-foreground">{currentUser.name}</strong>
                        </p>
                      </div>
                    </div>
                    <Badge tone={solicitud.estado.includes("REVISION") ? "warning" : "neutral"} appearance="soft" size="sm">
                      {solicitud.estado.includes("REVISION") ? "EN REVISIÓN" : solicitud.estado}
                    </Badge>
                  </div>

                  <div className="p-3 bg-muted/30 rounded-xl border border-border text-xs space-y-2">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-muted-foreground">Institución requirente:</span>
                      <strong className="text-foreground truncate max-w-[180px]">{solicitud.institucion}</strong>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-muted-foreground">Fecha de registro:</span>
                      <strong className="text-foreground">{solicitud.fechaSolicitud}</strong>
                    </div>
                    {solicitud.revisor && (
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-muted-foreground">Revisor asignado:</span>
                        <strong className="text-foreground">{solicitud.revisor}</strong>
                      </div>
                    )}
                    {solicitud.observacionesAsignacion && (
                      <div className="pt-2 border-t border-border/60 text-[11px]">
                        <span className="text-muted-foreground block mb-0.5">Instrucciones del Director:</span>
                        <p className="text-foreground italic bg-surface p-2 rounded-lg border border-border/60">
                          "{solicitud.observacionesAsignacion}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Acciones de dictamen para Revisor */}
                  {(solicitud.estado === "EN_REVISION_GESTION" || solicitud.estado === "EN_REVISION_NORMATIVIDAD") && (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Dictamen y Resolución
                        </h4>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Verifica la documentación adjunta y emite el dictamen de aprobación o devolución.
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setIsRejectOpen(true)}
                          className="flex-1 text-xs font-semibold text-danger border-danger/30 hover:bg-danger/10 gap-1.5"
                        >
                          <XCircle className="size-3.5" />
                          <span>Observar / Rechazar</span>
                        </Button>
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            if (currentUser.role === "EQ_GESTION") {
                              setIsApproveOpen(true);
                            } else {
                              store.aprobarNormatividad(solicitud.id, currentUser.name, "RES-DINARP-2026-001");
                              toast.success("Resolución generada. Trámite finalizado exitosamente.");
                            }
                          }}
                          className="flex-1 text-xs font-semibold gap-1.5 shadow-2xs"
                        >
                          <CheckCircle2 className="size-3.5" />
                          <span>{currentUser.role === "EQ_GESTION" ? "Aprobar revisión" : "Finalizar trámite"}</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* DIÁLOGOS Y MODALES */}
        <AprobarSolicitudDialog
          solicitud={solicitud}
          open={isApproveOpen}
          onOpenChange={setIsApproveOpen}
          onConfirm={(sol) => {
            aprobarSolicitud(sol.id);
            toast.success("Trámite aprobado exitosamente.");
          }}
        />

        <RechazarSolicitudDialog
          solicitud={solicitud}
          open={isRejectOpen}
          onOpenChange={setIsRejectOpen}
          onConfirm={(sol, motivo) => {
            rechazarSolicitud(sol.id, motivo);
            toast.error("Trámite rechazado / observado.");
          }}
        />

        <AsignarRevisorDialog
          solicitud={solicitud}
          open={isAssignOpen}
          onOpenChange={setIsAssignOpen}
          tipoArea={currentUser.role === "DIR_NORMATIVA" ? "NORMATIVIDAD" : "GESTION"}
          directorNombre={currentUser.name}
          allSolicitudes={solicitudes}
          onConfirmAsignacion={(solId, revisor) => {
            handleConfirmAsignacion(solId, revisor);
          }}
        />

        {/* PREVIEW DE DOCUMENTO */}
        {previewDoc && (
          <Dialog open={Boolean(previewDoc)} onOpenChange={() => setPreviewDoc(null)}>
            <DialogContent className="max-w-2xl p-6">
              <DialogHeader>
                <DialogTitle className="text-base font-bold font-heading text-foreground">
                  Vista Previa — {previewDoc.titulo}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Visor de documento digital habilitante registrado.
                </DialogDescription>
              </DialogHeader>

              <div className="p-8 bg-muted/30 border border-border rounded-xl text-center space-y-3 my-2">
                <FileText className="size-12 text-muted-foreground mx-auto" />
                <div>
                  <h4 className="font-bold text-sm text-foreground">{previewDoc.titulo}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Formato PDF · Firma digital válida</p>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPreviewDoc(null)}
                  className="h-10 px-4 text-xs font-semibold"
                >
                  Cerrar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </WireframeDashboardLayout>
  );
}
