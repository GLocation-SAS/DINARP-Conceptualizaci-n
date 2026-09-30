import re

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix table width to full for normatividad again since we add back 2 columns
content = content.replace(
    'className={cn("w-full table-fixed", (currentUser.role === "DIR_NORMATIVA" || currentUser.role === "EQ_NORMATIVA") ? "min-w-[800px]" : "min-w-[1080px]")}',
    'className="w-full table-fixed min-w-[1080px]"'
)

# Remove conditions around PROCESO TableHead
content = content.replace(
    '{!(currentUser.role === "DIR_NORMATIVA" || currentUser.role === "EQ_NORMATIVA") && (\n                        <TableHead className="w-[160px] px-2 py-2.5 whitespace-nowrap">\n                          PROCESO\n                        </TableHead>\n                      )}',
    '<TableHead className="w-[160px] px-2 py-2.5 whitespace-nowrap">\n                          PROCESO\n                        </TableHead>'
)

# Remove conditions around SOLICITANTE TableHead
content = content.replace(
    '{!(currentUser.role === "DIR_NORMATIVA" || currentUser.role === "EQ_NORMATIVA") && (\n                        <TableHead className="w-[190px] px-2 py-2.5 whitespace-nowrap">\n                          SOLICITANTE\n                        </TableHead>\n                      )}',
    '<TableHead className="w-[190px] px-2 py-2.5 whitespace-nowrap">\n                          SOLICITANTE\n                        </TableHead>'
)

# Fix empty state colSpan logic since it's 9 again
content = re.sub(
    r'<TableCell colSpan=\{\(currentUser.role === "DIR_NORMATIVA" \|\| currentUser.role === "EQ_NORMATIVA"\) \? 7 : 9\}',
    '<TableCell colSpan={9}',
    content
)

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
