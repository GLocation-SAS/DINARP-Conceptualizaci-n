import re

file_path = "src/app/wireframes2/enrolamiento-coordinador/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8"> with <main className="flex-1 w-full pb-8"><div className="layout-container py-8">
old_main = '<main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">'
new_main = '<main className="flex-1 w-full pb-8">\n        <div className="layout-container py-8">'

content = content.replace(old_main, new_main)

# Find the matching closing main tag and insert the closing div.
# We will just replace </main> with </div></main>
content = content.replace('</main>', '</div>\n      </main>')

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Added layout container")

