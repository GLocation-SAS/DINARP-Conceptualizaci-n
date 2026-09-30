import re

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix KPI 2
content = content.replace(
    '                          {currentUser.role === "EQ_GESTION" ? "Aprobadas" : "En revisión"}\n                        </h3>',
    '                          {currentUser.role === "EQ_GESTION" ? "Aprobadas" : (currentUser.role === "DIR_NORMATIVA" || currentUser.role === "EQ_NORMATIVA" ? "Asignadas" : "En revisión")}\n                        </h3>'
)
content = content.replace(
    '                          {currentUser.role === "EQ_GESTION" ? "Aprobadas" : "En revisin"}\n                        </h3>',
    '                          {currentUser.role === "EQ_GESTION" ? "Aprobadas" : (currentUser.role === "DIR_NORMATIVA" || currentUser.role === "EQ_NORMATIVA" ? "Asignadas" : "En revisión")}\n                        </h3>'
)

content = content.replace(
    '                        {currentUser.role === "EQ_GESTION" ? "Solicitudes aprobadas" : "Actualmente en análisis"}\n                      </p>',
    '                        {currentUser.role === "EQ_GESTION" ? "Solicitudes aprobadas" : (currentUser.role === "DIR_NORMATIVA" || currentUser.role === "EQ_NORMATIVA" ? "En gestión de resolución" : "Actualmente en análisis")}\n                      </p>'
)
content = content.replace(
    '                        {currentUser.role === "EQ_GESTION" ? "Solicitudes aprobadas" : "Actualmente en anǭlisis"}\n                      </p>',
    '                        {currentUser.role === "EQ_GESTION" ? "Solicitudes aprobadas" : (currentUser.role === "DIR_NORMATIVA" || currentUser.role === "EQ_NORMATIVA" ? "En gestión de resolución" : "Actualmente en análisis")}\n                      </p>'
)

# Fix KPI 3
content = content.replace(
    '                          {currentUser.role === "EQ_GESTION" ? "Rechazadas" : "Finalizadas"}\n                        </h3>',
    '                          {currentUser.role === "EQ_GESTION" ? "Rechazadas" : (currentUser.role === "DIR_NORMATIVA" || currentUser.role === "EQ_NORMATIVA" ? "Resoluciones generadas" : "Finalizadas")}\n                        </h3>'
)
content = content.replace(
    '                        {currentUser.role === "EQ_GESTION" ? "Solicitudes rechazadas" : "Trámites concluidos"}\n                      </p>',
    '                        {currentUser.role === "EQ_GESTION" ? "Solicitudes rechazadas" : (currentUser.role === "DIR_NORMATIVA" || currentUser.role === "EQ_NORMATIVA" ? "Resoluciones emitidas" : "Trámites concluidos")}\n                      </p>'
)
content = content.replace(
    '                        {currentUser.role === "EQ_GESTION" ? "Solicitudes rechazadas" : "Trǭmites concluidos"}\n                      </p>',
    '                        {currentUser.role === "EQ_GESTION" ? "Solicitudes rechazadas" : (currentUser.role === "DIR_NORMATIVA" || currentUser.role === "EQ_NORMATIVA" ? "Resoluciones emitidas" : "Trámites concluidos")}\n                      </p>'
)

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
