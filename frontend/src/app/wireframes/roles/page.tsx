"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Filter,
  Eye,
  Pencil,
  MoreVertical,
  ChevronDown,
  ShieldCheck,
  Users,
  Trash2,
  Lock,
  Unlock,
  Copy,
  AlertTriangle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Search } from "@/components/ui/search";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { WireframeDashboardLayout } from "../components/wireframe-dashboard-layout";
import { RolModal, type RolData } from "./components/rol-modal";
import { RolDetalleModal } from "./components/rol-detalle-modal";

const INITIAL_ROLES_DATA: RolData[] = [
  {
    id: "ROL-001",
    iniciales: "AG",
    nombre: "Administrador general",
    descripcion: "Acceso total a la plataforma y configuración institucional.",
    usuariosAsignados: 12,
    estado: "Activo",
    fechaActualizacion: "02/09/2026 10:24",
  },
  {
    id: "ROL-002",
    iniciales: "CS",
    nombre: "Coordinador SINAP",
    descripcion: "Coordina procesos, validaciones y autorizaciones del SINAP.",
    usuariosAsignados: 8,
    estado: "Activo",
    fechaActualizacion: "01/09/2026 16:11",
  },
  {
    id: "ROL-003",
    iniciales: "AN",
    nombre: "Analista",
    descripcion: "Analiza, procesa y gestiona información técnica de interoperabilidad.",
    usuariosAsignados: 25,
    estado: "Activo",
    fechaActualizacion: "28/08/2026 09:03",
  },
  {
    id: "ROL-004",
    iniciales: "RV",
    nombre: "Revisor",
    descripcion: "Revisa y valida solicitudes de acceso e interoperabilidad.",
    usuariosAsignados: 6,
    estado: "Inactivo",
    fechaActualizacion: "20/08/2026 14:37",
  },
  {
    id: "ROL-005",
    iniciales: "CO",
    nombre: "Consulta",
    descripcion: "Acceso de solo lectura sobre catálogos y reportes sectoriales.",
    usuariosAsignados: 18,
    estado: "Activo",
    fechaActualizacion: "15/08/2026 11:21",
  },
];

