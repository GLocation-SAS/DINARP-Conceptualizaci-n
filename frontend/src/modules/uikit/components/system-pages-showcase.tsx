"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Hammer, Layout, FileQuestion, ArrowUpRight } from "lucide-react";
import { SubSection } from "./sub-section";
import { LoginGeoportalShowcase } from "./login-geoportal-showcase";

export function SystemPagesShowcase({ registerSection }: { registerSection?: (id: string, el: HTMLElement | null) => void }) {
  return (
    <div className="w-full flex flex-col gap-8 md:gap-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Login UI Kit */}
        <SubSection
          id="login-uikit"
          title="Pantalla de Login"
          description="Pantalla de autenticación y acceso al sistema institucional."
          icon={Layout}
          registerSection={registerSection}
        >
          <div className="flex gap-4 items-center flex-wrap">
            <Button variant="neutral" asChild>
              <Link href="/wireframes2/login" target="_blank">
                <Layout className="size-4 mr-2" />
                Probar Pantalla Login
                <ArrowUpRight className="size-3.5 ml-1.5 opacity-60" />
              </Link>
            </Button>
          </div>
        </SubSection>

        <SubSection
          id="404-page"
          title="Pantalla de Estado 404"
          description="Pantalla que informa al usuario que la página solicitada no está disponible y le ofrece una forma clara de regresar a una sección válida del sistema."
          icon={FileQuestion}
          registerSection={registerSection}
        >
          <div className="flex gap-4 items-center flex-wrap">
            <Button variant="neutral" asChild>
              <Link href="/404" target="_blank">
                <FileQuestion className="size-4 mr-2" />
                Probar Pantalla 404
                <ArrowUpRight className="size-3.5 ml-1.5 opacity-60" />
              </Link>
            </Button>
          </div>
        </SubSection>

        <SubSection
          id="under-construction-page"
          title="Página en construcción"
          description="Pantalla que indica al usuario que la sección a la que intenta acceder se encuentra actualmente en desarrollo y no está disponible de momento."
          icon={Hammer}
          registerSection={registerSection}
        >
          <div className="flex gap-4 items-center flex-wrap">
            <Button variant="neutral" asChild>
              <Link href="/construccion" target="_blank">
                <Hammer className="size-4 mr-2" />
                Probar Pantalla Construcción
                <ArrowUpRight className="size-3.5 ml-1.5 opacity-60" />
              </Link>
            </Button>
          </div>
        </SubSection>
      </div>
    </div>
  );
}
