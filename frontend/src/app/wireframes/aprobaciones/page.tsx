"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  RotateCcw,
  Eye,
  ArrowRight,
  Filter,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Search } from "@/components/ui/search";
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
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { WireframeDashboardLayout } from "../components/wireframe-dashboard-layout";

interface SolicitudRow {
  codigo: string;
  solicitud: string;
  entidad: string;
  fuente: string;
  fecha: string;
  estado: "Pendiente" | "En revisión" | "Aprobada" | "Rechazada";
  accionLabel: "Revisar" | "Continuar" | "Ver detalle";
  tabCategory: "pendientes" | "revision" | "resueltas";
}

const SOLICITUDES_DATA: SolicitudRow[] = [
  {
    codigo: "SOL-024",
    solicitud: "Validación ciudadana",
    entidad: "Ministerio X",
    fuente: "Registro Civil",
    fecha: "15/09/26",
    estado: "Pendiente",
    accionLabel: "Revisar",
    tabCategory: "pendientes",
  },
  {
    codigo: "SOL-025",
    solicitud: "Consulta tributaria",
    entidad: "Institución Y",
    fuente: "SRI",
    fecha: "15/09/26",
    estado: "En revisión",
    accionLabel: "Continuar",
    tabCategory: "revision",
  },
  {
    codigo: "SOL-026",
    solicitud: "Estado social",
    entidad: "Ministerio Z",
    fuente: "Registro Civil",
    fecha: "14/09/26",
    estado: "Pendiente",
    accionLabel: "Revisar",
    tabCategory: "pendientes",
  },
  {
    codigo: "SOL-027",
    solicitud: "Control de beneficios",
    entidad: "Institución X",
    fuente: "SRI",
    fecha: "14/09/26",
    estado: "Pendiente",
    accionLabel: "Revisar",
    tabCategory: "pendientes",
  },
  {
    codigo: "SOL-028",
    solicitud: "Verificación de identidad",
    entidad: "Gobierno Provincial",
    fuente: "Registro Civil",
    fecha: "13/09/26",
    estado: "En revisión",
    accionLabel: "Continuar",
    tabCategory: "revision",
  },
  {
    codigo: "SOL-020",
    solicitud: "Validación de títulos docentes",
    entidad: "Ministerio de Educación",
    fuente: "DINARP",
    fecha: "10/09/26",
    estado: "Aprobada",
    accionLabel: "Ver detalle",
    tabCategory: "resueltas",
  },
  {
    codigo: "SOL-019",
    solicitud: "Cruces vehiculares perimetrales",
    entidad: "AMT Quito",
    fuente: "ANT",
    fecha: "08/09/26",
    estado: "Aprobada",
    accionLabel: "Ver detalle",
    tabCategory: "resueltas",
  },
];

export default function WireframeBandejaAprobacionesPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"pendientes" | "revision" | "resueltas">("pendientes");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [filterEntidad, setFilterEntidad] = useState("Todas");
  const [filterFuente, setFilterFuente] = useState("Todas");
  const [filterFecha, setFilterFecha] = useState("Todas");
  const [currentPage, setCurrentPage] = useState(1);

  const resetFilters = () => {
    setSearchQuery("");
    setFilterEstado("Todos");
    setFilterEntidad("Todas");
    setFilterFuente("Todas");
    setFilterFecha("Todas");
  };

  const filteredSolicitudes = useMemo(() => {
    return SOLICITUDES_DATA.filter((item) => {
      // Filtrar por tab activo
      if (item.tabCategory !== activeTab) return false;

      // Filtro de búsqueda
      const matchesSearch =
        searchQuery === "" ||
        item.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.solicitud.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.entidad.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.fuente.toLowerCase().includes(searchQuery.toLowerCase());

      // Filtros desplegables
      const matchesEstado = filterEstado === "Todos" || item.estado === filterEstado;
      const matchesEntidad = filterEntidad === "Todas" || item.entidad === filterEntidad;
      const matchesFuente = filterFuente === "Todas" || item.fuente === filterFuente;

      return matchesSearch && matchesEstado && matchesEntidad && matchesFuente;
    });
  }, [activeTab, searchQuery, filterEstado, filterEntidad, filterFuente]);

  const handleRowAction = (codigo: string) => {
    router.push(`/wireframes/aprobaciones/SOL-024`);
  };

  return (
    <WireframeDashboardLayout activeMenu="aprobaciones">
      <main className="relative p-4 sm:p-6 lg:p-8 w-full space-y-6 sm:space-y-8">
        {/* Background subtle effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-muted/20 to-transparent pointer-events-none -z-10 blur-3xl opacity-60" />

        {/* ── 1. Header Title & Description ── */}
        <div className="space-y-1">
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight text-foreground">
            Aprobaciones y permisos
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed font-normal">
            Gestiona las solicitudes de acceso a datos y permisos de consumo.
          </p>
        </div>

        {/* ── 2. Tabs: Pendientes (12), En revisión (6), Resueltas (24) ── */}
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as "pendientes" | "revision" | "resueltas")}
          className="space-y-6"
        >
          <TabsList className="bg-muted/40 p-1 rounded-xl border border-border inline-flex flex-wrap h-auto">
            <TabsTrigger value="pendientes" className="rounded-lg text-xs font-semibold px-4 py-2">
              Pendientes (12)
            </TabsTrigger>
            <TabsTrigger value="revision" className="rounded-lg text-xs font-semibold px-4 py-2">
              En revisión (6)
            </TabsTrigger>
            <TabsTrigger value="resueltas" className="rounded-lg text-xs font-semibold px-4 py-2">
              Resueltas (24)
            </TabsTrigger>
          </TabsList>

          {/* ── 3. Filtros de Búsqueda y Selectores UI Kit ── */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
            {/* Buscador UI Kit */}
            <div className="flex-1 min-w-[220px]">
              <Search
                placeholder="Buscar solicitudes por código, nombre o entidad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery("")}
                className="bg-surface rounded-xl border-border/80"
              />
            </div>

            {/* Selectores Dropdown */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
              {/* Filtro Estado */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-11 px-3.5 flex items-center justify-between gap-2 bg-surface border-border/80 text-xs min-w-[130px]"
                  >
                    <span className="text-muted-foreground font-normal">Estado:</span>
                    <span className="font-semibold text-foreground truncate">{filterEstado}</span>
                    <ChevronDown className="size-3.5 text-muted-foreground shrink-0 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-xl">
                  <DropdownMenuLabel className="text-xs">Estado</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={filterEstado} onValueChange={setFilterEstado}>
                    <DropdownMenuRadioItem value="Todos">Todos</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Pendiente">Pendiente</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="En revisión">En revisión</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Aprobada">Aprobada</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Rechazada">Rechazada</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Filtro Entidad */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-11 px-3.5 flex items-center justify-between gap-2 bg-surface border-border/80 text-xs min-w-[140px]"
                  >
                    <span className="text-muted-foreground font-normal">Entidad:</span>
                    <span className="font-semibold text-foreground truncate">{filterEntidad}</span>
                    <ChevronDown className="size-3.5 text-muted-foreground shrink-0 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 rounded-xl">
                  <DropdownMenuLabel className="text-xs">Entidad solicitante</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={filterEntidad} onValueChange={setFilterEntidad}>
                    <DropdownMenuRadioItem value="Todas">Todas</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Ministerio X">Ministerio X</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Institución Y">Institución Y</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Ministerio Z">Ministerio Z</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Institución X">Institución X</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Gobierno Provincial">Gobierno Provincial</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Filtro Fuente */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-11 px-3.5 flex items-center justify-between gap-2 bg-surface border-border/80 text-xs min-w-[140px]"
                  >
                    <span className="text-muted-foreground font-normal">Fuente:</span>
                    <span className="font-semibold text-foreground truncate">{filterFuente}</span>
                    <ChevronDown className="size-3.5 text-muted-foreground shrink-0 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 rounded-xl">
                  <DropdownMenuLabel className="text-xs">Fuente de datos</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={filterFuente} onValueChange={setFilterFuente}>
                    <DropdownMenuRadioItem value="Todas">Todas</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Registro Civil">Registro Civil</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Policía Nacional">Policía Nacional</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="SRI">SRI</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="ANT">ANT</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="DINARP">DINARP</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Botón Reset */}
              {(filterEstado !== "Todos" || filterEntidad !== "Todas" || filterFuente !== "Todas" || searchQuery !== "") && (
                <Button
                  variant="ghost"
                  onClick={resetFilters}
                  className="h-11 px-3 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 shrink-0"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Limpiar</span>
                </Button>
              )}
            </div>
          </div>

          {/* ── 5. Tabla de Solicitudes ── */}
          <TabsContent value={activeTab} className="mt-0 space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    CÓDIGO
                  </TableHead>
                  <TableHead>
                    SOLICITUD / PROYECTO
                  </TableHead>
                  <TableHead>
                    ENTIDAD
                  </TableHead>
                  <TableHead>
                    FUENTE
                  </TableHead>
                  <TableHead>
                    FECHA
                  </TableHead>
                  <TableHead>
                    ESTADO
                  </TableHead>
                  <TableHead className="text-right">
                    ACCIÓN
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSolicitudes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground text-sm">
                      No hay solicitudes en esta sección con los filtros aplicados.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSolicitudes.map((row) => (
                    <TableRow
                      key={row.codigo}
                      className="cursor-pointer"
                      onClick={() => handleRowAction(row.codigo)}
                    >
                      {/* Código */}
                      <TableCell className="font-mono font-bold text-foreground">
                        {row.codigo}
                      </TableCell>

                      {/* Solicitud / Proyecto */}
                      <TableCell className="font-semibold text-foreground">
                        {row.solicitud}
                      </TableCell>

                      {/* Entidad */}
                      <TableCell className="text-muted-foreground font-medium">
                        {row.entidad}
                      </TableCell>

                      {/* Fuente */}
                      <TableCell className="text-muted-foreground font-medium">
                        {row.fuente}
                      </TableCell>

                      {/* Fecha */}
                      <TableCell className="text-muted-foreground font-medium">
                        {row.fecha}
                      </TableCell>

                      {/* Estado */}
                      <TableCell>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground">
                          <span className={cn(
                            "size-1.5 rounded-full shrink-0",
                            row.estado === "Aprobada" && "bg-foreground",
                            (row.estado === "En revisión" || row.estado === "Pendiente") && "bg-foreground",
                            row.estado === "Rechazada" && "bg-foreground"
                          )} />
                          {row.estado}
                        </span>
                      </TableCell>

                      {/* Acción */}
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center justify-end">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                aria-label={row.accionLabel}
                                onClick={() => handleRowAction(row.codigo)}
                                className="size-8 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                              >
                                {row.accionLabel === "Revisar" ? <Eye className="size-4" /> : <ArrowRight className="size-4" />}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>{row.accionLabel}</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* ── 6. Paginación ── */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <p className="text-xs text-muted-foreground font-medium">
                Mostrando 1 a {filteredSolicitudes.length} de 12 resultados
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
                    <PaginationLink
                      href="#"
                      isActive={currentPage === 1}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(1);
                      }}
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === 2}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(2);
                      }}
                    >
                      2
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === 3}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(3);
                      }}
                    >
                      3
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < 3) setCurrentPage((p) => p + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </WireframeDashboardLayout>
  );
}
