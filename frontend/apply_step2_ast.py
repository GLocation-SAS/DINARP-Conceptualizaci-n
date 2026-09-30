import re

file_path = "frontend/src/app/wireframes2/enrolamiento-coordinador/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Find the PASO 2 comment
comment_start = content.find('{/* \ud83d\udfe2 PASO 2')
if comment_start == -1:
    comment_start = content.find('{/*') # fallback? No
    match = re.search(r"\{\/\*.*?PASO 2.*?\*\/\}", content)
    if match:
        comment_start = match.start()

start_idx = content.find('{step === 2 && (', comment_start)
paren_idx = content.find('(', start_idx)

count = 1
i = paren_idx + 1
while count > 0 and i < len(content):
    if content[i] == '(':
        count += 1
    elif content[i] == ')':
        count -= 1
    i += 1

end_brace_idx = content.find('}', i)

# Now we replace from comment_start to end_brace_idx + 1
with open('frontend/step2_template.tsx', 'r', encoding='utf-8') as f:
    step2_new = f.read()

new_content = content[:comment_start] + step2_new + content[end_brace_idx+1:]

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)
print('Done!')
