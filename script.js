document.addEventListener('DOMContentLoaded', () => {

    // ذخیره کلید محصول فعال
    let activeProductKey = null;

    // ==========================================================================
    // لیست تصاویر اختصاصی محصولات
    // ==========================================================================
    const productImages = {
        round: "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto:good/v1782902903/%D8%B4%D9%85%D8%B4_cwnxsi.webp",
        plates: "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto:good/v1782902906/%D9%88%D8%B1%D9%82_c5og8d.webp",
        rebar: "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto:good/v1782902904/%D9%85%DB%8C%D9%84%DA%AF%D8%B1%D8%AF_fw75cx.webp",
        angle: "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto:good/v1782902904/%D9%86%D8%A8%D8%B4%DB%8C_fbbc6a.webp",
        channels: "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto:good/v1782902905/%D9%86%D9%88%D8%AF%D8%A7%D9%86%DB%8C_b0ctoh.webp",
        beams: "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto:good/v1782902900/%D8%AA%DB%8C%D8%B1%D8%A7%D9%87%D9%86_gjwwlx.webp",
        pipes: "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto:good/v1782902904/%D9%84%D9%88%D9%84%D9%87_d5rvnj.webp",
        tubes: "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto:good/v1782902908/%D9%BE%D8%B1%D9%88%D9%81%DB%8C%D9%84_fsuqgc.webp",
        flat: "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto:good/v1782902899/%D8%AA%D8%B3%D9%85%D9%87_roluwo.webp",
        slab: "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto:good/v1782902907/%D8%A7%D8%B3%D9%84%D8%A8_lyxy3f.webp",
        coils: "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto:good/v1782902904/%DA%A9%D9%84%D8%A7%D9%81_rseobr.webp",
        wires: "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto:good/v1782902904/%D9%85%D9%81%D8%AA%D9%88%D9%84_pffty8.webp"
    };

    // ==========================================================================
    // لیست تصاویر دیتاشیت محصولات
    // ==========================================================================
    const datasheetImages = {
        round: "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto:good/v1782899239/3_leycac.png",       
        plates: "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto:good/v1782899273/6_d1ca01.png",      
        rebar: "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto:good/v1782899233/1_qzmxom.png",       
        angle: "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto:good/v1782899242/4_e42dej.png",       
        channels: "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto:good/v1782899243/5_dmqufn.png",    
        beams: "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto:good/v1782899240/2_p26oen.png",       
        pipes: "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto:good/v1782899268/9_ttqkzc.png",       
        tubes: "",                                                                     
        flat: "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto:good/v1782899260/8_d42ssf.png",        
        slab: "",                                                                 
        coils: "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto:good/v1782899242/7_xvgoxc.png",       
        wires: "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto:good/v1782899271/10_cbrmmx.png"        
    };

    const productOrder = [
        'round', 'plates', 'rebar', 'angle', 'channels', 'beams', 
        'pipes', 'tubes', 'flat', 'slab', 'coils', 'wires'
    ];

    // ==========================================================================
    // پایگاه داده کامل مشخصات محصولات
    // ==========================================================================
    const productSpecs = {
        en: {
            round: {
                category: "STEEL BILLETS", title: "Steel Billets",
                desc: "High-quality steel billets / round bars engineered for hot rolling, construction, and general forging applications.",
                chemicalTitle: "Chemical Composition",
                tableHeaders: ["Grade", "C %", "Si %", "Mn %", "S % (max)", "P % (max)", "Cu %", "Ni %", "Cr %", "Mo %", "V %"],
                tableRows: [
                    ["ST 3SP", "0.14 - 0.22", "0.15 - 0.30", "0.40 - 0.65", "0.04", "0.04", "-", "-", "-", "-", "-"],
                    ["ST 4SP", "0.18 - 0.27", "0.15 - 0.30", "0.40 - 0.70", "0.04", "0.04", "-", "-", "-", "-", "-"],
                    ["ST 5SP", "0.28 - 0.37", "0.15 - 0.30", "0.50 - 0.80", "0.04", "0.04", "-", "-", "-", "-", "-"]
                ],
                quickSpecs: [["Material Grade", "ST 3SP / ST 4SP / ST 5SP"], ["Product Type", "Steel Billet"], ["Diameter Range", "80 to 200 mm"], ["Length", "6m / 12m or Custom"], ["Sizes", "100*100, 120*120, 125*125, 130*130, 150*150"]]
            },
            plates: {
                category: "STEEL PLATES", title: "Steel Plates",
                desc: "Heavy-duty steel plates engineered for rolling, structural steel frames, and high durability industrial applications.",
                chemicalTitle: "Chemical Composition",
                tableHeaders: ["Grade", "C %", "Mn %", "Si %", "P %", "S %", "Al %", "Cu %", "Ni %", "Cr %", "Mo %"],
                tableRows: [
                    ["ST 37.2", "0.12 - 0.22", "0.4 - 0.9", "Max 0.35", "Max 0.025", "Max 0.025", "Max 0.07", "-", "-", "-", "-"],
                    ["ST 52", "0.16 - 0.195", "1.1 - 1.5", "0.15 - 0.4", "Max 0.025", "Max 0.025", "Max 0.07", "-", "-", "-", "-"]
                ],
                quickSpecs: [["Material Grade", "ST37 - ST52"], ["Product Type", "Hot Rolled"], ["Thickness", "0.5 to 40 mm"], ["Dimensions", "1 to 1.25"], ["Surface Finish", "Roll and Sheet"]]
            },
            rebar: {
                category: "STEEL BARS", title: "Rebar",
                desc: "High-yield deformed reinforcing steel bars designed to provide excellent bonding strength in concrete structures.",
                chemicalTitle: "Mechanical Properties",
                tableHeaders: ["Grade", "Tensile Strength (MPa)", "Yield Strength (MPa)", "Ratio (Tensile/Yield)", "Elongation (A10) %"],
                tableRows: [
                    ["A2 (340)", "340", "500", "1.25", "15"],
                    ["A3 (400)", "400", "600", "1.25", "12"],
                    ["A4 (500)", "500", "650", "1.25", "8"]
                ],
                quickSpecs: [["Material Grade", "A2 (340) / A3 (400) / A4 (500)"], ["Product Type", "Deformed TMT Rebar"], ["Surface Finish", "Hot Rolled Tempered"], ["Length", "12m or Custom Cut"], ["Bar Size", "8mm to 40mm"]]
            },
            angle: {
                category: "ANGLE BARS", title: "Angle Bars",
                desc: "Hot rolled equal steel angle profiles offering excellent structural rigidity, weldability, and fabrication ease.",
                chemicalTitle: "Dimensions & Physical Specifications",
                tableHeaders: ["Type Angle", "a (mm)", "t (mm)", "r (mm)", "Area (cm²)", "Mass (Kg/m)"],
                tableRows: [
                    ["100*100*10", "100", "10", "12", "19.2", "15"],
                    ["120*120*12", "120", "12", "13", "27.5", "12.6"]
                ],
                quickSpecs: [["Material Grade", "S235JR / S275JR / S355JR"], ["Product Type", "Hot Rolled Equal Angle"], ["Surface Finish", "Bare / Galvanized / Primed"], ["Leg Width", "25 to 100 mm"], ["Length", "6m / 12m or Custom Cuts"]]
            },
            channels: {
                category: "STRUCTURAL STEEL", title: "U-Channels",
                desc: "Structural hot-rolled standard U-profile channels with tapered flanges for heavy frameworks.",
                chemicalTitle: "Dimensions & Structural Specifications",
                tableHeaders: ["Size (UPN)", "Height h (mm)", "Width b (mm)", "Web s (mm)", "Flange t (mm)", "Area (cm²)", "Mass (Kg/m)"],
                tableRows: [
                    ["12 (UPN 120)", "120", "52", "4.8", "7.8", "13.3", "10.4"],
                    ["14 (UPN 140)", "140", "58", "4.9", "8.1", "15.6", "12.3"]
                ],
                quickSpecs: [["Material Grade", "S235JR / S275JR / S355JR"], ["Product Type", "Hot Rolled UPN Channel"], ["Surface Finish", "Bare / Galvanized / Painted"], ["Size", "8 to 22 mm"], ["Length", "6m / 12m or Custom"]]
            },
            beams: {
                category: "STRUCTURAL STEEL", title: "Steel Beams",
                desc: "Hot rolled wide flange heavy H-beams engineered for high load-bearing steel frameworks.",
                chemicalTitle: "Dimensions & Sectional Specifications",
                tableHeaders: ["Size (HEB)", "Height h (mm)", "Width b (mm)", "Web s (mm)", "Flange t (mm)", "Radius r (mm)", "Area (cm²)", "Mass (Kg/m)"],
                tableRows: [
                    ["10 (HEB 100)", "100", "100", "6.0", "10.0", "12", "26.0", "20.4"],
                    ["12 (HEB 120)", "120", "120", "6.5", "11.0", "12", "34.0", "26.7"]
                ],
                quickSpecs: [["Material Grade", "S275JR / S355JR / S355J2"], ["Product Type", "Wide Flange H-Beam HEB"], ["Surface Finish", "Bare / Primed / Painted"], ["Length", "6m / 12m or Custom Dimensions"], ["Size", "10 to 30"]]
            },
            pipes: {
                category: "STEEL PIPES", title: "Steel Pipes",
                desc: "High-quality steel pipes designed for fluid and gas transport, structural applications, and various industrial uses.",
                chemicalTitle: "Chemical Composition",
                tableHeaders: ["Grade", "C %", "Mn %", "P %", "S %", "Si %", "Cu %", "Ni %", "Cr %", "Mo %", "V %"],
                tableRows: [
                    ["Grade A", "0.25 max", "0.95 max", "0.05 max", "0.045 max", "0.10 min", "0.40 max", "0.40 max", "0.40 max", "0.15 max", "Balance"],
                    ["Grade B", "0.30 max", "1.20 max", "0.05 max", "0.045 max", "0.10 min", "0.40 max", "0.40 max", "0.40 max", "0.15 max", "Balance"]
                ],
                quickSpecs: [["Material Grade", "Standard"], ["Product Type", "Seamless / Welded"], ["Surface Finish", "Black / Galvanized"], ["Length", "6m, 12m or Custom"], ["End Type", "Plain End / Beveled / Threaded"]]
            },
            tubes: {
                category: "PROFILES", title: "Profiles",
                desc: "Precision welded and seamless square steel tubes designed for structural, architectural, and fabrication applications.",
                chemicalTitle: "Chemical Composition",
                tableHeaders: ["Grade", "C %", "Mn %", "P %", "S %", "Si %", "Cu %", "Ni %", "Cr %", "Mo %", "V %"],
                tableRows: [
                    ["Grade B", "0.26 max", "1.35 max", "0.035 max", "0.035 max", "0.15 min", "0.40 max", "0.40 max", "0.40 max", "0.15 max", "Balance"]
                ],
                quickSpecs: [["Material Grade", "Grade A / B / C"], ["Product Type", "Welded / Seamless"], ["Surface Finish", "Oiled / Bare / Galvanized"], ["Length", "6m or Custom Size"], ["Wall Thickness", "1.5mm to 10.0mm"]]
            },
            flat: {
                category: "STEEL STRIPS", title: "Steel Strips",
                desc: "Highly versatile flat steel bars manufactured with clean square corners, ideal for structural framing.",
                chemicalTitle: "Chemical Composition",
                tableHeaders: ["Grade", "C %", "Mn %", "P %", "S %", "Si %", "Cu %", "Ni %", "Cr %", "Mo %", "V %"],
                tableRows: [
                    ["Flat Bar", "0.25 max", "0.90 max", "0.04 max", "0.05 max", "0.40 max", "0.20 min", "0.40 max", "0.40 max", "0.15 max", "Balance"]
                ],
                quickSpecs: [["Material Grade", "Standard / S275JR"], ["Product Type", "Hot Rolled Flat Profile"], ["Surface Finish", "Bare / Galvanized"], ["Width", "50 to 200 mm"], ["Thickness Range", "3.0mm to 25mm"]]
            },
            slab: {
                category: "STEEL SLABS", title: "Steel Slabs",
                desc: "High-quality steel slabs for industrial manufacturing and heavy rolling.",
                chemicalTitle: "Chemical Composition",
                tableHeaders: ["Grade", "C %", "Mn %", "P %", "S %", "Si %", "Cu %", "Ni %", "Cr %", "Mo %", "V %"],
                tableRows: [
                    ["Industrial Slab", "0.25 max", "0.80 - 1.20", "0.04 max", "0.05 max", "0.15 - 0.40", "0.20 min", "0.40 max", "0.40 max", "0.15 max", "Balance"]
                ],
                quickSpecs: [["Material Grade", "ST37 - ST52"], ["Product Type", "Hot Rolled"], ["Thickness", "0.5 to 40 mm"], ["Dimensions", "1 to 1.25"], ["Surface Finish", "Slab"]]
            },
            coils: {
                category: "STEEL COILS", title: "Galvanized Coils",
                desc: "Corrosion-resistant hot-dip galvanized steel coils offering excellent durability and surface protection.",
                chemicalTitle: "Chemical Composition",
                tableHeaders: ["Grade", "C %", "Mn %", "P %", "S %", "Si %", "Cu %", "Ni %", "Cr %", "Mo %", "V %"],
                tableRows: [
                    ["CS Type B", "0.15 max", "0.60 max", "0.035 max", "0.035 max", "0.15 min", "0.20 min", "0.40 max", "0.40 max", "0.15 max", "Balance"]
                ],
                quickSpecs: [["Material Grade", "3SP-RST34-1006-1008"], ["Product Type", "Galvanized Steel Coil"], ["Zinc Coating", "Z80 to Z275 g/m²"], ["Thickness", "5.5, 6.5, 8, 10"]]
            },
            wires: {
                category: "STEEL WIRES", title: "Steel Wires",
                desc: "High-tensile cold-drawn low-carbon steel wires designed for industrial mesh grids and construction tying.",
                chemicalTitle: "Products & Pricing",
                tableHeaders: ["Product Name", "Size", "Type", "Code / Price"],
                tableRows: [
                    ["Wire 0.9 Hot Galvanized", "0.9 mm", "Hot", "134000"],
                    ["Wire 1.2 Hot Galvanized", "1.2 mm", "Hot", "131000"],
                    ["Scoop Wire 1.5", "1.5 mm", "Hot", "126000"],
                    ["Wire 2 Hot Galvanized", "2.0 mm", "Hot", "1119600"],
                    ["Wire 2.2 Hot Galvanized", "2.2 mm", "Hot", "119500"],
                    ["Wire 2.4 Hot Galvanized", "2.4 mm", "Hot", "119500"],
                    ["Wire 2.8 Hot Galvanized", "2.8 mm", "Hot", "119500"],
                    ["Wire 3 Hot Galvanized", "3.0 mm", "Hot", "119500"],
                    ["Wire 3.5 Hot Galvanized", "3.5 mm", "Hot", "119500"],
                    ["Wire 4 Hot Galvanized", "4.0 mm", "Hot", "-"]
                ],
                quickSpecs: [["Product Type", "Black Galvanized"], ["Surface Finish", "Galvanized / Black Annealed"], ["Diameter Range", "1.0mm to 6.0mm"], ["Packaging", "Coils / Spools"]]
            }
        },
        fa: {
            round: {
                category: "شمش فولادی", title: "شمش",
                desc: "شمش‌ها و مقاطع فولادی با کیفیت عالی تولید شده، طراحی شده برای صنایع نورد گرم، ساخت و ساز و کاربردهای فورج عمومی.",
                chemicalTitle: "ترکیب شیمیایی شمش",
                tableHeaders: ["گرید", "C %", "Si %", "Mn %", "S % (حداکثر)", "P % (حداکثر)", "Cu %", "Ni %", "Cr %", "Mo %", "V %"],
                tableRows: [
                    ["ST 3SP", "0.14 - 0.22", "0.15 - 0.30", "0.40 - 0.65", "0.04", "0.04", "-", "-", "-", "-", "-"],
                    ["ST 4SP", "0.18 - 0.27", "0.15 - 0.30", "0.40 - 0.70", "0.04", "0.04", "-", "-", "-", "-", "-"],
                    ["ST 5SP", "0.28 - 0.37", "0.15 - 0.30", "0.50 - 0.80", "0.04", "0.04", "-", "-", "-", "-", "-"]
                ],
                quickSpecs: [["گرید متریال", "ST 3SP / ST 4SP / ST 5SP"], ["نوع محصول", "شمش فولادی"], ["محدوده ابعاد", "80 تا 200 میل"], ["طول شاخه", "۶ یا ۱۲ متری یا سفارشی"], ["سایزها", "100*100, 120*120, 125*125, 130*130, 150*150"]]
            },
            plates: {
                category: "ورق فولادی", title: "ورق فولادی",
                desc: "ورق‌های فولادی با کیفیت بسیار بالا، ایده‌آل برای صنایع نورد مجدد، اسکلت‌های فلزی سنگین و پروژه‌های بادوام صنعتی.",
                chemicalTitle: "ترکیب شیمیایی",
                tableHeaders: ["گرید", "C %", "Mn %", "Si % (حداکثر)", "P % (حداکثر)", "S % (حداکثر)", "Al % (حداکثر)", "Cu %", "Ni %", "Cr %", "Mo %"],
                tableRows: [
                    ["ST 37.2", "0.12 - 0.22", "0.4 - 0.9", "Max 0.35", "Max 0.025", "Max 0.025", "Max 0.07", "-", "-", "-", "-"],
                    ["ST 52", "0.16 - 0.195", "1.1 - 1.5", "0.15 - 0.4", "Max 0.025", "Max 0.025", "Max 0.07", "-", "-", "-", "-"]
                ],
                quickSpecs: [["گرید متریال", "ST37-ST52"], ["نوع محصول", "نورد گرم"], ["ضخامت", "0.5 تا 40 میل"], ["ابعاد", "1 تا 1.25"], ["سطح نهایی", "رول و شیت"]]
            },
            rebar: {
                category: "میلگردهای فولادی", title: "میلگرد",
                desc: "میلگردهای آجدار تقویت‌کننده بتن با تنش تسلیم بالا جهت مهاربندی بتن و دوام اسکلت‌های فلزی.",
                chemicalTitle: "خواص مکانیکی میلگرد",
                tableHeaders: ["گرید", "استحکام کششی (MPa)", "مقاومت تسلیم (MPa)", "نسبت استحکام کششی به تسلیم", "درصد افزایش طول (A10)"],
                tableRows: [
                    ["A2 (340)", "340", "500", "1.25", "15"],
                    ["A3 (400)", "400", "600", "1.25", "12"],
                    ["A4 (500)", "500", "650", "1.25", "8"]
                ],
                quickSpecs: [["گرید متریال", "A2 (340) / A3 (400) / A4 (500)"], ["نوع محصول", "میلگرد آجدار TMT"], ["سطح نهایی", "نورد گرم ترمکس (تمپرد)"], ["طول شاخه", "۱۲ متری یا برش سفارشی"], ["سایز میلگرد", "۸ میلی‌متر تا ۴۰ میلی‌متر"]]
            },
            angle: {
                category: "نبشی", title: "نبشی",
                desc: "پروفیل‌های نبشی بال‌مساوی نورد گرم با مقاومت استاتیکی بالا جهت اتصالات سازه، خرپاها و دکل‌ها.",
                chemicalTitle: "ابعاد و مشخصات فنی نبشی",
                tableHeaders: ["نوع نبشی", "اندازه بال a (mm)", "ضخامت t (mm)", "شعاع r (mm)", "مقطع (cm²)", "وزن (Kg/m)"],
                tableRows: [
                    ["100*100*10", "100", "10", "12", "19.2", "15"],
                    ["120*120*12", "120", "12", "13", "27.5", "12.6"]
                ],
                quickSpecs: [["گرید متریال", "S235JR / S275JR / S355JR"], ["نوع محصول", "نبشی بال مساوی نورد گرم"], ["سطح نهایی", "خام / گالوانیزه / آسترزده"], ["اندازه بال", "25 تا 100 میل"], ["طول شاخه", "۶ یا ۱۲ متری یا سفارشی"]]
            },
            channels: {
                category: "فولاد سازه‌ای", title: "ناودانی (U-Channel)",
                desc: "ناودانی‌های سنگین نورد گرم با بال شیب‌دار جهت ساخت قاب‌های مهندسی و شاسی‌سازی سنگین.",
                chemicalTitle: "ابعاد و مشخصات فنی ناودانی",
                tableHeaders: ["سایز (UPN)", "ارتفاع h (mm)", "عرض بال b (mm)", "ضخامت جان s (mm)", "ضخامت بال t (mm)", "مقطع (cm²)", "وزن (Kg/m)"],
                tableRows: [
                    ["12 (UPN 120)", "120", "52", "4.8", "7.8", "13.3", "10.4"],
                    ["14 (UPN 140)", "140", "58", "4.9", "8.1", "15.6", "12.3"]
                ],
                quickSpecs: [["گرید متریال", "S235JR / S275JR / S355JR"], ["نوع محصول", "ناودانی اروپایی UPN نورد گرم"], ["سطح نهایی", "خام / گالوانیزه / رنگ شده"], ["سایز", "8 تا 22 میل"], ["طول استاندارد", "۶ یا ۱۲ متری یا سفارشی"]]
            },
            beams: {
                category: "فولاد سازه‌ای", title: "تیرآهن",
                desc: "تیرآهن‌های بال‌پهن سنگین نورد گرم، ایده‌آل برای پروژه‌های عظیم ساختمانی و بارهای مرده ساختاری.",
                chemicalTitle: "ابعاد و مشخصات فنی تیرآهن",
                tableHeaders: ["سایز (HEB)", "ارتفاع h (mm)", "عرض بال b (mm)", "ضخامت جان s (mm)", "ضخامت بال t (mm)", "شعاع r (mm)", "مقطع (cm²)", "وزن (Kg/m)"],
                tableRows: [
                    ["10 (HEB 100)", "100", "100", "6.0", "10.0", "12", "26.0", "20.4"],
                    ["12 (HEB 120)", "120", "120", "6.5", "11.0", "12", "34.0", "26.7"]
                ],
                quickSpecs: [["گرید متریال", "S275JR / S355JR / S355J2"], ["نوع محصول", "تیرآهن بال‌پهن سنگین"], ["سطح نهایی", "خام / آسترزده / رنگ شده"], ["طول شاخه", "۶ یا ۱۲ متری یا سفارشی"], ["سایز", "10 تا 30"]]
            },
            pipes: {
                category: "لوله‌های فولادی", title: "لوله",
                desc: "لوله‌های فولادی با کیفیت بالا طراحی شده برای انتقال سیالات و گاز، کاربردهای سازه‌ای و استفاده‌های مختلف صنعتی.",
                chemicalTitle: "ترکیب شیمیایی",
                tableHeaders: ["گرید", "C %", "Mn %", "P %", "S %", "Si %", "Cu %", "Ni %", "Cr %", "Mo %", "V %"],
                tableRows: [
                    ["گرید A", "0.25 حداکثر", "0.95 حداکثر", "0.05 حداکثر", "0.045 حداکثر", "0.10 حداقل", "0.40 حداکثر", "0.40 حداکثر", "0.40 حداکثر", "0.15 حداکثر", "باقی‌مانده"],
                    ["گرید B", "0.30 حداکثر", "1.20 حداکثر", "0.05 حداکثر", "0.045 حداکثر", "0.10 حداقل", "0.40 حداکثر", "0.40 حداکثر", "0.40 حداکثر", "0.15 حداکثر", "باقی‌مانده"]
                ],
                quickSpecs: [["گرید متریال", "استاندارد"], ["نوع محصول", "بدون درز / درزدار"], ["سطح نهایی", "سیاه / گالوانیزه"], ["طول", "۶ متری، ۱۲ متری یا سفارشی"], ["نوع انتها", "ساده / پخ‌خورده / دنده‌دار"]]
            },
            tubes: {
                category: "قوطی و پروفیل", title: "پروفیل",
                desc: "پروفیل‌های فولادی با دقت ابعادی بالا جهت مصارف ساختمانی، شاسی‌سازی و اسکلت فلزی سبک.",
                chemicalTitle: "ترکیب شیمیایی",
                tableHeaders: ["گرید", "C %", "Mn %", "P %", "S %", "Si %", "Cu %", "Ni %", "Cr %", "Mo %", "V %"],
                tableRows: [
                    ["گرید B", "0.26 حداکثر", "1.35 حداکثر", "0.035 حداکثر", "0.035 حداکثر", "0.15 حداقل", "0.40 حداکثر", "0.40 حداکثر", "0.40 حداکثر", "0.15 حداکثر", "باقی‌مانده"]
                ],
                quickSpecs: [["گرید متریال", "Grade A / B / C"], ["نوع محصول", "درزدار / بدون درز"], ["سطح نهایی", "روغن‌کاری‌شده / خام"], ["طول", "۶ متری یا ابعاد سفارشی"], ["ضخامت دیواره", "۱.۵ تا ۱۰.۰ میلی‌متر"]]
            },
            flat: {
                category: "تسمه فولادی", title: "تسمه",
                desc: "تسمه‌های فولادی نورد شده با لبه‌های بسیار تمیز و گونیایی، ایده‌آل برای قاب‌بندی، فریم‌های صنعتی و قطعه‌سازی عمومی.",
                chemicalTitle: "ترکیب شیمیایی",
                tableHeaders: ["گرید", "C %", "Mn %", "P %", "S %", "Si %", "Cu %", "Ni %", "Cr %", "Mo %", "V %"],
                tableRows: [
                    ["تسمه فولادی", "0.25 حداکثر", "0.90 حداکثر", "0.04 حداکثر", "0.05 حداکثر", "0.40 حداکثر", "0.20 حداقل", "0.40 حداکثر", "0.40 حداکثر", "0.15 حداکثر", "باقی‌مانده"]
                ],
                quickSpecs: [["گرید متریال", "استاندارد / S275JR"], ["نوع محصول", "تسمه نورد گرم ساختمانی"], ["سطح نهایی", "ساده / گالوانیزه گرم"], ["عرض تسمه", "50 تا 200 میل"], ["ضخامت تسمه", "۳.۰ تا ۲۵ میلی‌متر"]]
            },
            slab: {
                category: "اسلب‌های فولادی", title: "اسلب فولادی",
                desc: "اسلب‌های فولادی با کیفیت بالا مناسب مصارف نورد و تولید ورق.",
                chemicalTitle: "ترکیب شیمیایی",
                tableHeaders: ["گرید", "C %", "Mn %", "P %", "S %", "Si %", "Cu %", "Ni %", "Cr %", "Mo %", "V %"],
                tableRows: [
                    ["اسلب صنعتی", "0.25 حداکثر", "0.80 - 1.20", "0.04 حداکثر", "0.05 حداکثر", "0.15 - 0.40", "0.20 حداقل", "0.40 حداکثر", "0.40 حداکثر", "0.15 حداکثر", "باقی‌مانده"]
                ],
                quickSpecs: [["گرید متریال", "ST37-ST52"], ["نوع محصول", "نورد گرم"], ["ضخامت", "0.5 تا 40 میل"], ["ابعاد", "1 تا 1.25"], ["سطح نهایی", "اسلب مقطعی"]]
            },
            coils: {
                category: "کویل‌های فولادی", title: "کلاف",
                desc: "کویل‌های فولادی گالوانیزه شده به روش غوطه‌وری گرم با مقاومت استثنایی در برابر زنگ‌زدگی، فرم‌پذیری عالی و کیفیت بالای پوشش سطحی.",
                chemicalTitle: "ترکیب شیمیایی",
                tableHeaders: ["گرید", "C %", "Mn %", "P %", "S %", "Si %", "Cu %", "Ni %", "Cr %", "Mo %", "V %"],
                tableRows: [
                    ["ورق گالوانیزه CS", "0.15 حداکثر", "0.60 حداکثر", "0.035 حداکثر", "0.035 حداکثر", "0.15 حداقل", "0.20 حداقل", "0.40 حداکثر", "0.40 حداکثر", "0.15 حداکثر", "باقی‌مانده"]
                ],
                quickSpecs: [["گرید متریال", "3SP-RST34-1006-1008"], ["نوع محصول", "کویل فولادی گالوانیزه"], ["پوشش روی (Zinc)", "Z80 تا Z275 گرم بر مترمربع"], ["ضخامت", "5.5 و 6.5 و 8 و 10"]]
            },
            wires: {
                category: "مفتول‌های فولادی", title: "مفتول فولادی",
                desc: "مفتول‌های فولادی با کربن کم و مقاومت کششی بالا جهت توری، آرماتوربندی، ساخت میخ، پیچ و صنایع مفتولی عمومی.",
                chemicalTitle: "لیست محصولات و قیمت",
                tableHeaders: ["نام محصول", "سایز", "نوع پوشش", "کد / قیمت"],
                tableRows: [
                    ["مفتول 0.9 گالوانیزه گرم", "0.9 mm", "گرم", "134000"],
                    ["سیم مفتول 1.2 گالوانیزه گرم", "1.2 mm", "گرم", "131000"],
                    ["سیم اسکوپ مفتول 1.5", "1.5 mm", "گرم", "126000"],
                    ["مفتول 2 گالوانیزه گرم", "2.0 mm", "گرم", "1119600"],
                    ["مفتول 2.2 گالوانیزه گرم", "2.2 mm", "گرم", "119500"],
                    ["مفتول 2.4 گالوانیزه گرم", "2.4 mm", "گرم", "119500"],
                    ["مفتول 2.8 گالوانیزه گرم", "2.8 mm", "گرم", "119500"],
                    ["مفتول 3 گالوانیزه گرم", "3.0 mm", "گرم", "119500"],
                    ["مفتول 3.5 گالوانیزه گرم", "3.5 mm", "گرم", "119500"],
                    ["مفتول 4 گالوانیزه گرم", "4.0 mm", "گرم", "-"]
                ],
                quickSpecs: [["نوع محصول", "سیاه گالوانیزه"], ["سطح نهایی", "گالوانیزه / آنیل سیاه"], ["محدوده قطر مفتول", "۱.۰ تا ۶.۰ میلی‌متر"], ["نوع بسته‌بندی", "کلاف / قرقره"]]
            }
        },
        ar: {
            round: {
                category: "أنابيب الصلب", title: "أنابيب الصلب",
                desc: "عروق الصلب الدائرية ملساء ومثالية لأعمال التشغيل اليدوي والحدادة.",
                chemicalTitle: "التركيب الكيميائي",
                tableHeaders: ["الفئة", "C %", "Si %", "Mn %", "S % (أقصى)", "P % (أقصى)", "Cu %", "Ni %", "Cr %", "Mo %", "V %"],
                tableRows: [
                    ["ST 3SP", "0.14 - 0.22", "0.15 - 0.30", "0.40 - 0.65", "0.04", "0.04", "-", "-", "-", "-", "-"],
                    ["ST 4SP", "0.18 - 0.27", "0.15 - 0.30", "0.40 - 0.70", "0.04", "0.04", "-", "-", "-", "-", "-"],
                    ["ST 5SP", "0.28 - 0.37", "0.15 - 0.30", "0.50 - 0.80", "0.04", "0.04", "-", "-", "-", "-", "-"]
                ],
                quickSpecs: [["فئة المواد", "ST 3SP / ST 4SP / ST 5SP"], ["نوع المنتج", "عروق الصلب (بلت)"], ["نطاق الأقطار", "80 إلى 200 ملم"], ["طول القضيب", "6 م / 12 م أو حسب الطلب"], ["الأحجام", "100*100, 120*120, 125*125, 130*130, 150*150"]]
            },
            plates: {
                category: "بلاطات الصلب", title: "بلاطات الصلب",
                desc: "بلاطات الصلب الإنشائية المدرفلة من الفولاذ الكربوني المقاوم، تمتاز بجودتها العالية.",
                chemicalTitle: "التركيب الكيميائي",
                tableHeaders: ["الفئة", "C %", "Mn %", "Si % (أقصى)", "P % (أقصى)", "S % (أقصى)", "Al % (أقصى)", "Cu %", "Ni %", "Cr %", "Mo %"],
                tableRows: [
                    ["ST 37.2", "0.12 - 0.22", "0.4 - 0.9", "Max 0.35", "Max 0.025", "Max 0.025", "Max 0.07", "-", "-", "-", "-"],
                    ["ST 52", "0.16 - 0.195", "1.1 - 1.5", "0.15 - 0.4", "Max 0.025", "Max 0.025", "Max 0.07", "-", "-", "-", "-"]
                ],
                quickSpecs: [["فئة المواد", "ST37-ST52"], ["نوع المنتج", "درفلة ساخنة"], ["السمك", "0.5 إلى 40 ملم"], ["الأبعاد", "1 إلى 1.25"], ["تشطيب السطح", "رول وشيت"]]
            },
            rebar: {
                category: "قضبان التسليح", title: "حديد التسليح",
                desc: "حديد تسليح مضلع عالي المقاومة وذو متانة فائقة مصنع ليتلاءم بالكامل مع معايير الجودة.",
                chemicalTitle: "الخواص الميكانيكية",
                tableHeaders: ["الفئة", "قوة الشد (MPa)", "قوة الخضوع (MPa)", "نسبة قوة الشد إلى الخضوع", "الاستطالة (A10) %"],
                tableRows: [
                    ["A2 (340)", "340", "500", "1.25", "15"],
                    ["A3 (400)", "400", "600", "1.25", "12"],
                    ["A4 (500)", "500", "650", "1.25", "8"]
                ],
                quickSpecs: [["فئة المواد", "A2 (340) / A3 (400) / A4 (500)"], ["نوع المنتج", "حديد تسليح مضلع TMT"], ["تشطيب السطح", "درفلة ساخنة معالجة"], ["الطول", "12 م أو قص مخصص"], ["مقاس القضيب", "من 8 ملم إلى 40 ملم"]]
            },
            angle: {
                category: "زوايا حديد", title: "زوايا حديد",
                desc: "مقاطع حديد زاوية L بالدرفلة على الساخن بالزوايا متساوية بالكامل، تتميز بمتانتها الفائقة.",
                chemicalTitle: "أبعاد ومواصفات الزوايا",
                tableHeaders: ["نوع الزاوية", "طول الجناح a (مم)", "السماكة t (مم)", "نصف القطر r (مم)", "المساحة (سم²)", "الوزن (كجم/م)"],
                tableRows: [
                    ["100*100*10", "100", "10", "12", "19.2", "15"],
                    ["120*120*12", "120", "12", "13", "27.5", "12.6"]
                ],
                quickSpecs: [["فئة المواد", "S235JR / S275JR / S355JR"], ["نوع المنتج", "زاوية حديد إنشائية L"], ["تشطيب السطح", "عارٍ / مجلفن / مطلي"], ["عرض الجناح", "25 إلى 100 ملم"], ["طول القطعة القياسي", "6 م / 12 م أو مخصص"]]
            },
            channels: {
                category: "الفولاذ الإنشائي", title: "كمرات قنوات U",
                desc: "قنوات صلب مسطحة درفلة ساخنة مجهزة بالكامل لتطبيقات الإنشائية الكبرى.",
                chemicalTitle: "أبعاد ومواصفات قنوات U",
                tableHeaders: ["المقاس (UPN)", "الارتفاع h (مم)", "عرض الشفة b (مم)", "سمك الجسد s (مم)", "سمك الشفة t (مم)", "المساحة (سم²)", "الوزن (كجم/م)"],
                tableRows: [
                    ["12 (UPN 120)", "120", "52", "4.8", "7.8", "13.3", "10.4"],
                    ["14 (UPN 140)", "140", "58", "4.9", "8.1", "15.6", "12.3"]
                ],
                quickSpecs: [["فئة المواد", "S235JR / S275JR / S355JR"], ["نوع المنتج", "قطاعات UPN درفلة ساخنة"], ["تشطيب السطح", "عارٍ / مجلفن / مدهون"], ["المقاس", "8 إلى 22 ملم"], ["طول القياسي", "6 أمتار / 12 متر أو مخصص"]]
            },
            beams: {
                category: "الفولاذ الإنشائي", title: "كمرات حديد",
                desc: "كمرات حديد عريضة الجناحين ثقيلة HEB من الفولاذ الهيكلي الصلب لمقاومة الأحمال.",
                chemicalTitle: "أبعاد ومواصفات الكمرات",
                tableHeaders: ["المقاس (HEB)", "الارتفاع h (مم)", "عرض الشفة b (مم)", "سمك الجسد s (مم)", "سمك الشفة t (مم)", "نصف القطر r (مم)", "المساحة (سم²)", "الوزن (كجم/م)"],
                tableRows: [
                    ["10 (HEB 100)", "100", "100", "6.0", "10.0", "12", "26.0", "20.4"],
                    ["12 (HEB 120)", "120", "120", "6.5", "11.0", "12", "34.0", "26.7"]
                ],
                quickSpecs: [["فئة المواد", "S275JR / S355JR / S355J2"], ["نوع المنتج", "كمرات حديد عريضة الشفة HEB"], ["تشطيب السطح", "عارٍ / مطلي بالأساس"], ["طول القطعة", "6 م / 12 م أو أبعاد مخصصة"], ["المقاس", "10 إلى 30"]]
            },
            pipes: {
                category: "أنابيب الصلب", title: "أنابيب الصلب",
                desc: "أنابيب فولاذية عالية الجودة مصممة لنقل السوائل والغازات، التطبيقات الإنشائية، والاستخدامات الصناعية المختلفة.",
                chemicalTitle: "التركيب الكيميائي",
                tableHeaders: ["الفئة", "C %", "Mn %", "P %", "S %", "Si %", "Cu %", "Ni %", "Cr %", "Mo %", "V %"],
                tableRows: [
                    ["الفئة A", "0.25 كحد أقصى", "0.95 كحد أقصى", "0.05 كحد أقصى", "0.045 كحد أقصى", "0.10 كحد أدنى", "0.40 كحد أقصى", "0.40 كحد أقصى", "0.40 كحد أقصى", "0.15 كحد أقصى", "مستقر"],
                    ["الفئة B", "0.30 كحد أقصى", "1.20 كحد أقصى", "0.05 كحد أقصى", "0.045 كحد أقصى", "0.10 كحد أدنى", "0.40 كحد أقصى", "0.40 كحد أقصى", "0.40 كحد أقصى", "0.15 كحد أقصى", "مستقر"]
                ],
                quickSpecs: [["فئة المواد", "قياسي"], ["نوع المنتج", "غير ملحوم / ملحوم"], ["تشطيب السطح", "أسود / مجلفن"], ["الطول", "6 م، 12 م أو مخصص"], ["نوع النهاية", "نهاية مستوية / مشطوفة / مسننة"]]
            },
            tubes: {
                category: "بروفيلات", title: "بروفيلات",
                desc: "أنابيب فولاذية مربعة ومستطيلة ذات دقة عالية في التصنيع، مناسبة للاستخدام الإنشائي والصناعي.",
                chemicalTitle: "التركيب الكيميائي",
                tableHeaders: ["الفئة", "C %", "Mn %", "P %", "S %", "Si %", "Cu %", "Ni %", "Cr %", "Mo %", "V %"],
                tableRows: [
                    ["الفئة B", "0.26 كحد أقصى", "1.35 كحد أقصى", "0.035 كحد أقصى", "0.035 كحد أقصى", "0.15 كحد أدنى", "0.40 كحد أقصى", "0.40 كحد أقصى", "0.40 كحد أقصى", "0.15 كحد أقصى", "مستقر"]
                ],
                quickSpecs: [["فئة المواد", "Grade A / B / C"], ["نوع المنتج", "ملحوم / غير ملحوم"], ["تشطيب السطح", "مطلي بالزيت / عارٍ"], ["الطول", "6 م أو قياس مخصص"], ["سمك الجدار", "1.5 ملم إلى 10.0 ملم"]]
            },
            flat: {
                category: "شرائح صلب", title: "شرائح صلب",
                desc: "قضبان حديد مسطحة عالية المتانة والصلابة، مثالية لأعمال اللحام وقواعد التركيب والهياكل الهندسية العامة.",
                chemicalTitle: "التركيب الكيميائي",
                tableHeaders: ["الفئة", "C %", "Mn %", "P %", "S %", "Si %", "Cu %", "Ni %", "Cr %", "Mo %", "V %"],
                tableRows: [
                    ["خوص حديد", "0.25 كحد أقصى", "0.90 كحد أقصى", "0.04 كحد أقصى", "0.05 كحد أقصى", "0.40 كحد أقصى", "0.20 كحد أدنى", "0.40 كحد أقصى", "0.40 كحد أقصى", "0.15 كحد أقصى", "مستقر"]
                ],
                quickSpecs: [["فئة المواد", "قياسي / S275JR"], ["نوع المنتج", "خوص حديد ناعمة مسطحة"], ["تشطيب السطح", "عارٍ / مجلفن ساخن"], ["العرض", "50 إلى 200 ملم"], ["نطاق السمك", "من 3.0 ملم إلى 25 ملم"]]
            },
            slab: {
                category: "صفائح الصلب", title: "بلاطات الصلب",
                desc: "بلاطات الصلب الإنشائية المدرفلة من الفولاذ الكربوني المقاوم، تمتاز بجودتها العالية.",
                chemicalTitle: "التركيب الكيميائي",
                tableHeaders: ["الفئة", "C %", "Mn %", "P %", "S %", "Si %", "Cu %", "Ni %", "Cr %", "Mo %", "V %"],
                tableRows: [
                    ["لوح", "0.25 كحد أقصى", "0.80 - 1.20", "0.04 كحد أقصى", "0.05 كحد أقصى", "0.15 - 0.40", "0.20 كحد أدنى", "0.40 كحد أقصى", "0.40 كحد أقصى", "0.15 كحد أقصى", "مستقر"]
                ],
                quickSpecs: [["فئة المواد", "ST37-ST52"], ["نوع المنتج", "درفلة ساخنة"], ["السمك", "0.5 إلى 40 ملم"], ["الأبعاد", "1 إلى 1.25"], ["تشطيب السطح", "رول وشيت"]]
            },
            coils: {
                category: "لفائف الصلب", title: "لفائف مجلفنة (كويل)",
                desc: "لفائف فولاذية مجلفنة بطريقة الغمس الساخن لمقاومة فائقة ضد الصدأ والتآكل.",
                chemicalTitle: "التركيب الكيميائي",
                tableHeaders: ["الفئة", "C %", "Mn %", "P %", "S %", "Si %", "Cu %", "Ni %", "Cr %", "Mo %", "V %"],
                tableRows: [
                    ["لفائف مجلفنة CS", "0.15 كحد أقصى", "0.60 كحد أقصى", "0.035 كحد أقصى", "0.035 كحد أقصى", "0.15 كحد أدنى", "0.20 كحد أدنى", "0.40 كحد أقصى", "0.40 كحد أقصى", "0.15 كحد أقصى", "مستقر"]
                ],
                quickSpecs: [["فئة المواد", "3SP-RST34-1006-1008"], ["نوع المنتج", "لفائف صلب مجلفن غمس ساخن"], ["طبقة الزنك الحامية", "Z80 إلى Z275 جم/متر مربع"], ["السمك", "5.5، 6.5، 8، 10"]]
            },
            wires: {
                category: "أسلاك فولاذية", title: "أسلاك فولاذية ناعمة",
                desc: "أسلاك حديدية منخفضة الكربون مع مقاومة شد عالية، مصممة ومجهزة لتشكيل شبكات الحديد.",
                chemicalTitle: "المنتجات والأسعار",
                tableHeaders: ["اسم المنتج", "الحجم", "النوع", "الرمز / السعر"],
                tableRows: [
                    ["سلك 0.9 مجلفن حار", "0.9 mm", "حار", "134000"],
                    ["سلك 1.2 مجلفن حار", "1.2 mm", "حار", "131000"],
                    ["سلك سكوب 1.5", "1.5 mm", "حار", "126000"],
                    ["سلك 2 مجلفن حار", "2.0 mm", "حار", "1119600"],
                    ["سلك 2.2 مجلفن حار", "2.2 mm", "حار", "119500"],
                    ["سلك 2.4 مجلفن حار", "2.4 mm", "حار", "119500"],
                    ["سلك 2.8 مجلفن حار", "2.8 mm", "حار", "119500"],
                    ["سلك 3 مجلفن حار", "3.0 mm", "حار", "119500"],
                    ["سلك 3.5 مجلفن حار", "3.5 mm", "حار", "119500"],
                    ["سلك 4 مجلفن حار", "4.0 mm", "حار", "-"]
                ],
                quickSpecs: [["نوع المنتج", "أسود مجلفن"], ["تشطيب السطح", "مجلفن / صلب أسود"], ["نطاق القطر", "من 1.0 ملم إلى 6.0 ملم"], ["التعبئة والتغليف", "لفات دائرية / بكرات شحن"]]
            }
        },
        ru: {
            dir: 'ltr',
            'nav-home': 'Главная', 'nav-products': 'Продукция', 'nav-departments': 'Отдел', 'nav-about': 'О нас', 'nav-contact': 'Контакты',
            'btn-quote': 'Запросить расчет', 'hero-subtitle': 'СТАЛЬ ПРЕМИАЛЬНОГО КАЧЕСТВА', 
            'hero-title-1': 'MOHAJER MOBIN', 'hero-title-2': 'STEEL',
            'hero-desc': 'Дочерняя компания международного торговой группы Mohajer',
            'btn-explore': 'Каталог продукции', 'btn-catalog': 'Скачать каталог', 'trusted-title': 'Нам доверяют лидеры отрасли',
            'trusted-desc': 'Превосходное качество по всему миру.',
            'feat-1-title': 'Премиум качество', 'feat-1-desc': 'Проверено и сертифицировано по международным стандартам.',
            'feat-2-title': 'Высокая прочность', 'feat-2-desc': 'Создано для работы в самых суровых условиях.',
            'feat-3-title': 'Точно в срок', 'feat-3-desc': 'Надежная логистика для бесперебойной работы ваших проектов.',
            'feat-4-title': 'Экологичность', 'feat-4-desc': 'Стремление к экологически безопасному и ответственному производству.',
            'prod-sub': 'НАША ПРОДУКЦИЯ', 'prod-title': 'Стальная продукция премиум-класса',
            'prod-desc': 'Высококачественная сталь, разработанная для прочности, долговечности и надежности в каждом проекте.',
            'showing-txt-p1': 'Показано 1-8 из 12 товаров', 'showing-txt-p2': 'Показано 9-12 из 12 товаров', 'view-details': 'Подробнее',
            'cta-title': 'Не нашли то, что искали?', 'cta-desc': 'Свяжитесь с нашими экспертами для разработки индивидуальных решений под ваш проект.',
            'btn-custom-quote': 'Запрос коммерческого предложения',
            'prod-pipes-title': 'Стальные трубы', 'prod-pipes-desc': 'Надежные стальные трубы для транспортировки жидкостей и газов.',
            'prod-beams-title': 'Двутавры H-образные', 'prod-beams-desc': 'Высокопрочные двутавровые балки для несущих конструкций.',
            'prod-rebar-title': 'Арматура', 'prod-rebar-desc': 'Стальные прутки для армирования железобетонных конструкций.',
            'prod-tubes-title': 'Профильные трубы', 'prod-tubes-desc': 'Точные профильные трубы для различных нужд.',
            'prod-plates-title': 'Стальные листы', 'prod-plates-desc': 'Стальные листы высокой прочности для промышленности.',
            'prod-angle-title': 'Уголки', 'prod-angle-desc': 'Универсальные стальные L-образные профили.',
            'prod-flat-title': 'Стальные полосы', 'prod-flat-desc': 'Универсальные металлические полосы горячей прокатки.',
            'prod-round-title': 'Стальные круги', 'prod-round-desc': 'Прутки круглого сечения для токарной обработки и заготовок.',
            'prod-channel-title': 'Швеллеры (U-профиль)', 'prod-channel-desc': 'Конструкционные швеллеры для каркасов и опор.',
            'prod-slab-title': 'Слябы', 'prod-slab-desc': 'Конструкционные стальные слябы высокого качества для тяжелой промышленности.',
            'prod-coil-title': 'Оцинкованные рулоны', 'prod-coil-desc': 'Стальные рулоны с коррозионностойким покрытием.',
            'prod-wire-title': 'Стальная проволока', 'prod-wire-desc': 'Высокопрочная проволока для связки и сеток.',
            'btn-download-datasheet': 'Скачать технический паспорт',
            'btn-prev-prod': 'Предыдущий', 'btn-next-prod': 'Следующий',
            'detail-feat1-title': 'Высокая прочность', 'detail-feat1-desc': 'Создано на века',
            'detail-feat2-title': 'Устойчивость к коррозии', 'detail-feat2-desc': 'Долговечная защита',

            'contact-title-light': 'СТРОИМ БУДУЩЕЕ', 'contact-title-red': 'ВМЕСТЕ', 'contact-desc-hero': 'Наша команда готова ответить на ваши вопросы и предоставить лучшие решения для ваших проектов.',
            'contact-sub-title': 'СВЯЗАТЬСЯ С НАМИ',
            'contact-desc-text': 'Есть вопросы или необходимо индивидуальное решение? Наша команда готова помочь вам принять лучшее решение.',
            'contact-phone-lbl': 'Телефон', 'contact-email-lbl': 'Эл. почта', 'contact-addr-lbl': 'Адрес компании',
            'contact-addr-val': 'Иран, Мешхед, бульвар Джанбаз, административное здание Паж 2, этаж 3, офис 313',
            'contact-hours-lbl': 'Часы работы', 'contact-hours-val': 'Сб – Чт: с 8:00 до 17:00',
            'form-title': 'Отправить сообщение', 'form-sub': 'Заполните форму ниже, и мы свяжемся с вами в ближайшее время.',
            'placeholder-name': 'ФИО', 'placeholder-email': 'Адрес эл. почты', 'placeholder-company': 'Название компании',
            'placeholder-subject': 'Тема сообщения', 'placeholder-msg': 'Ваше сообщение', 'btn-send': 'Отправить',
            'trust-title': 'Партнерство, основанное на доверии', 'trust-desc': 'В Mohajer Steel мы верим, что крепкие партнерские отношения приносят наилучшие результаты.',
            'btn-call': 'Заказать обратный звонок', 'btn-direct-msg': 'Личное сообщение', 'msg-success': 'Ваше сообщение успешно отправлено!',

            'about-history': 'Наша история', 'history-sub-badge': 'ИСТОРИЯ КОМПАНИИ',
            'history-title-light': 'ИСТОРИЯ', 'history-title-red': 'КОМПАНИИ',
            'history-desc': 'Обладая более чем семидесятилетним опытом торговли и экспорта, компания Mohajer Steel выросла в одного из ведущих экспортеров провинции Хорасан-Резави, пользующегося доверием партнеров по всему миру.',
            'founder1-subtitle': 'Основатель', 'founder1-name': 'Покойный Хадж Гасем Мухаджери',
            'founder1-bio': 'Истоки нашего бизнеса восходят к <span class="highlight-year">1330</span> году, когда покойный Хадж Гасем Мухаджери Хорасани начал свою деятельность в сфере внутренней торговли кожей и кроссом. Опираясь на опыт, знание рынка и профессиональные принципы ведения бизнеса, он заложил фундамент для устойчивого и успешного предприятия.',
            'founder2-subtitle': 'Продолжение наследия', 'founder2-name': 'Г-н Хашем Мухаджери',
            'founder2-bio': 'Продолжая этот путь, с <span class="highlight-year">1374</span> года г-н Хашем Мухаджери Хорасани расширил экспортную деятельность компании, особенно в продовольственном секторе, используя ценный опыт прошлого и расширив наше присутствие на многих международных рынках.',
            'timeline-sub': 'НАШ ПУТЬ', 'timeline-title': 'История роста и приверженности делу',
            'timeline1-year': '1330', 'timeline1-title': 'Начало пути', 'timeline1-desc': 'Истоки нашего бизнеса восходят к 1330 году, когда покойный Хадж Гасем Мухаджери Хорасани начал свою деятельность в сфере внутренней торговли кожей и кроссом. Опираясь на опыт, знание рынка и профессиональные принципы ведения бизнеса, он заложил фундамент для устойчивого и успешного предприятия.',
            'timeline2-year': '1366', 'timeline2-title': 'Выход на международные рынки', 'timeline2-desc': 'В 1366 году компания вышла на рынок международной торговли и начала экспортировать кросс и вет-блю в Турцию и Италию. Этот важный шаг ознаменовал поворотный момент в развитии нашего бизнеса и выходе на мировые рынки.',
            'timeline3-year': '1374', 'timeline3-title': 'Рост экспорта с акцентом на продукты питания', 'timeline3-desc': 'С 1374 года под руководством г-на Хашема Мухаджери Хорасани наша экспортная деятельность расширилась на различные сектора, включая продукты питания. В этот период наш экспорт достиг таких стран, как Афганистан, Пакистан, Туркменистан, Таджикистан, Казахстан, Кыргызстан, Россия, ОАЭ, Турция, Ливан, Ирак, Канада, Великобритания, Германия и Сомали.',
            'timeline4-year': '1397', 'timeline4-title': 'Диверсификация в стратегические отрасли', 'timeline4-desc': 'С 1397 года в соответствии с требованиями мирового рынка компания расширила свою деятельность на такие стратегические товары, как сталь и нефтехимическая продукция. Такой подход обеспечил устойчивый рост и более прочное присутствие на международных рынках.',
            'timeline5-year': 'Сегодня и в будущем', 'timeline5-title': 'Сегодня и в будущем', 'timeline5-desc': 'Сегодня, обладая более чем 70-летним торговым опытом и несколькими десятилетиями успешного экспорта, Mohajer Steel признана одним из ведущих экспортеров в провинции Хорасан-Резави, продолжая строить будущее благодаря профессионализму, качеству, приверженности делу и взаимному доверию.',
            
            'dept-sub': 'НАШИ ПОДРАЗДЕЛЕНИЯ', 
            'dept-title-light': 'ДРУГИЕ НАПРАВЛЕНИЯ ДЕЯТЕЛЬНОСТИ', 'dept-title-red': 'MOHAJER TRADING GROUP',
            'dept-desc': 'Международная торговая группа Mohajer работает в трех основных направлениях: металлургия, нефтехимия и пищевая промышленность, уделяя особое внимание международной торговле, поставкам и экспорту.',
            'dept-key-title': '',
            'dept1-title': 'Нефтехимия', 'dept1-desc': 'Нефтехимический отдел, опираясь на знание рынка и обширную сеть поставок, построил надежный мост между производителями и потребителями химической промышленности. Мы предоставляем базовые и полимерные продукты, обеспечивая стабильную и надежную цепочку поставок для наших деловых партнеров.',
            'dept1-bullet1': 'Поставка и торговля химическим и полимерным сырьем', 'dept1-bullet2': 'Создание стабильной и надежной цепочки поставок', 'dept1-bullet3': 'Управление рисками и поддержка на мировых рынках', 'dept1-bullet4': 'Предоставление коммерческих решений под нужды клиентов',
            'dept2-title': 'Металлургия', 'dept2-desc': 'Сталелитейная промышленность является основой нашей деятельности. Специализируясь на поставке и дистрибуции различной стальной продукции, от заготовок и слябов до балок и листов, мы предоставляем надежные решения для промышленных и строительных проектов в глобальном масштабе.',
            'dept2-bullet1': 'Поставка стальной продукции премиум-качества', 'dept2-bullet2': 'Широкая международная сеть поставок и дистрибуции', 'dept2-bullet3': 'Конкурентоспособные цены и своевременная доставка', 'dept2-bullet4': 'Поддержка промышленных и строительных проектов любого масштаба',
            'dept3-title': 'Пищевая промышленность', 'dept3-desc': 'В отделе пищевой промышленности мы предлагаем высококачественные сельскохозяйственные и пищевые продукты на международных рынках путем создания глобальной сети надежных поставщиков и производителей. Строгое управление цепочкой поставок, контроль качества и профессиональная логистика гарантируют безопасную доставку в соответствии с мировыми стандартами.',
            'dept3-bullet1': 'Международные поставки и торговля пищевой и сельскохозяйственной продукцией', 'dept3-bullet2': 'Конترل качества и соответствие международным стандартам', 'dept3-bullet3': 'Профессиональное управление логистикой и цепочкой поставок', 'dept3-bullet4': 'Гарантия свежести, безопасности и своевременной доставки',
            'btn-learn-more': 'Подробнее',

            'global-subtitle': 'НАШЕ ГЛОБАЛЬНОЕ ПРИСУТСТВИЕ', 'global-title-light': 'ЭКСПОРТНАЯ МОЩЬ.', 'global-title-red': 'СОЗДАНИЕ СВЯЗЕЙ.',
            'global-desc': 'Нашей продукции доверяют более чем в 20 странах мира. Мы продолжаем расширять свое глобальное присутствие с качеством, надежностью и долгосрочными партнерствами.',
            'global-stat1': 'Рынков экспорта', 'global-stat2': 'Лет опыта', 'global-stat3': 'Товаров на экспорт',
            'global-partner-lbl': 'Экспортный партнер', 'global-icon-steel': 'Стальная продукция', 'global-icon-petro': 'Нефтехимическая продукция', 'global-icon-food': 'Пищевая продукция',
            'foot-stat1': 'Лет опыта', 'foot-stat2': 'Международных партнеров', 'foot-stat4-h': 'Лучший экспортер', 'foot-stat4-p': 'Провинция Хорасан-Резави', 'foot-stat5': 'Континента', 'foot-stat6': 'Приверженность качеству',
            
            'active-coop-text': 'Активное сотрудничество',
            'country-af-name': 'Афганистан', 'country-af-desc': 'Мы экспортируем высококачественную сталь, нефтехимическую и пищевую продукцию в Афганистан с акцентом на надежность и долгосрочное сотрудничество.',
            'country-pk-name': 'Пакистан', 'country-pk-desc': 'Экспорт высококачественной строительной стали, ключевых химических продуктов и сельскохозяйственной продукции на пакистанский рынок.',
            'country-tm-name': 'Туркменистан', 'country-tm-desc': 'Поставки сырья для энергетического сектора, нефтехимии и строительных стальных труб нашим партнерам в Туркменистане.',
            'country-uz-name': 'Узбекистан', 'country-uz-desc': 'Поставка передовых стальных конструкций и полимерных производных для растущих промышленных секторов Узбекистана.',
            'country-tj-name': 'Таджикистан', 'country-tj-desc': 'Надежные торговые каналы поставок деталей для сельхозтехники, строительной стали и продуктов питания для продовольственной безопасности.',
            'country-kz-name': 'Казахстан', 'country-kz-desc': 'Поставка базовых стальных сплавов, полимерных материалов и специализированного сырья для тяжелой промышленности Казахстана.',
            'country-kg-name': 'Кыргызстан', 'country-kg-desc': 'Развитие логистических сетей и дистрибуция стандартной строительной проволоки, зерновых продуктов и нефтепродуктов.',
            'country-tr-name': 'Турция', 'country-tr-desc': 'Ключевой стратегический центр, куда мы активно экспортируем промышленные химикаты, высококачественный стальный прокат и органические продуктов.',
            'country-lb-name': 'Ливан', 'country-lb-desc': 'Специальные торговые соглашения по поставке пищевого сырья, зерновых масел и строительной арматуры для инфраструктуры.',
            'country-sy-name': 'Сирия', 'country-sy-desc': 'Поддержка восстановления промышленности с помощью необходимых строительных материалов, балок и нефтехимических производных.',
            'country-iq-name': 'Ирак', 'country-iq-desc': 'Обширные поставки стальных труб, арматуры и жизненно важных промышленных растворителей для общенациональных инфраструктурных проектов.',
            'country-ae-name': 'ОАЭ', 'country-ae-desc': 'Прямые поставки высокотехнологичных стальных профилей и промышленных нефтехимических полимеров премиум-класса.',
            'country-so-name': 'Сомали', 'country-so-desc': 'Ключевые грузовые линии, доставляющие морские структурные элементы и базовые проволочные изделия. (Экспорт продовольствия ограничен).',
            'country-de-name': 'Германия', 'country-de-desc': 'Высокоточные промышленные стальные листы и полимеры химического синтеза отправляются через европейские коридоры.',
            'country-ca-name': 'Канада', 'country-ca-desc': 'Развитие трансатлантических торговых каналов, поставка легированных плит премиум-класса и сертифицированных продуктов питания.',
            'country-gb-name': 'Англия', 'country-gb-desc': 'Экспорт стандартных строительных профилей, химикатов и проволоки из высокоуглеродистой стали.',
            'country-au-name': 'Австралия', 'country-au-desc': 'Поставка тяжелых стальных элементов морского класса и стратегический сельскохозяйственный экспорт для австралийского рынка.'
        }
    };

    // ==========================================================================
    // منطق و داده‌های نقشه جهانی
    // ==========================================================================
    const countryData = {
        af: { flag: "https://flagcdn.com/w40/af.png", img: "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto/v1782897739/%D8%A7%D9%81%D8%BA%D8%A7%D9%86%D8%B3%D8%AA%D8%A7%D9%86_vttwtr.webp", exports: ["steel", "petrochemical", "food"] },
        pk: { flag: "https://flagcdn.com/w40/pk.png", img: "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto/v1782897737/%D9%BE%D8%A7%DA%A9%D8%B3%D8%AA%D8%A7%D9%86_okldrx.webp", exports: ["steel", "petrochemical", "food"] },
        tm: { flag: "https://flagcdn.com/w40/tm.png", img: "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto/v1782897743/%D8%AA%D8%A7%D8%AC%DB%8C%DA%A9%D8%B3%D8%AA%D8%A7%D9%86_tpqzyd.webp", exports: ["steel", "petrochemical", "food"] },
        uz: { flag: "https://flagcdn.com/w40/uz.png", img: "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto/v1782897743/%D8%A7%D8%B2%DB%8C%DA%A9%D8%B3%D8%AA%D8%A7%D9%86_uxwtxw.webp", exports: ["steel", "petrochemical", "food"] },
        tj: { flag: "https://flagcdn.com/w40/tj.png", img: "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto/v1782897739/%D8%AA%D8%A7%D8%AC%DB%8C%DA%A9%D8%B3%D8%AA%D8%A7%D9%86_tpqzyd.webp", exports: ["steel", "petrochemical", "food"] },
        kz: { flag: "https://flagcdn.com/w40/kz.png", img: "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto/v1782897744/%D9%82%D8%B2%D8%A7%D9%82%D8%B3%D8%AA%D8%A7%D9%86_yk6jn7.webp", exports: ["steel", "petrochemical", "food"] },
        kg: { flag: "https://flagcdn.com/w40/kg.png", img: "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto/v1782897743/%D9%82%D8%B1%D9%82%DB%8C%D8%B2%D8%B3%D8%AA%D8%A7%D9%86_yobiz6.webp", exports: ["steel", "petrochemical", "food"] },
        tr: { flag: "https://flagcdn.com/w40/tr.png", img: "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto/v1782897740/%D8%AA%D8%B1%DA%A9%DB%8C%D9%87_crbvfu.webp", exports: ["steel", "petrochemical", "food"] },
        lb: { flag: "https://flagcdn.com/w40/lb.png", img: "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto/v1782897736/%D9%84%D8%A8%D9%86%D8%A7%D9%86_x6msja.webp", exports: ["steel", "petrochemical", "food"] },
        sy: { flag: "https://flagcdn.com/w40/sy.png", img: "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto/v1782897746/%D8%B3%D9%88%D8%B1%DB%8C%D9%87_u1xvhv.webp", exports: ["steel", "petrochemical", "food"] },
        iq: { flag: "https://flagcdn.com/w40/iq.png", img: "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto/v1782897741/%D8%B9%D8%B1%D8%A7%D9%82_una0pi.webp", exports: ["steel", "petrochemical", "food"] },
        ae: { flag: "https://flagcdn.com/w40/ae.png", img: "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto/v1782897736/%D8%A7%D9%85%D8%A7%D8%B1%D8%A7%D8%AA_t9pgsu.webp", exports: ["steel", "petrochemical", "food"] },
        so: { flag: "https://flagcdn.com/w40/so.png", img: "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto/v1782897744/%D8%B3%D9%88%D8%B1%DB%8C%D9%87_u1xvhv.webp", exports: ["steel", "petrochemical"] },
        de: { flag: "https://flagcdn.com/w40/de.png", img: "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto/v1782897735/%D8%A7%D9%84%D9%85%D8%A7%D9%86_a78sxj.webp", exports: ["steel", "petrochemical", "food"] },
        ca: { flag: "https://flagcdn.com/w40/ca.png", img: "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto/v1782897738/%DA%A9%D8%A7%D9%86%D8%A7%D8%AF%D8%A7_bqj2rt.webp", exports: ["steel", "petrochemical", "food"] },
        gb: { flag: "https://flagcdn.com/w40/gb.png", img: "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto/v1782897739/%D8%A7%D9%86%DA%AF%D9%84%D8%B3%D8%AA%D8%A7%D9%86_vbzfrg.webp", exports: ["steel", "petrochemical", "food"] },
        au: { flag: "https://flagcdn.com/w40/au.png", img: "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto/v1782897733/%D8%A7%D8%B3%D8%AA%D8%B1%D8%A7%D9%84%DB%8C%D8%A7_zpvbgf.webp", exports: ["steel", "petrochemical", "food"] }
    };

    const overlay = document.querySelector('.lines-overlay');
    const detailCard = document.getElementById('detail-card');
    const closeCardBtn = document.getElementById('close-card-btn');
    const countryListSidebar = document.getElementById('countryListSidebar');
    let activeCountryCode = 'af';

    function renderSidebar() {
        if (!countryListSidebar) return;
        countryListSidebar.innerHTML = '';
        const currentLang = localStorage.getItem('selectedLanguage') || 'en';

        Object.keys(countryData).forEach(code => {
            const data = countryData[code];
            const li = document.createElement('li');
            li.className = 'country-item';
            if (code === activeCountryCode) li.classList.add('active');
            li.setAttribute('data-country', code);

            const flagName = document.createElement('span');
            flagName.className = 'flag-name';
            
            const img = document.createElement('img');
            img.className = 'flag-box';
            img.src = data.flag;
            img.setAttribute('loading', 'lazy');
            img.setAttribute('onerror', "this.style.display='none'");
            
            const nameNode = document.createTextNode(' ' + translations[currentLang][`country-${code}-name`]);
            
            flagName.appendChild(img);
            flagName.appendChild(nameNode);

            const dot = document.createElement('span');
            dot.className = 'indicator-dot';

            li.appendChild(flagName);
            li.appendChild(dot);
            
            li.addEventListener('click', () => selectCountry(code));
            countryListSidebar.appendChild(li);
        });
    }

    function selectCountry(code) {
        if (!countryData[code]) return;
        activeCountryCode = code;
        const data = countryData[code];
        const currentLang = localStorage.getItem('selectedLanguage') || 'en';

        document.querySelectorAll('.country-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-country') === code) {
                item.classList.add('active');
            }
        });

        if (detailCard) {
            detailCard.classList.add('fade-out');
            setTimeout(() => {
                const imgElem = document.getElementById('card-img');
                const flagElem = document.getElementById('card-flag');
                const nameElem = document.getElementById('card-country-name');
                const descElem = document.getElementById('card-desc');
                const titleElem = document.getElementById('card-exports-title');

                if(imgElem) imgElem.src = data.img;
                if(flagElem) flagElem.src = data.flag;
                if(nameElem) nameElem.textContent = translations[currentLang][`country-${code}-name`];
                if(descElem) descElem.textContent = translations[currentLang][`country-${code}-desc`];
                
                if(titleElem) {
                    if (currentLang === 'fa') titleElem.textContent = `صادرات ما به ${translations[currentLang][`country-${code}-name`]}`;
                    else if (currentLang === 'ar') titleElem.textContent = `صادراتنا إلى ${translations[currentLang][`country-${code}-name`]}`;
                    else if (currentLang === 'ru') titleElem.textContent = `Наш экспорт в ${translations[currentLang][`country-${code}-name`]}`;
                    else titleElem.textContent = `Our Exports to ${translations[currentLang][`country-${code}-name`]}`;
                }

                document.querySelectorAll('.product-item-free').forEach(item => {
                    const productType = item.getAttribute('data-product');
                    if (data.exports.includes(productType)) {
                        item.classList.remove('inactive');
                    } else {
                        item.classList.add('inactive');
                    }
                });

                detailCard.style.display = 'flex';
                detailCard.classList.remove('fade-out');
            }, 200);
        }
    }

    if (closeCardBtn && detailCard) {
        closeCardBtn.addEventListener('click', () => {
            detailCard.classList.add('fade-out');
            setTimeout(() => { detailCard.style.display = 'none'; }, 300);
        });
    }

    const zoomBtns = document.querySelectorAll('.btn-zoom');
    let mapZoomLevel = 1;
    if (zoomBtns.length === 3 && overlay) {
        const updateViewBox = () => {
            const newW = 1440 / mapZoomLevel;
            const newH = 900 / mapZoomLevel;
            const newX = (1440 - newW) / 2;
            const newY = (900 - newH) / 2;
            overlay.setAttribute('viewBox', `${newX} ${newY} ${newW} ${newH}`);
        };

        zoomBtns[0].addEventListener('click', () => {
            if (mapZoomLevel < 3) mapZoomLevel += 0.3;
            updateViewBox();
        });
        
        zoomBtns[1].addEventListener('click', () => {
            if (mapZoomLevel > 1) mapZoomLevel -= 0.3;
            if (mapZoomLevel < 1) mapZoomLevel = 1;
            updateViewBox();
        });
        
        zoomBtns[2].addEventListener('click', () => {
            mapZoomLevel = 1;
            updateViewBox();
        });
    }

    // ==========================================================================
    // سیستم تغییر زبان (Multi-Language)
    // ==========================================================================
    const langBtn = document.getElementById('langBtn');
    const langDropdown = document.getElementById('langDropdown');
    const currentLangText = document.getElementById('currentLang');

    if(langBtn && langDropdown) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('show');
        });

        document.addEventListener('click', () => {
            langDropdown.classList.remove('show');
        });

        const langItems = langDropdown.querySelectorAll('li');
        langItems.forEach(item => {
            item.addEventListener('click', () => {
                const selectedLang = item.getAttribute('data-lang');
                setLanguage(selectedLang);
            });
        });
    }

    function setLanguage(lang) {
        const translation = translations[lang];
        if (!translation) return;

        document.documentElement.setAttribute('dir', translation.dir);
        document.documentElement.setAttribute('lang', lang);
        if(currentLangText) currentLangText.innerText = lang.toUpperCase();
        
        const breadcrumbsContainers = document.querySelectorAll('.breadcrumbs-container, .about-breadcrumbs, .dept-breadcrumbs, .contact-breadcrumbs');
        breadcrumbsContainers.forEach(container => {
            container.style.setProperty('--dir', translation.dir);
        });

        const translatableElements = document.querySelectorAll('[data-key]');
        translatableElements.forEach(elem => {
            const key = elem.getAttribute('data-key');
            if (translation[key] !== undefined) {
                elem.innerHTML = translation[key];
            }
        });

        const placeholderElements = document.querySelectorAll('[data-placeholder-key]');
        placeholderElements.forEach(elem => {
            const key = elem.getAttribute('data-placeholder-key');
            if (translation[key]) {
                elem.setAttribute('placeholder', translation[key]);
            }
        });

        localStorage.setItem('selectedLanguage', lang);

        if (document.getElementById('productDetailView') && document.getElementById('productDetailView').style.display === 'block' && activeProductKey) {
            showProductAnalysis(activeProductKey);
        }
        
        renderSidebar();
        selectCountry(activeCountryCode);
    }

    // ==========================================================================
    // متد اصلی نمایش صفحه جزئیات محصول
    // ==========================================================================
    const mainLandingView = document.getElementById('mainLandingView');
    const productDetailView = document.getElementById('productDetailView');
    const aboutUsView = document.getElementById('aboutUsView');
    const departmentsView = document.getElementById('departmentsView');
    const contactView = document.getElementById('contactView');

    function setActiveNavLink(linkId) {
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            if (link.id === linkId) link.classList.add('active');
            else link.classList.remove('active');
        });
    }

    window.showProductAnalysis = function(productKey) {
        activeProductKey = productKey;
        const currentLang = localStorage.getItem('selectedLanguage') || 'en';
        const spec = productSpecs[currentLang]?.[productKey] || productSpecs['en'][productKey] || productSpecs['en']['pipes'];

        document.getElementById('detailBreadcrumbName').innerText = spec.title;
        document.getElementById('detailProductName').innerText = spec.title;
        document.getElementById('detailProductDesc').innerText = spec.desc;
        document.getElementById('detailChemTitle').innerText = spec.chemicalTitle;

        const imgContainer = document.getElementById('detailImageContainer');
        const imgUrl = productImages[productKey] || "https://res.cloudinary.com/dqhbyqftq/image/upload/f_auto,q_auto:good/v1782902904/%D9%84%D9%88%D9%84%D9%87_d5rvnj.webp";
        imgContainer.innerHTML = `<img src="${imgUrl}" alt="${spec.title}" loading="lazy">`;

        const downloadBtn = document.getElementById('btnDownloadDatasheet');
        if (downloadBtn) {
            const datasheetUrl = datasheetImages[productKey];
            if (datasheetUrl) {
                downloadBtn.href = datasheetUrl;
                downloadBtn.download = `MohajerSteel_${productKey}_Datasheet.png`;
                downloadBtn.style.display = 'inline-flex';
            } else {
                downloadBtn.style.display = 'none';
            }
        }
        
        updateNavButtonsState();

        let rawHeaders = spec.tableHeaders || [];
        let rawRows = spec.tableRows || [];

        let activeIndices = [0]; 
        for (let colIdx = 1; colIdx < rawHeaders.length; colIdx++) {
            let hasValue = false;
            for (let r = 0; r < rawRows.length; r++) {
                let val = rawRows[r][colIdx];
                if (val !== undefined && val !== null) {
                    let strVal = String(val).trim();
                    if (strVal !== "" && strVal !== "-" && strVal !== "—" && strVal !== "–") {
                        hasValue = true;
                        break;
                    }
                }
            }
            if (hasValue) activeIndices.push(colIdx);
        }

        let filteredHeaders = activeIndices.map(idx => rawHeaders[idx]);
        let filteredRows = rawRows.map(row => activeIndices.map(idx => row[idx]));

        const theadRow = document.querySelector('.analysis-table thead tr');
        if (theadRow) {
            theadRow.innerHTML = filteredHeaders.map(h => `<th>${h}</th>`).join('');
        }

        const chemBody = document.getElementById('detailChemBody');
        chemBody.innerHTML = '';
        filteredRows.forEach(row => {
            let tr = document.createElement('tr');
            row.forEach(val => {
                let td = document.createElement('td');
                td.innerText = val;
                tr.appendChild(td);
            });
            chemBody.appendChild(tr);
        });

        const specContainer = document.querySelector('.detail-quick-specs');
        specContainer.innerHTML = '';
        spec.quickSpecs.forEach(item => {
            let rowDiv = document.createElement('div');
            rowDiv.className = 'spec-detail-row';
            rowDiv.innerHTML = `<span class="label">${item[0]}</span><strong class="value">${item[1]}</strong>`;
            specContainer.appendChild(rowDiv);
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        if(mainLandingView) mainLandingView.style.display = 'none';
        if(aboutUsView) aboutUsView.style.display = 'none';
        if(departmentsView) departmentsView.style.display = 'none';
        if(contactView) contactView.style.display = 'none';
        
        if(productDetailView) productDetailView.style.display = 'block';
    };

    // ==========================================================================
    // کنترلرهای دکمه‌های ناوبری و شورتکات کیبورد
    // ==========================================================================
    function updateNavButtonsState() {
        const currentIndex = productOrder.indexOf(activeProductKey);
        const btnPrev = document.getElementById('btnPrevProduct');
        const btnNext = document.getElementById('btnNextProduct');
        
        if (btnPrev) {
            if (currentIndex <= 0) {
                btnPrev.style.opacity = '0.3';
                btnPrev.style.pointerEvents = 'none';
            } else {
                btnPrev.style.opacity = '1';
                btnPrev.style.pointerEvents = 'auto';
            }
        }
        
        if (btnNext) {
            if (currentIndex >= productOrder.length - 1) {
                btnNext.style.opacity = '0.3';
                btnNext.style.pointerEvents = 'none';
            } else {
                btnNext.style.opacity = '1';
                btnNext.style.pointerEvents = 'auto';
            }
        }
    }

    const btnPrevProd = document.getElementById('btnPrevProduct');
    if (btnPrevProd) {
        btnPrevProd.addEventListener('click', () => {
            const currentIndex = productOrder.indexOf(activeProductKey);
            if (currentIndex > 0) showProductAnalysis(productOrder[currentIndex - 1]);
        });
    }

    const btnNextProd = document.getElementById('btnNextProduct');
    if (btnNextProd) {
        btnNextProd.addEventListener('click', () => {
            const currentIndex = productOrder.indexOf(activeProductKey);
            if (currentIndex < productOrder.length - 1) showProductAnalysis(productOrder[currentIndex + 1]);
        });
    }

    const btnBackToCatalog = document.getElementById('btnBackToCatalog');
    if (btnBackToCatalog) {
        btnBackToCatalog.addEventListener('click', () => {
            showMainLanding();
            setActiveNavLink('navProductsLink');
            const section = document.getElementById('catalogSectionAnchor');
            if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.altKey && e.key === ',') {
            if (btnBackToCatalog && productDetailView && productDetailView.style.display !== 'none') {
                btnBackToCatalog.click();
            }
        }
    });

    // ==========================================================================
    // متدهای نمایش صفحات
    // ==========================================================================
    function showMainLanding() {
        if(productDetailView) productDetailView.style.display = 'none';
        if(aboutUsView) aboutUsView.style.display = 'none';
        if(departmentsView) departmentsView.style.display = 'none';
        if(contactView) contactView.style.display = 'none';
        if(mainLandingView) mainLandingView.style.display = 'block';
        activeProductKey = null;
        setActiveNavLink('navHomeLink');
    }

    function showAboutUs() {
        if(mainLandingView) mainLandingView.style.display = 'none';
        if(productDetailView) productDetailView.style.display = 'none';
        if(departmentsView) departmentsView.style.display = 'none';
        if(contactView) contactView.style.display = 'none';
        if(aboutUsView) aboutUsView.style.display = 'block';
        setActiveNavLink('navAboutLink');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function showDepartments() {
        if(mainLandingView) mainLandingView.style.display = 'none';
        if(productDetailView) productDetailView.style.display = 'none';
        if(aboutUsView) aboutUsView.style.display = 'none';
        if(contactView) contactView.style.display = 'none';
        if(departmentsView) departmentsView.style.display = 'block';
        setActiveNavLink('navDepartmentsLink');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function showContactUs() {
        if(mainLandingView) mainLandingView.style.display = 'none';
        if(productDetailView) productDetailView.style.display = 'none';
        if(aboutUsView) aboutUsView.style.display = 'none';
        if(departmentsView) departmentsView.style.display = 'none';
        if(contactView) contactView.style.display = 'block';
        setActiveNavLink('navContactLink');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const clickMap = [
        { id: 'crumbHomeBtn', action: showMainLanding },
        { id: 'aboutCrumbHomeBtn', action: showMainLanding },
        { id: 'deptCrumbHomeBtn', action: showMainLanding },
        { id: 'contactCrumbHomeBtn', action: showMainLanding },
        { id: 'headerLogoBtn', action: showMainLanding },
        { id: 'navHomeLink', action: (e) => { e.preventDefault(); showMainLanding(); window.scrollTo({top:0, behavior:'smooth'}); } },
        { id: 'navAboutLink', action: (e) => { e.preventDefault(); showAboutUs(); } },
        { id: 'navDepartmentsLink', action: (e) => { e.preventDefault(); showDepartments(); } },
        { id: 'navContactLink', action: (e) => { e.preventDefault(); showContactUs(); } }
    ];

    clickMap.forEach(map => {
        const btn = document.getElementById(map.id);
        if (btn) btn.addEventListener('click', map.action);
    });

    const crumbProductsBtn = document.getElementById('crumbProductsBtn');
    if(crumbProductsBtn) crumbProductsBtn.addEventListener('click', () => {
        showMainLanding();
        setActiveNavLink('navProductsLink');
        const section = document.getElementById('catalogSectionAnchor');
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    
    const navProductsLink = document.getElementById('navProductsLink');
    if(navProductsLink) navProductsLink.addEventListener('click', (e) => {
        e.preventDefault();
        showMainLanding();
        setActiveNavLink('navProductsLink');
        const section = document.getElementById('catalogSectionAnchor');
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    const heroExploreBtn = document.getElementById('heroExploreBtn');
    if (heroExploreBtn) heroExploreBtn.addEventListener('click', () => {
        setActiveNavLink('navProductsLink');
        const section = document.getElementById('catalogSectionAnchor');
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // ==========================================================================
    // کلیک‌پذیر شدن کل کارت محصولات
    // ==========================================================================
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.catalog-card');
        if (card) {
            e.preventDefault();
            const productKey = card.getAttribute('data-product');
            if(productKey) {
                showProductAnalysis(productKey);
            }
        }
    });

    // ==========================================================================
    // منوی موبایل (Mobile Menu) - آپدیت شده برای بستن با اسکرول و کلیک بیرون
    // ==========================================================================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinksContainer = document.getElementById('navLinks');
    
    if (mobileMenuBtn && navLinksContainer) {
        // باز و بسته شدن با دکمه همبرگری
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            navLinksContainer.classList.toggle('active');
        });

        // بسته شدن با کلیک روی لینک‌های داخل منو
        navLinksContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
            });
        });

        // بسته شدن منو با کلیک در فضای خالی (بیرون از منو و دکمه)
        document.addEventListener('click', (e) => {
            // بررسی می‌کنیم که آیا منو باز است؟ و آیا کلیک خارج از منو و دکمه بوده است؟
            if (navLinksContainer.classList.contains('active') && 
                !navLinksContainer.contains(e.target) && 
                !mobileMenuBtn.contains(e.target)) {
                navLinksContainer.classList.remove('active');
            }
        });

        // بسته شدن منو هنگام اسکرول (بالا و پایین کشیدن صفحه)
        window.addEventListener('scroll', () => {
            if (navLinksContainer.classList.contains('active')) {
                navLinksContainer.classList.remove('active');
            }
        }, { passive: true });
    }

    // ==========================================================================
    // منطق صفحه‌بندی کاتالوگ
    // ==========================================================================
    const catalogCards = document.querySelectorAll('.catalog-card');
    const paginationBtns = document.querySelectorAll('.catalog-pagination .btn-page');
    const btnPagePrev = document.getElementById('btnPagePrev');
    const btnPageNext = document.getElementById('btnPageNext');
    const showingTextElement = document.querySelector('.toolbar-showing');
    
    let currentCatalogPage = 1;
    const maxPages = 2;

    function changeCatalogPage(pageNumber) {
        currentCatalogPage = pageNumber;
        
        catalogCards.forEach((card, index) => {
            let cardPage = card.getAttribute('data-page');
            if(!cardPage) {
                cardPage = (index < 8) ? 1 : 2; 
                card.setAttribute('data-page', cardPage);
            }
            if (parseInt(cardPage) === currentCatalogPage) card.style.display = 'flex';
            else card.style.display = 'none';
        });

        if(paginationBtns.length > 0) {
            paginationBtns.forEach(btn => {
                let btnTarget = btn.getAttribute('data-target-page') || btn.innerText.trim();
                if (parseInt(btnTarget) === currentCatalogPage) btn.classList.add('active');
                else btn.classList.remove('active');
            });
        }

        if(btnPagePrev) {
            btnPagePrev.style.opacity = currentCatalogPage === 1 ? '0.3' : '1';
            btnPagePrev.style.pointerEvents = currentCatalogPage === 1 ? 'none' : 'auto';
        }
        if(btnPageNext) {
            btnPageNext.style.opacity = currentCatalogPage === maxPages ? '0.3' : '1';
            btnPageNext.style.pointerEvents = currentCatalogPage === maxPages ? 'none' : 'auto';
        }

        const txtKey = currentCatalogPage === 1 ? 'showing-txt-p1' : 'showing-txt-p2';
        if (showingTextElement) {
            showingTextElement.setAttribute('data-key', txtKey);
            const currentLang = localStorage.getItem('selectedLanguage') || 'en';
            if (translations[currentLang] && translations[currentLang][txtKey]) {
                showingTextElement.innerText = translations[currentLang][txtKey];
            }
        }
    }

    if(paginationBtns.length > 0) {
        paginationBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                let targetPageStr = e.currentTarget.getAttribute('data-target-page') || e.currentTarget.innerText.trim();
                const targetPage = parseInt(targetPageStr);
                
                if(targetPage !== currentCatalogPage && !isNaN(targetPage)) {
                    changeCatalogPage(targetPage);
                    const catalogAnchor = document.getElementById('catalogSectionAnchor');
                    if (catalogAnchor) catalogAnchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    if(btnPagePrev) {
        btnPagePrev.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentCatalogPage > 1) {
                changeCatalogPage(currentCatalogPage - 1);
                const catalogAnchor = document.getElementById('catalogSectionAnchor');
                if (catalogAnchor) catalogAnchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    if(btnPageNext) {
        btnPageNext.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentCatalogPage < maxPages) {
                changeCatalogPage(currentCatalogPage + 1);
                const catalogAnchor = document.getElementById('catalogSectionAnchor');
                if (catalogAnchor) catalogAnchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    // ==========================================================================
    // ویدیو مودال
    // ==========================================================================
    const videoModal = document.getElementById('videoModal');
    const btnViewCatalogVideo = document.getElementById('btnViewCatalogVideo');
    const closeVideoModalElem = document.getElementById('closeVideoModal');
    const videoIframe = document.getElementById('videoIframe');

    if (btnViewCatalogVideo && videoModal && videoIframe) {
        btnViewCatalogVideo.addEventListener('click', (e) => {
            e.preventDefault();
            videoIframe.src = "https://player.vimeo.com/video/1151888987?autoplay=1&h=0a1b2c3d4e";
            videoModal.classList.add('show');
        });
    }

    function shutVideoModal() {
        if (videoModal && videoIframe) {
            videoModal.classList.remove('show');
            videoIframe.src = ""; 
        }
    }

    if (closeVideoModalElem) closeVideoModalElem.addEventListener('click', shutVideoModal);
    if (videoModal) {
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) shutVideoModal();
        });
    }

    // ==========================================================================
    // Scroll Spy & Header Shadow
    // ==========================================================================
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if(header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        if (mainLandingView && mainLandingView.style.display !== 'none') {
            const scrollPos = window.scrollY + 150; 
            const sections = [
                { id: 'mainLandingView', linkId: 'navHomeLink' },
                { id: 'catalogSectionAnchor', linkId: 'navProductsLink' }
            ];
            
            for (let i = sections.length - 1; i >= 0; i--) {
                const sec = document.getElementById(sections[i].id);
                if (sec && sec.offsetTop <= scrollPos) {
                    setActiveNavLink(sections[i].linkId);
                    break;
                }
            }
        }
    });

    // ==========================================================================
    // راه‌اندازی اولیه
    // ==========================================================================
    const savedLang = localStorage.getItem('selectedLanguage') || 'en';
    setLanguage(savedLang); 
    changeCatalogPage(1); 

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            const currentLang = localStorage.getItem('selectedLanguage') || 'en';
            const successMessage = translations[currentLang]?.['msg-success'] || translations['en']['msg-success'];
            const btnSubmitBtn = contactForm.querySelector('.btn-submit-message');
            const originalBtnText = btnSubmitBtn.innerHTML;

            btnSubmitBtn.innerHTML = "..."; 
            btnSubmitBtn.style.pointerEvents = 'none';

            try {
                const response = await fetch(e.target.action, {
                    method: 'POST',
                    body: new FormData(e.target),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    alert(successMessage);
                    contactForm.reset();
                } else {
                    alert("Oops! There was a problem submitting your form.");
                }
            } catch (error) {
                alert("Oops! There was a network error. Please try again later.");
            } finally {
                btnSubmitBtn.innerHTML = originalBtnText;
                btnSubmitBtn.style.pointerEvents = 'auto';
            }
        });
    }
});
