from app.core.chunking import chunk_text
from app.retrieval.web_search import search_web
from app.retrieval.web_scraper import scrape_webpage


def build_web_context(query, max_results):
    max_results	 = max(1, min(max_results, 10))
    search_results = search_web(query, max_results)
    web_sources=[]
    web_context = ""
    
    valid_sources=0

    for index, result in enumerate(search_results, start=1):

        title = result["title"]
        url = result["url"]
        web_sources.append(f"{title} — {url}")

        scraped_text = scrape_webpage(url)
        chunks = chunk_text(scraped_text)
        selected_chunks = chunks[:3]
        formatted_chunks = "\n\n".join(selected_chunks)
        if not scraped_text:
            continue
        if len(scraped_text.strip())<200:
            continue
        valid_sources+=1
        web_context += f"""
[WEB SOURCE {index}]
TITLE: {title}
URL: {url}

CONTENT:
{formatted_chunks}

==================================================
"""

    return web_context, valid_sources, web_sources