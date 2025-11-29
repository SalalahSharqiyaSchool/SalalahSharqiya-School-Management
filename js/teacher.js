window.addEventListener('DOMContentLoaded', () => {

    const agreeCheckbox = document.getElementById('agreeCheckbox');
    const teacherName = document.getElementById('teacherName');
    const teacherSpecialty = document.getElementById('teacherSpecialty');
    const teacherNotes = document.getElementById('teacherNotes');
    const submitBtn = document.getElementById('submitBtn');
    const clearSignature = document.getElementById('clearSignature');
    const canvas = document.getElementById('signaturePad');
    const form = document.getElementById('teacherForm');

    // تفعيل التوقيع
    const signaturePad = new SignaturePad(canvas);

    // تعطيل الحقول أولًا
    function setDisabledState(state) {
        teacherName.disabled = state;
        teacherSpecialty.disabled = state;
        teacherNotes.disabled = state;
        submitBtn.disabled = state;
        clearSignature.disabled = state;
    }

    setDisabledState(true);

    // عند وضع علامة صح
    agreeCheckbox.addEventListener('change', () => {
        setDisabledState(!agreeCheckbox.checked);
    });

    // مسح التوقيع
    clearSignature.addEventListener('click', () => {
        signaturePad.clear();
    });

    // إرسال إلى Firebase
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

        database.ref('teachers').push().set(teacherData)
        .then(() => {
            alert("تم حفظ التعهد بنجاح!");

            form.reset();
            signaturePad.clear();
            agreeCheckbox.checked = false;
            setDisabledState(true);
        })
        .catch((err) => {
            console.error(err);
            alert("حدث خطأ أثناء حفظ البيانات!");
        });
    });

});
