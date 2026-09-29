"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  ChevronDown,
  RotateCcw,
  Search,
  ArrowLeftRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  Download,
  FileSpreadsheet,
  FileText,
  Info,
  ExternalLink,
  Eye,
  Building,
  Server,
  Layers,
  Filter,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDecorativeIcon,
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert } from "@/components/ui/alert";
import { WireframeDashboardLayout } from "../components/wireframe-dashboard-layout";

interface TransaccionItem {
  id: string;
  fechaHora: string;
  fuente: string;
  consumidor: string;
  servicio: string;
  tipo: "En línea" | "Masivo" | "Excepcionalidad";
  estado: "Exitosa" | "Error";
  tiempoMs: string;
  ipOrigen: string;
  codigoRespuesta: string;
}

const TRANSACCIONES_MOCK: TransaccionItem[] = [
  {
    id: "TX-90211",
    fechaHora: "31/08/2026 10:24",
    fuente: "Registro Civil",
    consumidor: "Ministerio de Educación",
    servicio: "Consulta de identidad",
    tipo: "En línea",
    estado: "Exitosa",
    tiempoMs: "320",
    ipOrigen: "192.168.10.45",
    codigoRespuesta: "200 OK",
  },
  {
    id: "TX-90210",
    fechaHora: "31/08/2026 10:18",
    fuente: "SRI",
    consumidor: "Municipio de Quito",
    servicio: "Validación RUC",
    tipo: "En línea",
    estado: "Exitosa",
    tiempoMs: "280",
    ipOrigen: "10.0.4.12",
    codigoRespuesta: "200 OK",
  },
  {
    id: "TX-90209",
    fechaHora: "31/08/2026 09:55",
    fuente: "IESS",
    consumidor: "Ministerio de Salud",
    servicio: "Consulta de afiliación",
    tipo: "En línea",
    estado: "Error",
    tiempoMs: "—",
    ipOrigen: "172.16.2.89",
    codigoRespuesta: "504 Gateway Timeout",
  },
  {
    id: "TX-90208",
    fechaHora: "31/08/2026 09:32",
    fuente: "Registro Civil",
    consumidor: "Consejo de la Judicatura",
    servicio: "Datos de nacimiento",
    tipo: "Masivo",
    estado: "Exitosa",
    tiempoMs: "1.250",
    ipOrigen: "10.12.80.1",
    codigoRespuesta: "200 OK (Batch procesado)",
  },
  {
    id: "TX-90207",
    fechaHora: "31/08/2026 08:41",
    fuente: "SENESCYT",
    consumidor: "Universidad Central",
    servicio: "Validación de títulos",
    tipo: "En línea",
    estado: "Exitosa",
    tiempoMs: "410",
    ipOrigen: "192.168.20.100",
    codigoRespuesta: "200 OK",
  },
];

