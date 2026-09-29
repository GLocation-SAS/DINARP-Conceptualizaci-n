"use client";

import React, { useState, useEffect } from "react";
import {
  Shield,
  LayoutDashboard,
  FileText,
  Server,
  Activity,
  BarChart2,
  SlidersHorizontal,
  Users,
  Building,
  Settings,
  ChevronDown,
  Check,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Stepper, type Step } from "@/components/ui/stepper";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  InputGroup,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

export interface RolData {
  id?: string;
  iniciales?: string;
  nombre: string;
  descripcion: string;
  usuariosAsignados?: number;
  estado: "Activo" | "Inactivo";
  fechaActualizacion?: string;
  permisos?: Record<string, string[]>;
}

interface ModuleDefinition {
  id: string;
  name: string;
  category: "Operaciones" | "Gestión" | "Sistema";
  icon: React.ElementType;
  actions: { id: string; label: string }[];
}

const MODULES_CONFIG: ModuleDefinition[] = [
  {
    id: "dashboard",
    name: "Dashboard & KPIs",
    category: "Operaciones",
    icon: LayoutDashboard,
    actions: [{ id: "ver", label: "Ver" }],
  },
  {
    id: "solicitudes",
    name: "Solicitudes de Interoperabilidad",
    category: "Operaciones",
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
    name: "Catálogo de Servicios & Fuentes",
    category: "Operaciones",
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
    name: "Monitoreo & Trazabilidad",
    category: "Operaciones",
    icon: Activity,
    actions: [
      { id: "ver", label: "Ver" },
      { id: "exportar", label: "Exportar" },
    ],
  },
  {
    id: "reportes",
    name: "Reportes & Analítica",
    category: "Operaciones",
    icon: BarChart2,
    actions: [
      { id: "ver", label: "Ver" },
      { id: "exportar", label: "Exportar" },
    ],
  },
  {
    id: "usuarios",
    name: "Usuarios & Accesos",
    category: "Gestión",
    icon: Users,
    actions: [
      { id: "ver", label: "Ver" },
      { id: "crear", label: "Crear" },
      { id: "editar", label: "Editar" },
      { id: "eliminar", label: "Desactivar" },
    ],
  },
  {
    id: "roles",
    name: "Roles & Permisos",
    category: "Gestión",
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
    name: "Instituciones & Entidades",
    category: "Gestión",
    icon: Building,
    actions: [
      { id: "ver", label: "Ver" },
      { id: "editar", label: "Editar" },
    ],
  },
  {
    id: "administracion",
    name: "Parámetros & Configuración",
    category: "Sistema",
    icon: SlidersHorizontal,
    actions: [
      { id: "ver", label: "Ver" },
      { id: "configurar", label: "Configurar" },
    ],
  },
];

const DEFAULT_PERMISSIONS: Record<string, string[]> = {
  dashboard: ["ver"],
  solicitudes: ["ver", "crear", "editar"],
  servicios: ["ver"],
  monitoreo: ["ver"],
  reportes: ["ver", "exportar"],
  usuarios: ["ver"],
  roles: ["ver"],
  instituciones: ["ver"],
  administracion: ["ver"],
};

interface RolModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: RolData | null;
  onSave: (data: RolData) => void;
}

