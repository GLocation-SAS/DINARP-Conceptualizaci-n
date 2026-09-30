import re

with open("src/app/wireframes2/acceso-seguridad/data/gestion-ingresos-store.ts", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    'case "PENDIENTE_GENERAR_RESOLUCION":\n      return {\n        tone: "info" as const,',
    'case "PENDIENTE_GENERAR_RESOLUCION":\n      return {\n        tone: "secondary" as const,'
)

content = content.replace(
    'case "GENERACION_PENDIENTE":\n      return {\n        tone: "warning" as const,',
    'case "GENERACION_PENDIENTE":\n      return {\n        tone: "info" as const,'
)

with open("src/app/wireframes2/acceso-seguridad/data/gestion-ingresos-store.ts", "w", encoding="utf-8") as f:
    f.write(content)
