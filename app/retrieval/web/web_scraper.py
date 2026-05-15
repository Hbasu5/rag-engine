import requests
import trafilatura


def scrape_webpage(url):
    try:
        response = requests.get(
            url,
            timeout=10,
            headers={
                "User-Agent": "Mozilla/5.0"
            }
        )

        if response.status_code != 200:
            return None

        extracted_text = trafilatura.extract(response.text)

        return extracted_text

    except Exception as e:
        print(f"Scraping Error: {e}")
        return None