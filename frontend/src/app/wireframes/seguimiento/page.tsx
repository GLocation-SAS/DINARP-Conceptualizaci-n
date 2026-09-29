"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronDown,
  RotateCcw,
  Calendar as CalendarIcon,
  Clock,
  Eye,
  Filter,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search as SearchBar } from "@/components/ui/search";
import {
  Card,
  CardContent,
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
import { WireframeDashboardLayout } from "../components/wireframe-dashboard-layout";

interface SeguimientoRow {
  codigo: string;
  proyecto: string;
  institucion: string;
  fuente: string;
  estado: "En revisión" | "Aprobada" | "En implementación" | "Requiere ajustes" | "Borrador";
  responsable: string;
  ultimaActualizacion: string;
  href: string;
}

const SEGUIMIENTO_DATA: SeguimientoRow[] = [
  {
    codigo: "SOL-2026-001",
    proyecto: "Proyecto Identidad Digital",
    institucion: "Ministerio de Gobierno",
    fuente: "Registro Civil",
    estado: "En revisión",
    responsable: "María López",
    ultimaActualizacion: "16 sep 2026 10:32",
    href: "/wireframes/seguimiento/SOL-2026-001",
  },
  {
    codigo: "SOL-2026-002",
    proyecto: "Consulta de títulos",
    institucion: "Ministerio de Educación",
    fuente: "SENESCYT",
    estado: "Aprobada",
    responsable: "Carlos Núñez",
    ultimaActualizacion: "14 sep 2026 15:20",
    href: "/wireframes/seguimiento/SOL-2026-001",
  },
  {
    codigo: "SOL-2026-003",
    proyecto: "Validación RUC",
    institucion: "Municipio de Quito",
    fuente: "SRI",
    estado: "En implementación",
    responsable: "Ana Torres",
    ultimaActualizacion: "12 sep 2026 09:15",
    href: "/wireframes/seguimiento/SOL-2026-001",
  },
  {
    codigo: "SOL-2026-004",
    proyecto: "Datos de vehículos",
    institucion: "Agencia de Tránsito",
    fuente: "ANT",
    estado: "Requiere ajustes",
    responsable: "Luis Molina",
    ultimaActualizacion: "10 sep 2026 16:45",
    href: "/wireframes/seguimiento/SOL-2026-001",
  },
  {
    codigo: "SOL-2026-005",
    proyecto: "Información catastral",
    institucion: "Municipio de Cuenca",
    fuente: "MIDUVI",
    estado: "Borrador",
    responsable: "Juan Pérez",
    ultimaActualizacion: "8 sep 2026 11:30",
    href: "/wireframes/seguimiento/SOL-2026-001",
  },
];

export default function WireframeListadoSeguimientoPage() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [filterInstitucion, setFilterInstitucion] = useState("Todas");
  const [filterResponsable, setFilterResponsable] = useState("Todos");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const resetFilters = () => {
    setSearchQuery("");
    setFilterEstado("Todos");
    setFilterInstitucion("Todas");
    setFilterResponsable("Todos");
    setFechaDesde("");
    setFechaHasta("");
  };

  const getBadgeVariant = (estado: SeguimientoRow["estado"]) => {
    switch (estado) {
      case "En revisión":
        return { tone: "neutral" as const, appearance: "soft" as const };
      case "Aprobada":
        return { tone: "neutral" as const, appearance: "solid" as const };
      case "En implementación":
        return { tone: "neutral" as const, appearance: "soft" as const };
      case "Requiere ajustes":
        return { tone: "neutral" as const, appearance: "outline" as const };
      case "Borrador":
      default:
        return { tone: "neutral" as const, appearance: "soft" as const };
    }
  };

  const filteredData = useMemo(() => {
    return SEGUIMIENTO_DATA.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.proyecto.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.institucion.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.fuente.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesEstado = filterEstado === "Todos" || item.estado === filterEstado;
      const matchesInstitucion = filterInstitucion === "Todas" || item.institucion === filterInstitucion;
      const matchesResponsable = filterResponsable === "Todos" || item.responsable === filterResponsable;

      return matchesSearch && matchesEstado && matchesInstitucion && matchesResponsable;
    });
  }, [searchQuery, filterEstado, filterInstitucion, filterResponsable]);

  return (
    <WireframeDashboardLayout activeMenu="seguimiento">
      <main className="relative p-4 sm:p-6 lg:p-8 w-full space-y-6 sm:space-y-8">
        {/* Background subtle effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-muted/20 to-transparent pointer-events-none -z-10 blur-3xl opacity-60" />

        {/* ── 1. Header Title & Description ── */}
        <div className="space-y-1">
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight text-foreground">
            Seguimiento y trazabilidad
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed font-normal">
            Consulta el estado y avance de las solicitudes de interoperabilidad.
          </p>
        </div>

        {/* ── 2. Buscador y Filtros ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Buscador */}
          <div className="w-full sm:max-w-md">
            <SearchBar
              placeholder="Buscar por código, proyecto o institución..."
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
                  {(filterEstado !== "Todos" || filterInstitucion !== "Todas" || filterResponsable !== "Todos") && (
                    <span className="size-2 rounded-full bg-foreground" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-xs font-bold text-foreground">
                  Filtrar por Estado
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={filterEstado} onValueChange={setFilterEstado}>
                  <DropdownMenuRadioItem value="Todos">Todos los estados</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="En revisión">En revisión</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Aprobada">Aprobada</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="En implementación">En implementación</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Requiere ajustes">Requiere ajustes</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Borrador">Borrador</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>

                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-bold text-foreground">
                  Institución Solicitante
                </DropdownMenuLabel>
                <DropdownMenuRadioGroup value={filterInstitucion} onValueChange={setFilterInstitucion}>
                  <DropdownMenuRadioItem value="Todas">Todas las instituciones</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Ministerio de Gobierno">Ministerio de Gobierno</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Ministerio de Educación">Ministerio de Educación</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Municipio de Quito">Municipio de Quito</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Agencia de Tránsito">Agencia de Tránsito</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Municipio de Cuenca">Municipio de Cuenca</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>

                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-bold text-foreground">
                  Responsable
                </DropdownMenuLabel>
                <DropdownMenuRadioGroup value={filterResponsable} onValueChange={setFilterResponsable}>
                  <DropdownMenuRadioItem value="Todos">Todos los responsables</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="María López">María López</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Carlos Núñez">Carlos Núñez</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Ana Torres">Ana Torres</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Luis Molina">Luis Molina</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Juan Pérez">Juan Pérez</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {(searchQuery || filterEstado !== "Todos" || filterInstitucion !== "Todas" || filterResponsable !== "Todos" || fechaDesde || fechaHasta) && (
              <Button
                type="button"
                variant="outline"
                onClick={resetFilters}
                className="h-11 px-3 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
                title="Restablecer filtros"
              >
                <RotateCcw className="size-3.5 mr-1" />
                <span>Limpiar</span>
              </Button>
            )}
          </div>
        </div>

        {/* ── 3. Tabla de Seguimiento ── */}
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-xs">
          <Table className="w-full border-spacing-0">
            <TableHeader>
              <TableRow className="border-b border-border/80 bg-muted/30 hover:bg-muted/30">
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                  CÓDIGO
                </TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                  PROYECTO / SOLICITUD
                </TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                  INSTITUCIÓN SOLICITANTE
                </TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                  FUENTE
                </TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                  ESTADO ACTUAL
                </TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                  RESPONSABLE ACTUAL
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
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-muted-foreground text-sm">
                    No se encontraron solicitudes con los filtros aplicados.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((row) => {
                  const badgeProps = getBadgeVariant(row.estado);
                  return (
                    <TableRow
                      key={row.codigo}
                      className="border-b border-border/40 hover:bg-muted/20 transition-colors cursor-pointer"
                      onClick={() => router.push(row.href)}
                    >
                      {/* Código */}
                      <TableCell className="py-4 px-4 text-xs font-mono font-bold text-foreground whitespace-nowrap">
                        {row.codigo}
                      </TableCell>

                      {/* Proyecto / Solicitud */}
                      <TableCell className="py-4 px-4 text-xs font-semibold text-foreground max-w-[200px]">
                        {row.proyecto}
                      </TableCell>

                      {/* Institución solicitante */}
                      <TableCell className="py-4 px-4 text-xs text-muted-foreground whitespace-nowrap">
                        {row.institucion}
                      </TableCell>

                      {/* Fuente */}
                      <TableCell className="py-4 px-4 text-xs text-muted-foreground whitespace-nowrap">
                        {row.fuente}
                      </TableCell>

                      {/* Estado actual */}
                      <TableCell className="py-4 px-4 whitespace-nowrap">
                        <Badge
                          tone={badgeProps.tone}
                          appearance={badgeProps.appearance}
                          size="sm"
                          className="font-medium gap-1.5 text-xs capitalize"
                        >
                          <span className="size-1.5 rounded-full bg-current" />
                          {row.estado}
                        </Badge>
                      </TableCell>

                      {/* Responsable actual */}
                      <TableCell className="py-4 px-4 text-xs text-foreground font-medium whitespace-nowrap">
                        {row.responsable}
                      </TableCell>

                      {/* Última actualización */}
                      <TableCell className="py-4 px-4 text-xs text-muted-foreground whitespace-nowrap">
                        {row.ultimaActualizacion}
                      </TableCell>

                      {/* Acciones */}
                      <TableCell className="py-4 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center justify-end">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => router.push(row.href)}
                                className="size-8 text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer"
                                aria-label="Ver trazabilidad"
                              >
                                <Eye className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Ver trazabilidad</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* ── 4. Paginación ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-muted-foreground">
            Mostrando 1 a {filteredData.length} de {SEGUIMIENTO_DATA.length} resultados
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
      </main>
    </WireframeDashboardLayout>
  );
}

