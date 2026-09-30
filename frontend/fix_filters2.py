import re

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

def filter_normatividad(match):
    return """      if (
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

content = re.sub(
    r'      if \(\s*\(currentUser\.role === "DIR_NORMATIVA" \|\| currentUser\.role === "EQ_NORMATIVA"\) &&\s*!\[.*?\]\.includes\(item\.estado\)\s*\)\s*\{\s*return false;\s*\}',
    filter_normatividad,
    content,
    flags=re.DOTALL
)

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
