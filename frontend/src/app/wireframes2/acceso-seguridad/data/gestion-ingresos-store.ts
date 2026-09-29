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
  | "PENDIENTE_ASIGNACION_GESTION"
  | "EN_REVISION_GESTION"
  | "APROBADO_GESTION"
  | "PENDIENTE_ASIGNACION_NORMATIVIDAD"
  | "EN_REVISION_NORMATIVIDAD"
  | "APROBADO_FINAL"
  | "Cancelada";

// Helper para badges de estado
export function getEstadoBadgeProps(estado: EstadoSolicitudIngreso) {
  switch (estado) {
    case "Aprobada":
    case "APROBADO_FINAL":
      return { tone: "success" as const, label: "Aprobado" };
    case "APROBADO_GESTION":
      return { tone: "info" as const, label: "Aprobado Gestión" };
    case "EN_REVISION_GESTION":
      return { tone: "warning" as const, label: "En Revisión Gestión" };
    case "EN_REVISION_NORMATIVIDAD":
      return { tone: "warning" as const, label: "En Revisión Normatividad" };
    case "PENDIENTE_ASIGNACION_GESTION":
      return { tone: "neutral" as const, label: "Pend. Asignación Gestión" };
    case "PENDIENTE_ASIGNACION_NORMATIVIDAD":
      return { tone: "neutral" as const, label: "Pend. Asignación Normatividad" };
    case "Rechazada":
      return { tone: "danger" as const, label: "Rechazado" };
    case "Cancelada":
      return { tone: "danger" as const, label: "Cancelado" };
    default:
      return { tone: "neutral" as const, label: estado || "Pendiente" };
  }
}

