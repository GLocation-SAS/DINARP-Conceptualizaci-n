import re

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    '            appearance="solid"\n            size="sm"\n            dot={false}',
    '            appearance="solid"\n            size="sm"\n            dot'
)

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
