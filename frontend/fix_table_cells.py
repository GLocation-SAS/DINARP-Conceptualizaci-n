import re

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()


old_proceso = """                              {/* Proceso */}
                              <TableCell className="px-2 overflow-hidden">
                                {(() => {
                                  let text = "";
                                  if (row.tipoTramite === "PROCESO_A_REGISTRO_INSTITUCION") text = "Anexo A";
                                  if (row.tipoTramite === "PROCESO_B_ENROLAMIENTO_COORDINADOR") text = "Anexo B";
                                  if (row.tipoTramite === "PROCESO_C_CREACION_USUARIOS") text = "Anexo C";
                                  if (row.tipoTramite === "PROCESO_D_ACTUALIZACION_IP") text = "Anexo D";

                                  return (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="inline-flex max-w-full">
                                          <Badge tone="neutral" appearance="soft" className="border border-border text-[11px] font-medium text-foreground truncate block cursor-pointer hover:bg-surface/80 transition-colors shrink-0 max-w-full">
                                            {text} <span className="opacity-60 text-[10px] ml-0.5">+</span>
                                          </Badge>
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent side="top" variant="surface" className="p-2.5 max-w-xs flex flex-col items-start gap-0.5">
                                        <p className="font-bold text-xs text-foreground font-sans">Tipo de Proceso</p>
                                        <p className="text-[11px] text-muted-foreground">{procesoLabel}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  );
                                })()}
                              </TableCell>"""

new_proceso = """                              {/* Proceso */}
                              {!(currentUser.role === "DIR_NORMATIVA" || currentUser.role === "EQ_NORMATIVA") && (
                                <TableCell className="px-2 overflow-hidden">
                                  {(() => {
                                    let text = "";
                                    if (row.tipoTramite === "PROCESO_A_REGISTRO_INSTITUCION") text = "Anexo A";
                                    if (row.tipoTramite === "PROCESO_B_ENROLAMIENTO_COORDINADOR") text = "Anexo B";
                                    if (row.tipoTramite === "PROCESO_C_CREACION_USUARIOS") text = "Anexo C";
                                    if (row.tipoTramite === "PROCESO_D_ACTUALIZACION_IP") text = "Anexo D";

                                    return (
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <div className="inline-flex max-w-full">
                                            <Badge tone="neutral" appearance="soft" className="border border-border text-[11px] font-medium text-foreground truncate block cursor-pointer hover:bg-surface/80 transition-colors shrink-0 max-w-full">
                                              {text} <span className="opacity-60 text-[10px] ml-0.5">+</span>
                                            </Badge>
                                          </div>
                                        </TooltipTrigger>
                                        <TooltipContent side="top" variant="surface" className="p-2.5 max-w-xs flex flex-col items-start gap-0.5">
                                          <p className="font-bold text-xs text-foreground font-sans">Tipo de Proceso</p>
                                          <p className="text-[11px] text-muted-foreground">{procesoLabel}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    );
                                  })()}
                                </TableCell>
                              )}"""
content = content.replace(old_proceso, new_proceso)

old_solicitante = """                              {/* Solicitante */}
                              <TableCell className="px-2 overflow-hidden">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex flex-col min-w-0 group/sol cursor-pointer">
                                      <span className="font-bold text-foreground text-xs leading-snug truncate" title={row.nombreCompleto}>
                                        {row.nombreCompleto}
                                      </span>
                                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                                        <span className="truncate">{row.cedula}</span>
                                        <span className="text-[9px] px-1 rounded bg-muted/60 text-muted-foreground font-sans font-semibold group-hover/sol:bg-primary/10 group-hover/sol:text-primary transition-colors shrink-0">
                                          +
                                        </span>
                                      </div>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" variant="surface" className="p-3 max-w-xs flex-col items-start gap-1">
                                    <p className="font-bold text-xs text-foreground">{row.nombreCompleto}</p>
                                    <p className="font-mono text-[11px] text-muted-foreground">C.I. {row.cedula}</p>
                                    <p className="text-[11px] text-primary font-medium">{row.correo}</p>
                                    <p className="text-[10px] text-muted-foreground border-t border-border/60 pt-1 mt-1">{row.institucion}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TableCell>"""

new_solicitante = """                              {/* Solicitante */}
                              {!(currentUser.role === "DIR_NORMATIVA" || currentUser.role === "EQ_NORMATIVA") && (
                                <TableCell className="px-2 overflow-hidden">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex flex-col min-w-0 group/sol cursor-pointer">
                                        <span className="font-bold text-foreground text-xs leading-snug truncate" title={row.nombreCompleto}>
                                          {row.nombreCompleto}
                                        </span>
                                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                                          <span className="truncate">{row.cedula}</span>
                                          <span className="text-[9px] px-1 rounded bg-muted/60 text-muted-foreground font-sans font-semibold group-hover/sol:bg-primary/10 group-hover/sol:text-primary transition-colors shrink-0">
                                            +
                                          </span>
                                        </div>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" variant="surface" className="p-3 max-w-xs flex-col items-start gap-1">
                                      <p className="font-bold text-xs text-foreground">{row.nombreCompleto}</p>
                                      <p className="font-mono text-[11px] text-muted-foreground">C.I. {row.cedula}</p>
                                      <p className="text-[11px] text-primary font-medium">{row.correo}</p>
                                      <p className="text-[10px] text-muted-foreground border-t border-border/60 pt-1 mt-1">{row.institucion}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TableCell>
                              )}"""

content = content.replace(old_solicitante, new_solicitante)

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
