import re

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix Card 2 Title & Subtitle
content = re.sub(
    r'\{currentUser\.role === "EQ_GESTION" \? "Aprobadas" : currentUser\.role === "DIR_NORMATIVA" \? "En gestión" : "En revisión"\}',
    r'{currentUser.role === "EQ_GESTION" ? "Aprobadas" : currentUser.role === "DIR_NORMATIVA" ? "Asignadas" : "En revisión"}',
    content
)
content = re.sub(
    r'\{currentUser\.role === "EQ_GESTION" \? "Solicitudes aprobadas" : currentUser\.role === "DIR_NORMATIVA" \? "Resolución en proceso" : "Actualmente en análisis"\}',
    r'{currentUser.role === "EQ_GESTION" ? "Solicitudes aprobadas" : currentUser.role === "DIR_NORMATIVA" ? "Resoluciones en gestión" : "Actualmente en análisis"}',
    content
)

# Fix Card 3 Title & Subtitle
# We search for the current one
content = re.sub(
    r'\{currentUser\.role === "EQ_GESTION" \? "Rechazadas" : "Finalizadas"\}',
    r'{currentUser.role === "EQ_GESTION" ? "Rechazadas" : "Finalizadas"}',
    content
)
content = re.sub(
    r'\{currentUser\.role === "EQ_GESTION" \? "Solicitudes rechazadas" : "Histórico de trámites concluidos"\}',
    r'{currentUser.role === "EQ_GESTION" ? "Solicitudes rechazadas" : currentUser.role === "DIR_NORMATIVA" ? "Resoluciones generadas" : "Histórico de trámites concluidos"}',
    content
)

# Hide Table Columns
# PROCESO and SOLICITANTE should be hidden if isDirNormativa
# <TableHead className="w-[160px] px-2 py-2.5 whitespace-nowrap">
#   PROCESO
# </TableHead>
# <TableHead className="w-[190px] px-2 py-2.5 whitespace-nowrap">
#   SOLICITANTE
# </TableHead>

content = content.replace(
    '<TableHead className="w-[160px] px-2 py-2.5 whitespace-nowrap">\n                          PROCESO\n                        </TableHead>',
    '{!(currentUser.role === "DIR_NORMATIVA" || currentUser.role === "EQ_NORMATIVA") && (\n                          <TableHead className="w-[160px] px-2 py-2.5 whitespace-nowrap">\n                            PROCESO\n                          </TableHead>\n                        )}'
)
content = content.replace(
    '<TableHead className="w-[190px] px-2 py-2.5 whitespace-nowrap">\n                          SOLICITANTE\n                        </TableHead>',
    '{!(currentUser.role === "DIR_NORMATIVA" || currentUser.role === "EQ_NORMATIVA") && (\n                          <TableHead className="w-[190px] px-2 py-2.5 whitespace-nowrap">\n                            SOLICITANTE\n                          </TableHead>\n                        )}'
)

# Hide TableCell
# <TableCell className="px-2">
#   <div className="flex flex-col min-w-0">
#     <span className="font-bold text-xs text-foreground truncate">{row.tipoTramite}</span>
#   </div>
# </TableCell>
# <TableCell className="px-2">
#   <div className="flex items-center gap-2.5">
#     <div className="size-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
#       {row.nombreCompleto.charAt(0)}
#     </div>
#     <div className="flex flex-col min-w-0">
#       <span className="font-bold text-xs text-foreground truncate">{row.nombreCompleto}</span>
#       <span className="text-[11px] text-muted-foreground truncate">{row.cedula}</span>
#     </div>
#   </div>
# </TableCell>

content = content.replace(
    '<TableCell className="px-2">\n                                  <div className="flex flex-col min-w-0">\n                                    <span className="font-bold text-xs text-foreground truncate">{row.tipoTramite === "PROCESO_A_REGISTRO" ? "Anexo A — Inscripción" : row.tipoTramite === "PROCESO_B_COORDINADOR" ? "Anexo B — Enrolamiento" : "Anexo C — Cambio"}</span>\n                                  </div>\n                                </TableCell>',
    '{!(currentUser.role === "DIR_NORMATIVA" || currentUser.role === "EQ_NORMATIVA") && (\n                                  <TableCell className="px-2">\n                                    <div className="flex flex-col min-w-0">\n                                      <span className="font-bold text-xs text-foreground truncate">{row.tipoTramite === "PROCESO_A_REGISTRO" ? "Anexo A — Inscripción" : row.tipoTramite === "PROCESO_B_COORDINADOR" ? "Anexo B — Enrolamiento" : "Anexo C — Cambio"}</span>\n                                    </div>\n                                  </TableCell>\n                                )}'
)

content = content.replace(
    '<TableCell className="px-2">\n                                  <div className="flex items-center gap-2.5">\n                                    <div className="size-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">\n                                      {row.nombreCompleto.charAt(0)}\n                                    </div>\n                                    <div className="flex flex-col min-w-0">\n                                      <span className="font-bold text-xs text-foreground truncate" title={row.nombreCompleto}>{row.nombreCompleto}</span>\n                                      <span className="text-[11px] text-muted-foreground truncate">{row.cedula}</span>\n                                    </div>\n                                  </div>\n                                </TableCell>',
    '{!(currentUser.role === "DIR_NORMATIVA" || currentUser.role === "EQ_NORMATIVA") && (\n                                  <TableCell className="px-2">\n                                    <div className="flex items-center gap-2.5">\n                                      <div className="size-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">\n                                        {row.nombreCompleto.charAt(0)}\n                                      </div>\n                                      <div className="flex flex-col min-w-0">\n                                        <span className="font-bold text-xs text-foreground truncate" title={row.nombreCompleto}>{row.nombreCompleto}</span>\n                                        <span className="text-[11px] text-muted-foreground truncate">{row.cedula}</span>\n                                      </div>\n                                    </div>\n                                  </TableCell>\n                                )}'
)

