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


SEO_GUIDES = {
  "rebar": {
    "heading": "راهنمای خرید میلگرد A2، A3 و A4 و استعلام قیمت میلگرد",
    "first": "در خرید میلگرد آجدار، انتخاب رده A2، A3 یا A4 صرفاً با توجه به قیمت انجام نمی‌شود؛ نقشه سازه، استاندارد پروژه، قطر اسمی و الزامات خم‌کاری و جوش‌پذیری باید مبنای انتخاب باشند. در فولاد مهاجر مبین امکان بررسی تأمین میلگرد در قطرهای ۸ تا ۴۰ میلی‌متر و طول شاخه ۱۲ متر یا برش سفارشی بر اساس درخواست خریدار وجود دارد.",
    "second": "برای استعلام قیمت میلگرد A3 یا میلگرد صادراتی، قطر، گرید، کارخانه ترجیحی، تناژ، محل بارگیری و مقصد را اعلام کنید. وزن هر شاخه و بندیل، تلرانس، گواهی آزمون و روش بسته‌بندی بر هزینه نهایی و پذیرش محموله در مقصد اثر می‌گذارند.",
    "third": "برای سفارش صادرات میلگرد ایران، مشخصات فنی باید با استاندارد و الزامات کشور مقصد تطبیق داده شود. قیمت روز و موجودی قطعی تنها پس از استعلام قابل تأیید است؛ این صفحه جدول قیمت لحظه‌ای منتشر نمی‌کند.",
    "title": "خرید میلگرد A2، A3 و A4 | قیمت و صادرات میلگرد | فولاد مهاجر",
    "description": "خرید و صادرات میلگرد A2، A3 و A4 در قطرهای ۸ تا ۴۰ میلی‌متر؛ مشخصات فنی، عوامل قیمت میلگرد و استعلام پیش‌فاکتور از فولاد مهاجر مبین."
  },
  "steel-slab": {
    "heading": "خرید اسلب فولادی و شرایط صادرات اسلب ایران",
    "first": "اسلب فولادی یا تختال، ماده اولیه خطوط نورد ورق و محصولات تخت است. هنگام خرید اسلب باید ضخامت، عرض، طول، گرید و ترکیب شیمیایی مورد نیاز خط نورد مشخص شود؛ هر اسلبی برای همه محصولات نهایی مناسب نیست.",
    "second": "برای استعلام قیمت اسلب فولادی، مقدار سفارش، ابعاد، محدودیت‌های سطحی، نیاز به گواهی آنالیز و مقصد داخلی یا صادراتی را ارسال کنید. مشخصات نهایی بر اساس ظرفیت کارخانه تأمین‌کننده، تولید و شرایط سفارش بررسی می‌شود.",
    "third": "در صادرات اسلب، هماهنگی بازرسی، بارگیری، بیمه و مدارک حمل بخش مهمی از سفارش است. اگر به‌دنبال تأمین‌کننده اسلب ایران هستید، نوع کاربرد و استاندارد نهایی را همراه با درخواست تجاری اعلام کنید.",
    "title": "خرید اسلب فولادی | قیمت و صادرات اسلب | فولاد مهاجر",
    "description": "خرید اسلب فولادی و صادرات تختال ایران؛ راهنمای گرید، ابعاد، شرایط حمل و عوامل قیمت اسلب. استعلام سفارش عمده از فولاد مهاجر مبین."
  },
  "steel-angle": {
    "heading": "خرید نبشی فولادی؛ تفاوت ابعاد، گرید و قیمت نبشی",
    "first": "نبشی فولادی برای اتصالات سازه‌ای، دکل، خرپا و ساخت قطعات صنعتی به کار می‌رود. در استعلام خرید نبشی، مساوی یا نامساوی بودن بال‌ها، اندازه بال، ضخامت، طول شاخه و کیفیت سطح باید مشخص باشد.",
    "second": "گریدهای S235JR، S275JR و S355JR ویژگی‌های متفاوتی دارند و انتخاب آن‌ها به نقشه و محاسبات پروژه بستگی دارد. درخواست نبشی خام یا دارای پوشش نیز باید در سفارش درج شود.",
    "third": "قیمت نبشی فولادی به وزن واحد طول، گرید، کارخانه، تناژ، بسته‌بندی و مسیر تحویل وابسته است. برای صادرات نبشی، تطبیق استاندارد و مدارک با مقصد پیش از تأیید سفارش ضروری است.",
    "title": "خرید نبشی فولادی | قیمت و صادرات نبشی | فولاد مهاجر",
    "description": "خرید نبشی فولادی؛ بررسی گرید S235JR تا S355JR، ابعاد بال و ضخامت، قیمت و شرایط صادرات نبشی. استعلام از فولاد مهاجر مبین."
  },
  "steel-channel": {
    "heading": "خرید ناودانی فولادی UPN و استعلام قیمت ناودانی",
    "first": "ناودانی UPN یکی از مقاطع مورد استفاده در شاسی، قاب و سازه‌های فلزی است. برای خرید ناودانی فولادی، علاوه بر شماره مقطع، وزن واحد طول، طول شاخه، ضخامت جان و بال و گرید مورد نیاز را مشخص کنید.",
    "second": "وزن و ابعاد واقعی مقطع باید با استاندارد مورد توافق و نقشه پروژه کنترل شوند. گریدهای S235JR، S275JR و S355JR بسته به الزامات سازه‌ای قابل بررسی‌اند.",
    "third": "قیمت ناودانی صادراتی با سایز، وزن، کارخانه، مقدار و مقصد تغییر می‌کند. مشخصات بسته‌بندی و برنامه بارگیری برای سفارش عمده و صادرات ناودانی باید در پیش‌فاکتور تأیید شوند.",
    "title": "خرید ناودانی فولادی UPN | قیمت و صادرات | فولاد مهاجر",
    "description": "خرید ناودانی UPN فولادی؛ بررسی سایز، گرید، وزن و عوامل قیمت ناودانی و شرایط صادرات. دریافت پیشنهاد از فولاد مهاجر مبین."
  },
  "steel-beam": {
    "heading": "خرید تیرآهن و هاش؛ مشخصات و قیمت تیرآهن صادراتی",
    "first": "برای خرید تیرآهن و مقاطع بال‌پهن، ابتدا نوع مقطع موردنیاز سازه، ابعاد اسمی، وزن هر متر، گرید و طول شاخه را تعیین کنید. در پروژه‌های ساختمانی و صنعتی تطبیق جدول اشتال و نقشه سازه اهمیت زیادی دارد.",
    "second": "در استعلام قیمت تیرآهن، کارخانه تولیدکننده، تناژ، روش بارگیری، نیاز به بازرسی و شهر یا کشور مقصد بر پیشنهاد تجاری تأثیر می‌گذارند. گریدهای S275JR، S355JR و S355J2 بر اساس مشخصات سفارش بررسی می‌شوند.",
    "third": "برای صادرات تیرآهن ایران، مدارک فنی و گواهی محصول و شرایط تحویل باید متناسب با بازار مقصد هماهنگ شود. قیمت درج‌شده در پیش‌فاکتور معتبر است و تغییرات بازار را نمی‌توان با یک نرخ ثابت نمایش داد.",
    "title": "خرید تیرآهن و هاش | قیمت و صادرات تیرآهن | فولاد مهاجر",
    "description": "خرید تیرآهن فولادی و مقاطع بال‌پهن؛ مشخصات گرید، وزن، سایز، عوامل قیمت تیرآهن و شرایط صادرات با فولاد مهاجر مبین."
  },
  "steel-pipe": {
    "heading": "خرید لوله فولادی درزدار و بدون درز؛ استعلام قیمت لوله",
    "first": "هنگام خرید لوله فولادی باید مشخص شود محصول برای انتقال سیال، سازه یا کاربرد صنعتی استفاده خواهد شد. انتخاب لوله درزدار یا بدون درز، قطر خارجی، ضخامت دیواره و استاندارد ساخت باید با شرایط کاربری هماهنگ باشد.",
    "second": "برای لوله فولادی سیاه یا گالوانیزه، نوع پوشش، وضعیت سر لوله، طول شاخه، الزامات آزمون و مدارک فنی بخشی از مشخصات سفارش است. امکان تأمین تنها پس از بررسی استاندارد و موجودی تأیید می‌شود.",
    "third": "قیمت لوله فولادی و شرایط صادرات به گرید، قطر، ضخامت، کارخانه و مقصد بستگی دارد. درخواست قیمت را همراه با نقشه یا لیست متریال ارسال کنید تا از پیشنهاد نامتناسب جلوگیری شود.",
    "title": "خرید لوله فولادی | قیمت لوله و صادرات | فولاد مهاجر",
    "description": "خرید لوله فولادی درزدار و بدون درز؛ بررسی قطر، ضخامت، پوشش، قیمت لوله و شرایط تأمین و صادرات از فولاد مهاجر مبین."
  },
  "steel-profile": {
    "heading": "خرید قوطی و پروفیل فولادی؛ ابعاد و قیمت پروفیل",
    "first": "قوطی و پروفیل فولادی مربع و مستطیل در سازه سبک، شاسی، تجهیزات و ساخت قطعات کاربرد دارد. انتخاب مقطع باید با طول و عرض خارجی، ضخامت دیواره، وزن هر شاخه و گرید پروژه انجام شود.",
    "second": "برای استعلام قیمت پروفیل فولادی، ابعاد دقیق، ضخامت، طول، تناژ، نوع سطح و روش بسته‌بندی را اعلام کنید. ضخامت‌های ۱٫۵ تا ۱۰ میلی‌متر از دامنه‌های قابل بررسی‌اند، نه تضمین موجودی همه سایزها.",
    "third": "برای صادرات پروفیل فولادی، کنترل تلرانس ابعادی، استاندارد مورد پذیرش خریدار و الزامات حمل مهم است. قیمت قطعی و امکان تأمین پس از دریافت مشخصات فنی تعیین می‌شود.",
    "title": "خرید قوطی و پروفیل فولادی | قیمت پروفیل | فولاد مهاجر",
    "description": "خرید قوطی و پروفیل فولادی مربع و مستطیل؛ راهنمای ابعاد، ضخامت، قیمت پروفیل و استعلام سفارش عمده از فولاد مهاجر مبین."
  },
  "steel-flat-bar": {
    "heading": "خرید تسمه فولادی نورد گرم؛ ابعاد، وزن و قیمت تسمه",
    "first": "تسمه فولادی در ساخت بست، قاب، تجهیزات و قطعات صنعتی کاربرد دارد. در خرید تسمه نورد گرم، عرض، ضخامت، طول شاخه و وضعیت لبه باید با نقشه قطعه یا فهرست متریال هماهنگ باشد.",
    "second": "برای استعلام قیمت تسمه فولادی، گرید، عرض ۵۰ تا ۲۰۰ میلی‌متر، ضخامت موردنیاز در دامنه ۳ تا ۲۵ میلی‌متر، مقدار و محل تحویل را اعلام کنید. این بازه‌ها به معنی موجود بودن دائمی تمام ترکیب‌ها نیستند.",
    "third": "در سفارش عمده و صادرات تسمه فولادی، تلرانس ابعادی و شرایط بسته‌بندی روی وزن تحویلی و هزینه حمل اثر دارند؛ پیشنهاد نهایی بعد از بررسی تأمین صادر می‌شود.",
    "title": "خرید تسمه فولادی | قیمت تسمه نورد گرم | فولاد مهاجر",
    "description": "خرید تسمه فولادی نورد گرم؛ راهنمای عرض و ضخامت، گرید، عوامل قیمت تسمه و شرایط تأمین و صادرات از فولاد مهاجر مبین."
  },
  "steel-plate": {
    "heading": "خرید ورق فولادی ST37 و ST52؛ استعلام قیمت ورق و پلیت",
    "first": "در خرید ورق فولادی، تفاوت ورق و پلیت، روش تولید، ضخامت، عرض، طول و گرید نقش تعیین‌کننده دارند. ورق ST37 و ST52 بسته به طراحی و الزامات مکانیکی پروژه انتخاب می‌شوند و جایگزینی آن‌ها باید با تأیید فنی انجام شود.",
    "second": "برای قیمت ورق ST37 یا قیمت ورق ST52، ضخامت، شکل تحویل به‌صورت رول یا شیت، ابعاد، تناژ، کارخانه و شهر مقصد را ارسال کنید. دامنه ضخامت‌های قابل بررسی ۰٫۵ تا ۴۰ میلی‌متر است و موجودی هر سایز استعلام می‌شود.",
    "third": "در صادرات ورق و پلیت فولادی، گواهی مواد، کیفیت سطح، تلرانس و نحوه محافظت و بارگیری باید در اسناد تجاری مشخص شوند. هیچ قیمت لحظه‌ای تضمین‌شده‌ای در این صفحه ارائه نمی‌شود.",
    "title": "خرید ورق فولادی ST37 و ST52 | قیمت ورق | فولاد مهاجر",
    "description": "خرید ورق فولادی ST37 و ST52؛ بررسی ضخامت، ابعاد، قیمت ورق و پلیت و شرایط صادرات. استعلام پیش‌فاکتور از فولاد مهاجر مبین."
  },
  "galvanized-steel-coil": {
    "heading": "خرید کویل گالوانیزه؛ پوشش Z80 تا Z275 و قیمت کلاف",
    "first": "کویل فولادی گالوانیزه برای کاربردهایی مانند لوازم خانگی، پوشش ساختمان و کانال‌سازی استفاده می‌شود. در خرید کویل گالوانیزه، ضخامت ورق، عرض، وزن کلاف، کیفیت سطح و میزان پوشش روی باید با مصرف نهایی مطابقت داشته باشند.",
    "second": "پوشش Z80 تا Z275 بیانگر دامنه مورد بررسی است و لزوماً به معنی موجودی تمام گریدها و ضخامت‌ها نیست. برای استعلام قیمت کلاف گالوانیزه، نوع پوشش، وزن هر کویل، مقدار سفارش و مقصد را مشخص کنید.",
    "third": "در صادرات کویل گالوانیزه، بسته‌بندی مقاوم در برابر رطوبت، حفاظت لبه‌ها و شرایط حمل اهمیت دارد. مشخصات و قیمت نهایی در پیشنهاد تأمین یا پیش‌فاکتور تأیید می‌شوند.",
    "title": "خرید کویل گالوانیزه | قیمت کلاف Z80 تا Z275 | فولاد مهاجر",
    "description": "خرید کویل گالوانیزه با پوشش Z80 تا Z275؛ راهنمای ضخامت، عرض، عوامل قیمت کلاف فولادی و شرایط حمل و صادرات از فولاد مهاجر مبین."
  },
  "steel-wire": {
    "heading": "خرید مفتول فولادی سیاه و گالوانیزه؛ قطر، کلاف و قیمت",
    "first": "مفتول فولادی در توری، آرماتوربندی و صنایع مفتولی استفاده می‌شود. انتخاب مفتول سیاه آنیل‌شده یا مفتول گالوانیزه به نوع مصرف، شرایط محیطی و الزامات استحکام کششی بستگی دارد.",
    "second": "برای خرید مفتول فولادی، قطر ۱ تا ۶ میلی‌متر، نوع پوشش، استحکام موردنیاز، وزن کلاف یا قرقره، نوع بسته‌بندی و مقدار سفارش را مشخص کنید. قابلیت تولید یا تأمین هر ترکیب پس از بررسی اعلام می‌شود.",
    "third": "قیمت مفتول فولادی و شرایط صادرات به قطر، پوشش، وزن بسته، کارخانه و مسیر تحویل وابسته است. پیش از تأیید سفارش، استاندارد و گواهی فنی موردنیاز خریدار بررسی می‌شود.",
    "title": "خرید مفتول فولادی | قیمت مفتول سیاه و گالوانیزه | فولاد مهاجر",
    "description": "خرید مفتول فولادی سیاه و گالوانیزه؛ بررسی قطر، وزن کلاف، عوامل قیمت مفتول و شرایط تأمین و صادرات از فولاد مهاجر مبین."
  }
}

