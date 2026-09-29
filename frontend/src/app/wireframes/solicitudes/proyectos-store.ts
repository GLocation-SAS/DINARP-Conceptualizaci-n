"use client";

export interface CampoItem {
  id: string;
  nombre: string;
}

export interface ServicioCatalogo {
  id: string;
  nombre: string;
  descripcion: string;
  camposDisponibles: CampoItem[];
}

export interface InstitucionFuenteCatalogo {
  id: string;
  nombre: string;
  siglas: string;
  servicios: ServicioCatalogo[];
}

export interface FuenteSolicitada {
  id: string;
  institucionId: string;
  institucionNombre: string;
  servicioId: string;
  servicioNombre: string;
  campos: string[];
}

export interface Observacion {
  id: string;
  autor: string;
  rol: string;
  fecha: string;
  texto: string;
}

export interface HistorialMovimiento {
  id: string;
  etapa: string;
  fecha: string;
  responsable: string;
  entidad: string;
  descripcion: string;
  completado: boolean;
}

export interface ProyectoInteroperabilidad {
  id: string;
  codigo: string;
  nombre: string;
  entidadSolicitante: string;
  entidadesSolicitantes?: string[];
  objetivo: string;
  responsable: string;
  justificacion?: string;
  fuentes: FuenteSolicitada[];
  estado: "Borrador" | "En revisión" | "Observada" | "Autorizada" | "Servicio habilitado";
  ultimaActualizacion: string;
  fechaCreacion: string;
  observaciones?: Observacion[];
  historial?: HistorialMovimiento[];
}

// ─── Catálogo Ilustrativo de Entidades Solicitantes ──────────────────────────
export const ENTIDADES_SOLICITANTES_CATALOGO = [
  { value: "mintel", label: "Ministerio de Telecomunicaciones y de la Sociedad de la Información (MINTEL)" },
  { value: "dinarp", label: "Dirección Nacional de Registros Públicos (DINARP)" },
  { value: "msp", label: "Ministerio de Salud Pública (MSP)" },
  { value: "mineduc", label: "Ministerio de Educación (MINEDUC)" },
  { value: "mies", label: "Ministerio de Inclusión Económica y Social (MIES)" },
  { value: "sri", label: "Servicio de Rentas Internas (SRI)" },
  { value: "ant", label: "Agencia Nacional de Tránsito (ANT)" },
  { value: "mdt", label: "Ministerio del Trabajo (MDT)" },
  { value: "iess", label: "Instituto Ecuatoriano de Seguridad Social (IESS)" },
  { value: "digercic", label: "Dirección General de Registro Civil, Identificación y Cedulación (DIGERCIC)" },
  { value: "uafe", label: "Unidad de Análisis Financiero y Económico (UAFE)" },
  { value: "cj", label: "Consejo de la Judicatura (CJ)" },
  { value: "cne", label: "Consejo Nacional Electoral (CNE)" },
  { value: "snap", label: "Secretaría Nacional de Administración Pública (SNAP)" },
  { value: "mun-quito", label: "Municipio del Distrito Metropolitano de Quito" },
  { value: "mun-guayaquil", label: "Muy Ilustre Municipalidad de Guayaquil" },
];

