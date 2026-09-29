"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Filter,
  Pencil,
  MoreVertical,
  ChevronDown,
  User,
  Shield,
  Eye,
  Trash2,
  Lock,
  Unlock,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { WireframeDashboardLayout } from "../components/wireframe-dashboard-layout";
import { UsuarioModal, type UsuarioData } from "./components/usuario-modal";
import { UsuarioDetalleModal } from "./components/usuario-detalle-modal";

const INITIAL_USUARIOS_DATA: UsuarioData[] = [
  {
    id: "USR-001",
    iniciales: "MC",
    nombre: "María Cuenca",
    correo: "maria.cuenca@registrocivil.gob.ec",
    institucion: "Registro Civil",
    cargo: "Administrador de Interoperabilidad",
    rol: "Administrador",
    estado: "Activo",
    ultimoAcceso: "02/09/2026 10:24",
  },
  {
    id: "USR-002",
    iniciales: "JP",
    nombre: "Juan Pérez",
    correo: "juan.perez@sri.gob.ec",
    institucion: "SRI",
    cargo: "Analista Tributario",
    rol: "Analista",
    estado: "Activo",
    ultimoAcceso: "01/09/2026 16:11",
  },
  {
    id: "USR-003",
    iniciales: "LA",
    nombre: "Luis Álvarez",
    correo: "luis.alvarez@educacion.gob.ec",
    institucion: "Ministerio de Educación",
    cargo: "Consultor Técnico",
    rol: "Consultor",
    estado: "Inactivo",
    ultimoAcceso: "28/08/2026 09:03",
  },
  {
    id: "USR-004",
    iniciales: "SC",
    nombre: "Sofía Castro",
    correo: "sofia.castro@dinarp.gob.ec",
    institucion: "DINARP",
    cargo: "Supervisora de Calidad",
    rol: "Administrador",
    estado: "Activo",
    ultimoAcceso: "03/09/2026 08:45",
  },
  {
    id: "USR-005",
    iniciales: "DR",
    nombre: "Diego Ruiz",
    correo: "diego.ruiz@salud.gob.ec",
    institucion: "Ministerio de Salud",
    cargo: "Analista de Datos",
    rol: "Analista",
    estado: "Activo",
    ultimoAcceso: "02/09/2026 14:20",
  },
];

