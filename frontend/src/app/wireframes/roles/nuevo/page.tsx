"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  CheckCircle2,
  LayoutDashboard,
  FileText,
  Server,
  Activity,
  BarChart2,
  SlidersHorizontal,
  Users,
  Shield,
  Building,
  Settings,
  Info,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { WireframeDashboardLayout } from "../../components/wireframe-dashboard-layout";

interface ModulePermission {
  id: string;
  name: string;
  icon: React.ElementType;
  actions: { id: string; label: string }[];
}

const MODULES_CONFIG: ModulePermission[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: LayoutDashboard,
    actions: [{ id: "ver", label: "Ver" }],
  },
  {
    id: "solicitudes",
    name: "Solicitudes",
    icon: FileText,
    actions: [
      { id: "ver", label: "Ver" },
      { id: "crear", label: "Crear" },
      { id: "editar", label: "Editar" },
      { id: "aprobar", label: "Aprobar" },
    ],
  },
  {
    id: "servicios",
    name: "Servicios",
    icon: Server,
    actions: [
      { id: "ver", label: "Ver" },
      { id: "crear", label: "Crear" },
      { id: "editar", label: "Editar" },
      { id: "eliminar", label: "Eliminar" },
    ],
  },
  {
    id: "monitoreo",
    name: "Monitoreo",
    icon: Activity,
    actions: [
      { id: "ver", label: "Ver" },
      { id: "crear", label: "Crear" },
      { id: "editar", label: "Editar" },
      { id: "exportar", label: "Exportar" },
    ],
  },
  {
    id: "reportes",
    name: "Reportes",
    icon: BarChart2,
    actions: [
      { id: "ver", label: "Ver" },
      { id: "exportar", label: "Exportar" },
    ],
  },
  {
    id: "administracion",
    name: "Administración",
    icon: SlidersHorizontal,
    actions: [
      { id: "ver", label: "Ver" },
      { id: "configurar", label: "Configurar" },
    ],
  },
  {
    id: "usuarios",
    name: "Usuarios",
    icon: Users,
    actions: [
      { id: "ver", label: "Ver" },
      { id: "crear", label: "Crear" },
      { id: "editar", label: "Editar" },
      { id: "eliminar", label: "Eliminar" },
    ],
  },
  {
    id: "roles",
    name: "Roles",
    icon: Shield,
    actions: [
      { id: "ver", label: "Ver" },
      { id: "crear", label: "Crear" },
      { id: "editar", label: "Editar" },
      { id: "eliminar", label: "Eliminar" },
    ],
  },
  {
    id: "instituciones",
    name: "Instituciones",
    icon: Building,
    actions: [
      { id: "ver", label: "Ver" },
      { id: "crear", label: "Crear" },
      { id: "editar", label: "Editar" },
      { id: "eliminar", label: "Eliminar" },
    ],
  },
  {
    id: "configuracion",
    name: "Configuración",
    icon: Settings,
    actions: [
      { id: "ver", label: "Ver" },
      { id: "configurar", label: "Configurar" },
    ],
  },
];

