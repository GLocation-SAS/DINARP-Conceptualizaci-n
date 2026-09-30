"use client";

import { useState, useEffect, useCallback } from "react";

export type TipoTramiteIngreso =
  | "PROCESO_A_REGISTRO_INSTITUCION"
  | "PROCESO_B_ENROLAMIENTO_COORDINADOR"
  | "PROCESO_C_CAMBIO_COORDINADOR";

export type EstadoSolicitudIngreso =
  | "Pendiente"
  | "Aprobada"
  | "Rechazada"
  | "PENDIENTE_ENVIO"
  | "PENDIENTE_ASIGNACION_GESTION"
  | "EN_REVISION_GESTION"
  | "APROBADO_GESTION"
  | "PENDIENTE_ASIGNACION_NORMATIVIDAD"
  | "PENDIENTE_GENERAR_RESOLUCION"
  | "EN_GENERACION_RESOLUCION"
  | "GENERACION_PENDIENTE"
  | "RESOLUCION_GENERADA"
  | "PENDIENTE_DE_FIRMA"
  | "INSTITUCION_ACTIVA"
  | "EN_REVISION_NORMATIVIDAD"
  | "APROBADO_FINAL"
  | "Cancelada";

import { getStatusBadgeConfig } from "@/lib/status-badge-config";

// Helper para badges de estado
export function getEstadoBadgeProps(
  estado: EstadoSolicitudIngreso,
  revisionIniciada?: boolean,
  contexto?: "REVISOR" | "DIRECTOR",
  rechazadoPor?: "GESTION" | "NORMATIVIDAD"
) {
  const baseConfig = getStatusBadgeConfig(estado);
  
  if (contexto === "REVISOR" && (estado === "Aprobada" || estado === "APROBADO_FINAL" || estado === "RESOLUCION_GENERADA" || estado === "APROBADO_GESTION")) {
    return { ...baseConfig, label: "Aprobada" };
  }
  if ((estado === "EN_GENERACION_RESOLUCION" || estado === "EN_REVISION_NORMATIVIDAD") && revisionIniciada) {
    return { ...baseConfig, label: "En generación de resolución" };
  }
  if ((estado === "Rechazada" || estado === "Cancelada") && contexto !== "REVISOR" && rechazadoPor === "NORMATIVIDAD") {
    return { ...baseConfig, label: "Rechazado por Normatividad" };
  }

  return baseConfig;
}

export function puedeReasignarSolicitud(solicitud: SolicitudIngreso | null | undefined, tipoArea?: string) {
  if (!solicitud) return { puedeReasignar: false, esReasignacion: false, motivoBloqueo: undefined };
  if (
    solicitud.estado === "APROBADO_FINAL" ||
    solicitud.estado === "RESOLUCION_GENERADA" ||
    solicitud.estado === "PENDIENTE_DE_FIRMA" ||
    solicitud.estado === "INSTITUCION_ACTIVA" ||
    solicitud.estado === "Aprobada" ||
    solicitud.estado === "Rechazada" ||
    solicitud.estado === "Cancelada"
  ) {
    return { puedeReasignar: false, esReasignacion: false, motivoBloqueo: "TrÃ¡mite finalizado o resoluciÃ³n ya generada" };
  }

  const isNormativa = tipoArea === "DIR_NORMATIVA" || tipoArea === "NORMATIVIDAD" || solicitud.estado.includes("NORMATIVIDAD") || solicitud.estado.includes("RESOLUCION") || solicitud.estado === "GENERACION_PENDIENTE";
  const revisorActual = isNormativa ? solicitud.revisorNormatividad : (solicitud.revisorGestion || solicitud.revisor);
  const esReasignacion = Boolean(revisorActual);

  // Si la revisiÃ³n o generaciÃ³n de resoluciÃ³n ya fue iniciada formalmente por el funcionario
  if (solicitud.revisionIniciada && (solicitud.estado === "EN_GENERACION_RESOLUCION" || solicitud.estado === "EN_REVISION_GESTION" || solicitud.estado === "EN_REVISION_NORMATIVIDAD")) {
    return { puedeReasignar: false, esReasignacion, motivoBloqueo: "GeneraciÃ³n de resoluciÃ³n ya iniciada por el responsable" };
  }

  return { puedeReasignar: true, esReasignacion, motivoBloqueo: undefined };
}

// Datos Anexo A: Solicitud de Acceso al SINARP (ARP-R01)
export interface DatosAnexoA {
  // 1.1 Solicitante
  entidadTipo: "Publica" | "Privada";
  nombreEntidad: string;
  entidadSiglas?: string;
  rucEntidad: string;
  direccionEntidad: string;
  objetoSocial: string;
  representanteLegalNombre: string;
  representanteLegalCargo: string;
  representanteLegalEmail: string;
  esDelegado: boolean;
  archivoSoporteDelegacion?: string;

  // 1.2 Coordinador Titular (Preregistrado)
  titularNombreCompleto: string;
  titularCedula: string;
  titularCargo: string;
  titularAreaUnidad: string;
  titularEmail: string;
  titularTelefonoFijo: string;
  titularMovilInstitucional: string;
  titularMovilPersonal: string;

  // 1.3 Coordinador Suplente (Preregistrado)
  suplenteNombreCompleto: string;
  suplenteCedula: string;
  suplenteCargo: string;
  suplenteAreaUnidad: string;
  suplenteEmail: string;
  suplenteTelefonoFijo: string;
  suplenteMovilInstitucional: string;
  suplenteMovilPersonal: string;

  // SecciÃ³n II: Servicios y Herramientas
  serviciosHerramientas: string[]; // Infodigital, Ficha de Registro Ãšnico, Interoperabilidad
  areasUso: string;
  procesosUso: string;

  // Declaraciones y Firma
  declaracionesAceptadas: boolean;
  ciudadFirma: string;
  fechaFirma: string;
  firmadoDigitalmente: boolean;
  archivoDocumentoFirmado?: string;
}

// Datos Anexo B: Acuerdo de Uso y Confidencialidad (ARP-R02)
export interface DatosAnexoB {
  nombreEntidad: string;
  domicilioEntidad: string;
  representanteLegalNombre: string;
  funcionarioNombre: string;
  funcionarioCedula: string;
  funcionarioCargo: string;
  funcionarioEmail?: string;
  rolAsignado: "COORDINADOR TITULAR" | "SUPLENTE" | "SUPERVISOR" | "VISUALIZADOR";
  misionVisionInstitucional: string;
  clausulasAceptadas: boolean;
  ciudadFirma: string;
  fechaFirma: string;
  firmadoPorRepresentante: boolean;
  firmadoPorFuncionario: boolean;
  archivoAcuerdoFirmado?: string;
}

// Datos Anexo C: Cambio de Coordinador Institucional (ARP-R03)
export interface DatosAnexoC {
  nombreEntidad: string;
  representanteLegalNombre: string;
  esDelegado: boolean;
  archivoSoporteDelegacion?: string;

  // ClÃ¡usula Segunda: Cambio Titular
  aplicaCambioTitular: boolean;
  nuevoTitularNombre?: string;
  nuevoTitularCedula?: string;
  nuevoTitularCargo?: string;
  nuevoTitularMotivo?: string;
  nuevoTitularEmail?: string;
  nuevoTitularArea?: string;
  nuevoTitularTelefonoFijo?: string;
  nuevoTitularMovilInst?: string;
  nuevoTitularMovilPersonal?: string;

  // ClÃ¡usula Segunda: Cambio Suplente
  aplicaCambioSuplente: boolean;
  nuevoSuplenteNombre?: string;
  nuevoSuplenteCedula?: string;
  nuevoSuplenteCargo?: string;
  nuevoSuplenteMotivo?: string;
  nuevoSuplenteEmail?: string;
  nuevoSuplenteArea?: string;
  nuevoSuplenteTelefonoFijo?: string;
  nuevoSuplenteMovilInst?: string;
  nuevoSuplenteMovilPersonal?: string;

  // ClÃ¡usula Tercera: DesignaciÃ³n Inicial Suplente (Solo si entidad no tenÃ­a suplente)
  aplicaDesignacionInicialSuplente: boolean;
  inicialSuplenteNombre?: string;
  inicialSuplenteCedula?: string;
  inicialSuplenteCargo?: string;
  inicialSuplenteEmail?: string;

  // ClÃ¡usula Cuarta: AceptaciÃ³n y Firmas
  ciudadFirma: string;
  fechaFirma: string;
  firmadoDigitalmente: boolean;
  archivoDocumentoFirmado?: string;
}

export interface InvitacionAnexoB {
  id: string; // ej: "INV-B-2026-0042-TIT"
  solicitudId: string;
  destinatarioCedula: string;
  destinatarioNombre: string;
  destinatarioEmail: string;
  destinatarioCargo?: string;
  institucion: string;
  rol: "TITULAR" | "SUPLENTE";
  token: string; // Token opaco sensible, nunca visible en UI
  fechaEmision: string;
  fechaCaducidad: string;
  estado: "PENDIENTE" | "USADA" | "VENCIDA" | "REVOCADA";
  canalEnvio: "CORREO_ELECTRONICO";
  fechaEnvio: string;
}

export interface SolicitudIngreso {
  id: string;
  tipoTramite: TipoTramiteIngreso;
  codigoDocumental: "ARP-R01" | "ARP-R02" | "ARP-R03";
  tituloTramite: string;
  cedula: string;
  nombres: string;
  apellidos: string;
  nombreCompleto: string;
  iniciales: string;
  correo: string;
  institucion: string;
  fechaSolicitud: string;
  estado: EstadoSolicitudIngreso;
  fechaRevision?: string;
  fechaInicioRevision?: string;
  revisor?: string;
  revisorGestion?: string;
  revisorNormatividad?: string;
  revisionIniciada?: boolean;
  fechaAsignacionGestion?: string;
  fechaAsignacionNormatividad?: string;
  fechaAprobacionGestion?: string;
  observacionesAsignacion?: string;
  resolucion?: string;
  motivoRechazo?: string;
  rechazadoPor?: "GESTION" | "NORMATIVIDAD";
  documentos: string[];

  // INS-07: Datos de firma de resoluciÃ³n y activaciÃ³n institucional
  datosFirmaResolucion?: {
    firmante: string;
    cargo: string;
    entidad: string;
    entidadCertificadora: string;
    algoritmo: string;
    fechaHoraFirma: string;
    verificada: boolean;
    hashDocumento?: string;
  };

  invitacionesB?: InvitacionAnexoB[];

  historial?: Array<{
    id: string;
    fecha?: string;
    fechaHora?: string;
    accion: string;
    usuario?: string;
    realizadoPor?: string;
    rol?: string;
    detalle?: string;
    detalles?: string;
  }>;

  // Contenido de los anexos BPM
  anexoA?: DatosAnexoA;
  anexoB?: DatosAnexoB;
  anexoC?: DatosAnexoC;
}

export const STORAGE_KEY_INGRESOS = "dinarp_solicitudes_ingreso_v15";

