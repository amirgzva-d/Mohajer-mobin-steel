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
  const githubRepo = 'amirgzva-d/Mohajer-mobin-steel';
  const githubBranch = 'main';
  const githubSourcePath = 'index.html';
  const githubTokenKey = 'mohajer-github-token-v1';
  const adminEmail = 'amirgzva@gmail.com';
  const firebaseApp = firebase.apps.length ? firebase.app() : firebase.initializeApp(window.MOHAJER_FIREBASE_CONFIG);
  const auth = firebaseApp.auth();
  let selected = null;
  let original = null;
  let selectedType = 'text';
  let changedStyles = new Set();
  let drafts = {};
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
  const markChangesReady = () => {
    const count = Object.keys(drafts).length.toLocaleString('fa-IR');
    $('#saveState').innerHTML = `<i></i> ${count} تغییر آماده انتشار`;
  };
  const githubHeaders = token => ({
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28'
  });
  const readGithubResponse = async response => {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(data.message || `GitHub request failed (${response.status})`);
      error.status = response.status;
      throw error;
    }
    return data;
  };
  const decodeBase64Utf8 = value => {
    const binary = atob(String(value || '').replace(/\s/g, ''));
    const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  };
  const encodeBase64Utf8 = value => {
    const bytes = new TextEncoder().encode(value);
    let binary = '';
    const chunkSize = 0x8000;
    for (let offset = 0; offset < bytes.length; offset += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
    }
    return btoa(binary);
  };
  const applyDraftsToSource = source => {
    const parsed = new DOMParser().parseFromString(source, 'text/html');
    let appliedCount = 0;
    Object.values(drafts).forEach(draft => {
      let element;
      try { element = parsed.querySelector(draft.selector); } catch { return; }
      if (!element) return;

      if (draft.type === 'image') element.setAttribute('src', draft.content);
      else if (draft.type === 'text') setTextContent(element, draft.content);

      const styles = draft.type === 'text' && draft.schemaVersion !== 3 ? {} : draft.styles;
      Object.entries(styles || {}).forEach(([property, value]) => {
        if (!value) return;
        const cssProperty = property.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
        element.style.setProperty(cssProperty, value, property.startsWith('background') ? 'important' : '');
      });
      appliedCount += 1;
    });
    if (!appliedCount) throw new Error('هیچ‌کدام از بخش‌های انتخاب‌شده در index.html پیدا نشد.');
    return `<!DOCTYPE html>\n${parsed.documentElement.outerHTML}\n`;
  };
  const publishToGithub = async token => {
    const endpoint = `https://api.github.com/repos/${githubRepo}/contents/${githubSourcePath}`;
    const currentResponse = await fetch(`${endpoint}?ref=${encodeURIComponent(githubBranch)}`, {
      headers: githubHeaders(token)
    });
    const currentFile = await readGithubResponse(currentResponse);
    const source = decodeBase64Utf8(currentFile.content);
    const updatedSource = applyDraftsToSource(source);
    const updateResponse = await fetch(endpoint, {
      method: 'PUT',
      headers: { ...githubHeaders(token), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'ویرایش مستقیم محتوای سایت از پنل مدیریت',
        content: encodeBase64Utf8(updatedSource),
        sha: currentFile.sha,
        branch: githubBranch
      })
    });
    return readGithubResponse(updateResponse);
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
    const doc = element.ownerDocument;
    if (element.dataset.key) {
      const keySelector = `[data-key="${CSS.escape(element.dataset.key)}"]`;
      if (doc.querySelectorAll(keySelector).length === 1) return keySelector;
    }
    if (element.id) return `#${CSS.escape(element.id)}`;
    const parts = [];
    let node = element;
    while (node && node !== doc.body && parts.length < 8) {
      if (node.id) {
        parts.unshift(`#${CSS.escape(node.id)}`);
        break;
      }
      if (node.dataset.key) {
        const keySelector = `[data-key="${CSS.escape(node.dataset.key)}"]`;
        if (doc.querySelectorAll(keySelector).length === 1) {
          parts.unshift(keySelector);
          break;
        }
      }
      let part = node.tagName.toLowerCase();
      const siblings = [...node.parentElement.children].filter(item => item.tagName === node.tagName);
      part += `:nth-of-type(${siblings.indexOf(node) + 1})`;
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
      applyDraft(iframe.contentDocument, draft);
      undoStack.push(previousDrafts);
      redoStack = [];
      updateHistoryButtons();
      markChangesReady();
      notify('تغییر ذخیره شد؛ اکنون می‌توانید انتشار را بزنید');
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
    iframe.contentWindow.location.reload();
    selected = null;
    form.classList.add('hidden');
    empty.classList.remove('hidden');
    updateHistoryButtons();
    markChangesReady();
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
      history: () => notify(`${Object.keys(drafts).length.toLocaleString('fa-IR')} تغییر در همین جلسه آماده انتشار است`)
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
  const githubTokenInput = $('#githubTokenInput');
  if (localStorage.getItem(githubTokenKey)) githubTokenInput.placeholder = 'توکن قبلی ذخیره شده است';
  $('#publishBtn').addEventListener('click', () => dialog.showModal());
  $('#closeDialog').addEventListener('click', () => dialog.close());
  $('#confirmPublishBtn').addEventListener('click', async () => {
    const button = $('#confirmPublishBtn');
    if (!Object.keys(drafts).length) {
      notify('هنوز تغییری ثبت نشده؛ ابتدا یک متن یا تصویر را ویرایش و اعمال کنید');
      dialog.close();
      return;
    }
    const token = githubTokenInput.value.trim() || localStorage.getItem(githubTokenKey) || '';
    if (!token) {
      notify('توکن GitHub را وارد کنید');
      githubTokenInput.focus();
      return;
    }
    button.disabled = true;
    button.textContent = 'در حال ثبت در GitHub…';
    try {
      await publishToGithub(token);
      localStorage.setItem(githubTokenKey, token);
      githubTokenInput.value = '';
      githubTokenInput.placeholder = 'توکن قبلی ذخیره شده است';
      drafts = {};
      undoStack = [];
      redoStack = [];
      updateHistoryButtons();
      dialog.close();
      $('#saveState').innerHTML = '<i></i> در کد اصلی ذخیره شد';
      notify('متن و تغییرات مستقیماً در index.html ثبت شد');
    } catch (error) {
      console.error('Publish failed:', error);
      if (error.status === 401 || error.status === 403) {
        localStorage.removeItem(githubTokenKey);
        githubTokenInput.value = '';
        githubTokenInput.placeholder = 'توکن معتبر GitHub را وارد کنید';
        notify('توکن GitHub معتبر نیست یا اجازه ویرایش ندارد');
      } else if (error.status === 409) {
        notify('کد سایت هم‌زمان تغییر کرده؛ دوباره انتشار را بزنید');
      } else {
        notify(error.message || 'ثبت تغییرات در GitHub انجام نشد');
      }
    } finally {
      button.disabled = false;
      button.textContent = 'تأیید و انتشار';
    }
  });
  $('#logoutBtn').addEventListener('click', async () => {
    await auth.signOut();
    sessionStorage.clear();
    location.reload();
  });
})();
