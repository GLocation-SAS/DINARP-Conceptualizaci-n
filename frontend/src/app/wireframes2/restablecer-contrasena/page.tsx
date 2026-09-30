"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAssetPath } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { WireframeAuthLayout } from "../components/wireframe-auth-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InputGroup, InputGroupInput, InputGroupButton } from "@/components/ui/input-group";
import { ArrowRight, Loader2, Eye, EyeOff, CheckCircle2, ShieldCheck } from "lucide-react";

export default function RestablecerContrasenaPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Validaciones básicas de contraseña
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;
  
  const isValid = hasMinLength && hasUppercase && hasNumber && hasSpecial && passwordsMatch;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);

    // Simulated network request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1000);
  };

  return (
    <WireframeAuthLayout imageSrc={getAssetPath("/fondo.png")} imageFit="contain">
      {/* ── Cabecera Superior ── */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-border/40">
        <div>
          <img
            src={getAssetPath("/logo-horizontal.svg")}
            alt="Logo DINARP"
            className="dark:hidden h-11 sm:h-12 w-auto max-w-[220px] sm:max-w-[240px] object-contain"
          />
          <img
            src={getAssetPath("/logo-horizontal-outline-blanco.svg")}
            alt="Logo DINARP"
            className="hidden dark:block h-11 sm:h-12 w-auto max-w-[220px] sm:max-w-[240px] object-contain opacity-90"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
        </div>
      </div>

      <div className="space-y-6">
        {isSuccess ? (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center text-center space-y-3 py-6">
              <div className="size-14 rounded-full bg-success/10 flex items-center justify-center mb-2 border border-success/20">
                <CheckCircle2 className="size-7 text-success" />
              </div>
              <h1 className="text-xl font-heading font-bold text-foreground">
                Contraseña restablecida correctamente
              </h1>
              <p className="text-sm text-muted-foreground text-balance max-w-[280px]">
                Tu contraseña ha sido actualizada y las sesiones anteriores han sido invalidadas por seguridad.
              </p>
            </div>
            <Button
              type="button"
              variant="primary"
              size="default"
              onClick={() => router.push("/wireframes2/login")}
              className="w-full text-xs font-semibold gap-2 shadow-xs"
            >
              <span>Ir al acceso principal</span>
              <ArrowRight className="size-4" />
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h1 className="text-lg sm:text-xl font-heading font-bold text-primary tracking-tight">
                Nueva contraseña
              </h1>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Ingresa y confirma tu nueva contraseña para acceder al sistema.
              </p>
            </div>

            <div className="space-y-4">
              {/* Nueva Contraseña */}
              <div className="space-y-1.5">
                <Label htmlFor="new-password" className="text-xs font-semibold text-foreground">
                  Nueva contraseña
                </Label>
                <InputGroup className="bg-background border-border hover:border-primary/50 focus-within:border-primary h-11">
                  <InputGroupInput
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu nueva contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-xs sm:text-sm px-0"
                    required
                  />
                  <InputGroupButton
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </InputGroupButton>
                </InputGroup>
              </div>

              {/* Confirmar Contraseña */}
              <div className="space-y-1.5">
                <Label htmlFor="confirm-password" className="text-xs font-semibold text-foreground">
                  Confirmar nueva contraseña
                </Label>
                <InputGroup className="bg-background border-border hover:border-primary/50 focus-within:border-primary h-11">
                  <InputGroupInput
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repite tu nueva contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="text-xs sm:text-sm px-0"
                    required
                  />
                  <InputGroupButton
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Ocultar contraseña" : "Ver contraseña"}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </InputGroupButton>
                </InputGroup>
              </div>
            </div>

            {/* Reglas de contraseña */}
            <div className="bg-muted/30 border border-border rounded-xl p-3 space-y-2.5">
              <div className="flex items-center gap-1.5 mb-1">
                <ShieldCheck className="size-4 text-primary" />
                <span className="text-[11px] font-semibold text-foreground">Requisitos de seguridad:</span>
              </div>
              <ul className="text-[10px] space-y-1.5">
                <li className="flex items-center gap-2">
                  <div className={`size-1.5 rounded-full ${hasMinLength ? "bg-success" : "bg-muted-foreground/30"}`} />
                  <span className={hasMinLength ? "text-success" : "text-muted-foreground"}>Mínimo 8 caracteres</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className={`size-1.5 rounded-full ${hasUppercase ? "bg-success" : "bg-muted-foreground/30"}`} />
                  <span className={hasUppercase ? "text-success" : "text-muted-foreground"}>Al menos una letra mayúscula</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className={`size-1.5 rounded-full ${hasNumber ? "bg-success" : "bg-muted-foreground/30"}`} />
                  <span className={hasNumber ? "text-success" : "text-muted-foreground"}>Al menos un número</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className={`size-1.5 rounded-full ${hasSpecial ? "bg-success" : "bg-muted-foreground/30"}`} />
                  <span className={hasSpecial ? "text-success" : "text-muted-foreground"}>Al menos un carácter especial (!@#$%^&*)</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className={`size-1.5 rounded-full ${passwordsMatch ? "bg-success" : "bg-muted-foreground/30"}`} />
                  <span className={passwordsMatch ? "text-success" : "text-muted-foreground"}>Las contraseñas coinciden</span>
                </li>
              </ul>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="default"
              disabled={isSubmitting || !isValid}
              className="w-full text-xs font-semibold gap-2 shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <span>Restablecer contraseña</span>
                  <ArrowRight className="size-3.5" />
                </>
              )}
            </Button>
          </form>
        )}
      </div>
    </WireframeAuthLayout>
  );
}
