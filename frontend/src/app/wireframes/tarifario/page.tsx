"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  ChevronDown,
  Plus,
  Trash2,
  RotateCcw,
  FileText,
  Download,
  Calculator,
  Receipt,
  CheckCircle2,
  Eye,
  RefreshCw,
  Filter,
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { WireframeDashboardLayout } from "../components/wireframe-dashboard-layout";

// ── Datos Mock Tarifario ──
interface TarifaItem {
  fuente: string;
  servicio: string;
  descripcion: string;
  unidad: string;
  tarifa: number;
  estado: "Vigente" | "En revisión" | "No vigente";
}

const TARIFARIO_DATA: TarifaItem[] = [
  {
    fuente: "Registro Civil",
    servicio: "Consulta de identidad",
    descripcion: "Consulta de datos de identidad de una persona",
    unidad: "Por transacción",
    tarifa: 0.05,
    estado: "Vigente",
  },
  {
    fuente: "SRI",
    servicio: "Consulta de RUC",
    descripcion: "Consulta de información de contribuyentes",
    unidad: "Por transacción",
    tarifa: 0.10,
    estado: "Vigente",
  },
  {
    fuente: "Ministerio de Educación",
    servicio: "Validación de títulos",
    descripcion: "Consulta de títulos y registros académicos",
    unidad: "Por transacción",
    tarifa: 0.20,
    estado: "Vigente",
  },
  {
    fuente: "ANT",
    servicio: "Consulta de vehículos",
    descripcion: "Consulta de información vehicular",
    unidad: "Por transacción",
    tarifa: 0.15,
    estado: "Vigente",
  },
  {
    fuente: "IESS",
    servicio: "Consulta de afiliación",
    descripcion: "Consulta de estado de afiliación",
    unidad: "Por transacción",
    tarifa: 0.10,
    estado: "Vigente",
  },
];

// Servicios disponibles para la calculadora
const SERVICIOS_POR_FUENTE: Record<string, { servicio: string; tarifa: number }[]> = {
  "Registro Civil": [
    { servicio: "Consulta de identidad", tarifa: 0.05 },
    { servicio: "Validación de estado civil", tarifa: 0.08 },
  ],
  SRI: [
    { servicio: "Consulta de RUC", tarifa: 0.10 },
    { servicio: "Certificado de cumplimiento tributario", tarifa: 0.15 },
  ],
  "Ministerio de Educación": [
    { servicio: "Validación de títulos", tarifa: 0.20 },
  ],
  ANT: [
    { servicio: "Consulta de vehículos", tarifa: 0.15 },
    { servicio: "Historial de infracciones", tarifa: 0.12 },
  ],
  IESS: [
    { servicio: "Consulta de afiliación", tarifa: 0.10 },
  ],
};

interface CotizacionCalculadaItem {
  id: string;
  fuente: string;
  servicio: string;
  unidad: string;
  cantidad: number;
  tarifa: number;
  subtotal: number;
}

interface CotizacionGuardada {
  codigo: string;
  proyecto: string;
  fecha: string;
  total: number;
  estado: "Borrador" | "Aprobada" | "En revisión";
}

