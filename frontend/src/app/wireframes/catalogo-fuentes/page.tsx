"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  Database,
  Search,
  ChevronDown,
  ArrowRight,
  Layers,
  ShieldCheck,
  Server,
  FileText,
  Activity,
  HeartPulse,
  GraduationCap,
  Car,
  Landmark,
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
  InputGroup,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { WireframeDashboardLayout } from "../components/wireframe-dashboard-layout";

interface InstitucionFuente {
  id: string;
  nombre: string;
  siglas: string;
  nombreCompleto: string;
  categoria: string;
  serviciosCount: number;
  descripcion: string;
  href: string;
  icon: React.ElementType;
}

const INSTITUCIONES: InstitucionFuente[] = [
  {
    id: "registro-civil",
    nombre: "Registro Civil",
    siglas: "DIGERCIC",
    nombreCompleto: "Dirección General de Registro Civil, Identificación y Cedulación",
    categoria: "Identificación y Registro",
    serviciosCount: 5,
    descripcion:
      "Custodia oficial de registros biográficos, partidas de nacimiento, estado civil, defunción y cédula nacional.",
    href: "/wireframes/catalogo-fuentes/registro-civil",
    icon: Building2,
  },
  {
    id: "sri",
    nombre: "SRI",
    siglas: "SRI",
    nombreCompleto: "Servicio de Rentas Internas",
    categoria: "Tributario y Finanzas",
    serviciosCount: 8,
    descripcion:
      "Registro Único de Contribuyentes (RUC), estado tributario, facturación electrónica y cumplimiento fiscal.",
    href: "/wireframes/catalogo-fuentes/registro-civil",
    icon: Landmark,
  },
  {
    id: "mineduc",
    nombre: "Ministerio de Educación",
    siglas: "MINEDUC",
    nombreCompleto: "Ministerio de Educación del Ecuador",
    categoria: "Educación",
    serviciosCount: 4,
    descripcion:
      "Registro de títulos de bachiller, matrícula estudiantil, asignación de instituciones y validación docente.",
    href: "/wireframes/catalogo-fuentes/registro-civil",
    icon: GraduationCap,
  },
  {
    id: "msp",
    nombre: "Ministerio de Salud Pública",
    siglas: "MSP",
    nombreCompleto: "Ministerio de Salud Pública",
    categoria: "Salud",
    serviciosCount: 6,
    descripcion:
      "Historial de vacunación, registro de profesionales de la salud, permisos sanitarios y estadísticas epidemiológicas.",
    href: "/wireframes/catalogo-fuentes/registro-civil",
    icon: HeartPulse,
  },
  {
    id: "iess",
    nombre: "IESS",
    siglas: "IESS",
    nombreCompleto: "Instituto Ecuatoriano de Seguridad Social",
    categoria: "Seguridad Social",
    serviciosCount: 7,
    descripcion:
      "Afiliación laboral, aportaciones, historial de cesantía, préstamos quirografarios y certificado de no adeudar.",
    href: "/wireframes/catalogo-fuentes/registro-civil",
    icon: ShieldCheck,
  },
  {
    id: "ant",
    nombre: "ANT",
    siglas: "ANT",
    nombreCompleto: "Agencia Nacional de Tránsito",
    categoria: "Tránsito y Transporte",
    serviciosCount: 5,
    descripcion:
      "Registro vehicular nacional, licencias de conducir, puntos de licencia, bloqueos y citaciones de tránsito.",
    href: "/wireframes/catalogo-fuentes/registro-civil",
    icon: Car,
  },
];

export default function WireframeCatalogoFuentesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState("Todas");

  const filteredInstituciones = useMemo(() => {
    return INSTITUCIONES.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.siglas.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nombreCompleto.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.descripcion.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        selectedCategoria === "Todas" || item.categoria === selectedCategoria;

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategoria]);

  return (
    <WireframeDashboardLayout activeMenu="catalogo-fuentes">
      <main className="relative p-4 sm:p-6 lg:p-8 w-full space-y-6 sm:space-y-8">
        {/* Background subtle effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-muted/20 to-transparent pointer-events-none -z-10 blur-3xl opacity-60" />

        {/* ── 1. Breadcrumb ── */}
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
              <BreadcrumbPage className="font-semibold text-foreground">
                Catálogo de fuentes y datos
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* ── 2. Header Title & Description ── */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge tone="neutral" appearance="soft" size="sm" className="font-semibold">
              Interoperabilidad Gubernamental
            </Badge>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight text-foreground">
            Catálogo de fuentes y datos
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-3xl leading-relaxed font-normal">
            Explora las instituciones del Estado ecuatoriano disponibles para interoperabilidad, consulta sus catálogos de servicios y campos de datos disponibles para integración.
          </p>
        </div>

        {/* ── 3. Buscador & Filtro por Categoría ── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1 min-w-[240px]">
            <InputGroup
              size="default"
              leftIcon={<Search className="size-4 text-muted-foreground" />}
              className="bg-surface h-11 rounded-xl border-border/80"
            >
              <InputGroupInput
                placeholder="Buscar por institución, sigla o descripción de datos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs sm:text-sm"
              />
            </InputGroup>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-11 px-4 py-1.5 flex flex-col items-start justify-center bg-surface border-border/80 min-w-[170px] text-left shrink-0"
              >
                <span className="text-[10px] font-medium text-muted-foreground leading-none">Categoría</span>
                <div className="w-full flex items-center justify-between gap-1 mt-0.5">
                  <span className="text-xs font-semibold text-foreground truncate">{selectedCategoria}</span>
                  <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="text-xs">Filtrar por categoría</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={selectedCategoria} onValueChange={setSelectedCategoria}>
                <DropdownMenuRadioItem value="Todas">Todas las categorías</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Identificación y Registro">Identificación y Registro</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Tributario y Finanzas">Tributario y Finanzas</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Educación">Educación</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Salud">Salud</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Seguridad Social">Seguridad Social</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Tránsito y Transporte">Tránsito y Transporte</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* ── 4. Grid de Instituciones Fuente ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredInstituciones.map((inst) => {
            const Icon = inst.icon;
            return (
              <Link key={inst.id} href={inst.href} className="group flex flex-col h-full">
                <Card className="flex-1 border-border bg-surface hover:border-foreground/30 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                  <CardHeader className="p-6 pb-3 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="size-12 rounded-2xl bg-muted/60 border border-border/60 flex items-center justify-center text-foreground group-hover:scale-105 transition-transform">
                        <Icon className="size-6 stroke-[1.75]" />
                      </div>
                      <Badge
                        tone="neutral"
                        appearance="soft"
                        size="sm"
                        className="font-medium text-[11px] gap-1 shrink-0"
                      >
                        <Layers className="size-3" />
                        <span>{inst.serviciosCount} servicios</span>
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                        {inst.categoria}
                      </span>
                      <CardTitle className="font-heading font-bold text-lg text-foreground group-hover:text-foreground">
                        {inst.nombre}
                      </CardTitle>
                      <p className="text-[11px] font-medium text-muted-foreground leading-tight">
                        {inst.nombreCompleto}
                      </p>
                    </div>

                    <CardDescription className="text-xs text-muted-foreground leading-relaxed pt-1">
                      {inst.descripcion}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-6 pt-3 mt-auto border-t border-border/50 flex items-center justify-between text-xs font-semibold text-foreground">
                    <span className="group-hover:underline underline-offset-4">Explorar catálogo</span>
                    <Button
                      variant="outline"
                      size="icon-xs"
                      className="rounded-full border-border bg-background group-hover:bg-foreground group-hover:text-background group-hover:translate-x-0.5 transition-all"
                      aria-label={`Ver catálogo de ${inst.nombre}`}
                    >
                      <ArrowRight className="size-3.5" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>
    </WireframeDashboardLayout>
  );
}

