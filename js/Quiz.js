import { questionArr } from "./data.js";

export default class Quiz {
  constructor(user) {
    this.state = {
      index: 0,
      wrong: 0,
      correct: 0,
      noQuestions: 10,
      finish: false,
      score: 0,
      name: user,
      quizData: shuffle(questionArr),
      time: 60 * 5
    };
    this.state.clock = setInterval(() => {
      let clockBox = document.getElementById("clock");
      clockBox.innerHTML = `<span class="info-item" id="clock">
                <i class="material-icons">alarm</i> ${Math.floor(
                  this.state.time / 60
                )}:${this.state.time % 60}
              </span>`;
      this.state.time--;
    }, 1000);
    setTimeout(() => {
      clearInterval(this.state.clock);
      let newState = this.state;
      newState.finish = true;
      this.setState(newState);
    }, 1000 * 60 * 5);
  }

  setState(state) {
    this.state = state;
    this.render();
  }

  render() {
    this.renderNav();
    let container = document.querySelector(".container");
    container.innerHTML = "";
    var checkBtnState =
      this.state.quizData[this.state.index].checked ||
      this.state.quizData[this.state.index].marked === null
        ? "disabled"
        : "";
    var prevBtnState = !this.state.index ? "disabled" : "";
    var nextBtnState =
      this.state.index === this.state.noQuestions - 1 ? "disabled" : "";

    let imageStr =
      this.state.quizData[this.state.index].image != ""
        ? `<img src="${
            this.state.quizData[this.state.index].image
          }" alt="Question Img" class="question-img" />`
        : "";

    let quizBox = document.createElement("div");
    quizBox.className = "quiz-box shadow";
    let checkedStyle =
      this.state.quizData[this.state.index].status != null
        ? this.state.quizData[this.state.index].status
          ? "background: rgb(79, 240, 133);"
          : "background: rgb(240, 79, 79)"
        : "";
    quizBox.style = checkedStyle;

    quizBox.innerHTML = `<div class="quiz-header">
              <span class="info-item">
                <i class="material-icons large">check</i> ${
                  this.state.correct
                } Correct</span
              >
              <span class="info-item">
                <i class="material-icons">close</i> ${
                  this.state.wrong
                } Wrong</span
              >
              <span class="info-item" id="clock">
                <i class="material-icons">alarm</i> ${Math.floor(
                  this.state.time / 60
                )}:${this.state.time % 60}
              </span>
            </div>
            <div class="question-card low-shadow ${
              this.state.quizData[this.state.index].checked && "shake"
            }">
              <span class="question-info">Question ${this.state.index + 1} ( ${
      this.state.noQuestions - this.state.index - 1
    } remaining )</span>
              <div class="question">
                ${this.state.quizData[this.state.index].question}
              </div>
              ${imageStr}
              <span class="question-info">Answer Options</span>
              ${this.getOptions()}
            </div>
            <div class="btn-box">
              <button class="btn-2 med-shadow" id="previous" ${prevBtnState}>Previous</button>
              <button class="btn-2 med-shadow" id="check" ${checkBtnState}>Check</button>
              <button class="btn-2 med-shadow" id="next" ${nextBtnState}>Next</button>
            </div>`;
    quizBox = this.handleFinish(quizBox);
    container.appendChild(quizBox);
    this.handleClicks();
    this.handleBtns();
  }

  renderNav() {
    let box = document.getElementById("question-nav");
    let utility = document.getElementById("nav-utility");
    utility.classList.contains("hidden")
      ? utility.classList.remove("hidden")
      : "";
    let list = document.createElement("ul");
    list.className = "nav med-shadow";
    box.innerHTML = "";
    list.innerHTML = "";
    const wrongStyle = "background:rgb(240, 79, 79)";
    const rightStyle = "background: rgb(79, 240, 133);";
    const markedStyle = "background:#1b1b2f";

    for (var i = 0; i < this.state.noQuestions; i++) {
      let style = this.state.quizData[i].checked
        ? this.state.quizData[i].status
          ? rightStyle
          : wrongStyle
        : this.state.quizData[i].marked != null
        ? markedStyle
        : "";
      list.innerHTML += `<li class="nav-item" style="${style}">${i + 1}</li>`;
    }
    box.appendChild(list);
    var items = list.querySelectorAll(".nav-item");
    items.forEach(item => {
      item.addEventListener("click", e => {
        var index = Number.parseInt(e.target.innerHTML);
        this.moveToQuestion(index - 1);
      });
    });
  }

