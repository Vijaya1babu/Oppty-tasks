const container = document.getElementById("container");

function toggle(){
  container.classList.toggle("sign-in");
  container.classList.toggle("sign-up");
}

function login(role){
  if(role === 'admin'){
    const u = adminUser.value.trim();
    const p = adminPass.value.trim();
    adminErr.textContent="";

    if(u === "admin@oppty.in" && p === "oppty@1234"){
      localStorage.setItem("role", "admin");
      window.location.href = "admin.html"; 
    } else {
      adminErr.textContent = "Invalid Admin credentials";
    }
    return;
  }

  const u = userUser.value.trim();
  const p = userPass.value.trim();
  userErr.textContent = "";

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let user = users.find(x => x.email === u && x.password === p);

  if(user){
    localStorage.setItem("role", "user");
    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "user.html"; 
  } else {
    userErr.textContent = "Invalid User credentials";
  }
}
