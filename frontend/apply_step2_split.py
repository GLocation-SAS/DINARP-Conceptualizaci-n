import re

file_path = "src/app/wireframes2/enrolamiento-coordinador/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

with open("step2_template.tsx", "r", encoding="utf-8") as f:
    step2_new = f.read()

parts_1 = content.split("PASO 2: ACUERDO DE USO")
if len(parts_1) < 2:
    print("Could not find PASO 2")
    exit(1)

pre_step_2 = parts_1[0][:parts_1[0].rfind("{/*")]

parts_2 = content.split("PASO 3: REVIS")
if len(parts_2) < 2:
    print("Could not find PASO 3")
    exit(1)

post_step_3 = parts_2[1]
post_step_3_full = "{/* \ud83d\udfe2 PASO 3: REVIS" + post_step_3

new_content = pre_step_2 + step2_new + "\n\n                    " + post_step_3_full

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)
print("Successfully replaced step 2")
