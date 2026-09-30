import re

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the content of TabsList
old_tabs_list = """                <TabsList className="h-auto p-1.5 rounded-full bg-background border border-border/40 inline-flex gap-1.5 flex-nowrap w-full sm:w-auto justify-start">
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
                    <FileText className="size-4 shrink-0" />
                    <span>3. Servicios y Procesos</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="tab-3"
                    className="px-5 py-2 text-xs font-bold gap-2 data-[state=active]:bg-primary-300 data-[state=active]:text-white data-[state=active]:[&_svg]:text-white dark:data-[state=active]:bg-primary-300 dark:data-[state=active]:text-white dark:data-[state=active]:[&_svg]:text-white"
                  >
                    <ShieldCheck className="size-4 shrink-0" />
                    <span>4. Declaraciones y firma</span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="tab-4"
                    className="px-5 py-2 text-xs font-bold gap-2 data-[state=active]:bg-primary-300 data-[state=active]:text-white data-[state=active]:[&_svg]:text-white dark:data-[state=active]:bg-primary-300 dark:data-[state=active]:text-white dark:data-[state=active]:[&_svg]:text-white"
                  >
                    <History className="size-4 shrink-0" />
                    <span>5. Trazabilidad</span>
                  </TabsTrigger>
                </TabsList>"""

new_tabs_list = """                <TabsList className="h-auto p-1.5 rounded-full bg-background border border-border/40 inline-flex gap-1.5 flex-nowrap w-full sm:w-auto justify-start overflow-x-auto">
                  {(currentUser.role === "DIR_NORMATIVA" || currentUser.role === "EQ_NORMATIVA") ? (
                    <>
                      <TabsTrigger
                        value="tab-5"
                        className="px-5 py-2 text-xs font-bold gap-2 data-[state=active]:bg-primary-300 data-[state=active]:text-white data-[state=active]:[&_svg]:text-white dark:data-[state=active]:bg-primary-300 dark:data-[state=active]:text-white dark:data-[state=active]:[&_svg]:text-white whitespace-nowrap"
                      >
                        <FileText className="size-4 shrink-0" />
                        <span>Información del trámite</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="tab-6"
                        className="px-5 py-2 text-xs font-bold gap-2 data-[state=active]:bg-primary-300 data-[state=active]:text-white data-[state=active]:[&_svg]:text-white dark:data-[state=active]:bg-primary-300 dark:data-[state=active]:text-white dark:data-[state=active]:[&_svg]:text-white whitespace-nowrap"
                      >
                        <FileSignature className="size-4 shrink-0" />
                        <span>Resolución</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="tab-4"
                        className="px-5 py-2 text-xs font-bold gap-2 data-[state=active]:bg-primary-300 data-[state=active]:text-white data-[state=active]:[&_svg]:text-white dark:data-[state=active]:bg-primary-300 dark:data-[state=active]:text-white dark:data-[state=active]:[&_svg]:text-white whitespace-nowrap"
                      >
                        <History className="size-4 shrink-0" />
                        <span>Trazabilidad</span>
                      </TabsTrigger>
                    </>
                  ) : (
                    <>
                      <TabsTrigger
                        value="tab-0"
                        className="px-5 py-2 text-xs font-bold gap-2 data-[state=active]:bg-primary-300 data-[state=active]:text-white data-[state=active]:[&_svg]:text-white dark:data-[state=active]:bg-primary-300 dark:data-[state=active]:text-white dark:data-[state=active]:[&_svg]:text-white whitespace-nowrap"
                      >
                        <Building2 className="size-4 shrink-0" />
                        <span>1. Entidad y Autoridad</span>
                      </TabsTrigger>

                      <TabsTrigger
                        value="tab-1"
                        className="px-5 py-2 text-xs font-bold gap-2 data-[state=active]:bg-primary-300 data-[state=active]:text-white data-[state=active]:[&_svg]:text-white dark:data-[state=active]:bg-primary-300 dark:data-[state=active]:text-white dark:data-[state=active]:[&_svg]:text-white whitespace-nowrap"
                      >
                        <User className="size-4 shrink-0" />
                        <span>2. Coordinadores</span>
                      </TabsTrigger>

                      <TabsTrigger
                        value="tab-2"
                        className="px-5 py-2 text-xs font-bold gap-2 data-[state=active]:bg-primary-300 data-[state=active]:text-white data-[state=active]:[&_svg]:text-white dark:data-[state=active]:bg-primary-300 dark:data-[state=active]:text-white dark:data-[state=active]:[&_svg]:text-white whitespace-nowrap"
                      >
                        <FileText className="size-4 shrink-0" />
                        <span>3. Servicios y Procesos</span>
                      </TabsTrigger>

                      <TabsTrigger
                        value="tab-3"
                        className="px-5 py-2 text-xs font-bold gap-2 data-[state=active]:bg-primary-300 data-[state=active]:text-white data-[state=active]:[&_svg]:text-white dark:data-[state=active]:bg-primary-300 dark:data-[state=active]:text-white dark:data-[state=active]:[&_svg]:text-white whitespace-nowrap"
                      >
                        <ShieldCheck className="size-4 shrink-0" />
                        <span>4. Declaraciones y firma</span>
                      </TabsTrigger>

                      <TabsTrigger
                        value="tab-4"
                        className="px-5 py-2 text-xs font-bold gap-2 data-[state=active]:bg-primary-300 data-[state=active]:text-white data-[state=active]:[&_svg]:text-white dark:data-[state=active]:bg-primary-300 dark:data-[state=active]:text-white dark:data-[state=active]:[&_svg]:text-white whitespace-nowrap"
                      >
                        <History className="size-4 shrink-0" />
                        <span>5. Trazabilidad</span>
                      </TabsTrigger>
                    </>
                  )}
                </TabsList>"""

content = content.replace(old_tabs_list, new_tabs_list)

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
