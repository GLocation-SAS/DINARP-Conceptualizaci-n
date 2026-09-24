"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Building2,
  User,
  ArrowUpDown,
  Search as SearchIcon,
  AlertTriangle,
  Info,
  ArrowLeft,
  FileText,
  SlidersHorizontal,
  Download,
  Check,
  Calendar,
  Mail,
  CreditCard,
  FileCheck2,
  X,
  FileSignature,
  FileSpreadsheet,
  AlertCircle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardDecorativeIcon } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search } from "@/components/ui/search";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import { WireframeDashboardLayout } from "../../components/wireframe-dashboard-layout";
import { MOCK_USERS_BY_ROLE } from "../../catalogo-interoperabilidad/data/catalogo-data";
import {
  useSolicitudesIngresoStore,
  type SolicitudIngreso,
  type EstadoSolicitudIngreso,
  type TipoTramiteIngreso,
} from "../data/gestion-ingresos-store";
import { AprobarSolicitudDialog } from "./components/aprobar-solicitud-dialog";
import { RechazarSolicitudDialog } from "./components/rechazar-solicitud-dialog";

const ITEMS_PER_PAGE = 6;

export default function GestionIngresosPage() {
  const currentUser = MOCK_USERS_BY_ROLE.DGR;

  const {
    solicitudes,
    isLoaded,
    aprobarSolicitud,
    rechazarSolicitud,
  } = useSolicitudesIngresoStore();

  // Filtro de proceso (Todos / Proceso A / Proceso B / Proceso C)
  const [filterTramite, setFilterTramite] = useState<string>("TODOS");

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("Todos");
  const [filterInstitucion, setFilterInstitucion] = useState<string>("Todas");
  const [filterFecha, setFilterFecha] = useState<string>("Todas");
  const [sortOrder, setSortOrder] = useState<
    | "fecha-desc"
    | "fecha-asc"
    | "nombre-asc"
    | "nombre-desc"
    | "institucion-asc"
    | "institucion-desc"
    | "cedula-asc"
    | "cedula-desc"
    | "estado-prioridad"
  >("fecha-desc");
  const [currentPage, setCurrentPage] = useState(1);

  // Selected item for full Detail View
  const [selectedSolicitud, setSelectedSolicitud] = useState<SolicitudIngreso | null>(null);

  // Dialogs for Approve & Reject
  const [solicitudToApprove, setSolicitudToApprove] = useState<SolicitudIngreso | null>(null);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [solicitudToReject, setSolicitudToReject] = useState<SolicitudIngreso | null>(null);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  // Document preview modal
  const [previewDoc, setPreviewDoc] = useState<{
    titulo: string;
    archivo: string;
    tamano: string;
    autoridad: string;
  } | null>(null);

  // Helper date parser (DD/MM/YYYY HH:mm)
  const parseFechaSolicitud = (fechaStr: string) => {
    const [datePart, timePart] = fechaStr.split(" ");
    if (!datePart) return 0;
    const [day, month, year] = datePart.split("/").map(Number);
    const [hours, minutes] = (timePart || "00:00").split(":").map(Number);
    return new Date(year, (month || 1) - 1, day || 1, hours || 0, minutes || 0).getTime();
  };

  // Institution options from data
  const institucionesList = useMemo(() => {
    const set = new Set<string>();
    solicitudes.forEach((s) => set.add(s.institucion));
    return Array.from(set);
  }, [solicitudes]);

  // KPIs globales
  const kpis = useMemo(() => {
    const pendientes = solicitudes.filter((s) => s.estado === "Pendiente").length;
    const aprobadas = solicitudes.filter((s) => s.estado === "Aprobada").length;
    const rechazadas = solicitudes.filter((s) => s.estado === "Rechazada").length;
    return { pendientes, aprobadas, rechazadas };
  }, [solicitudes]);

  // Filter & Sort
  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    let result = solicitudes.filter((item) => {
      // Filtro de pestaña de trámite
      if (filterTramite !== "TODOS" && item.tipoTramite !== filterTramite) {
        return false;
      }

      const matchesSearch =
        q === "" ||
        item.cedula.toLowerCase().includes(q) ||
        item.nombreCompleto.toLowerCase().includes(q) ||
        item.correo.toLowerCase().includes(q) ||
        item.institucion.toLowerCase().includes(q) ||
        item.codigoDocumental.toLowerCase().includes(q);

      const matchesEstado =
        filterEstado === "Todos" || item.estado === filterEstado;

      const matchesInstitucion =
        filterInstitucion === "Todas" || item.institucion === filterInstitucion;

      const matchesFecha = (() => {
        if (filterFecha === "Todas") return true;
        const itemTime = parseFechaSolicitud(item.fechaSolicitud);
        const now = Date.now();
        if (filterFecha === "7dias") {
          return now - itemTime <= 7 * 24 * 60 * 60 * 1000;
        }
        if (filterFecha === "30dias") {
          return now - itemTime <= 30 * 24 * 60 * 60 * 1000;
        }
        return true;
      })();

      return matchesSearch && matchesEstado && matchesInstitucion && matchesFecha;
    });

    // Sorting
    result.sort((a, b) => {
      switch (sortOrder) {
        case "fecha-desc":
          return parseFechaSolicitud(b.fechaSolicitud) - parseFechaSolicitud(a.fechaSolicitud);
        case "fecha-asc":
          return parseFechaSolicitud(a.fechaSolicitud) - parseFechaSolicitud(b.fechaSolicitud);
        case "nombre-asc":
          return a.nombreCompleto.localeCompare(b.nombreCompleto);
        case "nombre-desc":
          return b.nombreCompleto.localeCompare(a.nombreCompleto);
        case "institucion-asc":
          return a.institucion.localeCompare(b.institucion);
        case "institucion-desc":
          return b.institucion.localeCompare(a.institucion);
        case "cedula-asc":
          return a.cedula.localeCompare(b.cedula);
        case "cedula-desc":
          return b.cedula.localeCompare(a.cedula);
        case "estado-prioridad": {
          const priority: Record<EstadoSolicitudIngreso, number> = {
            Pendiente: 1,
            Aprobada: 2,
            Rechazada: 3,
          };
          return priority[a.estado] - priority[b.estado];
        }
        default:
          return 0;
      }
    });

    return result;
  }, [solicitudes, filterTramite, searchQuery, filterEstado, filterInstitucion, filterFecha, sortOrder]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const handleOpenApprove = (sol: SolicitudIngreso) => {
    setSolicitudToApprove(sol);
    setIsApproveOpen(true);
  };

  const handleConfirmApprove = (sol: SolicitudIngreso) => {
    aprobarSolicitud(sol.id);
    if (selectedSolicitud && selectedSolicitud.id === sol.id) {
      setSelectedSolicitud((prev) =>
        prev
          ? {
              ...prev,
              estado: "Aprobada",
              fechaRevision: "Reciente",
              revisor: "Dirección de Gestión y Registro",
            }
          : null
      );
    }
  };

  const handleOpenReject = (sol: SolicitudIngreso) => {
    setSolicitudToReject(sol);
    setIsRejectOpen(true);
  };

  const handleConfirmReject = (sol: SolicitudIngreso, motivo: string) => {
    rechazarSolicitud(sol.id, motivo);
    if (selectedSolicitud && selectedSolicitud.id === sol.id) {
      setSelectedSolicitud((prev) =>
        prev
          ? {
              ...prev,
              estado: "Rechazada",
              fechaRevision: "Reciente",
              revisor: "Dirección de Gestión y Registro",
              motivoRechazo: motivo,
            }
          : null
      );
    }
  };

  const renderEstadoBadge = (estado: EstadoSolicitudIngreso) => {
    switch (estado) {
      case "Pendiente":
        return (
          <Badge tone="neutral" appearance="soft" size="sm" className="gap-1 border border-border text-foreground">
            <span className="size-1.5 rounded-full bg-foreground" />
            Pendiente
          </Badge>
        );
      case "Aprobada":
        return (
          <Badge tone="neutral" appearance="soft" size="sm" className="gap-1 border border-border text-foreground">
            <span className="size-1.5 rounded-full bg-foreground" />
            Aprobada
          </Badge>
        );
      case "Rechazada":
        return (
          <Badge tone="neutral" appearance="soft" size="sm" className="gap-1 border border-border text-muted-foreground">
            <span className="size-1.5 rounded-full bg-muted-foreground" />
            Rechazada
          </Badge>
        );
    }
  };

  const renderTramiteBadge = (tipo: TipoTramiteIngreso, codigo: string) => {
    return (
      <Badge tone="neutral" appearance="soft" size="sm" className="font-mono text-[10px] border border-border">
        {codigo}
      </Badge>
    );
  };

  return (
    <WireframeDashboardLayout
      breadcrumbs={
        selectedSolicitud
          ? [
              { label: "Acceso y Seguridad", href: "#" },
              { label: "Gestión de ingresos (DINARP)", href: "/wireframes2/acceso-seguridad/gestion-ingresos" },
              { label: `Trámite ${selectedSolicitud.id}` },
            ]
          : [
              { label: "Acceso y Seguridad", href: "#" },
              { label: "Gestión de ingresos (DINARP)", href: "/wireframes2/acceso-seguridad/gestion-ingresos" },
            ]
      }
    >
      <main className="space-y-6">
        {/* ══════════════════════════════════════════════════════════
            VISTA 1: DETALLE DE SOLICITUD (BREADCRUMB + APROBAR / RECHAZAR)
           ══════════════════════════════════════════════════════════ */}
        {selectedSolicitud ? (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Cabecera de Detalle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedSolicitud(null)}
                  className="h-10 px-4 gap-1.5 text-xs font-semibold rounded-full border-border text-foreground hover:bg-muted"
                >
                  <ArrowLeft className="size-4" />
                  <span>Volver a la bandeja</span>
                </Button>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-foreground">
                      Trámite {selectedSolicitud.id}
                    </h1>
                    <Badge tone="neutral" appearance="soft" size="sm" className="border border-border font-mono">
                      {selectedSolicitud.codigoDocumental}
                    </Badge>
                    {renderEstadoBadge(selectedSolicitud.estado)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {selectedSolicitud.tituloTramite} · Registrado el {selectedSolicitud.fechaSolicitud} · {selectedSolicitud.institucion}
                  </p>
                </div>
              </div>

              {/* Botones de acción en la cabecera (Aprobar o Rechazar) */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                {selectedSolicitud.estado === "Pendiente" ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleOpenReject(selectedSolicitud)}
                      className="h-10 px-4 text-xs font-semibold gap-2 border-border text-foreground hover:bg-muted rounded-full"
                    >
                      <XCircle className="size-4" />
                      <span>Rechazar trámite</span>
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => handleOpenApprove(selectedSolicitud)}
                      className="h-10 px-4 text-xs font-semibold gap-2 shadow-xs"
                    >
                      <CheckCircle2 className="size-4" />
                      <span>Aprobar trámite</span>
                    </Button>
                  </>
                ) : selectedSolicitud.estado === "Aprobada" ? (
                  <Badge tone="neutral" appearance="soft" size="lg" className="gap-1.5 text-xs font-semibold py-1 px-3 border border-border text-foreground">
                    <CheckCircle2 className="size-3.5 text-foreground" />
                    Trámite Aprobado
                  </Badge>
                ) : (
                  <Badge tone="neutral" appearance="outline" size="lg" className="gap-1.5 text-xs font-semibold py-1 px-3 border-border text-foreground bg-background">
                    <XCircle className="size-3.5 text-muted-foreground" />
                    Trámite Rechazado
                  </Badge>
                )}
              </div>
            </div>

            {/* Banners contextuales según estado */}
            {selectedSolicitud.estado === "Aprobada" && (
              <div className="p-4 rounded-2xl bg-muted/40 border border-border text-foreground">
                <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                  <CheckCircle2 className="size-4 shrink-0 text-foreground" />
                  <span>
                    {selectedSolicitud.tipoTramite === "PROCESO_A_REGISTRO_INSTITUCION" && "Institución aprobada: Coordinadores prerregistrados e invitados al Proceso B"}
                    {selectedSolicitud.tipoTramite === "PROCESO_B_ENROLAMIENTO_COORDINADOR" && "Acuerdo de Confidencialidad aprobado: Coordinador institucional ACTIVO"}
                    {selectedSolicitud.tipoTramite === "PROCESO_C_CAMBIO_COORDINADOR" && "Cambio aprobado: Nuevo coordinador prerregistrado e invitado al Proceso B"}
                  </span>
                </div>
                <div className="pt-2 mt-2 border-t border-border/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-muted-foreground">Fecha de resolución: </span>
                    <strong className="text-foreground">{selectedSolicitud.fechaRevision || "Reciente"}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Revisado por: </span>
                    <strong className="text-foreground">{selectedSolicitud.revisor || "Dirección de Gestión y Registro"}</strong>
                  </div>
                </div>
              </div>
            )}

            {selectedSolicitud.estado === "Rechazada" && (
              <div className="p-4 rounded-2xl bg-muted/40 border border-border text-foreground space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                  <XCircle className="size-4 shrink-0 text-muted-foreground" />
                  <span>Trámite Denegado / Observado</span>
                </div>
                <div className="p-3 bg-surface rounded-xl border border-border text-xs">
                  <span className="font-semibold text-foreground block mb-1">
                    Motivo registrado para notificación:
                  </span>
                  <p className="text-foreground leading-relaxed">
                    {selectedSolicitud.motivoRechazo || "No se especificó motivo de rechazo."}
                  </p>
                </div>
                <div className="pt-2 border-t border-border/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-muted-foreground">Fecha de resolución: </span>
                    <strong className="text-foreground">{selectedSolicitud.fechaRevision || "Reciente"}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Revisado por: </span>
                    <strong className="text-foreground">{selectedSolicitud.revisor || "Dirección de Gestión y Registro"}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* ── CUADRÍCULA DE CONTENIDO ESPECÍFICO SEGÚN PROCESO ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Columna Izquierda: Información del Anexo correspondiente (2 cols) */}
              <div className="lg:col-span-2 space-y-6">

                {/* CASO PROCESO A: ANEXO A (ARP-R01) */}
                {selectedSolicitud.anexoA && (
                  <>
                    <div className="rounded-2xl border border-border/80 bg-surface p-5 space-y-4 shadow-2xs">
                      <div className="flex items-center justify-between border-b border-border/60 pb-3">
                        <h2 className="text-sm font-bold font-heading text-foreground flex items-center gap-2">
                          <Building2 className="size-4 text-foreground" />
                          1. Datos de la Entidad y Representante Legal (Anexo A)
                        </h2>
                        <Badge tone="neutral" appearance="soft" size="sm">
                          {selectedSolicitud.anexoA.entidadTipo === "Publica" ? "Pública" : "Privada"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="p-3 rounded-xl bg-muted/30 border border-border/60">
                          <span className="text-muted-foreground text-[11px] block mb-1">Nombre Entidad</span>
                          <span className="font-bold text-foreground text-sm">{selectedSolicitud.anexoA.nombreEntidad}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-muted/30 border border-border/60">
                          <span className="text-muted-foreground text-[11px] block mb-1">RUC Entidad</span>
                          <span className="font-mono font-bold text-foreground text-sm">{selectedSolicitud.anexoA.rucEntidad}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-muted/30 border border-border/60 sm:col-span-2">
                          <span className="text-muted-foreground text-[11px] block mb-1">Dirección</span>
                          <span className="text-foreground font-semibold">{selectedSolicitud.anexoA.direccionEntidad}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-muted/30 border border-border/60 sm:col-span-2">
                          <span className="text-muted-foreground text-[11px] block mb-1">Objeto Social / Actividad</span>
                          <span className="text-foreground">{selectedSolicitud.anexoA.objetoSocial}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-muted/30 border border-border/60">
                          <span className="text-muted-foreground text-[11px] block mb-1">Máxima Autoridad / Delegado</span>
                          <span className="font-bold text-foreground">{selectedSolicitud.anexoA.representanteLegalNombre}</span>
                          <span className="text-[11px] text-muted-foreground block">{selectedSolicitud.anexoA.representanteLegalCargo}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-muted/30 border border-border/60">
                          <span className="text-muted-foreground text-[11px] block mb-1">Delegación Expresa</span>
                          <span className="font-semibold text-foreground">
                            {selectedSolicitud.anexoA.esDelegado ? "Sí (Adjunta soporte)" : "No (Firma Máxima Autoridad)"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Coordinadores Designados para Prerregistro */}
                    <div className="rounded-2xl border border-border/80 bg-surface p-5 space-y-4 shadow-2xs">
                      <div className="flex items-center justify-between border-b border-border/60 pb-3">
                        <h2 className="text-sm font-bold font-heading text-foreground flex items-center gap-2">
                          <User className="size-4 text-foreground" />
                          2. Coordinadores Institucionales Designados (Prerregistro)
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        {/* Titular */}
                        <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                          <div className="flex justify-between items-center pb-1 border-b border-border/60">
                            <span className="font-bold text-foreground">Coordinador TITULAR</span>
                            <Badge tone="neutral" appearance="soft" size="sm">1.2 Anexo A</Badge>
                          </div>
                          <div>
                            <span className="text-[11px] text-muted-foreground block">Nombre y Cédula:</span>
                            <span className="font-semibold text-foreground">{selectedSolicitud.anexoA.titularNombreCompleto}</span>
                            <span className="font-mono block text-muted-foreground">{selectedSolicitud.anexoA.titularCedula}</span>
                          </div>
                          <div>
                            <span className="text-[11px] text-muted-foreground block">Cargo y Área:</span>
                            <span className="text-foreground">{selectedSolicitud.anexoA.titularCargo} · {selectedSolicitud.anexoA.titularAreaUnidad}</span>
                          </div>
                          <div className="text-[11px] text-muted-foreground pt-1 border-t border-border/50">
                            <span>Email: <strong className="text-foreground">{selectedSolicitud.anexoA.titularEmail}</strong></span><br />
                            <span>Teléfono: {selectedSolicitud.anexoA.titularTelefonoFijo} · Móvil: {selectedSolicitud.anexoA.titularMovilInstitucional}</span>
                          </div>
                        </div>

                        {/* Suplente */}
                        <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                          <div className="flex justify-between items-center pb-1 border-b border-border/60">
                            <span className="font-bold text-foreground">Coordinador SUPLENTE</span>
                            <Badge tone="neutral" appearance="soft" size="sm">1.3 Anexo A</Badge>
                          </div>
                          <div>
                            <span className="text-[11px] text-muted-foreground block">Nombre y Cédula:</span>
                            <span className="font-semibold text-foreground">{selectedSolicitud.anexoA.suplenteNombreCompleto}</span>
                            <span className="font-mono block text-muted-foreground">{selectedSolicitud.anexoA.suplenteCedula}</span>
                          </div>
                          <div>
                            <span className="text-[11px] text-muted-foreground block">Cargo y Área:</span>
                            <span className="text-foreground">{selectedSolicitud.anexoA.suplenteCargo} · {selectedSolicitud.anexoA.suplenteAreaUnidad}</span>
                          </div>
                          <div className="text-[11px] text-muted-foreground pt-1 border-t border-border/50">
                            <span>Email: <strong className="text-foreground">{selectedSolicitud.anexoA.suplenteEmail}</strong></span><br />
                            <span>Teléfono: {selectedSolicitud.anexoA.suplenteTelefonoFijo} · Móvil: {selectedSolicitud.anexoA.suplenteMovilInstitucional}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Herramientas y Procesos */}
                    <div className="rounded-2xl border border-border/80 bg-surface p-5 space-y-4 shadow-2xs">
                      <div className="border-b border-border/60 pb-3">
                        <h2 className="text-sm font-bold font-heading text-foreground flex items-center gap-2">
                          <FileCheck2 className="size-4 text-foreground" />
                          3. Sección II: Servicios y Procesos de Uso
                        </h2>
                      </div>
                      <div className="space-y-3 text-xs">
                        <div className="flex flex-wrap gap-2">
                          {selectedSolicitud.anexoA.serviciosHerramientas.map((s) => (
                            <Badge key={s} tone="neutral" appearance="soft" size="sm" className="border border-border">
                              <Check className="size-3 mr-1" />
                              {s}
                            </Badge>
                          ))}
                        </div>
                        <div className="p-3 rounded-xl bg-muted/30 border border-border">
                          <span className="text-muted-foreground text-[11px] block mb-1">Áreas de Aplicación:</span>
                          <span className="text-foreground font-semibold">{selectedSolicitud.anexoA.areasUso}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-muted/30 border border-border">
                          <span className="text-muted-foreground text-[11px] block mb-1">Procesos Institucionales Sustantivos:</span>
                          <p className="text-foreground leading-relaxed">{selectedSolicitud.anexoA.procesosUso}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* CASO PROCESO B: ANEXO B (ARP-R02) */}
                {selectedSolicitud.anexoB && (
                  <>
                    <div className="rounded-2xl border border-border/80 bg-surface p-5 space-y-4 shadow-2xs">
                      <div className="flex items-center justify-between border-b border-border/60 pb-3">
                        <h2 className="text-sm font-bold font-heading text-foreground flex items-center gap-2">
                          <FileSignature className="size-4 text-foreground" />
                          1. Intervinientes del Acuerdo de Confidencialidad (Anexo B)
                        </h2>
                        <Badge tone="neutral" appearance="soft" size="sm">
                          {selectedSolicitud.anexoB.rolAsignado}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="p-3 rounded-xl bg-muted/30 border border-border/60 sm:col-span-2">
                          <span className="text-muted-foreground text-[11px] block mb-1">Entidad Solicitante</span>
                          <span className="font-bold text-foreground text-sm">{selectedSolicitud.anexoB.nombreEntidad}</span>
                          <span className="text-muted-foreground block text-[11px]">{selectedSolicitud.anexoB.domicilioEntidad}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-muted/30 border border-border/60">
                          <span className="text-muted-foreground text-[11px] block mb-1">Representante Legal compareciente</span>
                          <span className="font-semibold text-foreground">{selectedSolicitud.anexoB.representanteLegalNombre}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-muted/30 border border-border/60">
                          <span className="text-muted-foreground text-[11px] block mb-1">Funcionario Compareciente</span>
                          <span className="font-bold text-foreground">{selectedSolicitud.anexoB.funcionarioNombre}</span>
                          <span className="font-mono text-muted-foreground block text-[11px]">{selectedSolicitud.anexoB.funcionarioCedula} · {selectedSolicitud.anexoB.funcionarioCargo}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-muted/30 border border-border/60 sm:col-span-2">
                          <span className="text-muted-foreground text-[11px] block mb-1">Misión y Visión Institucional (Cláusula Segunda)</span>
                          <p className="text-foreground leading-relaxed">{selectedSolicitud.anexoB.misionVisionInstitucional}</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border/80 bg-surface p-5 space-y-4 shadow-2xs">
                      <div className="border-b border-border/60 pb-3">
                        <h2 className="text-sm font-bold font-heading text-foreground flex items-center gap-2">
                          <ShieldCheck className="size-4 text-foreground" />
                          2. Firmas del Instrumento ARP-R02
                        </h2>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="p-3.5 rounded-xl border border-border bg-muted/20">
                          <span className="font-bold text-foreground block">Firma Representante Legal:</span>
                          <Badge tone="neutral" appearance="soft" size="sm" className="mt-1">
                            <Check className="size-3 mr-1" />
                            Firmado Digitalmente
                          </Badge>
                        </div>
                        <div className="p-3.5 rounded-xl border border-border bg-muted/20">
                          <span className="font-bold text-foreground block">Firma del Funcionario:</span>
                          <Badge tone="neutral" appearance="soft" size="sm" className="mt-1">
                            <Check className="size-3 mr-1" />
                            Firmado Digitalmente
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* CASO PROCESO C: ANEXO C (ARP-R03) */}
                {selectedSolicitud.anexoC && (
                  <>
                    <div className="rounded-2xl border border-border/80 bg-surface p-5 space-y-4 shadow-2xs">
                      <div className="flex items-center justify-between border-b border-border/60 pb-3">
                        <h2 className="text-sm font-bold font-heading text-foreground flex items-center gap-2">
                          <Building2 className="size-4 text-foreground" />
                          1. Antecedentes del Cambio de Coordinador (Anexo C)
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="p-3 rounded-xl bg-muted/30 border border-border/60">
                          <span className="text-muted-foreground text-[11px] block mb-1">Entidad</span>
                          <span className="font-bold text-foreground text-sm">{selectedSolicitud.anexoC.nombreEntidad}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-muted/30 border border-border/60">
                          <span className="text-muted-foreground text-[11px] block mb-1">Autoridad Solicitante</span>
                          <span className="font-bold text-foreground">{selectedSolicitud.anexoC.representanteLegalNombre}</span>
                          <span className="text-[11px] text-muted-foreground block">
                            {selectedSolicitud.anexoC.esDelegado ? "Firma bajo Delegación (Soporte adjunto)" : "Máxima Autoridad"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border/80 bg-surface p-5 space-y-4 shadow-2xs">
                      <div className="border-b border-border/60 pb-3">
                        <h2 className="text-sm font-bold font-heading text-foreground flex items-center gap-2">
                          <User className="size-4 text-foreground" />
                          2. Modificaciones Solicitadas (Cláusula Segunda y Tercera)
                        </h2>
                      </div>

                      <div className="space-y-4 text-xs">
                        {selectedSolicitud.anexoC.aplicaCambioTitular && (
                          <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                            <div className="flex justify-between items-center pb-1 border-b border-border/60">
                              <span className="font-bold text-foreground">Nuevo Coordinador Institucional TITULAR</span>
                              <Badge tone="neutral" appearance="soft" size="sm">Cláusula Segunda</Badge>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-[11px] text-muted-foreground block">Nombres y Cédula:</span>
                                <span className="font-semibold text-foreground">{selectedSolicitud.anexoC.nuevoTitularNombre}</span>
                                <span className="font-mono text-muted-foreground block">{selectedSolicitud.anexoC.nuevoTitularCedula}</span>
                              </div>
                              <div>
                                <span className="text-[11px] text-muted-foreground block">Cargo y Correo:</span>
                                <span className="text-foreground">{selectedSolicitud.anexoC.nuevoTitularCargo}</span>
                                <span className="text-muted-foreground block">{selectedSolicitud.anexoC.nuevoTitularEmail}</span>
                              </div>
                              <div className="sm:col-span-2 pt-1 border-t border-border/50">
                                <span className="text-[11px] text-muted-foreground block font-medium">Motivo del Cambio:</span>
                                <p className="text-foreground">{selectedSolicitud.anexoC.nuevoTitularMotivo}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedSolicitud.anexoC.aplicaCambioSuplente && (
                          <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                            <div className="flex justify-between items-center pb-1 border-b border-border/60">
                              <span className="font-bold text-foreground">Nuevo Coordinador Institucional SUPLENTE</span>
                              <Badge tone="neutral" appearance="soft" size="sm">Cláusula Segunda</Badge>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-[11px] text-muted-foreground block">Nombres y Cédula:</span>
                                <span className="font-semibold text-foreground">{selectedSolicitud.anexoC.nuevoSuplenteNombre}</span>
                                <span className="font-mono text-muted-foreground block">{selectedSolicitud.anexoC.nuevoSuplenteCedula}</span>
                              </div>
                              <div>
                                <span className="text-[11px] text-muted-foreground block">Cargo:</span>
                                <span className="text-foreground">{selectedSolicitud.anexoC.nuevoSuplenteCargo}</span>
                              </div>
                              <div className="sm:col-span-2 pt-1 border-t border-border/50">
                                <span className="text-[11px] text-muted-foreground block font-medium">Motivo del Cambio:</span>
                                <p className="text-foreground">{selectedSolicitud.anexoC.nuevoSuplenteMotivo}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedSolicitud.anexoC.aplicaDesignacionInicialSuplente && (
                          <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                            <div className="flex justify-between items-center pb-1 border-b border-border/60">
                              <span className="font-bold text-foreground">Designación INICIAL de Coordinador Suplente</span>
                              <Badge tone="neutral" appearance="soft" size="sm">Cláusula Tercera</Badge>
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                              Aplica porque la entidad no había designado un suplente en el trámite inicial.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                              <div>
                                <span className="text-[11px] text-muted-foreground block">Nombres y Cédula:</span>
                                <span className="font-semibold text-foreground">{selectedSolicitud.anexoC.inicialSuplenteNombre}</span>
                                <span className="font-mono text-muted-foreground block">{selectedSolicitud.anexoC.inicialSuplenteCedula}</span>
                              </div>
                              <div>
                                <span className="text-[11px] text-muted-foreground block">Cargo y Correo:</span>
                                <span className="text-foreground">{selectedSolicitud.anexoC.inicialSuplenteCargo}</span>
                                <span className="text-muted-foreground block">{selectedSolicitud.anexoC.inicialSuplenteEmail}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Documentos Adjuntos y Expediente */}
                <div className="rounded-2xl border border-border/80 bg-surface p-5 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div>
                      <h2 className="text-sm font-bold font-heading text-foreground flex items-center gap-2">
                        <FileText className="size-4 text-foreground" />
                        Expediente Documental Habilitante
                      </h2>
                    </div>
                    <Badge tone="neutral" appearance="soft" size="sm" className="border border-border">
                      {selectedSolicitud.documentos.length} documento(s)
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {selectedSolicitud.documentos.map((docName, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-border/80 bg-muted/20 hover:bg-muted/40 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="size-9 rounded-lg bg-muted text-foreground border border-border flex items-center justify-center shrink-0">
                            <FileText className="size-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="font-mono font-bold text-xs text-foreground truncate block">
                              {docName}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              Firma electrónica verificada · Formato PDF
                            </span>
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setPreviewDoc({
                              titulo: docName,
                              archivo: docName,
                              tamano: "1.2 MB",
                              autoridad: "BCE / Security Data S.A.",
                            })
                          }
                          className="h-8 px-2.5 text-xs font-semibold gap-1.5 shrink-0"
                        >
                          <Eye className="size-3.5" />
                          <span>Ver archivo</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Columna Derecha: Dictamen BPM y Auditoría (1 col) */}
              <div className="space-y-6">
                {selectedSolicitud.estado === "Pendiente" && (
                  <div className="rounded-2xl border border-border/80 bg-surface p-5 space-y-4 shadow-2xs">
                    <h3 className="text-sm font-bold font-heading text-foreground">
                      Resolución DGR (BPM)
                    </h3>

                    <div className="space-y-3">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {selectedSolicitud.tipoTramite === "PROCESO_A_REGISTRO_INSTITUCION" &&
                          "Al aprobar, la institución queda registrada y los coordinadores quedarán PRERREGISTRADOS con envío de invitación a Proceso B."}
                        {selectedSolicitud.tipoTramite === "PROCESO_B_ENROLAMIENTO_COORDINADOR" &&
                          "Al aprobar, el coordinador queda ACTIVO definitivamente para iniciar sesión."}
                        {selectedSolicitud.tipoTramite === "PROCESO_C_CAMBIO_COORDINADOR" &&
                          "Al aprobar, el coordinador saliente se desvincula y el entrante queda PRERREGISTRADO para pasar al Proceso B."}
                      </p>

                      <div className="flex flex-col gap-2.5 pt-1">
                        <Button
                          type="button"
                          variant="primary"
                          onClick={() => handleOpenApprove(selectedSolicitud)}
                          className="w-full font-semibold text-xs h-11 gap-2 shadow-xs"
                        >
                          <CheckCircle2 className="size-4" />
                          <span>Aprobar este trámite</span>
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleOpenReject(selectedSolicitud)}
                          className="w-full border-border text-foreground hover:bg-muted font-semibold text-xs h-11 gap-2 rounded-full"
                        >
                          <XCircle className="size-4" />
                          <span>Rechazar (con observaciones)</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Trazabilidad del trámite */}
                <div className="rounded-2xl border border-border/80 bg-surface p-5 space-y-4 shadow-2xs">
                  <h3 className="text-sm font-bold font-heading text-foreground">
                    Reglas BPM del Trámite
                  </h3>

                  <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-border/60">
                    <div className="relative flex items-start gap-3 text-xs">
                      <span className="size-7 rounded-full bg-muted text-foreground flex items-center justify-center shrink-0 border border-border">
                        <Check className="size-3.5" />
                      </span>
                      <div>
                        <p className="font-bold text-foreground">1. Recepción de Instrumento</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Formulario {selectedSolicitud.codigoDocumental} ingresado el {selectedSolicitud.fechaSolicitud}.
                        </p>
                      </div>
                    </div>

                    <div className="relative flex items-start gap-3 text-xs">
                      <span className="size-7 rounded-full bg-muted text-foreground flex items-center justify-center shrink-0 border border-border">
                        <Check className="size-3.5" />
                      </span>
                      <div>
                        <p className="font-bold text-foreground">2. Verificación de Firmas</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Suscripción electrónica de las partes confirmada.
                        </p>
                      </div>
                    </div>

                    <div className="relative flex items-start gap-3 text-xs">
                      <span className="size-7 rounded-full flex items-center justify-center shrink-0 border border-border bg-muted text-foreground">
                        {selectedSolicitud.estado === "Aprobada" ? (
                          <Check className="size-3.5" />
                        ) : selectedSolicitud.estado === "Rechazada" ? (
                          <XCircle className="size-3.5" />
                        ) : (
                          <Clock className="size-3.5" />
                        )}
                      </span>
                      <div>
                        <p className="font-bold text-foreground">
                          3. Estado: <span className="font-semibold">{selectedSolicitud.estado}</span>
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {selectedSolicitud.estado === "Pendiente"
                            ? "Pendiente de dictamen DGR."
                            : `Resuelto por ${selectedSolicitud.revisor || "DGR"}.`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ══════════════════════════════════════════════════════════
              VISTA 2: LISTADO DE TRÁMITES (FILTROS POR PROCESO + TABLA)
             ══════════════════════════════════════════════════════════ */
          <div className="border border-border/80 rounded-2xl bg-card p-6 sm:p-8 flex flex-col gap-6 shadow-xs">
            {/* ── 1. Encabezado Principal ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge tone="neutral" appearance="soft" size="sm" className="border border-border">
                    Dirección de Gestión y Registro · DINARP
                  </Badge>
                </div>
                <h1 className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight text-foreground">
                  Bandeja de Acceso Institucional y Coordinadores
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed font-normal">
                  Control unificado de Solicitudes de Acceso (Anexo A), Acuerdos de Confidencialidad (Anexo B) y Cambios de Coordinador (Anexo C).
                </p>
              </div>

              <div className="flex items-center gap-2.5 self-start sm:self-auto">
                <Button asChild variant="outline" className="h-11 px-4 text-xs font-semibold gap-1.5 rounded-full border-border/80 bg-surface shadow-xs hover:bg-muted/40">
                  <Link href="/wireframes2/registro-institucion">
                    <span>+ Solicitud Anexo A</span>
                  </Link>
                </Button>
                <Button asChild variant="primary" className="h-11 px-4 text-xs font-semibold gap-1.5 rounded-full shadow-xs">
                  <Link href="/wireframes2/cambio-coordinador">
                    <span>+ Cambio Anexo C</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* ── 2. Pestañas de Proceso BPM ── */}
            <div className="flex flex-wrap gap-2 p-1.5 bg-muted/40 rounded-xl border border-border/80">
              {[
                { id: "TODOS", label: "Todos los Procesos", count: solicitudes.length },
                { id: "PROCESO_A_REGISTRO_INSTITUCION", label: "Proceso A (Registro / ARP-R01)", count: solicitudes.filter(s => s.tipoTramite === "PROCESO_A_REGISTRO_INSTITUCION").length },
                { id: "PROCESO_B_ENROLAMIENTO_COORDINADOR", label: "Proceso B (Enrolamiento / ARP-R02)", count: solicitudes.filter(s => s.tipoTramite === "PROCESO_B_ENROLAMIENTO_COORDINADOR").length },
                { id: "PROCESO_C_CAMBIO_COORDINADOR", label: "Proceso C (Cambio / ARP-R03)", count: solicitudes.filter(s => s.tipoTramite === "PROCESO_C_CAMBIO_COORDINADOR").length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setFilterTramite(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
                    filterTramite === tab.id
                      ? "bg-background text-foreground shadow-xs border border-border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-muted font-mono">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* ── 3. Resumen Superior (KPIs) ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {/* Pendientes */}
              <Card
                variant="featured"
                role="button"
                tabIndex={0}
                onClick={() => {
                  setFilterEstado(filterEstado === "Pendiente" ? "Todos" : "Pendiente");
                  setCurrentPage(1);
                }}
                className={`cursor-pointer transition-all border ${
                  filterEstado === "Pendiente"
                    ? "bg-card border-foreground/50 ring-2 ring-foreground/20 shadow-sm"
                    : "bg-card hover:bg-muted/40 border-border shadow-xs"
                }`}
                innerClassName="p-5 items-start text-left gap-1"
              >
                <span className="font-heading font-extrabold text-3xl sm:text-4xl text-foreground tracking-tight block">
                  {kpis.pendientes}
                </span>
                <span className="text-xs font-semibold text-foreground block">
                  Pendientes
                </span>
                <span className="text-[11px] text-muted-foreground font-normal">
                  por revisar en DGR
                </span>
                <CardDecorativeIcon>
                  <Clock className="size-24 text-muted-foreground" />
                </CardDecorativeIcon>
              </Card>

              {/* Aprobadas */}
              <Card
                variant="featured"
                role="button"
                tabIndex={0}
                onClick={() => {
                  setFilterEstado(filterEstado === "Aprobada" ? "Todos" : "Aprobada");
                  setCurrentPage(1);
                }}
                className={`cursor-pointer transition-all border ${
                  filterEstado === "Aprobada"
                    ? "bg-muted border-foreground ring-2 ring-foreground/20 shadow-sm"
                    : "bg-card hover:bg-muted/40 border-border shadow-xs"
                }`}
                innerClassName="p-5 items-start text-left gap-1"
              >
                <span className="font-heading font-extrabold text-3xl sm:text-4xl text-foreground tracking-tight block">
                  {kpis.aprobadas}
                </span>
                <span className="text-xs font-semibold text-foreground block">
                  Aprobadas
                </span>
                <span className="text-[11px] text-muted-foreground font-normal">
                  resueltas
                </span>
                <CardDecorativeIcon>
                  <CheckCircle2 className="size-24 text-muted-foreground" />
                </CardDecorativeIcon>
              </Card>

              {/* Rechazadas */}
              <Card
                variant="featured"
                role="button"
                tabIndex={0}
                onClick={() => {
                  setFilterEstado(filterEstado === "Rechazada" ? "Todos" : "Rechazada");
                  setCurrentPage(1);
                }}
                className={`cursor-pointer transition-all border ${
                  filterEstado === "Rechazada"
                    ? "bg-muted border-foreground ring-2 ring-foreground/20 shadow-sm"
                    : "bg-card hover:bg-muted/40 border-border shadow-xs"
                }`}
                innerClassName="p-5 items-start text-left gap-1"
              >
                <span className="font-heading font-extrabold text-3xl sm:text-4xl text-foreground tracking-tight block">
                  {kpis.rechazadas}
                </span>
                <span className="text-xs font-semibold text-foreground block">
                  Rechazadas
                </span>
                <span className="text-[11px] text-muted-foreground font-normal">
                  con observaciones
                </span>
                <CardDecorativeIcon>
                  <XCircle className="size-24 text-muted-foreground" />
                </CardDecorativeIcon>
              </Card>
            </div>

            {/* ── 4. Buscador y Filtros ── */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="w-full sm:max-w-md">
                  <Search
                    placeholder="Buscar por cédula, nombre, código, correo o entidad..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    onClear={() => setSearchQuery("")}
                    className="bg-surface rounded-full border-border/80 shadow-xs h-11"
                  />
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-11 px-4 text-xs font-semibold gap-2 border-border/80 bg-surface rounded-full hover:bg-muted/40 shadow-xs w-full sm:w-auto"
                      >
                        <Filter className="size-3.5 text-muted-foreground" />
                        <span>Filtros</span>
                        {(filterEstado !== "Todos" || filterInstitucion !== "Todas" || filterFecha !== "Todas") && (
                          <span className="size-2 rounded-full bg-primary" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 p-2">
                      <div className="flex items-center justify-between px-2 py-1.5">
                        <DropdownMenuLabel className="p-0 text-xs font-semibold">Filtros de tabla</DropdownMenuLabel>
                        {(filterEstado !== "Todos" || filterInstitucion !== "Todas" || filterFecha !== "Todas") && (
                          <button
                            type="button"
                            onClick={() => {
                              setFilterEstado("Todos");
                              setFilterInstitucion("Todas");
                              setFilterFecha("Todas");
                              setCurrentPage(1);
                            }}
                            className="text-[11px] text-primary hover:underline font-medium"
                          >
                            Restablecer
                          </button>
                        )}
                      </div>
                      <DropdownMenuSeparator />

                      <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground px-2 pt-1 uppercase tracking-wider">
                        Estado
                      </DropdownMenuLabel>
                      <DropdownMenuRadioGroup
                        value={filterEstado}
                        onValueChange={(val) => {
                          setFilterEstado(val);
                          setCurrentPage(1);
                        }}
                      >
                        <DropdownMenuRadioItem value="Todos" className="text-xs">
                          Todos los estados
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Pendiente" className="text-xs">
                          Pendiente
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Aprobada" className="text-xs">
                          Aprobada
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Rechazada" className="text-xs">
                          Rechazada
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>

                      <DropdownMenuSeparator />

                      <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground px-2 pt-1 uppercase tracking-wider">
                        Institución
                      </DropdownMenuLabel>
                      <div className="max-h-44 overflow-y-auto">
                        <DropdownMenuRadioGroup
                          value={filterInstitucion}
                          onValueChange={(val) => {
                            setFilterInstitucion(val);
                            setCurrentPage(1);
                          }}
                        >
                          <DropdownMenuRadioItem value="Todas" className="text-xs">
                            Todas las instituciones
                          </DropdownMenuRadioItem>
                          {institucionesList.map((inst) => (
                            <DropdownMenuRadioItem key={inst} value={inst} className="text-xs truncate">
                              {inst}
                            </DropdownMenuRadioItem>
                          ))}
                        </DropdownMenuRadioGroup>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Ordenamiento */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-11 px-4 text-xs font-semibold gap-2 border-border/80 bg-surface rounded-full hover:bg-muted/40 shrink-0 shadow-xs"
                      >
                        <ArrowUpDown className="size-3.5 text-muted-foreground" />
                        <span>Ordenar</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 p-1">
                      <DropdownMenuLabel className="text-xs font-semibold px-2 py-1.5">
                        Criterio
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup
                        value={sortOrder}
                        onValueChange={(val) => setSortOrder(val as any)}
                      >
                        <DropdownMenuRadioItem value="fecha-desc" className="text-xs">
                          Más recientes primero
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="fecha-asc" className="text-xs">
                          Más antiguas primero
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="nombre-asc" className="text-xs">
                          Nombre (A - Z)
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="institucion-asc" className="text-xs">
                          Institución (A - Z)
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="estado-prioridad" className="text-xs">
                          Pendientes primero
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* ── 5. Tabla de Solicitudes y Trámites ── */}
            <div className="rounded-2xl border border-border/80 bg-surface overflow-hidden shadow-2xs">
              <Table className="w-full min-w-[1000px]">
                <TableHeader>
                  <TableRow className="bg-muted/20 hover:bg-muted/20">
                    <TableHead className="w-[10%] min-w-[90px] px-2.5 first:pl-4 font-bold text-xs uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                      ANEXO
                    </TableHead>
                    <TableHead className="w-[12%] min-w-[110px] px-2.5 font-bold text-xs uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                      CÉDULA
                    </TableHead>
                    <TableHead className="w-[20%] min-w-[180px] px-2.5 font-bold text-xs uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                      FUNCIONARIO / SOLICITANTE
                    </TableHead>
                    <TableHead className="w-[22%] min-w-[210px] px-2.5 font-bold text-xs uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                      INSTITUCIÓN
                    </TableHead>
                    <TableHead className="w-[12%] min-w-[130px] px-2.5 font-bold text-xs uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                      FECHA TRÁMITE
                    </TableHead>
                    <TableHead className="w-[12%] min-w-[110px] px-2.5 font-bold text-xs uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                      ESTADO
                    </TableHead>
                    <TableHead className="w-[6%] min-w-[70px] px-2.5 last:pr-4 text-right font-bold text-xs uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                      GESTIÓN
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-center space-y-2">
                          <div className="size-12 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground mb-1">
                            <SearchIcon className="size-6" />
                          </div>
                          <h3 className="font-heading font-bold text-base text-foreground">
                            No hay trámites registrados
                          </h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            No se encontraron trámites que coincidan con los filtros seleccionados.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((row) => (
                      <TableRow
                        key={row.id}
                        className="cursor-pointer transition-colors hover:bg-muted/40"
                        onClick={() => setSelectedSolicitud(row)}
                      >
                        {/* Anexo Código */}
                        <TableCell className="px-2.5 first:pl-4 whitespace-nowrap">
                          {renderTramiteBadge(row.tipoTramite, row.codigoDocumental)}
                        </TableCell>

                        {/* Cédula */}
                        <TableCell className="px-2.5 font-mono text-xs font-semibold text-foreground whitespace-nowrap truncate">
                          {row.cedula}
                        </TableCell>

                        {/* Usuario */}
                        <TableCell className="px-2.5 min-w-0">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="size-8 rounded-full bg-muted text-foreground font-bold text-xs flex items-center justify-center shrink-0 border border-border/80">
                              {row.iniciales}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-foreground text-xs leading-tight truncate">
                                {row.nombreCompleto}
                              </span>
                              <span className="font-mono text-[10px] text-muted-foreground truncate">
                                {row.id} · {row.correo}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        {/* Institución */}
                        <TableCell className="px-2.5 text-muted-foreground text-xs font-medium min-w-0">
                          <span className="truncate block" title={row.institucion}>
                            {row.institucion}
                          </span>
                        </TableCell>

                        {/* Fecha */}
                        <TableCell className="px-2.5 text-muted-foreground font-mono text-xs whitespace-nowrap min-w-0">
                          <span className="block truncate">{row.fechaSolicitud}</span>
                        </TableCell>

                        {/* Estado */}
                        <TableCell className="px-2.5 whitespace-nowrap min-w-0">
                          {renderEstadoBadge(row.estado)}
                        </TableCell>

                        {/* Acciones */}
                        <TableCell className="px-2.5 last:pr-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon-sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedSolicitud(row);
                                  }}
                                  className="size-8 rounded-lg border-border/80 text-foreground hover:bg-muted shadow-2xs"
                                  aria-label={`Ver detalle de trámite ${row.id}`}
                                >
                                  <Eye className="size-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top">Revisar trámite</TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* ── 6. Paginación ── */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
              <p className="text-xs text-muted-foreground font-medium order-2 sm:order-1">
                Mostrando <span className="font-bold text-foreground">{paginatedData.length}</span> de{" "}
                <span className="font-bold text-foreground">{filteredData.length}</span> trámites
              </p>

              {totalPages > 1 && (
                <div className="order-1 sm:order-2">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) setCurrentPage(currentPage - 1);
                          }}
                          className={currentPage <= 1 ? "pointer-events-none opacity-40" : ""}
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            isActive={page === currentPage}
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(page);
                            }}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                          }}
                          className={currentPage >= totalPages ? "pointer-events-none opacity-40" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Modal de Vista Previa de Documento ── */}
        <Dialog open={!!previewDoc} onOpenChange={(open) => !open && setPreviewDoc(null)}>
          <DialogContent className="max-w-md p-6">
            {previewDoc && (
              <>
                <DialogHeader className="space-y-2">
                  <div className="size-10 rounded-full bg-muted text-foreground flex items-center justify-center mb-1 border border-border">
                    <FileText className="size-5" />
                  </div>
                  <DialogTitle className="text-base font-bold text-foreground">
                    {previewDoc.titulo}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    Documento habilitante suscrito remitido en formato PDF.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 py-2 text-xs">
                  <div className="p-3 bg-muted/40 rounded-xl border border-border/70 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Archivo:</span>
                      <span className="font-mono font-bold text-foreground">{previewDoc.archivo}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tamaño:</span>
                      <span className="font-semibold text-foreground">{previewDoc.tamano}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Firma digital:</span>
                      <Badge tone="neutral" appearance="soft" size="sm" className="gap-1 text-[10px] border border-border text-foreground">
                        <Check className="size-2.5" />
                        Válida y Vigente
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Entidad certificadora:</span>
                      <span className="font-semibold text-foreground">{previewDoc.autoridad}</span>
                    </div>
                  </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setPreviewDoc(null)}
                    className="text-xs font-semibold"
                  >
                    Cerrar
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => {
                      toast.success(`Descarga iniciada: ${previewDoc.archivo}`);
                    }}
                    className="text-xs font-semibold gap-1.5"
                  >
                    <Download className="size-3.5" />
                    <span>Descargar PDF</span>
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* ── Modales de Acción (Aprobar y Rechazar) ── */}
        <AprobarSolicitudDialog
          solicitud={solicitudToApprove}
          open={isApproveOpen}
          onOpenChange={setIsApproveOpen}
          onConfirm={handleConfirmApprove}
        />

        <RechazarSolicitudDialog
          solicitud={solicitudToReject}
          open={isRejectOpen}
          onOpenChange={setIsRejectOpen}
          onConfirm={handleConfirmReject}
        />
      </main>
    </WireframeDashboardLayout>
  );
}
