(() => {
'use strict';
const attach=()=>{const f=document.getElementById('preview');const w=f?.contentWindow;if(!w||w.__mhSelectionBridge)return;w.__mhSelectionBridge=true;w.addEventListener('click',e=>{const el=e.target?.closest?.('[data-mohajer-editor-id],[data-key],h1,h2,h3,h4,h5,h6,p,span,a,button,img,svg,i,em,strong,b,label,figure,figcaption,input,select,textarea,video,section,article,header,footer,main,nav,aside,li,ul,ol,table,th,td');if(el&&!el.closest('[data-editor-ui]'))window.MohajerEditorInteraction?.setSelected(el)},true)};
const f=document.getElementById('preview');if(f){f.addEventListener('load',()=>setTimeout(attach,20));setTimeout(attach,80)}
})();