export function RolModal({
  open,
  onOpenChange,
  initialData,
  onSave,
}: RolModalProps) {
  const isEditing = Boolean(initialData?.id);

  const [activeTab, setActiveTab] = useState("general");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState<"Activo" | "Inactivo">("Activo");
  const [permissions, setPermissions] = useState<Record<string, string[]>>(DEFAULT_PERMISSIONS);

  useEffect(() => {
    if (open) {
      if (initialData) {
        setNombre(initialData.nombre || "");
        setDescripcion(initialData.descripcion || "");
        setEstado(initialData.estado || "Activo");
        setPermissions(initialData.permisos || DEFAULT_PERMISSIONS);
        setActiveTab("general");
      } else {
        setNombre("");
        setDescripcion("");
        setEstado("Activo");
        setPermissions(DEFAULT_PERMISSIONS);
        setActiveTab("general");
      }
    }
  }, [open, initialData]);

  const handleToggleAction = (moduleId: string, actionId: string) => {
    setPermissions((prev) => {
      const current = prev[moduleId] || [];
      const exists = current.includes(actionId);
      const updated = exists
        ? current.filter((a) => a !== actionId)
        : [...current, actionId];
      return { ...prev, [moduleId]: updated };
    });
  };

  const handleToggleAllModule = (module: ModuleDefinition) => {
    const allActionIds = module.actions.map((a) => a.id);
    const current = permissions[module.id] || [];
    const isAllSelected = allActionIds.every((id) => current.includes(id));

    setPermissions((prev) => ({
      ...prev,
      [module.id]: isAllSelected ? [] : allActionIds,
    }));
  };

  const handleSelectAllGlobal = () => {
    const allMap: Record<string, string[]> = {};
    MODULES_CONFIG.forEach((m) => {
      allMap[m.id] = m.actions.map((a) => a.id);
    });
    setPermissions(allMap);
    toast.info("Todos los permisos seleccionados.");
  };

  const handleClearAllGlobal = () => {
    setPermissions({});
    toast.info("Permisos desmarcados.");
  };

  const totalSelectedCount = Object.values(permissions).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      toast.error("Ingresa el nombre del rol.");
      return;
    }

    const initials = nombre
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const payload: RolData = {
      id: initialData?.id || `ROL-${Math.floor(100 + Math.random() * 900)}`,
      iniciales: initials || "RL",
      nombre: nombre.trim(),
      descripcion: descripcion.trim() || "Sin descripción proporcionada",
      usuariosAsignados: initialData?.usuariosAsignados ?? 0,
      estado,
      fechaActualizacion: "Ahora",
      permisos: permissions,
    };

    onSave(payload);
    toast.success(
      isEditing ? "Rol actualizado correctamente" : "Rol creado exitosamente"
    );
    onOpenChange(false);
  };

  const activeStep = activeTab === "general" ? 0 : 1;
  const completedSteps = activeTab === "permisos" ? [0] : [];

  const rolSteps: Step[] = [
    {
      id: "general",
      title: "Información básica",
      description: "Datos generales del rol",
      icon: FileText,
    },
    {
      id: "permisos",
      title: `Matriz de permisos (${totalSelectedCount})`,
      description: "Facultades y accesos",
      icon: ShieldCheck,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent variant="standard" size="2xl" className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-border/40">
          <DialogHeader className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <DialogTitle className="text-left font-heading font-extrabold text-xl sm:text-2xl text-foreground">
                {isEditing ? "Editar Rol" : "Crear Nuevo Rol"}
              </DialogTitle>
              <Badge appearance="soft" tone="neutral" size="sm" className="shrink-0 font-medium text-xs">
                {totalSelectedCount} permisos activos
              </Badge>
            </div>
            <DialogDescription className="text-left text-xs sm:text-sm text-muted-foreground">
              {isEditing
                ? "Modifica el nombre, descripción y facultades asignadas a este rol."
                : "Define los datos básicos y selecciona los permisos por cada módulo del sistema."}
            </DialogDescription>
          </DialogHeader>

          {/* Stepper Navigation */}
          <div className="mt-5 pt-1 px-4 sm:px-8">
            <Stepper
              steps={rolSteps}
              activeStep={activeStep}
              completedSteps={completedSteps}
              onStepClick={(index) => setActiveTab(index === 0 ? "general" : "permisos")}
              size="sm"
              showBadge={true}
              stepPrefix="Paso"
            />
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form id="rol-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "general" ? (
            <div className="space-y-4">
              {/* Nombre del Rol */}
              <div className="grid gap-1.5 text-left">
                <Label htmlFor="rol-nombre" className="text-xs font-semibold text-foreground">
                  Nombre del rol <span className="text-foreground">*</span>
                </Label>
                <InputGroup>
                  <InputGroupText>
                    <Shield className="size-4 text-muted-foreground" />
                  </InputGroupText>
                  <InputGroupInput
                    id="rol-nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Analista de Interoperabilidad"
                    required
                  />
                </InputGroup>
              </div>

              {/* Estado */}
              <div className="grid gap-1.5 text-left">
                <Label className="text-xs font-semibold text-foreground">
                  Estado del rol
                </Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 w-full justify-between px-3.5 rounded-full border-border/80 bg-background font-normal text-left shadow-none"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className={`size-2 rounded-full shrink-0 ${estado === "Activo" ? "bg-foreground" : "bg-foreground"
                            }`}
                        />
                        <span className="truncate text-foreground text-sm font-medium">{estado}</span>
                      </div>
                      <ChevronDown className="size-4 text-muted-foreground shrink-0 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuLabel className="text-xs">Seleccionar Estado</DropdownMenuLabel>
                    <DropdownMenuRadioGroup value={estado} onValueChange={(val) => setEstado(val as any)}>
                      <DropdownMenuRadioItem value="Activo">Activo</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Inactivo">Inactivo</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Descripción */}
              <div className="grid gap-1.5 text-left">
                <Label htmlFor="rol-descripcion" className="text-xs font-semibold text-foreground">
                  Descripción y alcance
                </Label>
                <Textarea
                  id="rol-descripcion"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Describe la función, responsabilidades y alcance operativo de este rol..."
                  rows={4}
                  className="rounded-xl border-border/80 bg-background text-sm resize-none"
                />
              </div>

              {/* Tips de Permisos */}
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-start gap-3">
                <Sparkles className="size-4 text-primary shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-semibold text-foreground">Siguiente paso: Asignar permisos</p>
                  <p className="text-muted-foreground leading-relaxed">
                    Pasa a la pestaña &ldquo;Matriz de permisos&rdquo; para autorizar qué módulos y acciones puede ejecutar este rol.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Permisos Actions Header */}
              <div className="flex items-center justify-between gap-2 pb-1 border-b border-border/40">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Módulos de la plataforma
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleSelectAllGlobal}
                    className="text-xs text-primary hover:text-primary h-7 px-2"
                  >
                    Marcar todos
                  </Button>
                  <span className="text-muted-foreground/40">·</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAllGlobal}
                    className="text-xs text-muted-foreground hover:text-foreground h-7 px-2"
                  >
                    Desmarcar
                  </Button>
                </div>
              </div>

              {/* Grid of Modules */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {MODULES_CONFIG.map((mod) => {
                  const Icon = mod.icon;
                  const currentActions = permissions[mod.id] || [];
                  const isAll = mod.actions.every((a) => currentActions.includes(a.id));

                  return (
                    <div
                      key={mod.id}
                      className="p-3.5 rounded-xl border border-border/80 bg-surface hover:border-border transition-colors space-y-2.5 shadow-2xs"
                    >
                      {/* Module Title & Toggle All */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="size-6 rounded-lg bg-muted text-foreground flex items-center justify-center shrink-0">
                            <Icon className="size-3.5 text-muted-foreground" />
                          </div>
                          <span className="text-xs font-bold text-foreground truncate">
                            {mod.name}
                          </span>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleAllModule(mod)}
                          className="text-[11px] h-6 px-1.5 text-muted-foreground hover:text-foreground shrink-0"
                        >
                          {isAll ? "Quitar" : "Todos"}
                        </Button>
                      </div>

                      {/* Action Checkboxes */}
                      <div className="flex flex-wrap gap-2 pt-1 border-t border-border/40">
                        {mod.actions.map((act) => {
                          const isChecked = currentActions.includes(act.id);
                          return (
                            <label
                              key={act.id}
                              className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-md cursor-pointer border transition-colors select-none ${isChecked
                                ? "bg-primary/10 border-primary/30 text-primary font-medium"
                                : "bg-background border-border/60 text-muted-foreground hover:border-border"
                                }`}
                            >
                              <Checkbox
                                checked={isChecked}
                                onCheckedChange={() => handleToggleAction(mod.id, act.id)}
                                className="size-3.5"
                              />
                              <span>{act.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="p-4 sm:px-6 bg-muted/20 border-t border-border/40">
          <DialogFooter showCloseButton={false} className="gap-2 sm:gap-3">
            {activeTab === "permisos" ? (
              <Button
                type="button"
                variant="neutral"
                onClick={() => setActiveTab("general")}
                className="rounded-full"
              >
                Volver a datos
              </Button>
            ) : (
              <Button
                type="button"
                variant="neutral"
                onClick={() => onOpenChange(false)}
                className="rounded-full"
              >
                Cancelar
              </Button>
            )}

            {activeTab === "general" ? (
              <Button
                type="button"
                variant="primary"
                onClick={() => setActiveTab("permisos")}
                className="rounded-full"
              >
                Continuar a Permisos →
              </Button>
            ) : (
              <Button
                type="submit"
                form="rol-form"
                variant="primary"
                className="rounded-full"
              >
                {isEditing ? "Guardar cambios" : "Crear rol"}
              </Button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

