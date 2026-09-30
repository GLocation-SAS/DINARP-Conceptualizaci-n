import re

file_path = "src/app/wireframes2/enrolamiento-coordinador/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix Header Inner
old_header = '<div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">'
new_header = '<div className="w-full max-w-[1920px] mx-auto px-3 sm:px-5 lg:px-6 h-20 flex items-center justify-between gap-4">'
content = content.replace(old_header, new_header)

# Fix Main wrapper
old_main = '<main className="flex-1 w-full pb-8">\n        <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">'
new_main = '<main className="flex-1 w-full max-w-[1920px] mx-auto px-2 sm:px-4 lg:px-5 py-4 sm:py-6">'
content = content.replace(old_main, new_main)

# The end of main has </div>\n      </main> because we added it before. We should remove the extra </div>.
pattern = re.compile(r"<\/div>\s*<\/main>")
content = pattern.sub(r"</main>", content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated paddings to match registro-institucion")
