import re

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    '          <Badge\n            tone={tone}\n            appearance="soft"',
    '          <Badge\n            tone={tone}\n            appearance="solid"\n            dot={false}'
)

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
