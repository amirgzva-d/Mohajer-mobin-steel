(() => {
  'use strict';
  const reveal=()=>document.documentElement.classList.remove('site-content-loading');
  const timer=setTimeout(reveal,3000);
  const path=location.pathname.endsWith('/')?location.pathname:location.pathname+'/';
  const safeUrl=v=>/^(https?:\/\/|\/)/i.test(String(v||''));
  const validImage=v=>/^(https?:\/\/|\/|data:image\/(png|jpeg|webp|gif);base64,)/i.test(String(v||''));
  const find=s=>{try{return s?document.querySelector(s):null}catch{return null}};
  const cssName=p=>String(p).replace(/[A-Z]/g,m=>'-'+m.toLowerCase());
  const allowedStyle=new Set(['color','textAlign','textTransform','fontSize','fontWeight','lineHeight','letterSpacing','opacity','margin','padding','gap','width','height','minWidth','maxWidth','position','zIndex','border','borderRadius','boxShadow','backgroundColor','backgroundImage','backgroundSize','backgroundPosition','animationName','animationDuration','animationDelay','animationFillMode']);
  const applyStyles=(el,styles)=>Object.entries(styles||{}).forEach(([p,v])=>{if(allowedStyle.has(p)&&v!==''&&v!=null)el.style.setProperty(cssName(p),String(v))});
  const setText=(el,v)=>{const lines=String(v??'').split(/<br\s*\/?\s*>/i);el.replaceChildren();lines.forEach((x,i)=>{if(i)el.append(document.createElement('br'));el.append(document.createTextNode(x))})};
  const resolve=d=>{let e=find(d.selector);if(!e&&d.fallbackSelector)e=find(d.fallbackSelector);if(e&&d.stableId)e.dataset.mohajerEditorId=String(d.stableId);return e};
  const applyDrafts=drafts=>Object.values(drafts||{}).forEach(d=>{if(!d?.selector)return;const e=resolve(d);if(!e)return;if(d.type==='image'&&validImage(d.content))e.src=d.content;else if(['text','link','heading','paragraph','button'].includes(d.type))setText(e,d.content);applyStyles(e,d.styles);applyStyles(e,d.responsive?.desktop||{});if(d.hidden)e.style.setProperty('display','none','important');if(d.alt&&e.tagName==='IMG')e.alt=d.alt;if(d.link&&(e.tagName==='A'||e.closest('a'))&&safeUrl(d.link)){const a=e.tagName==='A'?e:e.closest('a');a.href=d.link;if(d.newTab)a.target='_blank'}if(d.hover?.scale&&d.hover.scale!=='1'){e.style.setProperty('--mohajer-hover-scale',d.hover.scale);e.dataset.mohajerHoverScale=d.hover.scale}});
  const allowedTags=new Set(['DIV','SECTION','ARTICLE','HEADER','FOOTER','MAIN','NAV','ASIDE','H1','H2','H3','H4','H5','H6','P','SPAN','A','BUTTON','IMG','HR','UL','OL','LI','TABLE','THEAD','TBODY','TR','TH','TD','VIDEO']);
  const sanitize=e=>{if(!allowedTags.has(e.tagName)){e.replaceWith(...Array.from(e.childNodes));return}Array.from(e.attributes).forEach(a=>{const n=a.name.toLowerCase();if(n.startsWith('on')||n==='srcdoc'||(n==='href'&&!safeUrl(a.value))||(n==='src'&&!safeUrl(a.value)))e.removeAttribute(a.name)});Array.from(e.children).forEach(sanitize)};
  const applyStructure=ops=>(ops||[]).filter(o=>o.page===path||!o.page).forEach(o=>{try{if(!o.id)return;const marker=`[data-mohajer-created="${CSS.escape(String(o.id))}"]`;if(o.action==='delete'){(find(marker)||find(o.selector)||find(o.fallbackSelector))?.remove();return}if(o.action==='move'){const e=find(o.selector)||find(o.fallbackSelector),p=find(o.parentSelector)||find(o.parentFallbackSelector);if(e&&p)p.appendChild(e);return}if(o.action==='add'&&o.html&&!find(marker)){const p=find(o.parentSelector)||find(o.parentFallbackSelector)||document.body,t=document.createElement('template');t.innerHTML=String(o.html).trim();const e=t.content.firstElementChild;if(e){sanitize(e);e.dataset.mohajerCreated=String(o.id);p.appendChild(e)}}}catch(e){console.warn('structure operation skipped',e)}});
  const setMeta=(selector,attr,value)=>{let e=document.head.querySelector(selector);if(!e){e=document.createElement('meta');const m=selector.match(/(?:name|property)="([^"]+)/);if(m)e.setAttribute(attr,m[1]);document.head.append(e)}if(value!=null)e.setAttribute('content',String(value))};
  const applySEO=seo=>{seo=seo||{};if(seo.title)document.title=seo.title;setMeta('meta[name="description"]','name',seo.description||'');setMeta('meta[name="robots"]','name',seo.indexable===false||seo.noindex?'noindex,nofollow':(seo.robots||'index,follow'));setMeta('meta[property="og:title"]','property',seo.ogTitle||seo.title||document.title);setMeta('meta[property="og:description"]','property',seo.ogDescription||seo.description||'');if(seo.ogImage&&validImage(seo.ogImage))setMeta('meta[property="og:image"]','property',seo.ogImage);if(seo.canonical&&safeUrl(seo.canonical)){let c=document.head.querySelector('link[rel="canonical"]');if(!c){c=document.createElement('link');c.rel='canonical';document.head.append(c)}c.href=seo.canonical}};
  if(!window.firebase||!window.MOHAJER_FIREBASE_CONFIG){clearTimeout(timer);reveal();return}
  try{
    const app=firebase.apps.length?firebase.app():firebase.initializeApp(window.MOHAJER_FIREBASE_CONFIG);
    app.firestore().collection('siteContent').doc('published').get().then(s=>{
      if(!s.exists)return;
      const d=s.data()||{},content=d.content||{},meta=d.meta||{},pages=content.pages||{};
      let page=pages[path];
      if(!page&&path==='/' )page=pages['/'];
      if(!page&&Object.keys(pages).length===0)page={drafts:content,meta};
      if(!page)return;
      const pageDrafts=page.drafts||page.content||page;
      applyDrafts(pageDrafts);
      const pm=meta.pages?.[path]||page.meta||{};
      applyStructure(meta.structure||page.structure);
      applySEO({...meta.seo,...pm,indexable:pm.indexable!==false});
    }).catch(e=>console.warn('Published editor content unavailable',e)).finally(()=>{clearTimeout(timer);reveal()});
  }catch(e){console.warn(e);clearTimeout(timer);reveal()}
})();