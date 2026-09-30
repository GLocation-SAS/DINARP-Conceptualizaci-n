import re

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace for DIR_NORMATIVA
content = re.sub(
    r'(if \([\s\S]*?currentUser\.role === "DIR_NORMATIVA" &&[\s\S]*?!\[[\s\S]*?\]\.includes\(item\.estado\)[\s\S]*?\)[\s\S]*?return false;)',
    r'\1\n      if (currentUser.role === "DIR_NORMATIVA" && item.tipoTramite === "PROCESO_B_ENROLAMIENTO_COORDINADOR") return false;',
    content
)

# Replace for EQ_NORMATIVA
content = re.sub(
    r'(if \([\s\S]*?currentUser\.role === "EQ_NORMATIVA" &&[\s\S]*?!\[[\s\S]*?\]\.includes\(item\.estado\)[\s\S]*?\) \{\n\s*return false;\n\s*\})',
    r'\1\n      if (currentUser.role === "EQ_NORMATIVA" && item.tipoTramite === "PROCESO_B_ENROLAMIENTO_COORDINADOR") return false;',
    content
)

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
