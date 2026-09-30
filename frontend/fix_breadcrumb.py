import re

file_path = "src/app/wireframes2/enrolamiento-coordinador/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

pattern = re.compile(r"\s*<Link href=\"/wireframes2/login\">\s*<Button variant=\"outline\".*?Volver al acceso principal.*?<\/span>\s*<\/Button>\s*<\/Link>", re.DOTALL)
content = pattern.sub("", content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Removed button")
