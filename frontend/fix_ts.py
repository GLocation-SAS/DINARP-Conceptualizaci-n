import re

file_path = "src/app/wireframes2/enrolamiento-coordinador/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

bad_line = '''<span className="text-foreground font-semibold truncate">Anexo B {formData.funcionarioNombre ?  -  : ""}</span>'''
good_line = '''<span className="text-foreground font-semibold truncate">Anexo B {formData.funcionarioNombre ? " - " + formData.funcionarioNombre : ""}</span>'''

content = content.replace(bad_line, good_line)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed TS error")