export default function WireframeListadoUsuariosPage() {
  const router = useRouter();

  const [usuariosData, setUsuariosData] = useState<UsuarioData[]>(INITIAL_USUARIOS_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRol, setFilterRol] = useState("Todos");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal Ver Detalle
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailUser, setDetailUser] = useState<UsuarioData | null>(null);

  // Modal Crear / Editar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UsuarioData | null>(null);

  // Dialog Warning Desactivar
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
  const [userToDeactivate, setUserToDeactivate] = useState<UsuarioData | null>(null);

  const handleOpenDetailModal = (user: UsuarioData, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDetailUser(user);
    setIsDetailModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: UsuarioData, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleOpenDeactivateModal = (user: UsuarioData, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setUserToDeactivate(user);
    setIsDeactivateOpen(true);
  };

  const handleConfirmDeactivate = () => {
    if (!userToDeactivate) return;

    const newStatus = userToDeactivate.estado === "Activo" ? "Inactivo" : "Activo";

    setUsuariosData((prev) =>
      prev.map((u) =>
        u.id === userToDeactivate.id ? { ...u, estado: newStatus } : u
      )
    );

    if (newStatus === "Inactivo") {
      toast.warning(`Usuario ${userToDeactivate.nombre} desactivado.`);
    } else {
      toast.success(`Usuario ${userToDeactivate.nombre} reactivado correctamente.`);
    }

    setIsDeactivateOpen(false);
    setUserToDeactivate(null);
  };

  const handleSaveUser = (userData: UsuarioData) => {
    setUsuariosData((prev) => {
      const existsIndex = prev.findIndex((u) => u.id === userData.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = userData;
        return updated;
      }
      return [userData, ...prev];
    });

    if (detailUser && detailUser.id === userData.id) {
      setDetailUser(userData);
    }
  };

  const filteredData = useMemo(() => {
    return usuariosData.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.correo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.institucion.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.rol.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRol = filterRol === "Todos" || item.rol === filterRol;
      const matchesEstado = filterEstado === "Todos" || item.estado === filterEstado;

      return matchesSearch && matchesRol && matchesEstado;
    });
  }, [usuariosData, searchQuery, filterRol, filterEstado]);

  return (
    <WireframeDashboardLayout activeMenu="usuarios">
      <main className="relative p-4 sm:p-6 lg:p-8 w-full space-y-6 sm:space-y-8">
        {/* Background subtle effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-muted/20 to-transparent pointer-events-none -z-10 blur-3xl opacity-60" />

        {/* ── 1. Header Title, Description & Action ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight text-foreground">
              Usuarios
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed font-normal">
              Gestiona los usuarios de la plataforma.
            </p>
          </div>

          <Button
            type="button"
            variant="primary"
            onClick={handleOpenCreateModal}
            className="h-11 px-5 text-xs font-semibold gap-2 shadow-xs shrink-0"
          >
            <Plus className="size-4" />
            <span>Nuevo usuario</span>
          </Button>
        </div>

        {/* ── 2. Buscador y Filtros ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:max-w-md">
            <Search
              placeholder="Buscar por nombre, correo o institución..."
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
                {(filterRol !== "Todos" || filterEstado !== "Todos") && (
                  <span className="size-2 rounded-full bg-primary" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="text-xs">Filtrar por Rol</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={filterRol} onValueChange={setFilterRol}>
                <DropdownMenuRadioItem value="Todos">Todos los roles</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Administrador">Administrador</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Analista">Analista</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Consultor">Consultor</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs">Filtrar por Estado</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={filterEstado} onValueChange={setFilterEstado}>
                <DropdownMenuRadioItem value="Todos">Todos los estados</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Activo">Activo</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Inactivo">Inactivo</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* ── 3. Tabla de Usuarios ── */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                NOMBRE
              </TableHead>
              <TableHead>
                CORREO ELECTRÓNICO
              </TableHead>
              <TableHead>
                INSTITUCIÓN
              </TableHead>
              <TableHead>
                ROL
              </TableHead>
              <TableHead>
                ESTADO
              </TableHead>
              <TableHead>
                ÚLTIMO ACCESO
              </TableHead>
              <TableHead className="text-right">
                ACCIONES
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground text-sm">
                  No se encontraron usuarios con los filtros aplicados.
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

                  {/* Correo Electrónico */}
                  <TableCell className="text-muted-foreground font-medium">
                    {row.correo}
                  </TableCell>

                  {/* Institución */}
                  <TableCell className="text-muted-foreground font-medium">
                    {row.institucion}
                  </TableCell>

                  {/* Rol */}
                  <TableCell className="text-foreground font-semibold">
                    {row.rol}
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

                  {/* Último acceso */}
                  <TableCell className="text-muted-foreground font-mono">
                    {row.ultimoAcceso}
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
                            onClick={(e) => handleOpenEditModal(row, e)}
                            className="size-8 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            aria-label="Editar usuario"
                          >
                            <Pencil className="size-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Editar usuario</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={(e) => handleOpenDeactivateModal(row, e)}
                            className="size-8 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            aria-label={row.estado === "Activo" ? "Desactivar" : "Reactivar"}
                          >
                            {row.estado === "Activo" ? <Lock className="size-3.5" /> : <Unlock className="size-3.5" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{row.estado === "Activo" ? "Desactivar" : "Reactivar"}</TooltipContent>
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
            Mostrando <span className="font-bold text-foreground">{filteredData.length}</span> de <span className="font-bold text-foreground">{usuariosData.length}</span> usuarios
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

      {/* ── Modal de Ver Detalle de Usuario ── */}
      <UsuarioDetalleModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        usuario={detailUser}
        onEdit={(u) => handleOpenEditModal(u)}
      />

      {/* ── Modal de Crear / Editar Usuario ── */}
      <UsuarioModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        initialData={selectedUser}
        onSave={handleSaveUser}
      />

      {/* ── Dialog Warning: Desactivar / Reactivar Usuario ── */}
      <Dialog open={isDeactivateOpen} onOpenChange={setIsDeactivateOpen}>
        <DialogContent variant="standard" size="default" className="p-6 sm:p-8 bg-background border-border shadow-2xl rounded-3xl">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="size-14 rounded-full bg-muted/60 border border-border flex items-center justify-center text-foreground mb-1">
              {userToDeactivate?.estado === "Activo" ? (
                <Lock className="size-6 text-foreground" />
              ) : (
                <Unlock className="size-6 text-foreground" />
              )}
            </div>
            <DialogHeader className="text-center space-y-1.5">
              <DialogTitle className="text-xl font-heading font-bold text-foreground">
                {userToDeactivate?.estado === "Activo"
                  ? "¿Desactivar usuario?"
                  : "¿Reactivar usuario?"}
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {userToDeactivate?.estado === "Activo" ? (
                  <>
                    Estás a punto de suspender el acceso de{" "}
                    <strong className="text-foreground font-semibold">
                      {userToDeactivate?.nombre}
                    </strong>
                    . El usuario no podrá iniciar sesión en la plataforma hasta que sea reactivado.
                  </>
                ) : (
                  <>
                    ¿Deseas restaurar el acceso al sistema para{" "}
                    <strong className="text-foreground font-semibold">
                      {userToDeactivate?.nombre}
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
                onClick={() => setIsDeactivateOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="primary"
                className="w-full sm:flex-1 h-11 text-xs font-semibold"
                onClick={handleConfirmDeactivate}
              >
                {userToDeactivate?.estado === "Activo"
                  ? "Desactivar usuario"
                  : "Reactivar usuario"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </WireframeDashboardLayout>
  );
}
