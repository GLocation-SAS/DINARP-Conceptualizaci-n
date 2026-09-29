"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Building2,
  Mail,
  UserCheck,
  KeyRound,
  FileText,
  UserPlus,
  RefreshCw,
  Search,
  Check,
  Info,
  Users,
  Landmark
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Card,
  CardTitle,
  CardDescription,
  CardDecorativeIcon,
} from "@/components/ui/card";
import { useSolicitudesIngresoStore } from "../acceso-seguridad/data/gestion-ingresos-store";
import { useAuthStore } from "../acceso-seguridad/data/auth-store";

interface DinarpWireframe2LoginFlowProps {
  dashboardRoute?: string;
}

export function DinarpWireframe2LoginFlow({
  dashboardRoute = "/wireframes2/catalogo-interoperabilidad",
}: DinarpWireframe2LoginFlowProps) {
  const router = useRouter();
  const { buscarPreregistroPorCedula } = useSolicitudesIngresoStore();
  const { login } = useAuthStore();

  // Modo principal:
  // 1. "login": Iniciar sesión para usuarios/coordinadores con cuenta activa
  // 2. "enrolamiento": Completar enrolamiento mediante validación de cédula preregistrada (Proceso B)
  const [activeTab, setActiveTab] = useState<"login" | "enrolamiento">("login");

  // Estado del Login
  const [cedula, setCedula] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Estado 2FA / OTP
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [isSubmittingOtp, setIsSubmittingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [resendCountdown, setResendCountdown] = useState(45);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Estado Verificación Enrolamiento (Proceso B)
  const [cedulaEnrolar, setCedulaEnrolar] = useState("");
  const [isSearchingPreregistro, setIsSearchingPreregistro] = useState(false);
  const [preregistroResultado, setPreregistroResultado] = useState<{
    buscado: boolean;
    valido: boolean;
    datos?: ReturnType<typeof buscarPreregistroPorCedula>;
    mensaje?: string;
  }>({ buscado: false, valido: false });

  // Countdown timer para 2FA
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0 && isOtpStep) {
      timer = setTimeout(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown, isOtpStep]);

  // Manejo de Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const inputVal = cedula.trim();
    const isCedula = /^\d{10}$/.test(inputVal);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputVal);

    if (!isCedula && !isEmail) {
      setLoginError("Ingresa un número de cédula válido (10 dígitos) o tu correo electrónico (ej. gestion.director@gmail.com).");
      return;
    }
    if (password.length < 4) {
      setLoginError("Ingresa tu contraseña.");
      return;
    }

    setIsSubmittingLogin(true);

    // Simular validación de credenciales
    setTimeout(() => {
      setIsSubmittingLogin(false);
      setIsOtpStep(true);
      toast.info("Código de seguridad 2FA enviado", {
        description: `Se remitió un código OTP al correo ${isEmail ? inputVal : "institucional registrado"}.`,
      });
    }, 500);
  };

  // Manejo de OTP
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      setOtpError("Ingresa el código completo de 6 dígitos.");
      return;
    }

    setIsSubmittingOtp(true);
    setOtpError("");

    setTimeout(() => {
      const loggedUser = login(cedula.trim());
      setIsSubmittingOtp(false);
      toast.success("Autenticación exitosa", {
        description: "Bienvenido al portal institucional del SINARP.",
      });

      const cleanInput = cedula.trim().toLowerCase();
      // Si entra como Director de Gestión o roles de gestión/normatividad, redirigir directo a asignación de solicitudes
      if (
        cleanInput === "gestion.director@gmail.com" ||
        cleanInput.includes("gestion.director") ||
        loggedUser?.email?.toLowerCase() === "gestion.director@gmail.com" ||
        loggedUser?.role === "DIR_GESTION" ||
        loggedUser?.role === "DIR_NORMATIVA" ||
        loggedUser?.role === "EQ_GESTION" ||
        loggedUser?.role === "EQ_NORMATIVA"
      ) {
        router.push("/wireframes2/asignacion-solicitudes");
      } else {
        router.push(dashboardRoute);
      }
    }, 600);
  };

  // Verificación de preregistro para enrolamiento (Proceso B)
  const handleBuscarPreregistro = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(cedulaEnrolar)) {
      toast.error("Número de cédula inválido", {
        description: "Debe ingresar los 10 dígitos de su cédula de identidad.",
      });
      return;
    }

    setIsSearchingPreregistro(true);

    setTimeout(() => {
      setIsSearchingPreregistro(false);
      const res = buscarPreregistroPorCedula(cedulaEnrolar);

      if (res.encontrado && res.tipo) {
        setPreregistroResultado({
          buscado: true,
          valido: true,
          datos: res,
        });
      } else {
        setPreregistroResultado({
          buscado: true,
          valido: false,
          mensaje:
            "No se encontró un prerregistro institucional activo con la cédula ingresada. La entidad debe realizar primero el proceso de solicitud de acceso institucional (Anexo A) o cambio de coordinador (Anexo C).",
        });
      }
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* ── CASO 1: FORMULARIO PRINCIPAL DE ACCESO ── */}
      {activeTab === "login" && !isOtpStep && (
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="space-y-1">
            <h1 className="text-lg sm:text-xl font-heading font-bold text-primary tracking-tight">
              Acceso al Portal de Interoperabilidad
            </h1>
          </div>

          {loginError && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-xl flex items-start gap-2">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Cédula */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="login-cedula" className="text-xs font-semibold text-foreground">
                Cédula o correo institucional
              </Label>
              <button
                type="button"
                onClick={() => {
                  setCedula("gestion.director@gmail.com");
                  setPassword("password123");
                }}
                className="text-[11px] font-medium text-primary hover:underline cursor-pointer"
              >
                Director Gestión (demo)
              </button>
            </div>
            <InputGroup className="bg-background border-border hover:border-primary/50 focus-within:border-primary h-11">
              <InputGroupInput
                id="login-cedula"
                type="text"
                placeholder="Cédula (10 dígitos) o correo institucional"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                className="text-xs sm:text-sm px-0"
                required
              />
            </InputGroup>
          </div>

          {/* Contraseña */}
          <div className="space-y-1.5">
            <Label htmlFor="login-password" className="text-xs font-semibold text-foreground">
              Contraseña
            </Label>
            <InputGroup className="bg-background border-border hover:border-primary/50 focus-within:border-primary h-11">
              <InputGroupInput
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="Ingresa tu contraseña"
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

          <Button
            type="submit"
            variant="primary"
            size="default"
            disabled={isSubmittingLogin}
            className="w-full text-xs font-semibold gap-2 shadow-xs"
          >
            {isSubmittingLogin ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Validando...</span>
              </>
            ) : (
              <>
                <span>Ingresar al Sistema</span>
                <ArrowRight className="size-3.5" />
              </>
            )}
          </Button>

          {/* ── Separador '¿Aún no tienes acceso?' ── */}
          <div className="relative pt-3 pb-1 text-center">
            <div className="absolute inset-0 flex items-center pt-2">
              <div className="w-full border-t border-border/60" />
            </div>
            <span className="relative bg-surface px-3 text-[11px] text-muted-foreground font-medium">
              ¿Aún no tienes acceso?
            </span>
          </div>

          {/* ── 2 CARDS DE ACCESO APROBADAS ── */}
          <div className="pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Card 1: Enrolamiento Coordinador */}
              <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-secondary/5 border border-secondary/20 transition-all duration-500 hover:-translate-y-1 hover:border-transparent !shadow-sm hover:!shadow-lg hover:shadow-secondary/20">
                {/* Border Spin */}
                <div className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,var(--color-secondary)_0%,var(--color-secondary)_85%,white_100%)] opacity-0 group-hover:opacity-100 group-hover:animate-[spin_6s_linear_infinite] z-0 pointer-events-none blur-[1px] transition-opacity duration-500" />
                
                {/* Background Mask */}
                <div className="absolute inset-[1px] bg-background rounded-[calc(1rem-1px)] z-[1] pointer-events-none" />

                {/* Hover Tint */}
                <div className="absolute inset-[1px] bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[calc(1rem-1px)] z-[2] pointer-events-none" />

                {/* Internal Diffused Glow that follows the border */}
                <div className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0%,transparent_85%,var(--color-secondary)_100%)] opacity-0 group-hover:opacity-30 group-hover:animate-[spin_6s_linear_infinite] z-[3] pointer-events-none blur-[80px] transition-opacity duration-500" />

                <div className="relative z-10 p-4 gap-3 h-full flex flex-col justify-between">
                  <div className="flex items-start gap-2 w-full relative z-20">
                    <div className="bg-secondary/10 text-secondary p-2.5 rounded-xl shrink-0 shadow-xs border border-secondary/10 group-hover:bg-secondary group-hover:text-white transition-colors duration-300">
                      <Users className="size-5" />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-xs sm:text-sm font-bold text-secondary leading-tight">
                        ¿Fuiste designado como Coordinador SINARP?
                      </CardTitle>
                      <CardDescription className="text-[11px] text-muted-foreground leading-snug font-normal line-clamp-3">
                        Completa tu prerregistro mediante el Anexo B si recibiste una invitación.
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={() => setActiveTab("enrolamiento")}
                    variant="secondary"
                    className="w-full mt-1 text-xs h-9 px-3 relative z-20 shadow-xs justify-center"
                  >
                    <span className="font-semibold text-[11px]">Completar prerregistro</span>
                    <ArrowRight className="size-4 ml-1 opacity-80" />
                  </Button>
                  <Users className="absolute -bottom-4 -right-3 size-24 text-secondary/5 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 -z-10 pointer-events-none" />
                </div>
              </div>

              {/* Card 2: Enrolamiento de Institución */}
              <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-neutral-500/5 border border-neutral-500/20 transition-all duration-500 hover:-translate-y-1 hover:border-transparent !shadow-sm hover:!shadow-lg hover:shadow-neutral-500/20">
                {/* Border Spin */}
                <div className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,var(--color-neutral-500)_0%,var(--color-neutral-500)_85%,white_100%)] opacity-0 group-hover:opacity-100 group-hover:animate-[spin_6s_linear_infinite] z-0 pointer-events-none blur-[1px] transition-opacity duration-500" />
                
                {/* Background Mask */}
                <div className="absolute inset-[1px] bg-background rounded-[calc(1rem-1px)] z-[1] pointer-events-none" />

                {/* Hover Tint */}
                <div className="absolute inset-[1px] bg-neutral-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[calc(1rem-1px)] z-[2] pointer-events-none" />

                {/* Internal Diffused Glow that follows the border */}
                <div className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0%,transparent_85%,#888_100%)] opacity-0 group-hover:opacity-30 group-hover:animate-[spin_6s_linear_infinite] z-[3] pointer-events-none blur-[80px] transition-opacity duration-500" />

                <div className="relative z-10 p-4 gap-3 h-full flex flex-col justify-between">
                  <div className="flex items-start gap-2 w-full relative z-20">
                    <div className="bg-neutral-500/10 text-neutral-500 p-2.5 rounded-xl shrink-0 shadow-xs border border-neutral-500/10 group-hover:bg-neutral-500 group-hover:text-white transition-colors duration-300">
                      <Landmark className="size-5" />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-xs sm:text-sm font-bold text-neutral-600 dark:text-neutral-300 leading-tight">
                        Enrolamiento de Institución al SINARP
                      </CardTitle>
                      <CardDescription className="text-[11px] text-muted-foreground leading-snug font-normal">
                        Solicita el registro <br />
                        para incorporar tu <br />
                        entidad al SINARP.
                      </CardDescription>
                    </div>
                  </div>
                  <Link href="/wireframes2/registro-institucion" className="w-full mt-1">
                    <Button
                      type="button"
                      variant="neutral"
                      className="w-full text-xs h-9 px-3 relative z-20 shadow-xs justify-center"
                    >
                      <span className="font-semibold text-[11px]">Solicitar enrolamiento</span>
                      <ArrowRight className="size-4 ml-1 opacity-80" />
                    </Button>
                  </Link>
                  <Landmark className="absolute -bottom-4 -right-3 size-24 text-neutral-500/5 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 -z-10 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ── CASO 2: VERIFICACIÓN Y ENROLAMIENTO (PROCESO B) ── */}
      {activeTab === "enrolamiento" && !isOtpStep && (
        <div className="space-y-4">
          <div className="space-y-1">
            <h1 className="text-lg font-bold font-heading text-foreground">
              Completar Enrolamiento de Coordinador
            </h1>
            <p className="text-xs text-muted-foreground">
              Ingresa la cédula del coordinador institucional para verificar el prerregistro aprobado y suscribir el Acuerdo de Confidencialidad (Anexo B).
            </p>
          </div>

          <form onSubmit={handleBuscarPreregistro} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="enrolar-cedula" className="text-xs font-semibold text-foreground">
                Cédula del Coordinador Designado
              </Label>
              <div className="flex gap-2">
                <InputGroup className="flex-1 bg-background border-border hover:border-primary/50 focus-within:border-primary h-11">
                  <InputGroupInput
                    id="enrolar-cedula"
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="Cédula de 10 dígitos"
                    value={cedulaEnrolar}
                    onChange={(e) => {
                      setCedulaEnrolar(e.target.value.replace(/\D/g, ""));
                      if (preregistroResultado.buscado) {
                        setPreregistroResultado({ buscado: false, valido: false });
                      }
                    }}
                    className="text-xs sm:text-sm font-mono px-0"
                    required
                  />
                </InputGroup>
                <Button
                  type="submit"
                  variant="outline"
                  size="default"
                  disabled={isSearchingPreregistro}
                  className="shrink-0 h-11 px-4 text-xs font-semibold gap-1.5"
                >
                  {isSearchingPreregistro ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Search className="size-3.5" />
                  )}
                  <span>Consultar</span>
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Cédulas de prueba precargadas: <code className="font-mono text-foreground font-semibold">1715489621</code> (Suplente MSP), <code className="font-mono text-foreground font-semibold">1712345602</code> (Titular DINARP).
              </p>
            </div>
          </form>

          {/* Resultado de Búsqueda */}
          {preregistroResultado.buscado && preregistroResultado.valido && preregistroResultado.datos && (
            <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-foreground" />
                  <span className="text-xs font-bold text-foreground">
                    Prerregistro Verificado
                  </span>
                </div>
                <Badge tone="neutral" appearance="soft" size="sm" className="border border-border text-foreground">
                  {preregistroResultado.datos.tipo}
                </Badge>
              </div>

              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-[11px] text-muted-foreground block">Funcionario:</span>
                  <span className="font-semibold text-foreground">{preregistroResultado.datos.nombreCompleto}</span>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground block">Institución:</span>
                  <span className="font-semibold text-foreground">{preregistroResultado.datos.institucion}</span>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground block">Cargo Institucional:</span>
                  <span className="font-semibold text-foreground">{preregistroResultado.datos.cargo}</span>
                </div>
              </div>

              {preregistroResultado.datos.yaEnrolado ? (
                <div className="p-3 rounded-lg bg-muted border border-border text-xs text-foreground flex items-center justify-between gap-2">
                  <span>Este coordinador ya cuenta con enrolamiento activo.</span>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setCedula(cedulaEnrolar);
                      setActiveTab("login");
                    }}
                    className="text-xs font-semibold shrink-0"
                  >
                    Ir al login
                  </Button>
                </div>
              ) : (
                <Button
                  asChild
                  variant="primary"
                  size="default"
                  className="w-full text-xs font-semibold gap-2 mt-2 shadow-xs"
                >
                  <Link href={`/wireframes2/enrolamiento-coordinador?cedula=${cedulaEnrolar}`}>
                    <span>Suscribir Acuerdo de Confidencialidad (Anexo B)</span>
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              )}
            </div>
          )}

          {preregistroResultado.buscado && !preregistroResultado.valido && (
            <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-xs space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 font-bold">
                <AlertCircle className="size-4 shrink-0" />
                <span>Prerregistro no encontrado</span>
              </div>
              <p className="text-[11px] leading-relaxed text-destructive/90">
                {preregistroResultado.mensaje}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── CASO 3: SEGUNDO FACTOR DE AUTENTICACIÓN (OTP / 2FA) ── */}
      {isOtpStep && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="space-y-1">
            <h1 className="text-lg font-bold font-heading text-primary">
              Verificación de Seguridad en Dos Pasos
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed text-balance">
              Hemos enviado un código temporal de 6 dígitos a tu correo
              <br />
              institucional registrado. Ingrésalo para autorizar tu sesión.
            </p>
          </div>

          {otpError && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0" />
              <span>{otpError}</span>
            </div>
          )}

          <div className="flex justify-between gap-2 my-4">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => {
                  otpRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                className="size-11 sm:size-12 text-center text-lg font-bold font-mono p-0"
              />
            ))}
          </div>

          <Button
            type="button"
            variant="primary"
            size="default"
            disabled={isSubmittingOtp || otp.join("").length !== 6}
            onClick={handleVerifyOtp}
            className="w-full text-xs font-semibold gap-2 shadow-xs"
          >
            {isSubmittingOtp ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Verificando código...</span>
              </>
            ) : (
              <>
                <span>Confirmar y Entrar</span>
                <Check className="size-4" />
              </>
            )}
          </Button>

          <div className="flex items-center justify-between pt-3 text-xs text-muted-foreground">
            <button
              type="button"
              disabled={resendCountdown > 0}
              onClick={() => {
                setResendCountdown(45);
                toast.success("Código reenviado", {
                  description: "Revisa tu bandeja de entrada o carpeta de spam.",
                });
              }}
              className="text-foreground hover:underline font-medium disabled:opacity-50 disabled:pointer-events-none"
            >
              {resendCountdown > 0
                ? `Reenviar código en ${resendCountdown}s`
                : "Reenviar código de acceso"}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOtpStep(false);
                setOtp(Array(6).fill(""));
              }}
              className="hover:underline"
            >
              Volver atrás
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