export default function WireframeCrearRolPage() {
  const router = useRouter();

  // Form State
  const [nombreRol, setNombreRol] = useState("");
  const [estado, setEstado] = useState("Activo");
  const [descripcion, setDescripcion] = useState("");
  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    "dashboard-ver": true,
    "roles-ver": true,
  });
  const [accesoTotal, setAccesoTotal] = useState(false);

  // Success view state
  const [isCreated, setIsCreated] = useState(false);

  const togglePermission = (key: string) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleToggleAccesoTotal = (checked: boolean) => {
    setAccesoTotal(checked);
    const newPerms: Record<string, boolean> = {};
    MODULES_CONFIG.forEach((mod) => {
      mod.actions.forEach((act) => {
        newPerms[`${mod.id}-${act.id}`] = checked;
      });
    });
    setPermissions(newPerms);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreated(true);
  };

  const handleReset = () => {
    setNombreRol("");
    setEstado("Activo");
    setDescripcion("");
    setPermissions({
      "dashboard-ver": true,
      "roles-ver": true,
    });
    setAccesoTotal(false);
    setIsCreated(false);
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
                Crear rol
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {!isCreated ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ── 2. Header Title & Description ── */}
            <div className="space-y-1">
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-foreground tracking-tight">
                Crear rol
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Completa la información del nuevo rol y asigna los permisos correspondientes.
              </p>
            </div>

            {/* ── 3. Two-Column Layout ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Columna Izquierda: Información General (4 cols) */}
              <Card className="lg:col-span-5 rounded-2xl border-border bg-surface p-6 sm:p-7 space-y-5 shadow-xs">
                <h2 className="text-sm font-bold text-foreground">
                  Información general
                </h2>

                <div className="space-y-4">
                  {/* Nombre del rol */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Nombre del rol <span className="text-destructive">*</span>
                    </label>
                    <InputGroup className="bg-surface h-10 rounded-xl border-border">
                      <InputGroupInput
                        placeholder="Ej. Analista"
                        value={nombreRol}
                        onChange={(e) => setNombreRol(e.target.value)}
                        required
                        className="text-xs sm:text-sm"
                      />
                    </InputGroup>
                  </div>

                  {/* Estado */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Estado <span className="text-destructive">*</span>
                    </label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="h-10 px-3 flex items-center justify-between bg-surface border-border text-left w-full text-xs font-normal"
                        >
                          <span className="text-foreground truncate">{estado}</span>
                          <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-48">
                        <DropdownMenuRadioGroup value={estado} onValueChange={setEstado}>
                          <DropdownMenuRadioItem value="Activo">Activo</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="Inactivo">Inactivo</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Descripción */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-foreground">
                        Descripción <span className="text-destructive">*</span>
                      </label>
                    </div>
                    <Textarea
                      placeholder="Describe el propósito del rol..."
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value.slice(0, 300))}
                      required
                      className="min-h-[120px] rounded-xl text-xs sm:text-sm resize-none"
                    />
                    <div className="flex justify-end">
                      <span className="text-[11px] text-muted-foreground">{descripcion.length}/300</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Columna Derecha: Matriz de Permisos (7 cols) */}
              <Card className="lg:col-span-7 rounded-2xl border-border bg-surface p-6 sm:p-7 space-y-5 shadow-xs">
                <div className="flex items-center justify-between gap-4 pb-2 border-b border-border/70">
                  <h2 className="text-sm font-bold text-foreground">
                    Permisos
                  </h2>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="acceso-total"
                      checked={accesoTotal}
                      onCheckedChange={(checked) => handleToggleAccesoTotal(!!checked)}
                    />
                    <label
                      htmlFor="acceso-total"
                      className="text-xs font-medium text-foreground cursor-pointer flex items-center gap-1"
                    >
                      <span>Asignar acceso total</span>
                      <Info className="size-3 text-muted-foreground" />
                    </label>
                  </div>
                </div>

                {/* Lista de Módulos y Checkboxes */}
                <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                  {MODULES_CONFIG.map((module) => {
                    const Icon = module.icon;
                    return (
                      <div
                        key={module.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/30 transition-colors gap-2 sm:gap-4"
                      >
                        {/* Módulo Info */}
                        <div className="flex items-center gap-2.5 min-w-[130px]">
                          <Icon className="size-4 text-muted-foreground shrink-0" />
                          <span className="text-xs font-bold text-foreground">
                            {module.name}
                          </span>
                        </div>

                        {/* Checkboxes de Acciones */}
                        <div className="flex flex-wrap items-center gap-4">
                          {module.actions.map((act) => {
                            const key = `${module.id}-${act.id}`;
                            const isChecked = !!permissions[key];
                            return (
                              <div key={key} className="flex items-center space-x-1.5">
                                <Checkbox
                                  id={key}
                                  checked={isChecked}
                                  onCheckedChange={() => togglePermission(key)}
                                />
                                <label
                                  htmlFor={key}
                                  className="text-[11px] font-medium text-muted-foreground hover:text-foreground cursor-pointer"
                                >
                                  {act.label}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Acciones */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/wireframes/roles")}
                className="h-10 px-5 rounded-xl text-xs font-semibold border-border"
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                variant="primary"
                className="h-10 px-6 text-xs font-semibold shadow-xs"
              >
                Guardar rol
              </Button>
            </div>
          </form>
        ) : (
          /* ── 5. Confirmación de Creación ── */
          <Card className="rounded-2xl border-border bg-surface p-10 sm:p-14 text-center max-w-lg mx-auto shadow-sm space-y-6">
            <div className="size-20 rounded-full bg-foreground/15 text-foreground flex items-center justify-center mx-auto">
              <CheckCircle2 className="size-10" />
            </div>

            <div className="space-y-2">
              <h2 className="font-heading font-extrabold text-2xl text-foreground">
                Rol creado exitosamente
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
                El rol ha sido creado y ya está disponible para ser asignado a usuarios.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Button
                type="button"
                variant="primary"
                onClick={handleReset}
                className="w-full sm:w-auto h-11 px-6 text-xs font-semibold"
              >
                Crear otro rol
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/wireframes/roles")}
                className="w-full sm:w-auto h-11 px-6 rounded-xl text-xs font-semibold border-border"
              >
                Ir al listado
              </Button>
            </div>
          </Card>
        )}
      </main>
    </WireframeDashboardLayout>
  );
}

