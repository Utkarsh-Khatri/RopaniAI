import sys
import os
import pytesseract
from PIL import Image
import cv2
import numpy as np
from translator import translate_nepali_to_english  # your translator.py

# -------------------------
# Add project root to Python path (for standalone script)
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# -------------------------

# Make sure pytesseract knows where your tesseract executable
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def read_lalpurja(image_path):
    """
    Reads Nepali + English text from a Lalpurja image and returns a dictionary of extracted fields.
    """
    # Convert to absolute path
    image_path = os.path.abspath(image_path)

    # Check if image exists
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image not found: {image_path}")

    # Load image
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Failed to read image: {image_path}")

    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Optional: thresholding for better OCR accuracy
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY)

    # OCR with Nepali + English
    text = pytesseract.image_to_string(thresh, lang='nep+eng')

    # Split into lines and clean
    lines = [line.strip() for line in text.split('\n') if line.strip() != '']

    extracted_data = {}

    # Basic example: look for known field names in Nepali
    for line in lines:
        if "नाम" in line:  # Name
            extracted_data['name_nepali'] = line.split(":")[-1].strip()
            extracted_data['name_english'] = translate_nepali_to_english(extracted_data['name_nepali'])
        elif "ठेगाना" in line:  # Address
            extracted_data['address_nepali'] = line.split(":")[-1].strip()
            extracted_data['address_english'] = translate_nepali_to_english(extracted_data['address_nepali'])
        elif "जन्म मिति" in line:  # Date of birth
            extracted_data['dob'] = line.split(":")[-1].strip()
        # Add more fields as needed

    return extracted_data

if __name__ == "__main__":
    # Your image path
    img_path = r"pictures\test_ocr.jpeg"  # Windows-safe path
    data = read_lalpurja(img_path)
    print("Extracted Data:", data)