export default function WireframeTarifarioCotizacionPage() {
  const [activeTab, setActiveTab] = useState("tarifario");

  // Filtros Tab 1
  const [searchTarifario, setSearchTarifario] = useState("");
  const [filterEstadoTarifario, setFilterEstadoTarifario] = useState("Todos los estados");

  // Estado Tab 2 (Calculadora)
  const [selectedProyecto, setSelectedProyecto] = useState("Proyecto Identidad Digital");
  const [selectedFuente, setSelectedFuente] = useState("Registro Civil");
  const [selectedServicio, setSelectedServicio] = useState("Consulta de identidad");
  const [cantidadInput, setCantidadInput] = useState("1000");

  const [itemsCalculados, setItemsCalculados] = useState<CotizacionCalculadaItem[]>([
    {
      id: "1",
      fuente: "Registro Civil",
      servicio: "Consulta de identidad",
      unidad: "Por transacción",
      cantidad: 1000,
      tarifa: 0.05,
      subtotal: 50.0,
    },
    {
      id: "2",
      fuente: "SRI",
      servicio: "Consulta de RUC",
      unidad: "Por transacción",
      cantidad: 500,
      tarifa: 0.10,
      subtotal: 50.0,
    },
    {
      id: "3",
      fuente: "Ministerio de Educación",
      servicio: "Validación de títulos",
      unidad: "Por transacción",
      cantidad: 200,
      tarifa: 0.20,
      subtotal: 40.0,
    },
  ]);

  // Estado Tab 3 (Mis Cotizaciones)
  const [misCotizaciones, setMisCotizaciones] = useState<CotizacionGuardada[]>([
    {
      codigo: "COT-2026-001",
      proyecto: "Proyecto Identidad Digital",
      fecha: "16 sep 2026",
      total: 140.0,
      estado: "Aprobada",
    },
    {
      codigo: "COT-2026-002",
      proyecto: "Actualización Catastral Nacional",
      fecha: "12 sep 2026",
      total: 85.5,
      estado: "En revisión",
    },
    {
      codigo: "COT-2026-003",
      proyecto: "Cruce de Subsidios MIDUVI",
      fecha: "05 sep 2026",
      total: 320.0,
      estado: "Borrador",
    },
  ]);

  const [selectedCotizacionDetalle, setSelectedCotizacionDetalle] = useState<CotizacionGuardada | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Filtrado Tarifario Tab 1
  const filteredTarifario = useMemo(() => {
    return TARIFARIO_DATA.filter((item) => {
      const matchSearch =
        searchTarifario === "" ||
        item.fuente.toLowerCase().includes(searchTarifario.toLowerCase()) ||
        item.servicio.toLowerCase().includes(searchTarifario.toLowerCase()) ||
        item.descripcion.toLowerCase().includes(searchTarifario.toLowerCase());

      const matchEstado =
        filterEstadoTarifario === "Todos los estados" || item.estado === filterEstadoTarifario;

      return matchSearch && matchEstado;
    });
  }, [searchTarifario, filterEstadoTarifario]);

  // Agregar servicio en la calculadora
  const handleAddServicioCalculado = () => {
    const qty = parseInt(cantidadInput, 10);
    if (isNaN(qty) || qty <= 0) return;

    const serviciosFuente = SERVICIOS_POR_FUENTE[selectedFuente] || [];
    const servObj = serviciosFuente.find((s) => s.servicio === selectedServicio) || {
      servicio: selectedServicio,
      tarifa: 0.1,
    };

    const subtotal = qty * servObj.tarifa;

    const newItem: CotizacionCalculadaItem = {
      id: String(Date.now()),
      fuente: selectedFuente,
      servicio: servObj.servicio,
      unidad: "Por transacción",
      cantidad: qty,
      tarifa: servObj.tarifa,
      subtotal: subtotal,
    };

    setItemsCalculados((prev) => [...prev, newItem]);
  };

  const handleRemoveCalculado = (id: string) => {
    setItemsCalculados((prev) => prev.filter((item) => item.id !== id));
  };

  const handleLimpiarCalculadora = () => {
    setItemsCalculados([]);
  };

  const totalCalculado = useMemo(() => {
    return itemsCalculados.reduce((acc, curr) => acc + curr.subtotal, 0);
  }, [itemsCalculados]);

  // Generar Cotización
  const handleGenerarCotizacion = () => {
    const nuevoCodigo = `COT-2026-00${misCotizaciones.length + 1}`;
    const nuevaCot: CotizacionGuardada = {
      codigo: nuevoCodigo,
      proyecto: selectedProyecto,
      fecha: "Hoy 13:30",
      total: totalCalculado,
      estado: "Borrador",
    };

    setMisCotizaciones((prev) => [nuevaCot, ...prev]);
    setIsSuccessModalOpen(true);
  };

  return (
    <WireframeDashboardLayout activeMenu="cotizacion">
      <main className="relative p-4 sm:p-6 lg:p-8 w-full space-y-6 sm:space-y-8">
        {/* Background subtle effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-muted/20 to-transparent pointer-events-none -z-10 blur-3xl opacity-60" />

        {/* ── 1. Header Title & Description ── */}
        <div className="space-y-1">
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight text-foreground">
            Tarifario y cotización
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed font-normal">
            Consulta las tarifas de los servicios de interoperabilidad y genera una cotización según tu necesidad.
          </p>
        </div>

        {/* ── 2. Tabs Principales ── */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted/40 p-1 rounded-xl border border-border h-11 w-full sm:w-auto inline-flex">
            <TabsTrigger value="tarifario" className="rounded-lg text-xs font-semibold px-4">
              Tarifario
            </TabsTrigger>
            <TabsTrigger value="calcular" className="rounded-lg text-xs font-semibold px-4">
              Calcular cotización
            </TabsTrigger>
            <TabsTrigger value="mis-cotizaciones" className="rounded-lg text-xs font-semibold px-4">
              Mis cotizaciones
            </TabsTrigger>
          </TabsList>

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* TAB 1: TARIFARIO DE SERVICIOS                                     */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <TabsContent value="tarifario" className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="font-heading font-bold text-lg text-foreground">
                  1. Tarifario de servicios
                </h2>
                <p className="text-xs text-muted-foreground max-w-xl">
                  Consulta las tarifas vigentes por fuente y servicio. Los valores pueden variar según el tipo de uso y volumen.
                </p>
              </div>

              {/* Buscador y Filtro por Estado */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <InputGroup
                  size="default"
                  leftIcon={<Search className="size-4 text-muted-foreground" />}
                  className="bg-surface h-10 w-full sm:w-64 rounded-xl border-border"
                >
                  <InputGroupInput
                    placeholder="Buscar fuente, servicio o dato..."
                    value={searchTarifario}
                    onChange={(e) => setSearchTarifario(e.target.value)}
                    className="text-xs"
                  />
                </InputGroup>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-10 px-4 text-xs font-semibold gap-2 border-border bg-surface w-full sm:w-auto cursor-pointer"
                    >
                      <Filter className="size-3.5 text-muted-foreground" />
                      <span>Filtros</span>
                      {filterEstadoTarifario !== "Todos los estados" && (
                        <span className="size-2 rounded-full bg-foreground" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuLabel className="text-xs font-bold text-foreground">
                      Filtrar por Estado
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={filterEstadoTarifario}
                      onValueChange={setFilterEstadoTarifario}
                    >
                      <DropdownMenuRadioItem value="Todos los estados">Todos los estados</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Vigente">Vigente</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="En revisión">En revisión</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="No vigente">No vigente</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-xs">
              <Table className="w-full border-spacing-0">
                <TableHeader>
                  <TableRow className="border-b border-border/80 bg-muted/30">
                    <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-6 text-left">
                      FUENTE
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-6 text-left">
                      SERVICIO / DATO
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-6 text-left">
                      DESCRIPCIÓN
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-6 text-left">
                      UNIDAD DE COBRO
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-6 text-left">
                      TARIFA (USD)
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-6 text-left">
                      ESTADO
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTarifario.map((row, idx) => (
                    <TableRow key={idx} className="border-b border-border/40 hover:bg-muted/10 transition-colors">
                      <TableCell className="py-4 px-6 text-xs font-semibold text-foreground whitespace-nowrap">
                        {row.fuente}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-xs font-medium text-foreground whitespace-nowrap">
                        {row.servicio}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-xs text-muted-foreground max-w-[280px]">
                        {row.descripcion}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-xs text-muted-foreground whitespace-nowrap">
                        {row.unidad}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-xs font-mono font-bold text-foreground whitespace-nowrap">
                        {row.tarifa.toFixed(2).replace(".", ",")}
                      </TableCell>
                      <TableCell className="py-4 px-6 whitespace-nowrap">
                        <Badge tone="neutral" appearance="soft" size="sm" className="font-semibold text-xs">
                          {row.estado}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end pt-2">
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
                      10
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </TabsContent>

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* TAB 2: CALCULAR COTIZACIÓN                                        */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <TabsContent value="calcular" className="space-y-6">
            <Card className="rounded-2xl border-border bg-surface shadow-xs">
              <CardHeader className="p-6 pb-4">
                <CardTitle className="font-heading font-bold text-lg text-foreground">
                  2. Calcular cotización
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Selecciona fuentes y servicios para obtener un valor estimado.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 pt-0 space-y-6">
                {/* Formulario de Selección */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
                  {/* Proyecto / Solicitud */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-foreground block">Proyecto / Solicitud</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="h-10 px-3 flex items-center justify-between bg-surface border-border text-left w-full text-xs"
                        >
                          <span className="truncate">{selectedProyecto}</span>
                          <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-56">
                        <DropdownMenuRadioGroup value={selectedProyecto} onValueChange={setSelectedProyecto}>
                          <DropdownMenuRadioItem value="Proyecto Identidad Digital">
                            Proyecto Identidad Digital
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="Actualización Catastral Nacional">
                            Actualización Catastral Nacional
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="Cruce de Subsidios MIDUVI">
                            Cruce de Subsidios MIDUVI
                          </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Fuente */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-foreground block">Fuente</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="h-10 px-3 flex items-center justify-between bg-surface border-border text-left w-full text-xs"
                        >
                          <span className="truncate">{selectedFuente}</span>
                          <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-52">
                        <DropdownMenuRadioGroup
                          value={selectedFuente}
                          onValueChange={(val) => {
                            setSelectedFuente(val);
                            const firstServ = (SERVICIOS_POR_FUENTE[val] || [])[0];
                            if (firstServ) setSelectedServicio(firstServ.servicio);
                          }}
                        >
                          <DropdownMenuRadioItem value="Registro Civil">Registro Civil</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="SRI">SRI</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="Ministerio de Educación">Ministerio de Educación</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="ANT">ANT</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="IESS">IESS</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Servicio / Dato */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-foreground block">Servicio / Dato</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="h-10 px-3 flex items-center justify-between bg-surface border-border text-left w-full text-xs"
                        >
                          <span className="truncate">{selectedServicio}</span>
                          <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-56">
                        <DropdownMenuRadioGroup value={selectedServicio} onValueChange={setSelectedServicio}>
                          {(SERVICIOS_POR_FUENTE[selectedFuente] || []).map((s) => (
                            <DropdownMenuRadioItem key={s.servicio} value={s.servicio}>
                              {s.servicio} (${s.tarifa.toFixed(2)})
                            </DropdownMenuRadioItem>
                          ))}
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Cantidad estimada */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-foreground block">Cantidad estimada</span>
                    <InputGroup className="bg-surface h-10 rounded-xl border-border">
                      <InputGroupInput
                        type="number"
                        placeholder="Ej. 1000"
                        value={cantidadInput}
                        onChange={(e) => setCantidadInput(e.target.value)}
                        className="text-xs"
                      />
                    </InputGroup>
                  </div>

                  {/* Botón Agregar */}
                  <Button
                    type="button"
                    variant="neutral"
                    onClick={handleAddServicioCalculado}
                    className="h-10 px-4 text-xs font-semibold gap-1.5 shadow-xs w-full justify-center"
                  >
                    <Plus className="size-4" />
                    <span>Agregar</span>
                  </Button>
                </div>

                {/* Sección: Servicios seleccionados */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Servicios seleccionados
                  </h3>

                  <div className="rounded-xl border border-border/80 overflow-hidden">
                    <Table className="w-full border-spacing-0">
                      <TableHeader>
                        <TableRow className="border-b border-border/80 bg-muted/30">
                          <TableHead className="text-[11px] font-bold text-muted-foreground uppercase py-3 px-4 text-left">
                            FUENTE
                          </TableHead>
                          <TableHead className="text-[11px] font-bold text-muted-foreground uppercase py-3 px-4 text-left">
                            SERVICIO / DATO
                          </TableHead>
                          <TableHead className="text-[11px] font-bold text-muted-foreground uppercase py-3 px-4 text-left">
                            UNIDAD DE COBRO
                          </TableHead>
                          <TableHead className="text-[11px] font-bold text-muted-foreground uppercase py-3 px-4 text-left">
                            CANTIDAD
                          </TableHead>
                          <TableHead className="text-[11px] font-bold text-muted-foreground uppercase py-3 px-4 text-left">
                            TARIFA (USD)
                          </TableHead>
                          <TableHead className="text-[11px] font-bold text-muted-foreground uppercase py-3 px-4 text-left">
                            SUBTOTAL (USD)
                          </TableHead>
                          <TableHead className="text-[11px] font-bold text-muted-foreground uppercase py-3 px-4 text-center">
                            ACCIONES
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {itemsCalculados.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-xs text-muted-foreground">
                              No has agregado servicios para cotizar. Usa el formulario de arriba.
                            </TableCell>
                          </TableRow>
                        ) : (
                          itemsCalculados.map((item) => (
                            <TableRow key={item.id} className="border-b border-border/40 hover:bg-muted/10">
                              <TableCell className="py-3.5 px-4 text-xs font-semibold text-foreground">
                                {item.fuente}
                              </TableCell>
                              <TableCell className="py-3.5 px-4 text-xs text-foreground">
                                {item.servicio}
                              </TableCell>
                              <TableCell className="py-3.5 px-4 text-xs text-muted-foreground">
                                {item.unidad}
                              </TableCell>
                              <TableCell className="py-3.5 px-4 text-xs font-mono text-foreground">
                                {item.cantidad.toLocaleString("es-EC")}
                              </TableCell>
                              <TableCell className="py-3.5 px-4 text-xs font-mono text-foreground">
                                {item.tarifa.toFixed(2).replace(".", ",")}
                              </TableCell>
                              <TableCell className="py-3.5 px-4 text-xs font-mono font-bold text-foreground">
                                {item.subtotal.toFixed(2).replace(".", ",")}
                              </TableCell>
                              <TableCell className="py-3.5 px-4 text-center">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon-sm"
                                      onClick={() => handleRemoveCalculado(item.id)}
                                      className="size-7 text-muted-foreground hover:text-foreground hover:bg-foreground/10"
                                      aria-label="Eliminar servicio"
                                    >
                                      <Trash2 className="size-3.5" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Eliminar servicio</TooltipContent>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          ))
                        )}

                        {/* Fila Total */}
                        {itemsCalculados.length > 0 && (
                          <TableRow className="bg-muted/20 font-bold">
                            <TableCell colSpan={5} className="py-4 px-4 text-right text-xs text-foreground font-bold">
                              Total estimado (USD)
                            </TableCell>
                            <TableCell className="py-4 px-4 text-xs font-mono font-extrabold text-foreground text-left">
                              {totalCalculado.toFixed(2).replace(".", ",")}
                            </TableCell>
                            <TableCell />
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-2 border-t border-border/80 flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleLimpiarCalculadora}
                  disabled={itemsCalculados.length === 0}
                  className="h-10 px-4 text-xs font-semibold gap-1.5 border-border"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Limpiar</span>
                </Button>

                <Button
                  type="button"
                  variant="primary"
                  onClick={handleGenerarCotizacion}
                  disabled={itemsCalculados.length === 0}
                  className="h-10 px-6 text-xs font-semibold gap-2 shadow-xs"
                >
                  <FileText className="size-4" />
                  <span>Generar cotización</span>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* TAB 3: MIS COTIZACIONES                                           */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <TabsContent value="mis-cotizaciones" className="space-y-6">
            <div className="space-y-1">
              <h2 className="font-heading font-bold text-lg text-foreground">
                3. Mis cotizaciones
              </h2>
              <p className="text-xs text-muted-foreground">
                Revisa el historial de cotizaciones generadas y solicita su aprobación formal.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-xs">
              <Table className="w-full border-spacing-0">
                <TableHeader>
                  <TableRow className="border-b border-border/80 bg-muted/30">
                    <TableHead className="text-[11px] font-bold text-muted-foreground uppercase py-3.5 px-6 text-left">
                      CÓDIGO
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-muted-foreground uppercase py-3.5 px-6 text-left">
                      PROYECTO / SOLICITUD
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-muted-foreground uppercase py-3.5 px-6 text-left">
                      FECHA
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-muted-foreground uppercase py-3.5 px-6 text-left">
                      TOTAL
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-muted-foreground uppercase py-3.5 px-6 text-left">
                      ESTADO
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-muted-foreground uppercase py-3.5 px-6 text-right">
                      ACCIONES
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {misCotizaciones.map((cot) => (
                    <TableRow key={cot.codigo} className="border-b border-border/40 hover:bg-muted/10">
                      <TableCell className="py-4 px-6 text-xs font-mono font-bold text-foreground whitespace-nowrap">
                        {cot.codigo}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-xs font-semibold text-foreground">
                        {cot.proyecto}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-xs text-muted-foreground whitespace-nowrap">
                        {cot.fecha}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-xs font-mono font-bold text-foreground whitespace-nowrap">
                        ${cot.total.toFixed(2)}
                      </TableCell>
                      <TableCell className="py-4 px-6 whitespace-nowrap">
                        <Badge
                          tone="neutral"
                          appearance="soft"
                          size="sm"
                          className="text-xs font-medium"
                        >
                          {cot.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedCotizacionDetalle(cot)}
                            className="h-8 px-3 rounded-lg text-xs font-semibold gap-1 border-border"
                          >
                            <Eye className="size-3.5" />
                            <span>Ver detalle</span>
                          </Button>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            title="Descargar PDF"
                            className="text-muted-foreground hover:text-foreground size-8"
                          >
                            <Download className="size-3.5" />
                          </Button>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setActiveTab("calcular")}
                            title="Volver a calcular"
                            className="text-muted-foreground hover:text-foreground size-8"
                          >
                            <RefreshCw className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <p className="text-xs text-muted-foreground font-medium">
                Mostrando 1 a {misCotizaciones.length} de {misCotizaciones.length} cotizaciones
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
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </TabsContent>
        </Tabs>

        {/* Modal de Éxito al Generar Cotización */}
        <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
          <DialogContent variant="standard" className="max-w-[440px] rounded-3xl p-6 sm:p-8 bg-background border-border shadow-2xl text-center">
            <div className="size-14 rounded-2xl bg-muted/60 border border-border flex items-center justify-center text-foreground mb-3 mx-auto">
              <CheckCircle2 className="size-7 stroke-[2]" />
            </div>
            <DialogHeader className="text-center space-y-2">
              <DialogTitle className="font-heading font-bold text-xl sm:text-2xl text-foreground">
                Cotización Generada
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Se ha generado con éxito la cotización estimada por un total de <strong>${totalCalculado.toFixed(2)}</strong>.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-4 flex w-full">
              <Button
                type="button"
                variant="primary"
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  setActiveTab("mis-cotizaciones");
                }}
                className="w-full h-11 text-xs font-semibold"
              >
                Ir a Mis cotizaciones
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal Detalle de Cotización */}
        <Dialog
          open={!!selectedCotizacionDetalle}
          onOpenChange={(open) => !open && setSelectedCotizacionDetalle(null)}
        >
          <DialogContent variant="standard" className="max-w-md rounded-3xl p-6 sm:p-8 bg-background border-border shadow-2xl">
            <DialogHeader className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-muted text-foreground">
                  {selectedCotizacionDetalle?.codigo}
                </span>
                <Badge
                  tone="neutral"
                  appearance="soft"
                  size="sm"
                >
                  {selectedCotizacionDetalle?.estado}
                </Badge>
              </div>
              <DialogTitle className="font-heading font-bold text-lg text-foreground">
                {selectedCotizacionDetalle?.proyecto}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Generada el {selectedCotizacionDetalle?.fecha}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3 text-xs border-y border-border/80 my-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Entidad solicitante:</span>
                <span className="font-semibold text-foreground">Ministerio de Gobierno</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Moneda:</span>
                <span className="font-semibold text-foreground">Dólares Americanos (USD)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total estimado:</span>
                <span className="font-mono font-bold text-foreground text-sm">
                  ${selectedCotizacionDetalle?.total.toFixed(2)}
                </span>
              </div>
            </div>

            <DialogFooter className="flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedCotizacionDetalle(null)}
                className="h-10 rounded-xl text-xs font-semibold"
              >
                Cerrar
              </Button>

              <Button
                type="button"
                variant="primary"
                onClick={() => setSelectedCotizacionDetalle(null)}
                className="h-10 px-4 rounded-xl text-xs font-semibold gap-1.5"
              >
                <Download className="size-3.5" />
                <span>Descargar PDF</span>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </WireframeDashboardLayout>
  );
}

