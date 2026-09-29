"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  FileText,
  Building2,
  Database,
  Sliders,
  UploadCloud,
  CheckSquare,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Stepper, Step } from "@/components/ui/stepper";
import { WireframeDashboardLayout } from "../../components/wireframe-dashboard-layout";

const STEPS_CONFIG: Step[] = [
  { id: "general", title: "Información general", icon: FileText },
  { id: "entidades", title: "Fuente y consumidor", icon: Building2 },
  { id: "informacion", title: "Información solicitada", icon: Database },
  { id: "condiciones", title: "Condiciones", icon: Sliders },
  { id: "documentos", title: "Documentos", icon: UploadCloud },
  { id: "confirmacion", title: "Confirmación", icon: CheckSquare },
];

export default function WireframeNuevaSolicitudBatchPage() {
  const router = useRouter();

  const [activeStep, setActiveStep] = useState(0);

  // Form State
  const [nombreProyecto, setNombreProyecto] = useState("");
  const [justificacion, setJustificacion] = useState("");
  const [fuenteData, setFuenteData] = useState("Registro Civil");
  const [consumidorData, setConsumidorData] = useState("MIDUVI");
  const [tipoInfo, setTipoInfo] = useState("Padrón ciudadano / Vínculos familiares");
  const [volumenEstimado, setVolumenEstimado] = useState("500,000 registros");
  const [frecuencia, setFrecuencia] = useState("Mensual");
  const [vigencia, setVigencia] = useState("12 meses");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleNext = () => {
    if (activeStep < STEPS_CONFIG.length - 1) {
      setActiveStep((prev) => prev + 1);
    } else {
      setIsSuccessModalOpen(true);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  return (
    <WireframeDashboardLayout activeMenu="batch">
      <main className="relative p-4 sm:p-6 lg:p-8 w-full space-y-6 sm:space-y-8">
        {/* Background subtle effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-muted/20 to-transparent pointer-events-none -z-10 blur-3xl opacity-60" />

        {/* ── 1. Breadcrumbs ── */}
        <Breadcrumb>
          <BreadcrumbList className="text-xs">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/wireframes/dashboard" className="text-muted-foreground hover:text-foreground">
                  Inicio
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/wireframes/intercambios-masivos" className="text-muted-foreground hover:text-foreground">
                  Intercambios masivos
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-foreground">
                Nueva solicitud
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* ── 2. Header Title & Top Action ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/80">
          <div className="space-y-1">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-foreground tracking-tight">
              Nueva solicitud de intercambio masivo
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Completa las etapas para formalizar una transferencia de datos por lote o excepcionalidad.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/wireframes/intercambios-masivos")}
            className="h-10 px-4 rounded-xl text-xs font-semibold gap-2 border-border shrink-0"
          >
            <ArrowLeft className="size-4" />
            <span>Cancelar</span>
          </Button>
        </div>

        {/* ── 3. Stepper de 6 pasos ── */}
        <div className="py-2 overflow-x-auto">
          <div className="min-w-[650px] px-2">
            <Stepper
              steps={STEPS_CONFIG}
              activeStep={activeStep}
              onStepClick={(idx) => setActiveStep(idx)}
            />
          </div>
        </div>

        {/* ── 4. Contenido del Paso Activo ── */}
        <Card className="border-border bg-surface shadow-xs">
          <CardHeader className="p-6 pb-3">
            <CardTitle className="text-base font-heading font-bold text-foreground">
              {activeStep + 1}. {STEPS_CONFIG[activeStep].title}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Paso {activeStep + 1} de {STEPS_CONFIG.length}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 pt-1 space-y-4">
            {/* ── Paso 1: Información General ── */}
            {activeStep === 0 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="nombre-proyecto" className="text-xs font-semibold text-foreground">
                    Nombre de la solicitud / proyecto <span className="text-destructive">*</span>
                  </Label>
                  <InputGroup className="bg-surface rounded-xl border-border">
                    <InputGroupInput
                      id="nombre-proyecto"
                      placeholder="Ej. Cruce poblacional para subsidios de vivienda"
                      value={nombreProyecto}
                      onChange={(e) => setNombreProyecto(e.target.value)}
                      className="text-xs sm:text-sm"
                      required
                    />
                  </InputGroup>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="justificacion" className="text-xs font-semibold text-foreground">
                      Justificación de la solicitud <span className="text-destructive">*</span>
                    </Label>
                    <span className="text-[10px] text-muted-foreground">{justificacion.length}/1000</span>
                  </div>
                  <textarea
                    id="justificacion"
                    rows={5}
                    maxLength={1000}
                    placeholder="Describe los fines públicos, legales y el marco de aplicación para este intercambio por lote..."
                    value={justificacion}
                    onChange={(e) => setJustificacion(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface p-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  />
                </div>
              </div>
            )}

            {/* ── Paso 2: Fuente y Consumidor ── */}
            {activeStep === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="fuente" className="text-xs font-semibold text-foreground">
                    Institución Fuente (Custodio de datos)
                  </Label>
                  <InputGroup className="bg-surface rounded-xl border-border">
                    <InputGroupInput
                      id="fuente"
                      value={fuenteData}
                      onChange={(e) => setFuenteData(e.target.value)}
                      className="text-xs sm:text-sm"
                    />
                  </InputGroup>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="consumidor" className="text-xs font-semibold text-foreground">
                    Entidad Consumidora
                  </Label>
                  <InputGroup className="bg-surface rounded-xl border-border">
                    <InputGroupInput
                      id="consumidor"
                      value={consumidorData}
                      onChange={(e) => setConsumidorData(e.target.value)}
                      className="text-xs sm:text-sm"
                    />
                  </InputGroup>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="responsable" className="text-xs font-semibold text-foreground">
                    Responsable técnico institucional
                  </Label>
                  <InputGroup className="bg-surface rounded-xl border-border">
                    <InputGroupInput
                      id="responsable"
                      defaultValue="Ing. Marcelo Andrade (Director de TIC)"
                      className="text-xs sm:text-sm"
                    />
                  </InputGroup>
                </div>
              </div>
            )}

            {/* ── Paso 3: Información Solicitada ── */}
            {activeStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="tipo-info" className="text-xs font-semibold text-foreground">
                    Tipo de información requerida
                  </Label>
                  <InputGroup className="bg-surface rounded-xl border-border">
                    <InputGroupInput
                      id="tipo-info"
                      value={tipoInfo}
                      onChange={(e) => setTipoInfo(e.target.value)}
                      className="text-xs sm:text-sm"
                    />
                  </InputGroup>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">
                    Campos de datos requeridos en el lote
                  </Label>
                  <div className="p-4 rounded-xl border border-border bg-background/50 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <div className="flex items-center gap-2">
                      <Checkbox id="f-cedula" defaultChecked />
                      <label htmlFor="f-cedula" className="text-foreground font-medium">Número de cédula / identidad</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="f-nombres" defaultChecked />
                      <label htmlFor="f-nombres" className="text-foreground font-medium">Nombres y apellidos completos</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="f-fecha" defaultChecked />
                      <label htmlFor="f-fecha" className="text-foreground font-medium">Fecha de nacimiento</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="f-parroquia" defaultChecked />
                      <label htmlFor="f-parroquia" className="text-foreground font-medium">Provincia / Cantón / Parroquia</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="f-familia" defaultChecked />
                      <label htmlFor="f-familia" className="text-foreground font-medium">Carga familiar / Dependientes</label>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="volumen" className="text-xs font-semibold text-foreground">
                    Volumen estimado de registros
                  </Label>
                  <InputGroup className="bg-surface rounded-xl border-border">
                    <InputGroupInput
                      id="volumen"
                      value={volumenEstimado}
                      onChange={(e) => setVolumenEstimado(e.target.value)}
                      className="text-xs sm:text-sm"
                    />
                  </InputGroup>
                </div>
              </div>
            )}

            {/* ── Paso 4: Condiciones del Intercambio ── */}
            {activeStep === 3 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="frecuencia" className="text-xs font-semibold text-foreground">
                    Frecuencia de entrega
                  </Label>
                  <InputGroup className="bg-surface rounded-xl border-border">
                    <InputGroupInput
                      id="frecuencia"
                      value={frecuencia}
                      onChange={(e) => setFrecuencia(e.target.value)}
                      className="text-xs sm:text-sm"
                    />
                  </InputGroup>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="vigencia-s" className="text-xs font-semibold text-foreground">
                    Vigencia solicitada
                  </Label>
                  <InputGroup className="bg-surface rounded-xl border-border">
                    <InputGroupInput
                      id="vigencia-s"
                      value={vigencia}
                      onChange={(e) => setVigencia(e.target.value)}
                      className="text-xs sm:text-sm"
                    />
                  </InputGroup>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-semibold text-foreground">
                    Mecanismo técnico de transferencia
                  </Label>
                  <div className="p-3.5 rounded-xl border border-border bg-background/50 space-y-2 text-xs">
                    <p className="font-semibold text-foreground">Servidor Seguro SFTP con cifrado PGP de extremo a extremo.</p>
                    <p className="text-muted-foreground text-[11px]">Los archivos se depositarán cifrados en el buzón institucional seguro de la DINARP.</p>
                  </div>
                </div>
              </div>
            )}

            {/* ── Paso 5: Documentos ── */}
            {activeStep === 4 && (
              <div className="space-y-4">
                <div className="p-6 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center space-y-2 bg-background/40">
                  <div className="size-10 rounded-full bg-muted flex items-center justify-center text-foreground">
                    <UploadCloud className="size-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-foreground">
                      Arrastra y suelta tus archivos aquí, o haz clic para examinar
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Formatos permitidos: PDF, ZIP (Máx. 25 MB por archivo)
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-foreground">Archivos adjuntos precargados (2)</span>
                  <div className="p-3 rounded-xl border border-border bg-background flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <FileText className="size-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">Solicitud_MIDUVI_Oficio_2026.pdf</span>
                    </div>
                    <Badge tone="neutral" appearance="soft" size="sm" className="text-[10px]">450 KB</Badge>
                  </div>

                  <div className="p-3 rounded-xl border border-border bg-background flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <FileText className="size-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">Plan_Operativo_Vivienda.pdf</span>
                    </div>
                    <Badge tone="neutral" appearance="soft" size="sm" className="text-[10px]">1.8 MB</Badge>
                  </div>
                </div>
              </div>
            )}

            {/* ── Paso 6: Confirmación ── */}
            {activeStep === 5 && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl border border-border bg-background/50 space-y-3">
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <span className="text-muted-foreground">Proyecto:</span>
                    <span className="font-semibold text-foreground">{nombreProyecto || "Cruce poblacional para subsidios de vivienda"}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <span className="text-muted-foreground">Fuente → Consumidor:</span>
                    <span className="font-semibold text-foreground">{fuenteData} → {consumidorData}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <span className="text-muted-foreground">Volumen y Frecuencia:</span>
                    <span className="font-semibold text-foreground">{volumenEstimado} · {frecuencia}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mecanismo:</span>
                    <span className="font-semibold text-foreground">SFTP Seguro + Cifrado PGP</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pt-2">
                  <Checkbox id="terms" defaultChecked className="mt-0.5" />
                  <label htmlFor="terms" className="text-xs text-foreground cursor-pointer leading-tight">
                    Declaro que los datos solicitados serán utilizados exclusivamente para los fines del proyecto y bajo estricto cumplimiento de la Ley Orgánica de Protección de Datos Personales.
                  </label>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="p-6 pt-3 border-t border-border/60 flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={activeStep === 0}
              className="h-10 px-4 text-xs font-semibold gap-1.5"
            >
              <ArrowLeft className="size-4" />
              <span>Anterior</span>
            </Button>

            <Button
              type="button"
              variant="primary"
              onClick={handleNext}
              className="h-10 px-6 text-xs font-semibold gap-2 shadow-xs"
            >
              <span>{activeStep === STEPS_CONFIG.length - 1 ? "Enviar solicitud" : "Siguiente"}</span>
              {activeStep < STEPS_CONFIG.length - 1 && <ArrowRight className="size-4" />}
            </Button>
          </CardFooter>
        </Card>

        {/* Modal de Éxito al Enviar Solicitud */}
        <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
          <DialogContent variant="standard" className="max-w-[440px] rounded-3xl p-6 sm:p-8 bg-background border-border shadow-2xl text-center">
            <div className="size-14 rounded-2xl bg-muted/60 border border-border flex items-center justify-center text-foreground mb-3 mx-auto">
              <CheckCircle2 className="size-7 stroke-[2]" />
            </div>
            <DialogHeader className="text-center space-y-2">
              <DialogTitle className="font-heading font-bold text-xl sm:text-2xl text-foreground">
                Solicitud Registrada
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                La solicitud de intercambio masivo ha sido radicada con el código <strong>BATCH-006</strong> y enviada al comité de revisión técnica.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-4 flex w-full">
              <Button
                type="button"
                variant="primary"
                onClick={() => {
                  setIsSuccessModalOpen(false);
                  router.push("/wireframes/intercambios-masivos");
                }}
                className="w-full h-11 text-xs font-semibold"
              >
                Volver a la bandeja
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </WireframeDashboardLayout>
  );
}

