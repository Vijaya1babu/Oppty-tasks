
if(localStorage.getItem("role") !== "admin"){
    window.location = "login.html";
}

function getUsers(){ return JSON.parse(localStorage.getItem("users")) || []; }
function saveUsers(users){ localStorage.setItem("users", JSON.stringify(users)); }
function format(ts){ return ts ? new Date(ts).toLocaleString() : "-"; }
function isToday(ts){ return new Date(ts).toDateString() === new Date().toDateString(); }

function renderUsers(){
    let users = getUsers();
    let now = Date.now();
    let html = "";
    let onBreak = 0;
    let online = users.filter(u => u.status === "ONLINE").length;

document.getElementById("totalUsers").innerText = users.length;
document.getElementById("usersOnBreak").innerText = onBreak;
document.getElementById("onlineUsers").innerText = online;


    users.forEach((u,i)=>{
        let type="-", start="-", end="-", duration="-", total=0, alert="";
        let warn = false;
        let totalSec = 0;
(u.breaks || []).forEach(b => {
    if (isToday(b.start)) {
        if (b.durationSec !== undefined) {
            totalSec += b.durationSec;
        } else {
            totalSec += b.duration * 60;
        }
    }
});
let totalMins = Math.floor(totalSec / 60);
let totalSecs = totalSec % 60;
let totalStr = `${totalMins} mins ${totalSecs} sec`;



        if(u.activeBreak){
            onBreak++;
            type = u.activeBreak.type;
            start = format(u.activeBreak.start);

            let diff = now - u.activeBreak.start;
            let mins = Math.floor(diff/60000);
            let secs = Math.floor((diff%60000)/1000);
            duration = `${mins} mins ${secs} sec`;

            if(mins > 60){ warn = true; alert = "⚠ Exceeded 60 mins"; }
        } else if(u.breaks?.length){
            let b = u.breaks.at(-1);
            type = b.type;
            start = format(b.start);
            end = format(b.end);

            // Display past break with minutes + seconds
            if(b.durationSec !== undefined){
                let mins = Math.floor(b.durationSec/60);
                let secs = b.durationSec % 60;
                duration = `${mins} mins ${secs} sec`;
            } else {
                duration = `${b.duration} mins 0 sec`;
            }
        }

        html += `<tr class="${warn?'row-warn':''}">
            <td>${u.username}</td>
            <td>${u.email || "-"}</td>
            <td>${u.role || "USER"}</td>
            <td class="${u.status==="ONLINE"?"green":"red"}">${u.status}</td>
            <td>${type}</td>
            <td>${start}</td>
            <td>${end}</td>
            <td>${duration}</td>
            <td><b>${totalStr}</b></td>
           <td><button onclick="toggleUserStatus(${i})">${u.status==="ONLINE"?"Set AWAY":"Set ONLINE"}</button></td>
            <td class="warn">${alert}</td>
        </tr>`;
    });

    userTable.innerHTML = html;
    totalUsers.innerText = users.length;
    usersOnBreak.innerText = onBreak;

    renderCredentials();
}

function renderCredentials(){
    let users = getUsers();
    let html = "";
    users.forEach((u,i)=>{
        html += `<tr>
            <td><input id="u${i}" value="${u.username}"></td>
            <td><input id="e${i}" value="${u.email || ""}"></td>
            <td><input id="p${i}" value="${u.password}"></td>
            <td>
                <button class="save-btn" onclick="saveCred(${i})">Save</button>
                <button onclick="deleteUser(${i})">Delete</button>
            </td>
        </tr>`;
    });
    credTable.innerHTML = html;
}

function saveCred(i){
    let users = getUsers();

    let newUsername = document.getElementById("u"+i).value.trim();
    let newEmail    = document.getElementById("e"+i).value.trim();
    let newPassword = document.getElementById("p"+i).value.trim();

    if(!newUsername || !newPassword){
        alert("Username and Password cannot be empty");
        return;
    }

    
    if(users.some((u,idx)=>u.username === newUsername && idx !== i)){
        alert("Username already exists");
        return;
    }

    users[i].username = newUsername;
    users[i].email    = newEmail;
    users[i].password = newPassword;

    saveUsers(users);
    alert("User details updated successfully");

    renderUsers();
}


