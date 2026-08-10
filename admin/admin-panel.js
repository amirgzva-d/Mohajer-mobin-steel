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
  const adminEmail = 'amirgzva@gmail.com';
  const firebaseApp = firebase.apps.length ? firebase.app() : firebase.initializeApp(window.MOHAJER_FIREBASE_CONFIG);
  const auth = firebaseApp.auth();
  const db = firebaseApp.firestore();
  let selected = null;
  let original = null;
  let selectedType = 'text';
  let changedStyles = new Set();
  const loadLocalDrafts = () => {
    try { return JSON.parse(localStorage.getItem(draftsKey) || '{}'); }
    catch { localStorage.removeItem(draftsKey); return {}; }
  };
  let drafts = loadLocalDrafts();
  let undoStack = [];
  let redoStack = [];
  const cloneDrafts = value => JSON.parse(JSON.stringify(value));
  const updateHistoryButtons = () => {
    $('#undoBtn').disabled = undoStack.length === 0;
    $('#redoBtn').disabled = redoStack.length === 0;
  };

  const notify = message => {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(notify.timer);
    notify.timer = setTimeout(() => toast.classList.remove('show'), 2600);
  };
  const saveDraftsLocally = () => {
    try {
      localStorage.setItem(draftsKey, JSON.stringify(drafts));
      $('#saveState').innerHTML = '<i></i> پیش‌نویس ذخیره شد';
      return true;
    } catch (error) {
      console.error('Local draft could not be saved:', error);
      return false;
    }
  };
  const saveDraftsRemotely = async () => {
    if (!auth.currentUser) throw new Error('Admin is not authenticated.');
    await db.collection('siteContent').doc('draft').set({
      content: drafts,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedBy: auth.currentUser.uid
    });
  };
  const rgbToHex = rgb => {
    const values = rgb?.match(/\d+/g);
    return values ? `#${values.slice(0, 3).map(value => Number(value).toString(16).padStart(2, '0')).join('')}` : '#ffffff';
  };
  function setPasswordVisibility(showPassword) {
    const input = $('#adminPassword');
    const toggle = $('#togglePassword');
    input.type = showPassword ? 'text' : 'password';
    toggle.setAttribute('aria-pressed', String(showPassword));
    toggle.setAttribute('aria-label', showPassword ? 'پنهان کردن رمز' : 'نمایش رمز');
    input.focus({ preventScroll: true });
  }

  const loginErrorMessage = error => {
    const invalidCodes = ['auth/invalid-credential', 'auth/invalid-login-credentials', 'auth/wrong-password', 'auth/user-not-found'];
    if (invalidCodes.includes(error.code)) return 'رمز عبور صحیح نیست.';
    if (error.code === 'auth/too-many-requests') return 'تلاش‌های ناموفق زیاد بود؛ چند دقیقه بعد دوباره امتحان کنید.';
    if (error.code === 'auth/network-request-failed') return 'ارتباط با سرور برقرار نشد؛ اینترنت یا VPN را بررسی کنید.';
    return 'ورود انجام نشد؛ لطفاً صفحه را تازه‌سازی و دوباره تلاش کنید.';
  };
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
    let element;
    try { element = doc.querySelector(draft.selector); } catch { return; }
    if (!element) return;
    if (draft.type === 'image') element.src = draft.content;
    else if (draft.type === 'text') setTextContent(element, draft.content);
    // Text styles are trusted only for drafts made by the current editor. Older
    // versions accidentally saved computed colors/backgrounds on a text edit.
    const styles = draft.type === 'text' && draft.schemaVersion !== 3 ? {} : draft.styles;
    Object.entries(styles || {}).forEach(([property, value]) => { if (value) element.style.setProperty(property.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`), value, property.startsWith('background') ? 'important' : ''); });
    if (draft.resizable) element.classList.add('admin-resizable');
  }
  function applyDrafts(doc) { Object.values(drafts).forEach(draft => applyDraft(doc, draft)); }
  function setTextContent(element, value) {
    const lines = String(value || '').split(/<br\s*\/?>/i);
    element.replaceChildren();
    lines.forEach((line, index) => {
      if (index) element.append(element.ownerDocument.createElement('br'));
      element.append(element.ownerDocument.createTextNode(line));
    });
  }

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
    document.body.classList.add('inspector-open');
    const isImage = element.tagName === 'IMG';
    const isText = Boolean(element.dataset.key) && !isImage;
    selectedType = isImage ? 'image' : isText ? 'text' : 'container';
    changedStyles = new Set();
    const computed = iframe.contentWindow.getComputedStyle(element);
    original = { html: element.innerHTML, src: element.src, style: element.getAttribute('style') || '', className: element.className };
    elementTitle.textContent = selectedType === 'image' ? 'ویرایش تصویر' : selectedType === 'container' ? 'ویرایش کادر یا بنر' : (element.dataset.key || 'ویرایش متن');
    empty.classList.add('hidden');
    form.classList.remove('hidden');
    content.closest('.field').classList.toggle('hidden', !isText);
    imageField.classList.toggle('hidden', !isImage);
    containerField.classList.toggle('hidden', isText);
    if (isText) { content.value = (element.innerText || element.textContent || '').trim(); updateCount(); }
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
    const availableStyles = {
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
    const styles = Object.fromEntries(
      Object.entries(availableStyles).filter(([property]) => changedStyles.has(property))
    );
    return { selector, type: selectedType, content: selectedType === 'image' ? imageInput.value : content.value.replace(/\n/g, '<br>'), styles, resizable: selectedType === 'container', schemaVersion: 3 };
  }

  $('#loginForm').addEventListener('submit', async event => {
    event.preventDefault();
    const submit = event.currentTarget.querySelector('button[type=submit]');
    submit.disabled = true;
    submit.textContent = 'در حال ورود…';
    $('#loginError').textContent = '';
    try {
      await auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
      await auth.signInWithEmailAndPassword(adminEmail, $('#adminPassword').value);
      $('#adminPassword').value = '';
      setPasswordVisibility(false);
    } catch (error) {
      console.error('Admin login failed:', error);
      $('#loginError').textContent = loginErrorMessage(error);
      $('#adminPassword').select();
    }
    submit.disabled = false;
    submit.textContent = 'ورود به پنل';
  });
  $('#togglePassword').addEventListener('click', () => setPasswordVisibility($('#adminPassword').type === 'password'));
  auth.onAuthStateChanged(async user => {
    if (user && user.email !== adminEmail) {
      await auth.signOut();
      return;
    }
    const loggedIn = Boolean(user);
    $('#loginGate').classList.toggle('hidden', loggedIn);
    $('#adminShell').classList.toggle('locked', !loggedIn);
    if (!loggedIn) return;
    try {
      const snapshot = await db.collection('siteContent').doc('draft').get();
      if (snapshot.exists && snapshot.data().content) {
        // Local edits may be created while Firestore is still loading. Never let
        // an older remote snapshot erase those pending edits.
        drafts = { ...snapshot.data().content, ...drafts };
        saveDraftsLocally();
        if (iframe.contentDocument) applyDrafts(iframe.contentDocument);
      }
    } catch (error) {
      console.error('Drafts could not be loaded:', error);
      notify('پیش‌نویس محلی نمایش داده شد؛ اتصال Firestore را بررسی کنید');
    }
  });

  iframe.addEventListener('load', preparePreview);
  content.addEventListener('input', () => { updateCount(); if (selectedType === 'text') setTextContent(selected, content.value.replace(/\n/g, '<br>')); });
  color.addEventListener('input', () => { changedStyles.add('color'); colorText.value = color.value; if (selected) selected.style.color = color.value; });
  colorText.addEventListener('change', () => { if (/^#[0-9a-f]{6}$/i.test(colorText.value)) { changedStyles.add('color'); color.value = colorText.value; selected.style.color = color.value; } });
  backgroundColor.addEventListener('input', () => { changedStyles.add('backgroundColor'); backgroundText.value = backgroundColor.value; if (selected) selected.style.setProperty('background-color', backgroundColor.value, 'important'); });
  backgroundText.addEventListener('change', () => { if (/^#[0-9a-f]{6}$/i.test(backgroundText.value)) { changedStyles.add('backgroundColor'); backgroundColor.value = backgroundText.value; selected.style.setProperty('background-color', backgroundColor.value, 'important'); } });
  backgroundImage.addEventListener('input', () => { changedStyles.add('backgroundImage'); changedStyles.add('backgroundSize'); changedStyles.add('backgroundPosition'); if (selected) { selected.style.setProperty('background-image', backgroundImage.value ? `url("${backgroundImage.value}")` : 'none', 'important'); selected.style.backgroundSize = 'cover'; selected.style.backgroundPosition = 'center'; } });
  [elementWidth, elementHeight, borderRadius].forEach(input => input.addEventListener('input', () => {
    if (!selected) return;
    changedStyles.add(input === elementWidth ? 'width' : input === elementHeight ? 'height' : 'borderRadius');
    selected.style.width = elementWidth.value ? `${elementWidth.value}px` : '';
    selected.style.height = elementHeight.value ? `${elementHeight.value}px` : '';
    selected.style.borderRadius = `${borderRadius.value || 0}px`;
    selected.classList.add('admin-resizable');
  }));
  imageInput.addEventListener('input', () => { if (selectedType === 'image') selected.src = imageInput.value; });
  document.querySelectorAll('[data-align]').forEach(btn => btn.addEventListener('click', () => {
    changedStyles.add('textAlign');
    document.querySelectorAll('[data-align]').forEach(item => item.classList.remove('active'));
    btn.classList.add('active');
    if (selected) selected.style.textAlign = btn.dataset.align;
  }));

  const applyChanges = async () => {
    const button = $('#applyChangesBtn');
    if (!selected || !selected.isConnected) {
      notify('ابتدا یک متن یا تصویر را از پیش‌نمایش انتخاب کنید');
      return;
    }

    const previousDrafts = cloneDrafts(drafts);
    const draft = draftFromSelection();
    if (!draft.selector) {
      notify('این بخش قابل ذخیره نیست؛ یک متن یا تصویر دیگر را انتخاب کنید');
      return;
    }
    if (draft.type === 'image' && !draft.content.trim()) {
      notify('آدرس یا فایل تصویر را انتخاب کنید');
      return;
    }

    button.disabled = true;
    button.textContent = 'در حال ذخیره…';
    try {
      drafts[draft.selector] = draft;
      if (!saveDraftsLocally()) {
        drafts = previousDrafts;
        notify('فضای ذخیره مرورگر کافی نیست؛ تصویر کوچک‌تری انتخاب کنید');
        return;
      }

      applyDraft(iframe.contentDocument, draft);
      undoStack.push(previousDrafts);
      redoStack = [];
      updateHistoryButtons();
      notify('تغییر ذخیره شد؛ اکنون می‌توانید انتشار را بزنید');

      try {
        await saveDraftsRemotely();
      } catch (error) {
        // The local draft remains publishable/retryable; a network failure must
        // never make Apply look as if it did nothing.
        console.error('Remote draft could not be saved:', error);
        notify('تغییر در مرورگر ذخیره شد؛ اتصال سرور را بررسی و دوباره انتشار را بزنید');
      }
    } finally {
      button.disabled = false;
      button.textContent = 'اعمال تغییر';
    }
  };

  $('#applyChangesBtn').addEventListener('click', applyChanges);
  form.addEventListener('submit', event => {
    event.preventDefault();
    applyChanges();
  });
  const restoreDraftSnapshot = snapshot => {
    drafts = cloneDrafts(snapshot);
    saveDraftsLocally();
    saveDraftsRemotely().catch(error => console.error('History state could not be synced:', error));
    iframe.contentWindow.location.reload();
    selected = null;
    form.classList.add('hidden');
    empty.classList.remove('hidden');
    updateHistoryButtons();
  };
  $('#undoBtn').addEventListener('click', () => {
    if (!undoStack.length) return;
    redoStack.push(cloneDrafts(drafts));
    restoreDraftSnapshot(undoStack.pop());
    notify('آخرین تغییر بازگردانده شد');
  });
  $('#redoBtn').addEventListener('click', () => {
    if (!redoStack.length) return;
    undoStack.push(cloneDrafts(drafts));
    restoreDraftSnapshot(redoStack.pop());
    notify('تغییر دوباره اعمال شد');
  });

  $('#resetBtn').addEventListener('click', () => { restoreOriginal(); form.classList.add('hidden'); empty.classList.remove('hidden'); selected = null; notify('تغییر لغو شد'); });
  $('#closeInspector').addEventListener('click', () => { document.body.classList.remove('inspector-open'); selected?.classList.remove('admin-selected-element'); selected = null; form.classList.add('hidden'); empty.classList.remove('hidden'); elementTitle.textContent = 'یک عنصر انتخاب کنید'; });
  $('#imageUpload').addEventListener('change', event => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 500 * 1024) return notify('حجم تصویر باید کمتر از ۵۰۰ کیلوبایت باشد');
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
  $('#collapseSidebar').addEventListener('click', () => {
    if (window.matchMedia('(max-width: 800px)').matches) {
      document.body.classList.toggle('sidebar-open');
    } else {
      document.body.classList.toggle('sidebar-collapsed');
    }
  });
  document.querySelectorAll('#pageList button, #contentNav button').forEach(button => button.addEventListener('click', () => {
    if (window.matchMedia('(max-width: 800px)').matches) document.body.classList.remove('sidebar-open');
  }));

  $('#previewBtn').addEventListener('click', () => window.open('../', '_blank', 'noopener'));
  const dialog = $('#publishDialog');
  $('#publishBtn').addEventListener('click', () => dialog.showModal());
  $('#closeDialog').addEventListener('click', () => dialog.close());
  $('#confirmPublishBtn').addEventListener('click', async () => {
    const button = $('#confirmPublishBtn');
    // Recover the last locally-applied draft if an asynchronous Firestore read
    // completed between Apply and Publish.
    if (!Object.keys(drafts).length) {
      drafts = loadLocalDrafts();
    }
    if (!Object.keys(drafts).length) {
      notify('هنوز تغییری ثبت نشده؛ ابتدا یک متن یا تصویر را ویرایش و اعمال کنید');
      dialog.close();
      return;
    }
    button.disabled = true;
    try {
      const batch = db.batch();
      const published = db.collection('siteContent').doc('published');
      const version = db.collection('siteVersions').doc();
      const payload = {
        content: drafts,
        publishedAt: firebase.firestore.FieldValue.serverTimestamp(),
        publishedBy: auth.currentUser.uid
      };
      batch.set(published, payload);
      batch.set(version, payload);
      await batch.commit();
      dialog.close();
      $('#saveState').innerHTML = '<i></i> روی سایت منتشر شد';
      notify('تغییرات با موفقیت روی سایت اصلی منتشر شد');
    } catch (error) {
      console.error('Publish failed:', error);
      notify('انتشار ناموفق بود؛ قوانین Firestore را فعال کنید');
    } finally {
      button.disabled = false;
    }
  });
  $('#logoutBtn').addEventListener('click', async () => {
    await auth.signOut();
    sessionStorage.clear();
    location.reload();
  });
})();
