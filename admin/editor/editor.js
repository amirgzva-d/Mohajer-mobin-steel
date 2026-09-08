(() => {
  'use strict';

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const clone = value => JSON.parse(JSON.stringify(value));
  const firebaseApp = firebase.apps.length ? firebase.app() : firebase.initializeApp(window.MOHAJER_FIREBASE_CONFIG);
  const auth = firebaseApp.auth();
  const db = firebaseApp.firestore();
  const iframe = $('#preview');
  const toast = $('#toast');
  const STORAGE = 'mohajer-editor-pro-draft-v7';
  const ADMIN_EMAIL = 'amirgzva@gmail.com';

  let drafts = {};
  let selected = null;
  let selectedKey = '';
  let device = 'desktop';
  let undo = [];
  let redo = [];
  let pagePath = '/products/steel-billet/';
  let pageMeta = { seo: {}, structure: [], pages: {} };

  const notify = message => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(notify.timer);
    notify.timer = setTimeout(() => toast.classList.remove('show'), 2600);
  };
  const uid = () => `me-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
  const esc = value => CSS.escape(String(value));
  const cssName = property => String(property).replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
  const styleMap = {
    fontSize: 'font-size', fontWeight: 'font-weight', lineHeight: 'line-height', letterSpacing: 'letter-spacing',
    textAlign: 'text-align', textTransform: 'text-transform', opacity: 'opacity', margin: 'margin', padding: 'padding',
    gap: 'gap', width: 'width', height: 'height', minWidth: 'min-width', maxWidth: 'max-width', position: 'position',
    zIndex: 'z-index', border: 'border', borderRadius: 'border-radius', boxShadow: 'box-shadow', color: 'color',
    backgroundColor: 'background-color', backgroundImage: 'background-image', backgroundSize: 'background-size',
    backgroundPosition: 'background-position', animationName: 'animation-name', animationDuration: 'animation-duration',
    animationDelay: 'animation-delay', animationFillMode: 'animation-fill-mode'
  };
  const toCss = key => styleMap[key] || cssName(key);
  const safeText = (element, value) => {
    element.replaceChildren();
    String(value ?? '').split(/<br\s*\/?\s*>/i).forEach((line, index) => {
      if (index) element.append(element.ownerDocument.createElement('br'));
      element.append(element.ownerDocument.createTextNode(line));
    });
  };
  const saveLocal = () => {
    try { localStorage.setItem(STORAGE, JSON.stringify({ drafts, pageMeta, pagePath })); } catch {}
  };
  const historyButtons = () => {
    $('#undoBtn').disabled = !undo.length;
    $('#redoBtn').disabled = !redo.length;
  };
  const pushUndo = () => {
    undo.push(clone({ drafts, pageMeta }));
    if (undo.length > 50) undo.shift();
    redo = [];
    historyButtons();
  };
  const restore = snapshot => {
    drafts = clone(snapshot.drafts || {});
    pageMeta = clone(snapshot.pageMeta || { seo: {}, structure: [], pages: {} });
    saveLocal();
    applyAll();
    historyButtons();
  };
  const hex = value => {
    const values = String(value || '').match(/\d+/g);
    return values ? `#${values.slice(0, 3).map(v => Number(v).toString(16).padStart(2, '0')).join('')}` : '#000000';
  };

  const fallbackSelector = element => {
    if (element.dataset.key) return `[data-key="${esc(element.dataset.key)}"]`;
    if (element.id) return `#${esc(element.id)}`;
    const parts = [];
    let node = element;
    while (node && node !== node.ownerDocument.body && parts.length < 10) {
      let part = node.tagName.toLowerCase();
      const usefulClass = [...node.classList].find(name => !name.startsWith('admin-'));
      if (usefulClass) part += `.${esc(usefulClass)}`;
      const siblings = [...node.parentElement.children].filter(item => item.tagName === node.tagName);
      if (siblings.length > 1) part += `:nth-of-type(${siblings.indexOf(node) + 1})`;
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
    let element = null;
    try { element = doc.querySelector(draft.selector); } catch {}
    if (!element && draft.fallbackSelector) {
      try { element = doc.querySelector(draft.fallbackSelector); } catch {}
      if (element && draft.stableId) element.dataset.mohajerEditorId = draft.stableId;
    }
    return element;
  };

  const getStyles = () => {
    const fields = ['fontSize','fontWeight','lineHeight','letterSpacing','textAlign','textTransform','opacity','margin','padding','gap','width','height','minWidth','maxWidth','position','zIndex','border'];
    const styles = {};
    fields.forEach(id => { const input = $('#' + id); if (input?.value) styles[id] = input.value; });
    styles.borderRadius = $('#radius')?.value || '';
    styles.boxShadow = $('#shadow')?.value || '';
    styles.color = $('#textColor')?.value || '';
    styles.backgroundColor = $('#bgColor')?.value || '';
    const background = $('#bgImage')?.value || '';
    if (background) {
      styles.backgroundImage = `url("${background}")`;
      styles.backgroundSize = 'cover';
      styles.backgroundPosition = 'center';
    }
    if ($('#animation')?.value) {
      styles.animationName = $('#animation').value;
      styles.animationDuration = $('#animationDuration').value || '600ms';
      styles.animationDelay = $('#animationDelay').value || '0ms';
      styles.animationFillMode = 'both';
    }
    return styles;
  };

  const applyDraft = (draft, doc) => {
    if (!draft?.selector) return;
    const element = resolveElement(draft, doc);
    if (!element) return;
    if (draft.type === 'image' && draft.content) element.src = draft.content;
    else if (['text','link','heading','paragraph','button'].includes(draft.type)) safeText(element, draft.content);
    Object.entries(draft.styles || {}).forEach(([key, value]) => {
      if (value !== '' && value != null) element.style.setProperty(toCss(key), String(value));
    });
    Object.entries(draft.responsive?.[device] || {}).forEach(([key, value]) => {
      if (value) element.style.setProperty(toCss(key), String(value));
    });
    if (draft.hidden) element.style.setProperty('display', 'none', 'important');
    if (draft.hover?.scale && draft.hover.scale !== '1') {
      element.style.setProperty('--mohajer-hover-scale', draft.hover.scale);
      element.dataset.mohajerHoverScale = draft.hover.scale;
    }
    if (draft.link && (element.tagName === 'A' || element.closest('a')) && /^(https?:\/\/|\/)/i.test(draft.link)) {
      const link = element.tagName === 'A' ? element : element.closest('a');
      link.href = draft.link;
      if (draft.newTab) link.target = '_blank';
    }
  };

  const applyStructure = doc => (pageMeta.structure || []).forEach(operation => {
    if (!operation?.id) return;
    const marker = `[data-mohajer-created="${esc(operation.id)}"]`;
    if (operation.action === 'delete') {
      const element = doc.querySelector(marker) || (() => { try { return doc.querySelector(operation.selector); } catch { return null; } })();
      element?.remove();
      return;
    }
    if (operation.action === 'move') {
      let element = null;
      try { element = operation.selector ? doc.querySelector(operation.selector) : doc.querySelector(marker); } catch {}
      const parent = (() => { try { return doc.querySelector(operation.parentSelector || operation.parentFallbackSelector); } catch { return null; } })();
      if (element && parent) parent.insertBefore(element, operation.beforeSelector ? doc.querySelector(operation.beforeSelector) : null);
      return;
    }
    if (operation.action === 'add' && operation.html && !doc.querySelector(marker)) {
      const parent = (() => { try { return doc.querySelector(operation.parentSelector) || doc.querySelector(operation.parentFallbackSelector); } catch { return null; } })() || doc.body;
      const template = doc.createElement('template');
      template.innerHTML = String(operation.html).trim();
      const element = template.content.firstElementChild;
      if (!element) return;
      element.dataset.mohajerCreated = operation.id;
      if (operation.position === 'first') parent.insertBefore(element, parent.firstChild);
      else parent.appendChild(element);
    }
  });
  const applyAll = () => {
    const doc = iframe.contentDocument;
    if (!doc) return;
    Object.values(drafts).forEach(draft => applyDraft(draft, doc));
    applyStructure(doc);
  };

  const prepare = () => {
    const doc = iframe.contentDocument;
    if (!doc) return;
    doc.getElementById('mohajer-editor-overlay')?.remove();
    const style = doc.createElement('style');
    style.id = 'mohajer-editor-overlay';
    style.textContent = '[data-key],[data-mohajer-editor-id],img,section,article,button,a,.product-card,.feature-item-new,.dept-card,.ss-product-card{cursor:pointer!important}[data-key]:hover,[data-mohajer-editor-id]:hover,img:hover,section:hover,article:hover,button:hover,a:hover,.product-card:hover,.feature-item-new:hover,.dept-card:hover,.ss-product-card:hover{outline:2px solid #3478f6!important;outline-offset:2px!important}.mohajer-selected{outline:3px solid #f2b941!important;outline-offset:3px!important}[data-mohajer-hover-scale]{transition:transform .2s ease}[data-mohajer-hover-scale]:hover{transform:scale(var(--mohajer-hover-scale,1.02))!important}';
    doc.head.append(style);
    applyAll();
    doc.addEventListener('click', event => {
      const element = event.target.closest('[data-mohajer-editor-id],[data-key],img,.product-card,.feature-item-new,.dept-card,.ss-product-card,section,article,button,a');
      if (!element) return;
      event.preventDefault();
      event.stopPropagation();
      select(element);
    }, true);
    doc.addEventListener('dragstart', event => {
      const element = event.target.closest('[data-mohajer-editor-id],[data-key],section,article,.product-card,.ss-product-card');
      if (!element) return;
      ensureStableId(element);
      event.dataTransfer?.setData('text/mohajer-editor-id', element.dataset.mohajerEditorId);
      event.dataTransfer?.setData('text/plain', fallbackSelector(element));
    }, true);
    doc.addEventListener('dragover', event => { if (event.target.closest('[data-mohajer-editor-id],[data-key],section,article')) event.preventDefault(); }, true);
    doc.addEventListener('drop', event => {
      const target = event.target.closest('[data-mohajer-editor-id],[data-key],section,article');
      if (!target || !event.dataTransfer) return;
      const id = event.dataTransfer.getData('text/mohajer-editor-id');
      if (!id || target.dataset.mohajerEditorId === id) return;
      const moved = doc.querySelector(`[data-mohajer-editor-id="${esc(id)}"]`);
      if (!moved || moved === target || moved.contains(target)) return;
      event.preventDefault();
      pushUndo();
      target.parentElement.insertBefore(moved, target);
      pageMeta.structure.push({ action:'move', id, selector:`[data-mohajer-editor-id="${esc(id)}"]`, parentSelector:fallbackSelector(target.parentElement), parentFallbackSelector:fallbackSelector(target.parentElement), beforeSelector:fallbackSelector(target), schemaVersion:1 });
      saveLocal();
      notify('ترتیب عنصر در Draft تغییر کرد');
    }, true);
  };

  const select = element => {
    selected?.classList.remove('mohajer-selected');
    selected = element;
    selected.classList.add('mohajer-selected');
    const fallback = fallbackSelector(element);
    const stableId = ensureStableId(element);
    selectedKey = stableSelector(element);
    const type = elementType(element);
    element.dataset.editorType = type;
    $('#selectedTitle').textContent = stableId;
    $('#selectedKey').value = selectedKey;
    $('#emptyInspector').classList.add('hidden');
    $('#inspector').classList.remove('hidden');
    const computed = getComputedStyle(element);
    const set = (id, value) => { const input = $('#' + id); if (input) input.value = value ?? ''; };
    set('fontSize', computed.fontSize); set('fontWeight', computed.fontWeight); set('lineHeight', computed.lineHeight); set('letterSpacing', computed.letterSpacing);
    set('textAlign', computed.textAlign); set('textTransform', computed.textTransform); set('textColor', hex(computed.color)); set('textColorText', hex(computed.color));
    set('bgColor', hex(computed.backgroundColor)); set('bgColorText', hex(computed.backgroundColor)); set('opacity', computed.opacity); set('margin', computed.margin); set('padding', computed.padding);
    set('gap', computed.gap); set('width', computed.width); set('height', computed.height); set('minWidth', computed.minWidth); set('maxWidth', computed.maxWidth);
    set('position', computed.position); set('zIndex', computed.zIndex); set('radius', computed.borderRadius); set('border', computed.border); set('shadow', computed.boxShadow);
    set('bgImage', computed.backgroundImage === 'none' ? '' : computed.backgroundImage.replace(/^url\(["']?|["']?\)$/g, ''));
    set('animation', computed.animationName === 'none' ? '' : computed.animationName); set('animationDuration', computed.animationDuration); set('animationDelay', computed.animationDelay);
    set('hoverScale', drafts[selectedKey]?.hover?.scale || '1');
    $('#textValue').value = ['text','heading','paragraph','button'].includes(type) ? (element.innerText || element.textContent || '').trim() : '';
    $('#linkValue').value = element.tagName === 'A' ? element.getAttribute('href') || '' : element.closest('a')?.getAttribute('href') || '';
    $('#newTab').checked = (element.tagName === 'A' ? element.target : element.closest('a')?.target) === '_blank';
    const responsive = drafts[selectedKey]?.responsive?.[device] || {};
    set('responsiveFont', responsive.fontSize); set('responsiveWidth', responsive.width); set('responsiveMargin', responsive.margin); set('responsivePadding', responsive.padding);
    if (!drafts[selectedKey]) drafts[selectedKey] = { selector:selectedKey, stableId, fallbackSelector:fallback, type, content:$('#textValue').value, styles:{}, schemaVersion:6 };
    element.scrollIntoView({ block:'center', behavior:'smooth' });
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
      content: type === 'image' ? (selected.currentSrc || selected.src || '') : $('#textValue').value.replace(/\n/g, '<br>'),
      link: $('#linkValue').value || '',
      newTab: $('#newTab').checked,
      styles: { ...(old.styles || {}), ...getStyles() },
      responsive: { ...(old.responsive || {}), [device]: { fontSize:$('#responsiveFont').value, width:$('#responsiveWidth').value, margin:$('#responsiveMargin').value, padding:$('#responsivePadding').value } },
      hover: { scale: $('#hoverScale').value || '1' },
      schemaVersion: 6
    };
    applyAll();
    saveLocal();
    $('#saveState').textContent = '● Draft آماده است';
    notify('تغییر در Draft اعمال شد');
  };

  const addElement = type => {
    if (!selected) return notify('ابتدا یک Section یا Container را انتخاب کنید');
    pushUndo();
    const doc = iframe.contentDocument;
    const tags = { Heading:'h2', Paragraph:'p', Text:'div', Button:'button', Link:'a', Image:'img', Divider:'hr', List:'ul', Icon:'span', Video:'div', Gallery:'div', FAQ:'div', Table:'div', Card:'div', Badge:'span', Statistic:'div', Section:'section', Container:'div', Logo:'div', Navigation:'nav', Footer:'footer' };
    const element = doc.createElement(tags[type] || 'div');
    const id = uid();
    element.dataset.mohajerCreated = id;
    element.dataset.mohajerEditorId = id;
    element.dataset.editorType = elementType(element);
    if (type === 'Image') { element.src = 'https://placehold.co/800x450?text=Image'; element.alt = ''; }
    else if (type === 'Heading') element.textContent = 'عنوان جدید';
    else if (type === 'Paragraph') element.textContent = 'متن جدید';
    else if (type === 'Button') element.textContent = 'دکمه جدید';
    else if (type === 'Link') { element.href = '#'; element.textContent = 'لینک جدید'; }
    else element.textContent = type;
    element.style.cssText = 'padding:12px;margin:8px;border:1px dashed #999;min-height:20px';
    selected.appendChild(element);
    const key = `[data-mohajer-editor-id="${esc(id)}"]`;
    drafts[key] = { selector:key, stableId:id, fallbackSelector:key, type:elementType(element), content:element.tagName === 'IMG' ? element.src : element.textContent, styles:{padding:'12px',margin:'8px',border:'1px dashed #999'}, schemaVersion:6 };
    pageMeta.structure.push({ action:'add', id, parentSelector:stableSelector(selected), parentFallbackSelector:fallbackSelector(selected), html:element.outerHTML, position:'last', schemaVersion:1 });
    select(element);
    saveLocal();
    notify(`${type} به Draft اضافه شد`);
  };

  const duplicateSelected = () => {
    if (!selected) return notify('عنصری انتخاب نشده است');
    pushUndo();
    const id = uid();
    const copy = selected.cloneNode(true);
    copy.dataset.mohajerCreated = id;
    copy.dataset.mohajerEditorId = id;
    selected.parentElement.insertBefore(copy, selected.nextSibling);
    const key = `[data-mohajer-editor-id="${esc(id)}"]`;
    const base = drafts[selectedKey] || { type:elementType(copy), content:copy.textContent, styles:{} };
    drafts[key] = { ...clone(base), selector:key, stableId:id, fallbackSelector:key, schemaVersion:6 };
    pageMeta.structure.push({ action:'add', id, parentSelector:stableSelector(selected.parentElement), parentFallbackSelector:fallbackSelector(selected.parentElement), html:copy.outerHTML, position:'last', schemaVersion:1 });
    select(copy); saveLocal(); notify('کپی پایدار در Draft ساخته شد');
  };

  const deleteSelected = () => {
    if (!selected) return;
    if (!confirm('این عنصر از Draft حذف شود؟')) return;
    pushUndo();
    const id = selected.dataset.mohajerCreated || uid();
    pageMeta.structure.push({ action:'delete', id, selector:selectedKey, fallbackSelector:drafts[selectedKey]?.fallbackSelector || fallbackSelector(selected), schemaVersion:1 });
    delete drafts[selectedKey];
    selected.remove(); selected = null;
    $('#inspector').classList.add('hidden'); $('#emptyInspector').classList.remove('hidden');
    saveLocal(); notify('عنصر از Draft حذف شد');
  };

  const pages = () => {
    const box = $('#leftContent'); box.innerHTML = '';
    [['صفحه اصلی','/'],['Steel Billet','/products/steel-billet/'],['Steel Beam','/products/steel-beam/'],['Steel Pipe','/products/steel-pipe/'],['Rebar','/products/rebar/'],['Steel Plate','/products/steel-plate/'],['Steel Angle','/products/steel-angle/'],['Steel Channel','/products/steel-channel/'],['Steel Slab','/products/steel-slab/']].forEach(([name,path]) => {
      const button = document.createElement('button'); button.className='page-item'; button.innerHTML=`${name}<small>${path}</small>`;
      button.onclick=()=>{ pagePath=path; $('#pageTitle').textContent=name; $('#pagePath').textContent=path; if(path!=='/products/steel-billet/') return notify('این نسخه فعلاً برای Steel Billet فعال است'); iframe.src='../../products/steel-billet/'; saveLocal(); };
      box.append(button);
    });
  };
  const elements = () => {
    const box = $('#leftContent'); box.innerHTML='<div class="hint" style="padding:8px 12px">برای افزودن، ابتدا عنصر والد را در Preview انتخاب کنید.</div>';
    ['Section','Container','Heading','Paragraph','Text','Image','Button','Link','Icon','Card','Badge','Statistic','Table','List','Video','Gallery','FAQ','Divider','Logo','Navigation','Footer'].forEach(type=>{const button=document.createElement('button');button.className='page-item';button.textContent='＋ '+type;button.onclick=()=>addElement(type);box.append(button);});
  };
  const media = () => {
    const box=$('#leftContent'); box.innerHTML='<div class="page-item"><b>Media Library</b><p class="hint">در این نسخه، تصویر از URL امن انتخاب می‌شود.</p></div>';
    const input=document.createElement('input'); input.type='url'; input.placeholder='https://...'; input.style.width='100%'; input.style.marginTop='8px'; box.firstChild.append(input);
    const button=document.createElement('button'); button.className='page-item primary'; button.textContent='اعمال به Image انتخاب‌شده';
    button.onclick=()=>{if(!selected||selected.tagName!=='IMG')return notify('یک Image انتخاب کنید');if(!/^https?:\/\//i.test(input.value))return notify('URL معتبر نیست');pushUndo();selected.src=input.value;capture();};
    box.firstChild.append(button);
  };
  const historyView = async () => {
    const box=$('#leftContent'); box.innerHTML='<div class="page-item">در حال بارگذاری تاریخچه…</div>';
    try { const snapshot=await db.collection('siteVersions').orderBy('createdAt','desc').limit(30).get(); box.innerHTML=''; snapshot.forEach(doc=>{const value=doc.data()||{},button=document.createElement('button');button.className='page-item';button.innerHTML=`<b>${value.versionId||doc.id}</b><small>${value.page||''}</small>`;button.onclick=()=>{if(!confirm('این نسخه فقط به Draft برگردد؟'))return;pushUndo();drafts=clone(value.content||{});pageMeta=clone(value.meta||{seo:{},structure:[]});saveLocal();applyAll();notify('Rollback به Draft انجام شد');};box.append(button);});if(!snapshot.size)box.innerHTML='<div class="page-item">تاریخچه‌ای وجود ندارد.</div>'; }
    catch(error){console.error(error);box.innerHTML='<div class="page-item">تاریخچه قابل دریافت نیست.</div>';}
  };
  const seo = () => {
    const box=$('#leftContent'); box.innerHTML=''; const wrap=document.createElement('div'); wrap.className='page-item'; wrap.innerHTML='<b>SEO Manager</b><p class="hint">SEO فقط در Draft ذخیره می‌شود و با Publish اعمال می‌شود.</p>';
    [['title','Title'],['description','Description'],['canonical','Canonical'],['robots','Robots'],['ogTitle','OG Title'],['ogDescription','OG Description'],['ogImage','OG Image']].forEach(([key,label])=>{const field=document.createElement('label');field.textContent=label;const input=document.createElement('input');input.value=pageMeta.seo?.[key]||'';input.onchange=()=>{pageMeta.seo={...(pageMeta.seo||{}),[key]:input.value};saveLocal();};field.append(input);wrap.append(field);});
    const no=document.createElement('label'); no.className='check'; const checkbox=document.createElement('input'); checkbox.type='checkbox'; checkbox.checked=pageMeta.seo?.noindex===true; checkbox.onchange=()=>{pageMeta.seo={...(pageMeta.seo||{}),noindex:checkbox.checked,robots:checkbox.checked?'noindex,nofollow':(pageMeta.seo?.robots||'index,follow')};saveLocal();}; no.append(checkbox,document.createTextNode(' Noindex')); wrap.append(no); box.append(wrap);
  };
  const ai = () => {
    const box=$('#leftContent'); box.innerHTML='<div class="page-item"><b>AI Design Assistant</b><p class="hint">AI فقط Context عنصر انتخاب‌شده را می‌گیرد؛ پیشنهاد باید به صورت Patch برگردد و Publish مستقیم ممنوع است.</p></div>';
    if(!selected)return;
    const button=document.createElement('button');button.className='page-item primary';button.textContent='کپی Context امن';button.onclick=async()=>{const context={page:pagePath,elementId:selected.dataset.mohajerEditorId||null,type:elementType(selected),content:$('#textValue').value,styles:drafts[selectedKey]?.styles||{},responsive:drafts[selectedKey]?.responsive||{},instruction:'Return proposal only. Never publish.'};try{await navigator.clipboard.writeText(JSON.stringify(context,null,2));notify('Context کپی شد');}catch{notify('Clipboard در این مرورگر در دسترس نیست');}};box.append(button);
  };
  const settings = () => { $('#leftContent').innerHTML='<div class="page-item"><b>Editor Guard</b><p class="hint">Draft و Published جدا هستند. Publish قبل از نوشتن نسخه جدید، Snapshot نسخه قبلی را می‌سازد.</p></div>'; };
  const navView = view => { $$('.nav').forEach(item=>item.classList.toggle('active',item.dataset.view===view)); ({pages,elements,media,history:historyView,seo,ai,settings}[view]||settings)(); };

  const saveRemote = async () => {
    if (!auth.currentUser) throw new Error('not authenticated');
    await db.collection('siteContent').doc('draft').set({ content:drafts, meta:pageMeta, page:pagePath, updatedAt:firebase.firestore.FieldValue.serverTimestamp(), updatedBy:auth.currentUser.uid, schemaVersion:6 });
  };
  const publish = async () => {
    if (!auth.currentUser) throw new Error('not authenticated');
    const live = await db.collection('siteContent').doc('published').get();
    const versionId='v-'+Date.now();
    await db.collection('siteVersions').doc(versionId).set({content:live.exists?(live.data().content||{}):{},meta:live.exists?(live.data().meta||{}):{},page:pagePath,versionId,createdAt:firebase.firestore.FieldValue.serverTimestamp(),createdBy:auth.currentUser.uid,source:'pre-publish',schemaVersion:6});
    await db.collection('siteContent').doc('published').set({content:drafts,meta:pageMeta,page:pagePath,updatedAt:firebase.firestore.FieldValue.serverTimestamp(),updatedBy:auth.currentUser.uid,versionId,schemaVersion:6});
  };
  const boot = async () => {
    try { const local=JSON.parse(localStorage.getItem(STORAGE)||'{}'); drafts=local.drafts||{}; pageMeta=local.pageMeta||{seo:{},structure:[],pages:{}}; pagePath=local.pagePath||pagePath; } catch {}
    try { const snapshot=await db.collection('siteContent').doc('draft').get(); if(snapshot.exists){const data=snapshot.data()||{};drafts={...data.content,...drafts};pageMeta={...pageMeta,...(data.meta||{})};pagePath=data.page||pagePath;}} catch(error){console.warn('Draft could not be loaded',error);}
    $('#pageTitle').textContent='Steel Billet'; $('#pagePath').textContent=pagePath; saveLocal(); historyButtons(); pages();
  };

  $('#loginForm').addEventListener('submit',async event=>{event.preventDefault();const button=event.currentTarget.querySelector('button');button.disabled=true;$('#loginError').textContent='';try{await auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);await auth.signInWithEmailAndPassword(ADMIN_EMAIL,$('#adminPassword').value);}catch(error){console.error(error);$('#loginError').textContent=error.code==='auth/too-many-requests'?'تلاش زیاد بود؛ چند دقیقه بعد دوباره امتحان کنید.':'ورود ناموفق بود؛ رمز پنل قبلی را بررسی کنید.';}finally{button.disabled=false;}});
  auth.onAuthStateChanged(user=>{ $('#loginGate').classList.toggle('hidden',!user); $('#app').classList.toggle('locked',!user); if(user) boot(); });
  iframe.addEventListener('load',prepare);
  $$('.nav').forEach(item=>item.addEventListener('click',()=>navView(item.dataset.view)));
  $$('.device').forEach(item=>item.addEventListener('click',()=>{device=item.dataset.device;$$('.device').forEach(x=>x.classList.toggle('active',x===item));$('#canvas').className='canvas '+device;applyAll();if(selected)select(selected);}));
  $('#applyBtn').onclick=capture;
  $('#saveBtn').onclick=async()=>{try{await saveRemote();saveLocal();$('#saveState').textContent='● Draft ذخیره شد';notify('Draft در Firestore ذخیره شد');}catch(error){console.error(error);notify('ذخیره Draft ناموفق بود');}};
  $('#previewBtn').onclick=()=>{applyAll();notify('Preview به‌روزرسانی شد');};
  $('#openLive').onclick=()=>window.open('https://mohajer-steel.com/products/steel-billet/','_blank');
  $('#publishBtn').onclick=()=>$('#publishDialog').showModal();
  $('#cancelPublish').onclick=()=>$('#publishDialog').close();
  $('#confirmPublish').onclick=async()=>{try{await saveRemote();await publish();$('#publishDialog').close();notify('انتشار موفق بود');}catch(error){console.error(error);notify('انتشار ناموفق بود');}};
  $('#clearSelection').onclick=()=>{selected?.classList.remove('mohajer-selected');selected=null;selectedKey='';$('#inspector').classList.add('hidden');$('#emptyInspector').classList.remove('hidden');};
  $('#duplicateBtn').onclick=duplicateSelected; $('#deleteBtn').onclick=deleteSelected;
  $('#undoBtn').onclick=()=>{if(!undo.length)return;redo.push(clone({drafts,pageMeta}));restore(undo.pop());};
  $('#redoBtn').onclick=()=>{if(!redo.length)return;undo.push(clone({drafts,pageMeta}));restore(redo.pop());};
  ['textColor','textColorText'].forEach(id=>$('#'+id)?.addEventListener('input',event=>{if(id==='textColor')$('#textColorText').value=event.target.value;else $('#textColor').value=event.target.value;}));
  ['bgColor','bgColorText'].forEach(id=>$('#'+id)?.addEventListener('input',event=>{if(id==='bgColor')$('#bgColorText').value=event.target.value;else $('#bgColor').value=event.target.value;}));
  window.addEventListener('beforeunload',saveLocal);
})();
