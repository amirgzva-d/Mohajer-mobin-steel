importScripts('https://www.gstatic.com/firebasejs/12.17.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.17.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBMV9795BMVLqtAU2RAZ63TWQAwp5XY3xY',
  authDomain: 'steel-price-notify.firebaseapp.com',
  projectId: 'steel-price-notify',
  storageBucket: 'steel-price-notify.firebasestorage.app',
  messagingSenderId: '31744693392',
  appId: '1:31744693392:web:d0eaaf2cec213532893595',
  measurementId: 'G-2V24CVNSCW'
});

firebase.messaging();

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const targetUrl = new URL(event.notification.data?.url || '/', self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      const openClient = windowClients.find(client => client.url.startsWith(self.location.origin));
      if (openClient) {
        openClient.navigate(targetUrl);
        return openClient.focus();
      }
      return clients.openWindow(targetUrl);
    })
  );
});
