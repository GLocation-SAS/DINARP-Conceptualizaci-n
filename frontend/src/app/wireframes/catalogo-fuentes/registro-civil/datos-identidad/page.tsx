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
  AlertCircle,
  CheckCircle2,
  Database,
  Layers,
  Code2,
  ShieldCheck,
  Info,
  Server,
  Lock,
  Download,
  BookOpen,
  Plus,
  Check,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Alert } from "@/components/ui/alert";
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
import { WireframeDashboardLayout } from "../../../components/wireframe-dashboard-layout";

interface CampoMock {
  id: string;
  campo: string;
  codigoTecnico: string;
  descripcion: string;
  tipoDato: string;
  obligatorio: boolean;
  confidencialidad: string;
}

const CAMPOS_DATA: CampoMock[] = [
  {
    id: "numero-identificacion",
    campo: "Número de identificación",
    codigoTecnico: "cedula_ciudadania",
    descripcion: "Cédula de ciudadanía o identidad nacional de 10 dígitos con dígito verificador.",
    tipoDato: "String (10)",
    obligatorio: true,
    confidencialidad: "Público",
  },
  {
    id: "nombres",
    campo: "Nombres",
    codigoTecnico: "nombres_ciudadano",
    descripcion: "Primer y segundo nombre del ciudadano registrados en la base dactilar.",
    tipoDato: "String (100)",
    obligatorio: true,
    confidencialidad: "Público",
  },
  {
    id: "apellidos",
    campo: "Apellidos",
    codigoTecnico: "apellidos_ciudadano",
    descripcion: "Apellido paterno y materno del ciudadano según acta biográfica.",
    tipoDato: "String (100)",
    obligatorio: true,
    confidencialidad: "Público",
  },
  {
    id: "fecha-nacimiento",
    campo: "Fecha de nacimiento",
    codigoTecnico: "fecha_nacimiento",
    descripcion: "Fecha oficial de nacimiento en formato ISO 8601 (AAAA-MM-DD).",
    tipoDato: "Date (ISO)",
    obligatorio: true,
    confidencialidad: "Sensible",
  },
  {
    id: "lugar-nacimiento",
    campo: "Lugar de nacimiento",
    codigoTecnico: "lugar_nacimiento_cod",
    descripcion: "Provincia, cantón y parroquia de inscripción del hecho vital.",
    tipoDato: "String (150)",
    obligatorio: false,
    confidencialidad: "Público",
  },
  {
    id: "nacionalidad",
    campo: "Nacionalidad",
    codigoTecnico: "pais_nacionalidad",
    descripcion: "País de origen o estatus de naturalización reconocida.",
    tipoDato: "String (50)",
    obligatorio: false,
    confidencialidad: "Público",
  },
  {
    id: "estado-civil",
    campo: "Estado civil",
    codigoTecnico: "estado_civil_actual",
    descripcion: "Condición civil actual (Soltero, Casado, Divorciado, Viudo, Unión de Hecho).",
    tipoDato: "String (30)",
    obligatorio: false,
    confidencialidad: "Sensible",
  },
];

export default function WireframeDatosIdentidadPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("campos");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCampos, setSelectedCampos] = useState<string[]>([
    "numero-identificacion",
    "nombres",
    "apellidos",
    "fecha-nacimiento",
  ]);

  const filteredCampos = useMemo(() => {
    return CAMPOS_DATA.filter(
      (c) =>
        searchQuery === "" ||
        c.campo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.codigoTecnico.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.descripcion.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const toggleSelectAll = () => {
    if (selectedCampos.length === filteredCampos.length) {
      setSelectedCampos([]);
    } else {
      setSelectedCampos(filteredCampos.map((c) => c.id));
    }
  };

  const toggleCampo = (id: string) => {
    setSelectedCampos((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSeleccionarParaSolicitud = () => {
    // Al hacer clic, navegar a /wireframes/solicitudes/nueva simulando preselección
    const camposParam = encodeURIComponent(selectedCampos.join(","));
    router.push(`/wireframes/solicitudes/nueva?fuente=registro-civil&servicio=datos-identidad&campos=${camposParam}`);
  };

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
              <BreadcrumbLink asChild>
                <Link href="/wireframes/catalogo-fuentes/registro-civil" className="text-muted-foreground hover:text-foreground">
                  Registro Civil
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-foreground">
                Datos de identidad
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* ── 2. Header & Action Controls ── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-border/80">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-muted/80 text-foreground">
                SERV-RC-001
              </span>
              <Badge tone="neutral" appearance="soft" size="sm" className="font-medium gap-1.5">
                <span className="size-1.5 rounded-full bg-foreground" />
                Registro Civil
              </Badge>
              <Badge tone="neutral" appearance="outline" size="sm" className="font-mono text-xs">
                REST / JSON
              </Badge>
            </div>

            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-foreground">
              Datos de identidad
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed font-medium">
              Servicio para la consulta y validación biográfica de ciudadanos ecuatorianos y extranjeros residentes empadronados.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 lg:pt-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/wireframes/catalogo-fuentes/registro-civil")}
              className="h-10 px-4 rounded-xl text-xs font-semibold gap-2 border-border"
            >
              <ArrowLeft className="size-4" />
              <span>Volver a servicios</span>
            </Button>

            {/* Botón principal: Seleccionar para mi solicitud */}
            <Button
              type="button"
              variant="primary"
              onClick={handleSeleccionarParaSolicitud}
              className="h-10 px-5 text-xs font-semibold gap-2 shadow-xs"
            >
              <CheckCircle2 className="size-4" />
              <span>Seleccionar para mi solicitud ({selectedCampos.length})</span>
            </Button>
          </div>
        </div>

        {/* ── 3. Tabs: Campos disponibles, Descripción, Consideraciones técnicas, Documentación ── */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted/40 p-1 rounded-xl border border-border inline-flex flex-wrap h-auto">
            <TabsTrigger value="campos" className="rounded-lg text-xs font-semibold px-4 py-2">
              Campos disponibles ({CAMPOS_DATA.length})
            </TabsTrigger>
            <TabsTrigger value="descripcion" className="rounded-lg text-xs font-semibold px-4 py-2">
              Descripción
            </TabsTrigger>
            <TabsTrigger value="tecnica" className="rounded-lg text-xs font-semibold px-4 py-2">
              Consideraciones técnicas
            </TabsTrigger>
            <TabsTrigger value="docs" className="rounded-lg text-xs font-semibold px-4 py-2">
              Documentación
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: CAMPOS DISPONIBLES */}
          <TabsContent value="campos" className="space-y-5">
            {/* Alert informativo */}
            <Alert
              variant="default"
              icon={<Info className="size-4 text-foreground" />}
              title="Disponibilidad de campos sujeta a normativa y rol"
            >
              Los campos disponibles y atributos sensibles pueden variar según los permisos legales otorgados a su institución y el tipo de trámite declarado en la solicitud de interoperabilidad.
            </Alert>

            {/* Barra de Búsqueda y Selección */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex-1 max-w-md">
                <InputGroup
                  size="default"
                  leftIcon={<Search className="size-4 text-muted-foreground" />}
                  className="bg-surface h-10 rounded-xl border-border/80"
                >
                  <InputGroupInput
                    placeholder="Buscar campos de datos por nombre o clave..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="text-xs sm:text-sm"
                  />
                </InputGroup>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground font-medium">
                  <strong>{selectedCampos.length}</strong> de {filteredCampos.length} campos seleccionados
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={toggleSelectAll}
                  className="h-8 text-xs font-semibold"
                >
                  {selectedCampos.length === filteredCampos.length ? "Deseleccionar todos" : "Seleccionar todos"}
                </Button>
              </div>
            </div>

            {/* Tabla con Checkbox */}
            <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-xs">
              <Table className="w-full border-spacing-0">
                <TableHeader>
                  <TableRow className="border-b border-border/80 bg-muted/30 hover:bg-muted/30">
                    <TableHead className="w-12 py-3.5 px-4 text-center">
                      <Checkbox
                        checked={
                          selectedCampos.length === filteredCampos.length && filteredCampos.length > 0
                            ? true
                            : selectedCampos.length > 0
                              ? "indeterminate"
                              : false
                        }
                        onCheckedChange={toggleSelectAll}
                        aria-label="Seleccionar todos los campos"
                      />
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                      CAMPO
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                      DESCRIPCIÓN
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                      TIPO DE DATO
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                      OBLIGATORIO
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-right">
                      ACCIONES
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampos.map((c) => {
                    const isSelected = selectedCampos.includes(c.id);
                    return (
                      <TableRow
                        key={c.id}
                        className={`border-b border-border/40 transition-colors cursor-pointer ${isSelected ? "bg-muted/30" : "hover:bg-muted/10"
                          }`}
                        onClick={() => toggleCampo(c.id)}
                      >
                        {/* Checkbox */}
                        <TableCell className="py-4 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleCampo(c.id)}
                            aria-label={`Seleccionar ${c.campo}`}
                          />
                        </TableCell>

                        {/* Campo */}
                        <TableCell className="py-4 px-4 text-xs font-bold text-foreground">
                          <div>{c.campo}</div>
                          <span className="font-mono text-[10px] text-muted-foreground block font-normal">
                            {c.codigoTecnico}
                          </span>
                        </TableCell>

                        {/* Descripción */}
                        <TableCell className="py-4 px-4 text-xs text-muted-foreground max-w-[320px] leading-relaxed">
                          {c.descripcion}
                        </TableCell>

                        {/* Tipo de Dato */}
                        <TableCell className="py-4 px-4 text-xs whitespace-nowrap">
                          <span className="font-mono text-xs bg-muted/60 px-2 py-0.5 rounded text-foreground">
                            {c.tipoDato}
                          </span>
                        </TableCell>

                        {/* Obligatorio */}
                        <TableCell className="py-4 px-4 text-xs whitespace-nowrap">
                          {c.obligatorio ? (
                            <Badge tone="neutral" appearance="solid" size="sm" className="font-semibold text-[10px]">
                              Sí
                            </Badge>
                          ) : (
                            <Badge tone="neutral" appearance="outline" size="sm" className="font-medium text-[10px]">
                              No
                            </Badge>
                          )}
                        </TableCell>

                        {/* Acciones */}
                        <TableCell className="py-4 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="inline-flex items-center justify-end">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  variant={isSelected ? "primary" : "ghost"}
                                  size="icon-sm"
                                  onClick={() => toggleCampo(c.id)}
                                  className="size-8 rounded-lg cursor-pointer"
                                  aria-label={isSelected ? "Quitar campo" : "Agregar campo"}
                                >
                                  {isSelected ? <Check className="size-4" /> : <Plus className="size-4" />}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>{isSelected ? "Quitar campo" : "Agregar campo"}</TooltipContent>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Barra Inferior Flotante / Acciones */}
            <div className="p-4 rounded-2xl border border-border bg-surface flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5 text-xs text-foreground">
                <Layers className="size-4 text-muted-foreground" />
                <span>
                  Has preseleccionado <strong>{selectedCampos.length} atributos</strong> para tu integración.
                </span>
              </div>
              <Button
                type="button"
                variant="primary"
                onClick={handleSeleccionarParaSolicitud}
                className="w-full sm:w-auto h-10 px-5 text-xs font-semibold gap-2 shadow-xs"
              >
                <span>Continuar a nueva solicitud</span>
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </TabsContent>

          {/* TAB 2: DESCRIPCIÓN */}
          <TabsContent value="descripcion" className="space-y-6">
            <Card className="border-border bg-surface shadow-xs">
              <CardHeader className="p-6 pb-3">
                <CardTitle className="text-base font-heading font-bold text-foreground">
                  Alcance y Finalidad del Servicio
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Especificaciones funcionales provistas por el Registro Civil.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-1 space-y-4 text-xs sm:text-sm text-foreground/90 leading-relaxed font-normal">
                <p>
                  El servicio de <strong>Datos de identidad</strong> permite a las entidades públicas homologadas contrastar la información ciudadana provista por los usuarios contra el padrón nacional en tiempo real.
                </p>
                <DetailList
                  columns={2}
                  items={[
                    { label: "Tiempo promedio de respuesta", value: "< 120 ms" },
                    { label: "Volumen estimado admitido", value: "Hasta 50,000 req/hora" },
                    { label: "Mecanismo de Autenticación", value: "OAuth 2.0 / Mutual TLS" },
                    { label: "Entorno de Pruebas", value: "Sandbox disponible con datos mock" },
                  ]}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: CONSIDERACIONES TÉCNICAS */}
          <TabsContent value="tecnica" className="space-y-6">
            <Card className="border-border bg-surface shadow-xs">
              <CardHeader className="p-6 pb-3">
                <CardTitle className="text-base font-heading font-bold text-foreground">
                  Requisitos de Conectividad y Seguridad
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-1 space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-border bg-background/50 space-y-1.5">
                    <span className="font-bold text-foreground block">IPs Públicas Estáticas</span>
                    <p className="text-muted-foreground">
                      La institución requirente debe registrar hasta un máximo de 3 IPs públicas para el filtrado perimetral en firewall (WAF).
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-border bg-background/50 space-y-1.5">
                    <span className="font-bold text-foreground block">Certificado SSL/TLS</span>
                    <p className="text-muted-foreground">
                      Cifrado de canal obligatorio TLS 1.3 con certificados emitidos por entidades acreditadas (ARCOTEL).
                    </p>
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
                  Especificación Técnica y Swagger
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-1 space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-background/80 text-xs">
                  <div className="flex items-center gap-2.5">
                    <Code2 className="size-4 text-muted-foreground" />
                    <div>
                      <span className="font-semibold text-foreground block">OpenAPI_Datos_Identidad_RC.yaml</span>
                      <span className="text-[10px] text-muted-foreground">Esquema OpenAPI 3.0 (YAML - 240 KB)</span>
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

