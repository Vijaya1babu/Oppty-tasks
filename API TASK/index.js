function toggleComments(){
  const section = document.getElementById("commentsSection");
  section.style.display = section.style.display === "block" ? "none" : "block";
}
function updateCommentCount(){
  const total = storedComments.filter(c => c.parent === null).length;
  document.getElementById("commentCount").innerText = total;
}


let replyToId = null;
let storedComments = JSON.parse(localStorage.getItem("comments") || "[]");


const commentsList = document.getElementById("commentsList");
const commentText = document.getElementById("commentText");
const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const error = document.getElementById("error");
const formTitle = document.getElementById("formTitle");
const cancelReplyBtn = document.getElementById("cancelReply");
const filterInput = document.getElementById("filterInput");

// Initialize
loadComments();

// Add suggestion text
function addSuggestion(text){
  commentText.value += (commentText.value ? " " : "") + text;
}

// Speech recognition
let recognition;
if("webkitSpeechRecognition" in window){
  recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.onresult = e => {
    commentText.value += " " + e.results[0][0].transcript;
  };
}
function startSpeech(btn){
  if(!recognition){alert("Speech not supported"); return;}
  btn.classList.add("listening");
  recognition.start();
  recognition.onend = () => btn.classList.remove("listening");
}

// Submit comment with location
function submitComment(){
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const text = commentText.value.trim();
  error.innerText = "";

  if(!name || !email || !text){
    error.innerText = "All fields are required";
    return;
  }


  let city = "Unknown";
  let country = "Unknown";

 
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(pos => {
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`)
      .then(res => res.json())
      .then(data => {
        if(data.address){
          city = data.address.city || data.address.town || data.address.village || "Unknown";
          country = data.address.country || "Unknown";
        }
        saveComment(name, email, text, city, country);
      })
      .catch(_ => saveComment(name, email, text, city, country));
    }, _ => saveComment(name, email, text, city, country));
  } else {
    saveComment(name, email, text, city, country);
  }
}

function saveComment(name, email, text, city, country){
  storedComments.push({
    id: Date.now(),
    name, email, text,
    date: new Date().toLocaleString(),
    parent: replyToId,
    likes: 0,
    city, country
  });

  localStorage.setItem("comments", JSON.stringify(storedComments));
  replyToId = null;
  formTitle.innerText = "Post a Comment";
  cancelReplyBtn.style.display = "none";
  nameInput.value = emailInput.value = commentText.value = "";
  loadComments();
}

// Load comments
function loadComments(){
  commentsList.innerHTML = "";

  storedComments.forEach(c => {
    commentsList.insertAdjacentHTML("beforeend", `
      <div class="comment-box" data-id="${c.id}">
        <div class="avatar"><i class="fa-solid fa-circle-user"></i></div>
        <div class="comment-content">
          <h4>${c.name}</h4>
          <div class="meta">${c.date} | ${c.city}, ${c.country}</div>
          <div class="comment-text">${c.text}</div>
          <div class="actions">
            <span onclick="likeComment(${c.id})">👍 <span id="like-${c.id}">${c.likes}</span></span>
            <span onclick="editComment(${c.id})">✏️</span>
            <span onclick="deleteComment(${c.id})">🗑️</span>
            <span onclick="setReply(${c.id})">Reply</span>
          </div>
        </div>
      </div>
    `);
  });

  updateCommentCount(); 
}


// Like, edit, delete, reply
function likeComment(id){
  const c = storedComments.find(x => x.id === id);
  c.likes++;
  localStorage.setItem("comments", JSON.stringify(storedComments));
  document.getElementById("like-"+id).innerText = c.likes;
}

function editComment(id){
  const c = storedComments.find(x => x.id === id);
  const div = document.querySelector(`[data-id="${id}"] .comment-text`);
  div.innerHTML = `<textarea id="edit-${id}">${c.text}</textarea><button onclick="saveEdit(${id})">Save</button>`;
}

function saveEdit(id){
  const val = document.getElementById("edit-"+id).value.trim();
  if(!val) return;
  storedComments.find(x=>x.id===id).text = val;
  localStorage.setItem("comments", JSON.stringify(storedComments));
  loadComments();
}

function deleteComment(id){
  if(!confirm("Delete this comment?")) return;
  storedComments = storedComments.filter(c => c.id !== id && c.parent !== id);
  localStorage.setItem("comments", JSON.stringify(storedComments));
  loadComments();
}

function setReply(id){
  replyToId = id;
  formTitle.innerText = "Reply to Comment";
  cancelReplyBtn.style.display = "inline";
}

function cancelReply(){
  replyToId = null;
  formTitle.innerText = "Post a Comment";
  cancelReplyBtn.style.display = "none";
}

// Filter comments
function filterComments(){
  const t = filterInput.value.toLowerCase();
  document.querySelectorAll(".comment-box").forEach(c=>{
    c.style.display = c.innerText.toLowerCase().includes(t) ? "flex" : "none";
  });
}

