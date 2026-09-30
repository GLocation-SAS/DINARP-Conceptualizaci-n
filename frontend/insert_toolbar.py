import re

file_path = "src/app/wireframes2/enrolamiento-coordinador/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

toolbar_code = """
        {/* ── TOOLBAR FLOTANTE (CASOS DE USO) ── */}
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300">
          {showDemoToolbar ? (
            <div className="bg-surface/95 backdrop-blur-md border border-border shadow-2xl rounded-full p-1.5 sm:p-2 flex items-center gap-1.5 sm:gap-2 animate-in slide-in-from-bottom-5 fade-in duration-200">
              
              {!preregistroCargado ? (
                <>
                  <div className="flex items-center px-3 sm:px-4 border-r border-border">
                    <Sparkles className="size-3.5 text-primary mr-1.5" />
                    <span className="text-[10px] font-bold text-foreground uppercase tracking-wider">
                      Casos de prueba
                    </span>
                  </div>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="default"
                    onClick={() => {
                      setCedulaInput("1715489621");
                      ejecutarValidacionCedula("1715489621");
                    }}
                    className="rounded-full px-3 sm:px-4 text-xs h-8 sm:h-9 hover:bg-primary/5 hover:text-primary"
                  >
                    <span className="font-semibold">Titular</span>
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="default"
                    onClick={() => {
                      setCedulaInput("1712345602");
                      ejecutarValidacionCedula("1712345602");
                    }}
                    className="rounded-full px-3 sm:px-4 text-xs h-8 sm:h-9 hover:bg-primary/5 hover:text-primary"
                  >
                    <span className="font-semibold">Suplente</span>
                  </Button>
                </>
              ) : (
                <>
                  <div className="flex items-center px-3 sm:px-4 border-r border-border">
                    <span className="text-[10px] font-bold text-foreground uppercase tracking-wider">
                      Flujo
                    </span>
                  </div>
                  
                  {step < 4 && !existingSolicitud && (
                    <Button
                      type="button"
                      variant="outline"
                      size="default"
                      onClick={handleSimulateFillAnexoB}
                      className="rounded-full px-3 sm:px-4 flex items-center gap-1.5 text-xs h-8 sm:h-9 border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
                    >
                      <Sparkles className="size-3.5" />
                      <span>Llenar Anexo B</span>
                    </Button>
                  )}

                  {step === 4 && !isSigned && (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        size="default"
                        onClick={() => handleFirmaElectronica(true)}
                        className="rounded-full px-3 sm:px-4 flex items-center gap-1.5 text-xs h-8 sm:h-9 border-danger/40 text-danger hover:bg-danger/10 hover:text-danger"
                      >
                        <AlertCircle className="size-3.5" />
                        <span>Falla FirmaEC</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="default"
                        onClick={() => handleFirmaElectronica(false)}
                        className="rounded-full px-3 sm:px-4 flex items-center gap-1.5 text-xs h-8 sm:h-9 border-success/40 text-success hover:bg-success/10 hover:text-success"
                      >
                        <ShieldCheck className="size-3.5" />
                        <span>Firma Válida</span>
                      </Button>
                    </>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    size="default"
                    onClick={handleIniciarNuevaSolicitud}
                    className="rounded-full px-3 sm:px-4 flex items-center gap-1.5 text-xs h-8 sm:h-9 hover:bg-muted"
                  >
                    <ArrowLeft className="size-3.5" />
                    <span>Cambiar cédula</span>
                  </Button>
                </>
              )}

              {/* Botón para colapsar barra */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowDemoToolbar(false)}
                className="rounded-full size-8 shrink-0 hover:bg-muted text-muted-foreground hover:text-foreground ml-0.5"
                title="Ocultar casos de uso"
              >
                <ChevronDown className="size-4" />
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowDemoToolbar(true)}
              className="rounded-full px-3.5 py-1.5 shadow-lg flex items-center gap-2 text-xs bg-surface/95 backdrop-blur-md border border-border hover:bg-muted transition-all animate-in fade-in slide-in-from-bottom-2 duration-200"
              title="Desplegar casos de prueba"
            >
              <Sparkles className="size-3.5 text-primary" />
              <span className="font-semibold text-foreground">Casos de prueba</span>
              <ChevronUp className="size-3.5 text-muted-foreground" />
            </Button>
          )}
        </div>
</main>
"""

content = content.replace("      </main>", toolbar_code)
with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Toolbar inserted!")
