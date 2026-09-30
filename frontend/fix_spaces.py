import re

file_path = "src/app/wireframes2/enrolamiento-coordinador/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix Header max-width
content = content.replace(
    '<div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">',
    '<div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">'
)

# Fix Main Layout Container
content = content.replace(
    '<div className="layout-container py-8">',
    '<div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">'
)

# Fix Document Preview max-width to max-w-5xl instead of max-w-3xl so it's wider
content = content.replace(
    'max-w-3xl mx-auto border-t-4',
    'max-w-5xl mx-auto border-t-4'
)

# Fix Step 1 Search Box width
content = content.replace(
    'bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs max-w-2xl mx-auto',
    'bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs max-w-4xl mx-auto'
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Expanded widths to 1920px")
