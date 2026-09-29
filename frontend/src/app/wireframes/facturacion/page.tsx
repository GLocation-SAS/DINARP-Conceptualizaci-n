"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Calendar as CalendarIcon,
  Filter,
  Eye,
  Download,
  Ban,
  FileText,
  RotateCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Search } from "@/components/ui/search";
import {
  InputGroup,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
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
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
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
} from "@/components/ui/pagination";
import { toast } from "sonner";
import { WireframeDashboardLayout } from "../components/wireframe-dashboard-layout";

interface FacturaItem {
  numero: string;
  proyecto: string;
  entidad: string;
  servicio: string;
  fechaEmision: string;
  valor: number;
  estado: "Emitida" | "Pendiente" | "Anulada";
  href: string;
}

const INITIAL_FACTURAS_DATA: FacturaItem[] = [
  {
    numero: "F-2026-00125",
    proyecto: "Validación ciudadana",
    entidad: "Registro Civil",
    servicio: "Consulta de datos de identidad",
    fechaEmision: "15/09/2026",
    valor: 1250.0,
    estado: "Emitida",
    href: "/wireframes/facturacion/F-2026-00125",
  },
  {
    numero: "F-2026-00124",
    proyecto: "Cruce de datos tributarios",
    entidad: "SRI",
    servicio: "Consulta de RUC",
    fechaEmision: "10/09/2026",
    valor: 850.0,
    estado: "Pendiente",
    href: "/wireframes/facturacion/F-2026-00125",
  },
  {
    numero: "F-2026-00123",
    proyecto: "Verificación de títulos",
    entidad: "SENESCYT",
    servicio: "Consulta de títulos registrados",
    fechaEmision: "01/09/2026",
    valor: 620.0,
    estado: "Emitida",
    href: "/wireframes/facturacion/F-2026-00125",
  },
  {
    numero: "F-2026-00122",
    proyecto: "Validación de vehículos",
    entidad: "ANT",
    servicio: "Consulta de licencias y vehículos",
    fechaEmision: "25/08/2026",
    valor: 450.0,
    estado: "Anulada",
    href: "/wireframes/facturacion/F-2026-00125",
  },
  {
    numero: "F-2026-00121",
    proyecto: "Catastro Nacional",
    entidad: "Ministerio de Desarrollo Urbano",
    servicio: "Consulta de catastros",
    fechaEmision: "20/08/2026",
    valor: 1100.0,
    estado: "Emitida",
    href: "/wireframes/facturacion/F-2026-00125",
  },
];

