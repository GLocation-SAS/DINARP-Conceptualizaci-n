"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  CheckCircle2,
  ArrowLeft,
  User,
  Shield,
  Building,
  Mail,
  Phone,
  Briefcase,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { WireframeDashboardLayout } from "../../components/wireframe-dashboard-layout";

export default function WireframeCrearUsuarioPage() {
  const router = useRouter();

  // Form State
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [institucion, setInstitucion] = useState("Selecciona una institución");
  const [institucionSearch, setInstitucionSearch] = useState("");
  const [cargo, setCargo] = useState("");
  const [rol, setRol] = useState("Selecciona un rol");
  const [rolSearch, setRolSearch] = useState("");
  const [estado, setEstado] = useState("Activo");
  const [estadoSearch, setEstadoSearch] = useState("");
  const [enviarCorreo, setEnviarCorreo] = useState(true);

  // Success screen state
  const [isCreated, setIsCreated] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreated(true);
  };

  const handleResetForm = () => {
    setNombres("");
    setApellidos("");
    setCorreo("");
    setTelefono("");
    setInstitucion("Selecciona una institución");
    setInstitucionSearch("");
    setCargo("");
    setRol("Selecciona un rol");
    setRolSearch("");
    setEstado("Activo");
    setEstadoSearch("");
    setEnviarCorreo(true);
    setIsCreated(false);
  };

  const INSTITUCIONES = ["Registro Civil", "SRI", "Ministerio de Educación", "DINARP", "Ministerio de Salud", "Agencia Nacional de Tránsito (ANT)", "IESS"];
  const ROLES = ["Administrador", "Analista", "Consultor", "Revisor"];
  const ESTADOS = ["Activo", "Inactivo"];

  const filteredInstituciones = INSTITUCIONES.filter(i => i.toLowerCase().includes(institucionSearch.toLowerCase()));
  const filteredRoles = ROLES.filter(r => r.toLowerCase().includes(rolSearch.toLowerCase()));
  const filteredEstados = ESTADOS.filter(e => e.toLowerCase().includes(estadoSearch.toLowerCase()));

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
                Crear usuario
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {!isCreated ? (
          <div className="space-y-6">
            {/* ── 2. Header Title & Description ── */}
            <div className="space-y-1">
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-foreground tracking-tight">
                Crear usuario
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Completa la información del nuevo usuario.
              </p>
            </div>

            {/* ── 3. Formulario Card ── */}
            <form onSubmit={handleSubmit}>
              <Card className="rounded-2xl border-border bg-surface p-6 sm:p-8 space-y-8 shadow-xs">
                {/* Bloque 1: Información Personal */}
                <div className="space-y-4">
                  <h2 className="text-sm font-bold text-foreground">
                    Información personal
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Nombres */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Nombres <span className="text-destructive">*</span>
                      </label>
                      <InputGroup className="bg-surface h-10 rounded-xl border-border">
                        <InputGroupInput
                          placeholder="Ej. María Fernanda"
                          value={nombres}
                          onChange={(e) => setNombres(e.target.value)}
                          required
                          className="text-xs sm:text-sm"
                        />
                      </InputGroup>
                    </div>

                    {/* Apellidos */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Apellidos <span className="text-destructive">*</span>
                      </label>
                      <InputGroup className="bg-surface h-10 rounded-xl border-border">
                        <InputGroupInput
                          placeholder="Ej. Cuenca Serrano"
                          value={apellidos}
                          onChange={(e) => setApellidos(e.target.value)}
                          required
                          className="text-xs sm:text-sm"
                        />
                      </InputGroup>
                    </div>

                    {/* Correo Electrónico */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Correo electrónico <span className="text-destructive">*</span>
                      </label>
                      <InputGroup className="bg-surface h-10 rounded-xl border-border">
                        <InputGroupInput
                          type="email"
                          placeholder="usuario@institucion.gob.ec"
                          value={correo}
                          onChange={(e) => setCorreo(e.target.value)}
                          required
                          className="text-xs sm:text-sm"
                        />
                      </InputGroup>
                    </div>

                    {/* Número de teléfono */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Número de teléfono
                      </label>
                      <InputGroup className="bg-surface h-10 rounded-xl border-border">
                        <InputGroupInput
                          placeholder="Ej. 099 123 4567"
                          value={telefono}
                          onChange={(e) => setTelefono(e.target.value)}
                          className="text-xs sm:text-sm"
                        />
                      </InputGroup>
                    </div>

                    {/* Institución */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Institución <span className="text-destructive">*</span>
                      </label>
                      <Combobox
                        value={institucion === "Selecciona una institución" ? null : institucion}
                        onValueChange={(val) => {
                          setInstitucion(val || "Selecciona una institución");
                          if (val) setInstitucionSearch(val);
                          else setInstitucionSearch("");
                        }}
                        inputValue={institucionSearch}
                        onInputValueChange={(newSearch) => {
                          setInstitucionSearch(newSearch);
                        }}
                      >
                        <ComboboxInput placeholder="Selecciona una institución" showClear={true} className="w-full bg-surface" />
                        <ComboboxContent align="start" className="w-64">
                          <ComboboxList>
                            {filteredInstituciones.map((inst) => (
                              <ComboboxItem key={inst} value={inst}>
                                {inst}
                              </ComboboxItem>
                            ))}
                            {filteredInstituciones.length === 0 && (
                              <ComboboxEmpty>No se encontraron resultados</ComboboxEmpty>
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>
                    </div>

                    {/* Cargo */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Cargo
                      </label>
                      <InputGroup className="bg-surface h-10 rounded-xl border-border">
                        <InputGroupInput
                          placeholder="Ej. Analista de Sistemas"
                          value={cargo}
                          onChange={(e) => setCargo(e.target.value)}
                          className="text-xs sm:text-sm"
                        />
                      </InputGroup>
                    </div>
                  </div>
                </div>

                {/* Bloque 2: Acceso y Rol */}
                <div className="space-y-4 pt-4 border-t border-border/80">
                  <h2 className="text-sm font-bold text-foreground">
                    Acceso y rol
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Rol */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Rol <span className="text-destructive">*</span>
                      </label>
                      <Combobox
                        value={rol === "Selecciona un rol" ? null : rol}
                        onValueChange={(val) => {
                          setRol(val || "Selecciona un rol");
                          if (val) setRolSearch(val);
                          else setRolSearch("");
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

                    {/* Estado */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Estado <span className="text-destructive">*</span>
                      </label>
                      <Combobox
                        value={estado === "Selecciona un estado" ? null : estado}
                        onValueChange={(val) => {
                          setEstado(val || "Selecciona un estado");
                          if (val) setEstadoSearch(val);
                          else setEstadoSearch("");
                        }}
                        inputValue={estadoSearch}
                        onInputValueChange={(newSearch) => {
                          setEstadoSearch(newSearch);
                        }}
                      >
                        <ComboboxInput placeholder="Selecciona un estado" showClear={true} className="w-full bg-surface" />
                        <ComboboxContent align="start" className="w-44">
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

                  {/* Checkbox Correo de Bienvenida */}
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id="enviar-correo"
                      checked={enviarCorreo}
                      onCheckedChange={(checked) => setEnviarCorreo(!!checked)}
                    />
                    <label
                      htmlFor="enviar-correo"
                      className="text-xs font-medium text-foreground cursor-pointer"
                    >
                      Enviar correo de bienvenida al usuario
                    </label>
                  </div>
                </div>

                {/* Acciones del Formulario */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/80">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/wireframes/usuarios")}
                    className="h-10 px-5 rounded-xl text-xs font-semibold border-border"
                  >
                    Cancelar
                  </Button>

                  <Button
                    type="submit"
                    variant="primary"
                    className="h-10 px-6 text-xs font-semibold shadow-xs"
                  >
                    Guardar usuario
                  </Button>
                </div>
              </Card>
            </form>
          </div>
        ) : (
          /* ── 5. Confirmación de creación (Screen 5) ── */
          <Card className="rounded-2xl border-border bg-surface p-10 sm:p-14 text-center max-w-lg mx-auto shadow-sm space-y-6">
            <div className="size-20 rounded-full bg-foreground/15 text-foreground flex items-center justify-center mx-auto">
              <CheckCircle2 className="size-10" />
            </div>

            <div className="space-y-2">
              <h2 className="font-heading font-extrabold text-2xl text-foreground">
                Usuario creado exitosamente
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
                Se ha enviado un correo de bienvenida a{" "}
                <strong className="text-foreground">{correo || "maria.cuenca@registrocivil.gob.ec"}</strong>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Button
                type="button"
                variant="primary"
                onClick={handleResetForm}
                className="w-full sm:w-auto h-11 px-6 text-xs font-semibold"
              >
                Crear otro usuario
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/wireframes/usuarios")}
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

