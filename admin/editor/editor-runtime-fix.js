(() => {
  'use strict';
  const STORAGE='mohajer-editor-pro-v10';
  const fix=()=>{
    const frame=document.getElementById('preview'),doc=frame?.contentDocument;
    if(!doc?.head)return;
    let style=doc.getElementById('mohajer-editor-runtime-fix');
    if(!style){style=doc.createElement('style');style.id='mohajer-editor-runtime-fix';doc.head.appendChild(style)}
    style.textContent='.mh-w{left:-7px!important;top:calc(50% - 5px)!important}.mh-e{right:-7px!important;top:calc(50% - 5px)!important}.mh-n{left:calc(50% - 5px)!important;top:-7px!important}.mh-s{left:calc(50% - 5px)!important;bottom:-7px!important}';
    let data={};try{data=JSON.parse(localStorage.getItem(STORAGE)||'{}')}catch{}
    const path=document.getElementById('pagePath')?.textContent||'/';
    const drafts=data.drafts?.[path]||{};
    Object.values(drafts).forEach(d=>{
      if(!d?.customCss||!d.stableId)return;
      const id='mohajer-custom-'+String(d.stableId).replace(/[^a-zA-Z0-9_-]/g,'');
      let s=doc.getElementById(id);
      if(!s){s=doc.createElement('style');s.id=id;doc.head.appendChild(s)}
      const sid=String(d.stableId).replace(/[^a-zA-Z0-9_-]/g,'');
      s.textContent=`[data-mohajer-editor-id="${sid}"]{${d.customCss}}`;
    });
  };
  document.addEventListener('DOMContentLoaded',()=>{const f=document.getElementById('preview');f?.addEventListener('load',()=>setTimeout(fix,100));setInterval(fix,1200)});
})();