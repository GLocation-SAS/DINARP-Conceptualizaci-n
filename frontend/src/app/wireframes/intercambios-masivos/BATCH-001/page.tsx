"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  Building2,
  Database,
  FileText,
  Download,
  Clock,
  CheckCircle2,
  Send,
  Layers,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
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
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { DetailList } from "@/components/ui/detail-list";
import { WireframeDashboardLayout } from "../../components/wireframe-dashboard-layout";

export default function WireframeDetalleBatchPage() {
  const router = useRouter();

  const [observacionTexto, setObservacionTexto] = useState("");
  const [observacionesList, setObservacionesList] = useState([
    {
      id: "1",
      autor: "Abg. Patricia Morales (DINARP)",
      fecha: "16/09/26 14:00",
      texto: "Se ha solicitado al custodio del Registro Civil la confirmación sobre la estructura del diccionario de datos para cargas familiares.",
    },
  ]);

  const handleAddObservacion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!observacionTexto.trim()) return;

    setObservacionesList((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        autor: "Paula Rozo (Revisora)",
        fecha: "Hoy 13:25",
        texto: observacionTexto.trim(),
      },
    ]);
    setObservacionTexto("");
  };

  return (
    <WireframeDashboardLayout activeMenu="batch">
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
                <Link href="/wireframes/intercambios-masivos" className="text-muted-foreground hover:text-foreground">
                  Intercambios masivos
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-foreground">
                BATCH-001
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* ── 2. Header & Actions Menu ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-foreground tracking-tight">
                BATCH-001 · Cruce poblacional para subsidios de vivienda
              </h1>
              <Badge tone="neutral" appearance="soft" size="md" className="font-semibold text-xs gap-1.5">
                <span className="size-2 rounded-full bg-foreground" />
                En revisión
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Solicitud de intercambio masivo por lote entre Registro Civil y MIDUVI.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/wireframes/intercambios-masivos")}
              className="h-10 px-4 rounded-xl text-xs font-semibold gap-1.5 border-border"
            >
              <ArrowLeft className="size-4" />
              <span>Volver</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="primary"
                  className="h-10 px-4 text-xs font-semibold gap-1.5 shadow-xs"
                >
                  <span>Acciones</span>
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="text-xs gap-2">
                  <Download className="size-3.5" />
                  <span>Descargar resumen técnico</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-xs gap-2">
                  <HelpCircle className="size-3.5" />
                  <span>Solicitar aclaración a entidad</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-xs gap-2 text-foreground font-semibold">
                  <FileSpreadsheet className="size-3.5" />
                  <span>Descargar plantilla de estructura</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* ── 3. Card: Información General ── */}
        <Card className="border-border bg-surface shadow-xs">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-base font-heading font-bold text-foreground">
              Información general
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            <DetailList
              columns={2}
              items={[
                {
                  label: "Código de radicación",
                  value: <span className="font-mono font-bold text-foreground">BATCH-001</span>,
                },
                {
                  label: "Nombre del proyecto",
                  value: "Cruce poblacional para subsidios de vivienda",
                },
                {
                  label: "Estado",
                  value: (
                    <Badge tone="neutral" appearance="soft" size="sm" className="font-semibold text-xs">
                      En revisión
                    </Badge>
                  ),
                },
                {
                  label: "Fecha de creación",
                  value: "16/09/26 09:00",
                },
                {
                  label: "Solicitante",
                  value: "Ing. Marcelo Andrade (Director TIC - MIDUVI)",
                },
                {
                  label: "Institución consumidora",
                  value: "Ministerio de Desarrollo Urbano y Vivienda (MIDUVI)",
                },
                {
                  label: "Responsable en DINARP",
                  value: "Abg. Patricia Morales (Analista Legal de Datos)",
                },
              ]}
            />
          </CardContent>
        </Card>

        {/* ── 4. Card: Fuente y Consumidor ── */}
        <Card className="border-border bg-surface shadow-xs">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-base font-heading font-bold text-foreground flex items-center gap-2">
              <Building2 className="size-4 text-muted-foreground" />
              <span>Fuente y consumidor</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            <DetailList
              columns={2}
              items={[
                {
                  label: "Fuente de datos (Custodio)",
                  value: <span className="font-semibold text-foreground">Dirección General de Registro Civil (DIGERCIC)</span>,
                },
                {
                  label: "Entidad consumidora",
                  value: <span className="font-semibold text-foreground">Ministerio de Desarrollo Urbano y Vivienda (MIDUVI)</span>,
                },
              ]}
            />
          </CardContent>
        </Card>

        {/* ── 5. Card: Información Solicitada ── */}
        <Card className="border-border bg-surface shadow-xs">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-base font-heading font-bold text-foreground flex items-center gap-2">
              <Database className="size-4 text-muted-foreground" />
              <span>Información solicitada</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            <DetailList
              columns={2}
              items={[
                {
                  label: "Tipo de información",
                  value: "Padrón ciudadano / Vínculos familiares y cargas",
                },
                {
                  label: "Volumen estimado",
                  value: "500,000 registros por entrega",
                },
                {
                  label: "Campos requeridos",
                  value: "Cédula, Nombres, Apellidos, Fecha de nacimiento, Cargas familiares, Parroquia",
                },
                {
                  label: "Frecuencia de transferencia",
                  value: "Mensual",
                },
                {
                  label: "Vigencia solicitada",
                  value: "12 meses (Hasta Septiembre 2027)",
                },
              ]}
            />
          </CardContent>
        </Card>

        {/* ── 6. Card: Trazabilidad (Timeline) ── */}
        <Card className="border-border bg-surface shadow-xs">
          <CardHeader className="p-6 pb-3">
            <CardTitle className="text-base font-heading font-bold text-foreground flex items-center gap-2">
              <Clock className="size-4 text-muted-foreground" />
              <span>Trazabilidad</span>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Etapas del proceso de evaluación y habilitación del intercambio por lote.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
              {/* Hito 1 */}
              <div className="relative">
                <div className="absolute -left-6 top-1 size-5 rounded-full bg-foreground text-background flex items-center justify-center">
                  <CheckCircle2 className="size-3.5 stroke-[2.5]" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground">16/09/26 09:00 · Solicitud creada</span>
                    <Badge tone="neutral" appearance="soft" size="sm" className="text-[10px]">Completado</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Registro formal de la solicitud por parte de MIDUVI.</p>
                </div>
              </div>

              {/* Hito 2 */}
              <div className="relative">
                <div className="absolute -left-6 top-1 size-5 rounded-full bg-foreground text-background flex items-center justify-center ring-4 ring-muted/50">
                  <Clock className="size-3.5 stroke-[2.5]" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-foreground">16/09/26 11:30 · En revisión</span>
                    <Badge tone="neutral" appearance="soft" size="sm" className="text-[10px]">En progreso</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Asignación al equipo técnico y legal de la DINARP.</p>
                </div>
              </div>

              {/* Hito 3 */}
              <div className="relative opacity-60">
                <div className="absolute -left-6 top-1 size-5 rounded-full bg-muted border border-border flex items-center justify-center" />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-muted-foreground">Autorización</span>
                  <p className="text-[11px] text-muted-foreground">Dictamen y resolución del Comité de Interoperabilidad.</p>
                </div>
              </div>

              {/* Hito 4 */}
              <div className="relative opacity-60">
                <div className="absolute -left-6 top-1 size-5 rounded-full bg-muted border border-border flex items-center justify-center" />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-muted-foreground">Habilitación del intercambio</span>
                  <p className="text-[11px] text-muted-foreground">Generación de credenciales SFTP y llaves PGP seguras.</p>
                </div>
              </div>

              {/* Hito 5 */}
              <div className="relative opacity-60">
                <div className="absolute -left-6 top-1 size-5 rounded-full bg-muted border border-border flex items-center justify-center" />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-muted-foreground">Intercambio registrado</span>
                  <p className="text-[11px] text-muted-foreground">Depósito auditado del primer lote de datos.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── 7. Card: Documentos ── */}
        <Card className="border-border bg-surface shadow-xs">
          <CardHeader className="p-6 pb-3">
            <CardTitle className="text-base font-heading font-bold text-foreground flex items-center gap-2">
              <FileText className="size-4 text-muted-foreground" />
              <span>Documentos</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-2.5">
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-background/60">
              <div className="flex items-center gap-3">
                <FileText className="size-5 text-muted-foreground shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-foreground">Solicitud_MIDUVI_Oficio_2026.pdf</span>
                  <span className="text-[10px] text-muted-foreground">PDF · 450 KB · Cargado el 16/09/26</span>
                </div>
              </div>
              <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-foreground">
                <Download className="size-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-background/60">
              <div className="flex items-center gap-3">
                <FileText className="size-5 text-muted-foreground shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-foreground">Plan_Operativo_Vivienda.pdf</span>
                  <span className="text-[10px] text-muted-foreground">PDF · 1.8 MB · Cargado el 16/09/26</span>
                </div>
              </div>
              <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-foreground">
                <Download className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ── 8. Card: Observaciones ── */}
        <Card className="border-border bg-surface shadow-xs">
          <CardHeader className="p-6 pb-3">
            <CardTitle className="text-base font-heading font-bold text-foreground">
              Observaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-4">
            {/* Lista de observaciones */}
            <div className="space-y-3">
              {observacionesList.map((obs) => (
                <div key={obs.id} className="p-3.5 rounded-xl border border-border bg-background/50 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">{obs.autor}</span>
                    <span className="text-[10px] text-muted-foreground">{obs.fecha}</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{obs.texto}</p>
                </div>
              ))}
            </div>

            {/* Formulario para agregar observación */}
            <form onSubmit={handleAddObservacion} className="space-y-3 pt-2">
              <textarea
                rows={3}
                placeholder="Escribe una observación o consulta sobre este lote..."
                value={observacionTexto}
                onChange={(e) => setObservacionTexto(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface p-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={!observacionTexto.trim()}
                  className="h-9 px-4 text-xs font-semibold gap-1.5 shadow-xs"
                >
                  <Send className="size-3.5" />
                  <span>Enviar</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </WireframeDashboardLayout>
  );
}

