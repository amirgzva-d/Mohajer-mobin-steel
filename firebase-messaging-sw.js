// firebase-messaging-sw.js

// وارد کردن کتابخانه‌های فایربیس مخصوص Service Worker
importScripts('https://www.gstatic.com/firebasejs/12.17.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.17.0/firebase-messaging-compat.js');

// تنظیمات فایربیس شما
const firebaseConfig = {
  apiKey: "AIzaSyAv1nf2Fa2upW4OZ-RTDEn98YNbn7WngfQ",
  authDomain: "steel-price-notify.firebaseapp.com",
  projectId: "steel-price-notify",
  storageBucket: "steel-price-notify.firebasestorage.app",
  messagingSenderId: "31744693392",
  appId: "1:31744693392:web:6bbf4d7f7f8c6843d7f415",
  measurementId: "G-2V24CVNSCW"
};

// راه‌اندازی فایربیس در پس‌زمینه
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// دریافت پیام در پس‌زمینه و نمایش آن
messaging.onBackgroundMessage(function(payload) {
  console.log('پیام در پس‌زمینه دریافت شد: ', payload);

  // متنی که درخواست کرده بودید
  const notificationTitle = "قیمت محصولات فولادی بروزرسانی شد";
  const notificationOptions = {
    body: payload.notification?.body || "برای مشاهده قیمت‌های جدید کلیک کنید.",
    icon: '/512.png', // آیکون سایت شما
    data: {
      url: '/#specialSaleView' // آدرس بخش فروش ویژه
    }
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// مدیریت کلیک کاربر روی اعلان
self.addEventListener('notificationclick', function(event) {
  event.notification.close(); // بستن اعلان پس از کلیک

  // هدایت کاربر به لینک ذخیره شده (بخش فروش ویژه)
  const urlToOpen = event.notification.data.url || '/#specialSaleView';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // اگر تب سایت از قبل باز است، روی آن فوکوس کن
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      // اگر تب باز نیست، یک تب جدید باز کن
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
