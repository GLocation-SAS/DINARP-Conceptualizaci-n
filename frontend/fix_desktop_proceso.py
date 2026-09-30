import re

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix colSpan based on role
content = content.replace(
    '<TableCell colSpan={9} className="text-center py-12">',
    '<TableCell colSpan={(currentUser.role === "DIR_NORMATIVA" || currentUser.role === "EQ_NORMATIVA") ? 7 : 9} className="text-center py-12">'
)

# Fix Proceso cell missing conditional wrapper
content = re.sub(
    r'(/\* Proceso \*/\s*)<TableCell className="px-2 overflow-hidden">',
    r'\1{!(currentUser.role === "DIR_NORMATIVA" || currentUser.role === "EQ_NORMATIVA") && (\n                                <TableCell className="px-2 overflow-hidden">',
    content
)

# Find the end of the Proceso TableCell
content = re.sub(
    r'(<p className="font-mono text-\[10px\] text-primary mt-1 border-t border-border/60 pt-1">.*?<\/p>\s*\)\}\s*<\/TooltipContent>\s*<\/Tooltip>\s*\);\s*\})\(\)\}\s*<\/TableCell>)',
    r'\1\n                              )}',
    content,
    flags=re.DOTALL
)

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
