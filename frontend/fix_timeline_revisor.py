import re

with open("src/app/wireframes2/components/tramite-timeline-helper.tsx", "r", encoding="utf-8") as f:
    content = f.read()

old_logic = 'const revisorActual = solicitud.revisorGestion || solicitud.revisorNormatividad || solicitud.revisor;'
new_logic = '''const isNormatividad = solicitud.estado.includes("NORMATIVIDAD") || solicitud.estado.includes("RESOLUCION");
  const revisorActual = isNormatividad ? solicitud.revisorNormatividad : (solicitud.revisorGestion || solicitud.revisor);'''

content = content.replace(old_logic, new_logic)

# Replace the inner isNormatividad definition
old_is_norm = 'const isNormatividad = solicitud.estado.includes("NORMATIVIDAD") || (solicitud.revisorNormatividad && solicitud.revisorNormatividad === revisorActual);'
content = content.replace(old_is_norm, '')

with open("src/app/wireframes2/components/tramite-timeline-helper.tsx", "w", encoding="utf-8") as f:
    f.write(content)
