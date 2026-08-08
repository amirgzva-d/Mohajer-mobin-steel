(() => {
  const iframe = document.querySelector('#sitePreview');
  const loading = document.querySelector('#previewLoading');
  const frame = document.querySelector('#previewFrame');
  const form = document.querySelector('#editorForm');
  const empty = document.querySelector('#emptyInspector');
  const title = document.querySelector('#elementTitle');
  const content = document.querySelector('#contentInput');
  const imageField = document.querySelector('#imageField');
  const imageInput = document.querySelector('#imageInput');
  const color = document.querySelector('#colorInput');
  const colorText = document.querySelector('#colorText');
  const charCount = document.querySelector('#charCount');
  const toast = document.querySelector('#toast');
  const draftsKey = 'mohajer-admin-drafts-v1';
  let selected = null;
  let original = null;
  let drafts = JSON.parse(localStorage.getItem(draftsKey) || '{}');

  const notify = message => {
    toast.textContent = message; toast.classList.add('show');
    clearTimeout(notify.timer); notify.timer = setTimeout(() => toast.classList.remove('show'), 2600);
  };
  const saveDrafts = () => {
    localStorage.setItem(draftsKey, JSON.stringify(drafts));
    document.querySelector('#saveState').innerHTML = '<i></i> پیش‌نویس ذخیره شد';
  };
  const selectorFor = element => element.dataset.key ? `[data-key="${CSS.escape(element.dataset.key)}"]` : null;

  function applyDrafts(doc) {
    Object.entries(drafts).forEach(([key, value]) => {
      const element = doc.querySelector(`[data-key="${CSS.escape(key)}"]`);
      if (!element) return;
      if (value.type === 'image') element.src = value.content;
      else element.innerHTML = value.content;
      if (value.color) element.style.color = value.color;
      if (value.align) element.style.textAlign = value.align;
    });
  }

  function preparePreview() {
    loading.style.display = 'none';
    const doc = iframe.contentDocument;
    if (!doc) return;
    applyDrafts(doc);
    const style = doc.createElement('style');
    style.textContent = `[data-key],img{cursor:pointer!important;transition:outline .15s,box-shadow .15s}[data-key]:hover,img:hover{outline:2px solid #3478f6!important;outline-offset:3px!important;box-shadow:0 0 0 5px #3478f633!important}`;
    doc.head.append(style);
    doc.addEventListener('click', event => {
      const element = event.target.closest('[data-key], img');
      if (!element) return;
      event.preventDefault(); event.stopPropagation(); selectElement(element);
    }, true);
  }

  function selectElement(element) {
    selected = element;
    const isImage = element.tagName === 'IMG';
    original = { content: isImage ? element.src : element.innerHTML, color: element.style.color, align: element.style.textAlign };
    title.textContent = isImage ? 'ویرایش تصویر' : (element.dataset.key || 'ویرایش متن');
    empty.classList.add('hidden'); form.classList.remove('hidden');
    imageField.classList.toggle('hidden', !isImage);
    content.closest('.field').classList.toggle('hidden', isImage);
    if (isImage) imageInput.value = element.src;
    else { content.value = element.innerText.trim(); updateCount(); }
    const computed = iframe.contentWindow.getComputedStyle(element);
    color.value = rgbToHex(computed.color); colorText.value = color.value;
    document.querySelectorAll('[data-align]').forEach(btn => btn.classList.toggle('active', btn.dataset.align === computed.textAlign));
  }

  function updateCount() { charCount.textContent = `${content.value.length.toLocaleString('fa-IR')} نویسه`; }
  function rgbToHex(rgb) {
    const values = rgb.match(/\d+/g); if (!values) return '#111827';
    return '#' + values.slice(0, 3).map(v => Number(v).toString(16).padStart(2, '0')).join('');
  }

  iframe.addEventListener('load', preparePreview);
  content.addEventListener('input', updateCount);
  color.addEventListener('input', () => colorText.value = color.value);
  colorText.addEventListener('change', () => { if (/^#[0-9a-f]{6}$/i.test(colorText.value)) color.value = colorText.value; });
  document.querySelectorAll('[data-align]').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('[data-align]').forEach(item => item.classList.remove('active')); btn.classList.add('active');
  }));

  form.addEventListener('submit', event => {
    event.preventDefault(); if (!selected) return;
    const isImage = selected.tagName === 'IMG';
    const value = isImage ? imageInput.value : content.value.replace(/\n/g, '<br>');
    if (isImage) selected.src = value; else selected.innerHTML = value;
    selected.style.color = color.value;
    const activeAlign = document.querySelector('[data-align].active');
    if (activeAlign) selected.style.textAlign = activeAlign.dataset.align;
    const key = selected.dataset.key;
    if (key) drafts[key] = { type: isImage ? 'image' : 'text', content: value, color: color.value, align: activeAlign?.dataset.align || '' };
    saveDrafts(); notify('تغییر به‌عنوان پیش‌نویس ذخیره شد');
  });

  document.querySelector('#resetBtn').addEventListener('click', () => {
    if (!selected || !original) return;
    if (selected.tagName === 'IMG') selected.src = original.content; else selected.innerHTML = original.content;
    selected.style.color = original.color; selected.style.textAlign = original.align;
    selectElement(selected); notify('تغییر لغو شد');
  });
  document.querySelector('#closeInspector').addEventListener('click', () => {
    selected = null; form.classList.add('hidden'); empty.classList.remove('hidden'); title.textContent = 'یک عنصر انتخاب کنید';
  });
  document.querySelector('#imageUpload').addEventListener('change', event => {
    const file = event.target.files[0]; if (!file) return;
    if (file.size > 2 * 1024 * 1024) return notify('حجم تصویر باید کمتر از ۲ مگابایت باشد');
    const reader = new FileReader(); reader.onload = () => imageInput.value = reader.result; reader.readAsDataURL(file);
  });
  document.querySelectorAll('[data-device]').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('[data-device]').forEach(item => item.classList.remove('active')); btn.classList.add('active');
    frame.className = `preview-frame ${btn.dataset.device}`;
  }));
  document.querySelectorAll('#pageList button').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('#pageList button').forEach(item => item.classList.remove('active')); btn.classList.add('active');
    document.querySelector('#currentPageName').textContent = btn.querySelector('span').textContent;
    const doc = iframe.contentDocument;
    const target = doc?.getElementById(btn.dataset.target);
    if (target) {
      const navMap = {specialSaleView:'navSpecialSaleLink',aboutUsView:'navAboutLink',departmentsView:'navDepartmentsLink',contactView:'navContactLink'};
      const nav = navMap[btn.dataset.target] && doc.getElementById(navMap[btn.dataset.target]);
      if (nav) nav.click(); else target.scrollIntoView({behavior:'smooth'});
    }
  }));
  document.querySelector('#languageSelect').addEventListener('change', event => {
    const item = iframe.contentDocument?.querySelector(`[data-lang="${event.target.value}"]`); if (item) item.click();
    notify(`زبان پیش‌نمایش به ${event.target.options[event.target.selectedIndex].text} تغییر کرد`);
  });
  document.querySelector('#previewBtn').addEventListener('click', () => window.open('../', '_blank', 'noopener'));
  const dialog = document.querySelector('#publishDialog');
  document.querySelector('#publishBtn').addEventListener('click', () => dialog.showModal());
  document.querySelector('#closeDialog').addEventListener('click', () => dialog.close());
})();
