window.addEventListener('DOMContentLoaded', () => {
    const agreeCheckbox = document.getElementById('agreeCheckbox');
    const teacherName = document.getElementById('teacherName');
    const teacherSpecialty = document.getElementById('teacherSpecialty');
    const teacherNotes = document.getElementById('teacherNotes');
    const submitBtn = document.getElementById('submitBtn');
    const clearSignature = document.getElementById('clearSignature');
    const canvas = document.getElementById('signaturePad');

    // تهيئة SignaturePad
    const signaturePad = new SignaturePad(canvas, { backgroundColor: 'rgb(255,255,255)' });
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

    // تفعيل الحقول بعد وضع علامة صح
    agreeCheckbox.addEventListener('change', () => {
        const enabled = agreeCheckbox.checked;
        teacherName.disabled = !enabled;
        teacherSpecialty.disabled = !enabled;
        teacherNotes.disabled = !enabled;
        submitBtn.disabled = !enabled;
        clearSignature.disabled = !enabled;
    });

    // مسح التوقيع عند الضغط على زر مسح فقط
    clearSignature.addEventListener('click', () => signaturePad.clear());

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
            signature: signaturePad.toDataURL(),
            timestamp: Date.now()
        };

        // استخدام window.database للتأكد من أنه معرف
        const newRef = window.database.ref('teachers').push();
        newRef.set(teacherData)
            .then(() => {
                alert("تم إرسال التعهد بنجاح!");
                form.reset();
                agreeCheckbox.checked = false;
                disableFields();
                signaturePad.clear(); // يمسح التوقيع بعد الإرسال
            })
            .catch(err => {
                console.error(err);
                alert("حدث خطأ أثناء إرسال التعهد. حاول مرة أخرى.");
            });
    });
});
