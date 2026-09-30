import re

with open("src/app/wireframes2/acceso-seguridad/data/gestion-ingresos-store.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Make sure SOL-ING-102 to SOL-ING-107 are in PENDIENTE_ASIGNACION_NORMATIVIDAD
# Also clear their revisorNormatividad

for i in range(102, 108):
    pattern = rf'(id: "SOL-ING-{i}".*?estado:\s*)"[A-Z_]+"'
    content = re.sub(pattern, rf'\1"PENDIENTE_ASIGNACION_NORMATIVIDAD"', content, flags=re.DOTALL)
    
    pattern2 = rf'(id: "SOL-ING-{i}".*?)revisorNormatividad:\s*"[^"]*"'
    content = re.sub(pattern2, rf'\1revisorNormatividad: undefined', content, flags=re.DOTALL)

with open("src/app/wireframes2/acceso-seguridad/data/gestion-ingresos-store.ts", "w", encoding="utf-8") as f:
    f.write(content)
