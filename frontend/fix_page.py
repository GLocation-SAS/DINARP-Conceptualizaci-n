import re

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Restore the lost changes
# "Revisado por:"
content = re.sub(
    r'<strong className="text-foreground">\{selectedSolicitud\.revisor \|\| "Dirección de Gestión y Registro"\}</strong>',
    r'<strong className="text-foreground">{selectedSolicitud.revisor || (selectedSolicitud.estado.includes("NORMATIVIDAD") ? "Dirección de Normatividad" : "Dirección de Gestión y Registro")}</strong>',
    content
)

# 2. Replace the div wrapping the detail view with Card.
content = content.replace(
    '<div className="min-h-0 flex-1 flex flex-col bg-surface border border-border shadow-xs rounded-xl overflow-hidden">',
    '<Card className="min-h-0 flex-1 flex flex-col border-border shadow-xs overflow-hidden" innerClassName="p-0 flex flex-col h-full">'
)
content = content.replace(
    '</Tabs>',
    '</Tabs>\n            </Card>'
)

# Wait, the closing of the div was at the end. We need to be careful with replace.
# Let's not blindly replace div closing.

# 3. Fix titleText and subtitleText for isDirNormativa
content = re.sub(
    r'(} else if \(isDirNormativa\) \{[\s\S]*?titleText = )"Asignación de solicitudes";(\s*subtitleText = )"Gestiona y asigna las solicitudes pendientes a los revisores del área correspondiente.";',
    r'\1"Gestión de resoluciones";\2"Gestiona y asigna los responsables para la formulación de resoluciones institucionales.";',
    content
)


with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
