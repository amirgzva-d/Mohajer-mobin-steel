#!/usr/bin/env python3
"""Generate crawlable, bilingual steel product landing pages."""

from __future__ import annotations

import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE_URL = "https://mohajer-steel.com"

PRODUCTS = [
    {
        "slug": "steel-billet", "fa": "شمش فولادی", "en": "Steel Billet", "key": "round",
        "image": "https://res.cloudinary.com/dqhbyqftq/image/upload/v1784520479/%D8%B4%D9%85%D8%B4_ccazwm.png",
        "grades": "ST 3SP، ST 4SP و ST 5SP", "sizes": "مقاطع 100×100 تا 150×150 میلی‌متر؛ طول 6، 12 متر یا سفارشی",
        "use": "خوراک خطوط نورد میلگرد، مفتول، مقاطع ساختمانی و قطعه‌سازی",
        "intro": "فولاد مهاجر مبین تأمین و صادرات شمش فولادی 3SP، 4SP و 5SP را برای کارخانه‌های نورد و خریداران عمده انجام می‌دهد. ابعاد، گرید، آنالیز و شرایط تحویل پیش از صدور پیش‌فاکتور با درخواست خریدار تطبیق داده می‌شود.",
        "english": "Mohajer Mobin Steel supplies Iranian steel billets for rolling mills and international buyers. Available grades, dimensions, inspection requirements, packing and delivery terms are confirmed for each commercial inquiry.",
        "keywords": ["خرید شمش فولادی", "صادرات شمش 5SP", "قیمت شمش فولادی صادراتی", "Iran steel billet exporter"],
    },
    {
        "slug": "steel-slab", "fa": "اسلب فولادی", "en": "Steel Slab", "key": "slab",
        "image": "https://res.cloudinary.com/dqhbyqftq/image/upload/v1784520476/%D8%A7%D8%B3%D9%84%D8%A8_lyxy3f_zd5abm.png",
        "grades": "گریدهای صنعتی بر اساس سفارش و آنالیز مورد تأیید خریدار", "sizes": "ضخامت و عرض مطابق ظرفیت تولیدکننده و سفارش تجاری",
        "use": "تولید ورق گرم، پلیت و محصولات تخت فولادی",
        "intro": "اسلب فولادی برای خطوط نورد محصولات تخت و تولید ورق تأمین می‌شود. تیم بازرگانی فولاد مهاجر مبین مشخصات ابعادی، آنالیز، مقدار سفارش، بازرسی و برنامه حمل را پیش از قرارداد هماهنگ می‌کند.",
        "english": "Steel slabs are sourced for flat-product rolling and plate manufacturing. Mohajer Mobin Steel coordinates technical specifications, mill availability, inspection and export delivery for qualified orders.",
        "keywords": ["خرید اسلب فولادی", "صادرات اسلب", "تأمین کننده اسلب ایران", "Iran steel slab supplier"],
    },
    {
        "slug": "rebar", "fa": "میلگرد فولادی", "en": "Steel Rebar", "key": "rebar",
        "image": "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto:good/v1782902904/%D9%85%DB%8C%D9%84%DA%AF%D8%B1%D8%AF_fw75cx.webp",
        "grades": "A2 (340)، A3 (400) و A4 (500)", "sizes": "قطر 8 تا 40 میلی‌متر؛ شاخه 12 متری یا برش سفارشی",
        "use": "مسلح‌سازی بتن در پروژه‌های ساختمانی، عمرانی و زیرساختی",
        "intro": "میلگرد آجدار صادراتی در گریدها و سایزهای متداول پروژه تأمین می‌شود. فولاد مهاجر مبین برای هر استعلام، کارخانه، استاندارد، وزن بندیل، مقدار سفارش و محل تحویل را به‌صورت شفاف اعلام می‌کند.",
        "english": "Mohajer Mobin Steel supplies deformed reinforcing bars for construction and infrastructure projects. Grade, diameter, bundle weight, standard, inspection and export documents are confirmed against the buyer's inquiry.",
        "keywords": ["خرید میلگرد صادراتی", "صادرات میلگرد ایران", "تأمین کننده میلگرد", "Iranian rebar exporter"],
    },
    {
        "slug": "steel-angle", "fa": "نبشی فولادی", "en": "Steel Angle", "key": "angle",
        "image": "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto:good/v1782902904/%D9%86%D8%A8%D8%B4%DB%8C_fbbc6a.webp",
        "grades": "S235JR، S275JR و S355JR", "sizes": "بال 25 تا 100 میلی‌متر؛ طول 6، 12 متر یا سفارشی",
        "use": "اتصالات سازه‌ای، خرپا، دکل، قاب و ساخت قطعات صنعتی",
        "intro": "نبشی فولادی بال‌مساوی برای مصارف سازه‌ای و صنعتی با امکان تأمین سطح خام، گالوانیزه یا آسترشده عرضه می‌شود. مشخصات نهایی بر مبنای نقشه یا درخواست فنی خریدار کنترل خواهد شد.",
        "english": "Equal steel angles are supplied for structural connections, trusses, towers and fabrication. Material grade, leg size, thickness, finish and commercial delivery terms are verified per inquiry.",
        "keywords": ["خرید نبشی فولادی", "صادرات نبشی", "نبشی بال مساوی", "steel angle supplier Iran"],
    },
    {
        "slug": "steel-channel", "fa": "ناودانی فولادی", "en": "Steel Channel", "key": "channels",
        "image": "https://res.cloudinary.com/dqhbyqftq/image/upload/v1784520478/%D9%86%D9%88%D8%A7%D8%AF%D8%A7%D9%86%DB%8C_fvix6k.png",
        "grades": "S235JR، S275JR و S355JR", "sizes": "مقاطع UPN متداول؛ طول 6، 12 متر یا سفارشی",
        "use": "قاب‌سازی، شاسی، سازه فلزی و تکیه‌گاه‌های صنعتی",
        "intro": "ناودانی نورد گرم UPN برای پروژه‌های سازه‌ای و ساخت تجهیزات قابل تأمین است. سایز، وزن واحد طول، گرید، پوشش سطح و تلرانس مورد نیاز در پیشنهاد فنی و تجاری درج می‌شود.",
        "english": "Hot-rolled UPN channels are supplied for frames, supports, industrial structures and fabrication. Section size, grade, surface condition, tolerance and shipment terms are confirmed before order.",
        "keywords": ["خرید ناودانی UPN", "صادرات ناودانی فولادی", "قیمت ناودانی صادراتی", "steel channel exporter Iran"],
    },
    {
        "slug": "steel-beam", "fa": "تیرآهن فولادی", "en": "Steel Beam", "key": "beams",
        "image": "https://res.cloudinary.com/dqhbyqftq/image/upload/v1784520475/%D8%AA%DB%8C%D8%B1%D8%A7%D9%87%D9%86_xcypso.png",
        "grades": "S275JR، S355JR و S355J2", "sizes": "سایزهای سازه‌ای متداول؛ شاخه 6، 12 متر یا سفارشی",
        "use": "اسکلت فلزی، سوله، پل، سازه صنعتی و پروژه‌های سنگین",
        "intro": "تیرآهن و تیرآهن بال‌پهن برای پروژه‌های ساختمانی و صنعتی از منابع تولیدی معتبر تأمین می‌شود. جدول اشتال، وزن، استاندارد، گرید و شرایط بازرسی مطابق استعلام خریدار بررسی می‌شود.",
        "english": "Structural steel beams and wide-flange sections are sourced for buildings and industrial projects. Section, unit weight, grade, standard, inspection and loading plan are matched to the buyer's request.",
        "keywords": ["خرید تیرآهن صادراتی", "صادرات تیرآهن ایران", "تأمین تیرآهن", "Iran steel beam exporter"],
    },
    {
        "slug": "steel-pipe", "fa": "لوله فولادی", "en": "Steel Pipe", "key": "pipes",
        "image": "https://res.cloudinary.com/dqhbyqftq/image/upload/v1784520475/%D9%84%D9%88%D9%84%D9%87_d5rvnj_jrwiqj.png",
        "grades": "گرید و استاندارد مطابق کاربرد و درخواست خریدار", "sizes": "درزدار یا بدون درز؛ طول 6، 12 متر یا سفارشی",
        "use": "انتقال سیال و گاز، سازه، تأسیسات و کاربرد صنعتی",
        "intro": "لوله فولادی سیاه یا گالوانیزه، درزدار یا بدون درز، بر اساس کاربرد پروژه تأمین می‌شود. قطر، ضخامت، نوع انتها، آزمون و پوشش باید در درخواست خرید مشخص شود.",
        "english": "Welded or seamless steel pipes are supplied for fluid, gas, structural and industrial applications. Diameter, wall thickness, end type, testing, coating and applicable standard are confirmed per order.",
        "keywords": ["خرید لوله فولادی", "صادرات لوله فولادی", "لوله سیاه و گالوانیزه", "steel pipe exporter Iran"],
    },
    {
        "slug": "steel-profile", "fa": "قوطی و پروفیل فولادی", "en": "Steel Profile and Tube", "key": "tubes",
        "image": "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto:good/v1782902908/%D9%BE%D8%B1%D9%88%D9%81%DB%8C%D9%84_fsuqgc.webp",
        "grades": "Grade A، B یا C و گریدهای پروژه‌ای", "sizes": "ضخامت دیواره 1.5 تا 10 میلی‌متر؛ طول 6 متر یا سفارشی",
        "use": "سازه سبک، شاسی، مبلمان فلزی، معماری و قطعه‌سازی",
        "intro": "قوطی و پروفیل فولادی مربع و مستطیل برای کاربردهای ساختمانی و ساخت صنعتی عرضه می‌شود. ابعاد مقطع، ضخامت دیواره، گرید، روش تولید و وضعیت سطح در استعلام تعیین می‌شود.",
        "english": "Square and rectangular steel hollow sections are supplied for structures, frames and fabrication. Section dimensions, wall thickness, grade, manufacturing route and finish are specified for each inquiry.",
        "keywords": ["خرید پروفیل فولادی", "صادرات قوطی و پروفیل", "پروفیل ساختمانی", "steel profile supplier Iran"],
    },
    {
        "slug": "steel-flat-bar", "fa": "تسمه فولادی", "en": "Steel Flat Bar", "key": "flat",
        "image": "https://res.cloudinary.com/dqhbyqftq/image/upload/v1784520475/%D8%AA%D8%B3%D9%85%D9%87_roluwo_vx5dpm.png",
        "grades": "گریدهای استاندارد و S275JR", "sizes": "عرض 50 تا 200 میلی‌متر؛ ضخامت 3 تا 25 میلی‌متر",
        "use": "قاب، بست، قطعه‌سازی، سازه و تجهیزات صنعتی",
        "intro": "تسمه فولادی نورد گرم برای ساخت قطعات، قاب‌بندی و مصارف عمومی صنعتی تأمین می‌شود. عرض، ضخامت، طول، گرید و وضعیت سطح بر اساس فهرست متریال خریدار کنترل می‌شود.",
        "english": "Hot-rolled steel flat bars are supplied for frames, brackets, components and general fabrication. Width, thickness, length, grade, edge condition and surface finish are matched to the material list.",
        "keywords": ["خرید تسمه فولادی", "صادرات تسمه فولادی", "تسمه نورد گرم", "steel flat bar supplier Iran"],
    },
    {
        "slug": "steel-plate", "fa": "ورق و پلیت فولادی", "en": "Steel Plate", "key": "plates",
        "image": "https://res.cloudinary.com/dqhbyqftq/image/upload/v1784520474/%D9%88%D8%B1%D9%82_c5og8d_uwo0nv.png",
        "grades": "ST37 و ST52", "sizes": "ضخامت 0.5 تا 40 میلی‌متر؛ رول یا شیت بر اساس سفارش",
        "use": "سازه، مخزن، ماشین‌سازی، نورد و پروژه‌های صنعتی",
        "intro": "ورق و پلیت فولادی در گریدها و ضخامت‌های تجاری برای پروژه‌های صنعتی و ساختمانی تأمین می‌شود. نوع ورق، ابعاد، ضخامت، گرید، تلرانس و نیاز بازرسی باید در استعلام قید شود.",
        "english": "Steel sheets and plates are supplied for structural and industrial applications. Product form, dimensions, thickness, grade, tolerances, inspection and delivery requirements are reviewed for every inquiry.",
        "keywords": ["خرید ورق فولادی", "صادرات پلیت فولادی", "ورق ST37 و ST52", "steel plate exporter Iran"],
    },
    {
        "slug": "galvanized-steel-coil", "fa": "کلاف و کویل گالوانیزه", "en": "Galvanized Steel Coil", "key": "coils",
        "image": "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto:good/v1782902904/%DA%A9%D9%84%D8%A7%D9%81_rseobr.webp",
        "grades": "گرید و کیفیت سطح مطابق مصرف نهایی", "sizes": "پوشش روی Z80 تا Z275 گرم بر مترمربع؛ ضخامت سفارشی",
        "use": "لوازم خانگی، پوشش ساختمان، کانال‌سازی و قطعه‌سازی",
        "intro": "کویل فولادی گالوانیزه گرم با پوشش روی متناسب با محیط مصرف قابل تأمین است. ضخامت، عرض، وزن کلاف، مقدار پوشش، کیفیت سطح و نوع بسته‌بندی در سفارش مشخص می‌شود.",
        "english": "Hot-dip galvanized steel coils are supplied for construction and manufacturing. Thickness, width, coil weight, zinc coating, surface quality, packing and shipment protection are defined per inquiry.",
        "keywords": ["خرید کویل گالوانیزه", "صادرات کلاف فولادی", "کویل Z80 تا Z275", "galvanized steel coil Iran"],
    },
    {
        "slug": "steel-wire", "fa": "مفتول فولادی", "en": "Steel Wire", "key": "wires",
        "image": "https://res.cloudinary.com/dqhbyqftq/image/upload/v1784520480/%D9%85%D9%81%D8%AA%D9%88%D9%84_pffty8_hrnldf.png",
        "grades": "کم‌کربن، سیاه آنیل‌شده یا گالوانیزه", "sizes": "قطر 1 تا 6 میلی‌متر؛ بسته‌بندی کلاف یا قرقره",
        "use": "توری، آرماتوربندی، میخ، پیچ، بسته‌بندی و صنایع مفتولی",
        "intro": "مفتول فولادی سیاه و گالوانیزه برای صنایع ساختمانی و تولیدی تأمین می‌شود. قطر، استحکام کششی، نوع پوشش، وزن کلاف و بسته‌بندی صادراتی در پیشنهاد فروش مشخص خواهد شد.",
        "english": "Black annealed and galvanized steel wire is supplied for mesh, construction tying and wire products. Diameter, tensile strength, coating, coil weight, packing and delivery conditions are confirmed per order.",
        "keywords": ["خرید مفتول فولادی", "صادرات مفتول گالوانیزه", "مفتول سیاه", "steel wire exporter Iran"],
    },
]


