"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Send,
  FileText,
  Paperclip,
  PenLine,
  Plus,
  Clock,
  Building2,
  Database,
  Download,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
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
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { DetailList } from "@/components/ui/detail-list";
import { WireframeDashboardLayout } from "../../components/wireframe-dashboard-layout";

export default function WireframeDetalleSeguimientoPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("trazabilidad");
  const [comentarioTexto, setComentarioTexto] = useState("");
  const [comentariosList, setComentariosList] = useState([
    {
      id: "1",
      autor: "Carlos Núñez (DINARP)",
      fecha: "16 sep 2026 11:45",
      texto: "Se solicita ampliar la justificación técnica del proyecto indicando el marco legal que faculta la consulta directa.",
    },
    {
      id: "2",
      autor: "María López (Ministerio de Gobierno)",
      fecha: "15 sep 2026 09:20",
      texto: "Se adjuntó el documento complementario Justificación_actualizada.pdf con la base legal solicitada.",
    },
  ]);

  const handleAddComentario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comentarioTexto.trim()) return;

    setComentariosList((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        autor: "Paula Rozo (Revisora)",
        fecha: "Hoy 13:30",
        texto: comentarioTexto.trim(),
      },
    ]);
    setComentarioTexto("");
  };

  return (
    <WireframeDashboardLayout activeMenu="seguimiento">
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
                <Link href="/wireframes/seguimiento" className="text-muted-foreground hover:text-foreground">
                  Seguimiento
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-foreground">
                SOL-2026-001
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* ── 2. Header & Return Button ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-foreground tracking-tight font-mono">
                SOL-2026-001
              </h1>
              <Badge tone="neutral" appearance="soft" size="md" className="font-semibold text-xs gap-1.5">
                <span className="size-2 rounded-full bg-foreground" />
                En revisión
              </Badge>
            </div>
            <p className="text-sm font-semibold text-muted-foreground">
              Proyecto Identidad Digital
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/wireframes/seguimiento")}
            className="h-10 px-4 rounded-full text-xs font-semibold gap-2 border-border shrink-0"
          >
            <ArrowLeft className="size-4" />
            <span>Volver al listado</span>
          </Button>
        </div>

        {/* ── 3. Resumen Superior (6 Columnas) ── */}
        <Card className="rounded-2xl border-border bg-surface shadow-xs overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 divide-y lg:divide-y-0 lg:divide-x divide-border/60">
              <div className="space-y-1 pt-2 lg:pt-0">
                <span className="text-[11px] text-muted-foreground block font-medium">Institución solicitante</span>
                <p className="text-xs font-bold text-foreground leading-tight">Ministerio de Gobierno</p>
              </div>

              <div className="space-y-1 pt-2 lg:pt-0 lg:pl-4">
                <span className="text-[11px] text-muted-foreground block font-medium">Fuente</span>
                <p className="text-xs font-bold text-foreground leading-tight">Registro Civil</p>
              </div>

              <div className="space-y-1 pt-2 lg:pt-0 lg:pl-4">
                <span className="text-[11px] text-muted-foreground block font-medium">Consumidor</span>
                <p className="text-xs font-bold text-foreground leading-tight">Ministerio de Gobierno</p>
              </div>

              <div className="space-y-1 pt-2 lg:pt-0 lg:pl-4">
                <span className="text-[11px] text-muted-foreground block font-medium">Responsable actual</span>
                <p className="text-xs font-bold text-foreground leading-tight">María López</p>
              </div>

              <div className="space-y-1 pt-2 lg:pt-0 lg:pl-4">
                <span className="text-[11px] text-muted-foreground block font-medium">Fecha de creación</span>
                <p className="text-xs font-bold text-foreground leading-tight">10 sep 2026</p>
              </div>

              <div className="space-y-1 pt-2 lg:pt-0 lg:pl-4">
                <span className="text-[11px] text-muted-foreground block font-medium">Última actualización</span>
                <p className="text-xs font-bold text-foreground leading-tight">16 sep 2026 10:32</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── 4. Tabs de Contenido ── */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-muted/40 p-1 rounded-full border border-border h-11 w-full sm:w-auto inline-flex">
            <TabsTrigger value="trazabilidad" className="rounded-full text-xs font-semibold px-4">
              Trazabilidad
            </TabsTrigger>
            <TabsTrigger value="informacion" className="rounded-full text-xs font-semibold px-4">
              Información general
            </TabsTrigger>
            <TabsTrigger value="documentos" className="rounded-full text-xs font-semibold px-4">
              Documentos
            </TabsTrigger>
            <TabsTrigger value="comentarios" className="rounded-full text-xs font-semibold px-4">
              Comentarios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trazabilidad" className="space-y-6">
            <Card className="rounded-2xl border-border bg-surface p-6 sm:p-8 shadow-xs">
              <div className="relative pl-24 sm:pl-32 space-y-10 before:absolute before:left-24 sm:before:left-32 before:top-4 before:bottom-4 before:w-[2px] before:bg-border before:-translate-x-1/2">
                {[
                  {
                    date: "16 sep 2026",
                    time: "10:32",
                    icon: Send,
                    iconBg: "bg-primary text-primary-foreground",
                    title: "Solicitud enviada",
                    responsable: "María López (Ministerio de Gobierno)",
                    estado: "Borrador → En revisión",
                    observacion: "Solicitud enviada para validación.",
                  },
                  {
                    date: "16 sep 2026",
                    time: "11:45",
                    icon: FileText,
                    iconBg: "bg-muted-foreground/30 text-foreground",
                    title: "Solicitud revisada",
                    responsable: "Carlos Núñez (DINARP)",
                    estado: "En revisión → Requiere ajustes",
                    observacion: "Se solicita ampliar la justificación del proyecto.",
                  },
                  {
                    date: "15 sep 2026",
                    time: "09:20",
                    icon: PenLine,
                    iconBg: "bg-primary text-primary-foreground",
                    title: "Ajustes realizados",
                    responsable: "María López (Ministerio de Gobierno)",
                    estado: "Requiere ajustes → En revisión",
                    observacion: "Se adjunta información complementaria.",
                    attachment: { name: "Justificación_actualizada.pdf", size: "245 KB" },
                  },
                  {
                    date: "10 sep 2026",
                    time: "14:10",
                    icon: Plus,
                    iconBg: "bg-muted-foreground/30 text-foreground",
                    title: "Solicitud creada",
                    responsable: "María López (Ministerio de Gobierno)",
                    estado: "- → Borrador",
                    observacion: "Creación inicial de la solicitud.",
                  },
                ].map((event, index) => (
                  <div key={index} className="relative">
                    <div className="absolute -left-24 sm:-left-32 top-1 text-right w-20 sm:w-28 pr-4">
                      <span className="text-xs font-bold text-foreground block leading-none">{event.date}</span>
                      <span className="text-[11px] text-muted-foreground font-mono">{event.time}</span>
                    </div>

                    <div className={`absolute -left-4 top-0.5 size-8 rounded-full flex items-center justify-center shadow-xs ring-4 ring-background ${event.iconBg}`}>
                      <event.icon className="size-4" />
                    </div>

                    <div className="pl-6 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1">
                          <h3 className="text-sm font-bold text-foreground">{event.title}</h3>
                          <p className="text-xs text-muted-foreground">
                            <strong className="text-foreground font-medium">Responsable:</strong> {event.responsable}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <strong className="text-foreground font-medium">Estado:</strong> {event.estado}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <strong className="text-foreground font-medium">Observación:</strong> {event.observacion}
                          </p>
                        </div>

                        {event.attachment && (
                          <div className="flex items-center gap-2 p-2.5 px-3 rounded-xl border border-border bg-background hover:bg-muted/30 transition-colors shrink-0">
                            <Paperclip className="size-3.5 text-muted-foreground" />
                            <div className="flex flex-col">
                              <span className="text-xs font-semibold text-foreground">{event.attachment.name}</span>
                              <span className="text-[10px] text-muted-foreground">{event.attachment.size}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* ── Tab Content: Información General ── */}
          <TabsContent value="informacion" className="space-y-6">
            <Card className="rounded-2xl border-border bg-surface p-6 shadow-xs">
              <DetailList
                columns={2}
                items={[
                  {
                    label: "Código del proyecto",
                    value: <span className="font-mono font-bold text-foreground">SOL-2026-001</span>,
                  },
                  {
                    label: "Nombre del proyecto",
                    value: "Proyecto Identidad Digital",
                  },
                  {
                    label: "Tipo de interoperabilidad",
                    value: "Servicio Web en línea (API REST JSON)",
                  },
                  {
                    label: "Frecuencia estimada",
                    value: "Transaccional en tiempo real (200 req/min)",
                  },
                  {
                    label: "Base legal y justificación",
                    value: "Decreto Ejecutivo Nro. 452 sobre modernización y simplificación de trámites ciudadanos en el marco del Gobierno Digital.",
                  },
                  {
                    label: "Clasificación de seguridad",
                    value: "Confidencial / Datos personales regulados",
                  },
                ]}
              />
            </Card>
          </TabsContent>

          {/* ── Tab Content: Documentos ── */}
          <TabsContent value="documentos" className="space-y-6">
            <Card className="rounded-2xl border-border bg-surface p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-background">
                <div className="flex items-center gap-3">
                  <FileText className="size-5 text-muted-foreground shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-foreground">Justificación_actualizada.pdf</span>
                    <span className="text-[10px] text-muted-foreground">PDF · 245 KB · Cargado el 15 sep 2026</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-foreground">
                  <Download className="size-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-background">
                <div className="flex items-center gap-3">
                  <FileText className="size-5 text-muted-foreground shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-foreground">Solicitud_Oficial_MIDUVI.pdf</span>
                    <span className="text-[10px] text-muted-foreground">PDF · 1.2 MB · Cargado el 10 sep 2026</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-foreground">
                  <Download className="size-4" />
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* ── Tab Content: Comentarios ── */}
          <TabsContent value="comentarios" className="space-y-6">
            <Card className="rounded-2xl border-border bg-surface flex flex-col overflow-hidden shadow-xs">
              
              <div className="flex-1 p-6 space-y-6 bg-background/30">
                {comentariosList.map((c) => (
                  <div key={c.id} className="flex gap-4">
                    <div className="size-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <span className="text-primary font-bold text-xs">{c.autor.charAt(0)}</span>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground text-sm">{c.autor}</span>
                        <span className="text-[11px] text-muted-foreground">{c.fecha}</span>
                      </div>
                      <div className="p-4 rounded-2xl rounded-tl-none border border-border bg-surface shadow-sm inline-block max-w-[90%]">
                        <p className="text-sm text-foreground leading-relaxed">{c.texto}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 sm:p-6 border-t border-border bg-surface">
                <form onSubmit={handleAddComentario} className="flex flex-col gap-3">
                  <textarea
                    rows={3}
                    placeholder="Escribe un comentario o nota de seguimiento..."
                    value={comentarioTexto}
                    onChange={(e) => setComentarioTexto(e.target.value)}
                    className="w-full resize-none rounded-2xl border border-border bg-background p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                  />
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      disabled={!comentarioTexto.trim()}
                      className="rounded-full shadow-xs px-5 h-10 gap-2"
                    >
                      <Send className="size-4" />
                      <span>Enviar comentario</span>
                    </Button>
                  </div>
                </form>
              </div>

            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </WireframeDashboardLayout>
  );
}

