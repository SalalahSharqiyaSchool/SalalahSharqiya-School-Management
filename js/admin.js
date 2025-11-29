window.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#teachersTable tbody');

    // قراءة البيانات من Firebase وعرضها في الجدول
    database.ref('teachers').on('value', (snapshot) => {
        tableBody.innerHTML = ''; // مسح الجدول قبل ملئه
        const data = snapshot.val();
        if(data) {
            Object.values(data).forEach(teacher => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${teacher.name}</td>
                    <td>${teacher.specialty}</td>
                    <td>${teacher.notes || ''}</td>
                    <td><img src="${teacher.signature}" alt="توقيع" width="150"></td>
                `;
                tableBody.appendChild(row);
            });
        }
    });
});
