import re

file_path = "src/app/wireframes2/enrolamiento-coordinador/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Step 1
pattern_p1 = re.compile(r"<div className=\"border-b border-border/70 pb-3 flex items-center justify-between flex-wrap gap-2\">\s*<div>\s*<h3 className=\"text-base font-bold font-heading text-foreground flex items-center gap-2\">\s*<UserCheck className=\"size-5 text-primary\" \/>\s*Paso 1 - Datos del Coordinador Prerregistrado\s*<\/h3>\s*<p className=\"text-xs text-muted-foreground mt-0\.5\">\s*La informaci.*?n institucional y personal ha sido precargada desde el Anexo A de la entidad\.\s*<\/p>\s*<\/div>\s*<Badge tone=\"primary\" appearance=\"soft\" size=\"sm\">\s*Prerregistro v.*?lido\s*<\/Badge>\s*<\/div>", re.DOTALL)
match1 = pattern_p1.search(content)
if match1:
    new_p1 = """<div className="bg-secondary/10 dark:bg-secondary/20 border-b border-secondary/40 p-4 sm:p-5 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 rounded-t-2xl rounded-b-none flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div>
                          <h3 className="text-base font-bold font-heading text-secondary-900 dark:text-secondary-100 flex items-center gap-2">
                            <UserCheck className="size-5 text-secondary-700 dark:text-secondary-300" />
                            Paso 1.1 - Datos del Coordinador Prerregistrado
                          </h3>
                          <p className="text-xs text-secondary-800/80 dark:text-secondary-200/80 mt-0.5">
                            La información institucional y personal ha sido precargada desde el Anexo A de la entidad.
                          </p>
                        </div>
                        <Badge tone="primary" appearance="solid" size="sm" className="bg-secondary text-secondary-foreground border-secondary hover:bg-secondary">
                          Prerregistro válido
                        </Badge>
                      </div>"""
    content = content[:match1.start()] + new_p1 + content[match1.end():]
    print("Replaced P1")

# Block 1
pattern_p2_1 = re.compile(r"<div className=\"border-b border-border/70 pb-3\">\s*<h3 className=\"text-base font-bold font-heading text-foreground flex items-center gap-2\">\s*<Building2 className=\"size-5 text-primary\" \/>\s*Cl.*?usula Primera.*?<\/h3>\s*<p className=\"text-xs text-muted-foreground mt-0\.5\">\s*Suscripci.*?<\/p>\s*<\/div>", re.DOTALL)
match2_1 = pattern_p2_1.search(content)
if match2_1:
    new_p2_1 = """<div className="bg-secondary/10 dark:bg-secondary/20 border-b border-secondary/40 p-4 sm:p-5 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 rounded-t-2xl rounded-b-none flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                            <div>
                              <h3 className="text-base font-bold font-heading text-secondary-900 dark:text-secondary-100 flex items-center gap-2">
                                <Building2 className="size-5 text-secondary-700 dark:text-secondary-300" />
                                Paso 2.1 - Intervinientes y Comparecientes
                              </h3>
                              <p className="text-xs text-secondary-800/80 dark:text-secondary-200/80 mt-0.5">
                                Suscripción del Acuerdo ARP-R02 entre la DINARP y la institución solicitante.
                              </p>
                            </div>
                          </div>"""
    content = content[:match2_1.start()] + new_p2_1 + content[match2_1.end():]
    print("Replaced P2.1")

# Block 2
pattern_p2_2 = re.compile(r"<div className=\"border-b border-border/70 pb-3\">\s*<h3 className=\"text-base font-bold font-heading text-foreground\">\s*Cl.*?usula Segunda.*?<\/h3>\s*<p className=\"text-xs text-muted-foreground mt-0\.5\">\s*Justificaci.*?<\/p>\s*<\/div>", re.DOTALL)
match2_2 = pattern_p2_2.search(content)
if match2_2:
    new_p2_2 = """<div className="bg-secondary/10 dark:bg-secondary/20 border-b border-secondary/40 p-4 sm:p-5 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 rounded-t-2xl rounded-b-none flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                            <div>
                              <h3 className="text-base font-bold font-heading text-secondary-900 dark:text-secondary-100 flex items-center gap-2">
                                <FileText className="size-5 text-secondary-700 dark:text-secondary-300" />
                                Paso 2.2 - Antecedentes (Misión y Visión Institucional)
                              </h3>
                              <p className="text-xs text-secondary-800/80 dark:text-secondary-200/80 mt-0.5">
                                Justificación formal de la necesidad de uso de los datos del SINARP.
                              </p>
                            </div>
                          </div>"""
    content = content[:match2_2.start()] + new_p2_2 + content[match2_2.end():]
    print("Replaced P2.2")
    
# Block 3
pattern_p2_3 = re.compile(r"<div className=\"border-b border-border/70 pb-3\">\s*<h3 className=\"text-base font-bold font-heading text-foreground\">\s*Cl.*?usula Tercera a S.*?ptima.*?<\/h3>\s*<p className=\"text-xs text-muted-foreground mt-0\.5\">\s*Cumplimiento de la CRE.*?<\/p>\s*<\/div>", re.DOTALL)
match2_3 = pattern_p2_3.search(content)
if match2_3:
    new_p2_3 = """<div className="bg-secondary/10 dark:bg-secondary/20 border-b border-secondary/40 p-4 sm:p-5 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 rounded-t-2xl rounded-b-none flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                            <div>
                              <h3 className="text-base font-bold font-heading text-secondary-900 dark:text-secondary-100 flex items-center gap-2">
                                <ShieldCheck className="size-5 text-secondary-700 dark:text-secondary-300" />
                                Paso 2.3 - Base Legal, Confidencialidad y Custodia
                              </h3>
                              <p className="text-xs text-secondary-800/80 dark:text-secondary-200/80 mt-0.5">
                                Cumplimiento de la CRE (Art. 66 num. 19), Ley SINARP (Arts. 4, 27, 28, 29) y Ley de Protección de Datos Personales.
                              </p>
                            </div>
                          </div>"""
    content = content[:match2_3.start()] + new_p2_3 + content[match2_3.end():]
    print("Replaced P2.3")
    
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
pattern_p3 = re.compile(r"<div className=\"border-b border-border/70 pb-3\">\s*<h3 className=\"text-base font-bold font-heading text-foreground flex items-center gap-2\">\s*<FileCheck2 className=\"size-5 text-primary\" \/>\s*Revisa tu informaci.*?n\s*<\/h3>\s*<p className=\"text-xs text-muted-foreground mt-0\.5\">\s*Verifica que los datos precargados.*?<\/p>\s*<\/div>", re.DOTALL)
match3 = pattern_p3.search(content)
if match3:
    new_p3 = """<div className="bg-secondary/10 dark:bg-secondary/20 border-b border-secondary/40 p-4 sm:p-5 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 rounded-t-2xl rounded-b-none flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                          <div>
                            <h3 className="text-base font-bold font-heading text-secondary-900 dark:text-secondary-100 flex items-center gap-2">
                              <FileCheck2 className="size-5 text-secondary-700 dark:text-secondary-300" />
                              Paso 3.1 - Revisión de la información
                            </h3>
                            <p className="text-xs text-secondary-800/80 dark:text-secondary-200/80 mt-0.5">
                              Verifica que los datos precargados y registrados sean correctos antes de generar el Anexo B.
                            </p>
                          </div>
                        </div>"""
    content = content[:match3.start()] + new_p3 + content[match3.end():]
    print("Replaced P3")
    
with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
