(() => {
  'use strict';

  const revealSite = () => document.documentElement.classList.remove('site-content-loading');
  const revealTimeout = window.setTimeout(revealSite, 2500);

  if (!window.firebase || !window.MOHAJER_FIREBASE_CONFIG) {
    window.clearTimeout(revealTimeout);
    revealSite();
    return;
  }

  const app = firebase.apps.length
    ? firebase.app()
    : firebase.initializeApp(window.MOHAJER_FIREBASE_CONFIG);

  const setSafeText = (element, value) => {
    const lines = String(value ?? '').split(/<br\s*\/?\s*>/i);
    element.replaceChildren();
    lines.forEach((line, index) => {
      if (index) element.append(document.createElement('br'));
      element.append(document.createTextNode(line));
    });
  };

  const safeUrl = value => /^(https?:\/\/|\/)/i.test(String(value || ''));
  const validImage = value => /^(https?:\/\/|\/|data:image\/(png|jpeg|webp|gif);base64,)/i.test(String(value || ''));
  const find = selector => {
    try { return selector ? document.querySelector(selector) : null; } catch { return null; }
  };
  const cssName = property => String(property).replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
  const allowedStyle = new Set([
    'color','textAlign','textTransform','fontSize','fontWeight','lineHeight','letterSpacing','opacity',
    'margin','padding','gap','width','height','minWidth','maxWidth','position','zIndex','border',
    'borderRadius','boxShadow','backgroundColor','backgroundImage','backgroundSize','backgroundPosition',
    'animationName','animationDuration','animationDelay','animationFillMode'
  ]);

  const applyStyles = (element, styles) => Object.entries(styles || {}).forEach(([property, value]) => {
    if (!allowedStyle.has(property) || value === '' || value == null) return;
    element.style.setProperty(cssName(property), String(value));
  });

  const applyPublishedContent = drafts => Object.values(drafts || {}).forEach(draft => {
    if (!draft?.selector) return;
    const element = find(draft.selector);
    if (!element) return;

    if (draft.type === 'image' && validImage(draft.content)) {
      element.src = draft.content;
    } else if (['text','link','heading','paragraph','button'].includes(draft.type)) {
      setSafeText(element, draft.content);
    }

    // Keep the legacy editor behavior intact. New editor schema v6 adds the
    // expanded style set; older drafts keep the original safety restriction.
    if (Number(draft.schemaVersion || 0) >= 6) {
      applyStyles(element, draft.styles);
      const desktop = draft.responsive?.desktop || {};
      applyStyles(element, desktop);
    } else {
      const legacyStyles = draft.type === 'text' && draft.schemaVersion !== 3 ? {} : draft.styles;
      Object.entries(legacyStyles || {}).forEach(([property, value]) => {
        if (!value || !/^(color|textAlign|backgroundColor|backgroundImage|backgroundSize|backgroundPosition|width|height|borderRadius)$/.test(property)) return;
        element.style.setProperty(property.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`), value);
      });
    }

    if (draft.hidden) element.style.setProperty('display', 'none', 'important');

    if (draft.link && (element.tagName === 'A' || element.closest('a')) && safeUrl(draft.link)) {
      const link = element.tagName === 'A' ? element : element.closest('a');
      link.href = draft.link;
      if (draft.newTab) link.target = '_blank';
    }

    if (draft.hover?.scale && draft.hover.scale !== '1') {
      element.style.setProperty('--mohajer-hover-scale', draft.hover.scale);
      element.dataset.mohajerHoverScale = draft.hover.scale;
    }
  });

  const allowedTags = new Set([
    'DIV','SECTION','ARTICLE','HEADER','FOOTER','MAIN','NAV','ASIDE',
    'H1','H2','H3','H4','H5','H6','P','SPAN','A','BUTTON','IMG','HR',
    'UL','OL','LI','TABLE','THEAD','TBODY','TR','TH','TD','VIDEO'
  ]);

  const sanitizeTree = element => {
    if (!allowedTags.has(element.tagName)) {
      element.replaceWith(...Array.from(element.childNodes));
      return;
    }
    Array.from(element.attributes).forEach(attribute => {
      const name = attribute.name.toLowerCase();
      if (name.startsWith('on') || name === 'srcdoc' ||
          (name === 'href' && !safeUrl(attribute.value)) ||
          (name === 'src' && !safeUrl(attribute.value))) {
        element.removeAttribute(attribute.name);
      }
    });
    Array.from(element.children).forEach(sanitizeTree);
  };

  const applyStructure = operations => (operations || []).forEach(operation => {
    if (!operation?.id) return;
    const marker = `[data-mohajer-created="${CSS.escape(String(operation.id))}"]`;

    if (operation.action === 'delete') {
      const element = document.querySelector(marker) || find(operation.selector);
      if (element) element.remove();
      return;
    }

    if (operation.action === 'add' && operation.html && !document.querySelector(marker)) {
      const parent = find(operation.parentSelector) || document.body;
      const template = document.createElement('template');
      template.innerHTML = String(operation.html).trim();
      const element = template.content.firstElementChild;
      if (!element || !allowedTags.has(element.tagName)) return;
      sanitizeTree(element);
      element.dataset.mohajerCreated = String(operation.id);
      if (operation.position === 'first') parent.insertBefore(element, parent.firstChild);
      else parent.appendChild(element);
    }
  });

  const setMeta = (selector, attribute, value) => {
    if (!value) return;
    let element = document.head.querySelector(selector);
    if (!element) {
      element = document.createElement('meta');
      if (attribute === 'name') element.name = selector.match(/name="([^"]+)/)?.[1] || '';
      if (attribute === 'property') element.setAttribute('property', selector.match(/property="([^"]+)/)?.[1] || '');
      document.head.append(element);
    }
    element.setAttribute('content', String(value));
  };

  const applySEO = seo => {
    if (!seo) return;
    if (seo.title) document.title = seo.title;
    setMeta('meta[name="description"]', 'name', seo.description);
    setMeta('meta[name="robots"]', 'name', seo.noindex ? 'noindex,nofollow' : seo.robots);
    setMeta('meta[property="og:title"]', 'property', seo.ogTitle || seo.title);
    setMeta('meta[property="og:description"]', 'property', seo.ogDescription || seo.description);
    if (seo.ogImage && validImage(seo.ogImage)) setMeta('meta[property="og:image"]', 'property', seo.ogImage);
    if (seo.canonical && safeUrl(seo.canonical)) {
      let canonical = document.head.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.append(canonical);
      }
      canonical.href = seo.canonical;
    }
  };

  const loadPublishedContent = () => app.firestore().collection('siteContent').doc('published').get()
    .then(snapshot => {
      if (!snapshot.exists) return;
      const data = snapshot.data() || {};
      applyStructure(data.meta?.structure);
      applyPublishedContent(data.content);
      applySEO(data.meta?.seo);
    })
    .catch(error => console.warn('Published site content could not be loaded.', error))
    .finally(() => {
      window.clearTimeout(revealTimeout);
      revealSite();
    });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPublishedContent, { once: true });
  } else {
    loadPublishedContent();
  }
})();
