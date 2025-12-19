const paragraphs = [
  "JavaScript is a powerful and flexible programming language that is widely used in modern web development. It allows developers to create dynamic and interactive user interfaces by responding to user actions such as clicks, typing, and scrolling. Along with HTML and CSS, JavaScript forms the core foundation of front end development.",

  "Typing speed tests are designed to help users improve both speed and accuracy over time. Regular practice strengthens muscle memory, reduces typing errors, and increases productivity in daily computer tasks.",

  "Web development involves HTML for structure, CSS for styling, and JavaScript for functionality. A successful website focuses on user experience, performance, and accessibility across different devices and screen sizes.",

  "Consistent typing practice improves words per minute while maintaining accuracy. Starting slowly helps build confidence and correct finger placement, which leads to better typing performance.",

  "Front end development focuses on creating visually appealing and user friendly interfaces that improve interaction and engagement while ensuring fast performance and responsiveness."
];

let timeLeft;
let timer;

const paragraph = document.getElementById("paragraph");
const input = document.getElementById("input");
const timeDisplay = document.getElementById("time");
const result = document.getElementById("result");
const timeSelect = document.getElementById("timeSelect");

function startTest() {
  timeLeft = Number(timeSelect.value);
  timeDisplay.innerText = timeLeft;

  paragraph.innerText =
    paragraphs[Math.floor(Math.random() * paragraphs.length)];

  input.value = "";
  input.disabled = false;
  input.focus();
  result.innerHTML = "";

  clearInterval(timer);
  timer = setInterval(updateTime, 1000);
}

function updateTime() {
  if (timeLeft > 0) {
    timeLeft--;
    timeDisplay.innerText = timeLeft;
  } else {
    endTest();
  }
}

function endTest() {
  clearInterval(timer);
  input.disabled = true;

  const typedText = input.value.trim();
const originalText = paragraph.innerText;

let correct = 0;
for (let i = 0; i < typedText.length; i++) {
  if (typedText[i] === originalText[i]) {
    correct++;
  }
}

const wordsTyped = typedText === "" ? 0 : typedText.split(/\s+/).length;
const minutes = timeSelect.value / 60;

const wpm = wordsTyped === 0 ? 0 : Math.round(wordsTyped / minutes);
const accuracy = typedText.length === 0
  ? 0
  : Math.round((correct / typedText.length) * 100);



  let grade = "Needs Practice";
  let gradeIcon = "fa-book";

  if (wpm >= 60 && accuracy >= 90) {
    grade = "Excellent";
    gradeIcon = "fa-trophy";
  } else if (wpm >= 40 && accuracy >= 80) {
    grade = "Good";
    gradeIcon = "fa-thumbs-up";
  } else if (wpm >= 25 && accuracy >= 70) {
    grade = "Average";
    gradeIcon = "fa-face-smile";
  }

  result.innerHTML = `
    <i class="fa-solid fa-clock"></i> <b>Time:</b> ${timeSelect.value} sec <br>
    <i class="fa-solid fa-gauge-high"></i> <b>WPM:</b> ${wpm} <br>
    <i class="fa-solid fa-bullseye"></i> <b>Accuracy:</b> ${accuracy}% <br>
    <i class="fa-solid ${gradeIcon}"></i> <b>Grade:</b> ${grade} <br>
    <i class="fa-solid fa-check"></i> <b>Correct Characters:</b> ${correct} <br>
    <i class="fa-solid fa-xmark"></i> <b>Wrong Characters:</b> ${typedText.length - correct}
  `;
}

function resetTest() {
  clearInterval(timer);
  input.value = "";
  input.disabled = true;
  timeDisplay.innerText = 0;
  result.innerHTML = "";
  paragraph.innerText = "";
}