export const INITIAL_SOLICITUDES_INGRESO: SolicitudIngreso[] = [
  // CASO 1: PENDIENTE POR REVISAR (Asignado por el Director al Revisor, en espera de iniciar formalmente)
  {
    id: "SOL-ING-101",
    tipoTramite: "PROCESO_A_REGISTRO_INSTITUCION",
    codigoDocumental: "ARP-R01",
    tituloTramite: "Solicitud de Acceso SINARP (Registro InstituciÃ³n)",
    cedula: "1722334455",
    nombres: "Ana MarÃ­a",
    apellidos: "PÃ©rez GÃ³mez",
    nombreCompleto: "Ana MarÃ­a PÃ©rez GÃ³mez",
    iniciales: "AP",
    correo: "ana.perez@mintel.gob.ec",
    institucion: "Ministerio de Telecomunicaciones",
    fechaSolicitud: "28/09/2026 09:15",
    estado: "EN_REVISION_GESTION",
    revisorGestion: "Revisor GestiÃ³n",
    revisor: "Revisor GestiÃ³n",
    fechaAsignacionGestion: "28/09/2026 10:15",
    observacionesAsignacion: "Prioridad alta. Validar designaciÃ³n de coordinadores y firma digital FirmaEC.",
    revisionIniciada: false,
    documentos: ["ARP-R01_Solicitud_Acceso_MINTEL.pdf"],
    historial: [
      {
        id: "h-ing-101",
        fechaHora: "28/09/2026 09:15",
        accion: "Ingreso de trÃ¡mite",
        realizadoPor: "Ana MarÃ­a PÃ©rez GÃ³mez",
        rol: "Solicitante Institucional",
        detalles: "Formulario ARP-R01 suscrito y registrado formalmente en el sistema."
      },
      {
        id: "h-asig-101",
        fechaHora: "28/09/2026 10:15",
        accion: "AsignaciÃ³n de trÃ¡mite",
        realizadoPor: "Director GestiÃ³n",
        rol: "Director / Coordinador",
        detalles: "TrÃ¡mite asignado a Revisor GestiÃ³n. Prioridad alta. Validar designaciÃ³n de coordinadores y firma digital FirmaEC."
      }
    ],
    anexoA: {
      entidadTipo: "Publica",
      nombreEntidad: "Ministerio de Telecomunicaciones",
      rucEntidad: "1768151240001",
      direccionEntidad: "Av. 6 de Diciembre y ColÃ³n, Quito",
      objetoSocial: "Rector de las telecomunicaciones y sociedad de la informaciÃ³n.",
      representanteLegalNombre: "Ing. Vianna Maino",
      representanteLegalCargo: "Ministra",
      representanteLegalEmail: "ministra@mintel.gob.ec",
      esDelegado: false,
      titularNombreCompleto: "Ana MarÃ­a PÃ©rez GÃ³mez",
      titularCedula: "1722334455",
      titularCargo: "Directora de Interoperabilidad",
      titularAreaUnidad: "SubsecretarÃ­a de Gobierno ElectrÃ³nico",
      titularEmail: "ana.perez@mintel.gob.ec",
      titularTelefonoFijo: "023931000",
      titularMovilInstitucional: "0991112233",
      titularMovilPersonal: "0992223344",
      suplenteNombreCompleto: "Luis Fernando Torres",
      suplenteCedula: "1711223344",
      suplenteCargo: "Especialista en Datos",
      suplenteAreaUnidad: "SubsecretarÃ­a de Gobierno ElectrÃ³nico",
      suplenteEmail: "luis.torres@mintel.gob.ec",
      suplenteTelefonoFijo: "023931000",
      suplenteMovilInstitucional: "0993334455",
      suplenteMovilPersonal: "0994445566",
      serviciosHerramientas: ["Ficha de InformaciÃ³n Ciudadana"],
      areasUso: "GestiÃ³n de TrÃ¡mites",
      procesosUso: "SimplificaciÃ³n de trÃ¡mites",
      declaracionesAceptadas: true,
      ciudadFirma: "Quito D.M.",
      fechaFirma: "28/09/2026",
      firmadoDigitalmente: true,
      archivoDocumentoFirmado: "ARP-R01_Solicitud_Acceso_MINTEL.pdf"
    }
  },

  // CASO 1.2: PENDIENTE POR REVISAR (Consejo de la Judicatura - Anexo A)
  {
    id: "SOL-ING-109",
    tipoTramite: "PROCESO_A_REGISTRO_INSTITUCION",
    codigoDocumental: "ARP-R01",
    tituloTramite: "Solicitud de Acceso SINARP (Registro InstituciÃ³n)",
    cedula: "1710001112",
    nombres: "Marcelo",
    apellidos: "Albuja",
    nombreCompleto: "Marcelo Albuja",
    iniciales: "MA",
    correo: "marcelo.albuja@funcionjudicial.gob.ec",
    institucion: "Consejo de la Judicatura",
    fechaSolicitud: "29/09/2026 08:15",
    estado: "EN_REVISION_GESTION",
    revisorGestion: "Revisor GestiÃ³n",
    revisor: "Revisor GestiÃ³n",
    fechaAsignacionGestion: "29/09/2026 08:45",
    observacionesAsignacion: "Verificar acceso para sorteo de peritos judiciales.",
    revisionIniciada: false,
    documentos: ["ARP-R01_Solicitud_Acceso_Judicatura.pdf"],
    historial: [
      {
        id: "h-ing-109",
        fechaHora: "29/09/2026 08:15",
        accion: "Ingreso de trÃ¡mite",
        realizadoPor: "Marcelo Albuja",
        rol: "Solicitante Institucional",
        detalles: "Formulario ARP-R01 suscrito e ingresado."
      },
      {
        id: "h-asig-109",
        fechaHora: "29/09/2026 08:45",
        accion: "AsignaciÃ³n de trÃ¡mite",
        realizadoPor: "Director GestiÃ³n",
        rol: "Director / Coordinador",
        detalles: "Asignado a Revisor GestiÃ³n. Prioridad normal."
      }
    ],
    anexoA: {
      entidadTipo: "Publica",
      nombreEntidad: "Consejo de la Judicatura",
      rucEntidad: "1768097520001",
      direccionEntidad: "Av. 12 de Octubre N24-563, Quito",
      objetoSocial: "AdministraciÃ³n de la FunciÃ³n Judicial",
      representanteLegalNombre: "Dr. Mario Godoy",
      representanteLegalCargo: "Presidente",
      representanteLegalEmail: "presidencia@funcionjudicial.gob.ec",
      esDelegado: false,
      titularNombreCompleto: "Marcelo Albuja",
      titularCedula: "1710001112",
      titularCargo: "Director Nacional de TecnologÃ­as",
      titularAreaUnidad: "TecnologÃ­a",
      titularEmail: "marcelo.albuja@funcionjudicial.gob.ec",
      titularTelefonoFijo: "023953600",
      titularMovilInstitucional: "0991112233",
      titularMovilPersonal: "0982223344",
      suplenteNombreCompleto: "Silvia Montalvo",
      suplenteCedula: "1712223334",
      suplenteCargo: "Especialista de Sistemas",
      suplenteAreaUnidad: "TecnologÃ­a",
      suplenteEmail: "silvia.montalvo@funcionjudicial.gob.ec",
      suplenteTelefonoFijo: "023953600",
      suplenteMovilInstitucional: "0993334455",
      suplenteMovilPersonal: "0984445566",
      serviciosHerramientas: ["Consulta de datos de identidad y estado civil"],
      areasUso: "GestiÃ³n Judicial",
      procesosUso: "ValidaciÃ³n de sujetos procesales",
      declaracionesAceptadas: true,
      ciudadFirma: "Quito D.M.",
      fechaFirma: "29/09/2026",
      firmadoDigitalmente: true,
      archivoDocumentoFirmado: "ARP-R01_Solicitud_Acceso_Judicatura.pdf"
    }
  },

  // CASO 1.3: PENDIENTE POR REVISAR (GAD Municipal de Guayaquil - Anexo B)
  {
    id: "SOL-ING-110",
    tipoTramite: "PROCESO_B_ENROLAMIENTO_COORDINADOR",
    codigoDocumental: "ARP-R02",
    tituloTramite: "Anexo B â€” Enrolamiento de Coordinador",
    cedula: "0912345678",
    nombres: "Javier",
    apellidos: "BohÃ³rquez",
    nombreCompleto: "Javier BohÃ³rquez",
    iniciales: "JB",
    correo: "jbohorquez@guayaquil.gob.ec",
    institucion: "GAD Municipal de Guayaquil",
    fechaSolicitud: "29/09/2026 09:00",
    estado: "EN_REVISION_GESTION",
    revisorGestion: "Revisor GestiÃ³n",
    revisor: "Revisor GestiÃ³n",
    fechaAsignacionGestion: "29/09/2026 09:30",
    observacionesAsignacion: "Revisar suscripciÃ³n del acuerdo y rol de titular.",
    revisionIniciada: false,
    documentos: ["ARP-R02_Acuerdo_Uso_Confidencialidad_Firmado.pdf"],
    historial: [
      {
        id: "h-ing-110-1",
        fechaHora: "29/09/2026 08:40",
        accion: "InvitaciÃ³n validada",
        realizadoPor: "Javier BohÃ³rquez",
        rol: "Coordinador Designado",
        detalles: "InvitaciÃ³n B vigente verificada para Javier BohÃ³rquez como COORDINADOR TITULAR de GAD Municipal de Guayaquil."
      },
      {
        id: "h-ing-110-2",
        fechaHora: "29/09/2026 08:50",
        accion: "Firma verificada en FirmaEC",
        realizadoPor: "FirmaEC Â· Servicio de CertificaciÃ³n",
        detalles: "FirmaEC confirmÃ³ correctamente la firma electrÃ³nica del Acuerdo de Uso y Confidencialidad."
      },
      {
        id: "h-ing-110",
        fechaHora: "29/09/2026 09:00",
        accion: "Anexo B enviado a GestiÃ³n DINARP",
        realizadoPor: "Javier BohÃ³rquez",
        rol: "Coordinador Designado",
        detalles: "Acuerdo de Confidencialidad ingresado formalmente a la DirecciÃ³n de GestiÃ³n y Registro DINARP."
      },
      {
        id: "h-asig-110",
        fechaHora: "29/09/2026 09:30",
        accion: "AsignaciÃ³n de trÃ¡mite",
        realizadoPor: "Director GestiÃ³n",
        rol: "Director / Coordinador",
        detalles: "Asignado a Revisor GestiÃ³n."
      }
    ],
    anexoB: {
      nombreEntidad: "GAD Municipal de Guayaquil",
      domicilioEntidad: "Pichincha y Clemente BallÃ©n, Guayaquil",
      representanteLegalNombre: "Aquiles Alvarez Henriques",
      funcionarioNombre: "Javier BohÃ³rquez",
      funcionarioCedula: "0912345678",
      funcionarioCargo: "Director de InformÃ¡tica",
      funcionarioEmail: "jbohorquez@guayaquil.gob.ec",
      rolAsignado: "COORDINADOR TITULAR",
      misionVisionInstitucional: "Impulsar el desarrollo cantonal y la gobernanza digital.",
      clausulasAceptadas: true,
      ciudadFirma: "Guayaquil",
      fechaFirma: "29/09/2026",
      firmadoPorRepresentante: true,
      firmadoPorFuncionario: true,
      archivoAcuerdoFirmado: "ARP-R02_Acuerdo_Uso_Confidencialidad_Firmado.pdf"
    }
  },

  // CASO 1.3B: ANEXO B PENDIENTE DE ASIGNACIÃ“N (Nuevo trÃ¡mite ingresado por Coordinador)
  {
    id: "SOL-ING-109",
    tipoTramite: "PROCESO_B_ENROLAMIENTO_COORDINADOR",
    codigoDocumental: "ARP-R02",
    tituloTramite: "Anexo B â€” Enrolamiento de Coordinador",
    cedula: "4444444444",
    nombres: "Carlos Alberto",
    apellidos: "Morales Viteri",
    nombreCompleto: "Ing. Carlos Alberto Morales Viteri",
    iniciales: "CM",
    correo: "carlos.morales@cuenca.gob.ec",
    institucion: "Gobierno AutÃ³nomo Descentralizado Municipal de Cuenca",
    fechaSolicitud: "29/09/2026 09:15",
    estado: "PENDIENTE_ASIGNACION_GESTION",
    documentos: ["ARP-R02_Acuerdo_Uso_Confidencialidad_Firmado.pdf"],
    historial: [
      {
        id: "h-ing-109-1",
        fechaHora: "29/09/2026 08:55",
        accion: "InvitaciÃ³n validada",
        realizadoPor: "Ing. Carlos Alberto Morales Viteri",
        rol: "Coordinador Designado",
        detalles: "InvitaciÃ³n B vigente verificada para Ing. Carlos Alberto Morales Viteri como COORDINADOR TITULAR de GAD Municipal de Cuenca."
      },
      {
        id: "h-ing-109-2",
        fechaHora: "29/09/2026 09:05",
        accion: "Firma verificada en FirmaEC",
        realizadoPor: "FirmaEC Â· Servicio de CertificaciÃ³n",
        detalles: "FirmaEC confirmÃ³ correctamente la firma electrÃ³nica del Acuerdo de Uso y Confidencialidad y certificado digital vÃ¡lido."
      },
      {
        id: "h-ing-109-3",
        fechaHora: "29/09/2026 09:15",
        accion: "Anexo B enviado a GestiÃ³n DINARP",
        realizadoPor: "Ing. Carlos Alberto Morales Viteri",
        rol: "Coordinador Designado",
        detalles: "Acuerdo de Confidencialidad (Anexo B) ingresado formalmente a la bandeja de GestiÃ³n DINARP para asignaciÃ³n de revisor."
      }
    ],
    anexoB: {
      nombreEntidad: "Gobierno AutÃ³nomo Descentralizado Municipal de Cuenca",
      domicilioEntidad: "Calle BolÃ­var y Borrero, Cuenca, Azuay",
      representanteLegalNombre: "Dr. Cristian Zamora Matute (Alcalde)",
      funcionarioNombre: "Ing. Carlos Alberto Morales Viteri",
      funcionarioCedula: "4444444444",
      funcionarioCargo: "Director de TecnologÃ­as de la InformaciÃ³n",
      funcionarioEmail: "carlos.morales@cuenca.gob.ec",
      rolAsignado: "COORDINADOR TITULAR",
      misionVisionInstitucional: "Brindar servicios pÃºblicos de excelencia y transformaciÃ³n digital transparente para los ciudadanos de Cuenca.",
      clausulasAceptadas: true,
      ciudadFirma: "Cuenca",
      fechaFirma: "29/09/2026",
      firmadoPorRepresentante: true,
      firmadoPorFuncionario: true,
      archivoAcuerdoFirmado: "ARP-R02_Acuerdo_Uso_Confidencialidad_Firmado.pdf"
    }
  },

  // CASO 1.4: PENDIENTE POR REVISAR (Ministerio de Finanzas - Anexo A)
  {
    id: "SOL-ING-111",
    tipoTramite: "PROCESO_A_REGISTRO_INSTITUCION",
    codigoDocumental: "ARP-R01",
    tituloTramite: "Solicitud de Acceso SINARP (Registro InstituciÃ³n)",
    cedula: "1716667779",
    nombres: "Andrea",
    apellidos: "Moncayo",
    nombreCompleto: "Andrea Moncayo",
    iniciales: "AM",
    correo: "andrea.moncayo@finanzas.gob.ec",
    institucion: "Ministerio de EconomÃ­a y Finanzas",
    fechaSolicitud: "29/09/2026 09:20",
    estado: "EN_REVISION_GESTION",
    revisorGestion: "Revisor GestiÃ³n",
    revisor: "Revisor GestiÃ³n",
    fechaAsignacionGestion: "29/09/2026 09:50",
    observacionesAsignacion: "Revisar interoperabilidad con e-SIGEF.",
    revisionIniciada: false,
    documentos: ["ARP-R01_Solicitud_Acceso_MEF.pdf"],
    historial: [
      {
        id: "h-ing-111",
        fechaHora: "29/09/2026 09:20",
        accion: "Ingreso de trÃ¡mite",
        realizadoPor: "Andrea Moncayo",
        rol: "Solicitante Institucional",
        detalles: "Ingreso de formulario ARP-R01."
      },
      {
        id: "h-asig-111",
        fechaHora: "29/09/2026 09:50",
        accion: "AsignaciÃ³n de trÃ¡mite",
        realizadoPor: "Director GestiÃ³n",
        rol: "Director / Coordinador",
        detalles: "Asignado a Revisor GestiÃ³n."
      }
    ],
    anexoA: {
      entidadTipo: "Publica",
      nombreEntidad: "Ministerio de EconomÃ­a y Finanzas",
      rucEntidad: "1760001040001",
      direccionEntidad: "Av. 10 de Agosto y Jorge Washington, Quito",
      objetoSocial: "GestiÃ³n financiera del Estado",
      representanteLegalNombre: "Econ. Juan Carlos Vega",
      representanteLegalCargo: "Ministro",
      representanteLegalEmail: "ministro@finanzas.gob.ec",
      esDelegado: false,
      titularNombreCompleto: "Andrea Moncayo",
      titularCedula: "1716667779",
      titularCargo: "Directora de TecnologÃ­a",
      titularAreaUnidad: "TecnologÃ­a",
      titularEmail: "andrea.moncayo@finanzas.gob.ec",
      titularTelefonoFijo: "023998800",
      titularMovilInstitucional: "0994445566",
      titularMovilPersonal: "0983332211",
      suplenteNombreCompleto: "CÃ©sar Andrade",
      suplenteCedula: "1715554443",
      suplenteCargo: "Analista de IntegraciÃ³n",
      suplenteAreaUnidad: "TecnologÃ­a",
      suplenteEmail: "cesar.andrade@finanzas.gob.ec",
      suplenteTelefonoFijo: "023998800",
      suplenteMovilInstitucional: "0996667788",
      suplenteMovilPersonal: "0981112233",
      serviciosHerramientas: ["Ficha de InformaciÃ³n Ciudadana"],
      areasUso: "TesorerÃ­a Nacional",
      procesosUso: "Control de pagos del sector pÃºblico",
      declaracionesAceptadas: true,
      ciudadFirma: "Quito D.M.",
      fechaFirma: "29/09/2026",
      firmadoDigitalmente: true,
      archivoDocumentoFirmado: "ARP-R01_Solicitud_Acceso_MEF.pdf"
    }
  },

  // CASO 1.5: PENDIENTE POR REVISAR (CNE - Anexo C)
  {
    id: "SOL-ING-112",
    tipoTramite: "PROCESO_C_CAMBIO_COORDINADOR",
    codigoDocumental: "ARP-R03",
    tituloTramite: "Cambio de Coordinador Institucional (ARP-R03)",
    cedula: "1718889995",
    nombres: "Diana",
    apellidos: "Atamaint",
    nombreCompleto: "Diana Atamaint",
    iniciales: "DA",
    correo: "datamaint@cne.gob.ec",
    institucion: "Consejo Nacional Electoral",
    fechaSolicitud: "29/09/2026 10:00",
    estado: "EN_REVISION_GESTION",
    revisorGestion: "Revisor GestiÃ³n",
    revisor: "Revisor GestiÃ³n",
    fechaAsignacionGestion: "29/09/2026 10:20",
    observacionesAsignacion: "Validar cambio de suplente por renuncia.",
    revisionIniciada: false,
    documentos: ["ARP-R03_Cambio_Coordinador_CNE.pdf"],
    historial: [
      {
        id: "h-ing-112",
        fechaHora: "29/09/2026 10:00",
        accion: "Ingreso de trÃ¡mite",
        realizadoPor: "Diana Atamaint",
        rol: "Solicitante Institucional",
        detalles: "Ingreso formal de formulario ARP-R03."
      },
      {
        id: "h-asig-112",
        fechaHora: "29/09/2026 10:20",
        accion: "AsignaciÃ³n de trÃ¡mite",
        realizadoPor: "Director GestiÃ³n",
        rol: "Director / Coordinador",
        detalles: "Asignado a Revisor GestiÃ³n."
      }
    ],
    anexoC: {
      nombreEntidad: "Consejo Nacional Electoral",
      representanteLegalNombre: "Ing. Diana Atamaint",
      esDelegado: false,
      aplicaCambioTitular: false,
      aplicaCambioSuplente: true,
      aplicaDesignacionInicialSuplente: false,
      nuevoSuplenteNombre: "Ing. PaÃºl CÃ³rdova",
      nuevoSuplenteCedula: "1719990001",
      nuevoSuplenteCargo: "Coordinador de Voto TelemÃ¡tico",
      nuevoSuplenteMotivo: "Renuncia del titular anterior",
      nuevoSuplenteEmail: "paul.cordova@cne.gob.ec",
      ciudadFirma: "Quito D.M.",
      fechaFirma: "29/09/2026",
      firmadoDigitalmente: true,
      archivoDocumentoFirmado: "ARP-R03_Cambio_Coordinador_CNE.pdf"
    }
  },

  // CASO 1.6: PENDIENTE POR REVISAR (PolicÃ­a Nacional - Anexo A)
  {
    id: "SOL-ING-113",
    tipoTramite: "PROCESO_A_REGISTRO_INSTITUCION",
    codigoDocumental: "ARP-R01",
    tituloTramite: "Solicitud de Acceso SINARP (Registro InstituciÃ³n)",
    cedula: "1715551122",
    nombres: "Geovanny",
    apellidos: "Ponce",
    nombreCompleto: "Geovanny Ponce",
    iniciales: "GP",
    correo: "geovanny.ponce@policia.gob.ec",
    institucion: "PolicÃ­a Nacional del Ecuador",
    fechaSolicitud: "29/09/2026 10:30",
    estado: "EN_REVISION_GESTION",
    revisorGestion: "Revisor GestiÃ³n",
    revisor: "Revisor GestiÃ³n",
    fechaAsignacionGestion: "29/09/2026 11:00",
    observacionesAsignacion: "Prioridad alta para DirecciÃ³n Nacional de InvestigaciÃ³n Criminal.",
    revisionIniciada: false,
    documentos: ["ARP-R01_Solicitud_Acceso_Policia.pdf"],
    historial: [
      {
        id: "h-ing-113",
        fechaHora: "29/09/2026 10:30",
        accion: "Ingreso de trÃ¡mite",
        realizadoPor: "Geovanny Ponce",
        rol: "Solicitante Institucional",
        detalles: "Ingreso de formulario ARP-R01."
      },
      {
        id: "h-asig-113",
        fechaHora: "29/09/2026 11:00",
        accion: "AsignaciÃ³n de trÃ¡mite",
        realizadoPor: "Director GestiÃ³n",
        rol: "Director / Coordinador",
        detalles: "Asignado a Revisor GestiÃ³n."
      }
    ],
    anexoA: {
      entidadTipo: "Publica",
      nombreEntidad: "PolicÃ­a Nacional del Ecuador",
      rucEntidad: "1768000540001",
      direccionEntidad: "Av. Amazonas y JapÃ³n, Quito",
      objetoSocial: "Seguridad ciudadana y orden pÃºblico",
      representanteLegalNombre: "Gral. CÃ©sar Zapata",
      representanteLegalCargo: "Comandante General",
      representanteLegalEmail: "comandancia@policia.gob.ec",
      esDelegado: false,
      titularNombreCompleto: "Geovanny Ponce",
      titularCedula: "1715551122",
      titularCargo: "Director de TecnologÃ­as de la InformaciÃ³n",
      titularAreaUnidad: "DNTIC",
      titularEmail: "geovanny.ponce@policia.gob.ec",
      titularTelefonoFijo: "022447070",
      titularMovilInstitucional: "0998877112",
      titularMovilPersonal: "0987766223",
      suplenteNombreCompleto: "Mayr. Fernando Salas",
      suplenteCedula: "1714443355",
      suplenteCargo: "Jefe de Ciberseguridad",
      suplenteAreaUnidad: "DNTIC",
      suplenteEmail: "fernando.salas@policia.gob.ec",
      suplenteTelefonoFijo: "022447070",
      suplenteMovilInstitucional: "0991122445",
      suplenteMovilPersonal: "0983344556",
      serviciosHerramientas: ["Consulta de datos de identidad y estado civil", "Consulta de defunciones"],
      areasUso: "InvestigaciÃ³n Policial",
      procesosUso: "VerificaciÃ³n de antecedentes e identidad en operativos",
      declaracionesAceptadas: true,
      ciudadFirma: "Quito D.M.",
      fechaFirma: "29/09/2026",
      firmadoDigitalmente: true,
      archivoDocumentoFirmado: "ARP-R01_Solicitud_Acceso_Policia.pdf"
    }
  },

  // CASO 1.7: PENDIENTE POR REVISAR (BCE - Anexo B)
  {
    id: "SOL-ING-114",
    tipoTramite: "PROCESO_B_ENROLAMIENTO_COORDINADOR",
    codigoDocumental: "ARP-R02",
    tituloTramite: "Acuerdo de Confidencialidad (Enrolamiento)",
    cedula: "1713337778",
    nombres: "Guillermo",
    apellidos: "AvellÃ¡n",
    nombreCompleto: "Guillermo AvellÃ¡n",
    iniciales: "GA",
    correo: "gavellan@bce.ec",
    institucion: "Banco Central del Ecuador",
    fechaSolicitud: "29/09/2026 11:15",
    estado: "EN_REVISION_GESTION",
    revisorGestion: "Revisor GestiÃ³n",
    revisor: "Revisor GestiÃ³n",
    fechaAsignacionGestion: "29/09/2026 11:30",
    observacionesAsignacion: "Revisar clÃ¡usulas de sigilo bancario en el acuerdo.",
    revisionIniciada: false,
    documentos: ["ARP-R02_Acuerdo_Confidencialidad_BCE.pdf"],
    historial: [
      {
        id: "h-ing-114",
        fechaHora: "29/09/2026 11:15",
        accion: "Ingreso de trÃ¡mite",
        realizadoPor: "Guillermo AvellÃ¡n",
        rol: "Solicitante Institucional",
        detalles: "Ingreso formal de ARP-R02."
      },
      {
        id: "h-asig-114",
        fechaHora: "29/09/2026 11:30",
        accion: "AsignaciÃ³n de trÃ¡mite",
        realizadoPor: "Director GestiÃ³n",
        rol: "Director / Coordinador",
        detalles: "Asignado a Revisor GestiÃ³n."
      }
    ],
    anexoB: {
      nombreEntidad: "Banco Central del Ecuador",
      domicilioEntidad: "Av. 10 de Agosto y BriceÃ±o, Quito",
      representanteLegalNombre: "Econ. Tatiana RodrÃ­guez",
      funcionarioNombre: "Guillermo AvellÃ¡n",
      funcionarioCedula: "1713337778",
      funcionarioCargo: "Gerente de Operaciones",
      funcionarioEmail: "gavellan@bce.ec",
      rolAsignado: "COORDINADOR TITULAR",
      misionVisionInstitucional: "Instrumentar la polÃ­tica monetaria y financiera nacional.",
      clausulasAceptadas: true,
      ciudadFirma: "Quito D.M.",
      fechaFirma: "29/09/2026",
      firmadoPorRepresentante: true,
      firmadoPorFuncionario: true,
      archivoAcuerdoFirmado: "ARP-R02_Acuerdo_Confidencialidad_BCE.pdf"
    }
  },

  // CASO 1.8: PENDIENTE POR REVISAR (Registro Civil - Anexo A)
  {
    id: "SOL-ING-115",
    tipoTramite: "PROCESO_A_REGISTRO_INSTITUCION",
    codigoDocumental: "ARP-R01",
    tituloTramite: "Solicitud de Acceso SINARP (Registro InstituciÃ³n)",
    cedula: "1714448889",
    nombres: "OttÃ³n",
    apellidos: "Cevallos",
    nombreCompleto: "OttÃ³n Cevallos",
    iniciales: "OC",
    correo: "otton.cevallos@registrocivil.gob.ec",
    institucion: "DirecciÃ³n General de Registro Civil",
    fechaSolicitud: "29/09/2026 11:45",
    estado: "EN_REVISION_GESTION",
    revisorGestion: "Revisor GestiÃ³n",
    revisor: "Revisor GestiÃ³n",
    fechaAsignacionGestion: "29/09/2026 12:00",
    observacionesAsignacion: "Verificar cruce de datos de defunciones y cedulaciÃ³n.",
    revisionIniciada: false,
    documentos: ["ARP-R01_Solicitud_Acceso_DIGERCIC.pdf"],
    historial: [
      {
        id: "h-ing-115",
        fechaHora: "29/09/2026 11:45",
        accion: "Ingreso de trÃ¡mite",
        realizadoPor: "OttÃ³n Cevallos",
        rol: "Solicitante Institucional",
        detalles: "Ingreso de formulario ARP-R01."
      },
      {
        id: "h-asig-115",
        fechaHora: "29/09/2026 12:00",
        accion: "AsignaciÃ³n de trÃ¡mite",
        realizadoPor: "Director GestiÃ³n",
        rol: "Director / Coordinador",
        detalles: "Asignado a Revisor GestiÃ³n."
      }
    ],
    anexoA: {
      entidadTipo: "Publica",
      nombreEntidad: "DirecciÃ³n General de Registro Civil, IdentificaciÃ³n y CedulaciÃ³n",
      rucEntidad: "1768037230001",
      direccionEntidad: "Av. Amazonas N37-61 y Villalengua, Quito",
      objetoSocial: "IdentificaciÃ³n y registro de hechos y actos del estado civil",
      representanteLegalNombre: "Ing. OttÃ³n Cevallos",
      representanteLegalCargo: "Director General",
      representanteLegalEmail: "direccion@registrocivil.gob.ec",
      esDelegado: false,
      titularNombreCompleto: "OttÃ³n Cevallos",
      titularCedula: "1714448889",
      titularCargo: "Director de TecnologÃ­as",
      titularAreaUnidad: "TecnologÃ­a",
      titularEmail: "otton.cevallos@registrocivil.gob.ec",
      titularTelefonoFijo: "023731110",
      titularMovilInstitucional: "0998889990",
      titularMovilPersonal: "0987778889",
      suplenteNombreCompleto: "Ing. Lorena Romero",
      suplenteCedula: "1715556660",
      suplenteCargo: "Jefa de Datos",
      suplenteAreaUnidad: "TecnologÃ­a",
      suplenteEmail: "lorena.romero@registrocivil.gob.ec",
      suplenteTelefonoFijo: "023731110",
      suplenteMovilInstitucional: "0991113335",
      suplenteMovilPersonal: "0982224446",
      serviciosHerramientas: ["Ficha de InformaciÃ³n Ciudadana"],
      areasUso: "IdentificaciÃ³n Ciudadana",
      procesosUso: "VerificaciÃ³n biomÃ©trica y registral",
      declaracionesAceptadas: true,
      ciudadFirma: "Quito D.M.",
      fechaFirma: "29/09/2026",
      firmadoDigitalmente: true,
      archivoDocumentoFirmado: "ARP-R01_Solicitud_Acceso_DIGERCIC.pdf"
    }
  },

  // CASO 1.9: PENDIENTE POR REVISAR (Ministerio del Ambiente - Anexo A)
  {
    id: "SOL-ING-116",
    tipoTramite: "PROCESO_A_REGISTRO_INSTITUCION",
    codigoDocumental: "ARP-R01",
    tituloTramite: "Solicitud de Acceso SINARP (Registro InstituciÃ³n)",
    cedula: "1716669991",
    nombres: "Sade",
    apellidos: "Fritschi",
    nombreCompleto: "Sade Fritschi",
    iniciales: "SF",
    correo: "sade.fritschi@ambiente.gob.ec",
    institucion: "Ministerio del Ambiente, Agua y TransiciÃ³n EcolÃ³gica",
    fechaSolicitud: "29/09/2026 12:10",
    estado: "EN_REVISION_GESTION",
    revisorGestion: "Revisor GestiÃ³n",
    revisor: "Revisor GestiÃ³n",
    fechaAsignacionGestion: "29/09/2026 12:30",
    observacionesAsignacion: "Revisar autorizaciones de permisos ambientales.",
    revisionIniciada: false,
    documentos: ["ARP-R01_Solicitud_Acceso_MAATE.pdf"],
    historial: [
      {
        id: "h-ing-116",
        fechaHora: "29/09/2026 12:10",
        accion: "Ingreso de trÃ¡mite",
        realizadoPor: "Sade Fritschi",
        rol: "Solicitante Institucional",
        detalles: "Ingreso de formulario ARP-R01."
      },
      {
        id: "h-asig-116",
        fechaHora: "29/09/2026 12:30",
        accion: "AsignaciÃ³n de trÃ¡mite",
        realizadoPor: "Director GestiÃ³n",
        rol: "Director / Coordinador",
        detalles: "Asignado a Revisor GestiÃ³n."
      }
    ],
    anexoA: {
      entidadTipo: "Publica",
      nombreEntidad: "Ministerio del Ambiente, Agua y TransiciÃ³n EcolÃ³gica",
      rucEntidad: "1768153340001",
      direccionEntidad: "Calle Madrid 1159 y AndalucÃ­a, Quito",
      objetoSocial: "GestiÃ³n ambiental nacional",
      representanteLegalNombre: "Mgs. Sade Fritschi",
      representanteLegalCargo: "Ministra",
      representanteLegalEmail: "ministra@ambiente.gob.ec",
      esDelegado: false,
      titularNombreCompleto: "Sade Fritschi",
      titularCedula: "1716669991",
      titularCargo: "Directora de Sistemas",
      titularAreaUnidad: "TecnologÃ­a",
      titularEmail: "sade.fritschi@ambiente.gob.ec",
      titularTelefonoFijo: "023987600",
      titularMovilInstitucional: "0994443322",
      titularMovilPersonal: "0983332211",
      suplenteNombreCompleto: "Carlos Viteri",
      suplenteCedula: "1717778882",
      suplenteCargo: "Especialista SIG",
      suplenteAreaUnidad: "TecnologÃ­a",
      suplenteEmail: "carlos.viteri@ambiente.gob.ec",
      suplenteTelefonoFijo: "023987600",
      suplenteMovilInstitucional: "0995554433",
      suplenteMovilPersonal: "0984443322",
      serviciosHerramientas: ["Consulta de datos de identidad y estado civil"],
      areasUso: "Licencias Ambientales",
      procesosUso: "VerificaciÃ³n de personerÃ­a de proponentes",
      declaracionesAceptadas: true,
      ciudadFirma: "Quito D.M.",
      fechaFirma: "29/09/2026",
      firmadoDigitalmente: true,
      archivoDocumentoFirmado: "ARP-R01_Solicitud_Acceso_MAATE.pdf"
    }
  },

  // CASO 1.10: PENDIENTE POR REVISAR (Corte Nacional de Justicia - Anexo A)
  {
    id: "SOL-ING-117",
    tipoTramite: "PROCESO_A_REGISTRO_INSTITUCION",
    codigoDocumental: "ARP-R01",
    tituloTramite: "Solicitud de Acceso SINARP (Registro InstituciÃ³n)",
    cedula: "1712229990",
    nombres: "JosÃ©",
    apellidos: "Suing",
    nombreCompleto: "JosÃ© Suing",
    iniciales: "JS",
    correo: "jose.suing@cortenacional.gob.ec",
    institucion: "Corte Nacional de Justicia",
    fechaSolicitud: "29/09/2026 12:45",
    estado: "EN_REVISION_GESTION",
    revisorGestion: "Revisor GestiÃ³n",
    revisor: "Revisor GestiÃ³n",
    fechaAsignacionGestion: "29/09/2026 13:00",
    revisionIniciada: false,
    documentos: ["ARP-R01_Solicitud_Acceso_CNJ.pdf"],
    historial: [
      {
        id: "h-ing-117",
        fechaHora: "29/09/2026 12:45",
        accion: "Ingreso de trÃ¡mite",
        realizadoPor: "JosÃ© Suing",
        rol: "Solicitante Institucional",
        detalles: "Ingreso de formulario ARP-R01."
      },
      {
        id: "h-asig-117",
        fechaHora: "29/09/2026 13:00",
        accion: "AsignaciÃ³n de trÃ¡mite",
        realizadoPor: "Director GestiÃ³n",
        rol: "Director / Coordinador",
        detalles: "Asignado a Revisor GestiÃ³n."
      }
    ],
    anexoA: {
      entidadTipo: "Publica",
      nombreEntidad: "Corte Nacional de Justicia",
      rucEntidad: "1768097440001",
      direccionEntidad: "Av. Amazonas N37-101 y Villalengua, Quito",
      objetoSocial: "AdministraciÃ³n de justicia ordinaria",
      representanteLegalNombre: "Dr. JosÃ© Suing Nagua",
      representanteLegalCargo: "Presidente",
      representanteLegalEmail: "presidencia@cortenacional.gob.ec",
      esDelegado: false,
      titularNombreCompleto: "JosÃ© Suing",
      titularCedula: "1712229990",
      titularCargo: "Director de TI",
      titularAreaUnidad: "TecnologÃ­a",
      titularEmail: "jose.suing@cortenacional.gob.ec",
      titularTelefonoFijo: "023953500",
      titularMovilInstitucional: "0997778899",
      titularMovilPersonal: "0986667788",
      suplenteNombreCompleto: "Ing. Xavier BenÃ­tez",
      suplenteCedula: "1713335557",
      suplenteCargo: "Jefe de Infraestructura",
      suplenteAreaUnidad: "TecnologÃ­a",
      suplenteEmail: "xavier.benitez@cortenacional.gob.ec",
      suplenteTelefonoFijo: "023953500",
      suplenteMovilInstitucional: "0998881122",
      suplenteMovilPersonal: "0981119900",
      serviciosHerramientas: ["Consulta de datos de identidad y estado civil"],
      areasUso: "Salas de CasaciÃ³n",
      procesosUso: "Consulta para sentencias y autos resolutorios",
      declaracionesAceptadas: true,
      ciudadFirma: "Quito D.M.",
      fechaFirma: "29/09/2026",
      firmadoDigitalmente: true,
      archivoDocumentoFirmado: "ARP-R01_Solicitud_Acceso_CNJ.pdf"
    }
  },

  // CASO 2: REVISIÃ“N INICIADA (El revisor ya ingresÃ³ y se encuentra validando activamente el expediente)
  {
    id: "SOL-ING-104",
    tipoTramite: "PROCESO_A_REGISTRO_INSTITUCION",
    codigoDocumental: "ARP-R01",
    tituloTramite: "Solicitud de Acceso SINARP (Registro InstituciÃ³n)",
    cedula: "1714443322",
    nombres: "Mariana",
    apellidos: "Almeida CÃ¡rdenas",
    nombreCompleto: "Mariana Almeida CÃ¡rdenas",
    iniciales: "MA",
    correo: "mariana.almeida@educacion.gob.ec",
    institucion: "Ministerio de EducaciÃ³n",
    fechaSolicitud: "28/09/2026 08:30",
    estado: "PENDIENTE_ASIGNACION_NORMATIVIDAD",
    revisorGestion: "Revisor GestiÃ³n",
    revisor: "Revisor GestiÃ³n",
    fechaAsignacionGestion: "28/09/2026 09:00",
    observacionesAsignacion: "Verificar datos del titular y suplente para consulta de tÃ­tulos acadÃ©micos.",
    revisionIniciada: true,
    documentos: ["ARP-R01_Solicitud_Acceso_MINEDUC.pdf"],
    historial: [
      {
        id: "h-ing-104",
        fechaHora: "28/09/2026 08:30",
        accion: "Ingreso de trÃ¡mite",
        realizadoPor: "Mariana Almeida CÃ¡rdenas",
        rol: "Solicitante Institucional",
        detalles: "Formulario oficial ARP-R01 ingresado formalmente al sistema."
      },
      {
        id: "h-asig-104",
        fechaHora: "28/09/2026 09:00",
        accion: "AsignaciÃ³n de trÃ¡mite",
        realizadoPor: "Director GestiÃ³n",
        rol: "Director / Coordinador",
        detalles: "TrÃ¡mite asignado a Revisor GestiÃ³n. Verificar datos del titular y suplente para consulta de tÃ­tulos acadÃ©micos."
      },
      {
        id: "h-rev-104",
        fechaHora: "28/09/2026 09:40",
        accion: "RevisiÃ³n tÃ©cnica iniciada",
        realizadoPor: "Revisor GestiÃ³n",
        rol: "Revisor de GestiÃ³n",
        detalles: "El revisor Revisor GestiÃ³n ha iniciado formalmente la verificaciÃ³n tÃ©cnica y documental del expediente."
      }
    ],
    anexoA: {
      entidadTipo: "Publica",
      nombreEntidad: "Ministerio de EducaciÃ³n",
      rucEntidad: "1760000820001",
      direccionEntidad: "Av. Amazonas N34-451 y Atahualpa, Quito",
      objetoSocial: "Garantizar el acceso y calidad de la educaciÃ³n nacional inicial, bÃ¡sica y bachillerato.",
      representanteLegalNombre: "Dra. MarÃ­a Brown PÃ©rez",
      representanteLegalCargo: "Ministra de EducaciÃ³n",
      representanteLegalEmail: "ministra@educacion.gob.ec",
      esDelegado: false,
      titularNombreCompleto: "Mariana Almeida CÃ¡rdenas",
      titularCedula: "1714443322",
      titularCargo: "Directora Nacional de TecnologÃ­as de la InformaciÃ³n",
      titularAreaUnidad: "DirecciÃ³n de TI",
      titularEmail: "mariana.almeida@educacion.gob.ec",
      titularTelefonoFijo: "023961300",
      titularMovilInstitucional: "0998877665",
      titularMovilPersonal: "0987766554",
      suplenteNombreCompleto: "Jorge AndrÃ©s Morales",
      suplenteCedula: "1713332211",
      suplenteCargo: "Analista de Seguridad de la InformaciÃ³n",
      suplenteAreaUnidad: "DirecciÃ³n de TI",
      suplenteEmail: "jorge.morales@educacion.gob.ec",
      suplenteTelefonoFijo: "023961300",
      suplenteMovilInstitucional: "0991122334",
      suplenteMovilPersonal: "0982233445",
      serviciosHerramientas: ["Consulta de datos de identidad y estado civil", "Consulta de defunciones"],
      areasUso: "MatriculaciÃ³n y CertificaciÃ³n",
      procesosUso: "ValidaciÃ³n registral de postulantes y emisiÃ³n de certificados estudiantiles.",
      declaracionesAceptadas: true,
      ciudadFirma: "Quito D.M.",
      fechaFirma: "28/09/2026",
      firmadoDigitalmente: true,
      archivoDocumentoFirmado: "ARP-R01_Solicitud_Acceso_MINEDUC.pdf"
    }
  },

  // CASO 3: APROBADO POR GESTIÃ“N â†’ PENDIENTE ASIGNACIÃ“N EN NORMATIVIDAD
  {
    id: "SOL-ING-102",
    tipoTramite: "PROCESO_A_REGISTRO_INSTITUCION",
    codigoDocumental: "ARP-R01",
    tituloTramite: "Solicitud de Acceso SINARP (Registro InstituciÃ³n)",
    cedula: "1709998887",
    nombres: "Roberto",
    apellidos: "GarcÃ­a",
    nombreCompleto: "Roberto GarcÃ­a",
    iniciales: "RG",
    correo: "roberto.garcia@salud.gob.ec",
    institucion: "Ministerio de Salud PÃºblica",
    fechaSolicitud: "25/09/2026 14:20",
    estado: "PENDIENTE_ASIGNACION_NORMATIVIDAD",
    revisorGestion: "Revisor GestiÃ³n",
    revisor: "Revisor GestiÃ³n",
    revisionIniciada: true,
    fechaAsignacionGestion: "25/09/2026 15:00",
    fechaRevision: "26/09/2026 10:30",
    fechaAprobacionGestion: "26/09/2026 10:30",
    documentos: ["ARP-R01_Solicitud_Acceso_MSP.pdf"],
    historial: [
      {
        id: "h-ing-102",
        fechaHora: "25/09/2026 14:20",
        accion: "Ingreso de trÃ¡mite",
        realizadoPor: "Roberto GarcÃ­a",
        rol: "Solicitante Institucional",
        detalles: "Ingreso formal de solicitud de registro institucional para consumo de interoperabilidad."
      },
      {
        id: "h-asig-102",
        fechaHora: "25/09/2026 15:00",
        accion: "AsignaciÃ³n de trÃ¡mite",
        realizadoPor: "Director GestiÃ³n",
        rol: "Director / Coordinador",
        detalles: "Asignado a Revisor GestiÃ³n para control formal y documental."
      },
      {
        id: "h-rev-102",
        fechaHora: "26/09/2026 09:15",
        accion: "RevisiÃ³n tÃ©cnica iniciada",
        realizadoPor: "Revisor GestiÃ³n",
        rol: "Revisor de GestiÃ³n",
        detalles: "El revisor Revisor GestiÃ³n ha iniciado formalmente la verificaciÃ³n tÃ©cnica y documental del expediente."
      },
      {
        id: "h1-102",
        fechaHora: "26/09/2026 10:30",
        accion: "Solicitud aprobada por GestiÃ³n",
        realizadoPor: "Revisor GestiÃ³n",
        rol: "Revisor de GestiÃ³n",
        detalles: "DocumentaciÃ³n legal y tÃ©cnica conforme a la normativa SINARP. Expediente remitido a Normatividad para asignaciÃ³n jurÃ­dica."
      }
    ],
    anexoA: {
      entidadTipo: "Publica",
      nombreEntidad: "Ministerio de Salud PÃºblica",
      rucEntidad: "1760001120001",
      direccionEntidad: "Av. Quitumbe Ã‘an, Quito",
      objetoSocial: "Salud pÃºblica",
      representanteLegalNombre: "Dr. JosÃ© Ruales",
      representanteLegalCargo: "Ministro de Salud",
      representanteLegalEmail: "ministro@salud.gob.ec",
      esDelegado: false,
      titularNombreCompleto: "Roberto GarcÃ­a",
      titularCedula: "1709998887",
      titularCargo: "Director de TecnologÃ­as",
      titularAreaUnidad: "DNTIC",
      titularEmail: "roberto.garcia@salud.gob.ec",
      titularTelefonoFijo: "023814400",
      titularMovilInstitucional: "0981112233",
      titularMovilPersonal: "0992223344",
      suplenteNombreCompleto: "Marta SÃ¡nchez",
      suplenteCedula: "1718889990",
      suplenteCargo: "Especialista TIC",
      suplenteAreaUnidad: "DNTIC",
      suplenteEmail: "marta.sanchez@salud.gob.ec",
      suplenteTelefonoFijo: "023814400",
      suplenteMovilInstitucional: "0995556677",
      suplenteMovilPersonal: "0986667788",
      serviciosHerramientas: ["Consulta de defunciones"],
      areasUso: "EpidemiologÃ­a",
      procesosUso: "Registro estadÃ­stico",
      declaracionesAceptadas: true,
      ciudadFirma: "Quito D.M.",
      fechaFirma: "25/09/2026",
      firmadoDigitalmente: true,
      archivoDocumentoFirmado: "ARP-R01_Solicitud_Acceso_MSP.pdf"
    }
  },

  // CASO 4: RECHAZADO POR GESTIÃ“N (Observaciones obligatorias, expediente cancelado)
  {
    id: "SOL-ING-103",
    tipoTramite: "PROCESO_A_REGISTRO_INSTITUCION",
    codigoDocumental: "ARP-R01",
    tituloTramite: "Solicitud de Acceso SINARP (Registro InstituciÃ³n)",
    cedula: "1715556667",
    nombres: "Carla",
    apellidos: "Ruiz",
    nombreCompleto: "Carla Ruiz",
    iniciales: "CR",
    correo: "carla.ruiz@miduvi.gob.ec",
    institucion: "Ministerio de Desarrollo Urbano y Vivienda",
    fechaSolicitud: "27/09/2026 11:10",
    estado: "Cancelada",
    revisorGestion: "Revisor GestiÃ³n",
    revisor: "Revisor GestiÃ³n",
    revisionIniciada: true,
    fechaAsignacionGestion: "27/09/2026 11:45",
    fechaRevision: "28/09/2026 15:45",
    motivoRechazo: "La firma electrÃ³nica en el Anexo A estÃ¡ caducada y no corresponde al representante legal registrado ante la entidad de control.",
    rechazadoPor: "GESTION",
    documentos: ["ARP-R01_Solicitud_Acceso_MIDUVI.pdf"],
    historial: [
      {
        id: "h-ing-103",
        fechaHora: "27/09/2026 11:10",
        accion: "Ingreso de trÃ¡mite",
        realizadoPor: "Carla Ruiz",
        rol: "Solicitante Institucional",
        detalles: "Ingreso de formulario ARP-R01."
      },
      {
        id: "h-asig-103",
        fechaHora: "27/09/2026 11:45",
        accion: "AsignaciÃ³n de trÃ¡mite",
        realizadoPor: "Director GestiÃ³n",
        rol: "Director / Coordinador",
        detalles: "Asignado a Revisor GestiÃ³n."
      },
      {
        id: "h-rev-103",
        fechaHora: "28/09/2026 14:00",
        accion: "RevisiÃ³n tÃ©cnica iniciada",
        realizadoPor: "Revisor GestiÃ³n",
        rol: "Revisor de GestiÃ³n",
        detalles: "El revisor Revisor GestiÃ³n ha iniciado formalmente la verificaciÃ³n tÃ©cnica y documental del expediente."
      },
      {
        id: "h2-103",
        fechaHora: "28/09/2026 15:45",
        accion: "Solicitud rechazada por GestiÃ³n",
        realizadoPor: "Revisor GestiÃ³n",
        rol: "Equipo de GestiÃ³n",
        detalles: `Motivo:\n"La firma electrÃ³nica en el Anexo A estÃ¡ caducada y no corresponde al representante legal registrado ante la entidad de control."\n\nNotificaciÃ³n:\nInstituciÃ³n notificada por correo electrÃ³nico.`
      }
    ],
    anexoA: {
      entidadTipo: "Publica",
      nombreEntidad: "Ministerio de Desarrollo Urbano y Vivienda",
      rucEntidad: "1768012340001",
      direccionEntidad: "Plataforma Gubernamental Sur, Quito",
      objetoSocial: "Desarrollo urbano y vivienda",
      representanteLegalNombre: "Arq. Gabriela Aguilera",
      representanteLegalCargo: "Ministra",
      representanteLegalEmail: "ministra@miduvi.gob.ec",
      esDelegado: false,
      titularNombreCompleto: "Carla Ruiz",
      titularCedula: "1715556667",
      titularCargo: "Directora de Sistemas",
      titularAreaUnidad: "Sistemas",
      titularEmail: "carla.ruiz@miduvi.gob.ec",
      titularTelefonoFijo: "022983600",
      titularMovilInstitucional: "0982223344",
      titularMovilPersonal: "0993334455",
      suplenteNombreCompleto: "Esteban LÃ³pez",
      suplenteCedula: "1726667778",
      suplenteCargo: "TÃ©cnico TIC",
      suplenteAreaUnidad: "Sistemas",
      suplenteEmail: "esteban.lopez@miduvi.gob.ec",
      suplenteTelefonoFijo: "022983600",
      suplenteMovilInstitucional: "0994445566",
      suplenteMovilPersonal: "0985556677",
      serviciosHerramientas: ["Consulta de bienes"],
      areasUso: "Vivienda Social",
      procesosUso: "VerificaciÃ³n de requisitos",
      declaracionesAceptadas: true,
      ciudadFirma: "Quito D.M.",
      fechaFirma: "27/09/2026",
      firmadoDigitalmente: true,
      archivoDocumentoFirmado: "ARP-R01_Solicitud_Acceso_MIDUVI.pdf"
    }
  },

  // CASO 5: ASIGNADO EN NORMATIVIDAD (PENDIENTE NORMATIVA)
  {
    id: "SOL-ING-105",
    tipoTramite: "PROCESO_B_ENROLAMIENTO_COORDINADOR",
    codigoDocumental: "ARP-R02",
    tituloTramite: "Acuerdo de Confidencialidad (Enrolamiento)",
    cedula: "1719998881",
    nombres: "Gonzalo",
    apellidos: "Paredes",
    nombreCompleto: "Gonzalo Paredes",
    iniciales: "GP",
    correo: "gonzalo.paredes@ant.gob.ec",
    institucion: "Agencia Nacional de TrÃ¡nsito",
    fechaSolicitud: "24/09/2026 10:15",
    estado: "PENDIENTE_ASIGNACION_NORMATIVIDAD",
    revisorGestion: "Revisor GestiÃ³n",
    revisorNormatividad: undefined,
    revisor: "Abg. Diego Morales",
    revisionIniciada: false,
    fechaAsignacionGestion: "24/09/2026 11:00",
    fechaAprobacionGestion: "25/09/2026 09:30",
    fechaAsignacionNormatividad: "25/09/2026 14:00",
    documentos: ["ARP-R02_Acuerdo_Uso_Confidencialidad_ANT.pdf"],
    historial: [
      {
        id: "h-ing-105",
        fechaHora: "24/09/2026 10:15",
        accion: "Ingreso de trÃ¡mite",
        realizadoPor: "Gonzalo Paredes",
        rol: "Solicitante Institucional",
        detalles: "Ingreso de Acuerdo de Confidencialidad ARP-R02."
      },
      {
        id: "h-aprob-gest-105",
        fechaHora: "25/09/2026 09:30",
        accion: "Solicitud aprobada por GestiÃ³n",
        realizadoPor: "Revisor GestiÃ³n",
        rol: "Revisor de GestiÃ³n",
        detalles: "ValidaciÃ³n documental completada conforme. Expediente remitido a Normatividad."
      },
      {
        id: "h-asig-norm-105",
        fechaHora: "25/09/2026 14:00",
        accion: "AsignaciÃ³n jurÃ­dica",
        realizadoPor: "Director Normatividad",
        rol: "Director de Normatividad",
        detalles: "Asignado a Abg. Diego Morales para revisiÃ³n de clÃ¡usulas de confidencialidad."
      }
    ],
    anexoB: {
      nombreEntidad: "Agencia Nacional de TrÃ¡nsito",
      domicilioEntidad: "Av. Antonio JosÃ© de Sucre y Mariscal Sucre, Quito",
      representanteLegalNombre: "Ing. Vanessa Cueva",
      funcionarioNombre: "Gonzalo Paredes",
      funcionarioCedula: "1719998881",
      funcionarioCargo: "Director de TI",
      funcionarioEmail: "gonzalo.paredes@ant.gob.ec",
      rolAsignado: "COORDINADOR TITULAR",
      misionVisionInstitucional: "Garantizar la seguridad vial y transporte terrestre.",
      clausulasAceptadas: true,
      ciudadFirma: "Quito D.M.",
      fechaFirma: "24/09/2026",
      firmadoPorRepresentante: true,
      firmadoPorFuncionario: true,
      archivoAcuerdoFirmado: "ARP-R02_Acuerdo_Uso_Confidencialidad_ANT.pdf"
    }
  },

  // CASO 6: EN REVISIÃ“N JURÃDICA (EN REVISIÃ“N NORMATIVA)
  {
    id: "SOL-ING-106",
    tipoTramite: "PROCESO_A_REGISTRO_INSTITUCION",
    codigoDocumental: "ARP-R01",
    tituloTramite: "Solicitud de Acceso SINARP (Registro InstituciÃ³n)",
    cedula: "1717778889",
    nombres: "Patricia",
    apellidos: "VillacÃ­s",
    nombreCompleto: "Patricia VillacÃ­s",
    iniciales: "PV",
    correo: "patricia.villacis@iess.gob.ec",
    institucion: "Instituto Ecuatoriano de Seguridad Social",
    fechaSolicitud: "23/09/2026 08:45",
    estado: "PENDIENTE_ASIGNACION_NORMATIVIDAD",
    revisorGestion: "Revisor GestiÃ³n",
    revisorNormatividad: undefined,
    revisor: "Abg. Diego Morales",
    revisionIniciada: true,
    fechaAsignacionGestion: "23/09/2026 09:30",
    fechaAprobacionGestion: "24/09/2026 11:20",
    fechaAsignacionNormatividad: "24/09/2026 15:00",
    documentos: ["ARP-R01_Solicitud_Acceso_IESS.pdf"],
    historial: [
      {
        id: "h-aprob-gest-106",
        fechaHora: "24/09/2026 11:20",
        accion: "Solicitud aprobada por GestiÃ³n",
        realizadoPor: "Revisor GestiÃ³n",
        rol: "Revisor de GestiÃ³n",
        detalles: "Control documental aprobado. Pasa a emisiÃ³n de informe jurÃ­dico en Normatividad."
      },
      {
        id: "h-rev-norm-106",
        fechaHora: "25/09/2026 10:15",
        accion: "RevisiÃ³n jurÃ­dica iniciada",
        realizadoPor: "Abg. Diego Morales",
        rol: "Revisor de Normatividad",
        detalles: "El revisor jurÃ­dico ha iniciado el anÃ¡lisis normativo y legal del convenio de interoperabilidad."
      }
    ],
    anexoA: {
      entidadTipo: "Publica",
      nombreEntidad: "Instituto Ecuatoriano de Seguridad Social",
      rucEntidad: "1760004650001",
      direccionEntidad: "Av. 10 de Agosto y BogotÃ¡, Quito",
      objetoSocial: "Seguridad social integral",
      representanteLegalNombre: "Ing. Eduardo PeÃ±a Hurtado",
      representanteLegalCargo: "Presidente del Consejo Directivo",
      representanteLegalEmail: "presidencia@iess.gob.ec",
      esDelegado: false,
      titularNombreCompleto: "Patricia VillacÃ­s",
      titularCedula: "1717778889",
      titularCargo: "Directora Nacional de Servicios Digitales",
      titularAreaUnidad: "TecnologÃ­a",
      titularEmail: "patricia.villacis@iess.gob.ec",
      titularTelefonoFijo: "023945600",
      titularMovilInstitucional: "0991234567",
      titularMovilPersonal: "0987654321",
      suplenteNombreCompleto: "Marco Antonio Silva",
      suplenteCedula: "1716665554",
      suplenteCargo: "Subdirector de Integraciones",
      suplenteAreaUnidad: "TecnologÃ­a",
      suplenteEmail: "marco.silva@iess.gob.ec",
      suplenteTelefonoFijo: "023945600",
      suplenteMovilInstitucional: "0997654321",
      suplenteMovilPersonal: "0981234567",
      serviciosHerramientas: ["Consulta de datos de identidad y estado civil"],
      areasUso: "AfiliaciÃ³n y Pensiones",
      procesosUso: "VerificaciÃ³n de beneficiarios",
      declaracionesAceptadas: true,
      ciudadFirma: "Quito D.M.",
      fechaFirma: "23/09/2026",
      firmadoDigitalmente: true,
      archivoDocumentoFirmado: "ARP-R01_Solicitud_Acceso_IESS.pdf"
    }
  },

  // CASO 7: RECHAZADO POR NORMATIVA (GestiÃ³n lo aprobÃ³, pero Normatividad emitiÃ³ objeciÃ³n legal)
  {
    id: "SOL-ING-107",
    tipoTramite: "PROCESO_C_CAMBIO_COORDINADOR",
    codigoDocumental: "ARP-R03",
    tituloTramite: "Cambio de Coordinador Institucional (ARP-R03)",
    cedula: "1718881112",
    nombres: "Esteban",
    apellidos: "CÃ¡rdenas",
    nombreCompleto: "Esteban CÃ¡rdenas",
    iniciales: "EC",
    correo: "esteban.cardenas@senescyt.gob.ec",
    institucion: "SENESCYT",
    fechaSolicitud: "21/09/2026 12:00",
    estado: "Cancelada",
    revisorGestion: "Revisor GestiÃ³n",
    revisorNormatividad: undefined,
    revisor: "Abg. Diego Morales",
    revisionIniciada: true,
    fechaAsignacionGestion: "21/09/2026 12:30",
    fechaAprobacionGestion: "22/09/2026 10:15",
    fechaAsignacionNormatividad: "22/09/2026 14:00",
    fechaRevision: "23/09/2026 16:30",
    motivoRechazo: "La delegaciÃ³n jurÃ­dica adjunta no faculta al firmante para designar coordinadores institucionales de interoperabilidad.",
    rechazadoPor: "NORMATIVIDAD",
    documentos: ["ARP-R03_Cambio_Coordinador_SENESCYT.pdf", "Accion_Personal_Delegacion.pdf"],
    historial: [
      {
        id: "h-aprob-gest-107",
        fechaHora: "22/09/2026 10:15",
        accion: "Solicitud aprobada por GestiÃ³n",
        realizadoPor: "Revisor GestiÃ³n",
        rol: "Revisor de GestiÃ³n",
        detalles: "RevisiÃ³n documental tÃ©cnica conforme."
      },
      {
        id: "h-rech-norm-107",
        fechaHora: "23/09/2026 16:30",
        accion: "Solicitud rechazada por Normatividad",
        realizadoPor: "Abg. Diego Morales",
        rol: "DirecciÃ³n de Normatividad",
        detalles: "ObjeciÃ³n legal: La delegaciÃ³n jurÃ­dica no faculta al firmante para designar coordinadores."
      }
    ],
    anexoC: {
      nombreEntidad: "SENESCYT",
      representanteLegalNombre: "Dra. Ana ChanguÃ­n",
      esDelegado: true,
      archivoSoporteDelegacion: "Accion_Personal_Delegacion.pdf",
      aplicaCambioTitular: true,
      aplicaCambioSuplente: false,
      aplicaDesignacionInicialSuplente: false,
      nuevoTitularNombre: "Esteban CÃ¡rdenas",
      nuevoTitularCedula: "1718881112",
      nuevoTitularCargo: "Director de TI",
      nuevoTitularMotivo: "Cese de funciones del titular anterior",
      nuevoTitularEmail: "esteban.cardenas@senescyt.gob.ec",
      ciudadFirma: "Quito D.M.",
      fechaFirma: "21/09/2026",
      firmadoDigitalmente: true,
      archivoDocumentoFirmado: "ARP-R03_Cambio_Coordinador_SENESCYT.pdf"
    }
  },

  // CASO 8: INSTITUCIÃ“N ACTIVA (INS-07 culminado: resoluciÃ³n firmada por MÃ¡xima Autoridad, invitaciones B emitidas)
  {
    id: "SOL-ING-108",
    tipoTramite: "PROCESO_A_REGISTRO_INSTITUCION",
    codigoDocumental: "ARP-R01",
    tituloTramite: "Solicitud de Acceso SINARP (Registro InstituciÃ³n)",
    cedula: "1713334445",
    nombres: "Lorena",
    apellidos: "Barahona",
    nombreCompleto: "Lorena Barahona",
    iniciales: "LB",
    correo: "lorena.barahona@sri.gob.ec",
    institucion: "Servicio de Rentas Internas",
    fechaSolicitud: "20/09/2026 10:00",
    estado: "PENDIENTE_ASIGNACION_NORMATIVIDAD",
    revisorGestion: "Revisor GestiÃ³n",
    revisorNormatividad: undefined,
    revisor: "Abg. Diego Morales",
    revisionIniciada: true,
    fechaAsignacionGestion: "20/09/2026 10:45",
    fechaAprobacionGestion: "21/09/2026 11:30",
    fechaAsignacionNormatividad: "21/09/2026 15:00",
    fechaRevision: "22/09/2026 17:00",
    resolucion: "RES-DINARP-2026-0089",
    documentos: [
      "ARP-R01_Solicitud_Acceso_SRI.pdf",
      "Dictamen_Juridico_Favorable.pdf",
      "RES-DINARP-2026-0089_Firmada_MaximaAutoridad.pdf"
    ],
    datosFirmaResolucion: {
      firmante: "Mgs. Christian Ruiz (Director Nacional)",
      cargo: "MÃ¡xima Autoridad DINARP",
      entidad: "DirecciÃ³n Nacional de Registros PÃºblicos",
      entidadCertificadora: "Banco Central del Ecuador (BCE)",
      algoritmo: "SHA-256 with RSA Encryption (2048-bit)",
      fechaHoraFirma: "22/09/2026 18:30:15",
      verificada: true,
      hashDocumento: "a8f94e21b7c093d56701ea93245cfbc9d671"
    },
    invitacionesB: [
      {
        id: "INV-B-2026-0089-TIT",
        solicitudId: "SOL-ING-108",
        destinatarioCedula: "1713334445",
        destinatarioNombre: "Lorena Barahona",
        destinatarioEmail: "lorena.barahona@sri.gob.ec",
        destinatarioCargo: "Directora Nacional de TecnologÃ­a",
        institucion: "Servicio de Rentas Internas",
        rol: "TITULAR",
        token: "tok_sec_opaque_8f7b3a9c1e4d2a0",
        fechaEmision: "22/09/2026 18:32",
        fechaCaducidad: "22/10/2026 23:59",
        estado: "PENDIENTE",
        canalEnvio: "CORREO_ELECTRONICO",
        fechaEnvio: "22/09/2026 18:32"
      },
      {
        id: "INV-B-2026-0089-SUP",
        solicitudId: "SOL-ING-108",
        destinatarioCedula: "1714455667",
        destinatarioNombre: "Carlos Alberto Espinosa",
        destinatarioEmail: "carlos.espinosa@sri.gob.ec",
        destinatarioCargo: "Jefe de Arquitectura de Datos",
        institucion: "Servicio de Rentas Internas",
        rol: "SUPLENTE",
        token: "tok_sec_opaque_9c2e4f6a8b0d1e3",
        fechaEmision: "22/09/2026 18:32",
        fechaCaducidad: "22/10/2026 23:59",
        estado: "PENDIENTE",
        canalEnvio: "CORREO_ELECTRONICO",
        fechaEnvio: "22/09/2026 18:32"
      }
    ],
    historial: [
      {
        id: "h-ing-108",
        fechaHora: "20/09/2026 10:00",
        accion: "Anexo A completado",
        realizadoPor: "Econ. DamiÃ¡n Larco",
        rol: "Representante Legal",
        detalles: "Formulario de Registro de InstituciÃ³n ARP-R01 completado en el Portal."
      },
      {
        id: "h-firmaec-108",
        fechaHora: "20/09/2026 10:15",
        accion: "Firma del Anexo A verificada",
        realizadoPor: "FirmaEC Â· Servicio de CertificaciÃ³n",
        rol: "Sistema",
        detalles: "Firma electrÃ³nica de Representante Legal verificada correctamente."
      },
      {
        id: "h-env-gest-108",
        fechaHora: "20/09/2026 10:20",
        accion: "Solicitud enviada a GestiÃ³n",
        realizadoPor: "Portal DINARP",
        rol: "Sistema",
        detalles: "Expediente digital verificado e ingresado a la DirecciÃ³n de GestiÃ³n y Registro."
      },
      {
        id: "h-asig-gest-108",
        fechaHora: "20/09/2026 10:45",
        accion: "Revisor de GestiÃ³n asignado",
        realizadoPor: "Director de GestiÃ³n",
        rol: "Director de GestiÃ³n",
        detalles: "Asignado a Revisor GestiÃ³n para anÃ¡lisis documental y tÃ©cnico."
      },
      {
        id: "h-rev-gest-108",
        fechaHora: "20/09/2026 11:00",
        accion: "RevisiÃ³n iniciada",
        realizadoPor: "Revisor GestiÃ³n",
        rol: "Revisor de GestiÃ³n",
        detalles: "RevisiÃ³n de requisitos y personerÃ­a jurÃ­dica del solicitante en curso."
      },
      {
        id: "h-aprob-gest-108",
        fechaHora: "21/09/2026 11:30",
        accion: "Solicitud aprobada por GestiÃ³n",
        realizadoPor: "Revisor GestiÃ³n",
        rol: "Revisor de GestiÃ³n",
        detalles: "ValidaciÃ³n de formularios y firmas conforme. Expediente remitido a Normatividad."
      },
      {
        id: "h-env-norm-108",
        fechaHora: "21/09/2026 11:35",
        accion: "Enviada a Normatividad",
        realizadoPor: "Sistema DINARP",
        rol: "Sistema",
        detalles: "Expediente derivado a la DirecciÃ³n de Normatividad y Convenios."
      },
      {
        id: "h-asig-norm-108",
        fechaHora: "21/09/2026 15:00",
        accion: "Responsable de Normatividad asignado",
        realizadoPor: "Director de Normatividad",
        rol: "Director de Normatividad",
        detalles: "Asignado a Abg. Diego Morales para formulaciÃ³n de resoluciÃ³n jurÃ­dica."
      },
      {
        id: "h-inicia-res-108",
        fechaHora: "22/09/2026 09:30",
        accion: "GeneraciÃ³n de resoluciÃ³n iniciada",
        realizadoPor: "Abg. Diego Morales",
        rol: "Revisor de Normatividad",
        detalles: "RedacciÃ³n de considerandos y articulado resolutivo institucional."
      },
      {
        id: "h-aprob-norm-108",
        fechaHora: "22/09/2026 17:00",
        accion: "ResoluciÃ³n institucional generada",
        realizadoPor: "Abg. Diego Morales",
        rol: "DirecciÃ³n de Normatividad",
        detalles: "EmisiÃ³n de ResoluciÃ³n RES-DINARP-2026-0089. Preparada para firma de MÃ¡xima Autoridad."
      },
      {
        id: "h-pend-firma-108",
        fechaHora: "22/09/2026 17:05",
        accion: "Pendiente de firma",
        realizadoPor: "Sistema DINARP",
        rol: "Sistema",
        detalles: "Expediente enviado a firma externa por la MÃ¡xima Autoridad mediante FirmaEC."
      },
      {
        id: "h-res-firm-108",
        fechaHora: "22/09/2026 18:30",
        accion: "ResoluciÃ³n firmada y verificada",
        realizadoPor: "Mgs. Christian Ruiz (Director Nacional)",
        rol: "MÃ¡xima Autoridad DINARP",
        detalles: "ResoluciÃ³n RES-DINARP-2026-0089 suscrita vÃ¡lidamente mediante FirmaEC. Certificado BCE vÃ¡lido, SHA-256/RSA con sello de tiempo oficial."
      },
      {
        id: "h-inst-activa-108",
        fechaHora: "22/09/2026 18:31",
        accion: "InstituciÃ³n activada",
        realizadoPor: "Sistema DINARP",
        rol: "Sistema",
        detalles: "La resoluciÃ³n fue firmada y verificada correctamente. La instituciÃ³n se encuentra activa y puede continuar con el enrolamiento de sus coordinadores."
      },
      {
        id: "h-inv-tit-108",
        fechaHora: "22/09/2026 18:32",
        accion: "InvitaciÃ³n B â€” Coordinador Titular generada",
        realizadoPor: "Sistema DINARP",
        rol: "Sistema",
        detalles: "InvitaciÃ³n individual INV-B-2026-0089-TIT generada y notificada por correo a Lorena Barahona (lorena.barahona@sri.gob.ec). Vigencia de 30 dÃ­as calendario segÃºn PAR-05."
      },
      {
        id: "h-inv-sup-108",
        fechaHora: "22/09/2026 18:32",
        accion: "InvitaciÃ³n B â€” Coordinador Suplente generada",
        realizadoPor: "Sistema DINARP",
        rol: "Sistema",
        detalles: "InvitaciÃ³n individual INV-B-2026-0089-SUP generada y notificada por correo a Carlos Alberto Espinosa (carlos.espinosa@sri.gob.ec). Vigencia de 30 dÃ­as calendario segÃºn PAR-05."
      }
    ],
    anexoA: {
      entidadTipo: "Publica",
      nombreEntidad: "Servicio de Rentas Internas",
      rucEntidad: "1760013210001",
      direccionEntidad: "Av. Galo Plaza Lasso N37-123, Quito",
      objetoSocial: "AdministraciÃ³n tributaria nacional",
      representanteLegalNombre: "Econ. DamiÃ¡n Larco",
      representanteLegalCargo: "Director General",
      representanteLegalEmail: "direccion@sri.gob.ec",
      esDelegado: false,
      titularNombreCompleto: "Lorena Barahona",
      titularCedula: "1713334445",
      titularCargo: "Directora Nacional de TecnologÃ­a",
      titularAreaUnidad: "TecnologÃ­a",
      titularEmail: "lorena.barahona@sri.gob.ec",
      titularTelefonoFijo: "022985400",
      titularMovilInstitucional: "0993344556",
      titularMovilPersonal: "0982233445",
      suplenteNombreCompleto: "Carlos Alberto Espinosa",
      suplenteCedula: "1714455667",
      suplenteCargo: "Jefe de Arquitectura de Datos",
      suplenteAreaUnidad: "TecnologÃ­a",
      suplenteEmail: "carlos.espinosa@sri.gob.ec",
      suplenteTelefonoFijo: "022985400",
      suplenteMovilInstitucional: "0995566778",
      suplenteMovilPersonal: "0983344556",
      serviciosHerramientas: ["Consulta de datos de identidad y estado civil", "Consulta de defunciones"],
      areasUso: "Control Tributario",
      procesosUso: "ValidaciÃ³n registral de contribuyentes",
      declaracionesAceptadas: true,
      ciudadFirma: "Quito D.M.",
      fechaFirma: "20/09/2026",
      firmadoDigitalmente: true,
      archivoDocumentoFirmado: "ARP-R01_Solicitud_Acceso_SRI.pdf"
    }
  },

  {
    id: "SOL-ING-001",
    tipoTramite: "PROCESO_A_REGISTRO_INSTITUCION",
    codigoDocumental: "ARP-R01",
    tituloTramite: "Solicitud de Acceso SINARP (Registro InstituciÃ³n)",
    cedula: "1799999999",
    nombres: "Juan Carlos",
    apellidos: "PÃ©rez GÃ³mez",
    nombreCompleto: "Juan Carlos PÃ©rez GÃ³mez",
    iniciales: "JP",
    correo: "juan.perez@msp.gob.ec",
    institucion: "Ministerio de Salud PÃºblica",
    fechaSolicitud: "22/09/2026 14:35",
    estado: "Pendiente",
    documentos: [
      "ARP-R01_Solicitud_Acceso_SINARP_MSP.pdf",
      "Soporte_Delegacion_Representante.pdf"
    ],
    anexoA: {
      entidadTipo: "Publica",
      nombreEntidad: "Ministerio de Salud PÃºblica",
      rucEntidad: "1760001230001",
      direccionEntidad: "Av. RepÃºblica de El Salvador 36-64 y Suecia, Quito",
      objetoSocial: "Garantizar el derecho a la salud pÃºblica integral en el territorio ecuatoriano.",
      representanteLegalNombre: "Dra. Gabriela Patricia Aguinaga",
      representanteLegalCargo: "Ministra de Salud PÃºblica (Representante Legal)",
      representanteLegalEmail: "ministra@msp.gob.ec",
      esDelegado: false,
      titularNombreCompleto: "Juan Carlos PÃ©rez GÃ³mez",
      titularCedula: "1799999999",
      titularCargo: "Director Nacional de TecnologÃ­as de la InformaciÃ³n",
      titularAreaUnidad: "DirecciÃ³n Nacional de TecnologÃ­as",
      titularEmail: "juan.perez@msp.gob.ec",
      titularTelefonoFijo: "023814400 ext 1102",
      titularMovilInstitucional: "0998765432",
      titularMovilPersonal: "0987654321",
      suplenteNombreCompleto: "Ing. Roberto Carlos DÃ¡vila Silva",
      suplenteCedula: "1715489621",
      suplenteCargo: "Especialista de Infraestructura y Datos",
      suplenteAreaUnidad: "DirecciÃ³n Nacional de TecnologÃ­as",
      suplenteEmail: "roberto.davila@msp.gob.ec",
      suplenteTelefonoFijo: "023814400 ext 1105",
      suplenteMovilInstitucional: "0991234567",
      suplenteMovilPersonal: "0981234567",
      serviciosHerramientas: [
        "Interoperabilidad SINARP",
        "Ficha de Registro Ãšnico del Ciudadano"
      ],
      areasUso: "DirecciÃ³n Nacional de Vigilancia EpidemiolÃ³gica y EstadÃ­stica Sanitaria",
      procesosUso: "ValidaciÃ³n de identidad en historias clÃ­nicas electrÃ³nicas e interoperabilidad del Sistema Nacional de Salud.",
      declaracionesAceptadas: true,
      ciudadFirma: "Quito D.M.",
      fechaFirma: "22/09/2026",
      firmadoDigitalmente: true,
      archivoDocumentoFirmado: "ARP-R01_Solicitud_Acceso_SINARP_MSP.pdf"
    }
  },
  {
    id: "SOL-ING-002",
    tipoTramite: "PROCESO_B_ENROLAMIENTO_COORDINADOR",
    codigoDocumental: "ARP-R02",
    tituloTramite: "Acuerdo de Confidencialidad (Enrolamiento)",
    cedula: "1712345602",
    nombres: "Paula Andrea",
    apellidos: "Mendoza Zambrano",
    nombreCompleto: "Paula Andrea Mendoza Zambrano",
    iniciales: "PM",
    correo: "paula.mendoza@dinarp.gob.ec",
    institucion: "DirecciÃ³n Nacional de Registros PÃºblicos",
    fechaSolicitud: "20/09/2026 09:12",
    estado: "Aprobada",
    fechaRevision: "21/09/2026 11:20",
    revisor: "MarÃ­a Torres (DirecciÃ³n de GestiÃ³n y Registro)",
    documentos: [
      "ARP-R02_Acuerdo_Uso_Confidencialidad_PM.pdf"
    ],
    anexoB: {
      nombreEntidad: "DirecciÃ³n Nacional de Registros PÃºblicos",
      domicilioEntidad: "Av. Amazonas N24-196 y Luis Cordero, Quito",
      representanteLegalNombre: "Mgs. Christian Ruiz (Director Nacional)",
      funcionarioNombre: "Paula Andrea Mendoza Zambrano",
      funcionarioCedula: "1712345602",
      funcionarioCargo: "Coordinadora de TecnologÃ­as de la InformaciÃ³n",
      rolAsignado: "COORDINADOR TITULAR",
      misionVisionInstitucional: "Coordinar, regular y gestionar la interoperabilidad y custodia de los registros pÃºblicos del Estado ecuatoriano con altos estÃ¡ndares de seguridad y protecciÃ³n de datos.",
      clausulasAceptadas: true,
      ciudadFirma: "Quito D.M.",
      fechaFirma: "20/09/2026",
      firmadoPorRepresentante: true,
      firmadoPorFuncionario: true,
      archivoAcuerdoFirmado: "ARP-R02_Acuerdo_Uso_Confidencialidad_PM.pdf"
    }
  },
  {
    id: "SOL-ING-003",
    tipoTramite: "PROCESO_B_ENROLAMIENTO_COORDINADOR",
    codigoDocumental: "ARP-R02",
    tituloTramite: "Acuerdo de Confidencialidad (Enrolamiento)",
    cedula: "1788888888",
    nombres: "Carlos Alberto",
    apellidos: "Andrade VillacÃ­s",
    nombreCompleto: "Carlos Alberto Andrade VillacÃ­s",
    iniciales: "CA",
    correo: "carlos.andrade@educacion.gob.ec",
    institucion: "Ministerio de EducaciÃ³n",
    fechaSolicitud: "18/09/2026 16:40",
    estado: "Rechazada",
    fechaRevision: "19/09/2026 10:15",
    revisor: "MarÃ­a Torres (DirecciÃ³n de GestiÃ³n y Registro)",
    motivoRechazo: "El acuerdo presentado no cuenta con la firma electrÃ³nica vÃ¡lida de la mÃ¡xima autoridad o su delegado debidamente justificado.",
    documentos: [
      "ARP-R02_Acuerdo_Uso_Confidencialidad_Educacion.pdf"
    ],
    anexoB: {
      nombreEntidad: "Ministerio de EducaciÃ³n",
      domicilioEntidad: "Av. Amazonas N34-451 entre Atahualpa y Juan Pablo Sanz, Quito",
      representanteLegalNombre: "Dra. AlegrÃ­a Crespo Cordovez",
      funcionarioNombre: "Carlos Alberto Andrade VillacÃ­s",
      funcionarioCedula: "1788888888",
      funcionarioCargo: "Especialista Zonal de TIC",
      rolAsignado: "COORDINADOR TITULAR",
      misionVisionInstitucional: "Garantizar el acceso universal, la calidad y pertinencia de la educaciÃ³n pÃºblica en el Ecuador.",
      clausulasAceptadas: true,
      ciudadFirma: "Quito D.M.",
      fechaFirma: "18/09/2026",
      firmadoPorRepresentante: false,
      firmadoPorFuncionario: true,
      archivoAcuerdoFirmado: "ARP-R02_Acuerdo_Uso_Confidencialidad_Educacion.pdf"
    }
  },
  {
    id: "SOL-ING-004",
    tipoTramite: "PROCESO_C_CAMBIO_COORDINADOR",
    codigoDocumental: "ARP-R03",
    tituloTramite: "Cambio de Coordinador Institucional (ARP-R03)",
    cedula: "1724589632",
    nombres: "LucÃ­a Fernanda",
    apellidos: "Navarrete Morales",
    nombreCompleto: "LucÃ­a Fernanda Navarrete Morales",
    iniciales: "LN",
    correo: "lucia.navarrete@registrocivil.gob.ec",
    institucion: "DirecciÃ³n General de Registro Civil, IdentificaciÃ³n y CedulaciÃ³n",
    fechaSolicitud: "23/09/2026 08:22",
    estado: "Pendiente",
    documentos: [
      "ARP-R03_Cambio_Coordinador_RegistroCivil.pdf",
      "Accion_Personal_Delegacion_Firmante.pdf"
    ],
    anexoC: {
      nombreEntidad: "DirecciÃ³n General de Registro Civil, IdentificaciÃ³n y CedulaciÃ³n",
      representanteLegalNombre: "Abg. Fernando AlarcÃ³n (Subdirector General Delegado)",
      esDelegado: true,
      archivoSoporteDelegacion: "Accion_Personal_Delegacion_Firmante.pdf",
      aplicaCambioTitular: true,
      nuevoTitularNombre: "LucÃ­a Fernanda Navarrete Morales",
      nuevoTitularCedula: "1724589632",
      nuevoTitularCargo: "Directora de GestiÃ³n de la InformaciÃ³n y Seguridad Registral",
      nuevoTitularMotivo: "Cese de funciones del coordinador saliente por cambio de estructura administrativa.",
      nuevoTitularEmail: "lucia.navarrete@registrocivil.gob.ec",
      nuevoTitularArea: "DirecciÃ³n de TecnologÃ­as y Seguridad de la InformaciÃ³n",
      nuevoTitularTelefonoFijo: "023731110 ext 204",
      nuevoTitularMovilInst: "0984561230",
      nuevoTitularMovilPersonal: "0991245876",
      aplicaCambioSuplente: false,
      aplicaDesignacionInicialSuplente: false,
      ciudadFirma: "Quito D.M.",
      fechaFirma: "23/09/2026",
      firmadoDigitalmente: true,
      archivoDocumentoFirmado: "ARP-R03_Cambio_Coordinador_RegistroCivil.pdf"
    }
  },
  {
    id: "SOL-ING-005",
    tipoTramite: "PROCESO_A_REGISTRO_INSTITUCION",
    codigoDocumental: "ARP-R01",
    tituloTramite: "Solicitud de Acceso SINARP (Registro InstituciÃ³n)",
    cedula: "1756321478",
    nombres: "Santiago AndrÃ©s",
    apellidos: "CÃ¡rdenas Viteri",
    nombreCompleto: "Santiago AndrÃ©s CÃ¡rdenas Viteri",
    iniciales: "SC",
    correo: "santiago.cardenas@sri.gob.ec",
    institucion: "Servicio de Rentas Internas",
    fechaSolicitud: "21/09/2026 18:05",
    estado: "Pendiente",
    documentos: [
      "ARP-R01_Solicitud_Acceso_SRI.pdf"
    ],
    anexoA: {
      entidadTipo: "Publica",
      nombreEntidad: "Servicio de Rentas Internas",
      rucEntidad: "1760013210001",
      direccionEntidad: "Salinas y Santiago, Edificio SRI, Quito",
      objetoSocial: "AdministraciÃ³n, control y recaudaciÃ³n de tributos internos del Estado.",
      representanteLegalNombre: "Ec. DamiÃ¡n Larco (Director General)",
      representanteLegalCargo: "Director General del SRI",
      representanteLegalEmail: "director@sri.gob.ec",
      esDelegado: false,
      titularNombreCompleto: "Santiago AndrÃ©s CÃ¡rdenas Viteri",
      titularCedula: "1756321478",
      titularCargo: "Jefe de Interoperabilidad e Intercambio de InformaciÃ³n",
      titularAreaUnidad: "Departamento de AnalÃ­tica y TIC",
      titularEmail: "santiago.cardenas@sri.gob.ec",
      titularTelefonoFijo: "022987100 ext 550",
      titularMovilInstitucional: "0998521470",
      titularMovilPersonal: "0987456321",
      suplenteNombreCompleto: "Ing. MÃ³nica Patricia Paredes Loor",
      suplenteCedula: "1719874562",
      suplenteCargo: "Analista Senior de Bases de Datos",
      suplenteAreaUnidad: "Departamento de AnalÃ­tica y TIC",
      suplenteEmail: "monica.paredes@sri.gob.ec",
      suplenteTelefonoFijo: "022987100 ext 554",
      suplenteMovilInstitucional: "0993698521",
      suplenteMovilPersonal: "0981472583",
      serviciosHerramientas: ["Interoperabilidad SINARP", "Infodigital"],
      areasUso: "DirecciÃ³n Nacional de RecaudaciÃ³n y Control Tributario",
      procesosUso: "Cruce automÃ¡tico de informaciÃ³n patrimonial y societaria para procesos de auditorÃ­a fiscal.",
      declaracionesAceptadas: true,
      ciudadFirma: "Quito D.M.",
      fechaFirma: "21/09/2026",
      firmadoDigitalmente: true,
      archivoDocumentoFirmado: "ARP-R01_Solicitud_Acceso_SRI.pdf"
    }
  },
  {
    id: "SOL-ING-006",
    tipoTramite: "PROCESO_B_ENROLAMIENTO_COORDINADOR",
    codigoDocumental: "ARP-R02",
    tituloTramite: "Acuerdo de Confidencialidad (Enrolamiento)",
    cedula: "0918745210",
    nombres: "Diana Patricia",
    apellidos: "Espinoza Valarezo",
    nombreCompleto: "Diana Patricia Espinoza Valarezo",
    iniciales: "DE",
    correo: "diana.espinoza@ant.gob.ec",
    institucion: "Agencia Nacional de TrÃ¡nsito",
    fechaSolicitud: "15/09/2026 11:45",
    estado: "Aprobada",
    fechaRevision: "16/09/2026 09:30",
    revisor: "MarÃ­a Torres (DirecciÃ³n de GestiÃ³n y Registro)",
    documentos: [
      "ARP-R02_Acuerdo_Confidencialidad_ANT.pdf"
    ],
    anexoB: {
      nombreEntidad: "Agencia Nacional de TrÃ¡nsito",
      domicilioEntidad: "Av. Antonio JosÃ© de Sucre y JosÃ© SÃ¡nchez, Quito",
      representanteLegalNombre: "Mgs. Vanessa Cueva (Directora Ejecutiva)",
      funcionarioNombre: "Diana Patricia Espinoza Valarezo",
      funcionarioCedula: "0918745210",
      funcionarioCargo: "Subdirectora de Registro de TÃ­tulos Habilitantes",
      rolAsignado: "COORDINADOR TITULAR",
      misionVisionInstitucional: "Planificar, regular y controlar la gestiÃ³n del transporte terrestre, trÃ¡nsito y seguridad vial en el territorio nacional.",
      clausulasAceptadas: true,
      ciudadFirma: "Quito D.M.",
      fechaFirma: "15/09/2026",
      firmadoPorRepresentante: true,
      firmadoPorFuncionario: true,
      archivoAcuerdoFirmado: "ARP-R02_Acuerdo_Confidencialidad_ANT.pdf"
    }
  },
  {
    id: "SOL-ING-007",
    tipoTramite: "PROCESO_A_REGISTRO_INSTITUCION",
    codigoDocumental: "ARP-R01",
    tituloTramite: "Solicitud de Registro de InstituciÃ³n (Anexo A)",
    cedula: "1719823451",
    nombres: "Marcelo Eduardo",
    apellidos: "Almeida ProaÃ±o",
    nombreCompleto: "Marcelo Eduardo Almeida ProaÃ±o",
    iniciales: "MA",
    correo: "marcelo.almeida@epn.edu.ec",
    institucion: "Escuela PolitÃ©cnica Nacional",
    fechaSolicitud: "29/09/2026 08:30",
    estado: "PENDIENTE_ASIGNACION_GESTION",
    documentos: [
      "ARP-R01_Solicitud_Registro_EPN.pdf",
      "Nombramiento_Rector_EPN.pdf"
    ],
    anexoA: {
      entidadTipo: "Publica",
      nombreEntidad: "Escuela PolitÃ©cnica Nacional",
      rucEntidad: "1768034560001",
      direccionEntidad: "LadrÃ³n de Guevara E11-253, Quito",
      objetoSocial: "EducaciÃ³n superior pÃºblica, investigaciÃ³n cientÃ­fica, tecnolÃ³gica y vinculaciÃ³n con la sociedad.",
      representanteLegalNombre: "Dra. Florinella MuÃ±oz (Rectora)",
      representanteLegalCargo: "Rectora",
      representanteLegalEmail: "rectorado@epn.edu.ec",
      esDelegado: false,
      titularNombreCompleto: "Marcelo Eduardo Almeida ProaÃ±o",
      titularCedula: "1719823451",
      titularCargo: "Director de TecnologÃ­as de InformaciÃ³n y ComunicaciÃ³n",
      titularAreaUnidad: "DirecciÃ³n de TIC",
      titularEmail: "marcelo.almeida@epn.edu.ec",
      titularTelefonoFijo: "022976300 ext 1201",
      titularMovilInstitucional: "0994567890",
      titularMovilPersonal: "0983214567",
      suplenteNombreCompleto: "Ing. Katherine Viviana Morales Ortiz",
      suplenteCedula: "1724567892",
      suplenteCargo: "Administradora de Sistemas Institucionales",
      suplenteAreaUnidad: "DirecciÃ³n de TIC",
      suplenteEmail: "katherine.morales@epn.edu.ec",
      suplenteTelefonoFijo: "022976300 ext 1205",
      suplenteMovilInstitucional: "0997891234",
      suplenteMovilPersonal: "0986543210",
      serviciosHerramientas: [
        "Interoperabilidad SINARP",
        "Ficha de Registro Ãšnico del Ciudadano"
      ],
      areasUso: "DirecciÃ³n de Admisiones, Registro y Bienestar Estudiantil",
      procesosUso: "VerificaciÃ³n automÃ¡tica de identidad ciudadana y validaciÃ³n registral en matrÃ­culas estudiantiles.",
      declaracionesAceptadas: true,
      ciudadFirma: "Quito D.M.",
      fechaFirma: "29/09/2026",
      firmadoDigitalmente: true,
      archivoDocumentoFirmado: "ARP-R01_Solicitud_Registro_EPN.pdf"
    }
  },
  {
    id: "SOL-ING-008",
    tipoTramite: "PROCESO_A_REGISTRO_INSTITUCION",
    codigoDocumental: "ARP-R01",
    tituloTramite: "Solicitud de Registro de InstituciÃ³n (Anexo A)",
    cedula: "0104567893",
    nombres: "Valeria Soledad",
    apellidos: "CÃ¡rdenas Ochoa",
    nombreCompleto: "Valeria Soledad CÃ¡rdenas Ochoa",
    iniciales: "VC",
    correo: "valeria.cardenas@cuenca.gob.ec",
    institucion: "Gobierno AutÃ³nomo Descentralizado Municipal de Cuenca",
    fechaSolicitud: "29/09/2026 10:15",
    estado: "PENDIENTE_ASIGNACION_GESTION",
    documentos: [
      "ARP-R01_Solicitud_Registro_GAD_Cuenca.pdf",
      "Accion_Personal_Delegacion_Alcalde.pdf"
    ],
    anexoA: {
      entidadTipo: "Publica",
      nombreEntidad: "Gobierno AutÃ³nomo Descentralizado Municipal de Cuenca",
      rucEntidad: "0160000270001",
      direccionEntidad: "Calle BolÃ­var y Borrero, Cuenca",
      objetoSocial: "PlanificaciÃ³n del desarrollo cantonal y prestaciÃ³n de servicios pÃºblicos municipales.",
      representanteLegalNombre: "Dr. Cristian Zamora (Alcalde)",
      representanteLegalCargo: "Alcalde del CantÃ³n Cuenca",
      representanteLegalEmail: "alcaldia@cuenca.gob.ec",
      esDelegado: true,
      archivoSoporteDelegacion: "Accion_Personal_Delegacion_Alcalde.pdf",
      titularNombreCompleto: "Valeria Soledad CÃ¡rdenas Ochoa",
      titularCedula: "0104567893",
      titularCargo: "Directora General de TecnologÃ­as y TransformaciÃ³n Digital",
      titularAreaUnidad: "DirecciÃ³n General de TecnologÃ­as",
      titularEmail: "valeria.cardenas@cuenca.gob.ec",
      titularTelefonoFijo: "074134900 ext 1450",
      titularMovilInstitucional: "0998745612",
      titularMovilPersonal: "0987412589",
      suplenteNombreCompleto: "Ing. Esteban Daniel Palacios Vintimilla",
      suplenteCedula: "0103698524",
      suplenteCargo: "LÃ­der de Interoperabilidad e IntegraciÃ³n de Datos",
      suplenteAreaUnidad: "DirecciÃ³n General de TecnologÃ­as",
      suplenteEmail: "esteban.palacios@cuenca.gob.ec",
      suplenteTelefonoFijo: "074134900 ext 1455",
      suplenteMovilInstitucional: "0993654128",
      suplenteMovilPersonal: "0982547896",
      serviciosHerramientas: [
        "Interoperabilidad SINARP",
        "Infodigital",
        "Ficha de Registro Ãšnico del Ciudadano"
      ],
      areasUso: "DirecciÃ³n Financiera y DirecciÃ³n de Control Territorial",
      procesosUso: "ValidaciÃ³n de solvencias, avalÃºos, catastros y consulta registral de bienes inmuebles en lÃ­nea.",
      declaracionesAceptadas: true,
      ciudadFirma: "Cuenca",
      fechaFirma: "29/09/2026",
      firmadoDigitalmente: true,
      archivoDocumentoFirmado: "ARP-R01_Solicitud_Registro_GAD_Cuenca.pdf"
    }
  },
  {
    id: "SOL-ING-009",
    tipoTramite: "PROCESO_A_REGISTRO_INSTITUCION",
    codigoDocumental: "ARP-R01",
    tituloTramite: "Solicitud de Registro de InstituciÃ³n (Anexo A)",
    cedula: "0923456781",
    nombres: "Gustavo Adolfo",
    apellidos: "Paredes Rivas",
    nombreCompleto: "Gustavo Adolfo Paredes Rivas",
    iniciales: "GP",
    correo: "gustavo.paredes@bancoguayaquil.com",
    institucion: "Banco Guayaquil S.A.",
    fechaSolicitud: "29/09/2026 11:40",
    estado: "PENDIENTE_ASIGNACION_GESTION",
    documentos: [
      "ARP-R01_Solicitud_Registro_BancoGuayaquil.pdf",
      "Poder_Especial_Representante_Legal.pdf"
    ],
    anexoA: {
      entidadTipo: "Privada",
      nombreEntidad: "Banco Guayaquil S.A.",
      rucEntidad: "0990005740001",
      direccionEntidad: "Pichincha 105 y P. Ycaza, Guayaquil",
      objetoSocial: "IntermediaciÃ³n financiera privada y servicios bancarios regulados por la Superintendencia de Bancos.",
      representanteLegalNombre: "Mgs. Guillermo Lasso AlcÃ­var (Presidente Ejecutivo)",
      representanteLegalCargo: "Presidente Ejecutivo y Representante Legal",
      representanteLegalEmail: "presidencia@bancoguayaquil.com",
      esDelegado: true,
      archivoSoporteDelegacion: "Poder_Especial_Representante_Legal.pdf",
      titularNombreCompleto: "Gustavo Adolfo Paredes Rivas",
      titularCedula: "0923456781",
      titularCargo: "Gerente de Cumplimiento Normativo y PrevenciÃ³n",
      titularAreaUnidad: "Gerencia de Cumplimiento y Control",
      titularEmail: "gustavo.paredes@bancoguayaquil.com",
      titularTelefonoFijo: "043730100 ext 3200",
      titularMovilInstitucional: "0991478523",
      titularMovilPersonal: "0983692581",
      suplenteNombreCompleto: "Abg. Silvia Carolina Mendoza Vera",
      suplenteCedula: "0915678942",
      suplenteCargo: "Oficial Senior de Seguridad de la InformaciÃ³n",
      suplenteAreaUnidad: "Gerencia de Cumplimiento y Control",
      suplenteEmail: "silvia.mendoza@bancoguayaquil.com",
      suplenteTelefonoFijo: "043730100 ext 3205",
      suplenteMovilInstitucional: "0992581473",
      suplenteMovilPersonal: "0981473692",
      serviciosHerramientas: [
        "Ficha de Registro Ãšnico del Ciudadano"
      ],
      areasUso: "OficialÃ­a de Cumplimiento y Apertura de Cuentas Digitales",
      procesosUso: "ValidaciÃ³n estricta de identidad para debida diligencia de clientes y prevenciÃ³n de lavado de activos.",
      declaracionesAceptadas: true,
      ciudadFirma: "Guayaquil",
      fechaFirma: "29/09/2026",
      firmadoDigitalmente: true,
      archivoDocumentoFirmado: "ARP-R01_Solicitud_Registro_BancoGuayaquil.pdf"
    }
  },
  {
    id: "SOL-ING-010",
    tipoTramite: "PROCESO_A_REGISTRO_INSTITUCION",
    codigoDocumental: "ARP-R01",
    tituloTramite: "Solicitud de Registro de InstituciÃ³n (Anexo A)",
    cedula: "1103654789",
    nombres: "Lorena Elizabeth",
    apellidos: "Jaramillo Castro",
    nombreCompleto: "Lorena Elizabeth Jaramillo Castro",
    iniciales: "LJ",
    correo: "lorena.jaramillo@loja.gob.ec",
    institucion: "Gobierno AutÃ³nomo Descentralizado Municipal de Loja",
    fechaSolicitud: "29/09/2026 13:05",
    estado: "PENDIENTE_ASIGNACION_GESTION",
    documentos: [
      "ARP-R01_Solicitud_Registro_GAD_Loja.pdf"
    ],
    anexoA: {
      entidadTipo: "Publica",
      nombreEntidad: "Gobierno AutÃ³nomo Descentralizado Municipal de Loja",
      rucEntidad: "1160000240001",
      direccionEntidad: "BolÃ­var y JosÃ© Antonio Eguiguren, Loja",
      objetoSocial: "Gobierno local y administraciÃ³n de servicios pÃºblicos cantonales de Loja.",
      representanteLegalNombre: "Mgs. Franco Quezada (Alcalde)",
      representanteLegalCargo: "Alcalde de Loja",
      representanteLegalEmail: "alcaldia@loja.gob.ec",
      esDelegado: false,
      titularNombreCompleto: "Lorena Elizabeth Jaramillo Castro",
      titularCedula: "1103654789",
      titularCargo: "Directora de InformÃ¡tica y Telecomunicaciones",
      titularAreaUnidad: "DirecciÃ³n de InformÃ¡tica",
      titularEmail: "lorena.jaramillo@loja.gob.ec",
      titularTelefonoFijo: "072570407 ext 210",
      titularMovilInstitucional: "0996541238",
      titularMovilPersonal: "0985214796",
      suplenteNombreCompleto: "Ing. Jorge Luis BenÃ­tez Sarango",
      suplenteCedula: "1102587413",
      suplenteCargo: "Analista de Seguridad Registral y Redes",
      suplenteAreaUnidad: "DirecciÃ³n de InformÃ¡tica",
      suplenteEmail: "jorge.benitez@loja.gob.ec",
      suplenteTelefonoFijo: "072570407 ext 214",
      suplenteMovilInstitucional: "0997412586",
      suplenteMovilPersonal: "0983691475",
      serviciosHerramientas: [
        "Interoperabilidad SINARP",
        "Infodigital"
      ],
      areasUso: "Registro de la Propiedad del CantÃ³n Loja y DirecciÃ³n de AvalÃºos",
      procesosUso: "AutomatizaciÃ³n de certificados de gravÃ¡menes y verificaciÃ³n de solvencias patrimoniales en lÃ­nea.",
      declaracionesAceptadas: true,
      ciudadFirma: "Loja",
      fechaFirma: "29/09/2026",
      firmadoDigitalmente: true,
      archivoDocumentoFirmado: "ARP-R01_Solicitud_Registro_GAD_Loja.pdf"
    }
  },
  {
    id: "SOL-ING-011",
    tipoTramite: "PROCESO_A_REGISTRO_INSTITUCION",
    codigoDocumental: "ARP-R01",
    tituloTramite: "Solicitud de Registro de InstituciÃ³n (Anexo A)",
    cedula: "1710987654",
    nombres: "Mauricio Xavier",
    apellidos: "Paredes Carrera",
    nombreCompleto: "Mauricio Xavier Paredes Carrera",
    iniciales: "MP",
    correo: "mauricio.paredes@emaseo.gob.ec",
    institucion: "Empresa PÃºblica Metropolitana de Aseo de Quito (EMASEO EP)",
    fechaSolicitud: "29/09/2026 14:10",
    estado: "PENDIENTE_ASIGNACION_GESTION",
    documentos: [
      "ARP-R01_Solicitud_Registro_EMASEO.pdf",
      "Nombramiento_Gerente_EMASEO.pdf"
    ],
    anexoA: {
      entidadTipo: "Publica",
      nombreEntidad: "Empresa PÃºblica Metropolitana de Aseo de Quito (EMASEO EP)",
      rucEntidad: "1768153450001",
      direccionEntidad: "Av. Mariscal Sucre y Occidental, Quito",
      objetoSocial: "GestiÃ³n integral de residuos sÃ³lidos en el Distrito Metropolitano de Quito.",
      representanteLegalNombre: "Ing. Jorge Jaramillo (Gerente General)",
      representanteLegalCargo: "Gerente General",
      representanteLegalEmail: "gerencia@emaseo.gob.ec",
      esDelegado: false,
      titularNombreCompleto: "Mauricio Xavier Paredes Carrera",
      titularCedula: "1710987654",
      titularCargo: "Director de TecnologÃ­as de la InformaciÃ³n",
      titularAreaUnidad: "DirecciÃ³n de TecnologÃ­as",
      titularEmail: "mauricio.paredes@emaseo.gob.ec",
      titularTelefonoFijo: "023310555 ext 110",
      titularMovilInstitucional: "0998765412",
      titularMovilPersonal: "0987654123",
      suplenteNombreCompleto: "Ing. Gabriela Alexandra SuÃ¡rez Mora",
      suplenteCedula: "1718765432",
      suplenteCargo: "Administradora de Bases de Datos",
      suplenteAreaUnidad: "DirecciÃ³n de TecnologÃ­as",
      suplenteEmail: "gabriela.suarez@emaseo.gob.ec",
      suplenteTelefonoFijo: "023310555 ext 114",
      suplenteMovilInstitucional: "0991234587",
      suplenteMovilPersonal: "0982345671",
      serviciosHerramientas: [
        "Interoperabilidad SINARP",
        "Ficha de Registro Ãšnico del Ciudadano"
      ],
      areasUso: "DirecciÃ³n Comercial y RecaudaciÃ³n",
      procesosUso: "VerificaciÃ³n de titulares de predios y contratos de servicios de recolecciÃ³n especial.",
      declaracionesAceptadas: true,
      ciudadFirma: "Quito D.M.",
      fechaFirma: "29/09/2026",
      firmadoDigitalmente: true,
      archivoDocumentoFirmado: "ARP-R01_Solicitud_Registro_EMASEO.pdf"
    }
  },
  {
    id: "SOL-ING-012",
    tipoTramite: "PROCESO_A_REGISTRO_INSTITUCION",
    codigoDocumental: "ARP-R01",
    tituloTramite: "Solicitud de Registro de InstituciÃ³n (Anexo A)",
    cedula: "0917654321",
    nombres: "Mariana del Carmen",
    apellidos: "Velasco Zambrano",
    nombreCompleto: "Mariana del Carmen Velasco Zambrano",
    iniciales: "MV",
    correo: "mariana.velasco@bancopichincha.com",
    institucion: "Banco Pichincha C.A.",
    fechaSolicitud: "29/09/2026 14:45",
    estado: "PENDIENTE_ASIGNACION_GESTION",
    documentos: [
      "ARP-R01_Solicitud_Registro_BancoPichincha.pdf",
      "Poder_Especial_Representante_Legal.pdf"
    ],
    anexoA: {
      entidadTipo: "Privada",
      nombreEntidad: "Banco Pichincha C.A.",
      rucEntidad: "1790010937001",
      direccionEntidad: "Amazonas 4560 y Pereira, Quito",
      objetoSocial: "Servicios financieros de intermediaciÃ³n bancaria nacional e internacional.",
      representanteLegalNombre: "Dr. Antonio Acosta Espinosa (Presidente)",
      representanteLegalCargo: "Presidente del Directorio",
      representanteLegalEmail: "presidencia@pichincha.com",
      esDelegado: true,
      archivoSoporteDelegacion: "Poder_Especial_Representante_Legal.pdf",
      titularNombreCompleto: "Mariana del Carmen Velasco Zambrano",
      titularCedula: "0917654321",
      titularCargo: "Gerente de Riesgo Operativo e Integridad de Datos",
      titularAreaUnidad: "Gerencia de Riesgos",
      titularEmail: "mariana.velasco@bancopichincha.com",
      titularTelefonoFijo: "022999999 ext 4100",
      titularMovilInstitucional: "0995551234",
      titularMovilPersonal: "0984441234",
      suplenteNombreCompleto: "Abg. Felipe AndrÃ©s Ponce Larrea",
      suplenteCedula: "1714567890",
      suplenteCargo: "Oficial de Cumplimiento Regulatorio",
      suplenteAreaUnidad: "Gerencia JurÃ­dica y Cumplimiento",
      suplenteEmail: "felipe.ponce@bancopichincha.com",
      suplenteTelefonoFijo: "022999999 ext 4105",
      suplenteMovilInstitucional: "0996667890",
      suplenteMovilPersonal: "0987778901",
      serviciosHerramientas: [
        "Interoperabilidad SINARP",
        "Ficha de Registro Ãšnico del Ciudadano"
      ],
      areasUso: "OficialÃ­a de Cumplimiento y Operaciones Crediticias",
      procesosUso: "Cruce de datos para validaciÃ³n de solicitantes de microcrÃ©ditos y debida diligencia de clientes.",
      declaracionesAceptadas: true,
      ciudadFirma: "Quito D.M.",
      fechaFirma: "29/09/2026",
      firmadoDigitalmente: true,
      archivoDocumentoFirmado: "ARP-R01_Solicitud_Registro_BancoPichincha.pdf"
    }
  },
  {
    id: "SOL-ING-013",
    tipoTramite: "PROCESO_A_REGISTRO_INSTITUCION",
    codigoDocumental: "ARP-R01",
    tituloTramite: "Solicitud de Registro de InstituciÃ³n (Anexo A)",
    cedula: "1803456789",
    nombres: "Christian Danilo",
    apellidos: "GÃ³mez Villafuerte",
    nombreCompleto: "Christian Danilo GÃ³mez Villafuerte",
    iniciales: "CG",
    correo: "christian.gomez@ambato.gob.ec",
    institucion: "Gobierno AutÃ³nomo Descentralizado Municipal de Ambato",
    fechaSolicitud: "29/09/2026 15:15",
    estado: "PENDIENTE_ASIGNACION_GESTION",
    documentos: [
      "ARP-R01_Solicitud_Registro_GAD_Ambato.pdf"
    ],
    anexoA: {
      entidadTipo: "Publica",
      nombreEntidad: "Gobierno AutÃ³nomo Descentralizado Municipal de Ambato",
      rucEntidad: "1860000210001",
      direccionEntidad: "BolÃ­var y Castillo, Ambato",
      objetoSocial: "AdministraciÃ³n territorial cantonal y ejecuciÃ³n de obras pÃºblicas municipales.",
      representanteLegalNombre: "Dra. Diana Caiza (Alcaldesa)",
      representanteLegalCargo: "Alcaldesa de Ambato",
      representanteLegalEmail: "alcaldia@ambato.gob.ec",
      esDelegado: false,
      titularNombreCompleto: "Christian Danilo GÃ³mez Villafuerte",
      titularCedula: "1803456789",
      titularCargo: "Director de TecnologÃ­as de la InformaciÃ³n",
      titularAreaUnidad: "DirecciÃ³n de TIC",
      titularEmail: "christian.gomez@ambato.gob.ec",
      titularTelefonoFijo: "032997800 ext 301",
      titularMovilInstitucional: "0993214567",
      titularMovilPersonal: "0986541230",
      suplenteNombreCompleto: "Ing. Pamela RocÃ­o Silva Altamirano",
      suplenteCedula: "1804561238",
      suplenteCargo: "LÃ­der de Sistemas de InformaciÃ³n",
      suplenteAreaUnidad: "DirecciÃ³n de TIC",
      suplenteEmail: "pamela.silva@ambato.gob.ec",
      suplenteTelefonoFijo: "032997800 ext 305",
      suplenteMovilInstitucional: "0991472583",
      suplenteMovilPersonal: "0982583691",
      serviciosHerramientas: [
        "Interoperabilidad SINARP",
        "Infodigital"
      ],
      areasUso: "DirecciÃ³n de AvalÃºos y Catastros, Registro Municipal de la Propiedad",
      procesosUso: "Certificados digitales de no adeudar y registro Ã¡gil de transferencias de dominio inmobiliario.",
      declaracionesAceptadas: true,
      ciudadFirma: "Ambato",
      fechaFirma: "29/09/2026",
      firmadoDigitalmente: true,
      archivoDocumentoFirmado: "ARP-R01_Solicitud_Registro_GAD_Ambato.pdf"
    }
  },
  {
    id: "SOL-ING-014",
    tipoTramite: "PROCESO_A_REGISTRO_INSTITUCION",
    codigoDocumental: "ARP-R01",
    tituloTramite: "Solicitud de Registro de InstituciÃ³n (Anexo A)",
    cedula: "1711223388",
    nombres: "Santiago Israel",
    apellidos: "Montalvo Cifuentes",
    nombreCompleto: "Santiago Israel Montalvo Cifuentes",
    iniciales: "SM",
    correo: "santiago.montalvo@usfq.edu.ec",
    institucion: "Universidad San Francisco de Quito (USFQ)",
    fechaSolicitud: "29/09/2026 15:50",
    estado: "PENDIENTE_ASIGNACION_GESTION",
    documentos: [
      "ARP-R01_Solicitud_Registro_USFQ.pdf",
      "Poder_General_Representante_Legal.pdf"
    ],
    anexoA: {
      entidadTipo: "Privada",
      nombreEntidad: "Universidad San Francisco de Quito (USFQ)",
      rucEntidad: "1791234567001",
      direccionEntidad: "Diego de Robles y VÃ­a InteroceÃ¡nica, CumbayÃ¡, Quito",
      objetoSocial: "EducaciÃ³n superior particular y fomento a la investigaciÃ³n cientÃ­fica y humanÃ­stica.",
      representanteLegalNombre: "Dr. Diego Quiroga (Rector)",
      representanteLegalCargo: "Rector de la USFQ",
      representanteLegalEmail: "rectorado@usfq.edu.ec",
      esDelegado: true,
      archivoSoporteDelegacion: "Poder_General_Representante_Legal.pdf",
      titularNombreCompleto: "Santiago Israel Montalvo Cifuentes",
      titularCedula: "1711223388",
      titularCargo: "Director de TI y Soluciones Digitales",
      titularAreaUnidad: "DirecciÃ³n de InformÃ¡tica",
      titularEmail: "santiago.montalvo@usfq.edu.ec",
      titularTelefonoFijo: "022971700 ext 1500",
      titularMovilInstitucional: "0998884422",
      titularMovilPersonal: "0987773311",
      suplenteNombreCompleto: "Mgs. Cristina BelÃ©n Endara Ponce",
      suplenteCedula: "1719873214",
      suplenteCargo: "Coordinadora de Sistemas de Registro AcadÃ©mico",
      suplenteAreaUnidad: "DirecciÃ³n de Registro",
      suplenteEmail: "cristina.endara@usfq.edu.ec",
      suplenteTelefonoFijo: "022971700 ext 1504",
      suplenteMovilInstitucional: "0994443322",
      suplenteMovilPersonal: "0985552211",
      serviciosHerramientas: [
        "Interoperabilidad SINARP",
        "Ficha de Registro Ãšnico del Ciudadano"
      ],
      areasUso: "Oficina de Registro AcadÃ©mico y Admisiones",
      procesosUso: "AutenticaciÃ³n automÃ¡tica de cÃ©dula e historial de tÃ­tulos de bachiller en el proceso de admisiÃ³n.",
      declaracionesAceptadas: true,
      ciudadFirma: "Quito D.M.",
      fechaFirma: "29/09/2026",
      firmadoDigitalmente: true,
      archivoDocumentoFirmado: "ARP-R01_Solicitud_Registro_USFQ.pdf"
    }
  },
  {
    id: "SOL-ING-015",
    tipoTramite: "PROCESO_A_REGISTRO_INSTITUCION",
    codigoDocumental: "ARP-R01",
    tituloTramite: "Solicitud de Registro de InstituciÃ³n (Anexo A)",
    cedula: "1309876543",
    nombres: "NÃ©stor Javier",
    apellidos: "Barreiro Delgado",
    nombreCompleto: "NÃ©stor Javier Barreiro Delgado",
    iniciales: "NB",
    correo: "nestor.barreiro@manta.gob.ec",
    institucion: "Gobierno AutÃ³nomo Descentralizado Municipal de Manta",
    fechaSolicitud: "29/09/2026 16:20",
    estado: "PENDIENTE_ASIGNACION_GESTION",
    documentos: [
      "ARP-R01_Solicitud_Registro_GAD_Manta.pdf"
    ],
    anexoA: {
      entidadTipo: "Publica",
      nombreEntidad: "Gobierno AutÃ³nomo Descentralizado Municipal de Manta",
      rucEntidad: "1360000280001",
      direccionEntidad: "MalecÃ³n Jaime ChÃ¡vez GutiÃ©rrez y Calle 9, Manta",
      objetoSocial: "AdministraciÃ³n cantonal y dotaciÃ³n de servicios bÃ¡sicos, planificaciÃ³n y desarrollo urbano.",
      representanteLegalNombre: "Marciana Valdivieso de Poveda (Alcaldesa)",
      representanteLegalCargo: "Alcaldesa de Manta",
      representanteLegalEmail: "alcaldia@manta.gob.ec",
      esDelegado: false,
      titularNombreCompleto: "NÃ©stor Javier Barreiro Delgado",
      titularCedula: "1309876543",
      titularCargo: "Director de InnovaciÃ³n y TecnologÃ­a",
      titularAreaUnidad: "DirecciÃ³n de TecnologÃ­a",
      titularEmail: "nestor.barreiro@manta.gob.ec",
      titularTelefonoFijo: "052611471 ext 205",
      titularMovilInstitucional: "0991593574",
      titularMovilPersonal: "0982604685",
      suplenteNombreCompleto: "Ing. Tatiana Lisbeth Zambrano SolÃ³rzano",
      suplenteCedula: "1314567892",
      suplenteCargo: "Jefa de Desarrollo de Sistemas",
      suplenteAreaUnidad: "DirecciÃ³n de TecnologÃ­a",
      suplenteEmail: "tatiana.zambrano@manta.gob.ec",
      suplenteTelefonoFijo: "052611471 ext 209",
      suplenteMovilInstitucional: "0993571594",
      suplenteMovilPersonal: "0984682605",
      serviciosHerramientas: [
        "Interoperabilidad SINARP",
        "Infodigital"
      ],
      areasUso: "DirecciÃ³n de Rentas y DirecciÃ³n de GestiÃ³n Territorial",
      procesosUso: "Consulta en tiempo real de vehÃ­culos y bienes raÃ­ces para patentes e impuestos prediales.",
      declaracionesAceptadas: true,
      ciudadFirma: "Manta",
      fechaFirma: "29/09/2026",
      firmadoDigitalmente: true,
      archivoDocumentoFirmado: "ARP-R01_Solicitud_Registro_GAD_Manta.pdf"
    }
  },
  {
    id: "SOL-ING-016",
    tipoTramite: "PROCESO_A_REGISTRO_INSTITUCION",
    codigoDocumental: "ARP-R01",
    tituloTramite: "Solicitud de Registro de InstituciÃ³n (Anexo A)",
    cedula: "1708529631",
    nombres: "Clara InÃ©s",
    apellidos: "Bustamante Vinueza",
    nombreCompleto: "Clara InÃ©s Bustamante Vinueza",
    iniciales: "CB",
    correo: "clara.bustamante@cnt.gob.ec",
    institucion: "CorporaciÃ³n Nacional de Telecomunicaciones (CNT EP)",
    fechaSolicitud: "29/09/2026 16:50",
    estado: "PENDIENTE_ASIGNACION_GESTION",
    documentos: [
      "ARP-R01_Solicitud_Registro_CNT.pdf",
      "Nombramiento_Gerente_CNT.pdf"
    ],
    anexoA: {
      entidadTipo: "Publica",
      nombreEntidad: "CorporaciÃ³n Nacional de Telecomunicaciones (CNT EP)",
      rucEntidad: "1768152560001",
      direccionEntidad: "Av. Amazonas N36-152 y Naciones Unidas, Quito",
      objetoSocial: "PrestaciÃ³n de servicios pÃºblicos y privados de telecomunicaciones en el Ecuador.",
      representanteLegalNombre: "Mgs. Lourdes Cuesta (Gerente General)",
      representanteLegalCargo: "Gerente General de CNT EP",
      representanteLegalEmail: "gerencia@cnt.gob.ec",
      esDelegado: false,
      titularNombreCompleto: "Clara InÃ©s Bustamante Vinueza",
      titularCedula: "1708529631",
      titularCargo: "Gerente de Seguridad de la InformaciÃ³n y Cumplimiento",
      titularAreaUnidad: "Gerencia de Seguridad",
      titularEmail: "clara.bustamante@cnt.gob.ec",
      titularTelefonoFijo: "023731700 ext 5010",
      titularMovilInstitucional: "0997531590",
      titularMovilPersonal: "0986420864",
      suplenteNombreCompleto: "Ing. Pablo AndrÃ©s YÃ¡nez Guarderas",
      suplenteCedula: "1716549873",
      suplenteCargo: "Jefe de InterconexiÃ³n y Servicios Mayoristas",
      suplenteAreaUnidad: "Gerencia de Redes e Infraestructura",
      suplenteEmail: "pablo.yanez@cnt.gob.ec",
      suplenteTelefonoFijo: "023731700 ext 5015",
      suplenteMovilInstitucional: "0991357924",
      suplenteMovilPersonal: "0982468013",
      serviciosHerramientas: [
        "Interoperabilidad SINARP",
        "Ficha de Registro Ãšnico del Ciudadano"
      ],
      areasUso: "Gerencia de Clientes Masivos y OficialÃ­a de Fraudes",
      procesosUso: "ValidaciÃ³n biomÃ©trica e identidad ciudadana en planes pospago y lÃ­neas telefÃ³nicas mÃ³viles.",
      declaracionesAceptadas: true,
      ciudadFirma: "Quito D.M.",
      fechaFirma: "29/09/2026",
      firmadoDigitalmente: true,
      archivoDocumentoFirmado: "ARP-R01_Solicitud_Registro_CNT.pdf"
    }
  },

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // CASOS DE PRUEBA DEL FLUJO DE NORMATIVIDAD (DIRECTOR: 2222222222 / PERSONAL: 3333333333)
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

  // CASO N1: PENDIENTE DE ASIGNACIÃ“N Â· NORMATIVIDAD (ReciÃ©n aprobada por GestiÃ³n, lista para asignar por Director)
  {
    id: "SOL-NORM-201",
    tipoTramite: "PROCESO_A_REGISTRO_INSTITUCION",
    codigoDocumental: "ARP-R01",
    tituloTramite: "Solicitud de Registro de InstituciÃ³n (Anexo A)",
    cedula: "1719988776",
    nombres: "Mariana",
    apellidos: "Almeida ProaÃ±o",
    nombreCompleto: "Mariana Almeida ProaÃ±o",
    iniciales: "MA",
    correo: "mariana.almeida@aduana.gob.ec",
    institucion: "Servicio Nacional de Aduana del Ecuador (SENAE)",
    fechaSolicitud: "29/09/2026 14:10",
    estado: "PENDIENTE_ASIGNACION_NORMATIVIDAD",
    fechaRevision: "29/09/2026 15:30",
    fechaAprobacionGestion: "29/09/2026 15:30",
    revisorGestion: "MarÃ­a Torres (Revisor GestiÃ³n)",
    revisor: undefined,
    revisorNormatividad: undefined,
    revisionIniciada: false,
    documentos: [
      "ARP-R01_Solicitud_Registro_SENAE.pdf",
      "Decreto_Ejecutivo_Nombramiento_SENAE.pdf",
      "Dictamen_Tecnico_Gestion_Aprobado.pdf"
    ],
    historial: [
      {
        id: "h-norm-201-1",
        fechaHora: "29/09/2026 14:10",
        accion: "Ingreso de trÃ¡mite",
        realizadoPor: "Mariana Almeida ProaÃ±o",
        rol: "Solicitante Institucional",
        detalles: "Formulario ARP-R01 suscrito y registrado formalmente en el sistema."
      },
      {
        id: "h-norm-201-2",
        fechaHora: "29/09/2026 14:20",
        accion: "Firma verificada en FirmaEC",
        realizadoPor: "FirmaEC Â· Servicio de CertificaciÃ³n",
        detalles: "Firma electrÃ³nica validada satisfactoriamente con certificado de persona jurÃ­dica."
      },
      {
        id: "h-norm-201-3",
        fechaHora: "29/09/2026 14:30",
        accion: "AsignaciÃ³n de trÃ¡mite",
        realizadoPor: "Director de GestiÃ³n y Registro",
        rol: "Director / Coordinador",
        detalles: "Asignado a MarÃ­a Torres para revisiÃ³n tÃ©cnica."
      },
      {
        id: "h-norm-201-4",
        fechaHora: "29/09/2026 15:30",
        accion: "Solicitud aprobada por GestiÃ³n",
        realizadoPor: "MarÃ­a Torres",
        rol: "Revisor de GestiÃ³n",
        detalles: "Anexo A revisado documental y tÃ©cnicamente con dictamen favorable. Pasa a Normatividad para emisiÃ³n de resoluciÃ³n institucional."
      }
    ],
    anexoA: {
      entidadTipo: "Publica",
      nombreEntidad: "Servicio Nacional de Aduana del Ecuador (SENAE)",
      rucEntidad: "1768025290001",
      direccionEntidad: "Av. 25 de Julio km 4.5, VÃ­a Puerto MarÃ­timo, Guayaquil",
      objetoSocial: "Control y facilitaciÃ³n del comercio exterior y recaudaciÃ³n aduanera.",
      representanteLegalNombre: "Ing. Gabriela SolÃ­s (Directora General)",
      representanteLegalCargo: "Directora General de SENAE",
      representanteLegalEmail: "direccion.general@aduana.gob.ec",
      esDelegado: false,
      titularNombreCompleto: "Mariana Almeida ProaÃ±o",
      titularCedula: "1719988776",
      titularCargo: "Directora de TecnologÃ­as de la InformaciÃ³n",
      titularAreaUnidad: "DirecciÃ³n de TI",
      titularEmail: "mariana.almeida@aduana.gob.ec",
      titularTelefonoFijo: "045006060 ext 1100",
      titularMovilInstitucional: "0998877665",
      titularMovilPersonal: "0987766554",
      suplenteNombreCompleto: "Ing. Roberto Carvajal",
      suplenteCedula: "0912233445",
      suplenteCargo: "Jefe de Interoperabilidad",
      suplenteAreaUnidad: "DirecciÃ³n de TI",
      suplenteEmail: "roberto.carvajal@aduana.gob.ec",
      suplenteTelefonoFijo: "045006060 ext 1105",
      suplenteMovilInstitucional: "0991122334",
      suplenteMovilPersonal: "0982233445",
      serviciosHerramientas: ["Interoperabilidad SINARP", "Ficha de Registro Ãšnico"],
      areasUso: "DirecciÃ³n de GestiÃ³n de Riesgo Aduanero",
      procesosUso: "Control aduanero e interoperabilidad de registros mercantiles de importadores.",
      declaracionesAceptadas: true,
      ciudadFirma: "Guayaquil",
      fechaFirma: "29/09/2026",
      firmadoDigitalmente: true,
      archivoDocumentoFirmado: "ARP-R01_Solicitud_Registro_SENAE.pdf"
    }
  },

  // CASO N2: PENDIENTE DE GENERAR RESOLUCIÃ“N (Asignado al personal facultado, aÃºn no inicia la redacciÃ³n formal) -> REASIGNABLE
  {
    id: "SOL-NORM-202",
    tipoTramite: "PROCESO_A_REGISTRO_INSTITUCION",
    codigoDocumental: "ARP-R01",
    tituloTramite: "Solicitud de Registro de InstituciÃ³n (Anexo A)",
    cedula: "1709911223",
    nombres: "Esteban",
    apellidos: "Morales Cifuentes",
    nombreCompleto: "Esteban Morales Cifuentes",
    iniciales: "EM",
    correo: "esteban.morales@epmmop.gob.ec",
    institucion: "Empresa PÃºblica Metropolitana de Movilidad y Obras PÃºblicas (EPMMOP)",
    fechaSolicitud: "29/09/2026 10:20",
    estado: "PENDIENTE_GENERAR_RESOLUCION",
    fechaRevision: "29/09/2026 12:40",
    fechaAprobacionGestion: "29/09/2026 12:40",
    revisorGestion: "MarÃ­a Torres (Revisor GestiÃ³n)",
    revisorNormatividad: undefined,
    revisor: "Personal facultado de Normatividad",
    fechaAsignacionNormatividad: "29/09/2026 13:00",
    observacionesAsignacion: "Verificar competencias institucionales para interconexiÃ³n catastral.",
    revisionIniciada: false,
    documentos: [
      "ARP-R01_Solicitud_Registro_EPMMOP.pdf",
      "Resolucion_Directorio_EPMMOP.pdf",
      "Dictamen_Tecnico_Gestion_Aprobado.pdf"
    ],
    historial: [
      {
        id: "h-norm-202-1",
        fechaHora: "29/09/2026 10:20",
        accion: "Ingreso de trÃ¡mite",
        realizadoPor: "Esteban Morales Cifuentes",
        rol: "Solicitante Institucional",
        detalles: "Formulario ARP-R01 suscrito y registrado formalmente en el sistema."
      },
      {
        id: "h-norm-202-2",
        fechaHora: "29/09/2026 12:40",
        accion: "Solicitud aprobada por GestiÃ³n",
        realizadoPor: "MarÃ­a Torres",
        rol: "Revisor de GestiÃ³n",
        detalles: "AprobaciÃ³n tÃ©cnica de Anexo A efectuada por GestiÃ³n. ContinÃºa a Normatividad."
      },
      {
        id: "h-norm-202-3",
        fechaHora: "29/09/2026 13:00",
        accion: "Responsable de Normatividad asignado",
        realizadoPor: "Director de Normatividad",
        rol: "Director de Normatividad",
        detalles: "Responsable: Personal facultado de Normatividad. Asignado por: Director de Normatividad. Observaciones: Verificar competencias institucionales para interconexiÃ³n catastral."
      }
    ],
    anexoA: {
      entidadTipo: "Publica",
      nombreEntidad: "Empresa PÃºblica Metropolitana de Movilidad y Obras PÃºblicas (EPMMOP)",
      rucEntidad: "1760003410001",
      direccionEntidad: "Calle 9 de Octubre N26-56 y Santa MarÃ­a, Quito",
      objetoSocial: "PlanificaciÃ³n, construcciÃ³n y mantenimiento vial y de espacios pÃºblicos en Quito.",
      representanteLegalNombre: "Arq. Claudia Otero",
      representanteLegalCargo: "Gerente General EPMMOP",
      representanteLegalEmail: "claudia.otero@epmmop.gob.ec",
      esDelegado: false,
      titularNombreCompleto: "Esteban Morales Cifuentes",
      titularCedula: "1709911223",
      titularCargo: "Gerente de TecnologÃ­as de la InformaciÃ³n",
      titularAreaUnidad: "Gerencia de TI",
      titularEmail: "esteban.morales@epmmop.gob.ec",
      titularTelefonoFijo: "022907005 ext 201",
      titularMovilInstitucional: "0993456789",
      titularMovilPersonal: "0982345678",
      suplenteNombreCompleto: "Ing. SofÃ­a VillacrÃ©s",
      suplenteCedula: "1718899001",
      suplenteCargo: "Especialista de Infraestructura",
      suplenteAreaUnidad: "Gerencia de TI",
      suplenteEmail: "sofia.villacres@epmmop.gob.ec",
      suplenteTelefonoFijo: "022907005 ext 204",
      suplenteMovilInstitucional: "0994567890",
      suplenteMovilPersonal: "0983456789",
      serviciosHerramientas: ["Interoperabilidad SINARP"],
      areasUso: "Gerencia de Operaciones de la Movilidad",
      procesosUso: "ValidaciÃ³n de vehÃ­culos y tÃ­tulos de propiedad en vÃ­as pÃºblicas.",
      declaracionesAceptadas: true,
      ciudadFirma: "Quito D.M.",
      fechaFirma: "29/09/2026",
      firmadoDigitalmente: true,
      archivoDocumentoFirmado: "ARP-R01_Solicitud_Registro_EPMMOP.pdf"
    }
  },

  // CASO N3: EN GENERACIÃ“N DE RESOLUCIÃ“N (Personal iniciÃ³ redacciÃ³n/anÃ¡lisis jurÃ­dico formal) -> BLOQUEADO PARA REASIGNACIÃ“N
  {
    id: "SOL-NORM-203",
    tipoTramite: "PROCESO_A_REGISTRO_INSTITUCION",
    codigoDocumental: "ARP-R01",
    tituloTramite: "Solicitud de Registro de InstituciÃ³n (Anexo A)",
    cedula: "1711223344",
    nombres: "Patricia",
    apellidos: "Jaramillo Viteri",
    nombreCompleto: "Patricia Jaramillo Viteri",
    iniciales: "PJ",
    correo: "patricia.jaramillo@ambiente.gob.ec",
    institucion: "Ministerio del Ambiente, Agua y TransiciÃ³n EcolÃ³gica",
    fechaSolicitud: "28/09/2026 11:30",
    estado: "EN_GENERACION_RESOLUCION",
    fechaRevision: "28/09/2026 16:00",
    fechaAprobacionGestion: "28/09/2026 16:00",
    revisorGestion: "MarÃ­a Torres (Revisor GestiÃ³n)",
    revisorNormatividad: undefined,
    revisor: "Personal facultado de Normatividad",
    fechaAsignacionNormatividad: "29/09/2026 08:30",
    observacionesAsignacion: "Priorizar proyecto de resoluciÃ³n institucional interconectando Ã¡reas protegidas.",
    revisionIniciada: true,
    fechaInicioRevision: "29/09/2026 09:15",
    documentos: [
      "ARP-R01_Solicitud_Registro_MAATE.pdf",
      "Decreto_Ejecutivo_MAATE.pdf",
      "Dictamen_Tecnico_Gestion_Aprobado.pdf",
      "Borrador_Resolucion_MAATE_v1.docx"
    ],
    historial: [
      {
        id: "h-norm-203-1",
        fechaHora: "28/09/2026 11:30",
        accion: "Ingreso de trÃ¡mite",
        realizadoPor: "Patricia Jaramillo Viteri",
        rol: "Solicitante Institucional",
        detalles: "Formulario ARP-R01 suscrito y registrado formalmente en el sistema."
      },
      {
        id: "h-norm-203-2",
        fechaHora: "28/09/2026 16:00",
        accion: "Solicitud aprobada por GestiÃ³n",
        realizadoPor: "MarÃ­a Torres",
        rol: "Revisor de GestiÃ³n",
        detalles: "ValidaciÃ³n tÃ©cnica y documental aprobada por GestiÃ³n."
      },
      {
        id: "h-norm-203-3",
        fechaHora: "29/09/2026 08:30",
        accion: "Responsable de Normatividad asignado",
        realizadoPor: "Director de Normatividad",
        rol: "Director de Normatividad",
        detalles: "Responsable: Personal facultado de Normatividad. Asignado por: Director de Normatividad."
      },
      {
        id: "h-norm-203-4",
        fechaHora: "29/09/2026 09:15",
        accion: "GeneraciÃ³n de resoluciÃ³n iniciada",
        realizadoPor: "Personal facultado de Normatividad",
        rol: "Personal facultado de Normatividad",
        detalles: "El funcionario ha iniciado la formulaciÃ³n de la resoluciÃ³n institucional y el cotejo legal de considerandos."
      }
    ],
    anexoA: {
      entidadTipo: "Publica",
      nombreEntidad: "Ministerio del Ambiente, Agua y TransiciÃ³n EcolÃ³gica",
      rucEntidad: "1768138780001",
      direccionEntidad: "Calle Madrid 1159 y AndalucÃ­a, Quito",
      objetoSocial: "RectorÃ­a, planificaciÃ³n, regulaciÃ³n, control y gestiÃ³n ambiental y de recursos hÃ­dricos.",
      representanteLegalNombre: "Mgs. Sade Fritschi",
      representanteLegalCargo: "Ministra del Ambiente",
      representanteLegalEmail: "despacho@ambiente.gob.ec",
      esDelegado: false,
      titularNombreCompleto: "Patricia Jaramillo Viteri",
      titularCedula: "1711223344",
      titularCargo: "Directora de TecnologÃ­as de InformaciÃ³n y ComunicaciÃ³n",
      titularAreaUnidad: "DNTIC",
      titularEmail: "patricia.jaramillo@ambiente.gob.ec",
      titularTelefonoFijo: "023987600 ext 1401",
      titularMovilInstitucional: "0995678901",
      titularMovilPersonal: "0984567890",
      suplenteNombreCompleto: "Ing. AndrÃ©s BenalcÃ¡zar",
      suplenteCedula: "1719988112",
      suplenteCargo: "Especialista de Sistemas GeogrÃ¡ficos",
      suplenteAreaUnidad: "DNTIC",
      suplenteEmail: "andres.benalcazar@ambiente.gob.ec",
      suplenteTelefonoFijo: "023987600 ext 1405",
      suplenteMovilInstitucional: "0996789012",
      suplenteMovilPersonal: "0985678901",
      serviciosHerramientas: ["Interoperabilidad SINARP", "Ficha de Registro Ãšnico"],
      areasUso: "SubsecretarÃ­a de Patrimonio Natural",
      procesosUso: "ValidaciÃ³n de tenencia predial y servidumbres en zonas de amortiguamiento ecolÃ³gico.",
      declaracionesAceptadas: true,
      ciudadFirma: "Quito D.M.",
      fechaFirma: "28/09/2026",
      firmadoDigitalmente: true,
      archivoDocumentoFirmado: "ARP-R01_Solicitud_Registro_MAATE.pdf"
    }
  },

  // CASO N4: GENERACIÃ“N PENDIENTE (Pausa o requerimiento de consulta jurÃ­dica interna con causa registrada)
  {
    id: "SOL-NORM-204",
    tipoTramite: "PROCESO_A_REGISTRO_INSTITUCION",
    codigoDocumental: "ARP-R01",
    tituloTramite: "Solicitud de Registro de InstituciÃ³n (Anexo A)",
    cedula: "1706655443",
    nombres: "Rodrigo",
    apellidos: "Albuja Moncayo",
    nombreCompleto: "Rodrigo Albuja Moncayo",
    iniciales: "RA",
    correo: "rodrigo.albuja@emaseo.gob.ec",
    institucion: "Empresa PÃºblica Metropolitana de Aseo (EMASEO EP)",
    fechaSolicitud: "27/09/2026 15:45",
    estado: "GENERACION_PENDIENTE",
    fechaRevision: "28/09/2026 10:10",
    fechaAprobacionGestion: "28/09/2026 10:10",
    revisorGestion: "MarÃ­a Torres (Revisor GestiÃ³n)",
    revisorNormatividad: "Gabriel SuÃ¡rez",
    revisor: "Gabriel SuÃ¡rez",
    fechaAsignacionNormatividad: "28/09/2026 11:00",
    observacionesAsignacion: "Revisar alcance de la personerÃ­a municipal en los considerandos.",
    revisionIniciada: true,
    fechaInicioRevision: "28/09/2026 14:00",
    motivoRechazo: "Se solicitÃ³ aclaraciÃ³n interna sobre la vigencia del convenio marco interinstitucional previo a la suscripciÃ³n de la resoluciÃ³n.",
    documentos: [
      "ARP-R01_Solicitud_Registro_EMASEO.pdf",
      "Dictamen_Tecnico_Gestion_Aprobado.pdf",
      "Memorando_Consulta_Juridica_041.pdf"
    ],
    historial: [
      {
        id: "h-norm-204-1",
        fechaHora: "27/09/2026 15:45",
        accion: "Ingreso de trÃ¡mite",
        realizadoPor: "Rodrigo Albuja Moncayo",
        rol: "Solicitante Institucional",
        detalles: "Formulario ARP-R01 suscrito y registrado formalmente en el sistema."
      },
      {
        id: "h-norm-204-2",
        fechaHora: "28/09/2026 10:10",
        accion: "Solicitud aprobada por GestiÃ³n",
        realizadoPor: "MarÃ­a Torres",
        rol: "Revisor de GestiÃ³n",
        detalles: "ValidaciÃ³n de Anexo A efectuada satisfactoriamente por GestiÃ³n."
      },
      {
        id: "h-norm-204-3",
        fechaHora: "28/09/2026 11:00",
        accion: "Responsable de Normatividad asignado",
        realizadoPor: "Director de Normatividad",
        rol: "Director de Normatividad",
        detalles: "Responsable: Gabriel SuÃ¡rez. Asignado por: Director de Normatividad."
      },
      {
        id: "h-norm-204-4",
        fechaHora: "28/09/2026 16:30",
        accion: "Pausa en generaciÃ³n de resoluciÃ³n",
        realizadoPor: "Gabriel SuÃ¡rez",
        rol: "Personal facultado de Normatividad",
        detalles: "Se solicitÃ³ aclaraciÃ³n interna sobre la vigencia del convenio marco interinstitucional previo a la suscripciÃ³n de la resoluciÃ³n."
      }
    ],
    anexoA: {
      entidadTipo: "Publica",
      nombreEntidad: "Empresa PÃºblica Metropolitana de Aseo (EMASEO EP)",
      rucEntidad: "1760004570001",
      direccionEntidad: "Av. Mariscal Sucre y Mariana de JesÃºs, Quito",
      objetoSocial: "GestiÃ³n integral de residuos sÃ³lidos en el Distrito Metropolitano de Quito.",
      representanteLegalNombre: "Ing. Jorge Jaramillo",
      representanteLegalCargo: "Gerente General EMASEO",
      representanteLegalEmail: "gerencia@emaseo.gob.ec",
      esDelegado: false,
      titularNombreCompleto: "Rodrigo Albuja Moncayo",
      titularCedula: "1706655443",
      titularCargo: "Coordinador de TICS",
      titularAreaUnidad: "CoordinaciÃ³n de TecnologÃ­as",
      titularEmail: "rodrigo.albuja@emaseo.gob.ec",
      titularTelefonoFijo: "023310555 ext 102",
      titularMovilInstitucional: "0997890123",
      titularMovilPersonal: "0986789012",
      suplenteNombreCompleto: "Ing. Marcelo Endara",
      suplenteCedula: "1713344556",
      suplenteCargo: "Analista de Redes y Seguridad",
      suplenteAreaUnidad: "CoordinaciÃ³n de TecnologÃ­as",
      suplenteEmail: "marcelo.endara@emaseo.gob.ec",
      suplenteTelefonoFijo: "023310555 ext 106",
      suplenteMovilInstitucional: "0998901234",
      suplenteMovilPersonal: "0987890123",
      serviciosHerramientas: ["Interoperabilidad SINARP"],
      areasUso: "DirecciÃ³n de Operaciones",
      procesosUso: "ValidaciÃ³n de flota vehicular para recolecciÃ³n automatizada.",
      declaracionesAceptadas: true,
      ciudadFirma: "Quito D.M.",
      fechaFirma: "27/09/2026",
      firmadoDigitalmente: true,
      archivoDocumentoFirmado: "ARP-R01_Solicitud_Registro_EMASEO.pdf"
    }
  },

  // CASO N5: RESOLUCIÃ“N GENERADA (ResoluciÃ³n emitida, firmada y finalizada con nÃºmero de resoluciÃ³n institucional)
  {
    id: "SOL-NORM-205",
    tipoTramite: "PROCESO_A_REGISTRO_INSTITUCION",
    codigoDocumental: "ARP-R01",
    tituloTramite: "Solicitud de Registro de InstituciÃ³n (Anexo A)",
    cedula: "1718877665",
    nombres: "Valeria",
    apellidos: "Montenegro CÃ¡rdenas",
    nombreCompleto: "Valeria Montenegro CÃ¡rdenas",
    iniciales: "VM",
    correo: "valeria.montenegro@snai.gob.ec",
    institucion: "Servicio Nacional de AtenciÃ³n Integral a Personas Adultas Privadas de la Libertad (SNAI)",
    fechaSolicitud: "25/09/2026 09:30",
    estado: "PENDIENTE_DE_FIRMA",
    fechaRevision: "26/09/2026 17:00",
    fechaAprobacionGestion: "25/09/2026 16:00",
    revisorGestion: "MarÃ­a Torres (Revisor GestiÃ³n)",
    revisorNormatividad: "Personal facultado de Normatividad",
    revisor: "Personal facultado de Normatividad",
    fechaAsignacionNormatividad: "26/09/2026 08:30",
    revisionIniciada: true,
    fechaInicioRevision: "26/09/2026 09:00",
    resolucion: "RES-DINARP-2026-0042",
    documentos: [
      "ARP-R01_Solicitud_Registro_SNAI.pdf",
      "Dictamen_Tecnico_Gestion_Aprobado.pdf",
      "RES-DINARP-2026-0042_Para_Firma.pdf"
    ],
    historial: [
      {
        id: "h-norm-205-1",
        fechaHora: "25/09/2026 09:30",
        accion: "Ingreso de trÃ¡mite",
        realizadoPor: "Valeria Montenegro CÃ¡rdenas",
        rol: "Solicitante Institucional",
        detalles: "Formulario ARP-R01 suscrito y registrado formalmente en el sistema."
      },
      {
        id: "h-norm-205-2",
        fechaHora: "25/09/2026 16:00",
        accion: "Solicitud aprobada por GestiÃ³n",
        realizadoPor: "MarÃ­a Torres",
        rol: "Revisor de GestiÃ³n",
        detalles: "Anexo A aprobado por GestiÃ³n. Expediente transferido a Normatividad."
      },
      {
        id: "h-norm-205-3",
        fechaHora: "26/09/2026 08:30",
        accion: "Responsable de Normatividad asignado",
        realizadoPor: "Director de Normatividad",
        rol: "Director de Normatividad",
        detalles: "Responsable: Personal facultado de Normatividad. Asignado por: Director de Normatividad."
      },
      {
        id: "h-norm-205-4",
        fechaHora: "26/09/2026 09:00",
        accion: "GeneraciÃ³n de resoluciÃ³n iniciada",
        realizadoPor: "Personal facultado de Normatividad",
        rol: "Personal facultado de Normatividad",
        detalles: "FormulaciÃ³n de considerandos y articulado de la resoluciÃ³n institucional."
      },
      {
        id: "h-norm-205-5",
        fechaHora: "26/09/2026 17:00",
        accion: "ResoluciÃ³n institucional generada",
        realizadoPor: "Personal facultado de Normatividad",
        rol: "Personal facultado de Normatividad",
        detalles: "ResoluciÃ³n institucional RES-DINARP-2026-0042 formulada y vinculada. Expediente preparado para firma de MÃ¡xima Autoridad (INS-07)."
      },
      {
        id: "h-norm-205-6",
        fechaHora: "26/09/2026 17:05",
        accion: "Pendiente de firma",
        realizadoPor: "Sistema DINARP",
        rol: "Sistema",
        detalles: "Enviado a proceso de firma externa por la MÃ¡xima Autoridad de DINARP mediante FirmaEC. La activaciÃ³n institucional y generaciÃ³n de invitaciones B permanecen bloqueadas hasta la verificaciÃ³n de la firma."
      }
    ],
    anexoA: {
      entidadTipo: "Publica",
      nombreEntidad: "Servicio Nacional de AtenciÃ³n Integral a Personas Adultas Privadas de la Libertad (SNAI)",
      rucEntidad: "1768194480001",
      direccionEntidad: "Av. Orellana E3-62 y 9 de Octubre, Quito",
      objetoSocial: "AdministraciÃ³n del Sistema Penitenciario Nacional y medidas socioeducativas.",
      representanteLegalNombre: "Gral. Fausto Cobo",
      representanteLegalCargo: "Director General del SNAI",
      representanteLegalEmail: "direccion@snai.gob.ec",
      esDelegado: false,
      titularNombreCompleto: "Valeria Montenegro CÃ¡rdenas",
      titularCedula: "1718877665",
      titularCargo: "Directora de TecnologÃ­as de la InformaciÃ³n",
      titularAreaUnidad: "DirecciÃ³n de TI",
      titularEmail: "valeria.montenegro@snai.gob.ec",
      titularTelefonoFijo: "023932520 ext 1102",
      titularMovilInstitucional: "0998901234",
      titularMovilPersonal: "0987890123",
      suplenteNombreCompleto: "Ing. Santiago Morales",
      suplenteCedula: "1715566778",
      suplenteCargo: "Jefe de Desarrollo de Sistemas",
      suplenteAreaUnidad: "DirecciÃ³n de TI",
      suplenteEmail: "santiago.morales@snai.gob.ec",
      suplenteTelefonoFijo: "023932520 ext 1108",
      suplenteMovilInstitucional: "0999012345",
      suplenteMovilPersonal: "0988901234",
      serviciosHerramientas: ["Interoperabilidad SINARP", "Ficha de Registro Ãšnico"],
      areasUso: "DirecciÃ³n de Seguridad Penitenciaria",
      procesosUso: "VerificaciÃ³n de identidad jurÃ­dica de personas privadas de libertad e interoperabilidad registral.",
      declaracionesAceptadas: true,
      ciudadFirma: "Quito D.M.",
      fechaFirma: "25/09/2026",
      firmadoDigitalmente: true,
      archivoDocumentoFirmado: "ARP-R01_Solicitud_Registro_SNAI.pdf"
    }
  }
];

