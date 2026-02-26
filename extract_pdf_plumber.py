import pdfplumber
import sys

sys.stdout.reconfigure(encoding='utf-8')

pdf_path = "신환 2배 늘리는 치과 마케팅의 정석.pdf"

try:
    with pdfplumber.open(pdf_path) as pdf:
        print(f"Total Pages: {len(pdf.pages)}")
        for i, page in enumerate(pdf.pages):
            text = page.extract_text()
            if text:
                print(f"--- Page {i+1} ---")
                print(text)
            else:
                print(f"--- Page {i+1} (No Text Found) ---")
except Exception as e:
    print(f"Error: {e}")
