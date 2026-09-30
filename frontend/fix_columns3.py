import re

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

pattern = r'\{\!\(currentUser\.role === "DIR_NORMATIVA" \|\| currentUser\.role === "EQ_NORMATIVA"\) && \(\s*(<TableCell className="px-2 overflow-hidden">\s*<Tooltip>.*?</Tooltip>\s*</TableCell>)\s*\)\}'

content = re.sub(pattern, r'\1', content, flags=re.DOTALL)

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
