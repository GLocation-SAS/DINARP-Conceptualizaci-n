"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserX,
  Search as SearchIcon,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Lock,
  Mail,
  Fingerprint,
  Building,
  KeyRound,
  FileText,
  RotateCcw,
  Ban,
  Check,
  X,
  Eye,
  Edit2,
  ArrowUpDown,
  History,
  Shield,
  Briefcase,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { WireframeDashboardLayout } from "../components/wireframe-dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "@/components/ui/search";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationFirst,
  PaginationLast,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
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
import {
  Combobox,
  ComboboxSelectTrigger,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxValue,
} from "@/components/ui/combobox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Timeline, TimelineItem } from "@/components/ui/timeline";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useUsuariosStore,
  UsuarioInterno,
  EstadoUsuario,
  RolInterno,
  TipoEventoAuditoria,
  ROLES_INTERNOS_CATALOGO,
} from "../acceso-seguridad/data/usuarios-store";
import { MOCK_USERS_BY_ROLE } from "../catalogo-interoperabilidad/data/catalogo-data";

export default function GestionUsuariosPage() {
  const {
    usuarios,
    auditoria,
    isLoaded,
    crearUsuarioInterno,
    editarUsuario,
    activarUsuario,
    simularActivacionDemo,
    suspenderUsuario,
    reactivarUsuario,
    darDeBajaUsuario,
  } = useUsuariosStore();

  const currentUser = MOCK_USERS_BY_ROLE.ADMIN;

  // Estados de filtros y búsqueda
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRol, setFilterRol] = useState<string>("TODOS");
  const [filterAmbito, setFilterAmbito] = useState<string>("TODOS");
  const [filterEstado, setFilterEstado] = useState<string>("TODOS");

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modales
  const [modalCrearOpen, setModalCrearOpen] = useState(false);
  const [modalDetalleOpen, setModalDetalleOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [modalSuspenderOpen, setModalSuspenderOpen] = useState(false);
  const [modalReactivarOpen, setModalReactivarOpen] = useState(false);
  const [modalBajaOpen, setModalBajaOpen] = useState(false);

  // Usuario seleccionado para acciones
  const [selectedUser, setSelectedUser] = useState<UsuarioInterno | null>(null);

  // Formulario Crear Usuario (ID-01)
  const [formCrearCedula, setFormCrearCedula] = useState("");
  const [formCrearNombre, setFormCrearNombre] = useState("");
  const [formCrearCorreo, setFormCrearCorreo] = useState("");
  const [formCrearRol, setFormCrearRol] = useState<RolInterno>("EQ_GESTION");
  const [formCrearAmbito, setFormCrearAmbito] = useState("DGR");
  const [formCrearError, setFormCrearError] = useState("");
  const [formCrearSuccess, setFormCrearSuccess] = useState<UsuarioInterno | null>(null);

  // Formulario Editar Usuario (ID-02)
  const [formEditNombre, setFormEditNombre] = useState("");
  const [formEditCorreo, setFormEditCorreo] = useState("");
  const [formEditRol, setFormEditRol] = useState<RolInterno>("EQ_GESTION");
  const [formEditAmbito, setFormEditAmbito] = useState("DGR");
  const [formEditMotivo, setFormEditMotivo] = useState("");
  const [formEditError, setFormEditError] = useState("");

  // Formularios de cambio de estado (ID-03 e ID-04)
  const [motivoAccion, setMotivoAccion] = useState("");
  const [errorAccion, setErrorAccion] = useState("");

  // Tabs de detalle
  const [activeDetailTab, setActiveDetailTab] = useState("info");

  // Filtros de Auditoría y Trazabilidad (ID-05)
  const [filtroAuditTipo, setFiltroAuditTipo] = useState<string>("TODOS");
  const [filtroAuditPeriodo, setFiltroAuditPeriodo] = useState<string>("TODOS");

  // Cómputo de KPIs
  const kpis = useMemo(() => {
    return {
      activos: usuarios.filter((u) => u.estado === "ACTIVO").length,
      pendientes: usuarios.filter((u) => u.estado === "PENDIENTE_ACTIVACION").length,
      suspendidos: usuarios.filter((u) => u.estado === "SUSPENDIDO").length,
      retirados: usuarios.filter((u) => u.estado === "RETIRADO").length,
    };
  }, [usuarios]);

  // Lista única de ámbitos presentes
  const ambitosDisponibles = useMemo(() => {
    const set = new Set<string>();
    usuarios.forEach((u) => set.add(u.ambito));
    return Array.from(set);
  }, [usuarios]);

  // Filtrado de usuarios
  const filteredUsuarios = useMemo(() => {
    return usuarios.filter((u) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        u.cedula.toLowerCase().includes(q) ||
        u.nombreCompleto.toLowerCase().includes(q) ||
        u.correo.toLowerCase().includes(q) ||
        u.rolLabel.toLowerCase().includes(q);

      const matchRol = filterRol === "TODOS" || u.rol === filterRol;
      const matchAmbito = filterAmbito === "TODOS" || u.ambito === filterAmbito;
      const matchEstado = filterEstado === "TODOS" || u.estado === filterEstado;

      return matchSearch && matchRol && matchAmbito && matchEstado;
    });
  }, [usuarios, searchQuery, filterRol, filterAmbito, filterEstado]);

  // Paginación
  const totalPages = Math.ceil(filteredUsuarios.length / pageSize) || 1;
  const paginatedUsuarios = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsuarios.slice(start, start + pageSize);
  }, [filteredUsuarios, currentPage, pageSize]);

  // Manejo de cambio de rol en Formulario de Creación
  const handleRolChangeCrear = (nuevoRol: RolInterno) => {
    setFormCrearRol(nuevoRol);
    const rolConfig = ROLES_INTERNOS_CATALOGO.find((r) => r.id === nuevoRol);
    if (rolConfig && rolConfig.ambitosPermitidos.length > 0) {
      setFormCrearAmbito(rolConfig.ambitosPermitidos[0].codigo);
    }
  };

  // Manejo de cambio de rol en Formulario de Edición
  const handleRolChangeEditar = (nuevoRol: RolInterno) => {
    setFormEditRol(nuevoRol);
    const rolConfig = ROLES_INTERNOS_CATALOGO.find((r) => r.id === nuevoRol);
    if (rolConfig && rolConfig.ambitosPermitidos.length > 0) {
      setFormEditAmbito(rolConfig.ambitosPermitidos[0].codigo);
    }
  };

  // Validación de Cédula en vivo
  const isCedulaValid = (val: string) => /^\d{10}$/.test(val.trim());
  const isEmailValid = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  // Submit Crear Usuario (ID-01)
  const handleCrearSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormCrearError("");

    if (!isCedulaValid(formCrearCedula)) {
      setFormCrearError("La cédula debe ser de 10 dígitos numéricos.");
      return;
    }
    if (!isEmailValid(formCrearCorreo)) {
      setFormCrearError("Ingresa un correo electrónico institucional válido.");
      return;
    }

    const res = crearUsuarioInterno({
      cedula: formCrearCedula,
      nombreCompleto: formCrearNombre,
      correo: formCrearCorreo,
      rol: formCrearRol,
      ambitoCodigo: formCrearAmbito,
      actor: currentUser.name,
    });

    if (!res.ok) {
      setFormCrearError(res.error || "Error al crear la cuenta.");
      return;
    }

    setFormCrearSuccess(res.usuario || null);
    toast.success("Cuenta creada exitosamente", {
      description: `Usuario ${formCrearCedula} registrado en estado PENDIENTE DE ACTIVACIÓN. Se remitieron instrucciones por correo.`,
    });
  };

  // Reset modal crear
  const handleCloseModalCrear = () => {
    setModalCrearOpen(false);
    setFormCrearCedula("");
    setFormCrearNombre("");
    setFormCrearCorreo("");
    setFormCrearRol("EQ_GESTION");
    setFormCrearAmbito("DGR");
    setFormCrearError("");
    setFormCrearSuccess(null);
  };

  // Abrir Modal Editar
  const handleOpenEditar = (u: UsuarioInterno) => {
    setSelectedUser(u);
    setFormEditNombre(u.nombreCompleto);
    setFormEditCorreo(u.correo);
    setFormEditRol(u.rol);
    setFormEditAmbito(u.ambitoCodigo);
    setFormEditMotivo("");
    setFormEditError("");
    setModalEditarOpen(true);
  };

  // Dialog de Confirmación UI Kit
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    variant?: "danger" | "warning" | "standard";
    onConfirm: () => void;
  }>({
    open: false,
    title: "",
    description: "",
    confirmLabel: "Confirmar",
    variant: "danger",
    onConfirm: () => {},
  });

  // Submit Editar Usuario (ID-02)
  const handleEditarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setFormEditError("");

    if (!isEmailValid(formEditCorreo)) {
      setFormEditError("Ingresa un correo electrónico válido.");
      return;
    }

    const rolCambiado = formEditRol !== selectedUser.rol;
    const ambitoCambiado = formEditAmbito !== selectedUser.ambitoCodigo;

    if ((rolCambiado || ambitoCambiado) && (!formEditMotivo || formEditMotivo.trim().length < 5)) {
      setFormEditError("El motivo del cambio es obligatorio y debe tener al menos 5 caracteres cuando se modifica el rol o ámbito.");
      return;
    }

    setConfirmDialog({
      open: true,
      title: "¿Guardar cambios del usuario?",
      description: `¿Estás seguro de que deseas actualizar la información de ${selectedUser.nombreCompleto}? Los cambios de rol o ámbito quedarán asentados en la trazabilidad inalterable de auditoría.`,
      confirmLabel: "Sí, guardar cambios",
      onConfirm: () => {
        const res = editarUsuario(selectedUser.id, {
          nombreCompleto: formEditNombre,
          correo: formEditCorreo,
          rol: formEditRol,
          ambitoCodigo: formEditAmbito,
          motivoCambio: formEditMotivo,
          actor: currentUser.name,
        });

        if (!res.ok) {
          setFormEditError(res.error || "No se pudo actualizar el usuario.");
          return;
        }

        toast.success("Usuario actualizado exitosamente", {
          description: `Se actualizaron los datos de ${formEditNombre} y se registró la trazabilidad de auditoría.`,
        });
        setModalEditarOpen(false);
      },
    });
  };

  // Abrir Modal Suspender
  const handleOpenSuspender = (u: UsuarioInterno) => {
    setSelectedUser(u);
    setMotivoAccion("");
    setErrorAccion("");
    setModalSuspenderOpen(true);
  };

  // Submit Suspender Usuario
  const handleSuspenderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setErrorAccion("");

    if (!motivoAccion || motivoAccion.trim().length < 5) {
      setErrorAccion("Debes registrar una causa justificada de suspensión (mínimo 5 caracteres).");
      return;
    }

    setConfirmDialog({
      open: true,
      variant: "danger",
      title: "¿Confirmar suspensión de la cuenta interna?",
      description: `¿Estás seguro de que deseas suspender la cuenta de ${selectedUser.nombreCompleto}? Se cerrarán las sesiones activas de inmediato, se bloqueará el acceso y se impedirán nuevas asignaciones de trámites.`,
      confirmLabel: "Suspender cuenta",
      onConfirm: () => {
        const res = suspenderUsuario(selectedUser.id, motivoAccion, currentUser.name);
        if (!res.ok) {
          setErrorAccion(res.error || "Fallo en la operación. Se conserva el estado anterior.");
          return;
        }

        toast.success("Cuenta suspendida exitosamente", {
          description: `La cuenta de ${selectedUser.nombreCompleto} ha sido suspendida. Sesiones invalidadas y bloqueadas nuevas asignaciones.`,
        });
        setModalSuspenderOpen(false);
      },
    });
  };

  // Abrir Modal Reactivar
  const handleOpenReactivar = (u: UsuarioInterno) => {
    setSelectedUser(u);
    setMotivoAccion("");
    setErrorAccion("");
    setModalReactivarOpen(true);
  };

  // Submit Reactivar Usuario
  const handleReactivarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setErrorAccion("");

    if (!motivoAccion || motivoAccion.trim().length < 5) {
      setErrorAccion("Debes registrar el motivo de reactivación (mínimo 5 caracteres).");
      return;
    }

    // Validar factores configurados
    if (!selectedUser.totpConfigurado || !selectedUser.credencialesConfiguradas) {
      setErrorAccion("Condición incumplida: La cuenta carece de factor de autenticación configurado o validación de identidad. Se conserva el estado suspendido.");
      return;
    }

    setConfirmDialog({
      open: true,
      variant: "warning",
      title: "¿Confirmar reactivación de la cuenta interna?",
      description: `¿Deseas reactivar la cuenta de ${selectedUser.nombreCompleto}? Se dejará constancia en el expediente y se restaurará el ingreso al sistema.`,
      confirmLabel: "Reactivar cuenta",
      onConfirm: () => {
        const res = reactivarUsuario(selectedUser.id, motivoAccion, currentUser.name);
        if (!res.ok) {
          setErrorAccion(res.error || "Fallo en la reactivación. Se conserva el estado anterior.");
          return;
        }

        toast.success("Cuenta reactivada exitosamente", {
          description: `La cuenta de ${selectedUser.nombreCompleto} ha sido reactivada. Se registró el motivo en el expediente.`,
        });
        setModalReactivarOpen(false);
      },
    });
  };

  // Abrir Modal Baja Lógica
  const handleOpenBaja = (u: UsuarioInterno) => {
    setSelectedUser(u);
    setMotivoAccion("");
    setErrorAccion("");
    setModalBajaOpen(true);
  };

  // Submit Baja Lógica
  const handleBajaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setErrorAccion("");

    // Validación de Coordinador
    if (selectedUser.esCoordinadorInstitucionActiva) {
      setErrorAccion(`No es posible dar de baja: El usuario aún figura como Coordinador designado en ${selectedUser.institucionCoordinada || "una institución activa"}. Requiere trámite previo de sustitución o cambio de coordinador.`);
      return;
    }

    // Validación de tareas activas
    if (selectedUser.tareasActivas > 0) {
      const tareasTxt = selectedUser.detalleTareas?.length ? ` (${selectedUser.detalleTareas.join(", ")})` : "";
      setErrorAccion(`No es posible dar de baja: La cuenta registra ${selectedUser.tareasActivas} trámite(s) activo(s) pendientes de reasignación${tareasTxt}. Debe resolver o reasignar las tareas antes de proceder.`);
      return;
    }

    if (!motivoAccion || motivoAccion.trim().length < 10) {
      setErrorAccion("La justificación de desvinculación es obligatoria y debe tener al menos 10 caracteres.");
      return;
    }

    setConfirmDialog({
      open: true,
      variant: "danger",
      title: "¿Confirmar baja lógica de la cuenta interna?",
      description: `¿Estás seguro de que deseas retirar la cuenta de ${selectedUser.nombreCompleto}? La cuenta quedará inhabilitada de forma permanente y no podrá recibir asignaciones. Sus registros históricos se conservarán intactos sin borrado físico.`,
      confirmLabel: "Dar de baja",
      onConfirm: () => {
        const res = darDeBajaUsuario(selectedUser.id, motivoAccion, currentUser.name);
        if (!res.ok) {
          setErrorAccion(res.error || "Fallo en la reasignación o retiro. No se ejecuta la baja parcial.");
          return;
        }

        toast.success("Baja lógica procesada exitosamente", {
          description: `La cuenta de ${selectedUser.nombreCompleto} ha sido pasada a estado inactivo. Su histórico permanece inalterable.`,
        });
        setModalBajaOpen(false);
      },
    });
  };

  // Abrir Detalle y Auditoría
  const handleOpenDetalle = (u: UsuarioInterno) => {
    setSelectedUser(u);
    setActiveDetailTab("info");
    setModalDetalleOpen(true);
  };

  // Helper de badges de estado
  const getEstadoBadge = (estado: EstadoUsuario) => {
    switch (estado) {
      case "ACTIVO":
        return (
          <Badge tone="success" appearance="soft" size="sm" dot className="font-semibold">
            Activo
          </Badge>
        );
      case "PENDIENTE_ACTIVACION":
        return (
          <Badge tone="warning" appearance="soft" size="sm" dot className="font-semibold">
            Pendiente de activación
          </Badge>
        );
      case "SUSPENDIDO":
        return (
          <Badge tone="danger" appearance="soft" size="sm" dot className="font-semibold">
            Suspendido
          </Badge>
        );
      case "RETIRADO":
        return (
          <Badge tone="neutral" appearance="soft" size="sm" dot className="font-semibold">
            Baja lógica
          </Badge>
        );
    }
  };

  // Helper de badges de rol con colores diferenciados según jerarquía y área
  const getRolBadge = (rol: RolInterno, label: string) => {
    switch (rol) {
      case "ADMIN":
        return (
          <Badge tone="danger" appearance="soft" size="sm" className="font-semibold text-[11px] truncate max-w-full inline-flex">
            <span className="truncate">{label}</span>
          </Badge>
        );
      case "DIR_GESTION":
        return (
          <Badge tone="primary" appearance="soft" size="sm" className="font-semibold text-[11px] truncate max-w-full inline-flex">
            <span className="truncate">{label}</span>
          </Badge>
        );
      case "EQ_GESTION":
        return (
          <Badge tone="info" appearance="soft" size="sm" className="font-semibold text-[11px] truncate max-w-full inline-flex">
            <span className="truncate">{label}</span>
          </Badge>
        );
      case "DIR_NORMATIVA":
        return (
          <Badge tone="secondary" appearance="soft" size="sm" className="font-semibold text-[11px] truncate max-w-full inline-flex">
            <span className="truncate">{label}</span>
          </Badge>
        );
      case "EQ_NORMATIVA":
        return (
          <Badge tone="warning" appearance="soft" size="sm" className="font-semibold text-[11px] truncate max-w-full inline-flex">
            <span className="truncate">{label}</span>
          </Badge>
        );
      case "DTD":
        return (
          <Badge tone="success" appearance="soft" size="sm" className="font-semibold text-[11px] truncate max-w-full inline-flex">
            <span className="truncate">{label}</span>
          </Badge>
        );
      case "DPI":
        return (
          <Badge tone="primary" appearance="outline" size="sm" className="font-semibold text-[11px] truncate max-w-full inline-flex">
            <span className="truncate">{label}</span>
          </Badge>
        );
      case "APROBADOR":
        return (
          <Badge tone="success" appearance="outline" size="sm" className="font-semibold text-[11px] truncate max-w-full inline-flex">
            <span className="truncate">{label}</span>
          </Badge>
        );
      case "FACTURACION":
        return (
          <Badge tone="secondary" appearance="outline" size="sm" className="font-semibold text-[11px] truncate max-w-full inline-flex">
            <span className="truncate">{label}</span>
          </Badge>
        );
      default:
        return (
          <Badge tone="neutral" appearance="soft" size="sm" className="font-semibold text-[11px] truncate max-w-full inline-flex">
            <span className="truncate">{label}</span>
          </Badge>
        );
    }
  };

  // Helper para mapear evento de auditoría a TimelineItem con icono y status exacto
  const mapEventoToTimelineItem = (log: any): TimelineItem => {
    let icon = <KeyRound className="size-4" />;
    let status: TimelineItem["status"] = "primary";

    if (log.resultado !== "Éxito") {
      status = "danger";
      icon = <AlertTriangle className="size-4" />;
    } else if (log.evento === "BLOQUEO") {
      status = "danger";
      icon = <ShieldAlert className="size-4" />;
    } else if (log.evento === "SUSPENSION" || log.evento === "BAJA_LOGICA") {
      status = "danger";
      icon = log.evento === "SUSPENSION" ? <Ban className="size-4" /> : <UserX className="size-4" />;
    } else if (log.evento === "ACTIVACION" || log.evento === "REACTIVACION") {
      status = "success";
      icon = <ShieldCheck className="size-4" />;
    } else if (log.evento === "CAMBIO_COORDINADOR") {
      status = "info";
      icon = <UserCheck className="size-4" />;
    } else if (log.evento === "CREDENCIALES_API_REVOCADAS") {
      status = "warning";
      icon = <Lock className="size-4" />;
    } else if (log.evento === "CUENTA_CREADA") {
      status = "primary";
      icon = <UserPlus className="size-4" />;
    } else if (log.evento === "CAMBIO_ROL") {
      status = "primary";
      icon = <Briefcase className="size-4" />;
    } else if (log.evento === "RECUPERACION") {
      status = "info";
      icon = <RotateCcw className="size-4" />;
    } else {
      status = "neutral";
      icon = <CheckCircle2 className="size-4" />;
    }

    const descParts: string[] = [];
    if (log.detalles) descParts.push(log.detalles);
    if (log.motivo) descParts.push(`Causa/Motivo: ${log.motivo}`);
    if (log.valorAnterior && log.valorNuevo) {
      descParts.push(`Transición: "${log.valorAnterior}" → "${log.valorNuevo}"`);
    }

    return {
      id: log.id,
      title: log.eventoLabel,
      description: descParts.join(" • "),
      date: log.fecha,
      user: log.actor,
      status,
      statusLabel: log.resultado,
      icon,
    };
  };

  // Timeline items filtrados para el modal de detalle del usuario (ID-05)
  const timelineItems: TimelineItem[] = useMemo(() => {
    if (!selectedUser) return [];
    let logs = auditoria.filter(
      (a) =>
        a.usuarioAfectadoId === selectedUser.id ||
        a.usuarioAfectadoCedula === selectedUser.cedula
    );

    // Filtro por tipo de evento
    if (filtroAuditTipo !== "TODOS") {
      logs = logs.filter((a) => a.evento === filtroAuditTipo);
    }

    // Filtro por período según HU 2.1
    if (filtroAuditPeriodo === "7D") {
      logs = logs.filter((a) => a.fecha.includes("09/2026") || a.fecha.includes("2026"));
    } else if (filtroAuditPeriodo === "30D") {
      logs = logs.filter((a) => a.fecha.includes("09/2026") || a.fecha.includes("08/2026"));
    } else if (filtroAuditPeriodo === "2026") {
      logs = logs.filter((a) => a.fecha.includes("2026"));
    }

    return logs.map(mapEventoToTimelineItem);
  }, [selectedUser, auditoria, filtroAuditTipo, filtroAuditPeriodo]);

  return (
    <WireframeDashboardLayout
      activeMenu="administracion-usuarios"
      currentUser={currentUser}
      breadcrumbs={[
        { label: "Gestión de cuentas internas" },
      ]}
    >
      <main className="w-full pr-3 pl-2 pb-3 pt-1.5 flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* ── 1. Contenedor Principal (Tarjetas, Encabezado y Tabla) ── */}
        <Card
          className="bg-surface rounded-2xl border border-border shadow-xs flex-1 min-h-0 overflow-hidden flex flex-col my-0"
          innerClassName="p-4 sm:p-6 lg:p-8 pr-6 sm:pr-8 lg:pr-10 flex flex-col gap-6 overflow-y-auto flex-1 min-h-0 w-full"
        >
          {/* ── 1. Encabezado Principal ── */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
            <div className="space-y-1 min-w-0 flex-1">
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight text-primary">
                Gestión de cuentas internas
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground w-full max-w-none leading-relaxed font-normal">
                Administra las cuentas internas, roles, ámbitos y estados de acceso al Portal.
              </p>
            </div>

            {/* Acciones de Cabecera: Crear cuenta */}
            <div className="flex flex-wrap items-center justify-end gap-2 shrink-0 sm:self-center">
              <Button
                variant="primary"
                size="default"
                onClick={() => setModalCrearOpen(true)}
                className="gap-2 shadow-xs cursor-pointer font-semibold text-xs whitespace-nowrap"
              >
                <UserPlus className="size-4" />
                <span>+ Crear cuenta interna</span>
              </Button>
            </div>
          </div>

          {/* ── 2. Cards de Resumen Compactas (4 Estados del Ciclo de Vida) ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 w-full">
            {/* Activos */}
            <Card
              variant="featured"
              role="button"
              tabIndex={0}
              onClick={() => {
                setFilterEstado(filterEstado === "ACTIVO" ? "TODOS" : "ACTIVO");
                setCurrentPage(1);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setFilterEstado(filterEstado === "ACTIVO" ? "TODOS" : "ACTIVO");
                  setCurrentPage(1);
                }
              }}
              className={cn(
                "group relative overflow-hidden cursor-pointer transition-all duration-200 border rounded-xl outline-none select-none p-4 sm:p-4.5 w-full",
                "hover:-translate-y-0.5 hover:shadow-md",
                filterEstado === "ACTIVO"
                  ? "bg-success/15 border-success ring-2 ring-success/40 shadow-xs"
                  : "bg-success/5 hover:bg-success/10 border-success/25 shadow-2xs"
              )}
              innerClassName="p-0 h-full justify-center"
            >
              <div className="flex items-center justify-between gap-3 w-full">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      "size-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200",
                      filterEstado === "ACTIVO"
                        ? "bg-success text-white shadow-xs"
                        : "bg-success/15 text-success group-hover:scale-105 group-hover:bg-success group-hover:text-white"
                    )}
                  >
                    <UserCheck className="size-5" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-sm font-bold text-foreground group-hover:text-success transition-colors truncate">
                        Activos
                      </h3>
                      {filterEstado === "ACTIVO" && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-success/20 text-success border border-success/30 shrink-0">
                          Activo
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground font-normal truncate">
                      Con acceso habilitado
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2">
                  <span className="font-heading font-extrabold text-3xl sm:text-4xl text-success tracking-tight block leading-none">
                    {kpis.activos}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-muted-foreground font-medium block mt-1">
                    usuarios
                  </span>
                </div>
              </div>
            </Card>

            {/* Pendientes de activación */}
            <Card
              variant="featured"
              role="button"
              tabIndex={0}
              onClick={() => {
                setFilterEstado(filterEstado === "PENDIENTE_ACTIVACION" ? "TODOS" : "PENDIENTE_ACTIVACION");
                setCurrentPage(1);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setFilterEstado(filterEstado === "PENDIENTE_ACTIVACION" ? "TODOS" : "PENDIENTE_ACTIVACION");
                  setCurrentPage(1);
                }
              }}
              className={cn(
                "group relative overflow-hidden cursor-pointer transition-all duration-200 border rounded-xl outline-none select-none p-4 sm:p-4.5 w-full",
                "hover:-translate-y-0.5 hover:shadow-md",
                filterEstado === "PENDIENTE_ACTIVACION"
                  ? "bg-warning/15 border-warning ring-2 ring-warning/40 shadow-xs"
                  : "bg-warning/5 hover:bg-warning/10 border-warning/25 shadow-2xs"
              )}
              innerClassName="p-0 h-full justify-center"
            >
              <div className="flex items-center justify-between gap-3 w-full">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      "size-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200",
                      filterEstado === "PENDIENTE_ACTIVACION"
                        ? "bg-warning text-white shadow-xs"
                        : "bg-warning/15 text-warning group-hover:scale-105 group-hover:bg-warning group-hover:text-white"
                    )}
                  >
                    <Clock className="size-5" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-sm font-bold text-foreground group-hover:text-warning transition-colors truncate">
                        Pendientes de activación
                      </h3>
                      {filterEstado === "PENDIENTE_ACTIVACION" && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-warning/20 text-warning border border-warning/30 shrink-0">
                          Activo
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground font-normal truncate">
                      Requieren completar activación
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2">
                  <span className="font-heading font-extrabold text-3xl sm:text-4xl text-warning tracking-tight block leading-none">
                    {kpis.pendientes}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-muted-foreground font-medium block mt-1">
                    usuarios
                  </span>
                </div>
              </div>
            </Card>

            {/* Suspendidos */}
            <Card
              variant="featured"
              role="button"
              tabIndex={0}
              onClick={() => {
                setFilterEstado(filterEstado === "SUSPENDIDO" ? "TODOS" : "SUSPENDIDO");
                setCurrentPage(1);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setFilterEstado(filterEstado === "SUSPENDIDO" ? "TODOS" : "SUSPENDIDO");
                  setCurrentPage(1);
                }
              }}
              className={cn(
                "group relative overflow-hidden cursor-pointer transition-all duration-200 border rounded-xl outline-none select-none p-4 sm:p-4.5 w-full",
                "hover:-translate-y-0.5 hover:shadow-md",
                filterEstado === "SUSPENDIDO"
                  ? "bg-danger/15 border-danger ring-2 ring-danger/40 shadow-xs"
                  : "bg-danger/5 hover:bg-danger/10 border-danger/25 shadow-2xs"
              )}
              innerClassName="p-0 h-full justify-center"
            >
              <div className="flex items-center justify-between gap-3 w-full">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      "size-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200",
                      filterEstado === "SUSPENDIDO"
                        ? "bg-danger text-white shadow-xs"
                        : "bg-danger/15 text-danger group-hover:scale-105 group-hover:bg-danger group-hover:text-white"
                    )}
                  >
                    <Ban className="size-5" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-sm font-bold text-foreground group-hover:text-danger transition-colors truncate">
                        Suspendidos
                      </h3>
                      {filterEstado === "SUSPENDIDO" && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-danger/20 text-danger border border-danger/30 shrink-0">
                          Activo
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground font-normal truncate">
                      Acceso bloqueado
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2">
                  <span className="font-heading font-extrabold text-3xl sm:text-4xl text-danger tracking-tight block leading-none">
                    {kpis.suspendidos}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-muted-foreground font-medium block mt-1">
                    usuarios
                  </span>
                </div>
              </div>
            </Card>

            {/* Retirados */}
            <Card
              variant="featured"
              role="button"
              tabIndex={0}
              onClick={() => {
                setFilterEstado(filterEstado === "RETIRADO" ? "TODOS" : "RETIRADO");
                setCurrentPage(1);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setFilterEstado(filterEstado === "RETIRADO" ? "TODOS" : "RETIRADO");
                  setCurrentPage(1);
                }
              }}
              className={cn(
                "group relative overflow-hidden cursor-pointer transition-all duration-200 border rounded-xl outline-none select-none p-4 sm:p-4.5 w-full",
                "hover:-translate-y-0.5 hover:shadow-md",
                filterEstado === "RETIRADO"
                  ? "bg-primary/15 border-primary ring-2 ring-primary/40 shadow-xs"
                  : "bg-primary/5 hover:bg-primary/10 border-primary/25 shadow-2xs"
              )}
              innerClassName="p-0 h-full justify-center"
            >
              <div className="flex items-center justify-between gap-3 w-full">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      "size-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200",
                      filterEstado === "RETIRADO"
                        ? "bg-primary text-white shadow-xs"
                        : "bg-primary/15 text-primary group-hover:scale-105 group-hover:bg-primary group-hover:text-white"
                    )}
                  >
                    <UserX className="size-5" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                        Baja lógica
                      </h3>
                      {filterEstado === "RETIRADO" && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-primary/20 text-primary border border-primary/30 shrink-0">
                          Activo
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground font-normal truncate">
                      Sin acceso · historial conservado
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2">
                  <span className="font-heading font-extrabold text-3xl sm:text-4xl text-primary tracking-tight block leading-none">
                    {kpis.retirados}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-muted-foreground font-medium block mt-1">
                    usuarios
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* ── Línea separadora entre KPI Cards y Filtros ── */}
          <div className="w-full h-[1.5px] bg-border my-4 shrink-0" />

          {/* ── 3. Buscador y Filtros por Combobox en Una Fila Sin Caja ── */}
          <div className="space-y-3">
            <div className="flex flex-col xl:flex-row gap-3 items-stretch xl:items-end justify-between w-full">
            {/* Buscador amplio con bordes redondeados completos */}
            <div className="flex-1 min-w-[280px]">
              <Search
                placeholder="Buscar por cédula, nombre completo o correo institucional..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                onClear={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="bg-surface border-border/80 shadow-2xs h-9 text-xs w-full rounded-full"
              />
            </div>

            {/* Filtros Selectores con ancho amplio y redondeo completo */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
              {/* Filtro Rol */}
              <div className="w-full sm:w-[220px]">
                <Combobox
                  items={[
                    { value: "TODOS", label: "Todos los roles" },
                    ...ROLES_INTERNOS_CATALOGO.map((r) => ({
                      value: r.id,
                      label: r.nombre,
                    })),
                  ]}
                  value={{
                    value: filterRol,
                    label:
                      filterRol === "TODOS"
                        ? "Todos los roles"
                        : ROLES_INTERNOS_CATALOGO.find((r) => r.id === filterRol)?.nombre || filterRol,
                  }}
                  onValueChange={(item) => {
                    if (item) {
                      setFilterRol(item.value);
                      setCurrentPage(1);
                    }
                  }}
                >
                  <ComboboxSelectTrigger className="h-9 text-xs w-full bg-surface border-border/80 rounded-full px-3.5 shadow-2xs" />
                  <ComboboxContent className="min-w-[260px] rounded-xl">
                    <ComboboxList>
                      <ComboboxItem value={{ value: "TODOS", label: "Todos los roles" }}>
                        Todos los roles
                      </ComboboxItem>
                      {ROLES_INTERNOS_CATALOGO.map((r) => (
                        <ComboboxItem key={r.id} value={{ value: r.id, label: r.nombre }}>
                          {r.nombre}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </div>

              {/* Filtro Ámbito */}
              <div className="w-full sm:w-[240px]">
                <Combobox
                  items={[
                    { value: "TODOS", label: "Todos los ámbitos" },
                    ...ambitosDisponibles.map((a) => ({ value: a, label: a })),
                  ]}
                  value={{
                    value: filterAmbito,
                    label: filterAmbito === "TODOS" ? "Todos los ámbitos" : filterAmbito,
                  }}
                  onValueChange={(item) => {
                    if (item) {
                      setFilterAmbito(item.value);
                      setCurrentPage(1);
                    }
                  }}
                >
                  <ComboboxSelectTrigger className="h-9 text-xs w-full bg-surface border-border/80 rounded-full px-3.5 shadow-2xs" />
                  <ComboboxContent className="min-w-[280px] rounded-xl">
                    <ComboboxList>
                      <ComboboxItem value={{ value: "TODOS", label: "Todos los ámbitos" }}>
                        Todos los ámbitos
                      </ComboboxItem>
                      {ambitosDisponibles.map((a) => (
                        <ComboboxItem key={a} value={{ value: a, label: a }}>
                          {a}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </div>

              {/* Filtro Estado */}
              <div className="w-full sm:w-[200px]">
                <Combobox
                  items={[
                    { value: "TODOS", label: "Todos los estados" },
                    { value: "ACTIVO", label: "Activos" },
                    { value: "PENDIENTE_ACTIVACION", label: "Pendientes de activación" },
                    { value: "SUSPENDIDO", label: "Suspendidos" },
                    { value: "RETIRADO", label: "Baja lógica" },
                  ]}
                  value={{
                    value: filterEstado,
                    label:
                      filterEstado === "TODOS"
                        ? "Todos los estados"
                        : filterEstado === "ACTIVO"
                        ? "Activos"
                        : filterEstado === "PENDIENTE_ACTIVACION"
                        ? "Pendientes de activación"
                        : filterEstado === "SUSPENDIDO"
                        ? "Suspendidos"
                        : "Baja lógica",
                  }}
                  onValueChange={(item) => {
                    if (item) {
                      setFilterEstado(item.value);
                      setCurrentPage(1);
                    }
                  }}
                >
                  <ComboboxSelectTrigger className="h-9 text-xs w-full bg-surface border-border/80 rounded-full px-3.5 shadow-2xs" />
                  <ComboboxContent className="min-w-[220px] rounded-xl">
                    <ComboboxList>
                      <ComboboxItem value={{ value: "TODOS", label: "Todos los estados" }}>
                        Todos los estados
                      </ComboboxItem>
                      <ComboboxItem value={{ value: "ACTIVO", label: "Activos" }}>
                        Activos
                      </ComboboxItem>
                      <ComboboxItem value={{ value: "PENDIENTE_ACTIVACION", label: "Pendientes de activación" }}>
                        Pendientes de activación
                      </ComboboxItem>
                      <ComboboxItem value={{ value: "SUSPENDIDO", label: "Suspendidos" }}>
                        Suspendidos
                      </ComboboxItem>
                      <ComboboxItem value={{ value: "RETIRADO", label: "Baja lógica" }}>
                        Baja lógica
                      </ComboboxItem>
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </div>

              {/* Botón limpiar filtros */}
              {(searchQuery || filterRol !== "TODOS" || filterAmbito !== "TODOS" || filterEstado !== "TODOS") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setFilterRol("TODOS");
                    setFilterAmbito("TODOS");
                    setFilterEstado("TODOS");
                    setCurrentPage(1);
                  }}
                  className="h-9 text-xs text-muted-foreground hover:text-foreground cursor-pointer px-3 shrink-0 rounded-full"
                >
                  Limpiar filtros
                </Button>
              )}
            </div>
          </div>
          </div>

          {/* ── 4. Tabla de Usuarios (Desktop md+) ── */}
          <div className="hidden md:block w-full">
            <Table className="w-full min-w-[1120px] table-fixed" containerClassName="w-full overflow-x-auto rounded-xl pb-2 pr-2">
              <TableHeader>
                <TableRow className="border-0 h-11">
                  <TableHead className="w-[210px] px-3 py-2.5 whitespace-nowrap text-white font-bold text-xs">
                    USUARIO / PERSONA
                  </TableHead>
                  <TableHead className="w-[110px] px-3 py-2.5 whitespace-nowrap text-white font-bold text-xs">
                    CÉDULA
                  </TableHead>
                  <TableHead className="w-[220px] px-3 py-2.5 whitespace-nowrap text-white font-bold text-xs">
                    CORREO INSTITUCIONAL
                  </TableHead>
                  <TableHead className="w-[170px] px-3 py-2.5 whitespace-nowrap text-white font-bold text-xs">
                    ROL ASIGNADO
                  </TableHead>
                  <TableHead className="w-[170px] px-3 py-2.5 whitespace-nowrap text-white font-bold text-xs">
                    ÁMBITO INSTITUCIONAL
                  </TableHead>
                  <TableHead className="w-[110px] px-3 py-2.5 whitespace-nowrap text-white font-bold text-xs">
                    ESTADO
                  </TableHead>
                  <TableHead className="w-[140px] px-3 py-2.5 whitespace-nowrap text-white font-bold text-xs">
                    ÚLTIMA ACTUALIZACIÓN
                  </TableHead>
                  <TableHead className="w-24 text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsuarios.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <Users className="size-8 stroke-[1.5] text-muted-foreground/60" />
                        <p className="text-sm font-medium">No se encontraron cuentas de usuario</p>
                        <p className="text-xs">
                          Ajusta los filtros de búsqueda o registra un nuevo usuario interno.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsuarios.map((u) => (
                    <TableRow key={u.id} className="hover:bg-muted/20 transition-colors">
                      {/* Usuario */}
                      <TableCell className="px-3 py-2.5 overflow-hidden">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex flex-col min-w-0 cursor-default">
                              <span className="text-xs font-bold text-foreground truncate">
                                {u.nombreCompleto}
                              </span>
                              <span className="text-[10px] text-muted-foreground font-mono truncate">
                                ID: {u.id}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs break-words">
                            <p className="font-bold text-xs">{u.nombreCompleto}</p>
                            <p className="text-[10px] text-muted-foreground font-mono">ID interno: {u.id}</p>
                            <p className="text-[10px] text-muted-foreground font-mono">Cédula: {u.cedula}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>

                      {/* Cédula */}
                      <TableCell className="px-3 py-2.5 text-xs font-mono font-medium text-foreground whitespace-nowrap">
                        {u.cedula}
                      </TableCell>

                      {/* Correo */}
                      <TableCell className="px-3 py-2.5 overflow-hidden">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1.5 text-xs text-foreground/80 min-w-0 cursor-default">
                              <Mail className="size-3 text-muted-foreground shrink-0" />
                              <span className="truncate">{u.correo}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs break-all">
                            <p className="text-xs font-medium">{u.correo}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>

                      {/* Rol */}
                      <TableCell className="px-3 py-2.5 overflow-hidden">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="inline-flex max-w-full cursor-default">
                              {getRolBadge(u.rol, u.rolLabel)}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <p className="text-xs font-bold">{u.rolLabel}</p>
                            <p className="text-[10px] text-muted-foreground">Código de rol: {u.rol}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>

                      {/* Ámbito */}
                      <TableCell className="px-3 py-2.5 text-xs text-muted-foreground overflow-hidden">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="truncate block cursor-default">
                              {u.ambito}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs break-words">
                            <p className="text-xs font-medium">{u.ambito}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>

                      {/* Estado */}
                      <TableCell className="px-3 py-2.5 whitespace-nowrap overflow-hidden">
                        <div className="inline-flex min-w-0">
                          {getEstadoBadge(u.estado)}
                        </div>
                      </TableCell>

                      {/* Última Actualización */}
                      <TableCell className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                        {u.ultimaActualizacion || u.fechaCreacion}
                      </TableCell>

                      {/* Acciones */}
                      <TableCell className="py-2.5 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-3">
                          {/* Ver detalle y auditoría */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button type="button" onClick={() => handleOpenDetalle(u)} aria-label={`Ver detalle de ${u.nombreCompleto}`} variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-primary-300 hover:bg-primary-300/10">
                                <Eye className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">Ver detalle y expediente</TooltipContent>
                          </Tooltip>

                          {/* Editar cuenta interna */}
                          {u.estado !== "RETIRADO" && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button type="button" onClick={() => handleOpenEditar(u)} aria-label={`Editar cuenta interna de ${u.nombreCompleto}`} variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-primary-300 hover:bg-primary-300/10">
                                  <Edit2 className="size-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top">Editar cuenta interna</TooltipContent>
                            </Tooltip>
                          )}

                          {/* Suspender cuenta interna (si está activo) */}
                          {u.estado === "ACTIVO" && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button type="button" onClick={() => handleOpenSuspender(u)} aria-label={`Suspender cuenta interna de ${u.nombreCompleto}`} variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-warning hover:bg-warning/10">
                                  <Ban className="size-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top">Suspender cuenta interna</TooltipContent>
                            </Tooltip>
                          )}

                          {/* Reactivar cuenta interna (si está suspendido) */}
                          {u.estado === "SUSPENDIDO" && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button type="button" onClick={() => handleOpenReactivar(u)} aria-label={`Reactivar cuenta interna de ${u.nombreCompleto}`} variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-success hover:bg-success/10">
                                  <RotateCcw className="size-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top">Reactivar cuenta interna</TooltipContent>
                            </Tooltip>
                          )}

                          {/* Dar de baja a cuenta interna (si no está ya retirado) */}
                          {u.estado !== "RETIRADO" && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button type="button" onClick={() => handleOpenBaja(u)} aria-label={`Dar de baja a cuenta interna de ${u.nombreCompleto}`} variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-danger hover:bg-danger/10">
                                  <UserX className="size-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top">Dar de baja a cuenta interna</TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* ── 4.1 Vista Mobile Cards (<md) ── */}
          <div className="block md:hidden w-full space-y-3">
            {paginatedUsuarios.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 bg-surface border border-border rounded-xl text-center space-y-2">
                <Users className="size-8 stroke-[1.5] text-muted-foreground/60" />
                <p className="text-sm font-semibold text-foreground">No se encontraron cuentas de usuario</p>
                <p className="text-xs text-muted-foreground">
                  Ajusta los filtros de búsqueda o registra un nuevo usuario interno.
                </p>
              </div>
            ) : (
              paginatedUsuarios.map((u) => (
                <div
                  key={u.id}
                  className="p-4 rounded-xl border border-border bg-surface space-y-3 text-left transition-all duration-200 hover:border-primary/40 hover:shadow-2xs"
                >
                  {/* Encabezado Card: Nombre + ID + Badge de Estado */}
                  <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-border/60">
                    <div className="min-w-0 space-y-0.5">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="text-sm font-bold text-foreground leading-snug line-clamp-1 cursor-default">
                            {u.nombreCompleto}
                          </p>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs break-words">
                          <p className="font-bold text-xs">{u.nombreCompleto}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">ID interno: {u.id}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">Cédula: {u.cedula}</p>
                        </TooltipContent>
                      </Tooltip>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                        <span>{u.id}</span>
                        <span>•</span>
                        <span>C.I. {u.cedula}</span>
                      </div>
                    </div>
                    <div className="shrink-0">
                      {getEstadoBadge(u.estado)}
                    </div>
                  </div>

                  {/* Cuerpo Card: Rol, Ámbito, Correo y Último Acceso */}
                  <div className="space-y-2 text-xs">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1.5 text-muted-foreground truncate cursor-default">
                          <Mail className="size-3.5 text-muted-foreground shrink-0" />
                          <span className="truncate text-foreground/90">{u.correo}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs break-all">
                        <p className="text-xs font-medium">{u.correo}</p>
                      </TooltipContent>
                    </Tooltip>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <span className="text-[11px] text-muted-foreground">Rol:</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="inline-flex max-w-[70%] cursor-default">
                            {getRolBadge(u.rol, u.rolLabel)}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <p className="text-xs font-bold">{u.rolLabel}</p>
                          <p className="text-[10px] text-muted-foreground">Código de rol: {u.rol}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] text-muted-foreground">Ámbito:</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-xs font-medium text-foreground text-right truncate max-w-[60%] cursor-default">
                            {u.ambito}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs break-words">
                          <p className="text-xs font-medium">{u.ambito}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] text-muted-foreground">Última actualización:</span>
                      <span className="text-[11px] text-muted-foreground">
                        {u.ultimaActualizacion || u.fechaCreacion}
                      </span>
                    </div>
                  </div>

                  {/* Pie Card: Botones de Acción */}
                  <div className="flex items-center justify-end gap-1.5 pt-2.5 border-t border-border/60">
                    {/* Ver detalle */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDetalle(u)}
                      className="h-8 px-2.5 text-xs rounded-lg border-border/80 text-foreground hover:bg-muted gap-1.5"
                    >
                      <Eye className="size-3.5 text-muted-foreground" />
                      <span>Expediente</span>
                    </Button>

                    {/* Editar */}
                    {u.estado !== "RETIRADO" && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEditar(u)}
                        className="h-8 px-2.5 text-xs rounded-lg border-border/80 text-primary hover:bg-primary/10 gap-1.5"
                      >
                        <Edit2 className="size-3.5 text-primary" />
                        <span>Editar</span>
                      </Button>
                    )}

                    {/* Suspender */}
                    {u.estado === "ACTIVO" && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenSuspender(u)}
                        className="h-8 px-2.5 text-xs rounded-lg border-border/80 text-warning hover:bg-warning/10 gap-1.5"
                      >
                        <Ban className="size-3.5 text-warning" />
                        <span>Suspender</span>
                      </Button>
                    )}

                    {/* Reactivar */}
                    {u.estado === "SUSPENDIDO" && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenReactivar(u)}
                        className="h-8 px-2.5 text-xs rounded-lg border-border/80 text-success hover:bg-success/10 gap-1.5"
                      >
                        <RotateCcw className="size-3.5 text-success" />
                        <span>Reactivar</span>
                      </Button>
                    )}

                    {/* Dar de baja a cuenta interna */}
                    {u.estado !== "RETIRADO" && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenBaja(u)}
                        className="h-8 px-2.5 text-xs rounded-lg border-border/80 text-danger hover:bg-danger/10 gap-1.5"
                      >
                        <UserX className="size-3.5 text-danger" />
                        <span>Dar de baja</span>
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

            {/* Paginación UI Kit */}
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-3 sm:gap-4 pt-4 pb-2 w-full border-t border-border/50">
              {/* Información de registros a la izquierda */}
              <div className="flex items-center justify-center md:justify-start w-full md:w-auto text-center md:text-left">
                <p className="text-xs text-muted-foreground font-medium text-center md:text-left">
                  Mostrando{" "}
                  <span className="font-bold text-foreground">
                    {filteredUsuarios.length === 0
                      ? 0
                      : (currentPage - 1) * pageSize + 1}{" "}
                    - {Math.min(currentPage * pageSize, filteredUsuarios.length)}
                  </span>{" "}
                  de{" "}
                  <span className="font-bold text-foreground">
                    {filteredUsuarios.length}
                  </span>{" "}
                  cuentas registradas
                </p>
              </div>

              {/* Selector de filas por página + Controles de paginación a la derecha */}
              <div className="w-full md:w-auto flex flex-wrap items-center justify-center md:justify-end gap-3 sm:gap-4 overflow-x-auto py-1">
                {/* Selector de filas por página */}
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <span>Filas:</span>
                  <div className="inline-flex rounded-full border border-border/80 p-0.5 bg-surface shadow-2xs">
                    {[5, 10, 20, 50].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          setPageSize(size);
                          setCurrentPage(1);
                        }}
                        className={cn(
                          "px-2.5 py-0.5 text-xs font-semibold rounded-full transition-all cursor-pointer",
                          pageSize === size
                            ? "bg-surface text-primary shadow-2xs font-bold border border-border/80"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <Pagination className="mx-auto md:mx-0 w-auto justify-center">
                  <PaginationContent className="gap-1 sm:gap-1.5 flex-nowrap justify-center">
                    <PaginationItem className="hidden sm:inline-flex">
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

                    <PaginationItem className="hidden sm:inline-flex">
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
      </main>

      {/* ══════════════════════════════════════════════════════════
          MODAL 1: CREAR CUENTA INTERNA (ID-01)
         ══════════════════════════════════════════════════════════ */}
      <Dialog open={modalCrearOpen} onOpenChange={handleCloseModalCrear}>
        <DialogContent variant="standard" size="lg" className="p-6 rounded-2xl border-border bg-surface">
          <DialogHeader className="border-b border-border/60 pb-3">
            <DialogTitle className="font-heading font-extrabold text-xl text-primary">
              Crear cuenta interna
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Define los datos de identidad, rol institucional y ámbito de la persona. Se validarán duplicados y coherencia antes de registrarla en estado PENDIENTE DE ACTIVACIÓN.
            </DialogDescription>
          </DialogHeader>

          {formCrearSuccess ? (
            <div className="py-6 space-y-4 text-center">
              <div className="size-14 rounded-full bg-success/15 text-success mx-auto flex items-center justify-center">
                <CheckCircle2 className="size-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-bold text-lg text-foreground">
                  Usuario registrado exitosamente
                </h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  La cuenta para <strong>{formCrearSuccess.nombreCompleto}</strong> (Cédula: {formCrearSuccess.cedula}) quedó en estado:
                </p>
                <div className="pt-2">
                  <Badge tone="warning" appearance="soft" size="md" dot className="font-bold">
                    PENDIENTE DE ACTIVACIÓN
                  </Badge>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-muted/40 border border-border text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rol institucional:</span>
                  <span className="font-semibold text-foreground">{formCrearSuccess.rolLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ámbito asignado:</span>
                  <span className="font-semibold text-foreground">{formCrearSuccess.ambito}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Correo destinatario:</span>
                  <span className="font-semibold text-foreground">{formCrearSuccess.correo}</span>
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground">
                Se ha remitido una notificación al correo electrónico indicado con el enlace seguro para el establecimiento de contraseña y vinculación del segundo factor (TOTP).
              </p>

              <div className="pt-4 flex justify-center">
                <Button variant="primary" size="default" onClick={handleCloseModalCrear}>
                  Entendido y volver al listado
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCrearSubmit} className="space-y-4 pt-2">
              {formCrearError && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{formCrearError}</span>
                </div>
              )}

              {/* Grid 2 columnas desktop / 1 mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cédula */}
                <div className="space-y-1.5">
                  <Label htmlFor="crear-cedula" className="text-xs font-semibold text-foreground">
                    Cédula de Identidad <span className="text-warning">*</span>
                  </Label>
                  <InputGroup leftIcon={<Fingerprint className="size-4 text-muted-foreground" />}>
                    <InputGroupInput
                      id="crear-cedula"
                      type="text"
                      maxLength={10}
                      placeholder="10 dígitos numéricos"
                      value={formCrearCedula}
                      onChange={(e) => setFormCrearCedula(e.target.value.replace(/\D/g, ""))}
                      className="text-xs font-mono"
                      required
                    />
                  </InputGroup>
                  <span className="text-[10px] text-muted-foreground">
                    Obligatoria e inmutable una vez creada.
                  </span>
                </div>

                {/* Nombre Completo */}
                <div className="space-y-1.5">
                  <Label htmlFor="crear-nombre" className="text-xs font-semibold text-foreground">
                    Nombre Completo / Funcionario <span className="text-warning">*</span>
                  </Label>
                  <InputGroup leftIcon={<Users className="size-4 text-muted-foreground" />}>
                    <InputGroupInput
                      id="crear-nombre"
                      type="text"
                      placeholder="Ej. Ing. Juan Carlos Pérez"
                      value={formCrearNombre}
                      onChange={(e) => setFormCrearNombre(e.target.value)}
                      className="text-xs"
                      required
                    />
                  </InputGroup>
                </div>

                {/* Correo Electrónico Institucional */}
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="crear-correo" className="text-xs font-semibold text-foreground">
                    Correo Electrónico Institucional <span className="text-warning">*</span>
                  </Label>
                  <InputGroup leftIcon={<Mail className="size-4 text-muted-foreground" />}>
                    <InputGroupInput
                      id="crear-correo"
                      type="email"
                      placeholder="ejemplo@dinarp.gob.ec"
                      value={formCrearCorreo}
                      onChange={(e) => setFormCrearCorreo(e.target.value)}
                      className="text-xs"
                      required
                    />
                  </InputGroup>
                  <span className="text-[10px] text-muted-foreground">
                    A esta dirección se enviará el enlace de invitación para activar la cuenta y configurar Google Authenticator.
                  </span>
                </div>

                {/* Rol (Catálogo Oficial DINARP) */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">
                    Rol Interno Institucional <span className="text-warning">*</span>
                  </Label>
                  <Combobox
                    items={ROLES_INTERNOS_CATALOGO.map((r) => ({
                      value: r.id,
                      label: r.nombre,
                    }))}
                    value={{
                      value: formCrearRol,
                      label:
                        ROLES_INTERNOS_CATALOGO.find((r) => r.id === formCrearRol)?.nombre || formCrearRol,
                    }}
                    onValueChange={(item) => {
                      if (item) handleRolChangeCrear(item.value as RolInterno);
                    }}
                  >
                    <ComboboxSelectTrigger className="h-10 text-xs w-full bg-surface border-border/80 rounded-full px-3.5 shadow-2xs" />
                    <ComboboxContent className="min-w-[280px]">
                      <ComboboxList>
                        {ROLES_INTERNOS_CATALOGO.map((r) => (
                          <ComboboxItem key={r.id} value={{ value: r.id, label: r.nombre }}>
                            {r.nombre}
                          </ComboboxItem>
                        ))}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                  <span className="text-[10px] text-muted-foreground">
                    Roles tomados del catálogo institucional (no se admiten coordinadores externos).
                  </span>
                </div>

                {/* Ámbito Institucional Permitido */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">
                    Ámbito Institucional Asignado <span className="text-warning">*</span>
                  </Label>
                  {(() => {
                    const rolCfg = ROLES_INTERNOS_CATALOGO.find((r) => r.id === formCrearRol);
                    const ambitos = rolCfg?.ambitosPermitidos || [];
                    const currentAmbito = ambitos.find((a) => a.codigo === formCrearAmbito) || ambitos[0];

                    return (
                      <Combobox
                        items={ambitos.map((a) => ({ value: a.codigo, label: a.nombre }))}
                        value={{ value: currentAmbito?.codigo || "", label: currentAmbito?.nombre || "" }}
                        onValueChange={(item) => {
                          if (item) setFormCrearAmbito(item.value);
                        }}
                      >
                        <ComboboxSelectTrigger className="h-10 text-xs w-full bg-surface border-border/80 rounded-full px-3.5 shadow-2xs" />
                        <ComboboxContent className="min-w-[280px]">
                          <ComboboxList>
                            {ambitos.map((a) => (
                              <ComboboxItem key={a.codigo} value={{ value: a.codigo, label: a.nombre }}>
                                {a.nombre}
                              </ComboboxItem>
                            ))}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                    );
                  })()}
                  <span className="text-[10px] text-muted-foreground">
                    Filtrado según el rol para evitar incongruencias jerárquicas.
                  </span>
                </div>
              </div>

              {/* Nota de advertencia de seguridad */}
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs text-foreground/80 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-primary">
                  <ShieldCheck className="size-4" />
                  <span>Política de Acceso y Segundo Factor Obligatorio</span>
                </div>
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  El usuario creado no podrá ingresar hasta que configure una contraseña robusta y registre su token TOTP en Google Authenticator mediante el enlace de primer acceso.
                </p>
              </div>

              <DialogFooter stacked className="pt-4 border-t border-border flex flex-col gap-2.5 w-full">
                <Button type="submit" variant="primary" size="default" className="w-full">
                  Crear cuenta interna
                </Button>
                <Button type="button" variant="neutral" size="default" onClick={handleCloseModalCrear} className="w-full">
                  Cancelar
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════
          MODAL 2: EDITAR CUENTA INTERNA (ID-02)
         ══════════════════════════════════════════════════════════ */}
      <Dialog open={modalEditarOpen} onOpenChange={setModalEditarOpen}>
        <DialogContent variant="standard" size="lg" className="p-6 rounded-2xl border-border bg-surface">
          <DialogHeader className="border-b border-border/60 pb-3">
            <DialogTitle className="font-heading font-extrabold text-xl text-primary">
              Editar cuenta interna
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Modifica los datos de contacto, rol o ámbito. La cédula es inmutable. Si modificas el rol o ámbito, debes ingresar el motivo justificativo.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <form onSubmit={handleEditarSubmit} className="space-y-4 pt-2">
              {formEditError && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{formEditError}</span>
                </div>
              )}

              {/* Cédula Inmutable */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Lock className="size-3 text-muted-foreground" />
                  <span>Cédula de Identidad (Inmutable)</span>
                </Label>
                <InputGroup leftIcon={<Lock className="size-4 text-muted-foreground" />}>
                  <InputGroupInput
                    disabled
                    value={selectedUser.cedula}
                    className="bg-muted/30 cursor-not-allowed text-xs font-mono font-semibold text-foreground"
                  />
                </InputGroup>
              </div>

              {/* Nombre y Correo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-nombre" className="text-xs font-semibold text-foreground">
                    Nombre Completo
                  </Label>
                  <InputGroup leftIcon={<Users className="size-4 text-muted-foreground" />}>
                    <InputGroupInput
                      id="edit-nombre"
                      value={formEditNombre}
                      onChange={(e) => setFormEditNombre(e.target.value)}
                      className="text-xs"
                      required
                    />
                  </InputGroup>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-correo" className="text-xs font-semibold text-foreground">
                    Correo Electrónico
                  </Label>
                  <InputGroup leftIcon={<Mail className="size-4 text-muted-foreground" />}>
                    <InputGroupInput
                      id="edit-correo"
                      type="email"
                      value={formEditCorreo}
                      onChange={(e) => setFormEditCorreo(e.target.value)}
                      className="text-xs"
                      required
                    />
                  </InputGroup>
                </div>
              </div>

              {/* Rol y Ámbito */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">
                    Rol Institucional
                  </Label>
                  <Combobox
                    items={ROLES_INTERNOS_CATALOGO.map((r) => ({
                      value: r.id,
                      label: r.nombre,
                    }))}
                    value={{
                      value: formEditRol,
                      label:
                        ROLES_INTERNOS_CATALOGO.find((r) => r.id === formEditRol)?.nombre || formEditRol,
                    }}
                    onValueChange={(item) => {
                      if (item) handleRolChangeEditar(item.value as RolInterno);
                    }}
                  >
                    <ComboboxSelectTrigger className="h-10 text-xs w-full bg-surface border-border/80 rounded-full px-3.5 shadow-2xs" />
                    <ComboboxContent className="min-w-[260px]">
                      <ComboboxList>
                        {ROLES_INTERNOS_CATALOGO.map((r) => (
                          <ComboboxItem key={r.id} value={{ value: r.id, label: r.nombre }}>
                            {r.nombre}
                          </ComboboxItem>
                        ))}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">
                    Ámbito Asignado
                  </Label>
                  {(() => {
                    const rolCfg = ROLES_INTERNOS_CATALOGO.find((r) => r.id === formEditRol);
                    const ambitos = rolCfg?.ambitosPermitidos || [];
                    const currentAmbito = ambitos.find((a) => a.codigo === formEditAmbito) || ambitos[0];

                    return (
                      <Combobox
                        items={ambitos.map((a) => ({ value: a.codigo, label: a.nombre }))}
                        value={{ value: currentAmbito?.codigo || "", label: currentAmbito?.nombre || "" }}
                        onValueChange={(item) => {
                          if (item) setFormEditAmbito(item.value);
                        }}
                      >
                        <ComboboxSelectTrigger className="h-10 text-xs w-full bg-surface border-border/80 rounded-full px-3.5 shadow-2xs" />
                        <ComboboxContent className="min-w-[260px]">
                          <ComboboxList>
                            {ambitos.map((a) => (
                              <ComboboxItem key={a.codigo} value={{ value: a.codigo, label: a.nombre }}>
                                {a.nombre}
                              </ComboboxItem>
                            ))}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                    );
                  })()}
                </div>
              </div>

              {/* Motivo del cambio (Obligatorio si cambia rol o ámbito) */}
              {(formEditRol !== selectedUser.rol || formEditAmbito !== selectedUser.ambitoCodigo) && (
                <div className="space-y-1.5 p-3 rounded-xl bg-warning/10 border border-warning/20">
                  <Label htmlFor="edit-motivo" className="text-xs font-bold text-warning-foreground flex items-center gap-1.5">
                    <AlertTriangle className="size-3.5 text-warning" />
                    <span>Motivo del cambio de rol o ámbito (Obligatorio por Auditoría) <span className="text-warning">*</span></span>
                  </Label>
                  <Textarea
                    id="edit-motivo"
                    placeholder="Indica el motivo institucional, resolución administrativa o reestructuración que motiva el cambio..."
                    value={formEditMotivo}
                    onChange={(e) => setFormEditMotivo(e.target.value)}
                    className="text-xs min-h-[70px] bg-background"
                    required
                  />
                  <span className="text-[10px] text-muted-foreground">
                    Este motivo quedará asentado en la trazabilidad inalterable de auditoría.
                  </span>
                </div>
              )}

              <DialogFooter stacked className="pt-4 border-t border-border flex flex-col gap-2.5 w-full">
                <Button type="submit" variant="primary" size="default" className="w-full">
                  Guardar cambios
                </Button>
                <Button type="button" variant="neutral" size="default" onClick={() => setModalEditarOpen(false)} className="w-full">
                  Cancelar
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════
          MODAL 3: SUSPENDER CUENTA INTERNA
         ══════════════════════════════════════════════════════════ */}
      <Dialog open={modalSuspenderOpen} onOpenChange={setModalSuspenderOpen}>
        <DialogContent variant="danger" size="default" className="text-left">
          <DialogHeader className="text-center sm:text-left">
            <DialogTitle className="font-heading font-extrabold text-xl text-foreground">
              Suspender cuenta interna
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Se invalidará la sesión activa y se impedirá el ingreso y la asignación de nuevos trámites a la persona.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <form onSubmit={handleSuspenderSubmit} className="space-y-4 pt-1 w-full text-left">
              {errorAccion && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{errorAccion}</span>
                </div>
              )}

              <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Funcionario:</span>
                  <span className="font-semibold text-foreground">{selectedUser.nombreCompleto}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cédula:</span>
                  <span className="font-mono font-medium text-foreground">{selectedUser.cedula}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rol actual:</span>
                  <span className="font-semibold text-foreground">{selectedUser.rolLabel}</span>
                </div>
              </div>

              {/* Advertencia obligatoria */}
              <div className="p-3 rounded-xl bg-warning/10 border border-warning/20 text-xs space-y-1.5 text-warning-foreground">
                <span className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="size-4 text-warning" />
                  Efectos de la suspensión:
                </span>
                <ul className="text-[11px] leading-relaxed list-disc list-inside space-y-0.5 pl-1">
                  <li>Invalida sesiones activas inmediatamente.</li>
                  <li>Bloquea el ingreso al sistema.</li>
                  <li>Impide nuevas asignaciones de trámites a la cuenta.</li>
                  <li>Los trámites asignados permanecen disponibles para su reasignación oportuna.</li>
                </ul>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="suspender-causa" className="text-xs font-semibold text-foreground">
                  Causa justificada de suspensión <span className="text-warning">*</span>
                </Label>
                <Textarea
                  id="suspender-causa"
                  placeholder="Ej. Licencia médica, comisión de servicios temporal, investigación administrativa..."
                  value={motivoAccion}
                  onChange={(e) => setMotivoAccion(e.target.value)}
                  className="text-xs min-h-[70px] bg-background"
                  required
                />
              </div>

              <DialogFooter stacked className="pt-4 border-t border-border flex flex-col gap-2.5 w-full">
                <Button type="submit" variant="danger" size="default" className="w-full">
                  Confirmar suspensión
                </Button>
                <Button type="button" variant="neutral" size="default" onClick={() => setModalSuspenderOpen(false)} className="w-full">
                  Cancelar
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════
          MODAL 4: REACTIVAR CUENTA INTERNA
         ══════════════════════════════════════════════════════════ */}
      <Dialog open={modalReactivarOpen} onOpenChange={setModalReactivarOpen}>
        <DialogContent variant="standard" size="default" className="p-6 rounded-2xl border-border bg-surface">
          <DialogHeader className="border-b border-border/60 pb-3">
            <DialogTitle className="font-heading font-extrabold text-xl text-success">
              Reactivar cuenta interna
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Restaura el acceso y estado activo de la cuenta interna, dejando constancia del motivo en la bitácora institucional.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <form onSubmit={handleReactivarSubmit} className="space-y-4 pt-2">
              {errorAccion && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{errorAccion}</span>
                </div>
              )}

              <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Funcionario:</span>
                  <span className="font-semibold text-foreground">{selectedUser.nombreCompleto}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Segundo factor de seguridad:</span>
                  {selectedUser.totpConfigurado ? (
                    <Badge tone="success" appearance="soft" size="sm" className="font-semibold">
                      Configurado
                    </Badge>
                  ) : (
                    <Badge tone="danger" appearance="soft" size="sm" className="font-semibold">
                      Pendiente / Incompleto
                    </Badge>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Credenciales de acceso:</span>
                  {selectedUser.credencialesConfiguradas ? (
                    <Badge tone="success" appearance="soft" size="sm" className="font-semibold">
                      Establecidas
                    </Badge>
                  ) : (
                    <Badge tone="warning" appearance="soft" size="sm" className="font-semibold">
                      Pendiente
                    </Badge>
                  )}
                </div>
              </div>

              {(!selectedUser.totpConfigurado || !selectedUser.credencialesConfiguradas) && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs space-y-1 text-destructive">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertCircle className="size-4" />
                    <span>Condición de reactivación incompleta</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    La reactivación exige que la cuenta cuente con credenciales y factor de seguridad activos para garantizar el acceso seguro.
                  </p>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="reactivar-causa" className="text-xs font-semibold text-foreground">
                  Motivo de reactivación <span className="text-warning">*</span>
                </Label>
                <Textarea
                  id="reactivar-causa"
                  placeholder="Ej. Reincorporación de funciones tras finalización de licencia médica o comisión..."
                  value={motivoAccion}
                  onChange={(e) => setMotivoAccion(e.target.value)}
                  className="text-xs min-h-[70px] bg-background"
                  required
                />
              </div>

              <DialogFooter stacked className="pt-4 border-t border-border flex flex-col gap-2.5 w-full">
                <Button
                  type="submit"
                  variant="primary"
                  size="default"
                  disabled={!selectedUser.totpConfigurado || !selectedUser.credencialesConfiguradas}
                  className="w-full"
                >
                  Reactivar cuenta
                </Button>
                <Button type="button" variant="neutral" size="default" onClick={() => setModalReactivarOpen(false)} className="w-full">
                  Cancelar
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════
          MODAL 5: DAR DE BAJA A CUENTA INTERNA
         ══════════════════════════════════════════════════════════ */}
      <Dialog open={modalBajaOpen} onOpenChange={setModalBajaOpen}>
        <DialogContent variant="standard" size="lg" className="p-6 rounded-2xl border-border bg-surface">
          <DialogHeader className="border-b border-border/60 pb-3">
            <DialogTitle className="font-heading font-extrabold text-xl text-danger">
              Dar de baja a cuenta interna
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Retira la cuenta interna conservando su historial y trazabilidad inalterables. No se realiza borrado físico ni se reasigna la identidad.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <form onSubmit={handleBajaSubmit} className="space-y-4 pt-2">
              {errorAccion && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{errorAccion}</span>
                </div>
              )}

              {/* Verificación de responsabilidades activas */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-foreground block">
                  Revisión previa de tareas, instituciones y responsabilidades:
                </span>

                {selectedUser.esCoordinadorInstitucionActiva ? (
                  <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs space-y-1.5 text-destructive">
                    <div className="flex items-center gap-1.5 font-bold">
                      <AlertCircle className="size-4" />
                      <span>Imposible dar de baja: Coordinador designado activo</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      El usuario figura como Coordinador de la institución <strong>{selectedUser.institucionCoordinada || "activa"}</strong>. Requiere trámite previo de sustitución o cambio de coordinador.
                    </p>
                  </div>
                ) : selectedUser.tareasActivas > 0 ? (
                  <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs space-y-1.5 text-destructive">
                    <div className="flex items-center gap-1.5 font-bold">
                      <AlertCircle className="size-4" />
                      <span>Imposible dar de baja: {selectedUser.tareasActivas} trámite(s) activo(s)</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      La persona tiene tareas activas en curso. No se permite la baja mientras existan trámites asignados:
                    </p>
                    {selectedUser.detalleTareas && selectedUser.detalleTareas.length > 0 && (
                      <ul className="list-disc list-inside space-y-0.5 text-[11px] font-medium pt-1">
                        {selectedUser.detalleTareas.map((t, idx) => (
                          <li key={idx}>{t}</li>
                        ))}
                      </ul>
                    )}
                    <p className="text-[10px] text-muted-foreground pt-1">
                      Reasigne o resuelva estas tareas con su Director antes de reintentar la baja.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-success/10 border border-success/20 text-xs space-y-1 text-success">
                    <div className="flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="size-4" />
                      <span>Sin trámites activos ni designación de coordinador pendiente</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      El usuario no tiene trámites en curso ni coordinaciones vigentes. Cumple las condiciones para la baja.
                    </p>
                  </div>
                )}
              </div>

              {/* Justificación obligatoria */}
              <div className="space-y-1.5">
                <Label htmlFor="baja-justificacion" className="text-xs font-semibold text-foreground">
                  Justificación obligatoria <span className="text-warning">*</span>
                </Label>
                <Textarea
                  id="baja-justificacion"
                  placeholder="Detalla el memorando, acción de personal o resolución administrativa de desvinculación institucional..."
                  value={motivoAccion}
                  onChange={(e) => setMotivoAccion(e.target.value)}
                  className="text-xs min-h-[80px] bg-background"
                  required
                />
                <span className="text-[10px] text-muted-foreground">
                  Mínimo 10 caracteres. Se conservan decisiones, firmas, eventos e incidentes realizados sin borrado físico.
                </span>
              </div>

              <DialogFooter stacked className="pt-4 border-t border-border flex flex-col gap-2.5 w-full">
                <Button
                  type="submit"
                  variant="danger"
                  size="default"
                  disabled={selectedUser.tareasActivas > 0 || !!selectedUser.esCoordinadorInstitucionActiva}
                  className="w-full"
                >
                  Confirmar baja lógica
                </Button>
                <Button type="button" variant="neutral" size="default" onClick={() => setModalBajaOpen(false)} className="w-full">
                  Cancelar
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════
          MODAL 6: DETALLE Y AUDITORÍA DE USUARIO (ID-01, ID-02, ID-05)
         ══════════════════════════════════════════════════════════ */}
      <Dialog open={modalDetalleOpen} onOpenChange={setModalDetalleOpen}>
        <DialogContent variant="standard" size="2xl" className="p-6 rounded-2xl border-border bg-surface max-h-[85vh] flex flex-col">
          <DialogHeader className="border-b border-border/60 pb-3 shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="font-heading font-extrabold text-xl text-primary">
                Expediente de Cuenta Interna y Seguridad
              </DialogTitle>
              {selectedUser && getEstadoBadge(selectedUser.estado)}
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              Consulta de credenciales, roles, asignaciones institucionales y trazabilidad de eventos.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="flex-1 min-h-0 overflow-y-auto pt-2">
              <Tabs value={activeDetailTab} onValueChange={setActiveDetailTab} className="w-full">
                <TabsList className="grid grid-cols-3 w-full mb-4">
                  <TabsTrigger value="info" className="text-xs font-semibold">
                    Información general
                  </TabsTrigger>
                  <TabsTrigger value="seguridad" className="text-xs font-semibold">
                    Acceso y seguridad
                  </TabsTrigger>
                  <TabsTrigger value="auditoria" className="text-xs font-semibold">
                    Auditoría e historial
                  </TabsTrigger>
                </TabsList>

                {/* Tab 1: Info General */}
                <TabsContent value="info" className="space-y-4">
                  <div className="p-4 rounded-xl bg-muted/40 border border-border">
                    <div className="min-w-0">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <h3 className="font-heading font-bold text-base text-foreground truncate cursor-default">
                            {selectedUser.nombreCompleto}
                          </h3>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs break-words">
                          <p className="font-bold text-xs">{selectedUser.nombreCompleto}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">ID interno: {selectedUser.id}</p>
                        </TooltipContent>
                      </Tooltip>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">
                        Cédula: {selectedUser.cedula}
                      </p>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="text-xs text-muted-foreground truncate cursor-default">
                            Correo: {selectedUser.correo}
                          </p>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs break-all">
                          <p className="text-xs font-medium">{selectedUser.correo}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl border border-border bg-surface space-y-1">
                      <span className="text-[11px] text-muted-foreground font-medium block">
                        Rol Institucional
                      </span>
                      <div className="pt-0.5">
                        {getRolBadge(selectedUser.rol, selectedUser.rolLabel)}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl border border-border bg-surface space-y-1">
                      <span className="text-[11px] text-muted-foreground font-medium block">
                        Ámbito Asignado
                      </span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="font-bold text-foreground block truncate cursor-default">
                            {selectedUser.ambito}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs break-words">
                          <p className="text-xs font-medium">{selectedUser.ambito}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <div className="p-3 rounded-xl border border-border bg-surface space-y-1">
                      <span className="text-[11px] text-muted-foreground font-medium block">
                        Fecha de Registro
                      </span>
                      <span className="font-medium text-foreground block">
                        {selectedUser.fechaCreacion}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl border border-border bg-surface space-y-1">
                      <span className="text-[11px] text-muted-foreground font-medium block">
                        Última Actualización Administrativa
                      </span>
                      <span className="font-medium text-foreground block">
                        {selectedUser.ultimaActualizacion || selectedUser.fechaCreacion}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl border border-border bg-surface space-y-1">
                      <span className="text-[11px] text-muted-foreground font-medium block">
                        Último Acceso al Sistema
                      </span>
                      <span className="font-medium text-foreground block">
                        {selectedUser.ultimoAcceso || "Sin actividad registrada"}
                      </span>
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 2: Seguridad y 2FA */}
                <TabsContent value="seguridad" className="space-y-4">
                  <div className="space-y-3">
                    {/* Estado 2FA */}
                    <div className="p-4 rounded-xl border border-border bg-surface flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-foreground block">
                          Segundo Factor de Autenticación (TOTP)
                        </span>
                        <p className="text-[11px] text-muted-foreground">
                          Google Authenticator de 6 dígitos con ventana de 30 segundos.
                        </p>
                      </div>
                      {selectedUser.totpConfigurado ? (
                        <Badge tone="success" appearance="soft" size="sm" dot className="font-bold">
                          Vinculado
                        </Badge>
                      ) : (
                        <Badge tone="warning" appearance="soft" size="sm" dot className="font-bold">
                          No vinculado
                        </Badge>
                      )}
                    </div>

                    {/* Estado de Contraseña */}
                    <div className="p-4 rounded-xl border border-border bg-surface flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-foreground block">
                          Credenciales de Ingreso
                        </span>
                        <p className="text-[11px] text-muted-foreground">
                          Contraseña robusta institucional con hashing seguro.
                        </p>
                      </div>
                      {selectedUser.credencialesConfiguradas ? (
                        <Badge tone="success" appearance="soft" size="sm" className="font-bold">
                          Establecidas
                        </Badge>
                      ) : (
                        <Badge tone="warning" appearance="soft" size="sm" className="font-bold">
                          Pendiente
                        </Badge>
                      )}
                    </div>

                    {/* Política de Secretos (ID-05) */}
                    <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground space-y-1">
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <Shield className="size-3.5 text-primary" />
                        Privacidad de Claves y Secretos:
                      </span>
                      <p className="text-[11px] leading-relaxed">
                        Conforme a la Política de Seguridad DINARP, los códigos secretos, hashes y tokens nunca se exponen al personal administrador ni en respuestas visuales.
                      </p>
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 3: Auditoría y Trazabilidad */}
                <TabsContent value="auditoria" className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-md bg-surface-raised/40 border border-border/60">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <History className="size-4 text-primary" />
                        <span className="text-xs font-bold text-foreground block">
                          Trazabilidad de Seguridad y Auditoría
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Historial inalterable de altas, roles, bloqueos, recuperaciones y accesos.
                      </p>
                    </div>

                    {/* Nota de confidencialidad */}
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-success/10 border border-success/20 text-success text-[10px] font-medium shrink-0">
                      <ShieldCheck className="size-3.5 shrink-0" />
                      <span>Sin exposición de contraseña ni tokens</span>
                    </div>
                  </div>

                  {/* Filtros avanzados del expediente */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-md bg-surface-raised/20 border border-border/40">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-medium text-foreground">
                        Tipo de evento
                      </Label>
                      <Combobox
                        value={filtroAuditTipo}
                        onValueChange={(val) => setFiltroAuditTipo(val || "TODOS")}
                      >
                        <ComboboxSelectTrigger className="w-full text-xs h-8">
                          <ComboboxValue placeholder="Todos los eventos" />
                        </ComboboxSelectTrigger>
                        <ComboboxContent>
                          <ComboboxList>
                            <ComboboxItem value="TODOS">Todos los eventos</ComboboxItem>
                            <ComboboxItem value="CUENTA_CREADA">Alta / Cuenta creada</ComboboxItem>
                            <ComboboxItem value="ACTIVACION">Activación con factores</ComboboxItem>
                            <ComboboxItem value="CAMBIO_ROL">Cambio de rol institucional</ComboboxItem>
                            <ComboboxItem value="CAMBIO_AMBITO">Cambio de ámbito</ComboboxItem>
                            <ComboboxItem value="INGRESO">Ingresos y accesos</ComboboxItem>
                            <ComboboxItem value="BLOQUEO">Bloqueos de sesión</ComboboxItem>
                            <ComboboxItem value="RECUPERACION">Recuperación de acceso</ComboboxItem>
                            <ComboboxItem value="SUSPENSION">Suspensión de cuenta</ComboboxItem>
                            <ComboboxItem value="REACTIVACION">Reactivación de cuenta</ComboboxItem>
                            <ComboboxItem value="CAMBIO_COORDINADOR">Cambio de Coordinador</ComboboxItem>
                            <ComboboxItem value="CREDENCIALES_API_REVOCADAS">Credenciales API institucionales</ComboboxItem>
                            <ComboboxItem value="BAJA_LOGICA">Baja lógica definitiva</ComboboxItem>
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-medium text-foreground">
                        Período
                      </Label>
                      <Combobox
                        value={filtroAuditPeriodo}
                        onValueChange={(val) => setFiltroAuditPeriodo(val || "TODOS")}
                      >
                        <ComboboxSelectTrigger className="w-full text-xs h-8">
                          <ComboboxValue placeholder="Todo el historial" />
                        </ComboboxSelectTrigger>
                        <ComboboxContent>
                          <ComboboxList>
                            <ComboboxItem value="TODOS">Todo el período registrado</ComboboxItem>
                            <ComboboxItem value="7D">Últimos 7 días</ComboboxItem>
                            <ComboboxItem value="30D">Últimos 30 días</ComboboxItem>
                            <ComboboxItem value="2026">Año fiscal 2026</ComboboxItem>
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                    </div>
                  </div>

                  {/* Lista de Timeline con manejo de estado vacío ID-05 Criterio 3 */}
                  {timelineItems.length === 0 ? (
                    <div className="py-10 px-4 text-center rounded-lg border border-dashed border-border/80 bg-surface-raised/20 space-y-3">
                      <div className="size-10 rounded-full bg-muted/30 text-muted-foreground mx-auto flex items-center justify-center">
                        <History className="size-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-foreground">
                          «Sin resultados para estos filtros»
                        </p>
                        <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
                          No existen registros que coincidan con el tipo de evento y período seleccionados para este usuario.
                        </p>
                      </div>
                      <Button
                        variant="neutral"
                        size="sm"
                        onClick={() => {
                          setFiltroAuditTipo("TODOS");
                          setFiltroAuditPeriodo("TODOS");
                        }}
                        className="text-xs gap-1.5"
                      >
                        <RotateCcw className="size-3.5" />
                        <span>Restablecer filtros del expediente</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="pt-2">
                      <Timeline items={timelineItems} />
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}

          <DialogFooter className="pt-3 border-t border-border/60 shrink-0">
            <Button variant="neutral" size="default" onClick={() => setModalDetalleOpen(false)}>
              Cerrar expediente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════
          CONFIRMATION DIALOG - VALIDACIÓN DE SEGURIDAD
         ══════════════════════════════════════════════════════════ */}
      <Dialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
      >
        <DialogContent variant={confirmDialog.variant || "danger"} size="default" className="text-center sm:text-left">
          <DialogHeader className="space-y-2">
            <DialogTitle className="font-heading font-extrabold text-lg text-foreground text-center">
              {confirmDialog.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed text-center">
              {confirmDialog.description}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter showCloseButton stacked className="pt-4 flex flex-col gap-2.5 w-full">
            <Button
              type="button"
              variant={confirmDialog.variant === "warning" ? "warning" : "danger"}
              size="default"
              onClick={() => {
                const action = confirmDialog.onConfirm;
                setConfirmDialog((prev) => ({ ...prev, open: false }));
                action();
              }}
              className="w-full font-semibold"
            >
              {confirmDialog.confirmLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </WireframeDashboardLayout>
  );
}
