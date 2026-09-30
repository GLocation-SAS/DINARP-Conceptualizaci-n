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

# 2. Add signingError state
if 'const [signingError, setSigningError] = useState(false);' not in content:
    content = content.replace('const [isSigned, setIsSigningDone] = useState(false);', 'const [isSigned, setIsSigningDone] = useState(false);\n    const [signingError, setSigningError] = useState(false);')

if 'import { Alert }' not in content:
    content = content.replace('import { Badge } from "@/components/ui/badge";', 'import { Badge } from "@/components/ui/badge";\nimport { Alert } from "@/components/ui/alert";')

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
                              <div className="flex items-center justify-end gap-2">
                                <Button type="button" variant="outline" size="sm" onClick={() => handleFirmaElectronica(true)} className="text-[10px] h-7 border-danger/30 text-danger hover:bg-danger/10 shadow-xs"><AlertCircle className="size-3 mr-1" /> Simular Falla</Button>
                                <Button type="button" variant="outline" size="sm" onClick={() => handleFirmaElectronica(false)} className="text-[10px] h-7 border-success/30 text-success hover:bg-success/10 shadow-xs"><CheckCircle2 className="size-3 mr-1" /> Simular Éxito</Button>
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
    print("Replaced step 4 layout!")
else:
    print("Could not find step 4 pattern")

# 5. Move testing buttons to bottom of form
pattern_form = re.compile(r"                  <form.*?<\/form>", re.DOTALL)
match_form = pattern_form.search(content)
if match_form:
    form_content = match_form.group(0)
    
    # Check if testing buttons exist, if not, add them at bottom
    if "Casos de prueba para validación:" not in form_content:
        # replace the submit button and add the cases below
        new_form = form_content.replace('''                      </Button>
                    </div>
                  </form>''', '''                      </Button>
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
                  </form>''')
        content = content[:match_form.start()] + new_form + content[match_form.end():]
        print("Replaced form testing buttons!")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Finished updates.")
