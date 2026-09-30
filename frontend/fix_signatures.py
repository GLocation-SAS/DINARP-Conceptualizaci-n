import re

file_path = "src/app/wireframes2/enrolamiento-coordinador/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace Signature block
old_signature = '''                            {/* Bloque de Firma Simulado */}
                            <div className="pt-4 border-t border-border/70 grid grid-cols-1 sm:grid-cols-2 gap-6 text-center text-xs">
                              <div className="p-3 rounded-xl border border-dashed border-border/80 bg-muted/10 space-y-1">
                                <div className="h-10 flex items-center justify-center text-muted-foreground italic text-[11px]">
                                  [Firma Electrónica Representante Legal]
                                </div>
                                <span className="font-bold text-foreground block text-[11px] border-t border-border pt-1">
                                  {formData.representanteLegalNombre}
                                </span>
                                <span className="text-[10px] text-muted-foreground block">
                                  Representante Legal / Delegado
                                </span>
                              </div>

                              <div className="p-3 rounded-xl border border-dashed border-primary/40 bg-primary/5 space-y-1">
                                <div className="h-10 flex items-center justify-center text-primary font-semibold text-[11px]">
                                  Pendiente FirmaEC (Paso 4)
                                </div>
                                <span className="font-bold text-foreground block text-[11px] border-t border-border pt-1">
                                  {formData.funcionarioNombre}
                                </span>
                                <span className="text-[10px] text-muted-foreground block">
                                  Coordinador Designado ({formData.rolAsignado})
                                </span>
                              </div>
                            </div>'''

new_signature = '''                            {/* Bloque de Firma Simulado en Featured Cards */}
                            <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                              <Card variant="featured" disableHover={true} className="bg-secondary/5 border border-secondary/20 shadow-none text-center p-4 relative overflow-hidden rounded-2xl">
                                <CardDecorativeIcon className="-bottom-4 -right-4 opacity-10">
                                  <FileSignature className="size-16 text-secondary-500" />
                                </CardDecorativeIcon>
                                <div className="space-y-3 relative z-10">
                                  <div className="flex flex-col items-center justify-center min-h-[60px] text-secondary-600/70 italic text-[11px]">
                                    <FileSignature className="size-6 mb-2 opacity-50" />
                                    <span>[Firma Electrónica Representante Legal]</span>
                                  </div>
                                  <div className="border-t border-secondary/30 pt-3">
                                    <span className="font-bold font-heading text-secondary-900 block text-sm">
                                      {formData.representanteLegalNombre}
                                    </span>
                                    <span className="text-[10px] text-secondary-700 block mt-0.5">
                                      Representante Legal / Delegado
                                    </span>
                                  </div>
                                </div>
                              </Card>

                              <Card variant="featured" disableHover={true} className="bg-primary/5 border border-primary/30 shadow-sm text-center p-4 relative overflow-hidden rounded-2xl ring-1 ring-primary/20">
                                <CardDecorativeIcon className="-bottom-4 -right-4 opacity-10">
                                  <ShieldCheck className="size-16 text-primary" />
                                </CardDecorativeIcon>
                                <div className="space-y-3 relative z-10">
                                  <div className="flex flex-col items-center justify-center min-h-[60px] text-primary font-semibold text-[11px]">
                                    <ShieldCheck className="size-6 mb-2" />
                                    <span>Pendiente FirmaEC (Paso 4)</span>
                                  </div>
                                  <div className="border-t border-primary/30 pt-3">
                                    <span className="font-bold font-heading text-primary block text-sm">
                                      {formData.funcionarioNombre}
                                    </span>
                                    <span className="text-[10px] text-primary-800 block mt-0.5 font-medium">
                                      Coordinador Designado ({formData.rolAsignado})
                                    </span>
                                  </div>
                                </div>
                              </Card>
                            </div>'''

# Using regex because of encoding issues in existing file (like Electrónica -> Electrnica)
pattern = re.compile(r"\{\/\*\s*Bloque de Firma Simulado\s*\*\/.*?<\/div>\s*<\/div>\s*<\/div>", re.DOTALL)
match = pattern.search(content)

if match:
    # Need to keep the last </div> that closes the document wrapper
    content = content[:match.start()] + new_signature + "\n                          </div>" + content[match.end():]
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Replaced signatures")
else:
    print("Could not find signatures block")