def esc(value: str) -> str:
    return html.escape(value, quote=True)


def related_links(current_slug: str) -> str:
    links = [p for p in PRODUCTS if p["slug"] != current_slug][:6]
    return "\n".join(
        f'<a href="../{p["slug"]}/">{esc(p["fa"])} <span lang="en">| {esc(p["en"])}</span></a>' for p in links
    )


def schema_for(product: dict) -> str:
    url = f'{BASE_URL}/products/{product["slug"]}/'
    faq = [
        (f'برای خرید {product["fa"]} چه اطلاعاتی لازم است؟', f'گرید، ابعاد، مقدار، استاندارد، محل تحویل و نیاز بازرسی را اعلام کنید تا امکان تأمین و پیشنهاد تجاری بررسی شود.'),
        (f'آیا {product["fa"]} برای صادرات عرضه می‌شود؟', 'بله؛ امکان صادرات پس از تأیید موجودی، مشخصات فنی، مقصد، روش حمل و الزامات اسنادی بررسی می‌شود.'),
        (f'قیمت {product["fa"]} چگونه تعیین می‌شود؟', 'قیمت ثابت نیست و به مشخصات فنی، مقدار سفارش، کارخانه، بازار، محل تحویل، هزینه حمل و شرایط پرداخت وابسته است.'),
    ]
    graph = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Product",
                "@id": f"{url}#product",
                "name": f'{product["fa"]} | {product["en"]}',
                "alternateName": product["keywords"],
                "description": product["intro"],
                "image": [product["image"]],
                "category": "محصولات فولادی | Steel Products",
                "brand": {"@type": "Brand", "name": "Mohajer Mobin Steel | فولاد مهاجر مبین"},
                "manufacturer": {"@id": f"{BASE_URL}/#organization"},
                "url": url,
                "additionalProperty": [
                    {"@type": "PropertyValue", "name": "Grade", "value": product["grades"]},
                    {"@type": "PropertyValue", "name": "Dimensions", "value": product["sizes"]},
                    {"@type": "PropertyValue", "name": "Applications", "value": product["use"]},
                ],
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "فولاد مهاجر مبین", "item": f"{BASE_URL}/"},
                    {"@type": "ListItem", "position": 2, "name": "محصولات فولادی", "item": f"{BASE_URL}/#catalogSectionAnchor"},
                    {"@type": "ListItem", "position": 3, "name": product["fa"], "item": url},
                ],
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}}
                    for q, a in faq
                ],
            },
        ],
    }
    return json.dumps(graph, ensure_ascii=False, indent=2).replace("</", "<\\/")


