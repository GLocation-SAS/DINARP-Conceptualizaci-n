"use client";

import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  UserPlus,
  UserCheck,
  CheckCircle2,
  Building2,
  User,
  Search,
  Check,
  RotateCcw,
  AlertTriangle,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type SolicitudIngreso,
  puedeReasignarSolicitud,
} from "../../acceso-seguridad/data/gestion-ingresos-store";

export interface RevisorInfo {
  id: string;
  nombre: string;
  cargo: string;
  equipo: "GESTION" | "NORMATIVIDAD";
  baseAsignadas: number;
  basePendientes: number;
  baseEnRevision: number;
}

export const REVISORES_GESTION: RevisorInfo[] = [
  {
    id: "REV-G01",
    nombre: "Ana Torres",
    cargo: "Especialista de Gestión y Registro",
    equipo: "GESTION",
    baseAsignadas: 9,
    basePendientes: 2,
    baseEnRevision: 1,
  },
  {
    id: "REV-G02",
    nombre: "Carlos Pérez",
    cargo: "Analista de Gestión Registral",
    equipo: "GESTION",
    baseAsignadas: 12,
    basePendientes: 5,
    baseEnRevision: 2,
  },
  {
    id: "REV-G03",
    nombre: "María López",
    cargo: "Técnica de Admisión y Validación",
    equipo: "GESTION",
    baseAsignadas: 6,
    basePendientes: 1,
    baseEnRevision: 1,
  },
  {
    id: "REV-G04",
    nombre: "Revisor Gestión",
    cargo: "Revisor General de Área",
    equipo: "GESTION",
    baseAsignadas: 4,
    basePendientes: 1,
    baseEnRevision: 0,
  },
];

export const REVISORES_NORMATIVIDAD: RevisorInfo[] = [
  {
    id: "REV-N01",
    nombre: "Gabriel Suárez",
    cargo: "Especialista Normativo",
    equipo: "NORMATIVIDAD",
    baseAsignadas: 9,
    basePendientes: 3,
    baseEnRevision: 2,
  },
  {
    id: "REV-N02",
    nombre: "Elena Ruiz",
    cargo: "Analista de Regulación y Visto Bueno",
    equipo: "NORMATIVIDAD",
    baseAsignadas: 11,
    basePendientes: 4,
    baseEnRevision: 1,
  },
  {
    id: "REV-N03",
    nombre: "Roberto Gómez",
    cargo: "Abogado de Asuntos Legales",
    equipo: "NORMATIVIDAD",
    baseAsignadas: 5,
    basePendientes: 1,
    baseEnRevision: 1,
  },
  {
    id: "REV-N04",
    nombre: "Revisor Normatividad",
    cargo: "Revisor General de Área",
    equipo: "NORMATIVIDAD",
    baseAsignadas: 3,
    basePendientes: 0,
    baseEnRevision: 0,
  },
];

export interface AsignarRevisorPanelProps {
  solicitud?: SolicitudIngreso | null;
  solicitudesMasivas?: SolicitudIngreso[];
  tipoArea?: "GESTION" | "NORMATIVIDAD";
  directorNombre?: string;
  allSolicitudes?: SolicitudIngreso[];
  onConfirmAsignacion: (
    solicitudId: string,
    revisorNombre: string,
    directorNombre: string,
    observaciones?: string
  ) => void;
  onConfirmAsignacionMasiva?: (
    solicitudIds: string[],
    revisorNombre: string,
    directorNombre: string,
    observaciones?: string
  ) => void;
  onCancel?: () => void;
  isCardMode?: boolean;
}

