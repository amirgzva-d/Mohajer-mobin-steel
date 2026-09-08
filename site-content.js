(() => {
  'use strict';
  const revealSite = () => document.documentElement.classList.remove('site-content-loading');
  const revealTimeout = window.setTimeout(revealSite, 2500);
  if (!window.firebase || !window.MOHAJER_FIREBASE_CONFIG) { window.clearTimeout(revealTimeout); revealSite(); return; }
  const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(window.MOHAJER_FIREBASE_CONFIG);
  const safeText = (el, value) => { const lines=String(value||'').split(/<br\s*\/?>/i); el.replaceChildren(); lines.forEach((line,i)=>{if(i)el.append(document.createElement('br'));el.append(document.createTextNode(line));}); };
  const validImage = value => /^(https?:\/\/|\/|data:image\/(png|jpeg|webp|gif);base64,)/i.test(String(value||''));
  const find = selector => { try{return document.querySelector(selector);}catch{return null;} };
  const applyContent = drafts => Object.values(drafts||{}).forEach(draft=>{
    if(!draft?.selector)return; const element=find(draft.selector); if(!element)return;
    if(draft.type==='image' && validImage(draft.content)) element.src=draft.content;
    else if(['text','link','heading','paragraph','button'].includes(draft.type)) safeText(element,draft.content);
    Object.entries(draft.styles||{}).forEach(([property,value])=>{if(value!==''&&value!=null&&/^[a-zA-Z-]+$/.test(property))element.style.setProperty(property,value);});
    if(draft.hidden)element.style.setProperty('display','none','important');
    if(draft.link && element.closest('a')){element.closest('a').href=draft.link;if(draft.newTab)element.closest('a').target='_blank';}
    if(draft.animation?.name){element.style.animationName=draft.animation.name;element.style.animationDuration=draft.animation.duration||'600ms';element.style.animationDelay=draft.animation.delay||'0ms';element.style.animationFillMode='both';}
  });
  const applyStructure = operations => (operations||[]).forEach(op=>{
    if(op.action==='delete'){const el=find(op.selector);if(el)el.remove();return;}
    if(op.action==='add' && op.html && !document.querySelector(`[data-mohajer-created="${CSS.escape(op.id)}"]`)){
      const parent=find(op.parentSelector)||document.body; const template=document.createElement('template'); template.innerHTML=op.html.trim(); const el=template.content.firstElementChild;
      if(el){el.dataset.mohajerCreated=op.id;if(op.position==='first')parent.insertBefore(el,parent.firstChild);else parent.appendChild(el);}
    }
  });
  const applySEO = seo => {if(!seo)return; const set=(selector,attr,value)=>{if(!value)return;let el=document.head.querySelector(selector);if(!el){el=document.createElement('meta');if(attr==='name')el.name=selector.match(/name="([^"]+)/)?.[1]||'';document.head.append(el);}el.setAttribute('content',value);}; if(seo.title)document.title=seo.title;set('meta[name="description"]','name',seo.description);set('meta[name="robots"]','name',seo.robots); if(seo.canonical){let c=document.head.querySelector('link[rel="canonical"]');if(!c){c=document.createElement('link');c.rel='canonical';document.head.append(c);}c.href=seo.canonical;}set('meta[property="og:image"]','property',seo.ogImage);};
  const load = () => app.firestore().collection('siteContent').doc('published').get().then(snapshot=>{if(snapshot.exists){const data=snapshot.data()||{};applyStructure(data.meta?.structure);applyContent(data.content);applySEO(data.meta?.seo);}}).catch(error=>console.warn('Published site content could not be loaded.',error)).finally(()=>{window.clearTimeout(revealTimeout);revealSite();});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
})();
