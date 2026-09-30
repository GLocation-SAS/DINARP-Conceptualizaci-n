import re

with open("src/app/wireframes2/acceso-seguridad/data/gestion-ingresos-store.ts", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    'label: "Pendiente de Asignación — Normatividad",',
    'label: "Pendiente de asignación",'
)

with open("src/app/wireframes2/acceso-seguridad/data/gestion-ingresos-store.ts", "w", encoding="utf-8") as f:
    f.write(content)
