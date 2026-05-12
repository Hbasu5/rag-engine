from PIL import Image
import pytesseract


def preprocess_image(image):
    """
    Basic preprocessing for OCR.
    """
    
    # Convert to grayscale
    image = image.convert("L")

    return image


def extract_text_from_image(image_path: str) -> str:
    """
    Extract text from image using OCR.
    """

    image = Image.open(image_path)

    image = preprocess_image(image)

    text = pytesseract.image_to_string(image)

    return text.strip()