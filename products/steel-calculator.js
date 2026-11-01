/* Self-contained engineering estimate. No prices, stock or analytics. */
(() => {
  "use strict";
  const DENSITY_KG_PER_M3 = 7850;
  const numberFormatter = new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 2 });
  const num = (value) => Number(value);
  const nf = (value) => numberFormatter.format(value);
  const labelMap = {
    diameter: "قطر اسمی (میلی‌متر)",
    cross: "ضلع مقطع (میلی‌متر)",
    thickness: "ضخامت (میلی‌متر)",
    width: "عرض (میلی‌متر)",
    length: "طول هر قطعه (متر)",
    count: "تعداد قطعات"
  };
  document.querySelectorAll("[data-steel-weight]").forEach((form) => {
    const mode = form.getAttribute("data-steel-weight");
    const fields = Array.from(form.querySelectorAll('input[type="number"]'));
    const result = form.querySelector(".weight-result");
    const request = form.querySelector(".weight-request");
    const copy = form.querySelector(".weight-copy");
    const copyStatus = form.querySelector(".weight-copy-status");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      copyStatus.textContent = "";
      if (!form.reportValidity()) return;
      const values = Object.fromEntries(fields.map((field) => [field.name, num(field.value)]));
      if (fields.some((field) => !Number.isFinite(values[field.name]) || values[field.name] <= 0 || values[field.name] < num(field.min) || values[field.name] > num(field.max)) || !Number.isInteger(values.count)) {
        result.textContent = "لطفاً مقادیر معتبر در بازه مشخص‌شده وارد کنید.";
        request.value = "";
        return;
      }
      let areaInSquareMm;
      if (mode === "rebar") {
        areaInSquareMm = Math.PI * values.diameter ** 2 / 4;
      } else if (mode === "steel-billet") {
        areaInSquareMm = values.cross ** 2;
      } else {
        areaInSquareMm = values.thickness * values.width;
      }
      const pieceKg = areaInSquareMm * 1e-6 * values.length * DENSITY_KG_PER_M3;
      const totalKg = pieceKg * values.count;
      if (!Number.isFinite(totalKg) || totalKg > 1e11) {
        result.textContent = "مقادیر واردشده برای این ابزار بیش از حد بزرگ هستند.";
        request.value = "";
        return;
      }
      result.textContent = "وزن نظری هر قطعه: " + nf(pieceKg) + " کیلوگرم | کل: " + nf(totalKg) + " کیلوگرم (" + nf(totalKg / 1000) + " تن)";
      const grade = form.querySelector('[name="grade"]').value.trim() || "نیازمند بررسی";
      const destination = form.querySelector('[name="destination"]').value.trim() || "هنوز مشخص نشده";
      const detailLines = fields.map((field) => labelMap[field.name] + ": " + field.value).join("\n");
      request.value = "موضوع: بررسی تأمین " + form.dataset.itemName + "\n" + detailLines + "\nگرید یا استاندارد: " + grade + "\nمقصد: " + destination + "\nوزن نظری تقریبی کل: " + totalKg.toFixed(2) + " کیلوگرم\nلطفاً امکان تأمین، مدارک فنی، شرایط تحویل و حمل را بررسی کنید. (وزن نهایی پس از تأیید گواهی و باسکول مشخص می‌شود.)";
    });
    copy.addEventListener("click", async () => {
      if (!request.value) { copyStatus.textContent = "ابتدا محاسبه را انجام دهید."; return; }
      try {
        if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error("clipboard unavailable");
        await navigator.clipboard.writeText(request.value);
        copyStatus.textContent = "متن درخواست کپی شد.";
      } catch (_) {
        request.focus();
        request.select();
        copyStatus.textContent = "متن انتخاب شد؛ می‌توانید با Ctrl+C آن را کپی کنید.";
      }
    });
  });
})();