  handleClicks() {
    var options = document.querySelectorAll(".option-box");
    options.forEach(option => {
      option.addEventListener("click", event => {
        this.markOption(event, option.children[0].id);
      });
    });
  }

  handleFinish(quizBox) {
    if (this.state.finish) {
      quizBox.innerHTML = ``;
      quizBox.innerHTML += `<div class="quiz-header">
              <span class="info-item">
                <i class="material-icons large">check</i> ${
                  this.state.correct
                } Correct</span
              >
              <span class="info-item">
                <i class="material-icons">close</i> ${
                  this.state.wrong
                } Wrong</span
              >
              <span class="info-item" id="clock">
                <i class="material-icons">alarm</i> ${Math.floor(
                  this.state.time / 60
                )}:${this.state.time % 60}
              </span>
            </div>`;
      quizBox.style = "";
      quizBox.innerHTML += `<div class="question-card low-shadow">
      <span class="question-info">Quiz Finished</span>
      <div class="question">Your Name: ${this.state.name}</div>
      <div class="question">Your Score: ${this.state.score}</div>
      </div >`;
      return quizBox;
    } else {
      return quizBox;
    }
  }

  handleBtns() {
    document.getElementById("previous").addEventListener("click", () => {
      this.moveToQuestion(this.state.index - 1);
    });
    document.getElementById("check").addEventListener("click", () => {
      this.checkAnswer();
    });
    document.getElementById("next").addEventListener("click", () => {
      this.moveToQuestion(this.state.index + 1);
    });
  }

  getOptions() {
    let activeStyle = "background:#e43f5a;color:white";
    const correctAnswer = this.state.quizData[this.state.index].checked
      ? "background: linear-gradient(90deg, rgba(42,154,62,1) 28%, rgba(0,255,178,1) 76%);color:white;"
      : "";
    const wrongAnswer = this.state.quizData[this.state.index].checked
      ? "background: linear-gradient(90deg, rgba(255,57,57,1) 22%, rgba(255,131,0,1) 83%);"
      : "";
    let str = `<div class="answers">`;
    this.state.quizData[this.state.index].options.forEach((option, index) => {
      let normalStyle = "";
      if (
        option === this.state.quizData[this.state.index].answer &&
        this.state.quizData[this.state.index].checked
      ) {
        activeStyle = correctAnswer;
        normalStyle = correctAnswer;
      } else if (this.state.quizData[this.state.index].checked) {
        activeStyle = wrongAnswer;
      }
      str += `<div class="option-box" style="${
        this.state.quizData[this.state.index].marked == index
          ? activeStyle
          : normalStyle
      }">
        <input type="radio" name="answer" id="${
          (this.state.index, index)
        }" class="answer-option" />
        <span class="option-number">${index + 1}</span>
        <label for="${(this.state.index, index)}" class="answer-label">
          ${option}
        </label>
      </div>`;
    });
    str += `</div>`;
    return str;
  }

  markOption(event, id) {
    if (this.state.quizData[this.state.index].checked) {
      return;
    }
    var newState = this.state;
    newState.quizData[newState.index].marked = id;
    this.setState(newState);
  }

  checkAnswer() {
    let newState = this.state;
    let ques = newState.quizData[this.state.index];
    if (ques.checked || ques.marked === null) {
      return;
    }
    if (ques.options[ques.marked] == ques.answer) {
      newState.correct++;
      ques.checked = true;
      ques.status = true;
    } else {
      newState.wrong++;
      ques.checked = true;
      ques.status = false;
    }
    if (newState.wrong + newState.correct === newState.noQuestions) {
      clearInterval(this.state.clock);
      newState.finish = true;
      newState.score =
        (newState.correct / newState.noQuestions) * newState.time;
    }
    this.setState(newState);
  }

  moveToQuestion(no) {
    let newState = this.state;
    newState.index = no;
    this.setState(newState);
  }
}

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
