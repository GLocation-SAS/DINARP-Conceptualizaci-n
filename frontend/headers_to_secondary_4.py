import re

file_path = "src/app/wireframes2/enrolamiento-coordinador/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Block 4
pattern_p2_4 = re.compile(r"<div className=\"border-b border-border/70 pb-3\">\s*<h3 className=\"text-base font-bold font-heading text-foreground flex items-center gap-2\">\s*<KeyRound className=\"size-5 text-primary\" \/>\s*Configuraci.*?<\/h3>\s*<p className=\"text-xs text-muted-foreground mt-0\.5\">\s*Establece la contrase.*?<\/p>\s*<\/div>", re.DOTALL)
match2_4 = pattern_p2_4.search(content)
if match2_4:
    new_p2_4 = """<div className="bg-secondary/10 dark:bg-secondary/20 border-b border-secondary/40 p-4 sm:p-5 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 rounded-t-2xl rounded-b-none flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                            <div>
                              <h3 className="text-base font-bold font-heading text-secondary-900 dark:text-secondary-100 flex items-center gap-2">
                                <KeyRound className="size-5 text-secondary-700 dark:text-secondary-300" />
                                Paso 2.4 - Configuración de Credenciales de Acceso
                              </h3>
                              <p className="text-xs text-secondary-800/80 dark:text-secondary-200/80 mt-0.5">
                                Establece la contraseña que usarás para ingresar a la plataforma.
                              </p>
                            </div>
                          </div>"""
    content = content[:match2_4.start()] + new_p2_4 + content[match2_4.end():]
    print("Replaced P2.4")

# Step 3
pattern_p3 = re.compile(r"<div className=\"border-b border-border/70 pb-3\">\s*<h3 className=\"text-base font-bold font-heading text-foreground flex items-center gap-2\">\s*<FileCheck2 className=\"size-5 text-primary\" \/>\s*Revisa tu informaci.*?<\/h3>\s*<p className=\"text-xs text-muted-foreground mt-0\.5\">\s*Verifica que los datos del coordinador.*?<\/p>\s*<\/div>", re.DOTALL)
match3 = pattern_p3.search(content)
if match3:
    new_p3 = """<div className="bg-secondary/10 dark:bg-secondary/20 border-b border-secondary/40 p-4 sm:p-5 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 rounded-t-2xl rounded-b-none flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                          <div>
                            <h3 className="text-base font-bold font-heading text-secondary-900 dark:text-secondary-100 flex items-center gap-2">
                              <FileCheck2 className="size-5 text-secondary-700 dark:text-secondary-300" />
                              Paso 3.1 - Revisión de la información
                            </h3>
                            <p className="text-xs text-secondary-800/80 dark:text-secondary-200/80 mt-0.5">
                              Verifica que los datos del coordinador y las cláusulas del Anexo B sean correctos antes de proceder a la firma electrónica.
                            </p>
                          </div>
                        </div>"""
    content = content[:match3.start()] + new_p3 + content[match3.end():]
    print("Replaced P3")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
