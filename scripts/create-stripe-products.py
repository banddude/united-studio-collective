#!/usr/bin/env python3
"""Create Stripe products, prices, and payment links for Justus Martin's 6 prints.

Mirrors the existing Cherry Blossom Tree pattern exactly:
- 3 Products per photo (Frameless / Framed Black / Framed White)
- Frameless price: $85 (8500). Framed prices: $110 (11000).
- Each price gets a Payment Link with US-only shipping, no phone, no promo codes.
"""

import base64
import json
import os
import sys
import time
import urllib.parse
import urllib.request
import urllib.error

API = "https://api.stripe.com/v1"
KEY = os.environ.get("STRIPE_SECRET_KEY")
if not KEY:
    sys.exit("STRIPE_SECRET_KEY not set")

REPO_RAW = "https://raw.githubusercontent.com/banddude/united-studio-collective/main/public"

PHOTOS = [
    {"slug": "01", "image": f"{REPO_RAW}/images/store/justus/JustusMartin1.jpg",
     "name": "Justus Martin \u2014 Selection 01"},
    {"slug": "02", "image": f"{REPO_RAW}/images/store/justus/JustusMartin2.jpg",
     "name": "Justus Martin \u2014 Selection 02"},
    {"slug": "03", "image": f"{REPO_RAW}/images/store/justus/JustusMartin3.jpg",
     "name": "Justus Martin \u2014 Selection 03"},
    {"slug": "04", "image": f"{REPO_RAW}/images/store/justus/JustusMartin4.jpg",
     "name": "Justus Martin \u2014 Selection 04"},
    {"slug": "05", "image": f"{REPO_RAW}/images/store/justus/JustusMartin5.jpg",
     "name": "Justus Martin \u2014 Selection 05"},
    {"slug": "06", "image": f"{REPO_RAW}/images/store/justus/JustusMartin6.jpg",
     "name": "Justus Martin \u2014 Selection 06"},
]

VARIANTS = [
    ("Frameless",     "frameless",     8500),
    ("Framed Black",  "framed_black",  11000),
    ("Framed White",  "framed_white",  11000),
]


def stripe(path, params):
    """POST form-encoded data to Stripe."""
    data = urllib.parse.urlencode(params, doseq=True).encode()
    auth = "Basic " + base64.b64encode((KEY + ":").encode()).decode()
    req = urllib.request.Request(
        API + path,
        data=data,
        headers={
            "Authorization": auth,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"FAILED {path}: HTTP {e.code} {body}", file=sys.stderr)
        raise


results = {}
for photo in PHOTOS:
    slug = photo["slug"]
    print(f"\n=== {photo['name']} ===", flush=True)
    photo_result = {"product_name": photo["name"], "image": photo["image"]}
    for label, key, amount in VARIANTS:
        product_name = f"{photo['name']} - {label}"
        print(f"  creating product: {product_name}", flush=True)
        prod = stripe("/products", {
            "name": product_name,
            "active": "true",
            "images[]": photo["image"],
            "shippable": "true",
        })
        prod_id = prod["id"]
        print(f"    product: {prod_id}", flush=True)

        price = stripe("/prices", {
            "product": prod_id,
            "currency": "usd",
            "unit_amount": str(amount),
        })
        price_id = price["id"]
        print(f"    price:   {price_id} (${amount/100:.2f})", flush=True)

        link = stripe("/payment_links", {
            "line_items[0][price]": price_id,
            "line_items[0][quantity]": "1",
            "shipping_address_collection[allowed_countries][]": "US",
            "phone_number_collection[enabled]": "false",
            "allow_promotion_codes": "false",
            "after_completion[type]": "hosted_confirmation",
        })
        link_url = link["url"]
        link_id = link["id"]
        print(f"    link:    {link_id} -> {link_url}", flush=True)

        photo_result[key] = link_url
        photo_result[f"{key}_price_id"] = price_id
        photo_result[f"{key}_product_id"] = prod_id
        photo_result[f"{key}_payment_link_id"] = link_id
        time.sleep(0.15)
    results[slug] = photo_result

out = "/tmp/justus_stripe_results.json"
with open(out, "w") as f:
    json.dump(results, f, indent=2)
print(f"\nWrote {out}")
