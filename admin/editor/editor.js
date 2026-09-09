(() => {
  'use strict';

  const byId = id => document.getElementById(id);
  const qsa = selector => Array.from(document.querySelectorAll(selector));
  const clone = value => JSON.parse(JSON.stringify(value));
  const ADMIN_EMAIL = 'amirgzva@gmail.com';
  const STORAGE = 'mohajer-editor-pro-draft-v8';
  const DEFAULT_PAGE = '/products/steel-billet/';

  let auth = null;
  let db = null;
  let iframe = null;
  let selected = null;
  let selectedKey = '';
  let device = 'desktop';
  let drafts = {};
  let undo = [];
  let redo = [];
  let pagePath = DEFAULT_PAGE;
  let pageMeta = { seo: {}, structure: [], pages: {} };
  let booted = false;

  const gate = byId('loginGate');
  const app = byId('app');
  const loginForm = byId('loginForm');
  const password = byId('adminPassword');
  const loginError = byId('loginError');
  const toast = byId('toast');

  const notify = message => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(notify.timer);
    notify.timer = setTimeout(() => toast.classList.remove('show'), 3000);
  };

  const showFatal = (message, error) => {
    console.error('[Mohajer Editor]', error || message);
    let box = byId('editorFatal');
    if (!box) {
      box = document.createElement('div');
      box.id = 'editorFatal';
      box.style.cssText = 'position:fixed;inset:0;z-index:99999;display:grid;place-items:center;background:#070d15;color:#fff;padding:24px;font-family:Vazirmatn,Tahoma,sans-serif;direction:rtl';
      document.body.appendChild(box);
    }
    const detail = error && (error.message || String(error));
    box.innerHTML = '<div style="width:min(720px,100%);background:#0d1723;border:1px solid #ffffff20;border-radius:18px;padding:28px;box-shadow:0 30px 100px #0008"><h2 style="margin:0 0 12px">خطا در باز کردن پنل ویرایش</h2><p style="color:#b9c8d6;line-height:1.9;margin:0 0 12px">پنل متوقف نشده است؛ یک خطای فنی هنگام راه‌اندازی رخ داده و به‌جای صفحه سیاه، جزئیات خطا نمایش داده می‌شود.</p><div style="background:#07101a;border-radius:10px;padding:12px;color:#ffb0b0;direction:ltr;text-align:left;white-space:pre-wrap;overflow:auto;max-height:180px">' + String(detail || message || 'Unknown error').replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c])) + '</div><button onclick="location.reload()" style="margin-top:16px;padding:10px 16px;border:0;border-radius:9px;background:#f4c65e;color:#111;font-weight:800;cursor:pointer">تلاش مجدد</button></div>';
  };

  window.addEventListener('error', event => {
    if (event && event.error) showFatal('JavaScript error', event.error);
  });
  window.addEventListener('unhandledrejection', event => {
    const reason = event && event.reason;
    if (reason) showFatal('Unhandled promise rejection', reason);
  });

  const uid = () => `me-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
  const esc = value => {
    const text = String(value);
    return window.CSS && typeof CSS.escape === 'function' ? CSS.escape(text) : text.replace(/[^a-zA-Z0-9_-]/g, ch => `\\${ch}`);
  };
  const hex = value => {
    const values = String(value || '').match(/\d+/g);
    return values ? `#${values.slice(0, 3).map(v => Number(v).toString(16).padStart(2, '0')).join('')}` : '#000000';
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
  const toCss = key => styleMap[key] || String(key).replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);

  const saveLocal = () => {
    try { localStorage.setItem(STORAGE, JSON.stringify({ drafts, pageMeta, pagePath })); } catch (error) { console.warn('Local draft unavailable', error); }
  };
  const loadLocal = () => {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE) || '{}');
      drafts = value.drafts || {};
      pageMeta = value.pageMeta || { seo: {}, structure: [], pages: {} };
      pagePath = value.pagePath || DEFAULT_PAGE;
    } catch (error) {
      drafts = {};
      pageMeta = { seo: {}, structure: [], pages: {} };
      pagePath = DEFAULT_PAGE;
    }
  };
  const historyButtons = () => {
    const undoBtn = byId('undoBtn');
    const redoBtn = byId('redoBtn');
    if (undoBtn) undoBtn.disabled = !undo.length;
    if (redoBtn) redoBtn.disabled = !redo.length;
  };
  const pushUndo = () => {
    undo.push(clone({ drafts, pageMeta }));
    if (undo.length > 50) undo.shift();
    redo = [];
    historyButtons();
  };

  const safeText = (element, value) => {
    element.replaceChildren();
    String(value ?? '').split(/<br\s*\/?\s*>/i).forEach((line, index) => {
      if (index) element.append(document.createElement('br'));
      element.append(document.createTextNode(line));
    });
  };
  const fallbackSelector = element => {
    if (!element) return '';
    if (element.dataset.key) return `[data-key="${esc(element.dataset.key)}"]`;
    if (element.id) return `#${esc(element.id)}`;
    const parts = [];
    let node = element;
    while (node && node !== node.ownerDocument.body && parts.length < 10) {
      let part = node.tagName.toLowerCase();
      const useful = Array.from(node.classList || []).find(name => !name.startsWith('admin-'));
      if (useful) part += `.${esc(useful)}`;
      if (node.parentElement) {
        const siblings = Array.from(node.parentElement.children).filter(item => item.tagName === node.tagName);
        if (siblings.length > 1) part += `:nth-of-type(${siblings.indexOf(node) + 1})`;
      }
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
    try { element = draft.selector ? doc.querySelector(draft.selector) : null; } catch (_) {}
    if (!element && draft.fallbackSelector) {
      try { element = doc.querySelector(draft.fallbackSelector); } catch (_) {}
      if (element && draft.stableId) element.dataset.mohajerEditorId = draft.stableId;
    }
    return element;
  };

  const getStyles = () => {
    const fields = ['fontSize','fontWeight','lineHeight','letterSpacing','textAlign','textTransform','opacity','margin','padding','gap','width','height','minWidth','maxWidth','position','zIndex','border'];
    const styles = {};
    fields.forEach(id => { const input = byId(id); if (input && input.value) styles[id] = input.value; });
    styles.borderRadius = byId('radius')?.value || '';
    styles.boxShadow = byId('shadow')?.value || '';
    styles.color = byId('textColor')?.value || '';
    styles.backgroundColor = byId('bgColor')?.value || '';
    const background = byId('bgImage')?.value || '';
    if (background) {
      styles.backgroundImage = `url("${background}")`;
      styles.backgroundSize = 'cover';
      styles.backgroundPosition = 'center';
    }
    const animation = byId('animation')?.value || '';
    if (animation) {
      styles.animationName = animation;
      styles.animationDuration = byId('animationDuration')?.value || '600ms';
      styles.animationDelay = byId('animationDelay')?.value || '0ms';
      styles.animationFillMode = 'both';
    }
    return styles;
  };

  const applyDraft = (draft, doc) => {
    const element = resolveElement(draft, doc);
    if (!element) return;
    if (draft.type === 'image' && draft.content) element.src = draft.content;
    else if (['text','link','heading','paragraph','button'].includes(draft.type)) safeText(element, draft.content);
    Object.entries(draft.styles || {}).forEach(([key, value]) => {
      if (value !== '' && value != null) {
        try { element.style.setProperty(toCss(key), String(value)); } catch (_) {}
      }
    });
    Object.entries(draft.responsive?.[device] || {}).forEach(([key, value]) => {
      if (value) { try { element.style.setProperty(toCss(key), String(value)); } catch (_) {} }
    });
    if (draft.hidden) element.style.setProperty('display', 'none', 'important');
    if (draft.hover?.scale && draft.hover.scale !== '1') {
      element.style.setProperty('--mohajer-hover-scale', draft.hover.scale);
      element.dataset.mohajerHoverScale = draft.hover.scale;
    }
    if (draft.link && (element.tagName === 'A' || element.closest('a')) && /^(https?:\/\/|\/)/i.test(draft.link)) {
      const link = element.tagName === 'A' ? element : element.closest('a');
      link.href = draft.link;
      if (draft.newTab) link.target = '_blank'; else link.removeAttribute('target');
    }
  };

  const applyStructure = doc => {
    (pageMeta.structure || []).forEach(operation => {
      if (!operation?.id) return;
      const marker = `[data-mohajer-created="${esc(operation.id)}"]`;
      try {
        if (operation.action === 'delete') {
          const element = doc.querySelector(marker) || doc.querySelector(operation.selector || operation.fallbackSelector || '');
          element?.remove();
          return;
        }
        if (operation.action === 'move') {
          const element = doc.querySelector(operation.selector || marker);
          const parent = doc.querySelector(operation.parentSelector || operation.parentFallbackSelector || '');
          const before = operation.beforeSelector ? doc.querySelector(operation.beforeSelector) : null;
          if (element && parent) parent.insertBefore(element, before && before.parentElement === parent ? before : null);
          return;
        }
        if (operation.action === 'add' && operation.html && !doc.querySelector(marker)) {
          const parent = doc.querySelector(operation.parentSelector || operation.parentFallbackSelector || '') || doc.body;
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
    if (!iframe || !iframe.contentDocument) return;
    const doc = iframe.contentDocument;
    Object.values(drafts).forEach(draft => applyDraft(draft, doc));
    applyStructure(doc);
    Object.values(drafts).forEach(draft => applyDraft(draft, doc));
  };

  const select = element => {
    if (!element) return;
    selected?.classList.remove('mohajer-selected');
    selected = element;
    selected.classList.add('mohajer-selected');
    const fallback = fallbackSelector(element);
    const stableId = ensureStableId(element);
    selectedKey = stableSelector(element);
    const type = elementType(element);
    element.dataset.editorType = type;
    byId('selectedTitle').textContent = stableId;
    byId('selectedKey').value = selectedKey;
    byId('emptyInspector').classList.add('hidden');
    byId('inspector').classList.remove('hidden');
    const computed = getComputedStyle(element);
    const set = (id, value) => { const input = byId(id); if (input) input.value = value ?? ''; };
    set('fontSize', computed.fontSize); set('fontWeight', computed.fontWeight); set('lineHeight', computed.lineHeight); set('letterSpacing', computed.letterSpacing);
    set('textAlign', computed.textAlign); set('textTransform', computed.textTransform); set('textColor', hex(computed.color)); set('textColorText', hex(computed.color));
    set('bgColor', hex(computed.backgroundColor)); set('bgColorText', hex(computed.backgroundColor)); set('opacity', computed.opacity); set('margin', computed.margin); set('padding', computed.padding);
    set('gap', computed.gap); set('width', computed.width); set('height', computed.height); set('minWidth', computed.minWidth); set('maxWidth', computed.maxWidth); set('position', computed.position); set('zIndex', computed.zIndex);
    set('radius', computed.borderRadius); set('border', computed.border); set('shadow', computed.boxShadow);
    set('bgImage', computed.backgroundImage === 'none' ? '' : computed.backgroundImage.replace(/^url\(["']?|["']?\)$/g, ''));
    set('animation', computed.animationName === 'none' ? '' : computed.animationName); set('animationDuration', computed.animationDuration); set('animationDelay', computed.animationDelay);
    set('hoverScale', drafts[selectedKey]?.hover?.scale || '1');
    byId('textValue').value = ['text','heading','paragraph','button'].includes(type) ? (element.innerText || element.textContent || '').trim() : '';
    byId('linkValue').value = element.tagName === 'A' ? (element.getAttribute('href') || '') : (element.closest('a')?.getAttribute('href') || '');
    byId('newTab').checked = (element.tagName === 'A' ? element.target : element.closest('a')?.target) === '_blank';
    const responsive = drafts[selectedKey]?.responsive?.[device] || {};
    set('responsiveFont', responsive.fontSize); set('responsiveWidth', responsive.width); set('responsiveMargin', responsive.margin); set('responsivePadding', responsive.padding);
    if (!drafts[selectedKey]) drafts[selectedKey] = { selector: selectedKey, stableId, fallbackSelector: fallback, type, content: byId('textValue').value, styles: {}, schemaVersion: 6 };
  };

  const prepareIframe = () => {
    if (!iframe || !iframe.contentDocument) return;
    try {
      const doc = iframe.contentDocument;
      doc.getElementById('mohajer-editor-overlay')?.remove();
      if (!doc.head) return;
      const style = doc.createElement('style');
      style.id = 'mohajer-editor-overlay';
      style.textContent = '[data-key],[data-mohajer-editor-id],img,section,article,button,a,.product-card,.feature-item-new,.dept-card,.ss-product-card{cursor:pointer!important}[data-key]:hover,[data-mohajer-editor-id]:hover,img:hover,section:hover,article:hover,button:hover,a:hover,.product-card:hover,.feature-item-new:hover,.dept-card:hover,.ss-product-card:hover{outline:2px solid #3478f6!important;outline-offset:2px!important}.mohajer-selected{outline:3px solid #f2b941!important;outline-offset:3px!important}[data-mohajer-hover-scale]{transition:transform .2s ease}[data-mohajer-hover-scale]:hover{transform:scale(var(--mohajer-hover-scale,1.02))!important}';
      doc.head.appendChild(style);
      applyAll();
      doc.addEventListener('click', event => {
        const element = event.target.closest('[data-mohajer-editor-id],[data-key],img,.product-card,.feature-item-new,.dept-card,.ss-product-card,section,article,button,a');
        if (!element) return;
        event.preventDefault(); event.stopPropagation(); select(element);
      }, true);
      doc.addEventListener('dragstart', event => {
        const element = event.target.closest('[data-mohajer-editor-id],[data-key],section,article,.product-card,.ss-product-card');
        if (!element || !event.dataTransfer) return;
        ensureStableId(element);
        event.dataTransfer.setData('text/mohajer-editor-id', element.dataset.mohajerEditorId);
        event.dataTransfer.setData('text/plain', fallbackSelector(element));
      }, true);
      doc.addEventListener('dragover', event => { if (event.target.closest('[data-mohajer-editor-id],[data-key],section,article')) event.preventDefault(); }, true);
      doc.addEventListener('drop', event => {
        const target = event.target.closest('[data-mohajer-editor-id],[data-key],section,article');
        if (!target || !event.dataTransfer) return;
        const id = event.dataTransfer.getData('text/mohajer-editor-id');
        if (!id || target.dataset.mohajerEditorId === id) return;
        const moved = doc.querySelector(`[data-mohajer-editor-id="${esc(id)}"]`);
        if (!moved || moved === target || moved.contains(target)) return;
        event.preventDefault(); pushUndo(); target.parentElement.insertBefore(moved, target);
        pageMeta.structure.push({ action:'move', id, selector:`[data-mohajer-editor-id="${esc(id)}"]`, fallbackSelector:event.dataTransfer.getData('text/plain'), parentSelector:fallbackSelector(target.parentElement), parentFallbackSelector:fallbackSelector(target.parentElement), beforeSelector:fallbackSelector(target), schemaVersion:1 });
        saveLocal(); notify('ترتیب عنصر در Draft تغییر کرد');
      }, true);
    } catch (error) {
      console.warn('Preview preparation failed', error);
      notify('پیش‌نمایش بارگذاری شد، اما ابزار انتخاب هنوز آماده نیست.');
    }
  };

  const capture = () => {
    if (!selected) return notify('ابتدا یک عنصر را انتخاب کنید');
    pushUndo();
    const type = elementType(selected);
    const old = drafts[selectedKey] || {};
    drafts[selectedKey] = {
      ...old,
      selector: selectedKey,
      stableId: selected.dataset.mohajerEditorId,
      fallbackSelector: old.fallbackSelector || fallbackSelector(selected),
      type,
      content: type === 'image' ? (selected.currentSrc || selected.src || '') : byId('textValue').value.replace(/\n/g, '<br>'),
      link: byId('linkValue').value || '', newTab: byId('newTab').checked,
      styles: { ...(old.styles || {}), ...getStyles() },
      responsive: { ...(old.responsive || {}), [device]: { fontSize:byId('responsiveFont').value, width:byId('responsiveWidth').value, margin:byId('responsiveMargin').value, padding:byId('responsivePadding').value } },
      hover: { scale: byId('hoverScale').value || '1' }, schemaVersion: 6
    };
    applyAll(); saveLocal(); byId('saveState').textContent = '● Draft آماده است'; notify('تغییر در Draft اعمال شد');
  };

  const addElement = type => {
    if (!selected) return notify('ابتدا یک Section یا Container را انتخاب کنید');
    const doc = iframe?.contentDocument; if (!doc) return notify('پیش‌نمایش هنوز آماده نیست');
    pushUndo();
    const tags = {Heading:'h2',Paragraph:'p',Text:'div',Button:'button',Link:'a',Image:'img',Divider:'hr',List:'ul',Icon:'span',Video:'div',Gallery:'div',FAQ:'div',Table:'div',Card:'div',Badge:'span',Statistic:'div',Section:'section',Container:'div',Logo:'div',Navigation:'nav',Footer:'footer'};
    const element = doc.createElement(tags[type] || 'div');
    const id = uid(); element.dataset.mohajerCreated = id; element.dataset.mohajerEditorId = id; element.dataset.editorType = elementType(element);
    if (type === 'Image') { element.src='https://placehold.co/800x450?text=Image'; element.alt=''; }
    else if (type === 'Heading') element.textContent='عنوان جدید'; else if (type === 'Paragraph') element.textContent='متن جدید'; else if (type === 'Button') element.textContent='دکمه جدید'; else if (type === 'Link') { element.href='#'; element.textContent='لینک جدید'; } else element.textContent=type;
    element.style.cssText='padding:12px;margin:8px;border:1px dashed #999;min-height:20px'; selected.appendChild(element);
    const key=`[data-mohajer-editor-id="${esc(id)}"]`;
    drafts[key]={selector:key,stableId:id,fallbackSelector:key,type:elementType(element),content:element.tagName==='IMG'?element.src:element.textContent,styles:{padding:'12px',margin:'8px',border:'1px dashed #999'},schemaVersion:6};
    pageMeta.structure.push({action:'add',id,parentSelector:stableSelector(selected),parentFallbackSelector:fallbackSelector(selected),html:element.outerHTML,position:'last',schemaVersion:1});
    select(element); saveLocal(); notify(`${type} به Draft اضافه شد`);
  };

  const duplicateSelected = () => {
    if (!selected) return notify('عنصری انتخاب نشده است');
    pushUndo(); const id=uid(); const copy=selected.cloneNode(true); copy.dataset.mohajerCreated=id; copy.dataset.mohajerEditorId=id; selected.parentElement.insertBefore(copy, selected.nextSibling);
    const key=`[data-mohajer-editor-id="${esc(id)}"]`; const base=drafts[selectedKey] || {type:elementType(copy),content:copy.textContent,styles:{}};
    drafts[key]={...clone(base),selector:key,stableId:id,fallbackSelector:key,schemaVersion:6};
    pageMeta.structure.push({action:'add',id,parentSelector:stableSelector(selected.parentElement),parentFallbackSelector:fallbackSelector(selected.parentElement),html:copy.outerHTML,position:'last',schemaVersion:1});
    select(copy); saveLocal(); notify('کپی پایدار در Draft ساخته شد');
  };
  const deleteSelected = () => {
    if (!selected) return;
    if (!confirm('این عنصر از Draft حذف شود؟')) return;
    pushUndo(); const id=selected.dataset.mohajerCreated || uid();
    pageMeta.structure.push({action:'delete',id,selector:selectedKey,fallbackSelector:drafts[selectedKey]?.fallbackSelector || fallbackSelector(selected),schemaVersion:1});
    delete drafts[selectedKey]; selected.remove(); selected=null; selectedKey=''; byId('inspector').classList.add('hidden'); byId('emptyInspector').classList.remove('hidden'); saveLocal(); notify('عنصر از Draft حذف شد');
  };

  const renderPages = () => {
    const box=byId('leftContent'); box.innerHTML='';
    [['صفحه اصلی','/'],['Steel Billet','/products/steel-billet/'],['Steel Beam','/products/steel-beam/'],['Steel Pipe','/products/steel-pipe/'],['Rebar','/products/rebar/'],['Steel Plate','/products/steel-plate/'],['Steel Angle','/products/steel-angle/'],['Steel Channel','/products/steel-channel/'],['Steel Slab','/products/steel-slab/']].forEach(([name,path])=>{
      const button=document.createElement('button'); button.className='page-item'; button.innerHTML=`${name}<small>${path}</small>`;
      button.onclick=()=>{ pagePath=path; byId('pageTitle').textContent=name; byId('pagePath').textContent=path; if(path!==DEFAULT_PAGE){notify('این نسخه فعلاً برای Steel Billet فعال است'); return;} iframe.src='../../products/steel-billet/?editorPreview=1'; saveLocal(); };
      box.append(button);
    });
  };
  const renderElements = () => {
    const box=byId('leftContent'); box.innerHTML='<div class="hint" style="padding:8px 12px">برای افزودن، ابتدا عنصر والد را در Preview انتخاب کنید.</div>';
    ['Section','Container','Heading','Paragraph','Text','Image','Button','Link','Icon','Card','Badge','Statistic','Table','List','Video','Gallery','FAQ','Divider','Logo','Navigation','Footer'].forEach(type=>{const button=document.createElement('button');button.className='page-item';button.textContent='＋ '+type;button.onclick=()=>addElement(type);box.append(button);});
  };
  const renderMedia = () => {
    const box=byId('leftContent'); box.innerHTML='<div class="page-item"><b>Media Library</b><p class="hint">در این نسخه، تصویر از URL امن انتخاب می‌شود.</p></div>';
    const input=document.createElement('input'); input.type='url'; input.placeholder='https://...'; input.style.cssText='width:100%;margin-top:8px'; box.firstChild.append(input);
    const button=document.createElement('button'); button.className='page-item primary'; button.textContent='اعمال به Image انتخاب‌شده'; button.onclick=()=>{if(!selected||selected.tagName!=='IMG')return notify('یک Image انتخاب کنید');if(!/^https?:\/\//i.test(input.value))return notify('URL معتبر نیست');pushUndo();selected.src=input.value;capture();}; box.firstChild.append(button);
  };
  const renderHistory = async () => {
    const box=byId('leftContent'); box.innerHTML='<div class="page-item">در حال بارگذاری تاریخچه…</div>';
    if (!db) return;
    try {
      const snapshot=await db.collection('siteVersions').orderBy('createdAt','desc').limit(30).get(); box.innerHTML='';
      snapshot.forEach(doc=>{const value=doc.data()||{},button=document.createElement('button');button.className='page-item';button.innerHTML=`<b>${value.versionId||doc.id}</b><small>${value.page||''}</small>`;button.onclick=()=>{if(!confirm('این نسخه فقط به Draft برگردد؟'))return;pushUndo();drafts=clone(value.content||{});pageMeta=clone(value.meta||{seo:{},structure:[]});saveLocal();applyAll();notify('Rollback به Draft انجام شد');};box.append(button);});
      if(!snapshot.size)box.innerHTML='<div class="page-item">تاریخچه‌ای وجود ندارد.</div>';
    } catch(error) { console.error(error); box.innerHTML='<div class="page-item">تاریخچه قابل دریافت نیست.</div>'; }
  };
  const renderSeo = () => {
    const box=byId('leftContent'); box.innerHTML=''; const wrap=document.createElement('div'); wrap.className='page-item';
    wrap.innerHTML='<b>SEO Manager</b><p class="hint">SEO فقط در Draft ذخیره می‌شود و با Publish اعمال می‌شود.</p>';
    [['title','Title'],['description','Description'],['canonical','Canonical'],['robots','Robots'],['ogTitle','OG Title'],['ogDescription','OG Description'],['ogImage','OG Image']].forEach(([key,label])=>{const field=document.createElement('label');field.textContent=label;const input=document.createElement('input');input.value=pageMeta.seo?.[key]||'';input.onchange=()=>{pageMeta.seo={...(pageMeta.seo||{}),[key]:input.value};saveLocal();};field.append(input);wrap.append(field);});
    const no=document.createElement('label'); no.className='check'; const checkbox=document.createElement('input'); checkbox.type='checkbox'; checkbox.checked=pageMeta.seo?.noindex===true; checkbox.onchange=()=>{pageMeta.seo={...(pageMeta.seo||{}),noindex:checkbox.checked,robots:checkbox.checked?'noindex,nofollow':(pageMeta.seo?.robots||'index,follow')};saveLocal();}; no.append(checkbox,document.createTextNode(' Noindex')); wrap.append(no); box.append(wrap);
  };
  const renderAi = () => {
    const box=byId('leftContent'); box.innerHTML='<div class="page-item"><b>AI Design Assistant</b><p class="hint">AI فقط Context عنصر انتخاب‌شده را می‌گیرد؛ پیشنهاد باید Patch باشد و Publish مستقیم ممنوع است.</p></div>';
    if(!selected)return;
    const button=document.createElement('button'); button.className='page-item primary'; button.textContent='کپی Context امن'; button.onclick=async()=>{const context={page:pagePath,elementId:selected.dataset.mohajerEditorId||null,type:elementType(selected),content:byId('textValue').value,styles:drafts[selectedKey]?.styles||{},responsive:drafts[selectedKey]?.responsive||{},instruction:'Return proposal only. Never publish.'};try{await navigator.clipboard.writeText(JSON.stringify(context,null,2));notify('Context کپی شد');}catch{notify('Clipboard در این مرورگر در دسترس نیست');}}; box.append(button);
  };
  const renderSettings = () => { byId('leftContent').innerHTML='<div class="page-item"><b>Editor Guard</b><p class="hint">Draft و Published جدا هستند. Publish قبل از نوشتن نسخه جدید، Snapshot نسخه قبلی را می‌سازد.</p></div>'; };
  const navView = view => { qsa('.nav').forEach(item=>item.classList.toggle('active',item.dataset.view===view)); ({pages:renderPages,elements:renderElements,media:renderMedia,history:renderHistory,seo:renderSeo,ai:renderAi,settings:renderSettings}[view]||renderSettings)(); };

  const saveRemote = async () => {
    if (!auth?.currentUser || !db) throw new Error('not authenticated');
    await db.collection('siteContent').doc('draft').set({content:drafts,meta:pageMeta,page:pagePath,updatedAt:firebase.firestore.FieldValue.serverTimestamp(),updatedBy:auth.currentUser.uid,schemaVersion:6});
  };
  const publish = async () => {
    if (!auth?.currentUser || !db) throw new Error('not authenticated');
    const live=await db.collection('siteContent').doc('published').get(); const versionId='v-'+Date.now();
    await db.collection('siteVersions').doc(versionId).set({content:live.exists?(live.data().content||{}):{},meta:live.exists?(live.data().meta||{}):{},page:pagePath,versionId,createdAt:firebase.firestore.FieldValue.serverTimestamp(),createdBy:auth.currentUser.uid,source:'pre-publish',schemaVersion:6});
    await db.collection('siteContent').doc('published').set({content:drafts,meta:pageMeta,page:pagePath,updatedAt:firebase.firestore.FieldValue.serverTimestamp(),updatedBy:auth.currentUser.uid,versionId,schemaVersion:6});
  };

  const boot = async () => {
    if (booted) return; booted=true;
    try {
      loadLocal();
      const snapshot=await db.collection('siteContent').doc('draft').get();
      if(snapshot.exists){const data=snapshot.data()||{};drafts={...(data.content||{}),...drafts};pageMeta={...pageMeta,...(data.meta||{})};pagePath=data.page||pagePath;}
    } catch(error) {
      console.warn('Draft could not be loaded; local draft will be used.', error);
      notify('Draft آنلاین در دسترس نبود؛ پنل با نسخه محلی باز شد.');
    }
    byId('pageTitle').textContent='Steel Billet'; byId('pagePath').textContent=pagePath; saveLocal(); historyButtons(); renderPages();
    byId('saveState').textContent='● آماده';
  };

  const wireUi = () => {
    iframe = byId('preview');
    if (!iframe) throw new Error('Preview iframe not found');
    loginForm?.addEventListener('submit', async event => {
      event.preventDefault();
      const button=event.currentTarget.querySelector('button'); button.disabled=true; loginError.textContent='در حال ورود…';
      try {
        await auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
        await auth.signInWithEmailAndPassword(ADMIN_EMAIL, password.value);
      } catch(error) {
        console.error(error);
        loginError.textContent = error.code==='auth/too-many-requests' ? 'تلاش زیاد بود؛ چند دقیقه بعد دوباره امتحان کنید.' : 'ورود ناموفق بود؛ رمز پنل قبلی را بررسی کنید.';
      } finally { button.disabled=false; }
    });
    auth.onAuthStateChanged(async user => {
      try {
        gate.classList.toggle('hidden', !user);
        app.classList.toggle('locked', !user);
        if (user) await boot();
      } catch(error) { showFatal('Auth/boot failed', error); }
    });
    iframe.addEventListener('load', prepareIframe);
    qsa('.nav').forEach(item=>item.addEventListener('click',()=>navView(item.dataset.view)));
    qsa('.device').forEach(item=>item.addEventListener('click',()=>{device=item.dataset.device;qsa('.device').forEach(x=>x.classList.toggle('active',x===item));byId('canvas').className='canvas '+device;applyAll();if(selected)select(selected);}));
    byId('applyBtn').onclick=capture;
    byId('saveBtn').onclick=async()=>{try{await saveRemote();saveLocal();byId('saveState').textContent='● Draft ذخیره شد';notify('Draft در Firestore ذخیره شد');}catch(error){console.error(error);notify('ذخیره Draft ناموفق بود');}};
    byId('previewBtn').onclick=()=>{applyAll();notify('Preview به‌روزرسانی شد');};
    byId('openLive').onclick=()=>window.open('https://mohajer-steel.com/products/steel-billet/','_blank');
    byId('publishBtn').onclick=()=>byId('publishDialog').showModal();
    byId('cancelPublish').onclick=()=>byId('publishDialog').close();
    byId('confirmPublish').onclick=async()=>{try{await saveRemote();await publish();byId('publishDialog').close();notify('انتشار موفق بود');}catch(error){console.error(error);notify('انتشار ناموفق بود');}};
    byId('clearSelection').onclick=()=>{selected?.classList.remove('mohajer-selected');selected=null;selectedKey='';byId('inspector').classList.add('hidden');byId('emptyInspector').classList.remove('hidden');};
    byId('duplicateBtn').onclick=duplicateSelected; byId('deleteBtn').onclick=deleteSelected;
    byId('undoBtn').onclick=()=>{if(!undo.length)return;redo.push(clone({drafts,pageMeta}));const snapshot=undo.pop();drafts=clone(snapshot.drafts||{});pageMeta=clone(snapshot.pageMeta||{seo:{},structure:[]});saveLocal();applyAll();historyButtons();};
    byId('redoBtn').onclick=()=>{if(!redo.length)return;undo.push(clone({drafts,pageMeta}));const snapshot=redo.pop();drafts=clone(snapshot.drafts||{});pageMeta=clone(snapshot.pageMeta||{seo:{},structure:[]});saveLocal();applyAll();historyButtons();};
    ['textColor','textColorText'].forEach(id=>byId(id)?.addEventListener('input',event=>{if(id==='textColor')byId('textColorText').value=event.target.value;else byId('textColor').value=event.target.value;}));
    ['bgColor','bgColorText'].forEach(id=>byId(id)?.addEventListener('input',event=>{if(id==='bgColor')byId('bgColorText').value=event.target.value;else byId('bgColor').value=event.target.value;}));
    window.addEventListener('beforeunload',saveLocal);
  };

  const start = () => {
    try {
      if (!window.firebase) throw new Error('Firebase SDK did not load. Check network access to www.gstatic.com.');
      if (!window.MOHAJER_FIREBASE_CONFIG) throw new Error('Firebase configuration did not load.');
      const firebaseApp = firebase.apps.length ? firebase.app() : firebase.initializeApp(window.MOHAJER_FIREBASE_CONFIG);
      auth = firebaseApp.auth();
      db = firebaseApp.firestore();
      wireUi();
    } catch(error) {
      showFatal('Editor startup failed', error);
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once:true }); else start();
})();
