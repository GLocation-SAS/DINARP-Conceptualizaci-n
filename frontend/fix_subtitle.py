import re

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    'subtitleText = "Gestiona y asigna los responsables para la formulación de resoluciones institucionales.";',
    'subtitleText = "Asignación de solicitudes para generar resoluciones a instituciones aprobadas.";'
)
content = content.replace(
    'subtitleText = "Gestiona y asigna los responsables para la formulaci\\ufffdn de resoluciones institucionales.";',
    'subtitleText = "Asignación de solicitudes para generar resoluciones a instituciones aprobadas.";'
)
content = content.replace(
    'subtitleText = "Gestiona y asigna los responsables para la formulaci\\u00f3n de resoluciones institucionales.";',
    'subtitleText = "Asignación de solicitudes para generar resoluciones a instituciones aprobadas.";'
)

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
