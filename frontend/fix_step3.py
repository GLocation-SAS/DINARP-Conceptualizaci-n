import re

file_path = "src/app/wireframes2/enrolamiento-coordinador/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix the signature blocks in Step 3
old_block1 = """                              <div className="p-3 rounded-xl border border-dashed border-border/80 bg-muted/10 space-y-1">"""
new_block1 = """                              <Card variant="featured" disableHover={true} className="p-3 rounded-xl border border-dashed border-border/80 bg-muted/10 space-y-1 shadow-none">
                                <CardDecorativeIcon className="-bottom-5 -right-5 opacity-10">
                                  <Building2 className="size-16 text-muted-foreground" />
                                </CardDecorativeIcon>"""

old_block2 = """                              <div className="p-3 rounded-xl border border-dashed border-primary/40 bg-primary/5 space-y-1">"""
new_block2 = """                              <Card variant="featured" disableHover={true} className="p-3 rounded-xl border border-dashed border-primary/40 bg-primary/5 space-y-1 shadow-none">
                                <CardDecorativeIcon className="-bottom-5 -right-5 opacity-10">
                                  <FileSignature className="size-16 text-primary" />
                                </CardDecorativeIcon>"""

# Find the end of these divs and change to </Card>
# We need to be careful. Let's just replace the blocks directly with Regex

content = content.replace(old_block1, new_block1)
content = content.replace(old_block2, new_block2)

# It's safer to just do a targeted replacement for the end tags of these blocks, but since we are modifying the start tags to Card, we MUST close with Card.
# Let's see how they are structured:

pattern_blocks = re.compile(r"""(                              <Card variant="featured".*?)(                              <\/div>\n)(                            <\/div>)""", re.DOTALL)

# Since we replaced the start tag with <Card ...>, the corresponding closing tags are currently </div>.
# Let's just run a replace on the exact text.
import textwrap

target_string = """                              <Card variant="featured" disableHover={true} className="p-3 rounded-xl border border-dashed border-border/80 bg-muted/10 space-y-1 shadow-none">
                                <CardDecorativeIcon className="-bottom-5 -right-5 opacity-10">
                                  <Building2 className="size-16 text-muted-foreground" />
                                </CardDecorativeIcon>
                                <div className="h-10 flex items-center justify-center text-muted-foreground italic text-[11px]">
                                  [Firma Electrónica Representante Legal]
                                </div>
                                <span className="font-bold text-foreground block text-[11px] border-t border-border pt-1">
                                  {formData.representanteLegalNombre}
                                </span>
                                <span className="text-[10px] text-muted-foreground block">
                                  Representante Legal / Delegado
                                </span>
                              </div>

                              <Card variant="featured" disableHover={true} className="p-3 rounded-xl border border-dashed border-primary/40 bg-primary/5 space-y-1 shadow-none">
                                <CardDecorativeIcon className="-bottom-5 -right-5 opacity-10">
                                  <FileSignature className="size-16 text-primary" />
                                </CardDecorativeIcon>
                                <div className="h-10 flex items-center justify-center text-primary font-semibold text-[11px]">
                                  Pendiente FirmaEC (Paso 4)
                                </div>
                                <span className="font-bold text-foreground block text-[11px] border-t border-border pt-1">
                                  {formData.funcionarioNombre}
                                </span>
                                <span className="text-[10px] text-muted-foreground block">
                                  Coordinador Designado ({formData.rolAsignado})
                                </span>
                              </div>"""

target_string_fixed = target_string.replace('                              </div>\n\n                              <Card', '                              </Card>\n\n                              <Card')
target_string_fixed = target_string_fixed.replace('                              </div>', '                              </Card>')

# However, the string in the file has different newlines/tabs depending on encoding. Let's do it cleanly:
content = content.replace('</span>\n                              </div>\n\n                              <Card', '</span>\n                              </Card>\n\n                              <Card')
content = content.replace('</span>\r\n                              </div>\r\n\r\n                              <Card', '</span>\r\n                              </Card>\r\n\r\n                              <Card')

content = content.replace('})\n                              </span>\n                              </div>', '})\n                              </span>\n                              </Card>')
content = content.replace('})\r\n                              </span>\r\n                              </div>', '})\r\n                              </span>\r\n                              </Card>')

# Make sure CardDecorativeIcon and Building2 are imported
if "Building2" not in content:
    content = content.replace("FileSignature,", "FileSignature,\n  Building2,")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed step 3 signature blocks!")
