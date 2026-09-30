import re

file_path = "frontend/src/app/wireframes2/enrolamiento-coordinador/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

match = re.search(r"\{\s*\/\*.*?PASO 2.*?\*\/\s*\}", content)
if not match:
    print('Could not find PASO 2 comment!')
    exit(1)

comment_start = match.start()

start_idx = content.find('{step === 2 && (', comment_start)
if start_idx == -1:
    print('Could not find {step === 2 && (')
    exit(1)

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

with open('frontend/step2_template.tsx', 'r', encoding='utf-8') as f:
    step2_new = f.read()

new_content = content[:comment_start] + step2_new + content[end_brace_idx+1:]

with open(file_path, "w", encoding="utf-8") as f:
    f.write(new_content)
print('Done!')
