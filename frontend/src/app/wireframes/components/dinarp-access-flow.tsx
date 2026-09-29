"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Clock3,
  Building2,
  Mail,
  RefreshCw,
  Send,
  XCircle,
  X,
  Check,
  Sparkles,
  FileSearch,
  FileUp,
  FileText,
  UploadCloud,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Stepper, type Step } from "@/components/ui/stepper";
import { type FileItemData } from "@/components/ui/file-input";
import { cn } from "@/lib/utils";

const REGISTRO_STEPS: Step[] = [
  { id: "1", title: "Datos", icon: Building2 },
  { id: "2", title: "Seguridad", icon: Lock },
  { id: "3", title: "Documentos", icon: FileUp },
];

const REQUIRED_DOCS = [
  {
    id: "coordinador",
    title: "Cambio de Coordinador institucional titular y/o suplente",
    description: "Designación o actualización firmada por la máxima autoridad.",
    sampleName: "Cambio_Coordinador_Institucional_Titular.pdf",
    sampleSize: "1.4 MB",
  },
  {
    id: "acuerdo",
    title: "Acuerdo de Uso y Confidencialidad",
    description: "Términos y condiciones para salvaguarda y custodia de datos.",
    sampleName: "Acuerdo_Uso_Confidencialidad_DINARP.pdf",
    sampleSize: "890 KB",
  },
  {
    id: "solicitud",
    title: "Solicitud de acceso al DINARP",
    description: "Formulario oficial de requerimiento de acceso al portal.",
    sampleName: "Solicitud_Acceso_DINARP_Firmada.pdf",
    sampleSize: "1.1 MB",
  },
];

type FlowStep =
  | "login"
  | "preregistro"
  | "estado_revision"
  | "estado_rechazado"
  | "otp";

interface DinarpAccessFlowProps {
  dashboardRoute?: string;
  className?: string;
}

