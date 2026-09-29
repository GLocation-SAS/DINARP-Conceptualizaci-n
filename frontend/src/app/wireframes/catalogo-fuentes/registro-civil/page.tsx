"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  Search,
  ArrowRight,
  ArrowLeft,
  FileText,
  Mail,
  Phone,
  Globe,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Layers,
  Database,
  Eye,
  BookOpen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupInput,
} from "@/components/ui/input-group";
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
import { DetailList } from "@/components/ui/detail-list";
import { WireframeDashboardLayout } from "../../components/wireframe-dashboard-layout";

interface ServicioMock {
  id: string;
  nombre: string;
  descripcion: string;
  ultimaActualizacion: string;
  href: string;
  camposCount: number;
  tipo: string;
}

const SERVICIOS_DATA: ServicioMock[] = [
  {
    id: "datos-identidad",
    nombre: "Datos de identidad",
    descripcion:
      "Consulta de datos biográficos del ciudadano: cédula, nombres, apellidos, fecha de nacimiento, estado civil y fotografía.",
    ultimaActualizacion: "10 abr 2025",
    href: "/wireframes/catalogo-fuentes/registro-civil/datos-identidad",
    camposCount: 7,
    tipo: "REST / JSON",
  },
  {
    id: "estado-civil",
    nombre: "Estado civil",
    descripcion:
      "Validación de condición de matrimonio, divorcio, unión de hecho registrada y datos del cónyuge.",
    ultimaActualizacion: "02 abr 2025",
    href: "/wireframes/catalogo-fuentes/registro-civil/datos-identidad",
    camposCount: 5,
    tipo: "REST / JSON",
  },
  {
    id: "certificados",
    nombre: "Certificados",
    descripcion:
      "Emisión y verificación de validez de certificados electrónicos de nacimiento, matrimonio y defunción.",
    ultimaActualizacion: "28 mar 2025",
    href: "/wireframes/catalogo-fuentes/registro-civil/datos-identidad",
    camposCount: 4,
    tipo: "SOAP / XML",
  },
  {
    id: "datos-nacimiento",
    nombre: "Datos de nacimiento",
    descripcion:
      "Inscripción biográfica del hecho vital, filiación de padres, tomo, acta y cantón de registro.",
    ultimaActualizacion: "15 mar 2025",
    href: "/wireframes/catalogo-fuentes/registro-civil/datos-identidad",
    camposCount: 6,
    tipo: "REST / JSON",
  },
  {
    id: "datos-defuncion",
    nombre: "Datos de defunción",
    descripcion:
      "Registro y validación de partidas de defunción procesadas a nivel nacional para suspensión de derechos.",
    ultimaActualizacion: "10 mar 2025",
    href: "/wireframes/catalogo-fuentes/registro-civil/datos-identidad",
    camposCount: 5,
    tipo: "REST / JSON",
  },
];

