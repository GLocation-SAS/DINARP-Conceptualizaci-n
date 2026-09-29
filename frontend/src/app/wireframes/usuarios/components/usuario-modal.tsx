"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Building2,
  Briefcase,
  Shield,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";

export interface UsuarioData {
  id?: string;
  iniciales?: string;
  nombre: string;
  correo: string;
  institucion: string;
  cargo?: string;
  rol: "Administrador" | "Analista" | "Consultor" | "Revisor";
  estado: "Activo" | "Inactivo";
  ultimoAcceso?: string;
}

interface UsuarioModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: UsuarioData | null;
  onSave: (data: UsuarioData) => void;
}

export function UsuarioModal({
  open,
  onOpenChange,
  initialData,
  onSave,
}: UsuarioModalProps) {
  const isEditing = Boolean(initialData?.id);

  // Split full name if editing, or use separate names
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [correo, setCorreo] = useState("");
  const [institucion, setInstitucion] = useState("");
  const [cargo, setCargo] = useState("");
  const [rol, setRol] = useState<"Administrador" | "Analista" | "Consultor" | "Revisor">("Analista");
  const [rolSearch, setRolSearch] = useState("");
  const [estado, setEstado] = useState<"Activo" | "Inactivo">("Activo");
  const [estadoSearch, setEstadoSearch] = useState("");
  const [enviarCorreo, setEnviarCorreo] = useState(true);

  const ROLES = ["Administrador", "Analista", "Consultor", "Revisor"];
  const ESTADOS = ["Activo", "Inactivo"];

  const filteredRoles = ROLES.filter(r => r.toLowerCase().includes(rolSearch.toLowerCase()));
  const filteredEstados = ESTADOS.filter(e => e.toLowerCase().includes(estadoSearch.toLowerCase()));

  useEffect(() => {
    if (open) {
      if (initialData) {
        const parts = initialData.nombre.split(" ");
        setNombres(parts[0] || "");
        setApellidos(parts.slice(1).join(" ") || "");
        setCorreo(initialData.correo || "");
        setInstitucion(initialData.institucion || "");
        setCargo(initialData.cargo || "Especialista Sectorial");
        setRol(initialData.rol || "Analista");
        setEstado(initialData.estado || "Activo");
        setEnviarCorreo(false);
      } else {
        setNombres("");
        setApellidos("");
        setCorreo("");
        setInstitucion("");
        setCargo("");
        setRol("Analista");
        setEstado("Activo");
        setEnviarCorreo(true);
      }
    }
  }, [open, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombres.trim() || !correo.trim()) {
      toast.error("Por favor completa los campos requeridos.");
      return;
    }

    const fullName = `${nombres.trim()} ${apellidos.trim()}`.trim();
    const initials = (nombres[0] || "") + (apellidos[0] || (nombres[1] || ""));

    const payload: UsuarioData = {
      id: initialData?.id || `USR-${Math.floor(100 + Math.random() * 900)}`,
      iniciales: initials.toUpperCase(),
      nombre: fullName,
      correo: correo.trim(),
      institucion: institucion.trim() || "DINARP",
      cargo: cargo.trim() || "Funcionario",
      rol,
      estado,
      ultimoAcceso: initialData?.ultimoAcceso || "Ahora",
    };

    onSave(payload);
    toast.success(
      isEditing ? "Usuario actualizado correctamente" : "Usuario creado exitosamente"
    );
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent variant="standard" size="xl" className="sm:max-w-xl">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-left font-heading font-extrabold text-xl sm:text-2xl text-foreground">
            {isEditing ? "Editar Usuario" : "Crear Nuevo Usuario"}
          </DialogTitle>
          <DialogDescription className="text-left text-xs sm:text-sm text-muted-foreground">
            {isEditing
              ? "Modifica los datos y permisos del usuario en la plataforma."
              : "Completa los siguientes campos para registrar un usuario en el sistema."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Nombres y Apellidos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="grid gap-1.5 text-left">
              <Label htmlFor="usuario-nombres" className="text-xs font-semibold text-foreground">
                Nombres <span className="text-foreground">*</span>
              </Label>
              <InputGroup>
                <InputGroupText>
                  <User className="size-4 text-muted-foreground" />
                </InputGroupText>
                <InputGroupInput
                  id="usuario-nombres"
                  value={nombres}
                  onChange={(e) => setNombres(e.target.value)}
                  placeholder="Ej. María"
                  required
                />
              </InputGroup>
            </div>

            <div className="grid gap-1.5 text-left">
              <Label htmlFor="usuario-apellidos" className="text-xs font-semibold text-foreground">
                Apellidos
              </Label>
              <InputGroup>
                <InputGroupText>
                  <User className="size-4 text-muted-foreground" />
                </InputGroupText>
                <InputGroupInput
                  id="usuario-apellidos"
                  value={apellidos}
                  onChange={(e) => setApellidos(e.target.value)}
                  placeholder="Ej. Cuenca Serrano"
                />
              </InputGroup>
            </div>
          </div>

          {/* Correo Electrónico Institucional */}
          <div className="grid gap-1.5 text-left">
            <Label htmlFor="usuario-correo" className="text-xs font-semibold text-foreground">
              Correo institucional <span className="text-foreground">*</span>
            </Label>
            <InputGroup>
              <InputGroupText>
                <Mail className="size-4 text-muted-foreground" />
              </InputGroupText>
              <InputGroupInput
                id="usuario-correo"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="usuario@institucion.gob.ec"
                required
              />
            </InputGroup>
          </div>

          {/* Institución & Cargo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="grid gap-1.5 text-left">
              <Label htmlFor="usuario-institucion" className="text-xs font-semibold text-foreground">
                Institución
              </Label>
              <InputGroup>
                <InputGroupText>
                  <Building2 className="size-4 text-muted-foreground" />
                </InputGroupText>
                <InputGroupInput
                  id="usuario-institucion"
                  value={institucion}
                  onChange={(e) => setInstitucion(e.target.value)}
                  placeholder="Ej. Registro Civil"
                />
              </InputGroup>
            </div>

            <div className="grid gap-1.5 text-left">
              <Label htmlFor="usuario-cargo" className="text-xs font-semibold text-foreground">
                Cargo / Función
              </Label>
              <InputGroup>
                <InputGroupText>
                  <Briefcase className="size-4 text-muted-foreground" />
                </InputGroupText>
                <InputGroupInput
                  id="usuario-cargo"
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                  placeholder="Ej. Analista de Sistemas"
                />
              </InputGroup>
            </div>
          </div>

          {/* Rol asignado & Estado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Dropdown Rol */}
            <div className="grid gap-1.5 text-left">
              <Label className="text-xs font-semibold text-foreground">
                Rol asignado
              </Label>
              <Combobox
                value={rol}
                onValueChange={(val) => {
                  if (val) {
                    setRol(val as any);
                    setRolSearch(val);
                  } else {
                    setRol("Analista");
                    setRolSearch("");
                  }
                }}
                inputValue={rolSearch}
                onInputValueChange={(newSearch) => {
                  setRolSearch(newSearch);
                }}
              >
                <ComboboxInput placeholder="Selecciona un rol" showClear={true} className="w-full bg-surface" />
                <ComboboxContent align="start" className="w-56">
                  <ComboboxList>
                    {filteredRoles.map((r) => (
                      <ComboboxItem key={r} value={r}>
                        {r}
                      </ComboboxItem>
                    ))}
                    {filteredRoles.length === 0 && (
                      <ComboboxEmpty>No se encontraron resultados</ComboboxEmpty>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>

            {/* Dropdown Estado */}
            <div className="grid gap-1.5 text-left">
              <Label className="text-xs font-semibold text-foreground">
                Estado
              </Label>
              <Combobox
                value={estado}
                onValueChange={(val) => {
                  if (val) {
                    setEstado(val as any);
                    setEstadoSearch(val);
                  } else {
                    setEstado("Activo");
                    setEstadoSearch("");
                  }
                }}
                inputValue={estadoSearch}
                onInputValueChange={(newSearch) => {
                  setEstadoSearch(newSearch);
                }}
              >
                <ComboboxInput placeholder="Seleccionar Estado" showClear={true} className="w-full bg-surface" />
                <ComboboxContent align="start" className="w-48">
                  <ComboboxList>
                    {filteredEstados.map((e) => (
                      <ComboboxItem key={e} value={e}>
                        {e}
                      </ComboboxItem>
                    ))}
                    {filteredEstados.length === 0 && (
                      <ComboboxEmpty>No se encontraron resultados</ComboboxEmpty>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>
          </div>

          {/* Checkbox Notificar credenciales (solo al crear) */}
          {!isEditing && (
            <div className="pt-2 flex items-center gap-2">
              <Checkbox
                id="usuario-enviar-correo"
                checked={enviarCorreo}
                onCheckedChange={(checked) => setEnviarCorreo(Boolean(checked))}
              />
              <Label
                htmlFor="usuario-enviar-correo"
                className="text-xs text-muted-foreground font-normal cursor-pointer select-none"
              >
                Enviar credenciales de acceso iniciales al correo institucional
              </Label>
            </div>
          )}

          <DialogFooter showCloseButton={false} className="gap-2 sm:gap-3 pt-4 border-t border-border/40">
            <Button
              type="button"
              variant="neutral"
              onClick={() => onOpenChange(false)}
              className="rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              className=""
            >
              {isEditing ? "Guardar cambios" : "Crear usuario"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

