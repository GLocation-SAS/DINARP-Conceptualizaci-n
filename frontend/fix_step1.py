import re

file_path = "src/app/wireframes2/enrolamiento-coordinador/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

pattern = re.compile(r"<form\s*onSubmit=\{.*?\}\s*className=\"space-y-4 pt-2\"\s*>\s*<FormField label=\"N.mero de c.dula.*?<\/form>", re.DOTALL)
match = pattern.search(content)
if match:
    new_form = """<form
                    onSubmit={(e) => {
                      e.preventDefault();
                      ejecutarValidacionCedula(cedulaInput);
                    }}
                    className="space-y-6 pt-2"
                  >
                    <FormField label="Cédula" htmlFor="cedula-input" required>
                      <input
                        id="cedula-input"
                        type="text"
                        maxLength={10}
                        placeholder="Ingresa tu cédula de 10 dígitos"
                        value={cedulaInput}
                        onChange={(e) => {
                          setCedulaInput(e.target.value.replace(/\D/g, ""));
                          setValidationError(null);
                        }}
                        className={cn("flex h-11 w-full rounded-full border border-input bg-background px-4 py-2 text-sm font-mono tracking-wider transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 shadow-xs", validationError && "border-danger focus-visible:ring-danger")}
                        autoFocus
                        required
                      />
                    </FormField>

                    {/* ESCENARIO DE ERROR: NO HABILITADO */}
                    {validationError && (
                      <div className="p-4 bg-danger/10 border border-danger/30 rounded-2xl space-y-3 animate-in fade-in duration-200">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="size-5 text-danger shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-danger uppercase tracking-wider">
                              Validación no aprobada
                            </h4>
                            <p className="text-xs text-foreground/90 font-medium leading-relaxed">
                              {validationError}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              Asegúrate de que la institución haya completado el trámite de prerregistro (Anexo A) y que hayas sido designado formalmente.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                      <Link href="/wireframes2/login" className="w-full sm:w-auto">
                        <Button
                          type="button"
                          variant="secondary"
                          className="rounded-full px-5 h-11 text-xs font-semibold gap-2 shadow-xs w-full sm:w-auto"
                        >
                          <ArrowLeft className="size-4" />
                          <span>Volver al acceso principal</span>
                        </Button>
                      </Link>

                      <Button
                        type="submit"
                        variant="primary"
                        disabled={isSearching || cedulaInput.length !== 10}
                        className="rounded-full px-5 h-11 text-xs font-bold gap-2 shadow-xs w-full sm:w-auto"
                      >
                        {isSearching ? (
                          <>
                            <LoadingSpinner size="sm" className="size-4" />
                            <span>Validando...</span>
                          </>
                        ) : (
                          <>
                            <Search className="size-4" />
                            <span>Validar invitación</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </form>"""
    content = content[:match.start()] + new_form + content[match.end():]
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Fixed step 1!")
else:
    print("Could not find step 1 form")
