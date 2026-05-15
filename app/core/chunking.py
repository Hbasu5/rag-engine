def chunk_text(
    text,
    chunk_size=500,
    overlap=100
):

    if not text:
        return []

    text = text.strip()

    if not text:
        return []

    sentences = text.split(". ")

    chunks = []
    current_chunk = ""

    for sentence in sentences:

        sentence = sentence.strip()

        if not sentence:
            continue

        # Add sentence safely
        tentative = current_chunk + sentence + ". "

        if len(tentative) <= chunk_size:

            current_chunk = tentative

        else:

            if current_chunk:
                chunks.append(current_chunk.strip())

            # overlap handling
            overlap_text = current_chunk[-overlap:]

            current_chunk = overlap_text + sentence + ". "

    if current_chunk:
        chunks.append(current_chunk.strip())

    return chunks