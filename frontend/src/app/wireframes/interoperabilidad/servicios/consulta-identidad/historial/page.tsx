"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  History,
  Clock,
  User,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Activity,
  Layers,
  Filter,
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
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { WireframeDashboardLayout } from "../../../../components/wireframe-dashboard-layout";

interface EventoHistorial {
  id: string;
  fechaHora: string;
  evento: string;
  descripcion: string;
  usuario: string;
  tipo: "Técnico" | "Operativo" | "Mantenimiento" | "Seguridad" | "Resolución" | "Solicitud";
}

const HISTORIAL_DATA: EventoHistorial[] = [
  {
    id: "1",
    fechaHora: "15/09/26 14:30",
    evento: "Actualización",
    descripcion: "Modificación de cuota máxima de peticiones por minuto de 150 a 200 req/min.",
    usuario: "Carlos Mendoza (Admin DINARP)",
    tipo: "Técnico",
  },
  {
    id: "2",
    fechaHora: "02/08/26 09:15",
    evento: "Reactivación",
    descripcion: "Reactivación del servicio tras culminación de ventana de mantenimiento del Registro Civil.",
    usuario: "Sistema DINARP",
    tipo: "Operativo",
  },
  {
    id: "3",
    fechaHora: "01/08/26 23:00",
    evento: "Suspensión",
    descripcion: "Suspensión programada por actualización de infraestructura de base de datos en custodio.",
    usuario: "Sistema DINARP",
    tipo: "Mantenimiento",
  },
  {
    id: "4",
    fechaHora: "15/01/26 11:20",
    evento: "Habilitación",
    descripcion: "Despliegue de credenciales, emisión de tokens y apertura de túnel TLS para consumo en producción.",
    usuario: "María Pérez (Seguridad)",
    tipo: "Seguridad",
  },
  {
    id: "5",
    fechaHora: "12/01/26 16:45",
    evento: "Aprobación",
    descripcion: "Emisión de dictamen favorable y resolución técnica de interoperabilidad Nro. DINARP-2026-0045.",
    usuario: "Comité Técnico DINARP",
    tipo: "Resolución",
  },
  {
    id: "6",
    fechaHora: "05/01/26 10:00",
    evento: "Creación",
    descripcion: "Registro inicial del acuerdo de interoperabilidad y radicación de solicitud de servicio.",
    usuario: "Ministerio de Gobierno",
    tipo: "Solicitud",
  },
];

export default function WireframeHistorialServicioPage() {
  const router = useRouter();

  return (
    <WireframeDashboardLayout activeMenu="servicios">
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
              <BreadcrumbLink asChild>
                <Link href="/wireframes/interoperabilidad/servicios/consulta-identidad" className="text-muted-foreground hover:text-foreground">
                  Consulta de identidad
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-foreground">
                Historial
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* ── 2. Header & Action ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-muted text-foreground">
                SRV-RC-001
              </span>
              <span className="text-xs text-muted-foreground">Registro Civil → Ministerio de Gobierno</span>
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-foreground tracking-tight">
              Historial de trazabilidad
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Registro auditado de eventos de ciclo de vida, aprobaciones, cambios de configuración y estados operativos.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/wireframes/interoperabilidad/servicios/consulta-identidad")}
            className="h-10 px-4 rounded-xl text-xs font-semibold gap-2 border-border shrink-0"
          >
            <ArrowLeft className="size-4" />
            <span>Volver al detalle</span>
          </Button>
        </div>

        {/* ── 3. Tabla / Timeline de Eventos ── */}
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-xs">
          <Table className="w-full border-spacing-0">
            <TableHeader>
              <TableRow className="border-b border-border/80 bg-muted/30 hover:bg-muted/30">
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                  FECHA Y HORA
                </TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                  EVENTO
                </TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                  DESCRIPCIÓN
                </TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-left">
                  USUARIO / RESPONSABLE
                </TableHead>
                <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider py-3.5 px-4 text-right">
                  TIPO
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {HISTORIAL_DATA.map((item) => (
                <TableRow key={item.id} className="border-b border-border/40 hover:bg-muted/20 transition-colors">
                  {/* Fecha y hora */}
                  <TableCell className="py-4 px-4 text-xs font-mono text-muted-foreground whitespace-nowrap">
                    {item.fechaHora}
                  </TableCell>

                  {/* Evento */}
                  <TableCell className="py-4 px-4 text-xs font-bold text-foreground whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-foreground" />
                      <span>{item.evento}</span>
                    </div>
                  </TableCell>

                  {/* Descripción */}
                  <TableCell className="py-4 px-4 text-xs text-muted-foreground max-w-[320px] leading-relaxed">
                    {item.descripcion}
                  </TableCell>

                  {/* Usuario */}
                  <TableCell className="py-4 px-4 text-xs text-foreground font-medium whitespace-nowrap">
                    {item.usuario}
                  </TableCell>

                  {/* Tipo */}
                  <TableCell className="py-4 px-4 text-right whitespace-nowrap">
                    <Badge tone="neutral" appearance="soft" size="sm" className="font-medium text-[11px]">
                      {item.tipo}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* ── Paginación Estandarizada UI Kit ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-muted-foreground font-medium">
            Mostrando 1 a {HISTORIAL_DATA.length} de {HISTORIAL_DATA.length} eventos de auditoría
          </p>
          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent className="gap-1.5">
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </main>
    </WireframeDashboardLayout>
  );
}

