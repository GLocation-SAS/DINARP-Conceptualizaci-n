import os
import re

file_path = r"src\app\wireframes2\enrolamiento-coordinador\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Step 1 (Validation form) changes
pattern_step1 = re.compile(r"            \{\/\* Encabezado del Trámite en Card Featured \*\/.*?<\/form>\s*<\/div>\s*<\/div>\s*\)\}", re.DOTALL)
match_step1 = pattern_step1.search(content)

if match_step1:
    new_step1 = """            {/* Encabezado del Trámite en Card Featured */}
            <Card
              variant="featured"
              disableHover={true}
              className="bg-secondary-50/50 dark:bg-secondary-900/20 border-0 shadow-none hover:shadow-none hover:translate-y-0 mb-3 relative overflow-hidden"
            >
              <CardBadge className="bg-primary text-primary-foreground text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 border-0">
                FORMULARIO ARP-R02
              </CardBadge>

              <CardTitle className="text-lg sm:text-xl font-bold font-heading text-secondary-900 dark:text-secondary-100">
                Anexo B — Acuerdo de Uso y Confidencialidad
              </CardTitle>

              <CardDescription className="text-xs text-secondary-800/80 dark:text-secondary-200/80 font-medium">
                Suscripción digital para el enrolamiento del Coordinador SINARP.
              </CardDescription>

              <CardDecorativeIcon className="-bottom-10 -right-10 opacity-20 group-hover/card:scale-100">
                <ShieldCheck className="size-32 text-secondary-500" />
              </CardDecorativeIcon>
            </Card>

            <Separator className="my-4" />

            {/*  PANTALLA 1: VALIDACIÓN DEL COORDINADOR (SI NO SE HA CARGADO O NO EXISTE SOLICITUD)  */}
            {!preregistroCargado && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs max-w-2xl mx-auto">
                  <div className="space-y-2 text-center sm:text-left">
                    <h1 className="text-xl sm:text-2xl font-bold font-heading text-foreground flex items-center justify-center sm:justify-start gap-3">
                      <UserCheck className="size-6 text-primary" />
                      Validación de la Invitación de Coordinador
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Ingresa tu número de cédula para consultar y verificar la invitación vigente de Anexo B asociada a tu institución.
                    </p>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      ejecutarValidacionCedula(cedulaInput);
                    }}
                    className="space-y-6 pt-2"
                  >
                    <FormField label="Cédula" htmlFor="cedula-input" required>
                      <Input
                        id="cedula-input"
                        type="text"
                        maxLength={10}
                        placeholder="Ingresa tu cédula de 10 dígitos"
                        value={cedulaInput}
                        onChange={(e) => {
                          setCedulaInput(e.target.value.replace(/\D/g, ""));
                          setValidationError(null);
                        }}
                        className={cn("text-sm font-mono tracking-wider h-11 rounded-full", validationError && "border-danger focus-visible:ring-danger")}
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

                    <div className="pt-8 border-t border-border/60 flex flex-col gap-2 mt-4">
                      <p className="text-[11px] text-muted-foreground font-semibold text-center mb-1">Casos de prueba para validación:</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCedulaInput("1715489621");
                          ejecutarValidacionCedula("1715489621");
                        }}
                        className="text-xs justify-start font-normal h-auto py-2 px-3 w-full"
                      >
                        <UserCheck className="size-4 text-primary shrink-0 mr-2" />
                        <div className="text-left">
                          <span className="font-semibold block">1715489621 — Roberto Dávila (MSP)</span>
                          <span className="text-[11px] text-muted-foreground">Coordinador Titular habilitado en Anexo A</span>
                        </div>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCedulaInput("1712345602");
                          ejecutarValidacionCedula("1712345602");
                        }}
                        className="text-xs justify-start font-normal h-auto py-2 px-3 w-full"
                      >
                        <UserCheck className="size-4 text-primary shrink-0 mr-2" />
                        <div className="text-left">
                          <span className="font-semibold block">1712345602 — Paula Mendoza (DINARP)</span>
                          <span className="text-[11px] text-muted-foreground">Coordinador Suplente habilitado en Anexo A</span>
                        </div>
                      </Button>
                    </div>

                  </form>
                </div>
              </div>
            )}"""
    content = content[:match_step1.start()] + new_step1 + content[match_step1.end():]
    print("Replaced Step 1 Layout")
