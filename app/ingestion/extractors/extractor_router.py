from pathlib import Path

from app.ingestion.extractors.txt_extractor import extract_text_from_txt
from app.ingestion.extractors.ocr_extractor import extract_text_from_image
from app.ingestion.extractors.audio_extractor import extract_text_from_audio


SUPPORTED_IMAGE_TYPES = {
    ".png",
    ".jpg",
    ".jpeg"
}

SUPPORTED_AUDIO_TYPES = {
    ".mp3",
    ".wav",
    ".m4a"
}


def extract_text(file_path: str) -> str:

    extension = Path(file_path).suffix.lower()

    if extension in [".txt", ".md"]:
        return extract_text_from_txt(file_path)

    elif extension in SUPPORTED_IMAGE_TYPES:
        return extract_text_from_image(file_path)

    elif extension in SUPPORTED_AUDIO_TYPES:
        return extract_text_from_audio(file_path)

    else:
        raise ValueError(f"Unsupported file type: {extension}")