function addUser(){
    let users = getUsers();
    if(!uname.value || !upass.value) return;
    if(users.some(u => u.username === uname.value)){ alert("User already exists"); return; }

    users.push({
        username: uname.value.trim(),
        email: uemail.value.trim(),
        password: upass.value.trim(),
        role:"USER",
        status:"ONLINE",
        activeBreak:null,
        breaks:[]
    });

    uname.value = upass.value = uemail.value = "";
    saveUsers(users);
    renderUsers();
}

function deleteUser(i){
    let users = getUsers();
    users.splice(i,1);
    saveUsers(users);
    renderUsers();
}

function downloadUsersExcel(){
    let users = getUsers();
    let excel = "Username\tEmail\tPassword\tRole\tStatus\n";
    users.forEach(u=>{
        excel += `${u.username}\t${u.email || ""}\t${u.password}\t${u.role}\t${u.status}\n`;
    });
    let blob = new Blob([excel], {type:"application/vnd.ms-excel"});
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "user_details.xls";
    a.click();
}

function downloadBreakTableExcel(){
    let users = getUsers();
    let now = Date.now();
    let excel = "User\tEmail\tRole\tStatus\tBreak Type\tStart\tEnd\tDuration\tToday Total\tAlert\n";

    users.forEach(u=>{
        let totalSec = 0;
(u.breaks || []).forEach(b => {
    if (isToday(b.start)) {
        if (b.durationSec !== undefined) {
            totalSec += b.durationSec;
        } else {
            totalSec += b.duration * 60;
        }
    }
});
let totalMins = Math.floor(totalSec / 60);
let totalSecs = totalSec % 60;
let totalStr = `${totalMins} mins ${totalSecs} sec`;

        let type="-", start="-", end="-", duration="-", alert="";
        if(u.activeBreak){
            type = u.activeBreak.type;
            start = format(u.activeBreak.start);
            let diff = now - u.activeBreak.start;
            let mins = Math.floor(diff/60000);
            let secs = Math.floor((diff%60000)/1000);
            duration = `${mins} mins ${secs} sec`;
            if(mins > 60) alert = "⚠ Exceeded 60 mins";
        } else if(u.breaks?.length){
            let b = u.breaks.at(-1);
            type = b.type;
            start = format(b.start);
            end = format(b.end);
            if(b.durationSec !== undefined){
                let mins = Math.floor(b.durationSec/60);
                let secs = b.durationSec % 60;
                duration = `${mins} mins ${secs} sec`;
            } else {
                duration = `${b.duration} mins 0 sec`;
            }
        }

excel += `${u.username}\t${u.email || ""}\t${u.role || "USER"}\t${u.status}\t${type}\t${start}\t${end}\t${duration}\t${totalStr}\t${alert}\n`;
    });

    let blob = new Blob([excel], {type:"application/vnd.ms-excel"});
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "users_break_table.xls";
    a.click();
}

function logout(){
    localStorage.clear();
    alert("Logged out!");
    window.location="login.html";
}

let autoRefresh = setInterval(renderUsers, 2000);
renderUsers();

function toggleUserStatus(index){
    let users = getUsers();

    if(users[index].status === "ONLINE"){
        users[index].status = "AWAY";

        users[index].activeBreak = {
            type: "MANUAL",
            start: Date.now()
        };

    } else {
        users[index].status = "ONLINE";

        if(users[index].activeBreak){
            users[index].breaks = users[index].breaks || [];
            let durationSec = Math.floor((Date.now() - users[index].activeBreak.start)/1000);
            users[index].breaks.push({
                type: users[index].activeBreak.type,
                start: users[index].activeBreak.start,
                end: Date.now(),
                duration: Math.floor(durationSec/60),
                durationSec: durationSec
            });
        }

        users[index].activeBreak = null;
    }

    saveUsers(users);
    renderUsers();
}

// ------------------- USERS TABLE FILTER -------------------
let filteredUsers = [];

