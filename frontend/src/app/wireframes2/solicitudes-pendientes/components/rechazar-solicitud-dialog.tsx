"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { XCircle, AlertCircle, Mail, User, Building2, CreditCard, Loader2, AlertTriangle, FileText } from "lucide-react";
import { toast } from "sonner";
import { type SolicitudIngreso } from "../../acceso-seguridad/data/gestion-ingresos-store";

interface RechazarSolicitudDialogProps {
  solicitud: SolicitudIngreso | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (solicitud: SolicitudIngreso, motivo: string) => void;
}

const MAX_MOTIVO_LENGTH = 500;

export function RechazarSolicitudDialog({
  solicitud,
  open,
  onOpenChange,
  onConfirm,
}: RechazarSolicitudDialogProps) {
  const [motivo, setMotivo] = useState("");
  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"MOTIVO" | "CONFIRM">("MOTIVO");

  useEffect(() => {
    if (open) {
      setMotivo("");
      setTouched(false);
      setIsSubmitting(false);
      setStep("MOTIVO");
    }
  }, [open]);

  if (!solicitud) return null;

  const isMotivoEmpty = motivo.trim().length === 0;
  const isError = touched && isMotivoEmpty;

  const handleContinue = () => {
    setTouched(true);
    if (isMotivoEmpty) return;
    setStep("CONFIRM");
  };

  const handleReject = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onConfirm(solicitud, motivo.trim());
      onOpenChange(false);
      // El toast se manejará desde el componente padre
    }, 400);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        {step === "MOTIVO" ? (
          <>
            <DialogHeader className="space-y-2">
              <div className="size-10 rounded-full bg-danger/15 border border-danger/30 text-danger-foreground flex items-center justify-center mb-1">
                <XCircle className="size-5" />
              </div>
              <DialogTitle className="text-base font-bold text-foreground">
                Rechazar solicitud
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
                Indica detalladamente la razón por la cual no se aprueba el trámite.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="motivo-rechazo" className="text-xs font-semibold text-foreground">
                  Motivo del rechazo <span className="text-danger">*</span>
                </Label>
                <span className="text-[11px] text-muted-foreground font-mono">
                  {motivo.length}/{MAX_MOTIVO_LENGTH}
                </span>
              </div>

              <Textarea
                id="motivo-rechazo"
                value={motivo}
                maxLength={MAX_MOTIVO_LENGTH}
                onChange={(e) => {
                  setMotivo(e.target.value);
                  if (touched) setTouched(false);
                }}
                placeholder="Describe el motivo por el cual la solicitud será rechazada."
                className="min-h-[100px] text-xs resize-none"
                state={isError ? "error" : "default"}
              />

              {isError && (
                <p className="text-[11px] text-danger flex items-center gap-1 font-medium pt-0.5">
                  <AlertCircle className="size-3 shrink-0" />
                  Ingresa el motivo del rechazo.
                </p>
              )}

              <p className="text-[11px] text-muted-foreground pt-1 flex gap-1.5">
                <Mail className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
                La institución será notificada por correo electrónico con el motivo registrado.
              </p>
            </div>

            <DialogFooter className="gap-3 pt-3 sm:flex-row sm:justify-end sm:[&>*]:flex-none sm:[&>*]:w-auto">
              <Button
                type="button"
                variant="neutral"
                onClick={() => onOpenChange(false)}
                className="h-10 px-5 text-xs font-semibold rounded-xl"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleContinue}
                className="h-10 px-6 text-xs font-semibold rounded-full shadow-sm"
              >
                Continuar
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader className="space-y-2">
              <div className="size-10 rounded-full bg-warning/15 border border-warning/30 text-warning-700 dark:text-warning-400 flex items-center justify-center mb-1">
                <AlertTriangle className="size-5" />
              </div>
              <DialogTitle className="text-base font-bold text-foreground">
                ¿Confirmas el rechazo de esta solicitud?
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
                Esta acción cambiará el estado del trámite y notificará a la institución por correo electrónico.
              </DialogDescription>
            </DialogHeader>

            <div className="my-2 p-3 bg-muted/40 rounded-xl border border-border/70 space-y-3 text-xs">
              <div className="flex items-start justify-between gap-4">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium shrink-0">
                  <FileText className="size-3.5 text-muted-foreground" /> Trámite:
                </span>
                <span className="font-mono font-medium text-foreground">{solicitud.id}</span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium shrink-0">
                  <Building2 className="size-3.5 text-muted-foreground" /> Institución:
                </span>
                <span className="font-medium text-foreground text-right">{solicitud.institucion}</span>
              </div>
              <div className="flex items-start justify-between gap-4 border-t border-border/60 pt-3">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium shrink-0">
                  <AlertCircle className="size-3.5 text-muted-foreground" /> Motivo:
                </span>
                <span className="font-medium text-foreground text-right italic">"{motivo}"</span>
              </div>
            </div>

            <p className="text-[11px] font-medium text-warning-700 dark:text-warning-400 bg-warning/5 p-2 rounded-md border border-warning/20">
              Una vez confirmado, el trámite quedará finalizado en esta etapa.
            </p>

            <DialogFooter className="gap-3 pt-3 sm:flex-row sm:justify-end sm:[&>*]:flex-none sm:[&>*]:w-auto">
              <Button
                type="button"
                variant="neutral"
                disabled={isSubmitting}
                onClick={() => setStep("MOTIVO")}
                className="h-10 px-5 text-xs font-semibold rounded-xl"
              >
                Volver
              </Button>
              <Button
                type="button"
                variant="danger"
                disabled={isSubmitting}
                onClick={handleReject}
                className="h-10 px-6 text-xs font-semibold gap-2 rounded-full shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Procesando...</span>
                  </>
                ) : (
                  <>
                    <XCircle className="size-4" />
                    <span>Confirmar rechazo</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
