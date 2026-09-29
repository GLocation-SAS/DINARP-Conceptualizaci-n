"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Pencil,
  MoreVertical,
  Users,
  Shield,
  LayoutDashboard,
  FileText,
  Server,
  Activity,
  BarChart2,
  SlidersHorizontal,
  Building,
  Settings,
  CheckCircle2,
  UserCheck,
  Lock,
  Unlock,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { WireframeDashboardLayout } from "../../components/wireframe-dashboard-layout";
import { RolModal, type RolData } from "../components/rol-modal";

interface RolDetailClientProps {
  id: string;
}

const MODULE_PERMISSIONS_LIST = [
  { module: "Dashboard & KPIs", icon: LayoutDashboard, permissions: "Ver" },
  { module: "Solicitudes de Interoperabilidad", icon: FileText, permissions: "Ver, Crear, Editar, Aprobar" },
  { module: "Catálogo de Servicios & Fuentes", icon: Server, permissions: "Ver, Crear, Editar" },
  { module: "Monitoreo & Trazabilidad", icon: Activity, permissions: "Ver, Exportar" },
  { module: "Reportes & Analítica", icon: BarChart2, permissions: "Ver, Exportar" },
  { module: "Usuarios & Accesos", icon: Users, permissions: "Ver, Crear, Editar" },
  { module: "Roles & Permisos", icon: Shield, permissions: "Ver, Crear, Editar" },
  { module: "Instituciones & Entidades", icon: Building, permissions: "Ver, Editar" },
  { module: "Parámetros & Configuración", icon: SlidersHorizontal, permissions: "Ver, Configurar" },
];

const ASSIGNED_USERS_MOCK = [
  { name: "Juan Pérez", email: "juan.perez@entidad.gob.ec", cargo: "Coordinador de TI", estado: "Activo" },
  { name: "María Cuenca Serrano", email: "maria.cuenca@dinarp.gob.ec", cargo: "Especialista de Sistemas", estado: "Activo" },
  { name: "Luis Andrade", email: "luis.andrade@registrocivil.gob.ec", cargo: "Administrador de Datos", estado: "Activo" },
  { name: "Sofia Castro", email: "sofia.castro@sri.gob.ec", cargo: "Analista de Interoperabilidad", estado: "Activo" },
  { name: "Diego Ramos", email: "diego.ramos@educacion.gob.ec", cargo: "Líder Técnico", estado: "Activo" },
];

