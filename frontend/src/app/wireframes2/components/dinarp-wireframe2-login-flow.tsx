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
  Info
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

interface DinarpWireframe2LoginFlowProps {
  dashboardRoute?: string;
}

export function DinarpWireframe2LoginFlow({
  dashboardRoute = "/wireframes2/catalogo-interoperabilidad",
}: DinarpWireframe2LoginFlowProps) {
  const router = useRouter();
  const { buscarPreregistroPorCedula } = useSolicitudesIngresoStore();

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

    if (!/^\d{10}$/.test(cedula)) {
      setLoginError("La cédula debe contener exactamente 10 dígitos numéricos.");
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
      // Simular usuario conocido de demo o acceso general
      setIsOtpStep(true);
      toast.info("Código de seguridad 2FA enviado", {
        description: "Se remitió un código OTP a tu correo institucional registrado.",
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
      setIsSubmittingOtp(false);
      toast.success("Autenticación exitosa", {
        description: "Bienvenido al portal institucional del SINARP.",
      });
      router.push(dashboardRoute);
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
      {/* ── Tabs de Navegación del Portal de Acceso ── */}
      {!isOtpStep && (
        <div className="grid grid-cols-2 p-1 bg-muted/60 rounded-xl border border-border/80">
          <button
            type="button"
            onClick={() => {
              setActiveTab("login");
              setLoginError("");
            }}
            className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "login"
                ? "bg-background text-foreground shadow-xs border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <KeyRound className="size-3.5" />
            <span>Iniciar sesión</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("enrolamiento");
              setLoginError("");
            }}
            className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "enrolamiento"
                ? "bg-background text-foreground shadow-xs border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserCheck className="size-3.5" />
            <span>Completar enrolamiento</span>
          </button>
        </div>
      )}

      {/* ── CASO 1: LOGIN HABITUAL (USUARIOS ACTIVOS) ── */}
      {activeTab === "login" && !isOtpStep && (
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="space-y-1">
            <h1 className="text-lg font-bold font-heading text-foreground">
              Acceso a la Plataforma
            </h1>
            <p className="text-xs text-muted-foreground">
              Ingresa con tu cédula y contraseña para coordinadores y usuarios con enrolamiento activo.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-xl flex items-start gap-2">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Cédula */}
          <div className="space-y-1.5">
            <Label htmlFor="login-cedula" className="text-xs font-semibold text-foreground">
              Cédula de Identidad
            </Label>
            <Input
              id="login-cedula"
              type="text"
              inputMode="numeric"
              maxLength={10}
              placeholder="10 dígitos de cédula"
              value={cedula}
              onChange={(e) => setCedula(e.target.value.replace(/\D/g, ""))}
              className="text-xs font-mono"
              required
            />
          </div>

          {/* Contraseña */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="login-password" className="text-xs font-semibold text-foreground">
                Contraseña
              </Label>
              <button
                type="button"
                onClick={() =>
                  toast.info("Recuperación de contraseña", {
                    description: "Se enviará un enlace de recuperación al correo institucional registrado.",
                  })
                }
                className="text-[11px] text-muted-foreground hover:text-foreground hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <InputGroup>
              <InputGroupInput
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-xs"
                required
              />
              <InputGroupButton
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar" : "Mostrar"}
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
                <span>Validando credenciales...</span>
              </>
            ) : (
              <>
                <span>Ingresar al Sistema</span>
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>

          {/* Separador y Acceso a Solicitud Institucional (Proceso A) */}
          <div className="pt-4 border-t border-border/70 space-y-3">
            <Card
              variant="featured"
              className="bg-muted/40 hover:bg-muted/60 border border-border/80 text-foreground transition-all duration-300"
              innerClassName="p-4 gap-2.5"
            >
              <div className="flex items-start gap-2.5 w-full">
                <Building2 className="size-4 text-foreground mt-0.5 shrink-0" />
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <CardTitle className="text-xs font-bold text-foreground">
                      ¿Tu institución aún no está registrada en el SINARP?
                    </CardTitle>
                    <Tooltip>
                      <TooltipTrigger
                        type="button"
                        aria-label="Información sobre la solicitud de registro institucional"
                        className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring p-0.5"
                      >
                        <Info className="size-3.5 shrink-0" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-xs">
                        Corresponde al Anexo A — “Solicitud de Acceso al Sistema Nacional de Registros Públicos” (ARP-R01).
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <CardDescription className="text-[11px] text-muted-foreground leading-relaxed font-normal">
                    Inicia la solicitud de registro institucional para incorporar a tu entidad al SINARP y designar a sus coordinadores.
                  </CardDescription>
                </div>
              </div>

              <Button
                asChild
                variant="outline"
                className="w-full text-xs font-semibold gap-2 mt-1 border-border text-foreground hover:bg-muted h-11 rounded-full shadow-xs"
              >
                <Link href="/wireframes2/registro-institucion">
                  <FileText className="size-3.5" />
                  <span>Iniciar solicitud de registro institucional</span>
                </Link>
              </Button>

              <CardDecorativeIcon>
                <Building2 className="size-28 text-foreground" />
              </CardDecorativeIcon>
            </Card>
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
                <Input
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
                  className="text-xs font-mono"
                  required
                />
                <Button
                  type="submit"
                  variant="outline"
                  size="default"
                  disabled={isSearchingPreregistro}
                  className="shrink-0 text-xs font-semibold gap-1.5"
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
            <h1 className="text-lg font-bold font-heading text-foreground">
              Verificación de Seguridad en Dos Pasos
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Hemos enviado un código temporal de 6 dígitos a tu correo institucional registrado. Ingrésalo para autorizar tu sesión.
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
