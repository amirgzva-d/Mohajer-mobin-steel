(() => {
  const revealSite = () => document.documentElement.classList.remove('site-content-loading');
  // Do not leave the page hidden if Firebase is blocked or a request stalls.
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
    const lines = String(value || '').split(/<br\s*\/?>/i);
    element.replaceChildren();
    lines.forEach((line, index) => {
      if (index) element.append(document.createElement('br'));
      element.append(document.createTextNode(line));
    });
  };

  const applyPublishedContent = drafts => {
    Object.values(drafts || {}).forEach(draft => {
      if (!draft?.selector) return;
      let element;
      try {
        element = document.querySelector(draft.selector);
      } catch {
        return;
      }
      if (!element) return;

      if (draft.type === 'image' && /^(https?:\/\/|data:image\/(png|jpeg|webp|gif);base64,)/i.test(draft.content || '')) {
        element.src = draft.content;
      } else if (draft.type === 'text') {
        setSafeText(element, draft.content);
      }

      // Drafts created before schema 3 could attach computed styles to a text-only
      // edit. Ignore those legacy text styles so wording changes cannot alter the
      // site's existing color, background, alignment, or dimensions.
      const styles = draft.type === 'text' && draft.schemaVersion !== 3 ? {} : draft.styles;
      Object.entries(styles || {}).forEach(([property, value]) => {
        if (!value || !/^(color|textAlign|backgroundColor|backgroundImage|backgroundSize|backgroundPosition|width|height|borderRadius)$/.test(property)) return;
        element.style[property] = value;
      });
    });
  };

  const loadPublishedContent = () => {
    app.firestore().collection('siteContent').doc('published').get()
      .then(snapshot => {
        if (snapshot.exists) applyPublishedContent(snapshot.data().content);
      })
      .catch(error => console.warn('Published site content could not be loaded.', error))
      .finally(() => {
        window.clearTimeout(revealTimeout);
        revealSite();
      });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPublishedContent, { once: true });
  } else {
    loadPublishedContent();
  }
})();