def render(product: dict) -> str:
    url = f'{BASE_URL}/products/{product["slug"]}/'
    title = f'خرید و صادرات {product["fa"]} | فولاد مهاجر مبین'
    description = f'تأمین، بازرگانی و صادرات {product["fa"]}؛ {product["grades"]}. بررسی مشخصات، شرایط تحویل و استعلام تجاری از فولاد مهاجر مبین.'
    keywords = "، ".join(product["keywords"])
    return f'''<!doctype html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{esc(title)}</title>
  <meta name="description" content="{esc(description)}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="{url}">
  <link rel="alternate" hreflang="fa-IR" href="{url}">
  <link rel="alternate" hreflang="en" href="{url}#english">
  <link rel="alternate" hreflang="x-default" href="{url}">
  <meta property="og:type" content="product">
  <meta property="og:site_name" content="Mohajer Mobin Steel | فولاد مهاجر مبین">
  <meta property="og:title" content="{esc(title)}">
  <meta property="og:description" content="{esc(description)}">
  <meta property="og:url" content="{url}">
  <meta property="og:image" content="{esc(product['image'])}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="../../48.png">
  <link rel="stylesheet" href="../product-page.css?v=20260811">
  <script type="application/ld+json">{schema_for(product)}</script>
</head>
<body>
  <header class="site-header">
    <a class="brand" href="../../" aria-label="صفحه اصلی فولاد مهاجر مبین"><img src="../../192.png" alt="نشان فولاد مهاجر مبین" width="48" height="48"><span>فولاد مهاجر مبین<br><small lang="en">Mohajer Mobin Steel</small></span></a>
    <nav aria-label="پیوندهای اصلی"><a href="../../#catalogSectionAnchor">محصولات</a><a href="../../">درباره شرکت</a><a href="mailto:info@mohajer-group.com">تماس و استعلام</a></nav>
  </header>
  <main>
    <section class="hero">
      <div>
        <p class="breadcrumb"><a href="../../">خانه</a> / <a href="../../#catalogSectionAnchor">محصولات فولادی</a> / {esc(product['fa'])}</p>
        <p class="eyebrow">تأمین، بازرگانی و صادرات محصولات فولادی</p>
        <h1>خرید و صادرات {esc(product['fa'])}</h1>
        <p class="lead">{esc(product['intro'])}</p>
        <div class="hero-actions"><a class="button" href="mailto:info@mohajer-group.com">درخواست استعلام و پیش‌فاکتور</a><a class="button secondary" href="#specifications">مشاهده مشخصات</a></div>
      </div>
      <img class="hero-image" src="{esc(product['image'])}" alt="{esc(product['fa'])} قابل تأمین توسط فولاد مهاجر مبین" width="640" height="420" fetchpriority="high">
    </section>
    <section class="section-white" id="specifications">
      <h2 class="section-title">مشخصات و شرایط تأمین {esc(product['fa'])}</h2>
      <p class="section-intro">مشخصات زیر دامنه عمومی تأمین را نشان می‌دهد. مشخصات قطعی، استاندارد، آنالیز، مقدار قابل عرضه و برنامه تحویل باید در پیش‌فاکتور همان سفارش تأیید شود.</p>
      <div class="spec-table-wrap"><table><thead><tr><th>موضوع</th><th>مشخصات عمومی</th></tr></thead><tbody><tr><td>گرید و کیفیت</td><td>{esc(product['grades'])}</td></tr><tr><td>ابعاد و شکل تحویل</td><td>{esc(product['sizes'])}</td></tr><tr><td>کاربردهای متداول</td><td>{esc(product['use'])}</td></tr><tr><td>بازرسی و اسناد</td><td>بر اساس توافق تجاری، استاندارد محصول و الزامات کشور مقصد</td></tr><tr><td>حمل و تحویل</td><td>قابل بررسی برای تحویل داخلی یا صادراتی بر مبنای مقصد و مقدار سفارش</td></tr></tbody></table></div>
    </section>
    <section>
      <h2 class="section-title">فرایند خرید و صادرات</h2>
      <div class="content-grid"><article class="card"><h3>اطلاعات لازم برای استعلام</h3><ul class="bullet-list"><li>نام محصول، گرید و استاندارد</li><li>ابعاد، مقدار و تلرانس مورد نیاز</li><li>کشور و محل تحویل</li><li>نیاز به گواهی، بازرسی یا آزمون</li><li>روش بسته‌بندی و بازه زمانی تحویل</li></ul></article><article class="card"><h3>مراحل بررسی سفارش</h3><ol class="bullet-list"><li>دریافت درخواست فنی و تجاری</li><li>بررسی موجودی و منبع تأمین</li><li>تطبیق مشخصات و شرایط تحویل</li><li>ارسال پیشنهاد یا پیش‌فاکتور</li><li>هماهنگی اسناد، بارگیری و حمل</li></ol></article></div>
    </section>
    <section class="english" id="english" lang="en">
      <h2 class="section-title">{esc(product['en'])} Supplier and Export Inquiry</h2>
      <p class="section-intro">{esc(product['english'])}</p>
      <div class="content-grid"><article class="card"><h3>Commercial inquiry details</h3><p>Please provide grade, standard, dimensions, quantity, destination, inspection requirements and preferred delivery terms. Availability and commercial terms are confirmed only in the relevant quotation.</p></article><article class="card"><h3>Search topics</h3><p>{esc(' · '.join(product['keywords']))}</p><p>Mohajer Mobin Steel is a steel trading and export business serving qualified domestic and international inquiries.</p></article></div>
    </section>
    <section class="section-white">
      <div class="faq"><h2 class="section-title">سؤالات متداول {esc(product['fa'])}</h2><details><summary>برای خرید {esc(product['fa'])} چه اطلاعاتی لازم است؟</summary><p>گرید، ابعاد، مقدار، استاندارد، محل تحویل و نیاز بازرسی را اعلام کنید تا امکان تأمین و پیشنهاد تجاری بررسی شود.</p></details><details><summary>آیا {esc(product['fa'])} برای صادرات عرضه می‌شود؟</summary><p>بله؛ امکان صادرات پس از تأیید موجودی، مشخصات فنی، مقصد، روش حمل و الزامات اسنادی بررسی می‌شود.</p></details><details><summary>قیمت {esc(product['fa'])} چگونه تعیین می‌شود؟</summary><p>قیمت ثابت نیست و به مشخصات فنی، مقدار سفارش، کارخانه، بازار، محل تحویل، هزینه حمل و شرایط پرداخت وابسته است. برای قیمت معتبر باید استعلام ارسال شود.</p></details></div>
    </section>
    <section><h2 class="section-title">سایر محصولات فولاد مهاجر مبین</h2><p class="section-intro">برای بررسی سایر محصولات بازرگانی و صادراتی، صفحه تخصصی محصول را انتخاب کنید.</p><div class="related-grid">{related_links(product['slug'])}</div></section>
    <section class="contact-strip" id="contact"><h2 class="section-title">استعلام {esc(product['fa'])}</h2><p>برای دریافت پیشنهاد تجاری، مشخصات فنی، مقدار سفارش و مقصد را از طریق اطلاعات تماس رسمی سایت ارسال کنید. قیمت و موجودی فقط پس از بررسی درخواست تأیید می‌شود.</p><a class="button" href="mailto:info@mohajer-group.com?subject={esc(product['en'])}%20Inquiry">ارسال درخواست به واحد بازرگانی</a></section>
  </main>
  <footer>© Mohajer Mobin Steel — فولاد مهاجر مبین؛ تأمین، تجارت و صادرات محصولات فولادی</footer>
</body>
</html>
'''


def main() -> None:
    products_dir = ROOT / "products"
    products_dir.mkdir(exist_ok=True)
    for product in PRODUCTS:
        output_dir = products_dir / product["slug"]
        output_dir.mkdir(exist_ok=True)
        (output_dir / "index.html").write_text(render(product), encoding="utf-8")
    print(f"Generated {len(PRODUCTS)} product pages")


if __name__ == "__main__":
    main()
