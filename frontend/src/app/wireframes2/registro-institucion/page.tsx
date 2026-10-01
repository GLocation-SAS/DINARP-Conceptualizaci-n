"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Building2,
  FileText,
  User,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
  FileCheck2,
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Phone,
  Mail,
  Home,
  Check,
  Search
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardTitle, CardDescription, CardDecorativeIcon } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-button";
import { Stepper, type Step as StepperStep } from "@/components/ui/stepper";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn, getAssetPath } from "@/lib/utils";
import { useSolicitudesIngresoStore, type DatosAnexoA } from "../acceso-seguridad/data/gestion-ingresos-store";




export default function RegistroInstitucionPage() {
  const router = useRouter();
  const { agregarRegistroInstitucion } = useSolicitudesIngresoStore();

  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bpmState, setBpmState] = useState<"DRAFT" | "PENDIENTE_FIRMA" | "FIRMADO">("DRAFT");

  const stepsList: StepperStep[] = [
    { id: "1", title: "Entidad", description: "Datos y autoridad", icon: Building2 },
    { id: "2", title: "Coordinadores", description: "Titular y suplente", icon: User },
    { id: "3", title: "Servicios", description: "Áreas y herramientas", icon: FileText },
    { id: "4", title: "Declaraciones y firma", description: "Certificación digital", icon: ShieldCheck },
  ];

  // Form State Anexo A
  const [formData, setFormData] = useState<DatosAnexoA>({
    entidadTipo: "" as "Publica" | "Privada",
    nombreEntidad: "",
    rucEntidad: "",
    direccionEntidad: "",
    objetoSocial: "",
    representanteLegalNombre: "",
    representanteLegalCargo: "",
    representanteLegalEmail: "",
    esDelegado: false,
    archivoSoporteDelegacion: "",

    // Coordinador Principal
    titularNombreCompleto: "",
    titularCedula: "",
    titularCargo: "",
    titularAreaUnidad: "",
    titularEmail: "",
    titularTelefonoFijo: "",
    titularMovilInstitucional: "",
    titularMovilPersonal: "",

    // Coordinador Suplente
    suplenteNombreCompleto: "",
    suplenteCedula: "",
    suplenteCargo: "",
    suplenteAreaUnidad: "",
    suplenteEmail: "",
    suplenteTelefonoFijo: "",
    suplenteMovilInstitucional: "",
    suplenteMovilPersonal: "",

    // Servicios
    serviciosHerramientas: [],
    areasUso: "",
    procesosUso: "",

    // Declaraciones
    declaracionesAceptadas: false,
    ciudadFirma: "Quito D.M.",
    fechaFirma: "24/09/2026",
    firmadoDigitalmente: false,
    archivoDocumentoFirmado: "ARP-R01_Solicitud_Acceso_SINARP_Firmada.pdf"
  });

  useEffect(() => {
    if (bpmState === "PENDIENTE_FIRMA") {
      const timer = setTimeout(() => {
        setBpmState("FIRMADO");
        agregarRegistroInstitucion(formData);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [bpmState, formData, agregarRegistroInstitucion]);

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => {
      const exists = prev.serviciosHerramientas.includes(service);
      return {
        ...prev,
        serviciosHerramientas: exists
          ? prev.serviciosHerramientas.filter((s) => s !== service)
          : [...prev.serviciosHerramientas, service]
      };
    });
  };

  const handleSimulateFill = () => {
    setFormData({
      entidadTipo: "Publica",
      nombreEntidad: "Ministerio de Telecomunicaciones y de la Sociedad de la Información",
      rucEntidad: "1760001550001",
      direccionEntidad: "Av. 6 de Diciembre N25-75 y Av. Colón, Quito",
      objetoSocial: "Rectoría y formulación de políticas públicas de telecomunicaciones y gobierno digital.",
      representanteLegalNombre: "Ing. César Antonio Martín Moreno",
      representanteLegalCargo: "Ministro de Telecomunicaciones (Representante Legal)",
      representanteLegalEmail: "ministro@mintel.gob.ec",
      esDelegado: false,
      archivoSoporteDelegacion: "",

      titularNombreCompleto: "Ing. Esteban Javier Morales Salazar",
      titularCedula: "1718956234",
      titularCargo: "Director de Gobierno Digital",
      titularAreaUnidad: "Viceministerio de Tecnologías de la Información",
      titularEmail: "esteban.morales@mintel.gob.ec",
      titularTelefonoFijo: "022200200 ext 120",
      titularMovilInstitucional: "0995544332",
      titularMovilPersonal: "0984433221",

      suplenteNombreCompleto: "Lic. Carmen Elena Vinueza Proaño",
      suplenteCedula: "1714523698",
      suplenteCargo: "Especialista de Interoperabilidad Gubernamental",
      suplenteAreaUnidad: "Dirección de Gobierno Digital",
      suplenteEmail: "carmen.vinueza@mintel.gob.ec",
      suplenteTelefonoFijo: "022200200 ext 125",
      suplenteMovilInstitucional: "0991122334",
      suplenteMovilPersonal: "0982233445",

      serviciosHerramientas: ["Interoperabilidad", "Infodigital", "Ficha de Registro Único del Ciudadano"],
      areasUso: "Dirección de Gobierno Electrónico y Dirección de Datos Públicos",
      procesosUso: "Verificación de interoperabilidad nacional de trámites ciudadanos en línea del Portal Único gob.ec.",

      declaracionesAceptadas: true,
      ciudadFirma: "Quito D.M.",
      fechaFirma: "24/09/2026",
      firmadoDigitalmente: true,
      archivoDocumentoFirmado: "ARP-R01_Solicitud_Acceso_SINARP_Mintel.pdf"
    });
    toast.success("Formulario precargado con datos del Anexo A");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.declaracionesAceptadas) {
      toast.error("Debe aceptar las declaraciones y responsabilidades legales del Anexo A.");
      return;
    }
    if (!formData.firmadoDigitalmente) {
      toast.error("Debe certificar la firma electrónica del formulario Anexo A.");
      return;
    }
    setShowConfirmModal(true);
  };

  const executeSubmit = () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setBpmState("PENDIENTE_FIRMA");
      toast.success("Anexo A enviado para firma externa", {
        description: "El trámite está a la espera de la firma electrónica.",
      });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Barra superior */}
      <header className="border-b border-border bg-surface/50 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/wireframes2/login" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <>
                <img
                  src={getAssetPath("/logo-horizontal.svg")}
                  alt="Logo DINARP"
                  className="dark:hidden h-7 w-auto object-contain dark:brightness-0 dark:invert"
                />
                <img
                  src={getAssetPath("/logo-horizontal-blanco.svg")}
                  alt="Logo DINARP"
                  className="hidden dark:block h-7 w-auto object-contain dark:brightness-0 dark:invert"
                />
              </>

            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => router.push("/wireframes2/login")}
              className="gap-2 text-xs font-medium"
            >
              <ArrowLeft className="size-3.5" />
              Volver al Login
            </Button>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {bpmState === "PENDIENTE_FIRMA" && (
          <div className="max-w-xl mx-auto bg-surface border border-border rounded-2xl p-8 space-y-6 text-center animate-in fade-in duration-300">
            <div className="size-14 rounded-full bg-warning/20 text-warning border border-warning/50 flex items-center justify-center mx-auto">
              <Clock className="size-7" />
            </div>
            <div className="space-y-2">
              <Badge tone="warning" appearance="soft" size="md" className="border border-warning/50">
                Estado: PENDIENTE DE FIRMA
              </Badge>
              <h1 className="text-2xl font-bold font-heading text-foreground">Anexo A enviado para firma</h1>
              <p className="text-xs text-muted-foreground leading-relaxed">
                El Anexo A fue enviado a los firmantes seleccionados. Te notificaremos por correo cuando el proceso de firma haya finalizado.
              </p>
            </div>
            <div className="p-4 bg-muted/40 rounded-xl border border-border text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Firmantes:</span>
                <span className="font-semibold text-foreground">{formData.representanteLegalNombre}</span>
              </div>
            </div>

          </div>
        )}

        {bpmState === "FIRMADO" && (
          <div className="max-w-xl mx-auto bg-surface border border-border rounded-2xl p-8 space-y-6 text-center animate-in fade-in duration-300">
            <div className="size-14 rounded-full bg-success/20 text-success border border-success/50 flex items-center justify-center mx-auto">
              <CheckCircle2 className="size-7" />
            </div>
            <div className="space-y-2">
              <Badge tone="success" appearance="soft" size="md" className="border border-success/50">
                Estado: EN REVISIÓN DINARP
              </Badge>
              <h1 className="text-2xl font-bold font-heading text-foreground">Anexo A firmado</h1>
              <p className="text-xs text-muted-foreground leading-relaxed">
                El proceso de firma ha finalizado correctamente. La solicitud fue enviada al Área de Gestión para continuar con su revisión.
              </p>
            </div>
          </div>
        )}



        {bpmState === "DRAFT" && (
          <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs animate-in fade-in duration-300">
            {/* Migas de pan y retorno */}
            <div className="flex items-center justify-between gap-4">
              <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Link href="/wireframes2/login" className="hover:text-foreground transition-colors flex items-center gap-1">
                  <Home className="size-3.5" />
                  <span>Portal de Acceso</span>
                </Link>
                <span>/</span>
                <span className="text-foreground font-semibold">Enrolamiento de Institución al SINARP</span>
              </nav>


            </div>

            {/* Encabezado del Trámite en Card Featured Variante Neutral */}
            <Card
              variant="featured"
              disableHover
              className="bg-surface border border-border shadow-xs mb-2"
              innerClassName="p-5 sm:p-6 gap-2"
            >
              <div className="flex items-center gap-2 mb-1">
                <Badge tone="neutral" appearance="soft" size="sm" className="border border-border font-medium">
                  FORMULARIO OFICIAL ARP-R01
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">Versión 1.0</span>
              </div>
              <CardTitle className="!text-xl sm:!text-2xl font-extrabold font-heading text-foreground">
                Anexo A — Solicitud de Acceso al Sistema Nacional de Registros Públicos
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Proceso A · Enrolamiento de Institución al SINARP
              </CardDescription>
              <CardDecorativeIcon>
                <FileText className="size-32 text-muted-foreground/15" />
              </CardDecorativeIcon>
            </Card>

            <Separator className="my-2" />

            {/* Stepper oficial UI kit (línea conectora, círculos y badges) */}
            {step > 0 && (
              <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs">
                <Stepper
                  steps={stepsList}
                  activeStep={step - 1}
                  variant="default"
                  stepPrefix="PASO"
                  showBadge={true}
                  onStepClick={(index) => {
                    if (index + 1 < step) {
                      setStep((index + 1) as 1 | 2 | 3 | 4);
                    }
                  }}
                />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ── PASO 0: VALIDACIÓN DE LA INSTITUCIÓN ── */}
              {step === 0 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <h2 className="text-lg font-bold font-heading flex items-center gap-2 text-foreground">
                      <Building2 className="size-5 text-primary" />
                      Validación de la institución
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Selecciona el tipo de institución e ingresa el RUC para validar la información y continuar con el registro.
                    </p>
                  </div>

                  {/* Stepper oficial horizontal UI Kit para Paso 1 y 2 */}
                  <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs">
                    <Stepper
                      steps={[
                        { id: "paso-1", title: "Tipo de institución" },
                        { id: "paso-2", title: "Validación de RUC" },
                      ]}
                      activeStep={
                        formData.rucEntidad.length === 13
                          ? 1
                          : formData.entidadTipo
                            ? 1
                            : 0
                      }
                      completedSteps={
                        formData.rucEntidad.length === 13
                          ? [0, 1]
                          : formData.entidadTipo
                            ? [0]
                            : []
                      }
                      startIndex={1}
                      stepPrefix="PASO"
                      showBadge={true}
                      variant="default"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Card 1: Naturaleza */}
                    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-center">
                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-semibold text-foreground">
                          Naturaleza de la institución <span className="text-warning">*</span>
                        </Label>
                        <RadioGroup
                          value={formData.entidadTipo}
                          onValueChange={(val) => {
                            if (val) setFormData({ ...formData, entidadTipo: val as "Publica" | "Privada" });
                          }}
                          orientation="horizontal"
                          className="flex items-center gap-6 pt-2"
                        >
                          <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer select-none">
                            <RadioGroupItem
                              value="Publica"
                              variant="primary"
                              size="md"
                            />
                            <span>Institución pública</span>
                          </label>

                          <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer select-none">
                            <RadioGroupItem
                              value="Privada"
                              variant="primary"
                              size="md"
                            />
                            <span>Institución privada</span>
                          </label>
                        </RadioGroup>
                      </div>
                    </div>

                    {/* Card 2: RUC */}
                    <div
                      className={cn(
                        "bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-center transition-opacity",
                        !formData.entidadTipo && "opacity-60"
                      )}
                    >
                      <div className="flex flex-col gap-2">
                        <div>
                          <Label htmlFor="rucEntidad-0" className="text-xs font-semibold text-foreground">
                            Número de RUC de la Entidad <span className="text-warning">*</span>
                          </Label>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {!formData.entidadTipo
                              ? "Selecciona primero la naturaleza de la institución en el Paso 1."
                              : "Ingresa el RUC de 13 dígitos."}
                          </p>
                        </div>
                        <InputGroup
                          state={formData.rucEntidad.length === 13 ? "success" : "default"}
                          rightIcon={
                            formData.rucEntidad.length === 13 ? (
                              <CheckCircle2 className="size-4 text-success" />
                            ) : undefined
                          }
                          className="w-full"
                        >
                          <InputGroupInput
                            id="rucEntidad-0"
                            value={formData.rucEntidad}
                            maxLength={13}
                            disabled={!formData.entidadTipo}
                            onChange={(e) => setFormData({ ...formData, rucEntidad: e.target.value.replace(/\D/g, "") })}
                            placeholder={!formData.entidadTipo ? "Primero selecciona tipo..." : "1111111111111"}
                            className="text-xs font-mono tracking-wider disabled:cursor-not-allowed"
                            required
                          />
                        </InputGroup>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-border/60">
                    <Link href="/wireframes2/login" className="w-full sm:w-auto">
                      <Button
                        type="button"
                        variant="neutral"
                        size="default"
                        className="text-xs font-semibold gap-1.5 w-full"
                      >
                        <ArrowLeft className="size-4" />
                        <span>Volver al acceso principal</span>
                      </Button>
                    </Link>

                    <Button
                      type="button"
                      variant="primary"
                      size="default"
                      onClick={() => {
                        if (!formData.rucEntidad || formData.rucEntidad.length < 13) {
                          toast.error("Por favor ingresa un RUC válido de 13 dígitos.");
                          return;
                        }
                        setStep(1);
                        toast.success("Institución validada correctamente.");
                      }}
                      className="text-xs font-semibold gap-1.5 w-full sm:w-[280px]"
                    >
                      <Search className="size-4" />
                      <span>Validar información</span>
                    </Button>
                  </div>
                </div>
              )}

              {/* ── PASO 1: DATOS DE LA ENTIDAD Y MÁXIMA AUTORIDAD ── */}
              {step === 1 && (
                <div className="bg-surface border border-border rounded-2xl p-6 space-y-5 animate-in fade-in duration-200">
                  <div className="bg-primary-100/20 border-b border-primary p-3 mb-5 flex items-center justify-between rounded-t-lg">
                    <div>
                      <h2 className="text-sm font-bold font-heading text-primary flex items-center gap-2">
                        <Building2 className="size-4 text-primary" />
                        Sección I — Cláusula Primera: 1.1 Del Solicitante
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Información general de la entidad requirente y de su máxima autoridad o delegado.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="flex flex-col gap-2 sm:col-span-2">
                      <Label className="text-xs font-semibold text-foreground">
                        Naturaleza de la Entidad
                      </Label>
                      <RadioGroup
                        orientation="horizontal"
                        value={formData.entidadTipo}
                        onValueChange={(val) => setFormData({ ...formData, entidadTipo: val as "Publica" | "Privada" })}
                        className="flex gap-6 pt-1"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="Publica" id="entidad-publica" />
                          <Label htmlFor="entidad-publica" className="text-xs font-medium cursor-pointer">
                            Entidad Pública
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="Privada" id="entidad-privada" />
                          <Label htmlFor="entidad-privada" className="text-xs font-medium cursor-pointer">
                            Entidad Privada
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="nombreEntidad" className="text-xs font-semibold text-foreground">
                        Nombre de la Entidad <span className="text-warning">*</span>
                      </Label>
                      <Input
                        id="nombreEntidad"
                        value={formData.nombreEntidad}
                        onChange={(e) => setFormData({ ...formData, nombreEntidad: e.target.value })}
                        placeholder="Ej. Ministerio de Salud Pública"
                        className="text-xs"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="rucEntidad" className="text-xs font-semibold text-foreground">
                        RUC de la Entidad (13 dígitos) <span className="text-warning">*</span>
                      </Label>
                      <Input
                        id="rucEntidad"
                        value={formData.rucEntidad}
                        maxLength={13}
                        onChange={(e) => setFormData({ ...formData, rucEntidad: e.target.value.replace(/\D/g, "") })}
                        placeholder="1760000000001"
                        className="text-xs font-mono"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-2 sm:col-span-2">
                      <Label htmlFor="direccionEntidad" className="text-xs font-semibold text-foreground">
                        Dirección de la Entidad <span className="text-warning">*</span>
                      </Label>
                      <Input
                        id="direccionEntidad"
                        value={formData.direccionEntidad}
                        onChange={(e) => setFormData({ ...formData, direccionEntidad: e.target.value })}
                        placeholder="Calle principal, número y calle secundaria, ciudad"
                        className="text-xs"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-2 sm:col-span-2">
                      <Label htmlFor="objetoSocial" className="text-xs font-semibold text-foreground">
                        Objeto Social y/o Actividad de la Entidad <span className="text-warning">*</span>
                      </Label>
                      <Textarea
                        id="objetoSocial"
                        value={formData.objetoSocial}
                        onChange={(e) => setFormData({ ...formData, objetoSocial: e.target.value })}
                        placeholder="Detalle la misión, competencias legales u objeto social institucional..."
                        className="text-xs min-h-[70px]"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-2 sm:col-span-2 pt-2 border-t border-border/60">
                      <h3 className="text-xs font-bold text-foreground">
                        Máxima autoridad / delegado / representante legal o apoderado
                      </h3>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="repNombre" className="text-xs font-semibold text-foreground">
                        Nombre de la máxima autoridad o apoderado <span className="text-warning">*</span>
                      </Label>
                      <Input
                        id="repNombre"
                        value={formData.representanteLegalNombre}
                        onChange={(e) => setFormData({ ...formData, representanteLegalNombre: e.target.value })}
                        placeholder="Nombres y apellidos completos"
                        className="text-xs"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="repCargo" className="text-xs font-semibold text-foreground">
                        Denominación del Cargo <span className="text-warning">*</span>
                      </Label>
                      <Input
                        id="repCargo"
                        value={formData.representanteLegalCargo}
                        onChange={(e) => setFormData({ ...formData, representanteLegalCargo: e.target.value })}
                        placeholder="Ej. Ministro / Director Ejecutivo / Apoderado"
                        className="text-xs"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="repEmail" className="text-xs font-semibold text-foreground">
                        Correo Electrónico de la Autoridad <span className="text-warning">*</span>
                      </Label>
                      <Input
                        id="repEmail"
                        type="email"
                        value={formData.representanteLegalEmail}
                        onChange={(e) => setFormData({ ...formData, representanteLegalEmail: e.target.value })}
                        placeholder="autoridad@institucion.gob.ec"
                        className="text-xs"
                        required
                      />
                    </div>

                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-border/60">
                    <Link href="/wireframes2/login" className="w-full sm:w-auto">
                      <Button
                        type="button"
                        variant="secondary"
                        size="default"
                        className="text-xs font-semibold gap-1.5 w-full sm:w-auto"
                      >
                        <ArrowLeft className="size-4" />
                        <span>Volver al Login</span>
                      </Button>
                    </Link>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                      <Button
                        type="button"
                        variant="neutral"
                        size="default"
                        onClick={() => setStep(0)}
                        className="text-xs font-semibold gap-1.5 w-full sm:w-auto"
                      >
                        <ArrowLeft className="size-4" />
                        <span>Regresar al paso anterior</span>
                      </Button>

                      <Button
                        type="button"
                        variant="primary"
                        size="default"
                        onClick={() => {
                          if (!formData.nombreEntidad || !formData.rucEntidad || !formData.representanteLegalNombre) {
                            toast.error("Por favor completa los campos obligatorios de la entidad.");
                            return;
                          }
                          setStep(2);
                        }}
                        className="text-xs font-semibold gap-1.5 w-full sm:w-[260px]"
                      >
                        <span className="whitespace-nowrap">Siguiente: Coordinadores</span>
                        <ArrowRight className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── PASO 2: COORDINADOR TITULAR Y SUPLENTE ── */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* Coordinador Titular */}
                  <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
                    <div className="bg-primary-100/20 border-b border-primary p-3 mb-5 flex items-center justify-between rounded-t-lg">
                      <div>
                        <h2 className="text-sm font-bold font-heading text-primary flex items-center gap-2">
                          <User className="size-4 text-primary" />
                          1.2 Coordinador Institucional Principal (Titular)
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Ingresa los datos del coordinador institucional titular designado por la entidad.
                        </p>
                      </div>
                      <Badge tone="neutral" appearance="soft" size="sm" className="border border-border">
                        TITULAR
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-semibold text-foreground">Nombre Completo <span className="text-warning">*</span></Label>
                        <Input
                          value={formData.titularNombreCompleto}
                          onChange={(e) => setFormData({ ...formData, titularNombreCompleto: e.target.value })}
                          placeholder="Nombres y apellidos completos"
                          className="text-xs"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-semibold text-foreground">Cédula de Ciudadanía <span className="text-warning">*</span></Label>
                        <Input
                          value={formData.titularCedula}
                          maxLength={10}
                          onChange={(e) => setFormData({ ...formData, titularCedula: e.target.value.replace(/\D/g, "") })}
                          placeholder="10 dígitos numéricos"
                          className="text-xs font-mono"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-semibold text-foreground">Cargo / Rol en la Institución <span className="text-warning">*</span></Label>
                        <Input
                          value={formData.titularCargo}
                          onChange={(e) => setFormData({ ...formData, titularCargo: e.target.value })}
                          placeholder="Ej. Director de Tecnologías"
                          className="text-xs"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-semibold text-foreground">Área / Unidad a la que pertenece <span className="text-warning">*</span></Label>
                        <Input
                          value={formData.titularAreaUnidad}
                          onChange={(e) => setFormData({ ...formData, titularAreaUnidad: e.target.value })}
                          placeholder="Ej. Dirección de Tecnologías de Información"
                          className="text-xs"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-semibold text-foreground">Correo Electrónico Institucional <span className="text-warning">*</span></Label>
                        <Input
                          type="email"
                          value={formData.titularEmail}
                          onChange={(e) => setFormData({ ...formData, titularEmail: e.target.value })}
                          placeholder="titular@institucion.gob.ec"
                          className="text-xs"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-semibold text-foreground">Teléfono Fijo Institucional <span className="text-warning">*</span></Label>
                        <Input
                          value={formData.titularTelefonoFijo}
                          onChange={(e) => setFormData({ ...formData, titularTelefonoFijo: e.target.value })}
                          placeholder="023814400 ext 123"
                          className="text-xs"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-semibold text-foreground">Móvil Institucional <span className="text-warning">*</span></Label>
                        <Input
                          value={formData.titularMovilInstitucional}
                          onChange={(e) => setFormData({ ...formData, titularMovilInstitucional: e.target.value })}
                          placeholder="0991234567"
                          className="text-xs font-mono"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-semibold text-foreground">Móvil Personal <span className="text-warning">*</span></Label>
                        <Input
                          value={formData.titularMovilPersonal}
                          onChange={(e) => setFormData({ ...formData, titularMovilPersonal: e.target.value })}
                          placeholder="0987654321"
                          className="text-xs font-mono"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Coordinador Suplente */}
                  <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
                    <div className="bg-primary-100/20 border-b border-primary p-3 mb-5 flex items-center justify-between rounded-t-lg">
                      <div>
                        <h2 className="text-sm font-bold font-heading text-primary flex items-center gap-2">
                          <User className="size-4 text-primary" />
                          1.3 Coordinador Institucional Suplente
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Ingresa los datos del coordinador institucional suplente designado por la entidad.
                        </p>
                      </div>
                      <Badge tone="neutral" appearance="soft" size="sm" className="border border-border">
                        SUPLENTE
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-semibold text-foreground">Nombre Completo <span className="text-warning">*</span></Label>
                        <Input
                          value={formData.suplenteNombreCompleto}
                          onChange={(e) => setFormData({ ...formData, suplenteNombreCompleto: e.target.value })}
                          placeholder="Nombres y apellidos completos"
                          className="text-xs"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-semibold text-foreground">Cédula de Ciudadanía <span className="text-warning">*</span></Label>
                        <Input
                          value={formData.suplenteCedula}
                          maxLength={10}
                          onChange={(e) => setFormData({ ...formData, suplenteCedula: e.target.value.replace(/\D/g, "") })}
                          placeholder="10 dígitos numéricos"
                          className="text-xs font-mono"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-semibold text-foreground">Cargo / Rol en la Institución <span className="text-warning">*</span></Label>
                        <Input
                          value={formData.suplenteCargo}
                          onChange={(e) => setFormData({ ...formData, suplenteCargo: e.target.value })}
                          placeholder="Ej. Especialista de Infraestructura"
                          className="text-xs"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-semibold text-foreground">Área / Unidad a la que pertenece <span className="text-warning">*</span></Label>
                        <Input
                          value={formData.suplenteAreaUnidad}
                          onChange={(e) => setFormData({ ...formData, suplenteAreaUnidad: e.target.value })}
                          placeholder="Ej. Dirección de Tecnologías de Información"
                          className="text-xs"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-semibold text-foreground">Correo Electrónico Institucional <span className="text-warning">*</span></Label>
                        <Input
                          type="email"
                          value={formData.suplenteEmail}
                          onChange={(e) => setFormData({ ...formData, suplenteEmail: e.target.value })}
                          placeholder="suplente@institucion.gob.ec"
                          className="text-xs"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-semibold text-foreground">Teléfono Fijo Institucional <span className="text-warning">*</span></Label>
                        <Input
                          value={formData.suplenteTelefonoFijo}
                          onChange={(e) => setFormData({ ...formData, suplenteTelefonoFijo: e.target.value })}
                          placeholder="023814400 ext 124"
                          className="text-xs"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-semibold text-foreground">Móvil Institucional <span className="text-warning">*</span></Label>
                        <Input
                          value={formData.suplenteMovilInstitucional}
                          onChange={(e) => setFormData({ ...formData, suplenteMovilInstitucional: e.target.value })}
                          placeholder="0998877665"
                          className="text-xs font-mono"
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label className="text-xs font-semibold text-foreground">Móvil Personal <span className="text-warning">*</span></Label>
                        <Input
                          value={formData.suplenteMovilPersonal}
                          onChange={(e) => setFormData({ ...formData, suplenteMovilPersonal: e.target.value })}
                          placeholder="0981122334"
                          className="text-xs font-mono"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-border/60">
                    <Button
                      type="button"
                      variant="neutral"
                      size="default"
                      onClick={() => setStep(1)}
                      className="text-xs font-semibold gap-1.5 w-full sm:w-[280px]"
                    >
                      <ArrowLeft className="size-4" />
                      <span>Volver a Entidad</span>
                    </Button>

                    <Button
                      type="button"
                      variant="primary"
                      size="default"
                      onClick={() => {
                        if (!formData.titularNombreCompleto || !formData.titularCedula || !formData.suplenteNombreCompleto || !formData.suplenteCedula) {
                          toast.error("Por favor completa los datos de ambos coordinadores.");
                          return;
                        }
                        setStep(3);
                      }}
                      className="text-xs font-semibold gap-1.5 w-full sm:w-[280px]"
                    >
                      <span className="whitespace-nowrap">Siguiente: Servicios y Procesos</span>
                      <ArrowRight className="size-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* ── PASO 3: SERVICIOS Y HERRAMIENTAS ── */}
              {step === 3 && (
                <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-8 animate-in fade-in duration-200">
                  <div className="bg-primary-100/20 border-b border-primary p-4 rounded-t-lg">
                    <h2 className="text-base font-bold font-heading text-primary flex items-center gap-2">
                      <FileCheck2 className="size-5 text-primary" />
                      Sección II — Servicios y Herramientas Informáticas
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      Procesos y áreas en las que se van a utilizar los servicios y/o herramientas provistos por la DINARP.
                    </p>
                  </div>

                  <div className="flex flex-col gap-8">
                    {/* 2.1 Servicios */}
                    <div className="flex flex-col gap-3">
                      <div>
                        <Label className="text-sm font-semibold text-foreground">
                          2.1 Servicios y/o herramientas requeridas <span className="text-warning">*</span>
                        </Label>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Selecciona al menos uno de los servicios provistos por la DINARP.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                        {["Interoperabilidad", "Infodigital", "Ficha de Registro Único del Ciudadano"].map((s) => (
                          <label
                            key={s}
                            className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-card/60 hover:bg-muted/40 transition-colors cursor-pointer"
                          >
                            <Checkbox
                              checked={formData.serviciosHerramientas.includes(s)}
                              onCheckedChange={() => handleServiceToggle(s)}
                            />
                            <span className="font-semibold text-xs text-foreground leading-snug">{s}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Áreas de uso */}
                    <div className="flex flex-col gap-3">
                      <div>
                        <Label htmlFor="areasUso" className="text-sm font-semibold text-foreground">
                          Áreas donde se van a utilizar los servicios y/o herramientas <span className="text-warning">*</span>
                        </Label>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Indica las áreas administrativas o técnicas de la institución que utilizarán el servicio.
                        </p>
                      </div>
                      <Textarea
                        id="areasUso"
                        value={formData.areasUso}
                        onChange={(e) => setFormData({ ...formData, areasUso: e.target.value })}
                        placeholder="Detallar las áreas administrativas o técnicas de su institución para las cuales requiere el servicio..."
                        className="text-xs min-h-[96px] leading-relaxed p-3"
                        required
                      />
                    </div>

                    <Separator />

                    {/* Procesos de uso */}
                    <div className="flex flex-col gap-3">
                      <div>
                        <Label htmlFor="procesosUso" className="text-sm font-semibold text-foreground">
                          Procesos para los cuales utilizará los servicios y/o herramientas <span className="text-warning">*</span>
                        </Label>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Describe los procesos internos, trámites o plataformas para los cuales se consumirán los datos.
                        </p>
                      </div>
                      <Textarea
                        id="procesosUso"
                        value={formData.procesosUso}
                        onChange={(e) => setFormData({ ...formData, procesosUso: e.target.value })}
                        placeholder="Detalle los trámites, plataformas o procesos sustantivos que consumirán los datos..."
                        className="text-xs min-h-[96px] leading-relaxed p-3"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6 border-t border-border/60">
                    <Link href="/wireframes2/login" className="w-full sm:w-auto">
                      <Button
                        type="button"
                        variant="secondary"
                        size="default"
                        className="text-xs font-semibold gap-1.5 w-full sm:w-auto"
                      >
                        <ArrowLeft className="size-4" />
                        <span>Volver al Login</span>
                      </Button>
                    </Link>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                      <Button
                        type="button"
                        variant="neutral"
                        size="default"
                        onClick={() => setStep(2)}
                        className="text-xs font-semibold gap-1.5 w-full sm:w-auto"
                      >
                        <ArrowLeft className="size-4" />
                        <span>Volver a Coordinadores</span>
                      </Button>

                      <Button
                        type="button"
                        variant="primary"
                        size="default"
                        onClick={() => {
                          if (formData.serviciosHerramientas.length === 0 || !formData.areasUso || !formData.procesosUso) {
                            toast.error("Por favor completa las herramientas, áreas y procesos de uso.");
                            return;
                          }
                          setStep(4);
                        }}
                        className="text-xs font-semibold gap-1.5 w-full sm:w-[280px]"
                      >
                        <span className="whitespace-nowrap">Siguiente: Declaraciones y firma</span>
                        <ArrowRight className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── PASO 4: DECLARACIONES, GENERACIÓN Y FIRMA DIGITAL ── */}
              {step === 4 && (
                <div className="bg-surface border border-border rounded-2xl p-6 space-y-6 animate-in fade-in duration-200">
                  <div className="bg-primary-100/20 border-b border-primary p-3 mb-5 rounded-t-lg">
                    <h2 className="text-sm font-bold font-heading text-primary flex items-center gap-2">
                      <ShieldCheck className="size-4 text-primary" />
                      Sección III — Cláusula Segunda y Tercera: Declaraciones y Firma
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Suscripción digital oficial del instrumento ARP-R01 conforme a la Ley de Comercio Electrónico y Firmas Electrónicas.
                    </p>
                  </div>

                  {/* Bloque Legal de Declaraciones */}
                  <div className="p-4 rounded-xl bg-muted/40 border border-border/80 space-y-3 text-xs">
                    <h3 className="font-bold text-foreground">
                      2.2 Cláusula Segunda: Declaraciones del Solicitante
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-[11px]">
                      La entidad solicitante declara conocer los servicios provistos por la DINARP, así como los arts. 66 numerales 11 y 19 de la Constitución, art. 6 de la Ley Orgánica del Sistema Nacional de Registros Públicos, Ley de Optimización de Trámites, Ley Orgánica de Protección de Datos Personales, y arts. 178, 180 y 229 del COIP. La institución queda obligada a dar a la información el uso exclusivo para el que le sea concedido y custodiarla con prudencia.
                    </p>
                    <div className="flex items-start gap-2 pt-2 border-t border-border/60">
                      <Checkbox
                        id="declaraciones"
                        checked={formData.declaracionesAceptadas}
                        onCheckedChange={(checked) => setFormData({ ...formData, declaracionesAceptadas: Boolean(checked) })}
                      />
                      <Label htmlFor="declaraciones" className="text-xs cursor-pointer font-semibold text-foreground">
                        Acepto expresamente las declaraciones legales, términos y responsabilidades del Anexo A.
                      </Label>
                    </div>
                  </div>

                  {/* Resumen de Firmante */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1">
                      <span className="text-[11px] text-muted-foreground block">Firmante Autorizado:</span>
                      <span className="font-bold text-foreground text-sm block">{formData.representanteLegalNombre}</span>
                      <span className="text-muted-foreground">{formData.representanteLegalCargo}</span>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1">
                      <span className="text-[11px] text-muted-foreground block">Lugar y Fecha:</span>
                      <span className="font-bold text-foreground text-sm block">{formData.ciudadFirma}</span>
                      <span className="text-muted-foreground">{formData.fechaFirma}</span>
                    </div>
                  </div>

                  {/* Certificación de Firma Electrónica */}
                  <div className="p-4 rounded-xl border border-border bg-muted/30 flex items-start gap-3">
                    <Checkbox
                      id="firmaDigital"
                      checked={formData.firmadoDigitalmente}
                      onCheckedChange={(checked) => setFormData({ ...formData, firmadoDigitalmente: Boolean(checked) })}
                      className="mt-0.5"
                    />
                    <div className="space-y-1 text-xs">
                      <Label htmlFor="firmaDigital" className="font-bold text-foreground cursor-pointer">
                        Certificar suscripción con Firma Electrónica (.p12 / Token)
                      </Label>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Al enviar esta solicitud, se generará el documento oficial ARP-R01 con estampado cronológico y firma de la autoridad requirente, remitiéndose automáticamente al área de Gestión y Registro de DINARP.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6 border-t border-border/60">
                    <Link href="/wireframes2/login" className="w-full sm:w-auto">
                      <Button
                        type="button"
                        variant="secondary"
                        size="default"
                        className="text-xs font-semibold gap-1.5 w-full sm:w-auto"
                      >
                        <ArrowLeft className="size-4" />
                        <span>Volver al Login</span>
                      </Button>
                    </Link>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                      <Button
                        type="button"
                        variant="neutral"
                        size="default"
                        onClick={() => setStep(3)}
                        className="text-xs font-semibold gap-1.5 w-full sm:w-auto"
                      >
                        <ArrowLeft className="size-4" />
                        <span>Volver a Servicios</span>
                      </Button>

                      <Button
                        type="submit"
                        variant="primary"
                        size="default"
                        disabled={isSubmitting || !formData.declaracionesAceptadas || !formData.firmadoDigitalmente}
                        className="text-xs font-semibold gap-2 shadow-xs w-full sm:w-auto px-6 whitespace-nowrap"
                      >
                        {isSubmitting ? (
                          <span className="whitespace-nowrap">Enviando trámite...</span>
                        ) : (
                          <>
                            <span className="whitespace-nowrap">Generar Anexo A y Enviar a Firma Externa</span>
                            <Check className="size-4 shrink-0" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
      </main>

      {/* Botón flotante para Demo */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          type="button"
          variant="neutral"
          size="default"
          onClick={handleSimulateFill}
          className="shadow-lg rounded-full px-5 py-6 flex items-center gap-2"
        >
          <Sparkles className="size-5" />
          <span className="font-semibold text-sm">Llenar datos: Demo</span>
        </Button>
      </div>

      {/* Modal de confirmación */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="size-5 text-warning" />
              Confirmar Generación
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro que deseas generar el Anexo A y enviarlo a firma externa? Revisa que los datos ingresados sean correctos.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setShowConfirmModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={executeSubmit}>
              Confirmar y Generar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
