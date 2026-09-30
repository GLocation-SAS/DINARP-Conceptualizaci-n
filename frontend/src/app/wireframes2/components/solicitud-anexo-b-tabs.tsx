"use client";

import React, { useState } from "react";
import {
  Building2,
  User,
  ShieldCheck,
  FileText,
  FileSignature,
  Download,
  Mail,
  MapPin,
  Calendar,
  CheckCircle2,
  ExternalLink,
  CreditCard,
  Phone,
  Briefcase
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle, CardDescription, CardBadge } from "@/components/ui/card";
import { toast } from "sonner";
import { type SolicitudIngreso } from "../acceso-seguridad/data/gestion-ingresos-store";

interface SolicitudAnexoBDetailProps {
  solicitud: SolicitudIngreso;
}

export function SolicitudAnexoBDetail({ solicitud }: SolicitudAnexoBDetailProps) {
  const [bTab, setBTab] = useState<number>(0);
  const anexoB = solicitud.anexoB;

  return (
    <div className="space-y-6">
      {/* Pestañas Cápsula UI Kit para Anexo B */}
      <div className="overflow-x-auto py-1">
        <Tabs
          defaultValue="btab-0"
          value={`btab-${bTab}`}
          onValueChange={(val) => setBTab(Number(val.replace("btab-", "")))}
          className="w-full"
        >
          <TabsList className="h-auto p-1 rounded-full bg-background border border-border/40 inline-flex gap-1 flex-nowrap w-max sm:w-auto justify-start">
            <TabsTrigger
              value="btab-0"
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold gap-1.5 sm:gap-2 whitespace-nowrap data-[state=active]:bg-primary-300 data-[state=active]:text-white data-[state=active]:[&_svg]:text-white dark:data-[state=active]:bg-primary-300 dark:data-[state=active]:text-white dark:data-[state=active]:[&_svg]:text-white"
            >
              <User className="size-3.5 shrink-0" />
              <span>1. Coordinador e Institución</span>
            </TabsTrigger>
            <TabsTrigger
              value="btab-1"
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold gap-1.5 sm:gap-2 whitespace-nowrap data-[state=active]:bg-primary-300 data-[state=active]:text-white data-[state=active]:[&_svg]:text-white dark:data-[state=active]:bg-primary-300 dark:data-[state=active]:text-white dark:data-[state=active]:[&_svg]:text-white"
            >
              <FileText className="size-3.5 shrink-0" />
              <span>2. Acuerdo de Uso y Confidencialidad</span>
            </TabsTrigger>
            <TabsTrigger
              value="btab-2"
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold gap-1.5 sm:gap-2 whitespace-nowrap data-[state=active]:bg-primary-300 data-[state=active]:text-white data-[state=active]:[&_svg]:text-white dark:data-[state=active]:bg-primary-300 dark:data-[state=active]:text-white dark:data-[state=active]:[&_svg]:text-white"
            >
              <ShieldCheck className="size-3.5 shrink-0" />
              <span>3. Firma Electrónica</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* ── TAB 0: COORDINADOR E INSTITUCIÓN ── */}
      {bTab === 0 && (
        <div className="bg-surface border border-border rounded-2xl p-4 sm:p-6 space-y-6 shadow-xs animate-in fade-in duration-200">
          <div className="bg-primary-100/20 dark:bg-black/35 border-b border-primary dark:border-primary/40 p-3.5 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-t-lg">
            <div>
              <h2 className="text-sm font-bold font-heading text-primary dark:text-primary-300 flex items-center gap-2">
                <User className="size-4 text-primary dark:text-primary-300 shrink-0" />
                <span>Identificación del Coordinador e Institución Solicitante</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Datos verificados mediante invitación previa generada a partir del Anexo A registrado.
              </p>
            </div>
            <Badge tone="primary" appearance="solid" size="sm" className="font-bold shrink-0 !text-white shadow-xs">
              {anexoB?.rolAsignado || "COORDINADOR TITULAR"}
            </Badge>
          </div>

          {/* Tarjeta del Coordinador */}
          <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-4">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="size-4 text-primary" />
              <span>Datos del Coordinador Designado</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px]">Nombres y Apellidos:</span>
                <strong className="text-foreground text-sm font-semibold">{anexoB?.funcionarioNombre || solicitud.nombreCompleto}</strong>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Cédula de Identidad:</span>
                <strong className="text-foreground font-mono text-sm">{anexoB?.funcionarioCedula || solicitud.cedula}</strong>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Cargo Institucional:</span>
                <strong className="text-foreground">{anexoB?.funcionarioCargo || "Director de TI / Sistemas"}</strong>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Correo Institucional:</span>
                <strong className="text-foreground">{anexoB?.funcionarioEmail || solicitud.correo}</strong>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Rol en SINARP:</span>
                <Badge tone="neutral" appearance="soft" size="sm" className="font-semibold mt-0.5">
                  {anexoB?.rolAsignado || "COORDINADOR TITULAR"}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Fecha de Solicitud / Envío:</span>
                <span className="font-mono text-foreground font-medium">{solicitud.fechaSolicitud}</span>
              </div>
            </div>
          </div>

          {/* Tarjeta de la Institución Solicitante */}
          <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-4">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Building2 className="size-4 text-primary" />
              <span>Institución Requirente y Representación Legal</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <span className="text-muted-foreground block text-[11px]">Nombre de la Entidad:</span>
                <strong className="text-foreground text-sm">{anexoB?.nombreEntidad || solicitud.institucion}</strong>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Domicilio Legal Institucional:</span>
                <span className="text-foreground">{anexoB?.domicilioEntidad || "Calle Bolívar y Borrero, Cuenca, Azuay"}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Máxima Autoridad / Representante Legal:</span>
                <strong className="text-foreground">{anexoB?.representanteLegalNombre || "Alcalde / Máxima Autoridad"}</strong>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setBTab(1)}
              className="text-xs font-semibold gap-1.5 shadow-2xs"
            >
              <span>Siguiente: Acuerdo de Uso y Confidencialidad →</span>
            </Button>
          </div>
        </div>
      )}

      {/* ── TAB 1: ACUERDO DE USO Y CONFIDENCIALIDAD (10 CLÁUSULAS OFICIALES ARP-R02) ── */}
      {bTab === 1 && (
        <div className="bg-surface border border-border rounded-2xl p-4 sm:p-6 space-y-6 shadow-xs animate-in fade-in duration-200">
          <div className="bg-primary-100/20 dark:bg-black/35 border-b border-primary dark:border-primary/40 p-3.5 mb-5 rounded-t-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold font-heading text-primary dark:text-primary-300 flex items-center gap-2">
                <FileText className="size-4 text-primary dark:text-primary-300 shrink-0" />
                <span>Acuerdo de Uso y Confidencialidad (ARP-R02 · Versión 1.0)</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Texto íntegro oficial de las 10 cláusulas jurídicas suscritas por el Coordinador y Representante Legal.
              </p>
            </div>
            <Badge tone="neutral" appearance="outline" size="sm" className="font-mono text-[10px] self-start sm:self-auto">
              Vigencia: 20-06-2025
            </Badge>
          </div>

          {/* Visor Scrollable con las 10 Cláusulas Oficiales de Anexo B */}
          <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-4 max-h-[460px] overflow-y-auto text-xs leading-relaxed divide-y divide-border/60">
            {/* Cláusula Primera */}
            <div className="pt-2 first:pt-0 space-y-1">
              <h4 className="font-bold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
                <span className="text-primary font-mono">01.</span>
                <span>CLÁUSULA PRIMERA. - INTERVINIENTES</span>
              </h4>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Comparecen a la suscripción del presente Acuerdo de Uso y Confidencialidad, por una parte, la entidad pública o privada requirente legalmente facultada <strong className="text-foreground">{anexoB?.nombreEntidad || solicitud.institucion}</strong> representada por su máxima autoridad o delegado, y por otra parte, el servidor/a o funcionario/a público/a designado formalmente como <strong className="text-foreground">{anexoB?.rolAsignado || "COORDINADOR TITULAR"}</strong>: <strong className="text-foreground">{anexoB?.funcionarioNombre || solicitud.nombreCompleto}</strong> (C.I. {anexoB?.funcionarioCedula || solicitud.cedula}).
              </p>
            </div>

            {/* Cláusula Segunda */}
            <div className="pt-3 space-y-1">
              <h4 className="font-bold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
                <span className="text-primary font-mono">02.</span>
                <span>CLÁUSULA SEGUNDA. - ANTECEDENTES</span>
              </h4>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                La entidad requirente declara que requiere acceso a los datos registrales para el cumplimiento de sus fines legales y constitucionales: <em className="text-foreground">{anexoB?.misionVisionInstitucional || "Garantizar la interoperabilidad técnica, consulta legítima y custodia estricta de las fuentes registrales del SINARP."}</em>
              </p>
            </div>

            {/* Cláusula Tercera */}
            <div className="pt-3 space-y-1">
              <h4 className="font-bold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
                <span className="text-primary font-mono">03.</span>
                <span>CLÁUSULA TERCERA. - BASE LEGAL</span>
              </h4>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                El presente instrumento se sustenta en el Art. 66 num. 19 de la Constitución de la República del Ecuador; Ley del Sistema Nacional de Registros Públicos (Arts. 4, 27, 28 y 29); Arts. 2, 7, 10, 38 y 46 de la Ley Orgánica de Protección de Datos Personales (LOPDP); Ley Orgánica para la Optimización y Eficiencia de Trámites Administrativos; y Arts. 178, 180 y 229 del Código Orgánico Integral Penal (COIP).
              </p>
            </div>

            {/* Cláusula Cuarta */}
            <div className="pt-3 space-y-1">
              <h4 className="font-bold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
                <span className="text-primary font-mono">04.</span>
                <span>CLÁUSULA CUARTA. - DE LA PROTECCIÓN DE LA INFORMACIÓN Y EL TRATAMIENTO</span>
              </h4>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Toda información contenida en las herramientas que proporciona la DINARP se sujeta a las condiciones de legitimación para el tratamiento de datos personales y principalmente a los principios de legalidad, finalidad, pertinencia, minimización y confidencialidad. Los intervinientes quedan obligados a utilizar única y exclusivamente la información para los fines autorizados por la DINARP.
              </p>
            </div>

            {/* Cláusula Quinta */}
            <div className="pt-3 space-y-1">
              <h4 className="font-bold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
                <span className="text-primary font-mono">05.</span>
                <span>CLÁUSULA QUINTA. - OBLIGACIONES DE LOS INTERVINIENTES</span>
              </h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground text-[11px] pl-1">
                <li>Utilizar los accesos al SINARP exclusivamente para los propósitos determinados en sus funciones o cargo, en estricta relación con las competencias institucionales.</li>
                <li>Velar por el buen uso de la información que integra el Sistema Nacional de Registros Públicos.</li>
                <li>Implementar y utilizar las medidas técnicas y organizativas de seguridad frente a riesgos o amenazas.</li>
                <li>Mantener políticas de trazabilidad que determinen fecha, hora y servidor que accede a la plataforma y datos.</li>
                <li>Notificar de inmediato a DINARP y a la Superintendencia de Protección de Datos Personales cualquier vulneración o incidente de seguridad.</li>
                <li>Al finalizar funciones, elaborar el acta entrega-recepción correspondiente con el detalle de actividades.</li>
              </ul>
            </div>

            {/* Cláusula Sexta */}
            <div className="pt-3 space-y-1">
              <h4 className="font-bold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
                <span className="text-primary font-mono">06.</span>
                <span>CLÁUSULA SEXTA. - PROHIBICIONES DE LOS INTERVINIENTES</span>
              </h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground text-[11px] pl-1">
                <li>Modificar, alterar, divulgar o comercializar de manera total o parcial la información y herramientas.</li>
                <li>Publicar, difundir, ceder o transmitir acceso a terceros no autorizados.</li>
                <li>Revelar, compartir o difundir por cualquier medio las claves de acceso individuales e intransferibles.</li>
                <li>Hacer uso de las claves de acceso mientras se encuentre gozando de vacaciones, licencias o permisos.</li>
              </ul>
            </div>

            {/* Cláusula Séptima */}
            <div className="pt-3 space-y-1">
              <h4 className="font-bold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
                <span className="text-primary font-mono">07.</span>
                <span>CLÁUSULA SÉPTIMA. - RESPONSABILIDAD</span>
              </h4>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Los intervinientes serán responsables civil, administrativa y penalmente por el incumplimiento del presente acuerdo. La DINARP no será responsable bajo ninguna circunstancia por daños derivados del mal uso de las herramientas o consultas indebidas efectuadas por los usuarios autorizados.
              </p>
            </div>

            {/* Cláusula Octava */}
            <div className="pt-3 space-y-1">
              <h4 className="font-bold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
                <span className="text-primary font-mono">08.</span>
                <span>CLÁUSULA OCTAVA. - DECLARACIONES NORMATIVAS</span>
              </h4>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Los comparecientes declaran conocer la distinción entre datos públicos y confidenciales, y se obligan a observar los tipos penales sancionados en el COIP: violación a la intimidad (Art. 178), revelación ilegal de bases de datos (Art. 229) y difusión de información reservada (Art. 180).
              </p>
            </div>

            {/* Cláusula Novena */}
            <div className="pt-3 space-y-1">
              <h4 className="font-bold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
                <span className="text-primary font-mono">09.</span>
                <span>CLÁUSULA NOVENA. - VIGENCIA Y CESACIÓN</span>
              </h4>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                El acuerdo rige mientras el funcionario ejerza el cargo de coordinador dentro de la institución. En caso de cese, desvinculación o traslado, la entidad tiene la obligación ineludible de notificar formalmente a la DINARP para la revocatoria inmediata de credenciales.
              </p>
            </div>

            {/* Cláusula Décima */}
            <div className="pt-3 space-y-1">
              <h4 className="font-bold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
                <span className="text-primary font-mono">10.</span>
                <span>CLÁUSULA DÉCIMA. - ACEPTACIÓN Y SUSCRIPCIÓN</span>
              </h4>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Los intervinientes aceptan el contenido de todas y cada una de las cláusulas del presente acuerdo y en consecuencia se comprometen a cumplirlas en toda su extensión, en fe de lo cual suscriben el presente instrumento en la ciudad de <strong className="text-foreground">{anexoB?.ciudadFirma || "Quito D.M."}</strong>.
              </p>
            </div>
          </div>

          {/* Aceptación de términos */}
          <div className="p-3.5 bg-success/10 border border-success/30 rounded-xl flex items-center gap-2.5 text-xs text-success">
            <CheckCircle2 className="size-4 shrink-0 text-success" />
            <span className="font-semibold">
              El Coordinador aceptó íntegramente las 10 cláusulas legales y deberes del Acuerdo antes de la suscripción con FirmaEC.
            </span>
          </div>

          <div className="flex justify-between items-center pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setBTab(0)}
              className="text-xs font-semibold gap-1.5"
            >
              ← Volver a Datos
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setBTab(2)}
              className="text-xs font-semibold gap-1.5 shadow-2xs"
            >
              <span>Siguiente: Firma Electrónica →</span>
            </Button>
          </div>
        </div>
      )}

      {/* ── TAB 2: FIRMA ELECTRÓNICA ── */}
      {bTab === 2 && (
        <div className="bg-surface border border-border rounded-2xl p-4 sm:p-6 space-y-6 shadow-xs animate-in fade-in duration-200">
          <div className="bg-primary-100/20 dark:bg-black/35 border-b border-primary dark:border-primary/40 p-3.5 mb-5 rounded-t-lg">
            <h2 className="text-sm font-bold font-heading text-primary dark:text-primary-300 flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary dark:text-primary-300 shrink-0" />
              <span>Verificación de Firma Electrónica (FirmaEC)</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Instrumento digital ARP-R02 suscrito por el Coordinador designado con certificado de firma electrónica válido.
            </p>
          </div>

          {/* Tarjeta de Resumen de Certificado FirmaEC */}
          <div className="p-4.5 rounded-2xl border border-success/30 bg-success/5 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-success">
                <CheckCircle2 className="size-5 shrink-0" />
                <span className="text-sm">Firma Electrónica Verificada con FirmaEC</span>
              </div>
              <Badge tone="success" appearance="solid" size="sm" className="font-bold text-[10px] uppercase !text-white shadow-2xs">
                VÁLIDA Y VIGENTE
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1 border-t border-success/20">
              <div>
                <span className="text-muted-foreground block text-[11px]">Firmante Digital:</span>
                <strong className="text-foreground">{anexoB?.funcionarioNombre || solicitud.nombreCompleto}</strong>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Cédula del Firmante:</span>
                <strong className="text-foreground font-mono">{anexoB?.funcionarioCedula || solicitud.cedula}</strong>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Tipo de Documento:</span>
                <span className="text-foreground">Formulario Oficial ARP-R02 (Anexo B)</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Fecha y Hora de Estampado:</span>
                <span className="text-foreground font-mono font-medium">{solicitud.fechaSolicitud}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Entidad Emisora de Certificado:</span>
                <span className="text-foreground">Banco Central del Ecuador / Security Data</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Integridad del Archivo:</span>
                <span className="text-success font-semibold">Integridad criptográfica verificada sin alteraciones</span>
              </div>
            </div>
          </div>

          {/* Archivo Asociado */}
          <div className="p-4 rounded-xl border border-border bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <FileSignature className="size-5" />
              </div>
              <div>
                <h4 className="font-mono font-bold text-xs text-foreground">
                  ARP-R02_Acuerdo_Uso_Confidencialidad_Firmado.pdf
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Documento digital oficial firmado por el coordinador designado · 245 KB
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                toast.success("Descargando documento firmado ARP-R02 con estampas de FirmaEC...");
              }}
              className="text-xs font-semibold gap-1.5 shrink-0"
            >
              <Download className="size-3.5" />
              <span>Descargar documento firmado</span>
            </Button>
          </div>

          <div className="flex justify-between items-center pt-2">
            <Button
              type="button"
              variant="neutral"
              size="sm"
              onClick={() => setBTab(1)}
              className="text-xs font-semibold gap-1.5"
            >
              ← Volver a Acuerdo
            </Button>
            <Badge tone="neutral" appearance="soft" size="sm" className="text-[11px]">
              Expediente digital listo para dictamen
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
}
