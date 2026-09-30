import re

file_path = "src/app/wireframes2/enrolamiento-coordinador/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix hideCloseButton
content = content.replace("hideCloseButton={true}", "")
content = content.replace("hideCloseButton", "")

# Fix handleFirmaElectronica definition
# Check if it has forceError
if "const handleFirmaElectronica = (forceError = false) => {" in content:
    content = content.replace("const handleFirmaElectronica = (forceError = false) => {", "const handleFirmaElectronica = (forceError: boolean = false) => {")
elif "const handleFirmaElectronica = () => {" in content:
    content = content.replace("const handleFirmaElectronica = () => {", "const handleFirmaElectronica = (forceError: boolean = false) => {")
    content = content.replace("if (forceError) {", "if (forceError) {")

# Remove duplicate imports
import_block = re.search(r"import \{([^}]+)\} from \"lucide-react\";", content)
if import_block:
    imports = import_block.group(1).split(",")
    clean_imports = []
    seen = set()
    for imp in imports:
        cleaned = imp.strip()
        if cleaned and cleaned not in seen:
            seen.add(cleaned)
            clean_imports.append(cleaned)
    
    new_import_block = "import {\n  " + ",\n  ".join(clean_imports) + "\n} from \"lucide-react\";"
    content = content[:import_block.start()] + new_import_block + content[import_block.end():]

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed TS errors")
