
import json

log_path = r"c:\Users\Paula\.gemini\antigravity\brain\6f136686-84e5-4501-bcc0-09ac96cac24b\.system_generated\logs\transcript_full.jsonl"
file_path = r"src\app\wireframes2\enrolamiento-coordinador\page.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

with open(log_path, "r", encoding="utf-8") as f:
    for line in f:
        try:
            entry = json.loads(line)
            if entry.get("type") == "PLANNER_RESPONSE":
                for call in entry.get("tool_calls", []):
                    if call.get("name") == "replace_file_content":
                        args = call.get("args", {})
                        target_file = args.get("TargetFile", "")
                        if "enrolamiento-coordinador" in target_file:
                            target = args.get("TargetContent", "")
                            replacement = args.get("ReplacementContent", "")
                            
                            if target in content:
                                content = content.replace(target, replacement)
                                print("Applied an edit.")
                            else:
                                target_cr = target.replace("\n", "\r\n")
                                if target_cr in content:
                                    content = content.replace(target_cr, replacement)
                                    print("Applied an edit with CRLF.")
                                else:
                                    # try stripping \r
                                    content_stripped = content.replace("\r", "")
                                    target_stripped = target.replace("\r", "")
                                    if target_stripped in content_stripped:
                                        print("Could apply if stripped, doing it manual fallback...")
                                        idx = content_stripped.find(target_stripped)
                                        # not safe to replace directly if lengths differ, just replace on stripped
                                        content = content_stripped.replace(target_stripped, replacement)
                                    else:
                                        print("Failed to apply an edit. Target not found.")
        except Exception as e:
            pass

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Done.")

