// notification.js - سیستم اطلاع‌رسانی قیمت فولاد
// این فایل باید به صورت type="module" در HTML لود شود

console.log("🔔 notification.js loaded");

// منتظر می‌مانیم تا DOM کامل لود شود
document.addEventListener('DOMContentLoaded', function() {
    console.log("✅ DOM fully loaded");
    
    // وارد کردن ماژول‌های فایربیس
    import("https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js").then(({ initializeApp }) => {
        import("https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging.js").then(({ getMessaging, getToken, onMessage }) => {
            import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js").then(({ getFirestore, doc, setDoc, getDoc, serverTimestamp }) => {
                
                initFirebase(initializeApp, getMessaging, getToken, onMessage, getFirestore, doc, setDoc, getDoc, serverTimestamp);
            });
        });
    });
});

function initFirebase(initializeApp, getMessaging, getToken, onMessage, getFirestore, doc, setDoc, getDoc, serverTimestamp) {
    // تنظیمات اختصاصی پروژه فایربیس
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

    // کلید VAPID
    const VAPID_KEY = "BG0jPjyUSCcW85BHFb5QVk1KmGSpRK84rlyHnuxTSfXEjXmAN1I5DYno6nnpmkBWy7aNHCG1Gga7IUD1J44Z_XQ";

    // ثبت Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/firebase-messaging-sw.js')
            .then((registration) => {
                console.log('✅ Service Worker registered:', registration);
            })
            .catch((error) => {
                console.error('❌ Service Worker registration failed:', error);
            });
    }

    // پیدا کردن عناصر DOM
    const notifyBtn = document.getElementById('btn-notify-price');
    const notifyModal = document.getElementById('notifyModal');
    const closeBtn = document.getElementById('closeNotifyModal');
    const submitBtn = document.getElementById('submitNotifyBtn');
    const msgBox = document.getElementById('notifyMessage');

    console.log("🔍 Elements found:", {
        notifyBtn: !!notifyBtn,
        notifyModal: !!notifyModal,
        closeBtn: !!closeBtn,
        submitBtn: !!submitBtn,
        msgBox: !!msgBox
    });

    // باز کردن Modal با کلیک روی دکمه
    if (notifyBtn && notifyModal) {
        notifyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("🔔 Notify button clicked!");
            notifyModal.style.display = 'flex';
            if (msgBox) msgBox.style.display = 'none';
        });
    } else {
        console.error("❌ Button or Modal not found!");
    }

    // بستن Modal با دکمه ضربدر
    if (closeBtn && notifyModal) {
        closeBtn.addEventListener('click', function() {
            notifyModal.style.display = 'none';
        });
    }

    // بستن Modal با کلیک بیرون از کادر
    if (notifyModal) {
        window.addEventListener('click', function(e) {
            if (e.target === notifyModal) {
                notifyModal.style.display = 'none';
            }
        });
    }

    // تابع نمایش پیام
    function showMessage(text, isError = false) {
        if (!msgBox) return;
        msgBox.textContent = text;
        msgBox.style.display = 'block';
        msgBox.style.color = isError ? '#ef4444' : '#10b981';
    }

    // عملیات ثبت اطلاعات
    if (submitBtn) {
        submitBtn.addEventListener('click', async function() {
            const nameInput = document.getElementById('notifyName');
            const phoneInput = document.getElementById('notifyPhone');
            const emailInput = document.getElementById('notifyEmail');
            
            if (!nameInput || !phoneInput) {
                showMessage('خطا: فیلدهای فرم پیدا نشدند.', true);
                return;
            }

            const name = nameInput.value.trim();
            const phone = phoneInput.value.trim();
            const email = emailInput ? emailInput.value.trim() : '';

            if (!name) {
                showMessage('لطفاً نام خود را وارد کنید.', true);
                return;
            }

            if (!phone) {
                showMessage('لطفاً شماره موبایل خود را وارد کنید.', true);
                return;
            }

            // غیرفعال کردن دکمه
            submitBtn.disabled = true;
            submitBtn.textContent = 'در حال پردازش...';

            try {
                // بررسی HTTPS
                if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
                    throw new Error('سایت باید با HTTPS اجرا شود.');
                }

                // ۱. درخواست اجازه برای ارسال نوتیفیکیشن
                console.log("📬 Requesting notification permission...");
                const permission = await Notification.requestPermission();
                console.log("📬 Permission result:", permission);
                
                if (permission !== 'granted') {
                    throw new Error('اجازه ارسال اعلان داده نشد. لطفاً در تنظیمات مرورگر اجازه دهید.');
                }

                // ۲. دریافت توکن فایربیس
                console.log("🔑 Getting Firebase token...");
                const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });
                console.log("🔑 Token received:", currentToken ? "Yes" : "No");

                if (!currentToken) {
                    throw new Error('خطا در دریافت توکن. لطفاً صفحه را رفرش کنید.');
                }

                // ۳. بررسی تکراری بودن
                const userDocRef = doc(db, "subscribers", currentToken);
                const docSnap = await getDoc(userDocRef);

                if (docSnap.exists()) {
                    showMessage('✅ شما قبلاً عضو اطلاع‌رسانی قیمت شده‌اید.');
                } else {
                    // ۴. ذخیره در Firestore
                    console.log("💾 Saving to Firestore...");
                    await setDoc(userDocRef, {
                        name: name,
                        phone: phone,
                        email: email || 'ثبت نشده',
                        token: currentToken,
                        subscribedAt: serverTimestamp(),
                        userAgent: navigator.userAgent,
                        timestamp: new Date().toISOString()
                    });
                    
                    showMessage('✅ ثبت‌نام با موفقیت انجام شد! از این پس تغییرات قیمت به شما اطلاع داده می‌شود.');
                    
                    // خالی کردن فرم
                    nameInput.value = '';
                    phoneInput.value = '';
                    if (emailInput) emailInput.value = '';
                }
            } catch (error) {
                console.error('❌ Error:', error);
                let errorMsg = 'خطا در فعال‌سازی اعلان.';
                if (error.message.includes('HTTPS')) {
                    errorMsg = '⚠️ سایت باید با HTTPS اجرا شود. لطفاً از آدرس https://mohajer-steel.com استفاده کنید.';
                } else if (error.message.includes('اجازه')) {
                    errorMsg = error.message;
                }
                showMessage(errorMsg, true);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'ثبت و دریافت اعلان';
            }
        });
    }

    // دریافت پیام در foreground
    onMessage(messaging, (payload) => {
        console.log('📨 Message received in foreground:', payload);
        if (payload.notification) {
            showMessage(`🔔 ${payload.notification.title}: ${payload.notification.body}`);
        }
    });

    console.log("✅ Firebase notification system initialized!");
}
