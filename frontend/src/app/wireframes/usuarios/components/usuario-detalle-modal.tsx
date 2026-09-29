"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  Building2,
  Briefcase,
  Shield,
  ShieldCheck,
  Clock,
  Pencil,
  Phone,
  Calendar,
  CheckCircle2,
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
import { DetailList } from "@/components/ui/detail-list";
import type { UsuarioData } from "./usuario-modal";

interface UsuarioDetalleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuario: UsuarioData | null;
  onEdit: (usuario: UsuarioData) => void;
}

export function UsuarioDetalleModal({
  open,
  onOpenChange,
  usuario,
  onEdit,
}: UsuarioDetalleModalProps) {
  const [activeTab, setActiveTab] = useState("general");

  if (!usuario) return null;

  const parts = usuario.nombre.split(" ");
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ") || "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent variant="standard" size="xl" className="sm:max-w-xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        {/* Header Profile Area */}
        <div className="p-6 pb-4 border-b border-border/40 bg-surface">
          <DialogHeader className="space-y-4">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="size-14 rounded-full bg-muted text-foreground font-extrabold text-lg flex items-center justify-center shrink-0 border border-border">
                {usuario.iniciales || firstName.slice(0, 2).toUpperCase()}
              </div>

              {/* Basic info */}
              <div className="space-y-1 min-w-0 flex-1 text-left">
                <div className="flex items-center gap-2 flex-wrap">
                  <DialogTitle className="font-heading font-extrabold text-lg sm:text-xl text-foreground truncate">
                    {usuario.nombre}
                  </DialogTitle>
                  <Badge
                    tone="neutral"
                    appearance="soft"
                    size="sm"
                    className="font-semibold text-xs"
                  >
                    {usuario.estado}
                  </Badge>
                </div>
                <DialogDescription className="text-xs text-muted-foreground font-mono truncate">
                  {usuario.correo}
                </DialogDescription>
                <p className="text-xs text-muted-foreground font-medium">
                  {usuario.rol} · {usuario.institucion}
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-muted/40 p-1 rounded-xl border border-border h-10 w-full grid grid-cols-3">
                <TabsTrigger value="general" className="rounded-lg text-xs font-semibold">
                  Información
                </TabsTrigger>
                <TabsTrigger value="roles" className="rounded-lg text-xs font-semibold">
                  Rol y permisos
                </TabsTrigger>
                <TabsTrigger value="actividad" className="rounded-lg text-xs font-semibold">
                  Actividad
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </DialogHeader>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-left">
          {activeTab === "general" && (
            <div className="space-y-4">
              <DetailList
                columns={2}
                items={[
                  {
                    label: "Nombres",
                    value: firstName || "—",
                  },
                  {
                    label: "Apellidos",
                    value: lastName || "—",
                  },
                  {
                    label: "Correo institucional",
                    value: <span className="font-mono text-xs text-foreground">{usuario.correo}</span>,
                  },
                  {
                    label: "Teléfono",
                    value: "099 587 6543",
                  },
                  {
                    label: "Institución",
                    value: usuario.institucion,
                  },
                  {
                    label: "Cargo",
                    value: usuario.cargo || "Especialista de Sistemas",
                  },
                  {
                    label: "Estado",
                    value: (
                      <Badge
                        tone="neutral"
                        appearance="soft"
                        size="sm"
                        className="font-semibold text-xs"
                      >
                        {usuario.estado}
                      </Badge>
                    ),
                  },
                  {
                    label: "Último acceso",
                    value: usuario.ultimoAcceso || "02/09/2026 10:24",
                  },
                ]}
              />
            </div>
          )}

          {activeTab === "roles" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-border/80 bg-surface space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-primary" />
                  <span className="text-xs font-bold text-foreground">
                    {usuario.rol} institucional
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Autorización para gestionar procesos de interoperabilidad, validación de catálogos y consultas autorizadas para la entidad {usuario.institucion}.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-lg bg-muted/30 border border-border/60 flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-foreground" />
                  <span>Consulta de identidad</span>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 border border-border/60 flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-foreground" />
                  <span>Creación de solicitudes</span>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 border border-border/60 flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-foreground" />
                  <span>Descarga de reportes</span>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 border border-border/60 flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-foreground" />
                  <span>Revisión de bitácora</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "actividad" && (
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-xl border border-border/80 bg-background text-xs">
                <Clock className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  <span className="font-bold text-foreground">Inicio de sesión exitoso</span>
                  <p className="text-muted-foreground text-[11px]">
                    {usuario.ultimoAcceso || "02/09/2026 10:24"} · IP 186.42.12.98
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl border border-border/80 bg-background text-xs">
                <Shield className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                <div className="space-y-0.5">
                  <span className="font-bold text-foreground">Aprobación de solicitud SOL-2026-001</span>
                  <p className="text-muted-foreground text-[11px]">
                    16/08/2026 14:15 · Sistema Nacional
                  </p>
                </div>
              </div>
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
                onEdit(usuario);
              }}
              className="rounded-xl gap-1.5"
            >
              <Pencil className="size-3.5" />
              <span>Editar usuario</span>
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

