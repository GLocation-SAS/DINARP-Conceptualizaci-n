import re

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

old_tooltip = """                              {/* Asignado */}
                              <TableCell className="px-2 text-xs overflow-hidden">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex items-center min-w-0 cursor-pointer">
                                      {revisorAsignado ? (
                                        <Badge tone="neutral" appearance="soft" className="border border-border text-[11px] font-medium text-foreground truncate max-w-full hover:bg-surface/80 transition-colors">
                                          <User className="size-3 mr-1 text-primary shrink-0" />
                                          <span className="truncate">{revisorAsignado}</span>
                                        </Badge>
                                      ) : (
                                        <span className="text-[11px] text-muted-foreground italic font-mono truncate block hover:text-foreground transition-colors">
                                          Sin asignar
                                        </span>
                                      )}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" variant="surface" className="p-2.5 max-w-xs flex flex-col items-start gap-0.5">
                                    <p className="font-bold text-xs text-foreground font-sans">
                                      {revisorAsignado ? (currentUser.role === "DIR_NORMATIVA" || currentUser.role === "EQ_NORMATIVA" ? "Responsable de Normatividad" : "Revisor asignado") : "Estado de asignación"}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground">
                                      {revisorAsignado ? revisorAsignado : "Trámite pendiente de asignar"}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TableCell>"""

new_tooltip = """                              {/* Asignado */}
                              <TableCell className="px-2 text-xs overflow-hidden">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex items-center min-w-0 cursor-pointer">
                                      {revisorAsignado ? (
                                        <div className="flex items-center gap-1.5 overflow-hidden group/asignado">
                                          <div className="size-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover/asignado:bg-primary/20 transition-colors">
                                            <span className="text-[9px] font-bold text-primary">
                                              {revisorAsignado.split(" ").map((w: string) => w[0]).join("").substring(0, 2).toUpperCase()}
                                            </span>
                                          </div>
                                          <span className="text-[11px] font-medium text-foreground truncate block">
                                            {revisorAsignado}
                                          </span>
                                        </div>
                                      ) : (
                                        <span className="text-[11px] text-muted-foreground italic font-mono truncate block hover:text-foreground transition-colors">
                                          Sin asignar
                                        </span>
                                      )}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" variant="surface" className="p-2.5 max-w-xs flex flex-col items-start gap-0.5">
                                    <p className="font-bold text-xs text-foreground font-sans">
                                      {revisorAsignado ? (currentUser.role === "DIR_NORMATIVA" || currentUser.role === "EQ_NORMATIVA" ? "Responsable de Normatividad" : "Revisor de Gestión") : "Estado de asignación"}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground">
                                      {revisorAsignado ? revisorAsignado : "Trámite pendiente de asignar"}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TableCell>"""

content = content.replace(old_tooltip, new_tooltip)

old_tooltip_mobile = """                                    <div className="flex items-center gap-1.5 min-w-0 cursor-pointer text-xs">
                                      <User className="size-3.5 text-primary shrink-0" />
                                      {revisorAsignado ? (
                                        <span className="font-semibold text-foreground truncate block">
                                          {revisorAsignado}
                                        </span>
                                      ) : (
                                        <span className="text-[11px] text-muted-foreground italic font-mono whitespace-nowrap">Sin asignar</span>
                                      )}
                                    </div>"""

new_tooltip_mobile = """                                    <div className="flex items-center gap-1.5 min-w-0 cursor-pointer text-xs">
                                      {revisorAsignado ? (
                                        <>
                                          <div className="size-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                            <span className="text-[8px] font-bold text-primary">
                                              {revisorAsignado.split(" ").map((w: string) => w[0]).join("").substring(0, 2).toUpperCase()}
                                            </span>
                                          </div>
                                          <span className="font-semibold text-foreground truncate block">
                                            {revisorAsignado}
                                          </span>
                                        </>
                                      ) : (
                                        <>
                                          <User className="size-3.5 text-primary shrink-0" />
                                          <span className="text-[11px] text-muted-foreground italic font-mono whitespace-nowrap">Sin asignar</span>
                                        </>
                                      )}
                                    </div>"""

content = content.replace(old_tooltip_mobile, new_tooltip_mobile)

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
