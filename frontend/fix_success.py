import re

file_path = "src/app/wireframes2/enrolamiento-coordinador/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# I will replace from "{/* ── CONFIRMACIÓN DE ENVÍO EXITOSO ── */}" to "          </div>\n        )}"
# Let's use a simpler regex
pattern_success = re.compile(r"\{\/\*  CONFIRMACIN DE ENVO EXITOSO  \*\/.*?Volver al inicio.*?<\/Button>\s*<\/div>\s*<\/div>\s*\)\}", re.DOTALL)
match_success = pattern_success.search(content)

if not match_success:
    # Let's try with unicode escape
    pattern_success = re.compile(r"\{\/\* ── CONFIRMACIÓN DE ENVÍO EXITOSO ── \*\/.*?Volver al inicio.*?<\/Button>\s*<\/div>\s*<\/div>\s*\)\}", re.DOTALL)
    match_success = pattern_success.search(content)

if not match_success:
    # Very fallback: search text based
    start_str = "{/*"
    end_str = "Volver al inicio"
    
if match_success:
    new_success = """{/* ── CONFIRMACIÓN DE ENVÍO EXITOSO (DIALOG) ── */}
            <Dialog open={isSubmittedSuccess} onOpenChange={(open) => {
              if (!open) {
                router.push("/wireframes2/login");
              }
            }}>
              <DialogContent className="sm:max-w-md p-6 sm:p-8 text-center" hideCloseButton>
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
    
    # Check router
    if "const router = useRouter();" not in content:
        content = content.replace("const searchParams = useSearchParams();", "const router = useRouter();\n  const searchParams = useSearchParams();")
        content = content.replace('import { useSearchParams } from "next/navigation";', 'import { useSearchParams, useRouter } from "next/navigation";')
        
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Dialog added")
else:
    print("Could not find success block")
