import os

from app.ingestion.extractors.extractor_router import extract_text


def load_documents(folder_path="uploads"):
    documents = []

    for file in os.listdir(folder_path):

        path = os.path.join(folder_path, file)

        try:
            text = extract_text(path)

            if text:
                documents.append(text)

        except Exception as e:
            print(f"Failed to process {file}: {e}")

    return documents