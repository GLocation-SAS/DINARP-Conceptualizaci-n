"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Pencil,
  MoreVertical,
  Mail,
  Key,
  Lock,
  Unlock,
  Clock,
  Shield,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { DetailList } from "@/components/ui/detail-list";
import { WireframeDashboardLayout } from "../../components/wireframe-dashboard-layout";
import { UsuarioModal, type UsuarioData } from "../components/usuario-modal";

interface UsuarioDetailClientProps {
  id: string;
}

export function UsuarioDetailClient({ id }: UsuarioDetailClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("informacion");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);

  // Editable user data state
  const [userData, setUserData] = useState<UsuarioData>({
    id,
    iniciales: "MC",
    nombre: "María Cuenca Serrano",
    correo: "maria.cuenca@registrocivil.gob.ec",
    institucion: "Registro Civil",
    cargo: "Analista de Interoperabilidad",
    rol: "Administrador",
    estado: "Activo",
    ultimoAcceso: "02/09/2026 10:24",
  });

  const handleSaveUser = (updated: UsuarioData) => {
    setUserData(updated);
  };

  const handleConfirmDeactivate = () => {
    const newStatus = userData.estado === "Activo" ? "Inactivo" : "Activo";
    setUserData((prev) => ({ ...prev, estado: newStatus }));

    if (newStatus === "Inactivo") {
      toast.warning(`Usuario ${userData.nombre} desactivado.`);
    } else {
      toast.success(`Usuario ${userData.nombre} reactivado.`);
    }

    setIsDeactivateOpen(false);
  };

  const nameParts = userData.nombre.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  return (
    <WireframeDashboardLayout activeMenu="usuarios">
      <main className="relative p-4 sm:p-6 lg:p-8 w-full space-y-6 sm:space-y-8">
        {/* Background subtle effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-muted/20 to-transparent pointer-events-none -z-10 blur-3xl opacity-60" />

        {/* ── 1. Breadcrumbs ── */}
        <Breadcrumb>
          <BreadcrumbList className="text-xs">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/wireframes/usuarios" className="text-muted-foreground hover:text-foreground">
                  Usuarios
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-foreground">
                Detalle de usuario
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* ── 2. Header Profile Card ── */}
        <Card className="rounded-2xl border-border bg-surface p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-5">
              {/* Big Avatar Circle */}
              <div className="size-16 sm:size-20 rounded-full bg-muted text-foreground font-extrabold text-xl sm:text-2xl flex items-center justify-center shrink-0 border border-border">
                {userData.iniciales || "MC"}
              </div>

              {/* User Info */}
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-foreground">
                    {userData.nombre}
                  </h1>
                  <Badge
                    tone={userData.estado === "Activo" ? "success" : "danger"}
                    appearance="soft"
                    size="sm"
                    className="font-semibold text-xs"
                  >
                    {userData.estado}
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground font-mono">
                  {userData.correo}
                </p>
                <p className="text-xs text-muted-foreground font-medium">
                  {userData.rol} · {userData.institucion}
                </p>
              </div>
            </div>

            {/* Actions Button */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(true)}
                className="h-10 px-4 rounded-xl text-xs font-semibold gap-1.5 border-border"
              >
                <Pencil className="size-3.5" />
                <span>Editar</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-10 border-border text-muted-foreground hover:text-foreground"
                  >
                    <MoreVertical className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                    <Pencil className="size-3.5 mr-2 text-muted-foreground" />
                    <span>Editar usuario</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Key className="size-3.5 mr-2 text-muted-foreground" />
                    <span>Reenviar contraseña</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Mail className="size-3.5 mr-2 text-muted-foreground" />
                    <span>Reenviar bienvenida</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {userData.estado === "Activo" ? (
                    <DropdownMenuItem
                      className="text-foreground focus:text-foreground"
                      onClick={() => setIsDeactivateOpen(true)}
                    >
                      <Lock className="size-3.5 mr-2" />
                      <span>Desactivar usuario</span>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      className="text-foreground focus:text-foreground"
                      onClick={() => setIsDeactivateOpen(true)}
                    >
                      <Unlock className="size-3.5 mr-2" />
                      <span>Reactivar usuario</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Card>

        {/* ── 3. Tabs de Detalle ── */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted/40 p-1 rounded-xl border border-border h-11 w-full sm:w-auto inline-flex">
            <TabsTrigger value="informacion" className="rounded-lg text-xs font-semibold px-4">
              Información
            </TabsTrigger>
            <TabsTrigger value="roles" className="rounded-lg text-xs font-semibold px-4">
              Roles y permisos
            </TabsTrigger>
            <TabsTrigger value="actividad" className="rounded-lg text-xs font-semibold px-4">
              Actividad
            </TabsTrigger>
          </TabsList>

          {/* ── Tab Content: Información ── */}
          <TabsContent value="informacion" className="space-y-6">
            <Card className="rounded-2xl border-border bg-surface p-6 sm:p-8 shadow-xs">
              <h2 className="text-sm font-bold text-foreground mb-6">
                Información general
              </h2>

              <DetailList
                columns={2}
                items={[
                  {
                    label: "Nombres",
                    value: firstName || "María",
                  },
                  {
                    label: "Apellidos",
                    value: lastName || "Cuenca Serrano",
                  },
                  {
                    label: "Correo electrónico",
                    value: <span className="font-mono text-xs">{userData.correo}</span>,
                  },
                  {
                    label: "Teléfono",
                    value: "099 587 6543",
                  },
                  {
                    label: "Institución",
                    value: userData.institucion,
                  },
                  {
                    label: "Cargo",
                    value: userData.cargo || "Analista de Interoperabilidad",
                  },
                  {
                    label: "Estado",
                    value: (
                      <Badge
                        tone={userData.estado === "Activo" ? "success" : "danger"}
                        appearance="soft"
                        size="sm"
                        className="font-semibold text-xs"
                      >
                        {userData.estado}
                      </Badge>
                    ),
                  },
                  {
                    label: "Fecha de creación",
                    value: "12/07/2026 09:15",
                  },
                  {
                    label: "Último acceso",
                    value: userData.ultimoAcceso || "02/09/2026 10:24",
                  },
                ]}
              />
            </Card>
          </TabsContent>

          {/* ── Tab Content: Roles y Permisos ── */}
          <TabsContent value="roles" className="space-y-6">
            <Card className="rounded-2xl border-border bg-surface p-6 sm:p-8 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-foreground">
                Rol asignado y facultades
              </h2>
              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-primary" />
                  <span className="text-xs font-bold text-foreground">{userData.rol} de Entidad</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Permiso para radicar solicitudes de interoperabilidad, autorizar consultas de datos sobre bases custodiadas y gestionar credenciales de acceso para la institución {userData.institucion}.
                </p>
              </div>
            </Card>
          </TabsContent>

          {/* ── Tab Content: Actividad ── */}
          <TabsContent value="actividad" className="space-y-6">
            <Card className="rounded-2xl border-border bg-surface p-6 sm:p-8 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-foreground">
                Registro reciente de actividad
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl border border-border/80 bg-background text-xs">
                  <Clock className="size-4 text-muted-foreground mt-0.5" />
                  <div>
                    <span className="font-bold text-foreground">Inicio de sesión exitoso</span>
                    <p className="text-muted-foreground text-[11px]">02/09/2026 10:24 desde IP 186.42.12.98</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl border border-border/80 bg-background text-xs">
                  <Shield className="size-4 text-muted-foreground mt-0.5" />
                  <div>
                    <span className="font-bold text-foreground">Aprobación de solicitud SOL-2026-001</span>
                    <p className="text-muted-foreground text-[11px]">16/08/2026 14:15</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* ── Modal de Edición de Usuario ── */}
      <UsuarioModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        initialData={userData}
        onSave={handleSaveUser}
      />

      {/* ── Dialog Warning: Desactivar / Reactivar Usuario ── */}
      <Dialog open={isDeactivateOpen} onOpenChange={setIsDeactivateOpen}>
        <DialogContent variant="standard" size="default" className="p-6 sm:p-8 bg-background border-border shadow-2xl rounded-3xl">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="size-14 rounded-full bg-muted/60 border border-border flex items-center justify-center text-foreground mb-1">
              {userData.estado === "Activo" ? (
                <Lock className="size-6 text-foreground" />
              ) : (
                <Unlock className="size-6 text-foreground" />
              )}
            </div>
            <DialogHeader className="text-center space-y-1.5">
              <DialogTitle className="text-xl font-heading font-bold text-foreground">
                {userData.estado === "Activo"
                  ? "¿Desactivar usuario?"
                  : "¿Reactivar usuario?"}
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {userData.estado === "Activo" ? (
                  <>
                    Estás a punto de suspender el acceso de{" "}
                    <strong className="text-foreground font-semibold">
                      {userData.nombre}
                    </strong>
                    . El usuario no podrá iniciar sesión en la plataforma hasta que sea reactivado.
                  </>
                ) : (
                  <>
                    ¿Deseas restaurar el acceso al sistema para{" "}
                    <strong className="text-foreground font-semibold">
                      {userData.nombre}
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
                {userData.estado === "Activo"
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
