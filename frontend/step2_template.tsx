                    {/* 🟢 PASO 2: ACUERDO DE USO Y CONFIDENCIALIDAD 🟢 */}
                    {step === 2 && (
                      <div className="space-y-6 animate-in fade-in duration-200">
                        {/* Bloque 1: Comparecientes */}
                        <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
                          <div className="bg-secondary/10 border-b border-secondary/20 p-4 sm:px-6 flex items-center justify-between -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 rounded-t-2xl mb-6">
                            <div>
                              <h3 className="text-base font-bold font-heading text-secondary-800 flex items-center gap-2">
                                <Building2 className="size-5 text-secondary-700" />
                                2.1 Datos de los Intervinientes
                              </h3>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Suscripción del Acuerdo ARP-R02 entre la DINARP y la institución solicitante.
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
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
                          </div>
                        </div>

                        {/* Bloque 2: Misión y Visión */}
                        <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
                          <div className="bg-secondary/10 border-b border-secondary/20 p-4 sm:px-6 flex items-center justify-between -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 rounded-t-2xl mb-6">
                            <div>
                              <h3 className="text-base font-bold font-heading text-secondary-800 flex items-center gap-2">
                                <FileText className="size-5 text-secondary-700" />
                                2.2 Antecedentes Institucionales
                              </h3>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Justificación formal de la necesidad de uso de los datos del SINARP.
                              </p>
                            </div>
                          </div>

                          <FormField label="Misión y Visión de la entidad compareciente" htmlFor="mision-p2" required>
                            <Textarea
                              id="mision-p2"
                              value={formData.misionVisionInstitucional}
                              onChange={(e) => setFormData({ ...formData, misionVisionInstitucional: e.target.value })}
                              className="text-xs min-h-[90px] leading-relaxed"
                              required
                            />
                          </FormField>
                        </div>

                        {/* Bloque 3: Base Legal y Cláusulas Operativas */}
                        <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
                          <div className="bg-secondary/10 border-b border-secondary/20 p-4 sm:px-6 flex items-center justify-between -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 rounded-t-2xl mb-6">
                            <div>
                              <h3 className="text-base font-bold font-heading text-secondary-800 flex items-center gap-2">
                                <ShieldCheck className="size-5 text-secondary-700" />
                                2.3 Cláusulas Legales del Instrumento Oficial (ARP-R02)
                              </h3>
                              <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                                Términos y condiciones jurídicas del acuerdo de uso.
                              </p>
                            </div>
                            <div className="hidden sm:block text-right">
                              <span className="text-[10px] font-bold font-mono text-secondary-800 tracking-wider">VERSIÓN: 1.0 - VIGENCIA: 20-06-2025</span>
                            </div>
                          </div>

                          <div className="bg-muted/10 border border-border rounded-xl p-4 sm:p-5 h-[350px] overflow-y-auto text-[11.5px] leading-relaxed text-muted-foreground space-y-4 text-justify custom-scrollbar pr-4">
                            <p>
                              <strong>CLÁUSULA TERCERA. – BASE LEGAL:</strong><br />
                              1. El artículo 66 numeral 19 del artículo 66 de la Constitución de la República del Ecuador establece: “Se reconoce y garantizará a las personas: (…) El derecho a la protección de datos de carácter personal, que incluye el acceso y la decisión sobre información y datos de este carácter, así como su correspondiente protección. La recolección, archivo, procesamiento, distribución o difusión de estos datos o información requerirán la autorización del titular o el mandato de la Ley”.<br /><br />
                              2. La Ley Orgánica del Sistema Nacional de Registros Públicos, publicada en el Registro Oficial nro. 162 de 31 de marzo de 2010, crea a la Dirección Nacional de Registros Públicos, como organismo de derecho público, con personería jurídica, autonomía administrativa, técnica, operativa, financiera y presupuestaria, adscrita al Ministerio de Telecomunicaciones y Sociedad de la Información.<br /><br />
                              3. La Ley indicada en el párrafo anterior, en su artículo 4, prescribe: “Las instituciones del sector público y privado y las personas naturales que actualmente o en el futuro administren bases o registros de datos públicos, son responsables de la integridad, protección y control de los registros y bases de datos a su cargo. Dichas instituciones responderán por la veracidad, autenticidad, custodia y debida conservación de los registros. La responsabilidad sobre la veracidad y autenticidad de los datos registrados, es exclusiva de la o el declarante cuando esta o este provee toda la información (…)”.<br /><br />
                              4. El artículo 28 de la norma ut supra establece: “Créase el Sistema Nacional de Registros Públicos con la finalidad de proteger los derechos constituidos, los que se constituyan, modifiquen, extingan y publiciten por efectos de la inscripción de los hechos, actos y/o contratos determinados por la presente Ley y las leyes y normas de registros; y con el objeto de coordinar el intercambio de información de los registros públicos. En el caso de que entidades privadas posean información que por su naturaleza sea pública, serán incorporadas a este sistema.”<br /><br />
                              5. El artículo 27 de la Ley ibidem establece: “Las Registradoras o Registradores y máximas autoridades, a quienes se autoriza el manejo de las licencias para el acceso a los registros de datos utilizados por la ley, serán las o los responsables directos administrativa, civil y penalmente por el mal uso de las mismas”.<br /><br />
                              6. Asimismo, el artículo 29 de la Ley Orgánica del Sistema Nacional de Registros Públicos, determina que: “El Sistema Nacional de Registros Públicos estará conformado por los registros: civil, de la propiedad, mercantil, societario, datos de conectividad electrónica, vehicular, de naves y aeronaves, patentes, de propiedad intelectual registros de datos crediticios y todos los registros de datos de las instituciones públicas y privadas que mantuvieren y administren por disposición legal información registral de carácter público”.<br /><br />
                              7. El artículo 2 de la Ley Orgánica de Protección de Datos Personales, establece que la mentada Ley, (…) se aplicará al tratamiento de datos personales contenidos en cualquier tipo de soporte, automatizados o no, así como a toda modalidad de uso posterior. (…)<br /><br />
                              8. El artículo 7 de la norma ut supra, determina: “El tratamiento será legítimo y lícito si se cumple con alguna de las siguientes condiciones: (…) 2) Que sea realizado por el responsable del tratamiento en cumplimiento de una obligación legal; 3) Que sea realizado por el responsable del tratamiento, por orden judicial, debiendo observarse los principios de la presente Ley; 4) Que el tratamiento de datos personales se sustente en el cumplimiento de una misión realizada en interés público o en el ejercicio de poderes públicos conferidos al responsable, derivados de una competencia atribuida por una norma con rango de ley, sujeto al cumplimiento de los estándares internacionales de derechos humanos aplicables a la materia, al cumplimiento de los principios de esta Ley y a los criterios de legalidad, proporcionalidad y necesidad;(…)<br /><br />
                              9. Los literales a, b, d, e y g del artículo 10 de la Ley Orgánica de Protección de Datos Personales, estipula entre sus principios: “a) Juridicidad. - Los datos personales deben tratarse con estricto apego y cumplimiento a los principios, derechos y obligaciones establecidas en la Constitución, los instrumentos internacionales, la presente Ley, su Reglamento y la demás normativa y jurisprudencia aplicable; b) Lealtad.- El tratamiento de datos personales deberá ser leal, por lo que para los titulares debe quedar claro que se están recogiendo, utilizando, consultando o tratando de otra manera, datos personales que les conciernen, así como las formas en que dichos datos son o serán tratados. En ningún caso los datos personales podrán ser tratados a través de medios o para fines, ilícitos o desleales.; d) Finalidad.- Las finalidades del tratamiento deberán ser determinadas, explícitas, legítimas y comunicadas al titular: no podrán tratarse datos personales con fines distintos para los cuales fueron recopilados, a menos que concurra una de las causales que habiliten un nuevo tratamiento conforme los supuestos de tratamiento legítimo señalados en esta Ley. El tratamiento de datos personales con fines distintos de aquellos para los que hayan sido recogidos inicialmente solo debe permitirse cuando sea compatible con los fines de su recogida inicial. Para ello, habrá de considerarse el contexto en el que se recogieron los datos, la información facilitada al titular en ese proceso y, en particular, las expectativas razonables del titular basadas en su relación con el responsable en cuanto a su uso posterior, la naturaleza de los datos personales, las consecuencias para los titulares del tratamiento ulterior previsto y la existencia de garantías adecuadas tanto en la operación de tratamiento original como en la operación de tratamiento ulterior prevista.; e) Pertinencia y minimización de datos personales. - Los datos personales deben ser pertinentes y estar limitados a lo estrictamente necesario para el cumplimiento de la finalidad del tratamiento. (…);“g) Confidencialidad. - El tratamiento de datos personales debe concebirse sobre la base del debido sigilo y secreto, es decir, no debe tratarse o comunicarse para un fin distinto para el cual fueron recogidos, a menos que concurra una de las causales que habiliten un nuevo tratamiento conforme los supuestos de tratamiento legítimo señalados en esta ley. Para tal efecto, el responsable del tratamiento deberá adecuar las medidas técnicas organizativas para cumplir con este principio”.<br /><br />
                              10. El artículo 38 de la Ley Orgánica de Protección de Datos Personales, estipula: “El mecanismo gubernamental de seguridad de la información deberá incluir las medidas que deban implementarse en el caso de tratamiento de datos personales para hacer frente a cualquier riesgo, amenaza., vulnerabilidad, accesos no autorizados, pérdidas, alteraciones, destrucción o comunicación accidental o ilícita en el tratamiento de los datos conforme al principio de seguridad de datos personales. El mecanismo gubernamental de seguridad de la información abarcará y aplicará a todas las instituciones del sector público, contenidas en el artículo 225 de la Constitución de la República de Ecuador, así como a terceros que presten servicios públicos mediante concesión, u otras figuras legalmente reconocidas. Estas, podrán incorporar medidas adicionales al mecanismo gubernamental de seguridad de la información”.<br /><br />
                              11. El artículo 46 de la Ley Orgánica de Protección de Datos Personales, prescribe: “El responsable del tratamiento deberá notificar sin dilación la vulneración de seguridad de datos personales al titular cuando conlleve un riesgo a sus derechos fundamentales y libertades individuales, dentro del término de tres días contados a partir de la fecha en la que tuvo conocimiento del riesgo. No se deberá notificar la vulneración de seguridad de datos personales al titular en los siguientes casos: 1. Cuando el responsable del tratamiento haya adoptado medidas de protección técnicas organizativas o de cualquier otra índole apropiadas aplicadas a los datos personales afectados por la vulneración de seguridad que se pueda demostrar que son efectivas; 2. Cuando el responsable del tratamiento haya tomado medidas que garanticen que el riesgo para los derechos fundamentales y las libertades individuales del titular, no ocurrirá; y, 3. Cuando se requiera un esfuerzo desproporcionado para hacerlo; en cuyo caso, el responsable del tratamiento deberá realizar una comunicación pública a través de cualquier medio en la que se informe de la vulneración de seguridad de datos personales a los titulares. 4. La procedencia de las excepciones de los numerales 1 y 2 deberá ser calificada por la Autoridad de Protección de Datos, una vez informada esta tan pronto sea posible, y en cualquier caso dentro de los plazos contemplados en el Articulo 43. 5. La notificación al titular del dato objeto de la vulneración de segundad contendrá lo señalado en el artículo 43 de esta ley. 6. En caso de que el responsable del tratamiento de los datos personales no cumpliese oportunamente y de modo justificado con la notificación será sancionado conforme al régimen sancionatorio previsto en esta ley. 7. La notificación oportuna de la violación por parte del responsable del tratamiento al titular y la ejecución oportuna de medidas de respuesta, serán consideradas atenuante de la infracción”.<br /><br />
                              12. El artículo 178 del Código Orgánico Integral Penal establece: “La persona que, sin contar con el consentimiento o la autorización legal, acceda, intercepte, examine, retenga, grabe, reproduzca, difunda o publique datos personales, mensajes de datos, voz, audio y vídeo, objetos postales, información contenida en soportes informáticos, comunicaciones privadas o reservadas de otra persona por cualquier medio, será sancionada con pena privativa de libertad de uno a tres años (…)”.<br /><br />
                              13. El artículo 229 del código ibidem, manifiesta: “Revelación ilegal de base de datos.- La persona que, en provecho propio o de un tercero, revele información registrada, contenida en ficheros, archivos, bases de datos o medios semejantes, a través o dirigidas a un sistema electrónico, informático, telemático o de telecomunicaciones; materializando voluntaria e intencionalmente la violación del secreto, la intimidad y la privacidad de las personas, será sancionada con pena privativa de libertad de uno a tres años”.
                            </p>

                            <p>
                              <strong>CLÁUSULA CUARTA. - DE LA PROTECCIÓN DE LA INFORMACIÓN Y EL TRATAMIENTO:</strong><br />
                              Los intervinientes de forma libre y voluntaria se obligan a guardar la confidencialidad y reserva de la información, respecto al acceso y uso de las herramientas que provee la Dirección Nacional de Registros Públicos, quien en cumplimiento de sus atribuciones y facultades determinadas en la Ley Orgánica del Sistema Nacional de Registros Públicos, controlará y supervisará que las entidades pertenecientes al Sistema Nacional de Registros Públicos, incorporen mecanismos de protección de datos personales; de igual manera dará cumplimiento a las disposiciones establecidas en la Ley Orgánica de Protección de Datos Personales, su reglamento de aplicación y demás normativa que emita la Autoridad de Protección de Datos Personales.<br />
                              El acceso a la consulta y tratamiento de la información contenida en las herramientas que proporciona la Dirección Nacional de Registros Públicos, se sujetará a las condiciones de legitimación para el tratamiento de datos personales y principalmente a los principios de legalidad, finalidad, pertinencia, minimización y las demás previstos en el ordenamiento jurídico ecuatoriano aplicables.<br />
                              Los intervinientes quedan obligados a utilizar única y exclusivamente la información para los fines determinados por la entidad, considerando que todas las acciones reguladas por la Dirección Nacional de Registros Públicos en el ejercicio de sus funciones no podrán ser reveladas, divulgadas, transferidas, utilizadas o expuestas para propósitos distintos a los autorizados por la Dirección Nacional de Registros Públicos; sin perjuicio de legalidad o licitud que las mismas puedan suponer.
                            </p>

                            <p>
                              <strong>CLÁUSULA QUINTA. – OBLIGACIONES DE LOS INTERVINIENTES:</strong><br />
                              LOS INTERVINIENTES se obliga a:<br />
                              a. Utilizar los accesos al Sistema Nacional de Registros Públicos, exclusivamente para los propósitos determinados en sus funciones o cargo, y siempre que los mismos guarden estricta relación con el objeto social o competencias institucionales, legales de la entidad a la que pertenece.<br />
                              b. Velar por el buen uso de la información que integra el Sistema Nacional de Registros Públicos.<br />
                              c. Implementar y/o utilizar las medidas de seguridad adecuadas y necesarias, entendiéndose por tales las aceptadas por el estado de la técnica, sean estas organizativas, técnicas o de cualquier otra índole, para proteger los datos personales, frente a cualquier riesgo, amenaza, vulnerabilidad, atendiendo a la naturaleza de los datos de carácter personal, al ámbito y el contexto.<br />
                              d. Implementar y/o utilizar un proceso de verificación, evaluación y valoración continua permanente de la eficiencia, eficacia y efectividad de las medidas de carácter técnico, organizativo y de cualquier otra índole, implementadas con el objeto de garantizar y mejorar la seguridad del tratamiento de datos personales.<br />
                              e. Implementar y/o utilizar políticas de trazabilidad que determinen fecha, hora y servidor que ha tenido acceso a la plataforma y a los datos.<br />
                              f. Notificar a la Dirección Nacional de Registro de Datos Públicos cualquier vulneración de los sistemas que pueda representar un riesgo para los datos personales, sus titulares o la plataforma del Sistema Nacional de Registros Públicos, sin perjuicio de las notificaciones que debe realizar a la Superintendencia de Protección de Datos Personales y al titular, conforme a la Ley Orgánica de Protección de Datos Personales.<br />
                              g. Tratar los datos con estricto apego y cumplimiento a los principios, derechos y obligaciones establecidas en la Constitución, instrumentos internacionales, Ley Orgánica de Protección de Datos Personales, su Reglamento y demás normativa que emita la Superintendencia de Protección de Datos Personales.<br />
                              h. Llevar un registro, que permita mantener un detalle actualizado de las gestiones realizadas.<br />
                              i. Al finalizar sus funciones deberá existir, un acta-entrega recepción donde conste el detalle de sus actividades y productos generados.<br />
                              j. Y demás obligaciones que se encuentren establecidas en las normas creadas para el afecto.
                            </p>

                            <p>
                              <strong>CLÁUSULA SEXTA. - PROHIBICIONES DE LOS INTERVINIENTES:</strong><br />
                              LOS INTERVINIENTES no podrán:<br />
                              4.1 Modificar, alterar, divulgar, comercializar de manera total o parcial la información y/o herramientas a la cual obtuviere acceso.<br />
                              4.2 Publicar, difundir, ceder, trasmitir o permitir a terceros no autorizados el acceso total o parcial a la información incorporada en el Sistema Nacional de Registros Públicos.<br />
                              4.3 Revelar, compartir o difundir por cualquier medio la clave de acceso al Sistema Nacional de Registros Públicos.<br />
                              4.4 Hacer uso de las claves de acceso cuando está haciendo uso de vacaciones o permisos.
                            </p>

                            <p>
                              <strong>CLÁUSULA SÉPTIMA. – RESPONSABILIDAD:</strong><br />
                              LOS INTERVINIENTES serán responsables civiles, administrativo y penalmente por el incumplimiento del presente acuerdo de uso y confidencialidad.<br />
                              Al suscribir el presente, los intervinientes aceptan de manera libre y voluntaria que la Dirección Nacional de Registros Públicos, no será responsable bajo ninguna circunstancia, por los daños o perjuicios de cualquier naturaleza que pudieran derivarse por el uso indebido que el o los usuarios hagan de la información, los sistemas y/o herramientas a las que tengan acceso, ni por errores en la información consultada, ingresada, procesada u obtenida, quedando bajo la exclusiva responsabilidad de los intervinientes la verificación y correcto uso de las mismas.
                            </p>

                            <p>
                              <strong>CLÁUSULA OCTAVA. - DECLARACIONES:</strong><br />
                              8.1. LOS INTERVINIENTES, declaran conocer que todos los registros públicos que forman parte del Sistema Nacional de Registros Públicos, contienen datos accesibles y confidenciales; los primeros hacen referencia a toda aquella información que está sujeta al principio de publicidad, mientras que los segundos son aquellos datos personales que para su acceso por parte de terceros requieren de consentimiento, mandato de ley u orden judicial; y que, en atención a la naturaleza de los datos y a los riesgos que el mal uso y/o divulgación de los mismos implican para la Dirección Nacional de Registros Públicos; así como, del Sistema Nacional de Registros Públicos, se comprometen a mantener en forma estrictamente reservada y confidencial toda la información que por razón de su competencia tengan acceso. Asimismo, se obligan a abstenerse de usar, disponer, divulgar y/o publicar por cualquier medio, oral, escrito, y/o tecnológico y en general, aprovecharse de ella en cualquier otra forma para efectos ajenos a los intereses de la entidad a la que pertenece.<br />
                              8.2.- LOS INTERVINIENTES declaran que conocen los servicios que brinda la Dirección Nacional de Registros Públicos, así como los numerales 11, 19 del artículo 66 de la Constitución de la República del Ecuador; artículo 6 de la ley Orgánica del Sistema Nacional de Registros Públicos; numeral 2 del artículo 21 de la Ley Orgánica para la Optimización y Eficiencia de Trámites Administrativos; numeral 4 del artículo 6 de la Ley Orgánica de Transparencia y Acceso a la Información Pública; artículo 2 , 7, 10, 11, 25 y 26 de la Ley Orgánica de Protección de Datos Personales; y, los artículos 178, 180 y 229 del Código Orgánico Integral Penal; artículo 32 de la Ley de Comercio Electrónico, Firmas Electrónicas y Mensajes de Datos.<br />
                              8.3.- LOS INTERVINIENTES declaran, que conocen los procedimientos de acceso a los servicios y/o herramientas informáticas que provee la DINARP; y se comprometen a cumplir con el ordenamiento jurídico vigente y lo determinado pro el presente instrumento jurídico.
                            </p>

                            <p>
                              <strong>CLÁUSULA NOVENA. - VIGENCIA:</strong><br />
                              Los compromisos establecidos en el presente acuerdo de uso y confidencialidad tendrán vigencia únicamente mientras el COORDINADOR TITULAR, SUPLENTE, SUPERVISOR O VISUALIZADOR se encuentren en funciones dentro de la institución a las cuales pertenecen y en el marco de las atribuciones de su cargo a partir de la fecha de su suscripción, sin embargo, podrá ser revocada cuando las condiciones legales lo ameriten.<br />
                              En caso de secesión de funciones, terminación laboral, desvinculación, renuncia, cambio administrativo o cualquier otra circunstancia que implique la desvinculación de el o los Coordinadores institucionales de la entidad a la que pertenece el usuario deberá notificar formalmente a la DINARP, en virtud de la normativa vigente.
                            </p>

                            <p>
                              <strong>CLÁUSULA DÉCIMA. - ACEPTACIÓN:</strong><br />
                              LOS INTERVINIENTES aceptan el contenido de todas y cada una de las cláusulas del presente acuerdo y en consecuencia se comprometen a cumplirlas en toda su extensión, en fe de lo cual y para los fines legales correspondientes, suscriben el presente documento.
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl hover:bg-primary/10 transition-colors">
                            <Checkbox
                              id="clausulas-check"
                              checked={formData.clausulasAceptadas}
                              onCheckedChange={(c) => setFormData({ ...formData, clausulasAceptadas: Boolean(c) })}
                              className="size-5 rounded data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary shrink-0"
                            />
                            <Label htmlFor="clausulas-check" className="text-[13px] sm:text-sm cursor-pointer font-bold text-foreground leading-snug">
                              He leído, comprendo y acepto expresamente las 10 cláusulas del Acuerdo de Uso y Confidencialidad oficial (Formulario ARP-R02). <span className="text-danger">*</span>
                            </Label>
                          </div>
                        </div>

                        {/* Credenciales de Acceso */}
                        <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
                          <div className="bg-secondary/10 border-b border-secondary/20 p-4 sm:px-6 flex items-center justify-between -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 rounded-t-2xl mb-6">
                            <div>
                              <h3 className="text-base font-bold font-heading text-secondary-800 flex items-center gap-2">
                                <KeyRound className="size-5 text-secondary-700" />
                                2.4 Configuración de Credenciales de Acceso
                              </h3>
                              <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                                Define la contraseña que utilizarás para autenticarte una vez aprobada tu solicitud en Gestión.
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                            <FormField label="Contraseña" htmlFor="pass-p2" required>
                              <InputGroup>
                                <InputGroupInput
                                  id="pass-p2"
                                  type={showPassword ? "text" : "password"}
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  className="text-xs"
                                  placeholder="Mínimo 8 caracteres"
                                  required
                                />
                                <InputGroupButton
                                  type="button"
                                  variant="ghost"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="size-9 px-0"
                                >
                                  <KeyRound className="size-4 opacity-70" />
                                </InputGroupButton>
                              </InputGroup>
                            </FormField>

                            <FormField label="Confirmar Contraseña" htmlFor="confirm-pass-p2" required>
                              <InputGroup>
                                <InputGroupInput
                                  id="confirm-pass-p2"
                                  type={showPassword ? "text" : "password"}
                                  value={confirmPassword}
                                  onChange={(e) => setConfirmPassword(e.target.value)}
                                  className="text-xs"
                                  placeholder="Repita la contraseña"
                                  required
                                />
                                <InputGroupButton
                                  type="button"
                                  variant="ghost"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="size-9 px-0"
                                >
                                  <KeyRound className="size-4 opacity-70" />
                                </InputGroupButton>
                              </InputGroup>
                            </FormField>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="default"
                            onClick={() => setStep(1)}
                            className="text-xs font-semibold gap-2 rounded-full px-5 h-10"
                          >
                            <ArrowLeft className="size-4" />
                            <span>Anterior paso</span>
                          </Button>

                          <Button
                            type="button"
                            variant="primary"
                            size="default"
                            disabled={!formData.clausulasAceptadas || !password || password !== confirmPassword}
                            onClick={() => setStep(3)}
                            className="text-xs font-semibold gap-2 shadow-md rounded-full px-6 h-10"
                          >
                            <span>Siguiente paso</span>
                            <ArrowRight className="size-4" />
                          </Button>
                        </div>
                      </div>
                    )}
