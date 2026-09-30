
file_path = r"src\app\wireframes2\enrolamiento-coordinador\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

target = """                          {/* Bloque de Firma Simulado */}
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
                          </div>"""

replacement = """                          {/* Bloque de Firma Simulado */}
                          <div className="pt-4 border-t border-border/70 grid grid-cols-1 sm:grid-cols-2 gap-6 text-center text-xs">
                            <Card variant="featured" disableHover className="bg-transparent border border-dashed border-border shadow-none hover:shadow-none p-0 overflow-hidden" innerClassName="p-5 items-center text-center justify-center gap-2 w-full">
                              <CardDecorativeIcon>
                                <Building2 className="size-24 text-muted-foreground/30 -mb-4 -mr-4" />
                              </CardDecorativeIcon>
                              <div className="h-10 flex items-center justify-center text-muted-foreground italic text-[11px] relative z-10">
                                [Firma Electrónica Representante Legal]
                              </div>
                              <div className="border-t border-border pt-3 w-full mt-1 relative z-10">
                                <span className="font-bold text-foreground block text-[11px]">
                                  {formData.representanteLegalNombre}
                                </span>
                                <span className="text-[10px] text-muted-foreground block mt-0.5">
                                  Representante Legal / Delegado
                                </span>
                              </div>
                            </Card>

                            <Card variant="featured" disableHover className="bg-primary/5 border border-dashed border-primary/40 shadow-none hover:shadow-none p-0 overflow-hidden" innerClassName="p-5 items-center text-center justify-center gap-2 w-full">
                              <CardDecorativeIcon>
                                <FileSignature className="size-24 text-primary/20 -mb-4 -mr-4" />
                              </CardDecorativeIcon>
                              <div className="h-10 flex items-center justify-center text-primary font-semibold text-[11px] relative z-10">
                                Pendiente FirmaEC (Paso 4)
                              </div>
                              <div className="border-t border-primary/20 pt-3 w-full mt-1 relative z-10">
                                <span className="font-bold text-primary block text-[11px]">
                                  {formData.funcionarioNombre}
                                </span>
                                <span className="text-[10px] text-primary/70 block mt-0.5">
                                  Coordinador Designado ({formData.rolAsignado})
                                </span>
                              </div>
                            </Card>
                          </div>"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced!")
else:
    print("Not found.")
with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