// ─── Catálogo Ilustrativo de Ejemplo para el Prototipo ─────────────────────────
// NOTA: Datos de ejemplo del prototipo para demostrar la interacción, no catálogo oficial de DINARP.
export const CATALOGO_EJEMPLO: InstitucionFuenteCatalogo[] = [
  {
    id: "digercic",
    nombre: "Dirección General de Registro Civil, Identificación y Cedulación",
    siglas: "Registro Civil",
    servicios: [
      {
        id: "cedula-biograficos",
        nombre: "Consulta de Cédula y Datos Biográficos",
        descripcion: "Validación de identidad, nombres, estado civil y condición de ciudadano en tiempo real.",
        camposDisponibles: [
          { id: "cedula", nombre: "Número de Cédula" },
          { id: "nombres", nombre: "Nombres y Apellidos Completos" },
          { id: "fecha_nac", nombre: "Fecha de Nacimiento" },
          { id: "estado_civil", nombre: "Estado Civil" },
          { id: "condicion", nombre: "Condición de Ciudadano" },
          { id: "foto", nombre: "Fotografía Facial (Base64)" },
          { id: "conyuge", nombre: "Nombre del Cónyuge" },
          { id: "lugar_nac", nombre: "Lugar de Nacimiento" },
        ],
      },
      {
        id: "defunciones",
        nombre: "Consulta de Actas de Defunción",
        descripcion: "Verificación de actas de defunción y fecha de inscripción.",
        camposDisponibles: [
          { id: "cedula_fallecido", nombre: "Cédula del Fallecido" },
          { id: "fecha_defuncion", nombre: "Fecha de Defunción" },
          { id: "lugar_defuncion", nombre: "Lugar de Defunción" },
          { id: "numero_acta", nombre: "Número de Acta" },
        ],
      },
    ],
  },
  {
    id: "sri",
    nombre: "Servicio de Rentas Internas",
    siglas: "SRI",
    servicios: [
      {
        id: "ruc-estado",
        nombre: "Consulta de RUC y Estado Tributario",
        descripcion: "Verificación del estado tributario, tipo de contribuyente y actividades económicas.",
        camposDisponibles: [
          { id: "ruc", nombre: "Número de RUC" },
          { id: "razon_social", nombre: "Razón Social / Nombre Comercial" },
          { id: "estado_contribuyente", nombre: "Estado del Contribuyente (Activo/Pasivo)" },
          { id: "actividad_economica", nombre: "Actividad Económica Principal" },
          { id: "tipo_contribuyente", nombre: "Tipo de Contribuyente (Rimpe/General)" },
          { id: "obligaciones_pendientes", nombre: "Indicador de Obligaciones Pendientes" },
        ],
      },
    ],
  },
  {
    id: "ant",
    nombre: "Agencia Nacional de Tránsito",
    siglas: "ANT",
    servicios: [
      {
        id: "licencia-puntos",
        nombre: "Consulta de Licencias de Conducir e Infracciones",
        descripcion: "Historial de licencias vigentes, categoría, puntos e infracciones registradas.",
        camposDisponibles: [
          { id: "num_licencia", nombre: "Número de Licencia" },
          { id: "tipo_licencia", nombre: "Tipo / Categoría de Licencia" },
          { id: "puntos_vigentes", nombre: "Puntos Vigentes Disponibles" },
          { id: "estado_licencia", nombre: "Estado de Vigencia" },
          { id: "bloqueos", nombre: "Impedimentos o Bloqueos Activos" },
        ],
      },
      {
        id: "matricula-vehicular",
        nombre: "Consulta de Matrícula y Datos del Vehículo",
        descripcion: "Información técnica de vehículos, propietario y estado de revisión técnica.",
        camposDisponibles: [
          { id: "placa", nombre: "Número de Placa" },
          { id: "chasis", nombre: "Número de Chasis / VIN" },
          { id: "marca_modelo", nombre: "Marca, Modelo y Año" },
          { id: "propietario_actual", nombre: "Identificación del Propietario" },
        ],
      },
    ],
  },
  {
    id: "iess",
    nombre: "Instituto Ecuatoriano de Seguridad Social",
    siglas: "IESS",
    servicios: [
      {
        id: "afiliacion-cumplimiento",
        nombre: "Certificado de No Adeudar y Estado de Afiliación",
        descripcion: "Verificación de no adeudar al IESS y condición de afiliación activa.",
        camposDisponibles: [
          { id: "num_patronal", nombre: "Número Patronal / Cédula" },
          { id: "estado_deuda", nombre: "Estado de Obligaciones (Al día / En mora)" },
          { id: "tipo_afiliado", nombre: "Régimen de Afiliación" },
          { id: "fecha_validez", nombre: "Fecha de Emisión del Certificado" },
        ],
      },
    ],
  },
];

const STORAGE_KEY = "dinarp_wireframe_proyectos_v1";

export function getStoredProjects(): ProyectoInteroperabilidad[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveStoredProject(proyecto: ProyectoInteroperabilidad): void {
  if (typeof window === "undefined") return;
  try {
    const projects = getStoredProjects();
    const existingIndex = projects.findIndex((p) => p.id === proyecto.id || p.codigo === proyecto.codigo);
    if (existingIndex >= 0) {
      projects[existingIndex] = proyecto;
    } else {
      projects.unshift(proyecto);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error("Error al guardar proyecto en storage", e);
  }
}

export function getProjectById(idOrCodigo: string): ProyectoInteroperabilidad | null {
  const projects = getStoredProjects();
  return projects.find((p) => p.id === idOrCodigo || p.codigo === idOrCodigo) || null;
}

export function deleteStoredProject(idOrCodigo: string): void {
  if (typeof window === "undefined") return;
  try {
    const projects = getStoredProjects();
    const updated = projects.filter((p) => p.id !== idOrCodigo && p.codigo !== idOrCodigo);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Error al eliminar proyecto de storage", e);
  }
}

export function clearProjects(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

