import re

def chunk_text(text, chunk_size=300, overlap=80):

    text = text.strip()

    if not text:
        return []

    sentences = re.split(r'(?<=[.!?])\s+', text)

    chunks = []
    current_chunk = ""

    for sentence in sentences:

        # fallback for weird empty splits
        if not sentence.strip():
            continue

        if len(current_chunk) + len(sentence) <= chunk_size:

            current_chunk += " " + sentence

        else:

            if current_chunk.strip():
                chunks.append(current_chunk.strip())

            current_chunk = sentence

    if current_chunk.strip():
        chunks.append(current_chunk.strip())

    # FINAL SAFETY FALLBACK
    if not chunks and text:
        chunks.append(text)

    return chunks