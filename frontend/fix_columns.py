import re

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix table width to full for normatividad again since we add back 2 columns
content = content.replace(
    'className={cn("w-full table-fixed", (currentUser.role === "DIR_NORMATIVA" || currentUser.role === "EQ_NORMATIVA") ? "min-w-[800px]" : "min-w-[1080px]")}',
    'className="w-full table-fixed min-w-[1080px]"'
)

# 1. Remove condition for TableHead PROCESO
pattern1 = r'\{\!\(currentUser\.role === "DIR_NORMATIVA" \|\| currentUser\.role === "EQ_NORMATIVA"\) && \(\s*(<TableHead[^>]*>\s*PROCESO\s*</TableHead>)\s*\)\}'
content = re.sub(pattern1, r'\1', content, flags=re.DOTALL)

# 2. Remove condition for TableHead SOLICITANTE
pattern2 = r'\{\!\(currentUser\.role === "DIR_NORMATIVA" \|\| currentUser\.role === "EQ_NORMATIVA"\) && \(\s*(<TableHead[^>]*>\s*SOLICITANTE\s*</TableHead>)\s*\)\}'
content = re.sub(pattern2, r'\1', content, flags=re.DOTALL)

# 3. Remove condition for TableCell PROCESO
pattern3 = r'\{\!\(currentUser\.role === "DIR_NORMATIVA" \|\| currentUser\.role === "EQ_NORMATIVA"\) && \(\s*(<TableCell[^>]*>.*?\{procesoLabel\}.*?</TableCell>)\s*\)\}'
content = re.sub(pattern3, r'\1', content, flags=re.DOTALL)

# 4. Remove condition for TableCell SOLICITANTE
pattern4 = r'\{\!\(currentUser\.role === "DIR_NORMATIVA" \|\| currentUser\.role === "EQ_NORMATIVA"\) && \(\s*(<TableCell[^>]*>.*?\{row\.solicitante.*?</TableCell>)\s*\)\}'
content = re.sub(pattern4, r'\1', content, flags=re.DOTALL)


# Fix empty state colSpan logic since it's 9 again
content = re.sub(
    r'<TableCell colSpan=\{\(currentUser.role === "DIR_NORMATIVA" \|\| currentUser.role === "EQ_NORMATIVA"\) \? 7 : 9\}',
    '<TableCell colSpan={9}',
    content
)


with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
