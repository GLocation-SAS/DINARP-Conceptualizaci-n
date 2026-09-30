import re

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix table tooltip
content = content.replace(
    '{revisorAsignado ? "Revisor asignado" : "Estado de asignación"}',
    '{revisorAsignado ? (currentUser.role === "DIR_NORMATIVA" || currentUser.role === "EQ_NORMATIVA" ? "Responsable de Normatividad" : "Revisor asignado") : "Estado de asignación"}'
)

content = content.replace(
    'Trǭmite pendiente de asignar a un revisor',
    'Trámite pendiente de asignar'
)
content = content.replace(
    'Trámite pendiente de asignar a un revisor',
    'Trámite pendiente de asignar'
)

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
