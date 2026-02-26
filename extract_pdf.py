import pypdf
import sys

# Set stdout to utf-8 explicitly to avoid encoding errors in terminal
sys.stdout.reconfigure(encoding='utf-8')

pdf_path = "신환 2배 늘리는 치과 마케팅의 정석.pdf"

try:
    reader = pypdf.PdfReader(pdf_path)
    print(f"Total Pages: {len(reader.pages)}")
    full_text = ""
    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        print(f"--- Page {i+1} ---")
        print(text)
        full_text += text + "\n"
        
except Exception as e:
    print(f"Error: {e}")
