import re

file_path = "frontend/src/app/wireframes2/enrolamiento-coordinador/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

target = """                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                            <FormField label="Representante Legal o Delegado" htmlFor="rep-legal-p2">
                              <Input
                                id="rep-legal-p2"
                                value={formData.representanteLegalNombre}
                                onChange={(e) => setFormData({ ...formData, representanteLegalNombre: e.target.value })}
                                className="text-xs font-semibold"
                                required
                              />
                            </FormField>

                            <FormField label="Selección de perfil operativo" htmlFor="rol-select-p2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="w-full justify-between h-9 text-xs px-3 font-semibold bg-background"
                                    id="rol-select-p2"
                                  >
                                    {formData.rolAsignado}
                                    <ChevronDown className="size-4 opacity-50" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                                  <DropdownMenuItem onClick={() => setFormData({ ...formData, rolAsignado: "COORDINADOR TITULAR" })}>
                                    COORDINADOR TITULAR
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => setFormData({ ...formData, rolAsignado: "SUPLENTE" })}>
                                    SUPLENTE
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => setFormData({ ...formData, rolAsignado: "SUPERVISOR" })}>
                                    SUPERVISOR
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => setFormData({ ...formData, rolAsignado: "VISUALIZADOR" })}>
                                    VISUALIZADOR
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </FormField>
                          </div>"""

replacement = """                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                            <FormField label="Nombre de la entidad" htmlFor="entidad-nombre-p2">
                              <Input
                                id="entidad-nombre-p2"
                                value={formData.nombreEntidad}
                                onChange={(e) => setFormData({ ...formData, nombreEntidad: e.target.value })}
                                className="text-xs font-semibold"
                                required
                              />
                            </FormField>

                            <FormField label="Domicilio de la entidad" htmlFor="entidad-domicilio-p2">
                              <Input
                                id="entidad-domicilio-p2"
                                value={formData.domicilioEntidad}
                                onChange={(e) => setFormData({ ...formData, domicilioEntidad: e.target.value })}
                                className="text-xs font-semibold"
                                required
                              />
                            </FormField>

                            <FormField label="Nombres de la máxima autoridad / delegado / representante legal" htmlFor="rep-legal-p2">
                              <Input
                                id="rep-legal-p2"
                                value={formData.representanteLegalNombre}
                                onChange={(e) => setFormData({ ...formData, representanteLegalNombre: e.target.value })}
                                className="text-xs font-semibold"
                                required
                              />
                            </FormField>

                            <FormField label="Nombre del trabajador/funcionario y/o servidor público" htmlFor="funcionario-nombre-p2">
                              <Input
                                id="funcionario-nombre-p2"
                                value={formData.funcionarioNombre}
                                onChange={(e) => setFormData({ ...formData, funcionarioNombre: e.target.value })}
                                className="text-xs font-semibold"
                                required
                              />
                            </FormField>

                            <FormField label="Cargo en la entidad" htmlFor="funcionario-cargo-p2">
                              <Input
                                id="funcionario-cargo-p2"
                                value={formData.funcionarioCargo}
                                onChange={(e) => setFormData({ ...formData, funcionarioCargo: e.target.value })}
                                className="text-xs font-semibold"
                                required
                              />
                            </FormField>

                            <FormField label="Rol: (COORDINADOR TITULAR, SUPLENTE, SUPERVISOR O VISUALIZADOR)" htmlFor="rol-select-p2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="w-full justify-between h-9 text-xs px-3 font-semibold bg-background"
                                    id="rol-select-p2"
                                  >
                                    {formData.rolAsignado}
                                    <ChevronDown className="size-4 opacity-50" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                                  <DropdownMenuItem onClick={() => setFormData({ ...formData, rolAsignado: "COORDINADOR TITULAR" })}>
                                    COORDINADOR TITULAR
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => setFormData({ ...formData, rolAsignado: "SUPLENTE" })}>
                                    SUPLENTE
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => setFormData({ ...formData, rolAsignado: "SUPERVISOR" })}>
                                    SUPERVISOR
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => setFormData({ ...formData, rolAsignado: "VISUALIZADOR" })}>
                                    VISUALIZADOR
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </FormField>
                          </div>"""

if target in content:
    content = content.replace(target, replacement)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Done")
else:
    # Try regex if exact whitespace differs
    import re
    target_re = re.sub(r'\s+', r'\\s+', target)
    if re.search(target_re, content):
        content = re.sub(target_re, replacement, content)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print("Done via regex")
    else:
        print("Target not found")
