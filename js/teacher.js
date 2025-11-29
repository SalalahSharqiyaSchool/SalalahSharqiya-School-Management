window.addEventListener('DOMContentLoaded', () => {
    const agreeCheckbox = document.getElementById('agreeCheckbox');
    const teacherName = document.getElementById('teacherName');
    const teacherSpecialty = document.getElementById('teacherSpecialty');
    const teacherNotes = document.getElementById('teacherNotes');
    const submitBtn = document.getElementById('submitBtn');
    const clearSignature = document.getElementById('clearSignature');
    const canvas = document.getElementById('signaturePad');

    // تهيئة SignaturePad مرة واحدة فقط
    const signaturePad = new SignaturePad(canvas);

    const form = document.getElementById('teacherForm');

    // الحقول مغلقة في البداية
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

    // مسح التوقيع عند الضغط على زر المسح فقط
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
            signature: signaturePad.toDataURL(), // يبقى موجود حتى بعد الإرسال
            timestamp: Date.now()
        };

        // حفظ البيانات في Firebase
        const newRef = database.ref('teachers').push();
        newRef.set(teacherData)
            .then(() => {
                alert("تم إرسال التعهد بنجاح!");
                form.reset(); // إعادة تعيين الحقول
                signaturePad.clear(); // مسح التوقيع بعد الإرسال
                agreeCheckbox.checked = false;

                // إعادة تعطيل الحقول
                teacherName.disabled = true;
                teacherSpecialty.disabled = true;
                teacherNotes.disabled = true;
                submitBtn.disabled = true;
                clearSignature.disabled = true;
            })
            .catch(err => {
                console.error(err);
                alert("حدث خطأ أثناء إرسال التعهد. حاول مرة أخرى.");
            });
    });
});
