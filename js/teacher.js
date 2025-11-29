window.addEventListener('DOMContentLoaded', () => {
    const agreeCheckbox = document.getElementById('agreeCheckbox');
    const teacherName = document.getElementById('teacherName');
    const teacherSpecialty = document.getElementById('teacherSpecialty');
    const teacherNotes = document.getElementById('teacherNotes');
    const submitBtn = document.getElementById('submitBtn');
    const clearSignature = document.getElementById('clearSignature');
    const canvas = document.getElementById('signaturePad');
    const form = document.getElementById('teacherForm');

    // تهيئة مكتبة التوقيع
    const signaturePad = new SignaturePad(canvas, {
        backgroundColor: 'rgb(255,255,255)'
    });

    // قفل الحقول في البداية
    function lockFields(state) {
        teacherName.disabled = state;
        teacherSpecialty.disabled = state;
        teacherNotes.disabled = state;
        submitBtn.disabled = state;
        clearSignature.disabled = state;
    }

    lockFields(true);

    // تفعيل الحقول عند الموافقة
    agreeCheckbox.addEventListener('change', () => {
        lockFields(!agreeCheckbox.checked);
    });

    // مسح التوقيع
    clearSignature.addEventListener('click', () => signaturePad.clear());

    // حفظ البيانات
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (signaturePad.isEmpty()) {
            alert("الرجاء إضافة توقيعك!");
            return;
        }

        const teacherData = {
            name: teacherName.value,
            specialty: teacherSpecialty.value,
            notes: teacherNotes.value,
            signature: signaturePad.toDataURL(),
            timestamp: Date.now()
        };

        database.ref('teachers').push(teacherData)
            .then(() => {
                alert("تم إرسال التعهد بنجاح!");
                form.reset();
                signaturePad.clear();
                lockFields(true);
                agreeCheckbox.checked = false;
            })
            .catch(err => console.error("Firebase Error:", err));
    });
});
