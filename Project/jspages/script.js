
let popup = document.getElementById("videoPopup");
let openBtn = document.getElementById("openPopup");
let closeBtn = document.getElementById("closePopup");
let video = document.getElementById("popupVideo");

openBtn.onclick = () => {
  popup.style.display = "flex";
  video.play();
};

closeBtn.onclick = closeVideo;

popup.onclick = (e) => {
  if(e.target === popup){
    closeVideo();
  }
};

function closeVideo(){
  popup.style.display = "none";
  video.pause();
  video.currentTime = 0;
}

document.getElementById("subscribeForm").addEventListener("submit", function(e){
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const loading = document.getElementById("loading");
  const success = document.getElementById("success");
  const button = document.getElementById("submitBtn");

  // Email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!emailPattern.test(email)){
    alert("Please enter a valid email address");
    return;
  }

  loading.style.display = "block";
  success.style.display = "none";
  button.disabled = true;

  // Fake loading animation
  setTimeout(() => {
    loading.style.display = "none";
    success.style.display = "block";
    button.disabled = false;
    document.getElementById("subscribeForm").reset();
  }, 2000);
});
document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  const loader = document.getElementById("loader");
  const successMsg = document.getElementById("successMsg");
  const button = document.getElementById("submitBtn");
  const btnText = document.querySelector(".btn-text");

  // Safe email validation regex
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Required fields validation
  if (!name || !message) {
    alert("Please fill all required fields");
    return;
  }

  // Email validation
  if (!emailPattern.test(email)) {
    alert("Please enter a valid email address");
    return;
  }

  // Show loading
  loader.style.display = "block";
  btnText.style.display = "none";
  successMsg.style.display = "none";
  button.disabled = true;

  // Fake API delay
  setTimeout(() => {
    loader.style.display = "none";
    btnText.style.display = "inline";
    successMsg.style.display = "block";
    button.disabled = false;
    document.getElementById("contactForm").reset();
  }, 2000);
});
const btn = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  btn.style.display = window.scrollY > 300 ? "flex" : "none";
});

btn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
