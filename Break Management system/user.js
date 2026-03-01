if(localStorage.getItem("role") !== "user"){
    window.location = "login.html";
}

let currentUser = JSON.parse(localStorage.getItem("currentUser"));
document.getElementById("userName").innerText = currentUser.username;
document.getElementById("userAvatar").innerText = currentUser.username[0].toUpperCase();

function getUsers(){ return JSON.parse(localStorage.getItem("users")) || []; }
function saveUsers(users){ localStorage.setItem("users", JSON.stringify(users)); }

let currentBreakInterval = null;

function renderUsers(){
    let users = getUsers();
    let html = "";
    let onBreak = 0;
    let searchQuery = document.getElementById("searchInput").value.toLowerCase();

    users.forEach(u=>{
        if(u.status === "AWAY") onBreak++;
        if(searchQuery && !u.username.toLowerCase().includes(searchQuery)) return;
        html += `<tr>
            <td>${u.username}</td>
            <td>${u.role || "USER"}</td>
            <td class="${
    u.status === "ONLINE" ? "green" :
    u.status === "PERMISSION" ? "orange" :
    u.status === "BREAK" ? "yellow" :
    "red"
}">
    ${u.status}
    ${u.reason ? `<br><small>${u.reason}</small>` : ""}
</td>

        </tr>`;
    });

    document.getElementById("userTable").innerHTML = html;
    document.getElementById("totalUsers").innerText = users.length;
    document.getElementById("usersOnBreak").innerText = onBreak;

    let me = users.find(u => u.username === currentUser.username);
    let totalMs = 0;

    if(me.breaks){
        me.breaks.forEach(b=>{
            totalMs += (new Date(b.end).getTime() - new Date(b.start).getTime());
        });
    }

    if(me.activeBreak){
        document.getElementById("currentBreakTimer").style.display="inline-block";
        if(currentBreakInterval) clearInterval(currentBreakInterval);

        currentBreakInterval = setInterval(()=>{
            let now = Date.now();
            let currentDurationMs = now - me.activeBreak.start;
            let mins = Math.floor(currentDurationMs/60000);
            let secs = Math.floor((currentDurationMs%60000)/1000);
            document.getElementById("currentBreakTimer").innerText =
            `⏱ Current Break: ${me.activeBreak.type} - ${mins} min ${secs} sec`;

            let totalCurrentMs = totalMs + currentDurationMs;
            let totalMins = Math.floor(totalCurrentMs/60000);
            let totalSecs = Math.floor((totalCurrentMs%60000)/1000);
            let totalStr = `${totalMins} min ${totalSecs} sec`;
            let totalBreakDiv = document.getElementById("totalBreakDuration");

            totalBreakDiv.style.display="block";
            totalBreakDiv.innerHTML=`Total Break Today: ${totalStr}`;

            if(totalMins > 60){
                totalBreakDiv.className="alert-message alert-warning";
                totalBreakDiv.innerHTML=`⚠ You have exceeded 60 minutes! Total Break: ${totalStr}`;
            } else {
                totalBreakDiv.className="alert-message";
            }
        },1000);
    } else {
        document.getElementById("currentBreakTimer").style.display="none";
        if(currentBreakInterval) clearInterval(currentBreakInterval);
    }
}

function startBreak(){
    let users = getUsers();
    let me = users.find(u => u.username === currentUser.username);
    if(me.activeBreak){ alert("Break already active"); return; }

    me.status="AWAY";
    me.activeBreak={ type: breakType.value, start: Date.now() };
    saveUsers(users);
    renderUsers();

    document.getElementById("alertMsg").innerHTML =
    `<div class="alert-message alert-start">✅ ${breakType.value} break started!</div>`;

    setTimeout(()=>{ document.getElementById("alertMsg").innerHTML=""; }, 5000);
}

function endBreak(){
    let users = getUsers();
    let me = users.find(u => u.username === currentUser.username);
    if(!me.activeBreak){ alert("No active break"); return; }

    let end=Date.now(), start=me.activeBreak.start;
    let duration=Math.floor((end-start)/60000);

    me.breaks=me.breaks||[];
    me.breaks.push({ type: me.activeBreak.type, start, end, duration });
    me.activeBreak=null;
    me.status="ONLINE";

    saveUsers(users);
    renderUsers();

    document.getElementById("alertMsg").innerHTML =
    `<div class="alert-message alert-end">⏹ ${breakType.value} break ended!</div>`;

    setTimeout(()=>{ document.getElementById("alertMsg").innerHTML=""; }, 5000);
}

function logout(){
    localStorage.clear();
    window.location="login.html";
}

setInterval(renderUsers,2000);
renderUsers();
let workInterval = null;

function getIST(){
    return new Date(new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata"
    }));
}

