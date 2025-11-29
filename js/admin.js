window.addEventListener('DOMContentLoaded', () => {
    const teachersTableBody = document.querySelector('#teachersTable tbody');

    const addTeacherToTable = (teacher) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${teacher.name}</td>
            <td>${teacher.specialty}</td>
            <td>${teacher.notes}</td>
            <td>${teacher.signature ? `<img src="${teacher.signature}" alt="توقيع" width="150">` : ''}</td>
        `;
        teachersTableBody.appendChild(tr);
    };

    // التحقق من وجود Firebase
    if (!window.database) {
        console.error('خطأ: Firebase غير مهيأ بشكل صحيح. تحقق من تهيئة Firebase قبل تحميل admin.js');
        return;
    }

    const teachersRef = window.database.ref('teachers');

    // قراءة البيانات مع Debug
    teachersRef.on('value', (snapshot) => {
        console.clear(); // لمسح Console قبل كل تحديث
        console.log('تم جلب البيانات من Firebase');
        
        teachersTableBody.innerHTML = '';
        const data = snapshot.val();
        
        if (data) {
            console.log('البيانات المستلمة:', data);
            Object.values(data).forEach(teacher => addTeacherToTable(teacher));
        } else {
            console.warn('لا توجد بيانات للمعلمين في قاعدة البيانات');
        }
    }, (error) => {
        console.error('حدث خطأ أثناء جلب البيانات من Firebase:', error);
    });
});
