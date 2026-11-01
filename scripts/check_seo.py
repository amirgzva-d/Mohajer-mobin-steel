#!/usr/bin/env python3
"""Validate crawlable pages, truthful product data, canonical links and sitemap."""
from pathlib import Path
from urllib.parse import urlsplit
import json
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
DOMAIN = "https://mohajer-steel.com"
PRODUCTS = [
    "steel-billet", "steel-slab", "rebar", "steel-angle", "steel-channel",
    "steel-beam", "steel-pipe", "steel-profile", "steel-flat-bar",
    "steel-plate", "galvanized-steel-coil", "steel-wire",
]
HUB = DOMAIN + "/products/"
xml = ET.parse(ROOT / "sitemap.xml")
locs = [x.text for x in xml.findall(".//{*}loc")]
assert len(set(locs)) == len(locs), "Duplicate sitemap URLs"
assert HUB in locs, "Product hub missing from sitemap"
assert all(DOMAIN + "/products/" + slug + "/" in locs for slug in PRODUCTS)

for url in locs:
    parsed = urlsplit(url)
    assert parsed.scheme == "https" and parsed.netloc == "mohajer-steel.com", url
    path = ROOT / parsed.path.lstrip("/") / "index.html"
    assert path.is_file(), f"Sitemap URL has no static HTML: {url}"
    html = path.read_text(encoding="utf-8")
    assert '<link rel="canonical" href="' + url + '"' in html, url
    assert re.search(r"<title>[^<]+</title>", html), url
    assert '<meta name="description"' in html, url

for slug in PRODUCTS:
    html = (ROOT / "products" / slug / "index.html").read_text(encoding="utf-8")
    assert html.count("<h1") == 1, f"Expected one h1: {slug}"
    assert 'href="../"' in html or slug == "steel-billet", f"Missing hub link: {slug}"
    assert 'hreflang="en"' not in html or "#english" not in html, slug
    schema = re.search(r'<script type="application/ld\+json">([\s\S]*?)</script>', html)
    assert schema, slug
    obj = json.loads(schema.group(1))
    product = next(x for x in obj["@graph"] if x["@type"] == "Product")
    assert "manufacturer" not in product and "brand" not in product, slug
    crumbs = next(x for x in obj["@graph"] if x["@type"] == "BreadcrumbList")
    assert crumbs["itemListElement"][1]["item"] == HUB, slug
    assert html.count('rel="canonical"') == 1, slug

hub = (ROOT / "products" / "index.html").read_text(encoding="utf-8")
assert hub.count('class="product-card"') == 12
for slug in PRODUCTS:
    assert 'href="' + slug + '/"' in hub, slug

print(f"SEO validation passed: {len(locs)} sitemap URLs and {len(PRODUCTS)} products.")

# Prevent stale promotional price data from being presented as current market facts.
home = (ROOT / "index.html").read_text(encoding="utf-8")
for stale in ["42,000,000", "39,500,000", "669,000", "667,000", "670,000", "۵ مرداد ۱۴۰۴"]:
    assert stale not in home, f"Stale indicative price/date published as current: {stale}"
assert 'id="weight-guide"' in (ROOT / "products/rebar/index.html").read_text(encoding="utf-8")
assert "۳۴۰" in (ROOT / "guides/rebar-grades/index.html").read_text(encoding="utf-8")

# Multilingual product and corporate content: reciprocal, canonical, indexable.
BILINGUAL = [
 ("/products/steel-billet/","/en/products/steel-billet/"),
 ("/products/rebar/","/en/products/rebar/"),
 ("/products/steel-plate/","/en/products/steel-plate/"),
 ("/products/steel-slab/","/en/products/steel-slab/"),
 ("/steel-export/","/en/steel-export/"),
 ("/trading/","/en/trading/"),
]
for fa, en in BILINGUAL:
 for path, language in ((fa,"fa-IR"),(en,"en")):
  html = (ROOT / path.lstrip("/") / "index.html").read_text(encoding="utf-8")
  assert f'rel="canonical" href="{DOMAIN}{path}"' in html, path
  assert f'hreflang="fa-IR" href="{DOMAIN}{fa}"' in html, path
  assert f'hreflang="en" href="{DOMAIN}{en}"' in html, path
  assert f'{DOMAIN}{path}' in locs, path
  assert html.count("<h1") == 1, path
assert (DOMAIN+"/en/") in locs
assert "Steel export" in (ROOT / "en" / "index.html").read_text(encoding="utf-8") or "steel export" in (ROOT / "en" / "index.html").read_text(encoding="utf-8")

# Keep the four priority price-intent landing pages distinct and clear about quotation.
PRIORITY_TITLES = {
  "steel-billet": "قیمت شمش فولادی 3SP و 5SP | خرید و صادرات | فولاد مهاجر",
  "rebar": "قیمت میلگرد A2 و A3 و A4 | خرید و صادرات | فولاد مهاجر",
  "steel-plate": "قیمت ورق فولادی ST37 و ST52 | خرید و صادرات | فولاد مهاجر",
  "steel-slab": "قیمت اسلب فولادی | خرید و صادرات تختال | فولاد مهاجر"
}
for product_slug, expected_title in PRIORITY_TITLES.items():
    product_html = (ROOT / "products" / product_slug / "index.html").read_text(encoding="utf-8")
    assert f"<title>{expected_title}</title>" in product_html, product_slug
    assert "استعلام قیمت" in product_html, product_slug
    assert f'/en/products/{product_slug}/' in product_html, product_slug
