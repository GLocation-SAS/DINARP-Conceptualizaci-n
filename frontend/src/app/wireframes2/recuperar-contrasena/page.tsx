"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAssetPath } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { WireframeAuthLayout } from "../components/wireframe-auth-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { ArrowRight, ArrowLeft, Loader2, AlertCircle } from "lucide-react";

export default function RecuperarContrasenaPage() {
  const router = useRouter();
  const [cedula, setCedula] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const inputVal = cedula.trim();
    if (!/^\d{10}$/.test(inputVal)) {
      setError("Ingresa un número de cédula válido (10 dígitos).");
      return;
    }

    setIsSubmitting(true);

    // Simulated network request
    setTimeout(() => {
      setIsSubmitting(false);
      // We simulate success without confirming existence, except for specific test cases if needed
      // Redirect to verification step
      router.push(`/wireframes2/verificar-recuperacion?cedula=${inputVal}`);
    }, 800);
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <h1 className="text-lg sm:text-xl font-heading font-bold text-primary tracking-tight">
              Recuperar contraseña
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Ingresa tu número de cédula para iniciar la recuperación de tu contraseña.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-xl flex items-start gap-2">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="recuperar-cedula" className="text-xs font-semibold text-foreground">
              Número de cédula
            </Label>
            <InputGroup className="bg-background border-border hover:border-primary/50 focus-within:border-primary h-11">
              <InputGroupInput
                id="recuperar-cedula"
                type="text"
                placeholder="Cédula (10 dígitos)"
                value={cedula}
                onChange={(e) => setCedula(e.target.value.replace(/\D/g, ""))}
                maxLength={10}
                className="text-xs sm:text-sm px-0"
                required
              />
            </InputGroup>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="default"
            disabled={isSubmitting || cedula.length !== 10}
            className="w-full text-xs font-semibold gap-2 shadow-xs"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <span>Continuar</span>
                <ArrowRight className="size-3.5" />
              </>
            )}
          </Button>

          <div className="pt-2">
            <Button
              type="button"
              variant="neutral"
              size="sm"
              onClick={() => router.push("/wireframes2/login")}
              className="w-full text-xs font-semibold gap-1.5"
            >
              <ArrowLeft className="size-3.5" />
              <span>Volver al acceso principal</span>
            </Button>
          </div>
        </form>
      </div>
    </WireframeAuthLayout>
  );
}
