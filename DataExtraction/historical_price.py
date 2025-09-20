#!/usr/bin/env python3
"""
Basobaas scraper - extracts Price, Title, Location, Tags, Features, URL
Usage: python basobaas_scraper.py
"""

import time
import re
from urllib.parse import urljoin
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import pandas as pd

# ----------------------
START_PAGE = 1      # first page to scrape
END_PAGE   = 20     # last page to scrape (increase if you want more)
OUT_CSV    = "basobaas_listings.csv"
BASE_URL   = "https://basobaas.com/for-sale?page={}"
# ----------------------

def create_driver(headless=True):
    options = Options()
    # headless run - set False if you want to see the browser
    if headless:
        # use --headless for wide compatibility; change to "--headless=new" if you have recent Chrome
        options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    # friendly user-agent (helps avoid trivial bot-blocking)
    options.add_argument("user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                         "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36")
    # reduce selenium detection
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option("useAutomationExtension", False)

    # If Chrome isn't in the default location on your Mac, you can uncomment and adjust:
    # options.binary_location = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)

    # try to hide "webdriver" flag (best-effort)
    try:
        driver.execute_cdp_cmd(
            "Page.addScriptToEvaluateOnNewDocument",
            {"source": "Object.defineProperty(navigator, 'webdriver', {get: () => undefined})"}
        )
    except Exception:
        pass

    return driver

def scrape_page(soup):
    """
    Given a BeautifulSoup of the page, return a list of dict rows.
    Strategy: find price nodes (h4.cost-label), fallback to searching h4 containing 'Rs.' then walk up to parent card.
    """
    rows = []

    # primary selector: site uses <h4 class="... cost-label ..."> for price
    price_nodes = soup.find_all('h4', class_='cost-label')

    # fallback: any <h4> that looks like a price (contains Rs. / Per / रू / रु)
    if not price_nodes:
        all_h4 = soup.find_all('h4')
        price_nodes = [h for h in all_h4 if re.search(r'Rs\.|रु|रू|Per|NPR', h.get_text(), re.I)]

    for price_node in price_nodes:
        try:
            # walk up a few levels to find the containing card that also has title/address
            parent = price_node
            title_tag = None
            address_tag = None
            for _ in range(8):
                if parent is None:
                    break
                title_tag = parent.find('h3', class_='title-label') or parent.find('h3')
                address_tag = parent.find('span', class_='address-label') or parent.find('span', class_='address-label')
                if title_tag or address_tag:
                    break
                parent = parent.parent
            if parent is None:
                parent = price_node.find_parent('div') or price_node.parent

            price_text = price_node.get_text(" ", strip=True)

            # title
            title_text = title_tag.get_text(" ", strip=True) if title_tag else None
            if not title_text:
                h3 = parent.find('h3')
                title_text = h3.get_text(" ", strip=True) if h3 else None

            # location/address
            address_text = None
            addr = parent.find('span', class_='address-label')
            if addr:
                address_text = addr.get_text(" ", strip=True)
            else:
                # find short span text with a comma (e.g. "suntakhan, Kathmandu")
                for sp in parent.find_all('span'):
                    txt = sp.get_text(" ", strip=True)
                    if ',' in txt and 5 < len(txt) < 100:
                        address_text = txt
                        break

            # tags like Land / Sale / featured
            tags = [t.get_text(strip=True) for t in parent.find_all('span', class_='ant-tag')]

            # features: kitchen/bedroom/bathroom/area etc.
            raw_feats = [s.get_text(" ", strip=True) for s in parent.find_all('span', class_='ant-typography')]
            # filter for likely features (digits or known keywords) else keep raw_feats
            features = [f for f in raw_feats if re.search(r'\d|bed|bath|kitchen|aana|kattha|dhur|sq|per|area|रु|Rs', f, re.I)]
            if not features:
                features = raw_feats

            # detail URL (if present)
            a = parent.find('a', href=True)
            url = urljoin("https://basobaas.com", a['href']) if a else None

            rows.append({
                "Price": price_text,
                "Title": title_text,
                "Location": address_text,
                "Tags": ", ".join(tags) if tags else "",
                "Features": ", ".join(features) if features else "",
                "URL": url
            })
        except Exception as e:
            # don't crash on a single bad card; log and continue
            print("parse error for one listing:", str(e))
            continue

    return rows

def main():
    print("Starting Basobaas scraper...")
    driver = create_driver(headless=True)
    all_rows = []
    try:
        for page in range(START_PAGE, END_PAGE + 1):
            url = BASE_URL.format(page)
            print(" -> Loading", url)
            driver.get(url)
            # wait for JS to populate the DOM (increase sleep if your net is slow)
            time.sleep(4)
            soup = BeautifulSoup(driver.page_source, "html.parser")
            rows = scrape_page(soup)
            print(f"    Page {page}: extracted {len(rows)} listings")
            all_rows.extend(rows)
    finally:
        driver.quit()

    # deduplicate by URL if available, otherwise Title+Price
    seen = set()
    unique = []
    for r in all_rows:
        key = (r.get("URL") or "") or ( (r.get("Title") or "") + "|" + (r.get("Price") or "") )
        if key in seen:
            continue
        seen.add(key)
        unique.append(r)

    print("Total unique records:", len(unique))
    df = pd.DataFrame(unique)
    df.to_csv(OUT_CSV, index=False)
    print("Saved results to", OUT_CSV)

if __name__ == "__main__":
    main()
