"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  RefreshCw,
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
  AlertCircle,
  UserPlus,
  UserCheck,
  Activity,
  ChevronRight,
  History,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Stepper, type Step } from "@/components/ui/stepper";
import { Card, CardDecorativeIcon } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search } from "@/components/ui/search";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
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
import { cn } from "@/lib/utils";

import { WireframeDashboardLayout } from "../components/wireframe-dashboard-layout";
import { MOCK_USERS_BY_ROLE } from "../catalogo-interoperabilidad/data/catalogo-data";
import { useAuthStore } from "../acceso-seguridad/data/auth-store";
import {
  useSolicitudesIngresoStore,
  getEstadoBadgeProps,
  type SolicitudIngreso,
  type EstadoSolicitudIngreso,
  type TipoTramiteIngreso,
} from "../acceso-seguridad/data/gestion-ingresos-store";
import { AprobarSolicitudDialog } from "./components/aprobar-solicitud-dialog";
import { RechazarSolicitudDialog } from "./components/rechazar-solicitud-dialog";
import { AsignarRevisorDialog } from "./components/asignar-revisor-dialog";

interface FilterComboboxProps {
  label?: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (val: string) => void;
  className?: string;
  groupLabel?: string;
}

function FilterCombobox({
  label,
  placeholder = "Selecciona...",
  options,
  value,
  onChange,
  className,
  groupLabel,
}: FilterComboboxProps) {
  const selectedOption = useMemo(() => {
    return options.find((o) => o.value === value) || null;
  }, [options, value]);

  const [search, setSearch] = useState(selectedOption ? selectedOption.label : "");

  React.useEffect(() => {
    const opt = options.find((o) => o.value === value);
    setSearch(opt ? opt.label : "");
  }, [value, options]);

  const filteredOptions = useMemo(() => {
    if (!search || (selectedOption && search === selectedOption.label)) {
      return options;
    }
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search, selectedOption]);

  const handleValueChange = (val: string | null) => {
    if (val) {
      const opt = options.find((o) => o.value === val);
      onChange(val);
      if (opt) setSearch(opt.label);
    } else {
      const defaultOpt = options[0];
      onChange(defaultOpt ? defaultOpt.value : "");
      setSearch(defaultOpt ? defaultOpt.label : "");
    }
  };

  const handleInputValueChange = (newSearch: string) => {
    const opt = options.find((o) => o.value === newSearch);
    if (opt) {
      setSearch(opt.label);
    } else {
      setSearch(newSearch);
    }
  };

  return (
    <div className={cn("flex flex-col gap-1 min-w-[170px]", className)}>
      {label && (
        <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-left ml-1 truncate">
          {label}
        </label>
      )}
      <Combobox
        value={value}
        onValueChange={handleValueChange}
        inputValue={search}
        onInputValueChange={handleInputValueChange}
      >
        <ComboboxInput
          placeholder={placeholder}
          showClear={value !== options[0]?.value}
          className="h-9 text-xs text-left bg-surface rounded-full border-border/80 px-2 shadow-2xs hover:bg-muted/40 transition-colors w-full"
        />
        <ComboboxContent align="start" className="w-64 max-h-72 overflow-y-auto z-50 text-left rounded-xl">
          <ComboboxList>
            <ComboboxGroup>
              {groupLabel && (
                <ComboboxLabel className="text-left text-[11px] px-3 py-1 font-bold text-muted-foreground">
                  {groupLabel}
                </ComboboxLabel>
              )}
              {filteredOptions.map((opt) => (
                <ComboboxItem key={opt.value} value={opt.value} className="text-xs text-left justify-start py-2 px-3">
                  <span className="truncate text-left w-full">{opt.label}</span>
                </ComboboxItem>
              ))}
            </ComboboxGroup>
            {filteredOptions.length === 0 && (
              <ComboboxEmpty className="text-left text-xs py-2 px-3">No se encontraron opciones.</ComboboxEmpty>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

export default function GestionIngresosPage() {
  const router = useRouter();
  const { activeUser } = useAuthStore();
  const currentUser = activeUser || MOCK_USERS_BY_ROLE.DGR;

  const store = useSolicitudesIngresoStore();
  const {
    solicitudes,
    isLoaded,
    aprobarSolicitud,
    rechazarSolicitud,
    actualizarEstado,
    resetStore,
  } = store;

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
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  // Selected item for full Detail View
  const [selectedSolicitud, setSelectedSolicitud] = useState<SolicitudIngreso | null>(null);
  const [detailTab, setDetailTab] = useState<number>(0);

  // Selection state for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [solicitudesMasivas, setSolicitudesMasivas] = useState<SolicitudIngreso[]>([]);
  const [isAssignMasivoOpen, setIsAssignMasivoOpen] = useState(false);

  // Dialogs for Approve, Reject & Assign
  const [solicitudToApprove, setSolicitudToApprove] = useState<SolicitudIngreso | null>(null);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [solicitudToReject, setSolicitudToReject] = useState<SolicitudIngreso | null>(null);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [solicitudToAssign, setSolicitudToAssign] = useState<SolicitudIngreso | null>(null);
  const [isAssignOpen, setIsAssignOpen] = useState(false);

  const handleSelectSolicitud = (solicitud: SolicitudIngreso) => {
    if (currentUser.role === "EQ_GESTION" || currentUser.role === "EQ_NORMATIVA") {
      store.iniciarRevision(solicitud.id, currentUser.name);
    }
    router.push(`/wireframes2/asignacion-solicitudes/${solicitud.id}`);
  };

  const handleOpenAssign = (solicitud: SolicitudIngreso) => {
    setSolicitudToAssign(solicitud);
    setIsAssignOpen(true);
  };

  const handleConfirmAsignacion = (
    solicitudId: string,
    revisorNombre: string,
    asignadoPor?: string,
    observaciones?: string
  ) => {
    const dir = asignadoPor || currentUser.name;
    if (currentUser.role === "DIR_GESTION") {
      store.asignarRevisorGestion(solicitudId, revisorNombre, dir, observaciones);
    } else if (currentUser.role === "DIR_NORMATIVA") {
      store.asignarRevisorNormatividad(solicitudId, revisorNombre, dir, observaciones);
    }
    toast.success("Revisor asignado exitosamente");
    setSelectedSolicitud(null);
  };

  const handleConfirmAsignacionMasiva = (
    solicitudIds: string[],
    revisorNombre: string,
    asignadoPor?: string,
    observaciones?: string
  ) => {
    const area = currentUser.role === "DIR_NORMATIVA" ? "NORMATIVIDAD" : "GESTION";
    const dir = asignadoPor || (currentUser.role === "DIR_NORMATIVA" ? "Director Área de Normatividad" : "Director Área de Gestión");
    store.asignarRevisorMasivo(solicitudIds, revisorNombre, area, dir, observaciones);
    toast.success(`${solicitudIds.length} solicitudes asignadas exitosamente a ${revisorNombre}`);
    setSelectedIds([]);
    setSolicitudesMasivas([]);
  };

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

  const procesoOptions = useMemo(() => [
    { value: "TODOS", label: "Proceso: Todos" },
    { value: "PROCESO_A_REGISTRO_INSTITUCION", label: "Institución" },
    { value: "PROCESO_B_ENROLAMIENTO_COORDINADOR", label: "Coordinador" },
    { value: "PROCESO_C_CAMBIO_COORDINADOR", label: "Cambio de coordinador" },
  ], []);

  const estadoOptions = useMemo(() => [
    { value: "Todos", label: "Estado: Todos" },
    { value: "SIN_ASIGNAR", label: "Sin Asignar" },
    { value: "ASIGNADOS", label: "Asignados" },
    { value: "EN_REVISION", label: "En Revisión" },
    { value: "PENDIENTE_ASIGNACION_GESTION", label: "Pendiente Asignación" },
    { value: "EN_REVISION_GESTION", label: "En Revisión" },
    { value: "PENDIENTE_ASIGNACION_NORMATIVIDAD", label: "Pendiente Normatividad" },
    { value: "EN_REVISION_NORMATIVIDAD", label: "En Revisión Normatividad" },
    { value: "APROBADO_FINAL", label: "Aprobado Final" },
    { value: "Aprobada", label: "Aprobada" },
    { value: "Rechazada", label: "Rechazada" },
    { value: "Cancelada", label: "Cancelada" },
  ], []);

  const institucionOptions = useMemo(() => [
    { value: "Todas", label: "Institución: Todas" },
    ...institucionesList.map((inst) => ({ value: inst, label: inst })),
  ], [institucionesList]);

  const sortOptions = useMemo(() => [
    { value: "fecha-desc", label: "Ordenar: Más recientes primero" },
    { value: "fecha-asc", label: "Ordenar: Más antiguas primero" },
    { value: "nombre-asc", label: "Ordenar: Nombre (A - Z)" },
    { value: "estado-prioridad", label: "Ordenar: Pendientes primero" },
  ], []);

  const activeSectionTitle = useMemo(() => {
    if (currentUser.role === "DIR_GESTION" || currentUser.role === "DIR_NORMATIVA") {
      return "Asignación de solicitudes de enrolamiento";
    }
    if (currentUser.role === "EQ_GESTION" || currentUser.role === "EQ_NORMATIVA") {
      return "Solicitudes asignadas";
    }
    return "Gestión de ingresos";
  }, [currentUser.role]);

  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery.trim() !== "" ||
      filterTramite !== "TODOS" ||
      filterEstado !== "Todos" ||
      filterInstitucion !== "Todas"
    );
  }, [searchQuery, filterTramite, filterEstado, filterInstitucion]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setFilterTramite("TODOS");
    setFilterEstado("Todos");
    setFilterInstitucion("Todas");
    setCurrentPage(1);
  };

  // KPIs globales por rol
  const dynamicKpis = useMemo(() => {
    return {
      sinAsignar: solicitudes.filter(
        (s) =>
          s.estado === "PENDIENTE_ASIGNACION_GESTION" ||
          s.estado === "PENDIENTE_ASIGNACION_NORMATIVIDAD" ||
          s.estado === "Pendiente"
      ).length,
      enRevision: solicitudes.filter(
        (s) =>
          s.estado === "EN_REVISION_GESTION" ||
          s.estado === "EN_REVISION_NORMATIVIDAD"
      ).length,
      resueltas: solicitudes.filter(
        (s) =>
          s.estado === "Aprobada" ||
          s.estado === "APROBADO_FINAL" ||
          s.estado === "Rechazada" ||
          s.estado === "Cancelada"
      ).length,
    };
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

      // BPM Logic: Filtrar por rol con trazabilidad completa
      if (
        currentUser.role === "DIR_GESTION" &&
        ![
          "PENDIENTE_ASIGNACION_GESTION",
          "EN_REVISION_GESTION",
          "PENDIENTE_ASIGNACION_NORMATIVIDAD",
          "EN_REVISION_NORMATIVIDAD",
          "APROBADO_FINAL",
          "Aprobada",
          "Rechazada",
          "Cancelada",
        ].includes(item.estado)
      )
        return false;

      if (
        currentUser.role === "EQ_GESTION" &&
        ![
          "EN_REVISION_GESTION",
          "PENDIENTE_ASIGNACION_GESTION",
          "PENDIENTE_ASIGNACION_NORMATIVIDAD",
          "EN_REVISION_NORMATIVIDAD",
          "APROBADO_FINAL",
          "Aprobada",
          "Rechazada",
          "Cancelada",
        ].includes(item.estado)
      )
        return false;

      if (
        currentUser.role === "DIR_NORMATIVA" &&
        ![
          "PENDIENTE_ASIGNACION_NORMATIVIDAD",
          "EN_REVISION_NORMATIVIDAD",
          "APROBADO_FINAL",
          "Aprobada",
          "Rechazada",
          "Cancelada",
        ].includes(item.estado)
      )
        return false;

      if (
        currentUser.role === "EQ_NORMATIVA" &&
        ![
          "EN_REVISION_NORMATIVIDAD",
          "APROBADO_FINAL",
          "Aprobada",
          "Rechazada",
          "Cancelada",
        ].includes(item.estado)
      )
        return false;

      const matchesEstado = (() => {
        if (filterEstado === "Todos") return true;
        if (filterEstado === "SIN_ASIGNAR") {
          return (
            item.estado === "PENDIENTE_ASIGNACION_GESTION" ||
            item.estado === "PENDIENTE_ASIGNACION_NORMATIVIDAD" ||
            item.estado === "Pendiente" ||
            (!item.revisorGestion &&
              !item.revisorNormatividad &&
              item.estado !== "Cancelada" &&
              item.estado !== "Rechazada")
          );
        }
        if (filterEstado === "ASIGNADOS") {
          return Boolean(
            (item.revisorGestion || item.revisorNormatividad || item.revisor) &&
            item.estado !== "Cancelada" &&
            item.estado !== "Rechazada"
          );
        }
        if (filterEstado === "EN_REVISION") {
          return (
            item.estado === "EN_REVISION_GESTION" ||
            item.estado === "EN_REVISION_NORMATIVIDAD"
          );
        }
        if (filterEstado === "Aprobada" || filterEstado === "APROBADO_FINAL") {
          return item.estado === "Aprobada" || item.estado === "APROBADO_FINAL";
        }
        return item.estado === filterEstado;
      })();

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
          const priority: Record<string, number> = {
            Pendiente: 1,
            Aprobada: 2,
            Rechazada: 3,
            Cancelada: 4,
          };
          return (priority[a.estado] || 99) - (priority[b.estado] || 99);
        }
        default:
          return 0;
      }
    });

    return result;
  }, [solicitudes, filterTramite, searchQuery, filterEstado, filterInstitucion, filterFecha, sortOrder, currentUser.role]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

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
            {
              label: activeSectionTitle,
              onClick: (e: React.MouseEvent) => {
                e.preventDefault();
                setSelectedSolicitud(null);
              },
            },
            { label: `Trámite ${selectedSolicitud.id}` },
          ]
          : [
            { label: activeSectionTitle },
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
                  className="h-10 px-4 gap-1.5 text-xs font-semibold rounded-lg border-border text-foreground hover:bg-muted"
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

              {/* Botones de acción en la cabecera */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                {(currentUser.role === "DIR_GESTION" && selectedSolicitud.estado === "PENDIENTE_ASIGNACION_GESTION") ||
                  (currentUser.role === "DIR_NORMATIVA" && selectedSolicitud.estado === "PENDIENTE_ASIGNACION_NORMATIVIDAD") ? (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => handleOpenAssign(selectedSolicitud)}
                    className="h-10 px-4 text-xs font-semibold gap-2 shadow-xs"
                  >
                    <UserPlus className="size-4" />
                    <span>Asignar revisor</span>
                  </Button>
                ) : (currentUser.role === "EQ_GESTION" && selectedSolicitud.estado === "EN_REVISION_GESTION") ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleOpenReject(selectedSolicitud)}
                      className="h-10 px-4 text-xs font-semibold gap-2 border-border text-foreground hover:bg-muted rounded-lg"
                    >
                      <XCircle className="size-4" />
                      <span>Registrar observaciones / Devolver</span>
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => {
                        store.aprobarGestion(selectedSolicitud.id, currentUser.name);
                        toast.success("Trámite aprobado por Gestión y enviado a Normatividad");
                        setSelectedSolicitud(null);
                      }}
                      className="h-10 px-4 text-xs font-semibold gap-2 shadow-xs"
                    >
                      <CheckCircle2 className="size-4" />
                      <span>Aprobar revisión</span>
                    </Button>
                  </>
                ) : (currentUser.role === "EQ_NORMATIVA" && selectedSolicitud.estado === "EN_REVISION_NORMATIVIDAD") ? (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => {
                      store.aprobarNormatividad(selectedSolicitud.id, currentUser.name, "RES-DINARP-2026-001");
                      toast.success("Resolución generada. Trámite finalizado exitosamente.");
                      setSelectedSolicitud(null);
                    }}
                    className="h-10 px-4 text-xs font-semibold gap-2 shadow-xs"
                  >
                    <FileSignature className="size-4" />
                    <span>Generar resolución y finalizar</span>
                  </Button>
                ) : selectedSolicitud.estado === "Cancelada" ? (
                  <Badge tone="danger" appearance="soft" size="md" className="font-semibold py-1.5 px-3">
                    <AlertCircle className="size-3.5 mr-1 text-danger" />
                    Expediente Cerrado
                  </Badge>
                ) : (
                  <Badge tone="neutral" appearance="soft" size="lg" className="gap-1.5 text-xs font-semibold py-1 px-3 border border-border text-foreground">
                    <CheckCircle2 className="size-3.5 text-foreground" />
                    {selectedSolicitud.estado.replace(/_/g, " ")}
                  </Badge>
                )}
              </div>
            </div>

            {/* Banners contextuales según estado */}
            {selectedSolicitud.estado === "Cancelada" && (
              <div className="p-5 rounded-2xl bg-danger-100/30 dark:bg-danger-900/20 border border-danger/40 text-foreground space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-danger/20 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-full bg-danger/10 border border-danger/30 flex items-center justify-center shrink-0">
                      <AlertCircle className="size-4 text-danger" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold font-heading text-danger">
                        Trámite Cancelado y Expediente Cerrado Definitivamente
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Este expediente no superó la revisión técnica obligatoria del Área de Gestión.
                      </p>
                    </div>
                  </div>
                  <Badge tone="danger" appearance="soft" size="md" className="font-semibold border-danger/40">
                    Cierre Definitivo
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-surface rounded-xl border border-border space-y-1">
                    <span className="font-bold text-foreground flex items-center gap-1.5 text-danger">
                      <XCircle className="size-3.5 text-danger shrink-0" />
                      Motivo de la Cancelación (Revisión No Conforme):
                    </span>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      {selectedSolicitud.motivoRechazo || "Se identificaron observaciones insubsanables en la documentación y firmas digitales registradas."}
                    </p>
                  </div>

                  <div className="p-3.5 bg-surface rounded-xl border border-border space-y-1">
                    <span className="font-bold text-foreground flex items-center gap-1.5 text-primary">
                      <RotateCcw className="size-3.5 text-primary shrink-0" />
                      Acción Requerida para la Institución:
                    </span>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      El trámite se encuentra cerrado. La institución requirente debe <strong>volver a realizar y enviar una nueva solicitud de registro de institución (Anexo A)</strong> desde cero a través del portal, adjuntando la documentación vigente y la firma electrónica debidamente validada.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-danger/20 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>Fecha de cancelación y cierre: <strong className="text-foreground">{selectedSolicitud.fechaRevision || "20/09/2026 16:45"}</strong></span>
                    <span>Revisor responsable: <strong className="text-foreground">{selectedSolicitud.revisor || "Ana Torres (Área de Gestión)"}</strong></span>
                  </div>
                  <span className="font-semibold text-danger">Estado BPM: Cancelada (Cierre de ciclo)</span>
                </div>
              </div>
            )}
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

            {/* ── NAVEGACIÓN POR PASOS / TABS (ESTRUCTURA REGISTRO-INSTITUCION) ── */}
            <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs">
              <Stepper
                steps={[
                  { id: "1", title: "1. Entidad y Autoridad", description: "Datos institucionales y delegación", icon: Building2 },
                  { id: "2", title: "2. Coordinadores", description: "Titular y suplente asignados", icon: User },
                  { id: "3", title: "3. Servicios y Procesos", description: "Herramientas y áreas de uso", icon: FileText },
                  { id: "4", title: "4. Documentación", description: "Expediente y firma digital", icon: ShieldCheck },
                  { id: "5", title: "5. Historial y Reglas BPM", description: "Trazabilidad completa", icon: History },
                ]}
                activeStep={detailTab}
                onStepClick={(index) => setDetailTab(index)}
              />
            </div>

            {/* ── PASO 0: ENTIDAD Y AUTORIDAD COMPARECIENTE ── */}
            {detailTab === 0 && (
              <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-border/80 pb-4">
                  <div>
                    <Badge tone="neutral" appearance="soft" size="sm" className="border border-border mb-1">
                      Formulario {selectedSolicitud.codigoDocumental} · Paso 1
                    </Badge>
                    <h2 className="text-lg font-bold font-heading text-foreground">
                      1. Datos de la Entidad y Representante Legal
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Información legal e institucional enviada por el solicitante en el registro.
                    </p>
                  </div>
                  <Badge tone="neutral" appearance="soft" size="md" className="font-semibold">
                    {selectedSolicitud.anexoA?.entidadTipo === "Publica" ? "Entidad Pública" : "Entidad Privada"}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Tipo de Entidad</Label>
                    <Input
                      value={selectedSolicitud.anexoA?.entidadTipo === "Publica" ? "Pública" : "Privada"}
                      disabled
                      className="bg-muted/40 cursor-not-allowed font-medium text-xs text-foreground"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Número de RUC</Label>
                    <Input
                      value={selectedSolicitud.anexoA?.rucEntidad || "1768000000001"}
                      disabled
                      className="bg-muted/40 cursor-not-allowed font-mono text-xs text-foreground"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Nombre / Razón Social de la Entidad</Label>
                    <Input
                      value={selectedSolicitud.anexoA?.nombreEntidad || selectedSolicitud.institucion}
                      disabled
                      className="bg-muted/40 cursor-not-allowed font-bold text-xs text-foreground"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Dirección Domiciliaria Institucional</Label>
                    <Input
                      value={selectedSolicitud.anexoA?.direccionEntidad || "Av. Amazonas N24-15 y Luis Cordero, Quito, Ecuador"}
                      disabled
                      className="bg-muted/40 cursor-not-allowed text-xs text-foreground"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Objeto Social / Actividad Institucional Sustantiva</Label>
                    <Textarea
                      value={selectedSolicitud.anexoA?.objetoSocial || "Entidad pública encargada de brindar servicios interoperables y gestionar registros conforme Ley Orgánica de Registro de Datos Públicos."}
                      disabled
                      rows={3}
                      className="bg-muted/40 cursor-not-allowed text-xs leading-relaxed text-foreground"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Máxima Autoridad / Compareciente</Label>
                    <Input
                      value={selectedSolicitud.anexoA?.representanteLegalNombre || selectedSolicitud.nombreCompleto}
                      disabled
                      className="bg-muted/40 cursor-not-allowed font-semibold text-xs text-foreground"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Cargo Oficial de la Autoridad</Label>
                    <Input
                      value={selectedSolicitud.anexoA?.representanteLegalCargo || "Director Ejecutivo / Máxima Autoridad"}
                      disabled
                      className="bg-muted/40 cursor-not-allowed text-xs text-foreground"
                    />
                  </div>

                  <div className="sm:col-span-2 p-4 rounded-xl border border-border bg-muted/20 flex items-center gap-3">
                    <Checkbox checked={selectedSolicitud.anexoA?.esDelegado || false} disabled />
                    <div>
                      <Label className="text-xs font-semibold text-foreground block">
                        Firma en Calidad de Delegado Oficial
                      </Label>
                      <span className="text-[11px] text-muted-foreground">
                        {selectedSolicitud.anexoA?.esDelegado
                          ? "Suscrito bajo Resolución de Delegación / Acción de Personal (Documento habilitante adjunto en Paso 4)."
                          : "Suscrito directamente por la Máxima Autoridad Institucional."}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── PASO 1: COORDINADORES INSTITUCIONALES ── */}
            {detailTab === 1 && (
              <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs animate-in fade-in duration-200">
                <div className="border-b border-border/80 pb-4">
                  <Badge tone="neutral" appearance="soft" size="sm" className="border border-border mb-1">
                    Formulario {selectedSolicitud.codigoDocumental} · Paso 2
                  </Badge>
                  <h2 className="text-lg font-bold font-heading text-foreground">
                    2. Coordinadores Institucionales Designados
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Personal autorizado para la gestión operativa y administración de usuarios.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Coordinador Titular */}
                  <div className="p-5 rounded-2xl border border-border bg-muted/10 space-y-4">
                    <div className="flex items-center justify-between border-b border-border/80 pb-3">
                      <div className="flex items-center gap-2">
                        <User className="size-4 text-foreground" />
                        <h3 className="text-sm font-bold font-heading text-foreground">Coordinador TITULAR</h3>
                      </div>
                      <Badge tone="neutral" appearance="soft" size="sm">Anexo A · 1.2</Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label className="text-[11px] font-semibold text-foreground">Nombres Completos</Label>
                        <Input value={selectedSolicitud.anexoA?.titularNombreCompleto || selectedSolicitud.nombreCompleto} disabled className="bg-muted/40 cursor-not-allowed font-semibold text-xs text-foreground" />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-[11px] font-semibold text-foreground">Número de Cédula</Label>
                          <Input value={selectedSolicitud.anexoA?.titularCedula || selectedSolicitud.cedula} disabled className="bg-muted/40 cursor-not-allowed font-mono text-xs text-foreground" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[11px] font-semibold text-foreground">Cargo Institucional</Label>
                          <Input value={selectedSolicitud.anexoA?.titularCargo || "Director de Tecnología"} disabled className="bg-muted/40 cursor-not-allowed text-xs text-foreground" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-[11px] font-semibold text-foreground">Área / Unidad Administrativa</Label>
                        <Input value={selectedSolicitud.anexoA?.titularAreaUnidad || "Dirección de Tecnología de la Información"} disabled className="bg-muted/40 cursor-not-allowed text-xs text-foreground" />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-[11px] font-semibold text-foreground">Correo Electrónico Institucional</Label>
                        <Input value={selectedSolicitud.anexoA?.titularEmail || selectedSolicitud.correo} disabled className="bg-muted/40 cursor-not-allowed text-xs text-foreground" />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-[11px] font-semibold text-foreground">Teléfono Fijo</Label>
                          <Input value={selectedSolicitud.anexoA?.titularTelefonoFijo || "022345678"} disabled className="bg-muted/40 cursor-not-allowed text-xs text-foreground" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[11px] font-semibold text-foreground">Celular Institucional</Label>
                          <Input value={selectedSolicitud.anexoA?.titularMovilInstitucional || "0991234567"} disabled className="bg-muted/40 cursor-not-allowed text-xs text-foreground" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Coordinador Suplente */}
                  <div className="p-5 rounded-2xl border border-border bg-muted/10 space-y-4">
                    <div className="flex items-center justify-between border-b border-border/80 pb-3">
                      <div className="flex items-center gap-2">
                        <User className="size-4 text-foreground" />
                        <h3 className="text-sm font-bold font-heading text-foreground">Coordinador SUPLENTE</h3>
                      </div>
                      <Badge tone="neutral" appearance="soft" size="sm">Anexo A · 1.3</Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label className="text-[11px] font-semibold text-foreground">Nombres Completos</Label>
                        <Input value={selectedSolicitud.anexoA?.suplenteNombreCompleto || "Carlos Andrés Mendoza"} disabled className="bg-muted/40 cursor-not-allowed font-semibold text-xs text-foreground" />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-[11px] font-semibold text-foreground">Número de Cédula</Label>
                          <Input value={selectedSolicitud.anexoA?.suplenteCedula || "1712345678"} disabled className="bg-muted/40 cursor-not-allowed font-mono text-xs text-foreground" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[11px] font-semibold text-foreground">Cargo Institucional</Label>
                          <Input value={selectedSolicitud.anexoA?.suplenteCargo || "Subdirector TI"} disabled className="bg-muted/40 cursor-not-allowed text-xs text-foreground" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-[11px] font-semibold text-foreground">Área / Unidad Administrativa</Label>
                        <Input value={selectedSolicitud.anexoA?.suplenteAreaUnidad || "Dirección de Tecnología"} disabled className="bg-muted/40 cursor-not-allowed text-xs text-foreground" />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-[11px] font-semibold text-foreground">Correo Electrónico Institucional</Label>
                        <Input value={selectedSolicitud.anexoA?.suplenteEmail || "suplente@institucion.gob.ec"} disabled className="bg-muted/40 cursor-not-allowed text-xs text-foreground" />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-[11px] font-semibold text-foreground">Teléfono Fijo</Label>
                          <Input value={selectedSolicitud.anexoA?.suplenteTelefonoFijo || "022345679"} disabled className="bg-muted/40 cursor-not-allowed text-xs text-foreground" />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[11px] font-semibold text-foreground">Celular Institucional</Label>
                          <Input value={selectedSolicitud.anexoA?.suplenteMovilInstitucional || "0998765432"} disabled className="bg-muted/40 cursor-not-allowed text-xs text-foreground" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── PASO 2: SERVICIOS Y PROCESOS DE USO ── */}
            {detailTab === 2 && (
              <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs animate-in fade-in duration-200">
                <div className="border-b border-border/80 pb-4">
                  <Badge tone="neutral" appearance="soft" size="sm" className="border border-border mb-1">
                    Formulario {selectedSolicitud.codigoDocumental} · Paso 3
                  </Badge>
                  <h2 className="text-lg font-bold font-heading text-foreground">
                    3. Sección II: Servicios y Herramientas Solicitadas
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Sistemas, módulos y propósitos de uso declarados para la interoperabilidad.
                  </p>
                </div>

                <div className="space-y-4">
                  <Label className="text-xs font-semibold text-foreground block">
                    Servicios y Plataformas Requeridas
                  </Label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      "Módulo de Consultas en Línea (SINARP)",
                      "Ficha Simplificada de Ciudadano",
                      "Consumo de Servicios Web / API REST",
                      "Plataforma de Interoperabilidad Financiera",
                    ].map((servicio) => {
                      const isChecked = selectedSolicitud.anexoA?.serviciosHerramientas?.includes(servicio) ?? true;
                      return (
                        <div key={servicio} className="p-3.5 rounded-xl border border-border bg-muted/20 flex items-center gap-3">
                          <Checkbox checked={isChecked} disabled />
                          <span className="text-xs font-semibold text-foreground">{servicio}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <Label className="text-xs font-semibold text-foreground">Áreas de Aplicación en la Entidad</Label>
                    <Input
                      value={selectedSolicitud.anexoA?.areasUso || "Atención Ciudadana, Ventanilla Única y Validación de Requisitos Ley Registro Datos Públicos."}
                      disabled
                      className="bg-muted/40 cursor-not-allowed text-xs text-foreground"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Procesos Institucionales Sustantivos</Label>
                    <Textarea
                      value={selectedSolicitud.anexoA?.procesosUso || "Verificación automática de solvencia legal e identidad del solicitante para tramitación de autorizaciones estatales."}
                      disabled
                      rows={3}
                      className="bg-muted/40 cursor-not-allowed text-xs leading-relaxed text-foreground"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── PASO 3: DOCUMENTACIÓN ADJUNTA Y FIRMA ── */}
            {detailTab === 3 && (
              <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs animate-in fade-in duration-200">
                <div className="border-b border-border/80 pb-4">
                  <Badge tone="neutral" appearance="soft" size="sm" className="border border-border mb-1">
                    Formulario {selectedSolicitud.codigoDocumental} · Paso 4
                  </Badge>
                  <h2 className="text-lg font-bold font-heading text-foreground">
                    4. Expediente Habilitante y Certificación Digital
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Documentos cargados por el usuario y firmas electrónicas registradas.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-muted/20 border border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-surface border border-border flex items-center justify-center text-foreground font-bold">
                        <ShieldCheck className="size-5" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-foreground">Certificado Digital de Firma Electrónica</h3>
                        <p className="text-[11px] text-muted-foreground">Firma verificada mediante infraestructura PKI - Banco Central del Ecuador / Security Data S.A.</p>
                      </div>
                    </div>
                    <Badge tone="neutral" appearance="soft" size="sm" className="border border-border font-semibold">
                      Firma Válida
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs font-semibold text-foreground block">Archivos del Expediente ({selectedSolicitud.documentos.length})</Label>
                    {selectedSolicitud.documentos.map((docName, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl border border-border/80 bg-muted/20 hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <FileText className="size-4 text-foreground" />
                          <div>
                            <span className="font-mono font-bold text-xs text-foreground block">{docName}</span>
                            <span className="text-[11px] text-muted-foreground">Verificación de firma aprobada · Formato PDF</span>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setPreviewDoc({ titulo: docName, archivo: docName, tamano: "1.2 MB", autoridad: "BCE / Security Data" })}
                          className="h-8 px-3 text-xs font-semibold gap-1.5"
                        >
                          <Eye className="size-3.5" />
                          <span>Ver archivo</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── PASO 4: HISTORIAL COMPLETO Y REGLAS BPM DEL TRÁMITE ── */}
            {detailTab === 4 && (
              <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs animate-in fade-in duration-200">
                <div className="border-b border-border/80 pb-4">
                  <Badge tone="neutral" appearance="soft" size="sm" className="border border-border mb-1">
                    Trámite {selectedSolicitud.id} · Trazabilidad
                  </Badge>
                  <h2 className="text-lg font-bold font-heading text-foreground">
                    5. Historial del Trámite y Reglas BPM
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Cronología en tiempo real de cada acción realizada en el flujo de aprobación.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Cronología Completa (2 cols) */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <History className="size-4 text-foreground" />
                      Cronología Registrada
                    </h3>

                    <div className="space-y-3">
                      {selectedSolicitud.historial && selectedSolicitud.historial.length > 0 ? (
                        selectedSolicitud.historial.map((h, i) => {
                          const isDanger =
                            h.accion.toLowerCase().includes("cancel") ||
                            h.accion.toLowerCase().includes("rechaz") ||
                            h.accion.toLowerCase().includes("cierr");
                          const isSuccess =
                            h.accion.toLowerCase().includes("aprob") ||
                            h.accion.toLowerCase().includes("resoluci");

                          return (
                            <div
                              key={i}
                              className={cn(
                                "p-4 rounded-xl border space-y-1.5",
                                isDanger
                                  ? "bg-danger-100/25 dark:bg-danger-900/15 border-danger/40"
                                  : isSuccess
                                    ? "bg-success-100/25 dark:bg-success-900/15 border-success/40"
                                    : "border-border bg-muted/20"
                              )}
                            >
                              <div className="flex items-center justify-between font-bold text-xs">
                                <span className={cn(isDanger ? "text-danger" : isSuccess ? "text-success" : "text-foreground")}>
                                  {h.accion}
                                </span>
                                <span className="font-mono text-[11px] text-muted-foreground">{h.fechaHora}</span>
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed">{h.detalles}</p>
                              <span className="text-[11px] font-semibold text-foreground block pt-1 border-t border-border/50">
                                Realizado por: {h.realizadoPor}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                          <div className="flex items-center justify-between font-bold text-xs text-foreground">
                            <span>Solicitud recibida</span>
                            <span className="font-mono text-[11px] text-muted-foreground">{selectedSolicitud.fechaSolicitud}</span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Formulario {selectedSolicitud.codigoDocumental} ingresado mediante el Portal DINARP.
                          </p>
                          <span className="text-[11px] font-semibold text-foreground block pt-1 border-t border-border/50">
                            Realizado por: {selectedSolicitud.nombreCompleto} (Solicitante)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Reglas BPM y Trazabilidad (1 col) */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Activity className="size-4 text-foreground" />
                      Reglas BPM del Trámite
                    </h3>

                    <div className="p-4 rounded-2xl border border-border bg-muted/20 space-y-3 text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[11px]">N.º de Trámite Unificado:</span>
                        <strong className="font-mono text-foreground text-sm">{selectedSolicitud.id}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Estado Actual BPM:</span>
                        <strong className="text-foreground">{getEstadoBadgeProps(selectedSolicitud.estado).label}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Revisor de Gestión:</span>
                        <strong className="text-foreground">{selectedSolicitud.revisorGestion || selectedSolicitud.revisor || "Sin asignar"}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Revisor de Normatividad:</span>
                        <strong className="text-foreground">{selectedSolicitud.revisorNormatividad || "Pendiente"}</strong>
                      </div>

                      <div className="pt-2 border-t border-border/60">
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          El historial se conserva durante todo el ciclo de vida del trámite con persistencia automática en el almacén de la simulación.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ══════════════════════════════════════════════════════════
              VISTA 2: LISTADO DE TRÁMITES (FILTROS POR PROCESO + TABLA)
             ══════════════════════════════════════════════════════════ */
          <Card className="bg-surface rounded-2xl border border-border shadow-xs p-6 sm:p-8 flex flex-col gap-6">
            {/* ── 1. Encabezado Principal ── */}
            {(() => {
              const isDirGestion = currentUser.role === "DIR_GESTION";
              const isEqGestion = currentUser.role === "EQ_GESTION";
              const isDirNormativa = currentUser.role === "DIR_NORMATIVA";
              const isEqNormativa = currentUser.role === "EQ_NORMATIVA";

              let badgeText = "Dirección de Gestión y Registro · DINARP";
              let titleText = "Asignación de solicitudes de enrolamiento";
              let subtitleText = "Gestiona la asignación de solicitudes de enrolamiento institucional y coordinadores a los revisores del área de gestión.";

              if (isEqGestion) {
                badgeText = "Equipo de Gestión y Registro · DINARP";
                titleText = "Bandeja de Solicitudes Asignadas";
                subtitleText = "Revisión y validación documental de solicitudes de enrolamiento asignadas a tu usuario.";
              } else if (isDirNormativa) {
                badgeText = "Dirección de Normatividad · DINARP";
                titleText = "Asignación de solicitudes de enrolamiento";
                subtitleText = "Gestiona la asignación de solicitudes de enrolamiento institucional y coordinadores a los revisores del equipo de normatividad.";
              } else if (isEqNormativa) {
                badgeText = "Equipo de Normatividad · DINARP";
                titleText = "Bandeja de Solicitudes Asignadas - Normatividad";
                subtitleText = "Análisis normativo y resolución jurídica de solicitudes de enrolamiento asignadas a tu usuario.";
              } else if (isDirGestion) {
                badgeText = "Dirección de Gestión y Registro · DINARP";
                titleText = "Asignación de solicitudes de enrolamiento";
                subtitleText = "Gestiona la asignación de solicitudes de enrolamiento institucional y coordinadores a los revisores del área de gestión.";
              }

              return (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 w-full">
                    <div className="flex items-center gap-2">
                      <Badge tone="neutral" appearance="soft" size="sm" className="border border-border">
                        {badgeText}
                      </Badge>
                    </div>
                    <h1 className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight text-primary">
                      {titleText}
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground w-full max-w-none leading-relaxed font-normal">
                      {subtitleText}
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* ── 2. Resumen Superior (Tarjetas Interactivas Anchas con Hover y Navegación) ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 w-full">
              {/* Card 1: Sin Asignar / Pendientes */}
              <Card
                variant="featured"
                role="button"
                tabIndex={0}
                onClick={() => {
                  setFilterEstado(filterEstado === "SIN_ASIGNAR" ? "Todos" : "SIN_ASIGNAR");
                  setCurrentPage(1);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setFilterEstado(filterEstado === "SIN_ASIGNAR" ? "Todos" : "SIN_ASIGNAR");
                    setCurrentPage(1);
                  }
                }}
                className={cn(
                  "group relative overflow-hidden cursor-pointer transition-all duration-300 border rounded-2xl outline-none select-none p-6 lg:p-7 w-full min-h-[170px]",
                  "hover:-translate-y-1 hover:shadow-lg",
                  filterEstado === "SIN_ASIGNAR"
                    ? "bg-warning/15 border-warning ring-2 ring-warning/40 shadow-sm"
                    : "bg-warning/5 hover:bg-warning/10 border-warning/30 shadow-2xs"
                )}
                innerClassName="p-0 gap-4 text-left h-full justify-between"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-heading font-extrabold text-4xl lg:text-5xl text-foreground tracking-tight">
                    {dynamicKpis.sinAsignar}
                  </span>
                  <Badge tone="warning" appearance="soft" size="sm" className="font-bold text-xs tracking-wider uppercase gap-1.5 px-3 py-1">
                    <Clock className="size-3.5 shrink-0" />
                    <span>SIN ASIGNAR</span>
                  </Badge>
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-foreground block group-hover:text-warning transition-colors">
                    Solicitudes Pendientes
                  </h3>
                  <p className="text-xs text-muted-foreground font-normal block leading-relaxed">
                    esperando asignación de revisor
                  </p>
                </div>
                <div className="w-full pt-3 border-t border-warning/20 flex items-center justify-between text-xs font-semibold text-warning group-hover:text-warning">
                  <span>{filterEstado === "SIN_ASIGNAR" ? "Filtro activo (clic para quitar)" : "Filtrar por sin asignar"}</span>
                  <ChevronRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
                <CardDecorativeIcon>
                  <Clock className="size-28 text-warning/15 group-hover:text-warning/25 transition-colors" />
                </CardDecorativeIcon>
              </Card>

              {/* Card 2: En Revisión / Asignadas */}
              <Card
                variant="featured"
                role="button"
                tabIndex={0}
                onClick={() => {
                  setFilterEstado(filterEstado === "EN_REVISION" ? "Todos" : "EN_REVISION");
                  setCurrentPage(1);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setFilterEstado(filterEstado === "EN_REVISION" ? "Todos" : "EN_REVISION");
                    setCurrentPage(1);
                  }
                }}
                className={cn(
                  "group relative overflow-hidden cursor-pointer transition-all duration-300 border rounded-2xl outline-none select-none p-6 lg:p-7 w-full min-h-[170px]",
                  "hover:-translate-y-1 hover:shadow-lg",
                  filterEstado === "EN_REVISION"
                    ? "bg-primary/15 border-primary ring-2 ring-primary/40 shadow-sm"
                    : "bg-primary/5 hover:bg-primary/10 border-primary/30 shadow-2xs"
                )}
                innerClassName="p-0 gap-4 text-left h-full justify-between"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-heading font-extrabold text-4xl lg:text-5xl text-primary tracking-tight">
                    {dynamicKpis.enRevision}
                  </span>
                  <Badge tone="primary" appearance="soft" size="sm" className="font-bold text-xs tracking-wider uppercase gap-1.5 px-3 py-1">
                    <Activity className="size-3.5 shrink-0" />
                    <span>EN REVISIÓN</span>
                  </Badge>
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-foreground block group-hover:text-primary transition-colors">
                    Solicitudes Asignadas
                  </h3>
                  <p className="text-xs text-muted-foreground font-normal block leading-relaxed">
                    en análisis activo por el equipo
                  </p>
                </div>
                <div className="w-full pt-3 border-t border-primary/20 flex items-center justify-between text-xs font-semibold text-primary group-hover:text-primary">
                  <span>{filterEstado === "EN_REVISION" ? "Filtro activo (clic para quitar)" : "Filtrar por en revisión"}</span>
                  <ChevronRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
                <CardDecorativeIcon>
                  <Activity className="size-28 text-primary/15 group-hover:text-primary/25 transition-colors" />
                </CardDecorativeIcon>
              </Card>

              {/* Card 3: Resueltas / Aprobadas */}
              <Card
                variant="featured"
                role="button"
                tabIndex={0}
                onClick={() => {
                  setFilterEstado(filterEstado === "Aprobada" ? "Todos" : "Aprobada");
                  setCurrentPage(1);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setFilterEstado(filterEstado === "Aprobada" ? "Todos" : "Aprobada");
                    setCurrentPage(1);
                  }
                }}
                className={cn(
                  "group relative overflow-hidden cursor-pointer transition-all duration-300 border rounded-2xl outline-none select-none p-6 lg:p-7 w-full min-h-[170px]",
                  "hover:-translate-y-1 hover:shadow-lg",
                  filterEstado === "Aprobada"
                    ? "bg-success/15 border-success ring-2 ring-success/40 shadow-sm"
                    : "bg-success/5 hover:bg-success/10 border-success/30 shadow-2xs"
                )}
                innerClassName="p-0 gap-4 text-left h-full justify-between"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-heading font-extrabold text-4xl lg:text-5xl text-foreground tracking-tight">
                    {dynamicKpis.resueltas}
                  </span>
                  <Badge tone="success" appearance="soft" size="sm" className="font-bold text-xs tracking-wider uppercase gap-1.5 px-3 py-1">
                    <CheckCircle2 className="size-3.5 shrink-0" />
                    <span>RESUELTAS</span>
                  </Badge>
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-foreground block group-hover:text-success transition-colors">
                    Solicitudes Finalizadas
                  </h3>
                  <p className="text-xs text-muted-foreground font-normal block leading-relaxed">
                    aprobadas y cerradas exitosamente
                  </p>
                </div>
                <div className="w-full pt-3 border-t border-success/20 flex items-center justify-between text-xs font-semibold text-success group-hover:text-success">
                  <span>{filterEstado === "Aprobada" ? "Filtro activo (clic para quitar)" : "Filtrar por resueltas"}</span>
                  <ChevronRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
                <CardDecorativeIcon>
                  <CheckCircle2 className="size-28 text-success/15 group-hover:text-success/25 transition-colors" />
                </CardDecorativeIcon>
              </Card>
            </div>

            {/* ── 4. Buscador y Filtros por Combobox en Una Fila Sin Caja ── */}
            <div className="space-y-3">
              <div className="flex flex-col lg:flex-row items-stretch lg:items-end justify-between gap-3 w-full">
                {/* Buscador amplio y flexible */}
                <div className="flex-1 min-w-[320px] sm:min-w-[400px] lg:min-w-[480px]">
                  <Search
                    placeholder="Buscar por cédula, nombre, código, correo o entidad..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    onClear={() => setSearchQuery("")}
                    className="bg-surface border-border/80 shadow-2xs h-9 text-xs w-full rounded-full"
                  />
                </div>

                {/* Filtros Combobox del UI Kit anchos e independientes */}
                <div className="flex flex-wrap sm:flex-nowrap items-end gap-2.5 shrink-0 overflow-x-auto pb-0.5">
                  <FilterCombobox
                    label="Proceso"
                    placeholder="Proceso..."
                    groupLabel="Tipo de Proceso"
                    options={procesoOptions}
                    value={filterTramite}
                    onChange={(val) => {
                      setFilterTramite(val);
                      setCurrentPage(1);
                    }}
                    className="min-w-[175px] max-w-[220px]"
                  />

                  <FilterCombobox
                    label="Estado"
                    placeholder="Estado..."
                    groupLabel="Estado de Solicitud"
                    options={estadoOptions}
                    value={filterEstado}
                    onChange={(val) => {
                      setFilterEstado(val);
                      setCurrentPage(1);
                    }}
                    className="min-w-[170px] max-w-[210px]"
                  />

                  <FilterCombobox
                    label="Institución"
                    placeholder="Institución..."
                    groupLabel="Institución Solicitante"
                    options={institucionOptions}
                    value={filterInstitucion}
                    onChange={(val) => {
                      setFilterInstitucion(val);
                      setCurrentPage(1);
                    }}
                    className="min-w-[210px] max-w-[270px]"
                  />

                  <FilterCombobox
                    label="Orden"
                    placeholder="Ordenar..."
                    groupLabel="Criterio de Orden"
                    options={sortOptions}
                    value={sortOrder}
                    onChange={(val) => setSortOrder(val as any)}
                    className="min-w-[185px] max-w-[230px]"
                  />
                </div>
              </div>

              {/* Badges / Chips de filtros activos */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60">
                  <span className="text-xs font-semibold text-muted-foreground mr-1">
                    Mostrando resultados filtrados por:
                  </span>

                  {searchQuery.trim() !== "" && (
                    <Badge
                      tone="neutral"
                      appearance="soft"
                      className="gap-1.5 px-3 py-1 font-semibold text-xs rounded-full border border-border"
                    >
                      <span>Búsqueda: "{searchQuery}"</span>
                      <X
                        className="size-3.5 cursor-pointer hover:text-foreground/80 transition-colors"
                        onClick={() => setSearchQuery("")}
                      />
                    </Badge>
                  )}

                  {filterTramite !== "TODOS" && (
                    <Badge
                      tone="neutral"
                      appearance="soft"
                      className="gap-1.5 px-3 py-1 font-semibold text-xs rounded-full border border-border"
                    >
                      <span>
                        {procesoOptions.find((o) => o.value === filterTramite)?.label}
                      </span>
                      <X
                        className="size-3.5 cursor-pointer hover:text-foreground/80 transition-colors"
                        onClick={() => setFilterTramite("TODOS")}
                      />
                    </Badge>
                  )}

                  {filterEstado !== "Todos" && (
                    <Badge
                      tone={getEstadoBadgeProps(filterEstado as EstadoSolicitudIngreso).tone}
                      appearance="soft"
                      dot
                      className="gap-1.5 px-3 py-1 font-semibold text-xs rounded-full"
                    >
                      <span>Estado: {getEstadoBadgeProps(filterEstado as EstadoSolicitudIngreso).label}</span>
                      <X
                        className="size-3.5 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setFilterEstado("Todos")}
                      />
                    </Badge>
                  )}

                  {filterInstitucion !== "Todas" && (
                    <Badge
                      tone="neutral"
                      appearance="soft"
                      className="gap-1.5 px-3 py-1 font-semibold text-xs rounded-full border border-border"
                    >
                      <span>Institución: {filterInstitucion}</span>
                      <X
                        className="size-3.5 cursor-pointer hover:text-foreground/80 transition-colors"
                        onClick={() => setFilterInstitucion("Todas")}
                      />
                    </Badge>
                  )}

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-7 text-xs font-semibold text-muted-foreground hover:text-foreground px-2 rounded-full"
                  >
                    Restablecer todos
                  </Button>
                </div>
              )}
            </div>

            {/* ── 5. Tabla de Solicitudes y Trámites ── */}
            {(() => {
              const assignableRows = paginatedData.filter((r) => {
                if (currentUser.role === "DIR_GESTION") return r.estado === "PENDIENTE_ASIGNACION_GESTION";
                if (currentUser.role === "DIR_NORMATIVA") return r.estado === "PENDIENTE_ASIGNACION_NORMATIVIDAD";
                return false;
              });

              const isAllAssignableSelected = assignableRows.length > 0 && assignableRows.every((r) => selectedIds.includes(r.id));

              const toggleSelectAll = () => {
                if (isAllAssignableSelected) {
                  setSelectedIds([]);
                } else {
                  setSelectedIds(assignableRows.map((r) => r.id));
                }
              };

              const toggleSelectRow = (id: string) => {
                setSelectedIds((prev) =>
                  prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
                );
              };

              return (
                <>
                  <Table className="w-full table-fixed">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-9 px-2 text-center">
                          <Checkbox
                            disabled={assignableRows.length === 0}
                            checked={isAllAssignableSelected}
                            onCheckedChange={toggleSelectAll}
                            aria-label="Seleccionar todos los trámites asignables"
                          />
                        </TableHead>
                        <TableHead className="w-[10%] px-2">
                          TRÁMITE
                        </TableHead>
                        <TableHead className="w-[12%] px-2">
                          SOLICITUD
                        </TableHead>
                        <TableHead className="w-[16%] px-2">
                          SOLICITANTE
                        </TableHead>
                        <TableHead className="w-[16%] px-2">
                          INSTITUCIÓN
                        </TableHead>
                        <TableHead className="w-[9%] px-2">
                          FECHA
                        </TableHead>
                        <TableHead className="w-[17%] min-w-[155px] px-2">
                          ESTADO
                        </TableHead>
                        <TableHead className="w-[12%] px-2">
                          ASIGNADO
                        </TableHead>
                        <TableHead className="w-24 text-center">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-12">
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
                        paginatedData.map((row) => {
                          const isAssignable =
                            (currentUser.role === "DIR_GESTION" && row.estado === "PENDIENTE_ASIGNACION_GESTION") ||
                            (currentUser.role === "DIR_NORMATIVA" && row.estado === "PENDIENTE_ASIGNACION_NORMATIVIDAD");
                          const isSelected = selectedIds.includes(row.id);

                          const revisorAsignado =
                            currentUser.role === "DIR_NORMATIVA" || currentUser.role === "EQ_NORMATIVA"
                              ? (row.revisorNormatividad || row.revisor)
                              : (row.revisorGestion || row.revisor);

                          return (
                            <TableRow
                              key={row.id}
                              className={cn(
                                "cursor-pointer transition-colors hover:bg-muted/40",
                                isSelected && "bg-primary/5"
                              )}
                              onClick={() => handleSelectSolicitud(row)}
                            >
                              {/* Checkbox */}
                              <TableCell className="px-2 text-center" onClick={(e) => e.stopPropagation()}>
                                <Checkbox
                                  disabled={!isAssignable}
                                  checked={isSelected}
                                  onCheckedChange={() => toggleSelectRow(row.id)}
                                  aria-label={`Seleccionar trámite ${row.id}`}
                                />
                              </TableCell>

                              {/* N.º Trámite */}
                              <TableCell className="px-2 font-mono text-xs overflow-hidden">
                                <div className="flex flex-col truncate">
                                  <span className="font-bold text-foreground truncate">{row.id}</span>
                                  <span className="text-[10px] text-muted-foreground truncate">{row.codigoDocumental}</span>
                                </div>
                              </TableCell>

                              {/* Solicitud */}
                              <TableCell className="px-2 text-xs font-medium text-foreground overflow-hidden">
                                <span className="truncate block" title={row.tituloTramite}>
                                  {row.tipoTramite === "PROCESO_A_REGISTRO_INSTITUCION" && "Inst. (Anexo A)"}
                                  {row.tipoTramite === "PROCESO_B_ENROLAMIENTO_COORDINADOR" && "Coord. (Anexo B)"}
                                  {row.tipoTramite === "PROCESO_C_CAMBIO_COORDINADOR" && "Cambio (Anexo C)"}
                                </span>
                              </TableCell>

                              {/* Solicitante */}
                              <TableCell className="px-2 overflow-hidden">
                                <div className="flex flex-col min-w-0 truncate">
                                  <span className="font-bold text-foreground text-xs leading-tight truncate" title={row.nombreCompleto}>
                                    {row.nombreCompleto}
                                  </span>
                                  <span className="font-mono text-[10px] text-muted-foreground truncate">
                                    {row.cedula}
                                  </span>
                                </div>
                              </TableCell>

                              {/* Institución */}
                              <TableCell className="px-2 text-muted-foreground text-xs font-medium overflow-hidden">
                                <span className="truncate block" title={row.institucion}>
                                  {row.institucion}
                                </span>
                              </TableCell>

                              {/* Fecha */}
                              <TableCell className="px-2 text-muted-foreground font-mono text-xs overflow-hidden">
                                <span className="block truncate">{row.fechaSolicitud}</span>
                              </TableCell>

                              {/* Estado */}
                              <TableCell className="px-2 whitespace-nowrap">
                                {renderEstadoBadge(row.estado)}
                              </TableCell>

                              {/* Asignado */}
                              <TableCell className="px-2 text-xs overflow-hidden">
                                {revisorAsignado ? (
                                  <Badge tone="neutral" appearance="soft" className="border border-border text-[11px] font-medium text-foreground truncate max-w-full">
                                    <User className="size-3 mr-1 text-primary shrink-0" />
                                    <span className="truncate">{revisorAsignado}</span>
                                  </Badge>
                                ) : (
                                  <span className="text-[11px] text-muted-foreground italic font-mono truncate block">Sin asignar</span>
                                )}
                              </TableCell>

                              {/* Acciones */}
                              <TableCell className=" text-center" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-center gap-3">
                                  {isAssignable && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon-sm" type="button" onClick={(e) => { e.stopPropagation(); handleOpenAssign(row); }} aria-label={`Asignar revisor a trámite ${row.id}`} className="text-muted-foreground hover:text-primary-300 hover:bg-primary-300/10">
                                          <UserPlus   className="size-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent side="top">Asignar revisor</TooltipContent>
                                    </Tooltip>
                                  )}

                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon-sm" type="button" onClick={(e) => { e.stopPropagation(); handleSelectSolicitud(row); }} aria-label={`Ver detalle de trámite ${row.id}`} className="text-muted-foreground hover:text-primary-300 hover:bg-primary-300/10">
                                        <Eye   className="size-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">Ver detalle</TooltipContent>
                                  </Tooltip>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>

                  {/* Barra Flotante Contextual para Asignación Masiva */}
                  {selectedIds.length > 0 && (
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-foreground text-background dark:bg-card dark:text-card-foreground px-6 py-3.5 rounded-2xl shadow-xl border border-border flex items-center gap-5 animate-slide-up">
                      <div className="flex items-center gap-2 text-xs font-bold">
                        <CheckCircle2 className="size-4 text-primary shrink-0" />
                        <span>{selectedIds.length} {selectedIds.length === 1 ? "solicitud seleccionada" : "solicitudes seleccionadas"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            setSolicitudesMasivas(solicitudes.filter((s) => selectedIds.includes(s.id)));
                            setIsAssignMasivoOpen(true);
                          }}
                          className="h-8 text-xs font-bold px-4 rounded-xl gap-1.5 shadow-xs"
                        >
                          <UserPlus className="size-3.5" />
                          <span>Asignar revisor</span>
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedIds([])}
                          className="h-8 text-xs text-muted-foreground hover:text-foreground px-2 rounded-lg"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}

            {/* ── 6. Paginación ── */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-border/60">
              <div className="flex flex-wrap items-center gap-4 order-2 sm:order-1">
                <p className="text-xs text-muted-foreground font-medium">
                  Mostrando{" "}
                  <span className="font-bold text-foreground">
                    {filteredData.length === 0
                      ? 0
                      : (currentPage - 1) * itemsPerPage + 1}{" "}
                    - {Math.min(currentPage * itemsPerPage, filteredData.length)}
                  </span>{" "}
                  de{" "}
                  <span className="font-bold text-foreground">
                    {filteredData.length}
                  </span>{" "}
                  trámites
                </p>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span>Filas:</span>
                  <div className="inline-flex rounded-md border border-border p-0.5 bg-muted/30">
                    {[5, 10, 20].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          setItemsPerPage(size);
                          setCurrentPage(1);
                        }}
                        className={cn(
                          "px-2 py-0.5 text-xs font-semibold rounded transition-colors",
                          itemsPerPage === size
                            ? "bg-surface text-primary shadow-2xs font-bold border border-border/80"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

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
                        className={currentPage <= 1 ? "pointer-events-none opacity-40 cursor-not-allowed" : ""}
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
                        className={currentPage >= totalPages ? "pointer-events-none opacity-40 cursor-not-allowed" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          </Card>
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

        <AsignarRevisorDialog
          solicitud={solicitudToAssign}
          solicitudesMasivas={solicitudesMasivas}
          open={isAssignOpen || isAssignMasivoOpen}
          onOpenChange={(open) => {
            setIsAssignOpen(open);
            setIsAssignMasivoOpen(open);
            if (!open) {
              setSolicitudToAssign(null);
              setSolicitudesMasivas([]);
            }
          }}
          tipoArea={currentUser.role === "DIR_NORMATIVA" ? "NORMATIVIDAD" : "GESTION"}
          directorNombre={currentUser.name}
          allSolicitudes={solicitudes}
          onConfirmAsignacion={handleConfirmAsignacion}
          onConfirmAsignacionMasiva={handleConfirmAsignacionMasiva}
        />
      </main>
    </WireframeDashboardLayout>
  );
}
