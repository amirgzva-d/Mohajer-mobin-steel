(() => {
  const $ = selector => document.querySelector(selector);
  const iframe = $('#sitePreview');
  const loading = $('#previewLoading');
  const frame = $('#previewFrame');
  const form = $('#editorForm');
  const empty = $('#emptyInspector');
  const elementTitle = $('#elementTitle');
  const content = $('#contentInput');
  const imageField = $('#imageField');
  const imageInput = $('#imageInput');
  const containerField = $('#containerField');
  const color = $('#colorInput');
  const colorText = $('#colorText');
  const backgroundColor = $('#backgroundColor');
  const backgroundText = $('#backgroundText');
  const backgroundImage = $('#backgroundImage');
  const elementWidth = $('#elementWidth');
  const elementHeight = $('#elementHeight');
  const borderRadius = $('#borderRadius');
  const charCount = $('#charCount');
  const toast = $('#toast');
  const draftsKey = 'mohajer-admin-drafts-v2';
  const passwordHash = '63fdad0b466972006b3954137e79874ec179241fbad5489009023804e39eb6e5';
  let selected = null;
  let original = null;
  let selectedType = 'text';
  let drafts = JSON.parse(localStorage.getItem(draftsKey) || '{}');

  const notify = message => {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(notify.timer);
    notify.timer = setTimeout(() => toast.classList.remove('show'), 2600);
  };
  const saveDrafts = () => {
    localStorage.setItem(draftsKey, JSON.stringify(drafts));
    $('#saveState').innerHTML = '<i></i> پیش‌نویس ذخیره شد';
  };
  const rgbToHex = rgb => {
    const values = rgb?.match(/\d+/g);
    return values ? `#${values.slice(0, 3).map(value => Number(value).toString(16).padStart(2, '0')).join('')}` : '#ffffff';
  };
  const hash = async value => {
    const bytes = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('');
  };

  function setPasswordVisibility(showPassword) {
    const input = $('#adminPassword');
    const toggle = $('#togglePassword');
    input.type = showPassword ? 'text' : 'password';
    toggle.setAttribute('aria-pressed', String(showPassword));
    toggle.setAttribute('aria-label', showPassword ? 'پنهان کردن رمز' : 'نمایش رمز');
    toggle.querySelector('span').textContent = showPassword ? '🙈' : '👁';
    input.focus({ preventScroll: true });
  }
  const uniqueSelector = element => {
    if (element.dataset.key) return `[data-key="${CSS.escape(element.dataset.key)}"]`;
    if (element.id) return `#${CSS.escape(element.id)}`;
    const parts = [];
    let node = element;
    while (node && node !== node.ownerDocument.body && parts.length < 5) {
      let part = node.tagName.toLowerCase();
      const usefulClass = [...node.classList].find(name => !name.startsWith('admin-'));
      if (usefulClass) part += `.${CSS.escape(usefulClass)}`;
      const siblings = [...node.parentElement.children].filter(item => item.tagName === node.tagName);
      if (siblings.length > 1) part += `:nth-of-type(${siblings.indexOf(node) + 1})`;
      parts.unshift(part);
      node = node.parentElement;
    }
    return parts.join(' > ');
  };

  function applyDraft(doc, draft) {
    const element = doc.querySelector(draft.selector);
    if (!element) return;
    if (draft.type === 'image') element.src = draft.content;
    else if (draft.type === 'text') element.innerHTML = draft.content;
    Object.entries(draft.styles || {}).forEach(([property, value]) => { if (value) element.style.setProperty(property.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`), value, property.startsWith('background') ? 'important' : ''); });
    if (draft.resizable) element.classList.add('admin-resizable');
  }
  function applyDrafts(doc) { Object.values(drafts).forEach(draft => applyDraft(doc, draft)); }

  function preparePreview() {
    loading.style.display = 'none';
    const doc = iframe.contentDocument;
    if (!doc) return;
    applyDrafts(doc);
    const style = doc.createElement('style');
    style.textContent = `[data-key],img,section,.product-card,.ss-product-card,.feature-item-new,.dept-card{cursor:pointer!important;transition:outline .15s,box-shadow .15s}[data-key]:hover,img:hover,section:hover,.product-card:hover,.ss-product-card:hover,.feature-item-new:hover,.dept-card:hover{outline:2px solid #3478f6!important;outline-offset:3px!important;box-shadow:0 0 0 5px #3478f633!important}.admin-selected-element{outline:3px solid #3478f6!important;outline-offset:3px!important}.admin-resizable{resize:both!important;overflow:auto!important;min-width:40px!important;min-height:30px!important}`;
    doc.head.append(style);
    doc.addEventListener('click', event => {
      const direct = event.target.closest('[data-key],img');
      const block = event.target.closest('.product-card,.ss-product-card,.feature-item-new,.feature-card,.catalog-banner,.hero-section,.dept-card,.ss-feature-box,.contact-form-container,section');
      const element = direct || block;
      if (!element) return;
      event.preventDefault();
      event.stopPropagation();
      selectElement(element);
    }, true);
  }

  function selectElement(element) {
    selected?.classList.remove('admin-selected-element');
    selected = element;
    selected.classList.add('admin-selected-element');
    const isImage = element.tagName === 'IMG';
    const isText = Boolean(element.dataset.key) && !isImage;
    selectedType = isImage ? 'image' : isText ? 'text' : 'container';
    const computed = iframe.contentWindow.getComputedStyle(element);
    original = { html: element.innerHTML, src: element.src, style: element.getAttribute('style') || '', className: element.className };
    elementTitle.textContent = selectedType === 'image' ? 'ویرایش تصویر' : selectedType === 'container' ? 'ویرایش کادر یا بنر' : (element.dataset.key || 'ویرایش متن');
    empty.classList.add('hidden');
    form.classList.remove('hidden');
    content.closest('.field').classList.toggle('hidden', !isText);
    imageField.classList.toggle('hidden', !isImage);
    containerField.classList.toggle('hidden', isText);
    $('#duplicateBtn').classList.toggle('hidden', isText || isImage);
    if (isText) { content.value = element.innerText.trim(); updateCount(); }
    if (isImage) imageInput.value = element.src;
    color.value = rgbToHex(computed.color); colorText.value = color.value;
    backgroundColor.value = computed.backgroundColor === 'rgba(0, 0, 0, 0)' ? '#ffffff' : rgbToHex(computed.backgroundColor);
    backgroundText.value = backgroundColor.value;
    backgroundImage.value = computed.backgroundImage === 'none' ? '' : computed.backgroundImage.replace(/^url\(["']?|["']?\)$/g, '');
    elementWidth.value = Math.round(element.getBoundingClientRect().width);
    elementHeight.value = Math.round(element.getBoundingClientRect().height);
    borderRadius.value = parseInt(computed.borderRadius, 10) || 0;
    document.querySelectorAll('[data-align]').forEach(btn => btn.classList.toggle('active', btn.dataset.align === computed.textAlign));
    element.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  function updateCount() { charCount.textContent = `${content.value.length.toLocaleString('fa-IR')} نویسه`; }
  function restoreOriginal() {
    if (!selected || !original) return;
    selected.innerHTML = original.html;
    if (original.src) selected.src = original.src;
    selected.setAttribute('style', original.style);
    selected.className = original.className;
  }
  function draftFromSelection() {
    const selector = uniqueSelector(selected);
    const styles = {
      color: color.value,
      textAlign: document.querySelector('[data-align].active')?.dataset.align || '',
      backgroundColor: backgroundColor.value,
      backgroundImage: backgroundImage.value ? `url("${backgroundImage.value}")` : '',
      backgroundSize: backgroundImage.value ? 'cover' : '',
      backgroundPosition: backgroundImage.value ? 'center' : '',
      width: elementWidth.value ? `${elementWidth.value}px` : '',
      height: elementHeight.value ? `${elementHeight.value}px` : '',
      borderRadius: `${borderRadius.value || 0}px`
    };
    return { selector, type: selectedType, content: selectedType === 'image' ? imageInput.value : content.value.replace(/\n/g, '<br>'), styles, resizable: selectedType === 'container' };
  }

  $('#loginForm').addEventListener('submit', async event => {
    event.preventDefault();
    const submit = event.currentTarget.querySelector('button[type=submit]');
    submit.disabled = true;
    $('#loginError').textContent = '';
    try {
      if (await hash($('#adminPassword').value) === passwordHash) {
        sessionStorage.setItem('mohajer-admin-auth', 'true');
        $('#loginGate').classList.add('hidden');
        $('#adminShell').classList.remove('locked');
        $('#adminPassword').value = '';
        setPasswordVisibility(false);
      } else {
        $('#loginError').textContent = 'رمز عبور صحیح نیست.';
        $('#adminPassword').select();
      }
    } catch (error) {
      console.error('Admin login failed:', error);
      $('#loginError').textContent = 'ورود انجام نشد؛ لطفاً صفحه را دوباره بارگذاری کنید.';
    }
    submit.disabled = false;
  });
  $('#togglePassword').addEventListener('click', () => setPasswordVisibility($('#adminPassword').type === 'password'));
  if (sessionStorage.getItem('mohajer-admin-auth') === 'true') {
    $('#loginGate').classList.add('hidden');
    $('#adminShell').classList.remove('locked');
  }

  iframe.addEventListener('load', preparePreview);
  content.addEventListener('input', () => { updateCount(); if (selectedType === 'text') selected.innerHTML = content.value.replace(/\n/g, '<br>'); });
  color.addEventListener('input', () => { colorText.value = color.value; if (selected) selected.style.color = color.value; });
  colorText.addEventListener('change', () => { if (/^#[0-9a-f]{6}$/i.test(colorText.value)) { color.value = colorText.value; selected.style.color = color.value; } });
  backgroundColor.addEventListener('input', () => { backgroundText.value = backgroundColor.value; if (selected) selected.style.setProperty('background-color', backgroundColor.value, 'important'); });
  backgroundText.addEventListener('change', () => { if (/^#[0-9a-f]{6}$/i.test(backgroundText.value)) { backgroundColor.value = backgroundText.value; selected.style.setProperty('background-color', backgroundColor.value, 'important'); } });
  backgroundImage.addEventListener('input', () => { if (selected) { selected.style.setProperty('background-image', backgroundImage.value ? `url("${backgroundImage.value}")` : 'none', 'important'); selected.style.backgroundSize = 'cover'; selected.style.backgroundPosition = 'center'; } });
  [elementWidth, elementHeight, borderRadius].forEach(input => input.addEventListener('input', () => {
    if (!selected) return;
    selected.style.width = elementWidth.value ? `${elementWidth.value}px` : '';
    selected.style.height = elementHeight.value ? `${elementHeight.value}px` : '';
    selected.style.borderRadius = `${borderRadius.value || 0}px`;
    selected.classList.add('admin-resizable');
  }));
  imageInput.addEventListener('input', () => { if (selectedType === 'image') selected.src = imageInput.value; });
  document.querySelectorAll('[data-align]').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('[data-align]').forEach(item => item.classList.remove('active'));
    btn.classList.add('active');
    if (selected) selected.style.textAlign = btn.dataset.align;
  }));

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!selected) return;
    const draft = draftFromSelection();
    applyDraft(iframe.contentDocument, draft);
    drafts[draft.selector] = draft;
    saveDrafts();
    notify('تغییر روی پیش‌نمایش زنده اعمال و ذخیره شد');
  });
  $('#resetBtn').addEventListener('click', () => { restoreOriginal(); form.classList.add('hidden'); empty.classList.remove('hidden'); selected = null; notify('تغییر لغو شد'); });
  $('#duplicateBtn').addEventListener('click', () => {
    if (!selected || selectedType !== 'container') return;
    const clone = selected.cloneNode(true);
    clone.classList.remove('admin-selected-element');
    selected.after(clone);
    notify('یک کپی از کادر اضافه شد؛ انتشار دائمی در مرحله پایگاه داده فعال می‌شود');
  });
  $('#closeInspector').addEventListener('click', () => { selected?.classList.remove('admin-selected-element'); selected = null; form.classList.add('hidden'); empty.classList.remove('hidden'); elementTitle.textContent = 'یک عنصر انتخاب کنید'; });
  $('#imageUpload').addEventListener('change', event => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return notify('حجم تصویر باید کمتر از ۲ مگابایت باشد');
    const reader = new FileReader();
    reader.onload = () => { imageInput.value = reader.result; if (selectedType === 'image') selected.src = reader.result; };
    reader.readAsDataURL(file);
  });
  document.querySelectorAll('[data-device]').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('[data-device]').forEach(item => item.classList.remove('active'));
    btn.classList.add('active');
    frame.className = `preview-frame ${btn.dataset.device}`;
  }));

  function showPage(targetId) {
    const doc = iframe.contentDocument;
    if (!doc) return;
    const ids = ['mainLandingView', 'productDetailView', 'aboutUsView', 'departmentsView', 'contactView', 'specialSaleView'];
    ids.forEach(id => { const view = doc.getElementById(id); if (view) view.style.display = 'none'; });
    if (targetId === 'catalogSectionAnchor') {
      doc.getElementById('mainLandingView').style.display = 'block';
      doc.getElementById(targetId)?.scrollIntoView({ block: 'start' });
    } else {
      const target = doc.getElementById(targetId);
      if (target) { target.style.display = 'block'; target.scrollIntoView({ block: 'start' }); }
    }
  }
  document.querySelectorAll('#pageList button').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('#pageList button').forEach(item => item.classList.remove('active'));
    btn.classList.add('active');
    $('#currentPageName').textContent = btn.querySelector('span').textContent;
    showPage(btn.dataset.target);
  }));
  $('#languageSelect').addEventListener('change', event => {
    iframe.contentDocument?.querySelector(`[data-lang="${event.target.value}"]`)?.click();
    setTimeout(() => showPage(document.querySelector('#pageList button.active').dataset.target), 50);
    notify(`زبان پیش‌نمایش به ${event.target.options[event.target.selectedIndex].text} تغییر کرد`);
  });
  document.querySelectorAll('#contentNav button').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('#contentNav button').forEach(item => item.classList.remove('active'));
    btn.classList.add('active');
    const actions = {
      pages: () => notify('یک صفحه را از فهرست پایین انتخاب کنید'),
      products: () => document.querySelector('#pageList [data-target="catalogSectionAnchor"]').click(),
      media: () => { notify('روی هر تصویر در پیش‌نمایش کلیک کنید تا مدیریت شود'); iframe.contentDocument?.querySelector('img')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); },
      translations: () => { $('#languageSelect').focus(); notify('زبان محتوا را از فهرست بالای پیش‌نمایش انتخاب کنید'); },
      history: () => notify(`${Object.keys(drafts).length.toLocaleString('fa-IR')} پیش‌نویس در این مرورگر ذخیره شده است`)
    };
    actions[btn.dataset.panel]?.();
  }));
  $('#previewBtn').addEventListener('click', () => window.open('../', '_blank', 'noopener'));
  const dialog = $('#publishDialog');
  $('#publishBtn').addEventListener('click', () => dialog.showModal());
  $('#closeDialog').addEventListener('click', () => dialog.close());
})();
