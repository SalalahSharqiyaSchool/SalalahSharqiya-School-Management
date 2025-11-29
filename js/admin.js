window.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#teachersTable tbody');

    fetch('data/teachers.json')
        .then(res => res.json())
        .then(data => {
            data.forEach(teacher => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${teacher.name}</td>
                    <td>${teacher.specialty}</td>
                    <td>${teacher.notes}</td>
                    <td><img src="${teacher.signature}" alt="توقيع" width="150"></td>
                `;
                tableBody.appendChild(row);
            });
        }).catch(err => console.error(err));
});
