# -*- coding: utf-8 -*-
import re

file_path = "src/app/wireframes2/enrolamiento-coordinador/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update Card in Step 1
content = content.replace('className="bg-primary-100/30 dark:bg-primary-900/20', 'className="bg-secondary-50/50 dark:bg-secondary-900/20')
content = content.replace('className="bg-primary/20 text-primary', 'className="bg-primary text-primary-foreground')
content = content.replace('text-primary-800/80 dark:text-primary-200/80', 'text-secondary-800/80 dark:text-secondary-200/80')
content = content.replace('text-primary">\n                Activación de Coordinador SINARP — Anexo B', 'text-secondary-900 dark:text-secondary-100">\n                Anexo B — Acuerdo de Uso y Confidencialidad')
content = content.replace('text-primary">\r\n                Activación de Coordinador SINARP — Anexo B', 'text-secondary-900 dark:text-secondary-100">\r\n                Anexo B — Acuerdo de Uso y Confidencialidad')
content = content.replace('Proceso B — Enrolamiento y Acuerdo de Uso y Confidencialidad para Coordinadores Prerregistrados', 'Suscripción digital para el enrolamiento del Coordinador SINARP.')
content = content.replace('FORMULARIO OFICIAL ARP-R02', 'FORMULARIO ARP-R02')
content = content.replace('ShieldCheck className="size-32 text-primary"', 'ShieldCheck className="size-32 text-secondary-500"')
content = content.replace('Activación de Coordinador SINARP\n                    </h1>\n                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">\n                      Ingresa tu número de cédula para continuar con el proceso de activación.', 'Validación de la Invitación de Coordinador\n                    </h1>\n                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">\n                      Ingresa tu número de cédula para consultar y verificar la invitación vigente de Anexo B asociada a tu institución.')
content = content.replace('Activación de Coordinador SINARP\r\n                    </h1>\r\n                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">\r\n                      Ingresa tu número de cédula para continuar con el proceso de activación.', 'Validación de la Invitación de Coordinador\r\n                    </h1>\r\n                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">\r\n                      Ingresa tu número de cédula para consultar y verificar la invitación vigente de Anexo B asociada a tu institución.')

# 2. Add states to component
if 'const [signingError, setSigningError] = useState(false);' not in content:
    content = content.replace('const [isSigned, setIsSigningDone] = useState(false);', 'const [isSigned, setIsSigningDone] = useState(false);\n  const [signingError, setSigningError] = useState(false);\n  const [showDemoToolbar, setShowDemoToolbar] = useState(true);')

if 'import { Alert }' not in content:
    content = content.replace('import { Badge } from "@/components/ui/badge";', 'import { Badge } from "@/components/ui/badge";\nimport { Alert } from "@/components/ui/alert";')

if 'ChevronUp,' not in content:
    content = content.replace('ChevronDown,', 'ChevronDown,\n  ChevronUp,\n  Sparkles,\n  AlertCircle,')

# 3. Update handleFirmaElectronica
old_firma = '''  const handleFirmaElectronica = () => {
    if (!formData.clausulasAceptadas) {
      toast.error("Debe aceptar las cláusulas del Anexo B antes de firmar.");
      return;
    }
    if (!password || password !== confirmPassword) {
      toast.error("Verifique las contraseñas ingresadas.");
      return;
    }

    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      setIsSigningDone(true);
      const now = new Date();
      const fechaStr = ${String(now.getDate()).padStart(2, "0")}// :;
      setSignatureInfo({
        fechaHora: fechaStr,
        identificador: FIRMA-EC-2026--B
      });
      setFormData((prev) => ({ ...prev, firmadoPorFuncionario: true }));
      toast.success("Documento ARP-R02 firmado digitalmente.");
    }, 2500);
  };'''

new_firma = '''  const handleFirmaElectronica = (forceError = false) => {
    if (!formData.clausulasAceptadas) {
      toast.error("Debe aceptar las cláusulas del Anexo B antes de firmar.");
      return;
    }
    if (!password || password !== confirmPassword) {
      toast.error("Verifique las contraseñas ingresadas.");
      return;
    }

    setIsSigning(true);
    setSigningError(false);
    setTimeout(() => {
      setIsSigning(false);
      if (forceError) {
        setSigningError(true);
        toast.error("Error validando el certificado digital.");
        return;
      }
      setIsSigningDone(true);
      const now = new Date();
      const fechaStr = ${String(now.getDate()).padStart(2, "0")}// :;
      setSignatureInfo({
        fechaHora: fechaStr,
        identificador: FIRMA-EC-2026--B
      });
      setFormData((prev) => ({ ...prev, firmadoPorFuncionario: true }));
      toast.success("Documento ARP-R02 firmado digitalmente.");
    }, 2500);
  };'''

