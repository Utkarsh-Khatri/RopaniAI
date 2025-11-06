import sys
import os
import pytesseract
from PIL import Image
import cv2
import re
import numpy as np
from translator import translate_nepali_to_english

# Ensure correct Tesseract path
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def preprocess_image(image_path):
    """
    Enhanced preprocessing for Nepali Lalpurja documents.
    Returns multiple versions for better accuracy.
    """
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Failed to read image: {image_path}")
    
    # Resize image to improve OCR (scale up by 2x)
    height, width = img.shape[:2]
    img = cv2.resize(img, (width * 2, height * 2), interpolation=cv2.INTER_CUBIC)
    
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Method 1: Simple thresholding with lower threshold for dark text
    _, simple_thresh = cv2.threshold(gray, 140, 255, cv2.THRESH_BINARY)
    
    # Method 2: Adaptive thresholding (better for varying lighting)
    adaptive = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
        cv2.THRESH_BINARY, 15, 8
    )
    
    # Method 3: Otsu's thresholding (automatic threshold selection)
    blur = cv2.GaussianBlur(gray, (3, 3), 0)
    _, otsu = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    
    # Method 4: Contrast enhancement
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    enhanced = clahe.apply(gray)
    _, enhanced_thresh = cv2.threshold(enhanced, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    
    return gray, simple_thresh, adaptive, otsu, enhanced_thresh


def extract_text_multi_method(image_path):
    """
    Try multiple preprocessing methods and OCR configurations.
    Returns the best result.
    """
    gray, simple_thresh, adaptive, otsu, enhanced = preprocess_image(image_path)
    
    # Custom Tesseract configurations
    configs = [
        r'--oem 3 --psm 6',   # Uniform block of text
        r'--oem 3 --psm 4',   # Single column
        r'--oem 3 --psm 3',   # Fully automatic
    ]
    
    results = []
    
    # Try different preprocessing methods
    for name, img in [("gray", gray), ("simple", simple_thresh), 
                       ("adaptive", adaptive), ("otsu", otsu), 
                       ("enhanced", enhanced)]:
        for config in configs[:2]:  # Try first 2 configs only
            try:
                # Try with Nepali + English
                text = pytesseract.image_to_string(img, lang="nep+eng", config=config)
                results.append((f"{name}_{config[:10]}", text, len(text)))
            except Exception as e:
                print(f"Error with {name}: {e}")
                continue
    
    # Return the result with most extracted text
    if results:
        best = max(results, key=lambda x: x[2])
        print(f"Best method: {best[0]} (extracted {best[2]} chars)")
        return best[1]
    
    return ""


def extract_text_structured(image_path):
    """
    Extract text while preserving structure.
    """
    text = extract_text_multi_method(image_path)
    
    # Clean up while preserving structure
    lines = text.split("\n")
    cleaned_lines = []
    
    for line in lines:
        # Remove excessive whitespace but keep structure
        line = re.sub(r'\s+', ' ', line.strip())
        if line:
            cleaned_lines.append(line)
    
    return cleaned_lines, text


def extract_lalpurja_data(lines, raw_text):
    """
    Enhanced parser for Lalpurja data based on actual document structure.
    Focuses on 6-7 key fields.
    """
    data = {
        "owner_name": None,           # जग्गाधनीको नाम थर
        "father_name": None,          # बाबुको नाम / बुबाको नाम
        "citizenship_no": None,       # नागरिकता नं
        "district": None,             # जिल्ला
        "ward_no": None,              # वार्ड नं
        "kitta_no": None,             # कित्ता नं
        "area": None                  # क्षेत्रफल (रोपनी-आना-पैसा-दाम)
    }
    
    # Combine lines and raw text for better matching
    full_text = " ".join(lines)
    
    # Nepali patterns matching the actual Lalpurja format
    patterns = {
        "owner_name": [
            r"जग्गाधनीको\s*नाम\s*थर[:\s]*([^\n]+)",
            r"जग्गाधनी[:\s]*([^\n]+)",
            r"धनी[:\s]*([^\n]+)",
            r"जग्गाधनीको\s*नाम[:\s]*([^\n]+)"
        ],
        "father_name": [
            r"बाबुको\s*नाम[:\s]*([^\n]+)",
            r"बुबाको\s*नाम[:\s]*([^\n]+)",
            r"बाबु[:\s]*([^\n]+)",
            r"बुबा[:\s]*([^\n]+)"
        ],
        "citizenship_no": [
            r"नागरिकता\s*नं?[:\s]*([0-9\-/]+)",
            r"नागरिकता[:\s]*([0-9\-/]+)",
            r"citizenship[:\s]*([0-9\-/]+)"
        ],
        "district": [
            r"जिल्ला[:\s]*([^\n,]+)",
            r"जिल्ला[:\s]*([a-zA-Zअ-ह]+)",
            r"District[:\s]*([^\n,]+)"
        ],
        "ward_no": [
            r"वार्ड\s*नं?[:\s]*([0-9]+)",
            r"वडा\s*नं?[:\s]*([0-9]+)",
            r"Ward[:\s]*[Nn]?o?[:\s]*([0-9]+)"
        ],
        "kitta_no": [
            r"कित्ता\s*नं?[:\s]*([0-9]+)",
            r"किट्टा[:\s]*([0-9]+)",
            r"[Kk]itta[:\s]*([0-9]+)"
        ],
        "area": [
            r"क्षेत्रफल[:\s]*([0-9\-]+)",
            r"([0-9]+[-\s]+[0-9]+[-\s]+[0-9]+[-\s]+[0-9]+)",
            r"रोपनी[:\s]*([0-9\-]+)",
            r"([0-9]+)\s*रोपनी"
        ]
    }
    
    # Try to match each pattern
    for field, pattern_list in patterns.items():
        for pattern in pattern_list:
            # Search in individual lines first
            for line in lines:
                match = re.search(pattern, line, re.IGNORECASE)
                if match:
                    value = match.group(1).strip()
                    # Clean up extracted value
                    value = re.sub(r'[:\s]+$', '', value)
                    value = re.sub(r'\s+', ' ', value)
                    if value and not data[field]:
                        data[field] = value
                        print(f"Found {field}: {value}")
                        break
            
            # If not found in lines, try full text
            if not data[field]:
                match = re.search(pattern, full_text, re.IGNORECASE)
                if match:
                    value = match.group(1).strip()
                    value = re.sub(r'[:\s]+$', '', value)
                    value = re.sub(r'\s+', ' ', value)
                    if value:
                        data[field] = value
                        print(f"Found {field} in full text: {value}")
            
            if data[field]:
                break
    
    # Translate Nepali values to English (optional - you can comment this out if you want raw Nepali)
    translated_data = {}
    for key, value in data.items():
        if value and value.strip():
            # Check if value contains Nepali script
            if re.search(r'[\u0900-\u097F]', value):
                try:
                    translated = translate_nepali_to_english(value)
                    translated_data[key] = translated
                    print(f"Translated {key}: {value} -> {translated}")
                except:
                    translated_data[key] = value
            else:
                translated_data[key] = value
        else:
            translated_data[key] = None
    
    return translated_data


def read_lalpurja(image_path, debug=True):
    """
    Main function – OCR + extract structured data.
    Set debug=True to see OCR output.
    """
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image not found: {image_path}")
    
    print(f"Processing: {image_path}")
    
    # Extract text
    lines, raw_text = extract_text_structured(image_path)
    
    if debug:
        print("\n" + "="*50)
        print("EXTRACTED TEXT:")
        print("="*50)
        print(raw_text)
        print("\n" + "="*50)
        print("PARSED LINES:")
        print("="*50)
        for i, line in enumerate(lines, 1):
            print(f"{i}. {line}")
        print("="*50 + "\n")
    
    # Extract structured data
    extracted_data = extract_lalpurja_data(lines, raw_text)
    
    return extracted_data


if __name__ == "__main__":
    # Test with your image
    img_path = r"C:\Users\Roshan\OneDrive\Desktop\ropani AI\RopaniAI\Pictures\test_ocr.jpeg"
    
    try:
        data = read_lalpurja(img_path, debug=True)
        
        print("\n" + "="*50)
        print("EXTRACTED LALPURJA DATA:")
        print("="*50)
        for k, v in data.items():
            print(f"{k:.<30} {v}")
        print("="*50)
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()