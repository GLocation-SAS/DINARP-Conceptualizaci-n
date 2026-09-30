import re

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# I want to replace the div with a Card
old_div = '<div className="bg-surface border border-border rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-200 flex-1 min-h-0 overflow-y-auto">'
new_card = '<Card className="flex-1 min-h-0 flex flex-col w-full overflow-hidden border-border shadow-xs animate-in fade-in duration-200" innerClassName="p-6 sm:p-8 flex flex-col h-full bg-surface space-y-6 overflow-y-auto">'

content = content.replace(old_div, new_card)

# And close the card properly
old_close = '          </div>\n        ) : ('
new_close = '          </Card>\n        ) : ('

content = content.replace(old_close, new_close)

with open("src/app/wireframes2/asignacion-solicitudes/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)
