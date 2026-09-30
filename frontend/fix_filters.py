import re

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

old_filter = """      // BPM Logic: Filtrar por rol con trazabilidad completa
      if (
        currentUser.role === "DIR_GESTION" &&
        ![
          "PENDIENTE_ASIGNACION_GESTION",
          "EN_REVISION_GESTION",
          "PENDIENTE_ASIGNACION_NORMATIVIDAD",
          "EN_REVISION_NORMATIVIDAD",
          "PENDIENTE_GENERAR_RESOLUCION",
          "EN_GENERACION_RESOLUCION",
          "GENERACION_PENDIENTE",
          "RESOLUCION_GENERADA",
          "APROBADO_FINAL",
          "Aprobada",
          "Rechazada",
          "Cancelada",
        ].includes(item.estado)
      ) {
        return false;
      }
      if (currentUser.role === "EQ_GESTION") {
        if (![
          "EN_REVISION_GESTION",
          "PENDIENTE_ASIGNACION_GESTION",
          "PENDIENTE_ASIGNACION_NORMATIVIDAD",
          "EN_REVISION_NORMATIVIDAD",
          "PENDIENTE_GENERAR_RESOLUCION",
          "EN_GENERACION_RESOLUCION",
          "GENERACION_PENDIENTE",
          "RESOLUCION_GENERADA",
          "APROBADO_FINAL",
          "Aprobada",
          "Rechazada",
          "Pendiente"
        ].includes(item.estado)) return false;
      }

      if (
        (currentUser.role === "DIR_NORMATIVA" || currentUser.role === "EQ_NORMATIVA") &&
        ![
          "PENDIENTE_ASIGNACION_NORMATIVIDAD",
          "EN_REVISION_NORMATIVIDAD",
          "PENDIENTE_GENERAR_RESOLUCION",
          "EN_GENERACION_RESOLUCION",
          "GENERACION_PENDIENTE",
          "RESOLUCION_GENERADA",
          "APROBADO_FINAL",
          "Aprobada",
          "Rechazada"
        ].includes(item.estado)
      ) {
        return false;
      }"""

new_filter = """      // BPM Logic: Filtrar por rol con trazabilidad completa
      if (
        currentUser.role === "DIR_GESTION" &&
        ![
          "PENDIENTE_ASIGNACION_GESTION",
          "EN_REVISION_GESTION",
          "PENDIENTE_ASIGNACION_NORMATIVIDAD",
          "EN_REVISION_NORMATIVIDAD",
          "PENDIENTE_GENERAR_RESOLUCION",
          "EN_GENERACION_RESOLUCION",
          "GENERACION_PENDIENTE",
          "RESOLUCION_GENERADA",
          "APROBADO_FINAL",
          "Aprobada",
          "Rechazada",
          "Cancelada",
        ].includes(item.estado)
      ) {
        return false;
      }
      if (currentUser.role === "EQ_GESTION") {
        if (![
          "EN_REVISION_GESTION",
          "PENDIENTE_ASIGNACION_GESTION",
          "PENDIENTE_ASIGNACION_NORMATIVIDAD",
          "EN_REVISION_NORMATIVIDAD",
          "PENDIENTE_GENERAR_RESOLUCION",
          "EN_GENERACION_RESOLUCION",
          "GENERACION_PENDIENTE",
          "RESOLUCION_GENERADA",
          "APROBADO_FINAL",
          "Aprobada",
          "Rechazada",
          "Pendiente"
        ].includes(item.estado)) return false;
      }

      if (
        (currentUser.role === "DIR_NORMATIVA" || currentUser.role === "EQ_NORMATIVA") &&
        ![
          "PENDIENTE_ASIGNACION_NORMATIVIDAD",
          "EN_REVISION_NORMATIVIDAD",
          "PENDIENTE_GENERAR_RESOLUCION",
          "EN_GENERACION_RESOLUCION",
          "GENERACION_PENDIENTE",
          "RESOLUCION_GENERADA"
        ].includes(item.estado)
      ) {
        return false;
      }"""

content = content.replace(old_filter, new_filter)

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
