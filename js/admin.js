window.addEventListener('DOMContentLoaded', () => {
    const teachersTableBody = document.querySelector('#teachersTable tbody');

    const addTeacherToTable = (teacher) => {
        // تحويل الطابع الزمني إلى تاريخ ووقت مقروء
        const date = new Date(teacher.timestamp);
        const formattedDate = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')} ${date.getHours().toString().padStart(2,'0')}:${date.getMinutes().toString().padStart(2,'0')}`;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${teacher.name}</td>
            <td>${teacher.specialty}</td>
            <td>${teacher.notes}</td>
            <td>${teacher.signature ? `<img src="${teacher.signature}" alt="توقيع" width="150">` : ''}</td>
            <td>${formattedDate}</td>
        `;
        teachersTableBody.appendChild(tr);
    };

    if (!window.database) {
        console.error('خطأ: Firebase غير مهيأ. تحقق من التهيئة قبل تحميل admin.js');
        return;
    }

    const teachersRef = window.database.ref('teachers');

    teachersRef.on('value', (snapshot) => {
        console.clear();
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
