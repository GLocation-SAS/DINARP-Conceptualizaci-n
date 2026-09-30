
import os
import codecs

file_path = r"src\app\wireframes2\enrolamiento-coordinador\page.tsx"
with open(file_path, "rb") as f:
    raw = f.read()

if raw.startswith(codecs.BOM_UTF8):
    raw = raw[len(codecs.BOM_UTF8):]
elif raw.startswith(codecs.BOM_UTF16_LE):
    raw = raw.decode("utf-16-le").encode("utf-8")
elif raw.startswith(codecs.BOM_UTF16_BE):
    raw = raw.decode("utf-16-be").encode("utf-8")

with open(file_path, "wb") as f:
    f.write(raw)
print("Stripped BOM / Fixed Encoding")

