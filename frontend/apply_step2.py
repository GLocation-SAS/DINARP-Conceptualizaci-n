import re

file_path = "src/app/wireframes2/enrolamiento-coordinador/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

with open("step2_template.tsx", "r", encoding="utf-8") as f:
    step2_new = f.read()

# I will find the exact boundaries without emojis due to encoding issues
start_marker = "{/* \uFFFD?\"\uFFFD? PASO 2: ACUERDO DE USO Y CONFIDENCIALIDAD"
end_marker = "{/* \uFFFD?\"\uFFFD? PASO 3: REVISI\uFFFD\"N DE LA INFORMACI\uFFFD\"N"

# Since powershell ruined the emojis, I will use pure regex on the text
pattern = re.compile(r"\{\/\*.*?PASO 2: ACUERDO DE USO Y CONFIDENCIALIDAD.*?\*\/.*?\{\/\*.*?PASO 3: REVISI.*?N DE LA INFORMACI.*?N.*?\*\/", re.DOTALL)

# Re-add the Step 3 header because it will be eaten by the regex
replacement = step2_new + "\n\n                    {/* PASO 3: REVISIÓN DE LA INFORMACIÓN */"
new_content = pattern.sub(replacement, content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)
print("Applied step 2")
