// notification.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-app.js";
import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-messaging.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

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

// راه‌اندازی فایربیس
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const db = getFirestore(app);

// توجه: کلید VAPID را از پنل فایربیس بگیرید و اینجا جایگزین کنید
const VAPID_KEY = "VAPID_KEY_HERE"; 

document.addEventListener('DOMContentLoaded', () => {
    const notifyBtn = document.getElementById('btn-notify-price');
    const modal = document.getElementById('notifyModal');
    const closeBtn = document.getElementById('closeNotifyModal');
    const submitBtn = document.getElementById('submitNotifyBtn');
    const msgBox = document.getElementById('notifyMessage');

    // باز کردن مودال
    if(notifyBtn) {
        notifyBtn.addEventListener('click', () => {
            modal.style.display = 'flex';
            msgBox.style.display = 'none';
        });
    }

    // بستن مودال
    if(closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // ثبت اطلاعات و درخواست اجازه
    if(submitBtn) {
        submitBtn.addEventListener('click', async () => {
            const name = document.getElementById('notifyName').value.trim();
            const phone = document.getElementById('notifyPhone').value.trim();

            if(!name || !phone) {
                showMessage('لطفاً نام و شماره موبایل را وارد کنید.', 'error');
                return;
            }

            submitBtn.innerText = "در حال پردازش...";
            submitBtn.disabled = true;

            try {
                // درخواست اجازه از مرورگر
                const permission = await Notification.requestPermission();
                
                if (permission === 'granted') {
                    // گرفتن توکن
                    const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
                    
                    if (currentToken) {
                        // ذخیره در دیتابیس Firestore
                        await addDoc(collection(db, "subscribers"), {
                            name: name,
                            phone: phone,
                            fcmToken: currentToken,
                            timestamp: new Date()
                        });

                        showMessage('ثبت‌نام با موفقیت انجام شد! اعلان‌ها را دریافت خواهید کرد.', 'success');
                        setTimeout(() => { modal.style.display = 'none'; }, 3000);
                    } else {
                        showMessage('خطا در دریافت توکن. لطفاً دوباره تلاش کنید.', 'error');
                    }
                } else {
                    showMessage('شما اجازه ارسال اعلان را ندادید!', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showMessage('خطایی رخ داد. لطفاً اتصال اینترنت را بررسی کنید.', 'error');
            } finally {
                submitBtn.innerText = "ثبت و دریافت اعلان";
                submitBtn.disabled = false;
            }
        });
    }

    function showMessage(text, type) {
        msgBox.innerText = text;
        msgBox.style.display = 'block';
        msgBox.className = type === 'success' ? 'notify-msg-success' : 'notify-msg-error';
    }
});
