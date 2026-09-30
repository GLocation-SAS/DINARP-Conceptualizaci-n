import re

file_path = "src/app/wireframes2/enrolamiento-coordinador/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

with open("step2_template.tsx", "r", encoding="utf-8") as f:
    step2_new = f.read()

# Find {step === 2 && (
start_match = re.search(r"\{\/\*.*?PASO 2.*?\*\/.*?(?=\{step === 2 && \()", content, re.DOTALL)
end_match = re.search(r"\{\/\*.*?PASO 3.*?\*\/.*?(?=\{step === 3 && \()", content, re.DOTALL)

if start_match and end_match:
    new_content = content[:start_match.start()] + step2_new + "\n\n                    " + content[end_match.start():]
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Successfully replaced step 2")
else:
    print("Could not find start or end")