PRIORITY_INTENT = {
  "rebar": {
    "html": "    <section class=\"section-white\" id=\"commercial-questions\">\n      <h2 class=\"section-title\">راهنمای تخصصی قیمت، خرید و صادرات میلگرد</h2>\n      <p class=\"section-intro\">این اطلاعات برای مقایسه پیشنهادهای خرید و صادرات است، نه اعلام نرخ زنده. موجودی، قیمت و اسناد هر سفارش صرفاً در پیش‌فاکتور معتبر تأیید می‌شود.</p>\n      <div class=\"priority-commercial-grid\"><article class=\"card\"><h3>قیمت میلگرد A2، A3 و A4 چگونه استعلام می‌شود؟</h3><p>در استعلام قیمت میلگرد، فقط نام «میلگرد» کافی نیست. قطر، رده استاندارد A2 یا A3 یا A4، طول شاخه، مقدار سفارش و کارخانه مورد نظر را مشخص کنید. وزن نظری و وزن باسکول، هزینه حمل و محل تحویل می‌توانند رقم نهایی پیش‌فاکتور را تغییر دهند.</p>\n<p>اگر هدف پروژه ساختمانی است، جایگزینی گریدها باید مطابق نقشه و نظر مهندس مسئول باشد؛ صرفاً ارزان‌تر بودن قیمت میلگرد A3 یا A4 معیار مناسبی برای انتخاب نیست.</p></article>\n<article class=\"card\"><h3>صادرات میلگرد فولادی و مدارک لازم</h3><p>برای صادرات میلگرد، استاندارد قابل پذیرش در کشور مقصد، گرید مورد نیاز، برگه آزمون کارخانه (MTC) در صورت توافق، قطر و وزن بندیل اهمیت دارند. باید روش بسته‌بندی، مقصد، شرایط تحویل و زمان بارگیری پیش از نهایی شدن پیش‌فاکتور روشن باشد.</p>\n<p>فولاد مهاجر مبین درخواست‌های خرید عمده و صادراتی را بر اساس مشخصات ثبت‌شده بررسی می‌کند. موجودی و قیمت روز اعلام‌شده بدون تأیید واحد بازرگانی معتبر نیست.</p></article>\n<article class=\"card\"><h3>چک‌لیست درخواست قیمت میلگرد</h3><p>یک استعلام دقیق شامل رده A2/A3/A4، قطر میلی‌متر، طول شاخه، تناژ، کارخانه یا استاندارد ترجیحی، شهر یا کشور مقصد و نیاز به آزمون یا بازرسی است. این جزئیات مانع مقایسه قیمت دو محصول غیرهم‌ارز می‌شود.</p>\n<p>برای مشاهده رده‌ها و روش محاسبه وزن، <a href=\"../../guides/rebar-grades/\">راهنمای فنی میلگرد</a> را ببینید.</p></article></div>\n      <p class=\"section-intro\">برای دریافت پیشنهاد تجاری، <a href=\"mailto:info@mohajer-group.com\">مشخصات سفارش را برای واحد بازرگانی فولاد مهاجر مبین ارسال کنید</a> یا با <a href=\"../../steel-export/\">مراحل صادرات فولاد</a> آشنا شوید.</p>\n    </section>\n",
    "h1": "خرید میلگرد فولادی؛ قیمت و صادرات میلگرد A2، A3 و A4",
    "description": "قیمت میلگرد فولادی با استعلام قطر، گرید A2، A3 یا A4، کارخانه، تناژ و محل تحویل مشخص می‌شود. راهنمای خرید و صادرات میلگرد از فولاد مهاجر مبین.",
    "english": "Steel Rebar"
  },
  "steel-plate": {
    "html": "    <section class=\"section-white\" id=\"commercial-questions\">\n      <h2 class=\"section-title\">راهنمای تخصصی قیمت، خرید و صادرات ورق فولادی</h2>\n      <p class=\"section-intro\">این اطلاعات برای مقایسه پیشنهادهای خرید و صادرات است، نه اعلام نرخ زنده. موجودی، قیمت و اسناد هر سفارش صرفاً در پیش‌فاکتور معتبر تأیید می‌شود.</p>\n      <div class=\"priority-commercial-grid\"><article class=\"card\"><h3>قیمت ورق فولادی ST37 و ST52 به چه عواملی بستگی دارد؟</h3><p>در خرید ورق فولادی، اصطلاح عمومی «ورق» دقیق نیست: گرید، شیوه نورد، ضخامت، عرض و طول، حالت تحویل به صورت رول یا شیت و کیفیت سطح باید مشخص شود. خریدار ورق ST37 یا ST52 بهتر است نقشه و استاندارد فنی پروژه را همراه استعلام بفرستد.</p>\n<p>قیمت ورق سیاه با قیمت پلیت برش‌خورده یکسان نیست. هزینه برش، وزن نهایی، محل بارگیری، تناژ و شرایط پرداخت روی نرخ تأییدشده در پیش‌فاکتور اثر می‌گذارند.</p></article>\n<article class=\"card\"><h3>صادرات ورق و پلیت فولادی</h3><p>برای صادرات ورق فولادی، کنترل گرید و مشخصات مکانیکی، تلرانس ابعاد، وضعیت سطح، شیوه مهار بار و مدارک فنی مورد توافق اهمیت دارد. در تحویل صادراتی، خطر آسیب سطحی و رطوبت هنگام حمل باید در روش بسته‌بندی لحاظ شود.</p>\n<p>پیش از استعلام صادرات ورق ST37 یا ST52، مقصد، مقدار، ابعاد و نیاز به گواهی آزمون مواد را اعلام کنید. وجود محصول در یک ضخامت یا کارخانه خاص تنها پس از بررسی تأمین قابل تأیید است.</p></article>\n<article class=\"card\"><h3>تفاوت ورق، پلیت و کویل گالوانیزه</h3><p>ورق و پلیت در کاربردهای سازه‌ای و صنعتی به شکل شیت یا رول عرضه می‌شوند؛ <a href=\"../galvanized-steel-coil/\">کویل گالوانیزه</a> دارای پوشش روی بوده و شرایط فنی و قیمت‌گذاری متفاوتی دارد. <a href=\"../steel-slab/\">اسلب فولادی</a> نیز یکی از مواد اولیه تولید محصولات تخت است.</p>\n<p>برای مقایسه قیمت، وزن نظری هر شیت و تلرانس ضخامت را بر اساس استاندارد مورد توافق کنترل کنید.</p></article></div>\n      <p class=\"section-intro\">برای دریافت پیشنهاد تجاری، <a href=\"mailto:info@mohajer-group.com\">مشخصات سفارش را برای واحد بازرگانی فولاد مهاجر مبین ارسال کنید</a> یا با <a href=\"../../steel-export/\">مراحل صادرات فولاد</a> آشنا شوید.</p>\n    </section>\n",
    "h1": "خرید ورق فولادی؛ قیمت ورق ST37 و ST52 و صادرات",
    "description": "استعلام قیمت ورق فولادی ST37 و ST52، ورق سیاه و پلیت بر اساس ضخامت، ابعاد، گرید، کارخانه و محل تحویل؛ راهنمای خرید و صادرات ورق فولادی.",
    "english": "Steel Plate & Sheet"
  },
  "steel-slab": {
    "html": "    <section class=\"section-white\" id=\"commercial-questions\">\n      <h2 class=\"section-title\">راهنمای تخصصی قیمت، خرید و صادرات اسلب فولادی</h2>\n      <p class=\"section-intro\">این اطلاعات برای مقایسه پیشنهادهای خرید و صادرات است، نه اعلام نرخ زنده. موجودی، قیمت و اسناد هر سفارش صرفاً در پیش‌فاکتور معتبر تأیید می‌شود.</p>\n      <div class=\"priority-commercial-grid\"><article class=\"card\"><h3>قیمت اسلب فولادی و تختال چگونه تعیین می‌شود؟</h3><p>اسلب یا تختال، محصول نیمه‌ساخته با سطح مقطع پهن است که در بسیاری از خطوط نورد ورق استفاده می‌شود. قیمت اسلب به گرید و ترکیب شیمیایی، ضخامت، عرض، طول، کیفیت سطح، تناژ و شرایط تحویل وابسته است.</p>\n<p>برای استعلام قیمت اسلب، علاوه بر اندازه و مقدار، نوع محصول نهایی خط نورد و الزامات فنی آن را مشخص کنید. اعلام قیمت قطعی بدون تأیید کارخانه، موجودی و زمان حمل امکان‌پذیر نیست.</p></article>\n<article class=\"card\"><h3>صادرات اسلب ایران و اسناد موردنیاز</h3><p>در سفارش صادرات اسلب فولادی، مشخصات آنالیز شیمیایی، حدود تلرانس، وضعیت سطح، نحوه بارگیری و مدارک فنی باید در قرارداد یا پیش‌فاکتور تعریف شوند. مقصد، روش حمل و الزامات بازرسی در محاسبه هزینه تجاری اثر دارند.</p>\n<p>درخواست صادرکننده یا خریدار خارجی باید کشور مقصد، مقدار، ابعاد و گرید اسلب را دقیق مشخص کند؛ اصطلاح «اسلب صادراتی» به‌تنهایی تعیین‌کننده کیفیت یا استاندارد نیست.</p></article>\n<article class=\"card\"><h3>تفاوت قیمت شمش با اسلب</h3><p>شمش معمولاً خوراک نورد میلگرد و مقاطع طویل است؛ اسلب خوراک نورد محصولات تخت. به همین دلیل مقایسه مستقیم قیمت شمش با قیمت اسلب بدون بررسی نوع محصول و گرید اشتباه است. برای آشنایی با کاربردها، <a href=\"../../guides/billet-vs-slab/\">راهنمای تفاوت شمش و اسلب</a> را مطالعه کنید.</p>\n<p>برای تأمین <a href=\"../steel-plate/\">ورق فولادی</a> نیز می‌توانید مشخصات محصول نهایی را جداگانه استعلام کنید.</p></article></div>\n      <p class=\"section-intro\">برای دریافت پیشنهاد تجاری، <a href=\"mailto:info@mohajer-group.com\">مشخصات سفارش را برای واحد بازرگانی فولاد مهاجر مبین ارسال کنید</a> یا با <a href=\"../../steel-export/\">مراحل صادرات فولاد</a> آشنا شوید.</p>\n    </section>\n",
    "h1": "خرید اسلب فولادی؛ قیمت تختال و صادرات اسلب",
    "description": "خرید اسلب فولادی (تختال) و استعلام قیمت اسلب صادراتی با اعلام گرید، ابعاد، تناژ، مقصد و نیاز به گواهی آنالیز؛ راهنمای بازرگانی فولاد مهاجر مبین.",
    "english": "Steel Slab"
  }
}

