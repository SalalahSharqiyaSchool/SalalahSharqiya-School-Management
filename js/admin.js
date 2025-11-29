window.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#teachersTable tbody');
    const teachersRef = window.database.ref('teachers');

    teachersRef.on('value', snapshot => {
        tableBody.innerHTML = ''; // مسح الجدول قبل إعادة ملئه
        snapshot.forEach(childSnapshot => {
            const teacher = childSnapshot.val();
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${teacher.name}</td>
                <td>${teacher.specialty}</td>
                <td>${teacher.notes}</td>
                <td><img src="${teacher.signature}" width="150" /></td>
            `;
            tableBody.appendChild(row);
        });
    });
});
