"use client";

import React, { useState } from "react";
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
  Check
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-button";
import { Stepper, type Step as StepperStep } from "@/components/ui/stepper";
import { ThemeToggle } from "@/components/theme-toggle";
import { getAssetPath } from "@/lib/utils";
import { useSolicitudesIngresoStore, type DatosAnexoA } from "../acceso-seguridad/data/gestion-ingresos-store";

export default function RegistroInstitucionPage() {
  const router = useRouter();
  const { agregarRegistroInstitucion } = useSolicitudesIngresoStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const stepsList: StepperStep[] = [
    { id: "1", title: "Entidad", description: "Datos y autoridad", icon: Building2 },
    { id: "2", title: "Coordinadores", description: "Titular y suplente", icon: User },
    { id: "3", title: "Servicios", description: "Áreas y herramientas", icon: FileText },
    { id: "4", title: "Firma", description: "Certificación digital", icon: ShieldCheck },
  ];

  // Form State Anexo A
  const [formData, setFormData] = useState<DatosAnexoA>({
    entidadTipo: "Publica",
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
    serviciosHerramientas: ["Interoperabilidad SINARP"],
    areasUso: "",
    procesosUso: "",

    // Declaraciones
    declaracionesAceptadas: false,
    ciudadFirma: "Quito D.M.",
    fechaFirma: "24/09/2026",
    firmadoDigitalmente: false,
    archivoDocumentoFirmado: "ARP-R01_Solicitud_Acceso_SINARP_Firmada.pdf"
  });

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

      serviciosHerramientas: ["Interoperabilidad SINARP", "Infodigital", "Ficha de Registro Único del Ciudadano"],
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

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      agregarRegistroInstitucion(formData);
      setIsSuccess(true);
      toast.success("Solicitud enviada a la DINARP", {
        description: "El trámite ingresó a la bandeja de revisión institucional.",
      });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Barra superior */}
      <header className="border-b border-border bg-surface/50 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/wireframes2/login" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img
                src={getAssetPath("/logotipo.png")}
                alt="Logo DINARP"
                className="h-7 w-auto object-contain dark:brightness-0 dark:invert"
              />
              <div className="h-4 w-px bg-border" />
              <span className="text-xs font-semibold text-muted-foreground">
                Proceso A: Registro Institucional
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSimulateFill}
              className="text-xs font-semibold gap-1.5 border-dashed"
            >
              <Sparkles className="size-3.5 text-foreground" />
              <span>Llenar Demo</span>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {isSuccess ? (
          <div className="max-w-xl mx-auto bg-surface border border-border rounded-2xl p-8 space-y-6 text-center animate-in fade-in duration-300">
            <div className="size-14 rounded-full bg-muted text-foreground border border-border flex items-center justify-center mx-auto">
              <CheckCircle2 className="size-7 text-foreground" />
            </div>

            <div className="space-y-2">
              <Badge tone="neutral" appearance="soft" size="md" className="border border-border">
                Código: ARP-R01 · Solicitud Enviada
              </Badge>
              <h1 className="text-2xl font-bold font-heading text-foreground">
                Solicitud de Acceso Institucional Registrada
              </h1>
              <p className="text-xs text-muted-foreground leading-relaxed">
                El documento suscrito por la máxima autoridad o su delegado ha ingresado a la Dirección de Gestión y Registro de la DINARP para su verificación legal y técnica.
              </p>
            </div>

            <div className="p-4 bg-muted/40 rounded-xl border border-border text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Institución:</span>
                <span className="font-semibold text-foreground">{formData.nombreEntidad}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Coordinador Titular Designado:</span>
                <span className="font-semibold text-foreground">{formData.titularNombreCompleto}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Coordinador Suplente Designado:</span>
                <span className="font-semibold text-foreground">{formData.suplenteNombreCompleto}</span>
              </div>
              <div className="pt-2 border-t border-border/60 text-[11px] text-muted-foreground flex items-start gap-2">
                <Clock className="size-4 shrink-0 mt-0.5 text-foreground" />
                <span>
                  <strong>Siguiente paso del BPM:</strong> Una vez aprobada la institución por DINARP, los coordinadores quedarán <strong>prerregistrados</strong> y recibirán la invitación para suscribir su Acuerdo de Confidencialidad (Anexo B).
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                asChild
                variant="primary"
                size="default"
                className="flex-1 text-xs font-semibold gap-2"
              >
                <Link href="/wireframes2/login">
                  <span>Ir al Portal de Acceso</span>
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="default"
                className="flex-1 text-xs font-semibold"
              >
                <Link href="/wireframes2/acceso-seguridad/gestion-ingresos">
                  <span>Ver en Bandeja DGR</span>
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Migas de pan y retorno */}
            <div className="flex items-center justify-between gap-4">
              <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Link href="/wireframes2/login" className="hover:text-foreground transition-colors flex items-center gap-1">
                  <Home className="size-3.5" />
                  <span>Portal de Acceso</span>
                </Link>
                <span>/</span>
                <Link href="/wireframes2/acceso-seguridad/gestion-ingresos" className="hover:text-foreground transition-colors">
                  Bandeja DGR
                </Link>
                <span>/</span>
                <span className="text-foreground font-semibold">Solicitud Anexo A</span>
              </nav>

              <Button
                asChild
                variant="outline"
                className="h-9 px-3.5 text-xs font-semibold gap-1.5 rounded-full border-border/80 bg-surface shadow-xs hover:bg-muted/40 shrink-0"
              >
                <Link href="/wireframes2/login">
                  <ArrowLeft className="size-3.5" />
                  <span>Volver al portal</span>
                </Link>
              </Button>
            </div>

            {/* Encabezado del Trámite */}
            <div className="border-b border-border/80 pb-4">
              <div className="flex items-center gap-2">
                <Badge tone="neutral" appearance="soft" size="sm" className="border border-border">
                  Formulario Oficial ARP-R01
                </Badge>
                <span className="text-xs text-muted-foreground font-mono">Versión 1.0</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-foreground mt-1">
                Solicitud de Acceso al Sistema Nacional de Registros Públicos
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Proceso A: Registro / Alta de la institución y prerregistro de coordinadores institucionales.
              </p>
            </div>

            {/* Stepper oficial UI kit (línea conectora, círculos y badges) */}
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

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ── PASO 1: DATOS DE LA ENTIDAD Y MÁXIMA AUTORIDAD ── */}
              {step === 1 && (
                <div className="bg-surface border border-border rounded-2xl p-6 space-y-5 animate-in fade-in duration-200">
                  <div className="border-b border-border/70 pb-3 flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold font-heading text-foreground flex items-center gap-2">
                        <Building2 className="size-4 text-foreground" />
                        Sección I — Cláusula Primera: 1.1 Del Solicitante
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Información general de la entidad requirente y de su máxima autoridad o delegado.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5 sm:col-span-2">
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

                    <div className="space-y-1.5">
                      <Label htmlFor="nombreEntidad" className="text-xs font-semibold text-foreground">
                        Nombre de la Entidad <span className="text-foreground">*</span>
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

                    <div className="space-y-1.5">
                      <Label htmlFor="rucEntidad" className="text-xs font-semibold text-foreground">
                        RUC de la Entidad (13 dígitos) <span className="text-foreground">*</span>
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

                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="direccionEntidad" className="text-xs font-semibold text-foreground">
                        Dirección de la Entidad <span className="text-foreground">*</span>
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

                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="objetoSocial" className="text-xs font-semibold text-foreground">
                        Objeto Social y/o Actividad de la Entidad <span className="text-foreground">*</span>
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

                    <div className="space-y-1.5 sm:col-span-2 pt-2 border-t border-border/60">
                      <h3 className="text-xs font-bold text-foreground">
                        Representante Legal o Delegado
                      </h3>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="repNombre" className="text-xs font-semibold text-foreground">
                        Nombres de la Máxima Autoridad / Delegado / Representante Legal <span className="text-foreground">*</span>
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

                    <div className="space-y-1.5">
                      <Label htmlFor="repCargo" className="text-xs font-semibold text-foreground">
                        Denominación del Cargo <span className="text-foreground">*</span>
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

                    <div className="space-y-1.5">
                      <Label htmlFor="repEmail" className="text-xs font-semibold text-foreground">
                        Correo Electrónico de la Autoridad <span className="text-foreground">*</span>
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

                    <div className="space-y-1.5 flex flex-col justify-end">
                      <div className="flex items-center gap-2 p-2.5 rounded-xl border border-border/80 bg-muted/20">
                        <Checkbox
                          id="esDelegado"
                          checked={formData.esDelegado}
                          onCheckedChange={(checked) => setFormData({ ...formData, esDelegado: Boolean(checked) })}
                        />
                        <Label htmlFor="esDelegado" className="text-xs cursor-pointer text-foreground">
                          ¿Firma mediante delegación expresa? (Requiere adjuntar soporte)
                        </Label>
                      </div>
                    </div>

                    {formData.esDelegado && (
                      <div className="space-y-1.5 sm:col-span-2 p-3 rounded-xl border border-border bg-muted/40">
                        <Label className="text-xs font-semibold text-foreground flex items-center gap-2">
                          <UploadCloud className="size-4 text-foreground" />
                          Soporte de Delegación (Acción de Personal / Poder Notariado)
                        </Label>
                        <Input
                          type="text"
                          value={formData.archivoSoporteDelegacion || "Accion_Personal_Delegacion_Firmante.pdf"}
                          onChange={(e) => setFormData({ ...formData, archivoSoporteDelegacion: e.target.value })}
                          className="text-xs font-mono"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-4 border-t border-border/60">
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
                      className="text-xs font-semibold gap-1.5"
                    >
                      <span>Siguiente: Coordinadores</span>
                      <ArrowRight className="size-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* ── PASO 2: COORDINADOR TITULAR Y SUPLENTE ── */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* Coordinador Titular */}
                  <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
                    <div className="border-b border-border/70 pb-3 flex items-center justify-between">
                      <div>
                        <h2 className="text-sm font-bold font-heading text-foreground flex items-center gap-2">
                          <User className="size-4 text-foreground" />
                          1.2 Coordinador Institucional Principal (Titular)
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Funcionario que actuará como enlace operativo y administrador titular ante la DINARP.
                        </p>
                      </div>
                      <Badge tone="neutral" appearance="soft" size="sm" className="border border-border">
                        Prerregistro Titular
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-foreground">Nombre Completo *</Label>
                        <Input
                          value={formData.titularNombreCompleto}
                          onChange={(e) => setFormData({ ...formData, titularNombreCompleto: e.target.value })}
                          placeholder="Nombres y apellidos completos"
                          className="text-xs"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-foreground">Cédula de Ciudadanía *</Label>
                        <Input
                          value={formData.titularCedula}
                          maxLength={10}
                          onChange={(e) => setFormData({ ...formData, titularCedula: e.target.value.replace(/\D/g, "") })}
                          placeholder="10 dígitos numéricos"
                          className="text-xs font-mono"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-foreground">Cargo / Rol en la Institución *</Label>
                        <Input
                          value={formData.titularCargo}
                          onChange={(e) => setFormData({ ...formData, titularCargo: e.target.value })}
                          placeholder="Ej. Director de Tecnologías"
                          className="text-xs"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-foreground">Área / Unidad a la que pertenece *</Label>
                        <Input
                          value={formData.titularAreaUnidad}
                          onChange={(e) => setFormData({ ...formData, titularAreaUnidad: e.target.value })}
                          placeholder="Ej. Dirección de Tecnologías de Información"
                          className="text-xs"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-foreground">Correo Electrónico Institucional *</Label>
                        <Input
                          type="email"
                          value={formData.titularEmail}
                          onChange={(e) => setFormData({ ...formData, titularEmail: e.target.value })}
                          placeholder="titular@institucion.gob.ec"
                          className="text-xs"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-foreground">Teléfono Fijo Institucional *</Label>
                        <Input
                          value={formData.titularTelefonoFijo}
                          onChange={(e) => setFormData({ ...formData, titularTelefonoFijo: e.target.value })}
                          placeholder="023814400 ext 123"
                          className="text-xs"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-foreground">Móvil Institucional *</Label>
                        <Input
                          value={formData.titularMovilInstitucional}
                          onChange={(e) => setFormData({ ...formData, titularMovilInstitucional: e.target.value })}
                          placeholder="0991234567"
                          className="text-xs font-mono"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-foreground">Móvil Personal *</Label>
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
                    <div className="border-b border-border/70 pb-3 flex items-center justify-between">
                      <div>
                        <h2 className="text-sm font-bold font-heading text-foreground flex items-center gap-2">
                          <User className="size-4 text-foreground" />
                          1.3 Coordinador Institucional Suplente
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Funcionario que actuará en reemplazo del titular en caso de ausencia legal o técnica.
                        </p>
                      </div>
                      <Badge tone="neutral" appearance="soft" size="sm" className="border border-border">
                        Prerregistro Suplente
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-foreground">Nombre Completo *</Label>
                        <Input
                          value={formData.suplenteNombreCompleto}
                          onChange={(e) => setFormData({ ...formData, suplenteNombreCompleto: e.target.value })}
                          placeholder="Nombres y apellidos completos"
                          className="text-xs"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-foreground">Cédula de Ciudadanía *</Label>
                        <Input
                          value={formData.suplenteCedula}
                          maxLength={10}
                          onChange={(e) => setFormData({ ...formData, suplenteCedula: e.target.value.replace(/\D/g, "") })}
                          placeholder="10 dígitos numéricos"
                          className="text-xs font-mono"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-foreground">Cargo / Rol en la Institución *</Label>
                        <Input
                          value={formData.suplenteCargo}
                          onChange={(e) => setFormData({ ...formData, suplenteCargo: e.target.value })}
                          placeholder="Ej. Especialista de Infraestructura"
                          className="text-xs"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-foreground">Área / Unidad a la que pertenece *</Label>
                        <Input
                          value={formData.suplenteAreaUnidad}
                          onChange={(e) => setFormData({ ...formData, suplenteAreaUnidad: e.target.value })}
                          placeholder="Ej. Dirección de Tecnologías de Información"
                          className="text-xs"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-foreground">Correo Electrónico Institucional *</Label>
                        <Input
                          type="email"
                          value={formData.suplenteEmail}
                          onChange={(e) => setFormData({ ...formData, suplenteEmail: e.target.value })}
                          placeholder="suplente@institucion.gob.ec"
                          className="text-xs"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-foreground">Teléfono Fijo Institucional *</Label>
                        <Input
                          value={formData.suplenteTelefonoFijo}
                          onChange={(e) => setFormData({ ...formData, suplenteTelefonoFijo: e.target.value })}
                          placeholder="023814400 ext 124"
                          className="text-xs"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-foreground">Móvil Institucional *</Label>
                        <Input
                          value={formData.suplenteMovilInstitucional}
                          onChange={(e) => setFormData({ ...formData, suplenteMovilInstitucional: e.target.value })}
                          placeholder="0998877665"
                          className="text-xs font-mono"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-foreground">Móvil Personal *</Label>
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

                  <div className="flex justify-between pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="default"
                      onClick={() => setStep(1)}
                      className="text-xs font-semibold gap-1.5"
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
                      className="text-xs font-semibold gap-1.5"
                    >
                      <span>Siguiente: Servicios y Procesos</span>
                      <ArrowRight className="size-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* ── PASO 3: SERVICIOS Y HERRAMIENTAS ── */}
              {step === 3 && (
                <div className="bg-surface border border-border rounded-2xl p-6 space-y-5 animate-in fade-in duration-200">
                  <div className="border-b border-border/70 pb-3">
                    <h2 className="text-sm font-bold font-heading text-foreground flex items-center gap-2">
                      <FileCheck2 className="size-4 text-foreground" />
                      Sección II — Servicios y Herramientas Informáticas
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Procesos y áreas en las que se van a utilizar los servicios y/o herramientas provistos por la DINARP.
                    </p>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-foreground">
                        2.1 Servicios y/o herramientas requeridas *
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {["Interoperabilidad SINARP", "Infodigital", "Ficha de Registro Único del Ciudadano"].map((s) => (
                          <div
                            key={s}
                            onClick={() => handleServiceToggle(s)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-2.5 ${
                              formData.serviciosHerramientas.includes(s)
                                ? "bg-muted border-foreground ring-1 ring-foreground/20"
                                : "bg-card border-border hover:bg-muted/30"
                            }`}
                          >
                            <Checkbox checked={formData.serviciosHerramientas.includes(s)} />
                            <span className="font-semibold text-xs text-foreground">{s}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="areasUso" className="text-xs font-semibold text-foreground">
                        Áreas donde se van a utilizar los servicios y/o herramientas *
                      </Label>
                      <Textarea
                        id="areasUso"
                        value={formData.areasUso}
                        onChange={(e) => setFormData({ ...formData, areasUso: e.target.value })}
                        placeholder="Detallar las áreas administrativas o técnicas de su institución para las cuales requiere el servicio..."
                        className="text-xs min-h-[70px]"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="procesosUso" className="text-xs font-semibold text-foreground">
                        Procesos para los cuales utilizará los servicios y/o herramientas *
                      </Label>
                      <Textarea
                        id="procesosUso"
                        value={formData.procesosUso}
                        onChange={(e) => setFormData({ ...formData, procesosUso: e.target.value })}
                        placeholder="Detalle los trámites, plataformas o procesos sustantivos que consumirán los datos..."
                        className="text-xs min-h-[70px]"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-border/60">
                    <Button
                      type="button"
                      variant="outline"
                      size="default"
                      onClick={() => setStep(2)}
                      className="text-xs font-semibold gap-1.5"
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
                      className="text-xs font-semibold gap-1.5"
                    >
                      <span>Siguiente: Declaraciones y Firma</span>
                      <ArrowRight className="size-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* ── PASO 4: DECLARACIONES, GENERACIÓN Y FIRMA DIGITAL ── */}
              {step === 4 && (
                <div className="bg-surface border border-border rounded-2xl p-6 space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-border/70 pb-3">
                    <h2 className="text-sm font-bold font-heading text-foreground flex items-center gap-2">
                      <ShieldCheck className="size-4 text-foreground" />
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

                  <div className="flex justify-between pt-4 border-t border-border/60">
                    <Button
                      type="button"
                      variant="outline"
                      size="default"
                      onClick={() => setStep(3)}
                      className="text-xs font-semibold gap-1.5"
                    >
                      <ArrowLeft className="size-4" />
                      <span>Volver a Servicios</span>
                    </Button>

                    <Button
                      type="submit"
                      variant="primary"
                      size="default"
                      disabled={isSubmitting || !formData.declaracionesAceptadas || !formData.firmadoDigitalmente}
                      className="text-xs font-semibold gap-2 shadow-xs"
                    >
                      {isSubmitting ? (
                        <span>Enviando trámite...</span>
                      ) : (
                        <>
                          <span>Firmar y Enviar Solicitud (Anexo A)</span>
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
      </main>
    </div>
  );
}
