"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Mail, ShieldCheck, User, Building2, CreditCard, Loader2, FileCheck2, Info, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { type SolicitudIngreso } from "../../acceso-seguridad/data/gestion-ingresos-store";

interface AprobarSolicitudDialogProps {
  solicitud: SolicitudIngreso | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (solicitud: SolicitudIngreso) => void;
}

export function AprobarSolicitudDialog({
  solicitud,
  open,
  onOpenChange,
  onConfirm,
}: AprobarSolicitudDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!solicitud) return null;

  const isProcesoA = solicitud.tipoTramite === "PROCESO_A_REGISTRO_INSTITUCION";
  const isProcesoB = solicitud.tipoTramite === "PROCESO_B_ENROLAMIENTO_COORDINADOR";
  const isProcesoC = solicitud.tipoTramite === "PROCESO_C_CAMBIO_COORDINADOR";

  const handleApprove = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onConfirm(solicitud);
      onOpenChange(false);

      if (isProcesoA) {
        toast.success("Institución registrada exitosamente.", {
          description: `Se prerregistraron los coordinadores titular y suplente, enviando invitaciones de enrolamiento.`
        });
      } else if (isProcesoB) {
        toast.success("Coordinador activado exitosamente.", {
          description: `${solicitud.nombreCompleto} ahora tiene estado ACTIVO para iniciar sesión.`
        });
      } else {
        toast.success("Cambio de coordinador aprobado.", {
          description: `Se habilitó el prerregistro del nuevo coordinador para suscribir el Acuerdo (Anexo B).`
        });
      }
    }, 400);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent variant="warning" className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2 justify-center">
            <Badge tone="warning" appearance="soft" size="sm" className="border border-warning/30 font-mono">
              {solicitud.codigoDocumental}
            </Badge>
          </div>
          <DialogTitle className="text-base font-bold text-foreground">
            {isProcesoA && "Confirmar Aprobación — Registro Institucional"}
            {isProcesoB && "Confirmar Aprobación y Activación"}
            {isProcesoC && "Confirmar Aprobación — Cambio de Coordinador"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            {isProcesoA && "Al aprobar la solicitud, la institución queda dada de alta en el SINARP y sus coordinadores quedarán PRERREGISTRADOS con envío de invitación (no activos aún)."}
            {isProcesoB && "Al aprobar el Acuerdo de Confidencialidad (Anexo B), el coordinador queda ACTIVO y podrá iniciar sesión en la plataforma."}
            {isProcesoC && "Al aprobar el Anexo C, se actualiza el registro institucional y se habilita el prerregistro del nuevo coordinador para que complete su Proceso B."}
          </DialogDescription>
        </DialogHeader>

        {/* Advertencia Informativa de Confirmación */}
        <div className="p-3 bg-warning/10 rounded-xl border border-warning/30 text-[11px] text-warning-foreground flex items-start gap-2">
          <AlertTriangle className="size-4 shrink-0 mt-0.5 text-warning-foreground" />
          <span>
            <strong>Confirmación requerida:</strong> Se registrará este dictamen en el historial oficial del trámite y se notificará a las partes.
          </span>
        </div>

        <DialogFooter stacked className="mt-4 flex flex-col w-full gap-2.5 sm:flex-col [&>*]:w-full">
          <Button
            type="button"
            variant="warning"
            disabled={isSubmitting}
            onClick={handleApprove}
            className="w-full gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="size-4" />
                <span>Confirmar y Aprobar</span>
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="neutral"
            disabled={isSubmitting}
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
