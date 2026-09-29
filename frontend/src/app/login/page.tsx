"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Building2,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  InputGroup,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group";
import { ThemeToggle } from "@/components/theme-toggle";
import { getAssetPath } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailState, setEmailState] = useState<"default" | "success" | "error">("default");
  const [hasInteracted, setHasInteracted] = useState(false);

  const isCedulaValid = (val: string) => /^\d{10}$/.test(val.trim());
  const isEmailValid = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  const isIdentifierValid = (val: string) => isCedulaValid(val) || isEmailValid(val);

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (!val.trim()) {
      setEmailState("default");
      return;
    }

    if (val.trim() === "1712345602" && !password) {
      setPassword("Dinarp2026*");
    }

    if (isIdentifierValid(val)) {
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

    if (isIdentifierValid(email)) {
      setEmailState("success");
    } else {
      setEmailState("error");
    }
  };

  const isFormValid = email.trim() === "1712345602" || (email.trim() !== "" && isIdentifierValid(email) && (password.trim() !== "" || isCedulaValid(email)));

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isIdentifierValid(email)) {
      setEmailState("error");
      setHasInteracted(true);
      return;
    }
    toast.success("Acceso concedido", {
      description: "Bienvenida, Paula Andrea Mendoza Zambrano.",
    });
    router.push("/wireframes2/catalogo-interoperabilidad");
  };

  const handleGoogleLogin = () => {
    toast.info("Función en evaluación de diseño UX/UI", {
      className: "!w-auto !max-w-none whitespace-nowrap",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative">
      {/* ── Cabecera Superior Institucional (Único logo DINARP) ── */}
      <header className="w-full border-b border-border/50 bg-background/95 backdrop-blur-md px-6 sm:px-10 lg:px-14 py-3.5 flex items-center justify-between z-30">
        <div className="flex items-center gap-3.5">
          <span className="font-heading font-black text-2xl tracking-tight text-[#061d4a] dark:text-white">
            DINARP
          </span>
          <div className="h-5 w-px bg-border/80" />
          <span className="text-xs sm:text-sm font-medium text-muted-foreground leading-tight">
            Dirección Nacional de Registros Públicos
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </header>

      {/* ── Contenido Principal (Dos Columnas: 1920x1080 / Responsive) ── */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 xl:p-12">
        <div className="w-full max-w-[1500px] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center">

          {/* ══════════════════════════════════════════════════
              COLUMNA IZQUIERDA: Panel Azul Institucional
             ══════════════════════════════════════════════════ */}
          <section className="lg:col-span-7 xl:col-span-7 2xl:col-span-8 relative flex flex-col justify-between overflow-hidden rounded-3xl bg-primary text-primary-foreground p-8 sm:p-12 lg:p-14 shadow-xl min-h-[560px] lg:min-h-[640px]">
            {/* Imagen de fondo institucional /fondo.png */}
            <img
              src={getAssetPath("/fondo.png")}
              alt="Fondo Institucional DINARP"
              className="absolute inset-0 w-full h-full object-contain object-center z-0 opacity-30 pointer-events-none select-none"
            />
            {/* Fondo con resplandor ambiental */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl pointer-events-none" />

            {/* Encabezado y Descripción */}
            <div className="relative z-10 flex flex-col items-start text-left max-w-2xl">
              <div className="w-9 h-1 bg-secondary rounded-full mb-6" />

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-white leading-[1.15] mb-4">
                La información pública, <br className="hidden sm:inline" />
                conectada con propósito.
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-blue-100/85 font-normal leading-relaxed">
                Solicita datos de otras instituciones, gestiona autorizaciones y sigue cada intercambio desde un solo lugar.
              </p>
            </div>

            {/* Secuencia de 4 Tarjetas Conectadas y Centradas */}
            <div className="relative z-10 my-8 sm:my-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 relative">

                {/* Conector horizontal para pantallas grandes */}
                <div className="hidden xl:block absolute top-[40px] left-[12%] right-[12%] h-[2px] bg-blue-400/25 z-0" />

                {/* Tarjeta 1: Entidad solicitante */}
                <div className="relative z-10 rounded-2xl border border-blue-400/20 bg-blue-950/40 backdrop-blur-md p-5 flex flex-col items-center text-center gap-3 transition-transform hover:-translate-y-0.5">
                  <div className="size-11 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-cyan-300 shrink-0">
                    <Building2 className="size-5" />
                  </div>
                  <div className="flex flex-col items-center w-full">
                    <p className="text-sm font-bold text-white text-center leading-tight">
                      Entidad solicitante
                    </p>
                    <div className="flex flex-col items-center gap-1.5 mt-3">
                      <div className="h-1.5 w-16 bg-blue-300/30 rounded-full" />
                      <div className="h-1.5 w-10 bg-blue-300/15 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Tarjeta 2: Datos requeridos: Registro Civil */}
                <div className="relative z-10 rounded-2xl border border-blue-400/20 bg-blue-950/40 backdrop-blur-md p-5 flex flex-col items-center text-center gap-3 transition-transform hover:-translate-y-0.5">
                  <div className="size-11 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-cyan-300 shrink-0">
                    <FileText className="size-5" />
                  </div>
                  <div className="flex flex-col items-center w-full">
                    <p className="text-sm font-bold text-white text-center leading-tight">
                      Datos requeridos
                    </p>
                    <p className="text-xs text-blue-200/80 font-medium text-center mt-0.5">
                      Registro Civil
                    </p>
                    <div className="flex flex-col items-center gap-1.5 mt-2.5">
                      <div className="h-1.5 w-16 bg-blue-300/30 rounded-full" />
                      <div className="h-1.5 w-10 bg-blue-300/15 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Tarjeta 3: Revisión DINARP */}
                <div className="relative z-10 rounded-2xl border border-blue-400/20 bg-blue-950/40 backdrop-blur-md p-5 flex flex-col items-center text-center gap-3 transition-transform hover:-translate-y-0.5">
                  <div className="size-11 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-cyan-300 shrink-0">
                    <ShieldCheck className="size-5" />
                  </div>
                  <div className="flex flex-col items-center w-full">
                    <p className="text-sm font-bold text-white text-center leading-tight">
                      Revisión DINARP
                    </p>
                    <div className="flex flex-col items-center gap-1.5 mt-3">
                      <div className="h-1.5 w-16 bg-blue-300/30 rounded-full" />
                      <div className="h-1.5 w-10 bg-blue-300/15 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Tarjeta 4: Intercambio autorizado */}
                <div className="relative z-10 rounded-2xl border border-teal-400/30 bg-blue-950/40 backdrop-blur-md p-5 flex flex-col items-center text-center gap-3 transition-transform hover:-translate-y-0.5 shadow-sm">
                  <div className="size-11 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 shrink-0">
                    <CheckCircle2 className="size-5" />
                  </div>
                  <div className="flex flex-col items-center w-full">
                    <p className="text-sm font-bold text-white text-center leading-tight">
                      Intercambio autorizado
                    </p>
                    <div className="flex flex-col items-center gap-1.5 mt-3">
                      <div className="h-1.5 w-16 bg-teal-400/40 rounded-full" />
                      <div className="h-1.5 w-10 bg-teal-400/20 rounded-full" />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Parte Inferior: Mensaje y Constelación */}
            <div className="relative z-10 pt-4 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 border-t border-blue-400/15">
              <div>
                <p className="text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-blue-200/75">
                  Instituciones que trabajan por un Ecuador más conectado
                </p>
                <div className="w-8 h-0.5 bg-cyan-400 mt-2" />
              </div>

              <div className="flex items-center gap-3 text-[10px] tracking-widest uppercase text-blue-300/60 font-medium">
                <span>DATOS</span>
                <span>•</span>
                <span>INSTITUCIONES</span>
                <span>•</span>
                <span>SERVICIOS</span>
                <span>•</span>
                <span>CIUDADANÍA</span>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════
              COLUMNA DERECHA: Formulario Blanco de Acceso
             ══════════════════════════════════════════════════ */}
          <section className="lg:col-span-5 xl:col-span-5 2xl:col-span-4 w-full flex justify-center">
            <div className="w-full max-w-[440px] rounded-3xl border border-border/80 bg-card p-7 sm:p-10 shadow-sm flex flex-col">

              {/* Título y subtítulo */}
              <div className="mb-8 text-left">
                <h2 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight text-foreground">
                  Ingresa al portal
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground mt-2 font-medium">
                  Accede con tu cuenta institucional.
                </p>
              </div>

              {/* Formulario */}
              <form onSubmit={handleLogin} className="flex flex-col gap-5">
                {/* Correo institucional */}
                <div className="flex flex-col gap-2 text-left">
                  <Label
                    htmlFor="institutional-email"
                    className="text-xs sm:text-sm font-semibold text-foreground cursor-pointer"
                  >
                    Cédula o correo institucional
                  </Label>
                  <InputGroup
                    state={emailState}
                    leftIcon={<User className="size-4 text-muted-foreground" />}
                    rightIcon={
                      emailState === "success" ? (
                        <CheckCircle2 className="size-4 text-success animate-in fade-in" />
                      ) : emailState === "error" ? (
                        <AlertCircle className="size-4 text-danger animate-in fade-in" />
                      ) : undefined
                    }
                    className="bg-background"
                  >
                    <InputGroupInput
                      id="institutional-email"
                      type="text"
                      placeholder="1712345602 o nombre@institucion.gob.ec"
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      onBlur={handleEmailBlur}
                      required
                    />
                  </InputGroup>
                  {emailState === "error" && (
                    <p className="text-xs text-danger font-medium mt-0.5 animate-in fade-in slide-in-from-top-1">
                      Ingresa una cédula de 10 dígitos (ej. 1712345602) o correo institucional válido.
                    </p>
                  )}
                  {emailState === "success" && (
                    <p className="text-xs text-success font-medium mt-0.5 animate-in fade-in slide-in-from-top-1">
                      Identificación válida.
                    </p>
                  )}
                </div>

                {/* Contraseña */}
                <div className="flex flex-col gap-2 text-left">
                  <Label
                    htmlFor="institutional-password"
                    className="text-xs sm:text-sm font-semibold text-foreground cursor-pointer"
                  >
                    Contraseña
                  </Label>
                  <InputGroup
                    leftIcon={<Lock className="size-4 text-muted-foreground" />}
                    className="bg-background"
                  >
                    <InputGroupInput
                      id="institutional-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </InputGroupButton>
                  </InputGroup>

                  <div className="flex justify-end mt-1">
                    <Link
                      href="/wireframes/recuperar-acceso"
                      className="text-xs sm:text-sm text-primary hover:underline font-medium transition-colors"
                    >
                      ¿Olvidaste tu contraseña?
                    </Link>
                  </div>
                </div>

                {/* Botón Iniciar sesión */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={!isFormValid}
                  className="w-full mt-2 font-semibold justify-center gap-2 h-12 text-sm sm:text-base rounded-xl bg-[#061d4a] hover:bg-[#0a2f77] dark:bg-primary dark:hover:bg-primary/90 text-white shadow-sm disabled:opacity-50"
                >
                  <span>Iniciar sesión</span>
                  <ArrowRight className="size-4 shrink-0" />
                </Button>

                {/* Botón Iniciar sesión con Google */}
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleGoogleLogin}
                  className="w-full font-semibold justify-center gap-2.5 h-12 text-sm sm:text-base rounded-xl border-border/80 text-foreground hover:bg-muted/30 transition-all"
                >
                  <svg className="size-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>Iniciar sesión con Google</span>
                </Button>

                {/* Divisor institucional inferior */}
                <div className="flex items-center gap-3 w-full my-2">
                  <div className="flex-1 h-px bg-border/60" />
                  <span className="text-xs text-muted-foreground/80 font-normal text-center">
                    Acceso para instituciones autorizadas.
                  </span>
                  <div className="flex-1 h-px bg-border/60" />
                </div>
              </form>

            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
