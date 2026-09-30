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
  Search,
  Filter,
  MoreVertical,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const pageSize = 7;

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

    toast.success("Usuario actualizado", {
      description: `Se actualizaron los datos y se registró la trazabilidad de auditoría.`,
    });
    setModalEditarOpen(false);
  };

  // Abrir Modal Suspender
  const handleOpenSuspender = (u: UsuarioInterno) => {
    setSelectedUser(u);
    setMotivoAccion("");
    setErrorAccion("");
    setModalSuspenderOpen(true);
  };

  // Submit Suspender Usuario (ID-03)
  const handleSuspenderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setErrorAccion("");

    const res = suspenderUsuario(selectedUser.id, motivoAccion, currentUser.name);
    if (!res.ok) {
      setErrorAccion(res.error || "Error al suspender.");
      return;
    }

    toast.warning("Cuenta suspendida", {
      description: `La cuenta de ${selectedUser.nombreCompleto} ha sido suspendida. Sesiones invalidadas de inmediato.`,
    });
    setModalSuspenderOpen(false);
  };

  // Abrir Modal Reactivar
  const handleOpenReactivar = (u: UsuarioInterno) => {
    setSelectedUser(u);
    setMotivoAccion("");
    setErrorAccion("");
    setModalReactivarOpen(true);
  };

  // Submit Reactivar Usuario (ID-03)
  const handleReactivarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setErrorAccion("");

    const res = reactivarUsuario(selectedUser.id, motivoAccion, currentUser.name);
    if (!res.ok) {
      setErrorAccion(res.error || "Error al reactivar.");
      return;
    }

    toast.success("Cuenta reactivada", {
      description: `La cuenta de ${selectedUser.nombreCompleto} ha sido reactivada a estado ACTIVO.`,
    });
    setModalReactivarOpen(false);
  };

  // Abrir Modal Baja Lógica
  const handleOpenBaja = (u: UsuarioInterno) => {
    setSelectedUser(u);
    setMotivoAccion("");
    setErrorAccion("");
    setModalBajaOpen(true);
  };

  // Submit Baja Lógica (ID-04)
  const handleBajaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setErrorAccion("");

    const res = darDeBajaUsuario(selectedUser.id, motivoAccion, currentUser.name);
    if (!res.ok) {
      setErrorAccion(res.error || "Error al dar de baja.");
      return;
    }

    toast.error("Baja lógica procesada", {
      description: `La cuenta ha sido pasada a estado RETIRADO. Su histórico y auditoría permanecen inalterables.`,
    });
    setModalBajaOpen(false);
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
            Retirado
          </Badge>
        );
    }
  };

  // Timeline items para el modal de detalle
  const timelineItems: TimelineItem[] = useMemo(() => {
    if (!selectedUser) return [];
    const logs = auditoria.filter(
      (a) =>
        a.usuarioAfectadoId === selectedUser.id ||
        a.usuarioAfectadoCedula === selectedUser.cedula
    );

    return logs.map((log) => ({
      id: log.id,
      title: log.eventoLabel,
      description:
        log.detalles ||
        (log.motivo ? `Motivo: ${log.motivo}` : undefined) ||
        (log.valorAnterior && log.valorNuevo
          ? `De "${log.valorAnterior}" a "${log.valorNuevo}"`
          : undefined),
      date: log.fecha,
      user: log.actor,
      status:
        log.resultado === "Éxito"
          ? log.evento === "SUSPENSION" || log.evento === "BAJA_LOGICA"
            ? "danger"
            : log.evento === "ACTIVACION"
            ? "success"
            : "primary"
          : "error",
      statusLabel: log.resultado,
      icon:
        log.evento === "CUENTA_CREADA" ? (
          <UserPlus className="size-4" />
        ) : log.evento === "ACTIVACION" ? (
          <ShieldCheck className="size-4" />
        ) : log.evento === "SUSPENSION" ? (
          <Ban className="size-4" />
        ) : log.evento === "BAJA_LOGICA" ? (
          <UserX className="size-4" />
        ) : log.evento === "CAMBIO_ROL" ? (
          <Briefcase className="size-4" />
        ) : (
          <KeyRound className="size-4" />
        ),
    }));
  }, [selectedUser, auditoria]);

  return (
    <WireframeDashboardLayout
      activeMenu="administracion-usuarios"
      currentUser={currentUser}
      breadcrumbs={[
        { label: "Administración", href: "#" },
        { label: "Usuarios" },
      ]}
    >
      <div className="flex flex-col gap-6 w-full max-w-full">
        {/* ── 1. Contenedor Principal (Tarjetas, Encabezado y Tabla) ── */}
        <Card
          className="bg-surface rounded-2xl border border-border shadow-xs flex-1 min-h-0 overflow-hidden flex flex-col my-0"
          innerClassName="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 w-full"
        >
          {/* ── Encabezado Principal ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight text-primary">
                  Gestión de usuarios
                </h1>
                <Badge tone="primary" appearance="soft" size="sm" className="font-bold">
                  DINARP · Seguridad
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal">
                Administra las cuentas internas, roles, ámbitos y estados de acceso al Portal.
              </p>
            </div>

            {/* Acción Principal */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="primary"
                size="default"
                onClick={() => setModalCrearOpen(true)}
                className="gap-2 shadow-xs cursor-pointer font-semibold text-xs"
              >
                <UserPlus className="size-4" />
                <span>+ Crear usuario</span>
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
                      Credenciales y 2FA OK
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
                        Pendientes
                      </h3>
                      {filterEstado === "PENDIENTE_ACTIVACION" && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-warning/20 text-warning border border-warning/30 shrink-0">
                          Activo
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground font-normal truncate">
                      Por activar 2FA/clave
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
                        Retirados
                      </h3>
                      {filterEstado === "RETIRADO" && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-primary/20 text-primary border border-primary/30 shrink-0">
                          Activo
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground font-normal truncate">
                      Baja lógica histórica
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

          {/* ── 3. Buscador y Filtros (Sin contenedor caja envolvente, anchos holgados) ── */}
          <div className="flex flex-col xl:flex-row gap-3 items-stretch xl:items-end justify-between w-full">
            {/* Buscador amplio */}
            <div className="flex-1 min-w-[280px]">
              <InputGroup className="bg-surface border-border/80 shadow-2xs h-10 rounded-xl focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <InputGroupAddon className="pl-3.5">
                  <Search className="size-4 text-muted-foreground" />
                </InputGroupAddon>
                <InputGroupInput
                  placeholder="Buscar por cédula, nombre completo o correo institucional..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="text-xs"
                />
                {searchQuery && (
                  <InputGroupButton
                    onClick={() => setSearchQuery("")}
                    className="pr-3 text-muted-foreground hover:text-foreground"
                    aria-label="Borrar búsqueda"
                  >
                    <X className="size-3.5" />
                  </InputGroupButton>
                )}
              </InputGroup>
            </div>

            {/* Filtros Selectores con ancho amplio */}
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
                  <ComboboxSelectTrigger className="h-10 text-xs w-full bg-surface border-border/80 rounded-xl shadow-2xs" />
                  <ComboboxContent className="min-w-[260px]">
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
                  <ComboboxSelectTrigger className="h-10 text-xs w-full bg-surface border-border/80 rounded-xl shadow-2xs" />
                  <ComboboxContent className="min-w-[280px]">
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
                    { value: "PENDIENTE_ACTIVACION", label: "Pendientes" },
                    { value: "SUSPENDIDO", label: "Suspendidos" },
                    { value: "RETIRADO", label: "Retirados" },
                  ]}
                  value={{
                    value: filterEstado,
                    label:
                      filterEstado === "TODOS"
                        ? "Todos los estados"
                        : filterEstado === "ACTIVO"
                        ? "Activos"
                        : filterEstado === "PENDIENTE_ACTIVACION"
                        ? "Pendientes"
                        : filterEstado === "SUSPENDIDO"
                        ? "Suspendidos"
                        : "Retirados",
                  }}
                  onValueChange={(item) => {
                    if (item) {
                      setFilterEstado(item.value);
                      setCurrentPage(1);
                    }
                  }}
                >
                  <ComboboxSelectTrigger className="h-10 text-xs w-full bg-surface border-border/80 rounded-xl shadow-2xs" />
                  <ComboboxContent className="min-w-[200px]">
                    <ComboboxList>
                      <ComboboxItem value={{ value: "TODOS", label: "Todos los estados" }}>
                        Todos los estados
                      </ComboboxItem>
                      <ComboboxItem value={{ value: "ACTIVO", label: "Activos" }}>
                        Activos
                      </ComboboxItem>
                      <ComboboxItem value={{ value: "PENDIENTE_ACTIVACION", label: "Pendientes" }}>
                        Pendientes
                      </ComboboxItem>
                      <ComboboxItem value={{ value: "SUSPENDIDO", label: "Suspendidos" }}>
                        Suspendidos
                      </ComboboxItem>
                      <ComboboxItem value={{ value: "RETIRADO", label: "Retirados" }}>
                        Retirados
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
                  className="h-10 text-xs text-muted-foreground hover:text-foreground cursor-pointer px-3 shrink-0"
                >
                  Limpiar filtros
                </Button>
              )}
            </div>
          </div>

          {/* ── 4. Tabla de Usuarios ── */}
          <div className="w-full overflow-hidden rounded-xl border border-border bg-surface shadow-2xs">
            <div className="overflow-x-auto">
              <Table className="w-full min-w-[1080px] table-fixed">
                <TableHeader>
                  <TableRow className="border-0 h-11">
                    <TableHead className="w-[220px] px-3 py-2.5 whitespace-nowrap text-white font-bold text-xs">
                      USUARIO / PERSONA
                    </TableHead>
                    <TableHead className="w-[120px] px-3 py-2.5 whitespace-nowrap text-white font-bold text-xs">
                      CÉDULA
                    </TableHead>
                    <TableHead className="w-[210px] px-3 py-2.5 whitespace-nowrap text-white font-bold text-xs">
                      CORREO INSTITUCIONAL
                    </TableHead>
                    <TableHead className="w-[170px] px-3 py-2.5 whitespace-nowrap text-white font-bold text-xs">
                      ROL ASIGNADO
                    </TableHead>
                    <TableHead className="w-[190px] px-3 py-2.5 whitespace-nowrap text-white font-bold text-xs">
                      ÁMBITO INSTITUCIONAL
                    </TableHead>
                    <TableHead className="w-[130px] px-3 py-2.5 whitespace-nowrap text-white font-bold text-xs">
                      ESTADO
                    </TableHead>
                    <TableHead className="w-[140px] px-3 py-2.5 whitespace-nowrap text-white font-bold text-xs">
                      ÚLTIMA ACTIVIDAD
                    </TableHead>
                    <TableHead className="w-[100px] px-3 py-2.5 whitespace-nowrap text-right text-white font-bold text-xs">
                      ACCIONES
                    </TableHead>
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
                        <TableCell className="py-3">
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-foreground truncate max-w-[200px]">
                              {u.nombreCompleto}
                            </span>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              ID: {u.id}
                            </span>
                          </div>
                        </TableCell>

                        {/* Cédula */}
                        <TableCell className="py-3 text-xs font-mono font-medium text-foreground">
                          {u.cedula}
                        </TableCell>

                        {/* Correo */}
                        <TableCell className="py-3">
                          <div className="flex items-center gap-1.5 text-xs text-foreground/80">
                            <Mail className="size-3 text-muted-foreground shrink-0" />
                            <span className="truncate max-w-[190px]">{u.correo}</span>
                          </div>
                        </TableCell>

                        {/* Rol */}
                        <TableCell className="py-3">
                          <Badge tone="neutral" appearance="soft" size="sm" className="font-semibold text-[11px]">
                            {u.rolLabel}
                          </Badge>
                        </TableCell>

                        {/* Ámbito */}
                        <TableCell className="py-3 text-xs text-muted-foreground max-w-[200px] truncate">
                          {u.ambito}
                        </TableCell>

                        {/* Estado */}
                        <TableCell className="py-3">
                          {getEstadoBadge(u.estado)}
                        </TableCell>

                        {/* Última Actividad */}
                        <TableCell className="py-3 text-xs text-muted-foreground">
                          {u.ultimoAcceso || "Sin ingresos"}
                        </TableCell>

                        {/* Acciones */}
                        <TableCell className="px-3 py-2.5 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            {/* Icon Button directo: Ver detalle */}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon-sm"
                                  onClick={() => handleOpenDetalle(u)}
                                  className="size-7 rounded-lg border-border/80 text-foreground hover:bg-muted shadow-2xs"
                                  aria-label={`Ver detalle y expediente de ${u.nombreCompleto}`}
                                >
                                  <Eye className="size-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top">Ver detalle y expediente</TooltipContent>
                            </Tooltip>

                            {/* Icon Button dropdown para acciones contextuales */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon-sm"
                                  className="size-7 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
                                  aria-label="Más opciones"
                                >
                                  <MoreVertical className="size-3.5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-56 p-1.5 shadow-md">
                                <DropdownMenuLabel className="text-[11px] text-muted-foreground px-2 py-1">
                                  Opciones de cuenta
                                </DropdownMenuLabel>

                                <DropdownMenuItem
                                  onClick={() => handleOpenDetalle(u)}
                                  className="gap-2 text-xs py-2 cursor-pointer"
                                >
                                  <Eye className="size-3.5 text-muted-foreground" />
                                  <span>Ver detalle y auditoría</span>
                                </DropdownMenuItem>

                                {u.estado !== "RETIRADO" && (
                                  <DropdownMenuItem
                                    onClick={() => handleOpenEditar(u)}
                                    className="gap-2 text-xs py-2 cursor-pointer"
                                  >
                                    <Edit2 className="size-3.5 text-primary" />
                                    <span>Editar usuario</span>
                                  </DropdownMenuItem>
                                )}

                                <DropdownMenuSeparator />

                                {/* Activar cuenta si está pendiente */}
                                {u.estado === "PENDIENTE_ACTIVACION" && (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      const res = simularActivacionDemo(u.id, currentUser.name);
                                      if (res.ok) {
                                        toast.success("Cuenta activada en simulación", {
                                          description: `Se completaron credenciales y segundo factor TOTP para ${u.nombreCompleto}.`,
                                        });
                                      }
                                    }}
                                    className="gap-2 text-xs py-2 text-success focus:text-success cursor-pointer font-medium"
                                  >
                                    <CheckCircle2 className="size-3.5 text-success" />
                                    <span>Simular activación (2FA)</span>
                                  </DropdownMenuItem>
                                )}

                                {/* Suspender cuenta */}
                                {u.estado === "ACTIVO" && (
                                  <DropdownMenuItem
                                    onClick={() => handleOpenSuspender(u)}
                                    className="gap-2 text-xs py-2 text-warning-foreground focus:text-warning cursor-pointer font-medium"
                                  >
                                    <Ban className="size-3.5 text-warning" />
                                    <span>Suspender cuenta</span>
                                  </DropdownMenuItem>
                                )}

                                {/* Reactivar cuenta */}
                                {u.estado === "SUSPENDIDO" && (
                                  <DropdownMenuItem
                                    onClick={() => handleOpenReactivar(u)}
                                    className="gap-2 text-xs py-2 text-success focus:text-success cursor-pointer font-medium"
                                  >
                                    <RotateCcw className="size-3.5 text-success" />
                                    <span>Reactivar cuenta</span>
                                  </DropdownMenuItem>
                                )}

                                {/* Dar de baja (prohibido 'Eliminar') */}
                                {u.estado !== "RETIRADO" && (
                                  <DropdownMenuItem
                                    onClick={() => handleOpenBaja(u)}
                                    className="gap-2 text-xs py-2 text-danger focus:text-danger cursor-pointer font-medium"
                                  >
                                    <UserX className="size-3.5 text-danger" />
                                    <span>Dar de baja</span>
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Paginación */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 border-t border-border bg-surface text-xs text-muted-foreground">
              <span>
                Mostrando {paginatedUsuarios.length} de {filteredUsuarios.length} usuarios registrados
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="h-8 text-xs px-3"
                >
                  Anterior
                </Button>
                <span className="font-semibold px-2">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="h-8 text-xs px-3"
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* ══════════════════════════════════════════════════════════
          MODAL 1: CREAR USUARIO (ID-01)
         ══════════════════════════════════════════════════════════ */}
      <Dialog open={modalCrearOpen} onOpenChange={handleCloseModalCrear}>
        <DialogContent className="max-w-2xl p-6 rounded-2xl border-border bg-surface">
          <DialogHeader className="border-b border-border/60 pb-3">
            <DialogTitle className="font-heading font-extrabold text-xl text-primary flex items-center gap-2">
              <UserPlus className="size-5 text-primary" />
              <span>Crear cuenta de usuario interno</span>
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
                    Cédula de Identidad *
                  </Label>
                  <InputGroup className="bg-background border-border h-10">
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
                    Nombre Completo / Funcionario *
                  </Label>
                  <InputGroup className="bg-background border-border h-10">
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
                    Correo Electrónico Institucional *
                  </Label>
                  <InputGroup className="bg-background border-border h-10">
                    <InputGroupAddon className="pl-3">
                      <Mail className="size-4 text-muted-foreground" />
                    </InputGroupAddon>
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
                    Rol Interno Institucional *
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
                    <ComboboxSelectTrigger className="h-10 text-xs w-full bg-surface border-border/80 rounded-xl shadow-2xs" />
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
                    Ámbito Institucional Asignado *
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
                        <ComboboxSelectTrigger className="h-10 text-xs w-full bg-surface border-border/80 rounded-xl shadow-2xs" />
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

              <DialogFooter className="pt-2 gap-2 sm:gap-0">
                <Button type="button" variant="outline" size="default" onClick={handleCloseModalCrear}>
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" size="default">
                  Crear cuenta interna
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════
          MODAL 2: EDITAR USUARIO (ID-02)
         ══════════════════════════════════════════════════════════ */}
      <Dialog open={modalEditarOpen} onOpenChange={setModalEditarOpen}>
        <DialogContent className="max-w-xl p-6 rounded-2xl border-border bg-surface">
          <DialogHeader className="border-b border-border/60 pb-3">
            <DialogTitle className="font-heading font-extrabold text-xl text-primary flex items-center gap-2">
              <Edit2 className="size-5 text-primary" />
              <span>Editar usuario y perfil institucional</span>
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
                <Input
                  disabled
                  value={selectedUser.cedula}
                  className="h-10 text-xs font-mono bg-muted/60 opacity-80 cursor-not-allowed"
                />
              </div>

              {/* Nombre y Correo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-nombre" className="text-xs font-semibold text-foreground">
                    Nombre Completo
                  </Label>
                  <Input
                    id="edit-nombre"
                    value={formEditNombre}
                    onChange={(e) => setFormEditNombre(e.target.value)}
                    className="h-10 text-xs"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-correo" className="text-xs font-semibold text-foreground">
                    Correo Electrónico
                  </Label>
                  <Input
                    id="edit-correo"
                    type="email"
                    value={formEditCorreo}
                    onChange={(e) => setFormEditCorreo(e.target.value)}
                    className="h-10 text-xs"
                    required
                  />
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
                    <ComboboxSelectTrigger className="h-10 text-xs w-full bg-surface border-border/80 rounded-xl shadow-2xs" />
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
                        <ComboboxSelectTrigger className="h-10 text-xs w-full bg-surface border-border/80 rounded-xl shadow-2xs" />
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
                    <span>Motivo del cambio de rol o ámbito (Obligatorio por Auditoría) *</span>
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

              <DialogFooter className="pt-2 gap-2 sm:gap-0">
                <Button type="button" variant="outline" size="default" onClick={() => setModalEditarOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" size="default">
                  Guardar cambios
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════
          MODAL 3: SUSPENDER CUENTA (ID-03)
         ══════════════════════════════════════════════════════════ */}
      <Dialog open={modalSuspenderOpen} onOpenChange={setModalSuspenderOpen}>
        <DialogContent variant="danger" size="default" className="text-left">
          <DialogHeader className="text-center sm:text-left">
            <DialogTitle className="font-heading font-extrabold text-xl text-foreground flex items-center gap-2">
              <Ban className="size-5 text-danger shrink-0" />
              <span>Suspender cuenta institucional</span>
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

              {/* Advertencia obligatoria ID-03 */}
              <div className="p-3 rounded-xl bg-warning/10 border border-warning/20 text-xs space-y-1 text-warning-foreground">
                <span className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="size-4 text-warning" />
                  Advertencia de Trámites Asignados:
                </span>
                <p className="text-[11px] leading-relaxed">
                  Los trámites que el usuario tenga asignados actualmente continuarán visibles en el sistema para que su Dirección pueda reasignarlos oportunamente.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="suspender-causa" className="text-xs font-semibold text-foreground">
                  Causa de la suspensión *
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

              <DialogFooter className="pt-2 gap-2 sm:gap-0 w-full justify-end">
                <Button type="button" variant="outline" size="default" onClick={() => setModalSuspenderOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" variant="danger" size="default">
                  Confirmar suspensión
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════
          MODAL 4: REACTIVAR CUENTA (ID-03)
         ══════════════════════════════════════════════════════════ */}
      <Dialog open={modalReactivarOpen} onOpenChange={setModalReactivarOpen}>
        <DialogContent className="max-w-md p-6 rounded-2xl border-border bg-surface">
          <DialogHeader className="border-b border-border/60 pb-3">
            <DialogTitle className="font-heading font-extrabold text-xl text-success flex items-center gap-2">
              <RotateCcw className="size-5 text-success" />
              <span>Reactivar cuenta suspendida</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Restaura el estado ACTIVO del usuario. La persona podrá volver a autenticarse con sus credenciales y factor TOTP previamente configurados.
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
                  <span className="text-muted-foreground">Segundo factor (TOTP):</span>
                  <Badge tone="success" appearance="soft" size="sm" className="font-semibold">
                    Configurado
                  </Badge>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reactivar-causa" className="text-xs font-semibold text-foreground">
                  Causa o motivo de reactivación *
                </Label>
                <Textarea
                  id="reactivar-causa"
                  placeholder="Ej. Reincorporación de funciones tras finalización de licencia médica..."
                  value={motivoAccion}
                  onChange={(e) => setMotivoAccion(e.target.value)}
                  className="text-xs min-h-[70px]"
                  required
                />
              </div>

              <DialogFooter className="pt-2 gap-2 sm:gap-0">
                <Button type="button" variant="outline" size="default" onClick={() => setModalReactivarOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" size="default">
                  Reactivar cuenta
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════════════
          MODAL 5: DAR DE BAJA LÓGICA (ID-04)
         ══════════════════════════════════════════════════════════ */}
      <Dialog open={modalBajaOpen} onOpenChange={setModalBajaOpen}>
        <DialogContent className="max-w-lg p-6 rounded-2xl border-border bg-surface">
          <DialogHeader className="border-b border-border/60 pb-3">
            <DialogTitle className="font-heading font-extrabold text-xl text-danger flex items-center gap-2">
              <UserX className="size-5 text-danger" />
              <span>Dar de baja a la cuenta (Baja lógica)</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Pasa la cuenta a estado RETIRADO. No se borra ningún registro histórico ni auditoría previa.
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

              {/* Verificación de responsabilidades activas ID-04 */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-foreground block">
                  Revisión previa de tareas y responsabilidades:
                </span>
                {selectedUser.tareasActivas > 0 ? (
                  <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs space-y-1.5 text-destructive">
                    <div className="flex items-center gap-1.5 font-bold">
                      <AlertCircle className="size-4" />
                      <span>Imposible dar de baja: Trámites activos pendientes</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      El usuario tiene <strong>{selectedUser.tareasActivas} trámite(s)</strong> activo(s) asignados en su bandeja. Deben ser reasignados a otro revisor antes de procesar la baja.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-success/10 border border-success/20 text-xs space-y-1 text-success">
                    <div className="flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="size-4" />
                      <span>Sin trámites activos pendientes</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      El usuario no tiene trámites en curso. Cumple con los requisitos para dar de baja lógica.
                    </p>
                  </div>
                )}
              </div>

              {/* Justificación obligatoria */}
              <div className="space-y-1.5">
                <Label htmlFor="baja-justificacion" className="text-xs font-semibold text-foreground">
                  Justificación obligatoria de la desvinculación *
                </Label>
                <Textarea
                  id="baja-justificacion"
                  placeholder="Detalla el memorando, acción de personal o resolución de desvinculación institucional..."
                  value={motivoAccion}
                  onChange={(e) => setMotivoAccion(e.target.value)}
                  className="text-xs min-h-[80px]"
                  required
                />
                <span className="text-[10px] text-muted-foreground">
                  Mínimo 10 caracteres. Esta justificación será auditada por las áreas de control y normatividad.
                </span>
              </div>

              <DialogFooter className="pt-2 gap-2 sm:gap-0">
                <Button type="button" variant="outline" size="default" onClick={() => setModalBajaOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="danger"
                  size="default"
                  disabled={selectedUser.tareasActivas > 0}
                >
                  Confirmar baja lógica
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
        <DialogContent className="max-w-2xl p-6 rounded-2xl border-border bg-surface max-h-[85vh] flex flex-col">
          <DialogHeader className="border-b border-border/60 pb-3 shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="font-heading font-extrabold text-xl text-primary flex items-center gap-2">
                <Fingerprint className="size-5 text-primary" />
                <span>Expediente de Usuario y Seguridad</span>
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
                      <h3 className="font-heading font-bold text-base text-foreground truncate">
                        {selectedUser.nombreCompleto}
                      </h3>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">
                        Cédula: {selectedUser.cedula}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Correo: {selectedUser.correo}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl border border-border bg-surface space-y-1">
                      <span className="text-[11px] text-muted-foreground font-medium block">
                        Rol Institucional
                      </span>
                      <span className="font-bold text-foreground block">
                        {selectedUser.rolLabel}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl border border-border bg-surface space-y-1">
                      <span className="text-[11px] text-muted-foreground font-medium block">
                        Ámbito Asignado
                      </span>
                      <span className="font-bold text-foreground block">
                        {selectedUser.ambito}
                      </span>
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

                {/* Tab 3: Auditoría y Trazabilidad (ID-05) */}
                <TabsContent value="auditoria" className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-foreground block">
                      Trazabilidad Inalterable de Seguridad (Eventos Registrados)
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                      Historial cronológico de creaciones, cambios de rol, ámbito, suspensiones y reactivaciones.
                    </p>
                  </div>

                  {timelineItems.length === 0 ? (
                    <div className="py-8 text-center text-xs text-muted-foreground">
                      No hay eventos registrados para este usuario.
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
            <Button variant="outline" size="default" onClick={() => setModalDetalleOpen(false)}>
              Cerrar expediente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </WireframeDashboardLayout>
  );
}
