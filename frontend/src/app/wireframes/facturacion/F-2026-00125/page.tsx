"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  FileText,
  Building,
  Calendar,
  CreditCard,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { OnboardingGuide } from "@/components/ui/onboarding-guide";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
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
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { WireframeDashboardLayout } from "../../components/wireframe-dashboard-layout";

export default function WireframeDetalleFacturaPage() {
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [estadoPago, setEstadoPago] = useState<"Pendiente de pago" | "Pago verificado">("Pendiente de pago");

  const handleDownloadPdf = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadSuccess(true);
    }, 800);
  };

  const handlePagar = () => {
    setEstadoPago("Pago verificado");
  };

  const onboardingSteps = [
    { targetId: "estado-pago", title: "Pendiente de pago", content: "Tu solicitud ya fue aprobada y tiene una factura asociada pendiente de gestión." },
    { targetId: "resumen-factura", title: "Resumen de factura", content: "Aquí puedes consultar el número de factura, valor, fecha y solicitud relacionada." },
    { targetId: "btn-gestionar-pago", title: "Gestionar pago", content: "Continúa desde aquí con el proceso de pago para que tu solicitud pueda avanzar." },
    { targetId: "estado-pago", title: "Estado del pago", content: "Después de realizar el pago, podrás consultar si se encuentra pendiente de validación o ya fue verificado." }
  ];

  if (estadoPago === "Pago verificado") {
    onboardingSteps.push({
      targetId: "estado-pago",
      title: "Pago verificado",
      content: "El pago fue verificado. Tu solicitud continuará automáticamente hacia la creación de los paquetes de consumo."
    });
  }

  return (
    <WireframeDashboardLayout activeMenu="facturacion">
      <OnboardingGuide steps={onboardingSteps} guideKey={`onboarding-facturacion-${estadoPago}`} />
      <main className="relative p-4 sm:p-6 lg:p-8 w-full space-y-6 sm:space-y-8">
        {/* Background subtle effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-muted/20 to-transparent pointer-events-none -z-10 blur-3xl opacity-60" />

        {/* ── 0. Miga de pan ── */}
        <Breadcrumb className="mb-1">
          <BreadcrumbList className="text-xs">
            <BreadcrumbItem>
              <BreadcrumbLink href="/wireframes/dashboard">Inicio</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/wireframes/solicitudes">Bandeja de solicitudes</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/wireframes/facturacion">Facturación</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-foreground">F-2026-00125</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* ── 1. Acción Volver ── */}
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/wireframes/solicitudes"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline group"
          >
            <ArrowLeft className="size-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Volver a la bandeja de solicitudes</span>
          </Link>
          <span className="text-muted-foreground/40">•</span>
          <Link
            href="/wireframes/facturacion"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:underline"
          >
            <span>Volver a facturas</span>
          </Link>
        </div>

        {/* ── 2. Header Title & Action ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-foreground tracking-tight">
              Factura F-2026-00125
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Detalle de la factura y conceptos asociados.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 lg:pt-0">
            <Button
              id="btn-gestionar-pago"
              type="button"
              variant="primary"
              onClick={handlePagar}
              disabled={estadoPago === "Pago verificado"}
              className="h-10 px-4 text-xs font-semibold gap-2 shrink-0 shadow-xs"
            >
              <span>{estadoPago === "Pago verificado" ? "Pago realizado" : "Gestionar pago"}</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="h-10 px-4 text-xs font-semibold gap-2 border-border/80 bg-surface shrink-0"
            >
              <Download className="size-3.5" />
              <span>{isDownloading ? "Generando PDF..." : "Descargar factura"}</span>
            </Button>
          </div>
        </div>

        {/* ── 3. Sección: Información General ── */}
        <Card id="resumen-factura" className="rounded-2xl border-border bg-surface p-6 sm:p-8 space-y-6 shadow-xs">
          <h2 className="text-sm font-bold text-foreground">
            Información general
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 text-xs">
            {/* Columna Izquierda */}
            <div className="space-y-4">
              {/* N° de factura */}
              <div>
                <span className="text-muted-foreground block text-[11px] mb-0.5">N° de factura</span>
                <span className="font-mono font-bold text-foreground text-sm">F-2026-00125</span>
              </div>

              {/* Fecha de emisión */}
              <div>
                <span className="text-muted-foreground block text-[11px] mb-0.5">Fecha de emisión</span>
                <span className="text-foreground font-mono">15/09/2026</span>
              </div>

              {/* Estado */}
              <div>
                <span className="text-muted-foreground block text-[11px] mb-0.5">Estado</span>
                <Badge id="estado-pago" tone={estadoPago === "Pago verificado" ? "success" : "warning"} appearance="soft" size="sm" className="font-semibold text-xs">
                  {estadoPago}
                </Badge>
              </div>

              {/* Entidad */}
              <div>
                <span className="text-muted-foreground block text-[11px] mb-0.5">Entidad</span>
                <span className="text-foreground font-semibold">Registro Civil</span>
              </div>

              {/* Proyecto / Solicitud */}
              <div>
                <span className="text-muted-foreground block text-[11px] mb-0.5">Proyecto / Solicitud</span>
                <div className="space-y-1">
                  <span className="text-foreground font-semibold block">Proyecto Identidad</span>
                  <Link
                    href="/wireframes/solicitudes/detalle"
                    className="inline-flex items-center gap-1 text-primary hover:underline font-medium text-xs"
                  >
                    <span>Ver solicitud</span>
                    <span className="text-[10px]">→</span>
                  </Link>
                </div>
              </div>

              {/* Cotización asociada */}
              <div>
                <span className="text-muted-foreground block text-[11px] mb-0.5">Cotización asociada</span>
                <div className="space-y-1">
                  <span className="text-foreground font-mono font-semibold block">COT-2026-00045</span>
                  <Link
                    href="/wireframes/tarifario"
                    className="inline-flex items-center gap-1 text-primary hover:underline font-medium text-xs"
                  >
                    <span>Ver cotización</span>
                    <span className="text-[10px]">→</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Columna Derecha */}
            <div className="space-y-4">
              {/* Fecha de vencimiento */}
              <div>
                <span className="text-muted-foreground block text-[11px] mb-0.5">Fecha de vencimiento</span>
                <span className="text-foreground font-bold font-mono">30/09/2026</span>
              </div>

              {/* Forma de pago */}
              <div>
                <span className="text-muted-foreground block text-[11px] mb-0.5">Forma de pago</span>
                <span className="text-foreground">Por definir</span>
              </div>

              {/* RUC entidad */}
              <div>
                <span className="text-muted-foreground block text-[11px] mb-0.5">RUC entidad</span>
                <span className="text-foreground font-mono">1760001230001</span>
              </div>

              {/* Dirección entidad */}
              <div>
                <span className="text-muted-foreground block text-[11px] mb-0.5">Dirección entidad</span>
                <span className="text-foreground">Av. Amazonas N34-451, Quito</span>
              </div>

              {/* Observaciones */}
              <div>
                <span className="text-muted-foreground block text-[11px] mb-0.5">Observaciones</span>
                <p className="text-muted-foreground leading-relaxed">
                  Servicio de consulta de datos de identidad según cotización aprobada.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* ── 4. Sección: Conceptos Facturados ── */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-foreground">
            Conceptos facturados
          </h2>

          <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-xs">
            <Table className="w-full border-spacing-0">
              <TableHeader>
                <TableRow className="border-b border-border/80 bg-muted/30 hover:bg-muted/30">
                  <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3 px-4 text-left">
                    DESCRIPCIÓN
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3 px-4 text-center">
                    CANTIDAD
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3 px-4 text-right">
                    VALOR UNITARIO (USD)
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3 px-4 text-right">
                    VALOR TOTAL (USD)
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-b border-border/40">
                  <TableCell className="py-3.5 px-4 text-xs font-medium text-foreground">
                    Consulta de datos de identidad
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-xs text-center font-mono">
                    10.000
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-xs text-right font-mono">
                    0,10
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-xs text-right font-mono font-semibold text-foreground">
                    1.000,00
                  </TableCell>
                </TableRow>
                <TableRow className="border-b border-border/40">
                  <TableCell className="py-3.5 px-4 text-xs font-medium text-foreground">
                    Soporte técnico
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-xs text-center font-mono">
                    1
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-xs text-right font-mono">
                    250,00
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-xs text-right font-mono font-semibold text-foreground">
                    250,00
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {/* Subtotales y Totales */}
            <div className="flex flex-col items-end space-y-2 p-6 border-t border-border/40 bg-surface-subtle/30">
              <div className="w-full sm:w-72 space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-mono font-semibold text-foreground">1.250,00</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-border/40">
                  <span className="text-muted-foreground">IVA (0%)</span>
                  <span className="font-mono font-semibold text-foreground">0,00</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold text-sm">
                  <span>Total (USD)</span>
                  <span className="font-mono">1.250,00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── 5. Sección: Historial de Estados ── */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-foreground">
            Historial de estados
          </h2>

          <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-xs">
            <Table className="w-full border-spacing-0">
              <TableHeader>
                <TableRow className="border-b border-border/80 bg-muted/30 hover:bg-muted/30">
                  <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3 px-4 text-left">
                    FECHA
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3 px-4 text-left">
                    ESTADO
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3 px-4 text-left">
                    USUARIO
                  </TableHead>
                  <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3 px-4 text-left">
                    OBSERVACIÓN
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-b border-border/40">
                  <TableCell className="py-3 px-4 text-xs font-mono text-muted-foreground whitespace-nowrap">
                    15/09/2026 10:32
                  </TableCell>
                  <TableCell className="py-3 px-4 whitespace-nowrap">
                    <Badge tone="neutral" appearance="soft" size="sm" className="text-xs">
                      Emitida
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 px-4 text-xs text-foreground font-medium whitespace-nowrap">
                    Sistema
                  </TableCell>
                  <TableCell className="py-3 px-4 text-xs text-muted-foreground">
                    Factura generada correctamente.
                  </TableCell>
                </TableRow>

                <TableRow className="border-b border-border/40">
                  <TableCell className="py-3 px-4 text-xs font-mono text-muted-foreground whitespace-nowrap">
                    14/09/2026 15:21
                  </TableCell>
                  <TableCell className="py-3 px-4 whitespace-nowrap">
                    <Badge tone="neutral" appearance="soft" size="sm" className="text-xs">
                      En proceso
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 px-4 text-xs text-foreground font-medium whitespace-nowrap">
                    Juan Pérez
                  </TableCell>
                  <TableCell className="py-3 px-4 text-xs text-muted-foreground">
                    Solicitud de emisión de factura.
                  </TableCell>
                </TableRow>

                <TableRow className="border-b border-border/40">
                  <TableCell className="py-3 px-4 text-xs font-mono text-muted-foreground whitespace-nowrap">
                    12/09/2026 09:15
                  </TableCell>
                  <TableCell className="py-3 px-4 whitespace-nowrap">
                    <Badge tone="neutral" appearance="soft" size="sm" className="text-xs">
                      Pendiente
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 px-4 text-xs text-foreground font-medium whitespace-nowrap">
                    Sistema
                  </TableCell>
                  <TableCell className="py-3 px-4 text-xs text-muted-foreground">
                    Cotización aprobada.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Modal de confirmación de descarga */}
        <Dialog open={downloadSuccess} onOpenChange={setDownloadSuccess}>
          <DialogContent variant="standard" className="max-w-[420px] rounded-3xl p-6 sm:p-8 bg-background border-border shadow-2xl text-center">
            <div className="size-14 rounded-2xl bg-muted/60 border border-border flex items-center justify-center text-foreground mb-3 mx-auto">
              <CheckCircle2 className="size-7 stroke-[2]" />
            </div>
            <DialogHeader className="text-center space-y-2">
              <DialogTitle className="font-heading font-bold text-xl text-foreground">
                Descarga iniciada
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                El comprobante digital de la <strong>Factura F-2026-00125</strong> ha sido generado en PDF.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4 flex w-full">
              <Button
                type="button"
                variant="primary"
                onClick={() => setDownloadSuccess(false)}
                className="w-full h-11 text-xs font-semibold"
              >
                Aceptar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </WireframeDashboardLayout>
  );
}

