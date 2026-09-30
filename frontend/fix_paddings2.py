import re

file_path = "src/app/wireframes2/enrolamiento-coordinador/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix Header Inner
pattern_header = re.compile(r"<div className=\"w-full max-w-\[1920px\] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4\">")
content = pattern_header.sub(r'<div className="w-full max-w-[1920px] mx-auto px-3 sm:px-5 lg:px-6 h-20 flex items-center justify-between gap-4">', content)

# Fix Main wrapper
pattern_main = re.compile(r"<main className=\"flex-1 w-full pb-8\">\s*<div className=\"w-full max-w-\[1920px\] mx-auto px-4 sm:px-6 lg:px-8 py-8\">")
content = pattern_main.sub(r'<main className="flex-1 w-full max-w-[1920px] mx-auto px-2 sm:px-4 lg:px-5 py-4 sm:py-6">', content)

# Fix </div></main>
pattern_end = re.compile(r"<\/div>\s*<\/main>")
content = pattern_end.sub(r"</main>", content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated paddings using regex")
