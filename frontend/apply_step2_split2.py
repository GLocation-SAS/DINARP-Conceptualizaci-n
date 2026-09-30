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

# Find the start of the comment block for PASO 2
start_idx = parts_1[0].rfind("{/*")
pre_step_2 = parts_1[0][:start_idx]

parts_2 = content.split("PASO 3: REVIS")
if len(parts_2) < 2:
    print("Could not find PASO 3")
    exit(1)

# Find the start of the comment block for PASO 3
start_idx_3 = parts_2[0].rfind("{/*")
# The string from start_idx_3 to the end of the file is our post_step_2
post_step_3 = content[start_idx_3:]

new_content = pre_step_2 + step2_new + "\n\n                    " + post_step_3

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)
print("Successfully replaced step 2")
