import re

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix colSpan based on role
content = content.replace(
    '<TableCell colSpan={9} className="text-center py-12">',
    '<TableCell colSpan={(currentUser.role === "DIR_NORMATIVA" || currentUser.role === "EQ_NORMATIVA") ? 7 : 9} className="text-center py-12">'
)

content = content.replace(
    '                              {/* Proceso */}\n                              <TableCell className="px-2 overflow-hidden">',
    '                              {/* Proceso */}\n                              {!(currentUser.role === "DIR_NORMATIVA" || currentUser.role === "EQ_NORMATIVA") && (\n                                <TableCell className="px-2 overflow-hidden">'
)

content = content.replace(
    '                                  );\n                                })()}\n                              </TableCell>',
    '                                  );\n                                })()}\n                              </TableCell>\n                              )}'
)

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
