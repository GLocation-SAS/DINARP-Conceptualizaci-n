import re

file_path = "src/app/wireframes2/enrolamiento-coordinador/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# I will add a floating toolbar similar to the one in registro-institucion.
# First, I need to add state for it.
if "const [showDemoToolbar, setShowDemoToolbar] = useState(true);" not in content:
    content = content.replace(
        "const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);",
        "const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);\n  const [showDemoToolbar, setShowDemoToolbar] = useState(true);"
    )

# Then, I need to remove the inline buttons and add the floating ones.
# The inline buttons are inside the "Acciones de acceso rǭpido para pruebas / demostracin" div.
inline_actions_start = content.find("Acciones de acceso")
if inline_actions_start != -1:
    div_start = content.rfind("{/*", 0, inline_actions_start)
    if div_start != -1:
        # Find end of this block
        end_str = "</form>"
        div_end = content.find(end_str, div_start)
        if div_end != -1:
            # We want to keep the form, but remove the inline demo buttons that are after it.
            # wait, the form closes first!
            pass

# Let's use regex to remove the inline demo block
# {/* Acciones de acceso rǭpido para pruebas / demostracin */} ... </div> ...
pattern_inline = re.compile(r"\{\/\*\s*Acciones de acceso rǭpido para pruebas.*?<\/div>\s*<\/div>\s*<\/div>", re.DOTALL)
content = pattern_inline.sub("", content)

# Now, add the floating toolbar at the end of the page (before the closing </Suspense>)
floating_toolbar = """
          {/* Floating Demo Toolbar */}
          <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 transition-all duration-300">
            {showDemoToolbar ? (
              <div className="flex flex-col gap-2 bg-surface/95 backdrop-blur-md p-2 rounded-2xl border border-border shadow-xl w-[280px] animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="flex items-center justify-between px-2 pb-1 border-b border-border/50">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Opciones de Simulación</span>
                  <Button type="button" variant="ghost" size="icon" onClick={() => setShowDemoToolbar(false)} className="size-6 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground" title="Minimizar">
                    <ChevronDown className="size-3" />
                  </Button>
                </div>
                
                {!preregistroCargado && (
                  <div className="space-y-1.5">
                    <Button type="button" variant="outline" size="sm" onClick={() => { setCedulaInput("1715489621"); ejecutarValidacionCedula("1715489621"); }} className="w-full text-xs justify-start h-8">
                      <UserCheck className="size-3.5 mr-2 text-primary" /> Titular Habilitado
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => { setCedulaInput("1712345602"); ejecutarValidacionCedula("1712345602"); }} className="w-full text-xs justify-start h-8">
                      <UserCheck className="size-3.5 mr-2 text-primary" /> Suplente Habilitado
                    </Button>
                  </div>
                )}

                {preregistroCargado && !isSubmittedSuccess && step > 1 && (
                  <Button type="button" variant="outline" size="sm" onClick={handleSimulateFillAnexoB} className="w-full text-xs justify-start h-8 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20">
                    <Sparkles className="size-3.5 mr-2" /> Autocompletar Anexo B
                  </Button>
                )}

                {step === 4 && !isSigned && (
                  <Button type="button" variant="success" size="sm" onClick={handleFirmaElectronica} className="w-full text-xs justify-start h-8">
                    <ShieldCheck className="size-3.5 mr-2" /> Simular Firma Válida
                  </Button>
                )}
                
                <Button type="button" variant="outline" size="sm" onClick={handleIniciarNuevaSolicitud} className="w-full text-xs justify-start h-8">
                  <ArrowLeft className="size-3.5 mr-2" /> Reiniciar Flujo
                </Button>
              </div>
            ) : (
              <Button type="button" variant="outline" size="sm" onClick={() => setShowDemoToolbar(true)} className="rounded-full px-3.5 py-1.5 shadow-lg flex items-center gap-2 text-xs bg-surface/95 backdrop-blur-md border border-border hover:bg-muted transition-all animate-in fade-in slide-in-from-bottom-2 duration-200" title="Desplegar opciones">
                <Sparkles className="size-3.5 text-primary" />
                <span className="font-semibold text-foreground">Casos de Uso</span>
                <ChevronUp className="size-3.5 text-muted-foreground" />
              </Button>
            )}
          </div>
"""

# Insert before </Suspense>
content = content.replace("</Suspense>", floating_toolbar + "\n      </Suspense>")

# Ensure we import the icons if we need to. They are probably imported. ChevronUp and ChevronDown are needed.
if "ChevronUp" not in content:
    content = content.replace("ChevronDown,", "ChevronDown, ChevronUp,")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Added floating toolbar")
