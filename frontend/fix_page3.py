import re

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

tab5_6_content = r"""
            {/* ── PASO 5: INFORMACIÓN DEL TRÁMITE (NORMATIVIDAD) ── */}
            {detailTab === 5 && (
              <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xs animate-in fade-in duration-200">
                <div className="bg-primary/10 dark:bg-primary/20 border-b border-primary p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold font-heading text-primary flex items-center gap-2">
                      <FileText className="size-5 shrink-0" />
                      <span>Antecedentes del Trámite</span>
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Expediente validado por Gestión y Registro. Incluye el Anexo A formalizado.
                    </p>
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                  <h3 className="text-sm font-bold text-foreground mb-4">Documentos del Expediente</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedSolicitud.documentos?.map((doc, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-muted/30 border border-border rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-lg bg-danger/10 text-danger flex items-center justify-center shrink-0">
                            <FileText className="size-5" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-xs text-foreground truncate" title={doc}>{doc}</span>
                            <span className="text-[11px] text-muted-foreground">Documento PDF (Solo lectura)</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon-sm" title="Ver documento">
                          <Eye className="size-4" />
                        </Button>
                      </div>
                    ))}
                    {!selectedSolicitud.documentos?.length && (
                      <div className="col-span-full py-8 text-center text-xs text-muted-foreground bg-muted/20 border border-border border-dashed rounded-xl">
                        No hay documentos adjuntos.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── PASO 6: RESOLUCIÓN INSTITUCIONAL (NORMATIVIDAD) ── */}
            {detailTab === 6 && (
              <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xs animate-in fade-in duration-200">
                <div className="bg-primary/10 dark:bg-primary/20 border-b border-primary p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold font-heading text-primary flex items-center gap-2">
                      <FileSignature className="size-5 shrink-0" />
                      <span>Formulación de Resolución Institucional</span>
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {selectedSolicitud.resolucion ? "Resolución generada y vinculada." : "El expediente requiere la generación del documento habilitante."}
                    </p>
                  </div>
                </div>

                <div className="p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4">
                  {selectedSolicitud.resolucion ? (
                    <>
                      <div className="size-16 rounded-full bg-success/15 text-success flex items-center justify-center mb-2">
                        <CheckCircle2 className="size-8" />
                      </div>
                      <h3 className="font-heading font-bold text-lg text-foreground">Resolución {selectedSolicitud.resolucion}</h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        La resolución ha sido generada correctamente por el equipo de Normatividad y se encuentra en etapa de suscripción por la máxima autoridad de la DINARP.
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                        <FileSignature className="size-8" />
                      </div>
                      <h3 className="font-heading font-bold text-lg text-foreground">Generación Pendiente</h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        El funcionario responsable deberá redactar y adjuntar la resolución institucional fundamentada en la aprobación del Anexo A para concluir el trámite normativo.
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
"""

content = content.replace(
    '{/* ── PASO 4: HISTORIAL COMPLETO Y REGLAS BPM DEL TRÁMITE ── */}',
    tab5_6_content + '\n              {/* ── PASO 4: HISTORIAL COMPLETO Y REGLAS BPM DEL TRÁMITE ── */}'
)

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
