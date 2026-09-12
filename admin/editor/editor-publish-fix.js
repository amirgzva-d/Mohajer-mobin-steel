(() => {
  'use strict';
  const hook=()=>{
    const b=document.getElementById('confirmPublish');
    if(!b)return;
    b.onclick=async()=>{
      try{
        if(!window.firebase?.apps?.length)throw Error('Firebase آماده نیست');
        const auth=firebase.auth(),db=firebase.firestore();
        if(!auth.currentUser)throw Error('حساب مدیریت وارد نشده');
        let local={};try{local=JSON.parse(localStorage.getItem('mohajer-editor-pro-v10')||'{}')}catch{}
        const draft=await db.collection('siteContent').doc('draft').get();
        const draftData=draft.exists?draft.data():{};
        const allPages={...(draftData.content?.pages||{}),...(local.drafts||{})};
        const meta={...(draftData.meta||{}),...(local.pageMeta||{})};
        const liveRef=db.collection('siteContent').doc('published'),live=await liveRef.get(),old=live.exists?live.data()||{}:{};
        const oldPages=old.content?.pages||((old.content&&typeof old.content==='object')?{[old.page||'/products/steel-billet/']:old.content}:{});
        const mergedPages={...oldPages,...allPages};
        const version='v-'+Date.now();
        await db.collection('siteVersions').doc(version).set({content:old.content||{},meta:old.meta||{},page:old.page||'/',versionId:version,createdAt:firebase.firestore.FieldValue.serverTimestamp(),createdBy:auth.currentUser.uid,source:'pre-publish',schemaVersion:10});
        await liveRef.set({content:{pages:mergedPages},meta,versionId:version,updatedAt:firebase.firestore.FieldValue.serverTimestamp(),updatedBy:auth.currentUser.uid,schemaVersion:10});
        document.getElementById('publishDialog')?.close();
        document.getElementById('toast').textContent='انتشار موفق بود؛ تمام صفحات Draft حفظ شدند';document.getElementById('toast').classList.add('show');setTimeout(()=>document.getElementById('toast')?.classList.remove('show'),3200);
      }catch(e){console.error(e);alert('انتشار ناموفق بود: '+e.message)}
    };
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(hook,50));else setTimeout(hook,50);
})();