function startWorkTimer(){
    let users = getUsers();
    let me = users.find(u => u.username === currentUser.username);

    if(me.activeLogin){
        alert("Already logged in");
        return;
    }

    let now = getIST();

    me.activeLogin = {
        start: now.getTime(),
        date: now.toLocaleDateString("en-GB")
    };

    saveUsers(users);

    document.getElementById("workTimer").style.display = "inline-block";

    if(workInterval) clearInterval(workInterval);

    workInterval = setInterval(()=>{
        let diff = getIST().getTime() - me.activeLogin.start;
        let hrs = Math.floor(diff / 3600000);
        let mins = Math.floor((diff % 3600000) / 60000);
        let secs = Math.floor((diff % 60000) / 1000);

        document.getElementById("workTimer").innerText =
            `🟢 Working Time: ${hrs}h ${mins}m ${secs}s (IST)`;
    },1000);
}

function stopWorkTimer(){
    let users = getUsers();
    let me = users.find(u => u.username === currentUser.username);

    if(!me.activeLogin) return;

    let end = getIST();
    let start = me.activeLogin.start;

    let diff = end.getTime() - start;
    let hrs = Math.floor(diff / 3600000);
    let mins = Math.floor((diff % 3600000) / 60000);

    me.workLogs = me.workLogs || [];
    me.workLogs.push({
        date: me.activeLogin.date,
        login: new Date(start).toTimeString().slice(0,5),
        logout: end.toTimeString().slice(0,5),
        duration: `${hrs}h ${mins}m`
    });

    me.activeLogin = null;
    saveUsers(users);

    clearInterval(workInterval);
    document.getElementById("workTimer").style.display = "none";

    renderWorkLogs();
}
function renderWorkLogs(){
    let users = getUsers();
    let me = users.find(u => u.username === currentUser.username);
    let html = "";

    if(me.workLogs){
        me.workLogs.forEach(w=>{
            html += `
                <tr>
                    <td>${w.date}</td>
                    <td>${w.login}</td>
                    <td>${w.logout}</td>
                    <td>${w.duration}</td>
                </tr>
            `;
        });
    }

    document.getElementById("workLogTable").innerHTML = html;
}
renderWorkLogs();
let permissionStartTime = null;
let permissionEndTime = null;
let permissionInterval = null;
let permissionActive = false;
function startPermission() {
    if (permissionActive) {
        alert("Permission already active");
        return;
    }

    const duration = parseInt(document.getElementById("permissionDuration").value);
    const reason = document.getElementById("permissionReason").value.trim();

    if (!duration || duration <= 0) {
        alert("Enter valid permission duration");
        return;
    }

    if (!reason) {
        alert("Enter permission reason");
        return;
    }

    permissionStartTime = new Date();
    permissionEndTime = new Date(permissionStartTime.getTime() + duration * 60000);
    permissionActive = true;

    updateUserStatus("PERMISSION", reason);

    document.getElementById("permissionTimer").style.display = "block";

    permissionInterval = setInterval(() => {
        const now = new Date();
        const remaining = permissionEndTime - now;

        if (remaining <= 0) {
            endPermission();
            return;
        }

        const mins = Math.floor(remaining / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);

        document.getElementById("permissionTimer").innerText =
            `Permission: ${mins}m ${secs}s remaining (${reason})`;

    }, 1000);
}
function endPermission() {
    if (!permissionActive) return;

    clearInterval(permissionInterval);
    permissionActive = false;

    document.getElementById("permissionTimer").style.display = "none";
    document.getElementById("permissionTimer").innerText = "";

    updateUserStatus("AVAILABLE");
}
function updateUserStatus(status, reason = "") {
    currentUser.status = status;
    currentUser.reason = reason;
    renderUsers();
}
// LEAVE CONFIG
let totalLeaves = 12; // yearly leave quota
let leaveData = JSON.parse(localStorage.getItem("leaves")) || [];

// CALCULATE DAYS
function calculateLeaveDays() {
    let from = new Date(document.getElementById("leaveFrom").value);
    let to = new Date(document.getElementById("leaveTo").value);

    if (!isNaN(from) && !isNaN(to) && to >= from) {
        let diff = Math.floor((to - from) / (1000 * 60 * 60 * 24)) + 1;
        document.getElementById("leaveDays").innerText = `Selected Days: ${diff}`;
        updateLeaveBalance(diff);
        return diff;
    }
    return 0;
}

// BALANCE
function updateLeaveBalance(used = 0) {
    let taken = leaveData.reduce((sum, l) => sum + l.days, 0);
    document.getElementById("leaveBalance").innerText =
        `Remaining Leaves: ${totalLeaves - taken - used}`;
}

