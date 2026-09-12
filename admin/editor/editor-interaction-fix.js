(() => {
'use strict';
/* Final interaction contract: edits are live-only until Save, undo/redo is session based, and core apply is allowed only by Save. */
const $=id=>document.getElementById(id);
const toast=m=>{const t=$('toast');if(!t)return;t.textContent=m;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),2400)};
let live=null,history=[],future=[],allowCore=false;
const state=()=>{const f=$('preview'),d=f?.contentDocument;return {f,d,el:live&&d?.body.contains(live)?live:null}};
const snapshot=label=>{const s=state();if(!s.el)return null;return {label,time:new Date().toISOString(),id:s.el.dataset.mohajerEditorId||'',html:s.el.outerHTML,page:$('pagePath')?.textContent||'/'};};
const push=label=>{const s=snapshot(label);if(!s)return;history.push(s);if(history.length>60)history.shift();future=[];renderHistory()};
const findSnap=s=>{const d=$('preview')?.contentDocument;if(!d||!s)return null;try{return d.querySelector(`[data-mohajer-editor-id="${CSS.escape(s.id)}"]`)}catch{return null}};
const restoreSnap=s=>{if(!s)return;const d=$('preview')?.contentDocument;if(!d)return;const old=findSnap(s);if(!old)return;const t=d.createElement('template');t.innerHTML=s.html.trim();const fresh=t.content.firstElementChild;if(!fresh)return;old.replaceWith(fresh);live=fresh;syncInspector();window.dispatchEvent(new Event('mohajer:selection-restored'));toast('تغییر قبلی بازگردانده شد')};
const syncInspector=()=>{const el=live;if(!el)return;const cs=el.ownerDocument.defaultView.getComputedStyle(el),set=(id,v)=>{if($(id))$(id).value=v??''};set('textValue',el.tagName==='IMG'?'':(el.innerText||el.textContent||'').trim());set('fontSize',cs.fontSize);set('fontWeight',cs.fontWeight);set('lineHeight',cs.lineHeight);set('letterSpacing',cs.letterSpacing);set('textAlign',cs.textAlign);set('textTransform',cs.textTransform);set('opacity',cs.opacity);set('margin',cs.margin);set('padding',cs.padding);set('gap',cs.gap);set('width',cs.width);set('height',cs.height);set('minWidth',cs.minWidth);set('maxWidth',cs.maxWidth);set('position',cs.position);set('zIndex',cs.zIndex);set('radius',cs.borderRadius);set('border',cs.border);set('shadow',cs.boxShadow);set('animation',cs.animationName==='none'?'':cs.animationName);set('animationDuration',cs.animationDuration);set('animationDelay',cs.animationDelay)};
const applyLive=()=>{if(!live)return;push('قبل از اعمال تغییر');const v=id=>$(id)?.value||'', css={fontSize:v('fontSize'),fontWeight:v('fontWeight'),lineHeight:v('lineHeight'),letterSpacing:v('letterSpacing'),textAlign:v('textAlign'),textTransform:v('textTransform'),opacity:v('opacity'),margin:v('margin'),padding:v('padding'),gap:v('gap'),width:v('width'),height:v('height'),minWidth:v('minWidth'),maxWidth:v('maxWidth'),position:v('position'),zIndex:v('zIndex'),borderRadius:v('radius'),border:v('border'),boxShadow:v('shadow'),color:v('textColor'),backgroundColor:v('bgColor')};
  Object.entries(css).forEach(([p,x])=>{if(x!=='')live.style[p]=x});
  const txt=v('textValue'); if(live.tagName!=='IMG'&&live.tagName!=='VIDEO'&&txt!==''){live.textContent=txt}
  const link=v('linkValue');if(link&& (live.tagName==='A'||live.closest('a'))){const a=live.tagName==='A'?live:live.closest('a');a.href=link;if($('newTab')?.checked)a.target='_blank';else a.removeAttribute('target')}
  if(live.tagName==='IMG'&&v('textValue'))live.src=v('textValue');if(live.tagName==='IMG')live.alt=v('altValue');
  const an=v('animation');if(an){live.style.animationName=an;live.style.animationDuration=v('animationDuration')||'600ms';live.style.animationDelay=v('animationDelay')||'0ms';live.style.animationFillMode='both'}else live.style.removeProperty('animation');
  const custom=v('customCss');if(custom){live.setAttribute('data-mohajer-custom-css',custom);let st=live.ownerDocument.getElementById('mh-live-custom-'+(live.dataset.mohajerEditorId||''));if(!st){st=live.ownerDocument.createElement('style');st.id='mh-live-custom-'+(live.dataset.mohajerEditorId||'');live.ownerDocument.head.appendChild(st)}st.textContent=`[data-mohajer-editor-id="${live.dataset.mohajerEditorId}"]{${custom}}`}
  toast('تغییرات فقط در پیش‌نمایش اعمال شد؛ برای ثبت «ذخیره پیش‌نویس» را بزنید');
};
const historyPanel=()=>{const box=$('leftContent');if(!box)return;const rows=history.map((x,i)=>`<div class="mh-history-row"><b>${i+1}. ${x.label}</b><span>${new Date(x.time).toLocaleString('fa-IR')}</span><small>${x.page}</small></div>`).join('');box.innerHTML=`<div class="history-box"><h3>تاریخچه همین نشست</h3><div class="history-actions"><button id="mhSessionUndo">↶ بازگشت</button><button id="mhSessionRedo">↷ برگرداندن</button></div>${rows||'<p>هنوز تغییری در این نشست ثبت نشده است.</p>'}</div>`;$('mhSessionUndo').onclick=undoOne;$('mhSessionRedo').onclick=redoOne};
const renderHistory=()=>historyPanel();
const undoOne=()=>{if(!history.length)return toast('تغییری برای بازگشت وجود ندارد');const current=snapshot('موقت');future.push(current);const s=history.pop();restoreSnap(s);historyPanel()};
const redoOne=()=>{if(!future.length)return toast('تغییری برای برگرداندن وجود ندارد');const current=snapshot('موقت');history.push(current);const s=future.pop();restoreSnap(s);historyPanel()};
const captureSelection=()=>{const f=$('preview');if(!f)return;const d=f.contentDocument;if(!d)return;d.addEventListener('click',e=>{const el=e.target.closest?.('[data-mohajer-editor-id],[data-key],h1,h2,h3,h4,h5,h6,p,span,a,button,img,svg,i,em,strong,b,label,figure,figcaption,input,select,textarea,video,section,article,header,footer,main,nav,aside,li,ul,ol,table,th,td');if(el&&!e.target.closest('#mohajer-pro-selection'))live=el},false)};
const docCapture=()=>{
  document.addEventListener('click',e=>{
    const id=e.target?.id;
    if(id==='applyBtn'&&!allowCore){e.preventDefault();e.stopImmediatePropagation();applyLive();return}
    if((id==='undoBtn'||id==='redoBtn')&&!allowCore){e.preventDefault();e.stopImmediatePropagation();id==='undoBtn'?undoOne():redoOne();return}
    if(id==='saveBtn'&&!allowCore){allowCore=true;setTimeout(()=>{try{$('applyBtn')?.click()}catch{}allowCore=false},0);setTimeout(()=>{if($('saveState'))$('saveState').textContent='● ذخیره شد'},900)}
  },true);
  document.addEventListener('click',e=>{if(e.target.closest?.('[data-view="history"]'))setTimeout(historyPanel,60)},true);
};
const bindFrame=()=>{const f=$('preview');if(!f)return;f.addEventListener('load',()=>{setTimeout(()=>{captureSelection()},80)});if(f.contentDocument)captureSelection()};
const start=()=>{bindFrame();docCapture();setInterval(()=>{const f=$('preview'),d=f?.contentDocument;if(d?.body){const el=d.querySelector('#mohajer-pro-selection')?.previousElementSibling;if(el&&el!==live){} }},800)};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
window.MohajerEditorInteraction={setSelected:el=>{live=el},history:()=>history.slice()};
})();
