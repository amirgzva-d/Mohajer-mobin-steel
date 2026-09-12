(() => {
'use strict';
/*
  MOHAJER STEEL — Editor Stability Layer
  هدف: انتخاب دقیق، ویرایش زنده بدون فلش/سیاهی، Draft موقت تا Save، و کنترل پایدار Resize/Move.
  این فایل فقط روی پنل و iframe ادیتور اثر دارد و سایت عمومی را مستقیماً تغییر نمی‌دهد.
*/
const $ = id => document.getElementById(id);
const toast = m => { const t=$('toast'); if(!t)return; t.textContent=m; t.classList.add('show'); clearTimeout(toast.t); toast.t=setTimeout(()=>t.classList.remove('show'),2600); };
let frame=null, doc=null, current=null, box=null, pending=false, applying=false, suppressCore=false;
const uid=()=>`me-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
const esc=v=>window.CSS?.escape?CSS.escape(String(v)):String(v).replace(/[^a-zA-Z0-9_-]/g,'\\$&');
const candidates='[data-mohajer-editor-id],[data-key],h1,h2,h3,h4,h5,h6,p,span,a,button,img,svg,i,em,strong,b,label,figure,figcaption,input,select,textarea,video,section,article,header,footer,main,nav,aside,li,ul,ol,table,th,td,.product-card,.feature-item-new,.dept-card,.ss-product-card';
const ensureId=el=>{if(!el.dataset.mohajerEditorId)el.dataset.mohajerEditorId=uid();return el.dataset.mohajerEditorId};
const key=el=>`[data-mohajer-editor-id="${esc(ensureId(el))}"]`;
const selectedText=el=>(el?.innerText||el?.textContent||'').trim();
const type=el=>{if(!el)return'container';if(el.tagName==='IMG')return'image';if(el.tagName==='VIDEO')return'video';if(el.tagName==='A')return'link';if(/^H[1-6]$/.test(el.tagName))return'heading';if(el.tagName==='P')return'paragraph';if(el.tagName==='BUTTON')return'button';return'text'};
const removeBox=()=>{box?.remove();box=null};
const cleanUiTarget=el=>el?.closest?.('[data-editor-ui],#mohajer-pro-selection,#mohajer-selection-box,.mh-editor-overlay');
const frameReady=()=>{frame=$('preview');return !!(frame?.contentDocument?.body)};
const guardPreview=d=>{
  if(!d?.documentElement)return;
  d.documentElement.classList.remove('site-content-loading');
  d.getElementById('mohajer-editor-live-guard')?.remove();
  const s=d.createElement('style'); s.id='mohajer-editor-live-guard';
  s.textContent=`html,body{min-height:100%!important;} body{visibility:visible!important;} .site-content-loading{visibility:visible!important;opacity:1!important;} [data-editor-ui]{pointer-events:none!important;}`;
  (d.head||d.documentElement).appendChild(s);
};
const draw=()=>{
  if(!doc||!current||!doc.body.contains(current)){removeBox();return;}
  removeBox(); const r=current.getBoundingClientRect();
  box=doc.createElement('div'); box.id='mohajer-pro-selection'; box.className='mh-editor-overlay'; box.setAttribute('data-editor-ui','1');
  box.style.cssText=`position:absolute!important;left:${r.left+doc.defaultView.scrollX}px!important;top:${r.top+doc.defaultView.scrollY}px!important;width:${Math.max(1,r.width)}px!important;height:${Math.max(1,r.height)}px!important;z-index:2147483647!important;border:2px solid #f0b83f!important;box-sizing:border-box!important;background:transparent!important;pointer-events:none!important;`;
  [['nw','nwse-resize'],['n','ns-resize'],['ne','nesw-resize'],['e','ew-resize'],['se','nwse-resize'],['s','ns-resize'],['sw','nesw-resize'],['w','ew-resize']].forEach(([dir,cursor])=>{
    const h=doc.createElement('span'); h.dataset.resize=dir; h.setAttribute('data-editor-ui','1');
    const pos={nw:'left:-7px;top:-7px',n:'left:calc(50% - 6px);top:-7px',ne:'right:-7px;top:-7px',e:'right:-7px;top:calc(50% - 6px)',se:'right:-7px;bottom:-7px',s:'left:calc(50% - 6px);bottom:-7px',sw:'left:-7px;bottom:-7px',w:'left:-7px;top:calc(50% - 6px)'}[dir];
    h.style.cssText=`position:absolute!important;width:12px!important;height:12px!important;border-radius:50%!important;background:#f0b83f!important;border:2px solid #111!important;box-sizing:border-box!important;pointer-events:auto!important;cursor:${cursor}!important;${pos};`;
    h.addEventListener('pointerdown',e=>startResize(e,dir),true); box.appendChild(h);
  });
  box.addEventListener('pointerdown',e=>{if(e.target.dataset.resize)return;startMove(e)},true); doc.body.appendChild(box);
};
const markPending=()=>{pending=true;if($('saveState'))$('saveState').textContent='● تغییرات ذخیره‌نشده';};
const styleNow=(el,prop,val)=>{if(val!==undefined&&val!==null&&val!=='')el.style.setProperty(prop,val);else el.style.removeProperty(prop)};
const startMove=e=>{
  if(!current||e.button!==undefined&&e.button!==0)return; e.preventDefault(); e.stopPropagation();
  const sx=e.clientX,sy=e.clientY,cs=doc.defaultView.getComputedStyle(current);
  const base=current.__mhMove||{x:parseFloat(cs.getPropertyValue('--mh-editor-x'))||0,y:parseFloat(cs.getPropertyValue('--mh-editor-y'))||0};
  const oldTransform=current.style.transform; let raf=0;
  const move=ev=>{const x=base.x+ev.clientX-sx,y=base.y+ev.clientY-sy;current.__mhMove={x,y};styleNow(current,'--mh-editor-x',x+'px');styleNow(current,'--mh-editor-y',y+'px');styleNow(current,'transform',`translate(${x}px,${y}px)`);if(!raf)raf=requestAnimationFrame(()=>{raf=0;draw()});markPending()};
  const up=()=>{doc.removeEventListener('pointermove',move,true);doc.removeEventListener('pointerup',up,true);if(raf)cancelAnimationFrame(raf);markPending();toast('جابه‌جایی در پیش‌نمایش انجام شد؛ برای ثبت نهایی «ذخیره پیش‌نویس» را بزنید')};
  doc.addEventListener('pointermove',move,true);doc.addEventListener('pointerup',up,true);
};
const startResize=(e,dir)=>{
  if(!current)return; e.preventDefault();e.stopPropagation();
  const r=current.getBoundingClientRect(),sw=r.width,sh=r.height,sx=e.clientX,sy=e.clientY;let raf=0;
  const move=ev=>{let w=sw,h=sh;if(dir.includes('e'))w=sw+ev.clientX-sx;if(dir.includes('w'))w=sw-ev.clientX+sx;if(dir.includes('s'))h=sh+ev.clientY-sy;if(dir.includes('n'))h=sh-ev.clientY+sy;w=Math.max(24,w);h=Math.max(16,h);styleNow(current,'width',w+'px');styleNow(current,'height',h+'px');if(!raf)raf=requestAnimationFrame(()=>{raf=0;draw()});markPending()};
  const up=()=>{doc.removeEventListener('pointermove',move,true);doc.removeEventListener('pointerup',up,true);if(raf)cancelAnimationFrame(raf);markPending();toast('اندازه تغییر کرد؛ برای ثبت نهایی «ذخیره پیش‌نویس» را بزنید')};
  doc.addEventListener('pointermove',move,true);doc.addEventListener('pointerup',up,true);
};
const select=el=>{
  if(!el||cleanUiTarget(el))return;
  current=el;ensureId(el);removeBox();draw();
  const cs=doc.defaultView.getComputedStyle(el),set=(id,v)=>{if($(id))$(id).value=v??''};
  set('textValue',type(el)==='image'?'':selectedText(el));
  set('linkValue',el.tagName==='A'?el.getAttribute('href')||'':el.closest('a')?.getAttribute('href')||'');
  set('altValue',el.alt||''); if($('newTab'))$('newTab').checked=(el.target||el.closest('a')?.target)==='_blank';
  [['fontSize','fontSize'],['fontWeight','fontWeight'],['lineHeight','lineHeight'],['letterSpacing','letterSpacing'],['textAlign','textAlign'],['textTransform','textTransform'],['opacity','opacity'],['margin','margin'],['padding','padding'],['gap','gap'],['width','width'],['height','height'],['minWidth','minWidth'],['maxWidth','maxWidth'],['position','position'],['zIndex','zIndex'],['borderRadius','borderRadius'],['border','border'],['boxShadow','boxShadow']].forEach(([id,p])=>set(id,cs[p]));
  const rgb=v=>{const m=String(v||'').match(/\d+/g);return m&&m.length>=3?'#'+m.slice(0,3).map(x=>Number(x).toString(16).padStart(2,'0')).join(''):'#000000'};
  set('textColor',rgb(cs.color));set('textColorText',rgb(cs.color));set('bgColor',rgb(cs.backgroundColor));set('bgColorText',rgb(cs.backgroundColor));set('bgImage',cs.backgroundImage==='none'?'':cs.backgroundImage);set('animation',cs.animationName==='none'?'':cs.animationName);set('animationDuration',cs.animationDuration);set('animationDelay',cs.animationDelay);
  if($('selectedTitle'))$('selectedTitle').textContent=`${el.tagName} — ${el.id||el.dataset.mohajerEditorId||''}`;
  if($('selectedKey'))$('selectedKey').value=key(el); $('emptyInspector')?.classList.add('hidden');$('inspector')?.classList.remove('hidden');
};
const install=d=>{
  doc=d;guardPreview(d);
  let st=d.getElementById('mh-editor-stability-style'); if(!st){st=d.createElement('style');st.id='mh-editor-stability-style';d.head.appendChild(st)}
  st.textContent=`[data-editor-ui]{pointer-events:none!important}.mh-editor-overlay [data-editor-ui]{pointer-events:auto!important}.mh-editor-overlay{user-select:none!important}.mh-editor-hover{outline:2px dashed #3478f6!important;outline-offset:2px!important}`;
  if(d.__mhStabilityBound)return; d.__mhStabilityBound=true;
  d.addEventListener('pointerover',e=>{const el=e.target.closest?.(candidates);if(el&&!cleanUiTarget(el))el.classList.add('mh-editor-hover')},true);
  d.addEventListener('pointerout',e=>{e.target.closest?.(candidates)?.classList.remove('mh-editor-hover')},true);
  d.addEventListener('click',e=>{if(!frameReady()||cleanUiTarget(e.target))return;const el=e.target.closest?.(candidates);if(!el)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();select(el)},true);
  d.addEventListener('scroll',draw,true); d.defaultView.addEventListener('resize',draw);
  if(current&&d.body.contains(current))draw();
};
const hookFrame=()=>{frame=$('preview');if(!frame)return;const load=()=>setTimeout(()=>{doc=frame.contentDocument;if(doc?.body)install(doc)},40);frame.addEventListener('load',load);if(frame.contentDocument?.body)install(frame.contentDocument)};
const cloneButton=(id,handler)=>{const old=$(id);if(!old||old.dataset.stabilityCloned)return;const n=old.cloneNode(true);n.dataset.stabilityCloned='1';old.replaceWith(n);n.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();handler(e)},true);return n};
const setupSaveSemantics=()=>{
  /* Changes made by mouse are intentionally only live in the iframe. They disappear on refresh unless Save is used. */
  const save=$('saveBtn'); if(save&&!save.dataset.stabilitySave){save.dataset.stabilitySave='1';save.addEventListener('click',()=>{pending=false;setTimeout(()=>{if($('saveState'))$('saveState').textContent='● ذخیره شد'},100)},true)}
};
const addCodeView=()=>{
  const ins=$('inspector');if(!ins||$('mhStableCode'))return;
  const d=document.createElement('details');d.id='mhStableCode';d.open=false;d.innerHTML='<summary>کد کامل عنصر انتخاب‌شده</summary><div style="display:grid;gap:8px"><label>HTML<textarea id="mhStableHtml" rows="8" readonly></textarea></label><label>CSS مؤثر<textarea id="mhStableCss" rows="12" readonly></textarea></label><button type="button" id="mhStableRefresh">به‌روزرسانی کد</button></div>';ins.appendChild(d);
  const refresh=()=>{if(!current||!doc)return;const cs=doc.defaultView.getComputedStyle(current);$('mhStableHtml').value=current.outerHTML;$('mhStableCss').value=Array.from(cs).filter(p=>['display','position','width','height','margin','padding','font-size','font-weight','line-height','color','background-color','border','border-radius','box-shadow','opacity','transform','transition','animation'].includes(p)).map(p=>`${p}: ${cs.getPropertyValue(p)};`).join('\n')};$('mhStableRefresh').onclick=refresh;
  document.addEventListener('click',e=>{if(e.target.closest('#mhStableCode'))setTimeout(refresh,30)});
};
const addEffects=()=>{
  const ins=$('inspector');if(!ins||$('mhStableEffects'))return;
  const d=document.createElement('details');d.id='mhStableEffects';d.innerHTML='<summary>افکت و حرکت حرفه‌ای</summary><div class="grid2"><label>نوع افکت<select id="mhEff"><option value="">بدون افکت</option><option value="float">شناور آرام</option><option value="pulse">تپش</option><option value="shake">لرزش</option><option value="glow">درخشش</option><option value="slideUp">ورود از پایین</option><option value="zoom">زوم</option><option value="rotate">چرخش</option></select></label><label>مدت<input id="mhEffDur" value="700ms"></label><label>تأخیر<input id="mhEffDelay" value="0ms"></label><label>تکرار<select id="mhEffIter"><option value="1">یک‌بار</option><option value="infinite">بی‌نهایت</option><option value="2">۲ بار</option><option value="3">۳ بار</option></select></label></div><button type="button" id="mhApplyEffect" class="primary">اعمال افکت به عنصر</button>';
  ins.appendChild(d);
  const s=document.createElement('style');s.id='mh-stable-effects-style';s.textContent=`@keyframes mhFloat2{50%{transform:translateY(-8px)}}@keyframes mhPulse2{50%{transform:scale(1.035)}}@keyframes mhShake2{25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}@keyframes mhGlow2{50%{filter:drop-shadow(0 0 12px currentColor)}}@keyframes mhSlideUp2{from{opacity:0;transform:translateY(24px)}}@keyframes mhZoom2{from{opacity:0;transform:scale(.9)}}@keyframes mhRotate2{to{transform:rotate(360deg)}}`;
  document.head.appendChild(s);
  $('mhApplyEffect').onclick=()=>{if(!current)return toast('ابتدا یک عنصر را انتخاب کنید');const map={float:'mhFloat2',pulse:'mhPulse2',shake:'mhShake2',glow:'mhGlow2',slideUp:'mhSlideUp2',zoom:'mhZoom2',rotate:'mhRotate2'};const v=$('mhEff').value;if(!v){current.style.removeProperty('animation');markPending();return}const dur=$('mhEffDur').value||'700ms',delay=$('mhEffDelay').value||'0ms',iter=$('mhEffIter').value||'1';current.style.animation=`${map[v]} ${dur} ease ${delay} ${iter} both`;markPending();toast('افکت در پیش‌نمایش اجرا شد؛ برای ثبت نهایی ذخیره کنید')};
};
const addPageGoogleSave=()=>{
  const left=$('leftContent'); if(!left||$('mhGoogleSave'))return;
  const b=document.createElement('button');b.id='mhGoogleSave';b.className='primary';b.textContent='ذخیره وضعیت Google (Draft)';b.title='وضعیت ایندکس این صفحه را در Draft ذخیره می‌کند؛ انتشار جداگانه است';
  b.onclick=async()=>{try{const m=JSON.parse(localStorage.getItem('mohajer-editor-pro-v10')||'{}');m.pageMeta=m.pageMeta||{pages:{}};const p=$('pagePath')?.textContent||'/';m.pageMeta.pages=m.pageMeta.pages||{};m.pageMeta.pages[p]=m.pageMeta.pages[p]||{path:p,title:p};const checked=left.querySelector('#seoIndexable');if(checked)m.pageMeta.pages[p].indexable=checked.checked;localStorage.setItem('mohajer-editor-pro-v10',JSON.stringify(m));toast('وضعیت Google در Draft ذخیره شد؛ برای سایت عمومی Publish لازم است')}catch(e){toast('ذخیره وضعیت Google ناموفق بود')}};
  left.prepend(b);
};
const boot=()=>{hookFrame();addCodeView();addEffects();setupSaveSemantics();document.querySelectorAll('.nav').forEach(n=>n.addEventListener('click',()=>setTimeout(()=>{if(n.dataset.view==='pages'||n.dataset.view==='seo')addPageGoogleSave()},80),true));setTimeout(()=>addPageGoogleSave(),400);};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
