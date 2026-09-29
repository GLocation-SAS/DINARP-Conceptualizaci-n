"use client";
import { OnboardingGuide } from "@/components/ui/onboarding-guide";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Building2,
  FileCheck2,
  Info,
  Clock,
  Activity,
  History,
  Lock,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { DetailList } from "@/components/ui/detail-list";
import { WireframeDashboardLayout } from "../../../components/wireframe-dashboard-layout";

export default function WireframeSeguimientoPermisoPage() {
  const router = useRouter();

  // Simulating entity type for onboarding demo
  const [tipoEntidad] = React.useState<"publica" | "privada">("privada");

  const onboardingSteps = [
    { targetId: "estado-solicitud", title: "Estado de la solicitud", content: "Tu solicitud fue aprobada. Ahora continuará con la etapa de formalización correspondiente a tu institución." },
    { targetId: "accion-requerida", title: "Acción requerida", content: tipoEntidad === "publica" ? "Debes continuar con la formalización mediante convenio." : "Debes continuar con la formalización y el proceso de facturación correspondiente." },
    { targetId: "seguimiento-timeline", title: "Seguimiento", content: "Desde aquí puedes consultar cada etapa posterior a la aprobación sin perder el historial de tu solicitud." }
  ];

  return (
    <WireframeDashboardLayout activeMenu="aprobaciones">
      <OnboardingGuide steps={onboardingSteps} guideKey="onboarding-solicitud-aprobada" />
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
                <Link href="/wireframes/aprobaciones" className="text-muted-foreground hover:text-foreground">
                  Aprobaciones y permisos
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/wireframes/aprobaciones/SOL-024" className="text-muted-foreground hover:text-foreground">
                  SOL-024
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-foreground">
                Seguimiento
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* ── 2. Header: Estado Principal "Solicitud aprobada" ── */}
        <div id="estado-solicitud" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/80">
          <div className="flex items-start gap-4">
            <div className="size-12 rounded-2xl bg-muted/80 flex items-center justify-center text-foreground shrink-0 shadow-xs">
              <CheckCircle2 className="size-7 stroke-[2]" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-foreground tracking-tight">
                  Solicitud aprobada
                </h1>
                <Badge tone="neutral" appearance="solid" size="md" className="font-semibold text-xs gap-1.5">
                  <span className="size-2 rounded-full bg-background" />
                  Aprobada
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                La solicitud ha sido aprobada y el permiso se encuentra activo.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/wireframes/aprobaciones")}
            className="h-10 px-4 rounded-xl text-xs font-semibold gap-2 border-border shrink-0"
          >
            <ArrowLeft className="size-4" />
            <span>Volver a bandeja</span>
          </Button>
        </div>

        {/* ── 2.5 Bloque de acción requerida ── */}
        <Alert
          id="accion-requerida"
          variant="default"
          icon={<Info className="size-4 text-foreground" />}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-primary/10 border-primary/20"
        >
          <div className="text-xs text-foreground font-medium leading-relaxed">
            {tipoEntidad === "publica" 
              ? "Acción requerida: Debes continuar con la formalización mediante convenio para proceder a la habilitación."
              : "Acción requerida: Debes continuar con la formalización y el proceso de facturación correspondiente."}
          </div>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => router.push(tipoEntidad === "publica" ? "/wireframes/formalizacion" : "/wireframes/facturacion/F-2026-00125")}
            className="h-9 px-4 rounded-xl text-xs font-semibold gap-1.5 shrink-0 shadow-xs"
          >
            <span>Continuar proceso</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </Alert>

        {/* ── 3. Card: Resumen del permiso ── */}
        <Card className="border-border bg-surface shadow-xs">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-base font-heading font-bold text-foreground">
              Resumen del permiso
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            <DetailList
              columns={2}
              items={[
                {
                  label: "Entidad consumidora",
                  value: <span className="font-semibold text-foreground">Ministerio X</span>,
                },
                {
                  label: "Proyecto asociado",
                  value: "Validación ciudadana",
                },
                {
                  label: "Fuente",
                  value: "Registro Civil, SRI",
                },
                {
                  label: "Estado",
                  value: (
                    <Badge tone="neutral" appearance="soft" size="sm" className="font-semibold text-xs">
                      Aprobada
                    </Badge>
                  ),
                },
                {
                  label: "Datos autorizados",
                  value: "Número de identificación, Nombres, Fecha de nacimiento, RUC, Estado tributario",
                },
                {
                  label: "Fecha de aprobación",
                  value: "17/09/26 10:24",
                },
                {
                  label: "Responsable",
                  value: "María Pérez",
                },
              ]}
            />
          </CardContent>
        </Card>

        {/* ── 4. Dos Columnas: Seguimiento del proceso & Condiciones del permiso ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna Izquierda: Seguimiento del proceso (Timeline) */}
          <Card id="seguimiento-timeline" className="border-border bg-surface shadow-xs">
            <CardHeader className="p-6 pb-3">
              <CardTitle className="text-base font-heading font-bold text-foreground flex items-center gap-2">
                <Clock className="size-4 text-muted-foreground" />
                <span>Seguimiento del proceso</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-2">
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                {/* Hito 1 */}
                <div className="relative">
                  <div className="absolute -left-6 top-1 size-5 rounded-full bg-foreground text-background flex items-center justify-center">
                    <CheckCircle2 className="size-3.5 stroke-[2.5]" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-foreground">15 sep · Solicitud creada</span>
                    <p className="text-[11px] text-muted-foreground">La solicitud fue registrada en el sistema.</p>
                  </div>
                </div>

                {/* Hito 2 */}
                <div className="relative">
                  <div className="absolute -left-6 top-1 size-5 rounded-full bg-foreground text-background flex items-center justify-center">
                    <CheckCircle2 className="size-3.5 stroke-[2.5]" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-foreground">16 sep · Enviada a revisión</span>
                    <p className="text-[11px] text-muted-foreground">La solicitud fue asignada para revisión.</p>
                  </div>
                </div>

                {/* Hito 3 */}
                <div className="relative">
                  <div className="absolute -left-6 top-1 size-5 rounded-full bg-foreground text-background flex items-center justify-center">
                    <CheckCircle2 className="size-3.5 stroke-[2.5]" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-foreground">17 sep · Revisión realizada</span>
                    <p className="text-[11px] text-muted-foreground">Se completó la revisión de la solicitud.</p>
                  </div>
                </div>

                {/* Hito 4 */}
                <div className="relative">
                  <div className="absolute -left-6 top-1 size-5 rounded-full bg-foreground text-background flex items-center justify-center ring-4 ring-muted/50">
                    <CheckCircle2 className="size-3.5 stroke-[2.5]" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-foreground">17 sep · Solicitud aprobada</span>
                    <p className="text-[11px] text-muted-foreground">Se otorgó el permiso de acceso a los datos.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Columna Derecha: Condiciones del permiso */}
          <Card className="border-border bg-surface shadow-xs">
            <CardHeader className="p-6 pb-3">
              <CardTitle className="text-base font-heading font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="size-4 text-muted-foreground" />
                <span>Condiciones del permiso</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-2 space-y-4 text-xs">
              <div className="p-3.5 rounded-xl border border-border bg-background/50 space-y-1">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-muted-foreground" />
                  Vigencia
                </span>
                <p className="text-muted-foreground pl-5">01/10/26 - 31/12/26</p>
              </div>

              <div className="p-3.5 rounded-xl border border-border bg-background/50 space-y-1">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <FileCheck2 className="size-3.5 text-muted-foreground" />
                  Uso permitido
                </span>
                <p className="text-muted-foreground pl-5">Solo para el proyecto declarado</p>
              </div>

              <div className="p-3.5 rounded-xl border border-border bg-background/50 space-y-1">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <Lock className="size-3.5 text-muted-foreground" />
                  Restricciones
                </span>
                <p className="text-muted-foreground pl-5">No redistribuir los datos</p>
              </div>

              <div className="p-3.5 rounded-xl border border-border bg-background/50 space-y-1">
                <span className="font-bold text-foreground flex items-center gap-1.5">
                  <Activity className="size-3.5 text-muted-foreground" />
                  Trazabilidad
                </span>
                <p className="text-muted-foreground pl-5">Todo acceso será registrado en los logs del sistema</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── 5. Bottom Banner Informativo ── */}
        <Alert
          variant="default"
          icon={<Info className="size-4 text-foreground" />}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface"
        >
          <div className="text-xs text-muted-foreground leading-relaxed">
            El solicitante ha sido notificado sobre la aprobación. Puedes consultar el historial completo en la sección de reportes.
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push("/wireframes/solicitudes/seguimiento")}
            className="h-9 px-4 rounded-xl text-xs font-semibold gap-1.5 shrink-0 border-border"
          >
            <History className="size-3.5" />
            <span>Ver historial</span>
          </Button>
        </Alert>
      </main>
    </WireframeDashboardLayout>
  );
}

