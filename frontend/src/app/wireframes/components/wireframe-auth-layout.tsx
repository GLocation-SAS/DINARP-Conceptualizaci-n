"use client";

import React from "react";
import {
  Building2,
  FileText,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface WireframeAuthLayoutProps {
  children: React.ReactNode;
}

export function WireframeAuthLayout({ children }: WireframeAuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4 sm:p-6 lg:p-10 xl:p-12 relative">
      <div className="w-full max-w-[1500px] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center">

        {/* ══════════════════════════════════════════════════
            COLUMNA IZQUIERDA: Panel Wireframe con UI Kit
           ══════════════════════════════════════════════════ */}
        <Card className="lg:col-span-7 xl:col-span-7 2xl:col-span-8 relative flex flex-col justify-between overflow-hidden rounded-3xl border-border bg-surface text-foreground shadow-sm min-h-[560px] lg:min-h-[640px] p-0" disableHover>
          <div className="p-8 sm:p-12 lg:p-14 flex flex-col justify-between h-full w-full gap-8">

            {/* Parte Superior: Encabezado y Descripción */}
            <div className="flex flex-col items-start text-left max-w-2xl">
              <div className="w-9 h-1 bg-foreground rounded-full mb-6" />

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-foreground leading-[1.15] mb-4">
                La información pública, <br className="hidden sm:inline" />
                conectada con propósito.
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground font-normal leading-relaxed">
                Solicita datos de otras instituciones, gestiona autorizaciones y sigue cada intercambio desde un solo lugar.
              </p>
            </div>

            {/* Parte Media: Secuencia de 4 Tarjetas UI Kit Conectadas (2 Líneas Uniformes) */}
            <div className="relative my-4 sm:my-6 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 relative">

                {/* Línea conectora horizontal para escritorio */}
                <div className="hidden xl:block absolute top-[40px] left-[12%] right-[12%] h-[2px] bg-border z-0" />
                {/* Línea conectora horizontal centrada en la mitad de las tarjetas */}
                <div className="hidden xl:block absolute top-1/2 -translate-y-1/2 left-[10%] right-[10%] h-[2px] bg-border z-0" />

                {/* Tarjeta 1: Entidad solicitante */}
                <Card size="sm" className="relative z-10 rounded-2xl border-border bg-background transition-transform hover:-translate-y-0.5" disableHover>
                  <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                    <div className="size-11 rounded-2xl bg-muted border border-border flex items-center justify-center text-foreground shrink-0">
                      <Building2 className="size-5" />
                    </div>
                    <div className="flex flex-col items-center w-full">
                      <p className="text-sm font-bold text-foreground text-center leading-snug">
                        Entidad <br /> solicitante
                      </p>
                      <div className="flex flex-col items-center gap-1.5 mt-3">
                        <div className="h-1.5 w-16 bg-muted-foreground/30 rounded-full" />
                        <div className="h-1.5 w-10 bg-muted-foreground/15 rounded-full" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tarjeta 2: Datos requeridos */}
                <Card size="sm" className="relative z-10 rounded-2xl border-border bg-background transition-transform hover:-translate-y-0.5" disableHover>
                  <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                    <div className="size-11 rounded-2xl bg-muted border border-border flex items-center justify-center text-foreground shrink-0">
                      <FileText className="size-5" />
                    </div>
                    <div className="flex flex-col items-center w-full">
                      <p className="text-sm font-bold text-foreground text-center leading-snug">
                        Datos <br /> requeridos
                      </p>
                      <div className="flex flex-col items-center gap-1.5 mt-3">
                        <div className="h-1.5 w-16 bg-muted-foreground/30 rounded-full" />
                        <div className="h-1.5 w-10 bg-muted-foreground/15 rounded-full" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tarjeta 3: Revisión DINARP */}
                <Card size="sm" className="relative z-10 rounded-2xl border-border bg-background transition-transform hover:-translate-y-0.5" disableHover>
                  <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                    <div className="size-11 rounded-2xl bg-muted border border-border flex items-center justify-center text-foreground shrink-0">
                      <ShieldCheck className="size-5" />
                    </div>
                    <div className="flex flex-col items-center w-full">
                      <p className="text-sm font-bold text-foreground text-center leading-snug">
                        Revisión <br /> DINARP
                      </p>
                      <div className="flex flex-col items-center gap-1.5 mt-3">
                        <div className="h-1.5 w-16 bg-muted-foreground/30 rounded-full" />
                        <div className="h-1.5 w-10 bg-muted-foreground/15 rounded-full" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tarjeta 4: Intercambio autorizado */}
                <Card size="sm" className="relative z-10 rounded-2xl border-border bg-background transition-transform hover:-translate-y-0.5 shadow-sm" disableHover>
                  <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                    <div className="size-11 rounded-2xl bg-muted border border-border flex items-center justify-center text-foreground shrink-0">
                      <CheckCircle2 className="size-5" />
                    </div>
                    <div className="flex flex-col items-center w-full">
                      <p className="text-sm font-bold text-foreground text-center leading-snug">
                        Intercambio <br /> autorizado
                      </p>
                      <div className="flex flex-col items-center gap-1.5 mt-3">
                        <div className="h-1.5 w-16 bg-muted-foreground/30 rounded-full" />
                        <div className="h-1.5 w-10 bg-muted-foreground/15 rounded-full" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>
            </div>

            {/* Parte Inferior: Mensaje institucional */}
            <div className="pt-4 flex items-center justify-between border-t border-border">
              <div>
                <p className="text-[11px] sm:text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                  Instituciones que trabajan por un Ecuador más conectado
                </p>
                <div className="w-8 h-0.5 bg-foreground mt-2" />
              </div>
            </div>

          </div>
        </Card>

        {/* ══════════════════════════════════════════════════
            COLUMNA DERECHA: Card dinámico (Slot)
           ══════════════════════════════════════════════════ */}
        <section className="lg:col-span-5 xl:col-span-5 2xl:col-span-4 w-full flex justify-center">
          <Card className="w-full max-w-[480px] sm:max-w-[500px] rounded-3xl border-border bg-card p-6 sm:p-9 shadow-sm flex flex-col" disableHover>
            {children}
          </Card>
        </section>
      </div>
    </div>
  );
}