export function getStoredSolicitudesIngreso(): SolicitudIngreso[] {
  if (typeof window === "undefined") return INITIAL_SOLICITUDES_INGRESO;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INGRESOS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_INGRESOS, JSON.stringify(INITIAL_SOLICITUDES_INGRESO));
      return INITIAL_SOLICITUDES_INGRESO;
    }
    const parsed: SolicitudIngreso[] = JSON.parse(raw);
    return parsed;
  } catch {
    return INITIAL_SOLICITUDES_INGRESO;
  }
}

export function saveStoredSolicitudesIngreso(items: SolicitudIngreso[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_INGRESOS, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("dinarp_ingresos_updated", { detail: items }));
  } catch {
    // Ignore storage issues
  }
}

export function useSolicitudesIngresoStore() {
  const [solicitudes, setSolicitudes] = useState<SolicitudIngreso[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setSolicitudes(getStoredSolicitudesIngreso());
    setIsLoaded(true);

    const handleUpdate = (e: CustomEvent<SolicitudIngreso[]>) => {
      if (e.detail) {
        setSolicitudes(e.detail);
      }
    };

    window.addEventListener("dinarp_ingresos_updated", handleUpdate as EventListener);
    return () => {
      window.removeEventListener("dinarp_ingresos_updated", handleUpdate as EventListener);
    };
  }, []);

  // Aprobar solicitud (BPM: Proceso A preregistra coordinadores y notifica; Proceso B activa coordinador; Proceso C aprueba y abre preregistro)
  const aprobarSolicitud = useCallback((id: string, revisor: string = "MarÃ­a Torres (DirecciÃ³n de GestiÃ³n y Registro)") => {
    setSolicitudes((prev) => {
      const now = new Date();
      const fechaStr = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const updated = prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            estado: "Aprobada" as EstadoSolicitudIngreso,
            fechaRevision: fechaStr,
            revisor,
            motivoRechazo: undefined
          };
        }
        return item;
      });
      saveStoredSolicitudesIngreso(updated);
      return updated;
    });
  }, []);

  // Rechazar solicitud (BPM: Requiere registrar observaciones obligatorias y notificar a la entidad)
  const rechazarSolicitud = useCallback((id: string, motivo: string, revisor: string = "MarÃ­a Torres (DirecciÃ³n de GestiÃ³n y Registro)") => {
    setSolicitudes((prev) => {
      const now = new Date();
      const fechaStr = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const updated = prev.map((item) => {
        if (item.id === id) {
          const nuevoHistorial = [...(item.historial || [])];
          nuevoHistorial.push({
            id: `hist-${Date.now()}`,
            fechaHora: fechaStr,
            accion: "Solicitud rechazada por GestiÃ³n",
            realizadoPor: revisor,
            rol: "Equipo de GestiÃ³n",
            detalles: `Motivo:\n"${motivo.trim()}"\n\nNotificaciÃ³n:\nInstituciÃ³n notificada por correo electrÃ³nico.`
          });

          return {
            ...item,
            estado: "Rechazada" as EstadoSolicitudIngreso,
            fechaRevision: fechaStr,
            revisor,
            motivoRechazo: motivo.trim(),
            rechazadoPor: "GESTION" as const,
            historial: nuevoHistorial
          };
        }
        return item;
      });
      saveStoredSolicitudesIngreso(updated);
      return updated;
    });
  }, []);

  // Agregar TrÃ¡mite Proceso A (Registro de InstituciÃ³n - Anexo A)
  const agregarRegistroInstitucion = useCallback((anexoA: DatosAnexoA, estado: EstadoSolicitudIngreso = "Pendiente") => {
    setSolicitudes((prev) => {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      const fmt = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
      const fechaStr = fmt(now);
      const nextNum = prev.length + 1;
      const id = `SOL-ING-${String(nextNum).padStart(3, "0")}`;

      const docs = ["ARP-R01_Solicitud_Acceso_SINARP.pdf"];
      if (anexoA.esDelegado && anexoA.archivoSoporteDelegacion) {
        docs.push(anexoA.archivoSoporteDelegacion);
      }

      const t_base = now.getTime();
      const initialHistorial = [
        {
          id: `hist-anexo-${t_base}`,
          fechaHora: fmt(new Date(t_base - 25 * 60 * 1000)),
          accion: "Anexo A completado",
          realizadoPor: anexoA.representanteLegalNombre || anexoA.titularNombreCompleto,
          detalles: `Formulario de solicitud de acceso al SINARP completado en el Portal Web DINARP con informaciÃ³n institucional de ${anexoA.nombreEntidad}.`
        },
        {
          id: `hist-envio-firma-${t_base}`,
          fechaHora: fmt(new Date(t_base - 15 * 60 * 1000)),
          accion: "Enviado a FirmaEC",
          realizadoPor: anexoA.representanteLegalNombre || anexoA.titularNombreCompleto,
          detalles: "Documento generado (ARP-R01) enviado al servicio de FirmaEC para proceso de suscripciÃ³n digital del Representante Legal."
        },
        {
          id: `hist-verif-firma-${t_base}`,
          fechaHora: fmt(new Date(t_base - 6 * 60 * 1000)),
          accion: "Firma verificada en FirmaEC",
          realizadoPor: "FirmaEC Â· Servicio de CertificaciÃ³n",
          detalles: `FirmaEC confirmÃ³ correctamente la firma electrÃ³nica del documento y se recuperaron y validaron los datos correspondientes del certificado digital del firmante (${anexoA.representanteLegalNombre || "Representante Legal"}).`
        },
        {
          id: `hist-datos-firma-${t_base}`,
          fechaHora: fmt(new Date(t_base - 3 * 60 * 1000)),
          accion: "Datos de firma confirmados",
          realizadoPor: "Portal Web DINARP / Interoperabilidad",
          detalles: "ValidaciÃ³n tÃ©cnica de integridad del archivo firmado, estampa cronolÃ³gica y coincidencia de identidad del firmante con personerÃ­a jurÃ­dica."
        },
        {
          id: `hist-envio-gestion-${t_base}`,
          fechaHora: fechaStr,
          accion: "Solicitud enviada a GestiÃ³n DINARP",
          realizadoPor: anexoA.titularNombreCompleto || anexoA.nombreEntidad,
          detalles: "Expediente digital verificado e ingresado formalmente a la bandeja de entrada de la DirecciÃ³n de GestiÃ³n y Registro DINARP para asignaciÃ³n de revisor."
        }
      ];

      const newSol: SolicitudIngreso = {
        id,
        tipoTramite: "PROCESO_A_REGISTRO_INSTITUCION",
        codigoDocumental: "ARP-R01",
        tituloTramite: "Solicitud de Acceso SINARP (Registro InstituciÃ³n)",
        cedula: anexoA.titularCedula,
        nombres: anexoA.titularNombreCompleto.split(" ")[0] || anexoA.titularNombreCompleto,
        apellidos: anexoA.titularNombreCompleto.split(" ").slice(1).join(" ") || "",
        nombreCompleto: anexoA.titularNombreCompleto,
        iniciales: anexoA.titularNombreCompleto.slice(0, 2).toUpperCase(),
        correo: anexoA.titularEmail,
        institucion: anexoA.nombreEntidad,
        fechaSolicitud: fechaStr,
        estado,
        documentos: docs,
        anexoA,
        historial: initialHistorial
      };

      const updated = [newSol, ...prev];
      saveStoredSolicitudesIngreso(updated);
      return updated;
    });
  }, []);

  // Agregar TrÃ¡mite Proceso B (Enrolamiento de Coordinador - Anexo B)
  const agregarEnrolamientoCoordinador = useCallback((anexoB: DatosAnexoB, estado: EstadoSolicitudIngreso = "PENDIENTE_ASIGNACION_GESTION") => {
    setSolicitudes((prev) => {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      const fmt = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
      const fechaStr = fmt(now);
      const nextNum = prev.length + 1;
      const id = `SOL-ING-${String(nextNum).padStart(3, "0")}`;

      const t_base = now.getTime();
      const initialHistorial = [
        {
          id: `hist-invitacion-${t_base}`,
          fechaHora: fmt(new Date(t_base - 20 * 60 * 1000)),
          accion: "InvitaciÃ³n validada",
          realizadoPor: anexoB.funcionarioNombre,
          rol: "Coordinador Designado",
          detalles: `InvitaciÃ³n B vigente verificada para ${anexoB.funcionarioNombre} como ${anexoB.rolAsignado || "COORDINADOR TITULAR"} de ${anexoB.nombreEntidad}.`
        },
        {
          id: `hist-anexo-b-iniciado-${t_base}`,
          fechaHora: fmt(new Date(t_base - 14 * 60 * 1000)),
          accion: "Anexo B iniciado",
          realizadoPor: anexoB.funcionarioNombre,
          rol: "Coordinador Designado",
          detalles: "Borrador de formulario Anexo B completado y tÃ©rminos del Acuerdo de Uso y Confidencialidad aceptados."
        },
        {
          id: `hist-envio-firma-${t_base}`,
          fechaHora: fmt(new Date(t_base - 8 * 60 * 1000)),
          accion: "Enviado a FirmaEC",
          realizadoPor: anexoB.funcionarioNombre,
          rol: "Coordinador Designado",
          detalles: "Documento oficial ARP-R02 enviado al servicio de FirmaEC para proceso de suscripciÃ³n digital del Coordinador."
        },
        {
          id: `hist-firma-verificada-${t_base}`,
          fechaHora: fmt(new Date(t_base - 3 * 60 * 1000)),
          accion: "Firma verificada en FirmaEC",
          realizadoPor: "FirmaEC Â· Servicio de CertificaciÃ³n",
          detalles: `FirmaEC confirmÃ³ correctamente la firma electrÃ³nica del Acuerdo de Confidencialidad y se validÃ³ el certificado de ${anexoB.funcionarioNombre}.`
        },
        {
          id: `hist-envio-gestion-${t_base}`,
          fechaHora: fechaStr,
          accion: "Anexo B enviado a GestiÃ³n DINARP",
          realizadoPor: anexoB.funcionarioNombre,
          rol: "Coordinador Designado",
          detalles: "Acuerdo de Confidencialidad (Anexo B) ingresado formalmente a la DirecciÃ³n de GestiÃ³n y Registro DINARP para asignaciÃ³n de revisor."
        }
      ];

      const newSol: SolicitudIngreso = {
        id,
        tipoTramite: "PROCESO_B_ENROLAMIENTO_COORDINADOR",
        codigoDocumental: "ARP-R02",
        tituloTramite: "Anexo B â€” Enrolamiento de Coordinador",
        cedula: anexoB.funcionarioCedula,
        nombres: anexoB.funcionarioNombre.split(" ")[0] || anexoB.funcionarioNombre,
        apellidos: anexoB.funcionarioNombre.split(" ").slice(1).join(" ") || "",
        nombreCompleto: anexoB.funcionarioNombre,
        iniciales: anexoB.funcionarioNombre.slice(0, 2).toUpperCase(),
        correo: anexoB.funcionarioEmail || `${anexoB.funcionarioNombre.toLowerCase().replace(/\s+/g, ".")}@institucion.gob.ec`,
        institucion: anexoB.nombreEntidad,
        fechaSolicitud: fechaStr,
        estado,
        documentos: ["ARP-R02_Acuerdo_Uso_Confidencialidad_Firmado.pdf"],
        historial: initialHistorial,
        anexoB
      };

      const updated = [newSol, ...prev];
      saveStoredSolicitudesIngreso(updated);
      return updated;
    });
  }, []);

  // Agregar TrÃ¡mite Proceso C (Cambio de Coordinador - Anexo C)
  const agregarCambioCoordinador = useCallback((anexoC: DatosAnexoC) => {
    setSolicitudes((prev) => {
      const now = new Date();
      const fechaStr = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const nextNum = prev.length + 1;
      const id = `SOL-ING-${String(nextNum).padStart(3, "0")}`;

      const personaNombre = anexoC.nuevoTitularNombre || anexoC.nuevoSuplenteNombre || anexoC.inicialSuplenteNombre || "Coordinador Solicitado";
      const personaCedula = anexoC.nuevoTitularCedula || anexoC.nuevoSuplenteCedula || anexoC.inicialSuplenteCedula || "1700000000";
      const personaEmail = anexoC.nuevoTitularEmail || anexoC.nuevoSuplenteEmail || anexoC.inicialSuplenteEmail || "coordinador@institucion.gob.ec";

      const docs = ["ARP-R03_Cambio_Coordinador_Institucional.pdf"];
      if (anexoC.esDelegado && anexoC.archivoSoporteDelegacion) {
        docs.push(anexoC.archivoSoporteDelegacion);
      }

      const newSol: SolicitudIngreso = {
        id,
        tipoTramite: "PROCESO_C_CAMBIO_COORDINADOR",
        codigoDocumental: "ARP-R03",
        tituloTramite: "Cambio de Coordinador Institucional (ARP-R03)",
        cedula: personaCedula,
        nombres: personaNombre.split(" ")[0] || personaNombre,
        apellidos: personaNombre.split(" ").slice(1).join(" ") || "",
        nombreCompleto: personaNombre,
        iniciales: personaNombre.slice(0, 2).toUpperCase(),
        correo: personaEmail,
        institucion: anexoC.nombreEntidad,
        fechaSolicitud: fechaStr,
        estado: "Pendiente",
        documentos: docs,
        anexoC
      };

      const updated = [newSol, ...prev];
      saveStoredSolicitudesIngreso(updated);
      return updated;
    });
  }, []);

  // Helper para validar cÃ©dula en Proceso B contra preregistros aprobados (BPM Proceso B)
  const buscarPreregistroPorCedula = useCallback((cedula: string) => {
    const list = getStoredSolicitudesIngreso();
    const cleanCedula = cedula.trim();

    // 1. Buscar si hay una instituciÃ³n aprobada en Proceso A con esta cÃ©dula
    for (const sol of list) {
      if (
        sol.tipoTramite === "PROCESO_A_REGISTRO_INSTITUCION" &&
        (sol.estado === "INSTITUCION_ACTIVA" || sol.estado === "Aprobada" || sol.estado === "APROBADO_FINAL") &&
        sol.anexoA
      ) {
        if (sol.anexoA.titularCedula === cleanCedula) {
          return {
            encontrado: true,
            invitacionValida: true,
            tipo: "TITULAR",
            nombreCompleto: sol.anexoA.titularNombreCompleto,
            cedula: sol.anexoA.titularCedula,
            cargo: sol.anexoA.titularCargo,
            correo: sol.anexoA.titularEmail,
            institucion: sol.anexoA.nombreEntidad,
            direccion: sol.anexoA.direccionEntidad,
            representanteLegal: sol.anexoA.representanteLegalNombre,
            origenTramiteId: sol.id,
            yaEnrolado: list.some((s) => s.tipoTramite === "PROCESO_B_ENROLAMIENTO_COORDINADOR" && s.cedula === cleanCedula && (s.estado === "Aprobada" || s.estado === "APROBADO_FINAL"))
          };
        }
        if (sol.anexoA.suplenteCedula === cleanCedula) {
          return {
            encontrado: true,
            invitacionValida: true,
            tipo: "SUPLENTE",
            nombreCompleto: sol.anexoA.suplenteNombreCompleto,
            cedula: sol.anexoA.suplenteCedula,
            cargo: sol.anexoA.suplenteCargo,
            correo: sol.anexoA.suplenteEmail,
            institucion: sol.anexoA.nombreEntidad,
            direccion: sol.anexoA.direccionEntidad,
            representanteLegal: sol.anexoA.representanteLegalNombre,
            origenTramiteId: sol.id,
            yaEnrolado: list.some((s) => s.tipoTramite === "PROCESO_B_ENROLAMIENTO_COORDINADOR" && s.cedula === cleanCedula && (s.estado === "Aprobada" || s.estado === "APROBADO_FINAL"))
          };
        }
      }

      // 2. Buscar si hay un cambio de coordinador aprobado en Proceso C con esta cÃ©dula
      if (sol.tipoTramite === "PROCESO_C_CAMBIO_COORDINADOR" && sol.estado === "Aprobada" && sol.anexoC) {
        if (sol.anexoC.nuevoTitularCedula === cleanCedula) {
          return {
            encontrado: true,
            tipo: "TITULAR",
            nombreCompleto: sol.anexoC.nuevoTitularNombre || "",
            cedula: cleanCedula,
            cargo: sol.anexoC.nuevoTitularCargo || "",
            correo: sol.anexoC.nuevoTitularEmail || "",
            institucion: sol.anexoC.nombreEntidad,
            direccion: "DirecciÃ³n institucional registrada",
            representanteLegal: sol.anexoC.representanteLegalNombre,
            origenTramiteId: sol.id,
            yaEnrolado: list.some((s) => s.tipoTramite === "PROCESO_B_ENROLAMIENTO_COORDINADOR" && s.cedula === cleanCedula && s.estado === "Aprobada")
          };
        }
        if (sol.anexoC.nuevoSuplenteCedula === cleanCedula || sol.anexoC.inicialSuplenteCedula === cleanCedula) {
          return {
            encontrado: true,
            tipo: "SUPLENTE",
            nombreCompleto: sol.anexoC.nuevoSuplenteNombre || sol.anexoC.inicialSuplenteNombre || "",
            cedula: cleanCedula,
            cargo: sol.anexoC.nuevoSuplenteCargo || sol.anexoC.inicialSuplenteCargo || "",
            correo: sol.anexoC.nuevoSuplenteEmail || sol.anexoC.inicialSuplenteEmail || "",
            institucion: sol.anexoC.nombreEntidad,
            direccion: "DirecciÃ³n institucional registrada",
            representanteLegal: sol.anexoC.representanteLegalNombre,
            origenTramiteId: sol.id,
            yaEnrolado: list.some((s) => s.tipoTramite === "PROCESO_B_ENROLAMIENTO_COORDINADOR" && s.cedula === cleanCedula && s.estado === "Aprobada")
          };
        }
      }
    }

    // CÃ©dula oficial de prueba para Anexo B â€” Enrolamiento de Coordinador
    if (cleanCedula === "4444444444") {
      return {
        encontrado: true,
        invitacionValida: true,
        tipo: "TITULAR",
        nombreCompleto: "Ing. Carlos Alberto Morales Viteri",
        cedula: "4444444444",
        cargo: "Director de TecnologÃ­as de la InformaciÃ³n",
        correo: "carlos.morales@cuenca.gob.ec",
        institucion: "Gobierno AutÃ³nomo Descentralizado Municipal de Cuenca",
        direccion: "Calle BolÃ­var y Borrero, Cuenca, Azuay",
        representanteLegal: "Dr. Cristian Zamora Matute (Alcalde)",
        origenTramiteId: "SOL-ING-001",
        yaEnrolado: list.some((s) => s.tipoTramite === "PROCESO_B_ENROLAMIENTO_COORDINADOR" && s.cedula === "4444444444" && s.estado === "Aprobada")
      };
    }

    // Caso demo de invitaciÃ³n vencida o no vÃ¡lida (HU ENR-01)
    if (cleanCedula === "9999999999") {
      return {
        encontrado: false,
        invitacionValida: false,
        mensaje: "InvitaciÃ³n no vÃ¡lida o vencida."
      };
    }

    // Datos demo precargados para test si coincide con la cÃ©dula demo
    if (cleanCedula === "1712345602") {
      return {
        encontrado: true,
        invitacionValida: true,
        tipo: "TITULAR",
        nombreCompleto: "Paula Andrea Mendoza Zambrano",
        cedula: "1712345602",
        cargo: "Coordinadora de TecnologÃ­as de la InformaciÃ³n",
        correo: "paula.mendoza@dinarp.gob.ec",
        institucion: "DirecciÃ³n Nacional de Registros PÃºblicos",
        direccion: "Av. Amazonas N24-196 y Luis Cordero, Quito",
        representanteLegal: "Mgs. Christian Ruiz (Director Nacional)",
        origenTramiteId: "SOL-ING-002",
        yaEnrolado: true
      };
    }

    if (cleanCedula === "1715489621") {
      return {
        encontrado: true,
        tipo: "SUPLENTE",
        nombreCompleto: "Ing. Roberto Carlos DÃ¡vila Silva",
        cedula: "1715489621",
        cargo: "Especialista de Infraestructura y Datos",
        correo: "roberto.davila@msp.gob.ec",
        institucion: "Ministerio de Salud PÃºblica",
        direccion: "Av. RepÃºblica de El Salvador 36-64 y Suecia, Quito",
        representanteLegal: "Dra. Gabriela Patricia Aguinaga",
        origenTramiteId: "SOL-ING-001",
        yaEnrolado: false
      };
    }

    return { encontrado: false };
  }, []);

  const actualizarEstado = useCallback((id: string, nuevoEstado: EstadoSolicitudIngreso, extras?: Partial<SolicitudIngreso>) => {
    setSolicitudes((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            estado: nuevoEstado,
            ...extras
          };
        }
        return item;
      });
      saveStoredSolicitudesIngreso(updated);
      return updated;
    });
  }, []);

  const asignarRevisorGestion = useCallback((solicitudId: string, revisorNombre: string, asignadoPor?: string, observaciones?: string) => {
    const now = new Date().toLocaleString("es-EC", { dateStyle: "short", timeStyle: "short" });
    setSolicitudes((prev) => {
      const updated = prev.map((item) => {
        if (item.id === solicitudId) {
          const esReasignacion = Boolean(item.revisorGestion || item.revisor);
          const nuevoHistorial = [...(item.historial || [])];
          
          const accion = esReasignacion ? "ReasignaciÃ³n de trÃ¡mite" : "AsignaciÃ³n de trÃ¡mite";
          const detalles = `TrÃ¡mite ${esReasignacion ? 'reasignado' : 'asignado'} a ${revisorNombre}. ${observaciones ? `Observaciones: ${observaciones}` : ''}`.trim();
          const lastEvent = nuevoHistorial[nuevoHistorial.length - 1];

          if (!lastEvent || lastEvent.accion !== accion || lastEvent.detalles !== detalles) {
            nuevoHistorial.push({
              id: `hist-${Date.now()}`,
              fechaHora: now,
              accion,
              realizadoPor: asignadoPor || "Director",
              detalles
            });
          }

          return {
            ...item,
            estado: "EN_REVISION_GESTION" as EstadoSolicitudIngreso,
            revisorGestion: revisorNombre,
            revisor: revisorNombre,
            fechaAsignacionGestion: now,
            observacionesAsignacion: observaciones,
            revisionIniciada: false,
            historial: nuevoHistorial
          };
        }
        return item;
      });
      saveStoredSolicitudesIngreso(updated);
      return updated;
    });
  }, []);

  const asignarRevisorMasivo = useCallback((solicitudIds: string[], revisorNombre: string, asignadoPor?: string, observaciones?: string, directorRol?: string) => {
    const now = new Date().toLocaleString("es-EC", { dateStyle: "short", timeStyle: "short" });
    setSolicitudes((prev) => {
      const updated = prev.map((item) => {
        if (solicitudIds.includes(item.id)) {
          const esNormatividad = item.estado === "PENDIENTE_ASIGNACION_NORMATIVIDAD" || item.estado === "PENDIENTE_GENERAR_RESOLUCION" || item.estado === "EN_GENERACION_RESOLUCION" || item.estado === "EN_REVISION_NORMATIVIDAD" || directorRol === "DIR_NORMATIVA";
          const esReasignacion = esNormatividad ? Boolean(item.revisorNormatividad) : Boolean(item.revisorGestion || item.revisor);
          const nuevoHistorial = [...(item.historial || [])];
          
          const accion = esNormatividad
            ? (esReasignacion ? "ReasignaciÃ³n de responsable en Normatividad" : "Responsable de Normatividad asignado")
            : (esReasignacion ? "ReasignaciÃ³n de trÃ¡mite" : "AsignaciÃ³n de trÃ¡mite");
          const detalles = `Responsable: ${revisorNombre}. Asignado por: ${asignadoPor || "Director"}.${observaciones ? ` Observaciones: ${observaciones}` : ""}`.trim();

          nuevoHistorial.push({
            id: `hist-${Date.now()}-${item.id}`,
            fechaHora: now,
            accion,
            realizadoPor: asignadoPor || (esNormatividad ? "Director de Normatividad" : "Director de GestiÃ³n"),
            detalles
          });

          if (esNormatividad) {
            return {
              ...item,
              estado: "PENDIENTE_GENERAR_RESOLUCION" as EstadoSolicitudIngreso,
              revisorNormatividad: revisorNombre,
              revisor: revisorNombre,
              fechaAsignacionNormatividad: now,
              observacionesAsignacion: observaciones,
              revisionIniciada: false,
              historial: nuevoHistorial
            };
          }

          return {
            ...item,
            estado: "EN_REVISION_GESTION" as EstadoSolicitudIngreso,
            revisorGestion: revisorNombre,
            revisor: revisorNombre,
            fechaAsignacionGestion: now,
            observacionesAsignacion: observaciones,
            revisionIniciada: false,
            historial: nuevoHistorial
          };
        }
        return item;
      });
      saveStoredSolicitudesIngreso(updated);
      return updated;
    });
  }, []);

  const iniciarRevision = useCallback((solicitudId: string, revisorNombre?: string) => {
    setSolicitudes((prev) => {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      const fechaStr = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

      const updated = prev.map((item) => {
        if (item.id === solicitudId) {
          const isNormativa = item.estado === "PENDIENTE_GENERAR_RESOLUCION" || item.estado === "EN_GENERACION_RESOLUCION" || item.estado === "EN_REVISION_NORMATIVIDAD" || item.estado === "PENDIENTE_ASIGNACION_NORMATIVIDAD";
          const resp = revisorNombre || (isNormativa ? item.revisorNormatividad : item.revisorGestion) || item.revisor || (isNormativa ? "Personal facultado de Normatividad" : "Revisor de GestiÃ³n");
          const nuevoHistorial = [...(item.historial || [])];
          
          if (!item.revisionIniciada) {
            nuevoHistorial.push({
              id: `hist-rev-${Date.now()}`,
              fechaHora: fechaStr,
              accion: isNormativa ? "GeneraciÃ³n de resoluciÃ³n iniciada" : "RevisiÃ³n tÃ©cnica iniciada",
              realizadoPor: resp,
              rol: isNormativa ? "Personal facultado de Normatividad" : "Revisor de GestiÃ³n",
              detalles: isNormativa
                ? `El funcionario ${resp} ha iniciado la formulaciÃ³n de la resoluciÃ³n institucional.`
                : `El revisor ${resp} ha iniciado formalmente la verificaciÃ³n tÃ©cnica y documental del expediente.`
            });
          }

          return {
            ...item,
            estado: isNormativa ? ("EN_GENERACION_RESOLUCION" as EstadoSolicitudIngreso) : ("EN_REVISION_GESTION" as EstadoSolicitudIngreso),
            revisionIniciada: true,
            fechaInicioRevision: item.fechaInicioRevision || fechaStr,
            revisor: resp,
            revisorGestion: isNormativa ? item.revisorGestion : (item.revisorGestion || resp),
            revisorNormatividad: isNormativa ? (item.revisorNormatividad || resp) : item.revisorNormatividad,
            historial: nuevoHistorial
          };
        }
        return item;
      });
      saveStoredSolicitudesIngreso(updated);
      return updated;
    });
  }, []);

  const pausarRevision = useCallback((solicitudId: string, revisorNombre?: string, motivo?: string) => {
    setSolicitudes((prev) => {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      const fechaStr = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

      const updated = prev.map((item) => {
        if (item.id === solicitudId) {
          const isNormativa = item.estado === "PENDIENTE_GENERAR_RESOLUCION" || item.estado === "EN_GENERACION_RESOLUCION" || item.estado === "EN_REVISION_NORMATIVIDAD" || item.estado === "PENDIENTE_ASIGNACION_NORMATIVIDAD";
          const resp = revisorNombre || (isNormativa ? item.revisorNormatividad : item.revisorGestion) || item.revisor || (isNormativa ? "Personal facultado de Normatividad" : "Revisor de GestiÃ³n");
          const nuevoHistorial = [...(item.historial || [])];

          nuevoHistorial.push({
            id: `hist-pause-${Date.now()}`,
            fechaHora: fechaStr,
            accion: isNormativa ? "GeneraciÃ³n de resoluciÃ³n pausada" : "RevisiÃ³n pausada",
            realizadoPor: resp,
            rol: isNormativa ? "Personal facultado de Normatividad" : "Revisor de GestiÃ³n",
            detalles: motivo || (isNormativa 
              ? `El funcionario ${resp} saliÃ³ de la formulaciÃ³n sin emitir la resoluciÃ³n. El trÃ¡mite retorna al estado pendiente de formulaciÃ³n.`
              : `El revisor ${resp} saliÃ³ de la revisiÃ³n sin emitir dictamen. El trÃ¡mite retorna al estado pendiente de revisiÃ³n.`)
          });

          return {
            ...item,
            revisionIniciada: false,
            historial: nuevoHistorial
          };
        }
        return item;
      });
      saveStoredSolicitudesIngreso(updated);
      return updated;
    });
  }, []);

  const aprobarGestion = useCallback((solicitudId: string, aprobadoPor?: string, observaciones?: string) => {
    const now = new Date().toLocaleString("es-EC", { dateStyle: "short", timeStyle: "short" });
    setSolicitudes((prev) => {
      const updated = prev.map((item) => {
        if (item.id === solicitudId) {
          const nuevoHistorial = [...(item.historial || [])];
          const esAnexoB = item.tipoTramite === "PROCESO_B_ENROLAMIENTO_COORDINADOR";

          nuevoHistorial.push({
            id: `hist-${Date.now()}`,
            fechaHora: now,
            accion: esAnexoB ? "Anexo B aprobado" : "Solicitud aprobada por GestiÃ³n",
            realizadoPor: aprobadoPor || item.revisorGestion || "Revisor",
            detalles: esAnexoB
              ? (observaciones || "Enrolamiento de Coordinador (Anexo B) y Acuerdo de Uso y Confidencialidad verificados y aprobados exitosamente. Coordinador habilitado en SINARP.")
              : (observaciones || "TrÃ¡mite validado documentalmente. ContinÃºa a Normatividad.")
          });

          return {
            ...item,
            estado: (esAnexoB ? "Aprobada" : "PENDIENTE_ASIGNACION_NORMATIVIDAD") as EstadoSolicitudIngreso,
            fechaRevision: now,
            fechaAprobacionGestion: now,
            historial: nuevoHistorial
          };
        }
        return item;
      });
      saveStoredSolicitudesIngreso(updated);
      return updated;
    });
  }, []);

  const asignarRevisorNormatividad = useCallback((solicitudId: string, revisorNombre: string, asignadoPor?: string, observaciones?: string) => {
    const now = new Date().toLocaleString("es-EC", { dateStyle: "short", timeStyle: "short" });
    setSolicitudes((prev) => {
      const updated = prev.map((item) => {
        if (item.id === solicitudId) {
          const esReasignacion = Boolean(item.revisorNormatividad);
          const nuevoHistorial = [...(item.historial || [])];
          
          const accion = esReasignacion ? "ReasignaciÃ³n de responsable en Normatividad" : "Responsable de Normatividad asignado";
          const detalles = `Responsable: ${revisorNombre}. Asignado por: ${asignadoPor || "Director de Normatividad"}.${observaciones ? ` Observaciones: ${observaciones}` : ""}`.trim();
          
          nuevoHistorial.push({
            id: `hist-${Date.now()}`,
            fechaHora: now,
            accion,
            realizadoPor: asignadoPor || "Director de Normatividad",
            detalles
          });

          return {
            ...item,
            estado: "PENDIENTE_GENERAR_RESOLUCION" as EstadoSolicitudIngreso,
            revisorNormatividad: revisorNombre,
            revisor: revisorNombre,
            fechaAsignacionNormatividad: now,
            observacionesAsignacion: observaciones,
            revisionIniciada: false,
            historial: nuevoHistorial
          };
        }
        return item;
      });
      saveStoredSolicitudesIngreso(updated);
      return updated;
    });
  }, []);

  const aprobarNormatividad = useCallback((solicitudId: string, aprobadoPor?: string, observaciones?: string, resolucion?: string) => {
    const now = new Date().toLocaleString("es-EC", { dateStyle: "short", timeStyle: "short" });
    setSolicitudes((prev) => {
      const updated = prev.map((item) => {
        if (item.id === solicitudId) {
          const nuevoHistorial = [...(item.historial || [])];
          const numRes = resolucion || item.resolucion || "RES-DINARP-2026-001";
          
          // 1. Hito: ResoluciÃ³n institucional generada (INS-06 completado)
          nuevoHistorial.push({
            id: `hist-${Date.now()}-res`,
            fechaHora: now,
            accion: "ResoluciÃ³n institucional generada",
            realizadoPor: aprobadoPor || item.revisorNormatividad || "Personal facultado de Normatividad",
            rol: "Personal facultado de Normatividad",
            detalles: `ResoluciÃ³n institucional ${numRes} generada y vinculada a la solicitud y Anexo A aprobado. ${observaciones || ""}`.trim()
          });

          // 2. Hito: Pendiente de firma (INS-07)
          nuevoHistorial.push({
            id: `hist-${Date.now()}-firma-pend`,
            fechaHora: now,
            accion: "Pendiente de firma",
            realizadoPor: "Sistema DINARP",
            rol: "Sistema",
            detalles: "Enviado a firma externa de la MÃ¡xima Autoridad mediante FirmaEC. La activaciÃ³n de la instituciÃ³n y emisiÃ³n de invitaciones de coordinadores permanecen a la espera de la firma verificada."
          });

          return {
            ...item,
            estado: "PENDIENTE_DE_FIRMA" as EstadoSolicitudIngreso,
            fechaRevision: now,
            resolucion: numRes,
            historial: nuevoHistorial
          };
        }
        return item;
      });
      saveStoredSolicitudesIngreso(updated);
      return updated;
    });
  }, []);

  const completarFirmaResolucion = useCallback((
    solicitudId: string,
    exitosa: boolean,
    firmanteNombre: string = "Mgs. Christian Ruiz (Director Nacional)",
    motivoFallo?: string
  ) => {
    const now = new Date().toLocaleString("es-EC", { dateStyle: "short", timeStyle: "short" });
    const nowIso = new Date().toISOString();
    const fechaCaducidad = new Date();
    fechaCaducidad.setDate(fechaCaducidad.getDate() + 30);
    const fechaCaducidadStr = fechaCaducidad.toLocaleString("es-EC", { dateStyle: "short", timeStyle: "short" });

    setSolicitudes((prev) => {
      const updated = prev.map((item) => {
        if (item.id === solicitudId) {
          const nuevoHistorial = [...(item.historial || [])];
          const numRes = item.resolucion || "RES-DINARP-2026-0042";

          if (exitosa) {
            // Hito 1: ResoluciÃ³n firmada y verificada
            nuevoHistorial.push({
              id: `hist-${Date.now()}-firma-ok`,
              fechaHora: now,
              accion: "ResoluciÃ³n firmada y verificada",
              realizadoPor: firmanteNombre,
              rol: "MÃ¡xima Autoridad DINARP",
              detalles: `ResoluciÃ³n institucional ${numRes} suscrita por la MÃ¡xima Autoridad mediante FirmaEC. VerificaciÃ³n de firma criptogrÃ¡fica y certificado digital de entidad certificadora oficial vÃ¡lidos.`
            });

            // Hito 2: InstituciÃ³n activada
            nuevoHistorial.push({
              id: `hist-${Date.now()}-inst-activa`,
              fechaHora: now,
              accion: "InstituciÃ³n activada",
              realizadoPor: "Sistema DINARP",
              rol: "Sistema",
              detalles: "La resoluciÃ³n fue firmada y verificada correctamente. La instituciÃ³n se encuentra activa y puede continuar con el enrolamiento de sus coordinadores."
            });

            // GeneraciÃ³n de 2 invitaciones independientes: Titular y Suplente
            const titularNombre = item.anexoA?.titularNombreCompleto || item.nombreCompleto || "Coordinador Titular";
            const titularCedula = item.anexoA?.titularCedula || item.cedula || "1700000001";
            const titularEmail = item.anexoA?.titularEmail || item.correo || "titular@institucion.gob.ec";
            const titularCargo = item.anexoA?.titularCargo || "Director de TI";

            const suplenteNombre = item.anexoA?.suplenteNombreCompleto || "Coordinador Suplente";
            const suplenteCedula = item.anexoA?.suplenteCedula || "1700000002";
            const suplenteEmail = item.anexoA?.suplenteEmail || "suplente@institucion.gob.ec";
            const suplenteCargo = item.anexoA?.suplenteCargo || "Especialista TIC";

            const invTitular: InvitacionAnexoB = {
              id: `INV-B-${item.id.replace("SOL-", "")}-TIT`,
              solicitudId: item.id,
              destinatarioCedula: titularCedula,
              destinatarioNombre: titularNombre,
              destinatarioEmail: titularEmail,
              destinatarioCargo: titularCargo,
              institucion: item.institucion,
              rol: "TITULAR",
              token: `tok_sec_opaque_${Math.random().toString(36).substring(2, 12)}`,
              fechaEmision: now,
              fechaCaducidad: fechaCaducidadStr,
              estado: "PENDIENTE",
              canalEnvio: "CORREO_ELECTRONICO",
              fechaEnvio: now
            };

            const invSuplente: InvitacionAnexoB = {
              id: `INV-B-${item.id.replace("SOL-", "")}-SUP`,
              solicitudId: item.id,
              destinatarioCedula: suplenteCedula,
              destinatarioNombre: suplenteNombre,
              destinatarioEmail: suplenteEmail,
              destinatarioCargo: suplenteCargo,
              institucion: item.institucion,
              rol: "SUPLENTE",
              token: `tok_sec_opaque_${Math.random().toString(36).substring(2, 12)}`,
              fechaEmision: now,
              fechaCaducidad: fechaCaducidadStr,
              estado: "PENDIENTE",
              canalEnvio: "CORREO_ELECTRONICO",
              fechaEnvio: now
            };

            // Hito 3: Invitaciones generadas y enviadas
            nuevoHistorial.push({
              id: `hist-${Date.now()}-inv-tit`,
              fechaHora: now,
              accion: "InvitaciÃ³n B â€” Coordinador Titular generada",
              realizadoPor: "Sistema DINARP",
              rol: "Sistema",
              detalles: `InvitaciÃ³n individual ${invTitular.id} generada y notificada por correo a ${titularNombre} (${titularEmail}). Vigencia de 30 dÃ­as calendario segÃºn PAR-05.`
            });

            nuevoHistorial.push({
              id: `hist-${Date.now()}-inv-sup`,
              fechaHora: now,
              accion: "InvitaciÃ³n B â€” Coordinador Suplente generada",
              realizadoPor: "Sistema DINARP",
              rol: "Sistema",
              detalles: `InvitaciÃ³n individual ${invSuplente.id} generada y notificada por correo a ${suplenteNombre} (${suplenteEmail}). Vigencia de 30 dÃ­as calendario segÃºn PAR-05.`
            });

            const nuevosDocumentos = item.documentos.map((doc) =>
              doc.includes("Para_Firma") ? doc.replace("Para_Firma", "Firmada") : doc
            );
            if (!nuevosDocumentos.some((d) => d.includes("Firmada"))) {
              nuevosDocumentos.push(`${numRes}_Firmada.pdf`);
            }

            return {
              ...item,
              estado: "INSTITUCION_ACTIVA" as EstadoSolicitudIngreso,
              fechaRevision: now,
              documentos: nuevosDocumentos,
              datosFirmaResolucion: {
                firmante: firmanteNombre,
                cargo: "MÃ¡xima Autoridad DINARP",
                entidad: "DirecciÃ³n Nacional de Registros PÃºblicos",
                entidadCertificadora: "Banco Central del Ecuador (BCE)",
                algoritmo: "SHA-256 with RSA Encryption (2048-bit)",
                fechaHoraFirma: nowIso,
                verificada: true,
                hashDocumento: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
              },
              invitacionesB: [invTitular, invSuplente],
              historial: nuevoHistorial
            };
          } else {
            // Caso demo de fallo en la firma
            nuevoHistorial.push({
              id: `hist-${Date.now()}-firma-fail`,
              fechaHora: now,
              accion: "Firma de resoluciÃ³n no concluida",
              realizadoPor: "FirmaEC Â· Servicio de CertificaciÃ³n",
              rol: "Sistema",
              detalles: motivoFallo || "El proceso de firma externa no concluyÃ³ exitosamente o el certificado reportÃ³ error de validaciÃ³n. La instituciÃ³n se mantiene en estado pendiente de firma y no se activan las invitaciones."
            });

            return {
              ...item,
              estado: "PENDIENTE_DE_FIRMA" as EstadoSolicitudIngreso,
              historial: nuevoHistorial
            };
          }
        }
        return item;
      });
      saveStoredSolicitudesIngreso(updated);
      return updated;
    });
  }, []);

  const fallarGeneracionResolucion = useCallback((solicitudId: string, causa: string, falladoPor?: string) => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const fechaStr = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    setSolicitudes((prev) => {
      const updated = prev.map((item) => {
        if (item.id === solicitudId) {
          const nuevoHistorial = [...(item.historial || [])];
          nuevoHistorial.push({
            id: `hist-fallo-${Date.now()}`,
            fechaHora: fechaStr,
            accion: "GeneraciÃ³n de resoluciÃ³n no completada",
            realizadoPor: falladoPor || item.revisorNormatividad || "Personal facultado de Normatividad",
            rol: "Personal facultado de Normatividad",
            detalles: `Causa: ${causa}. TrÃ¡mite mantenido en estado pendiente para subsanaciÃ³n o reintento.`
          });

          return {
            ...item,
            estado: "GENERACION_PENDIENTE" as EstadoSolicitudIngreso,
            motivoRechazo: causa,
            historial: nuevoHistorial
          };
        }
        return item;
      });
      saveStoredSolicitudesIngreso(updated);
      return updated;
    });
  }, []);

  const reintentarGeneracionResolucion = useCallback((solicitudId: string, reintentadoPor?: string) => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const fechaStr = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    setSolicitudes((prev) => {
      const updated = prev.map((item) => {
        if (item.id === solicitudId) {
          const nuevoHistorial = [...(item.historial || [])];
          nuevoHistorial.push({
            id: `hist-reintento-${Date.now()}`,
            fechaHora: fechaStr,
            accion: "Reintento de generaciÃ³n de resoluciÃ³n",
            realizadoPor: reintentadoPor || item.revisorNormatividad || "Personal facultado de Normatividad",
            rol: "Personal facultado de Normatividad",
            detalles: "Se reanuda el proceso de formulaciÃ³n y vinculaciÃ³n de resoluciÃ³n institucional."
          });

          return {
            ...item,
            estado: "EN_GENERACION_RESOLUCION" as EstadoSolicitudIngreso,
            historial: nuevoHistorial
          };
        }
        return item;
      });
      saveStoredSolicitudesIngreso(updated);
      return updated;
    });
  }, []);

  const resetStore = useCallback(() => {
    saveStoredSolicitudesIngreso(INITIAL_SOLICITUDES_INGRESO);
    setSolicitudes(INITIAL_SOLICITUDES_INGRESO);
  }, []);

  return {
    solicitudes,
    isLoaded,
    aprobarSolicitud,
    rechazarSolicitud,
    actualizarEstado,
    asignarRevisorGestion,
    asignarRevisorMasivo,
    iniciarRevision,
    pausarRevision,
    aprobarGestion,
    asignarRevisorNormatividad,
    aprobarNormatividad,
    completarFirmaResolucion,
    fallarGeneracionResolucion,
    reintentarGeneracionResolucion,
    agregarRegistroInstitucion,
    agregarEnrolamientoCoordinador,
    agregarCambioCoordinador,
    buscarPreregistroPorCedula,
    resetStore
  };
}

