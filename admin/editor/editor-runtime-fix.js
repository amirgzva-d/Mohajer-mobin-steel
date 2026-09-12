(() => {
  'use strict';
  const STORAGE='mohajer-editor-pro-v10';
  const fix=()=>{
    const frame=document.getElementById('preview');
    const doc=frame?.contentDocument;
    if(!doc?.head)return;
    let style=doc.getElementById('mohajer-editor-runtime-fix');
    if(!style){style=doc.createElement('style');style.id='mohajer-editor-runtime-fix';doc.head.appendChild(style)}
    style.textContent='.mh-w{left:-7px!important;top:calc(50% - 5px)!important}.mh-e{right:-7px!important;top:calc(50% - 5px)!important}.mh-n{left:calc(50% - 5px)!important;top:-7px!important}.mh-s{left:calc(50% - 5px)!important;bottom:-7px!important}';
    let data={};try{data=JSON.parse(localStorage.getItem(STORAGE)||'{}')}catch{}
    const drafts=data.drafts?.[location.hash||location.pathname]||data.drafts?.[document.location.pathname]||{};
    Object.entries(drafts||{}).forEach(([key,d])=>{
      if(!d?.customCss||!d.stableId)return;
      const id='mohajer-custom-'+String(d.stableId).replace(/[^a-zA-Z0-9_-]/g,'');
      let s=doc.getElementById(id);
      if(!s){s=doc.createElement('style');s.id=id;doc.head.appendChild(s)}
      s.textContent=`[data-mohajer-editor-id="${String(d.stableId).replace(/"/g,'')} "]{${d.customCss}}`.replace(' "]','"]');
    });
  };
  document.addEventListener('DOMContentLoaded',()=>{const f=document.getElementById('preview');f?.addEventListener('load',()=>setTimeout(fix,100));setInterval(fix,1200)});
})();