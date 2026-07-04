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
            round: {
                category: "СТАЛЬНЫЕ ЗАГОТОВКИ", title: "Стальные заготовки",
                desc: "Высококачественные стальные заготовки (круг/квадрат), изготовленные для сортового проката и ковки.",
                chemicalTitle: "Химический состав",
                tableHeaders: ["Марка", "C %", "Si %", "Mn %", "S % (макс.)", "P % (макс.)", "Cu %", "Ni %", "Cr %", "Mo %", "V %"],
                tableRows: [
                    ["Ст3сп", "0.14 - 0.22", "0.15 - 0.30", "0.40 - 0.65", "0.04", "0.04", "-", "-", "-", "-", "-"],
                    ["Ст4сп", "0.18 - 0.27", "0.15 - 0.30", "0.40 - 0.70", "0.04", "0.04", "-", "-", "-", "-", "-"],
                    ["Ст5сп", "0.28 - 0.37", "0.15 - 0.30", "0.50 - 0.80", "0.04", "0.04", "-", "-", "-", "-", "-"]
                ],
                quickSpecs: [["Марка материала", "Ст3сп / Ст4сп / Ст5сп"], ["Тип продукта", "Стальная заготовка"], ["Диаметр проката", "от 80 до 200 мм"], ["Длина прутка", "6м / 12м или под заказ"], ["Размеры", "100*100, 120*120, 125*125, 130*130, 150*150"]]
            },
            plates: {
                category: "СЛЯБЫ", title: "Слябы",
                desc: "Конструкционные стальные плиты и слябы высокого качества для тяжелой промышленности.",
                chemicalTitle: "Химический состав",
                tableHeaders: ["Марка", "C %", "Mn %", "Si % (макс.)", "P % (макс.)", "S % (макс.)", "Al % (макс.)", "Cu %", "Ni %", "Cr %", "Mo %"],
                tableRows: [
                    ["ST 37.2", "0.12 - 0.22", "0.4 - 0.9", "Max 0.35", "Max 0.025", "Max 0.025", "Max 0.07", "-", "-", "-", "-"],
                    ["ST 52", "0.16 - 0.195", "1.1 - 1.5", "0.15 - 0.4", "Max 0.025", "Max 0.025", "Max 0.07", "-", "-", "-", "-"]
                ],
                quickSpecs: [["Марка материала", "ST37 - ST52"], ["Тип продукта", "Горячекатаный"], ["Толщина", "от 0.5 до 40 мм"], ["Размеры", "1 до 1.25"], ["Отделка поверхности", "Рулон и лист"]]
            },
            rebar: {
                category: "СТАЛЬНЫЕ ПРУТКИ", title: "Арматура",
                desc: "Высокопрочная горячекатаная арматура периодического профиля для армирования железобетона.",
                chemicalTitle: "Механические свойства",
                tableHeaders: ["Класс", "Предел прочности (МПа)", "Предел текучести (МПа)", "Отношение", "Относительное удлинение (A10) %"],
                tableRows: [
                    ["A2 (340)", "340", "500", "1.25", "15"],
                    ["A3 (400)", "400", "600", "1.25", "12"],
                    ["A4 (500)", "500", "650", "1.25", "8"]
                ],
                quickSpecs: [["Марка материала", "A2 (340) / A3 (400) / A4 (500)"], ["Тип продукта", "Арматурный профиль TMT"], ["Отделка поверхности", "Горячекатаная закаленная"], ["Длина", "12м или нарезка под заказ"], ["Размер прутка", "от 8мм до 40мм"]]
            },
            angle: {
                category: "УГОЛКИ", title: "Стальные уголки",
                desc: "Равнополочные горячекатаные стальные уголки для строительных конструкций и опор.",
                chemicalTitle: "Размеры и вес уголков",
                tableHeaders: ["Тип уголка", "Ширина полки a (мм)", "Толщина t (мм)", "Радиус r (мм)", "Площадь (см²)", "Вес (кг/м)"],
                tableRows: [
                    ["100*100*10", "100", "10", "12", "19.2", "15"],
                    ["120*120*12", "120", "12", "13", "27.5", "12.6"]
                ],
                quickSpecs: [["Марка материала", "S235JR / S275JR / S355JR"], ["Тип продукта", "Равнополочный стальный уголок"], ["Отделка поверхности", "Без покрытия / Оцинкованная"], ["Ширина полки", "от 25 до 100 мм"], ["Длина", "6м / 12м или резка под заказ"]]
            },
            channels: {
                category: "СТРОИТЕЛЬНАЯ СТАЛЬ", title: "Швеллеры U-образные",
                desc: "Конструкционные швеллеры с наклонными полками серии UPN для тяжелонагруженных конструкций.",
                chemicalTitle: "Размеры и характеристики швеллеров",
                tableHeaders: ["Размер (UPN)", "Высота h (мм)", "Ширина b (мм)", "Толщина стенки s (мм)", "Толщина полки t (мм)", "Площадь (см²)", "Вес (кг/м)"],
                tableRows: [
                    ["12 (UPN 120)", "120", "52", "4.8", "7.8", "13.3", "10.4"],
                    ["14 (UPN 140)", "140", "58", "4.9", "8.1", "15.6", "12.3"]
                ],
                quickSpecs: [["Марка материала", "S235JR / S275JR / S355JR"], ["Тип продукта", "Горячекатаный U-профиль"], ["Отделка поверхности", "Без покрытия / Оцинкованный"], ["Размер", "от 8 до 22 мм"], ["Стандартная длина", "6м / 12м или под заказ"]]
            },
            beams: {
                category: "СТРОИТЕЛЬНАЯ СТАЛЬ", title: "Стальные балки",
                desc: "Широкополочные горячекатаные стальные балки серии HEB (IPB) для несущих стальных каркасов.",
                chemicalTitle: "Размеры и характеристики двутавров",
                tableHeaders: ["Размер (HEB)", "Высота h (мм)", "Ширина b (мм)", "Толщина стенки s (мм)", "Толщина полки t (мм)", "Радиус r (мм)", "Площадь (см²)", "Вес (кг/м)"],
                tableRows: [
                    ["10 (HEB 100)", "100", "100", "6.0", "10.0", "12", "26.0", "20.4"],
                    ["12 (HEB 120)", "120", "120", "6.5", "11.0", "12", "34.0", "26.7"]
                ],
                quickSpecs: [["Марка материала", "S275JR / S355JR / S355J2"], ["Тип продукта", "Горячекатаный двутавр HEB"], ["Отделка поверхности", "Без покрытия / Грунтованная"], ["Длина", "6м / 12м или нарезка под заказ"], ["Размер", "10 до 30"]]
            },
            pipes: {
                category: "СТАЛЬНЫЕ ТРУБЫ", title: "Стальные трубы",
                desc: "Высококачественные стальные трубы, разработанные для транспортировки жидкостей и газов.",
                chemicalTitle: "Химический состав",
                tableHeaders: ["Марка", "C %", "Mn %", "P %", "S %", "Si %", "Cu %", "Ni %", "Cr %", "Mo %", "V %"],
                tableRows: [
                    ["Класс A", "макс. 0.25", "макс. 0.95", "макс. 0.05", "макс. 0.045", "мин. 0.10", "макс. 0.40", "макс. 0.40", "макс. 0.40", "макс. 0.15", "Остальное"],
                    ["Класс B", "макс. 0.30", "макс. 1.20", "макс. 0.05", "макс. 0.045", "мин. 0.10", "макс. 0.40", "макс. 0.40", "макс. 0.40", "макс. 0.15", "Остальное"]
                ],
                quickSpecs: [["Марка материала", "Стандарт"], ["Тип продукта", "Бесшовные / Сварные"], ["Отделка поверхности", "Черная / Оцинкованная"], ["Длина", "6м, 12m или под заказ"], ["Тип торца", "Гладкий / Скошенный / Резьбовой"]]
            },
            tubes: {
                category: "ПРОФИЛЬНЫЕ ТРУБЫ", title: "Профильные трубы",
                desc: "Профильные стальные трубы квадратного и прямоугольного сечения, предназначенные для строительных каркасов.",
                chemicalTitle: "Химический состав",
                tableHeaders: ["Марка", "C %", "Mn %", "P %", "S %", "Si %", "Cu %", "Ni %", "Cr %", "Mo %", "V %"],
                tableRows: [
                    ["Класс B", "макс. 0.26", "макс. 1.35", "макс. 0.035", "макс. 0.035", "мин. 0.15", "макс. 0.40", "макс. 0.40", "макс. 0.40", "макс. 0.15", "Остальное"]
                ],
                quickSpecs: [["Марка материала", "Класс A / B / C"], ["Тип продукта", "Сварной / Бесшовный"], ["Отделка поверхности", "Черная / Оцинкованная"], ["Длина", "6м или под заказ"], ["Толщина стенки", "от 1.5мм до 10.0мм"]]
            },
            flat: {
                category: "СТАЛЬНЫЕ ПОЛОСЫ", title: "Стальные полосы",
                desc: "Универсальные стальные полосы горячей прокатки с идеально ровными кромками.",
                chemicalTitle: "Химический состав",
                tableHeaders: ["Марка", "C %", "Mn %", "P %", "S %", "Si %", "Cu %", "Ni %", "Cr %", "Mo %", "V %"],
                tableRows: [
                    ["Полоса", "макс. 0.25", "макс. 0.90", "макс. 0.04", "макс. 0.05", "макс. 0.40", "мин. 0.20", "макс. 0.40", "макс. 0.40", "макс. 0.15", "Остальное"]
                ],
                quickSpecs: [["Марка материала", "Стандарт / S275JR"], ["Тип продукта", "Горячекатаная полоса"], ["Отделка поверхности", "Без покрытия / Оцинкованная"], ["Ширина полосы", "от 50 до 200 мм"], ["Толщина полосы", "от 3.0мм до 25мм"]]
            },
            slab: {
                category: "СТАЛЬНЫЕ ЛИСТЫ", title: "Слябы",
                desc: "Конструкционные стальные слябы высокого качества для тяжелой промышленности.",
                chemicalTitle: "Химический состав",
                tableHeaders: ["Марка", "C %", "Mn %", "P %", "S %", "Si %", "Cu %", "Ni %", "Cr %", "Mo %", "V %"],
                tableRows: [
                    ["Слябы", "макс. 0.25", "0.80 - 1.20", "макс. 0.04", "макс. 0.05", "0.15 - 0.40", "мин. 0.20", "макс. 0.40", "макс. 0.40", "макс. 0.15", "Остальное"]
                ],
                quickSpecs: [["Марка материала", "ST37 - ST52"], ["Тип продукта", "Горячекатаный"], ["Толщина", "от 0.5 до 40 мм"], ["Размеры", "1 до 1.25"], ["Отделка поверхности", "Рулон и лист"]]
            },
            coils: {
                category: "СТАЛЬНЫЕ РУЛОНЫ", title: "Оцинкованные рулоны",
                desc: "Рулонная сталь горячего цинкования с надежной антикоррозийной защитой.",
                chemicalTitle: "Химический состав",
                tableHeaders: ["Марка", "C %", "Mn %", "P %", "S %", "Si %", "Cu %", "Ni %", "Cr %", "Mo %", "V %"],
                tableRows: [
                    ["Оцинковка CS", "макс. 0.15", "макс. 0.60", "макс. 0.035", "макс. 0.035", "мин. 0.15", "мин. 0.20", "макс. 0.40", "макс. 0.40", "макс. 0.15", "Остальное"]
                ],
                quickSpecs: [["Марка материала", "3SP-RST34-1006-1008"], ["Тип продукта", "Оцинкованная рулонная сталь"], ["Плотность цинка", "от Z80 до Z275 г/m²"], ["Толщина", "5.5, 6.5, 8, 10"]]
            },
            wires: {
                category: "СТАЛЬНАЯ ПРОВОЛОКА", title: "Стальная проволока",
                desc: "Высокопрочная стальная проволока холодного волочения из низкоуглеродистой стали.",
                chemicalTitle: "Продукция и цены",
                tableHeaders: ["Название продукта", "Размер", "Тип", "Код / Цена"],
                tableRows: [
                    ["Проволока 0.9 гор. оцинк.", "0.9 mm", "Гор.", "134000"],
                    ["Проволока 1.2 гор. оцинк.", "1.2 mm", "Гор.", "131000"],
                    ["Проволока 1.5", "1.5 mm", "Гор.", "126000"],
                    ["Проволока 2 гор. оцинк.", "2.0 mm", "Гор.", "1119600"],
                    ["Проволока 2.2 гор. оцинк.", "2.2 mm", "Гор.", "119500"],
                    ["Проволока 2.4 гор. оцинк.", "2.4 mm", "Гор.", "119500"],
                    ["Проволока 2.8 гор. оцинк.", "2.8 mm", "Гор.", "119500"],
                    ["Проволока 3 гор. оцинк.", "3.0 mm", "Гор.", "119500"],
                    ["Проволока 3.5 гор. оцинк.", "3.5 mm", "Гор.", "119500"],
                    ["Проволока 4 гор. оцинк.", "4.0 mm", "Гор.", "-"]
                ],
                quickSpecs: [["Тип продукта", "Черная оцинкованная"], ["Отделка поверхности", "Оцинкованный / Черный отжиг"], ["Диаметр проката", "от 1.0мм до 6.0мм"], ["Формат поставки", "В бухтах / мотках"]]
            }
        }
    };

    const translations = {
        en: {
            dir: 'ltr',
            'nav-home': 'Home', 'nav-products': 'Products', 'nav-departments': 'Departments', 'nav-about': 'About Us', 'nav-contact': 'Contact',
            'btn-quote': 'Get a Quote', 'hero-subtitle': 'PREMIUM QUALITY STEEL', 
            'hero-title-1': 'MOHAJER MOBIN', 'hero-title-2': 'STEEL',
            'hero-desc': 'Subsidiary of Mohajer International Trading Group',
            'btn-explore': 'Explore Products', 'btn-catalog': 'View Catalog', 'trusted-title': 'Trusted by Industry Leaders',
            'trusted-desc': 'Delivering excellence across the globe.',
            'feat-1-title': 'Premium Quality', 'feat-1-desc': 'Tested and certified to international standards.',
            'feat-2-title': 'High Strength', 'feat-2-desc': 'Built for performance in the toughest conditions.',
            'feat-3-title': 'On-Time Delivery', 'feat-3-desc': 'Reliable logistics ensuring your projects stay on track.',
            'feat-4-title': 'Sustainable', 'feat-4-desc': 'Committed to eco-friendly and responsible production.',
            'prod-sub': 'OUR PRODUCTS', 'prod-title': 'Premium Steel Products',
            'prod-desc': 'High-quality steel products engineered for strength, durability, and performance in every project.',
            'showing-txt-p1': 'Showing 1-8 of 12 products', 'showing-txt-p2': 'Showing 9-12 of 12 products', 'view-details': 'View Details',
            'cta-title': "Can't find what you're looking for?", 'cta-desc': 'Contact our experts for custom steel solutions tailored to your project.',
            'btn-custom-quote': 'Request Custom Quote',
            'prod-pipes-title': 'Steel Pipes', 'prod-pipes-desc': 'Durable steel pipes for fluid and gas transport.',
            'prod-beams-title': 'H-Beams', 'prod-beams-desc': 'High strength steel beams for structural applications.',
            'prod-rebar-title': 'Rebar', 'prod-rebar-desc': 'Deformed bars for reinforced concrete structures.',
            'prod-tubes-title': 'Square Tubes', 'prod-tubes-desc': 'Precision steel profiles for various applications.',
            'prod-plates-title': 'Steel Plates', 'prod-plates-desc': 'High-quality steel plates for industrial use.',
            'prod-angle-title': 'Angle Bars', 'prod-angle-desc': 'Versatile angle bars for construction and fabrication.',
            'prod-flat-title': 'Flat Bars', 'prod-flat-desc': 'Strong steel strips for multiple industrial applications.',
            'prod-round-title': 'Steel Billets', 'prod-round-desc': 'High strength billets for machining and rolling.',
            'prod-channel-title': 'U-Channels', 'prod-channel-desc': 'Structural U-channels for framing and supports.',
            'prod-slab-title': 'Steel Slabs', 'prod-slab-desc': 'High-quality steel slabs for industrial manufacturing.',
            'prod-coil-title': 'Galvanized Coils', 'prod-coil-desc': 'Corrosion-resistant coated steel coils.',
            'prod-wire-title': 'Steel Wires', 'prod-wire-desc': 'High-tensile steel wires for industrial tying and mesh.',
            'btn-download-datasheet': 'Download Datasheet',
            'btn-prev-prod': 'Previous', 'btn-next-prod': 'Next',
            'detail-feat1-title': 'High Strength', 'detail-feat1-desc': 'Built for durability',
            'detail-feat2-title': 'Corrosion Resistant', 'detail-feat2-desc': 'Long-lasting protection',
            
            'contact-sub-title': 'CONTACT US',
            'contact-desc-text': 'Have a question or need a custom solution? Our team is here to help you make better decisions.',
            'contact-phone-lbl': 'Phone', 'contact-email-lbl': 'Email', 'contact-addr-lbl': 'Company Address',
            'contact-addr-val': 'Mashhad, Janbaz Blvd, Pazh Admin Center 2, Floor 3, Unit 313',
            'contact-hours-lbl': 'Working Hours', 'contact-hours-val': 'Sat – Thu: 8:00 AM – 5:00 PM',
            'form-title': 'Send Us a Message', 'form-sub': "Fill out the form below and we'll get back to you as soon as possible.",
            'placeholder-name': 'Full Name', 'placeholder-email': 'Email Address', 'placeholder-company': 'Company Name',
            'placeholder-subject': 'Subject', 'placeholder-msg': 'Your Message', 'btn-send': 'Send Message',
            'trust-title': 'Partnerships Built on Trust', 'trust-desc': "At Mohajer Steel, we believe strong partnerships create stronger results. Let's build the future together.",
            'btn-call': 'Request a Call', 'btn-direct-msg': 'Message Expert', 'msg-success': 'Your message has been sent successfully!',
            
            'about-history': 'Our History', 'history-sub-badge': 'OUR HISTORY',
            'history-title-light': 'COMPANY', 'history-title-red': 'HISTORY',
            'history-desc': 'With more than seven decades of experience in trade and export, Mohajer Steel has grown into one of the leading exporters in Khorasan Razavi Province, trusted by partners worldwide.',
            'founder1-year': '1330', 'founder1-subtitle': 'The Founder', 'founder1-name': 'Late Haj Ghasem Mohajeri',
            'founder1-bio': 'The roots of our business go back to 1330, when the late Haj Ghasem Mohajeri Khorasani began his activity in the field of domestic trade of leather products and cross. By relying on experience, market knowledge, and professional business principles, he laid the foundation for a sustainable and successful business.',
            'founder2-year': '1374', 'founder2-subtitle': 'Continuing the Legacy', 'founder2-name': 'Mr. Hashem Mohajeri',
            'founder2-bio': 'Continuing this path, from 1374, Mr. Hashem Mohajeri Khorasani expanded the company’s export activities, particularly in the food sector, utilizing the valuable experiences of the past and extending our presence to multiple international markets.',
            'timeline-sub': 'OUR JOURNEY', 'timeline-title': 'A History of Growth and Commitment',
            'timeline1-year': '1330', 'timeline1-title': 'The Beginning', 'timeline1-desc': 'The roots of our business go back to 1330, when the late Haj Ghasem Mohajeri Khorasani began his activity in the field of domestic trade of leather products and cross. By relying on experience, market knowledge, and professional business principles, he laid the foundation for a sustainable and successful business.',
            'timeline2-year': '1366', 'timeline2-title': 'Expansion to International Markets', 'timeline2-desc': 'In 1366, the company entered international trade and began exporting cross and wet blue products to Turkey and Italy. This important step marked a turning point in the development of our business and entry into global markets.',
            'timeline3-year': '1374', 'timeline3-title': 'Growth in Exports', 'timeline3-desc': 'From 1374, under the leadership of Mr. Hashem Mohajeri Khorasani, our export activities expanded into various sectors including food products. During this period, our exports reached countries such as Afghanistan, Pakistan, Turkmenistan, Tajikistan, Kazakhstan, Kyrgyzstan, Russia, UAE, Turkey, Lebanon, Iraq, Canada, UK, Germany, and Somalia.',
            'timeline4-year': '1397', 'timeline4-title': 'Diversification into Strategic Industries', 'timeline4-desc': 'Since 1397 and in line with global market demands, the company expanded into strategic commodities such as steel and petrochemical products. This approach has enabled sustainable growth and a stronger presence in international markets.',
            'timeline5-year': 'Today and Beyond', 'timeline5-title': 'Today and Beyond', 'timeline5-desc': 'Today, with more than 70 years of experience in trade and several decades of successful export, Mohajer Steel is recognized as one of the top exporters in Khorasan Razavi Province. We continue to build the future through professionalism, quality, commitment, and mutual trust.',
            
            'dept-sub': 'OUR DEPARTMENTS', 
            'dept-title-light': 'SPECIALIZED AREAS OF', 'dept-title-red': 'ACTIVITY',
            'dept-desc': '"Specialized activity in the steel, food, and petrochemical industries with an approach based on quality, sustainable supply, and global market development."',
            'dept-key-title': 'Our Key Departments',
            'dept1-title': 'Petrochemical', 'dept1-desc': 'The petrochemical department, relying on market knowledge and an extensive supply network, has built a reliable bridge between chemical industry producers and consumers. We provide basic and polymer products, ensuring a stable and reliable supply chain for our business partners.',
            'dept1-bullet1': 'Supply and trade of chemical and polymer raw materials', 'dept1-bullet2': 'Establishing a stable and reliable supply chain', 'dept1-bullet3': 'Risk management and global market support', 'dept1-bullet4': 'Offering customized trade solutions tailored to client needs',
            'dept2-title': 'Steel', 'dept2-desc': 'The steel industry is the core of our activities. Specializing in the supply and distribution of various steel products, from billets and slabs to beams and sheets, we provide reliable solutions for industrial and construction projects on a global scale.',
            'dept2-bullet1': 'Supply of premium quality steel products', 'dept2-bullet2': 'Extensive international supply and distribution network', 'dept2-bullet3': 'Competitive pricing and on-time delivery', 'dept2-bullet4': 'Support for industrial and construction projects at any scale',
            'dept3-title': 'Food Industry', 'dept3-desc': 'In the food industry department, we offer high-quality agricultural and food products to international markets by establishing a global network of reputable suppliers and producers. Rigorous supply chain management, quality control, and professional logistics guarantee safe delivery in compliance with global standards.',
            'dept3-bullet1': 'International supply and trade of food and agricultural products', 'dept3-bullet2': 'Quality control and compliance with global standards', 'dept3-bullet3': 'Professional logistics and supply chain management', 'dept3-bullet4': 'Guaranteed freshness, safety, and on-time delivery',
            'btn-learn-more': 'Learn More',

            'global-subtitle': 'OUR GLOBAL PRESENCE', 'global-title-light': 'EXPORTING STRENGTH.', 'global-title-red': 'BUILDING CONNECTIONS.',
            'global-desc': 'Our products are trusted in over 20 countries worldwide. We continue to expand our global footprint with quality, reliability, and long-term partnerships.',
            'global-stat1': 'Export Markets', 'global-stat2': 'Years of Experience', 'global-stat3': 'Products Exported',
            'global-partner-lbl': 'Export Partner', 'global-icon-steel': 'Steel Products', 'global-icon-petro': 'Petrochemical Products', 'global-icon-food': 'Food Products',
            'foot-stat1': 'Years of Experience', 'foot-stat2': 'International Partners', 'foot-stat4-h': 'Top Exporter', 'foot-stat4-p': 'Khorasan Razavi Province', 'foot-stat5': 'Continents', 'foot-stat6': 'Commitment to Quality',
            
            'active-coop-text': 'Active Cooperation',
            'country-af-name': 'Afghanistan', 'country-af-desc': 'We export high-quality steel, petrochemical and food products to Afghanistan with a focus on reliability and long-term cooperation.',
            'country-pk-name': 'Pakistan', 'country-pk-desc': 'Exporting premium grade structural steel, key chemical products, and high-nutrition agricultural food commodities to the Pakistani market.',
            'country-tm-name': 'Turkmenistan', 'country-tm-desc': 'Facilitating energy-sector raw materials, petrochemical supplies, and essential building steel pipelines to our partners in Turkmenistan.',
            'country-uz-name': 'Uzbekistan', 'country-uz-desc': 'Supplying advanced steel structures and key polymer derivatives supporting the growing industrial sectors in Uzbekistan.',
            'country-tj-name': 'Tajikistan', 'country-tj-desc': 'Robust trade channels providing agricultural machinery parts, construction steel, and localized food security commodities.',
            'country-kz-name': 'Kazakhstan', 'country-kz-desc': 'Supplying foundational infrastructure steel alloys, polymer materials, and specialized heavy industry raw components.',
            'country-kg-name': 'Kyrgyzstan', 'country-kg-desc': 'Developing logistics networks and distributing standard grade construction wires, grain food products, and oil derivatives.',
            'country-tr-name': 'Turkey', 'country-tr-desc': 'A key strategic hub where we actively export specialized industrial chemicals, high-grade steel rods, and premium organic food materials.',
            'country-lb-name': 'Lebanon', 'country-lb-desc': 'Dedicated trade agreements delivering food raw materials, organic grain oils, and critical infrastructure-supporting steel rebars.',
            'country-sy-name': 'Syria', 'country-sy-desc': 'Supporting rebuilding and industrial recovery with essential building materials, structural beams, and petrochemical derivatives.',
            'country-iq-name': 'Iraq', 'country-iq-desc': 'Extensive steel piping, rebar networks, and vital industrial solvents supplied for nationwide infrastructural projects.',
            'country-ae-name': 'UAE', 'country-ae-desc': 'Connecting high-tech structural steel profiles and premium grade industrial petrochemical polymers directly to the Gulf trading capital.',
            'country-so-name': 'Somalia', 'country-so-desc': 'Key cargo lines delivering maritime structural elements and basic wire products. (Food exports restricted).',
            'country-de-name': 'Germany', 'country-de-desc': 'High-spec industrial precision steel raw sheets and chemical synthesis polymers dispatched via top-tier European supply corridors.',
            'country-ca-name': 'Canada', 'country-ca-desc': 'Facilitating trans-Atlantic heavy trade channels, delivering premium alloy plates and eco-certified food materials.',
            'country-gb-name': 'England', 'country-gb-desc': 'Exporting standard construction structural profiles, raw chemicals, and specialized high-carbon steel wire products.',
            'country-au-name': 'Australia', 'country-au-desc': 'Supplying maritime-grade heavy steel elements and strategic agricultural exports to the Australian industrial market.'
        },
        fa: {
            dir: 'rtl',
            'nav-home': 'خانه', 'nav-products': 'محصولات', 'nav-departments': 'دپارتمان‌ها', 'nav-about': 'درباره ما', 'nav-contact': 'تماس با ما',
            'btn-quote': 'دریافت قیمت', 'hero-subtitle': 'فولاد با کیفیت ممتاز', 
            'hero-title-1': 'فولاد', 'hero-title-2': 'مهاجر مبین',
            'hero-desc': 'زیر مجموعه گروه بین‌المللی بازرگانی مهاجر',
            'btn-explore': 'بررسی محصولات', 'btn-catalog': 'مشاهده کاتالوگ', 'trusted-title': 'مورد اعتماد رهبران صنعت',
            'trusted-desc': 'ارائه خدمات برتر در سراسر جهان.',
            'feat-1-title': 'کیفیت ممتاز', 'feat-1-desc': 'تست شده و تایید شده مطابق با استانداردهای بین‌المللی.',
            'feat-2-title': 'استحکام بالا', 'feat-2-desc': 'ساخته شده برای عملکرد در سخت‌ترین شرایط محیطی.',
            'feat-3-title': 'تحویل به موقع', 'feat-3-desc': 'لجستیک قابل اعتماد برای اطمینان از پیشرفت پروژه‌های شما.',
            'feat-4-title': 'تولید پایدار', 'feat-4-desc': 'متعهد به تولید سازگار با محیط زیست و مسئولانه.',
            'prod-sub': 'محصولات ما', 'prod-title': 'محصولات فولادی ممتاز',
            'prod-desc': 'محصولات فولادی با کیفیت بالا، مهندسی شده برای استحکام، دوام و کارایی در هر پروژه.',
            'showing-txt-p1': 'نمایش ۱ تا ۸ از ۱۲ محصول', 'showing-txt-p2': 'نمایش ۹ تا ۱۲ از ۱۲ محصول', 'view-details': 'مشاهده جزئیات',
            'cta-title': 'نمی‌توانید آنچه را که به دنبالش هستید پیدا کنید؟', 'cta-desc': 'با کارشناسان ما برای راه‌حل‌های فولادی سفارشی متناسب با پروژه خود تماس بگیرید.',
            'btn-custom-quote': 'درخواست قیمت سفارشی',
            'prod-pipes-title': 'لوله', 'prod-pipes-desc': 'لوله‌های بادوام جهت انتقال مایعات و گازها.',
            'prod-beams-title': 'تیرآهن', 'prod-beams-desc': 'تیرآهن‌های فولادی با مقاومت بالا برای سازه.',
            'prod-rebar-title': 'میلگرد', 'prod-rebar-desc': 'میلگردهای مقاوم سازی بتن در پروژه‌های عمرانی.',
            'prod-tubes-title': 'پروفیل', 'prod-tubes-desc': 'پروفیل‌های صنعتی چهارگوش با مهندسی ابعادی دقیق.',
            'prod-plates-title': 'ورق فولادی', 'prod-plates-desc': 'ورق‌های فولادی با کیفیت بالا مناسب مصارف صنعتی.',
            'prod-angle-title': 'نبشی', 'prod-angle-desc': 'پروفیل‌های نبشی پرکاربرد در صنایع ساختمانی.',
            'prod-flat-title': 'تسمه', 'prod-flat-desc': 'تسمه‌های فولادی مستحکم مناسب قطعه‌سازی.',
            'prod-round-title': 'شمش', 'prod-round-desc': 'شمش‌های فولادی مرغوب برای مصارف نورد و فولادسازی.',
            'prod-channel-title': 'ناودانی (U-Channel)', 'prod-channel-desc': 'ناودانی‌های ساختمانی با مقاومت بالا.',
            'prod-slab-title': 'اسلب فولادی', 'prod-slab-desc': 'اسلب‌های فولادی با کیفیت بالا مناسب مصارف نورد.',
            'prod-coil-title': 'کلاف', 'prod-coil-desc': 'کلاف‌های ورق پوشش‌دار با مقاومت بالا در برابر زنگ‌زدگی.',
            'prod-wire-title': 'مفتول فولادی', 'prod-wire-desc': 'مفتول‌های فولادی با کشش بالا جهت آرماتوربندی.',
            'btn-download-datasheet': 'دانلود دیتاشیت',
            'btn-prev-prod': 'محصول قبلی', 'btn-next-prod': 'محصول بعدی',
            'detail-feat1-title': 'استحکام بالا', 'detail-feat1-desc': 'ساخته شده برای دوام بالا',
            'detail-feat2-title': 'مقاوم به خوردگی', 'detail-feat2-desc': 'حفاظت طولانی‌مدت',

            'contact-sub-title': 'تماس با ما',
            'contact-desc-text': 'سوالی دارید یا به یک راه حل سفارشی نیاز دارید؟ تیم ما اینجاست تا به شما در تصمیم بهتر کمک کند.',
            'contact-phone-lbl': 'تلفن همراه', 'contact-email-lbl': 'پست الکترونیکی', 'contact-addr-lbl': 'آدرس شرکت',
            'contact-addr-val': 'مشهد، بلوار جانباز، پاژ اداری 2 طبقه 3 پلاک 313',
            'contact-hours-lbl': 'ساعات کاری', 'contact-hours-val': 'شنبه تا پنجشنبه: ۸:۰۰ صبح تا ۵:۰۰ عصر',
            'form-title': 'ارسال پیام به ما', 'form-sub': 'فرم زیر را پر کنید؛ ما در کوتاه‌ترین زمان ممکن با شما تماس خواهیم گرفت.',
            'placeholder-name': 'نام و نام خانوادگی', 'placeholder-email': 'آدرس ایمیل', 'placeholder-company': 'نام شرکت',
            'placeholder-subject': 'موضوع پیام', 'placeholder-msg': 'متن پیام شما', 'btn-send': 'ارسال پیام',
            'trust-title': 'همکاری بر پایه اعتماد', 'trust-desc': 'در مهاجر استیل، ما معتقدیم همکاری‌های قوی، نتایج قوی‌تری ایجاد می‌کنند. بیایید آینده را با هم بسازیم.',
            'btn-call': 'درخواست تماس', 'btn-direct-msg': 'پیام به کارشناس', 'msg-success': 'پیام شما با موفقیت ارسال شد!',
            
            'about-history': 'تاریخچه ما', 'history-sub-badge': 'تاریخچه شرکت',
            'history-title-light': 'تاریخچه', 'history-title-red': 'شرکت',
            'history-desc': 'با بیش از هفت دهه سابقه در تجارت و صادرات، شرکت مهاجر استیل به عنوان یکی از صادرکنندگان برتر استان خراسان رضوی در بازارهای جهانی شناخته می‌شود.',
            'founder1-year': '۱۳۳۰', 'founder1-subtitle': 'بنیان‌گذار گروه بین‌المللی بازرگانی مهاجر', 'founder1-name': 'مرحوم حاج قاسم مهاجری',
            'founder1-bio': 'ریشه فعالیت‌های تجاری این مجموعه به سال ۱۳۳۰ بازمی‌گردد؛ زمانی که مرحوم حاج قاسم مهاجری خراسانی فعالیت خود را در حوزه تجارت داخلی محصولات چرمی و کراس آغاز نمودند. ایشان با تکیه بر تجربه، دانش بازار و اصول حرفه‌ای تجارت، پایه‌های یک کسب‌وکار پایدار و موفق را بنا نهادند.',
            'founder2-year': '۱۳۷۴', 'founder2-subtitle': 'مدیر عامل گروه بین‌المللی بازرگانی مهاجر', 'founder2-name': 'هاشم مهاجری',
            'founder2-bio': 'در ادامه این مسیر و از سال ۱۳۷۴، آقای هاشم مهاجری خراسانی با بهره‌گیری از تجربیات ارزشمند گذشته، فعالیت‌های صادراتی مجموعه را به‌صورت تخصصی در حوزه‌هایی همچون مواد غذایی توسعه دادند و دامنه حضور ما را به بازارهای بین‌المللی گسترش دادند.',
            'timeline-sub': 'مسیر توسعه ما', 'timeline-title': 'تاریخچه‌ای از رشد و تعهد',
            'timeline1-year': '۱۳۳۰', 'timeline1-title': 'آغاز فعالیت', 'timeline1-desc': 'ریشه فعالیت‌های تجاری این مجموعه به سال ۱۳۳۰ بازمی‌گردد؛ زمانی که مرحوم حاج قاسم مهاجری خراسانی فعالیت خود را در حوزه تجارت داخلی محصولات چرمی و کراس آغاز نمودند. ایشان با تکیه بر تجربه، دانش بازار و اصول حرفه‌ای تجارت، پایه‌های یک کسب‌وکار پایدار و موفق را بنا نهادند.',
            'timeline2-year': '۱۳۶۶', 'timeline2-title': 'ورود به تجارت بین‌المللی', 'timeline2-desc': 'در سال ۱۳۶۶، این مجموعه وارد عرصه تجارت بین‌المللی شد و صادرات محصولات کراس و ویت‌بلو را به کشورهای ترکیه و ایتالیا آغاز کرد. این گام مهم، نقطه عطفی در توسعه فعالیت‌های بازرگانی مجموعه و ورود به بازارهای جهانی به شمار می‌آید.',
            'timeline3-year': '۱۳۷۴', 'timeline3-title': 'توسعه صادرات با محوریت مواد غذایی', 'timeline3-desc': 'در ادامه این مسیر و از سال ۱۳۷۴، آقای هاشم مهاجری خراسانی با بهره‌گیری از تجربیات ارزشمند گذشته، فعالیت‌های صادراتی مجموعه را به‌صورت تخصصی در حوزه‌هایی همچون مواد غذایی توسعه دادند. در این دوره، دامنه صادرات به کشورهای متعددی از جمله افغانستان، پاکستان، ترکمنستان، تاجیکستان، قزاقستان، قرقیزستان، روسیه، امارات، ترکیه، لبنان، عراق، کانادا، انگلستان، آلمان و سومالی گسترش یافت.',
            'timeline4-year': '۱۳۹۷', 'timeline4-title': 'توسعه در حوزه کالاهای راهبردی', 'timeline4-desc': 'از سال ۱۳۹۷ و همگام با نیازهای روز بازارهای جهانی، فعالیت‌های شرکت در حوزه کالاهای راهبردی توسعه یافت و صادرات محصولات فولادی و پتروشیمی نیز به سبد فعالیت‌های مجموعه افزوده شد. این رویکرد، زمینه رشد پایدار و حضور گسترده‌تر در بازارهای بین‌المللی را فراهم ساخت.',
            'timeline5-year': 'امروز و آینده', 'timeline5-title': 'امروز و آینده', 'timeline5-desc': 'امروز این مجموعه با بیش از هفت دهه سابقه در تجارت و چندین دهه تجربه موفق در صادرات، به عنوان یکی از صادرکنندگان برتر استان خراسان رضوی شناخته می‌شود و با تکیه بر اصول حرفه‌ای، کیفیت، تعهد و اعتماد متقابل، همکاری‌های تجاری خود را در سطح جهانی ادامه می‌دهد.',
            
            'dept-sub': 'دپارتمان‌های ما', 
            'dept-title-light': 'حوزه‌های تخصصی', 'dept-title-red': 'فعالیت',
            'dept-desc': '«فعالیت تخصصی در صنایع فولاد، مواد غذایی و پتروشیمی با رویکردی مبتنی بر کیفیت، تأمین پایدار و توسعه بازارهای جهانی»',
            'dept-key-title': 'دپارتمان‌های کلیدی ما',
            'dept1-title': 'صنایع پتروشیمی', 'dept1-desc': 'بخش پتروشیمی با تکیه بر دانش بازار و شبکه گسترده تأمین، پلی مطمئن میان تولیدکنندگان و مصرف‌کنندگان صنایع شیمیایی ایجاد کرده است. ما با ارائه محصولات پایه و پلیمری، زنجیره تأمینی پایدار و قابل اعتماد برای شرکای تجاری خود فراهم می‌کنیم.',
            'dept1-bullet1': 'تأمین و تجارت مواد اولیه شیمیایی و پلیمری', 'dept1-bullet2': 'ایجاد زنجیره تأمین پایدار و قابل اعتماد', 'dept1-bullet3': 'مدیریت ریسک و پشتیبانی از بازارهای جهانی', 'dept1-bullet4': 'ارائه راهکارهای تجاری متناسب با نیاز مشتریان',
            'dept2-title': 'صنایع فولاد', 'dept2-desc': 'صنایع فولاد، هسته اصلی فعالیت‌های ماست. با تخصص در تأمین و توزیع انواع محصولات فولادی، از بیلت و اسلب تا تیرآهن و ورق، راهکارهایی مطمئن برای پروژه‌های صنعتی و عمرانی در مقیاس جهانی ارائه می‌دهیم.',
            'dept2-bullet1': 'تأمین انواع محصولات فولادی با کیفیت ممتاز', 'dept2-bullet2': 'شبکه گسترده تأمین و توزیع بین‌المللی', 'dept2-bullet3': 'قیمت‌گذاری رقابتی و تحویل به‌موقع', 'dept2-bullet4': 'پشتیبانی از پروژه‌های صنعتی و ساختمانی در هر مقیاس',
            'dept3-title': 'صنایع غذایی', 'dept3-desc': 'در بخش صنایع غذایی، ما با ایجاد شبکه‌ای جهانی از تأمین‌کنندگان و تولیدکنندگان معتبر، محصولات کشاورزی و مواد غذایی باکیفیتی را به بازارهای بین‌المللی عرضه می‌کنیم. مدیریت دقیق زنجیره تأمین، کنترل کیفیت و لجستیک حرفه‌ای، تضمین‌کننده تحویل ایمن و مطابق با استانداردهای جهانی است.',
            'dept3-bullet1': 'تأمین و تجارت بین‌المللی محصولات غذایی و کشاورزی', 'dept3-bullet2': 'کنترل کیفیت و انطباق با استانداردهای جهانی', 'dept3-bullet3': 'مدیریت حرفه‌ای لجستیک و زنجیره تأمین', 'dept3-bullet4': 'تضمین تازگی، ایمنی و تحویل به‌موقع',
            'btn-learn-more': 'بیشتر بدانید',

            'global-subtitle': 'حضور جهانی ما', 'global-title-light': 'صادرات استحکام.', 'global-title-red': 'پل ارتباطی با بازارهای جهانی فولاد',
            'global-desc': 'محصولات ما در بیش از ۲۰ کشور در سراسر جهان مورد اعتماد هستند. ما همچنان ردپای جهانی خود را با کیفیت و همکاری‌های بلندمدت گسترش می‌دهیم.',
            'global-stat1': 'بازارهای هدف صادرات', 'global-stat2': 'سال تجربه موفق', 'global-stat3': 'نوع محصول صادراتی',
            'global-partner-lbl': 'شریک تجاری', 'global-icon-steel': 'محصولات فولادی', 'global-icon-petro': 'محصولات پتروشیمی', 'global-icon-food': 'محصولات غذایی',
            'foot-stat1': 'سال تجربه موفق', 'foot-stat2': 'شریک تجاری بین‌المللی', 'foot-stat4-h': 'صادرکننده برتر', 'foot-stat4-p': 'استان خراسان رضوی', 'foot-stat5': 'قاره مختلف', 'foot-stat6': 'تعهد مطلق به کیفیت',
            
            'active-coop-text': 'همکاری فعال',
            'country-af-name': 'افغانستان', 'country-af-desc': 'صادرات مستمر محصولات فولادی، پتروشیمی و غذایی با کیفیت بالا به افغانستان با تمرکز بر قابلیت اطمینان و توسعه پایدار.',
            'country-pk-name': 'پاکستان', 'country-pk-desc': 'تأمین فولاد ساختمانی با درجه ممتاز، محصولات کلیدی پتروشیمی و کالاهای اساسی غذایی برای بازار روبه‌رشد پاکستان.',
            'country-tm-name': 'ترکمنستان', 'country-tm-desc': 'تأمین مواد اولیه حوزه انرژی، اقلام پتروشیمی و مقاطع مهم فولادی برای شرکای کلیدی ما در ترکمنستان.',
            'country-uz-name': 'ازبکستان', 'country-uz-desc': 'تأمین سازه‌های پیشرفته فولادی و مشتقات پلیمری جهت پشتیبانی از بخش‌های صنعتی و زیرساختی ازبکستان.',
            'country-tj-name': 'تاجیکستان', 'country-tj-desc': 'ایجاد کانال‌های تجاری قدرتمند جهت تأمین فولاد ساختمانی، محصولات پلیمری و تأمین امنیت غذایی منطقه.',
            'country-kz-name': 'قزاقستان', 'country-kz-desc': 'تأمین آلیاژهای فولادی زیربنایی، مواد پلیمری و قطعات تخصصی صنایع سنگین برای پروژه‌های ملی قزاقستان.',
            'country-kg-name': 'قرقیزستان', 'country-kg-desc': 'توسعه شبکه‌های لجستیکی و توزیع مقاطع استاندارد فولادی، محصولات غلات و مشتقات پلیمری.',
            'country-tr-name': 'ترکیه', 'country-tr-desc': 'مرکز استراتژیک مهمی که مواد شیمیایی صنعتی، مقاطع مرغوب فولادی و مواد غذایی ارگانیک به آن صادر می‌گردد.',
            'country-lb-name': 'لبنان', 'country-lb-desc': 'توافق‌نامه‌های تجاری ویژه برای تحویل مواد اولیه غذایی، غلات و میلگردهای تقویت‌کننده زیرساخت‌های کلیدی.',
            'country-sy-name': 'سوریه', 'country-sy-desc': 'پشتیبانی از بازسازی و احیای صنعتی با ارسال مصالح ساختمانی ضروری، تیرآهن‌های سازه‌ای و مشتقات پتروشیمی.',
            'country-iq-name': 'عراق', 'country-iq-desc': 'شبکه‌های گسترده لوله‌های فولادی، میلگرد و حلال‌های حیاتی صنعتی تأمین‌شده برای پروژه‌های زیربنایی سراسری.',
            'country-ae-name': 'امارات متحده عربی', 'country-ae-desc': 'اتصال مستقیم پروفیل‌های ساختمانی و پلیمرهای پتروشیمی صنعتی با درجه ممتاز به پایتخت تجاری خلیج فارس.',
            'country-so-name': 'سومالی', 'country-so-desc': 'خطوط باربری استراتژیک برای تحویل عناصر ساختاری دریایی و محصولات اولیه فولادی (صادرات مواد غذایی محدود است).',
            'country-de-name': 'آلمان', 'country-de-desc': 'ارسال ورق‌های فولادی دقیق صنعتی و پلیمرهای پتروشیمی از طریق کریدورهای تأمین سطح بالای اروپایی.',
            'country-ca-name': 'کانادا', 'country-ca-desc': 'تسهیل کانال‌های تجارت سنگین فراآتلانتیک و تحویل اسلب‌های آلیاژی ممتاز و مواد غذایی تاییدشده.',
            'country-gb-name': 'انگلستان', 'country-gb-desc': 'صادرات مقاطع استاندارد ساختمانی، مواد شیمیایی خام و محصولات مفتول فولادی با کربن بالا.',
            'country-au-name': 'استرالیا', 'country-au-desc': 'تأمین عناصر فولادی سنگین دریایی و صادرات راهبردی کشاورزی برای بازار صنعتی استرالیا.'
        },
        ar: {
            dir: 'rtl',
            'nav-home': 'الرئيسية', 'nav-products': 'المنتجات', 'nav-departments': 'الأقسام', 'nav-about': 'من نحن', 'nav-contact': 'اتصل بنا',
            'btn-quote': 'احصل على سعر', 'hero-subtitle': 'فولاذ عالي الجودة', 
            'hero-title-1': 'فولاذ', 'hero-title-2': 'مهاجر مبين',
            'hero-desc': 'شركة تابعة لمجموعة مهاجر التجارية الدولية',
            'btn-explore': 'استكشف المنتجات', 'btn-catalog': 'عرض الكتالوج', 'trusted-title': 'محل ثقة رواد الصناعة', 'trusted-desc': 'تقديم التميز في جميع أنحاء العالم.',
            'feat-1-title': 'جودة ممتازة', 'feat-1-desc': 'مُختبر ومعتمد وفقاً للمعايير الدولية.',
            'feat-2-title': 'قوة عالية', 'feat-2-desc': 'مصمم للأداء الممتاز في أصعب الظروف.',
            'feat-3-title': 'التسليم في الوقت المحدد', 'feat-3-desc': 'خدمات لوجستية موثوقة لضمان بقاء مشاريعك في المسار الصحيح.',
            'feat-4-title': 'إنتاج مستدام', 'feat-4-desc': 'ملتزمون بالإنتاج المسؤول والصديق للبيئة.',
            'prod-sub': 'منتجاتنا', 'prod-title': 'منتجات الفولاذ المتميزة',
            'prod-desc': 'منتجات فولاذية عالية الجودة مصممة للقوة والمتانة والأداء في كل مشروع.',
            'showing-txt-p1': 'عرض ١ - ٨ من أصل ١٢ منتجاً', 'showing-txt-p2': 'عرض ٩ - ١٢ من أصل ١٢ منتجاً', 'view-details': 'عرض التفاصيل',
            'cta-title': 'ألا تجد ما تبحث عنه؟', 'cta-desc': 'اتصل بخبرائنا للحصول على حلول فولاذية مخصصة لمشروعك.',
            'btn-custom-quote': 'طلب عرض سعر مخصص',
            'prod-pipes-title': 'أنابيب الصلب', 'prod-pipes-desc': 'أنابيب صلب متينة لنقل السوائل والغازات بشكل آمن.',
            'prod-beams-title': 'كمرات حديد H', 'prod-beams-desc': 'كمرات حديد إنشائية عالية التحمل للمباني والمصانع.',
            'prod-rebar-title': 'قضبان حديد التسليح', 'prod-rebar-desc': 'قضبان حديد مضلعة لتدعيم وتقوية الهياكل الخرسانية.',
            'prod-tubes-title': 'أنابيب مربعة', 'prod-tubes-desc': 'أنابيب صلبة مربعة ومستطيلة ذات دقة تصنيع عالية.',
            'prod-plates-title': 'صفائح الصلب', 'prod-plates-desc': 'صفائح فولاذية متينة بأبعاد مختلفة للاستخدام الصناعي.',
            'prod-angle-title': 'زوايا حديد', 'prod-angle-desc': 'زوايا حديدية متعددة الاستعمالات في البناء والتصنيع.',
            'prod-flat-title': 'حديد مسطح', 'prod-flat-desc': 'خوص حديدية قوية ومقاومة للأحمال والشد الصناعي.',
            'prod-round-title': 'قضبان دائرية', 'prod-round-desc': 'قضبان حديد دائرية ملساء مناسبة لعمليات الدرفلة.',
            'prod-channel-title': 'قنوات U حديدية', 'prod-channel-desc': 'قنوات حديدية إنشائية لدعم الإطارات والهياكل.',
            'prod-slab-title': 'بلاطات الصلب (اسلب)', 'prod-slab-desc': 'بلاطات الصلب الإنشائية المدرفلة.',
            'prod-coil-title': 'لفائف مجلفنة', 'prod-coil-desc': 'لفائف حديدية مطلية ومقاومة للصدأ والتآكل.',
            'prod-wire-title': 'أسلاك فولاذية', 'prod-wire-desc': 'أسلاك صلبة عالية الشد للربط الصناعي والشبكات.',
            'btn-download-datasheet': 'تحميل ورقة البيانات',
            'btn-prev-prod': 'السابق', 'btn-next-prod': 'التالي',
            'detail-feat1-title': 'قوة عالية', 'detail-feat1-desc': 'مصمم للمتانة الفائقة',
            'detail-feat2-title': 'مقاوم للتآكل', 'detail-feat2-desc': 'حماية طويلة الأمد في البيئات الصعبة',

            'contact-sub-title': 'اتصل بنا',
            'contact-desc-text': 'هل لديك سؤال أو تحتاج إلى حل مخصص؟ فريقنا هنا لمساعدتك في اتخاذ قرارات أفضل.',
            'contact-phone-lbl': 'الهاتف', 'contact-email-lbl': 'البريد الإلكتروني', 'contact-addr-lbl': 'عنوان الشركة',
            'contact-addr-val': 'مشهد، بلوار جانباز، باج الإداري 2، الطابق 3، رقم 313',
            'contact-hours-lbl': 'ساعات العمل', 'contact-hours-val': 'السبت – الخميس: ٨:٠٠ صباحاً – ٥:٠٠ مساءً',
            'form-title': 'أرسل لنا رسالة', 'form-sub': 'يرجى ملء النموذج أدناه وسنقوم بالرد عليك في أقرب وقت ممكن.',
            'placeholder-name': 'الاسم الكامل', 'placeholder-email': 'البريد الإلكتروني', 'placeholder-company': 'اسم الشركة',
            'placeholder-subject': 'الموضوع', 'placeholder-msg': 'رسالتك', 'btn-send': 'إرسال الرسالة',
            'trust-title': 'شراكات مبنية على الثقة', 'trust-desc': 'في مهاجر ستيل، نؤمن بأن الشراكات القوية تحقق نتائج أقوى. لنبنِ المستقبل معاً.',
            'btn-call': 'طلب مكالمة', 'btn-direct-msg': 'مراسلة الخبير', 'msg-success': 'تم إرسال رسالتك بنجاح!',
            
            'about-history': 'تاريخنا', 'history-sub-badge': 'تاريخ الشركة',
            'history-title-light': 'تاريخ', 'history-title-red': 'الشركة',
            'history-desc': 'مع أكثر من سبعة عقود من الخبرة في التجارة والتصدير، نمت شركة مهاجر ستيل لتصبح واحدة من المصدرين الرائدين في مقاطعة خراسان رضوي، والموثوق بهم من قبل الشركاء في جميع أنحاء العالم.',
            'founder1-year': '١٣٣٠', 'founder1-subtitle': 'المؤسس', 'founder1-name': 'المرحوم الحاج قاسم مهاجري',
            'founder1-bio': 'تعود جذور أعمالنا إلى عام ١٣۳۰، عندما بدأ المرحوم الحاج قاسم مهاجري خراساني نشاطه في مجال التجارة المحلية للمنتجات الجلدية والكروس. ومن خلال الاعتماد على الخبرة، ومعرفة السوق، ومبادئ الأعمال المهنية، وضع الأساس لمشروع تجاري مستدام وناجح.',
            'founder2-year': '١٣٧۴', 'founder2-subtitle': 'مواصلة الإرث وتطوير التصدير', 'founder2-name': 'السيد هاشم مهاجري',
            'founder2-bio': 'استمراراً لهذا المسار، ومنذ عام ١٣۷۴، قام السيد هاشم مهاجري خراساني بتوسيع أنشطة التصدير للشركة، لا سيما في قطاع الأغذية، مستفيداً من الخبرات القيمة الماضية وموسعاً وجودنا في العديد من الأسواق الدولية.',
            'timeline-sub': 'مسيرتنا', 'timeline-title': 'تاريخ من النمو والالتزام',
            'timeline1-year': '١٣٣٠', 'timeline1-title': 'البداية', 'timeline1-desc': 'تعود جذور أعمالنا إلى عام ١٣۳۰، عندما بدأ المرحوم الحاج قاسم مهاجري خراساني نشاطه في مجال التجارة المحلية للمنتجات الجلدية والكروس. ومن خلال الاعتماد على الخبرة، ومعرفة السوق، ومبادئ الأعمال المهنية، وضع الأساس لمشروع تجاري مستدام وناجح.',
            'timeline2-year': '١٣۶۶', 'timeline2-title': 'التوسع إلى الأسواق الدولية', 'timeline2-desc': 'في عام ١٣۶۶، دخلت الشركة في التجارة الدولية وبدأت في تصدير منتجات الكروس والويت بلو إلى تركيا وإيطاليا. شكلت هذه الخطوة الهامة نقطة تحول في تطوير أعمالنا ودخولنا إلى الأسواق العالمية.',
            'timeline3-year': '١٣٧۴', 'timeline3-title': 'نمو الصادرات مع التركيز على المنتجات الغذائية', 'timeline3-desc': 'منذ عام ١٣۷۴، وتحت قيادة السيد هاشم مهاجري خراساني، توسعت أنشطة التصدير لدينا لتشمل قطاعات مختلفة بما في ذلك المنتجات الغذائية. خلال هذه الفترة، وصلت صادراتنا إلى العديد من الدول بما في ذلك أفغانستان، باكستان، تركمانستان، طاجيكستان، كازاخستان، قرقیزستان، روسيا، الإمارات العربية المتحدة، تركيا، لبنان، العراق، كندا، المملكة المتحدة، ألمانيا، والصومال.',
            'timeline4-year': '١٣۹۷', 'timeline4-title': 'التنويع في الصناعات الاستراتيجية', 'timeline4-desc': 'منذ عام ١٣۹۷ وتماشياً مع متطلبات السوق العالمية، توسعت الشركة في السلع الاستراتيجية مثل منتجات الصلب والبتروكيماويات. وقد أتاح هذا النهج تحقيق نمو مستدام وحضور أقوى في الأسواق الدولية.',
            'timeline5-year': 'اليوم وما بعده', 'timeline5-title': 'اليوم وما بعده', 'timeline5-desc': 'اليوم، مع أكثر من ۷۰ عاماً من الخبرة في التجارة وعدة عقود من التصدير الناجح، تُعرف شركة مهاجر ستيل كأحد كبار المصدرين في مقاطعة خراسان رضوي، وتواصل بناء المستقبل من خلال الاحترافية والجودة والالتزام والثقة المتبادلة.',
            
            'dept-sub': 'أقسامنا وفروعنا', 
            'dept-title-light': 'مجالات النشاط', 'dept-title-red': 'المتخصصة',
            'dept-desc': '"نشاط متخصص في صناعات الصلب والأغذية والبتروكيماويات بنهج يعتمد على الجودة والتوريد المستدام وتطوير الأسواق العالمية."',
            'dept-key-title': 'أقسامنا الرئيسية الكبرى',
            'dept1-title': 'قطاع البتروكيماويات', 'dept1-desc': 'أنشأ قسم البتروكيماويات، بالاعتماد على المعرفة بالسوق وشبكة التوريد الواسعة، جسراً موثوقاً بين منتجي ومستهلكي الصناعات الكيميائية. من خلال توفير المنتجات الأساسية والبوليمرية، نوفر سلسلة توريد مستقرة وموثوقة لشركائنا التجاريين.',
            'dept1-bullet1': 'توريد وتجارة المواد الخام الكيميائية والبوليمرية', 'dept1-bullet2': 'إنشاء سلسلة توريد مستقرة وموثوقة', 'dept1-bullet3': 'إدارة المخاطر ودعم الأسواق العالمية', 'dept1-bullet4': 'تقديم حلول تجارية مخصصة وفقاً لاحتياجات العملاء',
            'dept2-title': 'قطاع الحديد والصلب', 'dept2-desc': 'صناعة الحديد والصلب هي جوهر أنشطتنا. تخصصاً في توريد وتوزيع مختلف المنتجات الفولاذية، من البليت والسلاب إلى الكمرات والألواح، نقدم حلولاً موثوقة للمشاريع الصناعية والإنشائية على نطاق عالمي.',
            'dept2-bullet1': 'توريد مختلف منتجات الفولاذ بجودة ممتازة', 'dept2-bullet2': 'شبكة توريد وتوزيع دولية واسعة', 'dept2-bullet3': 'أسعار تنافسية وتسليم في الوقت المحدد', 'dept2-bullet4': 'دعم المشاريع الصناعية والإنشائية في أي نطاق',
            'dept3-title': 'قطاع الصناعات الغذائية', 'dept3-desc': 'في قسم الصناعات الغذائية، نقوم بتصدير وتوريد المنتجات الزراعية والغذائية عالية الجودة إلى الأسواق الدولية من خلال بناء شبكة عالمية من الموردين والمنتجين المعتمدين. تضمن الإدارة الدقيقة لسلسلة التوريد ومراقبة الجودة والخدمات اللوجستية المهنية تسليماً آمناً ومطابقاً للمعايير العالمية.',
            'dept3-bullet1': 'التوريد والتجارة الدولية للمنتجات الغذائية والزراعية', 'dept3-bullet2': 'مراقبة الجودة والامتثال للمعايير العالمية', 'dept3-bullet3': 'الإدارة المهنية للوجستيات وسلسلة التوريد', 'dept3-bullet4': 'ضمان الطزاجة والسلامة والتسليم في الوقت المحدد',
            'btn-learn-more': 'تعرف على المزيد',

            'global-subtitle': 'تواجدنا العالمي', 'global-title-light': 'تصدير القوة.', 'global-title-red': 'بناء العلاقات.',
            'global-desc': 'منتجاتنا موثوقة في أكثر من 20 دولة حول العالم. نواصل توسيع بصمتنا العالمية بالجودة والشراكات طويلة الأمد.',
            'global-stat1': 'أسواق التصدير', 'global-stat2': 'سنوات من الخبرة', 'global-stat3': 'المنتجات المصدرة',
            'global-partner-lbl': 'شريك تجاري', 'global-icon-steel': 'منتجات الصلب', 'global-icon-petro': 'منتجات البتروكيماويات', 'global-icon-food': 'المنتجات الغذائية',
            'foot-stat1': 'سنوات من الخبرة', 'foot-stat2': 'شركاء دوليون', 'foot-stat4-h': 'أفضل مصدر', 'foot-stat4-p': 'محافظة خراسان رضوي', 'foot-stat5': 'قارات', 'foot-stat6': 'الالتزام بالجودة',
            
            'active-coop-text': 'تعاون نشط',
            'country-af-name': 'أفغانستان', 'country-af-desc': 'نقوم بتصدير منتجات الصلب والبتروكيماويات والأغذية عالية الجودة إلى أفغانستان مع التركيز على الموثوقية والشراكة طويلة الأمد.',
            'country-pk-name': 'باكستان', 'country-pk-desc': 'تصدير الفولاذ الإنشائي عالي الجودة والمنتجات الكيميائية الرئيسية والسلع الغذائية الزراعية إلى السوق الباكستانية.',
            'country-tm-name': 'تركمانستان', 'country-tm-desc': 'تسهيل توريد المواد الخام لقطاع الطاقة وإمدادات البتروكيماويات وأنابيب الصلب لشركائنا في تركمانستان.',
            'country-uz-name': 'أوزبكستان', 'country-uz-desc': 'توفير الهياكل الفولاذية المتقدمة ومشتقات البوليمر لدعم القطاعات الصناعية المتنامية في أوزبكستان.',
            'country-tj-name': 'طاجيكستان', 'country-tj-desc': 'قنوات تجارية قوية توفر قطع غيار الآلات الزراعية وفولاذ البناء والسلع الغذائية الموضعية.',
            'country-kz-name': 'كازاخستان', 'country-kz-desc': 'توفير سبائك الصلب للبنية التحتية الأساسية والمواد البوليمرية والمكونات الثقيلة المتخصصة للصناعة.',
            'country-kg-name': 'قيرغيزستان', 'country-kg-desc': 'تطوير الشبكات اللوجستية وتوزيع أسلاك البناء القياسية والمنتجات الغذائية ومشتقات النفط.',
            'country-tr-name': 'تركيا', 'country-tr-desc': 'مركز استراتيجي رئيسي نقوم بتصدير المواد الكيميائية الصناعية وقضبان الصلب والمواد الغذائية العضوية إليه.',
            'country-lb-name': 'لبنان', 'country-lb-desc': 'اتفاقيات تجارية مخصصة لتسليم المواد الخام الغذائية وزيوت الحبوب وقضبان الصلب الداعمة للبنية التحتية.',
            'country-sy-name': 'سوريا', 'country-sy-desc': 'دعم إعادة الإعمار والتعافي الصناعي بمواد البناء الأساسية والكمرات الهيكلية ومشتقات البتروكيماويات.',
            'country-iq-name': 'العراق', 'country-iq-desc': 'توفير أنابيب الصلب وشبكات حديد التسليح والمذيبات الصناعية الحيوية لمشاريع البنية التحتية الوطنية.',
            'country-ae-name': 'الإمارات', 'country-ae-desc': 'ربط القطاعات الإنشائية عالية التقنية وبوليمرات البتروكيماويات الصناعية مباشرة بعاصمة التجارة الخليجية.',
            'country-so-name': 'الصومال', 'country-so-desc': 'خطوط شحن رئيسية لتسليم العناصر الهيكلية البحرية والأسلاك الأساسية (صادرات الأغذية مقيدة).',
            'country-de-name': 'ألمانيا', 'country-de-desc': 'إرسال صفائح الصلب الصناعية الدقيقة والبوليمرات عبر ممرات التوريد الأوروبية رفيعة المستوى.',
            'country-ca-name': 'كندا', 'country-ca-desc': 'تسهيل القنوات التجارية عبر المحيط الأطلسي وتسليم صفائح السبائك الممتازة والمواد الغذائية المعتمدة.',
            'country-gb-name': 'إنجلترا', 'country-gb-desc': 'تصدير القطاعات الإنشائية القياسية والمواد الكيميائية الخام ومنتجات أسلاك الصلب عالي الكربون.',
            'country-au-name': 'أستراليا', 'country-au-desc': 'توفير عناصر الصلب الثقيلة للدرجات البحرية والصادرات الزراعية الاستراتيجية للسوق الصناعية الأسترالية.'
        },
        ru: {
            dir: 'ltr',
            'nav-home': 'Главная', 'nav-products': 'Продукция', 'nav-departments': 'Подразделения', 'nav-about': 'О нас', 'nav-contact': 'Контакты',
            'btn-quote': 'Запросить расчет', 'hero-subtitle': 'СТАЛЬ ПРЕМИАЛЬНОГО КАЧЕСТВА', 
            'hero-title-1': 'MOHAJER MOBIN', 'hero-title-2': 'STEEL',
            'hero-desc': 'Дочерняя компания международной торговой группы Mohajer',
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
            'founder1-year': '1330', 'founder1-subtitle': 'Основатель', 'founder1-name': 'Покойный Хадж Гасем Мухаджери',
            'founder1-bio': 'Истоки нашего бизнеса восходят к 1330 году, когда покойный Хадж Гасем Мухаджери Хорасани начал свою деятельность в сфере внутренней торговли кожей и кроссом. Опираясь на опыт, знание рынка и профессиональные принципы ведения бизнеса, он заложил фундамент для устойчивого и успешного предприятия.',
            'founder2-year': '1374', 'founder2-subtitle': 'Продолжение наследия', 'founder2-name': 'Г-н Хашем Мухаджери',
            'founder2-bio': 'Продолжая этот путь, с 1374 года г-н Хашем Мухаджери Хорасани расширил экспортную деятельность компании, особенно в продовольственном секторе, используя ценный опыт прошлого и расширив наше присутствие на многих международных рынках.',
            'timeline-sub': 'НАШ ПУТЬ', 'timeline-title': 'История роста и приверженности делу',
            'timeline1-year': '1330', 'timeline1-title': 'Начало пути', 'timeline1-desc': 'Истоки нашего бизнеса восходят к 1330 году, когда покойный Хадж Гасем Мухаджери Хорасани начал свою деятельность в сфере внутренней торговли кожей и кроссом. Опираясь на опыт, знание рынка и профессиональные принципы ведения бизнеса, он заложил фундамент для устойчивого и успешного предприятия.',
            'timeline2-year': '1366', 'timeline2-title': 'Выход на международные рынки', 'timeline2-desc': 'В 1366 году компания вышла на рынок международной торговли и начала экспортировать кросс и вет-блю в Турцию и Италию. Этот важный шаг ознаменовал поворотный момент в развитии нашего бизнеса и выходе на мировые рынки.',
            'timeline3-year': '1374', 'timeline3-title': 'Рост экспорта с акцентом на продукты питания', 'timeline3-desc': 'С 1374 года под руководством г-на Хашема Мухаджери Хорасани наша экспортная деятельность расширилась на различные сектора, включая продукты питания. В этот период наш экспорт достиг таких стран, как Афганистан, Пакистан, Туркменистан, Таджикистан, Казахстан, Кыргызстан, Россия, ОАЭ, Турция, Ливан, Ирак, Канада, Великобритания, Германия и Сомали.',
            'timeline4-year': '1397', 'timeline4-title': 'Диверсификация в стратегические отрасли', 'timeline4-desc': 'С 1397 года в соответствии с требованиями мирового рынка компания расширила свою деятельность на такие стратегические товары, как сталь и нефтехимическая продукция. Такой подход обеспечил устойчивый рост и более прочное присутствие на международных рынках.',
            'timeline5-year': 'Сегодня и в будущем', 'timeline5-title': 'Сегодня и в будущем', 'timeline5-desc': 'Сегодня, обладая более чем 70-летним торговым опытом и несколькими десятилетиями успешного экспорта, Mohajer Steel признана одним из ведущих экспортеров в провинции Хорасан-Резави, продолжая строить будущее благодаря профессионализму, качеству, приверженности делу и взаимному доверию.',
            
            'dept-sub': 'НАШИ ПОДРАЗДЕЛЕНИЯ', 
            'dept-title-light': 'СПЕЦИАЛИЗИРОВАННЫЕ НАПРАВЛЕНИЯ', 'dept-title-red': 'ДЕЯТЕЛЬНОСТИ',
            'dept-desc': '"Специализированная деятельность в сталелитейной, пищевой и нефтехимической промышленности с подходом, основанным на качестве, стабильных поставках и развитии мировых рынков."',
            'dept-key-title': 'Ключевые подразделения',
            'dept1-title': 'Нефтехимия', 'dept1-desc': 'Нефтехимический отдел, опираясь на знание рынка и обширную сеть поставок, построил надежный мост между производителями и потребителями химической промышленности. Мы предоставляем базовые и полимерные продукты, обеспечивая стабильную и надежную цепочку поставок для наших деловых партнеров.',
            'dept1-bullet1': 'Поставка и торговля химическим и полимерным сырьем', 'dept1-bullet2': 'Создание стабильной и надежной цепочки поставок', 'dept1-bullet3': 'Управление рисками и поддержка на мировых рынках', 'dept1-bullet4': 'Предоставление коммерческих решений под нужды клиентов',
            'dept2-title': 'Металлургия', 'dept2-desc': 'Сталелитейная промышленность является основой нашей деятельности. Специализируясь на поставке и дистрибуции различной стальной продукции, от заготовок и слябов до балок и листов, мы предоставляем надежные решения для промышленных и строительных проектов в глобальном масштабе.',
            'dept2-bullet1': 'Поставка стальной продукции премиум-качества', 'dept2-bullet2': 'Широкая международная сеть поставок и дистрибуции', 'dept2-bullet3': 'Конкурентоспособные цены и своевременная доставка', 'dept2-bullet4': 'Поддержка промышленных и строительных проектов любого масштаба',
            'dept3-title': 'Пищевая промышленность', 'dept3-desc': 'В отделе пищевой промышленности мы предлагаем высококачественные сельскохозяйственные и пищевые продукты на международных рынках путем создания глобальной сети надежных поставщиков и производителей. Строгое управление цепочкой поставок, контроль качества и профессиональная логистика гарантируют безопасную доставку в соответствии с мировыми стандартами.',
            'dept3-bullet1': 'Международные поставки и торговля пищевой и сельскохозяйственной продукцией', 'dept3-bullet2': 'Контроль качества и соответствие международным стандартам', 'dept3-bullet3': 'Профессиональное управление логистикой и цепочкой поставок', 'dept3-bullet4': 'Гарантия свежести, безопасности и своевременной доставки',
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
            'country-tr-name': 'Турция', 'country-tr-desc': 'Ключевой стратегический центр, куда мы активно экспортируем промышленные химикаты, высококачественный стальный прокат и органические продукты.',
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
        
        // تنظیم جهت مسیرنما در صفحه جزئیات محصول
        const breadcrumbsContainer = document.querySelector('.breadcrumbs-container');
        if (breadcrumbsContainer) {
            breadcrumbsContainer.style.setProperty('--dir', translation.dir);
        }

        const translatableElements = document.querySelectorAll('[data-key]');
        translatableElements.forEach(elem => {
            const key = elem.getAttribute('data-key');
            if (translation[key] !== undefined) {
                elem.innerText = translation[key];
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

    // شورتکات کیبورد برای بازگشت (Alt + ,)
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
        if(mainLandingView) mainLandingView.style.display = 'block';
        activeProductKey = null;
        setActiveNavLink('navHomeLink');
    }

    function showAboutUs() {
        if(mainLandingView) mainLandingView.style.display = 'none';
        if(productDetailView) productDetailView.style.display = 'none';
        if(departmentsView) departmentsView.style.display = 'none';
        if(aboutUsView) aboutUsView.style.display = 'block';
        setActiveNavLink('navAboutLink');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function showDepartments() {
        if(mainLandingView) mainLandingView.style.display = 'none';
        if(productDetailView) productDetailView.style.display = 'none';
        if(aboutUsView) aboutUsView.style.display = 'none';
        if(departmentsView) departmentsView.style.display = 'block';
        setActiveNavLink('navDepartmentsLink');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const clickMap = [
        { id: 'crumbHomeBtn', action: showMainLanding },
        { id: 'aboutCrumbHomeBtn', action: showMainLanding },
        { id: 'deptCrumbHomeBtn', action: showMainLanding },
        { id: 'headerLogoBtn', action: showMainLanding },
        { id: 'navHomeLink', action: (e) => { e.preventDefault(); showMainLanding(); window.scrollTo({top:0, behavior:'smooth'}); } },
        { id: 'aboutCrumbUsBtn', action: showAboutUs },
        { id: 'navAboutLink', action: (e) => { e.preventDefault(); showAboutUs(); } },
        { id: 'navDepartmentsLink', action: (e) => { e.preventDefault(); showDepartments(); } }
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

    const contactNavBtn = document.getElementById('navContactLink');
    if (contactNavBtn) {
        contactNavBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showMainLanding();
            setActiveNavLink('navContactLink');
            const contactSection = document.getElementById('contactSection');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    // ==========================================================================
    // کلیک‌پذیر شدن کل کارت محصولات
    // ==========================================================================
    document.addEventListener('click', (e) => {
        // بررسی می‌کنیم که آیا روی کارتی با کلاس catalog-card کلیک شده است
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
    // منوی موبایل (Mobile Menu)
    // ==========================================================================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinksContainer = document.getElementById('navLinks');
    
    if (mobileMenuBtn && navLinksContainer) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
        });

        navLinksContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
            });
        });
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
                header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
                header.style.padding = '16px 6%';
            } else {
                header.style.boxShadow = 'none';
                header.style.padding = '24px 6%';
            }
        }

        if (mainLandingView && mainLandingView.style.display !== 'none') {
            const scrollPos = window.scrollY + 150; 
            const sections = [
                { id: 'mainLandingView', linkId: 'navHomeLink' },
                { id: 'catalogSectionAnchor', linkId: 'navProductsLink' },
                { id: 'contactSection', linkId: 'navContactLink' }
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
