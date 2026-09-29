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
import { XCircle, AlertCircle, Mail, User, Building2, CreditCard, Loader2, AlertTriangle } from "lucide-react";
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

  useEffect(() => {
    if (open) {
      setMotivo("");
      setTouched(false);
      setIsSubmitting(false);
    }
  }, [open]);

  if (!solicitud) return null;

  const isMotivoEmpty = motivo.trim().length === 0;
  const isError = touched && isMotivoEmpty;

  const handleReject = () => {
    setTouched(true);
    if (isMotivoEmpty) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onConfirm(solicitud, motivo.trim());
      onOpenChange(false);
      toast.warning("Solicitud devuelta / rechazada", {
        description: `Se registró la observación y se notificó a ${solicitud.correo}.`
      });
    }, 400);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader className="space-y-2">
          <div className="size-10 rounded-full bg-warning/15 border border-warning/30 text-warning-foreground flex items-center justify-center mb-1">
            <AlertTriangle className="size-5" />
          </div>
          <DialogTitle className="text-base font-bold text-foreground">
            Confirmar rechazo / Devolución de solicitud
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Indica detalladamente la razón por la cual no se aprueba el trámite. Esta información se guardará en el historial.
          </DialogDescription>
        </DialogHeader>

        {/* Resumen del Usuario */}
        <div className="my-2 p-3 bg-muted/40 rounded-xl border border-border/70 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
              <User className="size-3.5 text-muted-foreground" /> Usuario:
            </span>
            <span className="font-bold text-foreground truncate max-w-[220px]">{solicitud.nombreCompleto}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
              <CreditCard className="size-3.5 text-muted-foreground" /> Cédula:
            </span>
            <span className="font-mono font-medium text-foreground">{solicitud.cedula}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
              <Mail className="size-3.5 text-muted-foreground" /> Correo:
            </span>
            <span className="font-medium text-foreground truncate max-w-[220px]">{solicitud.correo}</span>
          </div>
        </div>

        {/* Campo Motivo Obligatorio */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between">
            <Label htmlFor="motivo-rechazo" className="text-xs font-semibold text-foreground">
              Motivo del rechazo <span className="text-foreground">*</span>
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
            placeholder="Indica el motivo por el cual se rechaza la solicitud…"
            className="min-h-[100px] text-xs resize-none"
            state={isError ? "error" : "default"}
          />

          {isError && (
            <p className="text-[11px] text-foreground flex items-center gap-1 font-medium pt-0.5">
              <AlertCircle className="size-3 shrink-0" />
              El motivo del rechazo es obligatorio.
            </p>
          )}
        </div>

        <DialogFooter className="gap-3 pt-3 sm:flex-row sm:justify-end sm:[&>*]:flex-none sm:[&>*]:w-auto">
          <Button
            type="button"
            variant="neutral"
            disabled={isSubmitting}
            onClick={() => onOpenChange(false)}
            className="h-10 px-5 text-xs font-semibold rounded-xl"
          >
            Cancelar
          </Button>

          <Button
            type="button"
            variant="danger"
            disabled={isSubmitting || isMotivoEmpty}
            onClick={handleReject}
            className="h-11 px-6 text-xs font-semibold gap-2 rounded-full shadow-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <XCircle className="size-4" />
                <span>Confirmar Rechazo</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