def esc(value: str) -> str:
    return html.escape(value, quote=True)


RELATED_SLUGS = {
  "steel-billet": [
    "rebar",
    "steel-wire",
    "steel-slab",
    "steel-plate",
    "steel-beam",
    "steel-channel"
  ],
  "steel-slab": [
    "steel-plate",
    "galvanized-steel-coil",
    "steel-billet",
    "rebar",
    "steel-beam",
    "steel-pipe"
  ],
  "rebar": [
    "steel-billet",
    "steel-wire",
    "steel-beam",
    "steel-channel",
    "steel-profile",
    "steel-plate"
  ],
  "steel-angle": [
    "steel-channel",
    "steel-beam",
    "steel-profile",
    "steel-flat-bar",
    "rebar",
    "steel-plate"
  ],
  "steel-channel": [
    "steel-angle",
    "steel-beam",
    "steel-flat-bar",
    "steel-profile",
    "rebar",
    "steel-pipe"
  ],
  "steel-beam": [
    "steel-angle",
    "steel-channel",
    "rebar",
    "steel-plate",
    "steel-profile",
    "steel-flat-bar"
  ],
  "steel-pipe": [
    "steel-profile",
    "steel-wire",
    "steel-plate",
    "galvanized-steel-coil",
    "steel-angle",
    "steel-channel"
  ],
  "steel-profile": [
    "steel-pipe",
    "steel-angle",
    "steel-channel",
    "steel-beam",
    "steel-flat-bar",
    "steel-plate"
  ],
  "steel-flat-bar": [
    "steel-angle",
    "steel-channel",
    "steel-beam",
    "steel-plate",
    "steel-profile",
    "steel-wire"
  ],
  "steel-plate": [
    "steel-slab",
    "galvanized-steel-coil",
    "steel-beam",
    "steel-pipe",
    "steel-angle",
    "steel-profile"
  ],
  "galvanized-steel-coil": [
    "steel-plate",
    "steel-slab",
    "steel-pipe",
    "steel-profile",
    "steel-flat-bar",
    "steel-wire"
  ],
  "steel-wire": [
    "steel-billet",
    "rebar",
    "galvanized-steel-coil",
    "steel-pipe",
    "steel-flat-bar",
    "steel-profile"
  ]
}

