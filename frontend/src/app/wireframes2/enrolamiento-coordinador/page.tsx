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
import { useSolicitudesIngresoStore, type DatosAnexoB } from "../acceso-seguridad/data/gestion-ingresos-store";

function EnrolamientoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { buscarPreregistroPorCedula, agregarEnrolamientoCoordinador } = useSolicitudesIngresoStore();

  const [cedulaInput, setCedulaInput] = useState("");
  const [preregistroCargado, setPreregistroCargado] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
    fechaFirma: "24/09/2026",
    firmadoPorRepresentante: true,
    firmadoPorFuncionario: false,
    archivoAcuerdoFirmado: "ARP-R02_Acuerdo_Uso_Confidencialidad_Firmado.pdf"
  });

  // Leer parámetro query ?cedula=... si viene del login
  useEffect(() => {
    const ced = searchParams.get("cedula");
    if (ced) {
      setCedulaInput(ced);
      cargarPreregistro(ced);
    }
  }, [searchParams]);

  const cargarPreregistro = (ced: string) => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      const res = buscarPreregistroPorCedula(ced);
      if (res.encontrado && res.tipo) {
        setPreregistroCargado(res);
        setFormData((prev) => ({
          ...prev,
          nombreEntidad: res.institucion || "",
          domicilioEntidad: res.direccion || "Quito D.M.",
          representanteLegalNombre: res.representanteLegal || "Máxima Autoridad Institucional",
          funcionarioNombre: res.nombreCompleto || "",
          funcionarioCedula: res.cedula || "",
          funcionarioCargo: res.cargo || "",
          rolAsignado: res.tipo === "TITULAR" ? "COORDINADOR TITULAR" : "SUPLENTE",
          misionVisionInstitucional: "Garantizar la gestión oportuna, veraz y segura de los datos públicos y registros asignados a la institución bajo principios de confidencialidad y lealtad institucional."
        }));
        toast.success("Prerregistro encontrado", {
          description: `Datos recuperados para ${res.nombreCompleto}.`,
        });
      } else {
        setPreregistroCargado(null);
        toast.error("Cédula sin prerregistro", {
          description: "No se encontró un prerregistro institucional activo con la cédula ingresada.",
        });
      }
    }, 400);
  };

  const handleSimulateDemo = () => {
    const demoCed = "1715489621";
    setCedulaInput(demoCed);
    cargarPreregistro(demoCed);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clausulasAceptadas) {
      toast.error("Debe aceptar las cláusulas de confidencialidad del Anexo B.");
      return;
    }
    if (!formData.firmadoPorFuncionario) {
      toast.error("Debe certificar la firma electrónica del funcionario.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      agregarEnrolamientoCoordinador(formData);
      setIsSuccess(true);
      toast.success("Acuerdo de Confidencialidad enviado a DINARP", {
        description: "El trámite ingresó a la bandeja DGR para activación definitiva del usuario.",
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
                Proceso B: Enrolamiento de Coordinador
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {!preregistroCargado && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSimulateDemo}
                className="text-xs font-semibold gap-1.5 border-dashed"
              >
                <Sparkles className="size-3.5 text-foreground" />
                <span>Usar Demo (1715489621)</span>
              </Button>
            )}
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
                Código: ARP-R02 · Acuerdo Suscrito
              </Badge>
              <h1 className="text-2xl font-bold font-heading text-foreground">
                Acuerdo de Confidencialidad Remitido
              </h1>
              <p className="text-xs text-muted-foreground leading-relaxed">
                El documento ARP-R02 suscrito por los comparecientes ha sido enviado a la Dirección de Gestión y Registro de la DINARP.
              </p>
            </div>

            <div className="p-4 bg-muted/40 rounded-xl border border-border text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Funcionario:</span>
                <span className="font-semibold text-foreground">{formData.funcionarioNombre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rol Asignado:</span>
                <span className="font-semibold text-foreground">{formData.rolAsignado}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Institución:</span>
                <span className="font-semibold text-foreground">{formData.nombreEntidad}</span>
              </div>
              <div className="pt-2 border-t border-border/60 text-[11px] text-muted-foreground flex items-start gap-2">
                <Clock className="size-4 shrink-0 mt-0.5 text-foreground" />
                <span>
                  <strong>Activación en el BPM:</strong> Una vez revisado y aprobado el Anexo B por la DINARP, el usuario quedará <strong>ACTIVO</strong> y podrá iniciar sesión normalmente con su cédula y contraseña.
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
                <span className="text-foreground font-semibold">Enrolamiento Anexo B</span>
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
            <div className="border-b border-border/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Badge tone="neutral" appearance="soft" size="sm" className="border border-border">
                    Formulario Oficial ARP-R02
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">Versión 1.0</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold font-heading text-foreground mt-1">
                  Acuerdo de Uso y Confidencialidad para el Acceso al SINARP
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Proceso B: Enrolamiento del coordinador prerregistrado (Titular, Suplente, Supervisor o Visualizador).
                </p>
              </div>
            </div>

            {/* Paso 0: Si no hay preregistro cargado, solicitar cédula */}
            {!preregistroCargado ? (
              <div className="max-w-xl mx-auto bg-surface border border-border rounded-2xl p-6 space-y-4">
                <div className="space-y-1">
                  <h2 className="text-sm font-bold font-heading text-foreground flex items-center gap-2">
                    <UserCheck className="size-4 text-foreground" />
                    Validación de Prerregistro
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Ingresa el número de cédula del coordinador que fue designado en la solicitud de acceso institucional (Anexo A).
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Input
                    type="text"
                    maxLength={10}
                    placeholder="Cédula de 10 dígitos"
                    value={cedulaInput}
                    onChange={(e) => setCedulaInput(e.target.value.replace(/\D/g, ""))}
                    className="text-xs font-mono"
                  />
                  <Button
                    type="button"
                    variant="primary"
                    size="default"
                    disabled={isSearching || cedulaInput.length !== 10}
                    onClick={() => cargarPreregistro(cedulaInput)}
                    className="text-xs font-semibold shrink-0"
                  >
                    {isSearching ? "Buscando..." : "Validar"}
                  </Button>
                </div>

                <div className="p-3 bg-muted/30 border border-border rounded-xl text-[11px] text-muted-foreground flex items-start gap-2">
                  <AlertCircle className="size-4 shrink-0 mt-0.5 text-foreground" />
                  <span>
                    El BPM no permite auto-registro libre. Si la entidad aún no tramitó el Anexo A, debe realizar primero la <Link href="/wireframes2/registro-institucion" className="text-foreground underline font-semibold">Solicitud de Acceso Institucional</Link>.
                  </span>
                </div>
              </div>
            ) : (
              /* Formulario Anexo B Oficial */
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Comparación y Datos de Intervinientes */}
                <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
                  <div className="border-b border-border/70 pb-3 flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold font-heading text-foreground flex items-center gap-2">
                        <Building2 className="size-4 text-foreground" />
                        Cláusula Primera — Intervinientes
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Identificación formal de la entidad solicitante y del funcionario compareciente.
                      </p>
                    </div>
                    <Badge tone="neutral" appearance="soft" size="sm" className="border border-border">
                      {formData.rolAsignado}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5 sm:col-span-2 p-3 rounded-xl bg-muted/30 border border-border">
                      <span className="text-[11px] text-muted-foreground block">Entidad Compareciente (El Solicitante):</span>
                      <span className="font-bold text-foreground text-sm block">{formData.nombreEntidad}</span>
                      <span className="text-xs text-muted-foreground">Domicilio legal: {formData.domicilioEntidad}</span>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground">Representante Legal compareciente *</Label>
                      <Input
                        value={formData.representanteLegalNombre}
                        onChange={(e) => setFormData({ ...formData, representanteLegalNombre: e.target.value })}
                        className="text-xs"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground">Rol que asume el Funcionario *</Label>
                      <select
                        value={formData.rolAsignado}
                        onChange={(e) => setFormData({ ...formData, rolAsignado: e.target.value as any })}
                        className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <option value="COORDINADOR TITULAR">COORDINADOR TITULAR</option>
                        <option value="SUPLENTE">SUPLENTE</option>
                        <option value="SUPERVISOR">SUPERVISOR</option>
                        <option value="VISUALIZADOR">VISUALIZADOR</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground">Nombre del Trabajador / Funcionario *</Label>
                      <Input
                        value={formData.funcionarioNombre}
                        onChange={(e) => setFormData({ ...formData, funcionarioNombre: e.target.value })}
                        className="text-xs"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-foreground">Cédula de Identidad *</Label>
                      <Input
                        value={formData.funcionarioCedula}
                        readOnly
                        className="text-xs font-mono bg-muted/40 cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-xs font-semibold text-foreground">Cargo en la Entidad *</Label>
                      <Input
                        value={formData.funcionarioCargo}
                        onChange={(e) => setFormData({ ...formData, funcionarioCargo: e.target.value })}
                        className="text-xs"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Cláusula Segunda: Antecedentes */}
                <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
                  <div className="border-b border-border/70 pb-3">
                    <h2 className="text-sm font-bold font-heading text-foreground">
                      Cláusula Segunda — Antecedentes (Misión y Visión Institucional)
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Describa la misión y visión institucional de la entidad a la que pertenece.
                    </p>
                  </div>

                  <Textarea
                    value={formData.misionVisionInstitucional}
                    onChange={(e) => setFormData({ ...formData, misionVisionInstitucional: e.target.value })}
                    className="text-xs min-h-[80px]"
                    required
                  />
                </div>

                {/* Cláusula Tercera: Base Legal y Cláusulas Operativas */}
                <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
                  <div className="border-b border-border/70 pb-3">
                    <h2 className="text-sm font-bold font-heading text-foreground">
                      Cláusula Tercera a Séptima — Base Legal, Confidencialidad y Custodia
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Art. 66 numeral 19 CRE, Arts. 4, 27, 28 y 29 LEY SINARP, Arts. 2, 7 y 10 LEY PROTECCIÓN DE DATOS.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-2 text-xs">
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      El funcionario se compromete a mantener estricta reserva y confidencialidad respecto de los datos personales a los que acceda, aplicándolos exclusivamente a los fines de la institución. Queda prohibida la reproducción, cesión o divulgación no autorizada de credenciales personales e intransferibles, bajo responsabilidades administrativas, civiles y penales.
                    </p>
                    <div className="flex items-start gap-2 pt-2 border-t border-border/60">
                      <Checkbox
                        id="clausulas"
                        checked={formData.clausulasAceptadas}
                        onCheckedChange={(checked) => setFormData({ ...formData, clausulasAceptadas: Boolean(checked) })}
                      />
                      <Label htmlFor="clausulas" className="text-xs cursor-pointer font-semibold text-foreground">
                        Acepto de manera expresa las cláusulas del Acuerdo de Uso y Confidencialidad (Anexo B).
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Suscripción Digital de Ambas Partes */}
                <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
                  <div className="border-b border-border/70 pb-3">
                    <h2 className="text-sm font-bold font-heading text-foreground flex items-center gap-2">
                      <ShieldCheck className="size-4 text-foreground" />
                      Suscripción del Instrumento ARP-R02
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-2">
                      <span className="font-bold text-foreground block">1. Firma de Máxima Autoridad o Delegado</span>
                      <p className="text-[11px] text-muted-foreground">
                        Firmado electrónicamente por {formData.representanteLegalNombre}.
                      </p>
                      <Badge tone="neutral" appearance="soft" size="sm" className="border border-border">
                        <Check className="size-3 mr-1" />
                        Autorización Previa Vinculada
                      </Badge>
                    </div>

                    <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-2">
                      <span className="font-bold text-foreground block">2. Firma del Funcionario Designado</span>
                      <div className="flex items-start gap-2 pt-1">
                        <Checkbox
                          id="firmaFuncionario"
                          checked={formData.firmadoPorFuncionario}
                          onCheckedChange={(checked) => setFormData({ ...formData, firmadoPorFuncionario: Boolean(checked) })}
                        />
                        <Label htmlFor="firmaFuncionario" className="text-xs cursor-pointer text-foreground">
                          Certifico mi firma electrónica en calidad de compareciente ({formData.rolAsignado}).
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-border/60">
                    <Button
                      type="button"
                      variant="outline"
                      size="default"
                      onClick={() => setPreregistroCargado(null)}
                      className="text-xs font-semibold gap-1.5"
                    >
                      <ArrowLeft className="size-4" />
                      <span>Cambiar Cédula</span>
                    </Button>

                    <Button
                      type="submit"
                      variant="primary"
                      size="default"
                      disabled={isSubmitting || !formData.clausulasAceptadas || !formData.firmadoPorFuncionario}
                      className="text-xs font-semibold gap-2 shadow-xs"
                    >
                      {isSubmitting ? (
                        <span>Enviando trámite...</span>
                      ) : (
                        <>
                          <span>Firmar y Enviar Acuerdo (Anexo B)</span>
                          <Check className="size-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function EnrolamientoCoordinadorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-xs text-muted-foreground">Cargando formulario de enrolamiento...</div>}>
      <EnrolamientoContent />
    </Suspense>
  );
}
