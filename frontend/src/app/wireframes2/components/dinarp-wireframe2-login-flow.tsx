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
  Landmark,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowLeft
} from "lucide-react";

import { cn } from "@/lib/utils";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  const [showTestCases, setShowTestCases] = useState(false);
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

    // Verificar cuentas bloqueadas/suspendidas de prueba (según HU ID-03 e ID-04)
    if (inputVal === "1719876543" || inputVal === "patricio.alarcon@dinarp.gob.ec") {
      setLoginError("Acceso no autorizado: La cuenta institucional asociada se encuentra SUSPENDIDA. Contacta a Seguridad y Soporte DINARP.");
      return;
    }

    if (inputVal === "1708765432" || inputVal === "elena.villacis@dinarp.gob.ec") {
      setLoginError("Acceso no autorizado: La cuenta institucional ha sido RETIRADA del sistema (baja lógica). Contacta a la Dirección Administrativa.");
      return;
    }

    if (inputVal === "1723456789" || inputVal === "sofia.morales@dinarp.gob.ec") {
      setLoginError("Cuenta pendiente de activación: Revisa el enlace remitido a tu correo electrónico para establecer tus credenciales y vincular tu segundo factor TOTP.");
      return;
    }

    setIsSubmittingLogin(true);

    // Simular validación de credenciales
    setTimeout(() => {
      setIsSubmittingLogin(false);

      // Si se prueba contraseña incorrecta para testing
      if (password === "error" || password === "1234") {
        setLoginError("Credenciales de acceso incorrectas. Verifica tu identificación y contraseña.");
        return;
      }

      setIsOtpStep(true);
      toast.info("Verificación requerida", {
        description: "Abre Google Authenticator para ingresar el código de 6 dígitos.",
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
      // Contemplar casos de código incorrecto, vencido o ya utilizado
      if (fullOtp === "000000") {
        setIsSubmittingOtp(false);
        setOtpError("Código incorrecto. Verifica el número actual en tu aplicación Google Authenticator.");
        return;
      }

      if (fullOtp === "999999") {
        setIsSubmittingOtp(false);
        setOtpError("Código vencido o ya utilizado. Espera a que Google Authenticator genere uno nuevo.");
        return;
      }

      const loggedUser = login(cedula.trim());
      setIsSubmittingOtp(false);
      toast.success("Autenticación exitosa", {
        description: "Bienvenido al portal institucional del SINARP.",
      });

      const cleanInput = cedula.trim().toLowerCase();

      // Redirigir según rol
      if (
        cleanInput === "1799999999" ||
        cleanInput === "admin.portal@dinarp.gob.ec" ||
        cleanInput.includes("admin") ||
        loggedUser?.role === "ADMIN"
      ) {
        router.push("/wireframes2/usuarios");
      }
      // Redirigir al equipo / revisor de gestión o normatividad a su bandeja de solicitudes
      else if (
        cleanInput === "1111111111" ||
        cleanInput === "gestion.revisor@gmail.com" ||
        cleanInput.includes("gestion.revisor") ||
        loggedUser?.cedula === "1111111111" ||
        loggedUser?.email?.toLowerCase() === "gestion.revisor@gmail.com" ||
        loggedUser?.role === "EQ_GESTION"
      ) {
        router.push("/wireframes2/solicitudes-pendientes");
      } 
      // Si entra como Director de Gestión o Director de Normatividad, redirigir directo a asignación de solicitudes
      else if (
        cleanInput === "2222222222" ||
        cleanInput === "normativa.director@gmail.com" ||
        cleanInput.includes("normativa.director") ||
        cleanInput === "3333333333" ||
        cleanInput === "normativa.revisor@gmail.com" ||
        cleanInput.includes("normativa.revisor") ||
        cleanInput === "gestion.director@gmail.com" ||
        cleanInput.includes("gestion.director") ||
        loggedUser?.cedula === "2222222222" ||
        loggedUser?.cedula === "3333333333" ||
        loggedUser?.email?.toLowerCase() === "gestion.director@gmail.com" ||
        loggedUser?.email?.toLowerCase() === "normativa.director@gmail.com" ||
        loggedUser?.role === "DIR_GESTION" ||
        loggedUser?.role === "DIR_NORMATIVA" ||
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
            <div className="flex items-center justify-between flex-wrap gap-1">
              <Label htmlFor="login-cedula" className="text-xs font-semibold text-foreground">
                Cédula o correo institucional
              </Label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCedula("1799999999");
                    setPassword("admin2026*");
                  }}
                  className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
                >
                  Administrador (1799999999)
                </button>
                <span className="text-muted-foreground text-[10px]">·</span>
                <button
                  type="button"
                  onClick={() => {
                    setCedula("1111111111");
                    setPassword("password123");
                  }}
                  className="text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:underline cursor-pointer"
                >
                  Revisor Gestión
                </button>
                <span className="text-muted-foreground text-[10px]">·</span>
                <button
                  type="button"
                  onClick={() => {
                    setCedula("gestion.director@gmail.com");
                    setPassword("password123");
                  }}
                  className="text-[11px] font-medium text-muted-foreground hover:text-foreground hover:underline cursor-pointer"
                >
                  Director Gestión
                </button>
              </div>
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
                  <Link href="/wireframes2/enrolamiento-coordinador" className="w-full mt-1">
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full text-xs h-9 px-3 relative z-20 shadow-xs justify-center"
                    >
                      <span className="font-semibold text-[11px]">Completar prerregistro</span>
                      <ArrowRight className="size-4 ml-1 opacity-80" />
                    </Button>
                  </Link>
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
                        Enrolamiento de Institución <br /> al SINARP
                      </CardTitle>
                      <CardDescription className="text-[11px] text-muted-foreground leading-snug font-normal">
                        Solicita el registro para incorporar tu <br />
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
                Cédula de prueba designada: <code className="font-mono text-foreground font-semibold">4444444444</code> (GAD Cuenca · Titular). Invitación expirada: <code className="font-mono text-foreground font-semibold">9999999999</code>.
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
                    Invitación B Vigente Verificada
                  </span>
                </div>
                <Badge tone="neutral" appearance="soft" size="sm" className="border border-border text-foreground">
                  {preregistroResultado.datos.tipo}
                </Badge>
              </div>

              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-[11px] text-muted-foreground block">Coordinador Designado:</span>
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
                    <span>Completar Anexo B — Enrolamiento de Coordinador</span>
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
                <span>Invitación no válida o vencida</span>
              </div>
              <p className="text-[11px] leading-relaxed text-destructive/90">
                {preregistroResultado.mensaje || "No encontramos una invitación o designación activa asociada a esta cédula. La institución requirente debe haber completado el Anexo A previamente o generado la designación correspondiente."}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── PASO 2: VERIFICACIÓN DE IDENTIDAD CON GOOGLE AUTHENTICATOR ── */}
      {isOtpStep && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold font-heading text-primary">
                Verifica tu identidad
              </h1>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                Google Authenticator
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed text-balance">
              Abre Google Authenticator e ingresa el código de 6 dígitos que aparece asociado a tu cuenta.
            </p>
          </div>

          {otpError && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0" />
              <span>{otpError}</span>
            </div>
          )}

          <div className="flex justify-between gap-2 my-6 py-2">
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
                <span>Verificando credenciales...</span>
              </>
            ) : (
              <>
                <span>Verificar y acceder</span>
                <Check className="size-4" />
              </>
            )}
          </Button>

          {/* Ayuda discreta contextual mediante Accordion del UI Kit */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="ayuda-codigo" className="border border-border/70 rounded-xl px-3 py-0 bg-muted/15 data-[state=open]:bg-muted/25 data-[state=open]:border-primary/40 border-l-border/70 data-[state=open]:border-l-primary transition-all">
              <AccordionTrigger className="py-2.5 px-0 text-xs font-semibold text-primary hover:no-underline">
                <span className="flex items-center gap-2">
                  <Info className="size-4 shrink-0 text-primary" />
                  <span>¿Dónde encuentro mi código?</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-3 px-0 text-[11px] leading-relaxed text-muted-foreground border-t border-border/40 pt-2.5">
                Debes abrir la aplicación <strong>Google Authenticator</strong> en el teléfono móvil o dispositivo donde vinculaste previamente tu cuenta institucional. Allí verás el código temporal de 6 dígitos asociado al portal.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
            {otpError && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  setOtp(Array(6).fill(""));
                  setOtpError("");
                  otpRefs.current[0]?.focus();
                }}
                className="w-full sm:w-1/2 text-xs font-semibold gap-1.5"
              >
                <RefreshCw className="size-3.5" />
                <span>Reintentar</span>
              </Button>
            )}

            <Button
              type="button"
              variant="neutral"
              size="sm"
              onClick={() => {
                setIsOtpStep(false);
                setOtp(Array(6).fill(""));
                setOtpError("");
              }}
              className={cn(
                "text-xs font-semibold gap-1.5",
                otpError ? "w-full sm:w-1/2" : "w-full"
              )}
            >
              <ArrowLeft className="size-3.5" />
              <span>Volver al acceso principal</span>
            </Button>
          </div>
        </div>
      )}

      {/* Botón flotante inferior derecho para pruebas de 2FA (como en los otros módulos) */}
      {isOtpStep && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-2 sm:gap-3 max-w-[calc(100vw-2rem)]">
          {showTestCases ? (
            <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2 bg-surface/95 backdrop-blur-md p-2 rounded-2xl border border-border shadow-xl max-w-full animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="hidden sm:flex items-center gap-1.5 px-2 text-[11px] font-semibold text-muted-foreground border-r border-border/60 mr-1">
                <Sparkles className="size-3 text-primary shrink-0" />
                <span>Casos de prueba interactivos (HU)</span>
              </div>

              <Button
                type="button"
                variant="primary"
                size="default"
                onClick={() => {
                  setOtp(["1", "2", "3", "4", "5", "6"]);
                  setOtpError("");
                  toast.success("Código TOTP válido simulado (123456)");
                }}
                className="rounded-full px-3 sm:px-4 flex items-center gap-1.5 text-xs h-8 sm:h-9 shadow-xs"
              >
                <Check className="size-3.5" /> Código válido (123456)
              </Button>

              <Button
                type="button"
                variant="outline"
                size="default"
                onClick={() => {
                  setOtp(["0", "0", "0", "0", "0", "0"]);
                  setOtpError("Código incorrecto. Verifica el número actual en tu aplicación Google Authenticator.");
                  toast.error("Simulando código incorrecto");
                }}
                className="rounded-full px-3 sm:px-4 flex items-center gap-1.5 text-xs h-8 sm:h-9 border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                <AlertCircle className="size-3.5 text-destructive" /> Código incorrecto
              </Button>

              <Button
                type="button"
                variant="outline"
                size="default"
                onClick={() => {
                  setOtp(["9", "9", "9", "9", "9", "9"]);
                  setOtpError("Código vencido o ya utilizado. Espera a que Google Authenticator genere uno nuevo.");
                  toast.warning("Simulando código vencido o ya utilizado");
                }}
                className="rounded-full px-3 sm:px-4 flex items-center gap-1.5 text-xs h-8 sm:h-9 border-warning/30 text-warning-foreground hover:bg-warning/10"
              >
                <RefreshCw className="size-3.5 text-warning" /> Código vencido / utilizado
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowTestCases(false)}
                className="rounded-full size-8 shrink-0 hover:bg-muted text-muted-foreground hover:text-foreground ml-0.5"
                title="Contraer opciones de prueba"
              >
                <ChevronDown className="size-4" />
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowTestCases(true)}
              className="rounded-full px-3.5 py-1.5 shadow-lg flex items-center gap-2 text-xs bg-surface/95 backdrop-blur-md border border-border hover:bg-muted transition-all animate-in fade-in slide-in-from-bottom-2 duration-200"
              title="Desplegar opciones de prueba (HU)"
            >
              <Sparkles className="size-3.5 text-primary" />
              <span className="font-semibold text-foreground">Casos de prueba interactivos (HU)</span>
              <ChevronUp className="size-3.5 text-muted-foreground" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
