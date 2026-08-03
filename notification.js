console.log("notification.js loaded");
// وارد کردن ماژول‌های فایربیس
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging.js";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

// راه‌اندازی فایربیس
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const db = getFirestore(app);

// ⚠️ کلید VAPID خود را اینجا قرار دهید ⚠️
const VAPID_KEY = "BG0jPjyUSCcW85BHFb5QVk1KmGSpRK84rlyHnuxTSfXEjXmAN1I5DYno6nnpmkBWy7aNHCG1Gga7IUD1J44Z_XQ";

// عناصر DOM (ارتباط با HTML)
const notifyBtn = document.getElementById('btn-notify-price');
const notifyModal = document.getElementById('notifyModal');
const closeBtn = document.getElementById('closeNotifyModal');
const submitBtn = document.getElementById('submitNotifyBtn');
const msgBox = document.getElementById('notifyMessage');

// باز کردن Modal
if (notifyBtn) {
    notifyBtn.addEventListener('click', () => {
        notifyModal.style.display = 'flex';
        msgBox.style.display = 'none';
    });
}

// بستن Modal با دکمه ضربدر
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        notifyModal.style.display = 'none';
    });
}

// بستن Modal با کلیک بیرون از کادر
window.addEventListener('click', (e) => {
    if (e.target === notifyModal) {
        notifyModal.style.display = 'none';
    }
});

// تابع نمایش پیام به کاربر
function showMessage(text, isError = false) {
    msgBox.textContent = text;
    msgBox.style.display = 'block';
    msgBox.style.color = isError ? '#ef4444' : '#10b981';
}

// عملیات ثبت اطلاعات
submitBtn.addEventListener('click', async () => {
    const name = document.getElementById('notifyName').value.trim();
    const phone = document.getElementById('notifyPhone').value.trim();
    const email = document.getElementById('notifyEmail').value.trim();

    if (!name) {
        showMessage('لطفاً نام خود را وارد کنید.', true);
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'در حال ارتباط با سرور...';

    try {
        // ۱. درخواست اجازه برای ارسال نوتیفیکیشن از مرورگر
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            throw new Error('اجازه ارسال اعلان داده نشد.');
        }

        // ۲. دریافت توکن فایربیس
        const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
        
        if (currentToken) {
            // ۳. بررسی اینکه آیا کاربر قبلاً ثبت نام کرده است
            const userDocRef = doc(db, "subscribers", currentToken);
            const docSnap = await getDoc(userDocRef);

            if (docSnap.exists()) {
                showMessage('شما قبلاً عضو اطلاع‌رسانی قیمت شده‌اید.');
            } else {
                // ۴. ذخیره اطلاعات در دیتابیس Firestore
                await setDoc(userDocRef, {
                    name: name,
                    phone: phone || 'ثبت نشده',
                    email: email || 'ثبت نشده',
                    token: currentToken,
                    subscribedAt: serverTimestamp()
                });
                showMessage('ثبت‌نام با موفقیت انجام شد! از این پس تغییرات قیمت به شما اطلاع داده می‌شود.');
                
                // خالی کردن فرم
                document.getElementById('notifyName').value = '';
                document.getElementById('notifyPhone').value = '';
                document.getElementById('notifyEmail').value = '';
            }
        } else {
            throw new Error('خطا در دریافت توکن.');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('خطا در فعال‌سازی اعلان. لطفاً دسترسی مرورگر را بررسی کنید یا VAPID Key را چک کنید.', true);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'ثبت و دریافت اعلان';
    }
});

// دریافت پیام در زمانی که کاربر داخل سایت است (Foreground)
onMessage(messaging, (payload) => {
    console.log('پیام دریافت شد: ', payload);
    alert(`🔔 ${payload.notification.title}\n\n${payload.notification.body}`);
});
