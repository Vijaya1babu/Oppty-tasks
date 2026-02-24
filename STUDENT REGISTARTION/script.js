let students = [];
let currentEditIndex = -1;

// CGPA Validation Logic
const cgpaInput = document.getElementById('cgpa');
cgpaInput.addEventListener('input', function() {
    if (this.value < 1 || this.value > 10) {
        this.setCustomValidity("Enter your correct CGPA (1-10)");
    } else {
        this.setCustomValidity("");
    }
});

// Age Calculation Logic
document.getElementById('dob').addEventListener('change', function() {
    const birth = new Date(this.value);
    const age = new Date().getFullYear() - birth.getFullYear();
    document.getElementById('age').value = age + " Years";
});

// File Validation for JPEG and PDF
document.getElementById('photo').addEventListener('change', function() {
    const file = this.files[0];
    if (file && !['image/jpeg', 'image/jpg'].includes(file.type)) {
        alert("Please upload JPEG/JPG image only.");
        this.value = '';
    }
});

document.getElementById('resume').addEventListener('change', function() {
    const file = this.files[0];
    if (file && file.type !== 'application/pdf') {
        alert("Please upload PDF resume only.");
        this.value = '';
    }
});

document.getElementById('studentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const genderEl = document.querySelector('input[name="gender"]:checked');
    const photoInput = document.getElementById('photo');

    // Function to process data and add to table
    const processData = (photoBase64) => {
        const data = {
            title: document.getElementById('title').value,
            regNo: document.getElementById('regNo').value,
            fname: document.getElementById('fname').value,
            lname: document.getElementById('lname').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            aadhaar: document.getElementById('aadhaar').value,
            dob: document.getElementById('dob').value,
            age: document.getElementById('age').value,
            gender: genderEl ? genderEl.value : "",
            qual: document.getElementById('qual').value,
            passYear: document.getElementById('passYear').value,
            clgName: document.getElementById('clgName').value,
            cgpa: document.getElementById('cgpa').value,
            clgAddr: document.getElementById('clgAddr').value,
            fatherName: document.getElementById('fatherName').value,
            fatherPhone: document.getElementById('fatherPhone').value,
            motherName: document.getElementById('motherName').value,
            motherPhone: document.getElementById('motherPhone').value,
            guardianName: document.getElementById('guardianName').value,
            guardianPhone: document.getElementById('guardianPhone').value,
            houseNo: document.getElementById('houseNo').value,
            village: document.getElementById('village').value,
            city: document.getElementById('city').value,
            state: document.getElementById('stateSelect').value,
            country: document.getElementById('countrySelect').value,
            pincode: document.getElementById('pincode').value,
            photo: photoBase64 || (currentEditIndex > -1 ? students[currentEditIndex].photo : "")
        };

        if (currentEditIndex === -1) {
            students.push(data);
            alert("Form submitted successfully!");
        } else {
            students[currentEditIndex] = data;
            currentEditIndex = -1;
            document.getElementById('submitBtn').innerText = "Submit Registration";
            alert("Form updated successfully!");
        }

        this.reset();
        document.getElementById('age').value = "";
        renderTable();
    };

    // Read photo file if selected
    if (photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (event) => processData(event.target.result);
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        processData();
    }
});

function renderTable() {
    const tbody = document.getElementById('studentTableBody');
    tbody.innerHTML = ""; 

    students.forEach((s, i) => {
        const tr = document.createElement('tr');
        
        // --- Photo column cell (Squared) ---
        const photoTd = document.createElement('td');
        if(s.photo) {
            const img = document.createElement('img');
            img.src = s.photo;
            // Updated Styles for Full Image
            img.style.width = "60px";        // Slightly larger for better visibility
            img.style.height = "auto";       // Maintain aspect ratio
            img.style.borderRadius = "4px";  // Sharp corners (or very slight round)
            img.style.display = "block";
            img.style.border = "1px solid #e2e8f0";
            photoTd.appendChild(img);
        } else {
            photoTd.textContent = "No Image";
        }
        tr.appendChild(photoTd);

        const fullName = `${s.title} ${s.fname} ${s.lname}`;
        const rowData = [s.regNo, fullName, s.phone, s.city, s.qual];

        rowData.forEach(text => {
            const td = document.createElement('td');
            td.textContent = text;
            tr.appendChild(td);
        });

        const actionTd = document.createElement('td');
        actionTd.className = "action-btns";

        const editBtn = document.createElement('button');
        editBtn.className = "btn-edit";
        editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
        editBtn.onclick = () => editStudent(i);

        const delBtn = document.createElement('button');
        delBtn.className = "btn-del";
        delBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
        delBtn.onclick = () => deleteStudent(i);

        actionTd.appendChild(editBtn);
        actionTd.appendChild(delBtn);
        tr.appendChild(actionTd);
        tbody.appendChild(tr);
    });
}
function editStudent(i) {
    const s = students[i];
    document.getElementById('title').value = s.title;
    document.getElementById('regNo').value = s.regNo;
    document.getElementById('fname').value = s.fname;
    document.getElementById('lname').value = s.lname;
    document.getElementById('email').value = s.email;
    document.getElementById('phone').value = s.phone;
    document.getElementById('aadhaar').value = s.aadhaar;
    document.getElementById('dob').value = s.dob;
    document.getElementById('age').value = s.age;
    document.getElementById('qual').value = s.qual;
    document.getElementById('passYear').value = s.passYear;
    document.getElementById('clgName').value = s.clgName;
    document.getElementById('cgpa').value = s.cgpa;
    document.getElementById('clgAddr').value = s.clgAddr;
    document.getElementById('fatherName').value = s.fatherName;
    document.getElementById('fatherPhone').value = s.fatherPhone;
    document.getElementById('motherName').value = s.motherName;
    document.getElementById('motherPhone').value = s.motherPhone;
    document.getElementById('guardianName').value = s.guardianName;
    document.getElementById('guardianPhone').value = s.guardianPhone;
    document.getElementById('houseNo').value = s.houseNo;
    document.getElementById('village').value = s.village;
    document.getElementById('city').value = s.city;
    document.getElementById('stateSelect').value = s.state;
    document.getElementById('countrySelect').value = s.country;
    document.getElementById('pincode').value = s.pincode;
    
    const genderRadio = document.querySelector(`input[name="gender"][value="${s.gender}"]`);
    if(genderRadio) genderRadio.checked = true;

    currentEditIndex = i;
    document.getElementById('submitBtn').innerText = "Update Record";
    window.scrollTo({top: 0, behavior: 'smooth'});
}

function deleteStudent(i) {
    if(confirm("Are you sure you want to delete this record?")) {
        students.splice(i, 1);
        renderTable();
    }
}