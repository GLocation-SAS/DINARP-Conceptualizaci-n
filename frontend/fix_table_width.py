import re

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Make the table width adjust based on the role
old_table = '<Table\n                      className="w-full min-w-[1080px] table-fixed"'
new_table = '<Table\n                      className={cn("w-full table-fixed", (currentUser.role === "DIR_NORMATIVA" || currentUser.role === "EQ_NORMATIVA") ? "min-w-[800px]" : "min-w-[1080px]")}'
content = content.replace(old_table, new_table)

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
