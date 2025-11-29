window.addEventListener('DOMContentLoaded', () => {
    const agreeCheckbox = document.getElementById('agreeCheckbox');
    const teacherName = document.getElementById('teacherName');
    const teacherSpecialty = document.getElementById('teacherSpecialty');
    const teacherNotes = document.getElementById('teacherNotes');
    const submitBtn = document.getElementById('submitBtn');
    const clearSignature = document.getElementById('clearSignature');
    const canvas = document.getElementById('signaturePad');
    const signaturePad = new SignaturePad(canvas);
    const form = document.getElementById('teacherForm');

    // الحقول مغلقة في البداية
    teacherName.disabled = true;
    teacherSpecialty.disabled = true;
    teacherNotes.disabled = true;
    submitBtn.disabled = true;
    clearSignature.disabled = true;

    // تفعيل الحقول عند وضع علامة صح
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

    // إرسال البيانات إلى Firebase
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // تحقق من وجود توقيع
        if (signaturePad.isEmpty()) {
            alert("الرجاء إضافة توقيعك قبل الإرسال!");
            return;
        }

        // تجهيز البيانات للإرسال
        const teacherData = {
            name: teacherName.value.trim(),
            specialty: teacherSpecialty.value,
            notes: teacherNotes.value.trim(),
            signature: signaturePad.toDataURL(), // تحويل التوقيع لصورة
            timestamp: Date.now()
        };

        // إرسال البيانات
        const newRef = database.ref('teachers').push();
        newRef.set(teacherData)
            .then(() => {
                alert("تم إرسال التعهد بنجاح!");
                form.reset();
                signaturePad.clear();
                agreeCheckbox.checked = false;

                // إعادة تعطيل الحقول بعد الإرسال
                teacherName.disabled = true;
                teacherSpecialty.disabled = true;
