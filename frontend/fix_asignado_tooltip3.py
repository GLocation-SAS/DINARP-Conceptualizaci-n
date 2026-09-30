import re

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    'Trǭmite pendiente de asignar',
    'Trámite pendiente de asignar'
)

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
