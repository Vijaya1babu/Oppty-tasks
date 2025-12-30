function increaseLikes(element) {
  let text = element.innerText;   // "3 Likes"
  let number = parseInt(text);    // 3
  number++;                       // increase
  element.innerText = number + " Likes";
}
let replyToId = null;
let counter = 2;

function setReply(id){
  replyToId = id;
  document.getElementById("formTitle").innerText = "Reply to comment";
  document.getElementById("cancelReply").style.display = "block";
}

function cancelReply(){
  replyToId = null;
  document.getElementById("formTitle").innerText = "Post A Comment";
  document.getElementById("cancelReply").style.display = "none";
}

function submitComment(){
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const text = document.getElementById("commentText").value.trim();
  const error = document.getElementById("error");

  error.innerText = "";

  if(!name || !email || !text){
    error.innerText = "All required fields must be filled.";
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!emailPattern.test(email)){
    error.innerText = "Please enter a valid email address.";
    return;
  }

  const date = new Date().toLocaleString();

  const commentHTML = `
    <div class="comment-box" data-id="${counter}">
      <div class="avatar">
        <i class="fa-solid fa-circle-user"></i>
      </div>
      <div class="comment-content">
        <h4>${name}</h4>
        <div class="meta">
          Posted at ${date}
          <span class="reply-btn" onclick="setReply(${counter})">REPLY</span>
        </div>
        <div class="comment-text">${text}</div>
        <div class="replies"></div>
      </div>
    </div>
    <div class="moderation-note">
      Your comment is awaiting moderation.
    </div>
  `;

  if(replyToId){
    document
      .querySelector(`[data-id="${replyToId}"] .replies`)
      .insertAdjacentHTML("beforeend", commentHTML);
  } else {
    document
      .getElementById("comments")
      .insertAdjacentHTML("beforeend", commentHTML);
  }

  counter++;
  document.getElementById("name").value="";
  document.getElementById("email").value="";
  document.getElementById("commentText").value="";
  cancelReply();
}
