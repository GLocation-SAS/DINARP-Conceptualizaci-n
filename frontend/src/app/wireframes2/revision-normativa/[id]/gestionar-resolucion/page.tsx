"use client";

import React, { useState, use, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  FileSignature,
  Eye,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle2,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Stepper, type Step as StepperStep } from "@/components/ui/stepper";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import { WireframeDashboardLayout } from "../../../components/wireframe-dashboard-layout";
import { useAuthStore } from "../../../acceso-seguridad/data/auth-store";
import {
  useSolicitudesIngresoStore,
  getEstadoBadgeProps,
} from "../../../acceso-seguridad/data/gestion-ingresos-store";
import { MOCK_USERS_BY_ROLE } from "../../../catalogo-interoperabilidad/data/catalogo-data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function GestionarResolucionPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { activeUser } = useAuthStore();
  const currentUser = activeUser || MOCK_USERS_BY_ROLE.DIR_GESTION;

  const store = useSolicitudesIngresoStore();
  const { solicitudes, isLoaded } = store;

  const solicitud = useMemo(() => {
    return solicitudes.find((s) => s.id === id) || null;
  }, [solicitudes, id]);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const stepsList: StepperStep[] = [
    {
      id: "1",
      title: "Informaci—n",
      description: "Datos base",
      icon: FileText,
    },
    {
      id: "2",
      title: "Contenido",
      description: "Cuerpo de resoluci—n",
      icon: FileSignature,
    },
    { id: "3", title: "Borrador", description: "Revisi—n previa", icon: Eye },
    {
      id: "4",
      title: "Generaci—n",
      description: "Emisi—n formal",
      icon: ShieldCheck,
    },
  ];

  const activeSectionTitle = "Solicitudes generación resolución";

  if (isLoaded && !solicitud) {
    return (
      <WireframeDashboardLayout
        breadcrumbs={[
          {
            label: activeSectionTitle,
            onClick: () => router.push("/wireframes2/revision-normativa"),
          },
          { label: "Tr—mite no encontrado" },
        ]}
      >
        <div className="p-8 text-center">Tr—mite no encontrado.</div>
      </WireframeDashboardLayout>
    );
  }

  if (!solicitud) {
    return (
      <WireframeDashboardLayout breadcrumbs={[{ label: activeSectionTitle }]}>
        <div className="p-8 text-center text-xs text-muted-foreground">
          Cargando...
        </div>
      </WireframeDashboardLayout>
    );
  }

  const { tone, label } = getEstadoBadgeProps(
    solicitud.estado,
    solicitud.revisionIniciada,
  );

  const renderPlaceholder = (title: string, description: string) => (
    <div className="bg-surface border border-border rounded-2xl p-6 sm:p-10 text-center space-y-4 shadow-xs animate-in fade-in duration-200">
      <div className="size-12 rounded-xl bg-muted flex items-center justify-center mx-auto text-muted-foreground">
        <Info className="size-6" />
      </div>
      <h3 className="font-heading font-bold text-lg text-foreground">
        {title}
      </h3>
      <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
        {description}
      </p>
      <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-warning/10 text-warning-700 dark:text-warning text-xs font-semibold">
        <Clock className="size-3.5" />
        Contenido pendiente de definici—n
      </div>
    </div>
  );

  const handleNext = () => {
    if (step < 4) {
      setStep((step + 1) as 1 | 2 | 3 | 4);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep((step - 1) as 1 | 2 | 3 | 4);
    }
  };

  const handleGenerate = () => {
    const numResolucionSugerido =
      solicitud.resolucion ||
      `RES-DINARP-2026-${String(Math.floor(100 + Math.random() * 900))}`;
    store.aprobarNormatividad(
      solicitud.id,
      currentUser.name,
      numResolucionSugerido,
      "Resoluci—n institucional generada mediante flujo por pasos.",
    );
    toast.success("Resoluci—n generada correctamente", {
      description: `El tr—mite ${solicitud.id} avanz— a estado RESOLUCION_GENERADA.`,
    });
    router.push(`/wireframes2/revision-normativa/${solicitud.id}`);
  };

  return (
    <WireframeDashboardLayout
      breadcrumbs={[
        {
          label: activeSectionTitle,
          onClick: (e: React.MouseEvent) => {
            e.preventDefault();
            router.push("/wireframes2/revision-normativa");
          },
        },
        {
          label: solicitud.id,
          onClick: (e: React.MouseEvent) => {
            e.preventDefault();
            router.push(`/wireframes2/revision-normativa/${solicitud.id}`);
          },
        },
        { label: "Gestionar resoluci—n" },
      ]}
    >
      <main className="w-full max-w-[1200px] mx-auto px-2.5 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6">
        {/* Cabecera contextual */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <Button
              type="button"
              variant="neutral"
              size="sm"
              onClick={() =>
                router.push(
                  `/wireframes2/revision-normativa/${solicitud.id}`,
                )
              }
              className="h-8 px-3 text-xs font-semibold gap-1.5 rounded-full mb-3"
            >
              <ArrowLeft className="size-3.5" />
              <span>Volver al tr—mite</span>
            </Button>
            <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-foreground">
              Gestionar Resoluci—n Institucional
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Configura y emite la resoluci—n para aprobar la solicitud de
              registro.
            </p>
          </div>

          {/* Contexto del tr—mite minimalista */}
          <div className="p-3.5 bg-surface border border-border rounded-xl shadow-2xs min-w-[280px]">
            <div className="flex justify-between items-start gap-4 mb-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Contexto del Tr—mite
              </span>
              <Badge
                tone={tone}
                appearance="soft"
                size="sm"
                dot
                className="font-semibold text-[10px] uppercase"
              >
                {label}
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">ID Tr—mite:</span>
                <span className="font-mono font-bold text-foreground">
                  {solicitud.id}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Instituci—n:</span>
                <span
                  className="font-semibold text-foreground max-w-[180px] truncate"
                  title={solicitud.institucion}
                >
                  {solicitud.institucion}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stepper */}
        <div className="bg-surface border border-border rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xs overflow-x-auto">
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

        {/* Contenido de los Pasos */}
        <div className="space-y-6">
          {step === 1 &&
            renderPlaceholder(
              "Informaci—n de la resoluci—n",
              "Los campos de esta secci—n se configurar—n de acuerdo con la plantilla oficial de resoluci—n definida por DINARP.",
            )}

          {step === 2 &&
            renderPlaceholder(
              "Contenido de la resoluci—n",
              "Aqu— se definir— el cuerpo del documento jurídico. Los campos espec—ficos se ajustar—n a la plantilla oficial de DINARP.",
            )}

          {step === 3 &&
            renderPlaceholder(
              "Revisi—n del borrador",
              "Previsualizaci—n del documento generado para validaci—n final antes de la emisi—n formal.",
            )}

          {step === 4 && (
            <div className="bg-surface border border-border rounded-2xl p-6 sm:p-10 space-y-6 shadow-xs animate-in fade-in duration-200">
              <div className="text-center space-y-4 max-w-lg mx-auto">
                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary border border-primary/20">
                  <ShieldCheck className="size-8" />
                </div>
                <h3 className="font-heading font-bold text-xl text-foreground">
                  Generar Resoluci—n
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Confirma la emisi—n de la resoluci—n institucional. Al
                  generarla, el tr—mite avanzar— y quedar— a la espera de la
                  firma electrónica externa por parte de la M—xima Autoridad
                  mediante FirmaEC.
                </p>
                <div className="p-4 bg-muted/40 rounded-xl border border-border text-left mt-6">
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-border/50 pb-2">
                      <span className="text-muted-foreground">
                        Instituci—n a aprobar:
                      </span>
                      <span className="font-semibold text-foreground">
                        {solicitud.institucion}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-border/50 pb-2">
                      <span className="text-muted-foreground">
                        Tr—mite asociado:
                      </span>
                      <span className="font-mono text-foreground">
                        {solicitud.id}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-muted-foreground">
                        Responsable Normativo:
                      </span>
                      <span className="font-semibold text-foreground">
                        {currentUser.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 pt-4 border-t border-border mt-8">
          <Button
            type="button"
            variant="secondary"
            size="default"
            onClick={
              step === 1
                ? () =>
                    router.push(
                      `/wireframes2/revision-normativa/${solicitud.id}`,
                    )
                : handlePrev
            }
            className="w-full sm:w-auto text-xs font-semibold rounded-full"
          >
            {step === 1 ? "Cancelar" : "Atr—s"}
          </Button>

          {step < 4 ? (
            <Button
              type="button"
              variant="primary"
              size="default"
              onClick={handleNext}
              className="w-full sm:w-auto text-xs font-semibold gap-1.5 shadow-2xs rounded-full"
            >
              <span>Siguiente</span>
              <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="default"
              onClick={handleGenerate}
              className="w-full sm:w-auto text-xs font-semibold gap-1.5 shadow-2xs rounded-full"
            >
              <CheckCircle2 className="size-4" />
              <span>Confirmar y Generar Resoluci—n</span>
            </Button>
          )}
        </div>
      </main>
    </WireframeDashboardLayout>
  );
}



