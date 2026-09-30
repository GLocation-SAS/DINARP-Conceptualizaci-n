import re

file_path = "src/app/wireframes2/enrolamiento-coordinador/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

pattern = re.compile(
    r"\{\/\*\s*Selector de Rol Simulado\s*\*\/.*?<WireframeRoleSelector[^>]*>.*?<ThemeToggle\s*\/>.*?<WireframeUserMenu[^>]*>",
    re.DOTALL
)

content = pattern.sub("<ThemeToggle />", content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Removed role selector from header")