# Detail View Tabs Update
# We replace the TabsList for Normatividad
# <TabsList className="h-auto p-1.5 rounded-full bg-background border border-border/40 inline-flex gap-1.5 flex-nowrap w-full sm:w-auto justify-start">
# We can make a separate TabsList for Normatividad

tabs_gestion = r"""                <TabsList className="h-auto p-1.5 rounded-full bg-background border border-border/40 inline-flex gap-1.5 flex-nowrap w-full sm:w-auto justify-start">
                  <TabsTrigger
                    value="tab-0"
                    className="px-5 py-2 text-xs font-bold gap-2 data-[state=active]:bg-primary-300 data-[state=active]:text-white data-[state=active]:[&_svg]:text-white dark:data-[state=active]:bg-primary-300 dark:data-[state=active]:text-white dark:data-[state=active]:[&_svg]:text-white"
                  >
                    <Building2 className="size-4 shrink-0" />
                    <span>1. Entidad y Autoridad</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="tab-1"
                    className="px-5 py-2 text-xs font-bold gap-2 data-[state=active]:bg-primary-300 data-[state=active]:text-white data-[state=active]:[&_svg]:text-white dark:data-[state=active]:bg-primary-300 dark:data-[state=active]:text-white dark:data-[state=active]:[&_svg]:text-white"
                  >
                    <User className="size-4 shrink-0" />
                    <span>2. Coordinadores</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="tab-2"
                    className="px-5 py-2 text-xs font-bold gap-2 data-[state=active]:bg-primary-300 data-[state=active]:text-white data-[state=active]:[&_svg]:text-white dark:data-[state=active]:bg-primary-300 dark:data-[state=active]:text-white dark:data-[state=active]:[&_svg]:text-white"
                  >
                    <MapPin className="size-4 shrink-0" />
                    <span>3. Direcciones IP</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="tab-3"
                    className="px-5 py-2 text-xs font-bold gap-2 data-[state=active]:bg-primary-300 data-[state=active]:text-white data-[state=active]:[&_svg]:text-white dark:data-[state=active]:bg-primary-300 dark:data-[state=active]:text-white dark:data-[state=active]:[&_svg]:text-white"
                  >
                    <FileText className="size-4 shrink-0" />
                    <span>4. Documentos</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="tab-4"
                    className="px-5 py-2 text-xs font-bold gap-2 data-[state=active]:bg-primary-300 data-[state=active]:text-white data-[state=active]:[&_svg]:text-white dark:data-[state=active]:bg-primary-300 dark:data-[state=active]:text-white dark:data-[state=active]:[&_svg]:text-white"
                  >
                    <History className="size-4 shrink-0" />
                    <span>5. Trazabilidad</span>
                  </TabsTrigger>
                </TabsList>"""

tabs_normatividad = r"""                <TabsList className="h-auto p-1.5 rounded-full bg-background border border-border/40 inline-flex gap-1.5 flex-nowrap w-full sm:w-auto justify-start overflow-x-auto overflow-y-hidden snap-x">
                  <TabsTrigger
                    value="tab-5"
                    className="px-5 py-2 text-xs font-bold gap-2 data-[state=active]:bg-primary-300 data-[state=active]:text-white data-[state=active]:[&_svg]:text-white dark:data-[state=active]:bg-primary-300 dark:data-[state=active]:text-white dark:data-[state=active]:[&_svg]:text-white shrink-0 snap-start"
                  >
                    <FileText className="size-4 shrink-0" />
                    <span>Información del trámite</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="tab-6"
                    className="px-5 py-2 text-xs font-bold gap-2 data-[state=active]:bg-primary-300 data-[state=active]:text-white data-[state=active]:[&_svg]:text-white dark:data-[state=active]:bg-primary-300 dark:data-[state=active]:text-white dark:data-[state=active]:[&_svg]:text-white shrink-0 snap-start"
                  >
                    <FileSignature className="size-4 shrink-0" />
                    <span>Resolución</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="tab-4"
                    className="px-5 py-2 text-xs font-bold gap-2 data-[state=active]:bg-primary-300 data-[state=active]:text-white data-[state=active]:[&_svg]:text-white dark:data-[state=active]:bg-primary-300 dark:data-[state=active]:text-white dark:data-[state=active]:[&_svg]:text-white shrink-0 snap-start"
                  >
                    <History className="size-4 shrink-0" />
                    <span>Trazabilidad</span>
                  </TabsTrigger>
                </TabsList>"""

tabs_replacement = r"""                {(currentUser.role === "DIR_NORMATIVA" || currentUser.role === "EQ_NORMATIVA") ? (""" + tabs_normatividad + r""") : (""" + tabs_gestion + r""")}"""

content = content.replace(tabs_gestion, tabs_replacement)


# Make sure that detailTab is initialized correctly for Normatividad
content = re.sub(
    r'const \[detailTab, setDetailTab\] = useState\(0\);',
    r'const [detailTab, setDetailTab] = useState(currentUser.role === "DIR_NORMATIVA" || currentUser.role === "EQ_NORMATIVA" ? 5 : 0);',
    content
)

# Make sure that when handling handleSelectSolicitud, we set the tab correctly
content = re.sub(
    r'setDetailTab\(0\);',
    r'setDetailTab(currentUser.role === "DIR_NORMATIVA" || currentUser.role === "EQ_NORMATIVA" ? 5 : 0);',
    content
)


with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