else:
    print("Could not find step 1 pattern")

# 2. Step 4 Success Alert
pattern_step4 = re.compile(r"\{\/\* Alerta de notificación por correo \*\/.*?<\/div>\s*\) \: \(\s*<div className=\"p-4 rounded-xl bg-success\/10.*?<\/div>\s*\)\}", re.DOTALL)
match_step4 = pattern_step4.search(content)

if match_step4:
    new_step4 = """{!signingError && (
                              <div className="p-4 rounded-xl border border-primary/25 bg-primary/5 space-y-2 text-xs">
                                <div className="flex items-center gap-2 font-bold text-primary">
                                  <Mail className="size-4 shrink-0" />
                                  <span>Solicitud de firma enviada</span>
                                </div>
                                <p className="text-[11px] leading-relaxed text-muted-foreground">
                                  Revisa tu correo institucional y continúa el proceso de firma en FirmaEC.
                                </p>
                                <p className="text-[11px] font-semibold text-primary/90 flex items-center gap-1.5 pt-1">
                                  <RefreshCw className="size-3.5 animate-spin shrink-0" />
                                  <span>El estado de esta pantalla se actualizará automáticamente.</span>
                                </p>
                              </div>
                            )}

                            {signingError && (
                              <div className="pt-2 animate-in slide-in-from-top-1">
                                <Alert
                                  variant="danger"
                                  icon={<AlertCircle className="size-4" />}
                                  title="Firma no completada"
                                  className="items-center rounded-xl bg-danger/10 border-danger/20"
                                >
                                  <div className="flex flex-col gap-1 mt-1">
                                    <div className="flex items-start justify-between gap-4">
                                      <span className="text-xs font-medium leading-relaxed text-danger-900 dark:text-danger-100">
                                        No fue posible verificar la firma electrónica. Intenta nuevamente para continuar.
                                      </span>
                                      <Button
                                        type="button"
                                        variant="danger"
                                        size="sm"
                                        disabled={isSigning}
                                        onClick={() => handleFirmaElectronica(false)}
                                        className="shrink-0 text-[10px] h-7 px-3 rounded-full"
                                      >
                                        {isSigning ? <LoadingSpinner size="sm" className="size-3" /> : <RefreshCw className="size-3 mr-1.5" />}
                                        <span>Reintentar FirmaEC</span>
                                      </Button>
                                    </div>
                                    <span className="text-[11px] text-danger-700/80 dark:text-danger-200/80 mt-1">
                                      Nota: El Anexo B aún no ha sido enviado a Gestión. Para continuar, debes completar y verificar correctamente la firma.
                                    </span>
                                  </div>
                                </Alert>
                              </div>
                            )}

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                {isSigning ? (
                                  <>
                                    <LoadingSpinner size="sm" className="size-3.5 text-primary shrink-0" />
                                    <span className="text-[11px]">Verificando firma con FirmaEC...</span>
                                  </>
                                ) : (
                                  !signingError && (
                                    <>
                                      <LoadingSpinner size="sm" className="size-3.5 text-primary shrink-0" />
                                      <span className="text-[11px]">Esperando confirmación...</span>
                                    </>
                                  )
                                )}
                              </div>
                              <div className="flex items-center justify-end gap-2">
                                <Button type="button" variant="outline" size="sm" onClick={() => handleFirmaElectronica(true)} className="text-[10px] h-7 border-danger/30 text-danger hover:bg-danger/10"><AlertCircle className="size-3 mr-1" /> Falla</Button>
                                <Button type="button" variant="outline" size="sm" onClick={() => handleFirmaElectronica(false)} className="text-[10px] h-7 border-success/30 text-success hover:bg-success/10"><CheckCircle2 className="size-3 mr-1" /> Éxito</Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="pt-2 animate-in slide-in-from-top-1">
                            <Alert
                              variant="success"
                              icon={<CheckCircle2 className="size-5" />}
                              title="Firma verificada exitosamente"
                              className="items-start rounded-xl bg-success/10 border-success/30"
                            >
                              <div className="flex flex-col gap-2 mt-1">
                                <span className="text-[11px] leading-relaxed text-success-900 dark:text-success-100 font-medium">
                                  El instrumento digital ha sido suscrito con un certificado electrónico válido. El documento está listo para ser radicado.
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-foreground/90 pt-3 border-t border-success/20">
                                  <div>Fecha y Hora: <strong className="text-foreground font-mono ml-1">{signatureInfo?.fechaHora}</strong></div>
                                  <div>Serie Certificado / ID: <strong className="text-foreground font-mono ml-1">{signatureInfo?.identificador}</strong></div>
                                </div>
                              </div>
                            </Alert>
                          </div>
                        )}"""
    content = content[:match_step4.start()] + new_step4 + content[match_step4.end():]
    print("Replaced Step 4")