export function RolDetailClient({ id }: RolDetailClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("permisos");

  const [rolData, setRolData] = useState<RolData>({
    id,
    iniciales: id === "ROL-001" ? "AG" : "CS",
    nombre: id === "ROL-001" ? "Administrador general" : "Coordinador SINAP",
    descripcion:
      id === "ROL-001"
        ? "Acceso total a la plataforma y configuración institucional."
        : "Coordina y supervisa los procesos del SINAP, gestiona solicitudes y da seguimiento a su ejecución.",
    usuariosAsignados: id === "ROL-001" ? 12 : 8,
    estado: "Activo",
    fechaActualizacion: "02/09/2026 10:24",
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isWarningDialogOpen, setIsWarningDialogOpen] = useState(false);

  const handleSaveRol = (updated: RolData) => {
    setRolData(updated);
  };

  const handleConfirmDeactivate = () => {
    const newStatus = rolData.estado === "Activo" ? "Inactivo" : "Activo";
    setRolData((prev) => ({ ...prev, estado: newStatus }));

    if (newStatus === "Inactivo") {
      toast.warning(`Rol "${rolData.nombre}" desactivado.`);
    } else {
      toast.success(`Rol "${rolData.nombre}" reactivado.`);
    }

    setIsWarningDialogOpen(false);
  };

  return (
    <WireframeDashboardLayout activeMenu="roles">
      <main className="relative p-4 sm:p-6 lg:p-8 w-full space-y-6 sm:space-y-8">
        {/* Background subtle effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-muted/20 to-transparent pointer-events-none -z-10 blur-3xl opacity-60" />

        {/* ── 1. Breadcrumbs ── */}
        <Breadcrumb>
          <BreadcrumbList className="text-xs">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/wireframes/roles" className="text-muted-foreground hover:text-foreground">
                  Roles
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-foreground">
                Detalle de rol
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* ── 2. Profile Header Card ── */}
        <Card className="rounded-2xl border-border bg-surface p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="size-14 sm:size-16 rounded-full bg-muted text-foreground font-bold text-xl flex items-center justify-center shrink-0 border border-border">
                {rolData.iniciales || "RL"}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-foreground">
                    {rolData.nombre}
                  </h1>
                  <Badge
                    tone={rolData.estado === "Activo" ? "success" : "danger"}
                    appearance="soft"
                    size="sm"
                    className="font-semibold text-xs"
                  >
                    {rolData.estado}
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                  {rolData.descripcion}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(true)}
                className="h-10 px-4 rounded-xl text-xs font-semibold gap-2 border-border bg-surface"
              >
                <Pencil className="size-3.5" />
                <span>Editar</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="size-10 text-muted-foreground hover:text-foreground"
                  >
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem onClick={() => setActiveTab("usuarios")}>
                    <Users className="size-3.5 mr-2" />
                    <span>Ver usuarios ({rolData.usuariosAsignados || 0})</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {rolData.estado === "Activo" ? (
                    <DropdownMenuItem
                      className="text-foreground focus:text-foreground"
                      onClick={() => setIsWarningDialogOpen(true)}
                    >
                      <Lock className="size-3.5 mr-2" />
                      <span>Desactivar rol</span>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      className="text-foreground focus:text-foreground"
                      onClick={() => setIsWarningDialogOpen(true)}
                    >
                      <Unlock className="size-3.5 mr-2" />
                      <span>Reactivar rol</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Card>

        {/* ── 3. Tabs Navigation ── */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
          <TabsList className="bg-muted/40 p-1 rounded-xl h-auto border border-border/60">
            <TabsTrigger value="permisos" className="rounded-lg text-xs font-semibold py-2 px-4">
              Permisos asignados
            </TabsTrigger>
            <TabsTrigger value="usuarios" className="rounded-lg text-xs font-semibold py-2 px-4">
              Usuarios asignados ({rolData.usuariosAsignados || 0})
            </TabsTrigger>
          </TabsList>

          {/* ── Tab: Permisos ── */}
          <TabsContent value="permisos" className="space-y-6 m-0">
            <div className="space-y-0.5">
              <h2 className="text-sm font-bold text-foreground">
                Permisos por módulo
              </h2>
              <p className="text-xs text-muted-foreground">
                Facultades autorizadas para usuarios que posean el rol de {rolData.nombre}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {MODULE_PERMISSIONS_LIST.map((mod) => {
                const Icon = mod.icon;
                return (
                  <div
                    key={mod.module}
                    className="p-4 rounded-xl border border-border/80 bg-surface flex items-start gap-3.5 shadow-2xs"
                  >
                    <div className="size-8 rounded-lg bg-muted text-foreground flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="size-4 text-muted-foreground" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h3 className="text-xs font-bold text-foreground truncate">
                        {mod.module}
                      </h3>
                      <p className="text-xs text-primary font-medium">
                        {mod.permissions}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          {/* ── Tab: Usuarios ── */}
          <TabsContent value="usuarios" className="space-y-6 m-0">
            <div className="space-y-0.5">
              <h2 className="text-sm font-bold text-foreground">
                Usuarios con este rol
              </h2>
              <p className="text-xs text-muted-foreground">
                Listado de funcionarios que tienen actualmente asignado este rol.
              </p>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NOMBRE</TableHead>
                  <TableHead>CORREO ELECTRÓNICO</TableHead>
                  <TableHead>CARGO</TableHead>
                  <TableHead>ESTADO</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ASSIGNED_USERS_MOCK.map((u, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-bold text-foreground flex items-center gap-2">
                      <UserCheck className="size-4 text-muted-foreground" />
                      <span>{u.name}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">
                      {u.email}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {u.cargo}
                    </TableCell>
                    <TableCell>
                      <Badge tone="neutral" appearance="soft" size="sm">
                        {u.estado}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <p className="text-xs text-muted-foreground font-medium">
                Mostrando 1 a {ASSIGNED_USERS_MOCK.length} de {ASSIGNED_USERS_MOCK.length} usuarios
              </p>
              <Pagination className="mx-0 w-auto justify-end">
                <PaginationContent className="gap-1.5">
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* ── Modal de Edición de Rol ── */}
      <RolModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        initialData={rolData}
        onSave={handleSaveRol}
      />

      {/* ── Dialog Warning: Desactivar Rol ── */}
      <Dialog open={isWarningDialogOpen} onOpenChange={setIsWarningDialogOpen}>
        <DialogContent variant="standard" size="default" className="p-6 sm:p-8 bg-background border-border shadow-2xl rounded-3xl">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="size-14 rounded-full bg-muted/60 border border-border flex items-center justify-center text-foreground mb-1">
              {rolData.estado === "Activo" ? (
                <Lock className="size-6 text-foreground" />
              ) : (
                <Unlock className="size-6 text-foreground" />
              )}
            </div>
            <DialogHeader className="text-center space-y-1.5">
              <DialogTitle className="text-xl font-heading font-bold text-foreground">
                {rolData.estado === "Activo" ? "¿Desactivar rol?" : "¿Reactivar rol?"}
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {rolData.estado === "Activo" ? (
                  <>
                    Estás a punto de desactivar el rol{" "}
                    <strong className="text-foreground font-semibold">
                      {rolData.nombre}
                    </strong>
                    . Los {rolData.usuariosAsignados || 0} usuarios asignados no podrán operar con sus permisos asociados.
                  </>
                ) : (
                  <>
                    ¿Deseas reactivar el rol{" "}
                    <strong className="text-foreground font-semibold">
                      {rolData.nombre}
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
                onClick={handleConfirmDeactivate}
              >
                {rolData.estado === "Activo" ? "Desactivar rol" : "Reactivar rol"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </WireframeDashboardLayout>
  );
}
