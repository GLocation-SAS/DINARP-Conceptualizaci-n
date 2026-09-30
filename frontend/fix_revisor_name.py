import re

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix revisorAsignado logic so it doesn't fallback to row.revisor when it's DIR_NORMATIVA if that refers to the gestion revisor
content = re.sub(
    r'const revisorAsignado =\n\s*currentUser\.role === "DIR_NORMATIVA" \|\| currentUser\.role === "EQ_NORMATIVA"\n\s*\? \(row\.revisorNormatividad \|\| row\.revisor\)\n\s*: \(row\.revisorGestion \|\| row\.revisor\);',
    r'const revisorAsignado =\n                            currentUser.role === "DIR_NORMATIVA" || currentUser.role === "EQ_NORMATIVA"\n                              ? row.revisorNormatividad\n                              : (row.revisorGestion || row.revisor);',
    content
)

# And in the Detail view, "Revisado por" -> "Responsable asignado:" for Normatividad, or "Asignado a:"
# Look for "Revisado por:"
content = re.sub(
    r'<span className="text-muted-foreground">Revisado por: </span>\n\s*<strong className="text-foreground">\{selectedSolicitud\.revisor \|\| \(selectedSolicitud\.estado\.includes\("NORMATIVIDAD"\) \? "Dirección de Normatividad" : "Dirección de Gestión y Registro"\)\}</strong>',
    r'<span className="text-muted-foreground">{(currentUser.role === "DIR_NORMATIVA" || currentUser.role === "EQ_NORMATIVA" || selectedSolicitud.estado.includes("NORMATIVIDAD") || selectedSolicitud.estado.includes("RESOLUCION")) ? "Responsable de Normatividad: " : "Revisado por: "}</span>\n                    <strong className="text-foreground">\n                      {(currentUser.role === "DIR_NORMATIVA" || currentUser.role === "EQ_NORMATIVA" || selectedSolicitud.estado.includes("NORMATIVIDAD") || selectedSolicitud.estado.includes("RESOLUCION")) ? (selectedSolicitud.revisorNormatividad || "Sin asignar") : (selectedSolicitud.revisorGestion || selectedSolicitud.revisor || "Dirección de Gestión y Registro")}\n                    </strong>',
    content
)

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