export default function WireframeRegistroCivilPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("servicios");

  const filteredServicios = useMemo(() => {
    return SERVICIOS_DATA.filter((s) => {
      return (
        searchQuery === "" ||
        s.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.descripcion.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery]);

  return (
    <WireframeDashboardLayout activeMenu="catalogo-fuentes">
      <main className="relative p-4 sm:p-6 lg:p-8 w-full space-y-6 sm:space-y-8">
        {/* Background subtle effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-muted/20 to-transparent pointer-events-none -z-10 blur-3xl opacity-60" />

        {/* ── 1. Breadcrumb ── */}
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
                <Link href="/wireframes/catalogo-fuentes" className="text-muted-foreground hover:text-foreground">
                  Catálogo de fuentes
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-foreground">
                Registro Civil
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* ── 2. Header & Institución Info Card ── */}
        <Card className="border-border bg-surface shadow-xs">
          <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="size-14 sm:size-16 rounded-2xl bg-muted/70 border border-border flex items-center justify-center text-foreground shrink-0 shadow-xs">
                <Building2 className="size-7 sm:size-8 stroke-[1.75]" />
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-muted text-foreground">
                    DIGERCIC
                  </span>
                  <Badge tone="neutral" appearance="soft" size="sm" className="font-semibold">
                    Identificación y Registro
                  </Badge>
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-medium pl-1">
                    <span className="size-1.5 rounded-full bg-foreground" />
                    Fuente Activa
                  </span>
                </div>

                <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-foreground tracking-tight">
                  Registro Civil del Ecuador
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                  Dirección General de Registro Civil, Identificación y Cedulación. Entidad oficial encargada de la identificación de las personas naturales y registro de hechos y actos del estado civil.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 pt-2 md:pt-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/wireframes/catalogo-fuentes")}
                className="h-10 px-4 rounded-xl text-xs font-semibold gap-2 border-border"
              >
                <ArrowLeft className="size-4" />
                <span>Volver al catálogo</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ── 3. Tabs: Servicios, Información general, Contactos, Documentación ── */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted/40 p-1 rounded-xl border border-border inline-flex flex-wrap h-auto">
            <TabsTrigger value="servicios" className="rounded-lg text-xs font-semibold px-4 py-2">
              Servicios ({SERVICIOS_DATA.length})
            </TabsTrigger>
            <TabsTrigger value="info" className="rounded-lg text-xs font-semibold px-4 py-2">
              Información general
            </TabsTrigger>
            <TabsTrigger value="contactos" className="rounded-lg text-xs font-semibold px-4 py-2">
              Contactos
            </TabsTrigger>
            <TabsTrigger value="docs" className="rounded-lg text-xs font-semibold px-4 py-2">
              Documentación
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: SERVICIOS */}
          <TabsContent value="servicios" className="space-y-4">
            {/* Buscador de servicios */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex-1 max-w-md">
                <InputGroup
                  size="default"
                  leftIcon={<Search className="size-4 text-muted-foreground" />}
                  className="bg-surface h-10 rounded-xl border-border/80"
                >
                  <InputGroupInput
                    placeholder="Buscar servicios por nombre o descripción..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="text-xs sm:text-sm"
                  />
                </InputGroup>
              </div>

              <span className="text-xs text-muted-foreground font-medium">
                Mostrando {filteredServicios.length} de {SERVICIOS_DATA.length} servicios disponibles
              </span>
            </div>

            {/* Tabla de servicios */}
            <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-xs">
              <Table className="w-full border-spacing-0">
                <TableHeader>
                  <TableRow className="border-b border-border/80 bg-muted/30 hover:bg-muted/30">
                    <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                      SERVICIO
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                      DESCRIPCIÓN
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                      TIPO
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                      ÚLTIMA ACTUALIZACIÓN
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-right">
                      ACCIONES
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServicios.map((serv) => (
                    <TableRow
                      key={serv.id}
                      className="border-b border-border/40 hover:bg-muted/20 transition-colors cursor-pointer"
                      onClick={() => router.push(serv.href)}
                    >
                      <TableCell className="py-4 px-4 text-xs font-bold text-foreground">
                        {serv.nombre}
                      </TableCell>
                      <TableCell className="py-4 px-4 text-xs text-muted-foreground max-w-[250px] sm:max-w-[400px] text-wrap break-words">
                        {serv.descripcion}
                      </TableCell>
                      <TableCell className="py-4 px-4 text-xs whitespace-nowrap">
                        <Badge tone="neutral" appearance="outline" size="sm" className="font-mono text-[11px]">
                          {serv.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 px-4 text-xs text-muted-foreground whitespace-nowrap">
                        {serv.ultimaActualizacion}
                      </TableCell>
                      <TableCell className="py-4 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center justify-end">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => router.push(serv.href)}
                                className="size-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer"
                                aria-label="Ver detalle"
                              >
                                <Eye className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Ver detalle</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* TAB 2: INFORMACIÓN GENERAL */}
          <TabsContent value="info" className="space-y-6">
            <Card className="border-border bg-surface shadow-xs">
              <CardHeader className="p-6 pb-3">
                <CardTitle className="text-base font-heading font-bold text-foreground">
                  Ficha Institucional
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Detalles sobre la institución custodia de los datos.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-1 space-y-4">
                <DetailList
                  columns={2}
                  items={[
                    { label: "Razón Social", value: "Dirección General de Registro Civil, Identificación y Cedulación" },
                    { label: "Sigla Institucional", value: "DIGERCIC" },
                    { label: "RUC Institucional", value: "1768012340001" },
                    { label: "Sector de Gobierno", value: "Función Ejecutiva / Telecomunicaciones" },
                    { label: "Marco Legal", value: "Ley Orgánica de Gestión de la Identidad y Datos Civiles" },
                    { label: "Disponibilidad SLA", value: "99.8% 24/7" },
                  ]}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: CONTACTOS */}
          <TabsContent value="contactos" className="space-y-6">
            <Card className="border-border bg-surface shadow-xs">
              <CardHeader className="p-6 pb-3">
                <CardTitle className="text-base font-heading font-bold text-foreground">
                  Canales de Contacto Técnico y Legal
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl border border-border bg-background/50 space-y-2">
                    <span className="font-bold text-foreground flex items-center gap-2">
                      <Mail className="size-4" />
                      Mesa de Ayuda Interoperabilidad
                    </span>
                    <p className="text-muted-foreground">soporte.interoperabilidad@registrocivil.gob.ec</p>
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-background/50 space-y-2">
                    <span className="font-bold text-foreground flex items-center gap-2">
                      <Phone className="size-4" />
                      Teléfono Técnico
                    </span>
                    <p className="text-muted-foreground">+593 (2) 3731-110 Ext. 2400</p>
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-background/50 space-y-2">
                    <span className="font-bold text-foreground flex items-center gap-2">
                      <MapPin className="size-4" />
                      Sede Matriz
                    </span>
                    <p className="text-muted-foreground">Av. Amazonas N37-61 y Villalengua, Quito</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4: DOCUMENTACIÓN */}
          <TabsContent value="docs" className="space-y-6">
            <Card className="border-border bg-surface shadow-xs">
              <CardHeader className="p-6 pb-3">
                <CardTitle className="text-base font-heading font-bold text-foreground">
                  Guías y Acuerdos de Nivel de Servicio (SLA)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-1 space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-background/80 text-xs">
                  <div className="flex items-center gap-2.5">
                    <FileText className="size-4 text-muted-foreground" />
                    <div>
                      <span className="font-semibold text-foreground block">Convenio_Marco_Interoperabilidad_RC.pdf</span>
                      <span className="text-[10px] text-muted-foreground">Formato estándar de adhesión (PDF - 1.2 MB)</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 text-xs font-semibold">
                    Descargar
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-background/80 text-xs">
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="size-4 text-muted-foreground" />
                    <div>
                      <span className="font-semibold text-foreground block">Guia_Integracion_API_RegistroCivil_v3.pdf</span>
                      <span className="text-[10px] text-muted-foreground">Especificación técnica OpenAPI / Swagger (PDF - 2.8 MB)</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 text-xs font-semibold">
                    Descargar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </WireframeDashboardLayout>
  );
}

