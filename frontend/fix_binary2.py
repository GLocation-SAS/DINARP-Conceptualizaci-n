
import chardet

file_path = r"src\app\wireframes2\enrolamiento-coordinador\page.tsx"
with open(file_path, "rb") as f:
    raw = f.read()

res = chardet.detect(raw)
enc = res["encoding"]
print("Detected:", enc)

if enc:
    text = raw.decode(enc)
    # just to be safe, replace weird zero-width spaces or nulls
    text = text.replace("\x00", "")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(text)
    print("Fixed!")

