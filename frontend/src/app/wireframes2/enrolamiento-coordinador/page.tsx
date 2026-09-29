"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  FileText,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Building2,
  AlertCircle,
  Clock,
  Sparkles,
  Lock,
  Check,
  KeyRound,
  FileCheck2,
  Home,
  ChevronDown,
  Search,
  XCircle,
  Eye,
  RefreshCw,
  FileSignature,
  History,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  User,
  CheckSquare
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { InputGroup, InputGroupInput, InputGroupButton } from "@/components/ui/input-group";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Stepper, type Step as StepperStep } from "@/components/ui/stepper";
import { FormField } from "@/components/ui/form-field";
import { Card, CardTitle, CardDescription, CardDecorativeIcon, CardBadge } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Timeline, type TimelineItem } from "@/components/ui/timeline";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

import { cn, getAssetPath } from "@/lib/utils";
import {
  useSolicitudesIngresoStore,
  getEstadoBadgeProps,
  type SolicitudIngreso,
  type DatosAnexoB
} from "../acceso-seguridad/data/gestion-ingresos-store";
import { MOCK_USERS_BY_ROLE, type UserRole, ROLES_CONFIG } from "../catalogo-interoperabilidad/data/catalogo-data";
import { WireframeRoleSelector } from "../components/wireframe-role-selector";
import { WireframeUserMenu } from "../components/wireframe-user-menu";

function EnrolamientoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const store = useSolicitudesIngresoStore();
  const {
    solicitudes,
    buscarPreregistroPorCedula,
    agregarEnrolamientoCoordinador,
    aprobarSolicitud,
    rechazarSolicitud
  } = store;

  // Rol simulado: COORDINADOR_SINARP vs DIR_GESTION / EQ_GESTION
  const [simulatedRole, setSimulatedRole] = useState<UserRole>("COORDINADOR_SINARP");
  const currentUser = MOCK_USERS_BY_ROLE[simulatedRole] || MOCK_USERS_BY_ROLE.COORDINADOR_SINARP;

  // Estado del flujo de Coordinador
  const [cedulaInput, setCedulaInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [preregistroCargado, setPreregistroCargado] = useState<any>(null);
  const [existingSolicitud, setExistingSolicitud] = useState<SolicitudIngreso | null>(null);

  // Stepper state: 1 (Datos), 2 (Acuerdo), 3 (Revisión), 4 (Firma)
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Contraseñas y estado de firma
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [isSigned, setIsSigningDone] = useState(false);
  const [signatureInfo, setSignatureInfo] = useState<{
    fechaHora: string;
    identificador: string;
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [submittedSolicitudId, setSubmittedSolicitudId] = useState<string>("");

  // Form State Anexo B
  const [formData, setFormData] = useState<DatosAnexoB>({
    nombreEntidad: "",
    domicilioEntidad: "",
    representanteLegalNombre: "",
    funcionarioNombre: "",
    funcionarioCedula: "",
    funcionarioCargo: "",
    rolAsignado: "COORDINADOR TITULAR",
    misionVisionInstitucional: "",
    clausulasAceptadas: false,
    ciudadFirma: "Quito D.M.",
    fechaFirma: "28/09/2026",
    firmadoPorRepresentante: true,
    firmadoPorFuncionario: false,
    archivoAcuerdoFirmado: "ARP-R02_Acuerdo_Uso_Confidencialidad_Firmado.pdf"
  });

  // Estados para vista de Revisor / Área de Gestión
  const [selectedSolicitudDetalle, setSelectedSolicitudDetalle] = useState<SolicitudIngreso | null>(null);
  const [isSheetDetailOpen, setIsSheetDetailOpen] = useState(false);
  const [solicitudToApprove, setSolicitudToApprove] = useState<SolicitudIngreso | null>(null);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [solicitudToReject, setSolicitudToReject] = useState<SolicitudIngreso | null>(null);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [motivoRechazoInput, setMotivoRechazoInput] = useState("");
  const [previewDocModal, setPreviewDocModal] = useState<{ open: boolean; title: string } | null>(null);

  // Stepper list
  const stepsList: StepperStep[] = [
    { id: "1", title: "Datos del coordinador", description: "Verificación de prerregistro", icon: UserCheck },
    { id: "2", title: "Acuerdo de uso y confidencialidad", description: "Cláusulas Anexo B", icon: FileText },
    { id: "3", title: "Revisión", description: "Verificación de información", icon: FileCheck2 },
    { id: "4", title: "Firma y envío", description: "Suscripción digital", icon: ShieldCheck },
  ];

  // Leer parámetro query ?cedula=...
  useEffect(() => {
    const ced = searchParams.get("cedula");
    if (ced) {
      setCedulaInput(ced);
      ejecutarValidacionCedula(ced);
    }
  }, [searchParams]);

  // Actualizar solicitud existente si cambia store
  useEffect(() => {
    if (preregistroCargado?.cedula) {
      const sol = solicitudes.find(
        (s) => s.tipoTramite === "PROCESO_B_ENROLAMIENTO_COORDINADOR" && s.cedula === preregistroCargado.cedula
      );
      if (sol) {
        setExistingSolicitud(sol);
      }
    }
  }, [solicitudes, preregistroCargado]);

  // Función para validar la cédula ingresada
  const ejecutarValidacionCedula = (ced: string) => {
    const cleanCed = ced.trim();
    if (cleanCed.length !== 10) {
      toast.error("Formato de cédula no válido", {
        description: "El número de cédula debe contener exactamente 10 dígitos."
      });
      return;
    }

    setValidationError(null);
    setIsSearching(true);

    setTimeout(() => {
      setIsSearching(false);
      const res = buscarPreregistroPorCedula(cleanCed);

      if (res.encontrado && res.nombreCompleto) {
        setPreregistroCargado(res);
        setValidationError(null);

        // Cargar datos en el formulario Anexo B y pasar al Paso 1 obligatoriamente
        setExistingSolicitud(null);
        setFormData((prev) => ({
          ...prev,
          nombreEntidad: res.institucion || prev.nombreEntidad || "Ministerio de Salud Pública - MSP",
          domicilioEntidad: res.direccion || prev.domicilioEntidad || "Av. Amazonas N24-196 y Luis Cordero, Quito",
          representanteLegalNombre: res.representanteLegal || prev.representanteLegalNombre || "Dr. Franklin Encalada Calero",
          funcionarioNombre: res.nombreCompleto || prev.funcionarioNombre || "",
          funcionarioCedula: res.cedula || cleanCed,
          funcionarioCargo: res.cargo || prev.funcionarioCargo || "Coordinador Designado",
          rolAsignado: (res.tipo === "TITULAR" ? "COORDINADOR TITULAR" : "SUPLENTE") as any,
          misionVisionInstitucional: prev.misionVisionInstitucional || "Garantizar la custodia, confidencialidad, lealtad y uso estrictamente institucional de los datos e información del SINARP."
        }));
        setStep(1);

        toast.success("Habilitación de coordinador confirmada", {
          description: `Se encontró el prerregistro para ${res.nombreCompleto} (${res.institucion}). Por favor completa y suscribe el Formulario Anexo B.`
        });
      } else {
        setPreregistroCargado(null);
        setExistingSolicitud(null);
        setValidationError("No encontramos una habilitación vigente asociada a este número de cédula.");
        toast.error("Validación no exitosa", {
          description: "La cédula ingresada no posee un prerregistro o aprobación institucional previa."
        });
      }
    }, 600);
  };

  const handleIrDirectoAFormulario = (customCedula?: string) => {
    const ced = customCedula || cedulaInput || "1715489621";
    setPreregistroCargado({
      encontrado: true,
      cedula: ced,
      nombreCompleto: formData.funcionarioNombre || "",
      institucion: formData.nombreEntidad || "",
      cargo: formData.funcionarioCargo || "",
      tipo: "TITULAR",
      representanteLegal: formData.representanteLegalNombre || "",
      direccion: formData.domicilioEntidad || "",
      yaEnrolado: false
    });
    setFormData((prev) => ({
      ...prev,
      funcionarioCedula: ced,
      nombreEntidad: prev.nombreEntidad || "",
      domicilioEntidad: prev.domicilioEntidad || "",
      representanteLegalNombre: prev.representanteLegalNombre || "",
      funcionarioNombre: prev.funcionarioNombre || "",
      funcionarioCargo: prev.funcionarioCargo || ""
    }));
    setValidationError(null);
    setStep(1);
    toast.info("Formulario Anexo B habilitado para ingreso manual de datos.");
  };

  const handleSimulateDemo = () => {
    const demoCed = "1715489621"; // Roberto Dávila (Prerregistrado habilitado MSP)
    setCedulaInput(demoCed);
    ejecutarValidacionCedula(demoCed);
  };

  const handleSimulateDemoAprobada = () => {
    const demoCed = "1712345602"; // Paula Mendoza (Aprobada)
    setCedulaInput(demoCed);
    ejecutarValidacionCedula(demoCed);
  };

  const handleSimulateDemoRechazada = () => {
    const demoCed = "1788888888"; // Carlos Andrade (Rechazada)
    setCedulaInput(demoCed);
    ejecutarValidacionCedula(demoCed);
  };

  const handleSimulateFillAnexoB = () => {
    setFormData({
      nombreEntidad: preregistroCargado?.institucion || "Ministerio de Salud Pública - MSP",
      domicilioEntidad: "Av. República de El Salvador N36-64 y Suecia, Quito",
      representanteLegalNombre: "Dr. Franklin Encalada Calero (Ministro de Salud)",
      funcionarioNombre: preregistroCargado?.nombreCompleto || "Dr. Roberto Carlos Dávila Silva",
      funcionarioCedula: preregistroCargado?.cedula || "1715489621",
      funcionarioCargo: "Director Nacional de Estadística y Análisis de Salud",
      rolAsignado: "COORDINADOR TITULAR",
      misionVisionInstitucional: "Garantizar el derecho a la salud de la población mediante la regulación, gobernanza y gestión transparente de datos de interoperabilidad médica y registro sanitario.",
      clausulasAceptadas: true,
      ciudadFirma: "Quito D.M.",
      fechaFirma: "28/09/2026",
      firmadoPorRepresentante: true,
      firmadoPorFuncionario: false,
      archivoAcuerdoFirmado: "ARP-R02_Acuerdo_Uso_Confidencialidad_Firmado.pdf"
    });
    setPassword("ClaveSegura2026!");
    setConfirmPassword("ClaveSegura2026!");
    toast.success("Formulario Anexo B autocompletado con datos de prueba.");
  };

  // Simulación de firma electrónica (FirmaEC)
  const handleFirmaElectronica = () => {
    if (!formData.clausulasAceptadas) {
      toast.error("Debe aceptar las cláusulas del Anexo B antes de firmar.");
      return;
    }
    if (!password || password !== confirmPassword) {
      toast.error("Verifique las contraseñas ingresadas.");
      return;
    }

    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      setIsSigningDone(true);
      const now = new Date();
      const fechaStr = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      setSignatureInfo({
        fechaHora: fechaStr,
        identificador: `FIRMA-EC-2026-${Math.floor(10000 + Math.random() * 90000)}-B`
      });
      setFormData((prev) => ({ ...prev, firmadoPorFuncionario: true }));
      toast.success("Documento firmado correctamente", {
        description: "El certificado digital fue estampado en el instrumento ARP-R02."
      });
    }, 1200);
  };

  // Enviar solicitud para aprobación
  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSigned) {
      toast.error("Debe firmar electrónicamente el documento antes de enviarlo.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      agregarEnrolamientoCoordinador({
        ...formData,
        firmadoPorFuncionario: true
      });
      const generatedId = `SOL-ING-00${solicitudes.length + 1}`;
      setSubmittedSolicitudId(generatedId);
      setIsSubmittedSuccess(true);
      toast.success("Solicitud enviada al Área de Gestión", {
        description: "El trámite fue radicado correctamente para revisión."
      });
    }, 800);
  };

  // Restablecer para iniciar una NUEVA solicitud desde cero
  const handleIniciarNuevaSolicitud = () => {
    setCedulaInput("");
    setPreregistroCargado(null);
    setExistingSolicitud(null);
    setValidationError(null);
    setStep(1);
    setIsSigningDone(false);
    setIsSubmittedSuccess(false);
    setPassword("");
    setConfirmPassword("");
  };

  // Confirmar Aprobación (Vista Revisor)
  const handleConfirmApprove = () => {
    if (!solicitudToApprove) return;
    aprobarSolicitud(solicitudToApprove.id, `${currentUser.name} (Área de Gestión)`);
    setIsApproveOpen(false);
    setSolicitudToApprove(null);
    setSelectedSolicitudDetalle(null);
    setIsSheetDetailOpen(false);
    toast.success("Solicitud aprobada correctamente", {
      description: `El coordinador ${solicitudToApprove.nombreCompleto} ha sido habilitado.`
    });
  };

  // Confirmar Rechazo (Vista Revisor)
  const handleConfirmReject = () => {
    if (!solicitudToReject) return;
    if (!motivoRechazoInput.trim()) {
      toast.error("Debe especificar el motivo del rechazo.");
      return;
    }
    rechazarSolicitud(solicitudToReject.id, motivoRechazoInput.trim(), `${currentUser.name} (Área de Gestión)`);
    setIsRejectOpen(false);
    setSolicitudToReject(null);
    setSelectedSolicitudDetalle(null);
    setIsSheetDetailOpen(false);
    setMotivoRechazoInput("");
    toast.error("Solicitud rechazada", {
      description: "Se registró el motivo de rechazo y el trámite quedó cerrado."
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header Superior Principal */}
      <header className="border-b border-border bg-surface/50 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/wireframes2/login" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img
                src={getAssetPath("/logo-horizontal.svg")}
                alt="Logo DINARP"
                className="dark:hidden h-11 sm:h-12 w-auto object-contain dark:brightness-0 dark:invert"
              />
              <img
                src={getAssetPath("/logo-horizontal-blanco.svg")}
                alt="Logo DINARP"
                className="hidden dark:block h-11 sm:h-12 w-auto object-contain dark:brightness-0 dark:invert"
              />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Selector de Rol Simulado */}
            <WireframeRoleSelector activeRole={simulatedRole} onRoleChange={(role) => setSimulatedRole(role)} />
            <ThemeToggle />
            <WireframeUserMenu user={currentUser} onRoleChange={(role) => setSimulatedRole(role)} />
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {/* ========================================================= */}
        {/* EXPERIENCIA 1: COORDINADOR SINARP                          */}
        {/* ========================================================= */}
        {simulatedRole === "COORDINADOR_SINARP" && (
          <div className="space-y-6">
            {/* Migas de pan y Botón Volver */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3 flex-wrap">
                <Link href="/wireframes2/login">
                  <Button variant="outline" size="sm" className="text-xs font-semibold gap-1.5 shadow-xs">
                    <ArrowLeft className="size-3.5" />
                    <span>Volver al acceso principal</span>
                  </Button>
                </Link>

                <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
                  <Link href="/wireframes2/login" className="hover:text-foreground transition-colors flex items-center gap-1 shrink-0">
                    <Home className="size-3.5" />
                    <span>Portal de Acceso</span>
                  </Link>
                  <span>/</span>
                  <span className="text-foreground font-semibold truncate">Activación de Coordinador SINARP</span>
                </nav>
              </div>

              <Badge tone="neutral" appearance="soft" size="sm" className="border border-border">
                Rol: Coordinador SINARP
              </Badge>
            </div>

            {/* Encabezado del Trámite en Card Featured */}
            <Card
              variant="featured"
              disableHover={true}
              className="bg-primary-100/30 dark:bg-primary-900/20 border-0 shadow-none hover:shadow-none hover:translate-y-0 mb-3 relative overflow-hidden"
            >
              <CardBadge className="bg-primary/20 text-primary text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 border-0">
                FORMULARIO OFICIAL ARP-R02
              </CardBadge>

              <CardTitle className="text-lg sm:text-xl font-bold font-heading text-primary">
                Activación de Coordinador SINARP — Anexo B
              </CardTitle>

              <CardDescription className="text-xs text-primary-800/80 dark:text-primary-200/80 font-medium">
                Proceso B · Enrolamiento y Acuerdo de Uso y Confidencialidad para Coordinadores Prerregistrados
              </CardDescription>

              <CardDecorativeIcon className="-bottom-10 -right-10 opacity-20 group-hover/card:scale-100">
                <ShieldCheck className="size-32 text-primary" />
              </CardDecorativeIcon>
            </Card>

            <Separator className="my-4" />

            {/* ── PANTALLA 1: VALIDACIÓN DEL COORDINADOR (SI NO SE HA CARGADO O NO EXISTE SOLICITUD) ── */}
            {!preregistroCargado && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs max-w-2xl mx-auto">
                  <div className="space-y-2 text-center sm:text-left">
                    <div className="size-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-3">
                      <UserCheck className="size-6" />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold font-heading text-foreground">
                      Activación de Coordinador SINARP
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Ingresa tu número de cédula para continuar con el proceso de activación.
                    </p>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      ejecutarValidacionCedula(cedulaInput);
                    }}
                    className="space-y-4 pt-2"
                  >
                    <FormField label="Número de cédula de identidad" htmlFor="cedula-input" required>
                      <InputGroup state={validationError ? "error" : "default"}>
                        <InputGroupInput
                          id="cedula-input"
                          type="text"
                          maxLength={10}
                          placeholder="Ingresa tu cédula de 10 dígitos"
                          value={cedulaInput}
                          onChange={(e) => {
                            setCedulaInput(e.target.value.replace(/\D/g, ""));
                            setValidationError(null);
                          }}
                          className="text-sm font-mono tracking-wider"
                          autoFocus
                          required
                        />
                        <InputGroupButton
                          type="submit"
                          variant="primary"
                          disabled={isSearching || cedulaInput.length !== 10}
                          className="text-xs font-semibold px-6"
                        >
                          {isSearching ? (
                            <div className="flex items-center gap-2">
                              <LoadingSpinner size="sm" className="size-4" />
                              <span>Validando...</span>
                            </div>
                          ) : (
                            <span>Validar y continuar</span>
                          )}
                        </InputGroupButton>
                      </InputGroup>
                    </FormField>

                    {/* ESCENARIO DE ERROR: NO HABILITADO */}
                    {validationError && (
                      <div className="p-4 bg-danger/10 border border-danger/30 rounded-2xl space-y-3 animate-in fade-in duration-200">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="size-5 text-danger shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-danger uppercase tracking-wider">
                              Validación no aprobada
                            </h4>
                            <p className="text-xs text-foreground/90 font-medium leading-relaxed">
                              {validationError}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              Asegúrate de que la institución haya completado el trámite de prerregistro (Anexo A) y que hayas sido designado formalmente.
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-end pt-2 border-t border-danger/20">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setCedulaInput("");
                              setValidationError(null);
                            }}
                            className="text-xs font-semibold gap-1.5"
                          >
                            <ArrowLeft className="size-3.5" />
                            <span>Volver</span>
                          </Button>
                        </div>
                      </div>
                    )}
                  </form>

                    {/* Acciones de acceso rápido para pruebas / demostración */}
                    <div className="pt-4 border-t border-border/60 space-y-2">
                      <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider block">
                        Cargar cédulas de prueba para simulación:
                      </span>
                      <div className="flex flex-col gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCedulaInput("1715489621");
                            ejecutarValidacionCedula("1715489621");
                          }}
                          className="text-xs justify-start font-normal h-auto py-2 px-3"
                        >
                          <UserCheck className="size-4 text-primary shrink-0 mr-2" />
                          <div className="text-left">
                            <span className="font-semibold block">1715489621 · Roberto Dávila (MSP)</span>
                            <span className="text-[11px] text-muted-foreground">Prerregistrado habilitado en Anexo A</span>
                          </div>
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCedulaInput("1712345602");
                            ejecutarValidacionCedula("1712345602");
                          }}
                          className="text-xs justify-start font-normal h-auto py-2 px-3"
                        >
                          <UserCheck className="size-4 text-primary shrink-0 mr-2" />
                          <div className="text-left">
                            <span className="font-semibold block">1712345602 · Paula Mendoza (DINARP)</span>
                            <span className="text-[11px] text-muted-foreground">Prerregistrado habilitado en Anexo A</span>
                          </div>
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCedulaInput("1700000000");
                            ejecutarValidacionCedula("1700000000");
                          }}
                          className="text-xs justify-start font-normal h-auto py-2 px-3 border-danger/30 text-danger hover:bg-danger/10"
                        >
                          <XCircle className="size-4 shrink-0 mr-2" />
                          <div className="text-left">
                            <span className="font-semibold block">1700000000 · Cédula No Prerregistrada</span>
                            <span className="text-[11px] text-danger/80">Probar rechazo por falta de Anexo A</span>
                          </div>
                        </Button>
                      </div>
                    </div>
                </div>
              </div>
            )}

            {/* ── SI EL COORDINADOR YA TIENE UNA SOLICITUD EN EL STORE ── */}
            {preregistroCargado && existingSolicitud && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* SI ESTÁ APROBADA */}
                {existingSolicitud.estado === "Aprobada" && (
                  <div className="max-w-2xl mx-auto bg-surface border border-success/30 rounded-3xl p-8 text-center space-y-6 shadow-xl relative overflow-hidden">
                    <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[150%] h-[150%] rounded-full bg-gradient-to-b from-success/20 via-success/10 to-transparent blur-2xl pointer-events-none" />

                    <div className="flex justify-center w-full relative z-10">
                      <div className="size-20 rounded-full bg-success/15 border border-success/30 flex items-center justify-center">
                        <CheckCircle2 className="size-10 text-success stroke-[2px]" />
                      </div>
                    </div>

                    <div className="space-y-2 relative z-10">
                      <Badge tone="success" appearance="soft" size="sm" className="px-4 py-1 text-xs font-extrabold tracking-wider uppercase rounded-full mx-auto">
                        ESTADO: REGISTRO APROBADO
                      </Badge>
                      <h2 className="text-2xl font-bold font-heading text-foreground">
                        Tu registro como Coordinador SINARP fue aprobado.
                      </h2>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
                        El proceso de enrolamiento y suscripción del Anexo B concluyó exitosamente. Ya te encuentras habilitado con perfil activo en la plataforma.
                      </p>
                    </div>

                    <div className="p-4 bg-muted/40 rounded-2xl border border-border text-left space-y-2 text-xs relative z-10">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Coordinador:</span>
                        <span className="font-bold text-foreground">{existingSolicitud.nombreCompleto}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Institución:</span>
                        <span className="font-bold text-foreground">{existingSolicitud.institucion}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Trámite N.º:</span>
                        <span className="font-mono font-medium text-foreground">{existingSolicitud.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Aprobado por:</span>
                        <span className="font-medium text-foreground">{existingSolicitud.revisor || "Dirección de Gestión"}</span>
                      </div>
                    </div>

                    {/* Timeline de trazabilidad */}
                    <div className="text-left pt-2 relative z-10">
                      <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Trazabilidad del trámite</h3>
                      <Timeline
                        items={[
                          {
                            id: "t1",
                            title: "Prerregistro de Coordinador",
                            description: "Solicitud de acceso institucional aprobada (Anexo A).",
                            date: "18/09/2026",
                            status: "success",
                            icon: <UserCheck className="size-4" />
                          },
                          {
                            id: "t2",
                            title: "Acuerdo Anexo B Firmado",
                            description: "Suscripción digital realizada con FirmaEC.",
                            date: existingSolicitud.fechaSolicitud,
                            status: "success",
                            icon: <FileSignature className="size-4" />
                          },
                          {
                            id: "t3",
                            title: "Aprobación y Habilitación",
                            description: "Revisado por Área de Gestión. Usuario habilitado.",
                            date: existingSolicitud.fechaRevision || existingSolicitud.fechaSolicitud,
                            status: "success",
                            icon: <CheckCircle2 className="size-4" />
                          }
                        ]}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4 relative z-10">
                      <Link href="/wireframes2/catalogo-interoperabilidad">
                        <Button variant="primary" size="lg" className="w-full sm:w-auto text-xs font-bold px-8">
                          <span>Acceder al Portal SINARP</span>
                          <ArrowRight className="size-4 ml-2" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={handleIniciarNuevaSolicitud}
                        className="w-full sm:w-auto text-xs font-semibold"
                      >
                        <span>Validar otra cédula</span>
                      </Button>
                    </div>
                  </div>
                )}

                {/* SI ESTÁ RECHAZADA */}
                {existingSolicitud.estado === "Rechazada" && (
                  <div className="max-w-2xl mx-auto bg-surface border border-danger/30 rounded-3xl p-8 text-center space-y-6 shadow-xl relative overflow-hidden">
                    <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[150%] h-[150%] rounded-full bg-gradient-to-b from-danger/20 via-danger/10 to-transparent blur-2xl pointer-events-none" />

                    <div className="flex justify-center w-full relative z-10">
                      <div className="size-20 rounded-full bg-danger/15 border border-danger/30 flex items-center justify-center">
                        <XCircle className="size-10 text-danger stroke-[2px]" />
                      </div>
                    </div>

                    <div className="space-y-2 relative z-10">
                      <Badge tone="danger" appearance="soft" size="sm" className="px-4 py-1 text-xs font-extrabold tracking-wider uppercase rounded-full mx-auto">
                        ESTADO: SOLICITUD RECHAZADA
                      </Badge>
                      <h2 className="text-2xl font-bold font-heading text-foreground">
                        Tu solicitud fue rechazada
                      </h2>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
                        El trámite ha finalizado y no se encuentra activo. De acuerdo con las reglas de negocio, una solicitud rechazada no puede ser corregida ni reenviada.
                      </p>
                    </div>

                    {/* Motivo de Rechazo en Card Destacado */}
                    <div className="p-4 bg-danger/10 border border-danger/20 rounded-2xl text-left space-y-2 relative z-10">
                      <span className="text-xs font-bold text-danger uppercase tracking-wider block">
                        Motivo del rechazo registrado:
                      </span>
                      <p className="text-xs text-foreground font-medium leading-relaxed">
                        {existingSolicitud.motivoRechazo || "El acuerdo de confidencialidad no cumple con la firma digital válida del representante legal o delegado autorizante."}
                      </p>
                      <div className="pt-2 border-t border-danger/20 flex justify-between text-[11px] text-muted-foreground">
                        <span>Revisado por: {existingSolicitud.revisor || "Área de Gestión"}</span>
                        <span>Fecha: {existingSolicitud.fechaRevision || existingSolicitud.fechaSolicitud}</span>
                      </div>
                    </div>

                    {/* Timeline de Trazabilidad */}
                    <div className="text-left pt-2 relative z-10">
                      <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Trazabilidad del trámite</h3>
                      <Timeline
                        items={[
                          {
                            id: "t1",
                            title: "Solicitud Creada",
                            description: "Anexo B completado y enviado a revisión.",
                            date: existingSolicitud.fechaSolicitud,
                            status: "primary",
                            icon: <FileText className="size-4" />
                          },
                          {
                            id: "t2",
                            title: "Revisado por Área de Gestión",
                            description: "Análisis documental ejecutado.",
                            date: existingSolicitud.fechaRevision || existingSolicitud.fechaSolicitud,
                            status: "neutral",
                            icon: <Search className="size-4" />
                          },
                          {
                            id: "t3",
                            title: "Solicitud Rechazada",
                            description: "Trámite finalizado por incongruencias en la documentación.",
                            date: existingSolicitud.fechaRevision || existingSolicitud.fechaSolicitud,
                            status: "danger",
                            icon: <XCircle className="size-4" />
                          }
                        ]}
                      />
                    </div>

                    {/* Botón Único Obligatorio: Iniciar Nueva Solicitud */}
                    <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4 relative z-10">
                      <Button
                        type="button"
                        variant="primary"
                        size="lg"
                        onClick={handleIniciarNuevaSolicitud}
                        className="w-full sm:w-auto text-xs font-bold px-8 shadow-md"
                      >
                        <RefreshCw className="size-4 mr-2" />
                        <span>Iniciar nueva solicitud</span>
                      </Button>
                    </div>
                  </div>
                )}

                {/* SI ESTÁ EN REVISIÓN */}
                {(existingSolicitud.estado === "PENDIENTE_ASIGNACION_GESTION" ||
                  existingSolicitud.estado === "EN_REVISION_GESTION" ||
                  existingSolicitud.estado === "Pendiente") && (
                    <div className="max-w-2xl mx-auto bg-surface border border-warning/30 rounded-3xl p-8 text-center space-y-6 shadow-xl relative overflow-hidden">
                      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[150%] h-[150%] rounded-full bg-gradient-to-b from-warning/20 via-warning/10 to-transparent blur-2xl pointer-events-none" />

                      <div className="flex justify-center w-full relative z-10">
                        <div className="size-20 rounded-full bg-warning/15 border border-warning/30 flex items-center justify-center">
                          <Clock className="size-10 text-warning stroke-[2px]" />
                        </div>
                      </div>

                      <div className="space-y-2 relative z-10">
                        <Badge tone="warning" appearance="soft" size="sm" className="px-4 py-1 text-xs font-extrabold tracking-wider uppercase rounded-full mx-auto">
                          ESTADO: EN REVISIÓN POR ÁREA DE GESTIÓN
                        </Badge>
                        <h2 className="text-2xl font-bold font-heading text-foreground">
                          Solicitud en proceso de evaluación
                        </h2>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
                          Tu Anexo B y documento de firma electrónica han sido remitidos al Área de Gestión para su verificación formal.
                        </p>
                      </div>

                      <div className="p-4 bg-muted/40 rounded-2xl border border-border text-left space-y-2 text-xs relative z-10">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">N.º Trámite:</span>
                          <span className="font-mono font-bold text-foreground">{existingSolicitud.id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Fecha de Envío:</span>
                          <span className="font-medium text-foreground">{existingSolicitud.fechaSolicitud}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Institución:</span>
                          <span className="font-medium text-foreground">{existingSolicitud.institucion}</span>
                        </div>
                      </div>

                      <div className="flex justify-center pt-2 relative z-10">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleIniciarNuevaSolicitud}
                          className="text-xs font-semibold"
                        >
                          <span>Validar otra cédula</span>
                        </Button>
                      </div>
                    </div>
                  )}
              </div>
            )}

            {/* ── PANTALLA 2: FORMULARIO ANEXO B (SI SE ENCONTRÓ PRERREGISTRO Y NO TIENE TRAMITE PENDIENTE/FINALIZADO) ── */}
            {preregistroCargado && !existingSolicitud && !isSubmittedSuccess && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Resumen del contexto del trámite */}
                <div className="bg-surface border border-border rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row sm:items-center justify-between gap-4 shadow-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge tone="neutral" appearance="soft" size="sm" className="border border-border">
                        N.º Trámite: Borrador
                      </Badge>
                      <Badge tone="warning" appearance="soft" size="sm" className="border border-warning/40">
                        Estado: Borrador
                      </Badge>
                    </div>
                    <h2 className="text-base font-bold text-foreground">
                      {formData.nombreEntidad}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Coordinador: <strong className="text-foreground">{formData.funcionarioNombre}</strong> ({formData.funcionarioCedula})
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleSimulateFillAnexoB}
                      className="text-xs font-semibold gap-1.5 shadow-xs bg-background hover:bg-muted"
                    >
                      <Sparkles className="size-3.5 text-amber-500" />
                      <span>Autocompletar Anexo B</span>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleIniciarNuevaSolicitud}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Cambiar Cédula
                    </Button>
                  </div>
                </div>

                {/* Stepper Oficial UI Kit */}
                <div className="bg-surface border border-border rounded-2xl p-4 sm:p-6 shadow-xs overflow-x-auto">
                  <Stepper
                    steps={stepsList}
                    activeStep={step - 1}
                    variant="default"
                    stepPrefix="PASO"
                    showBadge={true}
                    onStepClick={(idx) => {
                      if (idx + 1 < step) setStep((idx + 1) as 1 | 2 | 3 | 4);
                    }}
                  />
                </div>

                <form onSubmit={handleFinalSubmit} className="space-y-6">
                  {/* ── PASO 1: DATOS DEL COORDINADOR ── */}
                  {step === 1 && (
                    <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs animate-in fade-in duration-200">
                      <div className="border-b border-border/70 pb-3 flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <h3 className="text-base font-bold font-heading text-foreground flex items-center gap-2">
                            <UserCheck className="size-5 text-primary" />
                            Paso 1 — Datos del Coordinador Prerregistrado
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            La información institucional y personal ha sido precargada desde el Anexo A de la entidad.
                          </p>
                        </div>
                        <Badge tone="primary" appearance="soft" size="sm">
                          Información Precargada
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                        <FormField label="Nombre de la Institución Solicitante" htmlFor="entidad-p1" required className="sm:col-span-2">
                          <Input
                            id="entidad-p1"
                            value={formData.nombreEntidad}
                            onChange={(e) => setFormData({ ...formData, nombreEntidad: e.target.value })}
                            placeholder="Ej: Ministerio de Salud Pública - MSP"
                            className="text-xs font-semibold"
                            required
                          />
                        </FormField>

                        <FormField label="Domicilio Legal Institucional" htmlFor="domicilio-p1" className="sm:col-span-2">
                          <Input
                            id="domicilio-p1"
                            value={formData.domicilioEntidad}
                            onChange={(e) => setFormData({ ...formData, domicilioEntidad: e.target.value })}
                            placeholder="Ej: Av. República de El Salvador N36-64 y Suecia, Quito"
                            className="text-xs"
                          />
                        </FormField>

                        <FormField label="Representante Legal Autorizado" htmlFor="rep-legal-p1" required>
                          <Input
                            id="rep-legal-p1"
                            value={formData.representanteLegalNombre}
                            onChange={(e) => setFormData({ ...formData, representanteLegalNombre: e.target.value })}
                            placeholder="Ej: Dr. Franklin Encalada Calero"
                            className="text-xs"
                            required
                          />
                        </FormField>

                        <FormField label="Rol Asignado" htmlFor="rol-p1" required>
                          <Input
                            id="rol-p1"
                            value={formData.rolAsignado}
                            onChange={(e) => setFormData({ ...formData, rolAsignado: e.target.value as "COORDINADOR TITULAR" | "SUPLENTE" | "SUPERVISOR" | "VISUALIZADOR" })}
                            placeholder="Ej: COORDINADOR TITULAR / SUPLENTE"
                            className="text-xs font-semibold"
                            required
                          />
                        </FormField>

                        <FormField label="Nombre Completo del Coordinador Designado" htmlFor="nombre-p1" required>
                          <Input
                            id="nombre-p1"
                            value={formData.funcionarioNombre}
                            onChange={(e) => setFormData({ ...formData, funcionarioNombre: e.target.value })}
                            placeholder="Ej: Dr. Roberto Carlos Dávila Silva"
                            className="text-xs"
                            required
                          />
                        </FormField>

                        <FormField label="Número de Cédula de Identidad" htmlFor="cedula-p1" required>
                          <Input
                            id="cedula-p1"
                            value={formData.funcionarioCedula}
                            onChange={(e) => setFormData({ ...formData, funcionarioCedula: e.target.value })}
                            placeholder="Cédula de 10 dígitos"
                            className="text-xs font-mono"
                            required
                          />
                        </FormField>

                        <FormField label="Cargo Institucional" htmlFor="cargo-p1" className="sm:col-span-2" required>
                          <Input
                            id="cargo-p1"
                            value={formData.funcionarioCargo}
                            onChange={(e) => setFormData({ ...formData, funcionarioCargo: e.target.value })}
                            placeholder="Ej: Director Nacional de Estadística y Análisis de Salud"
                            className="text-xs"
                            required
                          />
                        </FormField>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border/60">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleIniciarNuevaSolicitud}
                          className="text-xs font-semibold gap-1.5"
                        >
                          <ArrowLeft className="size-4" />
                          <span>Volver a consultar cédula</span>
                        </Button>

                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          onClick={() => setStep(2)}
                          className="text-xs font-semibold gap-2 shadow-xs"
                        >
                          <span>Siguiente: Acuerdo de Uso</span>
                          <ArrowRight className="size-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* ── PASO 2: ACUERDO DE USO Y CONFIDENCIALIDAD ── */}
                  {step === 2 && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                      {/* Bloque 1: Comparecientes */}
                      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-5 shadow-xs">
                        <div className="border-b border-border/70 pb-3">
                          <h3 className="text-base font-bold font-heading text-foreground flex items-center gap-2">
                            <Building2 className="size-5 text-primary" />
                            Cláusula Primera — Intervinientes y Comparecientes
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Suscripción del Acuerdo ARP-R02 entre la DINARP y la institución solicitante.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                          <FormField label="Representante Legal o Delegado" htmlFor="rep-legal-p2">
                            <Input
                              id="rep-legal-p2"
                              value={formData.representanteLegalNombre}
                              onChange={(e) => setFormData({ ...formData, representanteLegalNombre: e.target.value })}
                              className="text-xs"
                              required
                            />
                          </FormField>

                          <FormField label="Selección de perfil operativo" htmlFor="rol-select-p2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-between h-9 text-xs px-3 font-normal bg-background"
                                  id="rol-select-p2"
                                >
                                  {formData.rolAsignado}
                                  <ChevronDown className="size-4 opacity-50" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                                <DropdownMenuItem onClick={() => setFormData({ ...formData, rolAsignado: "COORDINADOR TITULAR" })}>
                                  COORDINADOR TITULAR
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setFormData({ ...formData, rolAsignado: "SUPLENTE" })}>
                                  SUPLENTE
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setFormData({ ...formData, rolAsignado: "SUPERVISOR" })}>
                                  SUPERVISOR
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setFormData({ ...formData, rolAsignado: "VISUALIZADOR" })}>
                                  VISUALIZADOR
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </FormField>
                        </div>
                      </div>

                      {/* Bloque 2: Misión y Visión */}
                      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
                        <div className="border-b border-border/70 pb-3">
                          <h3 className="text-base font-bold font-heading text-foreground">
                            Cláusula Segunda — Antecedentes (Misión y Visión Institucional)
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Justificación formal de la necesidad de uso de los datos del SINARP.
                          </p>
                        </div>

                        <FormField label="Misión y Visión de la entidad compareciente" htmlFor="mision-p2" required>
                          <Textarea
                            id="mision-p2"
                            value={formData.misionVisionInstitucional}
                            onChange={(e) => setFormData({ ...formData, misionVisionInstitucional: e.target.value })}
                            className="text-xs min-h-[90px]"
                            required
                          />
                        </FormField>
                      </div>

                      {/* Bloque 3: Base Legal y Cláusulas Operativas */}
                      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
                        <div className="border-b border-border/70 pb-3">
                          <h3 className="text-base font-bold font-heading text-foreground">
                            Cláusula Tercera a Séptima — Base Legal, Confidencialidad y Custodia
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Cumplimiento de la CRE (Art. 66 num. 19), Ley SINARP (Arts. 4, 27, 28, 29) y Ley de Protección de Datos Personales.
                          </p>
                        </div>

                        <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-3 text-xs">
                          <p className="text-muted-foreground text-[11px] leading-relaxed">
                            El coordinador designado se compromete a mantener estricta reserva y confidencialidad respecto de los datos personales a los que acceda, utilizándolos de forma leal y exclusiva para las competencias asignadas. Queda expresamente prohibida la divulgación, almacenamiento o comercialización no autorizada, bajo responsabilidades legales aplicables.
                          </p>
                          <div className="flex items-start gap-2.5 pt-2 border-t border-border/60">
                            <Checkbox
                              id="clausulas-check"
                              checked={formData.clausulasAceptadas}
                              onCheckedChange={(c) => setFormData({ ...formData, clausulasAceptadas: Boolean(c) })}
                            />
                            <Label htmlFor="clausulas-check" className="text-xs cursor-pointer font-semibold text-foreground">
                              Declaro haber leído y acepto expresamente todas las cláusulas de confidencialidad del Anexo B.
                            </Label>
                          </div>
                        </div>
                      </div>

                      {/* Credenciales de Acceso */}
                      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
                        <div className="border-b border-border/70 pb-3">
                          <h3 className="text-base font-bold font-heading text-foreground flex items-center gap-2">
                            <KeyRound className="size-5 text-primary" />
                            Configuración de Credenciales de Acceso
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Define la contraseña que utilizarás tras la aprobación de la solicitud.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <FormField label="Contraseña" htmlFor="pass-p2" required>
                            <InputGroup>
                              <InputGroupInput
                                id="pass-p2"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="text-xs"
                                placeholder="Mínimo 8 caracteres"
                                required
                              />
                              <InputGroupButton
                                type="button"
                                variant="ghost"
                                onClick={() => setShowPassword(!showPassword)}
                                className="size-9 px-0"
                              >
                                <KeyRound className="size-4 opacity-70" />
                              </InputGroupButton>
                            </InputGroup>
                          </FormField>

                          <FormField label="Confirmar Contraseña" htmlFor="confirm-pass-p2" required>
                            <InputGroup>
                              <InputGroupInput
                                id="confirm-pass-p2"
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="text-xs"
                                placeholder="Repita la contraseña"
                                required
                              />
                              <InputGroupButton
                                type="button"
                                variant="ghost"
                                onClick={() => setShowPassword(!showPassword)}
                                className="size-9 px-0"
                              >
                                <KeyRound className="size-4 opacity-70" />
                              </InputGroupButton>
                            </InputGroup>
                          </FormField>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-border/60">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setStep(1)}
                          className="text-xs font-semibold gap-1.5"
                        >
                          <ArrowLeft className="size-4" />
                          <span>Volver a Datos</span>
                        </Button>

                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          disabled={!formData.clausulasAceptadas || !password || password !== confirmPassword}
                          onClick={() => setStep(3)}
                          className="text-xs font-semibold gap-2 shadow-xs"
                        >
                          <span>Siguiente: Revisar Información</span>
                          <ArrowRight className="size-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* ── PASO 3: REVISIÓN DE LA INFORMACIÓN ── */}
                  {step === 3 && (
                    <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs animate-in fade-in duration-200">
                      <div className="border-b border-border/70 pb-3">
                        <h3 className="text-base font-bold font-heading text-foreground flex items-center gap-2">
                          <FileCheck2 className="size-5 text-primary" />
                          Revisa tu información
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Verifica que los datos del coordinador y las cláusulas del Anexo B sean correctos antes de proceder a la firma electrónica.
                        </p>
                      </div>

                        {/* Vista previa tipo Hoja de Oficio del Documento Anexo B (ARP-R02) */}
                        <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-md max-w-3xl mx-auto border-t-4 border-t-primary">
                          {/* Encabezado Institucional Oficial DINARP */}
                          <div className="flex items-center justify-between border-b border-border/80 pb-4 gap-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={getAssetPath("/logo-horizontal.svg")}
                                alt="DINARP"
                                className="dark:hidden h-10 w-auto object-contain"
                              />
                              <img
                                src={getAssetPath("/logo-horizontal-blanco.svg")}
                                alt="DINARP"
                                className="hidden dark:block h-10 w-auto object-contain"
                              />
                            </div>
                            <div className="text-right">
                              <span className="font-mono text-xs font-bold text-primary block">
                                CÓDIGO: ARP-R02
                              </span>
                              <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                                ANEXO B · SISTEMA NACIONAL DE REGISTROS PÚBLICOS
                              </span>
                            </div>
                          </div>

                          {/* Título Principal del Documento */}
                          <div className="text-center space-y-1">
                            <h4 className="text-sm sm:text-base font-bold font-heading text-foreground uppercase tracking-wide">
                              ACUERDO DE USO Y CONFIDENCIALIDAD PARA COORDINADORES DEL SINARP
                            </h4>
                            <p className="text-[11px] text-muted-foreground italic">
                              Suscrito al amparo del Art. 66 num. 19 de la Constitución y Arts. 4 y 28 de la Ley del SINARP
                            </p>
                          </div>

                          {/* Tabla 1: Comparecientes */}
                          <div className="space-y-2">
                            <span className="text-xs font-bold text-foreground uppercase tracking-wider block border-b border-border/60 pb-1">
                              CLÁUSULA PRIMERA: COMPARECIENTES Y DESIGNACIÓN
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-muted/30 p-4 rounded-xl border border-border">
                              <div>
                                <span className="text-muted-foreground block text-[11px]">Entidad Compareciente:</span>
                                <strong className="text-foreground font-semibold">{formData.nombreEntidad}</strong>
                              </div>
                              <div>
                                <span className="text-muted-foreground block text-[11px]">Domicilio Legal:</span>
                                <strong className="text-foreground">{formData.domicilioEntidad}</strong>
                              </div>
                              <div>
                                <span className="text-muted-foreground block text-[11px]">Representante Legal / Delegado:</span>
                                <strong className="text-foreground">{formData.representanteLegalNombre}</strong>
                              </div>
                              <div>
                                <span className="text-muted-foreground block text-[11px]">Rol Asignado en SINARP:</span>
                                <Badge tone="neutral" appearance="soft" size="sm" className="font-semibold ml-1">
                                  {formData.rolAsignado}
                                </Badge>
                              </div>
                              <div>
                                <span className="text-muted-foreground block text-[11px]">Coordinador Designado:</span>
                                <strong className="text-foreground">{formData.funcionarioNombre}</strong>
                              </div>
                              <div>
                                <span className="text-muted-foreground block text-[11px]">Cédula de Identidad:</span>
                                <strong className="font-mono text-foreground">{formData.funcionarioCedula}</strong>
                              </div>
                              <div className="sm:col-span-2">
                                <span className="text-muted-foreground block text-[11px]">Cargo Institucional:</span>
                                <strong className="text-foreground">{formData.funcionarioCargo}</strong>
                              </div>
                            </div>
                          </div>

                          {/* Cláusula Legal de Confidencialidad */}
                          <div className="space-y-2 text-xs">
                            <span className="text-xs font-bold text-foreground uppercase tracking-wider block border-b border-border/60 pb-1">
                              CLÁUSULA SEGUNDA A CUARTA: COMPROMISO Y CONFIDENCIALIDAD
                            </span>
                            <div className="p-4 rounded-xl bg-muted/20 border border-border text-[11px] leading-relaxed text-muted-foreground space-y-2">
                              <p>
                                <strong>Antecedentes:</strong> {formData.misionVisionInstitucional}
                              </p>
                              <p>
                                <strong>Compromiso Expreso:</strong> El coordinador se compromete a custodiar los accesos al Sistema Nacional de Registros Públicos, garantizar el uso exclusivo para fines institucionales legítimos y mantener estricto sigilo de la información de los ciudadanos.
                              </p>
                            </div>
                          </div>

                          {/* Bloque de Firma Simulado */}
                          <div className="pt-4 border-t border-border/70 grid grid-cols-1 sm:grid-cols-2 gap-6 text-center text-xs">
                            <div className="p-3 rounded-xl border border-dashed border-border/80 bg-muted/10 space-y-1">
                              <div className="h-10 flex items-center justify-center text-muted-foreground italic text-[11px]">
                                [Firma Electrónica Representante Legal]
                              </div>
                              <span className="font-bold text-foreground block text-[11px] border-t border-border pt-1">
                                {formData.representanteLegalNombre}
                              </span>
                              <span className="text-[10px] text-muted-foreground block">
                                Representante Legal / Delegado
                              </span>
                            </div>

                            <div className="p-3 rounded-xl border border-dashed border-primary/40 bg-primary/5 space-y-1">
                              <div className="h-10 flex items-center justify-center text-primary font-semibold text-[11px]">
                                Pendiente FirmaEC (Paso 4)
                              </div>
                              <span className="font-bold text-foreground block text-[11px] border-t border-border pt-1">
                                {formData.funcionarioNombre}
                              </span>
                              <span className="text-[10px] text-muted-foreground block">
                                Coordinador Designado ({formData.rolAsignado})
                              </span>
                            </div>
                          </div>
                        </div>

                      <div className="flex justify-between items-center pt-4 border-t border-border/60">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setStep(2)}
                          className="text-xs font-semibold gap-1.5"
                        >
                          <ArrowLeft className="size-4" />
                          <span>Volver</span>
                        </Button>

                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          onClick={() => setStep(4)}
                          className="text-xs font-semibold gap-2 shadow-xs"
                        >
                          <span>Continuar a firma</span>
                          <ArrowRight className="size-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* ── PASO 4: FIRMA Y ENVÍO ── */}
                  {step === 4 && (
                    <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs animate-in fade-in duration-200">
                      <div className="border-b border-border/70 pb-3">
                        <h3 className="text-base font-bold font-heading text-foreground flex items-center gap-2">
                          <ShieldCheck className="size-5 text-primary" />
                          Firma y envía tu solicitud
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Suscripción del instrumento digital ARP-R02 mediante Firma Electrónica.
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl border border-border bg-muted/30 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                              <FileText className="size-5" />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-foreground">
                                ARP-R02_Acuerdo_Uso_Confidencialidad.pdf
                              </h4>
                              <p className="text-[11px] text-muted-foreground">
                                Documento digital generado · 245 KB
                              </p>
                            </div>
                          </div>

                          <Badge tone={isSigned ? "success" : "warning"} appearance="soft" size="sm">
                            {isSigned ? "FIRMADO DIGITALMENTE" : "PENDIENTE DE FIRMA"}
                          </Badge>
                        </div>

                        {!isSigned ? (
                          <div className="pt-2 border-t border-border/60 space-y-4">
                            {/* Alerta de notificación por correo */}
                            <div className="p-4 rounded-xl border border-primary/25 bg-primary/5 space-y-2 text-xs">
                              <div className="flex items-center gap-2 font-bold text-primary">
                                <Mail className="size-4 shrink-0" />
                                <span>Notificación de firma enviada a tu correo institucional</span>
                              </div>
                              <p className="text-[11px] leading-relaxed text-muted-foreground">
                                Se ha remitido la notificación de suscripción digital al correo <strong className="text-foreground font-semibold">{formData.funcionarioEmail || "tu correo institucional registrado"}</strong>.
                              </p>
                              <p className="text-[11px] font-semibold text-primary/90 flex items-center gap-1.5 pt-1">
                                <RefreshCw className="size-3.5 animate-spin shrink-0" />
                                <span>Revisa tu correo. Cuando firmes en FirmaEC o Token, el estado de esta pantalla se actualizará automáticamente.</span>
                              </p>
                            </div>

                            <div className="flex items-center justify-between gap-3 pt-1 flex-wrap">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <LoadingSpinner size="sm" className="size-3.5 text-primary shrink-0" />
                                <span className="text-[11px]">Monitoreando firma en vivo...</span>
                              </div>

                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={isSigning}
                                onClick={handleFirmaElectronica}
                                className="text-xs font-semibold gap-2 border-primary/40 text-primary hover:bg-primary/10 shadow-xs"
                              >
                                {isSigning ? (
                                  <div className="flex items-center gap-2">
                                    <LoadingSpinner size="sm" className="size-4" />
                                    <span>Sincronizando con FirmaEC...</span>
                                  </div>
                                ) : (
                                  <>
                                    <ShieldCheck className="size-4" />
                                    <span>Simular Firma Realizada en FirmaEC (Actualizar Estado)</span>
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 rounded-xl bg-success/10 border border-success/30 space-y-2 text-xs animate-in fade-in duration-300">
                            <div className="flex items-center gap-2 font-bold text-success">
                              <CheckCircle2 className="size-4" />
                              <span>Firma Electrónica Confirmada por FirmaEC</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground">
                              El documento ARP-R02 ha sido firmado digitalmente de forma válida y los cambios se actualizaron en esta pantalla.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-foreground/90 pt-1 border-t border-success/20">
                              <div>Fecha y Hora: <strong className="text-foreground font-mono">{signatureInfo?.fechaHora}</strong></div>
                              <div>Serie Certificado / ID: <strong className="text-foreground font-mono">{signatureInfo?.identificador}</strong></div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-border/60">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setStep(3)}
                          className="text-xs font-semibold gap-1.5"
                        >
                          <ArrowLeft className="size-4" />
                          <span>Volver</span>
                        </Button>

                        <Button
                          type="submit"
                          variant="primary"
                          size="sm"
                          disabled={!isSigned || isSubmitting}
                          className="text-xs font-bold gap-2 shadow-md"
                        >
                          {isSubmitting ? (
                            <span>Enviando trámite...</span>
                          ) : (
                            <>
                              <span>Enviar para aprobación</span>
                              <Check className="size-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* ── CONFIRMACIÓN DE ENVÍO EXITOSO ── */}
            {isSubmittedSuccess && (
              <div className="max-w-2xl mx-auto bg-surface border border-border rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6 animate-in fade-in duration-300">
                <div className="size-20 rounded-full bg-success/15 border border-success/30 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="size-10 text-success stroke-[2px]" />
                </div>

                <div className="space-y-2">
                  <Badge tone="success" appearance="soft" size="sm" className="border border-success/30">
                    Trámite Radicado: {submittedSolicitudId}
                  </Badge>
                  <h1 className="text-2xl sm:text-3xl font-bold font-heading text-foreground">
                    Solicitud enviada
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
                    Tu solicitud fue enviada al Área de Gestión para revisión.
                  </p>
                </div>

                <div className="p-4 bg-muted/40 rounded-2xl border border-border text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Número de solicitud:</span>
                    <span className="font-mono font-bold text-foreground">{submittedSolicitudId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Institución:</span>
                    <span className="font-bold text-foreground">{formData.nombreEntidad}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tipo de trámite:</span>
                    <span className="font-medium text-foreground">Anexo B · Activación de Coordinador</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estado actual:</span>
                    <Badge tone="warning" appearance="soft" size="sm">En revisión</Badge>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setSimulatedRole("DIR_GESTION");
                      toast.info("Cambiado a rol Área de Gestión para revisar la bandeja.");
                    }}
                    className="text-xs font-bold"
                  >
                    <span>Ver solicitud en Área de Gestión</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleIniciarNuevaSolicitud}
                    className="text-xs font-semibold"
                  >
                    <span>Volver al inicio</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* EXPERIENCIA 2: ÁREA DE GESTIÓN / REVISOR                 */}
        {/* ========================================================= */}
        {simulatedRole !== "COORDINADOR_SINARP" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Encabezado y Miga de Pan */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
                <Link href="/wireframes2/login" className="hover:text-foreground transition-colors flex items-center gap-1 shrink-0">
                  <Home className="size-3.5" />
                  <span>Inicio</span>
                </Link>
                <span>/</span>
                <span>Solicitudes</span>
                <span>/</span>
                <span className="text-foreground font-semibold truncate">Anexo B · Activación de Coordinador</span>
              </nav>

              <Badge tone="neutral" appearance="soft" size="sm" className="border border-border">
                Visualizando como: {ROLES_CONFIG[simulatedRole]?.name || simulatedRole}
              </Badge>
            </div>

            {/* Banner Área de Gestión */}
            <Card variant="featured" disableHover={true} className="bg-surface border border-border p-6 rounded-2xl shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold font-heading text-foreground flex items-center gap-2">
                    <ShieldCheck className="size-5 text-primary" />
                    Bandeja de Gestión de Solicitudes — Anexo B
                  </h1>
                  <p className="text-xs text-muted-foreground mt-1">
                    Revisión, aprobación o rechazo de solicitudes de enrolamiento de Coordinadores SINARP.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSimulatedRole("COORDINADOR_SINARP")}
                  className="text-xs font-semibold gap-1.5 self-start sm:self-auto"
                >
                  <UserCheck className="size-3.5" />
                  <span>Cambiar a Vista Coordinador</span>
                </Button>
              </div>
            </Card>

            {/* Tabla Bandeja de Solicitudes (Categoría 5: Table) */}
            <div className="bg-surface border border-border rounded-2xl p-4 sm:p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between gap-4 flex-wrap border-b border-border/60 pb-4">
                <h3 className="text-sm font-bold text-foreground">Solicitudes de Coordinadores SINARP</h3>
                <Badge tone="neutral" appearance="soft" size="sm">
                  {solicitudes.filter((s) => s.tipoTramite === "PROCESO_B_ENROLAMIENTO_COORDINADOR").length} trámites en catálogo
                </Badge>
              </div>

              <div className="rounded-xl border border-border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="text-xs font-bold text-foreground">N.º Trámite</TableHead>
                      <TableHead className="text-xs font-bold text-foreground">Solicitante</TableHead>
                      <TableHead className="text-xs font-bold text-foreground">Institución</TableHead>
                      <TableHead className="text-xs font-bold text-foreground">Tipo de Trámite</TableHead>
                      <TableHead className="text-xs font-bold text-foreground">Fecha</TableHead>
                      <TableHead className="text-xs font-bold text-foreground">Estado</TableHead>
                      <TableHead className="text-xs font-bold text-foreground text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {solicitudes
                      .filter((s) => s.tipoTramite === "PROCESO_B_ENROLAMIENTO_COORDINADOR")
                      .map((sol) => {
                        const badgeProps = getEstadoBadgeProps(sol.estado);
                        return (
                          <TableRow key={sol.id} className="hover:bg-muted/30 transition-colors">
                            <TableCell className="font-mono text-xs font-bold text-foreground">
                              {sol.id}
                            </TableCell>
                            <TableCell className="text-xs font-medium text-foreground">
                              {sol.nombreCompleto}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {sol.institucion}
                            </TableCell>
                            <TableCell className="text-xs text-foreground font-medium">
                              Anexo B · Activación
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                              {sol.fechaSolicitud}
                            </TableCell>
                            <TableCell>
                              <Badge tone={badgeProps.tone} appearance="soft" size="sm" dot>
                                {badgeProps.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedSolicitudDetalle(sol);
                                      setIsSheetDetailOpen(true);
                                    }}
                                    className="size-8 p-0"
                                  >
                                    <Eye className="size-4 text-foreground" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">Ver detalle</TooltipContent>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* PANEL LATERAL SHEET (Categoría 4: Sheet) */}
            <Sheet open={isSheetDetailOpen} onOpenChange={setIsSheetDetailOpen}>
              <SheetContent side="right" className="w-full sm:max-w-lg md:max-w-xl p-0 flex flex-col h-full bg-surface border-l border-border shadow-2xl">
                {selectedSolicitudDetalle && (
                  <>
                    <SheetHeader className="p-6 border-b border-border/70 shrink-0 bg-surface/50">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span className="font-mono text-xs font-semibold text-muted-foreground uppercase">
                          {selectedSolicitudDetalle.id}
                        </span>
                        <Badge tone={getEstadoBadgeProps(selectedSolicitudDetalle.estado).tone} appearance="soft" size="sm">
                          {getEstadoBadgeProps(selectedSolicitudDetalle.estado).label}
                        </Badge>
                      </div>
                      <SheetTitle className="text-lg font-bold font-heading text-foreground">
                        Detalle de Solicitud — {selectedSolicitudDetalle.nombreCompleto}
                      </SheetTitle>
                      <SheetDescription className="text-xs text-muted-foreground">
                        {selectedSolicitudDetalle.institucion}
                      </SheetDescription>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
                      {/* Información del Coordinador */}
                      <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-2">
                        <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px] border-b border-border/60 pb-1">
                          Información del Coordinador
                        </h4>
                        <div className="space-y-1">
                          <div><span className="text-muted-foreground">Nombre:</span> <strong>{selectedSolicitudDetalle.nombreCompleto}</strong></div>
                          <div><span className="text-muted-foreground">Cédula:</span> <span className="font-mono">{selectedSolicitudDetalle.cedula}</span></div>
                          <div><span className="text-muted-foreground">Correo:</span> {selectedSolicitudDetalle.correo}</div>
                          <div><span className="text-muted-foreground">Institución:</span> {selectedSolicitudDetalle.institucion}</div>
                        </div>
                      </div>

                      {/* Anexo B y Documentos */}
                      <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-2">
                        <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px] border-b border-border/60 pb-1">
                          Documento y Firma Digital
                        </h4>
                        <div className="space-y-1">
                          <div><span className="text-muted-foreground">Documento:</span> ARP-R02_Acuerdo_Uso_Confidencialidad.pdf</div>
                          <div><span className="text-muted-foreground">Estado Firma:</span> Firmado Electrónicamente (FirmaEC)</div>
                          <div><span className="text-muted-foreground">Fecha de envío:</span> {selectedSolicitudDetalle.fechaSolicitud}</div>
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setPreviewDocModal({ open: true, title: "ARP-R02_Acuerdo_Uso_Confidencialidad.pdf" })}
                          className="mt-2 text-[11px] gap-1.5"
                        >
                          <Eye className="size-3" />
                          <span>Previsualizar documento PDF</span>
                        </Button>
                      </div>

                      {/* Motivo de rechazo si aplica */}
                      {selectedSolicitudDetalle.motivoRechazo && (
                        <div className="p-4 rounded-xl bg-danger/10 border border-danger/30 space-y-1 text-xs">
                          <span className="font-bold text-danger uppercase tracking-wider text-[11px] block">
                            Motivo de rechazo registrado:
                          </span>
                          <p className="text-foreground">{selectedSolicitudDetalle.motivoRechazo}</p>
                        </div>
                      )}

                      {/* Trazabilidad en Timeline (Categoría 6: Timeline) */}
                      <div className="space-y-2">
                        <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px]">
                          Historial de Trazabilidad
                        </h4>
                        <Timeline
                          items={[
                            {
                              id: "tl1",
                              title: "Solicitud Radicada",
                              description: "Formulario Anexo B firmado digitalmente y remitido.",
                              date: selectedSolicitudDetalle.fechaSolicitud,
                              status: "primary",
                              icon: <FileSignature className="size-4" />
                            },
                            {
                              id: "tl2",
                              title: "Revisión por Área de Gestión",
                              description: selectedSolicitudDetalle.estado === "Aprobada" ? "Aprobada formalmente." : selectedSolicitudDetalle.estado === "Rechazada" ? "Rechazada por observaciones." : "En proceso de evaluación.",
                              date: selectedSolicitudDetalle.fechaRevision || selectedSolicitudDetalle.fechaSolicitud,
                              status: selectedSolicitudDetalle.estado === "Aprobada" ? "success" : selectedSolicitudDetalle.estado === "Rechazada" ? "danger" : "warning",
                              icon: selectedSolicitudDetalle.estado === "Aprobada" ? <CheckCircle2 className="size-4" /> : selectedSolicitudDetalle.estado === "Rechazada" ? <XCircle className="size-4" /> : <Clock className="size-4" />
                            }
                          ]}
                        />
                      </div>
                    </div>

                    <SheetFooter className="p-4 border-t border-border shrink-0 bg-surface flex justify-between items-center gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => setIsSheetDetailOpen(false)} className="text-xs font-semibold">
                        Cerrar
                      </Button>

                      {selectedSolicitudDetalle.estado !== "Aprobada" && selectedSolicitudDetalle.estado !== "Rechazada" && (
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              setSolicitudToReject(selectedSolicitudDetalle);
                              setIsRejectOpen(true);
                            }}
                            className="text-xs font-semibold gap-1.5"
                          >
                            <XCircle className="size-4" />
                            <span>Rechazar</span>
                          </Button>

                          <Button
                            type="button"
                            variant="success"
                            size="sm"
                            onClick={() => {
                              setSolicitudToApprove(selectedSolicitudDetalle);
                              setIsApproveOpen(true);
                            }}
                            className="text-xs font-bold gap-1.5 shadow-xs"
                          >
                            <CheckCircle2 className="size-4" />
                            <span>Aprobar</span>
                          </Button>
                        </div>
                      )}
                    </SheetFooter>
                  </>
                )}
              </SheetContent>
            </Sheet>
          </div>
        )}
      </main>

      {/* ── MODAL APROBAR SOLICITUD (Categoría 4: Dialog) ── */}
      <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader className="space-y-2">
            <div className="size-10 rounded-full bg-success/10 text-success border border-success/30 flex items-center justify-center mb-1">
              <CheckCircle2 className="size-5" />
            </div>
            <DialogTitle className="text-lg font-bold text-foreground">
              Aprobar solicitud de coordinador
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              La aprobación activará al Coordinador SINARP en la plataforma, permitiéndole iniciar sesión con su cédula y contraseña.
            </DialogDescription>
          </DialogHeader>

          {solicitudToApprove && (
            <div className="my-2 p-3 bg-muted/40 rounded-xl border border-border space-y-1.5 text-xs">
              <div><span className="text-muted-foreground">Coordinador:</span> <strong>{solicitudToApprove.nombreCompleto}</strong></div>
              <div><span className="text-muted-foreground">Institución:</span> {solicitudToApprove.institucion}</div>
              <div><span className="text-muted-foreground">N.º Trámite:</span> {solicitudToApprove.id}</div>
            </div>
          )}

          <DialogFooter className="pt-4 border-t border-border flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsApproveOpen(false)} className="text-xs font-semibold">
              Cancelar
            </Button>
            <Button type="button" variant="success" size="sm" onClick={handleConfirmApprove} className="text-xs font-bold">
              Aprobar solicitud
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── MODAL RECHAZAR SOLICITUD (Categoría 4: Dialog) ── */}
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader className="space-y-2">
            <div className="size-10 rounded-full bg-danger/10 text-danger border border-danger/30 flex items-center justify-center mb-1">
              <XCircle className="size-5" />
            </div>
            <DialogTitle className="text-lg font-bold text-foreground">
              Rechazar solicitud
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Indica obligatoriamente el motivo de rechazo. Esta solicitud se cerrará definitivamente.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 my-2">
            <FormField label="Motivo del rechazo" htmlFor="motivo-rechazo-text" required>
              <Textarea
                id="motivo-rechazo-text"
                value={motivoRechazoInput}
                onChange={(e) => setMotivoRechazoInput(e.target.value)}
                placeholder="Explique claramente la razón jurídica o formal del rechazo..."
                className="text-xs min-h-[100px]"
                required
              />
            </FormField>
          </div>

          <DialogFooter className="pt-4 border-t border-border flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsRejectOpen(false)} className="text-xs font-semibold">
              Cancelar
            </Button>
            <Button type="button" variant="danger" size="sm" onClick={handleConfirmReject} className="text-xs font-bold">
              Confirmar rechazo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── MODAL PREVISUALIZAR DOCUMENTO PDF (Categoría 4: Dialog) ── */}
      <Dialog open={Boolean(previewDocModal?.open)} onOpenChange={(o) => setPreviewDocModal(o ? previewDocModal : null)}>
        <DialogContent className="max-w-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <FileText className="size-5 text-primary" />
              Previsualización de Documento
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {previewDocModal?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="p-8 border border-border rounded-xl bg-muted/20 text-center space-y-4 my-2">
            <FileSignature className="size-16 text-primary mx-auto opacity-80" />
            <h4 className="text-sm font-bold text-foreground">Instrumento Digital ARP-R02</h4>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Documento oficial de Acuerdo de Uso y Confidencialidad suscrito electrónicamente con certificado FirmaEC.
            </p>
            <Badge tone="success" appearance="soft" size="sm">Firma Electrónica Válida</Badge>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={() => setPreviewDocModal(null)} className="text-xs font-semibold">
              Cerrar previsualización
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function EnrolamientoCoordinadorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center text-xs text-muted-foreground">
          Cargando formulario de enrolamiento...
        </div>
      }
    >
      <EnrolamientoContent />
    </Suspense>
  );
}
