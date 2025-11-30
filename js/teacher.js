// teacher.js
// Handles: checkbox enable, signature pad, save PNG, submit to Firebase DB

// --- Firebase config (use your existing config) ---
const firebaseConfig = {
  apiKey: "AIzaSyA7LDHKX4XKKfCEbgmpEDQ5NHj6XghxZlE",
  authDomain: "salalah-sharqiya-school.firebaseapp.com",
  projectId: "salalah-sharqiya-school",
  storageBucket: "salalah-sharqiya-school.firebasestorage.app",
  messagingSenderId: "540330149276",
  appId: "1:540330149276:web:228722d3f67b70ffa5f459"
};

window.addEventListener("DOMContentLoaded", () => {
  // init firebase
  if (typeof firebase === "undefined") {
    console.warn("Firebase not loaded.");
  } else {
    firebase.initializeApp(firebaseConfig);
    window.database = firebase.database();
  }

  // elements
  const agree = document.getElementById("agreeCheckbox");
  const nameInput = document.getElementById("teacherName");
  const specialty = document.getElementById("teacherSpecialty");
  const notes = document.getElementById("teacherNotes");
  const submitBtn = document.getElementById("submitBtn");
  const resetBtn = document.getElementById("resetBtn");
  const status = document.getElementById("statusMessage");

  // signature pad setup
  const canvas = document.getElementById("signaturePad");
  const clearBtn = document.getElementById("clearSignature");
  const saveBtn = document.getElementById("saveSignature");
  const signaturePad = new SignaturePad(canvas, {
    backgroundColor: 'rgba(255,255,255,1)',
    penColor: 'rgb(18, 18, 18)'
  });

  // make canvas responsive to DPI
  function resizeCanvasToDisplaySize(canvas) {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.getContext("2d").scale(ratio, ratio);
  }
  function fixCanvas() {
    resizeCanvasToDisplaySize(canvas);
    signaturePad.clear();
  }
  window.addEventListener("resize", fixCanvas);
  fixCanvas();

  // enable / disable inputs based on checkbox
  function setFormEnabled(enabled) {
    [nameInput, specialty, notes].forEach(el => el.disabled = !enabled);
    submitBtn.disabled = !enabled;
    clearBtn.disabled = !enabled;
    saveBtn.disabled = !enabled;
  }
  setFormEnabled(false);

  agree.addEventListener("change", () => {
    setFormEnabled(agree.checked);
    if (agree.checked) {
      status.textContent = "موافق — الآن يمكنك تعبئة النموذج والتوقيع.";
      nameInput.focus();
    } else {
      status.textContent = "الرجاء الموافقة على التعهد أولاً.";
    }
  });

  // clear signature
  clearBtn.addEventListener("click", () => {
    signaturePad.clear();
  });

  // save signature as png (downloads)
  saveBtn.addEventListener("click", () => {
    if (signaturePad.isEmpty()) {
      alert("لا يوجد توقيع للرسم. الرجاء توقيع داخل المربع أولاً.");
      return;
    }
    const dataURL = signaturePad.toDataURL("image/png");
    // create download link
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = `signature_${(new Date()).toISOString().replace(/[:.]/g,'-')}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  });

  // form submit
  document.getElementById("teacherForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "";

    // validation
    const name = nameInput.value.trim();
    const spec = specialty.value.trim();
    const note = notes.value.trim();
    if (!name) { status.textContent = "الرجاء إدخال الاسم."; nameInput.focus(); return; }
    if (!spec) { status.textContent = "الرجاء اختيار التخصص."; specialty.focus(); return; }
    if (signaturePad.isEmpty()) {
      const ok = confirm("لم تقم بالتوقيع. هل تريد الإرسال بدون توقيع؟ اختر 'إلغاء' للتوقيع الآن.");
      if (!ok) return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "جارٍ الإرسال...";

    // gather data
    const data = {
      name,
      specialty: spec,
      notes: note || "",
      timestamp: new Date().toISOString(),
      signature: signaturePad.isEmpty() ? "" : signaturePad.toDataURL("image/png")
    };

    try {
      if (window.database && window.database.ref) {
        const ref = window.database.ref("teacherPledges");
        await ref.push(data);
        status.textContent = "تمت الإضافة بنجاح ✅";
        // reset form but keep agreement checked so the user can sign/send again if needed
        document.getElementById("teacherForm").reset();
        signaturePad.clear();
        setFormEnabled(true);
      } else {
        // If firebase not available, fallback to local download of JSON
        const blob = new Blob([JSON.stringify(data, null, 2)], {type:"application/json"});
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `pledge_${name.replace(/\s+/g,"_")}_${Date.now()}.json`;
        a.click();
        status.textContent = "Firebase غير متاح — تم تنزيل الملف محلياً.";
      }
    } catch (err) {
      console.error(err);
      status.textContent = "حدث خطأ أثناء الإرسال. حاول لاحقًا.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "إرسال التعهد";
    }
  });

  // reset handler
  resetBtn.addEventListener("click", () => {
    signaturePad.clear();
    status.textContent = "";
  });
});
