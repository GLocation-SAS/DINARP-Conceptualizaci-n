"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { getAssetPath } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  InputGroup,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { WireframeAuthLayout } from "../components/wireframe-auth-layout";
import { ThemeToggle } from "@/components/theme-toggle";

export default function WireframeRestablecerContrasenaPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccessModal(true);
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
          Restablecer contraseña
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-2 font-medium">
          Crea una nueva contraseña para acceder al sistema.
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Nueva contraseña */}
        <div className="flex flex-col gap-2 text-left">
          <Label
            htmlFor="new-password"
            className="text-xs sm:text-sm font-semibold text-foreground cursor-pointer"
          >
            Nueva contraseña
          </Label>
          <InputGroup
            size="default"
            leftIcon={<Lock className="size-4 text-muted-foreground" />}
            className="bg-background"
          >
            <InputGroupInput
              id="new-password"
              type={showPassword ? "text" : "password"}
              placeholder="Ingresa tu nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            <InputGroupButton
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
              className="text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </InputGroupButton>
          </InputGroup>
        </div>

        {/* Confirmar contraseña */}
        <div className="flex flex-col gap-2 text-left">
          <Label
            htmlFor="confirm-password"
            className="text-xs sm:text-sm font-semibold text-foreground cursor-pointer"
          >
            Confirmar contraseña
          </Label>
          <InputGroup
            size="default"
            leftIcon={<Lock className="size-4 text-muted-foreground" />}
            className="bg-background"
          >
            <InputGroupInput
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirma tu nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
            />
            <InputGroupButton
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Ocultar contraseña" : "Ver contraseña"}
              className="text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </InputGroupButton>
          </InputGroup>
          <p className="text-xs text-muted-foreground mt-0.5">
            La contraseña debe contener al menos 8 caracteres.
          </p>
        </div>

        {/* Botón Guardar nueva contraseña */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2 font-semibold justify-center gap-2 h-12 text-sm sm:text-base rounded-xl"
        >
          <span>Guardar nueva contraseña</span>
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

      {/* ── Modal Informativa de Éxito: Contraseña actualizada ── */}
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
              Contraseña actualizada
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground text-center leading-relaxed">
              Tu contraseña ha sido restablecida correctamente. Ya puedes iniciar sesión con tus nuevas credenciales.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 w-full">
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={() => {
                setShowSuccessModal(false);
                router.push("/wireframes/login");
              }}
              className="w-full font-semibold justify-center h-11 text-sm rounded-xl"
            >
              Ir al inicio de sesión
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </WireframeAuthLayout>
  );
}
