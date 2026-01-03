
toggleMap1.onclick = () => map.classList.toggle("hidden");
toggleMap2.onclick = () => map2.classList.toggle("hidden");


addTask.onclick = () => {
  if (!taskInput.value) return;
  const li = document.createElement("li");
  li.innerHTML = `${taskInput.value} <button onclick="this.parentElement.remove()">Remove</button>`;
  taskList.appendChild(li);
  taskInput.value = "";
};

clearTasks.onclick = () => taskList.innerHTML = "";


let s = 0;
let timer = setInterval(update, 1000);
const times = document.querySelectorAll(".time");

function update() {
  s++;
  const t = new Date(s * 1000).toISOString().substr(11, 8);
  times.forEach(el => el.textContent = t);
}

document.querySelectorAll(".pause")
  .forEach(b => b.onclick = () => clearInterval(timer));

document.querySelectorAll(".reset")
  .forEach(b => b.onclick = () => {
    clearInterval(timer);
    s = 0;
    update();
    timer = setInterval(update, 1000);
  });


contactForm.onsubmit = e => {
  e.preventDefault();
  successMsg.style.display = "block";
};

clearForm.onclick = () => {
  contactForm.reset();
  successMsg.style.display = "none";
};


function openMap() {
  const address =
    "108/43 Vijaya Lakshmi Enclave 1st Floor H No 2 PJR Enclave Rd Gangaram ICRISAT Colony Hyderabad Telangana 500050";

  window.open(
    "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent(address),
    "_blank"
  );
}
