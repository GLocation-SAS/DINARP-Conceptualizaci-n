import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Layers,
  LayoutGrid,
  CheckCircle2,
  FileCode2,
  Palette,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export default function WireframesPage() {
  return (
    <main className="w-full px-4 sm:px-8 lg:px-12 py-10 flex flex-col gap-8">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border pb-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Badge tone="neutral" appearance="soft" size="sm">
              Entorno Neutral
            </Badge>
            <Badge tone="neutral" appearance="soft" size="sm">
              <CheckCircle2 className="size-3 mr-1" />
              Ruta Activa
            </Badge>
          </div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Wireframes &amp; Prototipos
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Espacio de trabajo aislado con tema neutral (<code>data-theme=&quot;wireframe&quot;</code>)
            para maquetación de flujos y estructuras UX sin interferencia de colores de marca.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm">
            <FileCode2 className="size-4 mr-1.5" />
            Documentación
          </Button>
          <Button variant="primary" size="sm">
            <Layers className="size-4 mr-1.5" />
            Nuevo Wireframe
          </Button>
        </div>
      </header>

      {/* Grid Overview */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card size="sm" className="bg-card border-border">
          <CardHeader>
            <div className="size-10 rounded-lg bg-muted flex items-center justify-center text-foreground mb-1">
              <Palette className="size-5" />
            </div>
            <CardTitle>Tema Monocromático</CardTitle>
            <CardDescription>
              Variables semánticas mapeadas a la escala neutral para centrar el diseño en jerarquía y contenido.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card size="sm" className="bg-card border-border">
          <CardHeader>
            <div className="size-10 rounded-lg bg-muted flex items-center justify-center text-foreground mb-1">
              <ShieldCheck className="size-5" />
            </div>
            <CardTitle>Aislamiento Total</CardTitle>
            <CardDescription>
              No altera las rutas productivas ni las pantallas del kit oficial de DINARP.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card size="sm" className="bg-card border-border">
          <CardHeader>
            <div className="size-10 rounded-lg bg-muted flex items-center justify-center text-foreground mb-1">
              <LayoutGrid className="size-5" />
            </div>
            <CardTitle>Tokens Semánticos</CardTitle>
            <CardDescription>
              Utiliza exclusivamente clases semánticas del Design System sin colores hexadecimales hardcodeados.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      {/* Auth Wireframes Flow */}
      <section className="flex flex-col gap-4">
        <h2 className="font-heading text-lg font-bold text-foreground">
          Flujo de Autenticación & Dashboard Wireframe
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/wireframes/login"
            className="group flex flex-col p-5 rounded-2xl border border-border bg-surface hover:border-foreground/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge tone="neutral" appearance="soft" size="sm">Paso 1</Badge>
              <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Acceso al sistema</h3>
            <p className="text-xs text-muted-foreground mt-1">/wireframes/login</p>
          </Link>

          <Link
            href="/wireframes/dashboard"
            className="group flex flex-col p-5 rounded-2xl border border-border bg-surface hover:border-foreground/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge tone="neutral" appearance="soft" size="sm">Paso 2</Badge>
              <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Dashboard Principal</h3>
            <p className="text-xs text-muted-foreground mt-1">/wireframes/dashboard</p>
          </Link>

          <Link
            href="/wireframes/solicitudes"
            className="group flex flex-col p-5 rounded-2xl border border-border bg-surface hover:border-foreground/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge tone="neutral" appearance="soft" size="sm">Paso 3</Badge>
              <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Gestión de Solicitudes</h3>
            <p className="text-xs text-muted-foreground mt-1">/wireframes/solicitudes</p>
          </Link>

          <Link
            href="/wireframes/solicitudes/detalle"
            className="group flex flex-col p-5 rounded-2xl border border-border bg-surface hover:border-foreground/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge tone="neutral" appearance="soft" size="sm">Paso 3.1</Badge>
              <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Detalle de Solicitud</h3>
            <p className="text-xs text-muted-foreground mt-1">/wireframes/solicitudes/detalle</p>
          </Link>

          <Link
            href="/wireframes/solicitudes/seguimiento"
            className="group flex flex-col p-5 rounded-2xl border border-border bg-surface hover:border-foreground/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge tone="neutral" appearance="soft" size="sm">Paso 3.2</Badge>
              <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Seguimiento de Solicitud</h3>
            <p className="text-xs text-muted-foreground mt-1">/wireframes/solicitudes/seguimiento</p>
          </Link>

          <Link
            href="/wireframes/aprobaciones"
            className="group flex flex-col p-5 rounded-2xl border border-border bg-surface hover:border-foreground/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge tone="neutral" appearance="soft" size="sm">Paso 4</Badge>
              <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Aprobaciones y Permisos</h3>
            <p className="text-xs text-muted-foreground mt-1">/wireframes/aprobaciones</p>
          </Link>

          <Link
            href="/wireframes/aprobaciones/SOL-024"
            className="group flex flex-col p-5 rounded-2xl border border-border bg-surface hover:border-foreground/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge tone="neutral" appearance="soft" size="sm">Paso 4.1</Badge>
              <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Revisión de Solicitud (SOL-024)</h3>
            <p className="text-xs text-muted-foreground mt-1">/wireframes/aprobaciones/SOL-024</p>
          </Link>

          <Link
            href="/wireframes/aprobaciones/SOL-024/seguimiento"
            className="group flex flex-col p-5 rounded-2xl border border-border bg-surface hover:border-foreground/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge tone="neutral" appearance="soft" size="sm">Paso 4.2</Badge>
              <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Seguimiento y Permiso</h3>
            <p className="text-xs text-muted-foreground mt-1">/wireframes/aprobaciones/SOL-024/seguimiento</p>
          </Link>

          <Link
            href="/wireframes/catalogo-fuentes"
            className="group flex flex-col p-5 rounded-2xl border border-border bg-surface hover:border-foreground/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge tone="neutral" appearance="soft" size="sm">Paso 5</Badge>
              <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Catálogo de Fuentes y Datos</h3>
            <p className="text-xs text-muted-foreground mt-1">/wireframes/catalogo-fuentes</p>
          </Link>

          <Link
            href="/wireframes/catalogo-fuentes/registro-civil"
            className="group flex flex-col p-5 rounded-2xl border border-border bg-surface hover:border-foreground/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge tone="neutral" appearance="soft" size="sm">Paso 5.1</Badge>
              <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Detalle de Fuente (Registro Civil)</h3>
            <p className="text-xs text-muted-foreground mt-1">/wireframes/catalogo-fuentes/registro-civil</p>
          </Link>

          <Link
            href="/wireframes/catalogo-fuentes/registro-civil/datos-identidad"
            className="group flex flex-col p-5 rounded-2xl border border-border bg-surface hover:border-foreground/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge tone="neutral" appearance="soft" size="sm">Paso 5.2</Badge>
              <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Detalle de Servicio y Datos</h3>
            <p className="text-xs text-muted-foreground mt-1">/wireframes/catalogo-fuentes/registro-civil/datos-identidad</p>
          </Link>

          <Link
            href="/wireframes/solicitudes/nueva"
            className="group flex flex-col p-5 rounded-2xl border border-border bg-surface hover:border-foreground/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge tone="neutral" appearance="soft" size="sm">Paso 3.3</Badge>
              <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Nueva Solicitud</h3>
            <p className="text-xs text-muted-foreground mt-1">/wireframes/solicitudes/nueva</p>
          </Link>

          <Link
            href="/wireframes/interoperabilidad/servicios"
            className="group flex flex-col p-5 rounded-2xl border border-border bg-surface hover:border-foreground/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge tone="neutral" appearance="soft" size="sm">Paso 6</Badge>
              <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Interoperabilidad / Servicios</h3>
            <p className="text-xs text-muted-foreground mt-1">/wireframes/interoperabilidad/servicios</p>
          </Link>

          <Link
            href="/wireframes/interoperabilidad/servicios/consulta-identidad"
            className="group flex flex-col p-5 rounded-2xl border border-border bg-surface hover:border-foreground/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge tone="neutral" appearance="soft" size="sm">Paso 6.1</Badge>
              <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Detalle del Servicio</h3>
            <p className="text-xs text-muted-foreground mt-1">/wireframes/interoperabilidad/servicios/consulta-identidad</p>
          </Link>

          <Link
            href="/wireframes/interoperabilidad/servicios/consulta-identidad/historial"
            className="group flex flex-col p-5 rounded-2xl border border-border bg-surface hover:border-foreground/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge tone="neutral" appearance="soft" size="sm">Paso 6.2</Badge>
              <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Historial / Trazabilidad</h3>
            <p className="text-xs text-muted-foreground mt-1">/wireframes/interoperabilidad/servicios/consulta-identidad/historial</p>
          </Link>

          <Link
            href="/wireframes/interoperabilidad/servicios/consulta-identidad/configuracion"
            className="group flex flex-col p-5 rounded-2xl border border-border bg-surface hover:border-foreground/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge tone="neutral" appearance="soft" size="sm">Paso 6.3</Badge>
              <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Configuración del Servicio</h3>
            <p className="text-xs text-muted-foreground mt-1">/wireframes/interoperabilidad/servicios/consulta-identidad/configuracion</p>
          </Link>

          <Link
            href="/wireframes/intercambios-masivos"
            className="group flex flex-col p-5 rounded-2xl border border-border bg-surface hover:border-foreground/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge tone="neutral" appearance="soft" size="sm">Paso 7</Badge>
              <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Intercambios Masivos / Excepcionalidades</h3>
            <p className="text-xs text-muted-foreground mt-1">/wireframes/intercambios-masivos</p>
          </Link>

          <Link
            href="/wireframes/intercambios-masivos/nueva"
            className="group flex flex-col p-5 rounded-2xl border border-border bg-surface hover:border-foreground/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge tone="neutral" appearance="soft" size="sm">Paso 7.1</Badge>
              <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Nueva Solicitud Masiva (Stepper)</h3>
            <p className="text-xs text-muted-foreground mt-1">/wireframes/intercambios-masivos/nueva</p>
          </Link>

          <Link
            href="/wireframes/intercambios-masivos/BATCH-001"
            className="group flex flex-col p-5 rounded-2xl border border-border bg-surface hover:border-foreground/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge tone="neutral" appearance="soft" size="sm">Paso 7.2</Badge>
              <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Detalle de Intercambio (BATCH-001)</h3>
            <p className="text-xs text-muted-foreground mt-1">/wireframes/intercambios-masivos/BATCH-001</p>
          </Link>

          <Link
            href="/wireframes/seguimiento"
            className="group flex flex-col p-5 rounded-2xl border border-border bg-surface hover:border-foreground/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge tone="neutral" appearance="soft" size="sm">Paso 8</Badge>
              <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Seguimiento y Trazabilidad</h3>
            <p className="text-xs text-muted-foreground mt-1">/wireframes/seguimiento</p>
          </Link>

          <Link
            href="/wireframes/seguimiento/SOL-2026-001"
            className="group flex flex-col p-5 rounded-2xl border border-border bg-surface hover:border-foreground/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge tone="neutral" appearance="soft" size="sm">Paso 8.1</Badge>
              <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Detalle de Trazabilidad (SOL-2026-001)</h3>
            <p className="text-xs text-muted-foreground mt-1">/wireframes/seguimiento/SOL-2026-001</p>
          </Link>

          <Link
            href="/wireframes/tarifario"
            className="group flex flex-col p-5 rounded-2xl border border-border bg-surface hover:border-foreground/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge tone="neutral" appearance="soft" size="sm">Paso 9</Badge>
              <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Tarifario y Cotización</h3>
            <p className="text-xs text-muted-foreground mt-1">/wireframes/tarifario</p>
          </Link>

          <Link
            href="/wireframes/usuarios"
            className="group flex flex-col p-5 rounded-2xl border border-border bg-surface hover:border-foreground/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge tone="neutral" appearance="soft" size="sm">Paso 10</Badge>
              <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Módulo de Usuarios</h3>
            <p className="text-xs text-muted-foreground mt-1">/wireframes/usuarios</p>
          </Link>

          <Link
            href="/wireframes/usuarios/nuevo"
            className="group flex flex-col p-5 rounded-2xl border border-border bg-surface hover:border-foreground/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge tone="neutral" appearance="soft" size="sm">Paso 10.1</Badge>
              <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Crear Usuario</h3>
            <p className="text-xs text-muted-foreground mt-1">/wireframes/usuarios/nuevo</p>
          </Link>

          <Link
            href="/wireframes/usuarios/USR-001"
            className="group flex flex-col p-5 rounded-2xl border border-border bg-surface hover:border-foreground/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge tone="neutral" appearance="soft" size="sm">Paso 10.2</Badge>
              <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Detalle de Usuario (USR-001)</h3>
            <p className="text-xs text-muted-foreground mt-1">/wireframes/usuarios/USR-001</p>
          </Link>

          <Link
            href="/wireframes/usuarios/USR-001/editar"
            className="group flex flex-col p-5 rounded-2xl border border-border bg-surface hover:border-foreground/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge tone="neutral" appearance="soft" size="sm">Paso 10.3</Badge>
              <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Editar Usuario (USR-001)</h3>
            <p className="text-xs text-muted-foreground mt-1">/wireframes/usuarios/USR-001/editar</p>
          </Link>

          <Link
            href="/wireframes/facturacion"
            className="group flex flex-col p-5 rounded-2xl border border-border bg-surface hover:border-foreground/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge tone="neutral" appearance="soft" size="sm">Paso 11</Badge>
              <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Facturación</h3>
            <p className="text-xs text-muted-foreground mt-1">/wireframes/facturacion</p>
          </Link>

          <Link
            href="/wireframes/facturacion/F-2026-00125"
            className="group flex flex-col p-5 rounded-2xl border border-border bg-surface hover:border-foreground/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge tone="neutral" appearance="soft" size="sm">Paso 11.1</Badge>
              <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Detalle de Factura (F-2026-00125)</h3>
            <p className="text-xs text-muted-foreground mt-1">/wireframes/facturacion/F-2026-00125</p>
          </Link>

          <Link
            href="/wireframes/roles"
            className="group flex flex-col p-5 rounded-2xl border border-border bg-surface hover:border-foreground/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge tone="neutral" appearance="soft" size="sm">Paso 12</Badge>
              <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Listado de Roles</h3>
            <p className="text-xs text-muted-foreground mt-1">/wireframes/roles</p>
          </Link>

          <Link
            href="/wireframes/roles/nuevo"
            className="group flex flex-col p-5 rounded-2xl border border-border bg-surface hover:border-foreground/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge tone="neutral" appearance="soft" size="sm">Paso 12.1</Badge>
              <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Crear Rol (Formulario + Matriz)</h3>
            <p className="text-xs text-muted-foreground mt-1">/wireframes/roles/nuevo</p>
          </Link>

          <Link
            href="/wireframes/roles/ROL-002"
            className="group flex flex-col p-5 rounded-2xl border border-border bg-surface hover:border-foreground/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge tone="neutral" appearance="soft" size="sm">Paso 12.2</Badge>
              <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Detalle de Rol (ROL-002)</h3>
            <p className="text-xs text-muted-foreground mt-1">/wireframes/roles/ROL-002</p>
          </Link>

          <Link
            href="/wireframes/roles/ROL-002/editar"
            className="group flex flex-col p-5 rounded-2xl border border-border bg-surface hover:border-foreground/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge tone="neutral" appearance="soft" size="sm">Paso 12.3</Badge>
              <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Editar Rol (ROL-002)</h3>
            <p className="text-xs text-muted-foreground mt-1">/wireframes/roles/ROL-002/editar</p>
          </Link>

          <Link
            href="/wireframes/reportes"
            className="group flex flex-col p-5 rounded-2xl border border-border bg-surface hover:border-foreground/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge tone="neutral" appearance="soft" size="sm">Paso 13</Badge>
              <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Reportes e Indicadores</h3>
            <p className="text-xs text-muted-foreground mt-1">/wireframes/reportes</p>
          </Link>

          <Link
            href="/wireframes/recuperar-acceso"
            className="group flex flex-col p-5 rounded-2xl border border-border bg-surface hover:border-foreground/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge tone="neutral" appearance="soft" size="sm">Flujo Aux</Badge>
              <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Recuperar acceso</h3>
            <p className="text-xs text-muted-foreground mt-1">/wireframes/recuperar-acceso</p>
          </Link>

          <Link
            href="/wireframes/restablecer-contrasena"
            className="group flex flex-col p-5 rounded-2xl border border-border bg-surface hover:border-foreground/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge tone="neutral" appearance="soft" size="sm">Flujo Aux</Badge>
              <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Restablecer contraseña</h3>
            <p className="text-xs text-muted-foreground mt-1">/wireframes/restablecer-contrasena</p>
          </Link>

          <Link
            href="/wireframes/construccion"
            className="group flex flex-col p-5 rounded-2xl border border-border bg-surface hover:border-foreground/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge tone="neutral" appearance="soft" size="sm">Sistema</Badge>
              <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">En Construcción</h3>
            <p className="text-xs text-muted-foreground mt-1">/wireframes/construccion</p>
          </Link>

          <Link
            href="/wireframes/404"
            className="group flex flex-col p-5 rounded-2xl border border-border bg-surface hover:border-foreground/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge tone="neutral" appearance="soft" size="sm">Sistema</Badge>
              <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-heading font-bold text-base text-foreground">Error 404 No Encontrado</h3>
            <p className="text-xs text-muted-foreground mt-1">/wireframes/404</p>
          </Link>
        </div>
      </section>

      {/* Status Panel */}
      <section className="rounded-2xl border border-border bg-surface p-6 flex flex-col gap-4">
        <h2 className="font-heading text-lg font-bold text-foreground">
          Confirmación de Estado
        </h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-surface-subtle border border-border">
          <div className="flex items-center gap-3">
            <span className="relative flex size-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground opacity-75" />
              <span className="relative inline-flex size-3 rounded-full bg-foreground" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Ruta <code>/wireframes</code> configurada y operativa
              </p>
              <p className="text-xs text-muted-foreground">
                Hereda <code>data-theme=&quot;wireframe&quot;</code> en todas las subrutas hijas.
              </p>
            </div>
          </div>
          <Badge tone="neutral" appearance="outline" size="sm">
            src/app/wireframes/
          </Badge>
        </div>
      </section>
    </main>
  );
}