def related_links(current_slug: str) -> str:
    slugs = RELATED_SLUGS.get(current_slug, [])
    links = [next(p for p in PRODUCTS if p["slug"] == slug) for slug in slugs]
    return "\n".join(
        f'<a href="../{p["slug"]}/">{esc(p["fa"])} <span lang="en">| {esc(p["en"])}</span></a>' for p in links
    )


def seo_title(product: dict) -> str:
    priority_titles = {
        "steel-billet": "خرید و صادرات شمش فولادی | قیمت شمش",
        "rebar": "خرید و صادرات میلگرد | قیمت میلگرد فولادی",
        "steel-plate": "خرید و صادرات ورق فولادی | قیمت ورق",
    }
    return SEO_GUIDES.get(product["slug"], {}).get("title", priority_titles.get(product["slug"], f'خرید و صادرات {product["fa"]} | فولاد مهاجر مبین'))


def schema_for(product: dict) -> str:
    url = f'{BASE_URL}/products/{product["slug"]}/'
    search_terms = list(dict.fromkeys([
        f'خرید {product["fa"]}',
        f'فروش {product["fa"]}',
        f'قیمت {product["fa"]}',
        f'صادرات {product["fa"]}',
        *product["keywords"],
    ]))
    faq = [
        (f'برای خرید {product["fa"]} چه اطلاعاتی لازم است؟', f'گرید، ابعاد، مقدار، استاندارد، محل تحویل و نیاز بازرسی را اعلام کنید تا امکان تأمین و پیشنهاد تجاری بررسی شود.'),
        (f'آیا {product["fa"]} برای صادرات عرضه می‌شود؟', 'بله؛ امکان صادرات پس از تأیید موجودی، مشخصات فنی، مقصد، روش حمل و الزامات اسنادی بررسی می‌شود.'),
        (f'قیمت {product["fa"]} چگونه تعیین می‌شود؟', 'قیمت ثابت نیست و به مشخصات فنی، مقدار سفارش، کارخانه، بازار، محل تحویل، هزینه حمل و شرایط پرداخت وابسته است.'),
    ]
    graph = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": f"{BASE_URL}/#organization",
                "name": "Mohajer Mobin Steel | فولاد مهاجر مبین",
                "url": f"{BASE_URL}/",
                "logo": f"{BASE_URL}/512.png",
            },
            {
                "@type": "WebPage",
                "@id": f"{url}#webpage",
                "url": url,
                "name": seo_title(product),
                "inLanguage": ["fa-IR", "en"],
                "about": {"@id": f"{url}#product"},
                "isPartOf": {"@id": f"{BASE_URL}/#website"},
                "keywords": search_terms,
            },
            {
                "@type": "Product",
                "@id": f"{url}#product",
                "name": f'{product["fa"]} | {product["en"]}',
                "alternateName": product["keywords"],
                "description": product["intro"],
                "image": [product["image"]],
                "category": "محصولات فولادی | Steel Products",
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
                    {"@type": "ListItem", "position": 2, "name": "محصولات فولادی", "item": f"{BASE_URL}/products/"},
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
    title = seo_title(product)
    description = f'خرید، فروش، قیمت و صادرات {product["fa"]}؛ {product["grades"]}. بررسی مشخصات، شرایط تحویل و استعلام تخصصی از فولاد مهاجر مبین.'
    description = SEO_GUIDES.get(product["slug"], {}).get("description", description)
    guide = SEO_GUIDES.get(product["slug"])
    priority = PRIORITY_INTENT.get(product["slug"], {})
    priority_html = priority.get("html", "")
    language_cta = (f'<p class="section-intro" style="padding:18px clamp(20px,7vw,110px)"><a href="../../en/products/{product["slug"]}/" lang="en">English: {esc(priority["english"])} prices and export inquiry</a></p>' if priority else "")
    description = priority.get("description", description)
    guide_html = (f'''    <section class="section-white" id="buying-guide">\n      <h2 class="section-title">{esc(guide["heading"])}</h2>\n      <p class="section-intro">{esc(guide["first"])}</p>\n      <div class="content-grid"><article class="card"><h3>مشخصات مهم پیش از سفارش</h3><p>{esc(guide["second"])}</p></article><article class="card"><h3>قیمت و شرایط تأمین صادراتی</h3><p>{esc(guide["third"])}</p></article></div>\n    </section>\n''' if guide else "")
    guide_link_html = ('<p class="section-intro">برای آشنایی با انتخاب رده مناسب، <a href="../../guides/rebar-grades/">راهنمای تفاوت میلگرد A2، A3 و A4</a> را بخوانید.</p>' if product["slug"] == "rebar" else '<p class="section-intro">همچنین ببینید: <a href="../../guides/billet-vs-slab/">تفاوت شمش و اسلب فولادی</a>.</p>' if product["slug"] == "steel-slab" else "")
    weight_guide_html = ('''    <section class="section-white" id="weight-guide">
      <h2 class="section-title">محاسبه وزن میلگرد و نکات سفارش عمده</h2>
      <p class="section-intro">وزن نظری یک متر میلگرد با قطر اسمی d بر حسب میلی‌متر، تقریباً از رابطه d² ÷ 162 (کیلوگرم بر متر) به دست می‌آید. برای نمونه وزن نظری یک شاخه ۱۲ متری با قطر ۱۶ میلی‌متر حدود ۱۸٫۹۶ کیلوگرم است؛ وزن واقعی بار باید با تلرانس استاندارد و باسکول کنترل شود.</p>
      <p class="section-intro">رده‌های متداول A2 (S340)، A3 (S400) و A4 (S500) از نظر حداقل تنش تسلیم و شکل آج تفاوت دارند. پیش از خرید میلگرد، رده استاندارد، برگه آزمون کارخانه، قطر، وزن بندیل، مقدار سفارش و شهر یا کشور مقصد را مشخص کنید. برای مقایسه کامل، <a href="../../guides/rebar-grades/">راهنمای انتخاب میلگرد A2، A3 و A4</a> را مطالعه کنید.</p>
    </section>
''' if product["slug"] == "rebar" else "")
    keywords = "، ".join(dict.fromkeys([
        f'خرید {product["fa"]}',
        f'فروش {product["fa"]}',
        f'قیمت {product["fa"]}',
        f'صادرات {product["fa"]}',
        *product["keywords"],
    ]))
    return f'''<!doctype html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{esc(title)}</title>
  <meta name="description" content="{esc(description)}">
  <meta name="keywords" content="{esc(keywords)}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="{url}">
  <link rel="alternate" hreflang="fa-IR" href="{url}">
  {f'<link rel="alternate" hreflang="en" href="{BASE_URL}/en/products/{product["slug"]}/">' if priority else ""}
  <link rel="alternate" hreflang="x-default" href="{url}">
  <meta property="og:type" content="product">
  <meta property="og:site_name" content="Mohajer Mobin Steel | فولاد مهاجر مبین">
  <meta property="og:title" content="{esc(title)}">
  <meta property="og:description" content="{esc(description)}">
  <meta property="og:url" content="{url}">
  <meta property="og:image" content="{esc(product['image'])}">
  <meta property="og:image:alt" content="{esc(product['fa'])} — فولاد مهاجر مبین">
  <meta property="og:locale" content="fa_IR">
  <meta property="og:locale:alternate" content="en_US">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{esc(title)}">
  <meta name="twitter:description" content="{esc(description)}">
  <meta name="twitter:image" content="{esc(product['image'])}">
  <link rel="icon" href="../../48.png">
  <link rel="stylesheet" href="../product-page.css?v=20260811">
  <script type="application/ld+json">{schema_for(product)}</script>
</head>
<body>
  <header class="site-header">
    <a class="brand" href="../../" aria-label="صفحه اصلی فولاد مهاجر مبین"><img src="../../192.png" alt="نشان فولاد مهاجر مبین" width="48" height="48"><span>فولاد مهاجر مبین<br><small lang="en">Mohajer Mobin Steel</small></span></a>
    <nav aria-label="پیوندهای اصلی"><a href="../">محصولات</a><a href="../../">درباره شرکت</a><a href="mailto:info@mohajer-group.com">تماس و استعلام</a></nav>
  </header>
  <main>
    <section class="hero">
      <div>
        <p class="breadcrumb"><a href="../../">خانه</a> / <a href="../">محصولات فولادی</a> / {esc(product['fa'])}</p>
        <p class="eyebrow">تأمین، بازرگانی و صادرات محصولات فولادی</p>
        <h1>{esc(priority.get("h1", "خرید و صادرات " + product["fa"]))}</h1>
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
{guide_html}{weight_guide_html}{priority_html}    <section>
      <h2 class="section-title">فرایند خرید و صادرات</h2>
      <div class="content-grid"><article class="card"><h3>اطلاعات لازم برای استعلام</h3><ul class="bullet-list"><li>نام محصول، گرید و استاندارد</li><li>ابعاد، مقدار و تلرانس مورد نیاز</li><li>کشور و محل تحویل</li><li>نیاز به گواهی، بازرسی یا آزمون</li><li>روش بسته‌بندی و بازه زمانی تحویل</li></ul></article><article class="card"><h3>مراحل بررسی سفارش</h3><ol class="bullet-list"><li>دریافت درخواست فنی و تجاری</li><li>بررسی موجودی و منبع تأمین</li><li>تطبیق مشخصات و شرایط تحویل</li><li>ارسال پیشنهاد یا پیش‌فاکتور</li><li>هماهنگی اسناد، بارگیری و حمل</li></ol></article></div>
    </section>
    <section class="english" id="english" lang="en">
      <h2 class="section-title">{esc(product['en'])} Supplier and Export Inquiry</h2>
      <p class="section-intro">{esc(product['english'])}</p>
      <div class="content-grid"><article class="card"><h3>Commercial inquiry details</h3><p>Please provide grade, standard, dimensions, quantity, destination, inspection requirements and preferred delivery terms. Availability and commercial terms are confirmed only in the relevant quotation.</p></article><article class="card"><h3>Specifications and export checks</h3><p>Confirm product grade, dimensions, quantity, mill test certificates, packing and shipment terms before ordering.</p><p>Mohajer Mobin Steel is a steel trading and export business serving qualified domestic and international inquiries.</p></article></div>
    </section>
    <section class="section-white">
      <div class="faq"><h2 class="section-title">سؤالات متداول {esc(product['fa'])}</h2><details><summary>برای خرید {esc(product['fa'])} چه اطلاعاتی لازم است؟</summary><p>گرید، ابعاد، مقدار، استاندارد، محل تحویل و نیاز بازرسی را اعلام کنید تا امکان تأمین و پیشنهاد تجاری بررسی شود.</p></details><details><summary>آیا {esc(product['fa'])} برای صادرات عرضه می‌شود؟</summary><p>بله؛ امکان صادرات پس از تأیید موجودی، مشخصات فنی، مقصد، روش حمل و الزامات اسنادی بررسی می‌شود.</p></details><details><summary>قیمت {esc(product['fa'])} چگونه تعیین می‌شود؟</summary><p>قیمت ثابت نیست و به مشخصات فنی، مقدار سفارش، کارخانه، بازار، محل تحویل، هزینه حمل و شرایط پرداخت وابسته است. برای قیمت معتبر باید استعلام ارسال شود.</p></details></div>
    </section>
    <section><h2 class="section-title">سایر محصولات فولاد مهاجر مبین</h2><p class="section-intro">برای بررسی محصولات مرتبط، مشخصات را مشاهده کنید یا <a href="../">فهرست کامل ۱۲ محصول فولادی</a> را ببینید.</p>{guide_link_html}<div class="related-grid">{related_links(product['slug'])}</div></section>
    {language_cta}<section class="contact-strip" id="contact"><h2 class="section-title">استعلام {esc(product['fa'])}</h2><p>برای دریافت پیشنهاد تجاری، مشخصات فنی، مقدار سفارش و مقصد را از طریق اطلاعات تماس رسمی سایت ارسال کنید. قیمت و موجودی فقط پس از بررسی درخواست تأیید می‌شود.</p><a class="button" href="mailto:info@mohajer-group.com?subject={esc(product['en'])}%20Inquiry">ارسال درخواست به واحد بازرگانی</a></section>
  </main>
  <footer>© Mohajer Mobin Steel — فولاد مهاجر مبین؛ تأمین، تجارت و صادرات محصولات فولادی</footer>
</body>
</html>
'''


def main() -> None:
    products_dir = ROOT / "products"
    products_dir.mkdir(exist_ok=True)
    for product in PRODUCTS:
        if product["slug"] == "steel-billet":  # Bespoke landing page is maintained separately.
            continue
        output_dir = products_dir / product["slug"]
        output_dir.mkdir(exist_ok=True)
        (output_dir / "index.html").write_text(render(product), encoding="utf-8")
    print(f"Generated {len(PRODUCTS) - 1} standard product pages; bespoke billet preserved")


if __name__ == "__main__":
    main()
