import re

file_path = "src/app/wireframes2/enrolamiento-coordinador/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# I will replace the first breadcrumb block which currently is:
#                 <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
#                    <Link href="/wireframes2/login" className="hover:text-foreground transition-colors flex items-center gap-1 shrink-0">
#                      <Home className="size-3.5" />
#                      <span>Portal de Acceso</span>
#                    </Link>
#                    <span>/</span>
#                    <span className="text-foreground font-semibold truncate">Activación de Coordinador SINARP</span>
#                  </nav>

old_breadcrumb = '''                <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
                  <Link href="/wireframes2/login" className="hover:text-foreground transition-colors flex items-center gap-1 shrink-0">
                    <Home className="size-3.5" />
                    <span>Portal de Acceso</span>
                  </Link>
                  <span>/</span>
                  <span className="text-foreground font-semibold truncate">Activación de Coordinador SINARP</span>
                </nav>'''

# Make the step names map based on current step index
# Paso 1: Datos del Coordinador
# Paso 2: Acuerdo de Uso
# Paso 3: Revisión
# Paso 4: Firma

new_breadcrumb = '''                <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
                  <Link href="/wireframes2/login" className="hover:text-foreground transition-colors flex items-center gap-1 shrink-0">
                    <Home className="size-3.5" />
                    <span>Portal de Acceso</span>
                  </Link>
                  <span>/</span>
                  <span>Prerregistro Coordinador</span>
                  <span>/</span>
                  <span className="text-foreground font-semibold truncate">Anexo B {formData.funcionarioNombre ?  -  : ""}</span>
                  {preregistroCargado && !existingSolicitud && (
                    <>
                      <span>/</span>
                      <span className="text-foreground font-semibold truncate text-secondary-600 dark:text-secondary-400">
                        {step === 1 ? "Paso 1: Datos del Coordinador" :
                         step === 2 ? "Paso 2: Acuerdo de Uso y Confidencialidad" :
                         step === 3 ? "Paso 3: Revisión" :
                         step === 4 ? "Paso 4: Firma y Envío" : ""}
                      </span>
                    </>
                  )}
                </nav>'''

# Using regex because of possible encoding mismatches in the old text:
pattern = re.compile(r"<nav aria-label=\"Breadcrumb\".*?<\/nav>", re.DOTALL)
matches = list(pattern.finditer(content))
if matches:
    # We want to replace the FIRST match which belongs to the Coordinator view
    first_match = matches[0]
    content = content[:first_match.start()] + new_breadcrumb + content[first_match.end():]
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Replaced breadcrumb")
else:
    print("Not found")

