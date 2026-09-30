import re

file_path = "src/app/wireframes2/enrolamiento-coordinador/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Fix the top right badges in the breadcrumb area
old_badges = '''              <Badge tone="neutral" appearance="soft" size="sm" className="border border-border">
                Rol: Coordinador SINARP
              </Badge>'''

new_badges = '''              <div className="flex items-center gap-2">
                <Badge tone="neutral" appearance="soft" size="sm" className="border border-border">
                  Rol: Coordinador SINARP
                </Badge>
                {preregistroCargado && !existingSolicitud && !isSubmittedSuccess && (
                  <>
                    <Badge tone="neutral" appearance="soft" size="sm" className="border border-border">
                      N.º Trámite: Borrador
                    </Badge>
                    <Badge tone="warning" appearance="soft" size="sm" className="border border-warning/40">
                      Estado: Borrador
                    </Badge>
                  </>
                )}
              </div>'''

content = content.replace(old_badges, new_badges)

# 2. Remove the big "Resumen del contexto" card precisely
pattern_card = re.compile(r"\{\/\*\s*Resumen del contexto del tr.*?mite\s*\*\/.*?\}\)\}\s*<\/div>", re.DOTALL)
# Actually, the block is:
#                {/* Resumen del contexto del trmite */}
#                <div className="bg-surface border border-border rounded-2xl p-4 sm:p-6 flex flex-col md:flex-row sm:items-center justify-between gap-4 shadow-xs">
#                ...
#                </div>
# I will use a precise split/replace.

content_parts = content.split('''{/* Resumen del contexto del''')
if len(content_parts) > 1:
    second_part = content_parts[1]
    # find the end of the div
    end_div_idx = second_part.find('''{/* Stepper Oficial UI Kit */}''')
    if end_div_idx != -1:
        content = content_parts[0] + second_part[end_div_idx:]
        print("Removed card")

# 3. Fix floating toolbar position (from centered to bottom right)
old_toolbar_class = '''className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300"'''
new_toolbar_class = '''className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 transition-all duration-300"'''
content = content.replace(old_toolbar_class, new_toolbar_class)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

