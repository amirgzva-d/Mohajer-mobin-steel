// وارد کردن کتابخانه‌های فایربیس برای Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// تنظیمات اختصاصی پروژه فایربیس شما
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

// مدیریت کلیک روی نوتیفیکیشن
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    
    // لینکی که با کلیک روی اعلان باز می‌شود (صفحه فروش ویژه)
    const targetUrl = 'https://mohajer-steel.com/#specialSaleView';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            // اگر سایت از قبل باز است، روی آن تب فوکوس کن
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url.includes('mohajer-steel.com') && 'focus' in client) {
                    return client.focus();
                }
            }
            // اگر سایت باز نیست، یک تب جدید باز کن
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});

// دریافت پیام در پس‌زمینه و نمایش آن
messaging.onBackgroundMessage(function(payload) {
    console.log('پیام در پس‌زمینه دریافت شد: ', payload);

    const notificationTitle = payload.notification.title || 'قیمت محصولات فولادی بروزرسانی شد';
    const notificationOptions = {
        body: payload.notification.body || 'قیمت جدید محصولات فولادی و فروش ویژه امروز بروزرسانی شد',
        icon: '/512.png', // آیکون سایت شما
        badge: '/192.png',
        dir: 'rtl'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