export default function WireframeListadoFacturacionPage() {
  const router = useRouter();

  const [facturasList, setFacturasList] = useState<FacturaItem[]>(INITIAL_FACTURAS_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleDownloadPDF = (numero: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    toast.success(`Descargando factura ${numero}.pdf...`);
  };

  const handleAnularFactura = (numero: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFacturasList((prev) =>
      prev.map((f) => (f.numero === numero ? { ...f, estado: "Anulada" } : f))
    );
    toast.warning(`Factura ${numero} ha sido marcada como Anulada.`);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setFilterEstado("Todos");
    setFechaDesde("");
    setFechaHasta("");
    toast.info("Filtros restablecidos.");
  };

  const filteredData = useMemo(() => {
    return facturasList.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.numero.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.proyecto.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.entidad.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.servicio.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesEstado = filterEstado === "Todos" || item.estado === filterEstado;

      return matchesSearch && matchesEstado;
    });
  }, [facturasList, searchQuery, filterEstado]);

  const getBadgeVariant = (estado: FacturaItem["estado"]) => {
    switch (estado) {
      case "Emitida":
        return { tone: "neutral" as const, appearance: "soft" as const };
      case "Pendiente":
        return { tone: "neutral" as const, appearance: "outline" as const };
      case "Anulada":
      default:
        return { tone: "neutral" as const, appearance: "soft" as const };
    }
  };

  return (
    <WireframeDashboardLayout activeMenu="facturacion">
      <main className="relative p-4 sm:p-6 lg:p-8 w-full space-y-6 sm:space-y-8">
        {/* Background subtle effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-muted/20 to-transparent pointer-events-none -z-10 blur-3xl opacity-60" />

        {/* ── 0. Miga de pan ── */}
        <Breadcrumb className="mb-2">
          <BreadcrumbList className="text-xs">
            <BreadcrumbItem>
              <BreadcrumbLink href="/wireframes/dashboard">Inicio</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/wireframes/solicitudes">Bandeja de solicitudes</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-foreground">Facturación</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* ── 1. Header Title & Description ── */}
        <div className="space-y-1">
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight text-foreground">
            Facturación
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed font-normal">
            Consulta y gestiona las facturas asociadas a tus servicios de interoperabilidad.
          </p>
        </div>

        {/* ── 2. Buscador y Filtros ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Input de Búsqueda */}
          <div className="w-full sm:max-w-md">
            <Search
              placeholder="Buscar por número, proyecto, servicio o entidad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery("")}
              className="bg-surface rounded-xl border-border/80"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {/* Botón Filtros Desplegable */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-11 px-4 text-xs font-semibold gap-2 border-border/80 bg-surface w-full sm:w-auto cursor-pointer"
                >
                  <Filter className="size-3.5 text-muted-foreground" />
                  <span>Filtros</span>
                  {filterEstado !== "Todos" && (
                    <span className="size-2 rounded-full bg-foreground" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="text-xs font-bold text-foreground">
                  Filtrar por Estado
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={filterEstado} onValueChange={setFilterEstado}>
                  <DropdownMenuRadioItem value="Todos">Todos los estados</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Emitida">Emitida</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Pendiente">Pendiente</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Anulada">Anulada</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {(searchQuery || filterEstado !== "Todos") && (
              <Button
                type="button"
                variant="outline"
                onClick={handleResetFilters}
                className="h-11 px-3 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
                title="Restablecer filtros"
              >
                <RotateCcw className="size-3.5 mr-1" />
                <span>Limpiar</span>
              </Button>
            )}
          </div>
        </div>

        {/* ── 3. Tabla de Facturas ── */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                N° DE FACTURA
              </TableHead>
              <TableHead>
                PROYECTO / SOLICITUD
              </TableHead>
              <TableHead>
                ENTIDAD
              </TableHead>
              <TableHead>
                SERVICIO
              </TableHead>
              <TableHead>
                FECHA DE EMISIÓN
              </TableHead>
              <TableHead>
                VALOR (USD)
              </TableHead>
              <TableHead>
                ESTADO
              </TableHead>
              <TableHead className="text-right">
                ACCIONES
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-muted-foreground text-sm">
                  No se encontraron facturas con los criterios seleccionados.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row) => {
                const badgeProps = getBadgeVariant(row.estado);

                return (
                  <TableRow
                    key={row.numero}
                    onClick={() => router.push(row.href)}
                    className="cursor-pointer group hover:bg-muted/40 transition-colors"
                  >
                    {/* N° de factura */}
                    <TableCell className="font-mono font-bold text-foreground group-hover:text-primary transition-colors">
                      {row.numero}
                    </TableCell>

                    {/* Proyecto / Solicitud */}
                    <TableCell className="font-semibold text-foreground">
                      {row.proyecto}
                    </TableCell>

                    {/* Entidad */}
                    <TableCell className="text-muted-foreground">
                      {row.entidad}
                    </TableCell>

                    {/* Servicio */}
                    <TableCell className="text-muted-foreground font-medium">
                      {row.servicio}
                    </TableCell>

                    {/* Fecha de emisión */}
                    <TableCell className="text-muted-foreground font-mono">
                      {row.fechaEmision}
                    </TableCell>

                    {/* Valor (USD) */}
                    <TableCell className="font-mono font-bold text-foreground">
                      {row.valor.toLocaleString("es-EC", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>

                    {/* Estado */}
                    <TableCell>
                      <Badge
                        tone={badgeProps.tone}
                        appearance={badgeProps.appearance}
                        size="sm"
                        className="font-medium text-xs"
                      >
                        {row.estado}
                      </Badge>
                    </TableCell>

                    {/* Acciones */}
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => router.push(row.href)}
                              className="size-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer"
                              aria-label="Ver detalle"
                            >
                              <Eye className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Ver detalle</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              onClick={(e) => handleDownloadPDF(row.numero, e)}
                              className="size-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer"
                              aria-label="Descargar PDF"
                            >
                              <Download className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Descargar PDF</TooltipContent>
                        </Tooltip>

                        {row.estado !== "Anulada" && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                onClick={(e) => handleAnularFactura(row.numero, e)}
                                className="size-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer"
                                aria-label="Anular factura"
                              >
                                <Ban className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Anular factura</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* ── 4. Paginación ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <p className="text-xs text-muted-foreground font-medium">
            Mostrando 1 a {filteredData.length} de {facturasList.length} facturas
          </p>

          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent className="gap-1.5">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage((p) => p - 1);
                  }}
                />
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
                <PaginationLink href="#">
                  4
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </main >
    </WireframeDashboardLayout >
  );
}

