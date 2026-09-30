import re

with open("src/app/wireframes2/acceso-seguridad/data/gestion-ingresos-store.ts", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    'case "PENDIENTE_ASIGNACION_NORMATIVIDAD":\n      return {\n        tone: "warning" as const,\n        label: "Pendiente de asignación",\n      };',
    'case "PENDIENTE_ASIGNACION_NORMATIVIDAD":\n      return {\n        tone: "warning" as const,\n        label: "Pendiente asignación a Normativa",\n      };'
)
content = content.replace(
    'case "PENDIENTE_ASIGNACION_NORMATIVIDAD":\n      return {\n        tone: "warning" as const,\n        label: "Pendiente de asignacin",\n      };',
    'case "PENDIENTE_ASIGNACION_NORMATIVIDAD":\n      return {\n        tone: "warning" as const,\n        label: "Pendiente asignación a Normativa",\n      };'
)


with open("src/app/wireframes2/acceso-seguridad/data/gestion-ingresos-store.ts", "w", encoding="utf-8") as f:
    f.write(content)
