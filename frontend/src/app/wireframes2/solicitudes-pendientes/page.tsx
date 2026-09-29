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
  Lock,
  MapPin,
  Phone,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Stepper, type Step } from "@/components/ui/stepper";
import { Card, CardTitle, CardDescription, CardBadge, CardDecorativeIcon } from "@/components/ui/card";
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
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Timeline, type TimelineItem } from "@/components/ui/timeline";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationFirst,
  PaginationLast,
  PaginationEllipsis,
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
  puedeReasignarSolicitud,
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
  const currentUser = activeUser || MOCK_USERS_BY_ROLE.DIR_GESTION;

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

  // Construction of timelineItems for selectedSolicitud using Timeline component
  const timelineItems: TimelineItem[] = useMemo(() => {
    if (!selectedSolicitud) return [];

    const items: TimelineItem[] = [];

    // Base event: Solicitud Creada
    items.push({
      id: "evento-creacion",
      title: "Solicitud Ingresada en Portal",
      description: `Formulario ${selectedSolicitud.codigoDocumental || "ARP-R01"} generado y firmado mediante FirmaEC.`,
      date: selectedSolicitud.fechaSolicitud,
      status: "success",
      icon: <FileSignature className="size-4" />,
      user: selectedSolicitud.anexoA?.representanteLegalNombre || selectedSolicitud.nombreCompleto || "Representante Legal",
    });

    if (selectedSolicitud.historial && selectedSolicitud.historial.length > 0) {
      selectedSolicitud.historial.forEach((h, idx) => {
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
          description: h.detalles,
          date: h.fechaHora || h.fecha || "",
          status,
          icon,
          user: h.realizadoPor,
        });
      });
    }

    // Si el trámite fue asignado a un revisor y aún está pendiente de análisis técnico
    const revisorActual = selectedSolicitud.revisorGestion || selectedSolicitud.revisorNormatividad || selectedSolicitud.revisor;
    if (
      revisorActual &&
      revisorActual !== "Por asignar" &&
      !selectedSolicitud.revisionIniciada &&
      !["Aprobada", "APROBADO_FINAL", "Rechazada", "Cancelada"].includes(selectedSolicitud.estado)
    ) {
      const yaExistePendiente = items.some((i) =>
        i.title.toLowerCase().includes("pendiente de revisión")
      );
      if (!yaExistePendiente) {
        items.push({
          id: "pendiente-revision-step",
          title: "Pendiente de revisión",
          description: `Trámite asignado al funcionario ${revisorActual}. En espera de verificación documental.`,
          date: selectedSolicitud.fechaAsignacionGestion || selectedSolicitud.fechaAsignacionNormatividad || "Reciente",
          status: "primary",
          icon: <Clock className="size-4" />,
          user: revisorActual,
        });
      }
    }

    return items;
  }, [selectedSolicitud]);

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

  // KPIs globales para Equipo de Gestión
  const dynamicKpis = useMemo(() => {
    // Solo consideramos las solicitudes asignadas a este revisor
    const misSolicitudes = solicitudes.filter(
      (s) => (s.revisorGestion === currentUser.name || s.revisor === currentUser.name)
    );

    return {
      pendientes: misSolicitudes.filter(
        (s) => s.estado === "EN_REVISION_GESTION" && !s.revisionIniciada
      ).length,
      enRevision: misSolicitudes.filter(
        (s) => s.estado === "EN_REVISION_GESTION" && s.revisionIniciada
      ).length,
      finalizadas: misSolicitudes.filter(
        (s) =>
          s.estado === "PENDIENTE_ASIGNACION_NORMATIVIDAD" ||
          s.estado === "Aprobada" ||
          s.estado === "Cancelada" ||
          s.estado === "Rechazada"
      ).length,
    };
  }, [solicitudes, currentUser.name]);

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

      // El revisor de gestión SOLO ve las solicitudes que le han sido asignadas
      const revisorDelTramite = item.revisorGestion || item.revisor;
      if (revisorDelTramite !== currentUser.name) {
        return false;
      }

      // Filtro por Estado interactivo desde las cards
      const matchesEstado = (() => {
        if (filterEstado === "Todos") return true;
        if (filterEstado === "PENDIENTES") {
          return item.estado === "EN_REVISION_GESTION" && !item.revisionIniciada;
        }
        if (filterEstado === "EN_REVISION") {
          return item.estado === "EN_REVISION_GESTION" && item.revisionIniciada;
        }
        if (filterEstado === "FINALIZADAS") {
          return ["PENDIENTE_ASIGNACION_NORMATIVIDAD", "Aprobada", "Cancelada", "Rechazada"].includes(item.estado);
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
    store.aprobarGestion(sol.id, currentUser.name);
    toast.success("Solicitud aprobada correctamente.");
    if (selectedSolicitud && selectedSolicitud.id === sol.id) {
      setSelectedSolicitud((prev) =>
        prev
          ? {
            ...prev,
            estado: "PENDIENTE_ASIGNACION_NORMATIVIDAD",
            fechaRevision: "Reciente",
            fechaAprobacionGestion: "Reciente",
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
    store.rechazarSolicitud(sol.id, motivo, currentUser.name);
    toast.success("Solicitud rechazada. La institución será notificada por correo.");
    if (selectedSolicitud && selectedSolicitud.id === sol.id) {
      setSelectedSolicitud((prev) =>
        prev
          ? {
            ...prev,
            estado: "Cancelada",
            fechaRevision: "Reciente",
            revisor: currentUser.name,
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
      <main className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ══════════════════════════════════════════════════════════
            VISTA 1: DETALLE DE SOLICITUD (BREADCRUMB + APROBAR / RECHAZAR)
           ══════════════════════════════════════════════════════════ */}
        {selectedSolicitud ? (
          <div className="bg-surface border border-border rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-200">
            {/* Cabecera de Retorno y Acciones */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
              <Button
                type="button"
                variant="primary"
                onClick={() => setSelectedSolicitud(null)}
                className="h-10 px-4 gap-2 text-xs font-semibold rounded-xl shadow-xs self-start"
              >
                <ArrowLeft className="size-4" />
                <span>Volver a la bandeja</span>
              </Button>

              {/* Botones de acción en la cabecera */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                {currentUser.role === "EQ_GESTION" && selectedSolicitud.estado === "EN_REVISION_GESTION" ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleOpenReject(selectedSolicitud)}
                      className="h-10 px-4 text-xs font-semibold gap-2 border-border text-foreground hover:bg-muted rounded-xl"
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

            {/* Encabezado del Trámite en Card Featured estilo UI Kit con Badge Primary e Icono (como registro-institucion) */}
            <Card
              variant="featured"
              disableHover={true}
              className="bg-primary-100/30 dark:bg-primary-900/20 border-0 shadow-none hover:shadow-none hover:translate-y-0 relative overflow-hidden p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <CardBadge className="bg-primary/20 text-primary text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 border-0">
                    FORMULARIO OFICIAL {selectedSolicitud.codigoDocumental} · {selectedSolicitud.id}
                  </CardBadge>
                </div>
                {renderEstadoBadge(selectedSolicitud.estado)}
              </div>

              <CardTitle className="text-xl sm:text-2xl font-bold font-heading text-primary">
                {selectedSolicitud.tituloTramite}
              </CardTitle>

              <CardDescription className="text-xs text-primary-800/80 dark:text-primary-200/80 font-medium mt-1">
                Registrado el {selectedSolicitud.fechaSolicitud} · {selectedSolicitud.institucion} · Solicitante: {selectedSolicitud.nombreCompleto} (C.I. {selectedSolicitud.cedula})
              </CardDescription>

              <CardDecorativeIcon className="-bottom-10 -right-10 opacity-20 pointer-events-none">
                <Building2 className="size-36 text-primary" />
              </CardDecorativeIcon>
            </Card>

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
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center size-5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-help focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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

              <CardTitle className="text-lg sm:text-xl font-bold font-heading text-primary">
                Anexo A — Solicitud de Acceso al Sistema Nacional de Registros Públicos
              </CardTitle>

              <CardDescription className="text-xs text-primary-800/80 dark:text-primary-200/80 font-medium">
                Proceso A · Enrolamiento de Institución al SINARP
              </CardDescription>

              <CardDecorativeIcon className="-bottom-10 -right-10 opacity-20 group-hover/card:scale-100">
                <FileText className="size-32 text-primary" />
              </CardDecorativeIcon>
            </Card>

            {/* ── NAVEGACIÓN PESTAÑAS PÍLDORA CÁPSULA (UI KIT CON ICONOS) ── */}
            <div className="overflow-x-auto py-1">
              <Tabs
                defaultValue="tab-0"
                value={`tab-${detailTab}`}
                onValueChange={(val) => setDetailTab(Number(val.replace("tab-", "")))}
                className="w-full"
              >
                <TabsList className="h-auto p-1.5 rounded-full bg-background border border-border/40 inline-flex gap-1.5 flex-nowrap w-full sm:w-auto justify-start">
                  <TabsTrigger
                    value="tab-0"
                    className="px-5 py-2 text-xs font-bold gap-2 data-[state=active]:bg-primary-300 data-[state=active]:text-white data-[state=active]:[&_svg]:text-white dark:data-[state=active]:bg-primary-300 dark:data-[state=active]:text-white dark:data-[state=active]:[&_svg]:text-white"
                  >
                    <Building2 className="size-4 shrink-0" />
                    <span>1. Entidad y Autoridad</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="tab-1"
                    className="px-5 py-2 text-xs font-bold gap-2 data-[state=active]:bg-primary-300 data-[state=active]:text-white data-[state=active]:[&_svg]:text-white dark:data-[state=active]:bg-primary-300 dark:data-[state=active]:text-white dark:data-[state=active]:[&_svg]:text-white"
                  >
                    <User className="size-4 shrink-0" />
                    <span>2. Coordinadores</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="tab-2"
                    className="px-5 py-2 text-xs font-bold gap-2 data-[state=active]:bg-primary-300 data-[state=active]:text-white data-[state=active]:[&_svg]:text-white dark:data-[state=active]:bg-primary-300 dark:data-[state=active]:text-white dark:data-[state=active]:[&_svg]:text-white"
                  >
                    <FileText className="size-4 shrink-0" />
                    <span>3. Servicios y Procesos</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="tab-3"
                    className="px-5 py-2 text-xs font-bold gap-2 data-[state=active]:bg-primary-300 data-[state=active]:text-white data-[state=active]:[&_svg]:text-white dark:data-[state=active]:bg-primary-300 dark:data-[state=active]:text-white dark:data-[state=active]:[&_svg]:text-white"
                  >
                    <ShieldCheck className="size-4 shrink-0" />
                    <span>4. Declaraciones y firma</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="tab-4"
                    className="px-5 py-2 text-xs font-bold gap-2 data-[state=active]:bg-primary-300 data-[state=active]:text-white data-[state=active]:[&_svg]:text-white dark:data-[state=active]:bg-primary-300 dark:data-[state=active]:text-white dark:data-[state=active]:[&_svg]:text-white"
                  >
                    <History className="size-4 shrink-0" />
                    <span>5. Trazabilidad</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* ── PASO 0: ENTIDAD Y AUTORIDAD COMPARECIENTE ── */}
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
                    {selectedSolicitud.anexoA?.entidadTipo === "Publica" ? "ENTIDAD PÚBLICA" : "ENTIDAD PRIVADA"}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground block">Naturaleza de la Entidad</Label>
                    <div className="flex items-center gap-6 pt-1">
                      <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-not-allowed">
                        <input
                          type="radio"
                          name="entidadTipoDirector"
                          checked={selectedSolicitud.anexoA?.entidadTipo !== "Privada"}
                          disabled
                          className="size-4 text-primary accent-primary cursor-not-allowed"
                        />
                        <span>Entidad Pública</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-not-allowed">
                        <input
                          type="radio"
                          name="entidadTipoDirector"
                          checked={selectedSolicitud.anexoA?.entidadTipo === "Privada"}
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
                        value={selectedSolicitud.anexoA?.nombreEntidad || selectedSolicitud.institucion}
                        disabled
                        className="bg-muted/30 cursor-not-allowed font-bold text-xs text-foreground"
                      />
                    </InputGroup>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">RUC de la Entidad (13 dígitos) *</Label>
                    <InputGroup leftIcon={<FileText className="size-4 text-muted-foreground" />}>
                      <InputGroupInput
                        value={selectedSolicitud.anexoA?.rucEntidad || "1768000000001"}
                        disabled
                        className="bg-muted/30 cursor-not-allowed font-mono text-xs text-foreground"
                      />
                    </InputGroup>
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Dirección de la Entidad *</Label>
                    <InputGroup leftIcon={<MapPin className="size-4 text-muted-foreground" />}>
                      <InputGroupInput
                        value={selectedSolicitud.anexoA?.direccionEntidad || "Av. 6 de Diciembre N25-75 y Av. Colón, Quito"}
                        disabled
                        className="bg-muted/30 cursor-not-allowed text-xs text-foreground"
                      />
                    </InputGroup>
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Objeto Social y/o Actividad de la Entidad *</Label>
                    <Textarea
                      value={selectedSolicitud.anexoA?.objetoSocial || "Rectoría y formulación de políticas públicas de telecomunicaciones y gobierno digital."}
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
                        value={selectedSolicitud.anexoA?.representanteLegalNombre || selectedSolicitud.nombreCompleto}
                        disabled
                        className="bg-muted/30 cursor-not-allowed font-semibold text-xs text-foreground"
                      />
                    </InputGroup>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Denominación del Cargo *</Label>
                    <InputGroup leftIcon={<Building2 className="size-4 text-muted-foreground" />}>
                      <InputGroupInput
                        value={selectedSolicitud.anexoA?.representanteLegalCargo || "Ministro de Telecomunicaciones (Representante Legal)"}
                        disabled
                        className="bg-muted/30 cursor-not-allowed text-xs text-foreground"
                      />
                    </InputGroup>
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Correo Electrónico de la Autoridad *</Label>
                    <InputGroup leftIcon={<Mail className="size-4 text-muted-foreground" />}>
                      <InputGroupInput
                        value={selectedSolicitud.anexoA?.representanteLegalEmail || selectedSolicitud.correo || "ministro@mintel.gob.ec"}
                        disabled
                        className="bg-muted/30 cursor-not-allowed text-xs text-foreground"
                      />
                    </InputGroup>
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
              </div>
            )}

            {/* ── PASO 1: COORDINADORES INSTITUCIONALES ── */}
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
                          <InputGroupInput value={selectedSolicitud.anexoA?.titularNombreCompleto || "Ing. Esteban Javier Morales Salazar"} disabled className="bg-muted/30 cursor-not-allowed font-semibold text-xs text-foreground" />
                        </InputGroup>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs font-semibold text-foreground">Cédula de Ciudadanía *</Label>
                        <InputGroup leftIcon={<CreditCard className="size-4 text-muted-foreground" />}>
                          <InputGroupInput value={selectedSolicitud.anexoA?.titularCedula || "1718956234"} disabled className="bg-muted/30 cursor-not-allowed font-mono text-xs text-foreground" />
                        </InputGroup>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs font-semibold text-foreground">Cargo / Rol en la Institución *</Label>
                        <InputGroup leftIcon={<Building2 className="size-4 text-muted-foreground" />}>
                          <InputGroupInput value={selectedSolicitud.anexoA?.titularCargo || "Director de Gobierno Digital"} disabled className="bg-muted/30 cursor-not-allowed text-xs text-foreground" />
                        </InputGroup>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs font-semibold text-foreground">Área / Unidad a la que pertenece *</Label>
                        <InputGroup leftIcon={<Building2 className="size-4 text-muted-foreground" />}>
                          <InputGroupInput value={selectedSolicitud.anexoA?.titularAreaUnidad || "Viceministerio de Tecnologías de la Información"} disabled className="bg-muted/30 cursor-not-allowed text-xs text-foreground" />
                        </InputGroup>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs font-semibold text-foreground">Correo Electrónico Institucional *</Label>
                        <InputGroup leftIcon={<Mail className="size-4 text-muted-foreground" />}>
                          <InputGroupInput value={selectedSolicitud.anexoA?.titularEmail || "esteban.morales@mintel.gob.ec"} disabled className="bg-muted/30 cursor-not-allowed text-xs text-foreground" />
                        </InputGroup>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs font-semibold text-foreground">Teléfono Fijo Institucional *</Label>
                        <InputGroup leftIcon={<Phone className="size-4 text-muted-foreground" />}>
                          <InputGroupInput value={selectedSolicitud.anexoA?.titularTelefonoFijo || "022200200 ext 120"} disabled className="bg-muted/30 cursor-not-allowed text-xs text-foreground" />
                        </InputGroup>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs font-semibold text-foreground">Móvil Institucional *</Label>
                        <InputGroup leftIcon={<Smartphone className="size-4 text-muted-foreground" />}>
                          <InputGroupInput value={selectedSolicitud.anexoA?.titularMovilInstitucional || "0995544332"} disabled className="bg-muted/30 cursor-not-allowed text-xs text-foreground" />
                        </InputGroup>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs font-semibold text-foreground">Móvil Personal *</Label>
                        <InputGroup leftIcon={<Smartphone className="size-4 text-muted-foreground" />}>
                          <InputGroupInput value={selectedSolicitud.anexoA?.titularMovilPersonal || "0984433221"} disabled className="bg-muted/30 cursor-not-allowed text-xs text-foreground" />
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
                          <InputGroupInput value={selectedSolicitud.anexoA?.suplenteNombreCompleto || "Lic. Carmen Elena Vinueza Proaño"} disabled className="bg-muted/30 cursor-not-allowed font-semibold text-xs text-foreground" />
                        </InputGroup>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs font-semibold text-foreground">Cédula de Ciudadanía *</Label>
                        <InputGroup leftIcon={<CreditCard className="size-4 text-muted-foreground" />}>
                          <InputGroupInput value={selectedSolicitud.anexoA?.suplenteCedula || "1714523698"} disabled className="bg-muted/30 cursor-not-allowed font-mono text-xs text-foreground" />
                        </InputGroup>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs font-semibold text-foreground">Cargo / Rol en la Institución *</Label>
                        <InputGroup leftIcon={<Building2 className="size-4 text-muted-foreground" />}>
                          <InputGroupInput value={selectedSolicitud.anexoA?.suplenteCargo || "Especialista de Interoperabilidad Gubernamental"} disabled className="bg-muted/30 cursor-not-allowed text-xs text-foreground" />
                        </InputGroup>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs font-semibold text-foreground">Área / Unidad a la que pertenece *</Label>
                        <InputGroup leftIcon={<Building2 className="size-4 text-muted-foreground" />}>
                          <InputGroupInput value={selectedSolicitud.anexoA?.suplenteAreaUnidad || "Dirección de Gobierno Digital"} disabled className="bg-muted/30 cursor-not-allowed text-xs text-foreground" />
                        </InputGroup>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs font-semibold text-foreground">Correo Electrónico Institucional *</Label>
                        <InputGroup leftIcon={<Mail className="size-4 text-muted-foreground" />}>
                          <InputGroupInput value={selectedSolicitud.anexoA?.suplenteEmail || "carmen.vinueza@mintel.gob.ec"} disabled className="bg-muted/30 cursor-not-allowed text-xs text-foreground" />
                        </InputGroup>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs font-semibold text-foreground">Teléfono Fijo Institucional *</Label>
                        <InputGroup leftIcon={<Phone className="size-4 text-muted-foreground" />}>
                          <InputGroupInput value={selectedSolicitud.anexoA?.suplenteTelefonoFijo || "022200200 ext 125"} disabled className="bg-muted/30 cursor-not-allowed text-xs text-foreground" />
                        </InputGroup>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs font-semibold text-foreground">Móvil Institucional *</Label>
                        <InputGroup leftIcon={<Smartphone className="size-4 text-muted-foreground" />}>
                          <InputGroupInput value={selectedSolicitud.anexoA?.suplenteMovilInstitucional || "0991122334"} disabled className="bg-muted/30 cursor-not-allowed text-xs text-foreground" />
                        </InputGroup>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs font-semibold text-foreground">Móvil Personal *</Label>
                        <InputGroup leftIcon={<Smartphone className="size-4 text-muted-foreground" />}>
                          <InputGroupInput value={selectedSolicitud.anexoA?.suplenteMovilPersonal || "0982233445"} disabled className="bg-muted/30 cursor-not-allowed text-xs text-foreground" />
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

            {/* ── PASO 2: SERVICIOS Y PROCESOS DE USO ── */}
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
                      value={selectedSolicitud.anexoA?.areasUso || "Dirección de Gobierno Electrónico y Dirección de Datos Públicos"}
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
                      value={selectedSolicitud.anexoA?.procesosUso || "Verificación de interoperabilidad nacional de trámites ciudadanos en línea del Portal Único gob.ec."}
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

            {/* ── PASO 3: DECLARACIONES Y FIRMA ── */}
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
                          {selectedSolicitud.anexoA?.representanteLegalNombre || "Ing. César Antonio Martín Moreno"}
                        </CardTitle>

                        <CardDescription className="text-xs text-secondary-800/80 dark:text-secondary-200/80 font-medium">
                          {selectedSolicitud.anexoA?.representanteLegalCargo || "Ministro de Telecomunicaciones (Representante Legal)"}
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
                          {selectedSolicitud.anexoA?.ciudadFirma || "Quito D.M."}
                        </CardTitle>

                        <CardDescription className="text-xs text-secondary-800/80 dark:text-secondary-200/80 font-mono font-medium flex items-center gap-1.5 mt-0.5">
                          <Calendar className="size-3.5 text-secondary/80" />
                          <span>{selectedSolicitud.anexoA?.fechaFirma || selectedSolicitud.fechaSolicitud || "24/09/2026"}</span>
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
                              ARP-R01_Solicitud_Acceso_SINARP_{(selectedSolicitud.anexoA?.entidadSiglas || "ENTIDAD").toUpperCase()}.pdf
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
                      alert(`Descargando documento firmado ARP-R01_Solicitud_Acceso_SINARP_${(selectedSolicitud.anexoA?.entidadSiglas || "ENTIDAD").toUpperCase()}.pdf con validación FirmaEC...`);
                    }}
                    className="h-9 px-4 text-xs font-semibold gap-2 shadow-xs"
                  >
                    <Download className="size-4" />
                    <span>Descargar Anexo A</span>
                  </Button>
                </div>
              </div>
            )}

            {/* ── PASO 4: HISTORIAL COMPLETO Y REGLAS BPM DEL TRÁMITE ── */}
            {detailTab === 4 && (
              <div className="space-y-4 animate-in fade-in duration-200">
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
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Cronología Completa (2 cols) */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <History className="size-4 text-foreground" />
                      Cronología Registrada
                    </h3>

                    <div className="pt-2">
                      <Timeline items={timelineItems} />
                    </div>
                  </div>

                  {/* Reglas BPM y Trazabilidad (1 col) */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <Activity className="size-4 text-foreground" />
                      Trazabilidad del Trámite
                    </h3>

                    <div className="p-4 rounded-2xl border border-border bg-muted/20 space-y-3 text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[11px]">N.º de Trámite Unificado:</span>
                        <strong className="font-mono text-foreground text-sm">{selectedSolicitud.id}</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Estado Actual:</span>
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
            </div>
            )}
          </div>
        ) : (
          /* ══════════════════════════════════════════════════════════
              VISTA 2: LISTADO DE TRÁMITES (FILTROS POR PROCESO + TABLA)
             ══════════════════════════════════════════════════════════ */
          <Card className="bg-surface rounded-2xl border border-border shadow-xs p-6 sm:p-8 lg:p-10 flex flex-col gap-6 my-2">
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
                titleText = "Solicitudes pendientes de revisión";
                subtitleText = "Consulta y revisa las solicitudes de enrolamiento asignadas para su aprobación o rechazo.";
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

            {/* ── 2. Resumen Superior (Tarjetas Interactivas) ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 w-full">
              {/* Card 1: Pendientes de revisión */}
              <Card
                variant="featured"
                role="button"
                tabIndex={0}
                onClick={() => {
                  setFilterEstado(filterEstado === "PENDIENTES" ? "Todos" : "PENDIENTES");
                  setCurrentPage(1);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setFilterEstado(filterEstado === "PENDIENTES" ? "Todos" : "PENDIENTES");
                    setCurrentPage(1);
                  }
                }}
                className={cn(
                  "group relative overflow-hidden cursor-pointer transition-all duration-300 border rounded-2xl outline-none select-none p-6 lg:p-7 w-full min-h-[170px]",
                  "hover:-translate-y-1 hover:shadow-lg",
                  filterEstado === "PENDIENTES"
                    ? "bg-warning/15 border-warning ring-2 ring-warning/40 shadow-sm"
                    : "bg-warning/5 hover:bg-warning/10 border-warning/30 shadow-2xs"
                )}
                innerClassName="p-0 gap-4 text-left h-full justify-between"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-heading font-extrabold text-4xl lg:text-5xl text-warning tracking-tight">
                    {dynamicKpis.pendientes}
                  </span>
                  <Badge tone="warning" appearance="soft" size="sm" className="font-bold text-xs tracking-wider uppercase gap-1.5 px-3 py-1">
                    <Clock className="size-3.5 shrink-0" />
                    <span>PENDIENTES</span>
                  </Badge>
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-foreground block group-hover:text-warning transition-colors">
                    Pendientes de revisión
                  </h3>
                  <p className="text-xs text-muted-foreground font-normal block leading-relaxed">
                    solicitudes nuevas asignadas
                  </p>
                </div>
                <div className="w-full pt-3 border-t border-warning/20 flex items-center justify-between text-xs font-semibold text-warning group-hover:text-warning">
                  <span>{filterEstado === "PENDIENTES" ? "Filtro activo (clic para quitar)" : "Filtrar por pendientes"}</span>
                  <ChevronRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
                <CardDecorativeIcon>
                  <Clock className="size-28 text-warning/15 group-hover:text-warning/25 transition-colors" />
                </CardDecorativeIcon>
              </Card>

              {/* Card 2: En revisión */}
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
                    En revisión
                  </h3>
                  <p className="text-xs text-muted-foreground font-normal block leading-relaxed">
                    análisis documental en curso
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

              {/* Card 3: Finalizadas */}
              <Card
                variant="featured"
                role="button"
                tabIndex={0}
                onClick={() => {
                  setFilterEstado(filterEstado === "FINALIZADAS" ? "Todos" : "FINALIZADAS");
                  setCurrentPage(1);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setFilterEstado(filterEstado === "FINALIZADAS" ? "Todos" : "FINALIZADAS");
                    setCurrentPage(1);
                  }
                }}
                className={cn(
                  "group relative overflow-hidden cursor-pointer transition-all duration-300 border rounded-2xl outline-none select-none p-6 lg:p-7 w-full min-h-[170px]",
                  "hover:-translate-y-1 hover:shadow-lg",
                  filterEstado === "FINALIZADAS"
                    ? "bg-success/15 border-success ring-2 ring-success/40 shadow-sm"
                    : "bg-success/5 hover:bg-success/10 border-success/30 shadow-2xs"
                )}
                innerClassName="p-0 gap-4 text-left h-full justify-between"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-heading font-extrabold text-4xl lg:text-5xl text-success tracking-tight">
                    {dynamicKpis.finalizadas}
                  </span>
                  <Badge tone="success" appearance="soft" size="sm" className="font-bold text-xs tracking-wider uppercase gap-1.5 px-3 py-1">
                    <CheckCircle2 className="size-3.5 shrink-0" />
                    <span>FINALIZADAS</span>
                  </Badge>
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-foreground block group-hover:text-success transition-colors">
                    Finalizadas
                  </h3>
                  <p className="text-xs text-muted-foreground font-normal block leading-relaxed">
                    aprobadas o rechazadas
                  </p>
                </div>
                <div className="w-full pt-3 border-t border-success/20 flex items-center justify-between text-xs font-semibold text-success group-hover:text-success">
                  <span>{filterEstado === "FINALIZADAS" ? "Filtro activo (clic para quitar)" : "Filtrar por finalizadas"}</span>
                  <ChevronRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
                <CardDecorativeIcon>
                  <CheckCircle2 className="size-28 text-success/15 group-hover:text-success/25 transition-colors" />
                </CardDecorativeIcon>
              </Card>
            </div>

            {/* ── Línea separadora entre KPI Cards y Filtros ── */}
            <div className="w-full h-[1.5px] bg-border my-4 shrink-0" />

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
                const { puedeReasignar } = puedeReasignarSolicitud(r, currentUser.role);
                return puedeReasignar;
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
                        <TableHead className="w-[10%] px-2">
                          TRÁMITE
                        </TableHead>
                        <TableHead className="w-[11%] px-2">
                          SOLICITUD
                        </TableHead>
                        <TableHead className="w-[20%] min-w-[170px] px-2">
                          SOLICITANTE
                        </TableHead>
                        <TableHead className="w-[18%] px-2">
                          INSTITUCIÓN
                        </TableHead>
                        <TableHead className="w-[10%] px-2">
                          FECHA
                        </TableHead>
                        <TableHead className="w-[16%] min-w-[140px] px-2">
                          ESTADO
                        </TableHead>
                        <TableHead className="w-[15%] px-2 text-right">
                          ACCIONES
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
                        paginatedData.map((row) => {
                          return (
                            <TableRow
                              key={row.id}
                              className="cursor-pointer transition-colors hover:bg-muted/40"
                              onClick={() => handleSelectSolicitud(row)}
                            >
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
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex flex-col min-w-0 group/sol cursor-pointer">
                                      <span className="font-bold text-foreground text-xs leading-snug truncate" title={row.nombreCompleto}>
                                        {row.nombreCompleto}
                                      </span>
                                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                                        <span className="truncate">{row.cedula}</span>
                                        <span className="text-[9px] px-1 rounded bg-muted/60 text-muted-foreground font-sans font-semibold group-hover/sol:bg-primary/10 group-hover/sol:text-primary transition-colors shrink-0">
                                          +
                                        </span>
                                      </div>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" variant="surface" className="p-3 max-w-xs flex-col items-start gap-1">
                                    <p className="font-bold text-xs text-foreground">{row.nombreCompleto}</p>
                                    <p className="font-mono text-[11px] text-muted-foreground">C.I. {row.cedula}</p>
                                    <p className="text-[11px] text-primary font-medium">{row.correo}</p>
                                    <p className="text-[10px] text-muted-foreground border-t border-border/60 pt-1 mt-1">{row.institucion}</p>
                                  </TooltipContent>
                                </Tooltip>
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

                              {/* Acciones */}
                              <TableCell className="px-2 text-right" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-end gap-1">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="icon-sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleSelectSolicitud(row);
                                        }}
                                        className="size-7 rounded-lg border-border/80 text-foreground hover:bg-muted shadow-2xs"
                                        aria-label={`Ver detalle de trámite ${row.id}`}
                                      >
                                        <Eye className="size-3.5" />
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
                </>
              );
            })()}

            {/* ── 6. Paginación y Contador de filas ── */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-border/60 w-full">
              {/* Texto explicativo de resultados a la izquierda */}
              <p className="text-xs text-muted-foreground font-medium whitespace-nowrap mr-auto sm:mr-0">
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

              {/* Controles de paginación y filas a la derecha */}
              <div className="flex flex-wrap items-center justify-end gap-4 sm:gap-6 ml-auto">
                {/* Selector de filas por página */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground whitespace-nowrap">
                  <span>Filas:</span>
                  <div className="inline-flex rounded-full border border-border/80 p-0.5 bg-surface shadow-2xs">
                    {[5, 10, 20].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          setItemsPerPage(size);
                          setCurrentPage(1);
                        }}
                        className={cn(
                          "px-2.5 py-0.5 text-xs font-semibold rounded-full transition-all",
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

                {/* Paginación UI Kit con botones circulares completos (« < 1 2 > ») */}
                <Pagination className="mx-0 w-auto justify-end">
                <PaginationContent className="gap-1.5">
                  <PaginationItem>
                    <PaginationFirst
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(1);
                      }}
                      className={cn(
                        "size-8 rounded-full border border-border/70 hover:bg-muted/30 transition-colors",
                        currentPage <= 1 ? "pointer-events-none opacity-40 cursor-not-allowed" : ""
                      )}
                    />
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={cn(
                        "size-8 rounded-full border border-border/70 hover:bg-muted/30 transition-colors",
                        currentPage <= 1 ? "pointer-events-none opacity-40 cursor-not-allowed" : ""
                      )}
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
                        className={cn(
                          "size-8 rounded-full font-semibold text-xs transition-all",
                          page === currentPage
                            ? "bg-primary text-white font-bold shadow-2xs"
                            : "border border-border/70 hover:bg-muted/30 text-foreground"
                        )}
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
                      className={cn(
                        "size-8 rounded-full border border-border/70 hover:bg-muted/30 transition-colors",
                        currentPage >= totalPages ? "pointer-events-none opacity-40 cursor-not-allowed" : ""
                      )}
                    />
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationLast
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(totalPages);
                      }}
                      className={cn(
                        "size-8 rounded-full border border-border/70 hover:bg-muted/30 transition-colors",
                        currentPage >= totalPages ? "pointer-events-none opacity-40 cursor-not-allowed" : ""
                      )}
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

      </main>
    </WireframeDashboardLayout>
  );
}