function applyFilters(){
    let users = getUsers();
    let search = document.getElementById("userSearch").value.toLowerCase();
    let filter = document.getElementById("userFilter").value;

    filteredUsers = users.filter(u=>{
        return Object.values(u)
            .join(" ")
            .toLowerCase()
            .includes(search);
    });

    switch(filter){
        case "az": filteredUsers.sort((a,b)=>a.username.localeCompare(b.username)); break;
        case "za": filteredUsers.sort((a,b)=>b.username.localeCompare(a.username)); break;
        case "online": filteredUsers = filteredUsers.filter(u=>u.status==="ONLINE"); break;
        case "away": filteredUsers = filteredUsers.filter(u=>u.status==="AWAY"); break;
        case "duration":
            filteredUsers.sort((a,b)=>{
                let da = a.activeBreak ? (Date.now()-a.activeBreak.start) : 0;
                let db = b.activeBreak ? (Date.now()-b.activeBreak.start) : 0;
                return db - da;
            });
            break;
        case "recent":
            filteredUsers.sort((a,b)=>{
                let ta = a.activeBreak?.start || 0;
                let tb = b.activeBreak?.start || 0;
                return tb - ta;
            });
            break;
    }

    renderFilteredUsers();
}

function renderFilteredUsers(){
    let now = Date.now();
    let html = "";
    let onBreak = 0;

    filteredUsers.forEach((u,i)=>{
        let type="-", start="-", end="-", duration="-", total=0, alert="";
        let warn=false;
        let totalSec = 0;
(u.breaks || []).forEach(b => {
    if (isToday(b.start)) {
        if (b.durationSec !== undefined) {
            totalSec += b.durationSec; 
        } else {
            totalSec += b.duration * 60; 
        }
    }
});
let totalMins = Math.floor(totalSec / 60);
let totalSecs = totalSec % 60;
let totalStr = `${totalMins} mins ${totalSecs} sec`;



        if(u.activeBreak){
            onBreak++;
            type = u.activeBreak.type;
            start = format(u.activeBreak.start);

            let diff = now - u.activeBreak.start;
            let mins = Math.floor(diff/60000);
            let secs = Math.floor((diff%60000)/1000);
            duration = `${mins} mins ${secs} sec`;

            if(mins>60){ warn=true; alert="⚠ Exceeded 60 mins"; }
        }

        html += `<tr class="${warn?'row-warn':''}">
            <td>${u.username}</td>
            <td>${u.email || "-"}</td>
            <td>${u.role || "USER"}</td>
            <td class="${u.status==="ONLINE"?"green":"red"}">${u.status}</td>
            <td>${type}</td>
            <td>${start}</td>
            <td>${end}</td>
            <td>${duration}</td>
            <td><b>${totalStr}</b></td>
            <td><button onclick="toggleUserStatus(${getUsers().indexOf(u)})">
                ${u.status==="ONLINE"?"Set AWAY":"Set ONLINE"}
            </button></td>
            <td class="warn">${alert}</td>
        </tr>`;
    });

    userTable.innerHTML = html;
}

let filteredDetails = [];

function applyDetailFilters(){
    let users = getUsers();
    let search = document.getElementById("detailSearch").value.toLowerCase();
    let filter = document.getElementById("detailFilter").value;

    filteredDetails = users.filter(u=>{
        return u.username.toLowerCase().includes(search) || u.password.toLowerCase().includes(search);
    });

    switch(filter){
        case "az": filteredDetails.sort((a,b)=>a.username.localeCompare(b.username)); break;
        case "za": filteredDetails.sort((a,b)=>b.username.localeCompare(a.username)); break;
    }

    renderFilteredDetails();
}

function renderFilteredDetails(){
    let html = "";
    let users = getUsers();

    filteredDetails.forEach(u=>{
        let i = users.indexOf(u);

        html += `<tr>
            <td><input id="u${i}" value="${u.username}"></td>
            <td><input id="e${i}" value="${u.email || ""}"></td>
            <td><input id="p${i}" value="${u.password}"></td>
            <td>
                <button onclick="saveCred(${i})">Save</button>
                <button onclick="deleteUser(${i})">Delete</button>
            </td>
        </tr>`;
    });

    credTable.innerHTML = html;
}
document.addEventListener("focusin", (e)=>{
    if(e.target.tagName === "INPUT"){
        clearInterval(autoRefresh);
    }
});

document.addEventListener("focusout", (e)=>{
    if(e.target.tagName === "INPUT"){
        autoRefresh = setInterval(renderUsers, 2000);
    }
});