content = content.replace(old_firma, new_firma)
content = content.replace(old_firma.replace('\n', '\r\n'), new_firma.replace('\n', '\r\n'))

# 4. Refactor Step 4 block (!isSigned and Success)
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

# 5. Fix Step 1 layout (Buttons on bottom of form)
pattern_form = re.compile(r"<form\s*onSubmit=\{.*?\}\s*className=\"space-y-4 pt-2\"\s*>\s*<FormField label=\"N.mero de c.dula.*?<\/form>", re.DOTALL)
match_form = pattern_form.search(content)
if match_form:
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
                          setCedulaInput(e.target.value.replace(/\\D/g, ""));
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
    content = content[:match_form.start()] + new_form + content[match_form.end():]

# 6. Replace old toolbar with new toolbar
old_toolbar_regex = re.compile(r"\{\/\* ── TOOLBAR FLOTANTE DE PRUEBA ── \*\/.*?\n        <\/div>\n", re.DOTALL)
new_toolbar = """{/* ── TOOLBAR FLOTANTE (CASOS DE USO) ── */}
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
                    Flujo de Firma
                  </span>
                </div>
                
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
"""
content = old_toolbar_regex.sub(new_toolbar, content)

# 7. Convert success screen to Dialog
pattern_success = re.compile(r"\{\/\* ── CONFIRMACIÓN DE ENVÍO EXITOSO ── \*\/.*?Volver al inicio.*?<\/Button>\s*<\/div>\s*<\/div>\s*\)\}", re.DOTALL)
match_success = pattern_success.search(content)

if match_success:
    new_success = """{/* ── CONFIRMACIÓN DE ENVÍO EXITOSO (DIALOG) ── */}
            <Dialog open={isSubmittedSuccess} onOpenChange={(open) => {
              if (!open) {
                router.push("/wireframes2/login");
              }
            }}>
              <DialogContent className="sm:max-w-md p-6 sm:p-8 text-center" hideCloseButton={true}>
                <div className="size-16 rounded-full bg-success/15 border border-success/30 flex items-center justify-center mx-auto mb-2 animate-in zoom-in duration-300">
                  <CheckCircle2 className="size-8 text-success stroke-[2.5px]" />
                </div>
                
                <DialogHeader className="space-y-3">
                  <DialogTitle className="text-xl sm:text-2xl font-bold font-heading text-foreground text-center">
                    ¡Trámite radicado exitosamente!
                  </DialogTitle>
                  <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-center">
                    Tu solicitud de enrolamiento ha sido enviada al Área de Gestión para revisión y aprobación.
                  </DialogDescription>
                </DialogHeader>

                <div className="my-6 p-4 bg-muted/30 rounded-2xl border border-border text-left space-y-2.5 text-[11px] sm:text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-border/50">
                    <span className="text-muted-foreground">N.º de solicitud:</span>
                    <strong className="text-foreground">{submittedSolicitudId}</strong>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-border/50">
                    <span className="text-muted-foreground">Coordinador:</span>
                    <strong className="text-foreground">{formData.funcionarioNombre}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Institución:</span>
                    <strong className="text-foreground text-right max-w-[200px] truncate">{formData.nombreEntidad}</strong>
                  </div>
                </div>

                <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl text-left text-[11px] text-primary mb-6 flex gap-2">
                  <Mail className="size-4 shrink-0 mt-0.5" />
                  <span>Te hemos enviado un correo de confirmación con el resumen de esta solicitud. Recibirás una notificación cuando tu trámite sea aprobado.</span>
                </div>

                <DialogFooter className="sm:justify-center">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => router.push("/wireframes2/login")}
                    className="w-full sm:w-auto px-8 rounded-full h-11 text-xs font-bold"
                  >
                    <Check className="size-4 mr-2" />
                    Entendido
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>}"""
    content = content[:match_success.start()] + new_success + content[match_success.end():]
    
if "const router = useRouter();" not in content:
    content = content.replace("const searchParams = useSearchParams();", "const router = useRouter();\n  const searchParams = useSearchParams();")
    content = content.replace('import { useSearchParams } from "next/navigation";', 'import { useSearchParams, useRouter } from "next/navigation";')
    content = content.replace("hideCloseButton={true}", "")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Applied all fixes to clean file!")