export function puedeReasignarSolicitud(solicitud: SolicitudIngreso | null | undefined, tipoArea?: string) {
  if (!solicitud) return { puedeReasignar: false, esReasignacion: false, motivoBloqueo: undefined };
  if (
    solicitud.estado === "APROBADO_FINAL" ||
    solicitud.estado === "Aprobada" ||
    solicitud.estado === "Rechazada" ||
    solicitud.estado === "Cancelada"
  ) {
    return { puedeReasignar: false, esReasignacion: false, motivoBloqueo: "Trámite finalizado o cancelado" };
  }
  const esReasignacion = Boolean(solicitud.revisorGestion || solicitud.revisorNormatividad || solicitud.revisor);
  if (solicitud.revisionIniciada) {
    return { puedeReasignar: false, esReasignacion, motivoBloqueo: "Revisión técnica ya iniciada" };
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

  // Sección II: Servicios y Herramientas
  serviciosHerramientas: string[]; // Infodigital, Ficha de Registro Único, Interoperabilidad
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

  // Cláusula Segunda: Cambio Titular
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

  // Cláusula Segunda: Cambio Suplente
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

  // Cláusula Tercera: Designación Inicial Suplente (Solo si entidad no tenía suplente)
  aplicaDesignacionInicialSuplente: boolean;
  inicialSuplenteNombre?: string;
  inicialSuplenteCedula?: string;
  inicialSuplenteCargo?: string;
  inicialSuplenteEmail?: string;

  // Cláusula Cuarta: Aceptación y Firmas
  ciudadFirma: string;
  fechaFirma: string;
  firmadoDigitalmente: boolean;
  archivoDocumentoFirmado?: string;
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
  documentos: string[];

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

export const STORAGE_KEY_INGRESOS = "dinarp_solicitudes_ingreso_v4";

export const INITIAL_SOLICITUDES_INGRESO: SolicitudIngreso[] = [
  {
    id: "SOL-ING-101",
    tipoTramite: "PROCESO_A_REGISTRO_INSTITUCION",
    codigoDocumental: "ARP-R01",
    tituloTramite: "Solicitud de Acceso SINARP (Registro Institución)",
    cedula: "1722334455",
    nombres: "Ana María",
    apellidos: "Pérez Gómez",
    nombreCompleto: "Ana María Pérez Gómez",
    iniciales: "AP",
    correo: "ana.perez@senescyt.gob.ec",
    institucion: "Ministerio de Telecomunicaciones",
    fechaSolicitud: "28/09/2026 09:15",
    estado: "EN_REVISION_GESTION",
    revisorGestion: "Revisor Gestión",
    revisor: "Revisor Gestión",
    revisionIniciada: false,
    documentos: ["ARP-R01_Solicitud_Acceso_MINTEL.pdf"],
    anexoA: {
      entidadTipo: "Publica",
      nombreEntidad: "Ministerio de Telecomunicaciones",
      rucEntidad: "1768151240001",
      direccionEntidad: "Av. 6 de Diciembre y Colón, Quito",
      objetoSocial: "Rector de las telecomunicaciones y sociedad de la información.",
      representanteLegalNombre: "Ing. Vianna Maino",
      representanteLegalCargo: "Ministra",
      representanteLegalEmail: "ministra@mintel.gob.ec",
      esDelegado: false,
      titularNombreCompleto: "Ana María Pérez Gómez",
      titularCedula: "1722334455",
      titularCargo: "Directora de Interoperabilidad",
      titularAreaUnidad: "Subsecretaría de Gobierno Electrónico",
      titularEmail: "ana.perez@senescyt.gob.ec",
      titularTelefonoFijo: "023931000",
      titularMovilInstitucional: "0991112233",
      titularMovilPersonal: "0992223344",
      suplenteNombreCompleto: "Luis Fernando Torres",
      suplenteCedula: "1711223344",
      suplenteCargo: "Especialista en Datos",
      suplenteAreaUnidad: "Subsecretaría de Gobierno Electrónico",
      suplenteEmail: "luis.torres@mintel.gob.ec",
      suplenteTelefonoFijo: "023931000",
      suplenteMovilInstitucional: "0993334455",
      suplenteMovilPersonal: "0994445566",
      serviciosHerramientas: ["Ficha de Información Ciudadana"],
      areasUso: "Gestión de Trámites",
      procesosUso: "Simplificación de trámites",
      declaracionesAceptadas: true,
      ciudadFirma: "Quito D.M.",
      fechaFirma: "28/09/2026",
      firmadoDigitalmente: true,
      archivoDocumentoFirmado: "ARP-R01_Solicitud_Acceso_MINTEL.pdf"
    }
  },
  {
    id: "SOL-ING-102",
    tipoTramite: "PROCESO_A_REGISTRO_INSTITUCION",
    codigoDocumental: "ARP-R01",
    tituloTramite: "Solicitud de Acceso SINARP (Registro Institución)",
    cedula: "1709998887",
    nombres: "Roberto",
    apellidos: "García",
    nombreCompleto: "Roberto García",
    iniciales: "RG",
    correo: "roberto.garcia@salud.gob.ec",
    institucion: "Ministerio de Salud Pública",
    fechaSolicitud: "25/09/2026 14:20",
    estado: "Aprobada",
    revisorGestion: "Revisor Gestión",
    revisor: "Revisor Gestión",
    revisionIniciada: true,
    fechaRevision: "26/09/2026 10:00",
    documentos: ["ARP-R01_Solicitud_Acceso_MSP.pdf"],
    historial: [
      {
        id: "h1",
        fechaHora: "26/09/2026 10:30",
        accion: "Solicitud aprobada por Gestión",
        realizadoPor: "Revisor Gestión",
        detalles: "Documentación conforme a la norma. Pasa a Normatividad."
      }
    ],
    anexoA: {
      entidadTipo: "Publica",
      nombreEntidad: "Ministerio de Salud Pública",
      rucEntidad: "1760001120001",
      direccionEntidad: "Av. Quitumbe Ñan, Quito",
      objetoSocial: "Salud pública",
      representanteLegalNombre: "Dr. José Ruales",
      representanteLegalCargo: "Ministro de Salud",
      representanteLegalEmail: "ministro@salud.gob.ec",
      esDelegado: false,
      titularNombreCompleto: "Roberto García",
      titularCedula: "1709998887",
      titularCargo: "Director de Tecnologías",
      titularAreaUnidad: "DNTIC",
      titularEmail: "roberto.garcia@salud.gob.ec",
      titularTelefonoFijo: "023814400",
      titularMovilInstitucional: "0981112233",
      titularMovilPersonal: "0992223344",
      suplenteNombreCompleto: "Marta Sánchez",
      suplenteCedula: "1718889990",
      suplenteCargo: "Especialista TIC",
      suplenteAreaUnidad: "DNTIC",
      suplenteEmail: "marta.sanchez@salud.gob.ec",
      suplenteTelefonoFijo: "023814400",
      suplenteMovilInstitucional: "0995556677",
      suplenteMovilPersonal: "0986667788",
      serviciosHerramientas: ["Consulta de defunciones"],
      areasUso: "Epidemiología",
      procesosUso: "Registro estadístico",
      declaracionesAceptadas: true,
      ciudadFirma: "Quito D.M.",
      fechaFirma: "25/09/2026",
      firmadoDigitalmente: true,
      archivoDocumentoFirmado: "ARP-R01_Solicitud_Acceso_MSP.pdf"
    }
  },
  {
    id: "SOL-ING-103",
    tipoTramite: "PROCESO_A_REGISTRO_INSTITUCION",
    codigoDocumental: "ARP-R01",
    tituloTramite: "Solicitud de Acceso SINARP (Registro Institución)",
    cedula: "1715556667",
    nombres: "Carla",
    apellidos: "Ruiz",
    nombreCompleto: "Carla Ruiz",
    iniciales: "CR",
    correo: "carla.ruiz@miduvi.gob.ec",
    institucion: "Ministerio de Desarrollo Urbano y Vivienda",
    fechaSolicitud: "27/09/2026 11:10",
    estado: "Rechazada",
    revisorGestion: "Revisor Gestión",
    revisor: "Revisor Gestión",
    revisionIniciada: true,
    fechaRevision: "28/09/2026 15:45",
    motivoRechazo: "La firma electrónica en el Anexo A está caducada y no corresponde al representante legal registrado.",
    documentos: ["ARP-R01_Solicitud_Acceso_MIDUVI.pdf"],
    historial: [
      {
        id: "h2",
        fechaHora: "28/09/2026 15:45",
        accion: "Solicitud observada/rechazada por Gestión",
        realizadoPor: "Revisor Gestión",
        detalles: "La firma electrónica en el Anexo A está caducada y no corresponde al representante legal registrado."
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
      suplenteNombreCompleto: "Esteban López",
      suplenteCedula: "1726667778",
      suplenteCargo: "Técnico TIC",
      suplenteAreaUnidad: "Sistemas",
      suplenteEmail: "esteban.lopez@miduvi.gob.ec",
      suplenteTelefonoFijo: "022983600",
      suplenteMovilInstitucional: "0994445566",
      suplenteMovilPersonal: "0985556677",
      serviciosHerramientas: ["Consulta de bienes"],
      areasUso: "Vivienda Social",
      procesosUso: "Verificación de requisitos",
      declaracionesAceptadas: true,
      ciudadFirma: "Quito D.M.",
      fechaFirma: "27/09/2026",
      firmadoDigitalmente: true,
      archivoDocumentoFirmado: "ARP-R01_Solicitud_Acceso_MIDUVI.pdf"
    }
  },

  {
    id: "SOL-ING-001",
    tipoTramite: "PROCESO_A_REGISTRO_INSTITUCION",
    codigoDocumental: "ARP-R01",
    tituloTramite: "Solicitud de Acceso SINARP (Registro Institución)",
    cedula: "1799999999",
    nombres: "Juan Carlos",
    apellidos: "Pérez Gómez",
    nombreCompleto: "Juan Carlos Pérez Gómez",
    iniciales: "JP",
    correo: "juan.perez@msp.gob.ec",
    institucion: "Ministerio de Salud Pública",
    fechaSolicitud: "22/09/2026 14:35",
    estado: "Pendiente",
    documentos: [
      "ARP-R01_Solicitud_Acceso_SINARP_MSP.pdf",
      "Soporte_Delegacion_Representante.pdf"
    ],
    anexoA: {
      entidadTipo: "Publica",
      nombreEntidad: "Ministerio de Salud Pública",
      rucEntidad: "1760001230001",
      direccionEntidad: "Av. República de El Salvador 36-64 y Suecia, Quito",
      objetoSocial: "Garantizar el derecho a la salud pública integral en el territorio ecuatoriano.",
      representanteLegalNombre: "Dra. Gabriela Patricia Aguinaga",
      representanteLegalCargo: "Ministra de Salud Pública (Representante Legal)",
      representanteLegalEmail: "ministra@msp.gob.ec",
      esDelegado: false,
      titularNombreCompleto: "Juan Carlos Pérez Gómez",
      titularCedula: "1799999999",
      titularCargo: "Director Nacional de Tecnologías de la Información",
      titularAreaUnidad: "Dirección Nacional de Tecnologías",
      titularEmail: "juan.perez@msp.gob.ec",
      titularTelefonoFijo: "023814400 ext 1102",
      titularMovilInstitucional: "0998765432",
      titularMovilPersonal: "0987654321",
      suplenteNombreCompleto: "Ing. Roberto Carlos Dávila Silva",
      suplenteCedula: "1715489621",
      suplenteCargo: "Especialista de Infraestructura y Datos",
      suplenteAreaUnidad: "Dirección Nacional de Tecnologías",
      suplenteEmail: "roberto.davila@msp.gob.ec",
      suplenteTelefonoFijo: "023814400 ext 1105",
      suplenteMovilInstitucional: "0991234567",
      suplenteMovilPersonal: "0981234567",
      serviciosHerramientas: [
        "Interoperabilidad SINARP",
        "Ficha de Registro Único del Ciudadano"
      ],
      areasUso: "Dirección Nacional de Vigilancia Epidemiológica y Estadística Sanitaria",
      procesosUso: "Validación de identidad en historias clínicas electrónicas e interoperabilidad del Sistema Nacional de Salud.",
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
    institucion: "Dirección Nacional de Registros Públicos",
    fechaSolicitud: "20/09/2026 09:12",
    estado: "Aprobada",
    fechaRevision: "21/09/2026 11:20",
    revisor: "María Torres (Dirección de Gestión y Registro)",
    documentos: [
      "ARP-R02_Acuerdo_Uso_Confidencialidad_PM.pdf"
    ],
    anexoB: {
      nombreEntidad: "Dirección Nacional de Registros Públicos",
      domicilioEntidad: "Av. Amazonas N24-196 y Luis Cordero, Quito",
      representanteLegalNombre: "Mgs. Christian Ruiz (Director Nacional)",
      funcionarioNombre: "Paula Andrea Mendoza Zambrano",
      funcionarioCedula: "1712345602",
      funcionarioCargo: "Coordinadora de Tecnologías de la Información",
      rolAsignado: "COORDINADOR TITULAR",
      misionVisionInstitucional: "Coordinar, regular y gestionar la interoperabilidad y custodia de los registros públicos del Estado ecuatoriano con altos estándares de seguridad y protección de datos.",
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
    apellidos: "Andrade Villacís",
    nombreCompleto: "Carlos Alberto Andrade Villacís",
    iniciales: "CA",
    correo: "carlos.andrade@educacion.gob.ec",
    institucion: "Ministerio de Educación",
    fechaSolicitud: "18/09/2026 16:40",
    estado: "Rechazada",
    fechaRevision: "19/09/2026 10:15",
    revisor: "María Torres (Dirección de Gestión y Registro)",
    motivoRechazo: "El acuerdo presentado no cuenta con la firma electrónica válida de la máxima autoridad o su delegado debidamente justificado.",
    documentos: [
      "ARP-R02_Acuerdo_Uso_Confidencialidad_Educacion.pdf"
    ],
    anexoB: {
      nombreEntidad: "Ministerio de Educación",
      domicilioEntidad: "Av. Amazonas N34-451 entre Atahualpa y Juan Pablo Sanz, Quito",
      representanteLegalNombre: "Dra. Alegría Crespo Cordovez",
      funcionarioNombre: "Carlos Alberto Andrade Villacís",
      funcionarioCedula: "1788888888",
      funcionarioCargo: "Especialista Zonal de TIC",
      rolAsignado: "COORDINADOR TITULAR",
      misionVisionInstitucional: "Garantizar el acceso universal, la calidad y pertinencia de la educación pública en el Ecuador.",
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
    nombres: "Lucía Fernanda",
    apellidos: "Navarrete Morales",
    nombreCompleto: "Lucía Fernanda Navarrete Morales",
    iniciales: "LN",
    correo: "lucia.navarrete@registrocivil.gob.ec",
    institucion: "Dirección General de Registro Civil, Identificación y Cedulación",
    fechaSolicitud: "23/09/2026 08:22",
    estado: "Pendiente",
    documentos: [
      "ARP-R03_Cambio_Coordinador_RegistroCivil.pdf",
      "Accion_Personal_Delegacion_Firmante.pdf"
    ],
    anexoC: {
      nombreEntidad: "Dirección General de Registro Civil, Identificación y Cedulación",
      representanteLegalNombre: "Abg. Fernando Alarcón (Subdirector General Delegado)",
      esDelegado: true,
      archivoSoporteDelegacion: "Accion_Personal_Delegacion_Firmante.pdf",
      aplicaCambioTitular: true,
      nuevoTitularNombre: "Lucía Fernanda Navarrete Morales",
      nuevoTitularCedula: "1724589632",
      nuevoTitularCargo: "Directora de Gestión de la Información y Seguridad Registral",
      nuevoTitularMotivo: "Cese de funciones del coordinador saliente por cambio de estructura administrativa.",
      nuevoTitularEmail: "lucia.navarrete@registrocivil.gob.ec",
      nuevoTitularArea: "Dirección de Tecnologías y Seguridad de la Información",
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
    tituloTramite: "Solicitud de Acceso SINARP (Registro Institución)",
    cedula: "1756321478",
    nombres: "Santiago Andrés",
    apellidos: "Cárdenas Viteri",
    nombreCompleto: "Santiago Andrés Cárdenas Viteri",
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
      objetoSocial: "Administración, control y recaudación de tributos internos del Estado.",
      representanteLegalNombre: "Ec. Damián Larco (Director General)",
      representanteLegalCargo: "Director General del SRI",
      representanteLegalEmail: "director@sri.gob.ec",
      esDelegado: false,
      titularNombreCompleto: "Santiago Andrés Cárdenas Viteri",
      titularCedula: "1756321478",
      titularCargo: "Jefe de Interoperabilidad e Intercambio de Información",
      titularAreaUnidad: "Departamento de Analítica y TIC",
      titularEmail: "santiago.cardenas@sri.gob.ec",
      titularTelefonoFijo: "022987100 ext 550",
      titularMovilInstitucional: "0998521470",
      titularMovilPersonal: "0987456321",
      suplenteNombreCompleto: "Ing. Mónica Patricia Paredes Loor",
      suplenteCedula: "1719874562",
      suplenteCargo: "Analista Senior de Bases de Datos",
      suplenteAreaUnidad: "Departamento de Analítica y TIC",
      suplenteEmail: "monica.paredes@sri.gob.ec",
      suplenteTelefonoFijo: "022987100 ext 554",
      suplenteMovilInstitucional: "0993698521",
      suplenteMovilPersonal: "0981472583",
      serviciosHerramientas: ["Interoperabilidad SINARP", "Infodigital"],
      areasUso: "Dirección Nacional de Recaudación y Control Tributario",
      procesosUso: "Cruce automático de información patrimonial y societaria para procesos de auditoría fiscal.",
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
    institucion: "Agencia Nacional de Tránsito",
    fechaSolicitud: "15/09/2026 11:45",
    estado: "Aprobada",
    fechaRevision: "16/09/2026 09:30",
    revisor: "María Torres (Dirección de Gestión y Registro)",
    documentos: [
      "ARP-R02_Acuerdo_Confidencialidad_ANT.pdf"
    ],
    anexoB: {
      nombreEntidad: "Agencia Nacional de Tránsito",
      domicilioEntidad: "Av. Antonio José de Sucre y José Sánchez, Quito",
      representanteLegalNombre: "Mgs. Vanessa Cueva (Directora Ejecutiva)",
      funcionarioNombre: "Diana Patricia Espinoza Valarezo",
      funcionarioCedula: "0918745210",
      funcionarioCargo: "Subdirectora de Registro de Títulos Habilitantes",
      rolAsignado: "COORDINADOR TITULAR",
      misionVisionInstitucional: "Planificar, regular y controlar la gestión del transporte terrestre, tránsito y seguridad vial en el territorio nacional.",
      clausulasAceptadas: true,
      ciudadFirma: "Quito D.M.",
      fechaFirma: "15/09/2026",
      firmadoPorRepresentante: true,
      firmadoPorFuncionario: true,
      archivoAcuerdoFirmado: "ARP-R02_Acuerdo_Confidencialidad_ANT.pdf"
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
  const aprobarSolicitud = useCallback((id: string, revisor: string = "María Torres (Dirección de Gestión y Registro)") => {
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
  const rechazarSolicitud = useCallback((id: string, motivo: string, revisor: string = "María Torres (Dirección de Gestión y Registro)") => {
    setSolicitudes((prev) => {
      const now = new Date();
      const fechaStr = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const updated = prev.map((item) => {
        if (item.id === id) {
          const nuevoHistorial = [...(item.historial || [])];
          nuevoHistorial.push({
            id: `hist-${Date.now()}`,
            fechaHora: fechaStr,
            accion: "Solicitud rechazada",
            realizadoPor: revisor,
            rol: "Equipo de Gestión",
            detalles: `Motivo:\n"${motivo.trim()}"\n\nNotificación:\nInstitución notificada por correo electrónico.`
          });

          return {
            ...item,
            estado: "Cancelada" as EstadoSolicitudIngreso,
            fechaRevision: fechaStr,
            revisor,
            motivoRechazo: motivo.trim(),
            historial: nuevoHistorial
          };
        }
        return item;
      });
      saveStoredSolicitudesIngreso(updated);
      return updated;
    });
  }, []);

  // Agregar Trámite Proceso A (Registro de Institución - Anexo A)
  const agregarRegistroInstitucion = useCallback((anexoA: DatosAnexoA) => {
    setSolicitudes((prev) => {
      const now = new Date();
      const fechaStr = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const nextNum = prev.length + 1;
      const id = `SOL-ING-${String(nextNum).padStart(3, "0")}`;

      const docs = ["ARP-R01_Solicitud_Acceso_SINARP.pdf"];
      if (anexoA.esDelegado && anexoA.archivoSoporteDelegacion) {
        docs.push(anexoA.archivoSoporteDelegacion);
      }

      const newSol: SolicitudIngreso = {
        id,
        tipoTramite: "PROCESO_A_REGISTRO_INSTITUCION",
        codigoDocumental: "ARP-R01",
        tituloTramite: "Solicitud de Acceso SINARP (Registro Institución)",
        cedula: anexoA.titularCedula,
        nombres: anexoA.titularNombreCompleto.split(" ")[0] || anexoA.titularNombreCompleto,
        apellidos: anexoA.titularNombreCompleto.split(" ").slice(1).join(" ") || "",
        nombreCompleto: anexoA.titularNombreCompleto,
        iniciales: anexoA.titularNombreCompleto.slice(0, 2).toUpperCase(),
        correo: anexoA.titularEmail,
        institucion: anexoA.nombreEntidad,
        fechaSolicitud: fechaStr,
        estado: "Pendiente",
        documentos: docs,
        anexoA
      };

      const updated = [newSol, ...prev];
      saveStoredSolicitudesIngreso(updated);
      return updated;
    });
  }, []);

  // Agregar Trámite Proceso B (Enrolamiento de Coordinador - Anexo B)
  const agregarEnrolamientoCoordinador = useCallback((anexoB: DatosAnexoB) => {
    setSolicitudes((prev) => {
      const now = new Date();
      const fechaStr = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const nextNum = prev.length + 1;
      const id = `SOL-ING-${String(nextNum).padStart(3, "0")}`;

      const newSol: SolicitudIngreso = {
        id,
        tipoTramite: "PROCESO_B_ENROLAMIENTO_COORDINADOR",
        codigoDocumental: "ARP-R02",
        tituloTramite: "Acuerdo de Confidencialidad (Enrolamiento)",
        cedula: anexoB.funcionarioCedula,
        nombres: anexoB.funcionarioNombre.split(" ")[0] || anexoB.funcionarioNombre,
        apellidos: anexoB.funcionarioNombre.split(" ").slice(1).join(" ") || "",
        nombreCompleto: anexoB.funcionarioNombre,
        iniciales: anexoB.funcionarioNombre.slice(0, 2).toUpperCase(),
        correo: `${anexoB.funcionarioNombre.toLowerCase().replace(/\s+/g, ".")}@institucion.gob.ec`,
        institucion: anexoB.nombreEntidad,
        fechaSolicitud: fechaStr,
        estado: "Pendiente",
        documentos: ["ARP-R02_Acuerdo_Uso_Confidencialidad.pdf"],
        anexoB
      };

      const updated = [newSol, ...prev];
      saveStoredSolicitudesIngreso(updated);
      return updated;
    });
  }, []);

  // Agregar Trámite Proceso C (Cambio de Coordinador - Anexo C)
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

  // Helper para validar cédula en Proceso B contra preregistros aprobados (BPM Proceso B)
  const buscarPreregistroPorCedula = useCallback((cedula: string) => {
    const list = getStoredSolicitudesIngreso();
    const cleanCedula = cedula.trim();

    // 1. Buscar si hay una institución aprobada en Proceso A con esta cédula
    for (const sol of list) {
      if (sol.tipoTramite === "PROCESO_A_REGISTRO_INSTITUCION" && sol.estado === "Aprobada" && sol.anexoA) {
        if (sol.anexoA.titularCedula === cleanCedula) {
          return {
            encontrado: true,
            tipo: "TITULAR",
            nombreCompleto: sol.anexoA.titularNombreCompleto,
            cedula: sol.anexoA.titularCedula,
            cargo: sol.anexoA.titularCargo,
            correo: sol.anexoA.titularEmail,
            institucion: sol.anexoA.nombreEntidad,
            direccion: sol.anexoA.direccionEntidad,
            representanteLegal: sol.anexoA.representanteLegalNombre,
            origenTramiteId: sol.id,
            yaEnrolado: list.some((s) => s.tipoTramite === "PROCESO_B_ENROLAMIENTO_COORDINADOR" && s.cedula === cleanCedula && s.estado === "Aprobada")
          };
        }
        if (sol.anexoA.suplenteCedula === cleanCedula) {
          return {
            encontrado: true,
            tipo: "SUPLENTE",
            nombreCompleto: sol.anexoA.suplenteNombreCompleto,
            cedula: sol.anexoA.suplenteCedula,
            cargo: sol.anexoA.suplenteCargo,
            correo: sol.anexoA.suplenteEmail,
            institucion: sol.anexoA.nombreEntidad,
            direccion: sol.anexoA.direccionEntidad,
            representanteLegal: sol.anexoA.representanteLegalNombre,
            origenTramiteId: sol.id,
            yaEnrolado: list.some((s) => s.tipoTramite === "PROCESO_B_ENROLAMIENTO_COORDINADOR" && s.cedula === cleanCedula && s.estado === "Aprobada")
          };
        }
      }

      // 2. Buscar si hay un cambio de coordinador aprobado en Proceso C con esta cédula
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
            direccion: "Dirección institucional registrada",
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
            direccion: "Dirección institucional registrada",
            representanteLegal: sol.anexoC.representanteLegalNombre,
            origenTramiteId: sol.id,
            yaEnrolado: list.some((s) => s.tipoTramite === "PROCESO_B_ENROLAMIENTO_COORDINADOR" && s.cedula === cleanCedula && s.estado === "Aprobada")
          };
        }
      }
    }

    // Datos demo precargados para test si coincide con la cédula demo
    if (cleanCedula === "1712345602") {
      return {
        encontrado: true,
        tipo: "TITULAR",
        nombreCompleto: "Paula Andrea Mendoza Zambrano",
        cedula: "1712345602",
        cargo: "Coordinadora de Tecnologías de la Información",
        correo: "paula.mendoza@dinarp.gob.ec",
        institucion: "Dirección Nacional de Registros Públicos",
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
        nombreCompleto: "Ing. Roberto Carlos Dávila Silva",
        cedula: "1715489621",
        cargo: "Especialista de Infraestructura y Datos",
        correo: "roberto.davila@msp.gob.ec",
        institucion: "Ministerio de Salud Pública",
        direccion: "Av. República de El Salvador 36-64 y Suecia, Quito",
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
          
          nuevoHistorial.push({
            id: `hist-${Date.now()}`,
            fechaHora: now,
            accion: esReasignacion ? "Reasignación de trámite" : "Asignación de trámite",
            realizadoPor: asignadoPor || "Director",
            detalles: `Trámite ${esReasignacion ? 'reasignado' : 'asignado'} a ${revisorNombre}. ${observaciones ? `Observaciones: ${observaciones}` : ''}`.trim()
          });

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
          const esReasignacion = Boolean(item.revisorGestion || item.revisor);
          const nuevoHistorial = [...(item.historial || [])];
          
          nuevoHistorial.push({
            id: `hist-${Date.now()}-${item.id}`,
            fechaHora: now,
            accion: esReasignacion ? "Reasignación de trámite" : "Asignación de trámite",
            realizadoPor: asignadoPor || "Director",
            detalles: `Trámite ${esReasignacion ? 'reasignado' : 'asignado'} a ${revisorNombre}. ${observaciones ? `Observaciones: ${observaciones}` : ''}`.trim()
          });

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
      const updated = prev.map((item) => {
        if (item.id === solicitudId) {
          return { ...item, revisionIniciada: true, revisor: revisorNombre || item.revisor };
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
          nuevoHistorial.push({
            id: `hist-${Date.now()}`,
            fechaHora: now,
            accion: "Solicitud aprobada por Gestión",
            realizadoPor: aprobadoPor || item.revisorGestion || "Revisor",
            detalles: observaciones || "Trámite validado documentalmente. Continúa a Normatividad."
          });

          return {
            ...item,
            estado: "PENDIENTE_ASIGNACION_NORMATIVIDAD" as EstadoSolicitudIngreso,
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
    actualizarEstado(solicitudId, "EN_REVISION_NORMATIVIDAD", {
      revisorNormatividad: revisorNombre,
      fechaAsignacionNormatividad: now,
      observacionesAsignacion: observaciones
    });
  }, [actualizarEstado]);

  const aprobarNormatividad = useCallback((solicitudId: string, aprobadoPor?: string, observaciones?: string, resolucion?: string) => {
    const now = new Date().toLocaleString("es-EC", { dateStyle: "short", timeStyle: "short" });
    actualizarEstado(solicitudId, "APROBADO_FINAL", {
      fechaRevision: now,
      resolucion: resolucion
    });
  }, [actualizarEstado]);

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
    aprobarGestion,
    asignarRevisorNormatividad,
    aprobarNormatividad,
    agregarRegistroInstitucion,
    agregarEnrolamientoCoordinador,
    agregarCambioCoordinador,
    buscarPreregistroPorCedula,
    resetStore
  };
}
