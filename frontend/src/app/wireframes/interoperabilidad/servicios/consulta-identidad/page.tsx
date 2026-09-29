"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Settings,
  History,
  Building2,
  Server,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Globe,
  Lock,
  Code2,
  Copy,
  Eye,
  FileText as FileTextIcon,
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
import { OnboardingGuide } from "@/components/ui/onboarding-guide";

export default function WireframeDetalleServicioPage() {
  const router = useRouter();

  const [pruebaState, setPruebaState] = React.useState<"idle" | "success" | "error" | "soporte_pendiente" | "soporte_resuelto">("idle");
  const [onboardingMode, setOnboardingMode] = React.useState<"detalle" | "prueba" | "soporte">("detalle");

  const datosHabilitados = [
    { campo: "Número de identificación", codigo: "cedula", tipo: "String(10)" },
    { campo: "Nombres", codigo: "nombres", tipo: "String(100)" },
    { campo: "Apellidos", codigo: "apellidos", tipo: "String(100)" },
    { campo: "Fecha de nacimiento", codigo: "fecha_nacimiento", tipo: "Date" },
    { campo: "Nacionalidad", codigo: "nacionalidad", tipo: "String(50)" },
    { campo: "Estado civil", codigo: "estado_civil", tipo: "String(30)" },
  ];

  let steps: any[] = [];
  if (onboardingMode === "detalle") {
    steps = [
      { targetId: "info-principal", title: "Información principal", content: "Aquí puedes consultar la institución, fuente, solicitud asociada y estado actual del paquete." },
      { targetId: "campos-autorizados", title: "Campos autorizados", content: "Estos son únicamente los campos que fueron aprobados durante tu solicitud." },
      { targetId: "documentos-paquete", title: "Documentos", content: "Aquí puedes consultar los documentos asociados a la habilitación del servicio." },
      { targetId: "btn-seguimiento", title: "Seguimiento", content: "Consulta el historial de creación, validación, entrega y pruebas del paquete." }
    ];
  } else if (onboardingMode === "prueba") {
    steps = [
      { targetId: "bloque-prueba", title: "Prueba de consumo", content: "Realiza una prueba para confirmar que tu institución puede consumir correctamente la información habilitada." },
      { targetId: "resultado-prueba", title: "Resultado de prueba", content: "Registra si el consumo fue favorable o presentó algún error." }
    ];
    if (pruebaState === "success") {
      steps.push({ targetId: "resultado-prueba", title: "Prueba exitosa", content: "La prueba fue satisfactoria. El proceso de acceso a interoperabilidad queda completado." });
    } else if (pruebaState === "error") {
      steps.push({ targetId: "resultado-prueba", title: "Reportar error", content: "Si encuentras un problema durante el consumo, puedes reportarlo para recibir soporte." });
    }
  } else if (onboardingMode === "soporte") {
    steps = [
      { targetId: "soporte-ticket", title: "Número de seguimiento", content: "Tu reporte tiene un número de seguimiento para consultar su atención." },
      { targetId: "soporte-estado", title: "Estado del requerimiento", content: "Aquí puedes consultar el avance del soporte técnico." }
    ];
    if (pruebaState === "soporte_resuelto") {
      steps.push({ targetId: "btn-repetir-prueba", title: "Soporte resuelto", content: "El inconveniente fue atendido. Ahora puedes repetir la prueba de consumo." });
    }
  }

  return (
    <WireframeDashboardLayout activeMenu="servicios">
      <OnboardingGuide steps={steps} guideKey={`onboarding-${onboardingMode}-${pruebaState}`} />
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
                <Link href="/wireframes/interoperabilidad/servicios" className="text-muted-foreground hover:text-foreground">
                  Interoperabilidad / Servicios
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-foreground">
                Consulta de identidad
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* ── 2. Header & Top Actions ── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-border/80">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-muted text-foreground">
                SRV-RC-001
              </span>
              <Badge tone="neutral" appearance="solid" size="md" className="font-semibold text-xs gap-1.5">
                <span className="size-2 rounded-full bg-background" />
                Activo
              </Badge>
              <Badge tone="neutral" appearance="outline" size="sm" className="font-mono text-xs">
                REST / JSON
              </Badge>
            </div>

            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-foreground tracking-tight">
              Consulta de identidad
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Servicio en línea para validación y consulta de datos de identidad ciudadana contra el padrón nacional del Registro Civil.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 lg:pt-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/wireframes/interoperabilidad/servicios")}
              className="h-10 px-4 rounded-xl text-xs font-semibold gap-1.5 border-border"
            >
              <ArrowLeft className="size-4" />
              <span>Volver</span>
            </Button>

            <Button
              id="btn-seguimiento"
              type="button"
              variant="outline"
              onClick={() => router.push("/wireframes/interoperabilidad/servicios/consulta-identidad/historial")}
              className="h-10 px-4 rounded-xl text-xs font-semibold gap-1.5 border-border"
            >
              <History className="size-4" />
              <span>Ver historial</span>
            </Button>

            {onboardingMode !== "prueba" && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setOnboardingMode("prueba")}
                className="h-10 px-4 rounded-xl text-xs font-semibold gap-1.5 border-border bg-primary/10"
              >
                <span>Probar Onboarding Prueba</span>
              </Button>
            )}

            <Button
              type="button"
              variant="primary"
              onClick={() => router.push("/wireframes/interoperabilidad/servicios/consulta-identidad/configuracion")}
              className="h-10 px-4 rounded-xl text-xs font-semibold gap-1.5 shadow-xs"
            >
              <Settings className="size-4" />
              <span>Editar configuración</span>
            </Button>
          </div>
        </div>

        {/* ── 3. Resumen del Servicio ── */}
        <Card id="info-principal" className="border-border bg-surface shadow-xs">
          <CardHeader className="p-6 pb-2">
            <CardTitle className="text-base font-heading font-bold text-foreground">
              Resumen del servicio
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            <DetailList
              columns={2}
              items={[
                {
                  label: "Fuente (Custodio)",
                  value: <span className="font-semibold text-foreground">Registro Civil (DIGERCIC)</span>,
                },
                {
                  label: "Consumidor (Entidad)",
                  value: <span className="font-semibold text-foreground">Ministerio de Gobierno</span>,
                },
                {
                  label: "Tipo de intercambio",
                  value: "Consulta en línea (API REST sincrónica)",
                },
                {
                  label: "Estado operativo",
                  value: (
                    <Badge tone="neutral" appearance="soft" size="sm" className="font-semibold text-xs">
                      Activo
                    </Badge>
                  ),
                },
                {
                  label: "Vigencia del acuerdo",
                  value: <span className="font-mono text-xs font-medium text-foreground">01/01/26 - 31/12/26</span>,
                },
                {
                  label: "Última actualización",
                  value: "15/09/26 14:30",
                },
              ]}
            />
          </CardContent>
        </Card>

        {/* ── 4. Datos Habilitados ── */}
        <Card id="campos-autorizados" className="border-border bg-surface shadow-xs">
          <CardHeader className="p-6 pb-3 flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base font-heading font-bold text-foreground">
                Datos habilitados
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Atributos autorizados para consulta en este acuerdo de interoperabilidad.
              </CardDescription>
            </div>
            <Badge tone="neutral" appearance="soft" size="sm" className="font-semibold">
              {datosHabilitados.length} campos autorizados
            </Badge>
          </CardHeader>
          <CardContent className="p-6 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {datosHabilitados.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-border bg-background/60 flex items-center justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-foreground block">{item.campo}</span>
                    <span className="font-mono text-[10px] text-muted-foreground block">{item.codigo}</span>
                  </div>
                  <Badge tone="neutral" appearance="outline" size="sm" className="font-mono text-[10px]">
                    {item.tipo}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── 5. Endpoints / Conexión ── */}
        <Card className="border-border bg-surface shadow-xs">
          <CardHeader className="p-6 pb-3">
            <CardTitle className="text-base font-heading font-bold text-foreground flex items-center gap-2">
              <Server className="size-4 text-muted-foreground" />
              <span>Endpoints y Parámetros de Conexión</span>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Especificación de integración para el entorno de producción.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-1 space-y-4">
            <div className="p-3.5 rounded-xl border border-border bg-background flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
              <div className="flex items-center gap-2.5 overflow-x-auto">
                <Badge tone="neutral" appearance="solid" size="sm" className="font-bold text-[10px]">
                  POST
                </Badge>
                <span className="text-foreground select-all">https://api.dinarp.gob.ec/v2/rc/identidad</span>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-xs font-sans text-muted-foreground gap-1">
                <Copy className="size-3" />
                <span>Copiar URL</span>
              </Button>
            </div>

            <DetailList
              columns={2}
              items={[
                {
                  label: "Formato de respuesta",
                  value: <span className="font-mono text-xs">application/json; charset=utf-8</span>,
                },
                {
                  label: "Protocolo de Seguridad",
                  value: "TLS 1.3 · Mutual TLS / OAuth 2.0 Bearer",
                },
                {
                  label: "Tasa máxima (Throttling)",
                  value: "200 peticiones / minuto",
                },
                {
                  label: "Acuerdo SLA",
                  value: "99.9% de disponibilidad garantizada",
                },
              ]}
            />
          </CardContent>
        </Card>

        {/* ── 6. Documentos y respaldos ── */}
        <Card id="documentos-paquete" className="border-border bg-surface shadow-xs">
          <CardHeader className="p-6 pb-3">
            <CardTitle className="text-base font-heading font-bold text-foreground flex items-center gap-2">
              <Layers className="size-4 text-muted-foreground" />
              <span>Documentos y respaldos</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-1 space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-xl border border-border bg-background">
              <FileTextIcon className="size-6 text-primary" />
              <div>
                <p className="text-sm font-semibold">Resolución de autorización</p>
                <p className="text-xs text-muted-foreground">PDF • 1.2 MB</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── 7. Prueba de consumo ── */}
        <Card id="bloque-prueba" className="border-border bg-surface shadow-xs">
          <CardHeader className="p-6 pb-3">
            <CardTitle className="text-base font-heading font-bold text-foreground flex items-center gap-2">
              <Globe className="size-4 text-muted-foreground" />
              <span>Prueba de consumo en producción</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-1 space-y-4">
            <div className="text-sm text-muted-foreground mb-4">
              Ejecute una prueba para confirmar que los parámetros de conexión y credenciales son correctos.
            </div>
            <div id="resultado-prueba" className="flex items-center gap-4 p-4 rounded-xl border border-border bg-background">
              <Button size="sm" variant="outline" onClick={() => setPruebaState("success")}>Simular Éxito</Button>
              <Button size="sm" variant="outline" onClick={() => setPruebaState("error")}>Simular Error</Button>
            </div>
            {pruebaState === "success" && (
              <div className="p-4 bg-success/10 text-success border border-success/20 rounded-xl text-sm font-medium">
                Conexión establecida exitosamente.
              </div>
            )}
            {pruebaState === "error" && (
              <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl text-sm font-medium flex flex-col gap-2">
                <span>Error 403: Credenciales inválidas o expiradas.</span>
                <Button size="sm" variant="danger" onClick={() => { setOnboardingMode("soporte"); setPruebaState("soporte_pendiente") }}>
                  Reportar a soporte
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── 8. Soporte Técnico (Solo visible si hay ticket) ── */}
        {(pruebaState === "soporte_pendiente" || pruebaState === "soporte_resuelto") && (
          <Card className="border-border bg-surface shadow-xs mt-6">
            <CardHeader className="p-6 pb-3">
              <CardTitle className="text-base font-heading font-bold text-foreground flex items-center gap-2">
                <span>Soporte Técnico</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-1 space-y-4">
              <div className="flex items-center gap-4">
                <div id="soporte-ticket" className="text-sm font-semibold">
                  Ticket #REQ-2026-992
                </div>
                <Badge id="soporte-estado" tone={pruebaState === "soporte_resuelto" ? "success" : "warning"} appearance="soft">
                  {pruebaState === "soporte_resuelto" ? "Resuelto" : "En atención"}
                </Badge>
              </div>
              {pruebaState === "soporte_pendiente" && (
                <Button size="sm" onClick={() => setPruebaState("soporte_resuelto")}>Simular Resolución</Button>
              )}
              {pruebaState === "soporte_resuelto" && (
                <Button id="btn-repetir-prueba" size="sm" variant="primary" onClick={() => { setOnboardingMode("prueba"); setPruebaState("success"); }}>
                  Repetir prueba
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </WireframeDashboardLayout>
  );
}

