import Quiz from "./Quiz.js";

document.getElementById("input-form").addEventListener("submit", e => {
  e.preventDefault();
  const user = document.getElementById("playername").value;
  let quizObj = new Quiz(user);
  quizObj.render();
});

document.getElementById("playername").addEventListener("input", e => {
  let btn = document.getElementById("subbtn");
  if (document.getElementById("playername").value == "") {
    btn.disabled = true;
    btn.innerHTML = "Enter Name";
  } else {
    btn.disabled = false;
    btn.innerHTML = "Play";
  }
});
