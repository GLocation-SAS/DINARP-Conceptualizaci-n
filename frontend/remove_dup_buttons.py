import re

file_path = "src/app/wireframes2/enrolamiento-coordinador/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Remove the inline buttons from step 4
old_buttons = """                              <div className="flex items-center justify-end gap-2">
                                <Button type="button" variant="outline" size="sm" onClick={() => handleFirmaElectronica(true)} className="text-[10px] h-7 border-danger/30 text-danger hover:bg-danger/10 shadow-xs"><AlertCircle className="size-3 mr-1" /> Simular Falla</Button>
                                <Button type="button" variant="outline" size="sm" onClick={() => handleFirmaElectronica(false)} className="text-[10px] h-7 border-success/30 text-success hover:bg-success/10 shadow-xs"><CheckCircle2 className="size-3 mr-1" /> Simular Éxito</Button>
                              </div>"""

# Ensure cross-platform matching
pattern_buttons = re.compile(r"                              <div className=\"flex items-center justify-end gap-2\">\n                                <Button.*?Simular Falla<\/Button>\n                                <Button.*?Simular Éxito<\/Button>\n                              <\/div>", re.DOTALL)
match_buttons = pattern_buttons.search(content)

if not match_buttons:
    # Try again with Unicode encoding issue bypass
    pattern_buttons = re.compile(r"                              <div className=\"flex items-center justify-end gap-2\">\n                                <Button.*?Falla<\/Button>\n                                <Button.*?xito<\/Button>\n                              <\/div>", re.DOTALL)
    match_buttons = pattern_buttons.search(content)
    
if match_buttons:
    content = content[:match_buttons.start()] + content[match_buttons.end():]
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Removed duplicate inline buttons!")
else:
    print("Could not find inline buttons to remove")
