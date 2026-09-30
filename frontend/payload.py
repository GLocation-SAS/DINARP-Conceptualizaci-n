import base64
code = ""
with open("safe_fix_b64.py", "w", encoding="utf-8") as f:
    f.write(base64.b64decode(code).decode('utf-8'))
