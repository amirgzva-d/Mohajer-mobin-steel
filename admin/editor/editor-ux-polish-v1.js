(()=>{'use strict';
const $=id=>document.getElementById(id);
const ready=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
const polish=()=>{
  const navs={pages:'▣ صفحات سایت',elements:'＋ افزودن عنصر',media:'▧ رسانه',history:'↶ تاریخچه',seo:'⌕ سئو و گوگل',ai:'✦ هوش مصنوعی',settings:'⚙ تنظیمات'};
  document.querySelectorAll('.nav').forEach(n=>{const t=navs[n.dataset.view];if(t)n.innerHTML=t});
  const sm=$('selectModeBtn'),mm=$('moveModeBtn');if(sm)sm.innerHTML='🔎 مشاهده';if(mm)mm.innerHTML='✋ ویرایش';
  const d=$('preview');if(d)d.addEventListener('load',()=>{const doc=d.contentDocument;if(!doc?.head)return;let s=doc.getElementById('mh-editor-stable');if(!s){s=doc.createElement('style');s.id='mh-editor-stable';doc.head.appendChild(s)}s.textContent='html,body{visibility:visible!important;opacity:1!important} .mh-editor-stable *{animation:none!important;transition:none!important}';doc.documentElement.classList.add('mh-editor-stable');setTimeout(()=>doc.documentElement.classList.remove('mh-editor-stable'),900)});
  window.addEventListener('resize',()=>{const f=$('preview');try{const b=f?.contentDocument?.body,h=f?.contentDocument?.documentElement;if(b&&h)f.style.height=Math.max(900,b.scrollHeight,b.offsetHeight,h.scrollHeight,h.offsetHeight)+'px'}catch{}});
};
ready(polish);
})();