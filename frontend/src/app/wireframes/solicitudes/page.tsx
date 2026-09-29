"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Filter,
  Info,
  Layers,
  ChevronDown,
  Eye,
  Pencil,
  Trash2,
  ArrowRight,
  RotateCcw,
  Building2,
  FileText,
  Clock,
  History,
  MessageSquare,
  MoreVertical,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { WireframeDashboardLayout } from "../components/wireframe-dashboard-layout";
import {
  getStoredProjects,
  saveStoredProject,
  deleteStoredProject,
  clearProjects,
  type ProyectoInteroperabilidad,
} from "./proyectos-store";

export default function WireframeSolicitudesPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProyectoInteroperabilidad[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Filtros reactivos
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEstado, setSelectedEstado] = useState("Todos");
  const [selectedEntidad, setSelectedEntidad] = useState("Todas");

  // Estado para modal de confirmación de eliminación de borrador
  const [projectToDelete, setProjectToDelete] = useState<ProyectoInteroperabilidad | null>(null);

  // Cargar proyectos desde el almacenamiento local
  useEffect(() => {
    const loaded = getStoredProjects();
    setProjects(loaded);
    setIsLoaded(true);
  }, []);

  const handleConfirmDelete = () => {
    if (!projectToDelete) return;
    deleteStoredProject(projectToDelete.id);
    setProjects((prev) =>
      prev.filter((p) => p.id !== projectToDelete.id && p.codigo !== projectToDelete.codigo)
    );
    toast.success(`Borrador "${projectToDelete.codigo}" eliminado`);
    setProjectToDelete(null);
  };

  // Lista de entidades únicas para el filtro
  const uniqueEntities = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.entidadSolicitante) set.add(p.entidadSolicitante);
    });
    return Array.from(set);
  }, [projects]);

  // Filtrado de proyectos
  const filteredProjects = useMemo(() => {
    return projects.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.codigo.toLowerCase().includes(q) ||
        item.nombre.toLowerCase().includes(q) ||
        item.entidadSolicitante.toLowerCase().includes(q);

      const matchesEstado =
        selectedEstado === "Todos" || item.estado === selectedEstado;

      const matchesEntidad =
        selectedEntidad === "Todas" || item.entidadSolicitante === selectedEntidad;

      return matchesSearch && matchesEstado && matchesEntidad;
    });
  }, [projects, searchQuery, selectedEstado, selectedEntidad]);

  // Helper para renderizar badge de estado
  const renderEstadoBadge = (estado: ProyectoInteroperabilidad["estado"]) => {
    switch (estado) {
      case "Borrador":
        return (
          <Badge appearance="outline" tone="neutral" className="border-border bg-muted/50 text-muted-foreground font-medium text-xs">
            Borrador
          </Badge>
        );
      case "En revisión":
        return (
          <Badge appearance="outline" tone="neutral" className="border-foreground/30 bg-muted/80 text-foreground font-semibold text-xs">
            En revisión
          </Badge>
        );
      case "Observada":
        return (
          <Badge appearance="outline" tone="neutral" className="border-border bg-muted/30 text-foreground font-medium text-xs">
            Observada
          </Badge>
        );
      case "Autorizada":
        return (
          <Badge appearance="outline" tone="neutral" className="border-foreground/40 bg-foreground/10 text-foreground font-bold text-xs">
            Autorizada
          </Badge>
        );
      case "Servicio habilitado":
        return (
          <Badge appearance="solid" tone="neutral" className="font-bold text-xs bg-foreground text-background">
            Servicio habilitado
          </Badge>
        );
      default:
        return (
          <Badge appearance="outline" tone="neutral" className="text-xs">
            {estado}
          </Badge>
        );
    }
  };

  // Helper para resumir fuentes solicitadas (máximo 2 visibles + tooltip con el resto)
  const renderFuentesResumen = (fuentes: ProyectoInteroperabilidad["fuentes"]) => {
    if (!fuentes || fuentes.length === 0) {
      return <span className="text-xs text-muted-foreground italic">Sin fuentes</span>;
    }

    const nombres = fuentes.map((f) => {
      if (f.institucionId === "digercic") return "Registro Civil";
      if (f.institucionId === "sri") return "SRI";
      if (f.institucionId === "ant") return "ANT";
      if (f.institucionId === "iess") return "IESS";
      return f.institucionNombre.split("(")[0].trim();
    });

    const visibles = nombres.slice(0, 2);
    const extras = nombres.slice(2);

    return (
      <div className="flex flex-wrap items-center gap-1.5">
        {visibles.map((s, idx) => (
          <Badge
            key={idx}
            appearance="outline"
            tone="neutral"
            className="border-border bg-background text-[11px] font-medium py-0 px-2"
          >
            {s}
          </Badge>
        ))}

        {extras.length > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                appearance="outline"
                tone="neutral"
                className="border-border bg-muted/60 text-[11px] font-semibold py-0 px-1.5 cursor-help hover:bg-muted"
              >
                +{extras.length} más
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="text-xs max-w-xs space-y-1">
              <p className="font-semibold text-muted-foreground mb-1">Fuentes adicionales ({extras.length}):</p>
              {extras.map((extra, i) => (
                <p key={i}>• {extra}</p>
              ))}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    );
  };

  // Helper para fecha breve
  const formatFechaBreve = (fechaStr: string) => {
    if (!fechaStr) return "-";
    if (fechaStr.toLowerCase().includes("hoy")) return "Hoy";
    return fechaStr.split(",")[0].trim();
  };

  // Acción de reset para el taller (opcional)
  const handleResetForDemo = () => {
    clearProjects();
    setProjects([]);
    toast.info("Demostración reiniciada a cero proyectos");
  };

  return (
    <WireframeDashboardLayout activeMenu="solicitudes">
      <main className="relative p-4 sm:p-6 lg:p-8 w-full space-y-6 sm:space-y-8">
        {/* Background subtle effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-muted/20 to-transparent pointer-events-none -z-10 blur-3xl opacity-60" />

        {/* ── 1. Encabezado Principal del Módulo ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight text-foreground">
              Proyectos de interoperabilidad
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed font-normal">
              Crea proyectos para solicitar información de otras instituciones y consulta el avance de cada trámite.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {projects.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetForDemo}
                title="Reiniciar a cero proyectos para taller"
                className="h-11 px-3 text-xs text-muted-foreground hover:text-foreground gap-1.5 border-border/80 bg-surface"
              >
                <RotateCcw className="size-3.5" />
                <span>Reiniciar demo</span>
              </Button>
            )}

            <Button
              asChild
              className="h-11 px-5 text-xs font-semibold gap-2 shadow-xs shrink-0"
            >
              <Link href="/wireframes/solicitudes/nueva">
                <Plus className="size-4" />
                <span>Crear proyecto</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* ── 2. Contenido Principal ── */}
        {!isLoaded ? (
          <div className="py-20 text-center text-sm text-muted-foreground">
            Cargando módulo de proyectos...
          </div>
        ) : projects.length === 0 ? (
          /* ══════════════════════════════════════════════════════════
             ESTADO VACÍO: PRIMERA VISITA (0 PROYECTOS)
             ══════════════════════════════════════════════════════════ */
          <div className="py-16 sm:py-24 flex flex-col items-center justify-center text-center max-w-xl mx-auto px-4">
            <div className="size-16 rounded-3xl bg-muted/60 border border-border flex items-center justify-center text-foreground mb-6 shadow-xs">
              <Layers className="size-8 stroke-[1.5]" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Aquí verás tus proyectos
            </h2>

            <p className="text-sm text-muted-foreground mt-2 mb-8 leading-relaxed">
              Crea un proyecto para indicar qué información necesitas, de qué instituciones proviene y consultar el avance de tu solicitud.
            </p>

            <Button
              asChild
              size="lg"
              className="gap-2 px-6 font-semibold shadow-sm h-12"
            >
              <Link href="/wireframes/solicitudes/nueva">
                <Plus className="size-4" />
                <span>Crear mi primer proyecto</span>
              </Link>
            </Button>

            <p className="text-[11px] text-muted-foreground mt-6 bg-muted/30 py-1.5 px-3 rounded-full border border-border/60">
              Propuesta de flujo para validación en el taller DINARP
            </p>
          </div>
        ) : (
          /* ══════════════════════════════════════════════════════════
             VISTA CON PROYECTOS: BUSCADOR, FILTROS Y TABLA COMPACTA (5 COLUMNAS)
             ══════════════════════════════════════════════════════════ */
          <div className="space-y-6">
            {/* Barra de Filtros Compacta */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Buscador */}
              <div className="w-full sm:max-w-md">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por código, proyecto o entidad…"
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-border/80 bg-surface text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
              </div>

              {/* Filtros por Estado y Entidad */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-11 px-3.5 flex items-center justify-between gap-2 bg-surface border-border/80 text-xs min-w-[130px]"
                    >
                      <span className="text-muted-foreground font-normal">Estado:</span>
                      <span className="font-semibold text-foreground truncate">{selectedEstado}</span>
                      <ChevronDown className="size-3.5 text-muted-foreground shrink-0 opacity-70" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl">
                    <DropdownMenuLabel className="text-xs">Filtrar por estado</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={selectedEstado} onValueChange={setSelectedEstado}>
                      <DropdownMenuRadioItem value="Todos">Todos</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Borrador">Borrador</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="En revisión">En revisión</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Observada">Observada</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Autorizada">Autorizada</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Servicio habilitado">Servicio habilitado</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                {uniqueEntities.length > 1 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-11 px-3.5 flex items-center justify-between gap-2 bg-surface border-border/80 text-xs min-w-[140px]"
                      >
                        <span className="text-muted-foreground font-normal">Entidad:</span>
                        <span className="font-semibold text-foreground truncate">{selectedEntidad === "Todas" ? "Todas" : "Filtrada"}</span>
                        <ChevronDown className="size-3.5 text-muted-foreground shrink-0 opacity-70" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-xl">
                      <DropdownMenuLabel className="text-xs">Filtrar por entidad</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup value={selectedEntidad} onValueChange={setSelectedEntidad}>
                        <DropdownMenuRadioItem value="Todas">Todas</DropdownMenuRadioItem>
                        {uniqueEntities.map((ent) => (
                          <DropdownMenuRadioItem key={ent} value={ent} className="text-xs truncate">
                            {ent}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>

            {/* ── Tabla Compacta (5 Columnas) ── */}
            <Table>
              <TableHeader>
                <TableRow>
                  {/* 1. Proyecto (Nombre + Código en 2 líneas) */}
                  <TableHead className="min-w-[280px]">
                    PROYECTO
                  </TableHead>

                  {/* 2. Fuentes solicitadas (con icono info) */}
                  <TableHead className="min-w-[220px]">
                    <div className="flex items-center gap-1.5">
                      <span>FUENTES SOLICITADAS</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex text-inherit opacity-70 hover:opacity-100 focus:outline-none"
                            aria-label="Información sobre Fuentes solicitadas"
                          >
                            <Info className="size-3.5" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs text-xs">
                          Instituciones que proveen los datos solicitados en este proyecto.
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableHead>

                  {/* 3. Estado (con icono info) */}
                  <TableHead className="w-[160px]">
                    <div className="flex items-center gap-1.5">
                      <span>ESTADO</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex text-inherit opacity-70 hover:opacity-100 focus:outline-none"
                            aria-label="Información sobre Estado"
                          >
                            <Info className="size-3.5" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs text-xs">
                          Etapa actual de la gestión del proyecto.
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableHead>

                  {/* 4. Actualización */}
                  <TableHead className="w-[140px]">
                    ACTUALIZACIÓN
                  </TableHead>

                  {/* 5. Acciones */}
                  <TableHead className="w-[200px] text-right pr-4">
                    ACCIONES
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-xs text-muted-foreground">
                      No se encontraron proyectos con los filtros seleccionados.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProjects.map((item) => {
                    return (
                      <TableRow
                        key={item.id}
                        tabIndex={0}
                        role="button"
                        onClick={() => router.push(`/wireframes/solicitudes/detalle?id=${item.id}`)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            router.push(`/wireframes/solicitudes/detalle?id=${item.id}`);
                          }
                        }}
                        className="cursor-pointer group"
                      >
                        {/* 1. Proyecto: Nombre en línea 1, Código debajo */}
                        <TableCell>
                          <p className="font-bold text-foreground text-sm line-clamp-1 group-hover:underline">
                            {item.nombre}
                          </p>
                          <p className="font-mono text-xs text-muted-foreground mt-0.5">
                            {item.codigo}
                          </p>
                        </TableCell>

                        {/* 2. Fuentes solicitadas: hasta 2 + "+N más" tooltip */}
                        <TableCell>
                          {renderFuentesResumen(item.fuentes)}
                        </TableCell>

                        {/* 3. Estado */}
                        <TableCell>
                          {renderEstadoBadge(item.estado)}
                        </TableCell>

                        {/* 4. Actualización: fecha breve */}
                        <TableCell className="text-muted-foreground font-medium text-xs whitespace-nowrap">
                          {formatFechaBreve(item.ultimaActualizacion)}
                        </TableCell>

                        {/* 5. Acciones contextuales por estado con tooltips accesibles */}
                        <TableCell className="text-right pr-4" onClick={(e) => e.stopPropagation()}>
                          {/* ── 1. Borrador: Continuar edición (lápiz) + Menú con Ver detalle y Eliminar ── */}
                          {item.estado === "Borrador" && (
                            <div className="flex items-center justify-end gap-1.5">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    asChild
                                    className="h-8 px-2.5 text-xs font-semibold border-border/80 gap-1.5 hover:bg-muted"
                                    aria-label="Continuar edición"
                                  >
                                    <Link href={`/wireframes/solicitudes/nueva?id=${item.id}`}>
                                      <Pencil className="size-3.5" />
                                      <span className="hidden xl:inline">Continuar edición</span>
                                    </Link>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="text-xs">Continuar edición</TooltipContent>
                              </Tooltip>

                              <DropdownMenu>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="size-8 p-0 text-muted-foreground hover:text-foreground border border-transparent hover:border-border"
                                        aria-label="Más acciones"
                                      >
                                        <MoreVertical className="size-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                  </TooltipTrigger>
                                  <TooltipContent className="text-xs">Más acciones</TooltipContent>
                                </Tooltip>
                                <DropdownMenuContent align="end" className="w-44 rounded-xl">
                                  <DropdownMenuItem asChild>
                                    <Link
                                      href={`/wireframes/solicitudes/detalle?id=${item.id}`}
                                      className="flex items-center gap-2 cursor-pointer text-xs"
                                    >
                                      <Eye className="size-3.5" />
                                      <span>Ver detalle</span>
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => setProjectToDelete(item)}
                                    className="flex items-center gap-2 cursor-pointer text-xs text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="size-3.5" />
                                    <span>Eliminar borrador</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          )}

                          {/* ── 2. En revisión: Ver seguimiento (historial) + Ver detalle ── */}
                          {item.estado === "En revisión" && (
                            <div className="flex items-center justify-end gap-1.5">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    asChild
                                    className="h-8 px-2.5 text-xs font-semibold border-border/80 gap-1.5 hover:bg-muted"
                                    aria-label="Ver seguimiento"
                                  >
                                    <Link href={`/wireframes/solicitudes/detalle?id=${item.id}&tab=seguimiento`}>
                                      <History className="size-3.5" />
                                      <span className="hidden xl:inline">Ver seguimiento</span>
                                    </Link>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="text-xs">Ver seguimiento</TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    asChild
                                    className="size-8 p-0 text-muted-foreground hover:text-foreground border border-transparent hover:border-border"
                                    aria-label="Ver detalle"
                                  >
                                    <Link href={`/wireframes/solicitudes/detalle?id=${item.id}`}>
                                      <Eye className="size-4" />
                                    </Link>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="text-xs">Ver detalle</TooltipContent>
                              </Tooltip>
                            </div>
                          )}

                          {/* ── 3. Observada / Con observaciones: Responder observaciones + Más acciones ── */}
                          {item.estado === "Observada" && (
                            <div className="flex items-center justify-end gap-1.5">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    asChild
                                    className="h-8 px-2.5 text-xs font-semibold border-border/80 gap-1.5 hover:bg-muted"
                                    aria-label="Responder observaciones"
                                  >
                                    <Link href={`/wireframes/solicitudes/detalle?id=${item.id}&tab=observaciones`}>
                                      <MessageSquare className="size-3.5" />
                                      <span className="hidden xl:inline">Responder observaciones</span>
                                    </Link>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="text-xs">Responder observaciones</TooltipContent>
                              </Tooltip>

                              <DropdownMenu>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="size-8 p-0 text-muted-foreground hover:text-foreground border border-transparent hover:border-border"
                                        aria-label="Más acciones"
                                      >
                                        <MoreVertical className="size-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                  </TooltipTrigger>
                                  <TooltipContent className="text-xs">Más acciones</TooltipContent>
                                </Tooltip>
                                <DropdownMenuContent align="end" className="w-44 rounded-xl">
                                  <DropdownMenuItem asChild>
                                    <Link
                                      href={`/wireframes/solicitudes/detalle?id=${item.id}`}
                                      className="flex items-center gap-2 cursor-pointer text-xs"
                                    >
                                      <Eye className="size-3.5" />
                                      <span>Ver detalle</span>
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link
                                      href={`/wireframes/solicitudes/detalle?id=${item.id}&tab=seguimiento`}
                                      className="flex items-center gap-2 cursor-pointer text-xs"
                                    >
                                      <History className="size-3.5" />
                                      <span>Ver seguimiento</span>
                                    </Link>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          )}

                          {/* ── 4. Autorizada o Servicio habilitado: Ver detalle + Ver seguimiento ── */}
                          {item.estado !== "Borrador" && item.estado !== "En revisión" && item.estado !== "Observada" && (
                            <div className="flex items-center justify-end gap-1.5">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    asChild
                                    className="h-8 px-2.5 text-xs font-semibold border-border/80 gap-1.5 hover:bg-muted"
                                    aria-label="Ver detalle"
                                  >
                                    <Link href={`/wireframes/solicitudes/detalle?id=${item.id}`}>
                                      <Eye className="size-3.5" />
                                      <span className="hidden xl:inline">Ver detalle</span>
                                    </Link>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="text-xs">Ver detalle</TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    asChild
                                    className="size-8 p-0 text-muted-foreground hover:text-foreground border border-transparent hover:border-border"
                                    aria-label="Ver seguimiento"
                                  >
                                    <Link href={`/wireframes/solicitudes/detalle?id=${item.id}&tab=seguimiento`}>
                                      <History className="size-4" />
                                    </Link>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="text-xs">Ver seguimiento</TooltipContent>
                              </Tooltip>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>

            {/* Pie de Tabla Informativo */}
            <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground pt-1 px-1">
              <p>
                Mostrando {filteredProjects.length} de {projects.length} {projects.length === 1 ? "proyecto" : "proyectos"}
              </p>
              <p className="text-[11px] italic mt-1 sm:mt-0">
                Haz clic en cualquier fila para abrir el detalle completo del proyecto.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* ══════════════════════════════════════════════════════════
          MODAL DE CONFIRMACIÓN: ELIMINAR BORRADOR
         ══════════════════════════════════════════════════════════ */}
      <Dialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="size-11 rounded-2xl bg-muted border border-border flex items-center justify-center text-foreground mb-2 shadow-xs">
              <Trash2 className="size-5" />
            </div>
            <DialogTitle className="text-base font-bold text-foreground">
              ¿Eliminar este borrador?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Estás a punto de eliminar el borrador del proyecto{" "}
              <strong className="text-foreground">{projectToDelete?.nombre}</strong> (
              <span className="font-mono">{projectToDelete?.codigo}</span>).
              Esta acción retirará la fila de tu listado y no se puede deshacer.
            </DialogDescription>
          </DialogHeader>

          <div className="p-3 rounded-xl bg-muted/40 border border-border/70 text-[11px] text-muted-foreground flex items-start gap-2">
            <Info className="size-4 shrink-0 text-foreground mt-0.5" />
            <span>
              <strong>Propuesta para validación con DINARP:</strong> La eliminación de borradores y las acciones posteriores al envío son opciones de diseño propuestas para el taller.
            </span>
          </div>

          <DialogFooter className="flex justify-between items-center w-full pt-3 border-t border-border gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setProjectToDelete(null)}
              className="text-xs"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={handleConfirmDelete}
              className="text-xs font-semibold gap-1.5 ml-auto"
            >
              <Trash2 className="size-3.5" />
              <span>Eliminar borrador</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </WireframeDashboardLayout>
  );
}
