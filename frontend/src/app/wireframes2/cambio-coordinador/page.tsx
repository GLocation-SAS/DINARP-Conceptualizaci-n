"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  FileText,
  Building2,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Clock,
  Sparkles,
  Check,
  UserX,
  UploadCloud,
  FileCheck2,
  Home
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { getAssetPath } from "@/lib/utils";
import { useSolicitudesIngresoStore, type DatosAnexoC } from "../acceso-seguridad/data/gestion-ingresos-store";

export default function CambioCoordinadorPage() {
  const router = useRouter();
  const { agregarCambioCoordinador } = useSolicitudesIngresoStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State Anexo C (ARP-R03)
  const [formData, setFormData] = useState<DatosAnexoC>({
    nombreEntidad: "",
    representanteLegalNombre: "",
    esDelegado: false,
    archivoSoporteDelegacion: "",

    // Cláusula Segunda: Cambio Titular
    aplicaCambioTitular: true,
    nuevoTitularNombre: "",
    nuevoTitularCedula: "",
    nuevoTitularCargo: "",
    nuevoTitularMotivo: "",
    nuevoTitularEmail: "",
    nuevoTitularArea: "",
    nuevoTitularTelefonoFijo: "",
    nuevoTitularMovilInst: "",
    nuevoTitularMovilPersonal: "",

    // Cláusula Segunda: Cambio Suplente
    aplicaCambioSuplente: false,
    nuevoSuplenteNombre: "",
    nuevoSuplenteCedula: "",
    nuevoSuplenteCargo: "",
    nuevoSuplenteMotivo: "",
    nuevoSuplenteEmail: "",
    nuevoSuplenteArea: "",
    nuevoSuplenteTelefonoFijo: "",
    nuevoSuplenteMovilInst: "",
    nuevoSuplenteMovilPersonal: "",

    // Cláusula Tercera: Designación Inicial Suplente (Solo si la entidad no tenía suplente previamente)
    aplicaDesignacionInicialSuplente: false,
    inicialSuplenteNombre: "",
    inicialSuplenteCedula: "",
    inicialSuplenteCargo: "",
    inicialSuplenteEmail: "",

    // Cláusula Cuarta: Aceptación y Firmas
    ciudadFirma: "Quito D.M.",
    fechaFirma: "24/09/2026",
    firmadoDigitalmente: false,
    archivoDocumentoFirmado: "ARP-R03_Cambio_Coordinador_Institucional.pdf"
  });

  const handleSimulateFill = () => {
    setFormData({
      nombreEntidad: "Dirección General de Registro Civil, Identificación y Cedulación",
      representanteLegalNombre: "Abg. Fernando Alarcón (Subdirector General)",
      esDelegado: true,
      archivoSoporteDelegacion: "Accion_Personal_Delegacion_Firmante.pdf",

      aplicaCambioTitular: true,
      nuevoTitularNombre: "Dra. Patricia Elena Moncayo Benítez",
      nuevoTitularCedula: "1724589632",
      nuevoTitularCargo: "Directora de Gestión de la Información Registral",
      nuevoTitularMotivo: "Cese de funciones del coordinador saliente por cambio orgánico institucional.",
      nuevoTitularEmail: "patricia.moncayo@registrocivil.gob.ec",
      nuevoTitularArea: "Dirección de Tecnologías y Seguridad de la Información",
      nuevoTitularTelefonoFijo: "023731110 ext 204",
      nuevoTitularMovilInst: "0984561230",
      nuevoTitularMovilPersonal: "0991245876",

      aplicaCambioSuplente: false,
      nuevoSuplenteNombre: "",
      nuevoSuplenteCedula: "",
      nuevoSuplenteCargo: "",
      nuevoSuplenteMotivo: "",

      aplicaDesignacionInicialSuplente: false,
      inicialSuplenteNombre: "",
      inicialSuplenteCedula: "",
      inicialSuplenteCargo: "",
      inicialSuplenteEmail: "",

      ciudadFirma: "Quito D.M.",
      fechaFirma: "24/09/2026",
      firmadoDigitalmente: true,
      archivoDocumentoFirmado: "ARP-R03_Cambio_Coordinador_RegistroCivil.pdf"
    });
    toast.success("Formulario precargado con datos del Anexo C");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.aplicaCambioTitular && !formData.aplicaCambioSuplente && !formData.aplicaDesignacionInicialSuplente) {
      toast.error("Debe seleccionar al menos una cláusula de cambio o designación.");
      return;
    }
    if (!formData.firmadoDigitalmente) {
      toast.error("Debe certificar la firma electrónica del formulario Anexo C.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      agregarCambioCoordinador(formData);
      setIsSuccess(true);
      toast.success("Solicitud de cambio enviada a DINARP", {
        description: "El trámite ingresó a la bandeja DGR.",
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
                Proceso C: Cambio de Coordinador Institucional
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
                Código: ARP-R03 · Trámite Enviado
              </Badge>
              <h1 className="text-2xl font-bold font-heading text-foreground">
                Solicitud de Cambio de Coordinador Registrada
              </h1>
              <p className="text-xs text-muted-foreground leading-relaxed">
                El formulario ARP-R03 suscrito por la autoridad requirente ha ingresado a la Dirección de Gestión y Registro de la DINARP.
              </p>
            </div>

            <div className="p-4 bg-muted/40 rounded-xl border border-border text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Institución:</span>
                <span className="font-semibold text-foreground">{formData.nombreEntidad}</span>
              </div>
              {formData.aplicaCambioTitular && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nuevo Coordinador Titular:</span>
                  <span className="font-semibold text-foreground">{formData.nuevoTitularNombre}</span>
                </div>
              )}
              {formData.aplicaCambioSuplente && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nuevo Coordinador Suplente:</span>
                  <span className="font-semibold text-foreground">{formData.nuevoSuplenteNombre}</span>
                </div>
              )}
              <div className="pt-2 border-t border-border/60 text-[11px] text-muted-foreground flex items-start gap-2">
                <Clock className="size-4 shrink-0 mt-0.5 text-foreground" />
                <span>
                  <strong>Flujo BPM:</strong> Al aprobarse este trámite en DGR, el nuevo coordinador quedará <strong>prerregistrado</strong> y se le enviará la invitación para suscribir su Acuerdo de Confidencialidad (Anexo B / Proceso B).
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
                <span className="text-foreground font-semibold">Cambio Coordinador Anexo C</span>
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

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Encabezado del Trámite */}
              <div className="border-b border-border/80 pb-4">
                <div className="flex items-center gap-2">
                  <Badge tone="neutral" appearance="soft" size="sm" className="border border-border">
                    Formulario Oficial ARP-R03
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">Versión 1.0</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-foreground mt-1">
                  Cambio de Coordinador Institucional Titular y/o Suplente
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Proceso C: Solicitud formal de cambio o designación inicial de coordinador institucional.
                </p>
              </div>

            {/* Cláusula Primera: Antecedentes */}
            <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
              <div className="border-b border-border/70 pb-3">
                <h2 className="text-sm font-bold font-heading text-foreground flex items-center gap-2">
                  <Building2 className="size-4 text-foreground" />
                  Cláusula Primera — Antecedentes
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Identificación de la entidad solicitante y de la máxima autoridad o delegado.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">Nombre Completo de la Entidad *</Label>
                  <Input
                    value={formData.nombreEntidad}
                    onChange={(e) => setFormData({ ...formData, nombreEntidad: e.target.value })}
                    placeholder="Ej. Dirección General de Registro Civil"
                    className="text-xs"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">Nombre de la Máxima Autoridad / Delegado *</Label>
                  <Input
                    value={formData.representanteLegalNombre}
                    onChange={(e) => setFormData({ ...formData, representanteLegalNombre: e.target.value })}
                    placeholder="Nombres y cargo de la autoridad"
                    className="text-xs"
                    required
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl border border-border/80 bg-muted/20">
                    <Checkbox
                      id="esDelegadoC"
                      checked={formData.esDelegado}
                      onCheckedChange={(checked) => setFormData({ ...formData, esDelegado: Boolean(checked) })}
                    />
                    <Label htmlFor="esDelegadoC" className="text-xs cursor-pointer text-foreground">
                      ¿La autoridad firma mediante delegación expresa? (Requiere adjuntar soporte)
                    </Label>
                  </div>
                </div>

                {formData.esDelegado && (
                  <div className="space-y-1.5 sm:col-span-2 p-3 rounded-xl border border-border bg-muted/40">
                    <Label className="text-xs font-semibold text-foreground flex items-center gap-2">
                      <UploadCloud className="size-4 text-foreground" />
                      Documento de Soporte de Delegación (Acción de Personal / Resolución)
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
            </div>

            {/* Cláusula Segunda: Cambio de Coordinador Titular */}
            <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <div className="flex items-center gap-2.5">
                  <Checkbox
                    id="aplicaTitular"
                    checked={formData.aplicaCambioTitular}
                    onCheckedChange={(checked) => setFormData({ ...formData, aplicaCambioTitular: Boolean(checked) })}
                  />
                  <div>
                    <Label htmlFor="aplicaTitular" className="text-sm font-bold font-heading text-foreground cursor-pointer">
                      Cláusula Segunda: Cambio del Coordinador Institucional TITULAR
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Marcar para reemplazar o sustituir al coordinador titular anterior.
                    </p>
                  </div>
                </div>
                <Badge tone="neutral" appearance="soft" size="sm" className="border border-border">
                  Titular
                </Badge>
              </div>

              {formData.aplicaCambioTitular && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Nombres y Apellidos del Nuevo Titular *</Label>
                    <Input
                      value={formData.nuevoTitularNombre}
                      onChange={(e) => setFormData({ ...formData, nuevoTitularNombre: e.target.value })}
                      placeholder="Nombres completos"
                      className="text-xs"
                      required={formData.aplicaCambioTitular}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Cédula de Ciudadanía *</Label>
                    <Input
                      value={formData.nuevoTitularCedula}
                      maxLength={10}
                      onChange={(e) => setFormData({ ...formData, nuevoTitularCedula: e.target.value.replace(/\D/g, "") })}
                      placeholder="10 dígitos"
                      className="text-xs font-mono"
                      required={formData.aplicaCambioTitular}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Cargo en la Entidad *</Label>
                    <Input
                      value={formData.nuevoTitularCargo}
                      onChange={(e) => setFormData({ ...formData, nuevoTitularCargo: e.target.value })}
                      placeholder="Ej. Director de Informática"
                      className="text-xs"
                      required={formData.aplicaCambioTitular}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Correo Electrónico Institucional *</Label>
                    <Input
                      type="email"
                      value={formData.nuevoTitularEmail}
                      onChange={(e) => setFormData({ ...formData, nuevoTitularEmail: e.target.value })}
                      placeholder="titular@institucion.gob.ec"
                      className="text-xs"
                      required={formData.aplicaCambioTitular}
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-xs font-semibold text-foreground">Motivo del Cambio *</Label>
                    <Textarea
                      value={formData.nuevoTitularMotivo}
                      onChange={(e) => setFormData({ ...formData, nuevoTitularMotivo: e.target.value })}
                      placeholder="Indique detalladamente la razón de la sustitución del titular..."
                      className="text-xs min-h-[60px]"
                      required={formData.aplicaCambioTitular}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Cláusula Segunda: Cambio de Coordinador Suplente */}
            <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <div className="flex items-center gap-2.5">
                  <Checkbox
                    id="aplicaSuplente"
                    checked={formData.aplicaCambioSuplente}
                    onCheckedChange={(checked) => setFormData({ ...formData, aplicaCambioSuplente: Boolean(checked) })}
                  />
                  <div>
                    <Label htmlFor="aplicaSuplente" className="text-sm font-bold font-heading text-foreground cursor-pointer">
                      Cláusula Segunda: Cambio del Coordinador Institucional SUPLENTE
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Marcar para sustituir al suplente preexistente registrado por la entidad.
                    </p>
                  </div>
                </div>
                <Badge tone="neutral" appearance="soft" size="sm" className="border border-border">
                  Suplente
                </Badge>
              </div>

              {formData.aplicaCambioSuplente && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Nombres del Nuevo Suplente *</Label>
                    <Input
                      value={formData.nuevoSuplenteNombre}
                      onChange={(e) => setFormData({ ...formData, nuevoSuplenteNombre: e.target.value })}
                      placeholder="Nombres completos"
                      className="text-xs"
                      required={formData.aplicaCambioSuplente}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Cédula de Ciudadanía *</Label>
                    <Input
                      value={formData.nuevoSuplenteCedula}
                      maxLength={10}
                      onChange={(e) => setFormData({ ...formData, nuevoSuplenteCedula: e.target.value.replace(/\D/g, "") })}
                      placeholder="10 dígitos"
                      className="text-xs font-mono"
                      required={formData.aplicaCambioSuplente}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Cargo en la Entidad *</Label>
                    <Input
                      value={formData.nuevoSuplenteCargo}
                      onChange={(e) => setFormData({ ...formData, nuevoSuplenteCargo: e.target.value })}
                      placeholder="Ej. Especialista de TIC"
                      className="text-xs"
                      required={formData.aplicaCambioSuplente}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Correo Institucional *</Label>
                    <Input
                      type="email"
                      value={formData.nuevoSuplenteEmail}
                      onChange={(e) => setFormData({ ...formData, nuevoSuplenteEmail: e.target.value })}
                      placeholder="suplente@institucion.gob.ec"
                      className="text-xs"
                      required={formData.aplicaCambioSuplente}
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-xs font-semibold text-foreground">Motivo del Cambio *</Label>
                    <Textarea
                      value={formData.nuevoSuplenteMotivo}
                      onChange={(e) => setFormData({ ...formData, nuevoSuplenteMotivo: e.target.value })}
                      placeholder="Indique detalladamente la razón de la sustitución del suplente..."
                      className="text-xs min-h-[60px]"
                      required={formData.aplicaCambioSuplente}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Cláusula Tercera: Designación Inicial de Coordinador Suplente */}
            <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <div className="flex items-center gap-2.5">
                  <Checkbox
                    id="aplicaInicialSuplente"
                    checked={formData.aplicaDesignacionInicialSuplente}
                    onCheckedChange={(checked) => setFormData({ ...formData, aplicaDesignacionInicialSuplente: Boolean(checked) })}
                  />
                  <div>
                    <Label htmlFor="aplicaInicialSuplente" className="text-sm font-bold font-heading text-foreground cursor-pointer">
                      Cláusula Tercera: Designación Inicial de Coordinador Suplente
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      NOTA: Aplica única y exclusivamente si la entidad <strong>NO había designado</strong> un suplente previamente.
                    </p>
                  </div>
                </div>
              </div>

              {formData.aplicaDesignacionInicialSuplente && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Nombres del Suplente Designado *</Label>
                    <Input
                      value={formData.inicialSuplenteNombre}
                      onChange={(e) => setFormData({ ...formData, inicialSuplenteNombre: e.target.value })}
                      placeholder="Nombres completos"
                      className="text-xs"
                      required={formData.aplicaDesignacionInicialSuplente}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Cédula de Ciudadanía *</Label>
                    <Input
                      value={formData.inicialSuplenteCedula}
                      maxLength={10}
                      onChange={(e) => setFormData({ ...formData, inicialSuplenteCedula: e.target.value.replace(/\D/g, "") })}
                      placeholder="10 dígitos"
                      className="text-xs font-mono"
                      required={formData.aplicaDesignacionInicialSuplente}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Cargo en la Entidad *</Label>
                    <Input
                      value={formData.inicialSuplenteCargo}
                      onChange={(e) => setFormData({ ...formData, inicialSuplenteCargo: e.target.value })}
                      placeholder="Cargo desempeñado"
                      className="text-xs"
                      required={formData.aplicaDesignacionInicialSuplente}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Correo Institucional *</Label>
                    <Input
                      type="email"
                      value={formData.inicialSuplenteEmail}
                      onChange={(e) => setFormData({ ...formData, inicialSuplenteEmail: e.target.value })}
                      placeholder="correo@institucion.gob.ec"
                      className="text-xs"
                      required={formData.aplicaDesignacionInicialSuplente}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Cláusula Cuarta: Aceptación y Firma */}
            <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
              <div className="border-b border-border/70 pb-3">
                <h2 className="text-sm font-bold font-heading text-foreground flex items-center gap-2">
                  <ShieldCheck className="size-4 text-foreground" />
                  Cláusula Cuarta — Aceptación y Firma de la Autoridad
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Suscripción en {formData.ciudadFirma} al {formData.fechaFirma}.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-muted/30 flex items-start gap-3">
                <Checkbox
                  id="firmaDigitalC"
                  checked={formData.firmadoDigitalmente}
                  onCheckedChange={(checked) => setFormData({ ...formData, firmadoDigitalmente: Boolean(checked) })}
                  className="mt-0.5"
                />
                <div className="space-y-1 text-xs">
                  <Label htmlFor="firmaDigitalC" className="font-bold text-foreground cursor-pointer">
                    Certificar suscripción con Firma Electrónica (.p12 / Token) de la Autoridad Requirente
                  </Label>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Al remitir este instrumento, la DINARP verificará la pertinencia y procederá a registrar el cambio y habilitar el prerregistro del nuevo funcionario.
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-border/60">
                <Button
                  asChild
                  variant="outline"
                  size="default"
                  className="text-xs font-semibold gap-1.5"
                >
                  <Link href="/wireframes2/login">
                    <ArrowLeft className="size-4" />
                    <span>Volver</span>
                  </Link>
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  size="default"
                  disabled={isSubmitting || !formData.firmadoDigitalmente}
                  className="text-xs font-semibold gap-2 shadow-xs"
                >
                  {isSubmitting ? (
                    <span>Enviando trámite...</span>
                  ) : (
                    <>
                      <span>Firmar y Enviar Solicitud (Anexo C)</span>
                      <Check className="size-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
        )}
      </main>
    </div>
  );
}
