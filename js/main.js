import Quiz from "./Quiz.js";

document.getElementById("input-form").addEventListener("submit", e => {
  e.preventDefault();
  const user = document.getElementById("playername").value;
  let quizObj = new Quiz(user);
  quizObj.render();
});