else:
    print("Could not find step 4 pattern")

# 3. Add states to component
content = content.replace("const [isSigned, setIsSigningDone] = useState(false);", "const [isSigned, setIsSigningDone] = useState(false);\n  const [signingError, setSigningError] = useState(false);")
content = content.replace("import { Badge } from \"@/components/ui/badge\";", "import { Badge } from \"@/components/ui/badge\";\nimport { Alert } from \"@/components/ui/alert\";")

# 4. Modify handleFirmaElectronica to support forceError
pattern_firma = re.compile(r"  const handleFirmaElectronica = \(\) => \{.*?\}, 2500\);\n  \};", re.DOTALL)
match_firma = pattern_firma.search(content)
if match_firma:
    new_firma = """  const handleFirmaElectronica = (forceError = false) => {
    if (!formData.clausulasAceptadas) {
      toast.error("Debe aceptar las cláusulas del Anexo B antes de firmar.");
      return;
    }
    setIsSigning(true);
    setSigningError(false);
    
    // Simulación de retraso en firma electrónica de 2.5s
    setTimeout(() => {
      setIsSigning(false);
      if (forceError) {
        setSigningError(true);
        toast.error("Error validando el certificado digital.");
        return;
      }
      
      const now = new Date();
      const fechaStr = ${String(now.getDate()).padStart(2, "0")}// :;
      setSignatureInfo({
        fechaHora: fechaStr,
        identificador: "SN-CERT-98234-MSP",
      });
      setIsSigningDone(true);
      toast.success("Documento ARP-R02 firmado digitalmente.");
    }, 2500);
  };"""
    content = content[:match_firma.start()] + new_firma + content[match_firma.end():]
    print("Replaced handler")
else:
    print("Could not find handler")

# 5. Breadcrumb update
pattern_bread = re.compile(r"            \{\/\* Migas de pan y Botón Volver \*\/.*?<\/div>", re.DOTALL)
match_bread = pattern_bread.search(content)
if match_bread:
    new_bread = """            {/* Migas de pan */}
            <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
              <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground flex items-center gap-1.5 flex-wrap">
                <Link href="/wireframes2/login" className="hover:text-foreground transition-colors flex items-center gap-1 shrink-0">
                  <Home className="size-3.5" />
                  <span>Portal de Acceso</span>
                </Link>
                <span>/</span>
                <span className="shrink-0">Prerregistro coordinador</span>
                <span>/</span>
                <span className="text-foreground font-semibold truncate">Anexo B Acuerdo de uso y confidencialidad</span>
              </nav>
            </div>"""
    content = content[:match_bread.start()] + new_bread + content[match_bread.end():]
    print("Replaced breadcrumbs")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Finished!")
