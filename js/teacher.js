window.addEventListener('DOMContentLoaded', () => {
    const agreeCheckbox = document.getElementById('agreeCheckbox');
    const teacherName = document.getElementById('teacherName');
    const teacherSpecialty = document.getElementById('teacherSpecialty');
    const teacherNotes = document.getElementById('teacherNotes');
    const submitBtn = document.getElementById('submitBtn');
    const clearSignature = document.getElementById('clearSignature');
    const canvas = document.getElementById('signaturePad');
    const signaturePad = new SignaturePad(canvas);

    // اجعل الحقول مغلقة في البداية
    teacherName.disabled = true;
    teacherSpecialty.disabled = true;
    teacherNotes.disabled = true;
    submitBtn.disabled = true;
    clearSignature.disabled = true;

    // تفعيل الحقول عند وضع علامة صح على التعهد
    agreeCheckbox.addEventListener('change', () => {
        const enabled = agreeCheckbox.checked;
        teacherName.disabled = !enabled;
        teacherSpecialty.disabled = !enabled;
        teacherNotes.disabled = !enabled;
        submitBtn.disabled = !enabled;
        clearSignature.disabled = !enabled;
    });

    // مسح التوقيع
    clearSignature.addEventListener('click', () => signaturePad.clear());

    // إرسال النموذج (حاليًا مجرد عرض تنبيه)
    const form = document.getElementById('teacherForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (signaturePad.isEmpty()) {
            alert("الرجاء إضافة توقيعك!");
            return;
        }

        alert("تم التفعيل والبيانات جاهزة للإرسال!");
        form.reset();
        signaturePad.clear();
        agreeCheckbox.checked = false;
        teacherName.disabled = true;
        teacherSpecialty.disabled = true;
        teacherNotes.disabled = true;
        submitBtn.disabled = true;
        clearSignature.disabled = true;
    });
});