// APPLY LEAVE
function applyLeave() {
    let type = document.getElementById("leaveType").value;
    let from = document.getElementById("leaveFrom").value;
    let to = document.getElementById("leaveTo").value;
    let days = calculateLeaveDays();

    if (!from || !to || days === 0) {
        alert("Please select valid dates");
        return;
    }

    let taken = leaveData.reduce((s, l) => s + l.days, 0);
    if (taken + days > totalLeaves) {
        alert("Not enough leave balance");
        return;
    }

    leaveData.push({ type, from, to, days });
    localStorage.setItem("leaves", JSON.stringify(leaveData));

    renderLeaveCalendar();
    updateLeaveBalance();
}

// RENDER CALENDAR TABLE
function renderLeaveCalendar() {
    let table = document.getElementById("leaveTable");
    table.innerHTML = "";

    leaveData.forEach(l => {
        table.innerHTML += `
            <tr>
                <td>${l.type}</td>
                <td>${l.from}</td>
                <td>${l.to}</td>
                <td>${l.days}</td>
            </tr>
        `;
    });
}

// DATE CHANGE LISTENER
document.getElementById("leaveFrom").addEventListener("change", calculateLeaveDays);
document.getElementById("leaveTo").addEventListener("change", calculateLeaveDays);

// INIT
renderLeaveCalendar();
updateLeaveBalance();
/* ======================================================
   STATUS DOT (HEADER)
====================================================== */
const avatarEl = document.getElementById("userAvatar");
let statusDot = document.getElementById("statusDot");

if (!statusDot) {
    statusDot = document.createElement("i");
    statusDot.id = "statusDot";
    statusDot.className = "fa-solid fa-circle";
    statusDot.style.fontSize = "8px";
    statusDot.style.marginLeft = "6px";
    avatarEl.appendChild(statusDot);
}

/* ======================================================
   NORMALIZE STATUS (ONE SOURCE OF TRUTH)
====================================================== */
function setUserStatus(status, reason = "") {
    const users = getUsers();
    const me = users.find(u => u.username === currentUser.username);
    if (!me) return;

    me.status = status;
    me.reason = reason;
    saveUsers(users);

    updateHeaderStatus(status, reason);
    updateDashboardCounts();
    renderUsers();
}

/* ======================================================
   HEADER STATUS UI
====================================================== */
function updateHeaderStatus(status, reason = "") {
    const welcome = document.querySelector(".user-welcome");

    switch (status) {
        case "ONLINE":
            statusDot.style.color = "green";
            welcome.innerHTML = `Welcome back, <span id="userName">${currentUser.username}</span> (Online)`;
            break;

        case "AWAY":
            statusDot.style.color = "gold";
            welcome.innerHTML = `Welcome back, <span id="userName">${currentUser.username}</span> (On Break)`;
            break;

        case "PERMISSION":
            statusDot.style.color = "orange";
            welcome.innerHTML =
                `Welcome back, <span id="userName">${currentUser.username}</span> (Permission${reason ? " - " + reason : ""})`;
            break;

        case "LEAVE":
            statusDot.style.color = "red";
            welcome.innerHTML =
                `Welcome back, <span id="userName">${currentUser.username}</span> (Offline - On Leave)`;
            break;

        default:
            statusDot.style.color = "red";
            welcome.innerHTML =
                `Welcome back, <span id="userName">${currentUser.username}</span> (Offline)`;
    }
}

/* ======================================================
   OVERRIDE EXISTING FUNCTIONS (SAFE)
====================================================== */
const __startWorkTimer = startWorkTimer;
startWorkTimer = function () {
    __startWorkTimer();
    setUserStatus("ONLINE");
};

const __stopWorkTimer = stopWorkTimer;
stopWorkTimer = function () {
    __stopWorkTimer();
    setUserStatus("OFFLINE");
};

const __startBreak = startBreak;
startBreak = function () {
    __startBreak();
    setUserStatus("AWAY");
};

const __endBreak = endBreak;
endBreak = function () {
    __endBreak();
    setUserStatus("ONLINE");
};

const __applyLeave = applyLeave;
applyLeave = function () {
    __applyLeave();
    setUserStatus("LEAVE");
};

/* ======================================================
   DASHBOARD CARD – LOGGED IN USERS
====================================================== */
const dashboard = document.querySelector(".dashboard");

if (!document.getElementById("loggedInUsers")) {
    const card = document.createElement("div");
    card.className = "stat";
    card.innerHTML = `Logged In Users<br><b id="loggedInUsers">0</b>`;
    dashboard.appendChild(card);
}

