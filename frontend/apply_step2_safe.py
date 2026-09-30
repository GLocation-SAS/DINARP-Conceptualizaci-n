import re

file_path = "frontend/src/app/wireframes2/enrolamiento-coordinador/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

with open("frontend/step2_template.tsx", "r", encoding="utf-8") as f:
    step2_new = f.read()

pattern = re.compile(r"\{\s*\/\*.*?PASO 2.*?\*\/\s*\}\s*\{step === 2 && \([\s\S]*?(?=\{\s*\/\*.*?PASO 3.*?\*\/\s*\}\s*\{step === 3 && \()", re.DOTALL)

match = pattern.search(content)
if match:
    new_content = content[:match.start()] + step2_new + "\n\n                    " + content[match.end():]
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Successfully replaced step 2")
else:
    print("Could not match regex")

