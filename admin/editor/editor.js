(() => {
  'use strict';

  /* MOHAJER STEEL VISUAL EDITOR PRO
     Startup is deliberately defensive: the editor UI never disappears because
     Firebase/Firestore/preview failed. Authentication unlocks the UI only after boot. */

  const $ = id => document.getElementById(id);
  const $$ = selector => Array.from(document.querySelectorAll(selector));
  const clone = value => { try { return JSON.parse(JSON.stringify(value)); } catch { return value; } };
  const DEFAULT_PAGE = '/products/steel-billet/';
  const ADMIN_EMAIL = 'amirgzva@gmail.com';
  const STORAGE = 'mohajer-editor-pro-draft-v9';

  let auth = null;
  let db = null;
  let firebaseReady = false;
  let iframe = null;
  let selected = null;
  let selectedKey = '';
  let device = 'desktop';
  let drafts = {};
  let pageMeta = { seo: {}, structure: {}, pages: {} };
  let pagePath = DEFAULT_PAGE;
  let undo = [];
  let redo = [];
  let booted = false;
  let previewReady = false;

  const notify = message => {
    const toast = $('toast');
    if (!toast) return;
    toast.textContent = String(message || '');
    toast.classList.add('show');
    clearTimeout(notify.timer);
    notify.timer = setTimeout(() => toast.classList.remove('show'), 3200);
  };

  const setLoginMessage = message => {
    const node = $('loginError');
    if (node) node.textContent = String(message || '');
  };

  const showRuntimeError = (message, error) => {
    console.error('[Mohajer Editor]', error || message);
    const text = error?.message || String(message || 'خطای ناشناخته');
    const app = $('app');
    if (!app) return;
    let banner = $('runtimeError');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'runtimeError';
      banner.style.cssText = 'position:fixed;top:84px;left:50%;transform:translateX(-50%);z-index:9000;max-width:min(760px,calc(100% - 30px));background:#34151a;color:#ffd9dc;border:1px solid #ff657355;border-radius:12px;padding:12px 16px;box-shadow:0 12px 40px #0008;font:600 12px Vazirmatn,Tahoma,sans-serif;direction:rtl';
      document.body.appendChild(banner);
    }
    banner.textContent = 'خطای داخلی پنل: ' + text;
    clearTimeout(showRuntimeError.timer);
    showRuntimeError.timer = setTimeout(() => banner.remove(), 9000);
  };

  window.addEventListener('error', event => {
    if (event?.error) showRuntimeError('JavaScript error', event.error);
  });
  window.addEventListener('unhandledrejection', event => {
    if (event?.reason) showRuntimeError('Promise error', event.reason);
  });

  const uid = () => 'me-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 9);
  const esc = value => {
    const text = String(value ?? '');
    if (window.CSS?.escape) return window.CSS.escape(text);
    return text.replace(/[^a-zA-Z0-9_-]/g, ch => '\\' + ch);
  };
  const safeSelector = selector => {
    try { return document.querySelector(selector) ? selector : selector; } catch { return ''; }
  };
  const hex = value => {
    const numbers = String(value || '').match(/\d+/g);
    if (!numbers || numbers.length < 3) return '#000000';
    return '#' + numbers.slice(0, 3).map(n => Number(n).toString(16).padStart(2, '0')).join('');
  };

  const styleMap = {
    fontSize:'font-size', fontWeight:'font-weight', lineHeight:'line-height', letterSpacing:'letter-spacing',
    textAlign:'text-align', textTransform:'text-transform', opacity:'opacity', margin:'margin', padding:'padding',
    gap:'gap', width:'width', height:'height', minWidth:'min-width', maxWidth:'max-width', position:'position',
    zIndex:'z-index', border:'border', borderRadius:'border-radius', boxShadow:'box-shadow', color:'color',
    backgroundColor:'background-color', backgroundImage:'background-image', backgroundSize:'background-size',
    backgroundPosition:'background-position', animationName:'animation-name', animationDuration:'animation-duration',
    animationDelay:'animation-delay', animationFillMode:'animation-fill-mode'
  };
  const cssName = key => styleMap[key] || String(key).replace(/[A-Z]/g, c => '-' + c.toLowerCase());

  const saveLocal = () => {
    try {
      localStorage.setItem(STORAGE, JSON.stringify({ drafts, pageMeta, pagePath }));
    } catch (error) { console.warn('Local draft unavailable', error); }
  };

  const loadLocal = () => {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE) || '{}');
      drafts = data && typeof data.drafts === 'object' ? data.drafts : {};
      pageMeta = data && data.pageMeta && typeof data.pageMeta === 'object' ? data.pageMeta : { seo:{}, structure:[], pages:{} };
      if (!Array.isArray(pageMeta.structure)) pageMeta.structure = [];
      if (!pageMeta.seo) pageMeta.seo = {};
      pagePath = typeof data.pagePath === 'string' ? data.pagePath : DEFAULT_PAGE;
    } catch (error) {
      console.warn('Local draft reset', error);
      drafts = {};
      pageMeta = { seo:{}, structure:[], pages:{} };
      pagePath = DEFAULT_PAGE;
    }
  };

  const historyButtons = () => {
    if ($('undoBtn')) $('undoBtn').disabled = undo.length === 0;
    if ($('redoBtn')) $('redoBtn').disabled = redo.length === 0;
  };

  const snapshotState = () => clone({ drafts, pageMeta, pagePath });
  const pushUndo = () => {
    undo.push(snapshotState());
    if (undo.length > 50) undo.shift();
    redo = [];
    historyButtons();
  };
  const restore = snapshot => {
    if (!snapshot) return;
    drafts = clone(snapshot.drafts || {});
    pageMeta = clone(snapshot.pageMeta || { seo:{}, structure:[], pages:{} });
    pagePath = snapshot.pagePath || DEFAULT_PAGE;
    saveLocal();
    applyAll();
    historyButtons();
  };

  const fallbackSelector = element => {
    if (!element) return '';
    if (element.dataset?.key) return `[data-key="${esc(element.dataset.key)}"]`;
    if (element.id) return '#' + esc(element.id);
    const parts = [];
    let node = element;
    while (node && node.parentElement && parts.length < 10) {
      let part = node.tagName.toLowerCase();
      const cls = Array.from(node.classList || []).find(name => !name.startsWith('admin-'));
      if (cls) part += '.' + esc(cls);
      const siblings = Array.from(node.parentElement.children).filter(item => item.tagName === node.tagName);
      if (siblings.length > 1) part += ':nth-of-type(' + (siblings.indexOf(node) + 1) + ')';
      parts.unshift(part);
      node = node.parentElement;
    }
    return parts.join(' > ');
  };

  const ensureStableId = element => {
    if (!element.dataset.mohajerEditorId) element.dataset.mohajerEditorId = uid();
    return element.dataset.mohajerEditorId;
  };
  const stableSelector = element => `[data-mohajer-editor-id="${esc(ensureStableId(element))}"]`;

  const elementType = element => {
    if (!element) return 'container';
    if (element.tagName === 'IMG') return 'image';
    if (element.tagName === 'A') return 'link';
    if (/^H[1-6]$/.test(element.tagName)) return 'heading';
    if (element.tagName === 'P') return 'paragraph';
    if (element.tagName === 'BUTTON') return 'button';
    return element.dataset.editorType || 'container';
  };

  const resolveElement = (draft, doc) => {
    if (!draft || !doc) return null;
    let element = null;
    try { if (draft.selector) element = doc.querySelector(draft.selector); } catch {}
    if (!element) {
      try { if (draft.fallbackSelector) element = doc.querySelector(draft.fallbackSelector); } catch {}
    }
    if (element && draft.stableId) element.dataset.mohajerEditorId = draft.stableId;
    return element;
  };

  const safeText = (element, value) => {
    element.replaceChildren();
    String(value ?? '').split(/<br\s*\/?\s*>/i).forEach((line, index) => {
      if (index) element.append(document.createElement('br'));
      element.append(document.createTextNode(line));
    });
  };

  const applyDraft = (draft, doc) => {
    const element = resolveElement(draft, doc);
    if (!element) return;
    try {
      if (draft.type === 'image' && draft.content) element.src = draft.content;
      else if (['text','link','heading','paragraph','button'].includes(draft.type)) safeText(element, draft.content);
      Object.entries(draft.styles || {}).forEach(([key, value]) => {
        if (value !== '' && value != null) element.style.setProperty(cssName(key), String(value));
      });
      Object.entries(draft.responsive?.[device] || {}).forEach(([key, value]) => {
        if (value) element.style.setProperty(cssName(key), String(value));
      });
      if (draft.hidden) element.style.setProperty('display', 'none', 'important');
      if (draft.hover?.scale && draft.hover.scale !== '1') {
        element.style.setProperty('--mohajer-hover-scale', draft.hover.scale);
        element.dataset.mohajerHoverScale = draft.hover.scale;
      }
      if (draft.link && (element.tagName === 'A' || element.closest('a')) && /^(https?:\/\/|\/)/i.test(draft.link)) {
        const link = element.tagName === 'A' ? element : element.closest('a');
        link.setAttribute('href', draft.link);
        if (draft.newTab) link.setAttribute('target', '_blank'); else link.removeAttribute('target');
      }
    } catch (error) { console.warn('Draft application skipped', error); }
  };

  const applyStructure = doc => {
    const operations = Array.isArray(pageMeta.structure) ? pageMeta.structure : [];
    operations.forEach(operation => {
      if (!operation?.id) return;
      try {
        const marker = `[data-mohajer-created="${esc(operation.id)}"]`;
        if (operation.action === 'delete') {
          const element = doc.querySelector(marker) || (operation.selector ? doc.querySelector(operation.selector) : null) || (operation.fallbackSelector ? doc.querySelector(operation.fallbackSelector) : null);
          element?.remove();
          return;
        }
        if (operation.action === 'move') {
          const element = doc.querySelector(operation.selector || marker);
          const parent = (operation.parentSelector && doc.querySelector(operation.parentSelector)) || (operation.parentFallbackSelector && doc.querySelector(operation.parentFallbackSelector));
          const before = operation.beforeSelector ? doc.querySelector(operation.beforeSelector) : null;
          if (element && parent) parent.insertBefore(element, before?.parentElement === parent ? before : null);
          return;
        }
        if (operation.action === 'add' && operation.html && !doc.querySelector(marker)) {
          const parent = (operation.parentSelector && doc.querySelector(operation.parentSelector)) || (operation.parentFallbackSelector && doc.querySelector(operation.parentFallbackSelector)) || doc.body;
          const template = doc.createElement('template');
          template.innerHTML = String(operation.html).trim();
          const element = template.content.firstElementChild;
          if (!element) return;
          element.dataset.mohajerCreated = operation.id;
          if (operation.position === 'first') parent.insertBefore(element, parent.firstChild); else parent.appendChild(element);
        }
      } catch (error) { console.warn('Structure operation skipped', error); }
    });
  };

  const applyAll = () => {
    if (!iframe?.contentDocument) return;
    const doc = iframe.contentDocument;
    try {
      Object.values(drafts).forEach(draft => applyDraft(draft, doc));
      applyStructure(doc);
      Object.values(drafts).forEach(draft => applyDraft(draft, doc));
    } catch (error) { console.warn('Preview apply failed', error); }
  };

  const selectElement = element => {
    if (!element || !element.ownerDocument) return;
    try {
      selected?.classList.remove('mohajer-selected');
      selected = element;
      selected.classList.add('mohajer-selected');
      const stableId = ensureStableId(element);
      const fallback = fallbackSelector(element);
      selectedKey = stableSelector(element);
      const type = elementType(element);
      element.dataset.editorType = type;

      $('selectedTitle').textContent = stableId;
      $('selectedKey').value = selectedKey;
      $('emptyInspector').classList.add('hidden');
      $('inspector').classList.remove('hidden');

      const computed = element.ownerDocument.defaultView.getComputedStyle(element);
      const set = (id, value) => { if ($(id)) $(id).value = value ?? ''; };
      set('fontSize', computed.fontSize); set('fontWeight', computed.fontWeight); set('lineHeight', computed.lineHeight); set('letterSpacing', computed.letterSpacing);
      set('textAlign', computed.textAlign); set('textTransform', computed.textTransform); set('textColor', hex(computed.color)); set('textColorText', hex(computed.color));
      set('bgColor', hex(computed.backgroundColor)); set('bgColorText', hex(computed.backgroundColor)); set('opacity', computed.opacity); set('margin', computed.margin); set('padding', computed.padding); set('gap', computed.gap);
      set('width', computed.width); set('height', computed.height); set('minWidth', computed.minWidth); set('maxWidth', computed.maxWidth); set('position', computed.position); set('zIndex', computed.zIndex);
      set('radius', computed.borderRadius); set('border', computed.border); set('shadow', computed.boxShadow);
      set('bgImage', computed.backgroundImage === 'none' ? '' : computed.backgroundImage.replace(/^url\(["']?|["']?\)$/g, ''));
      set('animation', computed.animationName === 'none' ? '' : computed.animationName); set('animationDuration', computed.animationDuration); set('animationDelay', computed.animationDelay);
      set('hoverScale', drafts[selectedKey]?.hover?.scale || '1');
      $('textValue').value = ['text','heading','paragraph','button'].includes(type) ? (element.innerText || element.textContent || '').trim() : '';
      $('linkValue').value = element.tagName === 'A' ? (element.getAttribute('href') || '') : (element.closest('a')?.getAttribute('href') || '');
      $('newTab').checked = (element.tagName === 'A' ? element.target : element.closest('a')?.target) === '_blank';
      const responsive = drafts[selectedKey]?.responsive?.[device] || {};
      set('responsiveFont', responsive.fontSize); set('responsiveWidth', responsive.width); set('responsiveMargin', responsive.margin); set('responsivePadding', responsive.padding);
      if (!drafts[selectedKey]) drafts[selectedKey] = { selector:selectedKey, stableId, fallbackSelector:fallback, type, content:$('textValue').value, styles:{}, responsive:{}, schemaVersion:7 };
    } catch (error) { showRuntimeError('انتخاب عنصر انجام نشد', error); }
  };

  const getStyles = () => {
    const styles = {};
    ['fontSize','fontWeight','lineHeight','letterSpacing','textAlign','textTransform','opacity','margin','padding','gap','width','height','minWidth','maxWidth','position','zIndex','border'].forEach(id => {
      if ($(id)?.value) styles[id] = $(id).value;
    });
    styles.borderRadius = $('radius')?.value || '';
    styles.boxShadow = $('shadow')?.value || '';
    styles.color = $('textColor')?.value || '';
    styles.backgroundColor = $('bgColor')?.value || '';
    const image = $('bgImage')?.value || '';
    if (image && /^https?:\/\//i.test(image)) {
      styles.backgroundImage = `url("${image.replace(/["\\]/g, '')}")`;
      styles.backgroundSize = 'cover';
      styles.backgroundPosition = 'center';
    }
    const animation = $('animation')?.value || '';
    if (animation) {
      styles.animationName = animation;
      styles.animationDuration = $('animationDuration')?.value || '600ms';
      styles.animationDelay = $('animationDelay')?.value || '0ms';
      styles.animationFillMode = 'both';
    }
    return styles;
  };

  const capture = () => {
    if (!selected) return notify('ابتدا یک عنصر را انتخاب کنید');
    pushUndo();
    const type = elementType(selected);
    const old = drafts[selectedKey] || {};
    drafts[selectedKey] = {
      ...old,
      selector:selectedKey,
      stableId:selected.dataset.mohajerEditorId,
      fallbackSelector:old.fallbackSelector || fallbackSelector(selected),
      type,
      content:type === 'image' ? (selected.currentSrc || selected.src || '') : $('textValue').value.replace(/\n/g, '<br>'),
      link:$('linkValue').value || '',
      newTab:$('newTab').checked,
      styles:{ ...(old.styles || {}), ...getStyles() },
      responsive:{ ...(old.responsive || {}), [device]:{ fontSize:$('responsiveFont').value, width:$('responsiveWidth').value, margin:$('responsiveMargin').value, padding:$('responsivePadding').value } },
      hover:{ scale:$('hoverScale').value || '1' },
      schemaVersion:7
    };
    applyAll();
    saveLocal();
    $('saveState').textContent = '● Draft آماده است';
    notify('تغییر در Draft اعمال شد');
  };

  const addElement = type => {
    if (!selected) return notify('ابتدا یک Section یا Container را انتخاب کنید');
    const doc = iframe?.contentDocument;
    if (!doc) return notify('پیش‌نمایش هنوز آماده نیست');
    pushUndo();
    const tags = { Heading:'h2', Paragraph:'p', Text:'div', Button:'button', Link:'a', Image:'img', Divider:'hr', List:'ul', Icon:'span', Video:'div', Gallery:'div', FAQ:'div', Table:'div', Card:'div', Badge:'span', Statistic:'div', Section:'section', Container:'div', Logo:'div', Navigation:'nav', Footer:'footer' };
    const element = doc.createElement(tags[type] || 'div');
    const id = uid();
    element.dataset.mohajerCreated = id;
    element.dataset.mohajerEditorId = id;
    element.dataset.editorType = type.toLowerCase();
    if (type === 'Image') { element.src='https://placehold.co/800x450?text=Image'; element.alt=''; }
    else if (type === 'Heading') element.textContent='عنوان جدید';
    else if (type === 'Paragraph') element.textContent='متن جدید';
    else if (type === 'Button') element.textContent='دکمه جدید';
    else if (type === 'Link') { element.href='#'; element.textContent='لینک جدید'; }
    else element.textContent=type;
    element.style.cssText='padding:12px;margin:8px;border:1px dashed #999;min-height:20px';
    selected.appendChild(element);
    const key = stableSelector(element);
    drafts[key] = { selector:key, stableId:id, fallbackSelector:key, type:elementType(element), content:element.tagName==='IMG'?element.src:element.textContent, styles:{padding:'12px',margin:'8px',border:'1px dashed #999'}, schemaVersion:7 };
    pageMeta.structure.push({ action:'add', id, parentSelector:stableSelector(selected), parentFallbackSelector:fallbackSelector(selected), html:element.outerHTML, position:'last', schemaVersion:1 });
    selectElement(element);
    saveLocal();
    notify(type + ' به Draft اضافه شد');
  };

  const duplicateSelected = () => {
    if (!selected) return notify('عنصری انتخاب نشده است');
    if (!selected.parentElement) return;
    pushUndo();
    const id = uid();
    const copy = selected.cloneNode(true);
    copy.dataset.mohajerCreated = id;
    copy.dataset.mohajerEditorId = id;
    selected.parentElement.insertBefore(copy, selected.nextSibling);
    const key = stableSelector(copy);
    const base = drafts[selectedKey] || { type:elementType(copy), content:copy.textContent, styles:{} };
    drafts[key] = { ...clone(base), selector:key, stableId:id, fallbackSelector:key, schemaVersion:7 };
    pageMeta.structure.push({ action:'add', id, parentSelector:stableSelector(selected.parentElement), parentFallbackSelector:fallbackSelector(selected.parentElement), html:copy.outerHTML, position:'last', schemaVersion:1 });
    selectElement(copy);
    saveLocal();
    notify('کپی در Draft ساخته شد');
  };

  const deleteSelected = () => {
    if (!selected) return;
    if (!confirm('این عنصر از Draft حذف شود؟')) return;
    pushUndo();
    const id = selected.dataset.mohajerCreated || uid();
    pageMeta.structure.push({ action:'delete', id, selector:selectedKey, fallbackSelector:drafts[selectedKey]?.fallbackSelector || fallbackSelector(selected), schemaVersion:1 });
    delete drafts[selectedKey];
    selected.remove();
    selected = null;
    selectedKey = '';
    $('inspector').classList.add('hidden');
    $('emptyInspector').classList.remove('hidden');
    saveLocal();
    notify('عنصر از Draft حذف شد');
  };

  const prepareIframe = () => {
    if (!iframe?.contentDocument) return;
    try {
      const doc = iframe.contentDocument;
      doc.getElementById('mohajer-editor-overlay')?.remove();
      if (!doc.head) return;
      const style = doc.createElement('style');
      style.id = 'mohajer-editor-overlay';
      style.textContent = '[data-key],[data-mohajer-editor-id],img,section,article,button,a,.product-card,.feature-item-new,.dept-card,.ss-product-card{cursor:pointer!important}[data-key]:hover,[data-mohajer-editor-id]:hover,img:hover,section:hover,article:hover,button:hover,a:hover,.product-card:hover,.feature-item-new:hover,.dept-card:hover,.ss-product-card:hover{outline:2px solid #3478f6!important;outline-offset:2px!important}.mohajer-selected{outline:3px solid #f2b941!important;outline-offset:3px!important}[data-mohajer-hover-scale]{transition:transform .2s ease}[data-mohajer-hover-scale]:hover{transform:scale(var(--mohajer-hover-scale,1.02))!important}';
      doc.head.appendChild(style);
      applyAll();
      if (!doc.__mohajerEditorBound) {
        doc.__mohajerEditorBound = true;
        doc.addEventListener('click', event => {
          const target = event.target;
          const element = target?.closest?.('[data-mohajer-editor-id],[data-key],img,.product-card,.feature-item-new,.dept-card,.ss-product-card,section,article,button,a');
          if (!element) return;
          event.preventDefault();
          event.stopPropagation();
          selectElement(element);
        }, true);
      }
      previewReady = true;
      notify('پیش‌نمایش آماده است');
    } catch (error) {
      previewReady = false;
      showRuntimeError('پیش‌نمایش سایت آماده نشد', error);
    }
  };

  const renderPages = () => {
    const box = $('leftContent');
    box.innerHTML = '';
    [['صفحه اصلی','/'],['Steel Billet','/products/steel-billet/'],['Steel Beam','/products/steel-beam/'],['Steel Pipe','/products/steel-pipe/'],['Rebar','/products/rebar/'],['Steel Plate','/products/steel-plate/'],['Steel Angle','/products/steel-angle/'],['Steel Channel','/products/steel-channel/'],['Steel Slab','/products/steel-slab/']].forEach(([name,path]) => {
      const button = document.createElement('button');
      button.className='page-item';
      button.innerHTML = `${name}<small>${path}</small>`;
      button.onclick = () => {
        pagePath = path;
        $('pageTitle').textContent = name;
        $('pagePath').textContent = path;
        if (path !== DEFAULT_PAGE) return notify('این نسخه فعلاً برای Steel Billet فعال است');
        iframe.src = '../../products/steel-billet/?editorPreview=1&editorCache=4';
        saveLocal();
      };
      box.append(button);
    });
  };

  const renderElements = () => {
    const box=$('leftContent');
    box.innerHTML='<div class="hint" style="padding:8px 12px">برای افزودن، ابتدا عنصر والد را در Preview انتخاب کنید.</div>';
    ['Section','Container','Heading','Paragraph','Text','Image','Button','Link','Icon','Card','Badge','Statistic','Table','List','Video','Gallery','FAQ','Divider','Logo','Navigation','Footer'].forEach(type => {
      const button=document.createElement('button'); button.className='page-item'; button.textContent='＋ '+type; button.onclick=()=>addElement(type); box.append(button);
    });
  };

  const renderMedia = () => {
    const box=$('leftContent');
    box.innerHTML='<div class="page-item"><b>Media Library</b><p class="hint">در این نسخه، تصویر با URL امن قابل جایگزینی است.</p></div>';
    const input=document.createElement('input'); input.type='url'; input.placeholder='https://...'; input.style.cssText='width:100%;margin-top:8px'; box.firstChild.append(input);
    const button=document.createElement('button'); button.className='page-item primary'; button.textContent='اعمال به Image انتخاب‌شده';
    button.onclick=()=>{ if(!selected||selected.tagName!=='IMG')return notify('یک Image انتخاب کنید'); if(!/^https?:\/\//i.test(input.value))return notify('URL معتبر نیست'); pushUndo(); selected.src=input.value; capture(); };
    box.firstChild.append(button);
  };

  const renderHistory = async () => {
    const box=$('leftContent'); box.innerHTML='<div class="page-item">در حال بارگذاری تاریخچه…</div>';
    if(!db){ box.innerHTML='<div class="page-item">تاریخچه آنلاین در دسترس نیست.</div>'; return; }
    try {
      const snapshot=await db.collection('siteVersions').orderBy('createdAt','desc').limit(30).get(); box.innerHTML='';
      snapshot.forEach(item=>{
        const value=item.data()||{}; const button=document.createElement('button'); button.className='page-item'; button.innerHTML=`<b>${value.versionId||item.id}</b><small>${value.page||''}</small>`;
        button.onclick=()=>{if(!confirm('این نسخه فقط به Draft برگردد؟'))return;pushUndo();drafts=clone(value.content||{});pageMeta=clone(value.meta||{seo:{},structure:[]});saveLocal();applyAll();notify('Rollback به Draft انجام شد');}; box.append(button);
      });
      if(!snapshot.size)box.innerHTML='<div class="page-item">تاریخچه‌ای وجود ندارد.</div>';
    } catch(error) { console.error(error); box.innerHTML='<div class="page-item">تاریخچه قابل دریافت نیست.</div>'; }
  };

  const renderSeo = () => {
    const box=$('leftContent'); box.innerHTML=''; const wrap=document.createElement('div'); wrap.className='page-item';
    wrap.innerHTML='<b>SEO Manager</b><p class="hint">SEO فقط در Draft ذخیره می‌شود و با Publish اعمال می‌شود.</p>';
    [['title','Title'],['description','Description'],['canonical','Canonical'],['robots','Robots'],['ogTitle','OG Title'],['ogDescription','OG Description'],['ogImage','OG Image']].forEach(([key,label])=>{
      const field=document.createElement('label'); field.textContent=label; const input=document.createElement('input'); input.value=pageMeta.seo?.[key]||''; input.onchange=()=>{pageMeta.seo={...(pageMeta.seo||{}),[key]:input.value};saveLocal();}; field.append(input); wrap.append(field);
    });
    const no=document.createElement('label'); no.className='check'; const checkbox=document.createElement('input'); checkbox.type='checkbox'; checkbox.checked=pageMeta.seo?.noindex===true; checkbox.onchange=()=>{pageMeta.seo={...(pageMeta.seo||{}),noindex:checkbox.checked,robots:checkbox.checked?'noindex,nofollow':(pageMeta.seo?.robots||'index,follow')};saveLocal();}; no.append(checkbox,document.createTextNode(' Noindex')); wrap.append(no); box.append(wrap);
  };

  const renderAi = () => {
    const box=$('leftContent'); box.innerHTML='<div class="page-item"><b>AI Design Assistant</b><p class="hint">AI فقط Context عنصر انتخاب‌شده را می‌گیرد؛ پیشنهاد باید Patch باشد و Publish مستقیم ممنوع است.</p></div>';
    if(!selected)return;
    const button=document.createElement('button'); button.className='page-item primary'; button.textContent='کپی Context امن';
    button.onclick=async()=>{const context={page:pagePath,elementId:selected.dataset.mohajerEditorId||null,type:elementType(selected),content:$('textValue').value,styles:drafts[selectedKey]?.styles||{},responsive:drafts[selectedKey]?.responsive||{},instruction:'Return proposal only. Never publish.'};try{await navigator.clipboard.writeText(JSON.stringify(context,null,2));notify('Context کپی شد');}catch{notify('Clipboard در این مرورگر در دسترس نیست');}};
    box.append(button);
  };

  const renderSettings = () => { $('leftContent').innerHTML='<div class="page-item"><b>Editor Guard</b><p class="hint">Draft و Published جدا هستند. Publish قبل از نوشتن نسخه جدید، Snapshot نسخه قبلی را می‌سازد.</p></div>'; };
  const navView = view => { $$('.nav').forEach(item=>item.classList.toggle('active',item.dataset.view===view)); ({pages:renderPages,elements:renderElements,media:renderMedia,history:renderHistory,seo:renderSeo,ai:renderAi,settings:renderSettings}[view]||renderSettings)(); };

  const saveRemote = async () => {
    if(!auth?.currentUser||!db)throw new Error('حساب مدیریت وارد نشده است');
    await db.collection('siteContent').doc('draft').set({content:drafts,meta:pageMeta,page:pagePath,updatedAt:firebase.firestore.FieldValue.serverTimestamp(),updatedBy:auth.currentUser.uid,schemaVersion:7});
  };

  const publish = async () => {
    if(!auth?.currentUser||!db)throw new Error('حساب مدیریت وارد نشده است');
    const live=await db.collection('siteContent').doc('published').get();
    const versionId='v-'+Date.now();
    await db.collection('siteVersions').doc(versionId).set({content:live.exists?(live.data().content||{}):{},meta:live.exists?(live.data().meta||{}):{},page:pagePath,versionId,createdAt:firebase.firestore.FieldValue.serverTimestamp(),createdBy:auth.currentUser.uid,source:'pre-publish',schemaVersion:7});
    await db.collection('siteContent').doc('published').set({content:drafts,meta:pageMeta,page:pagePath,updatedAt:firebase.firestore.FieldValue.serverTimestamp(),updatedBy:auth.currentUser.uid,versionId,schemaVersion:7});
  };

  const boot = async () => {
    if(booted)return;
    loadLocal();
    if(firebaseReady&&db&&auth?.currentUser){
      try {
        const snapshot=await db.collection('siteContent').doc('draft').get();
        if(snapshot.exists){
          const data=snapshot.data()||{};
          drafts={...(data.content||{}),...drafts};
          pageMeta={...(data.meta||{}),...pageMeta};
          if(!Array.isArray(pageMeta.structure))pageMeta.structure=[];
          if(!pageMeta.seo)pageMeta.seo={};
          pagePath=data.page||pagePath;
        }
      } catch(error) {
        console.warn('Online draft unavailable; local draft will be used',error);
        notify('Draft آنلاین در دسترس نبود؛ نسخه محلی استفاده شد.');
      }
    }
    $('pageTitle').textContent=pagePath==='/'?'صفحه اصلی':'Steel Billet';
    $('pagePath').textContent=pagePath;
    saveLocal();
    historyButtons();
    renderPages();
    booted=true;
    $('saveState').textContent='● آماده';
  };

  const unlockAfterBoot = async user => {
    if(!user){
      booted=false;
      $('app').classList.add('locked');
      $('loginGate').classList.remove('hidden');
      return;
    }
    // Critical fix: DO NOT hide the login gate until boot has completed.
    try {
      await boot();
      $('app').classList.remove('locked');
      $('loginGate').classList.add('hidden');
      setLoginMessage('');
      notify('پنل مدیریت آماده است');
    } catch(error) {
      $('app').classList.add('locked');
      $('loginGate').classList.remove('hidden');
      setLoginMessage('پنل نتوانست راه‌اندازی شود: ' + (error.message || 'خطای ناشناخته'));
      showRuntimeError('Boot failed',error);
    }
  };

  const wireUi = () => {
    iframe=$('preview');
    if(!iframe)throw new Error('Preview iframe not found');

    $('loginForm')?.addEventListener('submit',async event=>{
      event.preventDefault();
      const button=event.currentTarget.querySelector('button');
      button.disabled=true;
      setLoginMessage('در حال ورود…');
      try {
        if(!auth)throw new Error('Firebase Auth آماده نیست');
        await auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
        await auth.signInWithEmailAndPassword(ADMIN_EMAIL,$('adminPassword').value);
      } catch(error) {
        console.error(error);
        setLoginMessage(error.code==='auth/too-many-requests'?'تلاش زیاد بود؛ چند دقیقه بعد دوباره امتحان کنید.':'ورود ناموفق بود؛ رمز پنل قبلی را بررسی کنید.');
      } finally { button.disabled=false; }
    });

    auth.onAuthStateChanged(user=>{ unlockAfterBoot(user).catch(error=>showRuntimeError('Auth state failed',error)); });
    iframe.addEventListener('load',prepareIframe);
    qsa('.nav').forEach(item=>item.addEventListener('click',()=>navView(item.dataset.view)));
    qsa('.device').forEach(item=>item.addEventListener('click',()=>{device=item.dataset.device;qsa('.device').forEach(x=>x.classList.toggle('active',x===item));$('canvas').className='canvas '+device;applyAll();if(selected)selectElement(selected);}));
    $('applyBtn').onclick=capture;
    $('saveBtn').onclick=async()=>{try{await saveRemote();saveLocal();$('saveState').textContent='● Draft ذخیره شد';notify('Draft در Firestore ذخیره شد');}catch(error){console.error(error);notify('ذخیره Draft ناموفق بود');}};
    $('previewBtn').onclick=()=>{applyAll();notify(previewReady?'Preview به‌روزرسانی شد':'پیش‌نمایش هنوز آماده نیست');};
    $('openLive').onclick=()=>window.open('https://mohajer-steel.com/products/steel-billet/','_blank');
    $('publishBtn').onclick=()=>{if(typeof $('publishDialog').showModal==='function')$('publishDialog').showModal();};
    $('cancelPublish').onclick=()=>$('publishDialog').close();
    $('confirmPublish').onclick=async()=>{try{await saveRemote();await publish();$('publishDialog').close();notify('انتشار موفق بود');}catch(error){console.error(error);notify('انتشار ناموفق بود: '+(error.message||''));}};
    $('clearSelection').onclick=()=>{selected?.classList.remove('mohajer-selected');selected=null;selectedKey='';$('inspector').classList.add('hidden');$('emptyInspector').classList.remove('hidden');};
    $('duplicateBtn').onclick=duplicateSelected;
    $('deleteBtn').onclick=deleteSelected;
    $('undoBtn').onclick=()=>{if(!undo.length)return;redo.push(snapshotState());restore(undo.pop());};
    $('redoBtn').onclick=()=>{if(!redo.length)return;undo.push(snapshotState());restore(redo.pop());};
    ['textColor','textColorText'].forEach(id=>$(id)?.addEventListener('input',event=>{if(id==='textColor')$('textColorText').value=event.target.value;else $('textColor').value=event.target.value;}));
    ['bgColor','bgColorText'].forEach(id=>$(id)?.addEventListener('input',event=>{if(id==='bgColor')$('bgColorText').value=event.target.value;else $('bgColor').value=event.target.value;}));
    window.addEventListener('beforeunload',saveLocal);
  };

  const start = () => {
    try {
      if(!window.firebase)throw new Error('Firebase SDK لود نشده است.');
      if(!window.MOHAJER_FIREBASE_CONFIG)throw new Error('Firebase configuration لود نشده است.');
      const firebaseApp=firebase.apps.length?firebase.app():firebase.initializeApp(window.MOHAJER_FIREBASE_CONFIG);
      auth=firebaseApp.auth();
      db=firebaseApp.firestore();
      firebaseReady=true;
      wireUi();
    } catch(error) {
      // Keep the login UI visible instead of turning the whole page black.
      $('app').classList.add('locked');
      $('loginGate').classList.remove('hidden');
      setLoginMessage('راه‌اندازی سرویس مدیریت ناموفق بود.');
      showRuntimeError('Editor startup failed',error);
    }
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
