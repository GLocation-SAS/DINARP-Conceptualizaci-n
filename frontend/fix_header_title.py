import re

file_path = "src/app/wireframes2/enrolamiento-coordinador/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# I will replace the text in the Featured Card heading.
old_block = '''            <Card
              variant="featured"
              disableHover={true}
              className="bg-primary-100/30 dark:bg-primary-900/20 border-0 shadow-none hover:shadow-none hover:translate-y-0 mb-3 relative overflow-hidden"
            >
              <CardBadge className="bg-primary/20 text-primary text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 border-0">
                FORMULARIO OFICIAL ARP-R02
              </CardBadge>

              <CardTitle className="text-lg sm:text-xl font-bold font-heading text-primary">
                Activación de Coordinador SINARP — Anexo B
              </CardTitle>

              <CardDescription className="text-xs text-primary-800/80 dark:text-primary-200/80 font-medium">
                Proceso B — Enrolamiento y Acuerdo de Uso y Confidencialidad para Coordinadores Prerregistrados
              </CardDescription>

              <CardDecorativeIcon className="-bottom-10 -right-10 opacity-20 group-hover/card:scale-100">
                <ShieldCheck className="size-32 text-primary" />
              </CardDecorativeIcon>
            </Card>'''

new_block = '''            <Card
              variant="featured"
              disableHover={true}
              className="bg-primary-100/30 dark:bg-primary-900/20 border-0 shadow-none hover:shadow-none hover:translate-y-0 mb-3 relative overflow-hidden"
            >
              <CardBadge className="bg-primary/20 text-primary text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 border-0">
                FORMULARIO ARP-R02
              </CardBadge>

              <CardTitle className="text-lg sm:text-xl font-bold font-heading text-primary">
                Anexo B — Acuerdo de Uso y Confidencialidad
              </CardTitle>

              <CardDescription className="text-xs text-primary-800/80 dark:text-primary-200/80 font-medium">
                Suscripción digital para el enrolamiento del Coordinador SINARP.
              </CardDescription>

              <CardDecorativeIcon className="-bottom-10 -right-10 opacity-20 group-hover/card:scale-100">
                <ShieldCheck className="size-32 text-primary" />
              </CardDecorativeIcon>
            </Card>'''

# Using regex because of possible encoding mismatches (em dashes and encoding artifacts)
# <CardBadge className="bg-primary/20 text-primary text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 border-0">
#   FORMULARIO OFICIAL ARP-R02
# </CardBadge>
# <CardTitle className="text-lg sm:text-xl font-bold font-heading text-primary">
#   Activación de Coordinador SINARP — Anexo B
# </CardTitle>
# <CardDescription className="text-xs text-primary-800/80 dark:text-primary-200/80 font-medium">
#   Proceso B — Enrolamiento y Acuerdo de Uso y Confidencialidad para Coordinadores Prerregistrados
# </CardDescription>

pattern = re.compile(r"<CardBadge className=\"bg-primary\/20 text-primary text-\[10px\] uppercase font-bold tracking-wider px-2\.5 py-0\.5 border-0\">\s*FORMULARIO OFICIAL ARP-R02\s*<\/CardBadge>.*?<CardTitle className=\"text-lg sm:text-xl font-bold font-heading text-primary\">\s*Activaci.*?n de Coordinador SINARP.*?Anexo B\s*<\/CardTitle>.*?<CardDescription className=\"text-xs text-primary-800\/80 dark:text-primary-200\/80 font-medium\">\s*Proceso B.*?Enrolamiento y Acuerdo de Uso y Confidencialidad para Coordinadores Prerregistrados\s*<\/CardDescription>", re.DOTALL)

match = pattern.search(content)
if match:
    replacement = """<CardBadge className="bg-primary/20 text-primary text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 border-0">
                FORMULARIO ARP-R02
              </CardBadge>

              <CardTitle className="text-lg sm:text-xl font-bold font-heading text-primary">
                Anexo B — Acuerdo de Uso y Confidencialidad
              </CardTitle>

              <CardDescription className="text-xs text-primary-800/80 dark:text-primary-200/80 font-medium">
                Suscripción digital para el enrolamiento del Coordinador SINARP.
              </CardDescription>"""
    content = content[:match.start()] + replacement + content[match.end():]
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Replaced Header Text")
else:
    print("Not found")

