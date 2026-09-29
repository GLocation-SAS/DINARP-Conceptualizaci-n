"use client";

import React, { useState } from "react";
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
  Pencil,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import type { RolData } from "./rol-modal";

interface RolDetalleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rol: RolData | null;
  onEdit: (rol: RolData) => void;
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
  { name: "Juan Pérez", email: "juan.perez@sri.gob.ec", cargo: "Analista Tributario", estado: "Activo" },
  { name: "María Cuenca Serrano", email: "maria.cuenca@registrocivil.gob.ec", cargo: "Administrador de Datos", estado: "Activo" },
  { name: "Diego Ruiz", email: "diego.ruiz@salud.gob.ec", cargo: "Analista de Datos", estado: "Activo" },
  { name: "Sofia Castro", email: "sofia.castro@dinarp.gob.ec", cargo: "Supervisora de Calidad", estado: "Activo" },
];

export function RolDetalleModal({
  open,
  onOpenChange,
  rol,
  onEdit,
}: RolDetalleModalProps) {
  const [activeTab, setActiveTab] = useState("permisos");

  if (!rol) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent variant="standard" size="xl" className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        {/* Header Profile Area */}
        <div className="p-6 pb-4 border-b border-border/40 bg-surface">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="size-14 rounded-full bg-muted text-foreground font-extrabold text-lg flex items-center justify-center shrink-0 border border-border">
                {rol.iniciales || "RL"}
              </div>

              {/* Basic info */}
              <div className="space-y-1 min-w-0 flex-1 text-left">
                <div className="flex items-center gap-2 flex-wrap">
                  <DialogTitle className="font-heading font-extrabold text-lg sm:text-xl text-foreground truncate">
                    {rol.nombre}
                  </DialogTitle>
                  <Badge
                    tone="neutral"
                    appearance="soft"
                    size="sm"
                    className="font-semibold text-xs"
                  >
                    {rol.estado}
                  </Badge>
                </div>
                <DialogDescription className="text-xs text-muted-foreground line-clamp-2">
                  {rol.descripcion}
                </DialogDescription>
              </div>
            </div>

            {/* Navigation Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-muted/40 p-1 rounded-xl border border-border h-10 w-full grid grid-cols-2">
                <TabsTrigger value="permisos" className="rounded-lg text-xs font-semibold">
                  Permisos por módulo
                </TabsTrigger>
                <TabsTrigger value="usuarios" className="rounded-lg text-xs font-semibold">
                  Usuarios asignados ({rol.usuariosAsignados ?? ASSIGNED_USERS_MOCK.length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </DialogHeader>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-left">
          {activeTab === "permisos" && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground mb-3">
                Módulos y facultades operativas autorizadas para usuarios con este rol:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {MODULE_PERMISSIONS_LIST.map((mod) => {
                  const Icon = mod.icon;
                  return (
                    <div
                      key={mod.module}
                      className="p-3 rounded-xl border border-border/80 bg-surface flex items-start gap-3 shadow-2xs"
                    >
                      <div className="size-7 rounded-lg bg-muted text-foreground flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="size-3.5 text-muted-foreground" />
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <h4 className="text-xs font-bold text-foreground truncate">
                          {mod.module}
                        </h4>
                        <p className="text-[11px] text-primary font-medium">
                          {mod.permissions}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "usuarios" && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground mb-2">
                Funcionarios con el rol {rol.nombre} asignado en su cuenta:
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>NOMBRE</TableHead>
                    <TableHead>CORREO</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ASSIGNED_USERS_MOCK.map((u, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-bold text-foreground flex items-center gap-2 text-xs">
                        <UserCheck className="size-3.5 text-muted-foreground shrink-0" />
                        <span>{u.name}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono text-[11px]">
                        {u.email}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-6 bg-muted/20 border-t border-border/40">
          <DialogFooter showCloseButton={false} className="gap-2 sm:gap-3">
            <Button
              type="button"
              variant="neutral"
              onClick={() => onOpenChange(false)}
              className="rounded-xl"
            >
              Cerrar
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                onOpenChange(false);
                onEdit(rol);
              }}
              className="rounded-xl gap-1.5"
            >
              <Pencil className="size-3.5" />
              <span>Editar rol</span>
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

