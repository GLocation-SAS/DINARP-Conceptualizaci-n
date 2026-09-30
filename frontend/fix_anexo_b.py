import re

file_path = "src/app/wireframes2/enrolamiento-coordinador/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

with open("anexo_b_full.tsx", "r", encoding="utf-8") as f:
    anexo_b_code = f.read()

# Replace Step 3 blocks
pattern_step3 = re.compile(r"\{\/\*\s*Tabla 1: Comparecientes\s*\*\/.*?\}\s*<\/div>\s*<\/div>", re.DOTALL)
# Actually, the block for clausula legal ends before {/* Bloque de Firma Simulado */}
# Let's find it carefully.
start_idx = content.find("{/* Tabla 1: Comparecientes */}")
end_idx = content.find("{/* Bloque de Firma Simulado */}")

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + anexo_b_code + "\n\n                            " + content[end_idx:]
    print("Replaced Step 3")
else:
    print("Could not find step 3 blocks")

# Replace Step 2 titles
# "Clǭusula Primera ?" Intervinientes y Comparecientes"
# Since encoding is weird, I'll use regex.
content = re.sub(r"Cl.*?usula Primera.*?Intervinientes y Comparecientes", "CLÁUSULA PRIMERA. - INTERVINIENTES", content)
content = re.sub(r"Cl.*?usula Segunda.*?Antecedentes \(Misi.*?n y Visi.*?n Institucional\)", "CLÁUSULA SEGUNDA. - ANTECEDENTES", content)
content = re.sub(r"Cl.*?usula Tercera a S.*?ptima.*?Base Legal, Confidencialidad y Custodia", "CLÁUSULAS TERCERA A DÉCIMA. - BASE LEGAL Y CONFIDENCIALIDAD", content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
