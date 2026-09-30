import re

file_path = "src/app/wireframes2/enrolamiento-coordinador/page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Make it so that simulating click bypassing the existingSolicitud block by forcing step 2 when using the form buttons!
old_val = '''// Cargar datos en el formulario Anexo B y pasar al Paso 1 obligatoriamente
        setExistingSolicitud(null);'''

new_val = '''// Cargar datos en el formulario Anexo B y pasar al Paso 1 obligatoriamente
        setExistingSolicitud(null);
        
        // Evitamos que salte la alerta de que ya tiene solicitud si queremos simular llenado
        const simulaSol = solicitudes.find((s) => s.tipoTramite === "PROCESO_B_ENROLAMIENTO_COORDINADOR" && s.cedula === cleanCed);
        if (simulaSol && cleanCed !== "1712345602") {
          setExistingSolicitud(simulaSol);
        } else {
          setExistingSolicitud(null);
        }
'''

content = content.replace(old_val, new_val)

# Also let's completely stop using useEffect to override existingSolicitud when we click the demo buttons.
old_effect = '''  // Actualizar solicitud existente si cambia store
  useEffect(() => {
    if (preregistroCargado?.cedula) {
      const sol = solicitudes.find(
        (s) => s.tipoTramite === "PROCESO_B_ENROLAMIENTO_COORDINADOR" && s.cedula === preregistroCargado.cedula
      );
      if (sol) {
        setExistingSolicitud(sol);
      }
    }
  }, [solicitudes, preregistroCargado]);'''

new_effect = '''  // Actualizar solicitud existente si cambia store
  useEffect(() => {
    if (preregistroCargado?.cedula) {
      const sol = solicitudes.find(
        (s) => s.tipoTramite === "PROCESO_B_ENROLAMIENTO_COORDINADOR" && s.cedula === preregistroCargado.cedula
      );
      // Solo sobreescribir si queremos mostrar el estado de éxito final.
      // Ocultar si estamos usando botones de demo
      if (sol && preregistroCargado.cedula !== "1715489621" && preregistroCargado.cedula !== "1712345602") {
        setExistingSolicitud(sol);
      }
    }
  }, [solicitudes, preregistroCargado]);'''

content = content.replace(old_effect, new_effect)

# Additionally, the "Titular" & "Suplente" buttons need to actually bypass to Step 2, and maybe call handleSimulateFillAnexoB. Let's fix that.
if "setStep(1);" in content:
    # Instead of setStep(1), we might want to let the user see the "Titular" success state on screen, wait.
    # Ah, the user is stuck because when existingSolicitud is true, the form is hidden and it shows the big "Tu registro fue aprobado".
    pass

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated bypass")
