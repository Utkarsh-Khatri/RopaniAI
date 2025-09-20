from deep_translator import GoogleTranslator

def translate_nepali_to_english(text):
    """
    Translate Nepali text to English
    """
    try:
        translated = GoogleTranslator(source='nepali', target='english').translate(text)
        return translated
    except Exception as e:
        print("Translation failed:", e)
        return text  # fallback to original
