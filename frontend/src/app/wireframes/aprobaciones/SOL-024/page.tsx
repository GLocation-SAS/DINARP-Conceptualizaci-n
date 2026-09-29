"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  FileText,
  Download,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Send,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { DetailList } from "@/components/ui/detail-list";
import { WireframeDashboardLayout } from "../../components/wireframe-dashboard-layout";

export default function WireframeRevisionSolicitudPage() {
  const router = useRouter();

  // Estado interactivo de campos seleccionados
  const [rcFields, setRcFields] = useState({
    cedula: true,
    nombres: true,
    nacimiento: true,
  });

  const [sriFields, setSriFields] = useState({
    ruc: true,
    estado: false,
  });

  // Lista interactiva de observaciones
  const [observacionesList, setObservacionesList] = useState<
    Array<{ id: string; autor: string; fecha: string; rol: string; texto: string }>
  >([]);

  // Estado de observaciones en página
  const [observacionTexto, setObservacionTexto] = useState("");

  // Estado de modales
  const [isAprobarModalOpen, setIsAprobarModalOpen] = useState(false);
  const [isRechazarModalOpen, setIsRechazarModalOpen] = useState(false);
  const [isCorreccionModalOpen, setIsCorreccionModalOpen] = useState(false);

  // Estados de campos en modales
  const [modalObsAprobar, setModalObsAprobar] = useState("");
  const [modalMotivoRechazo, setModalMotivoRechazo] = useState("");
  const [modalMotivoCorreccion, setModalMotivoCorreccion] = useState("");
  const [rechazoError, setRechazoError] = useState(false);

  const handleAddObservacion = () => {
    if (!observacionTexto.trim()) {
      toast.error("Ingresa el texto de la observación.");
      return;
    }
    const newObs = {
      id: `OBS-${Date.now()}`,
      autor: "María Pérez",
      fecha: "Hoy, recién",
      rol: "Revisora DINARP",
      texto: observacionTexto.trim(),
    };
    setObservacionesList((prev) => [newObs, ...prev]);
    setObservacionTexto("");
    toast.success("Observación registrada con éxito.");
  };

  const handleConfirmAprobar = () => {
    setIsAprobarModalOpen(false);
    toast.success("Solicitud SOL-024 aprobada exitosamente.");
    router.push("/wireframes/aprobaciones/SOL-024/seguimiento");
  };

  const handleConfirmRechazar = () => {
    if (!modalMotivoRechazo.trim()) {
      setRechazoError(true);
      return;
    }
    setIsRechazarModalOpen(false);
    toast.warning("Solicitud SOL-024 rechazada.");
    router.push("/wireframes/aprobaciones");
  };

  const handleConfirmCorreccion = () => {
    if (!modalMotivoCorreccion.trim()) return;
    setIsCorreccionModalOpen(false);
    toast.info("Se ha solicitado corrección al solicitante.");
    router.push("/wireframes/aprobaciones");
  };

  return (
    <WireframeDashboardLayout activeMenu="aprobaciones">
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
                <Link href="/wireframes/aprobaciones" className="text-muted-foreground hover:text-foreground">
                  Aprobaciones y permisos
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-foreground">
                SOL-024
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* ── 2. Header: Código, Nombre y Estado ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-foreground tracking-tight">
              SOL-024 · Validación ciudadana
            </h1>
            <Badge tone="neutral" appearance="soft" size="md" className="font-semibold text-xs gap-1.5">
              <span className="size-2 rounded-full bg-foreground" />
              Pendiente de revisión
            </Badge>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/wireframes/aprobaciones")}
            className="h-10 px-4 rounded-xl text-xs font-semibold gap-2 border-border shrink-0"
          >
            <ArrowLeft className="size-4" />
            <span>Volver a bandeja</span>
          </Button>
        </div>

        {/* ── 3. Sección: Información general ── */}
        <Card className="border-border bg-surface shadow-xs" innerClassName="p-0 gap-0">
          <CardHeader className="p-6 pb-4 border-b border-border/60">
            <CardTitle className="text-base font-heading font-bold text-foreground">
              Información general
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <DetailList
              columns={2}
              items={[
                {
                  label: "Entidad solicitante",
                  value: <span className="font-semibold text-foreground">Ministerio X</span>,
                },
                {
                  label: "Propósito",
                  value: `"Validar identidad de ciudadanos para programa social."`,
                },
                {
                  label: "Responsable",
                  value: "Juan Pérez",
                },
                {
                  label: "Fecha de solicitud",
                  value: "15/09/26",
                },
                {
                  label: "Proyecto",
                  value: "Validación ciudadana",
                },
                {
                  label: "Fecha estimada de uso",
                  value: "01/10/26 - 31/12/26",
                },
              ]}
            />
          </CardContent>
        </Card>

        {/* ── 4. Sección: Datos solicitados por fuente ── */}
        <div className="space-y-3">
          <h2 className="text-base font-heading font-bold text-foreground">
            Datos solicitados
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card Registro Civil */}
            <Card className="border-border bg-surface shadow-xs" innerClassName="p-0 gap-0">
              <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between space-y-0 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <Building2 className="size-4 text-foreground" />
                  <CardTitle className="text-sm font-heading font-bold text-foreground">
                    Registro Civil
                  </CardTitle>
                </div>
                <Badge tone="neutral" appearance="soft" size="sm" className="font-mono text-[10px]">
                  {Object.values(rcFields).filter(Boolean).length} campos autorizados
                </Badge>
              </CardHeader>
              <CardContent className="p-5 space-y-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <Checkbox
                    id="rc-cedula"
                    checked={rcFields.cedula}
                    onCheckedChange={(c) => setRcFields((prev) => ({ ...prev, cedula: !!c }))}
                    className="data-checked:bg-foreground data-checked:border-foreground cursor-pointer"
                  />
                  <Label htmlFor="rc-cedula" className="text-xs font-medium text-foreground cursor-pointer">
                    Número de identificación
                  </Label>
                </div>
                <div className="flex items-center gap-2.5">
                  <Checkbox
                    id="rc-nombres"
                    checked={rcFields.nombres}
                    onCheckedChange={(c) => setRcFields((prev) => ({ ...prev, nombres: !!c }))}
                    className="data-checked:bg-foreground data-checked:border-foreground cursor-pointer"
                  />
                  <Label htmlFor="rc-nombres" className="text-xs font-medium text-foreground cursor-pointer">
                    Nombres
                  </Label>
                </div>
                <div className="flex items-center gap-2.5">
                  <Checkbox
                    id="rc-nacimiento"
                    checked={rcFields.nacimiento}
                    onCheckedChange={(c) => setRcFields((prev) => ({ ...prev, nacimiento: !!c }))}
                    className="data-checked:bg-foreground data-checked:border-foreground cursor-pointer"
                  />
                  <Label htmlFor="rc-nacimiento" className="text-xs font-medium text-foreground cursor-pointer">
                    Fecha de nacimiento
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Card SRI */}
            <Card className="border-border bg-surface shadow-xs" innerClassName="p-0 gap-0">
              <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between space-y-0 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <Building2 className="size-4 text-foreground" />
                  <CardTitle className="text-sm font-heading font-bold text-foreground">
                    SRI
                  </CardTitle>
                </div>
                <Badge tone="neutral" appearance="soft" size="sm" className="font-mono text-[10px]">
                  {Object.values(sriFields).filter(Boolean).length} campos autorizados
                </Badge>
              </CardHeader>
              <CardContent className="p-5 space-y-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <Checkbox
                    id="sri-ruc"
                    checked={sriFields.ruc}
                    onCheckedChange={(c) => setSriFields((prev) => ({ ...prev, ruc: !!c }))}
                    className="data-checked:bg-foreground data-checked:border-foreground cursor-pointer"
                  />
                  <Label htmlFor="sri-ruc" className="text-xs font-medium text-foreground cursor-pointer">
                    RUC
                  </Label>
                </div>
                <div className="flex items-center gap-2.5">
                  <Checkbox
                    id="sri-estado"
                    checked={sriFields.estado}
                    onCheckedChange={(c) => setSriFields((prev) => ({ ...prev, estado: !!c }))}
                    className="data-checked:bg-foreground data-checked:border-foreground cursor-pointer"
                  />
                  <Label htmlFor="sri-estado" className={`text-xs cursor-pointer ${sriFields.estado ? "font-medium text-foreground" : "text-muted-foreground line-through"}`}>
                    Estado tributario
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ── 5. Sección: Justificación de la solicitud ── */}
        <Card className="border-border bg-surface shadow-xs" innerClassName="p-0 gap-0">
          <CardHeader className="p-6 pb-3 border-b border-border/60">
            <CardTitle className="text-base font-heading font-bold text-foreground">
              Justificación de la solicitud
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-normal text-left">
              Se requiere validar la identidad de los beneficiarios del programa social, cruzando información con el Registro Civil y el SRI, con el fin de evitar duplicidad de registros.
            </p>
          </CardContent>
        </Card>

        {/* ── 6. Sección: Documentos adjuntos ── */}
        <Card className="border-border bg-surface shadow-xs">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-base font-heading font-bold text-foreground">
              Documentos adjuntos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2 space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-background/60">
              <div className="flex items-center gap-3">
                <FileText className="size-5 text-muted-foreground shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-foreground">Oficio_solicitud.pdf</span>
                  <span className="text-[10px] text-muted-foreground">PDF · 320 KB</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => toast.success("Descargando Oficio_solicitud.pdf...")}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <Download className="size-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-background/60">
              <div className="flex items-center gap-3">
                <FileText className="size-5 text-muted-foreground shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-foreground">Plan_de_proyecto.pdf</span>
                  <span className="text-[10px] text-muted-foreground">PDF · 1.2 MB</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => toast.success("Descargando Plan_de_proyecto.pdf...")}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <Download className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ── 7. Sección: Observaciones del proceso ── */}
        <Card className="border-border bg-surface shadow-xs">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-base font-heading font-bold text-foreground">
              Observaciones del proceso ({observacionesList.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            {observacionesList.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">Aún no hay observaciones registradas.</p>
            ) : (
              <div className="space-y-3">
                {observacionesList.map((obs) => (
                  <div key={obs.id} className="p-3.5 rounded-xl border border-border/80 bg-background space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">{obs.autor} ({obs.rol})</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{obs.fecha}</span>
                    </div>
                    <p className="text-xs text-foreground/90 leading-relaxed">{obs.texto}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── 8. Sección: Agregar observación ── */}
        <div className="space-y-2 text-left">
          <div className="flex items-center justify-between">
            <Label htmlFor="obs-input" className="text-xs font-bold text-foreground">
              Agregar observación
            </Label>
            <span className="text-[11px] text-muted-foreground">{observacionTexto.length}/500</span>
          </div>
          <textarea
            id="obs-input"
            rows={3}
            maxLength={500}
            value={observacionTexto}
            onChange={(e) => setObservacionTexto(e.target.value)}
            placeholder="Escribe una observación para la bitácora..."
            className="w-full rounded-2xl border border-border bg-surface p-3.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
          />
          {observacionTexto.trim() && (
            <div className="flex justify-end pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddObservacion}
                className="text-xs font-semibold"
              >
                Registrar observación
              </Button>
            </div>
          )}
        </div>

        {/* ── 9. Botones de Acción: Rechazar / Solicitar corrección / Aprobar ── */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-border/80">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setModalMotivoRechazo("");
              setRechazoError(false);
              setIsRechazarModalOpen(true);
            }}
            className="h-11 px-5 rounded-xl text-xs font-semibold border-border text-foreground hover:bg-muted/30"
          >
            Rechazar
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setModalMotivoCorreccion("");
              setIsCorreccionModalOpen(true);
            }}
            className="h-11 px-5 rounded-xl text-xs font-semibold border-border text-foreground hover:bg-muted/30"
          >
            Solicitar corrección
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={() => {
              setModalObsAprobar("");
              setIsAprobarModalOpen(true);
            }}
            className="h-11 px-6 rounded-xl text-xs font-semibold gap-2 shadow-xs"
          >
            <span>Aprobar solicitud</span>
          </Button>
        </div>

        {/* ══════════════════════════════════════════════════
            10. MODAL SEMÁNTICA DE ÉXITO: APROBAR SOLICITUD
           ══════════════════════════════════════════════════ */}
        {/* ══════════════════════════════════════════════════
            10. MODAL: APROBAR SOLICITUD
           ══════════════════════════════════════════════════ */}
        <Dialog open={isAprobarModalOpen} onOpenChange={setIsAprobarModalOpen}>
          <DialogContent variant="standard" className="max-w-[460px] rounded-3xl p-6 sm:p-8 bg-background border-border shadow-2xl">
            <div className="size-14 rounded-2xl bg-muted/60 border border-border flex items-center justify-center text-foreground mb-3 mx-auto">
              <CheckCircle2 className="size-7 stroke-[2]" />
            </div>
            <DialogHeader className="text-center space-y-2">
              <DialogTitle className="font-heading font-bold text-xl sm:text-2xl text-foreground">
                Aprobar solicitud
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                ¿Estás seguro de aprobar esta solicitud?
                <br />
                Se otorgará acceso a los datos solicitados según los términos definidos.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-1.5 text-left my-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="modal-obs-aprobar" className="text-xs font-semibold text-foreground">
                  Observación (opcional)
                </Label>
                <span className="text-[10px] text-muted-foreground">{modalObsAprobar.length}/500</span>
              </div>
              <textarea
                id="modal-obs-aprobar"
                rows={3}
                maxLength={500}
                value={modalObsAprobar}
                onChange={(e) => setModalObsAprobar(e.target.value)}
                placeholder="Añade una observación..."
                className="w-full rounded-xl border border-border bg-surface p-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </div>

            <DialogFooter className="mt-4 flex flex-col sm:flex-row gap-2.5 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAprobarModalOpen(false)}
                className="w-full h-11 rounded-xl text-xs font-semibold"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleConfirmAprobar}
                className="w-full h-11 text-xs font-semibold"
              >
                Aprobar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ══════════════════════════════════════════════════
            11. MODAL: RECHAZAR SOLICITUD
           ══════════════════════════════════════════════════ */}
        <Dialog open={isRechazarModalOpen} onOpenChange={setIsRechazarModalOpen}>
          <DialogContent variant="standard" className="max-w-[460px] rounded-3xl p-6 sm:p-8 bg-background border-border shadow-2xl">
            <div className="size-14 rounded-2xl bg-muted/60 border border-border flex items-center justify-center text-foreground mb-3 mx-auto">
              <XCircle className="size-7 stroke-[2]" />
            </div>
            <DialogHeader className="text-center space-y-2">
              <DialogTitle className="font-heading font-bold text-xl sm:text-2xl text-foreground">
                Rechazar solicitud
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                ¿Estás seguro de rechazar esta solicitud?
                <br />
                Indica el motivo para informar al solicitante.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-1.5 text-left my-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="modal-motivo-rechazo" className="text-xs font-semibold text-foreground">
                  Motivo / observación <span className="text-foreground">*</span>
                </Label>
                <span className="text-[10px] text-muted-foreground">{modalMotivoRechazo.length}/500</span>
              </div>
              <textarea
                id="modal-motivo-rechazo"
                rows={3}
                maxLength={500}
                value={modalMotivoRechazo}
                onChange={(e) => {
                  setModalMotivoRechazo(e.target.value);
                  if (rechazoError) setRechazoError(false);
                }}
                placeholder="Escribe el motivo del rechazo..."
                className="w-full rounded-xl border border-border bg-surface p-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
              {rechazoError && (
                <p className="text-xs text-foreground font-medium">
                  El motivo de rechazo es obligatorio.
                </p>
              )}
            </div>

            <DialogFooter className="mt-4 flex flex-col sm:flex-row gap-2.5 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRechazarModalOpen(false)}
                className="w-full h-11 rounded-xl text-xs font-semibold"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleConfirmRechazar}
                className="w-full h-11 text-xs font-semibold"
              >
                Rechazar solicitud
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ══════════════════════════════════════════════════
            12. MODAL: SOLICITAR CORRECCIÓN
           ══════════════════════════════════════════════════ */}
        <Dialog open={isCorreccionModalOpen} onOpenChange={setIsCorreccionModalOpen}>
          <DialogContent variant="standard" className="max-w-[460px] rounded-3xl p-6 sm:p-8 bg-background border-border shadow-2xl">
            <div className="size-14 rounded-2xl bg-muted/60 border border-border flex items-center justify-center text-foreground mb-3 mx-auto">
              <AlertTriangle className="size-7 stroke-[2]" />
            </div>
            <DialogHeader className="text-center space-y-2">
              <DialogTitle className="font-heading font-bold text-xl sm:text-2xl text-foreground">
                Solicitar corrección
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                La solicitud volverá al estado borrador/en corrección para que el solicitante ajuste los datos indicados.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-1.5 text-left my-2">
              <Label htmlFor="modal-obs-correccion" className="text-xs font-semibold text-foreground">
                Detalle de correcciones requeridas <span className="text-foreground">*</span>
              </Label>
              <textarea
                id="modal-obs-correccion"
                rows={3}
                value={modalMotivoCorreccion}
                onChange={(e) => setModalMotivoCorreccion(e.target.value)}
                placeholder="Indica qué campos o documentos deben ser corregidos..."
                className="w-full rounded-xl border border-border bg-surface p-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </div>

            <DialogFooter className="mt-4 flex flex-col sm:flex-row gap-2.5 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCorreccionModalOpen(false)}
                className="w-full h-11 rounded-xl text-xs font-semibold"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleConfirmCorreccion}
                disabled={!modalMotivoCorreccion.trim()}
                className="w-full h-11 text-xs font-semibold"
              >
                Enviar observaciones
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </WireframeDashboardLayout>
  );
}