export default function WireframeListadoRolesPage() {
  const router = useRouter();

  const [rolesList, setRolesList] = useState<RolData[]>(INITIAL_ROLES_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal Ver Detalle Rol
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailRol, setDetailRol] = useState<RolData | null>(null);

  // Modal de Crear / Editar Rol
  const [isRolModalOpen, setIsRolModalOpen] = useState(false);
  const [editingRol, setEditingRol] = useState<RolData | null>(null);

  // Dialog de advertencia (Desactivar / Reactivar / Eliminar)
  const [targetRol, setTargetRol] = useState<RolData | null>(null);
  const [isWarningDialogOpen, setIsWarningDialogOpen] = useState(false);
  const [warningAction, setWarningAction] = useState<"toggle" | "delete">("toggle");

  const handleOpenDetailModal = (rol: RolData, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDetailRol(rol);
    setIsDetailModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingRol(null);
    setIsRolModalOpen(true);
  };

  const handleOpenEdit = (rol: RolData, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingRol(rol);
    setIsRolModalOpen(true);
  };

  const handleOpenWarning = (rol: RolData, action: "toggle" | "delete", e?: React.MouseEvent) => {
    e?.stopPropagation();
    setTargetRol(rol);
    setWarningAction(action);
    setIsWarningDialogOpen(true);
  };

  const handleConfirmWarning = () => {
    if (!targetRol) return;

    if (warningAction === "delete") {
      setRolesList((prev) => prev.filter((r) => r.id !== targetRol.id));
      toast.success(`Rol "${targetRol.nombre}" eliminado correctamente.`);
    } else {
      const newStatus = targetRol.estado === "Activo" ? "Inactivo" : "Activo";
      setRolesList((prev) =>
        prev.map((r) => (r.id === targetRol.id ? { ...r, estado: newStatus, fechaActualizacion: "Ahora" } : r))
      );
      if (newStatus === "Inactivo") {
        toast.warning(`Rol "${targetRol.nombre}" desactivado.`);
      } else {
        toast.success(`Rol "${targetRol.nombre}" reactivado.`);
      }
    }

    setIsWarningDialogOpen(false);
    setTargetRol(null);
  };

  const handleSaveRol = (data: RolData) => {
    setRolesList((prev) => {
      const idx = prev.findIndex((r) => r.id === data.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = data;
        return updated;
      }
      return [data, ...prev];
    });

    if (detailRol && detailRol.id === data.id) {
      setDetailRol(data);
    }
  };

  const handleDuplicate = (rol: RolData, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newRol: RolData = {
      ...rol,
      id: `ROL-00${rolesList.length + 1}`,
      nombre: `${rol.nombre} (Copia)`,
      usuariosAsignados: 0,
      fechaActualizacion: "Ahora",
    };
    setRolesList((prev) => [newRol, ...prev]);
    toast.success(`Rol duplicado como "${newRol.nombre}".`);
  };

  const filteredData = useMemo(() => {
    return rolesList.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.descripcion.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesEstado = filterEstado === "Todos" || item.estado === filterEstado;

      return matchesSearch && matchesEstado;
    });
  }, [rolesList, searchQuery, filterEstado]);

  return (
    <WireframeDashboardLayout activeMenu="roles">
      <main className="relative p-4 sm:p-6 lg:p-8 w-full space-y-6 sm:space-y-8">
        {/* Background subtle effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-muted/20 to-transparent pointer-events-none -z-10 blur-3xl opacity-60" />

        {/* ── 1. Header Title & Actions ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight text-foreground">
              Roles
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed font-normal">
              Gestiona los roles y permisos de la plataforma.
            </p>
          </div>

          <Button
            type="button"
            variant="primary"
            onClick={handleOpenCreate}
            className="h-11 px-5 text-xs font-semibold gap-2 shadow-xs shrink-0"
          >
            <Plus className="size-4" />
            <span>Nuevo rol</span>
          </Button>
        </div>

        {/* ── 2. Buscador y Filtros ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:max-w-md">
            <Search
              placeholder="Buscar por nombre o descripción..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
              className="bg-surface rounded-xl border-border/80"
            />
          </div>

          {/* Botón Filtros Desplegable */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-11 px-4 text-xs font-semibold gap-2 border-border/80 bg-surface w-full sm:w-auto"
              >
                <Filter className="size-3.5 text-muted-foreground" />
                <span>Filtros</span>
                {filterEstado !== "Todos" && (
                  <span className="size-2 rounded-full bg-primary" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs">Filtrar por Estado</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={filterEstado} onValueChange={setFilterEstado}>
                <DropdownMenuRadioItem value="Todos">Todos los estados</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Activo">Activo</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Inactivo">Inactivo</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* ── 3. Tabla de Roles ── */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                NOMBRE DEL ROL
              </TableHead>
              <TableHead>
                DESCRIPCIÓN
              </TableHead>
              <TableHead>
                USUARIOS ASIGNADOS
              </TableHead>
              <TableHead>
                ESTADO
              </TableHead>
              <TableHead>
                ÚLTIMA ACTUALIZACIÓN
              </TableHead>
              <TableHead className="text-right">
                ACCIONES
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground text-sm">
                  No se encontraron roles con los filtros aplicados.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer"
                  onClick={() => handleOpenDetailModal(row)}
                >
                  {/* Nombre con Avatar de Iniciales */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-muted text-foreground font-bold text-xs flex items-center justify-center shrink-0">
                        {row.iniciales}
                      </div>
                      <span className="font-bold text-foreground">
                        {row.nombre}
                      </span>
                    </div>
                  </TableCell>

                  {/* Descripción */}
                  <TableCell className="text-muted-foreground max-w-xs truncate">
                    {row.descripcion}
                  </TableCell>

                  {/* Usuarios Asignados */}
                  <TableCell>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/60 text-foreground text-xs font-semibold">
                      <Users className="size-3 text-muted-foreground" />
                      <span>{row.usuariosAsignados}</span>
                    </div>
                  </TableCell>

                  {/* Estado Badge */}
                  <TableCell>
                    <Badge
                      tone={row.estado === "Activo" ? "success" : "danger"}
                      appearance="soft"
                      size="sm"
                      className="font-medium gap-1 text-xs"
                    >
                      {row.estado}
                    </Badge>
                  </TableCell>

                  {/* Última actualización */}
                  <TableCell className="text-muted-foreground font-mono">
                    {row.fechaActualizacion}
                  </TableCell>

                  {/* Acciones */}
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={(e) => handleOpenDetailModal(row, e)}
                            className="size-8 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            aria-label="Ver detalle"
                          >
                            <Eye className="size-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Ver detalle</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={(e) => handleOpenEdit(row, e)}
                            className="size-8 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            aria-label="Editar rol"
                          >
                            <Pencil className="size-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Editar rol</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={(e) => handleDuplicate(row, e)}
                            className="size-8 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            aria-label="Duplicar rol"
                          >
                            <Copy className="size-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Duplicar rol</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={(e) => handleOpenWarning(row, "toggle", e)}
                            className="size-8 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            aria-label={row.estado === "Activo" ? "Desactivar" : "Reactivar"}
                          >
                            {row.estado === "Activo" ? <Lock className="size-3.5" /> : <Unlock className="size-3.5" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{row.estado === "Activo" ? "Desactivar" : "Reactivar"}</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={(e) => handleOpenWarning(row, "delete", e)}
                            className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            aria-label="Eliminar rol"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Eliminar rol</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* ── 4. Paginación Estandarizada Circular ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-muted-foreground font-medium order-2 sm:order-1">
            Mostrando <span className="font-bold text-foreground">{filteredData.length}</span> de <span className="font-bold text-foreground">{rolesList.length}</span> roles
          </p>

          <div className="order-1 sm:order-2">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage((p) => Math.max(1, p - 1));
                    }}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === 1}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(1);
                    }}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === 2}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(2);
                    }}
                  >
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage((p) => Math.min(2, p + 1));
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </main>

      {/* ── Modal Ver Detalle Rol ── */}
      <RolDetalleModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        rol={detailRol}
        onEdit={(r) => handleOpenEdit(r)}
      />

      {/* ── Modal de Crear / Editar Rol ── */}
      <RolModal
        open={isRolModalOpen}
        onOpenChange={setIsRolModalOpen}
        initialData={editingRol}
        onSave={handleSaveRol}
      />

      {/* ── Dialog Warning: Desactivar / Eliminar Rol ── */}
      <Dialog open={isWarningDialogOpen} onOpenChange={setIsWarningDialogOpen}>
        <DialogContent variant="standard" size="default" className="p-6 sm:p-8 bg-background border-border shadow-2xl rounded-3xl">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="size-14 rounded-full bg-muted/60 border border-border flex items-center justify-center text-foreground mb-1">
              {warningAction === "delete" ? (
                <Trash2 className="size-6 text-foreground" />
              ) : targetRol?.estado === "Activo" ? (
                <Lock className="size-6 text-foreground" />
              ) : (
                <Unlock className="size-6 text-foreground" />
              )}
            </div>
            <DialogHeader className="text-center space-y-1.5">
              <DialogTitle className="text-xl font-heading font-bold text-foreground">
                {warningAction === "delete"
                  ? "¿Eliminar rol?"
                  : targetRol?.estado === "Activo"
                  ? "¿Desactivar rol?"
                  : "¿Reactivar rol?"}
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {warningAction === "delete" ? (
                  <>
                    Estás a punto de eliminar permanentemente el rol{" "}
                    <strong className="text-foreground font-semibold">
                      {targetRol?.nombre}
                    </strong>
                    . Los {targetRol?.usuariosAsignados || 0} usuarios con este rol perderán sus facultades.
                  </>
                ) : targetRol?.estado === "Activo" ? (
                  <>
                    Estás a punto de desactivar el rol{" "}
                    <strong className="text-foreground font-semibold">
                      {targetRol?.nombre}
                    </strong>
                    . Los usuarios vinculados no podrán ejecutar sus permisos asociados.
                  </>
                ) : (
                  <>
                    ¿Deseas reactivar el rol{" "}
                    <strong className="text-foreground font-semibold">
                      {targetRol?.nombre}
                    </strong>
                    ?
                  </>
                )}
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-4 flex flex-col sm:flex-row gap-2.5 w-full">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:flex-1 h-11 text-xs font-semibold"
                onClick={() => setIsWarningDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="primary"
                className="w-full sm:flex-1 h-11 text-xs font-semibold"
                onClick={handleConfirmWarning}
              >
                {warningAction === "delete"
                  ? "Eliminar rol"
                  : targetRol?.estado === "Activo"
                  ? "Desactivar rol"
                  : "Reactivar rol"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </WireframeDashboardLayout>
  );
}
