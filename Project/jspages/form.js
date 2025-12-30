
document.getElementById("subscribeForm").addEventListener("submit", function(e){
  e.preventDefault();

  const loading = document.getElementById("loading");
  const success = document.getElementById("success");
  const button = document.getElementById("submitBtn");

  loading.style.display = "block";
  success.style.display = "none";
  button.disabled = true;

  setTimeout(() => {
    loading.style.display = "none";
    success.style.display = "block";
    button.disabled = false;
    this.reset();
  }, 2000);
});
