"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  ChevronDown,
  Layers,
  Settings,
  Server,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Multiselect } from "@/components/ui/multiselect";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
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
import { WireframeDashboardLayout } from "../../../../components/wireframe-dashboard-layout";

const CAMPOS_OPTIONS = [
  { value: "cedula", label: "Número de identificación" },
  { value: "nombres", label: "Nombres" },
  { value: "apellidos", label: "Apellidos" },
  { value: "fecha_nacimiento", label: "Fecha de nacimiento" },
  { value: "nacionalidad", label: "Nacionalidad" },
  { value: "estado_civil", label: "Estado civil" },
  { value: "lugar_nacimiento", label: "Lugar de nacimiento" },
  { value: "fotografia", label: "Fotografía biométrica" },
  { value: "firma_digital", label: "Firma digitalizada" },
];

export default function WireframeConfiguracionServicioPage() {
  const router = useRouter();

  // Estados del formulario
  const [nombreServicio, setNombreServicio] = useState("Consulta de identidad");
  const [estadoServicio, setEstadoServicio] = useState("Activo");
  const [fuente, setFuente] = useState("Registro Civil (DIGERCIC)");
  const [consumidor, setConsumidor] = useState("Ministerio de Gobierno");
  const [tipoIntercambio, setTipoIntercambio] = useState("Consulta en línea (API REST)");
  const [vigencia, setVigencia] = useState("01/01/2026 - 31/12/2026");
  const [fechaInicio, setFechaInicio] = useState("2026-01-01");
  const [selectedCampos, setSelectedCampos] = useState<string[]>([
    "cedula",
    "nombres",
    "apellidos",
    "fecha_nacimiento",
    "nacionalidad",
    "estado_civil",
  ]);
  const [cuotaMax, setCuotaMax] = useState("200");
  const [tokenTimeout, setTokenTimeout] = useState("3600");
  const [notificarErrores, setNotificarErrores] = useState(true);

  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavedModalOpen(true);
  };

  return (
    <WireframeDashboardLayout activeMenu="servicios">
      <main className="relative p-4 sm:p-6 lg:p-8 w-full space-y-6 sm:space-y-8">
        {/* Background subtle effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-muted/20 to-transparent pointer-events-none -z-10 blur-3xl opacity-60" />

        {/* ── 1. Breadcrumbs ── */}
        <Breadcrumb>
          <BreadcrumbList className="text-xs">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/wireframes/dashboard" className="text-muted-foreground hover:text-foreground">
                  Inicio
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/wireframes/interoperabilidad/servicios" className="text-muted-foreground hover:text-foreground">
                  Interoperabilidad / Servicios
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/wireframes/interoperabilidad/servicios/consulta-identidad" className="text-muted-foreground hover:text-foreground">
                  Consulta de identidad
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-foreground">
                Configuración
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* ── 2. Header & Top Action ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-muted text-foreground">
                SRV-RC-001
              </span>
              <span className="text-xs text-muted-foreground">Registro Civil → Ministerio de Gobierno</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-foreground tracking-tight">
              Configuración del servicio
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Ajusta los parámetros técnicos, vigencia temporal y campos habilitados para este intercambio de interoperabilidad.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/wireframes/interoperabilidad/servicios/consulta-identidad")}
            className="h-10 px-4 rounded-xl text-xs font-semibold gap-2 border-border shrink-0"
          >
            <ArrowLeft className="size-4" />
            <span>Cancelar</span>
          </Button>
        </div>

        {/* ── 3. Formulario de Configuración ── */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Identificación y Estado */}
          <Card className="border-border bg-surface shadow-xs">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-base font-heading font-bold text-foreground">
                1. Información General del Intercambio
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="nombre" className="text-xs font-semibold text-foreground">
                    Nombre del servicio
                  </Label>
                  <InputGroup className="bg-surface rounded-xl border-border">
                    <InputGroupInput
                      id="nombre"
                      value={nombreServicio}
                      onChange={(e) => setNombreServicio(e.target.value)}
                      className="text-xs sm:text-sm"
                      required
                    />
                  </InputGroup>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">
                    Estado del servicio
                  </Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-10 px-3 flex items-center justify-between bg-surface border-border text-left w-full text-xs font-medium"
                      >
                        <div className="flex items-center gap-2">
                          <span className="size-2 rounded-full bg-foreground" />
                          <span>{estadoServicio}</span>
                        </div>
                        <ChevronDown className="size-3.5 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      <DropdownMenuLabel className="text-xs">Estado operativo</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup value={estadoServicio} onValueChange={setEstadoServicio}>
                        <DropdownMenuRadioItem value="Activo">Activo</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Inactivo">Inactivo</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Suspendido">Suspendido</DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="fuente" className="text-xs font-semibold text-foreground">
                    Institución Fuente (Custodio)
                  </Label>
                  <InputGroup className="bg-muted/30 rounded-xl border-border">
                    <InputGroupInput
                      id="fuente"
                      value={fuente}
                      readOnly
                      className="text-xs font-medium text-foreground cursor-default"
                    />
                  </InputGroup>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="consumidor" className="text-xs font-semibold text-foreground">
                    Entidad Consumidora
                  </Label>
                  <InputGroup className="bg-muted/30 rounded-xl border-border">
                    <InputGroupInput
                      id="consumidor"
                      value={consumidor}
                      readOnly
                      className="text-xs font-medium text-foreground cursor-default"
                    />
                  </InputGroup>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="tipo" className="text-xs font-semibold text-foreground">
                    Tipo de intercambio
                  </Label>
                  <InputGroup className="bg-muted/30 rounded-xl border-border">
                    <InputGroupInput
                      id="tipo"
                      value={tipoIntercambio}
                      readOnly
                      className="text-xs font-medium text-foreground cursor-default"
                    />
                  </InputGroup>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="vigencia" className="text-xs font-semibold text-foreground">
                    Vigencia del Acuerdo
                  </Label>
                  <InputGroup className="bg-surface rounded-xl border-border">
                    <InputGroupInput
                      id="vigencia"
                      value={vigencia}
                      onChange={(e) => setVigencia(e.target.value)}
                      className="text-xs sm:text-sm font-mono"
                    />
                  </InputGroup>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Datos Habilitados con Multiselect */}
          <Card className="border-border bg-surface shadow-xs">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-base font-heading font-bold text-foreground">
                2. Datos y Campos Habilitados
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Selecciona los atributos que el consumidor tiene autorización de consultar.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-2 space-y-4">
              <Multiselect
                label="Campos autorizados"
                options={CAMPOS_OPTIONS}
                selected={selectedCampos}
                onChange={setSelectedCampos}
                placeholder="Selecciona campos de datos..."
                searchPlaceholder="Buscar campo..."
                maxCount={4}
              />
            </CardContent>
          </Card>

          {/* Card 3: Parámetros Técnicos */}
          <Card className="border-border bg-surface shadow-xs">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-base font-heading font-bold text-foreground">
                3. Parámetros Técnicos y Cuotas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="cuota" className="text-xs font-semibold text-foreground">
                    Cuota máxima (req / minuto)
                  </Label>
                  <InputGroup className="bg-surface rounded-xl border-border">
                    <InputGroupInput
                      id="cuota"
                      type="number"
                      value={cuotaMax}
                      onChange={(e) => setCuotaMax(e.target.value)}
                      className="text-xs sm:text-sm"
                    />
                  </InputGroup>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="timeout" className="text-xs font-semibold text-foreground">
                    Expiración de Token OAuth (segundos)
                  </Label>
                  <InputGroup className="bg-surface rounded-xl border-border">
                    <InputGroupInput
                      id="timeout"
                      type="number"
                      value={tokenTimeout}
                      onChange={(e) => setTokenTimeout(e.target.value)}
                      className="text-xs sm:text-sm"
                    />
                  </InputGroup>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Checkbox
                  id="notif"
                  checked={notificarErrores}
                  onCheckedChange={(checked) => setNotificarErrores(!!checked)}
                />
                <label htmlFor="notif" className="text-xs text-foreground cursor-pointer font-medium">
                  Notificar al equipo técnico por correo si la tasa de errores HTTP 5xx supera el 2%.
                </label>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-2 border-t border-border/60 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/wireframes/interoperabilidad/servicios/consulta-identidad")}
                className="h-10 px-4 rounded-xl text-xs font-semibold"
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                variant="primary"
                className="h-10 px-6 text-xs font-semibold gap-2 shadow-xs"
              >
                <Save className="size-4" />
                <span>Guardar cambios</span>
              </Button>
            </CardFooter>
          </Card>
        </form>

        {/* Modal de Éxito al Guardar */}
        <Dialog open={isSavedModalOpen} onOpenChange={setIsSavedModalOpen}>
          <DialogContent variant="standard" className="max-w-[440px] rounded-3xl p-6 sm:p-8 bg-background border-border shadow-2xl text-center">
            <div className="size-14 rounded-2xl bg-muted/60 border border-border flex items-center justify-center text-foreground mb-3 mx-auto">
              <CheckCircle2 className="size-7 stroke-[2]" />
            </div>
            <DialogHeader className="text-center space-y-2">
              <DialogTitle className="font-heading font-bold text-xl sm:text-2xl text-foreground">
                Configuración Actualizada
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Los parámetros técnicos, vigencia y campos autorizados para <strong>Consulta de identidad</strong> han sido guardados correctamente.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-4 flex w-full">
              <Button
                type="button"
                variant="primary"
                onClick={() => {
                  setIsSavedModalOpen(false);
                  router.push("/wireframes/interoperabilidad/servicios/consulta-identidad");
                }}
                className="w-full h-11 text-xs font-semibold"
              >
                Volver al detalle del servicio
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </WireframeDashboardLayout>
  );
}

