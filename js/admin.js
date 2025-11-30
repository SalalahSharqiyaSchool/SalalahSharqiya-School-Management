// إعدادات Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA7LDHKX4XKKfCEbgmpEDQ5NHj6XghxZlE",
    authDomain: "salalah-sharqiya-school.firebaseapp.com",
    databaseURL: "https://salalah-sharqiya-school-default-rtdb.firebaseio.com/",
    projectId: "salalah-sharqiya-school",
    storageBucket: "salalah-sharqiya-school.firebasestorage.app",
    messagingSenderId: "540330149276",
    appId: "1:540330149276:web:228722d3f67b70ffa5f459"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const tableBody = document.querySelector('#teachersTable tbody');

// جلب البيانات من Firebase
database.ref('teacherPledges').on('value', snapshot => {
    tableBody.innerHTML = ''; // مسح الجدول قبل التعبئة
    snapshot.forEach(childSnap => {
        const data = childSnap.val();
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${data.name}</td>
            <td>${data.specialty}</td>
            <td>${data.notes}</td>
            <td><img src="${data.signature}" style="width:120px; height:80px;"></td>
        `;
        tableBody.appendChild(row);
    });
});

// زر الطباعة
document.getElementById('printBtn').addEventListener('click', () => {
    let printContent = `
        <div style="text-align:center;">
            <img src="css/logo.png" class="logo-print">
            <h2>صلالة الشرقية للتعليم الأساسي</h2>
            <h3>تعهد المعلم</h3>
            <p style="border:1px solid #ccc; padding:10px; font-size:18px; text-align:right;">
أتعهد بالالتزام بجميع قوانين وأنظمة مدرسة صلالة الشرقية للتعليم الأساسي، وأتعهد بالقيام بمسؤوليتي المهنية بأمانة وصدق.
أقر بأنني سألتزم بالحضور المبكر إلى المدرسة والانصراف في الوقت المحدد، وسأحافظ على النظام والانضباط داخل الصف وخارجه.
أتعهد بالتصرف بما يحقق المصلحة التعليمية للطلاب، وأدرك أن أي مخالفة لهذه التعهدات قد تؤدي إلى اتخاذ الإجراءات النظامية اللازمة.
            </p>
        </div>
        <table style="width:100%; border-collapse:collapse; margin-top:15px; font-size:16px;">
            <thead>
                <tr>
                    <th style="border:1px solid #ccc; padding:8px;">الاسم</th>
                    <th style="border:1px solid #ccc; padding:8px;">التخصص</th>
                    <th style="border:1px solid #ccc; padding:8px;">الملاحظات</th>
                    <th style="border:1px solid #ccc; padding:8px;">التوقيع</th>
                </tr>
            </thead>
            <tbody>
    `;

    // إضافة بيانات كل المعلمين
    tableBody.querySelectorAll('tr').forEach(r => {
        printContent += `<tr>${r.innerHTML}</tr>`;
    });

    printContent += `</tbody></table>`;

    const printWindow = window.open('', '', 'height=700,width=900');
    printWindow.document.write('<html><head><title>طباعة التعهد</title></head><body>');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
});
