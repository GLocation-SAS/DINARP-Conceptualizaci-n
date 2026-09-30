import re

with open("src/app/wireframes2/acceso-seguridad/data/gestion-ingresos-store.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Replace using regex to avoid encoding issues on the dash
content = re.sub(
    r'label: "Pendiente de Asignación [^"]+",',
    r'label: "Pendiente de asignación",',
    content
)

with open("src/app/wireframes2/acceso-seguridad/data/gestion-ingresos-store.ts", "w", encoding="utf-8") as f:
    f.write(content)