export function DinarpAccessFlow({
  dashboardRoute = "/wireframes/dashboard",
  className = "",
}: DinarpAccessFlowProps) {
  const router = useRouter();

  // Current active step
  const [step, setStep] = useState<FlowStep>("login");

  // Login form state
  const [cedula, setCedula] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [hasInteractedCedula, setHasInteractedCedula] = useState(false);
  const [hasInteractedPassword, setHasInteractedPassword] = useState(false);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
  const [loginError, setLoginError] = useState<{
    type: "bad_credentials" | "not_registered" | "";
    message: string;
  }>({ type: "", message: "" });

  // Preregistration form state
  const [preCedula, setPreCedula] = useState("");
  const [preNombres, setPreNombres] = useState("");
  const [preApellidos, setPreApellidos] = useState("");
  const [preEmail, setPreEmail] = useState("");
  const [preInstitucion, setPreInstitucion] = useState("");
  const [prePassword, setPrePassword] = useState("");
  const [preConfirmPassword, setPreConfirmPassword] = useState("");
  const [showPrePassword, setShowPrePassword] = useState(false);
  const [showPreConfirmPassword, setShowPreConfirmPassword] = useState(false);
  const [preStep, setPreStep] = useState<number>(1);
  const [preDocs, setPreDocs] = useState<FileItemData[]>([]);

  // Preregistration touched states
  const [preTouched, setPreTouched] = useState<Record<string, boolean>>({});
  const [isSubmittingPre, setIsSubmittingPre] = useState(false);
  const [showPreSuccessModal, setShowPreSuccessModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Status review state
  const [consultarEstadoOpen, setConsultarEstadoOpen] = useState(false);
  const [customRejectionReason, setCustomRejectionReason] = useState("");

  // OTP State
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [isSubmittingOtp, setIsSubmittingOtp] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(45);
  const [isResending, setIsResending] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Simulation scenario floating helper
  const [isSimOpen, setIsSimOpen] = useState(false);

  // 45s countdown timer for OTP resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0 && step === "otp") {
      timer = setTimeout(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown, step]);

  // Validations
  const isCedulaValid = (val: string) => /^\d{10}$/.test(val);
  const isEmailValid = (val: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  // Password requirements
  const passLength = prePassword.length >= 8;
  const passUpper = /[A-Z]/.test(prePassword);
  const passNumber = /[0-9]/.test(prePassword);
  const passSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
    prePassword
  );
  const isPrePasswordValid =
    passLength && passUpper && passNumber && passSpecial;
  const isPreConfirmValid =
    preConfirmPassword.length > 0 && preConfirmPassword === prePassword;

  const isStep1Valid =
    isCedulaValid(preCedula) &&
    preNombres.trim().length >= 2 &&
    preApellidos.trim().length >= 2 &&
    isEmailValid(preEmail) &&
    preInstitucion.trim().length >= 3;

  const isStep2Valid = isPrePasswordValid && isPreConfirmValid;

  const isStep3Valid = preDocs.length >= 3 && preDocs.every((d) => d.status === "success");

  const isPreregistroFormValid = isStep1Valid && isStep2Valid && (preDocs.length >= 1);

  // Document upload handlers
  const handleDocSelect = (files: File[]) => {
    const newItems: FileItemData[] = files.map((f, i) => ({
      id: `doc-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
      file: f,
      status: "uploading",
      errorType: null,
      progress: 15,
    }));
    setPreDocs((prev) => [...prev, ...newItems]);

    // Simulate progressive upload
    newItems.forEach((item) => {
      let progress = 15;
      const interval = setInterval(() => {
        progress += 25;
        if (progress >= 100) {
          clearInterval(interval);
          setPreDocs((current) =>
            current.map((it) =>
              it.id === item.id ? { ...it, status: "success", progress: 100 } : it
            )
          );
        } else {
          setPreDocs((current) =>
            current.map((it) =>
              it.id === item.id ? { ...it, progress } : it
            )
          );
        }
      }, 200);
    });
  };

  const handleUploadForDoc = (docId: string, file: File) => {
    setPreDocs((prev) => {
      const filtered = prev.filter((d) => !d.id.includes(docId));
      return [
        ...filtered,
        {
          id: `doc-${docId}`,
          file,
          status: "success",
          progress: 100,
          errorType: null,
        },
      ];
    });
    toast.success(`Documento "${file.name}" cargado`);
  };

  const handleRemoveDocById = (docId: string) => {
    setPreDocs((prev) => prev.filter((d) => !d.id.includes(docId)));
  };

  const getUploadedDoc = (docId: string) => {
    return preDocs.find((d) => d.id.includes(docId) && d.status === "success");
  };

  // Masked email for 2FA
  const getMaskedEmail = () => {
    const rawEmail = preEmail || "usuario.institucional@dinarp.gob.ec";
    const [local, domain] = rawEmail.split("@");
    if (!domain) return "pau***@institucion.gob.ec";
    const visiblePrefix = local.slice(0, 3);
    return `${visiblePrefix}***@${domain}`;
  };

  // Handlers
  const handleCedulaInput = (val: string) => {
    const clean = val.replace(/\D/g, "").slice(0, 10);
    setCedula(clean);
    setLoginError({ type: "", message: "" });
    if (clean === "1712345602" && !password) {
      setPassword("Dinarp2026*");
    }
  };

  const handlePreCedulaInput = (val: string) => {
    const clean = val.replace(/\D/g, "").slice(0, 10);
    setPreCedula(clean);
  };

  const markTouched = (field: string) => {
    setPreTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasInteractedCedula(true);
    setHasInteractedPassword(true);

    if (!isCedulaValid(cedula)) return;
    if (!password && cedula !== "1712345602") return;

    setIsSubmittingLogin(true);
    setLoginError({ type: "", message: "" });

    // Cédula aprobada autorizada para ingreso directo
    if (cedula.trim() === "1712345602") {
      setTimeout(() => {
        setIsSubmittingLogin(false);
        toast.success("Identidad verificada", {
          description: "Bienvenida, Paula Andrea Mendoza Zambrano. Acceso concedido al sistema.",
        });
        setTimeout(() => {
          router.push(dashboardRoute);
        }, 500);
      }, 500);
      return;
    }

    setTimeout(() => {
      setIsSubmittingLogin(false);

      // 1. Revisar estado dinámico en dinarp_solicitudes_ingreso_v2
      try {
        const raw = localStorage.getItem("dinarp_solicitudes_ingreso_v2");
        if (raw) {
          const list = JSON.parse(raw);
          const matched = list.find((s: any) => s.cedula === cedula.trim());
          if (matched) {
            if (matched.estado === "Pendiente") {
              setStep("estado_revision");
              return;
            }
            if (matched.estado === "Rechazada") {
              setCustomRejectionReason(matched.motivoRechazo || "");
              setStep("estado_rechazado");
              return;
            }
            if (matched.estado === "Aprobada") {
              if (password === "error" || password === "123") {
                setLoginError({
                  type: "bad_credentials",
                  message: "La cédula o contraseña ingresada no es correcta.",
                });
                return;
              }
              setStep("otp");
              setOtp(Array(6).fill(""));
              setOtpError("");
              setOtpSuccess(false);
              setResendCountdown(45);
              toast.info("Código de verificación enviado", {
                description: `Se envió un código de 6 dígitos a ${matched.correo || getMaskedEmail()}`,
              });
              return;
            }
          }
        }
      } catch (e) {}

      // Simulation branches based on cedula (fallback)
      if (cedula === "1799999999") {
        // Pending approval scenario
        setStep("estado_revision");
        return;
      }
      if (cedula === "1788888888") {
        // Rejected scenario
        setStep("estado_rechazado");
        return;
      }
      if (cedula === "1777777777") {
        // Not registered scenario
        setLoginError({
          type: "not_registered",
          message:
            "No encontramos una solicitud de acceso asociada a esta cédula.",
        });
        return;
      }
      if (password === "error" || password === "123") {
        // Bad credentials scenario
        setLoginError({
          type: "bad_credentials",
          message: "La cédula o contraseña ingresada no es correcta.",
        });
        return;
      }

      // Approved user proceeds to 2FA
      setStep("otp");
      setOtp(Array(6).fill(""));
      setOtpError("");
      setOtpSuccess(false);
      setResendCountdown(45);
      toast.info("Código de verificación enviado", {
        description: `Se envió un código de 6 dígitos a ${getMaskedEmail()}`,
      });
    }, 800);
  };

  // Preregistration submit
  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStep1Valid) {
      setPreStep(1);
      setPreTouched({
        cedula: true,
        nombres: true,
        apellidos: true,
        email: true,
        institucion: true,
      });
      toast.error("Por favor completa los datos institucionales obligatorios (Paso 1).");
      return;
    }
    if (!isStep2Valid) {
      setPreStep(2);
      setPreTouched((prev) => ({ ...prev, password: true, confirmPassword: true }));
      toast.error("Por favor completa las credenciales de acceso (Paso 2).");
      return;
    }
    if (preDocs.length < 1) {
      setPreStep(3);
      toast.error("Debes cargar al menos un documento habilitante antes de enviar la solicitud (Paso 3).");
      return;
    }

    setIsSubmittingPre(true);
    setTimeout(() => {
      setIsSubmittingPre(false);
      setShowPreSuccessModal(true);

      // Persistir automáticamente en dinarp_solicitudes_ingreso_v2
      try {
        const raw = localStorage.getItem("dinarp_solicitudes_ingreso_v2");
        const list = raw ? JSON.parse(raw) : [];
        const cleanNombre = `${preNombres.trim()} ${preApellidos.trim()}`;
        const initials = `${preNombres.trim().charAt(0)}${preApellidos.trim().charAt(0)}`.toUpperCase();
        const now = new Date();
        const fechaStr = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

        const docNames = preDocs.length > 0
          ? preDocs.map((d) => d.file.name)
          : [
              "Cambio de Coordinador institucional titular y/o suplente",
              "Acuerdo de Uso y Confidencialidad",
              "Solicitud de acceso al DINARP",
            ];

        const existingIdx = list.findIndex((s: any) => s.cedula === preCedula.trim());
        const newEntry = {
          id: existingIdx >= 0 ? list[existingIdx].id : `SOL-ING-${String(list.length + 1).padStart(3, "0")}`,
          cedula: preCedula.trim(),
          nombres: preNombres.trim(),
          apellidos: preApellidos.trim(),
          nombreCompleto: cleanNombre,
          iniciales: initials,
          correo: preEmail.trim(),
          institucion: preInstitucion.trim(),
          fechaSolicitud: fechaStr,
          estado: "Pendiente",
          documentos: docNames,
        };
        if (existingIdx >= 0) {
          list[existingIdx] = newEntry;
        } else {
          list.unshift(newEntry);
        }
        localStorage.setItem("dinarp_solicitudes_ingreso_v2", JSON.stringify(list));
        window.dispatchEvent(new CustomEvent("dinarp_ingresos_updated", { detail: list }));
      } catch (e) {}
    }, 900);
  };

  // Cancel preregistration handlers
  const handleRequestCancel = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    setShowCancelModal(false);
    setPreCedula("");
    setPreNombres("");
    setPreApellidos("");
    setPreEmail("");
    setPreInstitucion("");
    setPrePassword("");
    setPreConfirmPassword("");
    setPreTouched({});
    setPreStep(1);
    setPreDocs([]);
    setStep("login");
  };

  // OTP handlers
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setOtpError("");

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newOtp = Array(6).fill("");
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    setOtpError("");
    if (pasted.length === 6) {
      otpRefs.current[5]?.focus();
    } else {
      otpRefs.current[pasted.length]?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) return;

    setIsSubmittingOtp(true);
    setOtpError("");

    setTimeout(() => {
      setIsSubmittingOtp(false);

      if (code === "000000") {
        setOtpError(
          "El código ingresado no es válido. Verifica e inténtalo nuevamente."
        );
        return;
      }
      if (code === "111111") {
        setOtpError("El código ha vencido. Solicita uno nuevo para continuar.");
        return;
      }

      // Valid OTP
      setOtpSuccess(true);
      toast.success("Identidad verificada", {
        description: "Acceso concedido al Portal de Interoperabilidad.",
      });

      setTimeout(() => {
        router.push(dashboardRoute);
      }, 1000);
    }, 800);
  };

  const handleResendOtp = () => {
    if (resendCountdown > 0 || isResending) return;

    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      setResendCountdown(45);
      setOtp(Array(6).fill(""));
      setOtpError("");
      toast.success("Nuevo código enviado", {
        description: `Enviamos un nuevo código a ${getMaskedEmail()}`,
      });
      otpRefs.current[0]?.focus();
    }, 800);
  };

  // Scenario quick switcher for UX reviewer
  const loadScenario = (
    type: "aprobado" | "pendiente" | "rechazado" | "no_registrado" | "error_cred"
  ) => {
    setLoginError({ type: "", message: "" });
    setStep("login");

    if (type === "aprobado") {
      setCedula("1712345602");
      setPassword("Dinarp2026*");
      setPreEmail("paula.mendoza@dinarp.gob.ec");
      toast.info("Escenario cargado: Usuario aprobado (1712345602)", {
        description: "Haz clic en 'Iniciar sesión' para ingresar directamente al sistema.",
      });
    } else if (type === "pendiente") {
      setCedula("1799999999");
      setPassword("Dinarp2026*");
      setPreEmail("juan.perez@msp.gob.ec");
      toast.info("Escenario cargado: Solicitud en revisión", {
        description: "Haz clic en 'Iniciar sesión' para ver el estado pendiente.",
      });
    } else if (type === "rechazado") {
      setCedula("1788888888");
      setPassword("Dinarp2026*");
      toast.info("Escenario cargado: Solicitud rechazada", {
        description: "Haz clic en 'Iniciar sesión' para ver el estado rechazado.",
      });
    } else if (type === "no_registrado") {
      setCedula("1777777777");
      setPassword("Dinarp2026*");
      toast.info("Escenario cargado: Cédula sin prerregistro", {
        description: "Verás el mensaje de solicitud no encontrada con CTA a Prerregistro.",
      });
    } else if (type === "error_cred") {
      setCedula("1712345602");
      setPassword("error");
      toast.info("Escenario cargado: Credenciales erróneas", {
        description: "Verás el mensaje genérico de error de autenticación.",
      });
    }
  };

  return (
    <div className={`w-full flex flex-col ${className}`}>
      {/* ── Botón Flotante a la Izquierda: Simulador de Escenarios UX (Estrellitas) ── */}
      <div className="fixed left-5 sm:left-7 bottom-6 z-50 flex flex-col items-start gap-2">
        {/* Panel Desplegable del Simulador */}
        {isSimOpen && (
          <div className="w-72 sm:w-80 p-4 rounded-2xl bg-card text-card-foreground border border-border shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-200 mb-2">
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-border/60">
              <span className="font-heading font-bold text-xs flex items-center gap-1.5 text-foreground">
                <Sparkles className="size-4 text-amber-500 fill-amber-500/20" />
                Simulador de Escenarios DINARP
              </span>
              <button
                type="button"
                onClick={() => setIsSimOpen(false)}
                className="text-muted-foreground hover:text-foreground rounded-md p-1 transition-colors"
                aria-label="Cerrar simulador"
              >
                <X className="size-3.5" />
              </button>
            </div>

            <p className="text-[11px] text-muted-foreground mb-3 leading-relaxed">
              Selecciona un caso para probar el flujo de acceso y seguridad:
            </p>

            <div className="flex flex-col gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  loadScenario("aprobado");
                  setIsSimOpen(false);
                }}
                className="justify-start h-8 text-xs px-2.5 font-medium hover:bg-muted"
              >
                <CheckCircle2 className="size-3.5 mr-2 text-emerald-500" />
                1. Usuario Aprobado (2FA)
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  loadScenario("pendiente");
                  setIsSimOpen(false);
                }}
                className="justify-start h-8 text-xs px-2.5 font-medium hover:bg-muted"
              >
                <Clock3 className="size-3.5 mr-2 text-amber-500" />
                2. Solicitud en Revisión
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  loadScenario("rechazado");
                  setIsSimOpen(false);
                }}
                className="justify-start h-8 text-xs px-2.5 font-medium hover:bg-muted"
              >
                <XCircle className="size-3.5 mr-2 text-destructive" />
                3. Solicitud Rechazada
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  loadScenario("no_registrado");
                  setIsSimOpen(false);
                }}
                className="justify-start h-8 text-xs px-2.5 font-medium hover:bg-muted"
              >
                <AlertCircle className="size-3.5 mr-2 text-amber-600" />
                4. Cédula sin Prerregistro
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  loadScenario("error_cred");
                  setIsSimOpen(false);
                }}
                className="justify-start h-8 text-xs px-2.5 font-medium hover:bg-muted"
              >
                <Lock className="size-3.5 mr-2 text-muted-foreground" />
                5. Error de Credenciales
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  setPreCedula("");
                  setPreNombres("");
                  setPreApellidos("");
                  setPreEmail("");
                  setPreInstitucion("");
                  setPrePassword("");
                  setPreConfirmPassword("");
                  setPreTouched({});
                  setPreStep(1);
                  setPreDocs([]);
                  setStep("preregistro");
                  setIsSimOpen(false);
                }}
                className="justify-start h-8 text-xs px-2.5 font-semibold text-primary mt-1"
              >
                <User className="size-3.5 mr-2" />
                Ir a Formulario Prerregistro
              </Button>
            </div>
          </div>
        )}

        {/* Botón Flotante con Estrellitas */}
        <button
          type="button"
          onClick={() => setIsSimOpen(!isSimOpen)}
          aria-label="Abrir simulador de escenarios"
          className="group relative flex items-center justify-center size-12 rounded-full bg-foreground text-background shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200 border-2 border-background/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
        >
          <Sparkles className="size-5 text-amber-400 group-hover:rotate-12 transition-transform" />
          <span className="sr-only">Simulador de escenarios</span>

          {/* Tooltip sutil al pasar cursor */}
          {!isSimOpen && (
            <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-popover text-popover-foreground text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-md border border-border whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Simular escenarios
            </span>
          )}
        </button>
      </div>

      {/* ══════════════════════════════════════════════════
          FASE 1: PANTALLA PRINCIPAL — INICIAR SESIÓN
         ══════════════════════════════════════════════════ */}
      {step === "login" && (
        <div className="animate-in fade-in duration-200">
          <div className="mb-6 text-left">
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight text-foreground">
              Inicia sesión
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 font-medium leading-relaxed">
              Ingresa con tu identidad registrada para acceder a los servicios
              habilitados para tu institución.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">
            {/* Mensajes de error en login */}
            {loginError.type === "bad_credentials" && (
              <div
                role="alert"
                className="flex items-start gap-2.5 p-3 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 text-xs sm:text-sm animate-in fade-in"
              >
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span>{loginError.message}</span>
              </div>
            )}

            {loginError.type === "not_registered" && (
              <div
                role="alert"
                className="flex flex-col gap-2 p-3.5 bg-amber-500/10 text-amber-900 dark:text-amber-200 rounded-xl border border-amber-500/20 text-xs sm:text-sm animate-in fade-in"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className="size-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                  <span>{loginError.message}</span>
                </div>
                <div className="pl-6 pt-1">
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setPreCedula(cedula);
                      setStep("preregistro");
                    }}
                    className="h-8 text-xs font-semibold gap-1.5"
                  >
                    <span>Solicitar acceso</span>
                    <ArrowRight className="size-3.5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Campo Cédula */}
            <div className="flex flex-col gap-1.5 text-left">
              <Label
                htmlFor="login-cedula"
                className="text-xs font-semibold text-foreground flex items-center justify-between"
              >
                <span>Número de cédula *</span>
                <span className="text-[11px] font-normal text-muted-foreground">
                  10 dígitos
                </span>
              </Label>
              <InputGroup
                size="default"
                state={
                  hasInteractedCedula && !isCedulaValid(cedula)
                    ? "error"
                    : "default"
                }
                leftIcon={<User className="size-4 text-muted-foreground" />}
                className="bg-background"
              >
                <InputGroupInput
                  id="login-cedula"
                  type="text"
                  inputMode="numeric"
                  placeholder="Ej. 1712345602"
                  value={cedula}
                  onChange={(e) => handleCedulaInput(e.target.value)}
                  onBlur={() => {
                    if (cedula) setHasInteractedCedula(true);
                  }}
                  required
                />
              </InputGroup>
              {hasInteractedCedula && cedula && !isCedulaValid(cedula) && (
                <p className="text-xs text-destructive font-medium mt-0.5 animate-in fade-in flex items-center gap-1">
                  <AlertCircle className="size-3 shrink-0" />
                  Ingresa un número de cédula válido de 10 dígitos.
                </p>
              )}
            </div>

            {/* Campo Contraseña */}
            <div className="flex flex-col gap-1.5 text-left">
              <Label
                htmlFor="login-password"
                className="text-xs font-semibold text-foreground"
              >
                Contraseña *
              </Label>
              <InputGroup
                size="default"
                state={
                  hasInteractedPassword && !password && cedula !== "1712345602" ? "error" : "default"
                }
                leftIcon={<Lock className="size-4 text-muted-foreground" />}
                className="bg-background"
              >
                <InputGroupInput
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLoginError({ type: "", message: "" });
                  }}
                  onBlur={() => {
                    if (password) setHasInteractedPassword(true);
                  }}
                  required
                />
                <InputGroupButton
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Ver contraseña"
                  }
                  className="text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </InputGroupButton>
              </InputGroup>
              {hasInteractedPassword && !password && cedula !== "1712345602" && (
                <p className="text-xs text-destructive font-medium mt-0.5 animate-in fade-in flex items-center gap-1">
                  <AlertCircle className="size-3 shrink-0" />
                  La contraseña es requerida.
                </p>
              )}
            </div>

            {/* Botón Principal Iniciar Sesión */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmittingLogin || !isCedulaValid(cedula) || (!password && cedula !== "1712345602")}
              className="w-full mt-2 font-semibold justify-center gap-2 h-11 text-sm rounded-xl disabled:opacity-50"
            >
              {isSubmittingLogin ? (
                <>
                  <Loader2 className="size-4 animate-spin shrink-0" />
                  <span>Validando credenciales...</span>
                </>
              ) : (
                <>
                  <span>Iniciar sesión</span>
                  <ArrowRight className="size-4 shrink-0" />
                </>
              )}
            </Button>

            {/* Opción secundaria: Prerregistro */}
            <div className="pt-3 border-t border-border flex flex-col items-center gap-3 text-center">
              <p className="text-xs sm:text-sm text-muted-foreground">
                ¿Aún no tienes acceso?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setPreCedula(cedula);
                    setStep("preregistro");
                  }}
                  className="font-semibold text-foreground underline-offset-4 hover:underline transition-colors"
                >
                  Solicitar acceso
                </button>
              </p>

              <div className="flex items-center justify-center gap-1.5 text-muted-foreground text-xs pt-2">
                <ShieldCheck className="size-3.5 shrink-0 text-primary" />
                <span>Autenticación y seguridad bajo estándares DINARP</span>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          FASE 2: PRERREGISTRO / SOLICITUD DE ACCESO (STEPPER 3 PASOS)
         ══════════════════════════════════════════════════ */}
      {step === "preregistro" && (
        <div className="animate-in fade-in duration-200">
          <div className="mb-4 text-left">
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight text-foreground">
              Solicitud de acceso
            </h2>
          </div>

          {/* Stepper del UI Kit */}
          <div className="py-2.5 mb-5 border-y border-border/60">
            <Stepper
              steps={REGISTRO_STEPS}
              activeStep={preStep - 1}
              onStepClick={(index) => {
                const targetStep = index + 1;
                if (targetStep === 1) {
                  setPreStep(1);
                } else if (targetStep === 2) {
                  if (isStep1Valid) {
                    setPreStep(2);
                  } else {
                    setPreTouched({
                      cedula: true,
                      nombres: true,
                      apellidos: true,
                      email: true,
                      institucion: true,
                    });
                    toast.error("Completa todos los campos obligatorios del Paso 1.");
                  }
                } else if (targetStep === 3) {
                  if (!isStep1Valid) {
                    setPreTouched({
                      cedula: true,
                      nombres: true,
                      apellidos: true,
                      email: true,
                      institucion: true,
                    });
                    toast.error("Completa los datos del Paso 1 primero.");
                  } else if (!isStep2Valid) {
                    setPreTouched((prev) => ({
                      ...prev,
                      password: true,
                      confirmPassword: true,
                    }));
                    toast.error("Completa las credenciales del Paso 2 primero.");
                  } else {
                    setPreStep(3);
                  }
                }
              }}
              size="sm"
              showBadge={false}
            />
          </div>

          <form onSubmit={handlePreSubmit} className="flex flex-col gap-4">
            {/* ── PASO 1: DATOS INSTITUCIONALES ── */}
            {preStep === 1 && (
              <div className="flex flex-col gap-4 animate-in fade-in duration-200">
                {/* Cédula */}
                <div className="flex flex-col gap-1 text-left">
                  <Label
                    htmlFor="pre-cedula"
                    className="text-xs font-semibold text-foreground flex items-center justify-between"
                  >
                    <span>Número de cédula *</span>
                    <span className="text-[11px] font-normal text-muted-foreground">
                      10 dígitos
                    </span>
                  </Label>
                  <InputGroup
                    size="default"
                    state={
                      preTouched.cedula && !isCedulaValid(preCedula)
                        ? "error"
                        : "default"
                    }
                    leftIcon={<User className="size-4 text-muted-foreground" />}
                    className="bg-background"
                  >
                    <InputGroupInput
                      id="pre-cedula"
                      type="text"
                      inputMode="numeric"
                      placeholder="Ej. 1712345602"
                      value={preCedula}
                      onChange={(e) => handlePreCedulaInput(e.target.value)}
                      onBlur={() => markTouched("cedula")}
                      required
                    />
                  </InputGroup>
                  {preTouched.cedula && !isCedulaValid(preCedula) && (
                    <p className="text-xs text-destructive font-medium mt-0.5 flex items-center gap-1">
                      <AlertCircle className="size-3 shrink-0" />
                      Ingresa una cédula válida de 10 dígitos.
                    </p>
                  )}
                </div>

                {/* Nombres y Apellidos en dos columnas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                  <div className="flex flex-col gap-1">
                    <Label
                      htmlFor="pre-nombres"
                      className="text-xs font-semibold text-foreground"
                    >
                      Nombres *
                    </Label>
                    <InputGroup
                      size="default"
                      state={
                        preTouched.nombres && preNombres.trim().length < 2
                          ? "error"
                          : "default"
                      }
                      className="bg-background"
                    >
                      <InputGroupInput
                        id="pre-nombres"
                        type="text"
                        placeholder="Ej. Paula Andrea"
                        value={preNombres}
                        onChange={(e) => setPreNombres(e.target.value)}
                        onBlur={() => markTouched("nombres")}
                        required
                      />
                    </InputGroup>
                    {preTouched.nombres && preNombres.trim().length < 2 && (
                      <p className="text-xs text-destructive font-medium mt-0.5 flex items-center gap-1">
                        <AlertCircle className="size-3 shrink-0" />
                        Campo requerido.
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <Label
                      htmlFor="pre-apellidos"
                      className="text-xs font-semibold text-foreground"
                    >
                      Apellidos *
                    </Label>
                    <InputGroup
                      size="default"
                      state={
                        preTouched.apellidos && preApellidos.trim().length < 2
                          ? "error"
                          : "default"
                      }
                      className="bg-background"
                    >
                      <InputGroupInput
                        id="pre-apellidos"
                        type="text"
                        placeholder="Ej. Mendoza Castro"
                        value={preApellidos}
                        onChange={(e) => setPreApellidos(e.target.value)}
                        onBlur={() => markTouched("apellidos")}
                        required
                      />
                    </InputGroup>
                    {preTouched.apellidos && preApellidos.trim().length < 2 && (
                      <p className="text-xs text-destructive font-medium mt-0.5 flex items-center gap-1">
                        <AlertCircle className="size-3 shrink-0" />
                        Campo requerido.
                      </p>
                    )}
                  </div>
                </div>

                {/* Correo Electrónico Institucional */}
                <div className="flex flex-col gap-1 text-left">
                  <Label
                    htmlFor="pre-email"
                    className="text-xs font-semibold text-foreground"
                  >
                    Correo electrónico institucional *
                  </Label>
                  <InputGroup
                    size="default"
                    state={
                      preTouched.email && !isEmailValid(preEmail)
                        ? "error"
                        : "default"
                    }
                    leftIcon={<Mail className="size-4 text-muted-foreground" />}
                    className="bg-background"
                  >
                    <InputGroupInput
                      id="pre-email"
                      type="email"
                      placeholder="usuario@institucion.gob.ec"
                      value={preEmail}
                      onChange={(e) => setPreEmail(e.target.value)}
                      onBlur={() => markTouched("email")}
                      required
                    />
                  </InputGroup>
                  {preTouched.email && !isEmailValid(preEmail) && (
                    <p className="text-xs text-destructive font-medium mt-0.5 flex items-center gap-1">
                      <AlertCircle className="size-3 shrink-0" />
                      Ingresa un correo electrónico válido.
                    </p>
                  )}
                </div>

                {/* Institución */}
                <div className="flex flex-col gap-1 text-left">
                  <Label
                    htmlFor="pre-institucion"
                    className="text-xs font-semibold text-foreground"
                  >
                    Institución *
                  </Label>
                  <InputGroup
                    size="default"
                    state={
                      preTouched.institucion && preInstitucion.trim().length < 3
                        ? "error"
                        : "default"
                    }
                    leftIcon={<Building2 className="size-4 text-muted-foreground" />}
                    className="bg-background"
                  >
                    <InputGroupInput
                      id="pre-institucion"
                      type="text"
                      placeholder="Ej. Ministerio de Salud Pública / Policía Nacional"
                      value={preInstitucion}
                      onChange={(e) => setPreInstitucion(e.target.value)}
                      onBlur={() => markTouched("institucion")}
                      required
                    />
                  </InputGroup>
                  {preTouched.institucion && preInstitucion.trim().length < 3 && (
                    <p className="text-xs text-destructive font-medium mt-0.5 flex items-center gap-1">
                      <AlertCircle className="size-3 shrink-0" />
                      Especifica la institución pública solicitante.
                    </p>
                  )}
                </div>

                {/* Acciones Paso 1 */}
                <div className="flex flex-col gap-2.5 pt-2">
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    onClick={() => {
                      if (!isStep1Valid) {
                        setPreTouched({
                          cedula: true,
                          nombres: true,
                          apellidos: true,
                          email: true,
                          institucion: true,
                        });
                        toast.error("Por favor completa todos los datos obligatorios.");
                        return;
                      }
                      setPreStep(2);
                    }}
                    className="w-full font-semibold justify-center gap-2 h-11 text-sm rounded-xl"
                  >
                    <span>Continuar a credenciales</span>
                    <ArrowRight className="size-4 shrink-0" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRequestCancel}
                    className="w-full text-xs text-muted-foreground hover:text-foreground"
                  >
                    Cancelar y volver
                  </Button>
                </div>
              </div>
            )}

            {/* ── PASO 2: CREDENCIALES DE ACCESO ── */}
            {preStep === 2 && (
              <div className="flex flex-col gap-4 animate-in fade-in duration-200">
                <div className="p-3 rounded-xl bg-muted/30 border border-border/60 text-xs flex items-center justify-between">
                  <div className="truncate">
                    <span className="text-[11px] text-muted-foreground block">Solicitante:</span>
                    <span className="font-semibold text-foreground truncate">
                      {preNombres || "Usuario"} {preApellidos || ""}
                    </span>
                  </div>
                  <Badge tone="neutral" appearance="outline" size="sm" className="font-mono text-[10px]">
                    {preCedula}
                  </Badge>
                </div>

                {/* Contraseña */}
                <div className="flex flex-col gap-1 text-left">
                  <Label
                    htmlFor="pre-password"
                    className="text-xs font-semibold text-foreground"
                  >
                    Contraseña *
                  </Label>
                  <InputGroup
                    size="default"
                    state={
                      preTouched.password && !isPrePasswordValid
                        ? "error"
                        : "default"
                    }
                    leftIcon={<Lock className="size-4 text-muted-foreground" />}
                    className="bg-background"
                  >
                    <InputGroupInput
                      id="pre-password"
                      type={showPrePassword ? "text" : "password"}
                      placeholder="Crea una contraseña segura"
                      value={prePassword}
                      onChange={(e) => setPrePassword(e.target.value)}
                      onBlur={() => markTouched("password")}
                      required
                    />
                    <InputGroupButton
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => setShowPrePassword(!showPrePassword)}
                      aria-label={
                        showPrePassword ? "Ocultar contraseña" : "Ver contraseña"
                      }
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {showPrePassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </InputGroupButton>
                  </InputGroup>

                  {/* Checklist de requisitos de contraseña visibles */}
                  <div className="p-2.5 rounded-lg bg-muted/40 border border-border/70 mt-1 flex flex-col gap-1 text-[11px]">
                    <span className="font-semibold text-muted-foreground">
                      Requisitos de seguridad:
                    </span>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-0.5">
                      <div
                        className={`flex items-center gap-1.5 ${
                          passLength
                            ? "text-emerald-600 dark:text-emerald-400 font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        {passLength ? (
                          <Check className="size-3.5 shrink-0" />
                        ) : (
                          <div className="size-1.5 rounded-full bg-muted-foreground shrink-0 ml-1 mr-0.5" />
                        )}
                        <span>Mínimo 8 caracteres</span>
                      </div>
                      <div
                        className={`flex items-center gap-1.5 ${
                          passUpper
                            ? "text-emerald-600 dark:text-emerald-400 font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        {passUpper ? (
                          <Check className="size-3.5 shrink-0" />
                        ) : (
                          <div className="size-1.5 rounded-full bg-muted-foreground shrink-0 ml-1 mr-0.5" />
                        )}
                        <span>Al menos una mayúscula</span>
                      </div>
                      <div
                        className={`flex items-center gap-1.5 ${
                          passNumber
                            ? "text-emerald-600 dark:text-emerald-400 font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        {passNumber ? (
                          <Check className="size-3.5 shrink-0" />
                        ) : (
                          <div className="size-1.5 rounded-full bg-muted-foreground shrink-0 ml-1 mr-0.5" />
                        )}
                        <span>Al menos un número</span>
                      </div>
                      <div
                        className={`flex items-center gap-1.5 ${
                          passSpecial
                            ? "text-emerald-600 dark:text-emerald-400 font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        {passSpecial ? (
                          <Check className="size-3.5 shrink-0" />
                        ) : (
                          <div className="size-1.5 rounded-full bg-muted-foreground shrink-0 ml-1 mr-0.5" />
                        )}
                        <span>Carácter especial (@$!%*?)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confirmar Contraseña */}
                <div className="flex flex-col gap-1 text-left">
                  <Label
                    htmlFor="pre-confirm"
                    className="text-xs font-semibold text-foreground"
                  >
                    Confirmar contraseña *
                  </Label>
                  <InputGroup
                    size="default"
                    state={
                      preTouched.confirmPassword && !isPreConfirmValid
                        ? "error"
                        : "default"
                    }
                    leftIcon={<Lock className="size-4 text-muted-foreground" />}
                    className="bg-background"
                  >
                    <InputGroupInput
                      id="pre-confirm"
                      type={showPreConfirmPassword ? "text" : "password"}
                      placeholder="Repite la contraseña"
                      value={preConfirmPassword}
                      onChange={(e) => setPreConfirmPassword(e.target.value)}
                      onBlur={() => markTouched("confirmPassword")}
                      required
                    />
                    <InputGroupButton
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() =>
                        setShowPreConfirmPassword(!showPreConfirmPassword)
                      }
                      aria-label={
                        showPreConfirmPassword
                          ? "Ocultar contraseña"
                          : "Ver contraseña"
                      }
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {showPreConfirmPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </InputGroupButton>
                  </InputGroup>
                  {preTouched.confirmPassword && !isPreConfirmValid && (
                    <p className="text-xs text-destructive font-medium mt-0.5 flex items-center gap-1">
                      <AlertCircle className="size-3 shrink-0" />
                      Las contraseñas no coinciden.
                    </p>
                  )}
                </div>

                {/* Acciones Paso 2 */}
                <div className="flex flex-col gap-2.5 pt-2">
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    onClick={() => {
                      if (!isStep2Valid) {
                        setPreTouched((prev) => ({
                          ...prev,
                          password: true,
                          confirmPassword: true,
                        }));
                        toast.error("Verifica que la contraseña cumpla los 4 requisitos y coincida.");
                        return;
                      }
                      setPreStep(3);
                    }}
                    className="w-full font-semibold justify-center gap-2 h-11 text-sm rounded-xl"
                  >
                    <span>Continuar a documentos</span>
                    <ArrowRight className="size-4 shrink-0" />
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="default"
                    onClick={() => setPreStep(1)}
                    className="w-full text-sm font-medium justify-center gap-2 h-11 rounded-xl"
                  >
                    <ArrowLeft className="size-4" />
                    <span>Volver a datos del solicitante</span>
                  </Button>
                </div>
              </div>
            )}

            {/* ── PASO 3: DOCUMENTACIÓN HABILITANTE (SIMPLIFICADO) ── */}
            {preStep === 3 && (
              <div className="flex flex-col gap-3.5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-1 border-b border-border/50">
                  <div>
                    <p className="text-xs font-bold text-foreground">
                      Documentos obligatorios
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Adjunta los 3 archivos en formato PDF
                    </p>
                  </div>
                  <Badge
                    tone={preDocs.length === 3 ? "success" : "neutral"}
                    appearance="soft"
                    size="sm"
                    className="font-mono text-[11px]"
                  >
                    {preDocs.length}/3 cargados
                  </Badge>
                </div>

                {/* Lista directa y limpia de los 3 documentos */}
                <div className="space-y-2.5">
                  {REQUIRED_DOCS.map((doc, idx) => {
                    const uploaded = getUploadedDoc(doc.id);
                    const isReady = Boolean(uploaded);

                    return (
                      <div
                        key={doc.id}
                        className={cn(
                          "p-3 rounded-xl border transition-all text-xs flex items-center justify-between gap-3",
                          isReady
                            ? "bg-emerald-500/5 border-emerald-500/30"
                            : "bg-surface border-border hover:border-primary/40"
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={cn(
                              "size-8 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs",
                              isReady
                                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {isReady ? <Check className="size-4" /> : idx + 1}
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-foreground text-xs truncate">
                              {doc.title}
                            </p>
                            {isReady ? (
                              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono truncate mt-0.5">
                                {uploaded?.file.name}
                              </p>
                            ) : (
                              <p className="text-[11px] text-muted-foreground truncate">
                                {doc.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-1.5">
                          {isReady ? (
                            <>
                              <Badge tone="success" appearance="soft" size="sm" className="text-[10px]">
                                Listo
                              </Badge>
                              <button
                                type="button"
                                onClick={() => handleRemoveDocById(doc.id)}
                                className="p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                                title="Eliminar archivo"
                              >
                                <X className="size-3.5" />
                              </button>
                            </>
                          ) : (
                            <label className="cursor-pointer">
                              <input
                                type="file"
                                accept=".pdf,application/pdf"
                                className="hidden"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) handleUploadForDoc(doc.id, f);
                                  e.target.value = "";
                                }}
                              />
                              <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-semibold text-[11px] transition-colors">
                                <UploadCloud className="size-3.5" />
                                <span>Subir PDF</span>
                              </span>
                            </label>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Acciones Paso 3 */}
                <div className="flex flex-col gap-2.5 pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmittingPre || preDocs.length < 1}
                    className="w-full font-semibold justify-center gap-2 h-11 text-sm rounded-xl disabled:opacity-50"
                  >
                    {isSubmittingPre ? (
                      <>
                        <Loader2 className="size-4 animate-spin shrink-0" />
                        <span>Enviando solicitud y documentos...</span>
                      </>
                    ) : (
                      <>
                        <Send className="size-4 shrink-0" />
                        <span>Enviar solicitud de acceso ({preDocs.length}/3)</span>
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="default"
                    onClick={() => setPreStep(2)}
                    className="w-full text-sm font-medium justify-center gap-2 h-11 rounded-xl"
                  >
                    <ArrowLeft className="size-4" />
                    <span>Volver a credenciales</span>
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          MODAL CONFIRMACIÓN CANCELAR PRERREGISTRO (UI KIT WARNING)
         ══════════════════════════════════════════════════ */}
      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent variant="warning" size="sm" showCloseButton={true}>
          <DialogHeader className="text-center">
            <DialogTitle className="text-lg font-heading font-bold text-foreground">
              ¿Cancelar solicitud de acceso?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              Estás a punto de salir del formulario de prerregistro. Se perderán los datos institucionales que hayas completado hasta el momento.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-2" stacked={true}>
            <Button
              type="button"
              variant="warning"
              onClick={handleConfirmCancel}
              className="w-full font-semibold"
            >
              Sí, cancelar solicitud
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCancelModal(false)}
              className="w-full font-medium"
            >
              Continuar con el registro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════
          FASE 4: MODAL CONFIRMACIÓN DE PRERREGISTRO
         ══════════════════════════════════════════════════ */}
      <Dialog
        open={showPreSuccessModal}
        onOpenChange={(open) => {
          if (!open) {
            setShowPreSuccessModal(false);
            setPreStep(1);
            setPreDocs([]);
            setStep("login");
          }
        }}
      >
        <DialogContent variant="success" size="sm" showCloseButton={false}>
          <DialogHeader className="text-center">
            <DialogTitle className="text-lg font-heading font-bold text-foreground">
              Solicitud de acceso enviada
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1 leading-relaxed">
              Tu solicitud fue enviada correctamente y será revisada por la
              Dirección de Gestión y Registro. Recibirás una notificación en tu
              correo electrónico cuando tu acceso sea aprobado o rechazado.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-2" showCloseButton={false}>
            <Button
              type="button"
              variant="success"
              onClick={() => {
                setShowPreSuccessModal(false);
                setPreStep(1);
                setPreDocs([]);
                setStep("login");
                setCedula(preCedula);
                setPassword("");
              }}
              className="w-full font-semibold"
            >
              Entendido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════
          FASE 5: ESTADO PENDIENTE DE APROBACIÓN
         ══════════════════════════════════════════════════ */}
      {step === "estado_revision" && (
        <div className="animate-in fade-in duration-200 text-left">
          <div className="size-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
            <Clock3 className="size-6" />
          </div>

          <div className="flex items-center gap-2 mb-2">
            <Badge tone="warning" appearance="soft" size="sm">
              En revisión técnica
            </Badge>
          </div>

          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight text-foreground">
            Solicitud en revisión
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground mt-2 font-medium leading-relaxed">
            Tu solicitud de acceso todavía está siendo revisada por la Dirección
            de Gestión y Registro. Te notificaremos por correo cuando exista una
            respuesta.
          </p>

          <div className="p-3.5 rounded-xl border border-border bg-muted/30 my-5 flex flex-col gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground font-medium">Trámite ref:</span>
              <span className="font-mono font-semibold text-foreground">
                SOL-DINARP-2026-0842
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground font-medium">Estado:</span>
              <span className="text-amber-600 dark:text-amber-400 font-semibold">
                Pendiente de Aprobación DGR
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground font-medium">Cédula:</span>
              <span className="font-medium text-foreground">{cedula}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground font-medium">Notificación:</span>
              <span className="font-medium text-foreground">
                {preEmail || "usuario.institucional@dinarp.gob.ec"}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={() => setConsultarEstadoOpen(true)}
              className="w-full font-semibold justify-center gap-1.5 text-xs h-10"
            >
              <FileSearch className="size-4" />
              <span>Consultar estado del trámite</span>
            </Button>

            <Button
              type="button"
              variant="primary"
              size="default"
              onClick={() => setStep("login")}
              className="w-full font-semibold justify-center gap-1.5 text-xs h-10"
            >
              <ArrowLeft className="size-4" />
              <span>Volver al inicio</span>
            </Button>
          </div>
        </div>
      )}

      {/* Modal Detalle de Consulta de Estado */}
      <Dialog
        open={consultarEstadoOpen}
        onOpenChange={setConsultarEstadoOpen}
      >
        <DialogContent className="sm:max-w-md bg-background border-border">
          <DialogHeader className="text-left">
            <DialogTitle className="text-foreground font-heading text-lg">
              Detalle de la solicitud de acceso
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs pt-1">
              Flujo de revisión en la Dirección de Gestión y Registro (DGR).
            </DialogDescription>
          </DialogHeader>

          <div className="py-2 flex flex-col gap-3 text-xs text-left">
            <div className="flex items-start gap-3">
              <div className="size-6 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="size-3.5" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  1. Prerregistro recibido
                </p>
                <p className="text-muted-foreground text-[11px]">
                  Datos y credenciales preliminares almacenados en cola de revisión.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="size-6 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
                <Clock3 className="size-3.5" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  2. Verificación de acreditación DGR
                </p>
                <p className="text-muted-foreground text-[11px]">
                  En curso. El equipo técnico valida la entidad requirente.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 opacity-60">
              <div className="size-6 rounded-full bg-muted border border-border flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[10px] font-bold">3</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  3. Aprobación y activación de 2FA
                </p>
                <p className="text-muted-foreground text-[11px]">
                  Se notificará por correo el enlace oficial para primer ingreso.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setConsultarEstadoOpen(false)}
              className="w-full sm:w-auto"
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ══════════════════════════════════════════════════
          FASE 6: ESTADO SOLICITUD RECHAZADA
         ══════════════════════════════════════════════════ */}
      {step === "estado_rechazado" && (
        <div className="animate-in fade-in duration-200 text-left">
          <div className="size-11 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-center mb-4">
            <XCircle className="size-6" />
          </div>

          <div className="flex items-center gap-2 mb-2">
            <Badge tone="danger" appearance="soft" size="sm">
              Trámite no aprobado
            </Badge>
          </div>

          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight text-foreground">
            Tu solicitud de acceso fue rechazada
          </h2>

          <div className="p-3.5 rounded-xl border border-destructive/20 bg-destructive/5 my-4 text-xs">
            <span className="font-semibold text-destructive block mb-1">
              Motivo informado por DGR:
            </span>
            <p className="text-muted-foreground leading-relaxed">
              {customRejectionReason ||
                "La entidad o dependencia indicada no cuenta con convenio de interoperabilidad vigente ni delegación formal en el catálogo nacional."}
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <Button
              type="button"
              variant="primary"
              size="default"
              onClick={() => {
                setPreCedula(cedula);
                setStep("preregistro");
              }}
              className="w-full font-semibold justify-center gap-1.5 text-xs h-10"
            >
              <RefreshCw className="size-3.5" />
              <span>Realizar nueva solicitud</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={() => setStep("login")}
              className="w-full font-semibold justify-center gap-1.5 text-xs h-10"
            >
              <ArrowLeft className="size-3.5" />
              <span>Volver al inicio de sesión</span>
            </Button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          FASE 7: DOBLE FACTOR DE AUTENTICACIÓN (2FA)
         ══════════════════════════════════════════════════ */}
      {step === "otp" && (
        <div className="animate-in fade-in duration-200 text-left">
          <div className="mb-6">
            <button
              type="button"
              onClick={() => setStep("login")}
              className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground mb-3 transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              <span>Volver al inicio de sesión</span>
            </button>

            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight text-foreground">
              Verifica tu identidad
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground mt-2 font-medium leading-relaxed">
              Enviamos un código de verificación al correo electrónico registrado:{" "}
              <strong className="text-foreground font-semibold">
                {getMaskedEmail()}
              </strong>
            </p>
          </div>

          {/* Quick code pills for demo convenience */}
          <div className="mb-4 p-2 rounded-lg bg-muted/40 border border-border text-[11px] flex items-center justify-between">
            <span className="text-muted-foreground">Probar códigos:</span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setOtp(["1", "2", "3", "4", "5", "6"]);
                  setOtpError("");
                }}
                className="px-2 py-0.5 rounded bg-background border border-border hover:bg-muted font-mono font-medium"
              >
                123456 (OK)
              </button>
              <button
                type="button"
                onClick={() => {
                  setOtp(["0", "0", "0", "0", "0", "0"]);
                  setOtpError("");
                }}
                className="px-2 py-0.5 rounded bg-background border border-border hover:bg-muted font-mono font-medium text-destructive"
              >
                000000 (Error)
              </button>
              <button
                type="button"
                onClick={() => {
                  setOtp(["1", "1", "1", "1", "1", "1"]);
                  setOtpError("");
                }}
                className="px-2 py-0.5 rounded bg-background border border-border hover:bg-muted font-mono font-medium text-amber-600 dark:text-amber-400"
              >
                111111 (Vencido)
              </button>
            </div>
          </div>

          <form onSubmit={handleOtpSubmit} className="flex flex-col gap-5">
            {/* Mensajes de error en código OTP */}
            {otpError && (
              <div
                role="alert"
                className="flex items-start gap-2.5 p-3 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 text-xs sm:text-sm animate-in fade-in"
              >
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span>{otpError}</span>
              </div>
            )}

            {/* Mensaje de éxito al validar */}
            {otpSuccess && (
              <div
                role="status"
                className="flex items-center gap-2.5 p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-500/20 text-xs sm:text-sm animate-in fade-in"
              >
                <CheckCircle2 className="size-4 shrink-0" />
                <span>Acceso verificado. Redirigiendo a la plataforma...</span>
              </div>
            )}

            {/* Componente OTP de 6 dígitos */}
            <div className="flex justify-center gap-2 sm:gap-2.5 my-1">
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
                  onPaste={handleOtpPaste}
                  aria-label={`Dígito ${index + 1} del código de verificación`}
                  className={`w-11 h-14 sm:w-12 sm:h-16 text-center text-lg sm:text-2xl font-bold bg-background shadow-none border-2 focus-visible:ring-0 focus-visible:border-primary px-0 rounded-xl transition-all ${
                    otpError ? "border-destructive text-destructive" : ""
                  }`}
                  required
                />
              ))}
            </div>

            {/* Sección de Reenvío de Código */}
            <div className="flex flex-col items-center gap-1.5 text-center text-xs">
              <span className="text-muted-foreground">
                ¿No recibiste el código?
              </span>
              {resendCountdown > 0 ? (
                <span className="font-medium text-muted-foreground">
                  Podrás solicitar un nuevo código en{" "}
                  <strong className="text-foreground font-mono">
                    00:{resendCountdown.toString().padStart(2, "0")}
                  </strong>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className="font-semibold text-foreground underline-offset-4 hover:underline inline-flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      <span>Reenviando...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="size-3.5" />
                      <span>Reenviar código</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Acciones principales */}
            <div className="flex flex-col gap-2.5 pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={
                  isSubmittingOtp || otpSuccess || otp.join("").length < 6
                }
                className="w-full font-semibold justify-center gap-2 h-11 text-sm rounded-xl disabled:opacity-50"
              >
                {isSubmittingOtp ? (
                  <>
                    <Loader2 className="size-4 animate-spin shrink-0" />
                    <span>Verificando código...</span>
                  </>
                ) : (
                  <>
                    <span>Continuar</span>
                    <ArrowRight className="size-4 shrink-0" />
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStep("login");
                  setOtp(Array(6).fill(""));
                  setOtpError("");
                }}
                className="w-full text-xs text-muted-foreground hover:text-foreground"
              >
                Volver al inicio de sesión
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
