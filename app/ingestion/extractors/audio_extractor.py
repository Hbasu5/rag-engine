import whisper


model = whisper.load_model("tiny")


def extract_text_from_audio(audio_path: str) -> str:

    result = model.transcribe(audio_path)

    return result["text"].strip()