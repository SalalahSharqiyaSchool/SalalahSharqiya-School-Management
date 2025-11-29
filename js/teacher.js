window.addEventListener('DOMContentLoaded', () => {
    const agreeCheckbox = document.getElementById('agreeCheckbox');
    const teacherName = document.getElementById('teacherName');
    const teacherSpecialty = document.getElementById('teacherSpecialty');
    const teacherNotes = document.getElementById('teacherNotes');
    const submitBtn = document.getElementById('submitBtn');
    const clearSignature = document.getElementById('clearSignature');
    const canvas = document.getElementById('signaturePad');

    // تهيئة SignaturePad مرة واحدة فقط عند تحميل الصفحة
    const signaturePad = new SignaturePad(canvas, {
        backgroundColor: 'rgb(255,255,255)' // خلفية بيضاء حتى يظهر عند حفظ الصورة
    });

    const form = document.getElementById('teacherForm');

    // الحقول مغلقة في البداية
    const disableFields = () => {
        teacherName.disabled = true;
        teacherSpecialty.disabled = true;
        teacherNotes.disabled = true;
        submitBtn.disabled = true;
        clearSignature.disabled = true;
    };
    disableFields();

    // تفعيل الحقول عند وضع علامة صح على التعهد
    agreeCheckbox.addEventListener('change', () => {
        const enabled = agreeCheckbox.checked;
        teacherName.disabled = !enabled;
        teacherSpecialty.disabled = !enabled;
        teacherNotes.disabled = !enabled;
        submitBtn.disabled = !enabled;
        clearSignature.disabled = !enabled;
    });

    // مسح التوقيع عند الضغط على زر مسح فقط
    clearSignature.addEventListener('click', () => {
        signaturePad.clear();
    });

    // إرسال البيانات إلى Firebase
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (signaturePad.isEmpty()) {
            alert("الرجاء إضافة توقيعك قبل الإرسال!");
            return;
        }

        const teacherData = {
            name: teacherName.value.trim(),
            specialty: teacherSpecialty.value,
            notes: teacherNotes.value.trim(),
            signature: signaturePad.toDataURL(), // يبقى موجود حتى بعد رسمه
            timestamp: Date.now()
        };

        const newRef = database.ref('teachers').push();
        newRef.set(teacherData)
            .then(() => {
                alert("تم إرسال التعهد بنجاح!");

                // إعادة ضبط النموذج
                form.reset();
                signaturePad.clear(); // يمسح التوقيع بعد الإرسال فقط
                agreeCheckbox.checked = false;
                disableFields();
            })
            .catch(err => {
                console.error(err);
                alert("حدث خطأ أثناء إرسال التعهد. حاول مرة أخرى.");
            });
    });
});
