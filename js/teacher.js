
window.addEventListener('DOMContentLoaded', () => {
    const agreeCheckbox = document.getElementById('agreeCheckbox');
    const teacherName = document.getElementById('teacherName');
    const teacherSpecialty = document.getElementById('teacherSpecialty');
    const teacherNotes = document.getElementById('teacherNotes');
    const submitBtn = document.getElementById('submitBtn');
    const clearSignature = document.getElementById('clearSignature');
    const canvas = document.getElementById('signaturePad');
    const signaturePad = new SignaturePad(canvas);

    agreeCheckbox.addEventListener('change', () => {
        const enabled = agreeCheckbox.checked;
        teacherName.disabled = !enabled;
        teacherSpecialty.disabled = !enabled;
        teacherNotes.disabled = !enabled;
        submitBtn.disabled = !enabled;
        clearSignature.disabled = !enabled;
    });

    clearSignature.addEventListener('click', () => {
        signaturePad.clear();
    });

    const form = document.getElementById('teacherForm');
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
            signature: signaturePad.toDataURL()
        };

        // حفظ البيانات في ملف JSON (محليًا للتجربة)
        fetch('data/teachers.json')
            .then(res => res.json())
            .then(data => {
                data.push(teacherData);
                fetch('data/teachers.json', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data, null, 2)
                }).then(() => {
                    alert('تم إرسال التعهد بنجاح!');
                    form.reset();
                    signaturePad.clear();
                    agreeCheckbox.checked = false;
                    teacherName.disabled = true;
                    teacherSpecialty.disabled = true;
                    teacherNotes.disabled = true;
                    submitBtn.disabled = true;
                });
            }).catch(err => console.error(err));
    });
});
