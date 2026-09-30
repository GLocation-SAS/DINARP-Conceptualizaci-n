import re

file_path = "src/app/wireframes2/enrolamiento-coordinador/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Remove the floating toolbar from the end of the file
pattern_toolbar = re.compile(r"\s*\{\/\*\s*Floating Demo Toolbar\s*\*\/.*?\n\s*<\/div>\n", re.DOTALL)
match_toolbar = pattern_toolbar.search(content)

if match_toolbar:
    toolbar_code = match_toolbar.group(0)
    content = content[:match_toolbar.start()] + content[match_toolbar.end():]
    
    # 2. Insert it before the return of EnrolamientoContent
    # The return is at     </div>\n  );\n}\n\nexport default function
    target = "    </div>\n  );\n}\n\nexport default function EnrolamientoCoordinadorPage"
    replacement = toolbar_code + "\n" + target
    
    content = content.replace(target, replacement)
    print("Moved toolbar")
else:
    print("Could not find toolbar")


with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

