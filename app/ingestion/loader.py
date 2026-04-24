import os

def load_documents(folder_path="data/raw"):
    documents = []

    for file in os.listdir(folder_path):
        path = os.path.join(folder_path, file)

        if file.endswith(".txt") or file.endswith(".md"):
            with open(path, "r", encoding="utf-8") as f:
                documents.append(f.read())

    return documents
