import re

file_path = "src/app/wireframes2/enrolamiento-coordinador/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("ChevronDown,", "ChevronDown, ChevronUp,")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

