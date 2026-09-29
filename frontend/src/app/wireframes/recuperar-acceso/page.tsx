"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Mail, ArrowRight, Check, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { getAssetPath } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  InputGroup,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Alert } from "@/components/ui/alert";
import { ThemeToggle } from "@/components/theme-toggle";
import { WireframeAuthLayout } from "../components/wireframe-auth-layout";

export default function WireframeRecuperarAccesoPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailState, setEmailState] = useState<"default" | "success" | "error">("default");
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const isEmailValid = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (!val.trim()) {
      setEmailState("default");
      return;
    }

    if (isEmailValid(val)) {
      setEmailState("success");
    } else if (hasInteracted) {
      setEmailState("error");
    }
  };

  const handleEmailBlur = () => {
    setHasInteracted(true);
    if (!email.trim()) {
      setEmailState("default");
      return;
    }

    if (isEmailValid(email)) {
      setEmailState("success");
    } else {
      setEmailState("error");
    }
  };

  const isFormValid = email.trim() !== "" && isEmailValid(email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailValid(email)) {
      setEmailState("error");
      setHasInteracted(true);
      return;
    }
    setShowSuccessModal(true);
  };

  const handleResend = () => {
    setShowSuccessModal(false);
    setTimeout(() => {
      setShowSuccessModal(true);
    }, 300);
  };

  return (
    <WireframeAuthLayout>
      {/* ── Cabecera Superior del Formulario: Logo DINARP + Modo Claro/Oscuro ── */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-border/60">
        <div className="flex items-center gap-3">
          <>
<img
            src={getAssetPath("/logo-horizontal.svg")}
            alt="Logo DINARP"
            className="dark:hidden h-8 w-auto max-w-[150px] object-contain dark:brightness-0 dark:invert"
          />
<img
            src={getAssetPath("/logo-horizontal-blanco.svg")}
            alt="Logo DINARP"
            className="hidden dark:block h-8 w-auto max-w-[150px] object-contain dark:brightness-0 dark:invert"
          />
</>
          <div className="h-5 w-px bg-border" />
          <span className="text-xs font-medium text-muted-foreground leading-tight">
            Portal Interoperabilidad
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
        </div>
      </div>

      {/* Título y subtítulo */}
      <div className="text-left mb-8">
        <h2 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight text-foreground">
          Recuperar acceso
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-2 font-medium">
          Ingresa tu correo institucional para restablecer tu contraseña.
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Campo Correo institucional */}
        <div className="flex flex-col gap-2 text-left">
          <Label
            htmlFor="recovery-email"
            className="text-xs sm:text-sm font-semibold text-foreground cursor-pointer"
          >
            Correo institucional
          </Label>
          <InputGroup
            size="default"
            state={emailState}
            leftIcon={<Mail className="size-4 text-muted-foreground" />}
            rightIcon={
              emailState === "success" ? (
                <CheckCircle2 className="size-4 text-foreground animate-in fade-in" />
              ) : emailState === "error" ? (
                <AlertCircle className="size-4 text-foreground animate-in fade-in" />
              ) : undefined
            }
            className="bg-background"
          >
            <InputGroupInput
              id="recovery-email"
              type="email"
              placeholder="nombre@institucion.gob.ec"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              onBlur={handleEmailBlur}
              required
            />
          </InputGroup>
          {emailState === "error" && (
            <p className="text-xs text-muted-foreground font-medium mt-0.5 animate-in fade-in slide-in-from-top-1">
              Ingresa un correo institucional válido (ej. nombre@institucion.gob.ec).
            </p>
          )}
          {emailState === "success" && (
            <p className="text-xs text-muted-foreground font-medium mt-0.5 animate-in fade-in slide-in-from-top-1">
              Formato de correo válido.
            </p>
          )}
          {emailState === "default" && (
            <p className="text-xs text-muted-foreground mt-0.5">
              Te enviaremos un enlace para crear una nueva contraseña.
            </p>
          )}
        </div>

        {/* Botón Enviar enlace */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={!isFormValid}
          className="w-full mt-2 font-semibold justify-center gap-2 h-12 text-sm sm:text-base rounded-xl disabled:opacity-50"
        >
          <span>Enviar enlace</span>
          <ArrowRight className="size-4 shrink-0" />
        </Button>

        {/* Botón Volver al inicio de sesión */}
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.push("/wireframes/login")}
          className="w-full font-semibold justify-center h-12 text-sm sm:text-base rounded-xl border-border text-foreground hover:bg-muted/30 transition-all"
        >
          Volver al inicio de sesión
        </Button>
      </form>

      {/* ── Modal Informativa de Éxito: Revisa tu correo ── */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent
          variant="standard"
          className="max-w-[440px] rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center bg-card border-border shadow-xl"
        >
          {/* Icono de check */}
          <div className="size-14 rounded-2xl bg-muted border border-border flex items-center justify-center text-foreground mb-3">
            <Check className="size-7 stroke-[2.5]" />
          </div>

          <DialogHeader className="flex flex-col items-center p-0 space-y-2">
            <DialogTitle className="font-heading font-extrabold text-2xl sm:text-3xl text-foreground text-center tracking-tight">
              Revisa tu correo
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground text-center leading-relaxed">
              Hemos enviado un enlace de recuperación a tu correo institucional. Úsalo para crear una nueva contraseña.
            </DialogDescription>
          </DialogHeader>

          {/* Alert de ayuda / spam */}
          <div className="w-full my-4">
            <Alert variant="info" icon={<Info className="size-4" />} className="text-left rounded-xl">
              <span className="text-xs text-foreground/90">
                Si no lo encuentras, revisa tu carpeta de spam o solicita un nuevo enlace.
              </span>
            </Alert>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col gap-2.5 w-full">
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={() => {
                setShowSuccessModal(false);
                router.push("/wireframes/restablecer-contrasena");
              }}
              className="w-full font-semibold justify-center h-11 text-sm rounded-xl"
            >
              Entendido
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleResend}
              className="w-full font-semibold justify-center h-11 text-sm rounded-xl border-border text-foreground hover:bg-muted/30"
            >
              Reenviar enlace
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </WireframeAuthLayout>
  );
}