export function AsignarRevisorPanel({
  solicitud,
  solicitudesMasivas = [],
  tipoArea = "GESTION",
  directorNombre = "Ing. Roberto Peña (Director Gestión)",
  allSolicitudes = [],
  onConfirmAsignacion,
  onConfirmAsignacionMasiva,
  onCancel,
  isCardMode = false,
}: AsignarRevisorPanelProps) {
  const [selectedRevisor, setSelectedRevisor] = useState<RevisorInfo | null>(null);
  const [observaciones, setObservaciones] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const isMasiva = solicitudesMasivas.length > 0;
  const baseRevisores = tipoArea === "GESTION" ? REVISORES_GESTION : REVISORES_NORMATIVIDAD;

  // Calcular métricas dinámicas
  const revisoresConCarga = useMemo(() => {
    return baseRevisores.map((rev) => {
      const solicitudesDelRevisor = allSolicitudes.filter((s) => {
        if (tipoArea === "GESTION") {
          return (
            s.revisorGestion === rev.nombre ||
            (rev.nombre === "Revisor Gestión" && s.revisorGestion === "Juan (Revisor Gestión)")
          );
        } else {
          return (
            s.revisorNormatividad === rev.nombre ||
            (rev.nombre === "Revisor Normatividad" && s.revisorNormatividad === "María (Revisor Normatividad)")
          );
        }
      });

      const pendientesCount = solicitudesDelRevisor.filter((s) =>
        tipoArea === "GESTION"
          ? s.estado === "PENDIENTE_ASIGNACION_GESTION" || s.estado === "Pendiente"
          : s.estado === "PENDIENTE_ASIGNACION_NORMATIVIDAD"
      ).length;

      return {
        ...rev,
        pendientes: rev.basePendientes + pendientesCount,
      };
    });
  }, [baseRevisores, allSolicitudes, tipoArea]);

  const filteredRevisores = useMemo(() => {
    if (!searchQuery.trim()) return revisoresConCarga;
    const q = searchQuery.toLowerCase();
    return revisoresConCarga.filter(
      (r) => r.nombre.toLowerCase().includes(q) || r.cargo.toLowerCase().includes(q)
    );
  }, [revisoresConCarga, searchQuery]);

  const revisorActual = solicitud
    ? tipoArea === "GESTION"
      ? solicitud.revisorGestion || (solicitud.revisor !== "Por asignar" ? solicitud.revisor : null)
      : solicitud.revisorNormatividad || null
    : null;

  const tieneAsignado = !isMasiva && !!revisorActual;

  const roleForCheck = tipoArea === "GESTION" ? "DIR_GESTION" : "DIR_NORMATIVA";
  const {
    puedeReasignar: permitidaAsignacionOReasignacion,
    motivoBloqueo,
    esReasignacion,
  } = useMemo(() => {
    if (isMasiva) {
      return { puedeReasignar: true, esReasignacion: false, motivoBloqueo: undefined };
    }
    if (!solicitud) {
      return { puedeReasignar: true, esReasignacion: false, motivoBloqueo: undefined };
    }
    return puedeReasignarSolicitud(solicitud, roleForCheck);
  }, [isMasiva, solicitud, roleForCheck]);

  // Si fue aprobado (global o por Gestión hacia Normatividad): regla estricta "si fue aprobado no puedo reasignar"
  const esTramiteAprobado = Boolean(
    !isMasiva &&
    solicitud &&
    (solicitud.estado === "Aprobada" ||
      solicitud.estado === "APROBADO_FINAL" ||
      (tipoArea === "GESTION" && (Boolean(solicitud.fechaAprobacionGestion) || solicitud.estado.includes("NORMATIVIDAD"))))
  );

  const yaEmpezoRevision = useMemo(() => {
    if (!solicitud) return false;
    return Boolean(
      solicitud.revisionIniciada ||
      solicitud.historial?.some((h) =>
        h.accion.toLowerCase().includes("revisión iniciada") ||
        h.accion.toLowerCase().includes("observación") ||
        h.accion.toLowerCase().includes("dictamen") ||
        h.accion.toLowerCase().includes("análisis iniciado")
      )
    );
  }, [solicitud]);

  // Regla BPM estricta: solo reasignar si fue asignado y todavía no está siendo revisado por el revisor
  const puedeReasignar = !isMasiva && tieneAsignado && esReasignacion && permitidaAsignacionOReasignacion && !esTramiteAprobado && !yaEmpezoRevision;

  const handleExecuteAsignacion = () => {
    if (!selectedRevisor || yaEmpezoRevision || esTramiteAprobado || !permitidaAsignacionOReasignacion) return;

    if (isMasiva && onConfirmAsignacionMasiva) {
      const ids = solicitudesMasivas.map((s) => s.id);
      onConfirmAsignacionMasiva(
        ids,
        selectedRevisor.nombre,
        directorNombre,
        observaciones.trim() || undefined
      );
    } else if (solicitud) {
      onConfirmAsignacion(
        solicitud.id,
        selectedRevisor.nombre,
        directorNombre,
        observaciones.trim() || undefined
      );
    }

    setObservaciones("");
  };

  const areaTitle = tipoArea === "GESTION" ? "Equipo de Gestión" : "Equipo de Normatividad";

  return (
    <div className="space-y-5">
      {/* ── 1. CABECERA CON LÍNEA INFERIOR DIVISORIA ── */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "size-10 rounded-full flex items-center justify-center shrink-0 border",
              esTramiteAprobado
                ? "bg-success-100/40 dark:bg-success-900/40 text-success-800 dark:text-success-300 border-success-300 dark:border-success-700/50"
                : yaEmpezoRevision
                  ? "bg-warning-100/40 dark:bg-warning-900/40 text-warning-800 dark:text-warning-300 border-warning-300 dark:border-warning-700/50"
                  : "bg-primary/10 dark:bg-primary-900/40 text-primary dark:text-primary-300 border-primary/20 dark:border-primary-700/50"
            )}
          >
            {esTramiteAprobado ? (
              <CheckCircle2 className="size-5 text-success dark:text-success-300" />
            ) : yaEmpezoRevision ? (
              <Lock className="size-5 text-warning dark:text-warning-300" />
            ) : puedeReasignar ? (
              <RotateCcw className="size-5 text-primary dark:text-primary-300" />
            ) : (
              <UserPlus className="size-5 text-primary dark:text-primary-300" />
            )}
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold font-heading text-foreground leading-tight">
              {isMasiva
                ? `Asignación Masiva — ${areaTitle}`
                : esTramiteAprobado
                  ? `Expediente Aprobado — ${areaTitle}`
                  : puedeReasignar
                    ? `Reasignar Revisor — ${areaTitle}`
                    : `Asignar Revisor — ${areaTitle}`}
            </h3>
            {!yaEmpezoRevision && (
              <p className="text-xs text-muted-foreground dark:text-neutral-400 mt-0.5 leading-snug">
                {esTramiteAprobado
                  ? "Este trámite ya fue aprobado. No admite reasignación de funcionario."
                  : puedeReasignar
                    ? "El revisor aún no ha iniciado la revisión. Puedes reasignar este expediente a otro funcionario."
                    : "Selecciona el funcionario encargado de revisar y validar el trámite."}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── AVISO DE ESTADO: TRÁMITE YA APROBADO (BLOQUEO ESTRICTO) ── */}
      {!isMasiva && esTramiteAprobado && (
        <div className="p-3.5 bg-success/10 border border-success/30 rounded-xl flex items-start gap-3 text-xs text-foreground">
          <CheckCircle2 className="size-4 text-success dark:text-success-300 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-semibold block text-success font-heading">
              Trámite Aprobado — Reasignación bloqueada
            </strong>
            <p className="text-muted-foreground dark:text-neutral-300 text-[11px] leading-relaxed">
              {motivoBloqueo || "El trámite ya fue validado y aprobado técnicamente. No es posible reasignar funcionarios en expedientes aprobados o despachados."}
            </p>
          </div>
        </div>
      )}

      {/* ── AVISO DE ESTADO: REVISIÓN YA INICIADA POR EL REVISOR ── */}
      {!isMasiva && !esTramiteAprobado && yaEmpezoRevision && (
        <div className="p-3.5 bg-warning-50/60 dark:bg-warning-900/25 border border-warning/40 dark:border-warning-500/40 rounded-xl flex items-start gap-3 text-xs text-foreground">
          <Lock className="size-4 text-warning dark:text-warning-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-semibold block text-warning-900 dark:text-warning-200 font-heading">
              Reasignación no permitida
            </strong>
            <p className="text-muted-foreground dark:text-neutral-300 text-[11px] leading-relaxed">
              La revisión de este expediente ya fue iniciada por el funcionario asignado.
            </p>
          </div>
        </div>
      )}

      {/* ── AVISO DE ESTADO: REASIGNACIÓN DISPONIBLE ── */}
      {!isMasiva && !esTramiteAprobado && puedeReasignar && (
        <div className="p-3.5 bg-info-100/30 dark:bg-info-900/20 border border-info/40 rounded-xl flex items-start gap-3 text-xs text-foreground">
          <RotateCcw className="size-4 text-info shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-semibold block text-info font-heading">Reasignación disponible</strong>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              El revisor actual <strong>{revisorActual}</strong> aún no ha iniciado la revisión técnica. Puedes reasignar este expediente a otro funcionario.
            </p>
          </div>
        </div>
      )}

      {/* ── 2. TARJETA INFORMATIVA INSTITUCIÓN Y CONTACTO ── */}
      <div className="p-3 bg-surface rounded-xl border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2 min-w-0 flex-wrap sm:flex-nowrap">
          <Building2 className="size-4 text-primary shrink-0" />
          <span className="font-semibold text-foreground truncate">
            {isMasiva
              ? `${solicitudesMasivas.length} solicitudes seleccionadas`
              : solicitud?.institucion || "Entidad Requirente"}
          </span>
        </div>

        {!isMasiva && solicitud && (
          <div className="flex items-center gap-2 text-muted-foreground shrink-0">
            <User className="size-3.5 text-muted-foreground shrink-0" />
            <span>
              {solicitud.nombreCompleto}
              {solicitud.cedula ? ` (${solicitud.cedula})` : ""}
            </span>
          </div>
        )}
      </div>

      {/* ── 3. MODO CARDS (PARA SIDEBAR ESTRECHO) vs MODO TABLA UI KIT (PARA MODAL) ── */}
      {/* ── 3. MODO CARDS / TABLA O RESUMEN CUANDO ESTÁ APROBADO ── */}
      {esTramiteAprobado ? (
        <div className="p-4 rounded-2xl bg-muted/20 border border-border/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Funcionario responsable del dictamen
            </span>
            <Badge tone="success" appearance="soft" size="sm" className="font-bold">
              DICTAMEN FAVORABLE
            </Badge>
          </div>
          <div className="flex items-center gap-3 p-3 bg-surface rounded-xl border border-border">
            <div className="size-10 rounded-full bg-success/15 text-success flex items-center justify-center font-bold text-sm">
              {revisorActual?.charAt(0).toUpperCase() || "R"}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-foreground truncate">{revisorActual || "Revisor de Gestión"}</h4>
              <p className="text-xs text-muted-foreground">Revisor Técnico de Gestión de Ingresos</p>
            </div>
            {solicitud?.fechaAprobacionGestion && (
              <span className="text-xs text-muted-foreground font-mono">
                {solicitud.fechaAprobacionGestion}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            El expediente completó su revisión técnica satisfactoriamente. Al haber sido aprobado, el proceso se encuentra concluido en esta etapa y no admite reasignación de revisores.
          </p>
        </div>
      ) : isCardMode ? (
        <div className="space-y-3.5">
          <label className="text-xs font-semibold text-foreground">
            {yaEmpezoRevision ? "Funcionario asignado (revisión iniciada):" : "Selecciona el revisor para este trámite:"}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {revisoresConCarga.map((rev) => {
              const isSelected = selectedRevisor?.id === rev.id;
              const isCurrent = rev.nombre === revisorActual;
              const inicial = rev.nombre.charAt(0).toUpperCase();

              return (
                <div
                  key={rev.id}
                  onClick={() => !yaEmpezoRevision && setSelectedRevisor(rev)}
                  className={cn(
                    "relative p-3.5 rounded-xl border text-left transition-all duration-300 flex flex-col justify-between gap-2.5 select-none",
                    yaEmpezoRevision
                      ? isCurrent
                        ? "bg-warning-50/40 dark:bg-warning-900/20 border-warning/40 dark:border-warning-500/40 ring-1 ring-warning/30 dark:ring-warning-500/20 cursor-not-allowed"
                        : "opacity-75 bg-surface/80 dark:bg-neutral-900/60 border-border dark:border-neutral-800 cursor-not-allowed"
                      : isSelected
                        ? "bg-primary/10 dark:bg-primary-900/40 border-2 border-primary dark:border-primary-400 ring-2 ring-primary/20 dark:ring-primary-400/20 shadow-md -translate-y-0.5 cursor-pointer"
                        : "bg-surface/80 dark:bg-neutral-900/80 hover:bg-primary-50/50 dark:hover:bg-primary-900/30 border-border dark:border-neutral-800 hover:border-primary/50 dark:hover:border-primary-400 shadow-2xs hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={cn(
                          "size-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors",
                          isSelected
                            ? "bg-primary text-primary-foreground shadow-2xs"
                            : isCurrent
                              ? "bg-warning-100 dark:bg-warning-900/50 text-warning-800 dark:text-warning-300 border border-warning-300 dark:border-warning-600/50"
                              : "bg-primary/10 dark:bg-primary-900/40 text-primary dark:text-primary-300 border border-primary/20 dark:border-primary-700/40"
                        )}
                      >
                        {inicial}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-foreground dark:text-neutral-100 leading-snug">{rev.nombre}</h4>
                        <p className="text-[10px] text-muted-foreground dark:text-neutral-400 leading-snug mt-0.5">{rev.cargo}</p>
                      </div>
                    </div>

                    {isCurrent && (
                      <Badge
                        tone="warning"
                        appearance="solid"
                        size="sm"
                        className="text-[9px] h-4.5 px-1.5 font-bold uppercase tracking-wider shrink-0 !text-white shadow-2xs"
                      >
                        Actual
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1.5 border-t border-border/60 dark:border-neutral-800 text-[11px]">
                    <span className="text-[10px] font-bold text-muted-foreground dark:text-neutral-400 uppercase tracking-wider">
                      {rev.pendientes} {rev.pendientes === 1 ? "PENDIENTE" : "PENDIENTES"}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* MODO TABLA COMPLETA DEL UI KIT */
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Distribución de trámites por revisor
            </span>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar funcionario..."
                className="h-8 pl-8 pr-3 text-xs bg-surface border-border rounded-xl"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="py-3 px-4 text-xs font-bold">
                    Revisor / Funcionario
                  </TableHead>
                  <TableHead className="py-3 px-4 text-xs font-bold text-center w-28">
                    Asignadas
                  </TableHead>
                  <TableHead className="py-3 px-4 text-xs font-bold text-center w-28">
                    Pendientes
                  </TableHead>
                  <TableHead className="py-3 px-4 text-xs font-bold text-center w-28">
                    En revisión
                  </TableHead>
                  <TableHead className="py-3 px-4 text-xs font-bold text-center w-24">
                    Acción
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRevisores.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-6 text-center text-xs text-muted-foreground">
                      No se encontraron revisores con el término ingresado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRevisores.map((rev) => {
                    const isSelected = selectedRevisor?.id === rev.id;
                    const isCurrent = rev.nombre === revisorActual;
                    const inicial = rev.nombre.charAt(0).toUpperCase();

                    return (
                      <TableRow
                        key={rev.id}
                        data-state={isSelected ? "selected" : undefined}
                        onClick={() => !yaEmpezoRevision && setSelectedRevisor(rev)}
                        className={cn(
                          "cursor-pointer transition-colors",
                          yaEmpezoRevision && "pointer-events-none opacity-60 cursor-not-allowed",
                          isSelected
                            ? "bg-primary/15 dark:bg-primary/25 font-semibold"
                            : "hover:bg-primary/10"
                        )}
                      >
                        {/* Funcionario */}
                        <TableCell className="py-2.5 px-4 h-auto">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "size-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors",
                                isSelected
                                  ? "bg-primary text-primary-foreground shadow-2xs"
                                  : "bg-primary/10 text-primary border border-primary/20"
                              )}
                            >
                              {inicial}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-foreground truncate">
                                  {rev.nombre}
                                </span>
                                {isCurrent && (
                                  <Badge
                                    tone="primary"
                                    appearance="soft"
                                    size="sm"
                                    className="text-[9px] h-4 px-1.5 font-bold uppercase tracking-wider"
                                  >
                                    Actual
                                  </Badge>
                                )}
                              </div>
                              <p className="text-[11px] text-muted-foreground truncate">
                                {rev.cargo}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Asignadas */}
                        <TableCell className="py-2.5 px-4 h-auto text-center font-bold text-xs text-foreground tabular-nums">
                          {rev.baseAsignadas}
                        </TableCell>

                        {/* Pendientes */}
                        <TableCell className="py-2.5 px-4 h-auto text-center font-bold text-xs tabular-nums">
                          <Badge
                            tone={rev.pendientes > 3 ? "warning" : "neutral"}
                            appearance="soft"
                            size="sm"
                            className="font-mono text-xs"
                          >
                            {rev.pendientes}
                          </Badge>
                        </TableCell>

                        {/* En revisión */}
                        <TableCell className="py-2.5 px-4 h-auto text-center font-bold text-xs text-foreground tabular-nums">
                          {rev.baseEnRevision}
                        </TableCell>

                        {/* Acción con Tooltip del UI Kit */}
                        <TableCell className="py-2.5 h-auto text-center">
                          <div className="flex items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button type="button" disabled={yaEmpezoRevision} onClick={() => setSelectedRevisor(rev)} aria-label={`Seleccionar a ${rev.nombre}`} variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-primary-300 hover:bg-primary-300/10">
                                    {isSelected ? (
                                      <Check className="size-4" />
                                    ) : (
                                      <UserPlus className="size-4" />
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  {yaEmpezoRevision
                                    ? "Reasignación no permitida"
                                    : isSelected
                                      ? "Revisor seleccionado"
                                      : "Seleccionar para asignar"}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}



      {/* ── 5. FOOTER CON LÍNEA SUPERIOR DIVISORIA Y ACCIONES ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border">
        <div className="text-xs text-muted-foreground w-full sm:w-auto text-left">
          {esTramiteAprobado ? (
            <span className="text-success font-medium flex items-center gap-1.5">
              <CheckCircle2 className="size-4 shrink-0 text-success" />
              Expediente aprobado — Reasignación cerrada
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-xs font-semibold h-9 px-5 rounded-xl"
            >
              Cancelar
            </Button>
          )}

          {!esTramiteAprobado && (
            <Button
              type="button"
              variant={yaEmpezoRevision ? "secondary" : "primary"}
              size="sm"
              disabled={!selectedRevisor || yaEmpezoRevision || !permitidaAsignacionOReasignacion}
              onClick={handleExecuteAsignacion}
              className={cn(
                "text-xs font-semibold h-10 px-6 gap-2 rounded-full shadow-xs",
                yaEmpezoRevision &&
                  "!opacity-100 bg-muted dark:bg-neutral-800 !text-muted-foreground dark:!text-neutral-200 border-border dark:border-neutral-700 cursor-not-allowed"
              )}
            >
              {puedeReasignar ? <RotateCcw className="size-4" /> : <UserPlus className="size-4" />}
              <span>
                {isMasiva
                  ? `Asignar ${solicitudesMasivas.length} solicitudes`
                  : yaEmpezoRevision
                    ? "Reasignación no permitida"
                    : puedeReasignar
                      ? `Reasignar a ${selectedRevisor ? selectedRevisor.nombre.split(" ")[0] : "revisor"}`
                      : "Asignar solicitud"}
              </span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export interface AsignarRevisorDialogProps {
  solicitud: SolicitudIngreso | null;
  solicitudesMasivas?: SolicitudIngreso[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tipoArea?: "GESTION" | "NORMATIVIDAD";
  directorNombre?: string;
  allSolicitudes?: SolicitudIngreso[];
  onConfirmAsignacion: (
    solicitudId: string,
    revisorNombre: string,
    asignadoPor: string,
    observaciones?: string
  ) => void;
  onConfirmAsignacionMasiva?: (
    solicitudIds: string[],
    revisorNombre: string,
    asignadoPor: string,
    observaciones?: string
  ) => void;
}

export function AsignarRevisorDialog({
  solicitud,
  solicitudesMasivas = [],
  open,
  onOpenChange,
  tipoArea = "GESTION",
  directorNombre = "Ing. Roberto Peña (Director Gestión)",
  allSolicitudes = [],
  onConfirmAsignacion,
  onConfirmAsignacionMasiva,
}: AsignarRevisorDialogProps) {
  if (!solicitud && solicitudesMasivas.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full p-4 sm:p-7 max-h-[90vh] overflow-y-auto">
        <AsignarRevisorPanel
          solicitud={solicitud}
          solicitudesMasivas={solicitudesMasivas}
          tipoArea={tipoArea}
          directorNombre={directorNombre}
          allSolicitudes={allSolicitudes}
          onConfirmAsignacion={(solId, revNombre, dirNombre, obs) => {
            onConfirmAsignacion(solId, revNombre, dirNombre, obs);
            onOpenChange(false);
          }}
          onConfirmAsignacionMasiva={
            onConfirmAsignacionMasiva
              ? (ids, revNombre, dirNombre, obs) => {
                onConfirmAsignacionMasiva(ids, revNombre, dirNombre, obs);
                onOpenChange(false);
              }
              : undefined
          }
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