/* ======================================================
   DASHBOARD COUNTS (CORRECT LOGIC)
====================================================== */
function updateDashboardCounts() {
    const users = getUsers();

    const total = users.length;

    const onBreak = users.filter(u => u.status === "AWAY").length;
    const onLeave = users.filter(u => u.status === "LEAVE").length;

    // AVAILABLE = ONLINE only (NOT break, NOT leave)
    const available = users.filter(u => u.status === "ONLINE").length;

    // LOGGED IN = activeLogin exists
    const loggedIn = users.filter(u => u.activeLogin).length;

    document.getElementById("totalUsers").innerText = total;
    document.getElementById("usersOnBreak").innerText = onBreak;
    document.getElementById("usersOnLeave").innerText = onLeave;
    document.getElementById("availableUsers").innerText = available;
    document.getElementById("loggedInUsers").innerText = loggedIn;
}

/* ======================================================
   INIT ON LOAD
====================================================== */
(function initStatus() {
    const users = getUsers();
    const me = users.find(u => u.username === currentUser.username);

    if (!me) return;

    if (me.status) {
        updateHeaderStatus(me.status, me.reason || "");
    } else {
        updateHeaderStatus("OFFLINE");
    }

    updateDashboardCounts();
})();
/* ======================================================
   LEAVE BALANCE CONFIG (PER USER)
====================================================== */
const DEFAULT_LEAVE_BALANCE = {
    Casual: 6,
    Sick: 4,
    Earned: 2
};

/* ======================================================
   HELPERS
====================================================== */
function normalizeDate(d) {
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    return date;
}

function todayDate() {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
}

/* ======================================================
   GET / SAVE LEAVE BALANCE
====================================================== */
function getLeaveBalance() {
    return currentUser.leaveBalance || { ...DEFAULT_LEAVE_BALANCE };
}

function saveLeaveBalance(balance) {
    const users = getUsers();
    const me = users.find(u => u.username === currentUser.username);
    if (!me) return;

    me.leaveBalance = balance;
    currentUser.leaveBalance = balance;
    saveUsers(users);
}

/* ======================================================
   UPDATE LEAVE BALANCE UI
====================================================== */
function updateLeaveBalanceUI() {
    const b = getLeaveBalance();
    document.getElementById("leaveBalance").innerHTML =
        `Casual: ${b.Casual} | Sick: ${b.Sick} | Earned: ${b.Earned}`;
}

/* ======================================================
   OVERRIDE APPLY LEAVE
   ✔ Balance reduces immediately
   ❌ Status & count NOT updated now
====================================================== */
applyLeave = function () {

    const type = document.getElementById("leaveType").value;
    const from = document.getElementById("leaveFrom").value;
    const to = document.getElementById("leaveTo").value;

    if (!from || !to) {
        alert("Please select valid dates");
        return;
    }

    const days = calculateLeaveDays();
    if (days <= 0) return;

    const balance = getLeaveBalance();

    /* ❌ NO BALANCE */
    if (!balance[type] || balance[type] <= 0) {
        alert(`${type} Leave balance is 0`);
        return;
    }

    /* ❌ INSUFFICIENT */
    if (balance[type] < days) {
        alert(`Not enough ${type} Leave balance`);
        return;
    }

    /* ✅ DEDUCT BALANCE IMMEDIATELY */
    balance[type] -= days;
    saveLeaveBalance(balance);
    updateLeaveBalanceUI();

    /* ❗ LEAVE ENTRY (NOT ACTIVE YET) */
    leaveData.push({
        type,
        from,
        to,
        days,
        active: false
    });

    localStorage.setItem("leaves", JSON.stringify(leaveData));
    renderLeaveCalendar();

    alert("Leave applied successfully");
};

/* ======================================================
   ACTIVATE / DEACTIVATE LEAVE BY DATE
====================================================== */
function processLeaveActivation() {

    const today = todayDate();
    let changed = false;

    leaveData.forEach(l => {

        const from = normalizeDate(l.from);
        const to = normalizeDate(l.to);

        /* ✅ ACTIVATE ONLY ON LEAVE DATE */
        if (today >= from && today <= to) {
            if (!l.active) {
                l.active = true;
                setUserStatus("LEAVE");
                changed = true;
            }
        }
        /* ✅ AFTER LEAVE ENDS */
        else if (l.active && today > to) {
            l.active = false;
            setUserStatus("ONLINE");
            changed = true;
        }
    });

    if (changed) {
        localStorage.setItem("leaves", JSON.stringify(leaveData));
        updateDashboardCounts();
    }
}

/* ======================================================
   INIT ON LOAD
====================================================== */
(function initLeaveSystem() {

    /* INIT BALANCE FIRST TIME */
    if (!currentUser.leaveBalance) {
        saveLeaveBalance({ ...DEFAULT_LEAVE_BALANCE });
    }

    updateLeaveBalanceUI();
    processLeaveActivation();

})();

/* ======================================================
   AUTO CHECK (EVERY MINUTE)
====================================================== */
setInterval(processLeaveActivation, 60 * 1000);