export default function WireframeReportesPage() {
  // Filtros
  const [fechaRango, setFechaRango] = useState("01/08/2026  -  31/08/2026");
  const [institucion, setInstitucion] = useState("Todas");
  const [tipoInstitucion, setTipoInstitucion] = useState("Todas");
  const [fuente, setFuente] = useState("Todas");
  const [consumidor, setConsumidor] = useState("Todas");
  const [tipoIntercambio, setTipoIntercambio] = useState("Todos");
  const [estado, setEstado] = useState("Todos");

  // Detalle modal
  const [selectedTx, setSelectedTx] = useState<TransaccionItem | null>(null);

  // Export modal
  const [exportModalType, setExportModalType] = useState<"PDF" | "Excel" | null>(null);

  const handleResetFilters = () => {
    setFechaRango("01/08/2026  -  31/08/2026");
    setInstitucion("Todas");
    setTipoInstitucion("Todas");
    setFuente("Todas");
    setConsumidor("Todas");
    setTipoIntercambio("Todos");
    setEstado("Todos");
  };

  return (
    <WireframeDashboardLayout activeMenu="reportes">
      <main className="relative p-4 sm:p-6 lg:p-8 w-full space-y-6 sm:space-y-8">
        {/* Background subtle effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-muted/20 to-transparent pointer-events-none -z-10 blur-3xl opacity-60" />

        {/* ── 1. Header Title & Banner ── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight text-foreground">
              Reportes
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed font-normal">
              Consulta información de los intercambios de datos, genera indicadores y exporta resultados.
            </p>
          </div>

          {/* Banner Fase Posterior */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary shrink-0 max-w-md">
            <div className="size-8 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
              <Info className="size-4" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-foreground">Funcionalidad en fase posterior.</p>
              <p className="text-[11px] text-muted-foreground leading-tight">Vista conceptual para referencia.</p>
            </div>
          </div>
        </div>

        {/* ── 2. Filtros de Búsqueda ── */}
        <Card
          className="rounded-2xl border-border bg-surface shadow-xs w-full"
          innerClassName="items-start text-left p-5 sm:p-6 space-y-4 w-full"
        >
          <div className="flex items-center gap-2 text-foreground pb-1">
            <Filter className="size-4 text-primary" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Filtros de búsqueda
            </h2>
          </div>

          <div className="w-full space-y-4">
            {/* Grid de 4 Columnas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              {/* Rango de fechas */}
              <div className="space-y-1.5 text-left">
                <span className="text-[11px] font-semibold text-muted-foreground block text-left">
                  Rango de fechas
                </span>
                <InputGroup
                  size="default"
                  rightIcon={<Calendar className="size-3.5 text-muted-foreground" />}
                  className="bg-surface h-10 rounded-xl border-border/80 w-full"
                >
                  <InputGroupInput
                    value={fechaRango}
                    onChange={(e) => setFechaRango(e.target.value)}
                    className="text-xs font-mono font-medium text-left"
                  />
                </InputGroup>
              </div>

              {/* Institución */}
              <div className="space-y-1.5 text-left">
                <span className="text-[11px] font-semibold text-muted-foreground block text-left">
                  Institución
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-10 px-3.5 flex items-center justify-between bg-surface border-border/80 text-left w-full text-xs font-medium"
                    >
                      <span className="truncate text-left flex-1">{institucion}</span>
                      <ChevronDown className="size-3.5 text-muted-foreground shrink-0 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-52">
                    <DropdownMenuRadioGroup value={institucion} onValueChange={setInstitucion}>
                      <DropdownMenuRadioItem value="Todas">Todas</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Registro Civil">Registro Civil</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="SRI">SRI</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Ministerio de Educación">Ministerio de Educación</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="IESS">IESS</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Tipo de institución */}
              <div className="space-y-1.5 text-left">
                <span className="text-[11px] font-semibold text-muted-foreground block text-left">
                  Tipo de institución
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-10 px-3.5 flex items-center justify-between bg-surface border-border/80 text-left w-full text-xs font-medium"
                    >
                      <span className="truncate text-left flex-1">{tipoInstitucion}</span>
                      <ChevronDown className="size-3.5 text-muted-foreground shrink-0 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-52">
                    <DropdownMenuRadioGroup value={tipoInstitucion} onValueChange={setTipoInstitucion}>
                      <DropdownMenuRadioItem value="Todas">Todas</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Pública Central">Pública Central</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Pública Seccional">Pública Seccional</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Empresa Pública">Empresa Pública</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Fuente */}
              <div className="space-y-1.5 text-left">
                <span className="text-[11px] font-semibold text-muted-foreground block text-left">
                  Fuente
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-10 px-3.5 flex items-center justify-between bg-surface border-border/80 text-left w-full text-xs font-medium"
                    >
                      <span className="truncate text-left flex-1">{fuente}</span>
                      <ChevronDown className="size-3.5 text-muted-foreground shrink-0 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-52">
                    <DropdownMenuRadioGroup value={fuente} onValueChange={setFuente}>
                      <DropdownMenuRadioItem value="Todas">Todas</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Registro Civil">Registro Civil</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="SRI">SRI</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="IESS">IESS</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="SENESCYT">SENESCYT</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Consumidor */}
              <div className="space-y-1.5 text-left">
                <span className="text-[11px] font-semibold text-muted-foreground block text-left">
                  Consumidor
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-10 px-3.5 flex items-center justify-between bg-surface border-border/80 text-left w-full text-xs font-medium"
                    >
                      <span className="truncate text-left flex-1">{consumidor}</span>
                      <ChevronDown className="size-3.5 text-muted-foreground shrink-0 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-52">
                    <DropdownMenuRadioGroup value={consumidor} onValueChange={setConsumidor}>
                      <DropdownMenuRadioItem value="Todas">Todas</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Ministerio de Educación">Ministerio de Educación</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Municipio de Quito">Municipio de Quito</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Ministerio de Salud">Ministerio de Salud</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Consejo de la Judicatura">Consejo de la Judicatura</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Tipo de intercambio */}
              <div className="space-y-1.5 text-left">
                <span className="text-[11px] font-semibold text-muted-foreground block text-left">
                  Tipo de intercambio
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-10 px-3.5 flex items-center justify-between bg-surface border-border/80 text-left w-full text-xs font-medium"
                    >
                      <span className="truncate text-left flex-1">{tipoIntercambio}</span>
                      <ChevronDown className="size-3.5 text-muted-foreground shrink-0 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-52">
                    <DropdownMenuRadioGroup value={tipoIntercambio} onValueChange={setTipoIntercambio}>
                      <DropdownMenuRadioItem value="Todos">Todos</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="En línea">En línea</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Masivo">Masivo</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Excepcionalidad">Excepcionalidad</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Estado */}
              <div className="space-y-1.5 text-left">
                <span className="text-[11px] font-semibold text-muted-foreground block text-left">
                  Estado
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-10 px-3.5 flex items-center justify-between bg-surface border-border/80 text-left w-full text-xs font-medium"
                    >
                      <span className="truncate text-left flex-1">{estado}</span>
                      <ChevronDown className="size-3.5 text-muted-foreground shrink-0 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-52">
                    <DropdownMenuRadioGroup value={estado} onValueChange={setEstado}>
                      <DropdownMenuRadioItem value="Todos">Todos</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Exitosa">Exitosa</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Error">Error</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Botones de Acción */}
              <div className="flex items-center gap-2 w-full pt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResetFilters}
                  className="h-10 flex-1 text-xs font-semibold border-border/80 bg-surface justify-center hover:bg-muted/30"
                >
                  <RotateCcw className="size-3.5 mr-1 text-muted-foreground" />
                  Limpiar
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  className="h-10 flex-1 text-xs font-semibold shadow-xs justify-center"
                >
                  <Search className="size-3.5 mr-1" />
                  Consultar
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* ── 3. Indicadores Resumen (4 Cards Featured) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Transacciones */}
          <Card
            variant="featured"
            className="bg-primary/10 hover:bg-primary/15 border border-primary/20 transition-colors"
            innerClassName="p-5 items-start text-left gap-1"
          >
            <span className="font-mono font-extrabold text-2xl sm:text-3xl text-foreground tracking-tight block">
              125.430
            </span>
            <span className="text-xs font-semibold text-primary block">
              Total de transacciones
            </span>
            <span className="text-[11px] font-medium text-foreground flex items-center gap-0.5 mt-1">
              <span className="text-foreground font-semibold">↑ +12%</span>
              <span className="text-muted-foreground font-normal">vs. mes anterior</span>
            </span>
            <CardDecorativeIcon>
              <ArrowLeftRight className="size-28 text-primary" />
            </CardDecorativeIcon>
          </Card>

          {/* Card 2: Exitosas */}
          <Card
            variant="featured"
            className="bg-foreground/10 hover:bg-foreground/15 border border-border transition-colors"
            innerClassName="p-5 items-start text-left gap-1"
          >
            <span className="font-mono font-extrabold text-2xl sm:text-3xl text-foreground tracking-tight block">
              118.920
            </span>
            <span className="text-xs font-semibold text-foreground block">
              Transacciones exitosas
            </span>
            <span className="text-[11px] font-medium text-foreground flex items-center gap-0.5 mt-1">
              <span className="font-semibold text-foreground">95%</span>
              <span className="text-muted-foreground font-normal">del total</span>
            </span>
            <CardDecorativeIcon>
              <CheckCircle2 className="size-28 text-foreground" />
            </CardDecorativeIcon>
          </Card>

          {/* Card 3: Con Error */}
          <Card
            variant="featured"
            className="bg-foreground/10 hover:bg-foreground/15 border border-border transition-colors"
            innerClassName="p-5 items-start text-left gap-1"
          >
            <span className="font-mono font-extrabold text-2xl sm:text-3xl text-foreground tracking-tight block">
              6.510
            </span>
            <span className="text-xs font-semibold text-foreground block">
              Transacciones con error
            </span>
            <span className="text-[11px] font-medium text-foreground flex items-center gap-0.5 mt-1">
              <span className="font-semibold text-foreground">5%</span>
              <span className="text-muted-foreground font-normal">del total</span>
            </span>
            <CardDecorativeIcon>
              <AlertTriangle className="size-28 text-foreground" />
            </CardDecorativeIcon>
          </Card>

          {/* Card 4: Disponibilidad */}
          <Card
            variant="featured"
            className="bg-foreground/10 hover:bg-foreground/15 border border-border transition-colors"
            innerClassName="p-5 items-start text-left gap-1"
          >
            <span className="font-mono font-extrabold text-2xl sm:text-3xl text-foreground tracking-tight block">
              99,8%
            </span>
            <span className="text-xs font-semibold text-foreground block">
              Disponibilidad de servicios
            </span>
            <span className="text-[11px] font-medium text-foreground flex items-center gap-0.5 mt-1">
              <span className="text-foreground font-semibold">↑ +0,2%</span>
              <span className="text-muted-foreground font-normal">vs. mes anterior</span>
            </span>
            <CardDecorativeIcon>
              <Clock className="size-28 text-foreground" />
            </CardDecorativeIcon>
          </Card>
        </div>

        {/* ── 4. Gráficos (2 Columns) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Gráfico 1: Transacciones por Día (7 cols) */}
          <Card className="lg:col-span-7 rounded-2xl border-border bg-surface p-6 space-y-4 shadow-xs flex flex-col justify-between">
            <h2 className="text-sm font-bold text-foreground">
              Transacciones por día
            </h2>

            {/* SVG Line Chart */}
            <div className="w-full h-56 relative pt-2">
              <svg viewBox="0 0 540 180" className="w-full h-full overflow-visible">
                {/* Horizontal Grid lines */}
                <line x1="40" y1="20" x2="520" y2="20" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
                <line x1="40" y1="55" x2="520" y2="55" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
                <line x1="40" y1="90" x2="520" y2="90" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
                <line x1="40" y1="125" x2="520" y2="125" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
                <line x1="40" y1="160" x2="520" y2="160" stroke="currentColor" strokeOpacity="0.2" />

                {/* Y Axis Labels */}
                <text x="32" y="24" textAnchor="end" fontSize="10" fill="currentColor" opacity="0.6">8.000</text>
                <text x="32" y="59" textAnchor="end" fontSize="10" fill="currentColor" opacity="0.6">6.000</text>
                <text x="32" y="94" textAnchor="end" fontSize="10" fill="currentColor" opacity="0.6">4.000</text>
                <text x="32" y="129" textAnchor="end" fontSize="10" fill="currentColor" opacity="0.6">2.000</text>
                <text x="32" y="163" textAnchor="end" fontSize="10" fill="currentColor" opacity="0.6">0</text>

                {/* Main Line: Exitosas */}
                <path
                  d="M 50 88 L 100 52 L 140 68 L 180 52 L 220 50 L 260 68 L 300 50 L 340 52 L 380 72 L 420 40 L 460 65 L 490 65 L 515 48"
                  fill="none"
                  stroke="var(--chart-1)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Dots for Exitosas */}
                {[
                  [50, 88], [100, 52], [140, 68], [180, 52], [220, 50],
                  [260, 68], [300, 50], [340, 52], [380, 72], [420, 40],
                  [460, 65], [490, 65], [515, 48]
                ].map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r="3" fill="var(--chart-1)" className="transition-all hover:r-4" />
                ))}

                {/* Sub Line: Con error */}
                <path
                  d="M 50 148 L 100 145 L 140 148 L 180 148 L 220 148 L 260 148 L 300 148 L 340 148 L 380 148 L 420 148 L 460 148 L 490 148 L 515 148"
                  fill="none"
                  stroke="var(--chart-3)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Dots for Con error */}
                {[
                  [50, 148], [100, 145], [140, 148], [180, 148], [220, 148],
                  [260, 148], [300, 148], [340, 148], [380, 148], [420, 148],
                  [460, 148], [490, 148], [515, 148]
                ].map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r="2.5" fill="var(--chart-3)" />
                ))}

                {/* X Axis Labels */}
                <text x="50" y="176" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.6">01 ago</text>
                <text x="125" y="176" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.6">05 ago</text>
                <text x="200" y="176" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.6">10 ago</text>
                <text x="280" y="176" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.6">15 ago</text>
                <text x="360" y="176" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.6">20 ago</text>
                <text x="440" y="176" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.6">25 ago</text>
                <text x="515" y="176" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.6">31 ago</text>
              </svg>
            </div>

            {/* Bottom Legend */}
            <div className="flex items-center justify-center gap-6 pt-2 border-t border-border/50 text-xs">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-chart-1" />
                <span className="text-muted-foreground font-medium">Exitosas</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-chart-3" />
                <span className="text-muted-foreground font-medium">Con error</span>
              </div>
            </div>
          </Card>

          {/* Gráfico 2: Transacciones por Tipo de Intercambio (5 cols) */}
          <Card className="lg:col-span-5 rounded-2xl border-border bg-surface p-6 space-y-4 shadow-xs flex flex-col justify-between">
            <h2 className="text-sm font-bold text-foreground">
              Transacciones por tipo de intercambio
            </h2>

            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
              {/* SVG Donut Chart */}
              <div className="relative size-40 sm:size-44 shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="size-full -rotate-90">
                  {/* Background Circle */}
                  <circle cx="50" cy="50" r="38" fill="transparent" stroke="currentColor" strokeOpacity="0.05" strokeWidth="16" />

                  {/* Consultas en línea: 68% -> dasharray 162.3 238.7 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="var(--chart-1)"
                    strokeWidth="16"
                    strokeDasharray="162.3 238.7"
                    strokeDashoffset="0"
                  />

                  {/* Intercambio masivo: 18% -> dasharray 43.0 238.7 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="var(--chart-2)"
                    strokeWidth="16"
                    strokeDasharray="43.0 238.7"
                    strokeDashoffset="-162.3"
                  />

                  {/* Excepcionalidades: 9% -> dasharray 21.5 238.7 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="var(--chart-3)"
                    strokeWidth="16"
                    strokeDasharray="21.5 238.7"
                    strokeDashoffset="-205.3"
                  />

                  {/* Otros: 5% -> dasharray 11.9 238.7 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="var(--chart-4)"
                    strokeWidth="16"
                    strokeDasharray="11.9 238.7"
                    strokeDashoffset="-226.8"
                  />
                </svg>

                {/* Center Stats */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="font-mono font-extrabold text-base sm:text-lg text-foreground tracking-tight leading-tight">
                    125.430
                  </span>
                  <span className="text-[10px] text-muted-foreground font-medium">
                    transacciones
                  </span>
                </div>
              </div>

              {/* Legend with percentages */}
              <div className="space-y-3 w-full sm:w-auto text-xs">
                <div className="flex items-center justify-between sm:justify-start gap-3">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-chart-1" />
                    <span className="text-muted-foreground">Consultas en línea</span>
                  </div>
                  <span className="font-bold text-foreground font-mono">68%</span>
                </div>

                <div className="flex items-center justify-between sm:justify-start gap-3">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-chart-2" />
                    <span className="text-muted-foreground">Intercambio masivo</span>
                  </div>
                  <span className="font-bold text-foreground font-mono">18%</span>
                </div>

                <div className="flex items-center justify-between sm:justify-start gap-3">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-chart-3" />
                    <span className="text-muted-foreground">Excepcionalidades</span>
                  </div>
                  <span className="font-bold text-foreground font-mono">9%</span>
                </div>

                <div className="flex items-center justify-between sm:justify-start gap-3">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-chart-4" />
                    <span className="text-muted-foreground">Otros</span>
                  </div>
                  <span className="font-bold text-foreground font-mono">5%</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-border/50 text-[11px] text-center text-muted-foreground">
              Distribución porcentual del total acumulado del período.
            </div>
          </Card>
        </div>

        {/* ── 5. Detalle de Transacciones ── */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-sm font-bold text-foreground">
              Detalle de transacciones
            </h2>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="primary"
                onClick={() => setExportModalType("PDF")}
                className="h-9 px-3.5 rounded-xl text-xs font-semibold gap-1.5 shadow-xs"
              >
                <Download className="size-3.5" />
                <span>Exportar PDF</span>
              </Button>

              <Button
                type="button"
                variant="neutral"
                onClick={() => setExportModalType("Excel")}
                className="h-9 px-3.5 rounded-xl text-xs font-semibold gap-1.5"
              >
                <FileSpreadsheet className="size-3.5" />
                <span>Exportar Excel</span>
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b-0">
                <TableHead className="font-bold">
                  FECHA Y HORA
                </TableHead>
                <TableHead className="font-bold">
                  FUENTE
                </TableHead>
                <TableHead className="font-bold">
                  CONSUMIDOR
                </TableHead>
                <TableHead className="font-bold">
                  SERVICIO / DATOS
                </TableHead>
                <TableHead className="font-bold">
                  TIPO
                </TableHead>
                <TableHead className="font-bold">
                  ESTADO
                </TableHead>
                <TableHead className="font-bold">
                  TIEMPO (MS)
                </TableHead>
                <TableHead className="text-right font-bold">
                  ACCIONES
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TRANSACCIONES_MOCK.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                    {tx.fechaHora}
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-foreground whitespace-nowrap">
                    {tx.fuente}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {tx.consumidor}
                  </TableCell>
                  <TableCell className="text-xs text-foreground font-medium whitespace-nowrap">
                    {tx.servicio}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {tx.tipo}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge
                      tone="neutral"
                      appearance="soft"
                      size="sm"
                      className="font-medium text-xs"
                    >
                      {tx.estado}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                    {tx.tiempoMs}
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <div className="inline-flex items-center justify-end">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setSelectedTx(tx)}
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

        {/* ── Paginación Estandarizada UI Kit ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-muted-foreground font-medium">
            Mostrando 1 a {TRANSACCIONES_MOCK.length} de {TRANSACCIONES_MOCK.length} transacciones
          </p>
          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent className="gap-1.5">
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">
                  3
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">
                  12
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        {/* ── Modal Detalle de Transacción ── */}
        <Dialog open={!!selectedTx} onOpenChange={(open) => !open && setSelectedTx(null)}>
          <DialogContent variant="standard" className="max-w-lg rounded-3xl p-6 sm:p-8 bg-background border-border shadow-2xl">
            <DialogHeader className="space-y-1">
              <div className="flex items-center gap-2">
                <DialogTitle className="font-heading font-bold text-xl text-foreground">
                  Detalle de Transacción
                </DialogTitle>
                {selectedTx && (
                  <Badge
                    tone="neutral"
                    appearance="soft"
                    size="sm"
                  >
                    {selectedTx.estado}
                  </Badge>
                )}
              </div>
              <DialogDescription className="text-xs text-muted-foreground">
                Identificador único de traza de intercambio.
              </DialogDescription>
            </DialogHeader>

            {selectedTx && (
              <div className="space-y-4 py-3 text-xs">
                <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-muted/30 border border-border/60">
                  <div>
                    <span className="text-[11px] text-muted-foreground block mb-0.5">ID Traza</span>
                    <span className="font-mono font-bold text-foreground">{selectedTx.id}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground block mb-0.5">Fecha y hora</span>
                    <span className="font-mono text-foreground">{selectedTx.fechaHora}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground block mb-0.5">Código de respuesta</span>
                    <span className="font-mono font-semibold text-foreground">{selectedTx.codigoRespuesta}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground block mb-0.5">Tiempo de latencia</span>
                    <span className="font-mono text-foreground">{selectedTx.tiempoMs} ms</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] text-muted-foreground block mb-0.5">Entidad Fuente</span>
                    <span className="font-semibold text-foreground">{selectedTx.fuente}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground block mb-0.5">Entidad Consumidora</span>
                    <span className="font-semibold text-foreground">{selectedTx.consumidor}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground block mb-0.5">Servicio Interoperado</span>
                    <span className="text-foreground">{selectedTx.servicio}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground block mb-0.5">Modalidad</span>
                    <span className="text-foreground">{selectedTx.tipo}</span>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="mt-2 flex w-full">
              <Button
                type="button"
                variant="primary"
                onClick={() => setSelectedTx(null)}
                className="w-full h-11 text-xs font-semibold"
              >
                Cerrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ── Modal de Exportación Simulada ── */}
        <Dialog open={!!exportModalType} onOpenChange={(open) => !open && setExportModalType(null)}>
          <DialogContent variant="standard" className="max-w-[420px] rounded-3xl p-6 sm:p-8 bg-background border-border shadow-2xl text-center">
            <div className="size-14 rounded-2xl bg-muted/60 border border-border flex items-center justify-center text-foreground mb-3 mx-auto">
              <CheckCircle2 className="size-7 stroke-[2]" />
            </div>
            <DialogHeader className="text-center space-y-2">
              <DialogTitle className="font-heading font-bold text-xl text-foreground">
                Exportación generada
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                El informe consolidado de transacciones en formato <strong>{exportModalType}</strong> ha sido generado y descargado exitosamente.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4 flex w-full">
              <Button
                type="button"
                variant="primary"
                onClick={() => setExportModalType(null)}
                className="w-full h-11 text-xs font-semibold"
              >
                Aceptar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </WireframeDashboardLayout>
  );
}

